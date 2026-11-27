/* =========================================================
   FERRO — Ferramentas
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, C = F.calc, DB = F.db, UI = F.ui;

  function parse(v) { var n = parseFloat(String(v == null ? '' : v).replace(',', '.')); return isNaN(n) ? 0 : n; }
  function unit() { return DB.unit; }
  function w(kg, dec) { return DB.fmtW(kg, dec); }

  /* ---------- 1RM ---------- */
  function oneRM() {
    var prefill = 0;
    var lw = DB.state.workouts[0];
    if (lw) lw.exercises.forEach(function (b) {
      (b.sets || []).forEach(function (s) {
        if (s.type !== 'warmup' && s.done !== false && Number(s.weight) > prefill) prefill = Number(s.weight);
      });
    });
    UI.sheet({
      title: '1RM calculator',
      sub: 'Theoretical max weight for a single rep',
      tall: true,
      body:
        '<div class="input-row"><div class="field" style="flex:1"><label class="label">Weight</label><div class="input-suffix"><input class="input num" id="rm-w" inputmode="decimal" placeholder="80" value="' + (prefill ? DB.fmtW(prefill, 1) : '') + '"><span class="sfx">' + unit() + '</span></div></div>' +
        '<div class="field" style="flex:1"><label class="label">Reps</label><input class="input num" id="rm-r" inputmode="numeric" placeholder="5" value="5"></div></div>' +
        '<div class="calc-out"><div class="l">Estimated 1RM</div><div class="v" id="rm-out">—</div><div class="mini" id="rm-sub">Epley · average ' + '' + '</div></div>' +
        '<div class="seg mt-12" id="rm-form"><button class="seg-item on" data-f="epley">Epley</button><button class="seg-item" data-f="brzycki">Brzycki</button><button class="seg-item" data-f="lombardi">Lombardi</button></div>' +
        '<div class="sec-head mt-16"><div class="sec-title">Percentage table</div></div>' +
        '<table class="pct-table" id="rm-table"></table>' +
        '<div class="mini mt-12">The estimate is most reliable between 1 and 8 reps. Always use a spotter on a real 1RM test.</div>',
      onMount: function (x) {
        var formula = 'epley';
        function render() {
          var weight = DB.displayToKg(parse(x.body.querySelector('#rm-w').value));
          var reps = Math.round(parse(x.body.querySelector('#rm-r').value));
          if (!weight || !reps) {
            x.body.querySelector('#rm-out').textContent = '—';
            x.body.querySelector('#rm-table').innerHTML = '';
            return;
          }
          var max = C.e1rm(weight, reps, formula);
          x.body.querySelector('#rm-out').innerHTML = w(max, 1) + ' <small>' + unit() + '</small>';
          x.body.querySelector('#rm-sub').textContent = C.FORMULAS[formula].label + ' · average ' + w(C.e1rmAvg(weight, reps), 1) + ' ' + unit();
          var rows = C.pctTable(max);
          x.body.querySelector('#rm-table').innerHTML = rows.map(function (r) {
            return '<tr><td class="p">' + r.pct + '%</td><td>' + r.reps + ' reps</td><td>' + w(r.weight, 1) + ' ' + unit() + '</td></tr>';
          }).join('');
        }
        x.body.querySelector('#rm-w').addEventListener('input', render);
        x.body.querySelector('#rm-r').addEventListener('input', render);
        Array.prototype.forEach.call(x.body.querySelectorAll('#rm-form .seg-item'), function (b) {
          b.addEventListener('click', function () {
            Array.prototype.forEach.call(x.body.querySelectorAll('#rm-form .seg-item'), function (z) { z.classList.remove('on'); });
            b.classList.add('on'); formula = b.getAttribute('data-f'); render();
          });
        });
        setTimeout(function () { var el = x.body.querySelector('#rm-w'); if (el) el.focus(); }, 250);
        render();
      },
    });
  }

  /* ---------- aquecimento ---------- */
  function warmupSheet() {
    var st = DB.settings;
    UI.sheet({
      title: 'Warm-up generator',
      sub: 'Ramp-up sets to your working weight',
      body: '<div class="field"><label class="label">Working weight</label><div class="input-suffix"><input class="input num" id="wu-w" inputmode="decimal" placeholder="100"><span class="sfx">' + unit() + '</span></div></div>' +
        '<div class="calc-out" style="text-align:left"><div class="l">Suggested plan</div><div id="wu-list" class="mt-8"><div class="mini">Enter the weight.</div></div></div>' +
        '<div class="mini mt-12">Based on a ' + U.num(st.bar || 20, 0) + ' kg bar and the available plates. Rest 60–90 s between ramp-up sets.</div>',
      onMount: function (x) {
        function render() {
          var work = DB.displayToKg(parse(x.body.querySelector('#wu-w').value));
          var list = C.warmup(work, st.bar, st.plates);
          var el = x.body.querySelector('#wu-list');
          if (!work || !list.length) { el.innerHTML = '<div class="mini">Weight too light for a warm-up.</div>'; return; }
          el.innerHTML = list.map(function (s) {
            return '<div class="row between" style="padding:6px 0;border-bottom:1px solid var(--line-2)"><div><span class="badge">' + s.pct + '%</span> <span class="strong num" style="margin-left:6px">' + w(s.weight, 1) + ' ' + unit() + '</span></div><div class="mini">' + s.reps + ' reps</div></div>';
          }).join('') + '<div class="row between mt-8"><div class="strong">Work</div><div class="strong accent">' + w(work, 1) + ' ' + unit() + '</div></div>';
        }
        x.body.querySelector('#wu-w').addEventListener('input', render);
      },
    });
  }

  /* ---------- temporizador de descanso ---------- */
  function restSheet() {
    UI.sheet({
      title: 'Rest timer',
      sub: 'Choose the duration',
      body: '<div class="row wrap gap-8" id="rs-opts">' +
        [45, 60, 90, 120, 150, 180, 240, 300].map(function (s) {
          return '<button class="chip" data-s="' + s + '" style="height:44px;flex:1 0 28%">' + U.fmtClock(s) + '</button>';
        }).join('') + '</div>' +
        '<div class="mini mt-12">The timer keeps running while you browse the app. You can adjust +15 s at any time.</div>',
      onMount: function (x) {
        x.body.addEventListener('click', function (e) {
          var b = e.target.closest('[data-s]');
          if (!b) return;
          F.timer.start(+b.getAttribute('data-s'), 'Rest');
          x.close();
          UI.toast('Rest for ' + U.fmtClock(+b.getAttribute('data-s')));
        });
      },
    });
  }

  /* ---------- intervalos ---------- */
  function intervalSheet() {
    var work = 40, rest = 20, rounds = 8;
    var phase = 'work', remain = work, round = 1, running = false, iv = null, done = false;
    var s = UI.sheet({
      title: 'Intervals',
      sub: 'HIIT · work / rest',
      body:
        '<div class="input-row"><div class="field" style="flex:1"><label class="label">Work (s)</label><input class="input num" id="iv-w" inputmode="numeric" value="40"></div>' +
        '<div class="field" style="flex:1"><label class="label">Rest (s)</label><input class="input num" id="iv-r" inputmode="numeric" value="20"></div>' +
        '<div class="field" style="flex:1"><label class="label">Rounds</label><input class="input num" id="iv-n" inputmode="numeric" value="8"></div></div>' +
        '<div class="interval-display"><div class="phase" id="iv-phase">Work</div><div class="time" id="iv-time">0:40</div><div class="round" id="iv-round">Round 1 of 8</div></div>' +
        '<div class="btn-row"><button class="btn btn-primary" id="iv-start">' + U.svg('play') + 'Start</button>' +
        '<button class="btn btn-soft" id="iv-reset" style="flex:0 0 54px;padding:0" aria-label="Reset">' + U.svg('refresh') + '</button></div>',
      onClose: function () { if (iv) clearInterval(iv); },
      onMount: function (x) {
        var timeEl = x.body.querySelector('#iv-time');
        var phaseEl = x.body.querySelector('#iv-phase');
        var roundEl = x.body.querySelector('#iv-round');
        var startBtn = x.body.querySelector('#iv-start');
        function syncInputs() {
          if (running) return;
          work = Math.max(1, Math.round(parse(x.body.querySelector('#iv-w').value) || 40));
          rest = Math.max(1, Math.round(parse(x.body.querySelector('#iv-r').value) || 20));
          rounds = Math.max(1, Math.round(parse(x.body.querySelector('#iv-n').value) || 8));
          phase = 'work'; remain = work; round = 1; done = false;
          render();
        }
        function render() {
          timeEl.textContent = U.fmtClock(remain);
          phaseEl.textContent = done ? 'Done' : phase === 'work' ? 'Work' : 'Rest';
          phaseEl.style.color = done ? 'var(--ok)' : phase === 'work' ? 'var(--accent)' : 'var(--info)';
          roundEl.textContent = done ? rounds + ' rounds complete' : 'Round ' + round + ' of ' + rounds;
        }
        function tick() {
          remain--;
          if (remain <= 0) {
            F.timer.beep('done');
            U.haptic(80);
            if (phase === 'work') {
              if (round >= rounds) { done = true; running = false; clearInterval(iv); iv = null; startBtn.innerHTML = U.svg('play') + 'Repeat'; remain = 0; render(); return; }
              phase = 'rest'; remain = rest;
            } else {
              phase = 'work'; remain = work; round++;
            }
          }
          render();
        }
        startBtn.addEventListener('click', function () {
          if (running) {
            clearInterval(iv); iv = null; running = false;
            startBtn.innerHTML = U.svg('play') + 'Continue';
            return;
          }
          if (done) { syncInputs(); done = false; }
          running = true;
          startBtn.innerHTML = U.svg('pause') + 'Pause';
          iv = setInterval(tick, 1000);
          render();
        });
        x.body.querySelector('#iv-reset').addEventListener('click', function () {
          clearInterval(iv); iv = null; running = false; done = false;
          startBtn.innerHTML = U.svg('play') + 'Start';
          syncInputs();
        });
        ['iv-w', 'iv-r', 'iv-n'].forEach(function (id) { x.body.querySelector('#' + id).addEventListener('change', syncInputs); });
        syncInputs();
      },
    });
  }

  /* ---------- RPE ---------- */
  function rpeSheet() {
    var rows = [
      ['10', '0', 'Maximum effort. No reps in reserve.'],
      ['9,5', '0–1', 'Maybe one more rep. Technique at its limit.'],
      ['9', '1', 'One rep in reserve.'],
      ['8,5', '1–2', 'One to two in reserve.'],
      ['8', '2', 'Two reps in reserve. Good for hypertrophy.'],
      ['7,5', '2–3', 'Controlled tempo, three in reserve.'],
      ['7', '3', 'Three reps in reserve. Volume zone.'],
      ['6', '4', 'Warm-up or technique work.'],
    ];
    UI.sheet({
      title: 'RPE/RIR table',
      sub: 'Perceived effort and reps in reserve',
      body: '<div class="card flat mb-12"><div class="mini" style="line-height:1.5"><b>RPE</b> = Rate of Perceived Exertion (1–10). <b>RIR</b> = Reps in Reserve. Use RPE 8–9 on most working sets.</div></div>' +
        '<table class="pct-table"><tr><td><b>RPE</b></td><td><b>RIR</b></td><td style="text-align:left"><b>Meaning</b></td></tr>' +
        rows.map(function (r) {
          return '<tr><td class="p">' + r[0] + '</td><td>' + r[1] + '</td><td style="text-align:left;font-size:11.5px">' + r[2] + '</td></tr>';
        }).join('') + '</table>' +
        '<div class="mini mt-12">Tip: keep most sets between RPE 7 and 9. Always hitting 10 builds fatigue without extra stimulus.</div>',
    });
  }

  /* ---------- IMC ---------- */
  function bmiSheet() {
    var st = DB.settings;
    var latest = DB.latestWeight();
    UI.sheet({
      title: 'BMI and healthy weight',
      sub: 'Body mass index',
      body: '<div class="input-row"><div class="field" style="flex:1"><label class="label">Height (cm)</label><input class="input num" id="bm-h" inputmode="numeric" value="' + (st.height || '') + '" placeholder="175"></div>' +
        '<div class="field" style="flex:1"><label class="label">Weight (' + unit() + ')</label><input class="input num" id="bm-w" inputmode="decimal" value="' + (latest ? DB.fmtW(latest, 1) : '') + '" placeholder="75"></div></div>' +
        '<div class="calc-out"><div class="l">BMI</div><div class="v" id="bm-out">—</div><div class="mini" id="bm-cat"></div></div>' +
        '<div class="card flat mt-12"><div class="row between"><div class="mini">Healthy weight (BMI 18.5–24.9)</div><div class="strong num" id="bm-range">—</div></div></div>' +
        '<div class="mini mt-12">BMI does not distinguish muscle from fat. Use it alongside measurements and photos.</div>',
      onMount: function (x) {
        function render() {
          var h = parse(x.body.querySelector('#bm-h').value);
          var kg = DB.displayToKg(parse(x.body.querySelector('#bm-w').value));
          var v = C.bmi(kg, h);
          var out = x.body.querySelector('#bm-out');
          var cat = x.body.querySelector('#bm-cat');
          if (!v) { out.textContent = '—'; cat.textContent = ''; x.body.querySelector('#bm-range').textContent = '—'; return; }
          out.innerHTML = U.num(v, 1);
          cat.textContent = v < 18.5 ? 'Underweight' : v < 25 ? 'Normal weight' : v < 30 ? 'Overweight' : 'Obesity';
          var lo = 18.5 * (h / 100) * (h / 100), hi = 24.9 * (h / 100) * (h / 100);
          x.body.querySelector('#bm-range').textContent = w(lo, 1) + ' – ' + w(hi, 1) + ' ' + unit();
        }
        ['bm-h', 'bm-w'].forEach(function (id) { x.body.querySelector('#' + id).addEventListener('input', render); });
        render();
      },
    });
  }

  /* ---------- DOTS ---------- */
  function dotsSheet() {
    var sex = DB.settings.sex === 'f' ? 'f' : 'm';
    var bw = DB.latestWeight() || 78;
    UI.sheet({
      title: 'Relative strength (DOTS)',
      sub: 'Compare your strength against your bodyweight',
      body: '<div class="card flat mb-12"><div class="mini" style="line-height:1.5"><b>DOTS</b> normalises your strength total (squat + bench + deadlift) by bodyweight. 300+ is good, 400+ is very good.</div></div>' +
        '<div class="field"><label class="label">Total (squat + bench + deadlift)</label><div class="input-suffix"><input class="input num" id="dt-total" inputmode="decimal" placeholder="400"><span class="sfx">' + unit() + '</span></div></div>' +
        '<div class="field"><label class="label">Bodyweight</label><div class="input-suffix"><input class="input num" id="dt-bw" inputmode="decimal" value="' + U.num(DB.toDisplay(bw), 1) + '"><span class="sfx">' + unit() + '</span></div></div>' +
        '<div class="field"><label class="label">Sex</label><div class="seg" id="dt-sex"><button class="seg-item ' + (sex === 'm' ? 'on' : '') + '" data-sx="m">Male</button><button class="seg-item ' + (sex === 'f' ? 'on' : '') + '" data-sx="f">Female</button></div></div>' +
        '<div class="calc-out"><div class="l">DOTS score</div><div class="v" id="dt-out">—</div><div class="mini" id="dt-cat"></div></div>',
      onMount: function (x) {
        function render() {
          var total = DB.displayToKg(parse(x.body.querySelector('#dt-total').value));
          var body = DB.displayToKg(parse(x.body.querySelector('#dt-bw').value));
          var score = C.dots(total, body, sex);
          var out = x.body.querySelector('#dt-out');
          var cat = x.body.querySelector('#dt-cat');
          if (!score) { out.textContent = '—'; cat.textContent = ''; return; }
          out.innerHTML = U.num(score, 1);
          cat.textContent = score >= 500 ? 'Elite' : score >= 400 ? 'Very strong' : score >= 300 ? 'Strong' : score >= 200 ? 'Intermediate' : 'Building';
        }
        ['dt-total', 'dt-bw'].forEach(function (id) { x.body.querySelector('#' + id).addEventListener('input', render); });
        Array.prototype.forEach.call(x.body.querySelectorAll('[data-sx]'), function (b) {
          b.addEventListener('click', function () {
            Array.prototype.forEach.call(x.body.querySelectorAll('[data-sx]'), function (z) { z.classList.remove('on'); });
            b.classList.add('on'); sex = b.getAttribute('data-sx'); render();
          });
        });
        render();
      },
    });
  }

  /* ---------- conversor ---------- */
  function convSheet() {
    UI.sheet({
      title: 'kg ↔ lb converter',
      body: '<div class="field"><label class="label">Kilograms</label><input class="input num" id="cv-kg" inputmode="decimal" placeholder="100"></div>' +
        '<div class="field"><label class="label">Pounds</label><input class="input num" id="cv-lb" inputmode="decimal" placeholder="220.5"></div>' +
        '<div class="mini">1 kg = 2.2046 lb · 1 lb = 0.4536 kg</div>',
      onMount: function (x) {
        var kg = x.body.querySelector('#cv-kg'), lb = x.body.querySelector('#cv-lb');
        kg.addEventListener('input', function () { var v = parse(kg.value); if (v) lb.value = U.num(v * 2.2046226218, 1); });
        lb.addEventListener('input', function () { var v = parse(lb.value); if (v) kg.value = U.num(v / 2.2046226218, 1); });
      },
    });
  }

  /* ---------- vista ---------- */
  var TOOLS = [
    { id: '1rm', icon: 'calc', t: '1RM calculator', s: 'Estimated max weight' },
    { id: 'plates', icon: 'plate', t: 'Plate calculator', s: 'What to load per side' },
    { id: 'warmup', icon: 'flame', t: 'Warm-up', s: 'Ramp-up sets' },
    { id: 'rest', icon: 'timer', t: 'Rest', s: 'Quick timer' },
    { id: 'interval', icon: 'zap', t: 'Intervals', s: 'HIIT work/rest' },
    { id: 'rpe', icon: 'target', t: 'RPE/RIR table', s: 'Perceived effort' },
    { id: 'bmi', icon: 'scale', t: 'BMI', s: 'Healthy weight' },
    { id: 'dots', icon: 'trophy', t: 'Relative strength', s: 'DOTS score' },
    { id: 'conv', icon: 'repeat', t: 'Converter', s: 'kg ↔ lb' },
  ];

  F.views.tools = function () {
    var html = '<div class="screen">' +
      '<header class="screen-head"><div class="page-head"><div><div class="eyebrow">Calculators and timers</div><h1 class="page-title">Tools</h1></div>' +
      '<button class="icon-btn" data-nav="/settings" aria-label="Settings">' + U.svg('gear') + '</button></div></header>' +
      '<div class="screen-body">' +
      '<div class="tool-grid">' + TOOLS.map(function (t) {
        return '<button class="tool-tile" data-tool="' + t.id + '"><div class="ti">' + U.svg(t.icon) + '</div><div><div class="tt">' + t.t + '</div><div class="ts">' + t.s + '</div></div></button>';
      }).join('') + '</div>' +
      '<div class="card mt-16"><div class="row gap-10"><div class="item-thumb" style="color:var(--accent-text)">' + U.svg('timer') + '</div>' +
      '<div class="grow"><div class="card-title">Rest timer</div><div class="card-sub">Active: ' + (F.timer.isRunning() ? U.fmtClock(F.timer.remaining()) : 'stopped') + '</div></div>' +
      '<button class="btn btn-sm btn-soft" data-tool="rest">Open</button></div></div>' +
      '<div class="mini center mt-16" style="line-height:1.5;opacity:.7">All calculations are estimates.<br>Use common sense and keep technique above all.</div>' +
      '<div style="height:16px"></div></div></div>';
    return {
      tab: 'tools', title: 'Tools', html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var b = e.target.closest('[data-tool]');
          if (!b) return;
          var t = b.getAttribute('data-tool');
          if (t === '1rm') oneRM();
          if (t === 'plates') UI.plateSheet(60);
          if (t === 'warmup') warmupSheet();
          if (t === 'rest') restSheet();
          if (t === 'interval') intervalSheet();
          if (t === 'rpe') rpeSheet();
          if (t === 'bmi') bmiSheet();
          if (t === 'dots') dotsSheet();
          if (t === 'conv') convSheet();
        });
      },
    };
  };
})();
