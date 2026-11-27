/* =========================================================
   FERRO — Biblioteca de exercícios
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, C = F.calc, DB = F.db, UI = F.ui;
  var q = '', muscle = '', equip = '', favOnly = false;

  function rowFor(e) {
    var m = C.muscle(e.primary);
    return '<div class="ex-lib-item" data-ex="' + e.id + '" role="button" tabindex="0">' +
      '<div class="ex-lib-ic" style="background:' + m.color + '1c;color:' + m.color + '">' + U.svg('dumbbell') + '</div>' +
      '<div class="ex-lib-main"><div class="ex-lib-name">' + U.esc(e.name) + '</div>' +
      '<div class="ex-lib-meta">' + U.esc(m.label) + '<span class="dot-sep"></span>' + U.esc(C.EQUIP[e.equipment] || '') + (e.custom ? '<span class="dot-sep"></span><span style="color:var(--violet)">Custom</span>' : '') + '</div></div>' +
      '<button class="fav-btn ' + (DB.isFavorite(e.id) ? 'on' : '') + '" data-fav="' + e.id + '" aria-label="Favorite">' + U.svg('star') + '</button></div>';
  }
  function emptyFor() {
    return UI.empty({ icon: 'search', title: 'No results', text: 'Try another term or create a custom exercise.', action: '<button class="btn btn-primary btn-sm" data-act="new">Create exercise</button>' });
  }

  function listView() {
    var res = DB.searchExercises(q, { muscle: muscle, equipment: equip, favorites: favOnly });
    var total = DB.allExercises().length;
    var html = '<div class="screen">' +
      '<header class="screen-head"><div class="page-head" style="padding-bottom:10px"><div><div class="eyebrow">' + total + ' exercises</div><h1 class="page-title">Exercises</h1></div>' +
      '<button class="icon-btn accent" data-act="new" aria-label="Create exercise">' + U.svg('plus') + '</button></div>' +
      '<div class="search-bar">' + U.svg('search') + '<input class="input" id="ex-q" placeholder="Search by name or muscle" value="' + U.esc(q) + '"></div>' +
      '<div class="chips" style="margin-top:10px">' +
      '<button class="chip ' + (!muscle ? 'on' : '') + '" data-m="">All</button>' +
      C.MUSCLE_ORDER.filter(function (m) { return C.MUSCLES[m]; }).map(function (m) {
        return '<button class="chip ' + (muscle === m ? 'on' : '') + '" data-m="' + m + '">' + UI.muscleDot(m) + C.muscle(m).label + '</button>';
      }).join('') + '</div></header>' +
      '<div class="screen-body">' +
      '<div class="row gap-8" style="margin-bottom:10px"><select class="input sm" id="ex-eq" style="flex:1"><option value="">All equipment</option>' +
      Object.keys(C.EQUIP).map(function (k) { return '<option value="' + k + '"' + (equip === k ? ' selected' : '') + '>' + C.EQUIP[k] + '</option>'; }).join('') + '</select>' +
      '<button class="chip ' + (favOnly ? 'on' : '') + '" id="ex-fav" style="height:42px">' + U.svg('star') + 'Favorites</button></div>' +
      '<div class="mini mb-8" id="ex-count">' + res.length + ' results</div>' +
      '<div class="list" id="ex-list">' + (res.length ? res.map(rowFor).join('') : emptyFor()) + '</div></div></div>';

    return {
      tab: 'exercises', title: 'Exercises', html: html,
      mount: function (root) {
        var qi = root.querySelector('#ex-q');
        qi.addEventListener('input', U.debounce(function () {
          q = qi.value;
          var f = DB.searchExercises(q, { muscle: muscle, equipment: equip, favorites: favOnly });
          var el = root.querySelector('#ex-list');
          if (el) el.innerHTML = f.length ? f.map(rowFor).join('') : emptyFor();
          var c = root.querySelector('#ex-count');
          if (c) c.textContent = f.length + ' results';
        }, 170));
        root.querySelector('#ex-eq').addEventListener('change', function (e) { equip = e.target.value; F.app.refresh(); });
        root.querySelector('#ex-fav').addEventListener('click', function () { favOnly = !favOnly; F.app.refresh(); });
        root.addEventListener('click', function (e) {
          var f = e.target.closest('[data-fav]');
          if (f) { e.stopPropagation(); DB.toggleFavorite(f.getAttribute('data-fav')); f.classList.toggle('on'); return; }
          var m = e.target.closest('[data-m]');
          if (m) { muscle = m.getAttribute('data-m'); F.app.refresh(); return; }
          var ex = e.target.closest('[data-ex]');
          if (ex) { F.app.go('/exercises/' + ex.getAttribute('data-ex')); return; }
          var act = e.target.closest('[data-act]');
          if (act && act.getAttribute('data-act') === 'new') {
            UI.createExercise().then(function (ne) { if (ne) F.app.go('/exercises/' + ne.id); });
          }
        });
      },
    };
  }

  function detailView(ex) {
    var hist = C.exerciseHistory(DB.state.workouts, ex.id);
    var pr = C.prsFor(DB.state.workouts, ex.id);
    var m = C.muscle(ex.primary);
    var fav = DB.isFavorite(ex.id);
    var chartData = hist.slice(-12).map(function (h) { return { x: h.date, y: h.e1rm, label: U.fmtDate(h.date, 'short') }; });
    var sessions = hist.slice(-6).reverse();

    var html = '<div class="screen">' +
      '<header class="screen-head">' + UI.navHead({
        title: C.muscle(ex.primary).label, sub: C.EQUIP[ex.equipment] || '', back: true,
        right: '<button class="icon-btn" data-act="fav" aria-label="Favorite" style="' + (fav ? 'color:var(--warn)' : '') + '">' + U.svg('star') + '</button>',
      }) + '</header>' +
      '<div class="screen-body">' +
      '<div class="detail-hero"><div class="row between"><div class="row gap-6"><span class="badge" style="background:' + m.color + '22;color:' + m.color + '">' + U.esc(m.label) + '</span>' +
      '<span class="badge">' + U.esc(C.EQUIP[ex.equipment] || '') + '</span></div>' +
      (ex.custom ? '<span class="badge violet">Custom</span>' : '') + '</div>' +
      '<div class="h1 mt-8">' + U.esc(ex.name) + '</div>' +
      '<div class="detail-meta"><span class="chip sm">' + U.esc(C.MECHANIC[ex.mechanic] || '') + '</span><span class="chip sm">' + U.esc(C.LEVEL[ex.level] || '') + '</span>' +
      (ex.secondary || []).slice(0, 3).map(function (s) { return '<span class="chip sm">' + U.esc(C.muscle(s).label) + '</span>'; }).join('') + '</div>' +
      (ex.tip ? '<div class="mini mt-12" style="font-style:italic;line-height:1.45">"' + U.esc(ex.tip) + '"</div>' : '') +
      '<div class="stat-strip"><div class="s"><div class="v">' + DB.fmtW(pr.maxWeight.value) + '</div><div class="l">' + DB.unit + ' max</div></div>' +
      '<div class="s"><div class="v">' + DB.fmtW(pr.maxE1rm.value) + '</div><div class="l">1RM est.</div></div>' +
      '<div class="s"><div class="v">' + (pr.sessions || 0) + '</div><div class="l">sessions</div></div></div></div>' +

      (hist.length ? '<div class="sec"><div class="sec-head"><div class="sec-title">1RM progress</div><span class="mini">' + hist.length + ' sessions</span></div>' +
        '<div class="chart-wrap"><div class="chart-box"><canvas id="ex-chart"></canvas></div></div></div>' : '') +

      '<div class="btn-row mt-16"><button class="btn btn-soft" data-act="add">' + U.svg('plus') + 'Add to routine</button>' +
      '<button class="btn btn-primary" data-act="start">' + U.svg('play') + 'Train now</button></div>' +

      '<div class="sec"><div class="sec-head"><div class="sec-title">History</div><span class="mini">' + (hist.length ? hist.length + ' sessions' : '') + '</span></div>' +
      (sessions.length ? '<div class="list">' + sessions.map(function (h) {
        return '<button class="item" data-session="' + h.workoutId + '" style="padding:11px 12px"><div class="item-main">' +
          '<div class="row between"><div class="item-title" style="font-size:13px">' + U.fmtDate(h.date, 'medium') + '</div><div class="mini">' + h.sets + ' sets</div></div>' +
          '<div class="item-sub"><b style="color:var(--txt-2)">' + DB.fmtW(h.topWeight) + ' ' + DB.unit + ' × ' + h.topReps + '</b> · ' + U.int(DB.toDisplay(h.volume)) + ' ' + DB.unit + ' · 1RM ' + DB.fmtW(h.e1rm) + '</div></div>' +
          '<div class="chev">' + U.svg('right') + '</div></button>';
      }).join('') + '</div>' : UI.empty({ icon: 'dumbbell', title: 'No records yet', text: 'This exercise appears here after you train it.' })) + '</div>' +

      (ex.custom ? '<div class="mt-16"><button class="btn btn-ghost danger btn-block" data-act="del">' + U.svg('trash') + 'Delete exercise</button></div>' : '') +
      '<div style="height:20px"></div></div></div>';

    return {
      tab: 'exercises', title: ex.name, html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var act = e.target.closest('[data-act]');
          if (act) {
            var a = act.getAttribute('data-act');
            if (a === 'fav') { var on = DB.toggleFavorite(ex.id); F.app.refresh(); return; }
            if (a === 'add') {
              var rs = DB.state.routines;
              if (!rs.length) {
                UI.confirm({ title: 'No routines', message: 'Do you want to create a routine with this exercise?', confirmText: 'Create routine' }).then(function (ok) {
                  if (!ok) return;
                  var r = DB.newRoutine(ex.name);
                  r.exercises.push({ id: U.uid('re'), exerciseId: ex.id, sets: 3, reps: '8-12', rest: DB.guessRest(ex.id), note: '', superset: 0 });
                  DB.saveRoutine(r); UI.toast('Routine created'); F.app.go('/routines/' + r.id);
                });
                return;
              }
              UI.actions({
                title: 'Add to which routine?',
                options: rs.map(function (r) { return { label: r.name, value: r.id, sub: r.exercises.length + ' exercises', icon: 'folder' }; }),
              }).then(function (id) {
                if (!id) return;
                var r = DB.getRoutine(id);
                r.exercises.push({ id: U.uid('re'), exerciseId: ex.id, sets: 3, reps: '8-12', rest: DB.guessRest(ex.id), note: '', superset: 0 });
                DB.saveRoutine(r); UI.toast('Added to ' + r.name);
              });
            }
            if (a === 'start') {
              DB.startWorkout({ name: ex.name });
              DB.addExerciseToActive(ex.id, { sets: 3 });
              F.app.go('/workout');
            }
            if (a === 'del') {
              UI.confirm({ title: 'Delete exercise?', message: 'Older workouts that use it keep their record.', confirmText: 'Delete', danger: true }).then(function (ok) {
                if (!ok) return;
                DB.deleteCustomExercise(ex.id); UI.toast('Exercise deleted'); F.app.go('/exercises');
              });
            }
            return;
          }
          var s = e.target.closest('[data-session]');
          if (s) F.app.go('/history/' + s.getAttribute('data-session'));
        });
        if (chartData.length > 1) {
          F.chart.line(root.querySelector('#ex-chart'), { data: chartData, color: m.color, unit: DB.unit, yFmt: function (v) { return U.num(v, v % 1 ? 1 : 0); } });
        }
      },
    };
  }

  F.views.exercises = function (params) {
    if (params && params.id) {
      var ex = DB.exercise(params.id);
      if (ex && !ex.missing) return detailView(ex);
      return {
        tab: 'exercises', title: 'Exercise',
        html: '<div class="screen"><header class="screen-head">' + UI.navHead({ title: 'Exercise' }) + '</header><div class="screen-body">' +
          UI.empty({ icon: 'info', title: 'Exercise not found', text: 'It may have been deleted.', action: '<button class="btn btn-primary btn-sm" data-nav="/exercises">View library</button>' }) + '</div></div>',
      };
    }
    return listView();
  };
})();
