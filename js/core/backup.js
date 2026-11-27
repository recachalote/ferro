/* =========================================================
   FERRO — backup automático para um repositório privado GitHub
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, DB = F.db;
  var TOKEN_KEY = 'ferro:gh_token';
  var API = 'https://api.github.com';
  var running = false;
  var scheduled = false;

  function cfg() {
    if (!DB.settings.backup) DB.settings.backup = {};
    return DB.settings.backup;
  }
  function getToken() {
    try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
  }
  function setToken(v) {
    try {
      if (v) localStorage.setItem(TOKEN_KEY, v);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) { throw new Error('Could not save the token on this device.'); }
  }
  function repo() { return String(cfg().repo || '').trim().replace(/^\/+|\/+$/g, ''); }
  function branch() { return String(cfg().branch || 'main').trim() || 'main'; }
  function isConfigured() { return !!(repo() && getToken()); }

  function b64enc(str) {
    var bytes = new TextEncoder().encode(str);
    var bin = '';
    var chunk = 0x8000;
    for (var i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(bin);
  }
  function b64dec(str) {
    var s = String(str || '').replace(/\s+/g, '');
    var bin = atob(s);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  async function gh(path, opts) {
    opts = opts || {};
    var tk = getToken();
    if (!tk) throw new Error('GitHub token missing.');
    var res;
    try {
      res = await fetch(API + path, {
        method: opts.method || 'GET',
        headers: {
          'Authorization': 'Bearer ' + tk,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined,
        cache: 'no-store',
      });
    } catch (e) {
      throw new Error('Cannot reach GitHub. Check your internet connection.');
    }
    var text = '';
    try { text = await res.text(); } catch (e) {}
    var data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) {}
    if (!res.ok) {
      var msg = data && data.message ? data.message : ('HTTP ' + res.status);
      if (res.status === 401) msg = 'Invalid or expired token.';
      else if (res.status === 403) msg = 'Permission denied. The token needs Contents: Read and write.';
      else if (res.status === 404) msg = 'Repository or backup not found.';
      else if (res.status === 409) msg = 'Save conflict. Try again.';
      var err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  async function test() {
    if (!repo()) throw new Error('Enter the repository as owner/repo.');
    if (!getToken()) throw new Error('GitHub token missing.');
    var data = await gh('/repos/' + repo());
    return {
      fullName: data.full_name || repo(),
      isPrivate: !!data.private,
      canPush: !!(data.permissions && data.permissions.push),
    };
  }

  async function backupNow(reason) {
    if (running) throw new Error('A backup is already running.');
    if (!isConfigured()) throw new Error('Backup is not configured.');
    running = true;
    try {
      var json = DB.serialize();
      var path = '/repos/' + repo() + '/contents/backup.json';
      var existing = null;
      try {
        existing = await gh(path + '?ref=' + encodeURIComponent(branch()));
      } catch (e) {
        if (e.status !== 404) throw e;
      }
      var body = {
        message: 'Ferro backup — ' + U.fmtDate(new Date(), 'full') + ', ' + U.fmtTimeOfDay(new Date()),
        content: b64enc(json),
        branch: branch(),
      };
      if (existing && existing.sha) body.sha = existing.sha;
      await gh(path, { method: 'PUT', body: body });
      cfg().last = U.now();
      cfg().lastStatus = 'ok';
      cfg().lastError = '';
      cfg().lastBytes = json.length;
      cfg().lastAttempt = U.now();
      DB.save();
      return { at: cfg().last, bytes: json.length, reason: reason || 'manual' };
    } catch (e) {
      cfg().lastStatus = 'error';
      cfg().lastError = e.message;
      cfg().lastAttempt = U.now();
      DB.save();
      throw e;
    } finally {
      running = false;
    }
  }

  async function restore() {
    if (!isConfigured()) throw new Error('Backup is not configured.');
    var data = await gh('/repos/' + repo() + '/contents/backup.json?ref=' + encodeURIComponent(branch()));
    if (!data || !data.content) throw new Error('Backup not found in the repository.');
    var json = b64dec(data.content);
    var res = await DB.importAll(json);
    cfg().last = U.now();
    cfg().lastStatus = 'ok';
    cfg().lastError = '';
    DB.save();
    return res;
  }

  function maybeAuto(reason) {
    if (!cfg().enabled || !isConfigured() || running || scheduled) return;
    if (!navigator.onLine) return;
    var now = Date.now();
    var last = cfg().last ? Date.parse(cfg().last) : 0;
    var attempt = cfg().lastAttempt ? Date.parse(cfg().lastAttempt) : 0;
    var gap = reason === 'treino' ? 60 * 60 * 1000 : (Number(cfg().intervalHours) || 24) * 3600 * 1000;
    if (last && now - last < gap) return;
    if (attempt && now - attempt < 15 * 60 * 1000) return;
    scheduled = true;
    setTimeout(function () {
      scheduled = false;
      backupNow(reason).catch(function () {});
    }, 1800);
  }

  function init() {
    setTimeout(function () { maybeAuto('abertura'); }, 4000);
    window.addEventListener('online', function () { maybeAuto('online'); });
  }

  function saveConfig(patch) {
    var next = Object.assign({}, cfg(), patch);
    if (Object.prototype.hasOwnProperty.call(patch, 'token')) {
      setToken(String(patch.token || '').trim());
      delete next.token;
    }
    DB.settings.backup = next;
    DB.save();
    return status();
  }
  function clearToken() {
    setToken('');
    cfg().enabled = false;
    DB.save();
  }
  function status() {
    return {
      configured: isConfigured(),
      enabled: !!cfg().enabled,
      repo: repo(),
      branch: branch(),
      last: cfg().last,
      lastStatus: cfg().lastStatus,
      lastError: cfg().lastError,
      lastBytes: cfg().lastBytes,
      running: running,
    };
  }

  F.backup = {
    init: init,
    status: status,
    test: test,
    backupNow: backupNow,
    restore: restore,
    maybeAuto: maybeAuto,
    saveConfig: saveConfig,
    clearToken: clearToken,
    hasToken: function () { return !!getToken(); },
    _b64enc: b64enc,
    _b64dec: b64dec,
  };
})();
