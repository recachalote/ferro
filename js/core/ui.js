/* =========================================================
   FERRO — componentes de interface
   ========================================================= */
(function () {
  'use strict';
  var F = (window.Ferro = window.Ferro || {});
  var U = F.u;
  var UI = (F.ui = {});
  var sheetCount = 0;

  /* ---------- toast ---------- */
  UI.toast = function (msg, type, ms) {
    var root = document.getElementById('toast-root');
    if (!root) return;
    var el = document.createElement('div');
    el.className = 'toast ' + (type === 'err' ? 'err' : '');
    el.innerHTML = U.svg(type === 'err' ? 'info' : type === 'warn' ? 'zap' : 'check') + '<span>' + U.esc(msg) + '</span>';
    root.appendChild(el);
    setTimeout(function () {
      el.classList.add('out');
      setTimeout(function () { el.remove(); }, 260);
    }, ms || 2600);
  };

  /* ---------- sheet ---------- */
  UI.sheet = function (opts) {
    opts = opts || {};
    var root = document.getElementById('overlay-root');
    if (!root) return null;
    var wrap = document.createElement('div');
    wrap.className = 'sheet-root';
    var footHtml = opts.foot ? '<div class="sheet-foot">' + opts.foot + '</div>' : '';
    var headHtml = opts.title ? '<div class="sheet-head"><div><div class="sheet-title">' + U.esc(opts.title) + '</div>' +
      (opts.sub ? '<div class="sheet-sub">' + U.esc(opts.sub) + '</div>' : '') + '</div>' +
      '<button class="sheet-close" data-sheet-close aria-label="Close">' + U.svg('x') + '</button></div>' : '';
    wrap.innerHTML = '<div class="sheet-backdrop"></div><div class="sheet-panel ' + (opts.tall ? 'tall' : '') + '">' +
      '<div class="sheet-grip"></div>' + headHtml +
      '<div class="sheet-body">' + (opts.body || '') + '</div>' + footHtml + '</div>';
    root.appendChild(wrap);
    var panel = wrap.querySelector('.sheet-panel');
    var body = wrap.querySelector('.sheet-body');

    function close(val) {
      if (wrap._closed) return;
      wrap._closed = true;
      wrap.classList.add('closing');
      wrap.classList.remove('open');
      sheetCount = Math.max(0, sheetCount - 1);
      if (!sheetCount) document.body.style.overflow = '';
      setTimeout(function () { wrap.remove(); }, 340);
      if (opts.onClose) opts.onClose(val);
    }
    wrap._close = close;

    wrap.querySelector('.sheet-backdrop').addEventListener('click', function () {
      if (opts.dismissible !== false) close();
    });
    wrap.querySelectorAll('[data-sheet-close]').forEach(function (b) {
      b.addEventListener('click', function () { close(); });
    });

    // arrastar para fechar
    var startY = 0, dy = 0, dragging = false;
    var dragArea = wrap.querySelector('.sheet-head') || wrap.querySelector('.sheet-grip');
    var onStart = function (e) {
      dragging = true; startY = e.touches ? e.touches[0].clientY : e.clientY; dy = 0;
      panel.style.transition = 'none';
    };
    var onMove = function (e) {
      if (!dragging) return;
      dy = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
      if (dy < 0) dy = dy * 0.2;
      panel.style.transform = 'translateY(' + dy + 'px)';
    };
    var onEnd = function () {
      if (!dragging) return;
      dragging = false;
      panel.style.transition = '';
      panel.style.transform = '';
      if (dy > 110) close();
    };
    [dragArea].forEach(function (el) {
      if (!el) return;
      el.addEventListener('touchstart', onStart, { passive: true });
      el.addEventListener('touchmove', onMove, { passive: true });
      el.addEventListener('touchend', onEnd);
      el.addEventListener('mousedown', onStart);
    });
    if (window) {
      window.addEventListener('mousemove', function (e) { if (dragging) onMove(e); });
      window.addEventListener('mouseup', onEnd);
    }

    sheetCount++;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { wrap.classList.add('open'); });

    var escHandler = function (e) { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', escHandler);
    var obs = new MutationObserver(function () {
      if (!document.body.contains(wrap)) {
        document.removeEventListener('keydown', escHandler);
        obs.disconnect();
      }
    });
    obs.observe(root, { childList: true });

    if (opts.onMount) opts.onMount({ root: wrap, body: body, close: close, panel: panel });
    return { root: wrap, body: body, close: close, panel: panel, setTitle: function (t) {
      var el = wrap.querySelector('.sheet-title');
      if (el) el.textContent = t;
    } };
  };

  /* ---------- confirm ---------- */
  UI.confirm = function (opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var done = false;
      var s = UI.sheet({
        title: opts.title || 'Confirm',
        body: '<p class="sub" style="font-size:14px;line-height:1.5">' + U.esc(opts.message || '') + '</p>',
        foot: '<button class="btn btn-soft" data-no>' + U.esc(opts.cancelText || 'Cancel') + '</button>' +
          '<button class="btn ' + (opts.danger ? 'btn-danger' : 'btn-primary') + '" data-yes>' + U.esc(opts.confirmText || 'Confirm') + '</button>',
        onClose: function () { if (!done) resolve(false); },
      });
      if (!s) return resolve(false);
      s.root.querySelector('[data-no]').addEventListener('click', function () { done = true; resolve(false); s.close(); });
      s.root.querySelector('[data-yes]').addEventListener('click', function () { done = true; resolve(true); s.close(); });
    });
  };

  /* ---------- prompt ---------- */
  UI.prompt = function (opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var done = false;
      var s = UI.sheet({
        title: opts.title || 'Edit',
        body: '<div class="field"><label class="label">' + U.esc(opts.label || 'Value') + '</label>' +
          (opts.multiline
            ? '<textarea class="textarea" data-input placeholder="' + U.esc(opts.placeholder || '') + '">' + U.esc(opts.value || '') + '</textarea>'
            : '<input class="input" data-input type="' + (opts.type || 'text') + '" inputmode="' + (opts.inputmode || 'text') + '" value="' + U.esc(opts.value || '') + '" placeholder="' + U.esc(opts.placeholder || '') + '">') +
          '</div>',
        foot: '<button class="btn btn-soft" data-no>Cancel</button><button class="btn btn-primary" data-yes>' + U.esc(opts.confirmText || 'Save') + '</button>',
        onClose: function () { if (!done) resolve(null); },
        onMount: function (x) {
          var inp = x.body.querySelector('[data-input]');
          setTimeout(function () { inp && inp.focus(); }, 250);
          inp && inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !opts.multiline) { e.preventDefault(); ok(); } });
        },
      });
      if (!s) return resolve(null);
      function ok() { done = true; var v = s.root.querySelector('[data-input]').value; resolve(v); s.close(); }
      s.root.querySelector('[data-no]').addEventListener('click', function () { done = true; resolve(null); s.close(); });
      s.root.querySelector('[data-yes]').addEventListener('click', ok);
    });
  };

  /* ---------- action sheet ---------- */
  UI.actions = function (opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var done = false;
      var body = '<div class="col gap-8">' + (opts.options || []).map(function (o, i) {
        return '<button class="item" data-i="' + i + '" style="justify-content:flex-start">' +
          (o.icon ? '<div class="item-thumb" style="' + (o.danger ? 'color:var(--danger)' : '') + '">' + U.svg(o.icon) + '</div>' : '') +
          '<div class="item-main"><div class="item-title" style="' + (o.danger ? 'color:var(--danger)' : '') + '">' + U.esc(o.label) + '</div>' +
          (o.sub ? '<div class="item-sub">' + U.esc(o.sub) + '</div>' : '') + '</div>' +
          '</button>';
      }).join('') + '</div>';
      var s = UI.sheet({
        title: opts.title || 'Options', body: body, sub: opts.sub,
        onClose: function () { if (!done) resolve(null); },
      });
      if (!s) return resolve(null);
      s.root.querySelectorAll('[data-i]').forEach(function (b) {
        b.addEventListener('click', function () {
          done = true;
          var v = opts.options[+b.getAttribute('data-i')].value;
          resolve(v);
          s.close();
        });
      });
    });
  };

  /* ---------- empty ---------- */
  UI.empty = function (o) {
    return '<div class="empty"><div class="empty-ic">' + U.svg(o.icon || 'sparkles') + '</div>' +
      '<div class="empty-t">' + U.esc(o.title) + '</div>' +
      '<div class="empty-s">' + U.esc(o.text || '') + '</div>' + (o.action || '') + '</div>';
  };

  /* ---------- nav head ---------- */
  UI.navHead = function (o) {
    return '<div class="nav-head">' +
      (o.back === false ? '<div></div>' : '<button class="icon-btn" data-nav="back" aria-label="Back">' + U.svg('left') + '</button>') +
      '<div><div class="nav-title">' + U.esc(o.title) + '</div>' + (o.sub ? '<div class="nav-sub">' + U.esc(o.sub) + '</div>' : '') + '</div>' +
      '<div style="justify-self:end">' + (o.right || '') + '</div>' +
      '</div>';
  };

  UI.muscleDot = function (m) {
    return '<span class="muscle-dot" style="background:' + F.calc.muscle(m).color + '"></span>';
  };
  UI.muscleLabel = function (m) { return F.calc.muscle(m).label; };
  UI.repsText = function (reps) { return reps == null || reps === '' ? '—' : String(reps); };

  /* ---------- seletor de exercício ---------- */
  UI.pickExercise = function (opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var q = '', muscle = '', equipment = '', onlyFav = false;
      var picked = false;
      var sheet = UI.sheet({
        title: opts.title || 'Choose exercise',
        tall: true,
        body:
          '<div style="position:sticky;top:-16px;background:var(--bg-2);padding:2px 0 8px;z-index:3">' +
          '<div class="search-bar">' + U.svg('search') + '<input class="input" id="pk-q" placeholder="Search 234 exercises…" autocomplete="off" autocapitalize="off"></div>' +
          '<div class="chips" id="pk-muscles" style="margin-top:8px"></div>' +
          '<div class="row gap-8" style="margin-top:8px">' +
          '<select class="input sm" id="pk-equip" style="flex:1"><option value="">All equipment</option>' +
          Object.keys(F.calc.EQUIP).map(function (k) { return '<option value="' + k + '">' + F.calc.EQUIP[k] + '</option>'; }).join('') +
          '</select>' +
          '<button class="chip' + (opts.favorites ? ' on' : '') + '" id="pk-fav">' + U.svg('star') + 'Favorites</button>' +
          '</div></div>' +
          '<div class="list" id="pk-list" style="margin-top:10px"></div>',
        foot: '<button class="btn btn-soft btn-block" id="pk-create">' + U.svg('plus') + 'Create exercise</button>',
        onClose: function () { if (!picked) resolve(null); },
      });
      if (!sheet) return resolve(null);

      function renderChips() {
        var list = F.calc.MUSCLE_ORDER.filter(function (m) { return F.calc.MUSCLES[m]; });
        sheet.body.querySelector('#pk-muscles').innerHTML =
          '<button class="chip' + (!muscle ? ' on' : '') + '" data-m="">All</button>' +
          list.map(function (m) {
            return '<button class="chip' + (muscle === m ? ' on' : '') + '" data-m="' + m + '">' +
              '<span class="muscle-dot" style="background:' + F.calc.muscle(m).color + '"></span>' + F.calc.muscle(m).label + '</button>';
          }).join('');
      }
      function renderList() {
        var res = F.db.searchExercises(q, { muscle: muscle, equipment: equipment, favorites: onlyFav });
        var el = sheet.body.querySelector('#pk-list');
        if (!res.length) {
          el.innerHTML = UI.empty({ icon: 'search', title: 'No results', text: 'Try another name or create a custom exercise.' });
          return;
        }
        el.innerHTML = res.slice(0, 300).map(function (e) {
          var m = F.calc.muscle(e.primary);
          return '<div class="ex-lib-item" data-pick="' + e.id + '" role="button" tabindex="0">' +
            '<div class="ex-lib-ic" style="background:' + m.color + '1c;color:' + m.color + '">' + U.svg('dumbbell') + '</div>' +
            '<div class="ex-lib-main"><div class="ex-lib-name">' + U.esc(e.name) + '</div>' +
            '<div class="ex-lib-meta">' + U.esc(m.label) + '<span class="dot-sep"></span>' + U.esc(F.calc.EQUIP[e.equipment] || '') + '</div></div>' +
            '<button class="fav-btn' + (F.db.isFavorite(e.id) ? ' on' : '') + '" data-fav="' + e.id + '" aria-label="Favorite">' + U.svg('star') + '</button>' +
            '</div>';
        }).join('');
      }
      renderChips(); renderList();

      sheet.root.addEventListener('click', function (e) {
        var mBtn = e.target.closest('[data-m]');
        if (mBtn) { muscle = mBtn.getAttribute('data-m'); renderChips(); renderList(); return; }
        var f = e.target.closest('[data-fav]');
        if (f) {
          e.stopPropagation();
          var on = F.db.toggleFavorite(f.getAttribute('data-fav'));
          f.classList.toggle('on', on);
          if (onlyFav) renderList();
          return;
        }
        var pick = e.target.closest('[data-pick]');
        if (pick) {
          var ex = F.db.exercise(pick.getAttribute('data-pick'));
          picked = true;
          resolve(ex);
          sheet.close();
        }
      });
      sheet.body.querySelector('#pk-q').addEventListener('input', U.debounce(function (e) {
        q = e.target.value; renderList();
      }, 120));
      sheet.body.querySelector('#pk-equip').addEventListener('change', function (e) { equipment = e.target.value; renderList(); });
      sheet.body.querySelector('#pk-fav').addEventListener('click', function () {
        onlyFav = !onlyFav;
        this.classList.toggle('on', onlyFav);
        renderList();
      });
      sheet.root.querySelector('#pk-create').addEventListener('click', function () {
        picked = true;
        sheet.close();
        UI.createExercise().then(function (ex) {
          resolve(ex || null);
        }).catch(function () {
          resolve(null);
        });
      });
    });
  };

  /* ---------- criar exercício ---------- */
  UI.createExercise = function (prefill) {
    prefill = prefill || {};
    return new Promise(function (resolve) {
      var done = false;
      var muscleOpts = F.calc.MUSCLE_ORDER.filter(function (m) { return F.calc.MUSCLES[m]; })
        .map(function (m) { return '<option value="' + m + '"' + (prefill.primary === m ? ' selected' : '') + '>' + F.calc.muscle(m).label + '</option>'; }).join('');
      var equipOpts = Object.keys(F.calc.EQUIP).map(function (k) {
        return '<option value="' + k + '"' + (prefill.equipment === k ? ' selected' : '') + '>' + F.calc.EQUIP[k] + '</option>';
      }).join('');
      var s = UI.sheet({
        title: 'New exercise',
        body:
          '<div class="field"><label class="label">Name</label><input class="input" id="ce-name" placeholder="E.g. Pause bench press" value="' + U.esc(prefill.name || '') + '"></div>' +
          '<div class="input-row"><div class="field" style="flex:1"><label class="label">Primary muscle</label><select class="select" id="ce-muscle">' + muscleOpts + '</select></div>' +
          '<div class="field" style="flex:1"><label class="label">Equipment</label><select class="select" id="ce-equip">' + equipOpts + '</select></div></div>' +
          '<div class="field"><label class="label">Type</label><div class="seg" id="ce-mech">' +
          '<button class="seg-item on" data-v="compound">Compound</button><button class="seg-item" data-v="isolation">Isolation</button><button class="seg-item" data-v="cardio">Cardio</button></div></div>' +
          '<div class="field"><label class="label">Technique tip (optional)</label><textarea class="textarea" id="ce-tip" placeholder="E.g. 2-second pause on the chest"></textarea></div>',
        foot: '<button class="btn btn-soft" data-no>Cancel</button><button class="btn btn-primary" data-yes>Add</button>',
        onClose: function () { if (!done) resolve(null); },
        onMount: function (x) {
          var mech = 'compound';
          x.root.querySelectorAll('#ce-mech .seg-item').forEach(function (b) {
            b.addEventListener('click', function () {
              x.root.querySelectorAll('#ce-mech .seg-item').forEach(function (y) { y.classList.remove('on'); });
              b.classList.add('on'); mech = b.getAttribute('data-v');
            });
          });
          x.root.querySelector('[data-yes]').addEventListener('click', function () {
            var name = x.root.querySelector('#ce-name').value.trim();
            if (!name) { UI.toast('Give the exercise a name', 'err'); return; }
            var ex = F.db.addCustomExercise({
              name: name,
              primary: x.root.querySelector('#ce-muscle').value,
              equipment: x.root.querySelector('#ce-equip').value,
              mechanic: mech,
              tip: x.root.querySelector('#ce-tip').value.trim(),
            });
            done = true; resolve(ex); x.close(); UI.toast('Exercise created');
          });
        },
      });
      if (!s) return resolve(null);
      s.root.querySelector('[data-no]').addEventListener('click', function () { done = true; resolve(null); s.close(); });
    });
  };

  /* ---------- calculadora de discos ---------- */
  UI.plateSheet = function (initialWeight) {
    var st = F.db.settings;
    var s = UI.sheet({
      title: 'Plate calculator',
      sub: 'Bar of ' + U.num(st.bar || 20, 0) + ' kg · per side',
      body:
        '<div class="input-suffix" style="margin-bottom:14px"><input class="input num" id="pl-in" inputmode="decimal" value="' + (initialWeight ? U.num(F.db.toDisplay(initialWeight), 1) : '') + '" placeholder="Total weight"><span class="sfx">' + F.db.unit + '</span></div>' +
        '<div class="plate-vis" id="pl-vis"></div>' +
        '<div class="plate-legend" id="pl-leg"></div>' +
        '<div class="calc-out" style="margin-top:14px"><div class="l">Total on bar</div><div class="v" id="pl-total">—</div><div class="mini" id="pl-note" style="margin-top:4px"></div></div>',
    });
    if (!s) return;
    var input = s.root.querySelector('#pl-in');
    function render() {
      var raw = parseFloat(String(input.value).replace(',', '.'));
      var kg = F.db.displayToKg(raw || 0);
      var res = F.calc.plates(kg, st.bar || 20, st.plates);
      var vis = s.root.querySelector('#pl-vis');
      var leg = s.root.querySelector('#pl-leg');
      var total = s.root.querySelector('#pl-total');
      var note = s.root.querySelector('#pl-note');
      if (res.error || !res.perSide.length) {
        vis.innerHTML = '<div class="mini">' + U.esc(res.error || 'No plates for this weight.') + '</div>';
        leg.innerHTML = '';
        total.textContent = '—';
        note.textContent = '';
        return;
      }
      var hMap = { 25: 100, 20: 86, 15: 70, 10: 54, 5: 38, 2.5: 28, 1.25: 20, 0.5: 16 };
      vis.innerHTML = '<div class="bar"></div>' + res.perSide.map(function (p) {
        var h = hMap[p] || Math.max(16, p * 3.6);
        return '<div class="pl" style="height:' + h + 'px"></div>';
      }).join('') + '<div class="collar"></div>';
      var counts = {};
      res.perSide.forEach(function (p) { counts[p] = (counts[p] || 0) + 1; });
      leg.innerHTML = Object.keys(counts).sort(function (a, b) { return b - a; }).map(function (p) {
        return '<span class="pl-badge">' + U.num(p, p % 1 ? 2 : 0) + ' kg × ' + counts[p] + '</span>';
      }).join('');
      total.innerHTML = U.num(F.db.toDisplay(res.achieved), 1) + ' <small>' + F.db.unit + '</small>';
      note.textContent = res.exact ? 'Exact' : U.num(F.db.toDisplay(Math.abs(res.diff)), 1) + ' ' + F.db.unit + ' short of target';
    }
    input.addEventListener('input', U.debounce(render, 60));
    setTimeout(function () { input.focus(); }, 250);
    render();
  };

  /* ---------- pequenos helpers ---------- */
  UI.optionList = function (options, selected) {
    return options.map(function (o) {
      return '<option value="' + U.esc(o.value) + '"' + (String(selected) === String(o.value) ? ' selected' : '') + '>' + U.esc(o.label) + '</option>';
    }).join('');
  };
  UI.todayLabel = function () {
    var d = new Date();
    return U.cap(U.DAYS[d.getDay()]) + ', ' + d.getDate() + ' ' + U.monthShort(d);
  };
  UI.greeting = function () {
    var h = new Date().getHours();
    if (h < 6) return 'Good night';
    if (h < 13) return 'Good morning';
    if (h < 20) return 'Good afternoon';
    return 'Good evening';
  };
})();
