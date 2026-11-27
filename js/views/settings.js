/* =========================================================
   FERRO — Definições + boas-vindas
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, C = F.calc, DB = F.db, UI = F.ui;

  /* ================= boas-vindas ================= */
  if (!F.views.welcome) {
    F.views.welcome = function () {
      var html = '<div class="welcome">' +
        '<div class="welcome-glow"></div>' +
        '<div class="welcome-logo"><img src="icons/icon.svg" width="38" height="38" alt="Ferro">' +
        '<span class="wm">FERRO</span></div>' +
        '<div class="welcome-body">' +
        '<div class="eyebrow">No accounts · No paywalls</div>' +
        '<h1 class="welcome-h">Train.<br>Log.<br>Progress.</h1>' +
        '<p class="welcome-p">Everything Hevy and Strong charge for — and more — offline, with no account and no subscription.</p>' +
        '<div class="welcome-list">' +
        '<div class="welcome-li">' + U.svg('dumbbell') + '<div><b>Log in seconds</b><span>Sets, RPE, supersets, auto rest and real-time records.</span></div></div>' +
        '<div class="welcome-li">' + U.svg('chart') + '<div><b>Serious progress</b><span>Estimated 1RM, weekly volume, muscle balance and readiness.</span></div></div>' +
        '<div class="welcome-li">' + U.svg('scale') + '<div><b>Body and measurements</b><span>Weight, measurements and progress photos side by side.</span></div></div>' +
        '<div class="welcome-li">' + U.svg('lock') + '<div><b>Just yours</b><span>Your data stays on this iPhone. Export everything whenever you want.</span></div></div>' +
        '</div>' +
        '<div class="field mt-16" style="margin-bottom:0"><label class="label">What is your name?</label>' +
        '<input class="input" id="wc-name" placeholder="Your first name" autocomplete="given-name" value="' + U.esc(DB.settings.name || '') + '"></div>' +
        '<div class="field mt-12" style="margin-bottom:0"><label class="label">Units</label>' +
        '<div class="seg" id="wc-unit"><button class="seg-item on" data-u="kg">Kilograms (kg)</button><button class="seg-item" data-u="lb">Pounds (lb)</button></div></div>' +
        '</div>' +
        '<div class="welcome-foot">' +
        '<button class="btn btn-primary btn-lg btn-block" data-act="start">' + U.svg('sparkles') + 'Get started</button>' +
        '<button class="btn btn-ghost btn-block" data-act="demo">Explore with sample data</button>' +
        '<div class="ios-hint mt-8">' + U.svg('info') + '<div>For an app-like experience: Safari → Share → <b>Add to Home Screen</b>.</div></div>' +
        '</div></div>';

      return {
        tab: 'welcome', title: 'Welcome', plain: true,
        html: html,
        mount: function (root) {
          var unit = DB.settings.unit || 'kg';
          root.querySelectorAll('#wc-unit .seg-item').forEach(function (b) {
            b.classList.toggle('on', b.getAttribute('data-u') === unit);
            b.addEventListener('click', function () {
              unit = b.getAttribute('data-u');
              root.querySelectorAll('#wc-unit .seg-item').forEach(function (x) { x.classList.toggle('on', x === b); });
            });
          });
          root.addEventListener('click', function (e) {
            var act = e.target.closest('[data-act]');
            if (!act) return;
            var a = act.getAttribute('data-act');
            if (a === 'start') {
              var name = root.querySelector('#wc-name').value.trim();
              DB.patch({ name: name || 'Athlete', unit: unit });
              DB.markOnboarded();
              DB.set('theme', DB.settings.theme || 'dark');
              UI.toast('Welcome to Ferro');
              F.app.go('/');
            }
            if (a === 'demo') {
              var name2 = root.querySelector('#wc-name').value.trim();
              DB.patch({ name: name2 || 'Athlete', unit: unit });
              DB.markOnboarded();
              DB.loadDemo();
              UI.toast('Sample data loaded');
              F.app.go('/');
            }
          });
        },
      };
    };
  }

  /* ================= definições ================= */
  function toggleRow(label, key, sub, icon) {
    var on = !!DB.settings[key];
    return '<button class="set-row" data-toggle="' + key + '">' + U.svg(icon || 'check') +
      '<div class="set-row-main"><div class="set-row-t">' + label + '</div>' + (sub ? '<div class="set-row-s">' + sub + '</div>' : '') + '</div>' +
      '<span class="switch ' + (on ? 'on' : '') + '"></span></button>';
  }
  function navRow(label, act, sub, icon, value, danger) {
    return '<button class="set-row ' + (danger ? 'danger' : '') + '" data-open="' + act + '">' + U.svg(icon) +
      '<div class="set-row-main"><div class="set-row-t">' + label + '</div>' + (sub ? '<div class="set-row-s">' + sub + '</div>' : '') + '</div>' +
      (value != null ? '<div class="set-row-v">' + U.esc(String(value)) + '</div>' : '') +
      '<div class="chev">' + U.svg('right') + '</div></button>';
  }
  function group(title, inner) {
    return '<div class="group">' + (title ? '<div class="group-h">' + title + '</div>' : '') + inner + '</div>';
  }

  function platesSheet() {
    var bar = Number(DB.settings.bar) || 20;
    var chosen = DB.settings.plates.slice();
    var all = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5];
    UI.sheet({
      title: 'Barbell & plates',
      sub: 'Your gym inventory',
      body: '<div class="field"><label class="label">Bar weight</label><div class="input-suffix"><input class="input num" id="ps-bar" inputmode="decimal" value="' + U.num(bar, 1) + '"><span class="sfx">kg</span></div></div>' +
        '<label class="label">Available plates (per side)</label>' +
        '<div class="chips" id="ps-list" style="flex-wrap:wrap;margin:0;padding:0">' +
        all.map(function (p) {
          return '<button class="chip ' + (chosen.indexOf(p) >= 0 ? 'on' : '') + '" data-plate="' + p + '" style="height:42px">' + U.num(p, p % 1 ? 2 : 0) + ' kg</button>';
        }).join('') + '</div>' +
        '<div class="mini mt-12">Used in the plate calculator and the warm-up generator.</div>',
      foot: '<button class="btn btn-primary btn-block" id="ps-save">Save</button>',
      onMount: function (x) {
        x.body.addEventListener('click', function (e) {
          var b = e.target.closest('[data-plate]');
          if (!b) return;
          var p = parseFloat(b.getAttribute('data-plate'));
          var i = chosen.indexOf(p);
          if (i >= 0) chosen.splice(i, 1); else chosen.push(p);
          b.classList.toggle('on', i < 0);
        });
        x.root.querySelector('#ps-save').addEventListener('click', function () {
          var bv = parseFloat(String(x.body.querySelector('#ps-bar').value).replace(',', '.'));
          if (chosen.length) chosen.sort(function (a, b) { return b - a; });
          DB.patch({ bar: bv > 0 ? bv : 20, plates: chosen.length ? chosen : [25, 20, 15, 10, 5, 2.5, 1.25] });
          x.close(); UI.toast('Equipment updated'); F.app.refresh();
        });
      },
    });
  }

  function targetsSheet() {    var copy = Object.assign({}, DB.settings.targets);
    var list = C.MUSCLE_ORDER.filter(function (m) { return C.MUSCLES[m]; });
    var s = UI.sheet({
      title: 'Weekly goal',
      sub: 'Sets per muscle group',
      tall: true,
      body: '<div class="card flat mb-12" style="padding:11px 12px"><div class="mini" style="line-height:1.45">Reference values for hypertrophy: 10–20 sets per group per week. Adjust to your volume and recovery.</div></div>' +
        list.map(function (m) {
          return '<div class="target-row"><div class="tn">' + UI.muscleDot(m) + C.muscle(m).label + '</div>' +
            '<div class="stepper"><button data-t-m="' + m + '" data-d="-1">' + U.svg('minus') + '</button>' +
            '<div class="val" data-t-v="' + m + '">' + (copy[m] || 0) + '</div>' +
            '<button data-t-m="' + m + '" data-d="1">' + U.svg('plus') + '</button></div></div>';
        }).join(''),
      foot: '<button class="btn btn-primary btn-block" id="tg-save">Save goals</button>',
      onMount: function (x) {
        x.body.addEventListener('click', function (e) {
          var b = e.target.closest('[data-t-m]');
          if (!b) return;
          var m = b.getAttribute('data-t-m');
          copy[m] = Math.max(0, (copy[m] || 0) + (+b.getAttribute('data-d')));
          x.body.querySelector('[data-t-v="' + m + '"]').textContent = copy[m];
        });
        x.root.querySelector('#tg-save').addEventListener('click', function () {
          Object.keys(copy).forEach(function (m) { DB.setTarget(m, copy[m]); });
          x.close(); UI.toast('Goals updated'); F.app.refresh();
        });
      },
    });
  }

  function csvExport() {
    var rows = [['Date', 'Time', 'Workout', 'Exercise', 'Set', 'Type', 'Weight (kg)', 'Reps', 'RPE', 'Volume (kg)']];
    DB.state.workouts.forEach(function (w) {
      var d = U.parse(w.start);
      (w.exercises || []).forEach(function (b) {
        (b.sets || []).forEach(function (s, i) {
          rows.push([
            U.dateKey(d), U.fmtTimeOfDay(d), w.name, DB.exercise(b.exerciseId).name, i + 1,
            (C.SET_TYPES[s.type] || {}).label || s.type, s.weight == null ? '' : s.weight,
            s.reps == null ? '' : s.reps, s.rpe == null ? '' : s.rpe,
            s.type === 'warmup' ? 0 : (Number(s.weight) || 0) * (Number(s.reps) || 0),
          ]);
        });
      });
    });
    var csv = '\uFEFF' + rows.map(function (r) {
      return r.map(function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }).join(';');
    }).join('\r\n');
    U.download('ferro-workouts-' + U.todayKey() + '.csv', csv, 'text/csv;charset=utf-8');
  }

  function openInstallHint() { F.app.install(); }

  function backupSheet() {
    var b = F.backup.status();
    var hasToken = F.backup.hasToken();
    var enabled = !!b.enabled;
    function statusHtml(st) {
      if (!st.configured) return '<div class="mini">Not configured yet. Fill in the repository and the token.</div>';
      var html = '<div class="mini">Last backup: <b>' + (st.last ? U.relative(st.last) : 'never') + '</b>';
      if (st.lastStatus === 'error') html += '<div style="color:var(--danger);margin-top:4px">' + U.esc(st.lastError || 'Error') + '</div>';
      else if (st.lastBytes) html += ' · <span style="opacity:.7">' + Math.max(1, Math.round(st.lastBytes / 1024)) + ' KB</span>';
      html += '</div>';
      if (!st.enabled) html += '<div class="mini" style="margin-top:4px;color:var(--warn)">Automatic backup is off.</div>';
      return html;
    }
    var s = UI.sheet({
      title: 'Automatic backup',
      sub: 'Private repository on GitHub',
      tall: true,
      body:
        '<div class="card flat" style="padding:12px;margin-bottom:12px"><div class="mini" style="line-height:1.5">Workouts are sent to a <b>private</b> repository of your own. The token is stored only on this iPhone. <b>Photos</b> are not included in this backup — use the manual export to include them.</div></div>' +
        '<div class="field"><label class="label">Repository</label><input class="input" id="bk-repo" value="' + U.esc(b.repo || 'recachalote/ferro-backup') + '" placeholder="recachalote/ferro-backup" autocapitalize="off" autocorrect="off" spellcheck="false"></div>' +
        '<div class="field"><label class="label">GitHub token</label><input class="input" id="bk-token" type="password" placeholder="' + (hasToken ? '•••••••• (saved — leave empty to keep)' : 'github_pat_…') + '" autocapitalize="off" autocorrect="off" spellcheck="false">' +
        '<div class="field-hint">Fine-grained token with only <b>Contents: Read and write</b> on the backup repository.</div></div>' +
        '<div class="field"><label class="label">Branch</label><input class="input" id="bk-branch" value="' + U.esc(b.branch || 'main') + '" autocapitalize="off" spellcheck="false"></div>' +
        '<div class="row between" style="padding:8px 0 12px"><div><div class="card-title">Enable automatic backup</div><div class="card-sub">After each workout and once a day</div></div><button class="switch ' + (enabled ? 'on' : '') + '" id="bk-enable" aria-label="Enable"></button></div>' +
        '<div class="card flat" id="bk-status" style="padding:12px">' + statusHtml(b) + '</div>' +
        '<div class="btn-row mt-12"><button class="btn btn-sm btn-soft" id="bk-test">' + U.svg('check') + 'Test</button><button class="btn btn-sm btn-soft" id="bk-now">' + U.svg('upload') + 'Back up now</button></div>' +
        '<div class="btn-row mt-8"><button class="btn btn-sm btn-ghost" id="bk-restore">' + U.svg('download') + 'Restore from GitHub</button>' + (hasToken ? '<button class="btn btn-sm btn-ghost danger" id="bk-clear">' + U.svg('trash') + 'Remove token</button>' : '') + '</div>' +
        '<div class="sec-head mt-16"><div class="sec-title">How to create the token</div></div>' +
        '<ol class="mini" style="line-height:1.65;padding-left:18px;margin:0">' +
        '<li>GitHub → Settings → Developer settings → <b>Fine-grained tokens</b> → Generate new token.</li>' +
        '<li>Repository access: <b>Only select repositories</b> → <code>ferro-backup</code>.</li>' +
        '<li>Repository permissions → <b>Contents: Read and write</b> (everything else stays without access).</li>' +
        '<li>Generate token and paste it into the field above.</li></ol>' +
        '<div class="mini mt-8">The private repository <code>recachalote/ferro-backup</code> is already created.</div>',
      foot: '<button class="btn btn-primary btn-block" id="bk-save">Save configuration</button>',
      onMount: function (x) {
        var statusEl = x.body.querySelector('#bk-status');
        var enableBtn = x.body.querySelector('#bk-enable');
        enableBtn.addEventListener('click', function () {
          enabled = !enabled;
          enableBtn.classList.toggle('on', enabled);
        });
        function collect() {
          return {
            repo: x.body.querySelector('#bk-repo').value.trim(),
            token: x.body.querySelector('#bk-token').value.trim(),
            branch: x.body.querySelector('#bk-branch').value.trim() || 'main',
            enabled: enabled,
          };
        }
        function save(close) {
          var v = collect();
          if (!/^[\w.-]+\/[\w.-]+$/.test(v.repo)) { UI.toast('Invalid repository. Use owner/repo.', 'err'); return false; }
          if (!v.token && !F.backup.hasToken()) { UI.toast('The GitHub token is missing.', 'err'); return false; }
          var patch = { repo: v.repo, branch: v.branch, enabled: v.enabled };
          if (v.token) patch.token = v.token;
          F.backup.saveConfig(patch);
          x.body.querySelector('#bk-token').value = '';
          if (close) {
            x.close();
            UI.toast('Backup configured');
            F.app.refresh();
          } else {
            statusEl.innerHTML = statusHtml(F.backup.status());
          }
          return true;
        }
        x.root.querySelector('#bk-save').addEventListener('click', function () { save(true); });
        x.body.querySelector('#bk-test').addEventListener('click', function () {
          if (!save(false)) return;
          statusEl.innerHTML = '<div class="mini">Testing connection…</div>';
          F.backup.test().then(function (r) {
            var msg = 'Connection OK to <b>' + U.esc(r.fullName) + '</b>.';
            if (!r.isPrivate) msg += '<div style="color:var(--danger);margin-top:4px">Warning: the repository is public. Your data would be visible.</div>';
            else if (!r.canPush) msg += '<div style="color:var(--warn);margin-top:4px">The token does not seem to have write permission.</div>';
            statusEl.innerHTML = '<div class="mini">' + msg + '</div>';
          }).catch(function (e) {
            statusEl.innerHTML = '<div class="mini" style="color:var(--danger)">' + U.esc(e.message) + '</div>';
          });
        });
        x.body.querySelector('#bk-now').addEventListener('click', function () {
          if (!save(false)) return;
          statusEl.innerHTML = '<div class="mini">Sending backup…</div>';
          F.backup.backupNow('manual').then(function (r) {
            statusEl.innerHTML = statusHtml(F.backup.status());
            UI.toast('Backup sent (' + Math.max(1, Math.round(r.bytes / 1024)) + ' KB)');
          }).catch(function (e) {
            statusEl.innerHTML = statusHtml(F.backup.status());
            UI.toast(e.message, 'err');
          });
        });
        x.body.querySelector('#bk-restore').addEventListener('click', function () {
          if (!save(false)) return;
          UI.confirm({
            title: 'Restore from GitHub?',
            message: 'The current data on this iPhone will be replaced by the latest backup in the repository.',
            confirmText: 'Restore',
            danger: true,
          }).then(function (ok) {
            if (!ok) return;
            statusEl.innerHTML = '<div class="mini">Restoring…</div>';
            F.backup.restore().then(function (res) {
              x.close();
              UI.toast(res.workouts + ' workouts restored');
              F.app.go('/');
            }).catch(function (e) {
              statusEl.innerHTML = '<div class="mini" style="color:var(--danger)">' + U.esc(e.message) + '</div>';
            });
          });
        });
        var clearBtn = x.body.querySelector('#bk-clear');
        if (clearBtn) clearBtn.addEventListener('click', function () {
          UI.confirm({ title: 'Remove token?', message: 'Automatic backup stays off until you paste a token again.', confirmText: 'Remove', danger: true }).then(function (ok) {
            if (!ok) return;
            F.backup.clearToken();
            x.close();
            UI.toast('Token removed');
            F.app.refresh();
          });
        });
      },
    });
    return s;
  }

  function settingsView() {
    var s = DB.settings;
    var st = DB.stats();
    var size = 0;
    try { size = (JSON.stringify(DB.state).length / 1024).toFixed(0); } catch (e) {}
    var targetsTotal = U.sum(C.MUSCLE_ORDER, function (m) { return Number(s.targets[m]) || 0; });

    var profile = group('Profile',
      navRow('Name', 'name', '', 'user', s.name || 'Athlete') +
      navRow('Height', 'height', 'For BMI and relative strength', 'ruler', s.height ? s.height + ' cm' : '—') +
      navRow('Sex', 'sex', 'Used in strength calculations', 'user', s.sex === 'f' ? 'Female' : 'Male') +
      navRow('Goal weight', 'goalWeight', '', 'target', s.bodyGoal ? DB.fmtW(s.bodyGoal) + ' ' + DB.unit : '—'));

    var training = group('Training',
      '<div class="set-row"><div class="set-row-main"><div class="set-row-t">Units</div></div>' +
      '<div class="seg" style="width:132px"><button class="seg-item ' + (s.unit === 'kg' ? 'on' : '') + '" data-unit="kg">kg</button><button class="seg-item ' + (s.unit === 'lb' ? 'on' : '') + '" data-unit="lb">lb</button></div></div>' +
      navRow('Default rest', 'rest', 'Between sets', 'timer', U.fmtClock(s.restDefault || 120)) +
      navRow('Barbell & plates', 'plates', 'Bar ' + U.num(s.bar || 20, 0) + ' kg · ' + (s.plates || []).length + ' plates', 'plate', '') +
      toggleRow('Auto rest', 'autoRest', 'Starts when you complete a set', 'timer') +
      toggleRow('RPE on sets', 'rpe', 'Perceived effort tracking', 'target') +
      toggleRow('Warm-up sets', 'warmups', 'Allow A sets', 'flame') +
      navRow('Weekly goal', 'goal', 'Workouts per week', 'check', (s.weeklyGoal || 0) + ' workouts') +
      navRow('Sets per muscle', 'targets', targetsTotal + ' sets/week', 'chart', ''));

    var display = group('Appearance & data',
      '<div class="set-row"><div class="set-row-main"><div class="set-row-t">Theme</div></div>' +
      '<div class="seg" style="width:132px"><button class="seg-item ' + (s.theme !== 'light' ? 'on' : '') + '" data-theme-btn="dark">Dark</button><button class="seg-item ' + (s.theme === 'light' ? 'on' : '') + '" data-theme-btn="light">Light</button></div></div>' +
      '<div class="set-row"><div class="set-row-main"><div class="set-row-t">Week starts</div></div>' +
      '<div class="seg" style="width:158px"><button class="seg-item ' + (s.firstDay !== 0 ? 'on' : '') + '" data-first="1">Monday</button><button class="seg-item ' + (s.firstDay === 0 ? 'on' : '') + '" data-first="0">Sunday</button></div></div>' +
      toggleRow('Sounds', 'sound', 'Alert at the end of rest', 'bell') +
      toggleRow('Vibration', 'vibrate', 'When available', 'zap') +
      '<button class="set-row" data-open="notify">' + U.svg('bell') +
      '<div class="set-row-main"><div class="set-row-t">Notifications</div><div class="set-row-s">Rest alert on the lock screen</div></div>' +
      '<span class="set-row-v">' + (typeof Notification !== 'undefined' && Notification.permission === 'granted' ? 'Active' : 'Inactive') + '</span>' + U.svg('right') + '</button>' +
      '<button class="set-row" data-open="install">' + U.svg('download') +
      '<div class="set-row-main"><div class="set-row-t">Install on iPhone</div><div class="set-row-s">' + (U.isStandalone() ? 'You are already using it as an app' : 'Add to Home Screen') + '</div></div>' + U.svg('right') + '</button>');

    var backupCfg = s.backup || {};
    var backupGroup = group('Automatic backup',
      '<button class="set-row" data-open="backup">' + U.svg('upload') +
      '<div class="set-row-main"><div class="set-row-t">' + (backupCfg.enabled && backupCfg.repo ? 'Backup active' : 'Set up GitHub backup') + '</div>' +
      '<div class="set-row-s">' + (backupCfg.repo ? U.esc(backupCfg.repo) + (backupCfg.last ? ' · ' + U.relative(backupCfg.last) : '') : 'Private repository · no photos') + '</div></div>' +
      '<span class="badge ' + (backupCfg.enabled ? 'ok' : '') + '">' + (backupCfg.enabled ? 'ON' : 'OFF') + '</span>' + U.svg('right') + '</button>');

    var dataGroup = group('Your data',
      '<button class="set-row" data-open="export"><span class="item-thumb" style="width:28px;height:28px;background:transparent;border:0;color:var(--accent-text)">' + U.svg('download') + '</span>' +
      '<div class="set-row-main"><div class="set-row-t">Export full backup</div><div class="set-row-s">JSON with workouts, routines, body and photos</div></div>' + U.svg('right') + '</button>' +
      '<button class="set-row" data-open="csv"><span class="item-thumb" style="width:28px;height:28px;background:transparent;border:0;color:var(--txt-2)">' + U.svg('list') + '</span>' +
      '<div class="set-row-main"><div class="set-row-t">Export workouts (CSV)</div><div class="set-row-s">Opens in Excel or Sheets</div></div>' + U.svg('right') + '</button>' +
      '<button class="set-row" data-open="import">' + U.svg('upload') +
      '<div class="set-row-main"><div class="set-row-t">Import backup</div><div class="set-row-s">Replaces current data</div></div>' + U.svg('right') + '</button>' +
      '<div class="set-row"><div class="set-row-main"><div class="set-row-t">Backup</div><div class="set-row-s">Automatic, daily, on this iPhone</div></div>' +
      '<span class="set-row-v">' + (DB.state.meta.lastExport ? 'last ' + U.relative(DB.state.meta.lastExport).toLowerCase() : 'never exported') + '</span></div>' +
      '<button class="set-row" data-open="demo">' + U.svg('sparkles') +
      '<div class="set-row-main"><div class="set-row-t">Load sample data</div><div class="set-row-s">10 weeks of workouts to explore</div></div>' + U.svg('right') + '</button>' +
      '<button class="set-row danger" data-open="reset">' + U.svg('trash') +
      '<div class="set-row-main"><div class="set-row-t">Delete everything</div><div class="set-row-s">' + st.workouts + ' workouts · ' + size + ' KB</div></div>' + U.svg('right') + '</button>');

    var html = '<div class="screen">' +
      '<header class="screen-head">' + UI.navHead({ title: 'Settings', back: false, right: '<button class="icon-btn" data-nav="/" aria-label="Close">' + U.svg('x') + '</button>' }) + '</header>' +
      '<div class="screen-body">' +
      '<div class="card mb-16" style="display:flex;align-items:center;gap:13px"><div class="avatar" style="width:52px;height:52px;font-size:16px">' + U.esc(U.initials(s.name || 'Athlete')) + '</div>' +
      '<div class="grow"><div class="h3">' + U.esc(s.name || 'Athlete') + '</div><div class="mini">' + st.workouts + ' workouts · ' + st.sets + ' sets · since ' + (st.first ? U.fmtDate(st.first, 'short') : 'today') + '</div></div>' +
      '<div class="badge accent">PRO</div></div>' +
      profile + training + '<div class="group"><div class="group-h">Muscle goals</div>' +
      C.MUSCLE_ORDER.filter(function (m) { return (s.targets[m] || 0) > 0; }).map(function (m) {
        return '<div class="target-row"><div class="tn">' + UI.muscleDot(m) + C.muscle(m).label + '</div><span class="set-row-v">' + s.targets[m] + ' sets</span></div>';
      }).join('') +
      '<button class="set-row" data-open="targets"><div class="set-row-main"><div class="set-row-t">Edit goals</div></div>' + U.svg('right') + '</button></div>' +
      display + backupGroup + dataGroup +
      '<div class="center mini" style="opacity:.5;line-height:1.6;padding:10px 0 30px">FERRO 1.0 · Made for iPhone<br>Everything included, forever.</div>' +
      '</div></div>';

    return {
      tab: 'settings', title: 'Settings', html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var t = e.target.closest('[data-toggle]');
          if (t) {
            var k = t.getAttribute('data-toggle');
            DB.set(k, !DB.settings[k]);
            U.haptic(8);
            F.app.refresh();
            return;
          }
          var u = e.target.closest('[data-unit]');
          if (u) { DB.set('unit', u.getAttribute('data-unit')); UI.toast('Units: ' + DB.unit); F.app.refresh(); return; }
          var th = e.target.closest('[data-theme-btn]');
          if (th) { DB.set('theme', th.getAttribute('data-theme-btn')); F.app.refresh(); return; }
          var fd = e.target.closest('[data-first]');
          if (fd) { DB.set('firstDay', +fd.getAttribute('data-first')); F.app.refresh(); return; }
          var o = e.target.closest('[data-open]');
          if (!o) return;
          var a = o.getAttribute('data-open');
          if (a === 'name') {
            UI.prompt({ title: 'Your name', label: 'Name', value: s.name || '' }).then(function (v) {
              if (v == null) return; DB.set('name', v.trim() || 'Athlete'); F.app.refresh();
            });
          }
          if (a === 'height') {
            UI.prompt({ title: 'Height', label: 'Centimetres', value: s.height || '', type: 'number', inputmode: 'numeric' }).then(function (v) {
              if (v == null) return; DB.set('height', parseFloat(v) || null); F.app.refresh();
            });
          }
          if (a === 'goalWeight') {
            UI.prompt({ title: 'Goal weight', label: 'Weight in ' + DB.unit, value: s.bodyGoal ? DB.fmtW(s.bodyGoal) : '', inputmode: 'decimal' }).then(function (v) {
              if (v == null) return;
              DB.set('bodyGoal', v === '' ? null : DB.displayToKg(parseFloat(String(v).replace(',', '.')))); F.app.refresh();
            });
          }
          if (a === 'sex') {
            UI.actions({ title: 'Sex', options: [{ label: 'Male', value: 'm' }, { label: 'Female', value: 'f' }] }).then(function (v) {
              if (!v) return; DB.set('sex', v); F.app.refresh();
            });
          }
          if (a === 'rest') {
            UI.actions({
              title: 'Default rest',
              options: [45, 60, 90, 120, 150, 180, 210, 240, 300].map(function (x) { return { label: U.fmtClock(x), value: x, sub: x + ' seconds' }; }),
            }).then(function (v) { if (v) { DB.set('restDefault', v); F.app.refresh(); } });
          }
          if (a === 'goal') {
            UI.actions({
              title: 'Workouts per week',
              options: [2, 3, 4, 5, 6, 7].map(function (x) { return { label: x + ' workouts', value: x }; }),
            }).then(function (v) { if (v) { DB.set('weeklyGoal', v); F.app.refresh(); } });
          }
          if (a === 'targets') targetsSheet();
          if (a === 'plates') platesSheet();
          if (a === 'backup') backupSheet();
          if (a === 'install') openInstallHint();
          if (a === 'notify') {
            if (typeof Notification === 'undefined') { UI.toast('Not supported on this device', 'err'); return; }
            if (Notification.permission === 'granted') { UI.toast('Notifications already on'); return; }
            Notification.requestPermission().then(function (p) {
              UI.toast(p === 'granted' ? 'Notifications on' : 'Permission denied', p === 'granted' ? 'ok' : 'err');
              F.app.refresh();
            });
          }
          if (a === 'export') {
            UI.toast('Preparing backup…');
            DB.exportAll(true).then(function (json) {
              U.download('ferro-backup-' + U.todayKey() + '.json', json, 'application/json');
              UI.toast('Backup exported');
              F.app.refresh();
            }).catch(function () { UI.toast('Export failed', 'err'); });
          }
          if (a === 'csv') { csvExport(); UI.toast('CSV exported'); }
          if (a === 'import') {
            UI.confirm({ title: 'Import backup?', message: 'Current data will be replaced by the file.', confirmText: 'Choose file' }).then(function (ok) {
              if (!ok) return;
              U.pickFile('.json,application/json').then(function (file) {
                if (!file) return;
                U.readText(file).then(function (txt) {
                  DB.importAll(txt).then(function (res) {
                    UI.toast(res.workouts + ' workouts imported');
                    F.app.go('/');
                  }).catch(function (err) { UI.toast('Invalid file', 'err'); });
                });
              });
            });
          }
          if (a === 'demo') {
            UI.confirm({ title: 'Load sample?', message: 'Adds 3 routines and 10 weeks of demo workouts.', confirmText: 'Load' }).then(function (ok) {
              if (!ok) return;
              DB.loadDemo(); UI.toast('Sample loaded'); F.app.go('/');
            });
          }
          if (a === 'reset') {
            UI.confirm({ title: 'Delete everything?', message: 'All workouts, routines, photos and measurements will be deleted from this iPhone. Export first if you want to keep them.', confirmText: 'Delete everything', danger: true }).then(function (ok) {
              if (!ok) return;
              DB.resetAll(); UI.toast('Everything deleted'); F.app.go('/welcome');
            });
          }
        });
      },
    };
  }

  F.views.settings = settingsView;
})();
