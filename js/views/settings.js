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
        '<div class="eyebrow">Sem contas · Sem paywalls</div>' +
        '<h1 class="welcome-h">Treina.<br>Regista.<br>Progride.</h1>' +
        '<p class="welcome-p">Tudo o que Hevy e Strong cobram — e mais — offline, sem conta e sem subscrição.</p>' +
        '<div class="welcome-list">' +
        '<div class="welcome-li">' + U.svg('dumbbell') + '<div><b>Registo em segundos</b><span>Séries, RPE, superséries, descanso automático e recordes em tempo real.</span></div></div>' +
        '<div class="welcome-li">' + U.svg('chart') + '<div><b>Progresso a sério</b><span>1RM estimado, volume semanal, equilíbrio muscular e prontidão.</span></div></div>' +
        '<div class="welcome-li">' + U.svg('scale') + '<div><b>Corpo e medidas</b><span>Peso, medidas e fotos de progresso lado a lado.</span></div></div>' +
        '<div class="welcome-li">' + U.svg('lock') + '<div><b>Só teu</b><span>Os dados ficam neste iPhone. Exportas tudo quando quiseres.</span></div></div>' +
        '</div>' +
        '<div class="field mt-16" style="margin-bottom:0"><label class="label">Como te chamas?</label>' +
        '<input class="input" id="wc-name" placeholder="O teu primeiro nome" autocomplete="given-name" value="' + U.esc(DB.settings.name || '') + '"></div>' +
        '<div class="field mt-12" style="margin-bottom:0"><label class="label">Unidades</label>' +
        '<div class="seg" id="wc-unit"><button class="seg-item on" data-u="kg">Quilogramas (kg)</button><button class="seg-item" data-u="lb">Libras (lb)</button></div></div>' +
        '</div>' +
        '<div class="welcome-foot">' +
        '<button class="btn btn-primary btn-lg btn-block" data-act="start">' + U.svg('sparkles') + 'Começar</button>' +
        '<button class="btn btn-ghost btn-block" data-act="demo">Explorar com dados de exemplo</button>' +
        '<div class="ios-hint mt-8">' + U.svg('info') + '<div>Para uma experiência de app: Safari → Partilhar → <b>Adicionar ao ecrã principal</b>.</div></div>' +
        '</div></div>';

      return {
        tab: 'welcome', title: 'Bem-vindo', plain: true,
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
              DB.patch({ name: name || 'Atleta', unit: unit });
              DB.markOnboarded();
              DB.set('theme', DB.settings.theme || 'dark');
              UI.toast('Bem-vindo ao Ferro');
              F.app.go('/');
            }
            if (a === 'demo') {
              var name2 = root.querySelector('#wc-name').value.trim();
              DB.patch({ name: name2 || 'Atleta', unit: unit });
              DB.markOnboarded();
              DB.loadDemo();
              UI.toast('Dados de exemplo carregados');
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
      title: 'Barra e discos',
      sub: 'Inventário do teu ginásio',
      body: '<div class="field"><label class="label">Peso da barra</label><div class="input-suffix"><input class="input num" id="ps-bar" inputmode="decimal" value="' + U.num(bar, 1) + '"><span class="sfx">kg</span></div></div>' +
        '<label class="label">Discos disponíveis (por lado)</label>' +
        '<div class="chips" id="ps-list" style="flex-wrap:wrap;margin:0;padding:0">' +
        all.map(function (p) {
          return '<button class="chip ' + (chosen.indexOf(p) >= 0 ? 'on' : '') + '" data-plate="' + p + '" style="height:42px">' + U.num(p, p % 1 ? 2 : 0) + ' kg</button>';
        }).join('') + '</div>' +
        '<div class="mini mt-12">Usado na calculadora de discos e no gerador de aquecimento.</div>',
      foot: '<button class="btn btn-primary btn-block" id="ps-save">Guardar</button>',
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
          x.close(); UI.toast('Material atualizado'); F.app.refresh();
        });
      },
    });
  }

  function targetsSheet() {    var copy = Object.assign({}, DB.settings.targets);
    var list = C.MUSCLE_ORDER.filter(function (m) { return C.MUSCLES[m]; });
    var s = UI.sheet({
      title: 'Objetivo semanal',
      sub: 'Séries por grupo muscular',
      tall: true,
      body: '<div class="card flat mb-12" style="padding:11px 12px"><div class="mini" style="line-height:1.45">Valores de referência para hipertrofia: 10–20 séries por grupo por semana. Ajusta ao teu volume e recuperação.</div></div>' +
        list.map(function (m) {
          return '<div class="target-row"><div class="tn">' + UI.muscleDot(m) + C.muscle(m).label + '</div>' +
            '<div class="stepper"><button data-t-m="' + m + '" data-d="-1">' + U.svg('minus') + '</button>' +
            '<div class="val" data-t-v="' + m + '">' + (copy[m] || 0) + '</div>' +
            '<button data-t-m="' + m + '" data-d="1">' + U.svg('plus') + '</button></div></div>';
        }).join(''),
      foot: '<button class="btn btn-primary btn-block" id="tg-save">Guardar objetivos</button>',
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
          x.close(); UI.toast('Objetivos atualizados'); F.app.refresh();
        });
      },
    });
  }

  function csvExport() {
    var rows = [['Data', 'Hora', 'Treino', 'Exercício', 'Série', 'Tipo', 'Peso (kg)', 'Reps', 'RPE', 'Volume (kg)']];
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
    U.download('ferro-treinos-' + U.todayKey() + '.csv', csv, 'text/csv;charset=utf-8');
  }

  function openInstallHint() { F.app.install(); }

  function settingsView() {
    var s = DB.settings;
    var st = DB.stats();
    var size = 0;
    try { size = (JSON.stringify(DB.state).length / 1024).toFixed(0); } catch (e) {}
    var targetsTotal = U.sum(C.MUSCLE_ORDER, function (m) { return Number(s.targets[m]) || 0; });

    var profile = group('Perfil',
      navRow('Nome', 'name', '', 'user', s.name || 'Atleta') +
      navRow('Altura', 'height', 'Para IMC e força relativa', 'ruler', s.height ? s.height + ' cm' : '—') +
      navRow('Sexo biológico', 'sex', 'Usado nos cálculos de força', 'user', s.sex === 'f' ? 'Feminino' : 'Masculino') +
      navRow('Peso objetivo', 'goalWeight', '', 'target', s.bodyGoal ? DB.fmtW(s.bodyGoal) + ' ' + DB.unit : '—'));

    var training = group('Treino',
      '<div class="set-row"><div class="set-row-main"><div class="set-row-t">Unidades</div></div>' +
      '<div class="seg" style="width:132px"><button class="seg-item ' + (s.unit === 'kg' ? 'on' : '') + '" data-unit="kg">kg</button><button class="seg-item ' + (s.unit === 'lb' ? 'on' : '') + '" data-unit="lb">lb</button></div></div>' +
      navRow('Descanso predefinido', 'rest', 'Entre séries', 'timer', U.fmtClock(s.restDefault || 120)) +
      navRow('Barra e discos', 'plates', 'Barra ' + U.num(s.bar || 20, 0) + ' kg · ' + (s.plates || []).length + ' discos', 'plate', '') +
      toggleRow('Descanso automático', 'autoRest', 'Arranca ao concluir uma série', 'timer') +
      toggleRow('RPE nas séries', 'rpe', 'Registo de esforço percebido', 'target') +
      toggleRow('Séries de aquecimento', 'warmups', 'Permitir séries A', 'flame') +
      navRow('Objetivo semanal', 'goal', 'Treinos por semana', 'check', (s.weeklyGoal || 0) + ' treinos') +
      navRow('Séries por músculo', 'targets', targetsTotal + ' séries/semana', 'chart', ''));

    var display = group('Aparência e dados',
      '<div class="set-row"><div class="set-row-main"><div class="set-row-t">Tema</div></div>' +
      '<div class="seg" style="width:132px"><button class="seg-item ' + (s.theme !== 'light' ? 'on' : '') + '" data-theme-btn="dark">Escuro</button><button class="seg-item ' + (s.theme === 'light' ? 'on' : '') + '" data-theme-btn="light">Claro</button></div></div>' +
      '<div class="set-row"><div class="set-row-main"><div class="set-row-t">Semana começa</div></div>' +
      '<div class="seg" style="width:158px"><button class="seg-item ' + (s.firstDay !== 0 ? 'on' : '') + '" data-first="1">Segunda</button><button class="seg-item ' + (s.firstDay === 0 ? 'on' : '') + '" data-first="0">Domingo</button></div></div>' +
      toggleRow('Sons', 'sound', 'Aviso no fim do descanso', 'bell') +
      toggleRow('Vibração', 'vibrate', 'Quando disponível', 'zap') +
      '<button class="set-row" data-open="notify">' + U.svg('bell') +
      '<div class="set-row-main"><div class="set-row-t">Notificações</div><div class="set-row-s">Aviso de descanso no ecrã bloqueado</div></div>' +
      '<span class="set-row-v">' + (typeof Notification !== 'undefined' && Notification.permission === 'granted' ? 'Activas' : 'Inativas') + '</span>' + U.svg('right') + '</button>' +
      '<button class="set-row" data-open="install">' + U.svg('download') +
      '<div class="set-row-main"><div class="set-row-t">Instalar no iPhone</div><div class="set-row-s">' + (U.isStandalone() ? 'Já estás a usar como app' : 'Adicionar ao ecrã principal') + '</div></div>' + U.svg('right') + '</button>');

    var dataGroup = group('Os teus dados',
      '<button class="set-row" data-open="export"><span class="item-thumb" style="width:28px;height:28px;background:transparent;border:0;color:var(--accent-text)">' + U.svg('download') + '</span>' +
      '<div class="set-row-main"><div class="set-row-t">Exportar backup completo</div><div class="set-row-s">JSON com treinos, rotinas, corpo e fotos</div></div>' + U.svg('right') + '</button>' +
      '<button class="set-row" data-open="csv"><span class="item-thumb" style="width:28px;height:28px;background:transparent;border:0;color:var(--txt-2)">' + U.svg('list') + '</span>' +
      '<div class="set-row-main"><div class="set-row-t">Exportar treinos (CSV)</div><div class="set-row-s">Abre no Excel ou Sheets</div></div>' + U.svg('right') + '</button>' +
      '<button class="set-row" data-open="import">' + U.svg('upload') +
      '<div class="set-row-main"><div class="set-row-t">Importar backup</div><div class="set-row-s">Substitui os dados actuais</div></div>' + U.svg('right') + '</button>' +
      '<div class="set-row"><div class="set-row-main"><div class="set-row-t">Cópia de segurança</div><div class="set-row-s">Automática, diária, neste iPhone</div></div>' +
      '<span class="set-row-v">' + (DB.state.meta.lastExport ? 'último ' + U.relative(DB.state.meta.lastExport).toLowerCase() : 'nunca exportado') + '</span></div>' +
      '<button class="set-row" data-open="demo">' + U.svg('sparkles') +
      '<div class="set-row-main"><div class="set-row-t">Carregar dados de exemplo</div><div class="set-row-s">10 semanas de treinos para explorar</div></div>' + U.svg('right') + '</button>' +
      '<button class="set-row danger" data-open="reset">' + U.svg('trash') +
      '<div class="set-row-main"><div class="set-row-t">Apagar tudo</div><div class="set-row-s">' + st.workouts + ' treinos · ' + size + ' KB</div></div>' + U.svg('right') + '</button>');

    var html = '<div class="screen">' +
      '<header class="screen-head">' + UI.navHead({ title: 'Definições', back: false, right: '<button class="icon-btn" data-nav="/" aria-label="Fechar">' + U.svg('x') + '</button>' }) + '</header>' +
      '<div class="screen-body">' +
      '<div class="card mb-16" style="display:flex;align-items:center;gap:13px"><div class="avatar" style="width:52px;height:52px;font-size:16px">' + U.esc(U.initials(s.name || 'Atleta')) + '</div>' +
      '<div class="grow"><div class="h3">' + U.esc(s.name || 'Atleta') + '</div><div class="mini">' + st.workouts + ' treinos · ' + st.sets + ' séries · desde ' + (st.first ? U.fmtDate(st.first, 'short') : 'hoje') + '</div></div>' +
      '<div class="badge accent">PRO</div></div>' +
      profile + training + '<div class="group"><div class="group-h">Objetivos musculares</div>' +
      C.MUSCLE_ORDER.filter(function (m) { return (s.targets[m] || 0) > 0; }).map(function (m) {
        return '<div class="target-row"><div class="tn">' + UI.muscleDot(m) + C.muscle(m).label + '</div><span class="set-row-v">' + s.targets[m] + ' séries</span></div>';
      }).join('') +
      '<button class="set-row" data-open="targets"><div class="set-row-main"><div class="set-row-t">Editar objetivos</div></div>' + U.svg('right') + '</button></div>' +
      display + dataGroup +
      '<div class="center mini" style="opacity:.5;line-height:1.6;padding:10px 0 30px">FERRO 1.0 · Feito para iPhone<br>Tudo incluído, para sempre.</div>' +
      '</div></div>';

    return {
      tab: 'settings', title: 'Definições', html: html,
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
          if (u) { DB.set('unit', u.getAttribute('data-unit')); UI.toast('Unidades: ' + DB.unit); F.app.refresh(); return; }
          var th = e.target.closest('[data-theme-btn]');
          if (th) { DB.set('theme', th.getAttribute('data-theme-btn')); F.app.refresh(); return; }
          var fd = e.target.closest('[data-first]');
          if (fd) { DB.set('firstDay', +fd.getAttribute('data-first')); F.app.refresh(); return; }
          var o = e.target.closest('[data-open]');
          if (!o) return;
          var a = o.getAttribute('data-open');
          if (a === 'name') {
            UI.prompt({ title: 'O teu nome', label: 'Nome', value: s.name || '' }).then(function (v) {
              if (v == null) return; DB.set('name', v.trim() || 'Atleta'); F.app.refresh();
            });
          }
          if (a === 'height') {
            UI.prompt({ title: 'Altura', label: 'Centímetros', value: s.height || '', type: 'number', inputmode: 'numeric' }).then(function (v) {
              if (v == null) return; DB.set('height', parseFloat(v) || null); F.app.refresh();
            });
          }
          if (a === 'goalWeight') {
            UI.prompt({ title: 'Peso objetivo', label: 'Peso em ' + DB.unit, value: s.bodyGoal ? DB.fmtW(s.bodyGoal) : '', inputmode: 'decimal' }).then(function (v) {
              if (v == null) return;
              DB.set('bodyGoal', v === '' ? null : DB.displayToKg(parseFloat(String(v).replace(',', '.')))); F.app.refresh();
            });
          }
          if (a === 'sex') {
            UI.actions({ title: 'Sexo biológico', options: [{ label: 'Masculino', value: 'm' }, { label: 'Feminino', value: 'f' }] }).then(function (v) {
              if (!v) return; DB.set('sex', v); F.app.refresh();
            });
          }
          if (a === 'rest') {
            UI.actions({
              title: 'Descanso predefinido',
              options: [45, 60, 90, 120, 150, 180, 210, 240, 300].map(function (x) { return { label: U.fmtClock(x), value: x, sub: x + ' segundos' }; }),
            }).then(function (v) { if (v) { DB.set('restDefault', v); F.app.refresh(); } });
          }
          if (a === 'goal') {
            UI.actions({
              title: 'Treinos por semana',
              options: [2, 3, 4, 5, 6, 7].map(function (x) { return { label: x + ' treinos', value: x }; }),
            }).then(function (v) { if (v) { DB.set('weeklyGoal', v); F.app.refresh(); } });
          }
          if (a === 'targets') targetsSheet();
          if (a === 'plates') platesSheet();
          if (a === 'install') openInstallHint();
          if (a === 'notify') {
            if (typeof Notification === 'undefined') { UI.toast('Não suportado neste dispositivo', 'err'); return; }
            if (Notification.permission === 'granted') { UI.toast('Notificações já ativas'); return; }
            Notification.requestPermission().then(function (p) {
              UI.toast(p === 'granted' ? 'Notificações ativas' : 'Permissão recusada', p === 'granted' ? 'ok' : 'err');
              F.app.refresh();
            });
          }
          if (a === 'export') {
            UI.toast('A preparar backup…');
            DB.exportAll(true).then(function (json) {
              U.download('ferro-backup-' + U.todayKey() + '.json', json, 'application/json');
              UI.toast('Backup exportado');
              F.app.refresh();
            }).catch(function () { UI.toast('Falhou a exportação', 'err'); });
          }
          if (a === 'csv') { csvExport(); UI.toast('CSV exportado'); }
          if (a === 'import') {
            UI.confirm({ title: 'Importar backup?', message: 'Os dados actuais serão substituídos pelo ficheiro.', confirmText: 'Escolher ficheiro' }).then(function (ok) {
              if (!ok) return;
              U.pickFile('.json,application/json').then(function (file) {
                if (!file) return;
                U.readText(file).then(function (txt) {
                  DB.importAll(txt).then(function (res) {
                    UI.toast(res.workouts + ' treinos importados');
                    F.app.go('/');
                  }).catch(function (err) { UI.toast('Ficheiro inválido', 'err'); });
                });
              });
            });
          }
          if (a === 'demo') {
            UI.confirm({ title: 'Carregar exemplo?', message: 'Adiciona 3 rotinas e 10 semanas de treinos de demonstração.', confirmText: 'Carregar' }).then(function (ok) {
              if (!ok) return;
              DB.loadDemo(); UI.toast('Exemplo carregado'); F.app.go('/');
            });
          }
          if (a === 'reset') {
            UI.confirm({ title: 'Apagar tudo?', message: 'Todos os treinos, rotinas, fotos e medidas serão apagados deste iPhone. Exporta primeiro se quiseres guardar.', confirmText: 'Apagar tudo', danger: true }).then(function (ok) {
              if (!ok) return;
              DB.resetAll(); UI.toast('Tudo apagado'); F.app.go('/welcome');
            });
          }
        });
      },
    };
  }

  F.views.settings = settingsView;
})();
