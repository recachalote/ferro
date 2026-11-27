/* =========================================================
   FERRO — temporizador de descanso global
   ========================================================= */
(function () {
  'use strict';
  var F = (window.Ferro = window.Ferro || {});
  var U = F.u;
  var KEY = 'ferro:timer:v2';
  var audio = null;

  var T = (F.timer = {
    endAt: 0,
    total: 0,
    label: '',
    running: false,
    done: false,
    _iv: null,
    _doneTimer: null,
  });

  function settings() { return (F.db && F.db.settings) || {}; }

  function audioCtx() {
    try {
      if (!audio) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        audio = new AC();
      }
      if (audio.state === 'suspended') audio.resume();
      return audio;
    } catch (e) { return null; }
  }
  T.unlock = function () { audioCtx(); };

  function beep(kind) {
    var ctx = audioCtx();
    if (!ctx) return;
    try {
      var t0 = ctx.currentTime;
      var notes = kind === 'done' ? [880, 1174, 1568] : [740];
      notes.forEach(function (f, i) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        var at = t0 + i * 0.17;
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.22, at + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 0.15);
        o.connect(g); g.connect(ctx.destination);
        o.start(at); o.stop(at + 0.17);
      });
    } catch (e) {}
  }
  T.beep = beep;

  function notify(title, body) {
    try {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then(function (reg) {
          reg.showNotification(title, {
            body: body, icon: 'icons/icon-180.png', badge: 'icons/icon-180.png',
            tag: 'ferro-rest', renotify: true, silent: true,
          });
        }).catch(function () {});
      } else {
        new Notification(title, { body: body, icon: 'icons/icon-180.png', tag: 'ferro-rest' });
      }
    } catch (e) {}
  }

  T.remaining = function () {
    if (!T.running && !T.done) return 0;
    if (T.done) return 0;
    return Math.max(0, Math.ceil((T.endAt - Date.now()) / 1000));
  };
  T.isRunning = function () { return T.running; };
  T.labelText = function () { return T.label || 'Rest'; };

  function persist() {
    try {
      if (!T.running) { localStorage.removeItem(KEY); return; }
      localStorage.setItem(KEY, JSON.stringify({ endAt: T.endAt, total: T.total, label: T.label }));
    } catch (e) {}
  }

  T.start = function (seconds, label) {
    var secs = Math.max(1, Math.round(Number(seconds) || 0));
    T.total = secs;
    T.label = label || 'Rest';
    T.endAt = Date.now() + secs * 1000;
    T.running = true;
    T.done = false;
    clearTimeout(T._doneTimer);
    persist();
    T.unlock();
    render();
    startTicker();
  };
  T.stop = function () {
    T.running = false;
    T.done = false;
    T.endAt = 0;
    clearTimeout(T._doneTimer);
    stopTicker();
    persist();
    render();
    restoreTitle();
  };
  T.add = function (sec) {
    if (!T.running) return;
    T.endAt += sec * 1000;
    T.total += sec;
    persist();
    tick();
  };
  T.pause = function () {
    if (!T.running) return;
    T._pausedAt = T.endAt - Date.now();
    T.running = false;
    stopTicker();
    persist();
    render();
    restoreTitle();
  };
  T.resume = function () {
    if (T.running || !T._pausedAt) return;
    T.endAt = Date.now() + T._pausedAt;
    T.running = true;
    startTicker();
    render();
  };

  function startTicker() {
    stopTicker();
    T._iv = setInterval(tick, 250);
    tick();
  }
  function stopTicker() {
    if (T._iv) { clearInterval(T._iv); T._iv = null; }
  }

  function tick() {
    if (!T.running) return;
    var rem = T.remaining();
    var el = document.getElementById('timer-slot');
    if (el && el.firstChild) {
      var t = el.querySelector('.t');
      if (t) t.textContent = U.fmtClock(rem);
    }
    updateTitle(rem);
    if (rem <= 0) finish();
  }

  function finish() {
    T.running = false;
    T.done = true;
    T.endAt = 0;
    stopTicker();
    try { localStorage.removeItem(KEY); } catch (e) {}
    var s = settings();
    if (s.sound !== false) beep('done');
    if (s.vibrate !== false) U.haptic([120, 70, 120]);
    notify('Rest finished', T.labelText() === 'Rest' ? 'Next set.' : 'Rest of ' + T.labelText() + ' finished.');
    render();
    restoreTitle();
    clearTimeout(T._doneTimer);
    T._doneTimer = setTimeout(function () { T.done = false; render(); }, 9000);
  }

  function updateTitle(rem) {
    if (!T.running) return;
    try {
      document.title = U.fmtClock(rem) + ' · ' + T.labelText() + ' — Ferro';
    } catch (e) {}
  }
  function restoreTitle() { try { document.title = 'Ferro — Workout'; } catch (e) {} }

  function render() {
    var slot = document.getElementById('timer-slot');
    if (!slot) return;
    if (!T.running && !T.done) { slot.innerHTML = ''; return; }
    if (T.done) {
      slot.innerHTML = '<div class="timer-pill done" role="status">' +
        U.svg('check') +
        '<div><div class="t">Ready</div><div class="tl">Rest finished</div></div>' +
        '<button class="mini-btn" data-t-act="stop" aria-label="Fechar">' + U.svg('x') + '</button>' +
        '</div>';
      return;
    }
    slot.innerHTML = '<div class="timer-pill" role="timer">' +
      U.svg('timer') +
      '<div><div class="t">' + U.fmtClock(T.remaining()) + '</div><div class="tl">' + U.esc(T.labelText()) + '</div></div>' +
      '<button class="mini-btn" data-t-act="add" aria-label="Add 15 seconds" style="font-size:10px;font-weight:700;width:auto;padding:0 8px;border-radius:99px">+15</button>' +
      '<button class="mini-btn" data-t-act="stop" aria-label="Stop">' + U.svg('x') + '</button>' +
      '</div>';
  }

  T.render = render;

  T.restore = function () {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return;
      var d = JSON.parse(raw);
      if (!d || !d.endAt) return;
      if (d.endAt <= Date.now()) { localStorage.removeItem(KEY); return; }
      T.endAt = d.endAt; T.total = d.total || 0; T.label = d.label || 'Rest';
      T.running = true; T.done = false;
      startTicker();
      render();
    } catch (e) {}
  };

  T.mount = function () {
    var slot = document.getElementById('timer-slot');
    if (!slot) return;
    slot.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-t-act]');
      if (!btn) return;
      var act = btn.getAttribute('data-t-act');
      if (act === 'add') { T.add(15); render(); }
      if (act === 'stop') { T.stop(); }
    });
    T.restore();
  };
})();
