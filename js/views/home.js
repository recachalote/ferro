/* =========================================================
   FERRO — Início
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, C = F.calc, DB = F.db, UI = F.ui;

  function fmtVol(kg) {
    var v = DB.toDisplay(kg);
    return U.int(v);
  }
  function weekStrip() {
    var fd = DB.settings.firstDay == null ? 1 : DB.settings.firstDay;
    var start = U.startOfWeek(new Date(), fd);
    var days = [];
    for (var i = 0; i < 7; i++) {
      var d = U.addDays(start, i);
      var key = U.dateKey(d);
      var done = DB.state.workouts.some(function (w) { return U.dateKey(w.start) === key; });
      days.push({ d: d, done: done, today: key === U.todayKey() });
    }
    return days;
  }

  function openCheckin() {
    var cur = DB.todayCheckin() || { sleep: 3, energy: 3, soreness: 2, stress: 2 };
    var vals = { sleep: cur.sleep, energy: cur.energy, soreness: cur.soreness, stress: cur.stress };
    var rows = [
      { k: 'sleep', label: 'Sono', hint: 'Como dormiste?' },
      { k: 'energy', label: 'Energia', hint: 'Níveis de energia' },
      { k: 'soreness', label: 'Dores musculares', hint: '1 = nada, 5 = muito' },
      { k: 'stress', label: 'Stress', hint: '1 = calmo, 5 = muito' },
    ];
    var s = UI.sheet({
      title: 'Prontidão de hoje',
      sub: 'Ajusta a intensidade ao que o corpo pede',
      tall: false,
      body: rows.map(function (r) {
        return '<div class="field"><div class="row between"><label class="label" style="margin:0">' + r.label + '</label><span class="mini">' + r.hint + '</span></div>' +
          '<div class="seg mt-8" data-k="' + r.k + '">' + [1, 2, 3, 4, 5].map(function (n) {
            return '<button class="seg-item' + (vals[r.k] === n ? ' on' : '') + '" data-v="' + n + '">' + n + '</button>';
          }).join('') + '</div></div>';
      }).join('') + '<div id="ck-preview" class="calc-out mt-8"></div>',
      foot: '<button class="btn btn-soft" data-sheet-close>Cancelar</button><button class="btn btn-primary" id="ck-save">Registar</button>',
      onMount: function (x) {
        function preview() {
          var r = C.readiness(vals);
          x.body.querySelector('#ck-preview').innerHTML = '<div class="l">Prontidão</div><div class="v" style="font-size:26px">' + r.score + '<small>/100</small></div><div class="mini">' + U.esc(r.tip) + '</div>';
        }
        x.body.addEventListener('click', function (e) {
          var b = e.target.closest('.seg-item');
          if (!b) return;
          var seg = b.closest('[data-k]');
          var k = seg.getAttribute('data-k');
          vals[k] = +b.getAttribute('data-v');
          seg.querySelectorAll('.seg-item').forEach(function (z) { z.classList.remove('on'); });
          b.classList.add('on');
          preview();
        });
        x.root.querySelector('#ck-save').addEventListener('click', function () {
          DB.addCheckin(vals);
          x.close();
          UI.toast('Check-in registado');
          F.app.refresh();
        });
        preview();
      },
    });
    return s;
  }

  F.views.home = function () {
    var st = DB.state, s = DB.settings;
    var active = DB.active();
    var week = DB.weekStats();
    var streak = C.streak(st.workouts, s.firstDay);
    var next = DB.nextRoutine();
    var check = DB.todayCheckin();
    var days = weekStrip();
    var goal = Math.max(1, Number(s.weeklyGoal) || 1);
    var name = s.name || 'Atleta';
    var setsByMuscle = DB.muscleSetsThisWeek();
    var focus = ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'glutes', 'abs'];
    var recent = st.workouts.slice(0, 3);

    var activeHtml = '';
    if (active) {
      var aStats = C.stats(active);
      activeHtml = '<button class="card glow" data-nav="/workout" style="width:100%;text-align:left;margin-bottom:12px;overflow:hidden">' +
        '<div class="row between"><div class="row gap-8"><span class="dot"></span><b style="font-size:13px">TREINO EM CURSO</b></div><span class="badge accent">Retomar</span></div>' +
        '<div class="row between mt-12"><div style="min-width:0"><div class="h2 truncate">' + U.esc(active.name) + '</div>' +
        '<div class="mini mt-4">' + active.exercises.length + ' exercícios · ' + aStats.sets + ' séries · ' + U.int(DB.toDisplay(aStats.volume)) + ' ' + DB.unit + '</div></div>' +
        '<div class="hero-big num" style="font-size:26px" data-elapsed>' + U.fmtClock(U.fmtElapsed(active.start)) + '</div></div></button>';
    }

    var heroHtml = '';
    if (!active && next) {
      var last = DB.routineLastDate(next.id);
      var nEx = next.exercises.length;
      var vol = U.sum(next.exercises, function (e) { return 0; });
      heroHtml = '<div class="hero">' +
        '<div class="row between"><div class="eyebrow">Próximo treino</div>' + (streak.weeks > 0 ? '<div class="streak">' + U.svg('flame') + streak.weeks + ' sem</div>' : '') + '</div>' +
        '<div class="hero-title">' + U.esc(next.name) + '</div>' +
        '<div class="mini mt-4">' + nEx + ' exercícios · ' + (last ? 'última vez ' + U.relative(last).toLowerCase() : 'ainda por estrear') + '</div>' +
        '<div class="hero-actions"><button class="btn btn-primary" data-act="start-next">' + U.svg('play') + 'Iniciar treino</button>' +
        '<button class="btn btn-soft" data-nav="/routines" style="flex:0 0 54px;padding:0" aria-label="Rotinas">' + U.svg('list') + '</button></div>' +
        '<div class="divider" style="margin:16px 0 12px"></div>' +
        '<div class="row between"><div class="mini">' + week.workouts + ' de ' + goal + ' treinos esta semana</div><div class="mini">' + Math.round((week.workouts / goal) * 100) + '%</div></div>' +
        '<div class="week-dots">' + days.map(function (d) {
          return '<div class="week-dot ' + (d.done ? 'done' : '') + ' ' + (d.today ? 'today' : '') + '"></div>';
        }).join('') + '</div>' +
        '<div class="week-labels">' + days.map(function (d) {
          return '<span>' + U.DAYS_S[d.d.getDay()].charAt(0).toUpperCase() + '</span>';
        }).join('') + '</div></div>';
    } else if (!active && !next) {
      heroHtml = '<div class="hero"><div class="eyebrow">Começar</div>' +
        '<div class="hero-title">O teu primeiro treino começa aqui.</div>' +
        '<div class="mini mt-8" style="max-width:280px">Cria uma rotina ou usa um dos programas prontos. Tudo incluído, sem paywalls.</div>' +
        '<div class="hero-actions"><button class="btn btn-primary" data-nav="/routines">' + U.svg('plus') + 'Criar rotina</button>' +
        '<button class="btn btn-soft" data-act="start-empty">Treino vazio</button></div></div>';
    }

    var checkHtml;
    if (check) {
      var r = C.readiness(check);
      checkHtml = '<div class="card tight"><div class="readiness"><div class="ring">' +
        '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="none" stroke="var(--card-3)" stroke-width="4"/>' +
        '<circle cx="24" cy="24" r="19" fill="none" stroke="' + (r.score >= 70 ? 'var(--accent)' : r.score >= 45 ? 'var(--warn)' : 'var(--danger)') + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (2 * Math.PI * 19).toFixed(1) + '" stroke-dashoffset="' + (2 * Math.PI * 19 * (1 - r.score / 100)).toFixed(1) + '"/></svg>' +
        '<div class="rv">' + r.score + '</div></div>' +
        '<div class="grow"><div class="row between"><div class="card-title">Prontidão ' + r.label.toLowerCase() + '</div><button class="mini accent" data-act="checkin">Editar</button></div>' +
        '<div class="card-sub" style="margin-top:2px;line-height:1.35">' + U.esc(r.tip) + '</div></div></div></div>';
    } else {
      checkHtml = '<div class="card tight"><div class="row between"><div class="row gap-10"><div class="item-thumb" style="color:var(--accent-text)">' + U.svg('heart') + '</div>' +
        '<div><div class="card-title">Como estás hoje?</div><div class="card-sub">Check-in de 20 segundos</div></div></div>' +
        '<button class="btn btn-sm btn-soft" data-act="checkin">Começar</button></div></div>';
    }

    var bars = focus.map(function (m) {
      return { m: m, v: setsByMuscle[m] || 0, target: Number(s.targets[m]) || 0 };
    });
    var barsHtml = bars.map(function (b) {
      var pct = b.target ? Math.min(100, Math.round((b.v / b.target) * 100)) : 0;
      var color = C.muscle(b.m).color;
      return '<div class="bar-row"><div class="bar-name">' + UI.muscleDot(b.m) + U.esc(C.muscle(b.m).label) + '</div>' +
        '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
        '<div class="bar-val">' + (b.v % 1 ? U.num(b.v, 1) : b.v) + '<small>/' + b.target + '</small></div></div>';
    }).join('');

    var recentHtml = recent.length
      ? recent.map(function (w) {
        var stt = C.stats(w);
        return '<button class="hist-row" data-nav="/history/' + w.id + '" style="width:100%;text-align:left;background:none;align-items:center">' +
          '<div class="hist-date"><div class="d">' + U.parse(w.start).getDate() + '</div><div class="m">' + U.monthShort(w.start) + '</div></div>' +
          '<div class="hist-main"><div class="hist-name">' + U.esc(w.name) + '</div>' +
          '<div class="hist-meta"><span>' + U.fmtDuration(stt.duration) + '</span><span><b>' + U.int(DB.toDisplay(stt.volume)) + '</b> ' + DB.unit + '</span><span>' + stt.sets + ' séries</span></div></div>' +
          '<div class="chev">' + U.svg('right') + '</div></button>';
      }).join('')
      : UI.empty({ icon: 'dumbbell', title: 'Ainda sem treinos', text: 'Quando terminares o primeiro treino, aparece aqui.', action: '<button class="btn btn-primary btn-sm" data-act="start-empty">Começar agora</button>' });

    var html = '<div class="screen">' +
      '<header class="screen-head"><div class="greet-row"><div style="min-width:0">' +
      '<div class="eyebrow">' + U.esc(UI.todayLabel()) + '</div>' +
      '<h1 class="greet">' + U.esc(UI.greeting()) + ', ' + U.esc(name.split(' ')[0]) + '</h1></div>' +
      '<button class="avatar" data-nav="/settings" aria-label="Perfil">' + U.esc(U.initials(name)) + '</button></div></header>' +
      '<div class="screen-body">' +
      activeHtml + heroHtml + '<div class="mt-12">' + checkHtml + '</div>' +
      '<div class="kpis mt-12">' +
      '<div class="kpi"><div class="v">' + fmtVol(week.volume) + ' <small>' + DB.unit + '</small></div><div class="l">Volume esta semana</div></div>' +
      '<div class="kpi"><div class="v">' + week.workouts + ' <small>/ ' + goal + '</small></div><div class="l">Treinos</div></div>' +
      '<div class="kpi"><div class="v">' + week.sets + '</div><div class="l">Séries</div></div>' +
      '<div class="kpi"><div class="v">' + U.fmtDuration(week.duration) + '</div><div class="l">Tempo de treino</div></div>' +
      '</div>' +
      (week.sets ? '<div class="sec"><div class="sec-head"><div class="sec-title">Séries por músculo</div><button class="sec-link" data-nav="/progress">Detalhe</button></div>' +
      '<div class="card"><div class="bars">' + barsHtml + '</div>' +
      '<div class="mini mt-12">Objetivo semanal · ajusta em Definições</div></div></div>' : '') +
      '<div class="sec"><div class="sec-head"><div class="sec-title">Últimos treinos</div><button class="sec-link" data-nav="/history">Ver todos</button></div>' +
      '<div class="card" style="padding:4px 14px">' + recentHtml + '</div></div>' +
      '<div class="sec"><div class="sec-head"><div class="sec-title">Atalhos</div></div>' +
      '<div class="quick-grid">' +
      '<button class="quick" data-nav="/exercises"><div class="qic">' + U.svg('book') + '</div><div><div class="qt">Exercícios</div><div class="qs">' + DB.allExercises().length + ' na biblioteca</div></div></button>' +
      '<button class="quick" data-nav="/tools"><div class="qic">' + U.svg('calc') + '</div><div><div class="qt">Ferramentas</div><div class="qs">1RM, discos, timers</div></div></button>' +
      '<button class="quick" data-nav="/body"><div class="qic">' + U.svg('scale') + '</div><div><div class="qt">Corpo</div><div class="qs">Peso, medidas, fotos</div></div></button>' +
      '<button class="quick" data-nav="/achievements"><div class="qic">' + U.svg('trophy') + '</div><div><div class="qt">Conquistas</div><div class="qs">Melhor: ' + streak.bestWeeks + ' semanas</div></div></button>' +
      '</div></div>' +
      '<div class="center mini mt-24" style="opacity:.55">Feito para ti. Os dados ficam no teu iPhone.</div>' +
      '</div></div>';

    return {
      tab: 'home', title: 'Início', html: html,
      mount: function (root) {
        var iv = setInterval(function () {
          var el = root.querySelector('[data-elapsed]');
          if (el && DB.active()) el.textContent = U.fmtClock(U.fmtElapsed(DB.active().start));
        }, 1000);
        F.app.onUnmount(function () { clearInterval(iv); });

        root.addEventListener('click', function (e) {
          var act = e.target.closest('[data-act]');
          if (!act) return;
          var a = act.getAttribute('data-act');
          if (a === 'start-next') {
            var r = DB.nextRoutine();
            if (r) { DB.startWorkout({ routineId: r.id }); F.app.go('/workout'); }
            else F.app.go('/routines');
          }
          if (a === 'start-empty') {
            if (!DB.active()) DB.startWorkout({ name: 'Treino livre' });
            F.app.go('/workout');
          }
          if (a === 'checkin') openCheckin();
        });
      },
    };
  };
})();
