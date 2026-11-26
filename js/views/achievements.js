/* =========================================================
   FERRO — Conquistas
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, C = F.calc, DB = F.db, UI = F.ui;

  var LEVELS = [
    { min: 0, name: 'Iniciante' },
    { min: 5, name: 'Consistente' },
    { min: 15, name: 'Dedicado' },
    { min: 30, name: 'Forte' },
    { min: 60, name: 'Avançado' },
    { min: 100, name: 'Veterano' },
    { min: 200, name: 'Elite' },
  ];

  F.views.achievements = function () {
    var st = DB.stats();
    var workouts = DB.state.workouts;
    var ids = {};
    workouts.forEach(function (w) { (w.exercises || []).forEach(function (e) { ids[e.exerciseId] = 1; }); });
    var uniqueEx = Object.keys(ids).length;
    var folders = {};
    DB.state.routines.forEach(function (r) { if (r.folder) folders[r.folder] = 1; });
    var early = workouts.some(function (w) { return U.parse(w.start).getHours() < 7; });
    var night = workouts.some(function (w) { return U.parse(w.start).getHours() >= 22; });
    var totalVol = st.volume;

    var lvlIdx = 0;
    LEVELS.forEach(function (l, i) { if (st.workouts >= l.min) lvlIdx = i; });
    var lvl = LEVELS[lvlIdx];
    var next = LEVELS[lvlIdx + 1];
    var pct = next ? Math.round(((st.workouts - lvl.min) / (next.min - lvl.min)) * 100) : 100;

    function badge(icon, title, desc, value, target, fmt) {
      var unlocked = value >= target;
      var p = U.clamp(Math.round((value / target) * 100), 0, 100);
      return '<div class="ach ' + (unlocked ? '' : 'locked') + '">' +
        '<div class="ach-ic">' + U.svg(unlocked ? icon : 'lock') + '</div>' +
        '<div style="min-width:0;flex:1"><div class="ach-t">' + title + '</div><div class="ach-s">' + desc + '</div>' +
        (unlocked ? '<div class="ach-s" style="color:var(--accent-text);margin-top:3px">Conquistado</div>' :
          '<div class="ach-prog"><i style="width:' + p + '%"></i></div><div class="ach-s" style="margin-top:2px">' + (fmt ? fmt(value) + ' / ' + fmt(target) : value + ' / ' + target) + '</div>') +
        '</div></div>';
    }

    var list = [
      badge('dumbbell', 'Primeiro treino', 'Regista o teu primeiro treino.', st.workouts, 1),
      badge('flame', '10 treinos', 'A consistência começa aqui.', st.workouts, 10),
      badge('trend', '50 treinos', 'Meio caminho para o hábito.', st.workouts, 50),
      badge('trophy', '100 treinos', 'Três dígitos de trabalho.', st.workouts, 100),
      badge('star', '250 treinos', 'Um verdadeiro veterano.', st.workouts, 250),
      badge('dumbbell', '100 séries', 'Volume a acumular.', st.sets, 100),
      badge('zap', '1000 séries', 'Mil séries registadas.', st.sets, 1000),
      badge('plate', '1 tonelada', '1000 kg levantados no total.', totalVol, 1000, function (v) { return U.int(v / 1000) + 't'; }),
      badge('plate', '100 toneladas', 'Trabalho pesado a sério.', totalVol, 100000, function (v) { return U.int(v / 1000) + 't'; }),
      badge('trophy', '1 milhão de kg', 'Um marco para a vida.', totalVol, 1000000, function (v) { return U.int(v / 1000) + 't'; }),
      badge('calendar', '4 semanas seguidas', 'Um mês sem falhar.', st.streak.bestWeeks, 4),
      badge('calendar', '12 semanas seguidas', 'Um trimestre de consistência.', st.streak.bestWeeks, 12),
      badge('calendar', '26 semanas seguidas', 'Meio ano de treino.', st.streak.bestWeeks, 26),
      badge('book', '10 exercícios', 'Explora a biblioteca.', uniqueEx, 10),
      badge('book', '40 exercícios', 'Variedade de sobra.', uniqueEx, 40),
      badge('scale', '5 pesagens', 'Acompanha o corpo.', DB.state.weights.length, 5),
      badge('camera', '5 fotos', 'Progresso visível.', DB.state.photos.length, 5),
      badge('ruler', '3 medições', 'Vê o que a balança esconde.', DB.state.measurements.length, 3),
      badge('folder', '3 rotinas', 'Um plano para cada dia.', DB.state.routines.length, 3),
      badge('repeat', '10 mil reps', 'Repetição após repetição.', st.reps, 10000, function (v) { return U.int(v); }),
      badge('sun', 'Madrugador', 'Um treino antes das 7h.', early ? 1 : 0, 1),
      badge('moon', 'Coruja', 'Um treino depois das 22h.', night ? 1 : 0, 1),
      badge('sparkles', '3 programas', 'Segue um plano estruturado.', Object.keys(folders).length, 3),
    ];
    var unlockedCount = list.filter(function (h) { return h.indexOf('locked') < 0; }).length;

    var html = '<div class="screen">' +
      '<header class="screen-head">' + UI.navHead({ title: 'Conquistas', sub: unlockedCount + ' de ' + list.length + ' desbloqueadas', right: '<button class="icon-btn" data-nav="/progress" aria-label="Progresso">' + U.svg('chart') + '</button>' }) + '</header>' +
      '<div class="screen-body">' +
      '<div class="hero" style="text-align:center;padding:22px 18px">' +
      '<div class="eyebrow">Nível ' + (lvlIdx + 1) + '</div>' +
      '<div class="h1 mt-4" style="font-size:30px">' + lvl.name + '</div>' +
      '<div class="mini mt-4">' + st.workouts + ' treinos · ' + (next ? next.min - st.workouts + ' para o próximo nível' : 'nível máximo') + '</div>' +
      '<div class="bar-track mt-12" style="height:6px"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="row between mini mt-4"><span>Nível ' + (lvlIdx + 1) + '</span><span>' + (next ? 'Nível ' + (lvlIdx + 2) : 'Máximo') + '</span></div>' +
      '</div>' +
      '<div class="kpis mt-12">' +
      '<div class="kpi"><div class="v">' + U.int(totalVol / 1000) + ' <small>t</small></div><div class="l">Volume total</div></div>' +
      '<div class="kpi"><div class="v">' + U.int(st.sets) + '</div><div class="l">Séries</div></div>' +
      '<div class="kpi"><div class="v">' + U.int(st.reps) + '</div><div class="l">Repetições</div></div>' +
      '<div class="kpi"><div class="v">' + U.fmtDuration(st.duration) + '</div><div class="l">Tempo total</div></div>' +
      '</div>' +
      '<div class="sec"><div class="sec-head"><div class="sec-title">Marcos</div><span class="mini">' + unlockedCount + '/' + list.length + '</span></div>' +
      '<div class="ach-grid">' + list.join('') + '</div></div>' +
      '<div class="card mt-16"><div class="row gap-10"><div class="item-thumb" style="color:var(--violet)">' + U.svg('trophy') + '</div>' +
      '<div><div class="card-title">Os recordes contam</div><div class="card-sub" style="line-height:1.4">Cada PR é guardado por exercício. Vê o teu 1RM estimado em Progresso.</div></div></div></div>' +
      '<div style="height:20px"></div></div></div>';

    return { tab: 'achievements', title: 'Conquistas', html: html };
  };
})();
