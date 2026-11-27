/* =========================================================
   FERRO — Conquistas
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, C = F.calc, DB = F.db, UI = F.ui;

  var LEVELS = [
    { min: 0, name: 'Beginner' },
    { min: 5, name: 'Consistent' },
    { min: 15, name: 'Dedicated' },
    { min: 30, name: 'Strong' },
    { min: 60, name: 'Advanced' },
    { min: 100, name: 'Veteran' },
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
        (unlocked ? '<div class="ach-s" style="color:var(--accent-text);margin-top:3px">Unlocked</div>' :
          '<div class="ach-prog"><i style="width:' + p + '%"></i></div><div class="ach-s" style="margin-top:2px">' + (fmt ? fmt(value) + ' / ' + fmt(target) : value + ' / ' + target) + '</div>') +
        '</div></div>';
    }

    var list = [
      badge('dumbbell', 'First workout', 'Log your first workout.', st.workouts, 1),
      badge('flame', '10 workouts', 'Consistency starts here.', st.workouts, 10),
      badge('trend', '50 workouts', 'Halfway to a habit.', st.workouts, 50),
      badge('trophy', '100 workouts', 'Three digits of work.', st.workouts, 100),
      badge('star', '250 workouts', 'A true veteran.', st.workouts, 250),
      badge('dumbbell', '100 sets', 'Volume adding up.', st.sets, 100),
      badge('zap', '1000 sets', 'A thousand sets logged.', st.sets, 1000),
      badge('plate', '1 tonne', '1000 kg lifted in total.', totalVol, 1000, function (v) { return U.int(v / 1000) + 't'; }),
      badge('plate', '100 tonnes', 'Serious heavy work.', totalVol, 100000, function (v) { return U.int(v / 1000) + 't'; }),
      badge('trophy', '1 million kg', 'A milestone for life.', totalVol, 1000000, function (v) { return U.int(v / 1000) + 't'; }),
      badge('calendar', '4 weeks in a row', 'A whole month without missing.', st.streak.bestWeeks, 4),
      badge('calendar', '12 weeks in a row', 'A quarter of consistency.', st.streak.bestWeeks, 12),
      badge('calendar', '26 weeks in a row', 'Half a year of training.', st.streak.bestWeeks, 26),
      badge('book', '10 exercises', 'Explore the library.', uniqueEx, 10),
      badge('book', '40 exercises', 'Plenty of variety.', uniqueEx, 40),
      badge('scale', '5 weigh-ins', 'Track your body.', DB.state.weights.length, 5),
      badge('camera', '5 photos', 'Visible progress.', DB.state.photos.length, 5),
      badge('ruler', '3 measurements', 'See what the scale hides.', DB.state.measurements.length, 3),
      badge('folder', '3 routines', 'A plan for every day.', DB.state.routines.length, 3),
      badge('repeat', '10k reps', 'Rep after rep.', st.reps, 10000, function (v) { return U.int(v); }),
      badge('sun', 'Early bird', 'A workout before 7am.', early ? 1 : 0, 1),
      badge('moon', 'Night owl', 'A workout after 10pm.', night ? 1 : 0, 1),
      badge('sparkles', '3 programmes', 'Follow a structured plan.', Object.keys(folders).length, 3),
    ];
    var unlockedCount = list.filter(function (h) { return h.indexOf('ach locked') < 0; }).length;

    var html = '<div class="screen">' +
      '<header class="screen-head">' + UI.navHead({ title: 'Achievements', sub: unlockedCount + ' of ' + list.length + ' unlocked', right: '<button class="icon-btn" data-nav="/progress" aria-label="Progress">' + U.svg('chart') + '</button>' }) + '</header>' +
      '<div class="screen-body">' +
      '<div class="hero" style="text-align:center;padding:22px 18px">' +
      '<div class="eyebrow">Level ' + (lvlIdx + 1) + '</div>' +
      '<div class="h1 mt-4" style="font-size:30px">' + lvl.name + '</div>' +
      '<div class="mini mt-4">' + st.workouts + ' workouts · ' + (next ? next.min - st.workouts + ' to the next level' : 'max level') + '</div>' +
      '<div class="bar-track mt-12" style="height:6px"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="row between mini mt-4"><span>Level ' + (lvlIdx + 1) + '</span><span>' + (next ? 'Level ' + (lvlIdx + 2) : 'Max') + '</span></div>' +
      '</div>' +
      '<div class="kpis mt-12">' +
      '<div class="kpi"><div class="v">' + U.int(totalVol / 1000) + ' <small>t</small></div><div class="l">Total volume</div></div>' +
      '<div class="kpi"><div class="v">' + U.int(st.sets) + '</div><div class="l">Sets</div></div>' +
      '<div class="kpi"><div class="v">' + U.int(st.reps) + '</div><div class="l">Reps</div></div>' +
      '<div class="kpi"><div class="v">' + U.fmtDuration(st.duration) + '</div><div class="l">Total time</div></div>' +
      '</div>' +
      '<div class="sec"><div class="sec-head"><div class="sec-title">Milestones</div><span class="mini">' + unlockedCount + '/' + list.length + '</span></div>' +
      '<div class="ach-grid">' + list.join('') + '</div></div>' +
      '<div class="card mt-16"><div class="row gap-10"><div class="item-thumb" style="color:var(--violet)">' + U.svg('trophy') + '</div>' +
      '<div><div class="card-title">Records count</div><div class="card-sub" style="line-height:1.4">Every PR is saved per exercise. See your estimated 1RM in Progress.</div></div></div></div>' +
      '<div style="height:20px"></div></div></div>';

    return { tab: 'achievements', title: 'Achievements', html: html };
  };
})();
