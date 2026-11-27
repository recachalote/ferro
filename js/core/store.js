/* =========================================================
   FERRO — estado, persistência e ações
   ========================================================= */
(function () {
  'use strict';
  var F = (window.Ferro = window.Ferro || {});
  var U = F.u, C = F.calc;

  var KEY = 'ferro:state:v2';
  var BACKUP_KEY = 'ferro:backup:v2';
  var BACKUP_DATE = 'ferro:backup:date';
  var SETTINGS_KEY = 'ferro:settings:v2';

  var DEFAULT_TARGETS = {
    chest: 16, back: 18, shoulders: 12, biceps: 10, triceps: 10, forearms: 4,
    quads: 16, hamstrings: 12, glutes: 12, calves: 8, abs: 10, lowerback: 4,
    traps: 6, neck: 2, fullbody: 0,
  };

  function defaults() {
    return {
      v: 2,
      created: U.now(),
      settings: {
        name: '', unit: 'kg', theme: 'dark',
        restDefault: 120, autoRest: true, sound: true, vibrate: true, notify: false,
        rpe: true, warmups: true, plateCalc: true, confirmFinish: false,
        firstDay: 1, weeklyGoal: 4,
        height: null, sex: 'm', bodyGoal: null, birthYear: null,
        bar: 20, plates: [25, 20, 15, 10, 5, 2.5, 1.25],
        targets: JSON.parse(JSON.stringify(DEFAULT_TARGETS)),
        proteinGoal: null,
        backup: {
          enabled: false, repo: '', branch: 'main', intervalHours: 24,
          last: null, lastStatus: '', lastError: '', lastAttempt: null, lastBytes: 0,
        },
      },
      customExercises: [],
      favorites: [],
      folders: [],
      routines: [],
      workouts: [],
      active: null,
      weights: [],
      measurements: [],
      photos: [],
      checkins: [],
      meta: { onboarded: false, lastExport: null, createdAt: U.now(), installHint: true, demo: false },
    };
  }
  var state = defaults();
  var exCache = null;
  var listeners = [];
  var saveTimer = null;
  var lastBackupDay = null;

  /* ---------- normalização ---------- */
  function normalize(raw) {
    var d = defaults();
    if (!raw || typeof raw !== 'object') return d;
    var s = raw;
    var out = d;
    // settings
    if (s.settings) Object.keys(d.settings).forEach(function (k) {
      if (s.settings[k] !== undefined) {
        if (k === 'targets') out.settings[k] = Object.assign({}, d.settings.targets, s.settings.targets || {});
        else if (k === 'backup') out.settings[k] = Object.assign({}, d.settings.backup, s.settings.backup || {});
        else out.settings[k] = s.settings[k];
      }
    });
    ['customExercises', 'favorites', 'folders', 'routines', 'workouts', 'weights', 'measurements', 'photos', 'checkins'].forEach(function (k) {
      out[k] = Array.isArray(s[k]) ? s[k] : [];
    });
    out.active = s.active && s.active.start ? s.active : null;
    if (s.meta) out.meta = Object.assign({}, d.meta, s.meta);
    out.created = s.created || d.created;
    out.v = 2;
    // sane defaults / ids
    out.workouts = out.workouts.filter(function (w) { return w && w.id && w.start; })
      .sort(function (a, b) { return U.parse(b.start) - U.parse(a.start); });
    out.routines = out.routines.filter(function (r) { return r && r.id; });
    out.workouts.forEach(function (w) {
      w.exercises = Array.isArray(w.exercises) ? w.exercises : [];
      w.exercises.forEach(function (ex) {
        ex.sets = Array.isArray(ex.sets) ? ex.sets : [];
        if (!ex.rest) ex.rest = out.settings.restDefault;
        ex.sets.forEach(function (st) { if (!st.id) st.id = U.uid('s'); if (!st.type) st.type = 'normal'; });
      });
    });
    return out;
  }

  /* ---------- persistência ---------- */
  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      try { localStorage.removeItem(BACKUP_KEY); localStorage.setItem(KEY, JSON.stringify(state)); }
      catch (e2) { if (F.ui && F.ui.toast) F.ui.toast('Storage full — export your data.', 'err'); }
    }
    maybeBackup();
  }
  function maybeBackup() {
    var today = U.todayKey();
    if (lastBackupDay === today) return;
    try {
      var prev = localStorage.getItem(BACKUP_DATE);
      if (prev === today) { lastBackupDay = today; return; }
      localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
      localStorage.setItem(BACKUP_DATE, today);
      lastBackupDay = today;
    } catch (e) {}
  }
  function load() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) {}
    if (raw) {
      try { state = normalize(JSON.parse(raw)); return; } catch (e) {}
    }
    try {
      var bk = localStorage.getItem(BACKUP_KEY);
      if (bk) { state = normalize(JSON.parse(bk)); return; }
    } catch (e) {}
    state = defaults();
  }

  var DB = (F.db = {
    get state() { return state; },
    get settings() { return state.settings; },
    get unit() { return state.settings.unit === 'lb' ? 'lb' : 'kg'; },
    get wUnit() { return state.settings.unit === 'lb' ? 'lb' : 'kg'; },
  });
  DB.load = load;
  DB.raw = function () { return state; };
  DB.commit = function (silent) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 300);
    if (!silent) listeners.forEach(function (fn) { try { fn(state); } catch (e) {} });
  };
  DB.save = function (silent) { DB.commit(silent); };
  DB.saveNow = function () { clearTimeout(saveTimer); persist(); };
  DB.subscribe = function (fn) { listeners.push(fn); return function () { var i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); }; };
  DB.flush = function () { DB.saveNow(); };

  /* ---------- unidades ---------- */
  var LB = 2.2046226218;
  DB.toDisplay = function (kg) { return DB.unit === 'lb' ? (Number(kg) || 0) * LB : (Number(kg) || 0); };
  DB.toKg = function (v) { return DB.unit === 'lb' ? (Number(v) || 0) / LB : (Number(v) || 0); };
  DB.fmtW = function (kg, dec) {
    var v = DB.toDisplay(kg);
    if (dec == null) dec = Math.abs(v - Math.round(v)) > 0.05 ? 1 : 0;
    return U.num(v, dec);
  };
  DB.fmtWB = function (kg, dec) { return DB.fmtW(kg, dec) + ' ' + DB.unit; };
  DB.displayToKg = function (v) { return Math.round(DB.toKg(v) * 100) / 100; };
  DB.step = function () { return DB.unit === 'lb' ? 5 : 2.5; };

  /* ---------- exercícios ---------- */
  function buildExercises() {
    if (exCache) return exCache;
    var list = [], map = {}, used = {};
    (window.FERRO_EXERCISES || []).forEach(function (row) {
      if (!row || !row[0]) return;
      var ptName = String(row[0]);
      var id = U.slug(ptName);
      if (used[id]) { var i = 2; while (used[id + '-' + i]) i++; id = id + '-' + i; }
      used[id] = 1;
      var tr = (window.FERRO_EX_EN || {})[ptName] || {};
      var e = {
        id: id, name: tr.name || ptName, namePt: ptName,
        primary: row[1] || 'fullbody',
        secondary: Array.isArray(row[2]) ? row[2] : [],
        equipment: row[3] || 'other',
        mechanic: row[4] || 'compound',
        level: row[5] || 'intermediate',
        aliases: [row[6] || '', ptName].filter(Boolean).join(', '),
        tip: tr.tip || row[7] || '',
        custom: false,
      };
      list.push(e); map[id] = e;
    });
    (state.customExercises || []).forEach(function (e) {
      if (!e || !e.id) return;
      list.push(e); map[e.id] = e;
    });
    exCache = { list: list, map: map };
    return exCache;
  }
  DB.allExercises = function () { return buildExercises().list; };
  DB.exercise = function (id) {
    var m = buildExercises().map;
    return m[id] || { id: id, name: 'Removed exercise', primary: 'fullbody', secondary: [], equipment: 'other', mechanic: 'compound', level: 'beginner', aliases: '', tip: '', custom: false, missing: true };
  };
  DB.hasExercise = function (id) { return !!buildExercises().map[id]; };
  DB.findExerciseByName = function (name, muscle) {
    var n = U.norm(name).trim();
    if (!n) return null;
    var list = buildExercises().list;
    function hay(e) { return U.norm([e.name, e.namePt, e.aliases].filter(Boolean).join(' ')); }
    var exact = list.filter(function (e) {
      return [e.name, e.namePt].concat(String(e.aliases || '').split(',')).some(function (x) { return U.norm(x).trim() === n; });
    })[0];
    if (exact) return exact;
    var inc = list.filter(function (e) { var h = hay(e); return h.indexOf(n) >= 0 || n.indexOf(h) >= 0; });
    if (inc.length) return inc[0];
    var words = n.split(/\s+/).filter(function (w) { return w.length > 2; });
    var best = null, bs = 0;
    list.forEach(function (e) {
      var h = hay(e);
      var sc = words.filter(function (w) { return h.indexOf(w) >= 0; }).length;
      if (sc > bs) { bs = sc; best = e; }
    });
    if (best && bs > 0) return best;
    if (muscle) return list.filter(function (e) { return e.primary === muscle; })[0] || null;
    return null;
  };
  DB.searchExercises = function (q, opts) {
    opts = opts || {};
    var nq = U.norm(q);
    var fav = state.favorites || [];
    var list = buildExercises().list;
    var rows = [];
    list.forEach(function (e) {
      if (opts.muscle && e.primary !== opts.muscle && (e.secondary || []).indexOf(opts.muscle) < 0) return;
      if (opts.equipment && e.equipment !== opts.equipment) return;
      if (opts.favorites && fav.indexOf(e.id) < 0) return;
      var score = 0;
      if (!nq) score = 1;
      else {
        var en = U.norm(e.name);
        var ptn = U.norm(e.namePt || '');
        if (en === nq || ptn === nq) score = 100;
        else if (en.indexOf(nq) === 0 || ptn.indexOf(nq) === 0) score = 85;
        else if (en.indexOf(nq) > 0 || ptn.indexOf(nq) > 0) score = 65;
        else if (U.norm(e.aliases).indexOf(nq) >= 0) score = 45;
        else if (U.norm(C.muscle(e.primary).label).indexOf(nq) >= 0) score = 25;
        else {
          var words = nq.split(/\s+/).filter(Boolean);
          var hits = words.filter(function (w) { return en.indexOf(w) >= 0; }).length;
          if (hits && hits === words.length) score = 35;
        }
        if (score && fav.indexOf(e.id) >= 0) score += 12;
      }
      if (score > 0) rows.push({ e: e, score: score });
    });
    if (nq) rows.sort(function (a, b) { return b.score - a.score || a.e.name.localeCompare(b.e.name, 'pt'); });
    else if (opts.favorites) rows.sort(function (a, b) { return a.e.name.localeCompare(b.e.name, 'pt'); });
    return rows.map(function (r) { return r.e; });
  };
  DB.toggleFavorite = function (id) {
    var i = state.favorites.indexOf(id);
    if (i >= 0) state.favorites.splice(i, 1); else state.favorites.push(id);
    DB.save();
    return i < 0;
  };
  DB.isFavorite = function (id) { return (state.favorites || []).indexOf(id) >= 0; };
  DB.addCustomExercise = function (data) {
    var e = {
      id: U.uid('c'),
      name: String(data.name || '').trim(),
      primary: data.primary || 'fullbody',
      secondary: data.secondary || [],
      equipment: data.equipment || 'other',
      mechanic: data.mechanic || 'compound',
      level: data.level || 'intermediate',
      aliases: data.aliases || '',
      tip: data.tip || '',
      custom: true,
      createdAt: U.now(),
    };
    state.customExercises.push(e);
    exCache = null;
    DB.save();
    return e;
  };
  DB.updateCustomExercise = function (id, patch) {
    var e = state.customExercises.filter(function (x) { return x.id === id; })[0];
    if (!e) return null;
    Object.assign(e, patch);
    exCache = null; DB.save();
    return e;
  };
  DB.deleteCustomExercise = function (id) {
    state.customExercises = state.customExercises.filter(function (e) { return e.id !== id; });
    exCache = null; DB.save();
  };
  DB.recentExercises = function (limit) {
    var seen = {}, out = [];
    state.workouts.forEach(function (w) {
      (w.exercises || []).forEach(function (ex) {
        if (seen[ex.exerciseId]) return;
        seen[ex.exerciseId] = 1;
        if (DB.hasExercise(ex.exerciseId)) out.push(DB.exercise(ex.exerciseId));
      });
    });
    return out.slice(0, limit || 12);
  };

  /* ---------- treino ativo ---------- */
  function newSet(partial) {
    return Object.assign({ id: U.uid('s'), type: 'normal', weight: null, reps: null, rpe: null, done: false, ts: null }, partial || {});
  }
  DB.newSet = newSet;

  DB.startWorkout = function (opts) {
    opts = opts || {};
    if (state.active && !opts.force) return state.active;
    var routine = null;
    if (opts.routineId) routine = state.routines.filter(function (r) { return r.id === opts.routineId; })[0];
    var w = {
      id: U.uid('w'),
      name: opts.name || (routine ? routine.name : 'Free workout'),
      routineId: routine ? routine.id : null,
      start: U.now(),
      end: null,
      notes: '',
      rating: 0,
      exercises: [],
    };
    if (routine) {
      w.exercises = routine.exercises.map(function (re) {
        var prev = DB.lastPerformance(re.exerciseId);
        var n = Math.max(1, Number(re.sets) || 3);
        var sets = [];
        for (var i = 0; i < n; i++) {
          var p = prev && prev.sets && prev.sets.length ? prev.sets[Math.min(i, prev.sets.length - 1)] : null;
          sets.push(newSet({ weight: p ? p.weight : null, reps: p ? p.reps : null }));
        }
        return {
          id: U.uid('we'), exerciseId: re.exerciseId, note: re.note || '',
          rest: Number(re.rest) || state.settings.restDefault,
          superset: re.superset || 0, sets: sets,
        };
      });
    }
    state.active = w;
    DB.save();
    return w;
  };
  DB.discardActive = function () { state.active = null; DB.save(); };
  DB.active = function () { return state.active; };
  DB.activeElapsed = function () { return state.active ? U.fmtElapsed(state.active.start) : 0; };

  DB.guessRest = function (exerciseId) {
    var e = DB.exercise(exerciseId);
    var big = ['quads', 'hamstrings', 'glutes', 'back', 'chest'];
    if (e.mechanic === 'isolation') return 75;
    if (big.indexOf(e.primary) >= 0) return 150;
    return state.settings.restDefault || 120;
  };
  DB.addExerciseToActive = function (exerciseId, opts) {
    opts = opts || {};
    var w = state.active;
    if (!w) return null;
    var prev = DB.lastPerformance(exerciseId);
    var count = Math.max(1, Number(opts.sets) || (prev ? Math.max(3, prev.sets.length) : 3));
    var sets = [];
    for (var i = 0; i < count; i++) {
      var p = prev && prev.sets && prev.sets.length ? prev.sets[Math.min(i, prev.sets.length - 1)] : null;
      sets.push(newSet({ weight: p ? p.weight : null, reps: p ? p.reps : null }));
    }
    var block = {
      id: U.uid('we'), exerciseId: exerciseId, note: '',
      rest: DB.guessRest(exerciseId), superset: opts.superset || 0, sets: sets,
    };
    w.exercises.push(block);
    DB.save();
    return block;
  };
  DB.removeExerciseFromActive = function (blockId) {
    if (!state.active) return;
    state.active.exercises = state.active.exercises.filter(function (e) { return e.id !== blockId; });
    DB.save();
  };
  DB.moveExercise = function (blockId, dir) {
    var arr = state.active && state.active.exercises;
    if (!arr) return;
    var i = arr.findIndex(function (e) { return e.id === blockId; });
    if (i < 0) return;
    var j = i + dir;
    if (j < 0 || j >= arr.length) return;
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    DB.save();
  };
  DB.reorderExercises = function (from, to) {
    var arr = state.active && state.active.exercises;
    if (!arr) return;
    if (from < 0 || from >= arr.length || to < 0 || to >= arr.length) return;
    var item = arr.splice(from, 1)[0];
    arr.splice(to, 0, item);
    DB.save();
  };
  DB.finishActive = function (meta) {
    meta = meta || {};
    var w = state.active;
    if (!w) return null;
    var has = w.exercises.some(function (ex) {
      return (ex.sets || []).some(function (s) { return s.done && Number(s.reps) > 0; });
    });
    if (!has) return { error: 'No completed sets' };
    w.end = U.now();
    w.duration = Math.max(1, Math.round((U.parse(w.end) - U.parse(w.start)) / 1000));
    if (meta.name) w.name = meta.name;
    if (meta.notes != null) w.notes = meta.notes;
    if (meta.rating) w.rating = meta.rating;
    if (meta.bodyweight) w.bodyweight = meta.bodyweight;
    // limpar séries vazias por concluir
    w.exercises.forEach(function (ex) {
      ex.sets = (ex.sets || []).filter(function (s) { return s.done && Number(s.reps) > 0; });
    });
    w.exercises = w.exercises.filter(function (ex) { return ex.sets.length; });
    var workout = JSON.parse(JSON.stringify(w));
    state.workouts.unshift(workout);
    state.workouts.sort(function (a, b) { return U.parse(b.start) - U.parse(a.start); });
    state.active = null;
    if (meta.bodyweight) DB.addWeight(U.todayKey(), meta.bodyweight, true);
    var prs = C.detectPRs(workout, state.workouts.filter(function (w) { return w.id !== workout.id; }), DB.exercise);
    DB.save();
    if (F.backup && F.backup.maybeAuto) { try { F.backup.maybeAuto('treino'); } catch (e) {} }
    return { workout: workout, prs: prs };
  };
  DB.deleteWorkout = function (id) {
    state.workouts = state.workouts.filter(function (w) { return w.id !== id; });
    DB.save();
  };
  DB.getWorkout = function (id) { return state.workouts.filter(function (w) { return w.id === id; })[0] || null; };
  DB.repeatWorkout = function (id) {
    var old = DB.getWorkout(id);
    if (!old) return null;
    if (state.active) return { error: 'A workout is already in progress' };
    var w = {
      id: U.uid('w'), name: old.name, routineId: old.routineId || null,
      start: U.now(), end: null, notes: '', rating: 0, exercises: [],
    };
    w.exercises = (old.exercises || []).map(function (ex) {
      return {
        id: U.uid('we'), exerciseId: ex.exerciseId, note: ex.note || '',
        rest: ex.rest || state.settings.restDefault, superset: ex.superset || 0,
        sets: (ex.sets || []).map(function (s) {
          return newSet({ type: s.type || 'normal', weight: s.weight, reps: s.reps, rpe: null, done: false });
        }),
      };
    });
    state.active = w;
    DB.save();
    return w;
  };
  DB.lastPerformance = function (exerciseId) {
    for (var i = 0; i < state.workouts.length; i++) {
      var w = state.workouts[i];
      for (var j = 0; j < (w.exercises || []).length; j++) {
        var ex = w.exercises[j];
        if (ex.exerciseId !== exerciseId) continue;
        var sets = (ex.sets || []).filter(function (s) { return s.done && s.type !== 'warmup' && Number(s.reps) > 0; });
        if (!sets.length) continue;
        return {
          date: w.start, workoutId: w.id, name: w.name,
          sets: sets.map(function (s) { return { weight: Number(s.weight) || 0, reps: Number(s.reps) || 0, type: s.type || 'normal', rpe: s.rpe }; }),
        };
      }
    }
    return null;
  };
  DB.exerciseHistory = function (id) { return C.exerciseHistory(state.workouts, id); };
  DB.prsFor = function (id) { return C.prsFor(state.workouts, id); };

  /* ---------- rotinas ---------- */
  DB.newRoutine = function (name) {
    return {
      id: U.uid('r'), name: name || 'New routine', folder: '', notes: '',
      createdAt: U.now(), updatedAt: U.now(), exercises: [],
    };
  };
  DB.saveRoutine = function (routine) {
    if (!routine || !routine.name) return null;
    routine.updatedAt = U.now();
    var i = state.routines.findIndex(function (r) { return r.id === routine.id; });
    if (i >= 0) state.routines[i] = routine; else state.routines.unshift(routine);
    if (routine.folder && state.folders.indexOf(routine.folder) < 0) state.folders.push(routine.folder);
    DB.save();
    return routine;
  };
  DB.getRoutine = function (id) { return state.routines.filter(function (r) { return r.id === id; })[0] || null; };
  DB.deleteRoutine = function (id) { state.routines = state.routines.filter(function (r) { return r.id !== id; }); DB.save(); };
  DB.duplicateRoutine = function (id) {
    var r = DB.getRoutine(id);
    if (!r) return null;
    var copy = JSON.parse(JSON.stringify(r));
    copy.id = U.uid('r'); copy.name = r.name + ' (copy)'; copy.createdAt = U.now(); copy.updatedAt = U.now();
    copy.exercises = copy.exercises.map(function (e) { e.id = U.uid('re'); return e; });
    state.routines.unshift(copy);
    DB.save();
    return copy;
  };
  DB.routineLastDate = function (routineId) {
    var w = state.workouts.filter(function (x) { return x.routineId === routineId; })[0];
    return w ? w.start : null;
  };
  DB.folders = function () {
    var out = state.folders.slice();
    state.routines.forEach(function (r) { if (r.folder && out.indexOf(r.folder) < 0) out.push(r.folder); });
    return out;
  };
  DB.nextRoutine = function () {
    if (!state.routines.length) return null;
    var scored = state.routines.map(function (r) {
      var last = DB.routineLastDate(r.id);
      return { r: r, t: last ? U.parse(last).getTime() : 0 };
    });
    scored.sort(function (a, b) { return a.t - b.t; });
    return scored[0].r;
  };

  /* ---------- corpo ---------- */
  DB.addWeight = function (date, value, silent) {
    var kg = Number(value);
    if (!kg || kg <= 0) return null;
    var key = U.dateKey(date || new Date());
    var existing = state.weights.filter(function (w) { return w.date === key; })[0];
    if (existing) existing.value = kg;
    else state.weights.push({ id: U.uid('bw'), date: key, value: kg });
    state.weights.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    if (!silent) DB.save();
    return kg;
  };
  DB.deleteWeight = function (id) { state.weights = state.weights.filter(function (w) { return w.id !== id; }); DB.save(); };
  DB.latestWeight = function () { var w = state.weights[state.weights.length - 1]; return w ? w.value : null; };
  DB.addMeasurement = function (data) {
    var key = U.dateKey(data.date || new Date());
    var rec = Object.assign({ id: U.uid('m'), date: key }, data);
    delete rec.day;
    var existing = state.measurements.filter(function (m) { return m.date === key; })[0];
    if (existing) { rec.id = existing.id; state.measurements = state.measurements.filter(function (m) { return m.id !== existing.id; }); }
    state.measurements.push(rec);
    state.measurements.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    if (data.weight) DB.addWeight(key, data.weight, true);
    DB.save();
    return rec;
  };
  DB.deleteMeasurement = function (id) { state.measurements = state.measurements.filter(function (m) { return m.id !== id; }); DB.save(); };
  DB.latestMeasurement = function () { var m = state.measurements[state.measurements.length - 1]; return m || null; };

  DB.addCheckin = function (data) {
    var key = U.dateKey(data.date || new Date());
    var score = C.readiness(data);
    var rec = { id: U.uid('ck'), date: key, sleep: data.sleep, energy: data.energy, soreness: data.soreness, stress: data.stress, score: score.score, label: score.label, tip: score.tip, note: data.note || '' };
    state.checkins = state.checkins.filter(function (c) { return c.date !== key; });
    state.checkins.push(rec);
    DB.save();
    return rec;
  };
  DB.todayCheckin = function () {
    var key = U.todayKey();
    return state.checkins.filter(function (c) { return c.date === key; })[0] || null;
  };

  DB.addPhotoMeta = function (meta) { state.photos.push(meta); DB.save(); };
  DB.deletePhoto = function (id) {
    state.photos = state.photos.filter(function (p) { return p.id !== id; });
    U.idb.del(id).catch(function () {});
    DB.save();
  };
  DB.photosSorted = function () { return state.photos.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }); };

  /* ---------- estatísticas ---------- */
  DB.stats = function () {
    var ws = state.workouts;
    return {
      workouts: ws.length,
      volume: U.sum(ws, C.workoutVolume),
      sets: U.sum(ws, C.workoutSets),
      duration: U.sum(ws, C.workoutDuration),
      reps: U.sum(ws, C.workoutReps),
      since: ws.length ? ws[ws.length - 1].start : null,
      first: ws.length ? ws[ws.length - 1].start : null,
      last: ws.length ? ws[0].start : null,
      streak: C.streak(ws, state.settings.firstDay),
      avgDuration: ws.length ? U.sum(ws, C.workoutDuration) / ws.length : 0,
      avgVolume: ws.length ? U.sum(ws, C.workoutVolume) / ws.length : 0,
    };
  };
  DB.thisWeek = function () {
    var s = U.startOfWeek(new Date(), state.settings.firstDay);
    var e = U.addDays(s, 7);
    return state.workouts.filter(function (w) { var t = U.parse(w.start); return t >= s && t < e; });
  };
  DB.weekStats = function () {
    var list = DB.thisWeek();
    return {
      workouts: list.length,
      volume: U.sum(list, C.workoutVolume),
      sets: U.sum(list, C.workoutSets),
      duration: U.sum(list, C.workoutDuration),
      goal: Number(state.settings.weeklyGoal) || 0,
      list: list,
    };
  };
  DB.muscleSetsThisWeek = function () {
    var blocks = [];
    DB.thisWeek().forEach(function (w) { blocks = blocks.concat(w.exercises || []); });
    return C.muscleSets(blocks, DB.exercise);
  };
  DB.weeklyMuscles = function (weeks) {
    var series = C.weeklySeries(state.workouts, weeks, state.settings.firstDay);
    return series.map(function (s) {
      var list = state.workouts.filter(function (w) {
        var t = U.parse(w.start);
        return t >= s.start && t < s.end;
      });
      var blocks = [];
      list.forEach(function (w) { blocks = blocks.concat(w.exercises || []); });
      return { start: s.start, label: s.label, sets: C.muscleSets(blocks, DB.exercise) };
    });
  };

  /* ---------- definições ---------- */
  DB.set = function (key, value) {
    state.settings[key] = value;
    if (key === 'theme') applyTheme();
    DB.save();
  };
  DB.patch = function (patch) {
    Object.assign(state.settings, patch);
    if (patch.theme) applyTheme();
    DB.save();
  };
  DB.setTarget = function (muscle, value) {
    state.settings.targets[muscle] = Math.max(0, Math.round(Number(value) || 0));
    DB.save();
  };
  DB.applyTheme = applyTheme;
  function applyTheme() {
    var t = state.settings.theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#F4F5F7' : '#0A0B0D');
  }
  DB.markOnboarded = function () { state.meta.onboarded = true; DB.save(); };

  /* ---------- export / import ---------- */
  DB.serialize = function () {
    return JSON.stringify({ app: 'ferro', version: 2, exportedAt: U.now(), state: state });
  };
  DB.exportAll = async function (includePhotos) {
    var payload = JSON.parse(DB.serialize());
    if (includePhotos && state.photos.length) {
      payload.photos = [];
      for (var i = 0; i < state.photos.length; i++) {
        var p = state.photos[i];
        try {
          var rec = await U.idb.get(p.id);
          if (rec && rec.blob) payload.photos.push(Object.assign({}, p, { data: await U.blobToDataURL(rec.blob) }));
        } catch (e) {}
      }
    }
    state.meta.lastExport = U.now();
    DB.save();
    return JSON.stringify(payload);
  };
  DB.importAll = async function (text) {
    var payload = JSON.parse(text);
    var incoming = payload && payload.state ? payload.state : payload;
    if (!incoming || !Array.isArray(incoming.workouts)) throw new Error('Invalid file');
    state = normalize(incoming);
    exCache = null;
    applyTheme();
    if (payload && Array.isArray(payload.photos)) {
      for (var i = 0; i < payload.photos.length; i++) {
        var p = payload.photos[i];
        if (!p || !p.data || !p.id) continue;
        try {
          var blob = U.dataURLToBlob(p.data);
          await U.idb.put({ id: p.id, blob: blob });
          if (!state.photos.some(function (x) { return x.id === p.id; })) {
            state.photos.push({ id: p.id, date: p.date, angle: p.angle || '', note: p.note || '' });
          }
        } catch (e) {}
      }
    }
    persist();
    return { workouts: state.workouts.length, routines: state.routines.length, photos: state.photos.length };
  };
  DB.resetAll = function () {
    try {
      [KEY, BACKUP_KEY, BACKUP_DATE, SETTINGS_KEY, 'ferro:gh_token'].forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
    U.idb.clear().catch(function () {});
    state = defaults();
    exCache = null;
    applyTheme();
    persist();
  };

  /* ---------- dados de demonstração ---------- */
  DB.loadDemo = function () {
    var defs = [
      { name: 'Push', ex: [
        ['Supino reto com barra', 'chest', 60, 2.5], ['Supino inclinado com halteres', 'chest', 22, 1],
        ['Desenvolvimento militar com barra', 'shoulders', 35, 1.5], ['Elevação lateral com halteres', 'shoulders', 10, 0.5],
        ['Extensão de tríceps com corda', 'triceps', 25, 1], ['Tríceps dips nas paralelas', 'triceps', 0, 0],
      ]},
      { name: 'Pull', ex: [
        ['Puxada frontal', 'back', 55, 2], ['Remada curvada com barra', 'back', 50, 2],
        ['Remada baixa', 'back', 45, 1.5], ['Face pull', 'shoulders', 20, 0.5],
        ['Rosca direta com barra', 'biceps', 25, 1], ['Rosca martelo', 'biceps', 12, 0.5],
      ]},
      { name: 'Legs', ex: [
        ['Agachamento livre com barra', 'quads', 80, 3], ['Peso morto romeno com barra', 'hamstrings', 70, 3],
        ['Leg press', 'quads', 120, 4], ['Cadeira extensora', 'quads', 45, 2],
        ['Cadeira flexora', 'hamstrings', 40, 1.5], ['Elevação de gémeos em pé na máquina', 'calves', 60, 2],
      ]},
    ];
    var routines = defs.map(function (d) {
      var r = DB.newRoutine(d.name);
      r.folder = 'Example';
      r.notes = 'Sample routine generated by Ferro.';
      r.exercises = d.ex.map(function (x) {
        var def = DB.findExerciseByName(x[0], x[1]);
        return {
          id: U.uid('re'), exerciseId: def.id, sets: 3, reps: '8-12',
          rest: C.muscle(def.primary).group === 'legs' ? 150 : 110, note: '', superset: 0,
        };
      });
      return { routine: r, bases: d };
    });
    routines.forEach(function (x) { DB.saveRoutine(x.routine); });
    var start = U.addDays(U.startOfWeek(new Date(), 1), -7 * 9);
    var count = 0;
    for (var week = 0; week < 10; week++) {
      for (var d = 0; d < 3; d++) {
        var day = U.addDays(start, week * 7 + [0, 2, 4][d]);
        var when = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 18, 10);
        if (when > new Date()) continue;
        var r = routines[d];
        var w = {
          id: U.uid('w'), name: r.routine.name, routineId: r.routine.id,
          start: when.toISOString(),
          end: null, notes: '', rating: 4, exercises: [],
        };
        w.exercises = r.routine.exercises.map(function (re, idx) {
          var base = r.bases.ex[idx];
          var weight = base[2] ? Math.round((base[2] + week * base[3]) * 2) / 2 : 0;
          var sets = [];
          for (var s = 0; s < 3; s++) {
            var reps = Math.max(6, 11 - s - (week % 3) + ((idx + s) % 2));
            if (C.muscle(DB.exercise(re.exerciseId).primary).group === 'legs') reps = Math.max(6, 10 - s);
            sets.push({ id: U.uid('s'), type: 'normal', weight: weight, reps: reps, rpe: null, done: true, ts: w.start });
          }
          return { id: U.uid('we'), exerciseId: re.exerciseId, note: re.note || '', rest: re.rest, superset: 0, sets: sets };
        });
        var dur = 3300 + ((week + d) % 4) * 300;
        w.end = new Date(U.parse(w.start).getTime() + dur * 1000).toISOString();
        w.duration = dur;
        state.workouts.push(w);
        count++;
      }
    }
    state.workouts.sort(function (a, b) { return U.parse(b.start) - U.parse(a.start); });
    // bodyweight + medidas
    for (var k = 0; k < 6; k++) {
      DB.addWeight(U.addDays(new Date(), -7 * (5 - k)), 78.4 - k * 0.35, true);
    }
    DB.addMeasurement({ date: U.addDays(new Date(), -70), weight: 78.4, bodyfat: 17.5, waist: 84, chest: 102, arm: 36, thigh: 58 });
    DB.addMeasurement({ date: U.addDays(new Date(), -35), weight: 76.8, bodyfat: 15.8, waist: 81.5, chest: 103, arm: 36.8, thigh: 58.5 });
    DB.addMeasurement({ date: U.addDays(new Date(), -2), weight: 76.1, bodyfat: 15.1, waist: 80.5, chest: 104, arm: 37.2, thigh: 59 });
    DB.addCheckin({ sleep: 4, energy: 4, soreness: 2, stress: 2, note: '' });
    state.meta.demo = true;
    if (!state.settings.name) state.settings.name = 'Athlete';
    DB.save();
    return count;
  };

  /* ---------- boot ---------- */
  DB.init = function () {
    load();
    applyTheme();
    // guarda de segurança: treino ativo com mais de 36h
    if (state.active && state.active.start) {
      var age = (Date.now() - U.parse(state.active.start).getTime()) / 3600000;
      if (age > 36) state.active.stale = true;
    }
    return state;
  };

  // expõe defaults para o editor de rotinas
  DB.DEFAULT_TARGETS = DEFAULT_TARGETS;
  DB.defaultState = defaults;
})();
