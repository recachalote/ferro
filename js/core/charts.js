/* =========================================================
   FERRO — gráficos em canvas
   ========================================================= */
(function () {
  'use strict';
  var F = (window.Ferro = window.Ferro || {});
  var U = F.u;
  var CH = (F.chart = {});
  var DPR = Math.min(window.devicePixelRatio || 1, 3);

  function cssVar(name, fallback) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    } catch (e) { return fallback; }
  }
  function colors() {
    return {
      txt: cssVar('--txt', '#F3F5F7'),
      txt2: cssVar('--txt-2', '#A2AAB6'),
      txt3: cssVar('--txt-3', '#6C7481'),
      line: cssVar('--line', '#282D36'),
      card: cssVar('--card', '#14171C'),
      accent: cssVar('--accent', '#C9F45A'),
    };
  }
  function compact(v) {
    var n = Number(v) || 0;
    var a = Math.abs(n);
    if (a >= 1000000) return U.num(n / 1000000, 1) + 'M';
    if (a >= 10000) return U.num(n / 1000, 1) + 'k';
    if (a >= 1000) return U.num(n / 1000, a % 1000 === 0 ? 0 : 1) + 'k';
    return U.num(n, a % 1 ? 1 : 0);
  }
  CH.compact = compact;

  function prep(canvas) {
    var box = canvas.parentElement;
    if (!box) return null;
    var w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return null;
    canvas.width = Math.round(w * DPR);
    canvas.height = Math.round(h * DPR);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { w: w, h: h, ctx: ctx };
  }

  function ensureTip(canvas) {
    var box = canvas.parentElement;
    var tip = box.querySelector('.chart-tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'chart-tip';
      box.appendChild(tip);
    }
    return tip;
  }

  function smoothPath(ctx, pts, tension) {
    if (!pts.length) return;
    ctx.moveTo(pts[0].x, pts[0].y);
    var t = tension == null ? 0.85 : tension;
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[i + 2] || p2;
      var cp1x = p1.x + (p2.x - p0.x) / 6 * t;
      var cp1y = p1.y + (p2.y - p0.y) / 6 * t;
      var cp2x = p2.x - (p3.x - p1.x) / 6 * t;
      var cp2y = p2.y - (p3.y - p1.y) / 6 * t;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
  }

  /* ---------- linha ---------- */
  CH.line = function (canvas, opts) {
    canvas._opts = opts;
    if (!canvas._rb) {
      canvas._rb = true;
      if (window.ResizeObserver) {
        var ro = new ResizeObserver(function () { CH.line(canvas, canvas._opts); });
        ro.observe(canvas.parentElement);
      }
      canvas.addEventListener('pointermove', function (e) {
        var pts = canvas._pts;
        if (!pts || !pts.length) return;
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var best = 0, bd = Infinity;
        for (var i = 0; i < pts.length; i++) {
          var d = Math.abs(pts[i].x - x);
          if (d < bd) { bd = d; best = i; }
        }
        var p = pts[best];
        var tip = ensureTip(canvas);
        var o = canvas._opts || {};
        var label = p.d.label || '';
        var val = (o.yFmt ? o.yFmt(p.d.y) : U.num(p.d.y, 0)) + (o.unit ? ' ' + o.unit : '');
        tip.innerHTML = (label ? '<div style="color:var(--txt-3);font-size:10px;font-weight:600">' + U.esc(label) + '</div>' : '') + '<span class="tv">' + val + '</span>';
        var tw = tip.offsetWidth || 60;
        var left = U.clamp(p.x, tw / 2 + 4, (canvas.clientWidth || 0) - tw / 2 - 4);
        tip.style.left = left + 'px';
        tip.style.top = Math.max(14, p.y) + 'px';
        tip.classList.add('on');
        canvas._hover = best;
        CH.line(canvas, canvas._opts);
      });
      canvas.addEventListener('pointerleave', function () {
        canvas._hover = -1;
        var tip = canvas.parentElement.querySelector('.chart-tip');
        if (tip) tip.classList.remove('on');
        CH.line(canvas, canvas._opts);
      });
    }
    var data = (opts && opts.data) || [];
    var p = prep(canvas);
    if (!p || !data.length) { canvas._pts = []; return; }
    var ctx = p.ctx, c = colors();
    var W = p.w, H = p.h;
    var padL = opts.padL == null ? 38 : opts.padL;
    var padR = 10, padT = 12, padB = 20;
    var iw = Math.max(10, W - padL - padR), ih = Math.max(10, H - padT - padB);

    var ys = data.map(function (d) { return Number(d.y) || 0; });
    var min = Math.min.apply(null, ys), max = Math.max.apply(null, ys);
    if (opts.zeroBase) min = Math.min(0, min);
    if (max === min) { max = min + (Math.abs(min) * 0.1 || 1); min = min - (Math.abs(min) * 0.1 || 1); }
    var span = max - min;
    min = min - span * 0.08;
    max = max + span * 0.12;
    if (opts.zeroBase) min = Math.max(0, min);

    var xOf = function (i) { return padL + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw); };
    var yOf = function (v) { return padT + ih - ((v - min) / (max - min)) * ih; };

    // grelha
    ctx.save();
    ctx.strokeStyle = c.line;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    for (var g = 0; g < 3; g++) {
      var yy = padT + (ih / 2) * g;
      ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(W - padR, yy); ctx.stroke();
    }
    ctx.restore();

    // labels Y
    ctx.fillStyle = c.txt3;
    ctx.font = '500 9px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (var g2 = 0; g2 < 3; g2++) {
      var val = max - ((max - min) / 2) * g2;
      var yy2 = padT + (ih / 2) * g2;
      ctx.fillText(compact(val), padL - 7, yy2);
    }

    // pontos
    var pts = data.map(function (d, i) { return { x: xOf(i), y: yOf(Number(d.y) || 0), d: d }; });
    canvas._pts = pts;

    var stroke = opts.color || c.accent;
    // área
    if (opts.fill !== false && data.length > 1) {
      var grad = ctx.createLinearGradient(0, padT, 0, padT + ih);
      grad.addColorStop(0, hexA(stroke, 0.30));
      grad.addColorStop(1, hexA(stroke, 0.01));
      ctx.beginPath();
      smoothPath(ctx, pts);
      ctx.lineTo(pts[pts.length - 1].x, padT + ih);
      ctx.lineTo(pts[0].x, padT + ih);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }
    // linha
    ctx.beginPath();
    smoothPath(ctx, pts);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2.4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();

    // pontos
    var showAll = data.length <= 14;
    pts.forEach(function (pp, i) {
      var isLast = i === data.length - 1;
      var isHover = canvas._hover === i;
      if (!showAll && !isLast && !isHover) return;
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, isHover ? 5 : isLast ? 4.2 : 2.8, 0, Math.PI * 2);
      ctx.fillStyle = isLast || isHover ? stroke : c.card;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = stroke;
      ctx.stroke();
    });
    if (pts.length) {
      var last = pts[pts.length - 1];
      ctx.beginPath();
      ctx.arc(last.x, last.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = hexA(stroke, 0.16);
      ctx.fill();
    }

    // labels X
    ctx.fillStyle = c.txt3;
    ctx.font = '500 9px -apple-system,BlinkMacSystemFont,Segoe UI,sans-serif';
    ctx.textBaseline = 'top';
    var labels = opts.xLabels || [];
    var count = Math.min(labels.length, 4);
    if (count) {
      var idxs = count === 1 ? [0] : [0, Math.round((labels.length - 1) / 2), labels.length - 1];
      if (count >= 4) idxs = [0, Math.round(labels.length / 3), Math.round((labels.length - 1) * 2 / 3), labels.length - 1];
      idxs = U.uniqBy(idxs, function (x) { return x; });
      idxs.forEach(function (i, k) {
        if (i < 0 || i >= labels.length) return;
        ctx.textAlign = k === 0 ? 'left' : k === idxs.length - 1 ? 'right' : 'center';
        var xx = k === 0 ? padL : k === idxs.length - 1 ? W - padR : xOf(i);
        ctx.fillText(labels[i], xx, padT + ih + 7);
      });
    }
    if (opts.axis === false) {
      // nada
    }
  };

  function hexA(hex, alpha) {
    var h = String(hex || '#C9F45A').replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }
  CH.hexA = hexA;

  /* ---------- sparkline ---------- */
  CH.spark = function (canvas, values, color) {
    var p = prep(canvas);
    if (!p) return;
    var ctx = p.ctx, c = colors();
    var data = (values || []).filter(function (v) { return v != null && !isNaN(v); });
    if (data.length < 2) return;
    var W = p.w, H = p.h, pad = 2;
    var min = Math.min.apply(null, data), max = Math.max.apply(null, data);
    if (max === min) { max += 1; min -= 1; }
    var pts = data.map(function (v, i) {
      return { x: pad + (i / (data.length - 1)) * (W - pad * 2), y: pad + (1 - (v - min) / (max - min)) * (H - pad * 2) };
    });
    var stroke = color || c.accent;
    ctx.beginPath();
    smoothPath(ctx, pts, 0.7);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.8;
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.stroke();
    var last = pts[pts.length - 1];
    ctx.beginPath(); ctx.arc(last.x, last.y, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = stroke; ctx.fill();
  };

  /* ---------- anel ---------- */
  CH.ringHTML = function (pct, size, color, label, sub) {
    var s = size || 96, r = (s / 2) - 5, cx = s / 2, cy = s / 2;
    var circ = 2 * Math.PI * r;
    var p = U.clamp(Number(pct) || 0, 0, 100);
    var off = circ - (p / 100) * circ;
    return '<div class="ring" style="width:' + s + 'px;height:' + s + 'px">' +
      '<svg viewBox="0 0 ' + s + ' ' + s + '">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="var(--card-3)" stroke-width="7"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + (color || 'var(--accent)') + '" stroke-width="7" stroke-linecap="round" stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' +
      '</svg>' +
      '<div class="rv"><b>' + (label == null ? Math.round(p) : label) + '</b>' + (sub ? '<span>' + U.esc(sub) + '</span>' : '') + '</div>' +
      '</div>';
  };
  CH.ring = function (el, pct, size, color, label, sub) {
    if (!el) return;
    el.innerHTML = CH.ringHTML(pct, size, color, label, sub);
  };

  /* ---------- barras (mini) ---------- */
  CH.barsHTML = function (items, max) {
    var m = max || Math.max.apply(null, items.map(function (i) { return i.value; }).concat([1]));
    return items.map(function (i) {
      var pct = Math.round((i.value / m) * 100);
      return '<div class="bar-row"><div class="bar-name">' + (i.dot ? '<span class="muscle-dot" style="background:' + i.dot + '"></span>' : '') + U.esc(i.label) + '</div>' +
        '<div class="bar-track"><div class="bar-fill ' + (i.cls || '') + '" style="width:' + pct + '%;background:' + (i.color || '') + '"></div></div>' +
        '<div class="bar-val">' + (i.display || U.num(i.value, 0)) + '</div></div>';
    }).join('');
  };
})();
