/* =========================================================
   FERRO — Histórico
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, C = F.calc, DB = F.db, UI = F.ui;
  var cursor = U.startOfMonth(new Date());
  var selected = null;
  var query = '';

  function monthWorkouts() {
    return DB.state.workouts.filter(function (w) {
      var d = U.parse(w.start);
      return d.getFullYear() === cursor.getFullYear() && d.getMonth() === cursor.getMonth();
    });
  }

  function rowFor(w) {
    var st = C.stats(w);
    var exNames = w.exercises.slice(0, 2).map(function (e) { return DB.exercise(e.exerciseId).name; }).join(', ');
    return '<button class="item" data-w="' + w.id + '" style="align-items:flex-start;padding:12px 13px">' +
      '<div class="hist-date" style="width:38px"><div class="d">' + U.parse(w.start).getDate() + '</div><div class="m">' + U.monthShort(w.start) + '</div></div>' +
      '<div class="item-main"><div class="hist-name">' + U.esc(w.name) + (w.rating ? ' <span class="mini" style="color:var(--warn)">' + '★'.repeat(Math.min(5, w.rating)) + '</span>' : '') + '</div>' +
      '<div class="hist-meta"><span>' + U.fmtDuration(st.duration) + '</span><span><b>' + U.int(DB.toDisplay(st.volume)) + '</b> ' + DB.unit + '</span><span>' + st.sets + ' séries</span></div>' +
      '<div class="mini truncate" style="margin-top:3px;opacity:.75">' + U.esc(exNames) + (w.exercises.length > 2 ? ' +' + (w.exercises.length - 2) : '') + '</div></div>' +
      '<div class="chev" style="margin-top:6px">' + U.svg('right') + '</div></button>';
  }

  function emptyFor() {
    return UI.empty({
      icon: 'calendar', title: selected ? 'Nada neste dia' : 'Mês sem treinos',
      text: selected ? 'Escolhe outro dia ou limpa o filtro.' : 'Os treinos que terminares aparecem aqui.',
      action: '<button class="btn btn-primary btn-sm" data-nav="/workout">Treinar agora</button>',
    });
  }

  function listView() {
    var fd = DB.settings.firstDay == null ? 1 : DB.settings.firstDay;
    var list = monthWorkouts();
    var filtered = list.slice();
    if (selected) filtered = filtered.filter(function (w) { return U.dateKey(w.start) === selected; });
    if (query) {
      var q = U.norm(query);
      filtered = filtered.filter(function (w) {
        if (U.norm(w.name).indexOf(q) >= 0) return true;
        return (w.exercises || []).some(function (ex) { return U.norm(DB.exercise(ex.exerciseId).name).indexOf(q) >= 0; });
      });
    }
    var hasDay = {};
    list.forEach(function (w) { hasDay[U.dateKey(w.start)] = (hasDay[U.dateKey(w.start)] || 0) + 1; });

    var first = U.startOfMonth(cursor);
    var lead = (first.getDay() - fd + 7) % 7;
    var total = U.daysInMonth(cursor);
    var cells = [];
    for (var i = 0; i < lead; i++) cells.push(null);
    for (var d = 1; d <= total; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    var weekNames = [];
    for (var w2 = 0; w2 < 7; w2++) weekNames.push(U.DAYS_S[(fd + w2) % 7].charAt(0).toUpperCase());

    var calHtml = '<div class="cal"><div class="cal-head"><div class="cal-month">' + U.monthLabel(cursor) + '</div>' +
      '<div class="cal-nav"><button data-mv="-1" aria-label="Mês anterior">' + U.svg('left') + '</button>' +
      '<button data-today aria-label="Hoje">' + U.svg('target') + '</button>' +
      '<button data-mv="1" aria-label="Mês seguinte">' + U.svg('right') + '</button></div></div>' +
      '<div class="cal-week">' + weekNames.map(function (n) { return '<span>' + n + '</span>'; }).join('') + '</div>' +
      '<div class="cal-grid">' + cells.map(function (c) {
        if (!c) return '<div></div>';
        var key = U.dateKey(c);
        var n = hasDay[key] || 0;
        var isToday = key === U.todayKey();
        return '<button class="cal-day ' + (n ? 'has ' : '') + (isToday ? 'today ' : '') + (selected === key ? 'sel ' : '') + '" data-day="' + key + '">' +
          '<span>' + c.getDate() + '</span>' + (n ? '<span class="d"></span>' : '') + '</button>';
      }).join('') + '</div>' +
      '<div class="divider" style="margin:10px 4px"></div>' +
      '<div class="row" style="padding:0 4px">' +
      '<div class="center grow"><div class="strong num">' + list.length + '</div><div class="mini">treinos</div></div>' +
      '<div class="center grow"><div class="strong num">' + U.int(DB.toDisplay(U.sum(list, C.workoutVolume))) + '</div><div class="mini">' + DB.unit + ' volume</div></div>' +
      '<div class="center grow"><div class="strong num">' + U.fmtDuration(U.sum(list, C.workoutDuration)) + '</div><div class="mini">tempo</div></div>' +
      '</div></div>';

    var rows = filtered.map(rowFor).join('');

    var html = '<div class="screen">' +
      '<header class="screen-head"><div class="page-head"><div><div class="eyebrow">' + DB.state.workouts.length + ' treinos no total</div><h1 class="page-title">Histórico</h1></div>' +
      '<button class="icon-btn" data-nav="/progress" aria-label="Progresso">' + U.svg('chart') + '</button></div>' +
      '<div class="search-bar"><input class="input" id="hs-q" placeholder="Pesquisar treino ou exercício" value="' + U.esc(query) + '"><svg class="ic" aria-hidden="true"><use href="#i-search"></use></svg></div>' +
      '</header>' +
      '<div class="screen-body">' + calHtml +
      '<div class="sec"><div class="sec-head"><div class="sec-title">' + (selected ? U.fmtDate(selected, 'long') : 'Treinos de ' + U.monthShort(cursor)) + '</div>' +
      (selected ? '<button class="sec-link" data-clear>Limpar filtro</button>' : '<span class="mini" id="hs-count">' + filtered.length + '</span>') + '</div>' +
      '<div class="list" id="hs-list">' + (rows || emptyFor()) + '</div></div></div></div>';

    return {
      tab: 'history', title: 'Histórico', html: html,
      mount: function (root) {
        var qi = root.querySelector('#hs-q');
        qi.addEventListener('input', U.debounce(function () {
          query = qi.value;
          var f = monthWorkouts();
          if (selected) f = f.filter(function (w) { return U.dateKey(w.start) === selected; });
          if (query) {
            var q = U.norm(query);
            f = f.filter(function (w) {
              if (U.norm(w.name).indexOf(q) >= 0) return true;
              return (w.exercises || []).some(function (ex) { return U.norm(DB.exercise(ex.exerciseId).name).indexOf(q) >= 0; });
            });
          }
          var el = root.querySelector('#hs-list');
          if (el) el.innerHTML = f.length ? f.map(rowFor).join('') : emptyFor();
          var c = root.querySelector('#hs-count');
          if (c) c.textContent = f.length;
        }, 170));
        root.addEventListener('click', function (e) {
          var mv = e.target.closest('[data-mv]');
          if (mv) {
            cursor = U.addMonths(cursor, +mv.getAttribute('data-mv'));
            selected = null; F.app.refresh(); return;
          }
          if (e.target.closest('[data-today]')) { cursor = U.startOfMonth(new Date()); selected = U.todayKey(); F.app.refresh(); return; }
          var day = e.target.closest('[data-day]');
          if (day) {
            var k = day.getAttribute('data-day');
            selected = selected === k ? null : k;
            F.app.refresh(); return;
          }
          if (e.target.closest('[data-clear]')) { selected = null; F.app.refresh(); return; }
          var w = e.target.closest('[data-w]');
          if (w) F.app.go('/history/' + w.getAttribute('data-w'));
        });
      },
    };
  }

  function workoutText(w) {
    var st = C.stats(w);
    var lines = [];
    lines.push('Ferro — ' + w.name);
    lines.push(U.fmtDate(w.start, 'full') + ' · ' + U.fmtDuration(st.duration));
    lines.push('Volume ' + U.int(DB.toDisplay(st.volume)) + ' ' + DB.unit + ' · ' + st.sets + ' séries · ' + st.reps + ' reps');
    lines.push('');
    (w.exercises || []).forEach(function (b) {
      lines.push(DB.exercise(b.exerciseId).name);
      (b.sets || []).forEach(function (s) {
        var line = '  ' + (s.weight ? DB.fmtW(s.weight) + ' ' + DB.unit + ' × ' : '') + s.reps + (s.rpe ? ' @' + s.rpe : '');
        if (s.type === 'warmup') line = '  (aquecimento) ' + line.trim();
        lines.push(line);
      });
    });
    if (w.notes) { lines.push(''); lines.push(w.notes); }
    return lines.join('\n');
  }

  function detailView(w) {
    var st = C.stats(w);
    var setsBy = C.muscleSets(w.exercises, DB.exercise);
    var top = C.MUSCLE_ORDER.filter(function (m) { return setsBy[m] > 0; }).sort(function (a, b) { return setsBy[b] - setsBy[a]; }).slice(0, 6);
    var prior = DB.state.workouts.filter(function (x) { return U.parse(x.start) < U.parse(w.start); });
    var idx = DB.state.workouts.findIndex(function (x) { return x.id === w.id; });
    var next = DB.state.workouts[idx - 1];
    var prev = DB.state.workouts[idx + 1];

    var exHtml = (w.exercises || []).map(function (b) {
      var ex = DB.exercise(b.exerciseId);
      var pr = C.prsFor(prior, b.exerciseId);
      var working = (b.sets || []).filter(function (s) { return s.type !== 'warmup'; });
      var best = U.maxBy(working, function (s) { return C.e1rm(s.weight, s.reps) || 0; });
      var isPR = pr.sessions > 0 && best && C.e1rm(best.weight, best.reps) > pr.maxE1rm.value + 0.05;
      var rows = (b.sets || []).map(function (s, si) {
        var isBest = best && s.id === best.id && working.length > 1;
        return '<div class="row between" style="padding:7px 0;border-bottom:1px solid var(--line-2);gap:8px">' +
          '<div class="row gap-6" style="width:34px"><span class="set-num" style="width:22px;height:22px;font-size:11px">' + (si + 1) + '</span>' +
          (s.type !== 'normal' ? '<span class="tag" style="font-size:8px;color:var(--violet);font-weight:800">' + (C.SET_TYPES[s.type] || {}).short + '</span>' : '') + '</div>' +
          '<div class="num strong grow" style="text-align:center">' + (s.weight ? DB.fmtW(s.weight) + ' <small class="mini">' + DB.unit + '</small>' : '—') + '</div>' +
          '<div class="num grow" style="text-align:center">' + s.reps + ' <small class="mini">reps</small></div>' +
          '<div class="mini num" style="width:42px;text-align:right">' + (s.rpe ? 'RPE ' + s.rpe : '') + '</div>' +
          '<div style="width:34px;text-align:right">' + (isBest ? '<span class="badge pr" style="height:18px;font-size:8px">TOP</span>' : '') + '</div>' +
          '</div>';
      }).join('');
      return '<div class="ex-card" style="margin-bottom:10px"><div class="ex-head" style="padding-bottom:6px"><div class="ex-head-main">' +
        '<div class="ex-name">' + U.esc(ex.name) + (isPR ? ' <span class="badge pr" style="vertical-align:middle">PR</span>' : '') + '</div>' +
        '<div class="ex-meta">' + UI.muscleDot(ex.primary) + U.esc(C.muscle(ex.primary).label) + ' · ' + U.esc(C.EQUIP[ex.equipment] || '') + '</div></div></div>' +
        '<div style="padding:0 14px 10px">' + rows + '</div>' +
        (b.note ? '<div class="ex-note">' + U.svg('note') + U.esc(b.note) + '</div>' : '') + '</div>';
    }).join('');

    var html = '<div class="screen">' +
      '<header class="screen-head">' + UI.navHead({
        title: w.name, sub: U.fmtDate(w.start, 'long'),
        right: '<button class="icon-btn" data-act="menu" aria-label="Opções">' + U.svg('more') + '</button>',
      }) + '</header>' +
      '<div class="screen-body">' +
      '<div class="detail-hero"><div class="row between"><div class="eyebrow">' + U.fmtTimeOfDay(w.start) + ' · ' + U.fmtDuration(st.duration) + '</div>' +
      (w.rating ? '<div style="color:var(--warn);font-size:13px;letter-spacing:2px">' + '★'.repeat(Math.min(5, w.rating)) + '</div>' : '') + '</div>' +
      '<div class="h1 mt-8">' + U.esc(w.name) + '</div>' +
      '<div class="stat-strip"><div class="s"><div class="v">' + U.int(DB.toDisplay(st.volume)) + '</div><div class="l">' + DB.unit + ' volume</div></div>' +
      '<div class="s"><div class="v">' + st.sets + '</div><div class="l">séries</div></div>' +
      '<div class="s"><div class="v">' + w.exercises.length + '</div><div class="l">exercícios</div></div></div></div>' +
      '<div class="btn-row mt-12"><button class="btn btn-primary" data-act="repeat">' + U.svg('repeat') + 'Repetir</button>' +
      '<button class="btn btn-soft" data-act="share">' + U.svg('share') + 'Partilhar</button></div>' +
      (top.length ? '<div class="sec"><div class="sec-head"><div class="sec-title">Repartição muscular</div></div><div class="card"><div class="bars">' +
        top.map(function (m) {
          return '<div class="bar-row"><div class="bar-name">' + UI.muscleDot(m) + C.muscle(m).label + '</div>' +
            '<div class="bar-track"><div class="bar-fill" style="width:' + Math.round(setsBy[m] / top[0] * 100) + '%;background:' + C.muscle(m).color + '"></div></div>' +
            '<div class="bar-val">' + (setsBy[m] % 1 ? U.num(setsBy[m], 1) : setsBy[m]) + '</div></div>';
        }).join('') + '</div></div></div>' : '') +
      '<div class="sec"><div class="sec-head"><div class="sec-title">Exercícios</div><span class="mini">' + st.reps + ' reps · ' + U.int(DB.toDisplay(st.volume)) + ' ' + DB.unit + '</span></div>' +
      exHtml + '</div>' +
      (w.notes ? '<div class="card mt-12"><div class="card-title mb-8">Notas</div><div class="sub" style="font-size:13px">' + U.esc(w.notes) + '</div></div>' : '') +
      '<div class="row between mt-16" style="gap:8px">' +
      (prev ? '<button class="btn btn-sm btn-ghost" data-goto="' + prev.id + '" style="flex:1;justify-content:flex-start">' + U.svg('left') + '<span class="truncate">' + U.esc(prev.name) + '</span></button>' : '<div style="flex:1"></div>') +
      (next ? '<button class="btn btn-sm btn-ghost" data-goto="' + next.id + '" style="flex:1;justify-content:flex-end"><span class="truncate">' + U.esc(next.name) + '</span>' + U.svg('right') + '</button>' : '<div style="flex:1"></div>') +
      '</div><div style="height:20px"></div></div></div>';

    return {
      tab: 'history', title: w.name, html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var act = e.target.closest('[data-act]');
          if (act) {
            var a = act.getAttribute('data-act');
            if (a === 'repeat') {
              var res = DB.repeatWorkout(w.id);
              if (res && res.error) { UI.toast(res.error, 'err'); return; }
              F.app.go('/workout');
            }
            if (a === 'share') {
              U.copy(workoutText(w)).then(function (ok) { UI.toast(ok ? 'Treino copiado' : 'Não foi possível copiar', ok ? 'ok' : 'err'); });
            }
            if (a === 'menu') {
              UI.actions({
                title: w.name,
                options: [
                  { label: 'Partilhar como texto', value: 'share', icon: 'share' },
                  { label: 'Repetir treino', value: 'repeat', icon: 'repeat' },
                  { label: 'Editar notas', value: 'notes', icon: 'note' },
                  { label: 'Eliminar treino', value: 'del', icon: 'trash', danger: true },
                ],
              }).then(function (v) {
                if (!v) return;
                if (v === 'share') U.copy(workoutText(w)).then(function (ok) { UI.toast(ok ? 'Copiado' : 'Falhou', ok ? 'ok' : 'err'); });
                if (v === 'repeat') { DB.repeatWorkout(w.id); F.app.go('/workout'); }
                if (v === 'notes') {
                  UI.prompt({ title: 'Notas do treino', label: 'Notas', value: w.notes || '', multiline: true }).then(function (txt) {
                    if (txt == null) return;
                    w.notes = txt.trim();
                    DB.save(true); DB.saveNow();
                    UI.toast('Notas atualizadas'); F.app.refresh();
                  });
                }
                if (v === 'del') {
                  UI.confirm({ title: 'Eliminar treino?', message: 'Esta ação não pode ser desfeita.', confirmText: 'Eliminar', danger: true }).then(function (ok) {
                    if (!ok) return;
                    DB.deleteWorkout(w.id); UI.toast('Treino eliminado'); F.app.go('/history');
                  });
                }
              });
            }
          }
          var go = e.target.closest('[data-goto]');
          if (go) F.app.go('/history/' + go.getAttribute('data-goto'));
        });
      },
    };
  }

  F.views.history = function (params) {
    if (params && params.id) {
      var w = DB.getWorkout(params.id);
      if (w) return detailView(w);
      return {
        tab: 'history', title: 'Treino',
        html: '<div class="screen"><header class="screen-head">' + UI.navHead({ title: 'Treino' }) + '</header><div class="screen-body">' +
          UI.empty({ icon: 'info', title: 'Treino não encontrado', text: 'Pode ter sido eliminado.', action: '<button class="btn btn-primary btn-sm" data-nav="/history">Voltar ao histórico</button>' }) + '</div></div>',
      };
    }
    return listView();
  };
})();
