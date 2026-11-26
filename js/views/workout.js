/* =========================================================
   FERRO — Treino (início + treino ativo)
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, C = F.calc, DB = F.db, UI = F.ui;

  function numVal(v, dec) {
    if (v == null || v === '') return '';
    return U.num(DB.toDisplay(v), dec == null ? (Math.abs(DB.toDisplay(v)) % 1 ? 1 : 0) : dec);
  }
  function findBlock(id) {
    var w = DB.active();
    return w ? w.exercises.filter(function (e) { return e.id === id; })[0] : null;
  }
  function findSet(id) {
    var w = DB.active();
    if (!w) return null;
    for (var i = 0; i < w.exercises.length; i++) {
      var b = w.exercises[i];
      for (var j = 0; j < b.sets.length; j++) {
        if (b.sets[j].id === id) return { block: b, set: b.sets[j], index: j };
      }
    }
    return null;
  }
  function parseNum(v) {
    if (v == null) return null;
    var s = String(v).trim().replace(',', '.');
    if (s === '') return null;
    var n = parseFloat(s);
    return isNaN(n) ? null : n;
  }
  function syncRow(row) {
    if (!row) return null;
    var found = findSet(row.getAttribute('data-set'));
    if (!found) return null;
    row.querySelectorAll('[data-f]').forEach(function (inp) {
      var f = inp.getAttribute('data-f');
      var n = parseNum(inp.value);
      if (f === 'weight') found.set.weight = n == null ? null : DB.displayToKg(n);
      if (f === 'reps') found.set.reps = n == null ? null : Math.round(n);
      if (f === 'rpe') found.set.rpe = n == null ? null : Math.round(n * 10) / 10;
    });
    return found;
  }
  function blockName(b) { return DB.exercise(b.exerciseId).name; }

  /* ================= resumo / terminar ================= */
  function openFinish() {
    var w = DB.active();
    if (!w) return;
    var doneSets = 0;
    w.exercises.forEach(function (b) { doneSets += b.sets.filter(function (s) { return s.done && Number(s.reps) > 0; }).length; });
    if (!doneSets) { UI.toast('Conclui pelo menos uma série primeiro', 'err'); return; }
    var temp = JSON.parse(JSON.stringify(w));
    temp.end = U.now();
    temp.duration = Math.max(1, Math.round((U.parse(temp.end) - U.parse(temp.start)) / 1000));
    temp.exercises = temp.exercises.map(function (b) {
      return Object.assign({}, b, { sets: b.sets.filter(function (s) { return s.done && Number(s.reps) > 0; }) });
    }).filter(function (b) { return b.sets.length; });
    var st = C.stats(temp);
    var prs = C.detectPRs(temp, DB.state.workouts, DB.exercise);
    var rating = w.rating || 0;
    var setsBy = C.muscleSets(temp.exercises, DB.exercise);
    var top = C.MUSCLE_ORDER.filter(function (m) { return setsBy[m] > 0; }).sort(function (a, b) { return setsBy[b] - setsBy[a]; }).slice(0, 5);

    var prHtml = prs.length ? '<div class="card flat mt-12"><div class="card-hd"><div class="card-title" style="display:flex;align-items:center;gap:6px">' + U.svg('trophy') + 'Novos recordes</div></div>' +
      prs.slice(0, 6).map(function (p) {
        var val = p.type === 'weight' ? DB.fmtW(p.value) + ' ' + DB.unit :
          p.type === 'e1rm' ? DB.fmtW(p.value) + ' ' + DB.unit :
            p.type === 'reps' ? p.value + ' reps' : U.int(DB.toDisplay(p.value)) + ' ' + DB.unit;
        return '<div class="row between" style="padding:6px 0;border-bottom:1px solid var(--line-2)"><div><div style="font-size:13px;font-weight:650">' + U.esc(p.name) + '</div>' +
          '<div class="mini">' + C.prLabel(p.type) + '</div></div><div class="badge pr">' + val + '</div></div>';
      }).join('') + '</div>' : '';

    var sheet = UI.sheet({
      title: 'Terminar treino',
      sub: U.fmtDuration(st.duration) + ' · ' + st.sets + ' séries · ' + U.int(DB.toDisplay(st.volume)) + ' ' + DB.unit,
      tall: true,
      body:
        '<div class="summary-hero"><div class="trophy">' + U.svg('trophy') + '</div>' +
        '<div class="summary-big">' + U.int(DB.toDisplay(st.volume)) + ' <small style="font-size:14px;color:var(--txt-3)">' + DB.unit + '</small></div>' +
        '<div class="mini">volume total</div>' +
        '<div class="rating" data-rating>' + [1, 2, 3, 4, 5].map(function (n) {
          return '<button data-rate="' + n + '" class="' + (n <= rating ? 'on' : '') + '">' + U.svg('star') + '</button>';
        }).join('') + '</div></div>' +
        '<div class="kpis mt-12">' +
        '<div class="kpi"><div class="v">' + U.fmtDuration(st.duration) + '</div><div class="l">Duração</div></div>' +
        '<div class="kpi"><div class="v">' + st.sets + '</div><div class="l">Séries</div></div>' +
        '<div class="kpi"><div class="v">' + st.exercises + '</div><div class="l">Exercícios</div></div>' +
        '<div class="kpi"><div class="v">' + U.int(DB.toDisplay(st.reps)) + '</div><div class="l">Repetições</div></div></div>' +
        prHtml +
        (top.length ? '<div class="card flat mt-12"><div class="card-title mb-8">Repartição muscular</div><div class="bars">' +
          top.map(function (m) {
            return '<div class="bar-row"><div class="bar-name">' + UI.muscleDot(m) + C.muscle(m).label + '</div>' +
              '<div class="bar-track"><div class="bar-fill" style="width:' + Math.round(setsBy[m] / top[0] * 100) + '%;background:' + C.muscle(m).color + '"></div></div>' +
              '<div class="bar-val">' + (setsBy[m] % 1 ? U.num(setsBy[m], 1) : setsBy[m]) + '</div></div>';
          }).join('') + '</div></div>' : '') +
        '<div class="field mt-16"><label class="label">Nome do treino</label><input class="input" id="fn-name" value="' + U.esc(w.name) + '"></div>' +
        '<div class="field"><label class="label">Peso corporal (opcional)</label><div class="input-suffix"><input class="input" id="fn-bw" inputmode="decimal" placeholder="' + (DB.latestWeight() ? DB.fmtW(DB.latestWeight()) : 'ex.: 78,5') + '"><span class="sfx">' + DB.unit + '</span></div></div>' +
        '<div class="field"><label class="label">Notas</label><textarea class="textarea" id="fn-notes" placeholder="Sensações, dores, o que correr bem…">' + U.esc(w.notes || '') + '</textarea></div>',
      foot: '<button class="btn btn-ghost" id="fn-discard" style="flex:0 0 46px;padding:0;color:var(--danger)" aria-label="Descartar">' + U.svg('trash') + '</button>' +
        '<button class="btn btn-primary" id="fn-save">Guardar treino</button>',
      onMount: function (x) {
        x.body.querySelectorAll('[data-rate]').forEach(function (b) {
          b.addEventListener('click', function () {
            rating = +b.getAttribute('data-rate');
            x.body.querySelectorAll('[data-rate]').forEach(function (z) { z.classList.toggle('on', +z.getAttribute('data-rate') <= rating); });
          });
        });
        x.root.querySelector('#fn-save').addEventListener('click', function () {
          var nm = x.body.querySelector('#fn-name').value.trim() || w.name;
          var notes = x.body.querySelector('#fn-notes').value;
          var bw = parseNum(x.body.querySelector('#fn-bw').value);
          var res = DB.finishActive({
            name: nm, notes: notes, rating: rating,
            bodyweight: bw ? DB.displayToKg(bw) : null,
          });
          if (res && res.error) { UI.toast(res.error, 'err'); return; }
          x.close();
          UI.toast(res.prs && res.prs.length ? res.prs.length + ' novo(s) recorde(s)!' : 'Treino guardado', 'ok');
          F.app.go('/history/' + res.workout.id);
        });
        x.root.querySelector('#fn-discard').addEventListener('click', function () {
          UI.confirm({ title: 'Descartar treino?', message: 'Todo o registo deste treino será perdido.', confirmText: 'Descartar', danger: true }).then(function (ok) {
            if (!ok) return;
            DB.discardActive();
            x.close();
            F.timer.stop();
            UI.toast('Treino descartado');
            F.app.go('/');
          });
        });
      },
    });
    return sheet;
  }

  /* ================= vista ativa ================= */
  function activeView(w) {
    var st = C.stats(w);
    var rpe = DB.settings.rpe !== false;
    var grid = rpe ? '30px 1fr 1fr 42px 46px' : '30px 1fr 1fr 70px';
    var elapsed = U.fmtElapsed(w.start);
    var prCount = 0;
    try {
      var tmpLive = JSON.parse(JSON.stringify(w));
      tmpLive.exercises = tmpLive.exercises.map(function (b) {
        return Object.assign({}, b, { sets: (b.sets || []).filter(function (s) { return s.done && Number(s.reps) > 0; }) });
      }).filter(function (b) { return b.sets.length; });
      if (tmpLive.exercises.length) prCount = C.detectPRs(tmpLive, DB.state.workouts, DB.exercise).length;
    } catch (e) {}

    var exHtml = w.exercises.map(function (b, bIdx) {
      var ex = DB.exercise(b.exerciseId);
      var m = C.muscle(ex.primary);
      var prev = DB.lastPerformance(b.exerciseId);
      var prevTxt = '';
      if (prev) {
        var ps = prev.sets.slice(0, 4).map(function (s) { return DB.fmtW(s.weight) + '×' + s.reps; }).join(' · ');
        prevTxt = '<div class="ex-prev">' + U.svg('refresh') + 'Anterior: <b>' + ps + '</b><span style="opacity:.6">· ' + U.relative(prev.date).toLowerCase() + '</span></div>';
      }
      var target = '';
      var routine = w.routineId ? DB.getRoutine(w.routineId) : null;
      if (routine) {
        var re = routine.exercises.filter(function (x) { return x.exerciseId === b.exerciseId; })[0];
        if (re) target = '<span class="badge">' + re.sets + ' × ' + re.reps + '</span>';
      }
      var rows = b.sets.map(function (s, si) {
        var isDone = !!s.done;
        var tag = C.SET_TYPES[s.type] ? C.SET_TYPES[s.type].short : '';
        return '<div class="set-row ' + (isDone ? 'done ' : '') + (s.type === 'warmup' ? 'warmup ' : '') + '" data-set="' + s.id + '" style="grid-template-columns:' + grid + '">' +
          '<button class="set-num" data-setmenu="' + s.id + '" aria-label="Opções da série">' + (si + 1) + (tag ? '<span class="tag">' + tag + '</span>' : '') + '</button>' +
          '<input class="set-in" data-f="weight" inputmode="decimal" value="' + numVal(s.weight) + '" placeholder="—" aria-label="Peso">' +
          '<input class="set-in" data-f="reps" inputmode="numeric" value="' + (s.reps == null ? '' : s.reps) + '" placeholder="—" aria-label="Repetições">' +
          (rpe ? '<input class="set-rpe" data-f="rpe" inputmode="decimal" value="' + (s.rpe == null ? '' : s.rpe) + '" placeholder="RPE" aria-label="RPE">' : '') +
          '<button class="set-check ' + (isDone ? 'on' : '') + '" data-check="' + s.id + '" aria-label="Concluir série">' + U.svg('check') + (rpe ? '' : '<span>' + (isDone ? 'Feito' : 'OK') + '</span>') + '</button>' +
          '</div>';
      }).join('');

      return '<div class="ex-card ' + (b.superset ? 'superset ' : '') + (rpe ? 'rpe' : '') + '" data-ex="' + b.id + '">' +
        '<div class="ex-head"><div class="ex-head-main">' +
        '<div class="row gap-6"><div class="ex-name">' + U.esc(ex.name) + '</div></div>' +
        '<div class="ex-meta">' + UI.muscleDot(ex.primary) + U.esc(m.label) + '<span class="dot-sep"></span>' + U.esc(C.EQUIP[ex.equipment] || '') + (b.superset ? '<span class="dot-sep"></span><span style="color:var(--violet)">Supersérie</span>' : '') + (target ? ' ' + target : '') + '</div>' +
        prevTxt + '</div>' +
        '<button class="ex-menu-btn" data-exmenu="' + b.id + '" aria-label="Opções do exercício">' + U.svg('more') + '</button></div>' +
        '<div class="set-head" style="grid-template-columns:' + grid + '"><span>Série</span><span>' + DB.unit + '</span><span>Reps</span>' + (rpe ? '<span>RPE</span>' : '') + '<span></span></div>' +
        '<div class="set-rows">' + rows + '</div>' +
        '<div class="set-foot"><button class="add-set" data-addset="' + b.id + '">' + U.svg('plus') + 'Série</button>' +
        '<button class="add-set" data-rest="' + b.id + '">' + U.svg('timer') + (b.rest ? U.fmtClock(b.rest) : 'Descanso') + '</button></div>' +
        (b.note ? '<div class="ex-note">' + U.svg('note') + U.esc(b.note) + '</div>' : '') +
        '<div class="ex-tools">' +
        '<button class="ghost-chip" data-plate="' + b.id + '">' + U.svg('plate') + 'Discos</button>' +
        '<button class="ghost-chip" data-warmup="' + b.id + '">' + U.svg('flame') + 'Aquecimento</button>' +
        '<button class="ghost-chip" data-exnote="' + b.id + '">' + U.svg('note') + 'Nota</button>' +
        '</div></div>';
    }).join('');

    var body = w.exercises.length ? exHtml :
      UI.empty({ icon: 'dumbbell', title: 'Treino vazio', text: 'Adiciona o primeiro exercício para começar a registar séries.', action: '<button class="btn btn-primary" data-act="add-ex">Adicionar exercício</button>' });

    var stale = w.stale ? '<div class="card mt-12" style="border-color:var(--warn)"><div class="row between"><div><div class="card-title" style="color:var(--warn)">Treino antigo</div><div class="card-sub">Iniciado há mais de 36 horas.</div></div><button class="btn btn-xs btn-danger" data-act="discard">Descartar</button></div></div>' : '';

    var html = '<div class="screen">' +
      '<header class="screen-head">' +
      '<div class="wo-head">' +
      '<button class="icon-btn plain" data-nav="/" aria-label="Minimizar">' + U.svg('left') + '</button>' +
      '<div class="grow" style="min-width:0">' +
      '<button class="row gap-6" data-act="rename" style="max-width:100%"><span class="nav-title truncate" style="text-align:left">' + U.esc(w.name) + '</span>' + U.svg('pencil', 'chev') + '</button>' +
      '<div class="wo-timer" data-elapsed>' + U.fmtClock(elapsed) + '</div></div>' +
      '<button class="btn btn-sm btn-primary" data-act="finish">Terminar</button>' +
      '</div></header>' +
      '<div class="screen-body">' +
      stale +
      '<div class="wo-stats">' +
      '<div class="wo-stat"><div class="v">' + U.int(DB.toDisplay(st.volume)) + '</div><div class="l">' + DB.unit + ' volume</div></div>' +
      '<div class="wo-stat"><div class="v">' + st.sets + '</div><div class="l">séries</div></div>' +
      '<div class="wo-stat"><div class="v">' + w.exercises.length + '</div><div class="l">exercícios</div></div>' +
      '<div class="wo-stat"><div class="v" data-prcount>' + prCount + '</div><div class="l">recordes</div></div>' +
      '</div>' +
      '<div class="mt-12">' + body + '</div>' +
      '<div class="wo-bottom-pad"></div></div>' +
      '<div class="sticky-cta"><button class="btn btn-soft" data-act="add-ex" style="flex:0 0 52px;padding:0" aria-label="Adicionar exercício">' + U.svg('plus') + '</button>' +
      '<button class="btn btn-primary" data-act="finish" style="flex:1">' + U.svg('check') + 'Terminar treino</button></div>' +
      '</div>';

    return {
      tab: 'workout', title: w.name, html: html, hideTab: true,
      mount: function (root) {
        var iv = setInterval(function () {
          var el = root.querySelector('[data-elapsed]');
          if (el && DB.active()) el.textContent = U.fmtClock(U.fmtElapsed(DB.active().start));
        }, 1000);
        F.app.onUnmount(function () { clearInterval(iv); });

        // inputs
        root.addEventListener('change', function (e) {
          var inp = e.target.closest('[data-f]');
          if (!inp) return;
          syncRow(inp.closest('[data-set]'));
          DB.save(true);
        });

        root.addEventListener('click', function (e) {
          var t = e.target;
          var check = t.closest('[data-check]');
          if (check) { toggleSet(check.closest('[data-set]')); return; }
          var add = t.closest('[data-addset]'); if (add) { addSet(add.getAttribute('data-addset')); return; }
          var num = t.closest('[data-setmenu]'); if (num) { setMenu(num.getAttribute('data-setmenu')); return; }
          var exm = t.closest('[data-exmenu]'); if (exm) { exMenu(exm.getAttribute('data-exmenu')); return; }
          var plate = t.closest('[data-plate]'); if (plate) { openPlates(plate.getAttribute('data-plate')); return; }
          var warm = t.closest('[data-warmup]'); if (warm) { genWarmup(warm.getAttribute('data-warmup')); return; }
          var note = t.closest('[data-exnote]'); if (note) { editExNote(note.getAttribute('data-exnote')); return; }
          var rest = t.closest('[data-rest]'); if (rest) { restMenu(rest.getAttribute('data-rest')); return; }
          var act = t.closest('[data-act]');
          if (act) {
            var a = act.getAttribute('data-act');
            if (a === 'finish') openFinish();
            if (a === 'add-ex') pickExercise();
            if (a === 'rename') renameWorkout();
            if (a === 'discard') {
              UI.confirm({ title: 'Descartar treino?', message: 'Todo o registo será perdido.', confirmText: 'Descartar', danger: true }).then(function (ok) {
                if (!ok) return;
                DB.discardActive(); F.timer.stop(); UI.toast('Treino descartado'); F.app.go('/');
              });
            }
          }
        });

        function refresh(keepScroll) {
          var y = window.scrollY;
          F.app._keepScroll = true;
          F.app.render();
          if (keepScroll) setTimeout(function () { window.scrollTo(0, y); }, 0);
        }
        F.workoutRefresh = refresh;
      },
    };

    /* ---- ações internas ---- */
    function toggleSet(row) {
      if (!row) return;
      var f = syncRow(row);
      if (!f) return;
      var set = f.set;
      if (!set.done) {
        if (!set.reps) {
          UI.toast('Indica as repetições', 'err');
          var ri = row.querySelector('[data-f="reps"]');
          if (ri) ri.focus();
          return;
        }
        set.done = true; set.ts = U.now();
        var pr = C.prsFor(DB.state.workouts, f.block.exerciseId);
        var e = C.e1rm(set.weight, set.reps);
        var exName = DB.exercise(f.block.exerciseId).name;
        var isPR = pr.sessions > 0 && (e > pr.maxE1rm.value + 0.05 || (Number(set.weight) || 0) > pr.maxWeight.value + 0.001);
        if (isPR) UI.toast('Novo recorde em ' + exName + '!', 'ok', 3200);
        if (DB.settings.autoRest !== false) {
          F.timer.start(Number(f.block.rest) || Number(DB.settings.restDefault) || 120, exName);
        }
        U.haptic(12);
      } else {
        set.done = false;
      }
      DB.save(true);
      F.app.refresh();
    }

    function addSet(blockId) {
      var b = findBlock(blockId);
      if (!b) return;
      var last = b.sets[b.sets.length - 1];
      b.sets.push(DB.newSet({
        weight: last ? last.weight : null,
        reps: last ? last.reps : null,
        type: last ? last.type : 'normal',
      }));
      DB.save(); F.app.refresh();
    }

    function setMenu(setId) {
      var f = findSet(setId);
      if (!f) return;
      var set = f.set;
      UI.actions({
        title: 'Série ' + (f.index + 1),
        options: [
          { label: 'Normal', value: 'normal', icon: 'check' },
          { label: 'Aquecimento', value: 'warmup', icon: 'flame' },
          { label: 'Drop set', value: 'drop', icon: 'arrow-down' },
          { label: 'Até à falha', value: 'failure', icon: 'zap' },
          { label: 'Remover série', value: 'remove', icon: 'trash', danger: true },
        ],
      }).then(function (v) {
        if (!v) return;
        if (v === 'remove') {
          if (f.block.sets.length <= 1) { UI.toast('Tem de ficar pelo menos uma série', 'err'); return; }
          f.block.sets = f.block.sets.filter(function (s) { return s.id !== setId; });
        } else {
          set.type = v;
        }
        DB.save(); F.app.refresh();
      });
    }

    function exMenu(blockId) {
      var b = findBlock(blockId);
      if (!b) return;
      var idx = DB.active().exercises.indexOf(b);
      var opts = [
        { label: 'Substituir exercício', value: 'replace', icon: 'refresh' },
        { label: 'Mover para cima', value: 'up', icon: 'up' },
        { label: 'Mover para baixo', value: 'down', icon: 'arrow-down' },
        { label: 'Descanso entre séries', value: 'rest', icon: 'timer', sub: b.rest ? U.fmtClock(b.rest) : 'predefinido' },
        { label: b.superset ? 'Remover supersérie' : 'Supersérie com o anterior', value: 'superset', icon: 'zap' },
        { label: 'Gerar séries de aquecimento', value: 'warm', icon: 'flame' },
        { label: 'Calculadora de discos', value: 'plates', icon: 'plate' },
        { label: 'Remover exercício', value: 'remove', icon: 'trash', danger: true },
      ];
      UI.actions({ title: DB.exercise(b.exerciseId).name, options: opts }).then(function (v) {
        if (!v) return;
        if (v === 'up') DB.moveExercise(blockId, -1);
        else if (v === 'down') DB.moveExercise(blockId, 1);
        else if (v === 'remove') DB.removeExerciseFromActive(blockId);
        else if (v === 'superset') {
          b.superset = b.superset ? 0 : 1;
          if (idx > 0) DB.active().exercises[idx - 1].superset = b.superset;
        } else if (v === 'warm') { doWarmup(b); return; }
        else if (v === 'plates') { openPlates(blockId); return; }
        else if (v === 'rest') { restMenu(blockId); return; }
        else if (v === 'replace') {
          UI.pickExercise({ title: 'Substituir por' }).then(function (ex) {
            if (!ex) return;
            b.exerciseId = ex.id;
            b.rest = DB.guessRest(ex.id);
            b.sets.forEach(function (s) { s.done = false; });
            DB.save(); UI.toast('Exercício substituído'); F.app.refresh();
          });
          return;
        }
        DB.save(); F.app.refresh();
      });
    }

    function restMenu(blockId) {
      var b = findBlock(blockId);
      if (!b) return;
      UI.actions({
        title: 'Descanso',
        options: [45, 60, 90, 120, 150, 180, 240].map(function (s) {
          return { label: U.fmtClock(s), value: s, icon: 'timer', sub: s + ' segundos' };
        }).concat([{ label: 'Sem descanso (0)', value: 0, icon: 'x' }]),
      }).then(function (v) {
        if (v == null) return;
        b.rest = v;
        DB.save();
        UI.toast(v ? 'Descanso: ' + U.fmtClock(v) : 'Sem descanso');
        F.app.refresh();
      });
    }

    function editExNote(blockId) {
      var b = findBlock(blockId);
      if (!b) return;
      UI.prompt({ title: 'Nota do exercício', label: 'Técnica, sensações, ajustes', value: b.note || '', multiline: true, placeholder: 'Ex.: punho neutro, parar 1 cm antes do peito' }).then(function (v) {
        if (v == null) return;
        b.note = v.trim();
        DB.save(); F.app.refresh();
      });
    }

    function openPlates(blockId) {
      var b = findBlock(blockId);
      var weight = 0;
      if (b) {
        var best = b.sets.filter(function (s) { return Number(s.weight) > 0; }).sort(function (a, c) { return c.weight - a.weight; })[0];
        weight = best ? best.weight : 0;
      }
      UI.plateSheet(weight || 60);
    }

    function doWarmup(b) {
      var work = 0;
      b.sets.forEach(function (s) { if (s.type !== 'warmup' && Number(s.weight) > work) work = Number(s.weight); });
      if (!work) { UI.toast('Preenche o peso de trabalho primeiro', 'err'); return; }
      var list = C.warmup(work, DB.settings.bar, DB.settings.plates);
      if (!list.length) { UI.toast('Peso demasiado leve para aquecimento', 'err'); return; }
      list.reverse().forEach(function (w) {
        b.sets.unshift(DB.newSet({ type: 'warmup', weight: w.weight, reps: w.reps }));
      });
      DB.save(); UI.toast(list.length + ' séries de aquecimento adicionadas'); F.app.refresh();
    }
    function genWarmup(blockId) {
      var b = findBlock(blockId);
      if (b) doWarmup(b);
    }

    function renameWorkout() {
      var w2 = DB.active();
      UI.prompt({ title: 'Nome do treino', label: 'Nome', value: w2.name }).then(function (v) {
        if (v == null || !v.trim()) return;
        w2.name = v.trim(); DB.save(); F.app.refresh();
      });
    }

    function pickExercise() {
      UI.pickExercise({ title: 'Adicionar exercício' }).then(function (ex) {
        if (!ex) return;
        DB.addExerciseToActive(ex.id);
        DB.save();
        F.app.refresh();
        setTimeout(function () { window.scrollTo(0, document.body.scrollHeight); }, 60);
      });
    }
  }

  /* ================= vista inicial ================= */
  function startView() {
    var routines = DB.state.routines;
    var last = DB.state.workouts[0];
    var list = routines.map(function (r) {
      var exs = r.exercises.slice(0, 4).map(function (e) { return DB.exercise(e.exerciseId); });
      var ld = DB.routineLastDate(r.id);
      return '<button class="routine-card" data-start="' + r.id + '" style="text-align:left">' +
        '<div class="routine-top"><div class="grow"><div class="routine-name">' + U.esc(r.name) + '</div>' +
        '<div class="routine-tags"><span class="badge">' + r.exercises.length + ' exercícios</span>' +
        (r.folder ? '<span class="badge violet">' + U.esc(r.folder) + '</span>' : '') +
        (ld ? '<span class="mini">' + U.relative(ld).toLowerCase() + '</span>' : '<span class="badge accent">Nova</span>') +
        '</div></div><div class="item-thumb" style="color:var(--accent-text)">' + U.svg('play') + '</div></div>' +
        '<div class="routine-ex">' + exs.map(function (e, i) {
          return '<div class="routine-ex-line"><span class="n">' + (i + 1) + '</span>' + UI.muscleDot(e.primary) + '<span class="t">' + U.esc(e.name) + '</span></div>';
        }).join('') + '</div>' +
        (r.exercises.length > 4 ? '<div class="routine-more">+' + (r.exercises.length - 4) + ' exercícios</div>' : '') +
        '</button>';
    }).join('');

    var html = '<div class="screen">' +
      '<header class="screen-head"><div class="page-head"><div><div class="eyebrow">' + U.esc(UI.todayLabel()) + '</div><h1 class="page-title">Treinar</h1></div>' +
      '<button class="icon-btn" data-nav="/settings" aria-label="Definições">' + U.svg('gear') + '</button></div></header>' +
      '<div class="screen-body">' +
      '<div class="hero"><div class="eyebrow">Sessão livre</div><div class="hero-title">Sem plano?<br>Regista à medida.</div>' +
      '<div class="mini mt-8">Adiciona exercícios à medida que avanças. O Ferro lembra-se dos teus pesos.</div>' +
      '<div class="hero-actions"><button class="btn btn-primary" data-act="start-empty">' + U.svg('plus') + 'Começar treino</button></div></div>' +
      (last ? '<div class="sec"><div class="sec-head"><div class="sec-title">Continuar de onde paraste</div></div>' +
        '<button class="item" data-act="repeat" style="width:100%;text-align:left"><div class="item-thumb">' + U.svg('repeat') + '</div>' +
        '<div class="item-main"><div class="item-title">' + U.esc(last.name) + '</div><div class="item-sub">' + U.relative(last.start) + ' · ' + last.exercises.length + ' exercícios</div></div>' +
        '<div class="badge accent">Repetir</div></button></div>' : '') +
      '<div class="sec"><div class="sec-head"><div class="sec-title">Rotinas</div><button class="sec-link" data-nav="/routines">Gerir</button></div>' +
      (routines.length ? '<div class="col gap-12">' + list + '</div>' :
        UI.empty({ icon: 'folder', title: 'Sem rotinas', text: 'Cria uma rotina ou usa um programa pronto.', action: '<button class="btn btn-primary btn-sm" data-nav="/routines">Ver programas</button>' })) +
      '</div></div></div>';

    return {
      tab: 'workout', title: 'Treinar', html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var st = e.target.closest('[data-start]');
          if (st) {
            DB.startWorkout({ routineId: st.getAttribute('data-start') });
            F.app.go('/workout');
            return;
          }
          var act = e.target.closest('[data-act]');
          if (!act) return;
          if (act.getAttribute('data-act') === 'start-empty') {
            if (!DB.active()) DB.startWorkout({ name: 'Treino livre' });
            F.app.go('/workout');
          }
          if (act.getAttribute('data-act') === 'repeat' && last) {
            var res = DB.repeatWorkout(last.id);
            if (res && res.error) { UI.toast(res.error, 'err'); return; }
            F.app.go('/workout');
          }
        });
      },
    };
  }

  F.views.workout = function () {
    var w = DB.active();
    return w ? activeView(w) : startView();
  };
})();
