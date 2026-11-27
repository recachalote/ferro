/* =========================================================
   FERRO — Rotinas e programas
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, C = F.calc, DB = F.db, UI = F.ui;
  var folderFilter = '';

  function rowHTML(r) {
    var last = DB.routineLastDate(r.id);
    var exs = r.exercises.slice(0, 3).map(function (e) { return DB.exercise(e.exerciseId); });
    return '<div class="routine-card">' +
      '<div class="routine-top"><div class="grow" data-open="' + r.id + '" style="cursor:pointer">' +
      '<div class="routine-name">' + U.esc(r.name) + '</div>' +
      '<div class="routine-tags">' + r.exercises.length + ' exercises' +
      (r.folder ? ' · ' + U.esc(r.folder) : '') + (last ? ' · ' + U.relative(last).toLowerCase() : ' · never done') + '</div></div>' +
      '<button class="icon-btn" data-edit="' + r.id + '" aria-label="Edit">' + U.svg('pencil') + '</button></div>' +
      '<div class="routine-ex">' + exs.map(function (e, i) {
        return '<div class="routine-ex-line"><span class="n">' + (i + 1) + '</span>' + UI.muscleDot(e.primary) + '<span class="t">' + U.esc(e.name) + '</span></div>';
      }).join('') + (r.exercises.length > 3 ? '<div class="routine-more">+' + (r.exercises.length - 3) + ' more</div>' : '') + '</div>' +
      '<div class="btn-row mt-4"><button class="btn btn-sm btn-primary" data-start="' + r.id + '" style="flex:1">' + U.svg('play') + 'Start</button>' +
      '<button class="btn btn-sm btn-soft" data-more="' + r.id + '" style="flex:0 0 44px;padding:0" aria-label="More options">' + U.svg('more') + '</button></div></div>';
  }

  function openProgram(p) {
    var level = C.LEVEL[p.level] || p.level;
    var body = '<div class="row gap-6 wrap" style="margin-bottom:12px"><span class="badge accent">' + p.days + ' days/week</span><span class="badge">' + level + '</span><span class="badge info">' + U.esc(p.focus) + '</span><span class="badge">' + p.weeks + ' weeks</span></div>' +
      '<p class="sub" style="font-size:13.5px;line-height:1.55">' + U.esc(p.description) + '</p>' +
      '<div class="card flat mt-12"><div class="row gap-8"><div class="item-thumb" style="color:var(--accent-text)">' + U.svg('trend') + '</div><div><div class="card-title">Progression</div><div class="card-sub" style="line-height:1.4">' + U.esc(p.progression) + '</div></div></div></div>' +
      '<div class="sec-head mt-16"><div class="sec-title">' + p.routines.length + ' routines</div></div>' +
      (p.routines || []).map(function (r) {
        return '<div class="card tight mb-8"><div class="row between"><div class="card-title">' + U.esc(r.name) + '</div><span class="mini">' + r.exercises.length + ' exercises</span></div>' +
          '<div class="routine-ex mt-8">' + r.exercises.map(function (e) {
            var pdef = DB.findExerciseByName(e.name, e.muscle);
            return '<div class="routine-ex-line"><span class="t">' + U.esc(pdef ? pdef.name : e.name) + '</span><span class="s">' + e.sets + '×' + U.esc(String(e.reps)) + '</span></div>';
          }).join('') + '</div></div>';
      }).join('');
    var s = UI.sheet({
      title: p.name, sub: p.subtitle, tall: true, body: body,
      foot: '<button class="btn btn-primary btn-block" id="pg-add">' + U.svg('plus') + 'Add ' + p.routines.length + ' routines</button>',
      onMount: function (x) {
        x.root.querySelector('#pg-add').addEventListener('click', function () {
          var n = 0;
          p.routines.forEach(function (r) {
            var nr = DB.newRoutine(r.name);
            nr.folder = p.name;
            nr.notes = r.notes || '';
            nr.exercises = r.exercises.map(function (e) {
              var def = DB.findExerciseByName(e.name, e.muscle);
              if (!def) return null;
              return {
                id: U.uid('re'), exerciseId: def.id, sets: Number(e.sets) || 3,
                reps: String(e.reps || '8-12'), rest: Number(e.rest) || 120,
                note: e.note || '', superset: 0,
              };
            }).filter(Boolean);
            if (nr.exercises.length) { DB.saveRoutine(nr); n++; }
          });
          x.close();
          UI.toast('Routines added: ' + n);
          F.app.go('/routines');
        });
      },
    });
  }

  function listView() {
    var routines = DB.state.routines;
    var folders = DB.folders();
    var shown = folderFilter ? routines.filter(function (r) { return r.folder === folderFilter; }) : routines;
    var total = routines.length;

    var filters = '<div class="chips"><button class="chip ' + (!folderFilter ? 'on' : '') + '" data-folder="">All (' + total + ')</button>' +
      folders.map(function (f) {
        return '<button class="chip ' + (folderFilter === f ? 'on' : '') + '" data-folder="' + U.esc(f) + '">' + U.svg('folder') + U.esc(f) + '</button>';
      }).join('') + '</div>';

    var html = '<div class="screen">' +
      '<header class="screen-head"><div class="page-head"><div><div class="eyebrow">' + total + ' routines</div><h1 class="page-title">Routines</h1></div>' +
      '<button class="icon-btn accent" data-act="new" aria-label="New routine">' + U.svg('plus') + '</button></div>' +
      '<div class="seg" style="margin-bottom:10px"><button class="seg-item on" data-nav="/routines">My routines</button><button class="seg-item" data-nav="/routines/programs">Programs</button></div>' +
      '</header>' +
      '<div class="screen-body">' +
      (folders.length ? filters : '') +
      '<div class="col gap-12 mt-12">' + (shown.length ? shown.map(rowHTML).join('') :
        UI.empty({ icon: 'folder', title: 'No routines', text: 'Create your first routine or start with a program.', action: '<button class="btn btn-primary btn-sm" data-nav="/routines/programs">See programs</button>' })) + '</div>' +
      (routines.length ? '<button class="card mt-16" data-nav="/routines/programs" style="width:100%;text-align:left;display:flex;align-items:center;gap:12px">' +
      '<div class="item-thumb" style="color:var(--violet)">' + U.svg('book') + '</div>' +
      '<div class="grow"><div class="card-title">Ready-made programs</div><div class="card-sub">10 programs, ' + (window.FERRO_PROGRAMS || []).reduce(function (a, p) { return a + p.routines.length; }, 0) + ' routines</div></div>' +
      '<div class="chev">' + U.svg('right') + '</div></button>' : '') +
      '</div></div>';

    return {
      tab: 'routines', title: 'Routines', html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var f = e.target.closest('[data-folder]');
          if (f) { folderFilter = f.getAttribute('data-folder'); F.app.refresh(); return; }
          var open = e.target.closest('[data-open]');
          if (open) { F.app.go('/routines/' + open.getAttribute('data-open')); return; }
          var start = e.target.closest('[data-start]');
          if (start) { DB.startWorkout({ routineId: start.getAttribute('data-start') }); F.app.go('/workout'); return; }
          var edit = e.target.closest('[data-edit]');
          if (edit) { F.app.go('/routines/' + edit.getAttribute('data-edit') + '/edit'); return; }
          var more = e.target.closest('[data-more]');
          if (more) { routineMenu(more.getAttribute('data-more')); return; }
          var act = e.target.closest('[data-act]');
          if (act && act.getAttribute('data-act') === 'new') {
            var r = DB.newRoutine('New routine');
            DB.saveRoutine(r);
            F.app.go('/routines/' + r.id + '/edit');
          }
        });
      },
    };
  }

  function routineMenu(id) {
    var r = DB.getRoutine(id);
    if (!r) return;
    UI.actions({
      title: r.name,
      options: [
        { label: 'Start workout', value: 'start', icon: 'play' },
        { label: 'Edit routine', value: 'edit', icon: 'pencil' },
        { label: 'Duplicate', value: 'dup', icon: 'copy' },
        { label: 'Delete', value: 'del', icon: 'trash', danger: true },
      ],
    }).then(function (v) {
      if (!v) return;
      if (v === 'start') { DB.startWorkout({ routineId: id }); F.app.go('/workout'); }
      if (v === 'edit') F.app.go('/routines/' + id + '/edit');
      if (v === 'dup') { DB.duplicateRoutine(id); UI.toast('Routine duplicated'); F.app.refresh(); }
      if (v === 'del') {
        UI.confirm({ title: 'Delete routine?', message: 'Workout history is kept.', confirmText: 'Delete', danger: true }).then(function (ok) {
          if (!ok) return;
          DB.deleteRoutine(id); UI.toast('Routine deleted'); F.app.refresh();
        });
      }
    });
  }

  function detailView(r) {
    var last = DB.routineLastDate(r.id);
    var totalSets = U.sum(r.exercises, function (e) { return Number(e.sets) || 0; });
    var muscles = {};
    r.exercises.forEach(function (e) { var d = DB.exercise(e.exerciseId); muscles[d.primary] = (muscles[d.primary] || 0) + 1; });
    var muscleList = C.MUSCLE_ORDER.filter(function (m) { return muscles[m]; });
    var html = '<div class="screen">' +
      '<header class="screen-head">' + UI.navHead({
        title: r.name, sub: r.folder || 'Routine',
        right: '<button class="icon-btn" data-act="edit" aria-label="Edit">' + U.svg('pencil') + '</button>',
      }) + '</header>' +
      '<div class="screen-body">' +
      '<div class="detail-hero"><div class="row between"><div class="eyebrow">' + (r.folder ? U.esc(r.folder) : 'Custom routine') + '</div><span class="badge">' + r.exercises.length + ' exercises</span></div>' +
      '<div class="h1 mt-8">' + U.esc(r.name) + '</div>' +
      (r.notes ? '<div class="sub mt-8" style="font-size:13px">' + U.esc(r.notes) + '</div>' : '') +
      '<div class="stat-strip"><div class="s"><div class="v">' + totalSets + '</div><div class="l">sets</div></div>' +
      '<div class="s"><div class="v" style="font-size:13px">' + (last ? U.fmtDate(last, 'short') : '—') + '</div><div class="l">last time</div></div></div></div>' +
      '<div class="mt-12"><button class="btn btn-primary btn-block btn-lg" data-act="start">' + U.svg('play') + 'Start this workout</button></div>' +
      '<div class="sec"><div class="sec-head"><div class="sec-title">Exercises</div><button class="sec-link" data-act="edit">Edit</button></div>' +
      '<div class="list">' + r.exercises.map(function (e, i) {
        var ex = DB.exercise(e.exerciseId);
        return '<button class="item" data-ex="' + ex.id + '"><div class="item-thumb" style="background:' + C.muscle(ex.primary).color + '1a;color:' + C.muscle(ex.primary).color + ';font-size:11px">' + (i + 1) + '</div>' +
          '<div class="item-main"><div class="item-title">' + U.esc(ex.name) + '</div>' +
          '<div class="item-sub">' + U.esc(C.muscle(ex.primary).label) + ' · ' + e.sets + ' × ' + U.esc(String(e.reps)) + (e.rest ? ' · ' + U.fmtClock(e.rest) : '') + '</div></div>' +
          '<div class="chev">' + U.svg('right') + '</div></button>';
      }).join('') + '</div></div>' +
      '<div class="sec"><div class="sec-head"><div class="sec-title">Muscle groups</div></div><div class="card"><div class="row wrap gap-6">' +
      muscleList.map(function (m) { return '<span class="chip sm">' + UI.muscleDot(m) + C.muscle(m).label + ' · ' + muscles[m] + '</span>'; }).join('') +
      '</div></div></div>' +
      '<div class="btn-row mt-16"><button class="btn btn-soft" data-act="dup">' + U.svg('copy') + 'Duplicate</button>' +
      '<button class="btn btn-ghost danger" data-act="del">' + U.svg('trash') + 'Delete</button></div>' +
      '</div></div>';
    return {
      tab: 'routines', title: r.name, html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var ex = e.target.closest('[data-ex]');
          if (ex) { F.app.go('/exercises/' + ex.getAttribute('data-ex')); return; }
          var act = e.target.closest('[data-act]');
          if (!act) return;
          var a = act.getAttribute('data-act');
          if (a === 'start') { DB.startWorkout({ routineId: r.id }); F.app.go('/workout'); }
          if (a === 'edit') F.app.go('/routines/' + r.id + '/edit');
          if (a === 'dup') { DB.duplicateRoutine(r.id); UI.toast('Routine duplicated'); F.app.go('/routines'); }
          if (a === 'del') {
            UI.confirm({ title: 'Delete routine?', message: 'History is kept.', confirmText: 'Delete', danger: true }).then(function (ok) {
              if (!ok) return;
              DB.deleteRoutine(r.id); UI.toast('Deleted'); F.app.go('/routines');
            });
          }
        });
      },
    };
  }

  function editorView(r) {
    var exHtml = r.exercises.map(function (e, i) {
      var ex = DB.exercise(e.exerciseId);
      return '<div class="card tight" data-rex="' + e.id + '" style="margin-bottom:9px">' +
        '<div class="row between"><div class="row gap-8" style="min-width:0"><div class="item-thumb" style="width:32px;height:32px;background:' + C.muscle(ex.primary).color + '1a;color:' + C.muscle(ex.primary).color + ';font-size:11px">' + (i + 1) + '</div>' +
        '<div style="min-width:0"><div class="item-title" style="white-space:normal;line-height:1.25">' + U.esc(ex.name) + '</div><div class="item-sub">' + U.esc(C.muscle(ex.primary).label) + '</div></div></div>' +
        '<div class="row gap-2"><button class="icon-btn plain" style="width:30px;height:30px" data-up="' + e.id + '" aria-label="Move up">' + U.svg('up') + '</button>' +
        '<button class="icon-btn plain" style="width:30px;height:30px" data-down="' + e.id + '" aria-label="Move down">' + U.svg('arrow-down') + '</button>' +
        '<button class="icon-btn plain" style="width:30px;height:30px;color:var(--danger)" data-rm="' + e.id + '" aria-label="Remove">' + U.svg('trash') + '</button></div></div>' +
        '<div class="row gap-6 mt-8">' +
        '<div class="grow"><div class="mini">Sets</div><input class="input sm num" data-f="sets" inputmode="numeric" value="' + (e.sets || 3) + '"></div>' +
        '<div class="grow"><div class="mini">Reps</div><input class="input sm num" data-f="reps" value="' + U.esc(String(e.reps || '8-12')) + '"></div>' +
        '<div class="grow"><div class="mini">Rest (s)</div><input class="input sm num" data-f="rest" inputmode="numeric" value="' + (e.rest || 120) + '"></div>' +
        '</div></div>';
    }).join('');

    var html = '<div class="screen">' +
      '<header class="screen-head">' + UI.navHead({
        title: 'Edit routine', sub: r.name,
        right: '<button class="btn btn-sm btn-primary" data-act="save">Save</button>',
      }) + '</header>' +
      '<div class="screen-body">' +
      '<div class="field"><label class="label">Name</label><input class="input" id="ed-name" value="' + U.esc(r.name) + '" placeholder="E.g. Push A"></div>' +
      '<div class="input-row"><div class="field" style="flex:1"><label class="label">Folder</label><input class="input" id="ed-folder" value="' + U.esc(r.folder || '') + '" placeholder="E.g. PPL" list="folders"></div>' +
      '<datalist id="folders">' + DB.folders().map(function (f) { return '<option value="' + U.esc(f) + '">'; }).join('') + '</datalist></div>' +
      '<div class="field"><label class="label">Notes</label><textarea class="textarea" id="ed-notes" placeholder="E.g. 2-3 min rest on compounds">' + U.esc(r.notes || '') + '</textarea></div>' +
      '<div class="sec-head"><div class="sec-title">Exercises (' + r.exercises.length + ')</div></div>' +
      '<div id="ed-ex">' + (exHtml || '<div class="empty" style="padding:22px"><div class="empty-s">No exercises yet.</div></div>') + '</div>' +
      '<button class="btn btn-soft btn-block mt-8" data-act="add">' + U.svg('plus') + 'Add exercise</button>' +
      '<div class="mini mt-12 center">Sets and reps are suggestions — you can adjust them during the workout.</div>' +
      '<div class="mt-16"><button class="btn btn-ghost danger btn-block" data-act="del">' + U.svg('trash') + 'Delete routine</button></div>' +
      '<div style="height:30px"></div></div></div>';

    return {
      tab: 'routines', title: 'Edit routine', html: html,
      mount: function (root) {
        var nameEl = root.querySelector('#ed-name');
        var folderEl = root.querySelector('#ed-folder');
        var notesEl = root.querySelector('#ed-notes');

        function apply() {
          r.name = nameEl.value.trim() || 'Routine';
          r.folder = folderEl.value.trim();
          r.notes = notesEl.value;
          DB.saveRoutine(r);
        }
        var deb = U.debounce(apply, 450);
        [nameEl, folderEl, notesEl].forEach(function (el) {
          el.addEventListener('input', deb);
          el.addEventListener('blur', function () { apply(); });
        });

        root.addEventListener('change', function (e) {
          var inp = e.target.closest('[data-f]');
          if (!inp) return;
          var card = inp.closest('[data-rex]');
          if (!card) return;
          var id = card.getAttribute('data-rex');
          var ex = r.exercises.filter(function (x) { return x.id === id; })[0];
          if (!ex) return;
          var f = inp.getAttribute('data-f');
          var n = parseFloat(String(inp.value).replace(',', '.'));
          if (f === 'sets') ex.sets = Math.max(1, Math.round(n) || 3);
          if (f === 'reps') ex.reps = inp.value.trim() || '8-12';
          if (f === 'rest') ex.rest = Math.max(0, Math.round(n) || 0);
          DB.saveRoutine(r);
        });

        root.addEventListener('click', function (e) {
          var up = e.target.closest('[data-up]');
          var down = e.target.closest('[data-down]');
          var rm = e.target.closest('[data-rm]');
          if (up || down) {
            var id = (up || down).getAttribute(up ? 'data-up' : 'data-down');
            var i = r.exercises.findIndex(function (x) { return x.id === id; });
            var j = i + (up ? -1 : 1);
            if (i >= 0 && j >= 0 && j < r.exercises.length) {
              var tmp = r.exercises[i]; r.exercises[i] = r.exercises[j]; r.exercises[j] = tmp;
              DB.saveRoutine(r); F.app.refresh();
            }
            return;
          }
          if (rm) {
            r.exercises = r.exercises.filter(function (x) { return x.id !== rm.getAttribute('data-rm'); });
            DB.saveRoutine(r); F.app.refresh();
            return;
          }
          var act = e.target.closest('[data-act]');
          if (!act) return;
          var a = act.getAttribute('data-act');
          if (a === 'add') {
            UI.pickExercise({ title: 'Add to routine' }).then(function (ex) {
              if (!ex) return;
              r.exercises.push({
                id: U.uid('re'), exerciseId: ex.id, sets: 3, reps: '8-12',
                rest: DB.guessRest(ex.id), note: '', superset: 0,
              });
              DB.saveRoutine(r); F.app.refresh();
              setTimeout(function () { window.scrollTo(0, document.body.scrollHeight); }, 60);
            });
          }
          if (a === 'save') {
            apply(); UI.toast('Routine saved'); F.app.go('/routines/' + r.id);
          }
          if (a === 'del') {
            UI.confirm({ title: 'Delete routine?', message: 'Workout history is kept.', confirmText: 'Delete', danger: true }).then(function (ok) {
              if (!ok) return;
              DB.deleteRoutine(r.id); UI.toast('Routine deleted'); F.app.go('/routines');
            });
          }
        });
      },
    };
  }

  function programsView() {
    var programs = window.FERRO_PROGRAMS || [];
    var added = {};
    DB.state.routines.forEach(function (r) { if (r.folder) added[r.folder] = (added[r.folder] || 0) + 1; });
    var html = '<div class="screen">' +
      '<header class="screen-head"><div class="nav-head"><button class="icon-btn" data-nav="/routines" aria-label="Back">' + U.svg('left') + '</button><div><div class="nav-title">Programs</div><div class="nav-sub">' + programs.length + ' complete plans</div></div><div></div></div>' +
      '<div class="seg" style="margin-top:12px"><button class="seg-item" data-nav="/routines">My routines</button><button class="seg-item on" data-nav="/routines/programs">Programs</button></div>' +
      '</header>' +
      '<div class="screen-body"><div class="col gap-12 mt-12">' +
      programs.map(function (p) {
        return '<button class="program-card" data-prog="' + p.id + '" style="text-align:left">' +
          '<div class="pc-glow"></div>' +
          '<div class="row between"><div class="program-name">' + U.esc(p.name) + '</div>' + (added[p.name] ? '<span class="badge ok">Added</span>' : '<span class="badge accent">' + p.days + 'd</span>') + '</div>' +
          '<div class="program-desc">' + U.esc(p.subtitle) + '</div>' +
          '<div class="program-meta"><span class="badge">' + (C.LEVEL[p.level] || p.level) + '</span><span class="badge">' + U.esc(p.focus) + '</span><span class="badge">' + p.routines.length + ' routines</span></div>' +
          '</button>';
      }).join('') + '</div></div></div>';
    return {
      tab: 'routines', title: 'Programs', html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var b = e.target.closest('[data-prog]');
          if (!b) return;
          var p = programs.filter(function (x) { return x.id === b.getAttribute('data-prog'); })[0];
          if (p) openProgram(p);
        });
      },
    };
  }

  F.views.routines = function (params) {
    if (!params || !params.id) return listView();
    if (params.id === 'programs') return programsView();
    var r = DB.getRoutine(params.id);
    if (!r) {
      return {
        tab: 'routines', title: 'Routine', html: '<div class="screen"><header class="screen-head">' + UI.navHead({ title: 'Routine' }) + '</header><div class="screen-body">' +
          UI.empty({ icon: 'info', title: 'Routine not found', text: 'It may have been deleted.', action: '<button class="btn btn-primary btn-sm" data-nav="/routines">Back</button>' }) + '</div></div>',
      };
    }
    if (/\/edit$/.test(location.hash)) return editorView(r);
    return detailView(r);
  };
})();
