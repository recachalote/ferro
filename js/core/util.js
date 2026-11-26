/* =========================================================
   FERRO — utilitários
   ========================================================= */
(function () {
  'use strict';
  var F = (window.Ferro = window.Ferro || {});
  F.views = F.views || {};
  var U = (F.u = {});

  /* ---------- DOM ---------- */
  U.$ = function (sel, root) { return (root || document).querySelector(sel); };
  U.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  U.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  U.svg = function (name, cls) {
    return '<svg class="ic ' + (cls || '') + '" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
  };
  U.icon = U.svg;

  /* ---------- IDs ---------- */
  var idSeq = 0;
  U.uid = function (prefix) {
    idSeq = (idSeq + 1) % 1296;
    return (prefix || 'id') + '_' + Date.now().toString(36) + idSeq.toString(36) + Math.random().toString(36).slice(2, 5);
  };
  U.slug = function (s) {
    return String(s || '')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70);
  };

  /* ---------- numbers ---------- */
  U.clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };
  U.round = function (v, dec) { var m = Math.pow(10, dec || 0); return Math.round((Number(v) || 0) * m) / m; };
  U.num = function (n, dec) {
    if (n == null || n === '' || isNaN(Number(n))) return '—';
    return Number(n).toLocaleString('pt-PT', {
      minimumFractionDigits: dec || 0,
      maximumFractionDigits: dec == null ? 0 : dec,
    });
  };
  U.int = function (n) {
    if (n == null || isNaN(Number(n))) return '—';
    return Number(n).toLocaleString('pt-PT', { maximumFractionDigits: 0 });
  };
  U.pct = function (part, total) { return total ? Math.round((part / total) * 100) : 0; };
  U.sum = function (arr, fn) {
    return arr.reduce(function (a, b) { return a + (fn ? Number(fn(b)) || 0 : Number(b) || 0); }, 0);
  };
  U.avg = function (arr, fn) { return arr.length ? U.sum(arr, fn) / arr.length : 0; };
  U.median = function (arr) {
    if (!arr.length) return 0;
    var s = arr.slice().sort(function (a, b) { return a - b; });
    var m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };
  U.maxBy = function (arr, fn) {
    var best = null, bv = -Infinity;
    arr.forEach(function (x) { var v = fn(x); if (v > bv) { bv = v; best = x; } });
    return best;
  };
  U.sumBy = U.sum;

  /* ---------- strings ---------- */
  U.norm = function (s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  };
  U.cap = function (s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); };
  U.plural = function (n, one, many) { return n === 1 ? one : (many || one + 's'); };
  U.truncate = function (s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  U.initials = function (name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'EU';
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  };

  /* ---------- dates ---------- */
  var MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var MONTHS_S = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  var DAYS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  var DAYS_S = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  U.MONTHS = MONTHS; U.MONTHS_S = MONTHS_S; U.DAYS = DAYS; U.DAYS_S = DAYS_S;

  U.parse = function (d) {
    if (d instanceof Date) return new Date(d.getTime());
    if (typeof d === 'number') return new Date(d);
    if (!d) return new Date();
    var s = String(d);
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    return new Date(s);
  };
  U.dateKey = function (d) {
    var x = U.parse(d);
    return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
  };
  U.todayKey = function () { return U.dateKey(new Date()); };
  U.now = function () { return new Date().toISOString(); };
  U.startOfDay = function (d) { var x = U.parse(d); x.setHours(0, 0, 0, 0); return x; };
  U.addDays = function (d, n) { var x = U.parse(d); x.setDate(x.getDate() + n); return x; };
  U.addMonths = function (d, n) { var x = U.parse(d); var day = x.getDate(); x.setDate(1); x.setMonth(x.getMonth() + n); var last = new Date(x.getFullYear(), x.getMonth() + 1, 0).getDate(); x.setDate(Math.min(day, last)); return x; };
  U.startOfWeek = function (d, firstDay) {
    var fd = firstDay == null ? 1 : firstDay;
    var x = U.startOfDay(d);
    var diff = (x.getDay() - fd + 7) % 7;
    return U.addDays(x, -diff);
  };
  U.startOfMonth = function (d) { var x = U.startOfDay(d); x.setDate(1); return x; };
  U.endOfMonth = function (d) { var x = U.startOfDay(d); x.setMonth(x.getMonth() + 1, 0); return x; };
  U.diffDays = function (a, b) {
    var A = U.startOfDay(a).getTime(), B = U.startOfDay(b).getTime();
    return Math.round((A - B) / 86400000);
  };
  U.daysInMonth = function (d) { return U.endOfMonth(d).getDate(); };
  U.monthLabel = function (d) { var x = U.parse(d); return U.cap(MONTHS[x.getMonth()]) + ' ' + x.getFullYear(); };
  U.monthShort = function (d) { return MONTHS_S[U.parse(d).getMonth()]; };
  U.weekdayShort = function (d) { return DAYS_S[U.parse(d).getDay()]; };
  U.fmtDate = function (d, style) {
    var x = U.parse(d);
    if (style === 'long') return DAYS[x.getDay()] + ', ' + x.getDate() + ' de ' + MONTHS[x.getMonth()];
    if (style === 'full') return DAYS[x.getDay()] + ', ' + x.getDate() + ' de ' + MONTHS[x.getMonth()] + ' de ' + x.getFullYear();
    if (style === 'short') return x.getDate() + ' ' + MONTHS_S[x.getMonth()];
    if (style === 'numeric') return String(x.getDate()).padStart(2, '0') + '/' + String(x.getMonth() + 1).padStart(2, '0') + '/' + x.getFullYear();
    return x.getDate() + ' ' + MONTHS_S[x.getMonth()] + ' ' + x.getFullYear();
  };
  U.fmtDateKey = function (key, style) { return U.fmtDate(U.parse(key), style); };
  U.fmtTimeOfDay = function (d) {
    var x = U.parse(d);
    return String(x.getHours()).padStart(2, '0') + ':' + String(x.getMinutes()).padStart(2, '0');
  };
  /** "Hoje", "Ontem", "Há 3 dias", "12 nov" */
  U.relative = function (d) {
    var diff = U.diffDays(new Date(), d);
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Ontem';
    if (diff === -1) return 'Amanhã';
    if (diff > 1 && diff < 7) return 'Há ' + diff + ' dias';
    if (diff >= 7 && diff < 14) return 'Há 1 semana';
    if (diff >= 14 && diff < 60) return 'Há ' + Math.round(diff / 7) + ' semanas';
    return U.fmtDate(d, 'short');
  };
  U.fmtDuration = function (secs) {
    secs = Math.max(0, Math.round(Number(secs) || 0));
    var h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
    if (h) return h + 'h ' + String(m).padStart(2, '0') + 'm';
    if (m) return m + ' min';
    return s + ' s';
  };
  U.fmtClock = function (secs) {
    secs = Math.max(0, Math.round(Number(secs) || 0));
    var h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
    if (h) return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    return m + ':' + String(s).padStart(2, '0');
  };
  U.fmtElapsed = function (fromISO, toISO) {
    var end = toISO ? U.parse(toISO) : new Date();
    return Math.max(0, Math.floor((end - U.parse(fromISO)) / 1000));
  };
  U.weekLabel = function (d) { var s = U.startOfWeek(d); return U.fmtDate(s, 'short'); };

  /* ---------- misc ---------- */
  U.debounce = function (fn, ms) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  };
  U.throttle = function (fn, ms) {
    var last = 0, t;
    return function () {
      var args = arguments, ctx = this, now = Date.now();
      var wait = ms - (now - last);
      if (wait <= 0) { last = now; fn.apply(ctx, args); }
      else { clearTimeout(t); t = setTimeout(function () { last = Date.now(); fn.apply(ctx, args); }, wait); }
    };
  };
  U.groupBy = function (arr, fn) {
    var out = {};
    arr.forEach(function (x) {
      var k = fn(x);
      (out[k] = out[k] || []).push(x);
    });
    return out;
  };
  U.uniqBy = function (arr, fn) {
    var seen = {};
    return arr.filter(function (x) {
      var k = fn(x);
      if (seen[k]) return false;
      seen[k] = 1; return true;
    });
  };
  U.sortBy = function (arr, fn, dir) {
    var d = dir === 'desc' ? -1 : 1;
    return arr.slice().sort(function (a, b) { var x = fn(a), y = fn(b); return x < y ? -d : x > y ? d : 0; });
  };
  U.range = function (n) { var a = []; for (var i = 0; i < n; i++) a.push(i); return a; };
  U.clampText = U.truncate;
  U.haptic = function (ms) { try { if (navigator.vibrate) navigator.vibrate(ms || 8); } catch (e) {} };
  U.isStandalone = function () {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  };
  U.isIOS = function () {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  /* ---------- clipboard / files ---------- */
  U.copy = async function (text) {
    try {
      if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); return true; }
    } catch (e) {}
    try {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  };
  U.download = function (filename, content, mime) {
    try {
      var blob = content instanceof Blob ? content : new Blob([content], { type: mime || 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1200);
      return true;
    } catch (e) { return false; }
  };
  U.pickFile = function (accept) {
    return new Promise(function (resolve) {
      var input = document.createElement('input');
      input.type = 'file'; input.accept = accept || 'application/json';
      input.style.display = 'none';
      document.body.appendChild(input);
      input.addEventListener('change', function () {
        resolve(input.files && input.files[0] ? input.files[0] : null);
        setTimeout(function () { input.remove(); }, 500);
      });
      input.click();
    });
  };
  U.readText = function (file) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(String(r.result || '')); };
      r.onerror = reject;
      r.readAsText(file);
    });
  };
  U.blobToDataURL = function (blob) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(String(r.result || '')); };
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  };
  U.dataURLToBlob = function (dataUrl) {
    var parts = String(dataUrl).split(',');
    var mime = /:(.*?);/.exec(parts[0]);
    var bin = atob(parts[1] || '');
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime ? mime[1] : 'image/jpeg' });
  };

  /* ---------- image compression ---------- */
  U.compressImage = async function (file, maxDim, quality) {
    var max = maxDim || 1280, q = quality || 0.74;
    var url = URL.createObjectURL(file);
    try {
      var bitmap = null;
      if (window.createImageBitmap) {
        try { bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }); } catch (e) { bitmap = null; }
      }
      var w, h, src;
      if (bitmap) { src = bitmap; w = bitmap.width; h = bitmap.height; }
      else {
        var img = await new Promise(function (res, rej) {
          var im = new Image();
          im.onload = function () { res(im); };
          im.onerror = rej;
          im.src = url;
        });
        src = img; w = img.naturalWidth; h = img.naturalHeight;
      }
      var scale = Math.min(1, max / Math.max(w, h));
      var cw = Math.max(1, Math.round(w * scale)), ch = Math.max(1, Math.round(h * scale));
      var canvas = document.createElement('canvas');
      canvas.width = cw; canvas.height = ch;
      var ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(src, 0, 0, cw, ch);
      if (bitmap && bitmap.close) bitmap.close();
      var blob = await new Promise(function (res) { canvas.toBlob(res, 'image/jpeg', q); });
      return blob;
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  /* ---------- IndexedDB (fotos) ---------- */
  var idbPromise = null;
  function openDB() {
    if (idbPromise) return idbPromise;
    idbPromise = new Promise(function (resolve, reject) {
      if (!window.indexedDB) return reject(new Error('Sem IndexedDB'));
      var req = indexedDB.open('ferro-db', 1);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains('photos')) db.createObjectStore('photos', { keyPath: 'id' });
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
    return idbPromise;
  }
  function tx(mode, fn) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var t = db.transaction('photos', mode);
        var store = t.objectStore('photos');
        var result = fn(store);
        t.oncomplete = function () { resolve(result && result.__req ? result.__req.result : result); };
        t.onerror = function () { reject(t.error); };
        t.onabort = function () { reject(t.error); };
      });
    });
  }
  U.idb = {
    put: function (rec) {
      return tx('readwrite', function (s) { return { __req: s.put(rec) }; });
    },
    get: function (id) {
      return tx('readonly', function (s) { return { __req: s.get(id) }; });
    },
    del: function (id) {
      return tx('readwrite', function (s) { return { __req: s.delete(id) }; });
    },
    clear: function () {
      return tx('readwrite', function (s) { return { __req: s.clear() }; });
    },
  };
})();
