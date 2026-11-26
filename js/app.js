/* =========================================================
   FERRO — aplicação, router e navegação
   ========================================================= */
(function () {
  'use strict';
  var F = (window.Ferro = window.Ferro || {});
  var U = F.u;
  var DB = F.db;
  var App = (F.app = {});
  F.views = F.views || {};

  var ROUTES = [
    ['/', 'home'],
    ['/workout', 'workout'],
    ['/routines', 'routines'],
    ['/routines/new', 'routines'],
    ['/routines/:id', 'routines'],
    ['/routines/:id/edit', 'routines'],
    ['/history', 'history'],
    ['/history/:id', 'history'],
    ['/progress', 'progress'],
    ['/body', 'body'],
    ['/exercises', 'exercises'],
    ['/exercises/:id', 'exercises'],
    ['/tools', 'tools'],
    ['/achievements', 'achievements'],
    ['/settings', 'settings'],
    ['/more', 'more'],
    ['/welcome', 'welcome'],
  ];

  var TABS = [
    { view: 'home', path: '/', icon: 'home', label: 'Início' },
    { view: 'routines', path: '/routines', icon: 'folder', label: 'Rotinas' },
    { view: 'workout', path: '/workout', icon: 'dumbbell', label: 'Treinar', main: true },
    { view: 'progress', path: '/progress', icon: 'chart', label: 'Progresso' },
    { view: 'more', path: '/more', icon: 'grid', label: 'Mais' },
  ];
  var TAB_OF = {
    home: 'home', workout: 'workout', routines: 'routines', progress: 'progress', more: 'more',
    history: 'more', body: 'more', exercises: 'more', tools: 'more', achievements: 'more', settings: 'more',
    welcome: null,
  };

  App.cleanups = [];
  App.onUnmount = function (fn) { App.cleanups.push(fn); };
  App._keepScroll = false;
  App.installEvent = null;

  function parseHash() {
    var h = location.hash.replace(/^#/, '');
    if (!h) return '/';
    if (h.charAt(0) !== '/') h = '/' + h;
    return h;
  }
  function match(path) {
    var pp = path.split('?')[0].split('/').filter(Boolean);
    for (var i = 0; i < ROUTES.length; i++) {
      var route = ROUTES[i];
      var parts = route[0].split('/').filter(Boolean);
      if (parts.length !== pp.length) continue;
      var params = {}, ok = true;
      for (var j = 0; j < parts.length; j++) {
        if (parts[j].charAt(0) === ':') params[parts[j].slice(1)] = decodeURIComponent(pp[j]);
        else if (parts[j] !== pp[j]) { ok = false; break; }
      }
      if (ok) return { view: route[1], params: params, path: path };
    }
    return { view: 'home', params: {}, path: '/' };
  }

  App.buildTabbar = function () {
    var bar = document.getElementById('tabbar');
    if (!bar) return;
    bar.innerHTML = TABS.map(function (t) {
      if (t.main) {
        return '<button class="tab main" data-nav="' + t.path + '" data-tab="' + t.view + '" aria-label="' + t.label + '">' +
          '<span class="bubble">' + U.svg(t.icon) + '</span><span class="lbl">' + t.label + '</span></button>';
      }
      return '<button class="tab" data-nav="' + t.path + '" data-tab="' + t.view + '" aria-label="' + t.label + '">' +
        U.svg(t.icon) + '<span>' + t.label + '</span></button>';
    }).join('');
  };
  App.updateTab = function (view) {
    var tab = TAB_OF[view];
    document.querySelectorAll('#tabbar .tab').forEach(function (el) {
      el.classList.toggle('on', el.getAttribute('data-tab') === tab);
    });
    var bar = document.getElementById('tabbar');
    if (bar) bar.style.display = view === 'welcome' ? 'none' : '';
  };

  App.refresh = function () {
    App._keepScroll = true;
    App.render();
  };

  App.go = function (path) {
    var cur = parseHash();
    if (cur === path) { App.render(); return; }
    location.hash = path;
  };

  App.render = function () {
    App.cleanups.forEach(function (fn) { try { fn(); } catch (e) {} });
    App.cleanups = [];
    var current = document.getElementById('view');
    if (!current) return;
    // substitui o nó para eliminar listeners acumulados entre renders
    var viewEl = current.cloneNode(false);
    current.parentNode.replaceChild(viewEl, current);
    var path = parseHash();
    if (!DB.state.meta.onboarded && path !== '/welcome') {
      location.replace('#/welcome');
      return;
    }
    if (path === '/' && !location.hash) {
      try { history.replaceState(null, '', '#/'); } catch (e) {}
    }
    var m = match(path);
    var fn = F.views[m.view];
    if (typeof fn !== 'function') {
      viewEl.innerHTML = '<div class="screen"><div class="empty"><div class="empty-t">A carregar…</div></div></div>';
      return;
    }
    var y = App._keepScroll ? window.scrollY : 0;
    var keep = App._keepScroll;
    App._keepScroll = false;
    var res;
    try {
      res = fn(m.params);
    } catch (err) {
      console.error(err);
      viewEl.innerHTML = '<div class="screen" style="padding-top:60px">' +
        '<div class="empty"><div class="empty-ic">' + U.svg('info') + '</div>' +
        '<div class="empty-t">Algo falhou</div>' +
        '<div class="empty-s">' + U.esc(err && err.message ? err.message : 'Erro inesperado') + '</div>' +
        '<button class="btn btn-primary" onclick="location.reload()">Recarregar</button></div></div>';
      return;
    }
    if (!res) return;
    viewEl.innerHTML = res.html;
    viewEl.classList.toggle('plain', !!res.plain);
    App.updateTab(m.view);
    document.body.classList.toggle('wo-mode', !!res.hideTab);
    var bar = document.getElementById('tabbar');
    if (bar) bar.style.display = (res.hideTab || m.view === 'welcome') ? 'none' : '';
    var screenEl = viewEl.querySelector('.screen');
    if (screenEl && keep) screenEl.style.animation = 'none';
    if (res.title) document.title = res.title + ' — Ferro';
    else document.title = 'Ferro — Treino';
    if (res.mount) {
      try { res.mount(viewEl, m.params); } catch (e) { console.error('mount:', e); }
    }
    if (res.after) {
      try { res.after(); } catch (e) {}
    }
    window.scrollTo(0, y);
    if (res.scrollTop) window.scrollTo(0, 0);
  };

  /* ---------- welcome / more ---------- */
  if (!F.views.more) {
    F.views.more = function () {
      var s = DB.stats();
      var items = [
        { path: '/history', icon: 'calendar', t: 'Histórico', s: s.workouts + ' treinos registados' },
        { path: '/body', icon: 'scale', t: 'Corpo e medidas', s: 'Peso, medidas e fotos' },
        { path: '/exercises', icon: 'book', t: 'Exercícios', s: DB.allExercises().length + ' na biblioteca' },
        { path: '/tools', icon: 'calc', t: 'Ferramentas', s: '1RM, discos, temporizadores' },
        { path: '/achievements', icon: 'trophy', t: 'Conquistas', s: 'Recordes e marcos' },
        { path: '/settings', icon: 'gear', t: 'Definições', s: 'Perfil, unidades, dados' },
      ];
      return {
        tab: 'more',
        title: 'Mais',
        html: '<div class="screen"><header class="screen-head"><div class="page-head"><div><div class="eyebrow">Ferro</div><h1 class="page-title">Mais</h1></div>' +
          '<button class="avatar" data-nav="/settings">' + U.esc(U.initials(DB.settings.name || 'Eu')) + '</button></div></header>' +
          '<div class="screen-body">' +
          '<div class="list">' + items.map(function (it) {
            return '<button class="item" data-nav="' + it.path + '"><div class="item-thumb">' + U.svg(it.icon) + '</div>' +
              '<div class="item-main"><div class="item-title">' + it.t + '</div><div class="item-sub">' + U.esc(it.s) + '</div></div>' +
              '<div class="chev">' + U.svg('right') + '</div></button>';
          }).join('') + '</div>' +
          '<div class="card mt-16" style="text-align:center;padding:20px">' +
          '<div style="font-size:13px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--txt-2)">FERRO</div>' +
          '<div class="mini mt-8">Tudo incluído · Sem contas · Offline<br>Os teus dados ficam neste dispositivo.</div>' +
          '<div class="mini mt-8" style="opacity:.6">Versão 1.0</div>' +
          '</div></div></div>',
      };
    };
  }

  /* ---------- eventos globais ---------- */
  function globalClick(e) {
    var nav = e.target.closest('[data-nav]');
    if (nav) {
      e.preventDefault();
      var v = nav.getAttribute('data-nav');
      if (v === 'back') {
        if (history.length > 1) history.back();
        else App.go('/');
      } else {
        App.go(v);
      }
    }
  }

  function boot() {
    DB.init();
    if (F.backup) F.backup.init();
    App.buildTabbar();
    window.addEventListener('hashchange', App.render);
    document.addEventListener('click', globalClick);
    document.addEventListener('click', function () { F.timer.unlock(); }, { once: true });
    document.addEventListener('pointerdown', function () { F.timer.unlock(); }, { once: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) DB.saveNow();
    });
    window.addEventListener('pagehide', function () { DB.saveNow(); });
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      App.installEvent = e;
    });
    F.timer.mount();
    App.render();
    setTimeout(function () {
      var sp = document.getElementById('splash');
      if (sp) sp.classList.add('hide');
      setTimeout(function () { if (sp) sp.remove(); }, 600);
    }, 320);
    if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    }
  }

  App.notifyPermission = function () {
    if (!('Notification' in window)) { F.ui.toast('Este dispositivo não suporta notificações', 'err'); return; }
    Notification.requestPermission().then(function (p) {
      if (p === 'granted') F.ui.toast('Notificações activadas');
      else F.ui.toast('Notificações não autorizadas', 'err');
    });
  };

  App.install = function () {
    if (App.installEvent) {
      App.installEvent.prompt();
      App.installEvent.userChoice.then(function () { App.installEvent = null; });
      return;
    }
    F.ui.sheet({
      title: 'Instalar no iPhone',
      body: '<div class="ios-hint" style="margin-bottom:14px">' + U.svg('info') +
        '<div>No Safari, toca em <b>Partilhar</b> (quadrado com seta) e depois em <b>Adicionar ao ecrã principal</b>. Fica com um ícone próprio e abre em ecrã inteiro, como uma app.</div></div>' +
        '<div class="col gap-12">' +
        '<div class="row gap-12"><div class="item-thumb">' + U.svg('share') + '</div><div class="item-main"><div class="item-title">1. Partilhar</div><div class="item-sub">Barra inferior do Safari</div></div></div>' +
        '<div class="row gap-12"><div class="item-thumb">' + U.svg('plus') + '</div><div class="item-main"><div class="item-title">2. Adicionar ao ecrã principal</div><div class="item-sub">Desliza a lista de opções</div></div></div>' +
        '<div class="row gap-12"><div class="item-thumb">' + U.svg('check') + '</div><div class="item-main"><div class="item-title">3. Adicionar</div><div class="item-sub">Passa a abrir sem barra do Safari</div></div></div>' +
        '</div>',
      foot: '<button class="btn btn-primary btn-block" data-sheet-close>Entendido</button>',
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
