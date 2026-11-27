/* =========================================================
   FERRO — cálculos de treino
   ========================================================= */
(function () {
  'use strict';
  var F = (window.Ferro = window.Ferro || {});
  var U = F.u;
  var C = (F.calc = {});

  /* ---------- metadados ---------- */
  C.MUSCLES = {
    chest: { label: 'Chest', color: '#FF7A6B', group: 'push' },
    back: { label: 'Back', color: '#6FB8FF', group: 'pull' },
    shoulders: { label: 'Shoulders', color: '#FFC65C', group: 'push' },
    biceps: { label: 'Biceps', color: '#A99BFF', group: 'pull' },
    triceps: { label: 'Triceps', color: '#7DE0C3', group: 'push' },
    forearms: { label: 'Forearms', color: '#8FA0B5', group: 'pull' },
    quads: { label: 'Quads', color: '#C9F45A', group: 'legs' },
    hamstrings: { label: 'Hamstrings', color: '#5BD1A6', group: 'legs' },
    glutes: { label: 'Glutes', color: '#FF9BC4', group: 'legs' },
    calves: { label: 'Calves', color: '#E8D06B', group: 'legs' },
    abs: { label: 'Abs', color: '#FFA36B', group: 'core' },
    lowerback: { label: 'Lower back', color: '#9EB3C8', group: 'core' },
    traps: { label: 'Traps', color: '#B8C46E', group: 'pull' },
    neck: { label: 'Neck', color: '#C2AFA8', group: 'core' },
    fullbody: { label: 'Full body', color: '#D6DCE5', group: 'full' },
  };
  C.MUSCLE_ORDER = ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'quads', 'hamstrings', 'glutes', 'calves', 'abs', 'lowerback', 'traps', 'neck', 'fullbody'];
  C.EQUIP = {
    barbell: 'Barbell', dumbbell: 'Dumbbells', machine: 'Machine', cable: 'Cable', smith: 'Smith',
    ezbar: 'EZ bar', kettlebell: 'Kettlebell', bodyweight: 'Bodyweight', bands: 'Bands',
    plate: 'Plate', cardio: 'Cardio', other: 'Other',
  };
  C.LEVEL = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
  C.MECHANIC = { compound: 'Compound', isolation: 'Isolation', cardio: 'Cardio' };
  C.SET_TYPES = {
    normal: { label: 'Normal', short: '' },
    warmup: { label: 'Warm-up', short: 'W' },
    drop: { label: 'Drop set', short: 'D' },
    failure: { label: 'Failure', short: 'F' },
  };
  C.muscle = function (k) { return C.MUSCLES[k] || { label: k, color: '#8B929E', group: 'other' }; };

  /* ---------- 1RM ---------- */
  C.FORMULAS = {
    epley: { label: 'Epley', fn: function (w, r) { return r <= 1 ? w : w * (1 + r / 30); } },
    brzycki: { label: 'Brzycki', fn: function (w, r) { return r >= 37 ? w : w * 36 / (37 - r); } },
    lombardi: { label: 'Lombardi', fn: function (w, r) { return w * Math.pow(Math.max(r, 1), 0.10); } },
    oconner: { label: "O'Conner", fn: function (w, r) { return w * (1 + r / 40); } },
    wathan: { label: 'Wathan', fn: function (w, r) { return w * 100 / (48.8 + 53.8 * Math.exp(-0.075 * r)); } },
  };
  C.e1rm = function (weight, reps, formula) {
    var w = Number(weight) || 0, r = Number(reps) || 0;
    if (w <= 0 || r <= 0) return 0;
    if (r > 30) r = 30;
    var f = C.FORMULAS[formula || 'epley'] || C.FORMULAS.epley;
    return Math.round(f.fn(w, r) * 10) / 10;
  };
  C.e1rmAvg = function (weight, reps) {
    var w = Number(weight) || 0, r = Number(reps) || 0;
    if (w <= 0 || r <= 0) return 0;
    if (r > 15) r = 15;
    var keys = Object.keys(C.FORMULAS);
    return Math.round(U.avg(keys, function (k) { return C.FORMULAS[k].fn(w, r); }) * 10) / 10;
  };
  C.pctTable = function (max) {
    var rows = [[100, 1], [95, 2], [90, 3], [85, 4], [80, 5], [75, 6], [70, 8], [65, 10], [60, 12], [55, 14], [50, 16]];
    return rows.map(function (r) {
      return { pct: r[0], reps: r[1], weight: Math.round((max * r[0] / 100) * 2) / 2 };
    });
  };

  /* ---------- séries / volume ---------- */
  C.isWarmup = function (s) { return s && s.type === 'warmup'; };
  C.isWorking = function (s) { return s && s.type !== 'warmup' && s.done !== false; };
  C.isCompleted = function (s) { return s && s.done !== false && Number(s.reps) > 0; };
  C.workingSets = function (ex) { return (ex && ex.sets ? ex.sets : []).filter(C.isWorking); };
  C.setVolume = function (s) {
    if (!s || s.type === 'warmup') return 0;
    return (Number(s.weight) || 0) * (Number(s.reps) || 0);
  };
  C.exerciseVolume = function (ex) { return U.sum(C.workingSets(ex), C.setVolume); };
  C.workoutVolume = function (w) { return U.sum(w && w.exercises ? w.exercises : [], C.exerciseVolume); };
  C.workoutSets = function (w) {
    return U.sum(w && w.exercises ? w.exercises : [], function (ex) { return C.workingSets(ex).length; });
  };
  C.workoutReps = function (w) {
    return U.sum(w && w.exercises ? w.exercises : [], function (ex) {
      return U.sum(C.workingSets(ex), function (s) { return Number(s.reps) || 0; });
    });
  };
  C.workoutDuration = function (w) {
    if (!w) return 0;
    if (w.duration) return w.duration;
    if (w.start && w.end) return Math.max(0, Math.round((U.parse(w.end) - U.parse(w.start)) / 1000));
    if (w.start && w.active) return U.fmtElapsed(w.start);
    return 0;
  };
  C.stats = function (w) {
    return {
      volume: C.workoutVolume(w),
      sets: C.workoutSets(w),
      reps: C.workoutReps(w),
      duration: C.workoutDuration(w),
      exercises: (w && w.exercises ? w.exercises : []).filter(function (ex) { return C.workingSets(ex).length; }).length,
    };
  };

  /* ---------- séries por músculo ---------- */
  C.muscleSets = function (exerciseBlocks, lookup) {
    var out = {};
    C.MUSCLE_ORDER.forEach(function (m) { out[m] = 0; });
    (exerciseBlocks || []).forEach(function (ex) {
      var def = lookup(ex.exerciseId);
      if (!def) return;
      var n = C.workingSets(ex).length;
      if (!n) return;
      if (def.primary) out[def.primary] = (out[def.primary] || 0) + n;
      (def.secondary || []).forEach(function (m) {
        if (m !== def.primary) out[m] = (out[m] || 0) + n * 0.5;
      });
    });
    return out;
  };
  C.muscleTotals = function (workouts, lookup) {
    var total = {};
    C.MUSCLE_ORDER.forEach(function (m) { total[m] = 0; });
    (workouts || []).forEach(function (w) {
      var m = C.muscleSets(w.exercises || [], lookup);
      Object.keys(m).forEach(function (k) { total[k] = (total[k] || 0) + m[k]; });
    });
    return total;
  };
  C.balance = function (sets) {
    var push = (sets.chest || 0) + (sets.shoulders || 0) + (sets.triceps || 0);
    var pull = (sets.back || 0) + (sets.biceps || 0) + (sets.traps || 0) + (sets.forearms || 0) * 0.5;
    var legs = (sets.quads || 0) + (sets.hamstrings || 0) + (sets.glutes || 0) + (sets.calves || 0);
    var core = (sets.abs || 0) + (sets.lowerback || 0);
    var upper = push + pull;
    return {
      push: push, pull: pull, legs: legs, core: core, upper: upper, lower: legs,
      pushPull: pull ? push / pull : 0,
      upperLower: legs ? upper / legs : 0,
      total: push + pull + legs + core,
    };
  };

  /* ---------- recordes ---------- */
  C.emptyPR = function () {
    return {
      maxWeight: { value: 0, reps: 0, date: null },
      maxE1rm: { value: 0, reps: 0, weight: 0, date: null },
      maxReps: { value: 0, weight: 0, date: null },
      maxSetVolume: { value: 0, date: null },
      bestSet: null,
      sessions: 0, totalVolume: 0, totalSets: 0, lastDate: null, firstDate: null,
    };
  };
  C.prsFor = function (workouts, exerciseId) {
    var pr = C.emptyPR();
    var asc = (workouts || []).slice().sort(function (a, b) { return U.parse(a.start) - U.parse(b.start); });
    asc.forEach(function (w) {
      var has = false;
      (w.exercises || []).forEach(function (ex) {
        if (ex.exerciseId !== exerciseId) return;
        var sets = C.workingSets(ex).filter(C.isCompleted);
        if (!sets.length) return;
        has = true;
        pr.totalSets += sets.length;
        sets.forEach(function (s) {
          var weight = Number(s.weight) || 0, reps = Number(s.reps) || 0;
          var vol = weight * reps;
          pr.totalVolume += vol;
          if (weight > pr.maxWeight.value) pr.maxWeight = { value: weight, reps: reps, date: w.start, workoutId: w.id };
          if (reps > pr.maxReps.value && weight > 0) pr.maxReps = { value: reps, weight: weight, date: w.start, workoutId: w.id };
          if (vol > pr.maxSetVolume.value) pr.maxSetVolume = { value: vol, date: w.start, workoutId: w.id, weight: weight, reps: reps };
          if (reps <= 15 && weight > 0) {
            var e = C.e1rm(weight, reps);
            if (e > pr.maxE1rm.value) {
              pr.maxE1rm = { value: e, reps: reps, weight: weight, date: w.start, workoutId: w.id };
              pr.bestSet = { weight: weight, reps: reps, date: w.start, e1rm: e };
            }
          }
        });
      });
      if (has) {
        pr.sessions++;
        pr.lastDate = w.start;
        if (!pr.firstDate) pr.firstDate = w.start;
      }
    });
    return pr;
  };
  C.detectPRs = function (workout, history, lookup) {
    var out = [];
    var ids = U.uniqBy((workout.exercises || []).map(function (e) { return e.exerciseId; }), function (x) { return x; });
    ids.forEach(function (id) {
      var prior = C.prsFor(history, id);
      if (!prior.sessions) return;
      var now = C.prsFor([workout], id);
      if (!now.sessions) return;
      var def = lookup ? lookup(id) : null;
      var name = def ? def.name : 'Exercise';
      if (now.maxWeight.value > prior.maxWeight.value + 0.001) {
        out.push({ exerciseId: id, name: name, type: 'weight', value: now.maxWeight.value, prev: prior.maxWeight.value, reps: now.maxWeight.reps, date: now.maxWeight.date });
      }
      if (now.maxE1rm.value > prior.maxE1rm.value + 0.05) {
        out.push({ exerciseId: id, name: name, type: 'e1rm', value: now.maxE1rm.value, prev: prior.maxE1rm.value, reps: now.maxE1rm.reps, weight: now.maxE1rm.weight, date: now.maxE1rm.date });
      }
      if (now.maxReps.value > prior.maxReps.value) {
        out.push({ exerciseId: id, name: name, type: 'reps', value: now.maxReps.value, prev: prior.maxReps.value, weight: now.maxReps.weight, date: now.maxReps.date });
      }
      if (now.maxSetVolume.value > prior.maxSetVolume.value) {
        out.push({ exerciseId: id, name: name, type: 'volume', value: now.maxSetVolume.value, prev: prior.maxSetVolume.value, date: now.maxSetVolume.date });
      }
    });
    out.sort(function (a, b) { return b.value - a.prev - (a.value - a.prev); });
    return out;
  };
  C.prLabel = function (type) {
    return { weight: 'Max weight', e1rm: 'Estimated 1RM', reps: 'Reps', volume: 'Set volume' }[type] || type;
  };

  /* ---------- histórico por exercício ---------- */
  C.exerciseHistory = function (workouts, exerciseId) {
    var out = [];
    (workouts || []).forEach(function (w) {
      (w.exercises || []).forEach(function (ex) {
        if (ex.exerciseId !== exerciseId) return;
        var sets = C.workingSets(ex).filter(C.isCompleted);
        if (!sets.length) return;
        var top = U.maxBy(sets, function (s) { return C.e1rm(s.weight, s.reps); });
        out.push({
          workoutId: w.id, date: w.start, name: w.name, sets: sets.length,
          volume: U.sum(sets, C.setVolume),
          e1rm: C.e1rm(top.weight, top.reps),
          topWeight: Number(top.weight) || 0,
          topReps: Number(top.reps) || 0,
          best: top,
        });
      });
    });
    return out.sort(function (a, b) { return U.parse(a.date) - U.parse(b.date); });
  };

  /* ---------- discos ---------- */
  C.plates = function (target, barWeight, available) {
    var bar = Number(barWeight) || 20;
    var plates = (available && available.length ? available : [25, 20, 15, 10, 5, 2.5, 1.25])
      .map(Number).filter(function (p) { return p > 0; })
      .sort(function (a, b) { return b - a; });
    var t = Number(target) || 0;
    if (t <= 0) return { error: 'Enter a weight.', perSide: [], achieved: bar, diff: 0, bar: bar };
    if (t < bar) return { error: 'Below the bar weight (' + bar + ' kg).', perSide: [], achieved: bar, diff: t - bar, bar: bar };
    var side = (t - bar) / 2;
    var remaining = side, perSide = [];
    plates.forEach(function (p) {
      while (remaining >= p - 0.0001) { perSide.push(p); remaining -= p; }
    });
    var achieved = Math.round((bar + (side - remaining) * 2) * 100) / 100;
    return {
      perSide: perSide, achieved: achieved,
      diff: Math.round((t - achieved) * 100) / 100,
      exact: Math.abs(t - achieved) < 0.005,
      remaining: Math.round(remaining * 100) / 100,
      bar: bar,
    };
  };
  C.roundToPlate = function (weight, barWeight, available) {
    var r = C.plates(weight, barWeight, available);
    var inc = Math.min.apply(null, (available && available.length ? available : [1.25]));
    var step = Math.max(inc * 2, 0.5);
    return Math.round(weight / step) * step;
  };
  C.warmup = function (working, barWeight, available) {
    var bar = Number(barWeight) || 20;
    var work = Number(working) || 0;
    if (work <= bar) return [];
    var pcts = [[0.4, 10], [0.6, 6], [0.8, 3]];
    var out = [];
    pcts.forEach(function (p) {
      var w = C.roundToPlate(work * p[0], bar, available);
      if (w < bar) w = bar;
      if (w >= work) return;
      if (out.length && w <= out[out.length - 1].weight) w = out[out.length - 1].weight + Math.max(1.25, (Math.min.apply(null, available || [1.25]) * 2));
      if (w >= work) return;
      out.push({ weight: w, reps: p[1], pct: Math.round(w / work * 100) });
    });
    return out;
  };

  /* ---------- força relativa ---------- */
  var DOTS = {
    m: [-307.75076, 24.0900756, -0.1918759221, 0.0007391293, -0.000001093],
    f: [-57.96288, 13.6175032, -0.1126655495, 0.0005158568, -0.0000010706],
  };
  C.dots = function (totalKg, bodyKg, sex) {
    var t = Number(totalKg) || 0, w = Number(bodyKg) || 0;
    if (!t || !w) return 0;
    var c = DOTS[sex === 'f' ? 'f' : 'm'];
    var den = c[0] + c[1] * w + c[2] * Math.pow(w, 2) + c[3] * Math.pow(w, 3) + c[4] * Math.pow(w, 4);
    if (den <= 0) return 0;
    return Math.round(t * 500 / den * 10) / 10;
  };
  C.bmi = function (kg, cm) {
    var m = (Number(cm) || 0) / 100;
    if (!kg || !m) return 0;
    return Math.round((kg / (m * m)) * 10) / 10;
  };

  /* ---------- prontidão ---------- */
  C.readiness = function (c) {
    if (!c) return null;
    var sleep = U.clamp(Number(c.sleep) || 3, 1, 5);
    var energy = U.clamp(Number(c.energy) || 3, 1, 5);
    var sore = U.clamp(Number(c.soreness) || 3, 1, 5);
    var stress = U.clamp(Number(c.stress) || 3, 1, 5);
    var score = Math.round((
      ((sleep - 1) / 4) * 0.32 +
      ((energy - 1) / 4) * 0.30 +
      ((5 - sore) / 4) * 0.22 +
      ((5 - stress) / 4) * 0.16
    ) * 100);
    var label, tip;
    if (score >= 80) { label = 'Great'; tip = 'A good day to chase PRs. Stick to the plan.'; }
    else if (score >= 60) { label = 'Good'; tip = 'Train as planned, but avoid taking sets to failure.'; }
    else if (score >= 40) { label = 'Average'; tip = 'Drop one set per exercise and keep 2–3 reps in reserve.'; }
    else { label = 'Low'; tip = 'Consider a light day or rest. If you train, cut volume by 30%.'; }
    return { score: score, label: label, tip: tip };
  };

  /* ---------- streaks ---------- */
  C.streak = function (workouts, firstDay) {
    var fd = firstDay == null ? 1 : firstDay;
    var weeks = {};
    (workouts || []).forEach(function (w) { weeks[U.dateKey(U.startOfWeek(w.start, fd))] = 1; });
    var keys = Object.keys(weeks).sort();
    var current = 0;
    var cursor = U.startOfWeek(new Date(), fd);
    if (!weeks[U.dateKey(cursor)]) cursor = U.addDays(cursor, -7);
    while (weeks[U.dateKey(cursor)]) { current++; cursor = U.addDays(cursor, -7); }
    var best = 0, run = 0, prev = null;
    keys.forEach(function (k) {
      var d = U.parse(k);
      if (prev && U.diffDays(d, prev) === 7) run++;
      else run = 1;
      best = Math.max(best, run);
      prev = d;
    });
    var days = {};
    (workouts || []).forEach(function (w) { days[U.dateKey(w.start)] = 1; });
    var dayStreak = 0, dc = U.startOfDay(new Date());
    if (!days[U.dateKey(dc)]) dc = U.addDays(dc, -1);
    while (days[U.dateKey(dc)]) { dayStreak++; dc = U.addDays(dc, -1); }
    return { weeks: current, bestWeeks: best, days: dayStreak, totalWeeks: keys.length, weekKeys: keys };
  };

  /* ---------- séries semanais ---------- */
  C.weeklySeries = function (workouts, weeks, firstDay) {
    var fd = firstDay == null ? 1 : firstDay;
    var out = [];
    var end = U.startOfWeek(new Date(), fd);
    for (var i = weeks - 1; i >= 0; i--) {
      var start = U.addDays(end, -7 * i);
      var stop = U.addDays(start, 7);
      var list = (workouts || []).filter(function (w) {
        var t = U.parse(w.start);
        return t >= start && t < stop;
      });
      out.push({
        start: start, end: stop, workouts: list.length,
        volume: U.sum(list, function (w) { return C.workoutVolume(w); }),
        sets: U.sum(list, function (w) { return C.workoutSets(w); }),
        duration: U.sum(list, function (w) { return C.workoutDuration(w); }),
        label: U.fmtDate(start, 'short'),
      });
    }
    return out;
  };

  /* ---------- sugestão de progressão ---------- */
  C.suggestNext = function (lastSets, exercise) {
    var sets = (lastSets || []).filter(function (s) { return s.type !== 'warmup' && Number(s.reps) > 0; });
    if (!sets.length) return { weight: null, reps: 8, tip: 'First time on this exercise — pick a comfortable weight.' };
    var top = U.maxBy(sets, function (s) { return Number(s.weight) * (1 + Number(s.reps) / 30); });
    var w = Number(top.weight) || 0, r = Number(top.reps) || 0;
    var isolation = exercise && exercise.mechanic === 'isolation';
    var inc = isolation ? 1.25 : 2.5;
    if (!w) return { weight: null, reps: r + 1, tip: 'Add one rep compared with last session.' };
    if (r >= 12) return { weight: Math.round((w + inc) * 2) / 2, reps: 8, tip: 'You hit the top of the rep range — add ' + inc + ' kg and start again at 8.' };
    return { weight: w, reps: r + 1, tip: 'Same weight, one more rep. Double progression.' };
  };

  /* ---------- streaks / heat ---------- */
  C.heat = function (workouts, weeks, firstDay) {
    var fd = firstDay == null ? 1 : firstDay;
    var today = U.startOfDay(new Date());
    var start = U.addDays(U.startOfWeek(today, fd), -(weeks - 1) * 7);
    var byDay = {};
    (workouts || []).forEach(function (w) { byDay[U.dateKey(w.start)] = (byDay[U.dateKey(w.start)] || 0) + 1; });
    var cells = [];
    for (var i = 0; i < weeks * 7; i++) {
      var d = U.addDays(start, i);
      if (d > today) { cells.push(null); continue; }
      var n = byDay[U.dateKey(d)] || 0;
      cells.push({ date: d, n: n, level: n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : 3 });
    }
    return { start: start, cells: cells, weeks: weeks };
  };

  /* ---------- misc ---------- */
  C.parseReps = function (reps) {
    if (reps == null) return null;
    if (typeof reps === 'number') return { min: reps, max: reps };
    var m = String(reps).match(/(\d+)\s*[-–]\s*(\d+)/);
    if (m) return { min: +m[1], max: +m[2] };
    var n = parseInt(reps, 10);
    return isNaN(n) ? null : { min: n, max: n };
  };
  C.fmtReps = function (reps, dec) {
    if (reps === 0) return '0';
    return reps == null || reps === '' ? '—' : U.num(reps, dec || 0);
  };
  C.volumeTier = function (v) {
    if (v >= 20000) return { label: 'Very high', cls: 'ok' };
    if (v >= 12000) return { label: 'High', cls: 'ok' };
    if (v >= 6000) return { label: 'Medium', cls: 'info' };
    return { label: 'Low', cls: '' };
  };
})();
