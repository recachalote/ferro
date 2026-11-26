/* =========================================================
   FERRO — Progresso
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, C = F.calc, DB = F.db, UI = F.ui;
  var exId = null;
  var metric = 'e1rm';
  var METRICS = [
    { k: 'e1rm', label: '1RM' },
    { k: 'weight', label: 'Peso' },
    { k: 'volume', label: 'Volume' },
    { k: 'reps', label: 'Reps' },
  ];

  function pickDefaultExercise() {
    if (exId && DB.hasExercise(exId)) return exId;
    var recent = DB.recentExercises(1);
    if (recent.length) { exId = recent[0].id; return exId; }
    var hist = DB.state.workouts[0];
    if (hist && hist.exercises.length) exId = hist.exercises[0].exerciseId;
    return exId;
  }

  F.views.progress = function () {
    pickDefaultExercise();
    var workouts = DB.state.workouts;
    var fd = DB.settings.firstDay == null ? 1 : DB.settings.firstDay;
    var ex = exId ? DB.exercise(exId) : null;
    var hist = exId ? C.exerciseHistory(workouts, exId) : [];
    var pr = exId ? C.prsFor(workouts, exId) : null;
    var weekly = C.weeklySeries(workouts, 12, fd);
    var streak = C.streak(workouts, fd);
    var heat = C.heat(workouts, 26, fd);
    var balance = C.balance(DB.muscleSetsThisWeek());
    var totalVol = U.sum(weekly, function (w) { return w.volume; });

    var labels = hist.slice(-12).map(function (h) { return U.fmtDate(h.date, 'short'); });
    var data = hist.slice(-12).map(function (h) {
      var v = metric === 'e1rm' ? h.e1rm : metric === 'weight' ? h.topWeight : metric === 'volume' ? DB.toDisplay(h.volume) : h.topReps;
      return { x: h.date, y: Math.round(v * 10) / 10, label: U.fmtDate(h.date, 'short') };
    });
    var lastVal = data.length ? data[data.length - 1].y : 0;
    var firstVal = data.length ? data[0].y : 0;
    var delta = lastVal - firstVal;
    var unit = metric === 'reps' ? 'reps' : DB.unit;
    var yFmt = metric === 'volume' ? function (v) { return U.int(v); } : function (v) { return U.num(v, v % 1 ? 1 : 0); };

    var chartHtml = '<div class="chart-wrap"><div class="chart-top"><div>' +
      '<div class="chart-val">' + (data.length ? U.num(lastVal, lastVal % 1 ? 1 : 0) : '—') + ' <small style="font-size:12px;color:var(--txt-3);font-weight:600">' + unit + '</small></div>' +
      '<div class="chart-lab">' + (METRICS.filter(function (m) { return m.k === metric; })[0] || {}).label + ' estimado · últimas ' + Math.min(12, hist.length) + ' sessões</div></div>' +
      (data.length > 1 ? '<div class="delta ' + (delta >= 0 ? 'up' : 'down') + '">' + (delta >= 0 ? '+' : '') + U.num(delta, Math.abs(delta) % 1 ? 1 : 0) + ' ' + unit + '</div>' : '') +
      '</div><div class="chart-box"><canvas id="pg-chart"></canvas></div>' +
      (labels.length ? '<div class="chart-x"><span>' + labels[0] + '</span><span>' + labels[labels.length - 1] + '</span></div>' : '') + '</div>';

    var prHtml = pr ? '<div class="pr-grid mt-12">' +
      '<div class="pr-card"><div class="l">1RM estimado</div><div class="v">' + DB.fmtW(pr.maxE1rm.value) + ' <small>' + DB.unit + '</small></div><div class="d">' + (pr.maxE1rm.date ? U.fmtDate(pr.maxE1rm.date, 'short') : '—') + '</div></div>' +
      '<div class="pr-card"><div class="l">Peso máximo</div><div class="v">' + DB.fmtW(pr.maxWeight.value) + ' <small>' + DB.unit + '</small></div><div class="d">' + (pr.maxWeight.value ? pr.maxWeight.reps + ' reps' : '—') + '</div></div>' +
      '<div class="pr-card"><div class="l">Reps máximas</div><div class="v">' + (pr.maxReps.value || '—') + ' <small>reps</small></div><div class="d">' + (pr.maxReps.weight ? DB.fmtW(pr.maxReps.weight) + ' ' + DB.unit : '') + '</div></div>' +
      '<div class="pr-card"><div class="l">Melhor série</div><div class="v">' + U.int(DB.toDisplay(pr.maxSetVolume.value)) + ' <small>' + DB.unit + '</small></div><div class="d">volume</div></div>' +
      '</div>' : '';

    var sessions = hist.slice(-4).reverse().map(function (h) {
      return '<button class="item" data-session="' + h.workoutId + '" style="padding:10px 12px"><div class="item-main">' +
        '<div class="row between"><div class="item-title" style="font-size:13px">' + U.fmtDate(h.date, 'short') + '</div><div class="mini">' + h.sets + ' séries</div></div>' +
        '<div class="item-sub">' + DB.fmtW(h.topWeight) + ' ' + DB.unit + ' × ' + h.topReps + ' · ' + U.int(DB.toDisplay(h.volume)) + ' ' + DB.unit + ' volume</div></div>' +
        '<div class="chev">' + U.svg('right') + '</div></button>';
    }).join('');

    var heatCells = heat.cells.map(function (c) {
      if (!c) return '<div></div>';
      return '<div class="heat-cell ' + (c.level ? 'l' + c.level : '') + '" title="' + U.fmtDate(c.date, 'short') + (c.n ? ' · ' + c.n + ' treino(s)' : '') + '"></div>';
    }).join('');

    var muscles = C.MUSCLE_ORDER.filter(function (m) { return (DB.settings.targets[m] || 0) > 0; }).slice(0, 9);
    var monthSets = C.muscleTotals(workouts.filter(function (w) { return U.diffDays(new Date(), w.start) <= 28; }), DB.exercise);
    var bars = muscles.map(function (m) {
      var target = (Number(DB.settings.targets[m]) || 0) * 4;
      var v = monthSets[m] || 0;
      var pct = target ? Math.min(100, Math.round(v / target * 100)) : 0;
      return { m: m, v: v, target: target, pct: pct };
    }).sort(function (a, b) { return b.pct - a.pct; });

    var bodyW = DB.state.weights;
    var bodyCard = bodyW.length ? (function () {
      var latest = bodyW[bodyW.length - 1];
      var first = bodyW[Math.max(0, bodyW.length - 12)];
      var d = latest.value - first.value;
      return '<div class="card"><div class="row between"><div><div class="card-title">Peso corporal</div><div class="mini">' + U.relative(latest.date) + '</div></div>' +
        '<div style="text-align:right"><div class="h2 num">' + DB.fmtW(latest.value, 1) + ' <small style="font-size:11px;color:var(--txt-3)">' + DB.unit + '</small></div>' +
        '<div class="delta ' + (d <= 0 ? 'up' : 'down') + '" style="margin-top:2px">' + (d > 0 ? '+' : '') + U.num(d, 1) + ' ' + DB.unit + '</div></div></div>' +
        '<div class="chart-box" style="height:90px;margin-top:8px"><canvas id="pg-bw"></canvas></div></div>';
    })() : '';

    if (!workouts.length) {
      return {
        tab: 'progress', title: 'Progresso',
        html: '<div class="screen"><header class="screen-head"><div class="page-head"><div><div class="eyebrow">Análise</div><h1 class="page-title">Progresso</h1></div></div></header><div class="screen-body">' +
          UI.empty({ icon: 'chart', title: 'Sem dados ainda', text: 'Completa o primeiro treino para veres gráficos, recordes e equilíbrio muscular.', action: '<button class="btn btn-primary btn-sm" data-nav="/workout">Treinar agora</button>' }) + '</div></div>',
      };
    }

    var html = '<div class="screen">' +
      '<header class="screen-head"><div class="page-head"><div><div class="eyebrow">' + workouts.length + ' treinos · ' + U.int(DB.toDisplay(totalVol / 1000)) + 't levantadas</div><h1 class="page-title">Progresso</h1></div>' +
      '<button class="icon-btn" data-nav="/history" aria-label="Histórico">' + U.svg('calendar') + '</button></div></header>' +
      '<div class="screen-body">' +
      (ex ? '<div class="card tight"><button class="row between" data-act="pick-ex" style="width:100%"><div class="row gap-10" style="min-width:0">' +
        '<div class="item-thumb" style="background:' + C.muscle(ex.primary).color + '1a;color:' + C.muscle(ex.primary).color + '">' + U.svg('dumbbell') + '</div>' +
        '<div style="min-width:0"><div class="item-title truncate">' + U.esc(ex.name) + '</div><div class="item-sub">' + U.esc(C.muscle(ex.primary).label) + ' · ' + (pr ? pr.sessions : 0) + ' sessões</div></div></div>' +
        '<div class="chev">' + U.svg('down') + '</div></button></div>' +
        '<div class="seg mt-12">' + METRICS.map(function (m) { return '<button class="seg-item ' + (metric === m.k ? 'on' : '') + '" data-metric="' + m.k + '">' + m.label + '</button>'; }).join('') + '</div>' +
        chartHtml +
        (data.length < 2 ? '<div class="mini center mt-8">Regista este exercício mais vezes para veres a evolução.</div>' : '') +
        prHtml +
        (sessions ? '<div class="sec"><div class="sec-head"><div class="sec-title">Últimas sessões</div></div><div class="card" style="padding:4px 10px">' + sessions + '</div></div>' : '') +
        '<div class="row gap-8 mt-12"><button class="btn btn-sm btn-soft grow" data-act="add-routine">' + U.svg('plus') + 'Adicionar a rotina</button>' +
        '<button class="btn btn-sm btn-ghost" data-act="ex-detail">' + U.svg('info') + 'Detalhe</button></div>' : '') +

      '<div class="sec"><div class="sec-head"><div class="sec-title">Volume semanal</div><span class="mini">12 semanas · ' + U.int(DB.toDisplay(totalVol)) + ' ' + DB.unit + '</span></div>' +
      '<div class="chart-wrap"><div class="chart-box"><canvas id="pg-vol"></canvas></div></div></div>' +

      '<div class="sec"><div class="sec-head"><div class="sec-title">Consistência</div><span class="badge ' + (streak.weeks ? 'accent' : '') + '">' + streak.weeks + ' sem seguidas</span></div>' +
      '<div class="card"><div class="heat-wrap"><div class="heat">' + heatCells + '</div></div>' +
      '<div class="heat-legend"><span>Menos</span><i></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><span>Mais</span></div>' +
      '<div class="row mt-12" style="gap:0"><div class="center grow"><div class="strong num">' + streak.totalWeeks + '</div><div class="mini">semanas ativas</div></div>' +
      '<div class="center grow"><div class="strong num">' + streak.bestWeeks + '</div><div class="mini">melhor sequência</div></div>' +
      '<div class="center grow"><div class="strong num">' + streak.days + '</div><div class="mini">dias seguidos</div></div></div></div></div>' +

      '<div class="sec"><div class="sec-head"><div class="sec-title">Equilíbrio muscular</div><span class="mini">28 dias</span></div>' +
      '<div class="card"><div class="bars">' + bars.map(function (b) {
        return '<div class="bar-row"><div class="bar-name">' + UI.muscleDot(b.m) + C.muscle(b.m).label + '</div>' +
          '<div class="bar-track"><div class="bar-fill" style="width:' + b.pct + '%;background:' + C.muscle(b.m).color + '"></div></div>' +
          '<div class="bar-val">' + (b.v % 1 ? U.num(b.v, 1) : b.v) + '<small>/' + b.target + '</small></div></div>';
      }).join('') + '</div>' +
      '<div class="divider"></div>' +
      '<div class="row" style="gap:0"><div class="center grow"><div class="strong num" style="color:var(--info)">' + Math.round(balance.push) + '</div><div class="mini">push</div></div>' +
      '<div class="center grow"><div class="strong num" style="color:var(--violet)">' + Math.round(balance.pull) + '</div><div class="mini">pull</div></div>' +
      '<div class="center grow"><div class="strong num" style="color:var(--accent-text)">' + Math.round(balance.legs) + '</div><div class="mini">pernas</div></div></div>' +
      '<div class="mini center mt-8">' + (balance.pushPull ? 'Ratio push/pull ' + U.num(balance.pushPull, 2) + ' · ideal 0,8–1,2' : 'Sem séries suficientes') + '</div></div></div>' +

      (bodyCard ? '<div class="sec"><div class="sec-head"><div class="sec-title">Peso corporal</div><button class="sec-link" data-nav="/body">Gerir</button></div>' + bodyCard + '</div>' : '') +
      '<div style="height:20px"></div></div></div>';

    return {
      tab: 'progress', title: 'Progresso', html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var m = e.target.closest('[data-metric]');
          if (m) { metric = m.getAttribute('data-metric'); F.app.refresh(); return; }
          var s = e.target.closest('[data-session]');
          if (s) { F.app.go('/history/' + s.getAttribute('data-session')); return; }
          var act = e.target.closest('[data-act]');
          if (!act) return;
          var a = act.getAttribute('data-act');
          if (a === 'pick-ex') {
            UI.pickExercise({ title: 'Escolher exercício' }).then(function (ex2) {
              if (!ex2) return;
              exId = ex2.id; F.app.refresh();
            });
          }
          if (a === 'add-routine' && ex) {
            var routes = DB.state.routines;
            if (!routes.length) { UI.toast('Cria primeiro uma rotina', 'err'); return; }
            UI.actions({
              title: 'Adicionar a que rotina?',
              options: routes.map(function (r) { return { label: r.name, value: r.id, sub: r.exercises.length + ' exercícios', icon: 'folder' }; }),
            }).then(function (id) {
              if (!id) return;
              var r = DB.getRoutine(id);
              r.exercises.push({ id: U.uid('re'), exerciseId: exId, sets: 3, reps: '8-12', rest: DB.guessRest(exId), note: '', superset: 0 });
              DB.saveRoutine(r); UI.toast('Adicionado a ' + r.name);
            });
          }
          if (a === 'ex-detail') F.app.go('/exercises/' + exId);
        });

        if (data.length > 1) {
          F.chart.line(root.querySelector('#pg-chart'), {
            data: data, color: C.muscle(ex ? ex.primary : 'fullbody').color, unit: unit, yFmt: yFmt, zeroBase: metric === 'volume',
          });
        }
        var volData = weekly.map(function (w, i) { return { x: w.start, y: DB.toDisplay(w.volume), label: w.label }; });
        F.chart.line(root.querySelector('#pg-vol'), {
          data: volData, yFmt: function (v) { return U.int(v); }, zeroBase: true,
          xLabels: volData.map(function (d) { return d.label; }),
        });
        if (bodyW.length > 1) {
          var bw = bodyW.slice(-14).map(function (w) { return { x: w.date, y: DB.toDisplay(w.value), label: U.fmtDate(w.date, 'short') }; });
          F.chart.line(root.querySelector('#pg-bw'), { data: bw, fill: true, yFmt: function (v) { return U.num(v, 1); } });
        }
      },
    };
  };
})();
