/* =========================================================
   FERRO — Corpo e medidas
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, C = F.calc, DB = F.db, UI = F.ui;
  var FIELDS = [
    { k: 'weight', label: 'Peso', unit: 'u', dec: 1 },
    { k: 'bodyfat', label: 'Gordura', unit: '%', dec: 1 },
    { k: 'chest', label: 'Peito', unit: 'cm', dec: 1 },
    { k: 'waist', label: 'Cintura', unit: 'cm', dec: 1 },
    { k: 'hips', label: 'Quadril', unit: 'cm', dec: 1 },
    { k: 'arm', label: 'Braço', unit: 'cm', dec: 1 },
    { k: 'thigh', label: 'Coxa', unit: 'cm', dec: 1 },
    { k: 'calf', label: 'Gémeo', unit: 'cm', dec: 1 },
    { k: 'neck', label: 'Pescoço', unit: 'cm', dec: 1 },
    { k: 'shoulders', label: 'Ombros', unit: 'cm', dec: 1 },
  ];

  function addWeightSheet() {
    var s = UI.sheet({
      title: 'Registar peso',
      body: '<div class="field"><label class="label">Peso</label><div class="input-suffix"><input class="input num" id="bw-val" inputmode="decimal" placeholder="' + (DB.latestWeight() ? DB.fmtW(DB.latestWeight()) : '78,5') + '"><span class="sfx">' + DB.unit + '</span></div></div>' +
        '<div class="field"><label class="label">Data</label><input class="input" type="date" id="bw-date" value="' + U.todayKey() + '"></div>',
      foot: '<button class="btn btn-primary btn-block" id="bw-save">Guardar</button>',
      onMount: function (x) {
        setTimeout(function () { x.body.querySelector('#bw-val').focus(); }, 250);
        x.root.querySelector('#bw-save').addEventListener('click', function () {
          var v = parseFloat(String(x.body.querySelector('#bw-val').value).replace(',', '.'));
          if (!v) { UI.toast('Introduz o peso', 'err'); return; }
          DB.addWeight(x.body.querySelector('#bw-date').value || U.todayKey(), DB.displayToKg(v));
          x.close(); UI.toast('Peso registado'); F.app.refresh();
        });
      },
    });
  }

  function addMeasurementSheet() {
    var last = DB.latestMeasurement() || {};
    var unit = DB.unit;
    var rows = FIELDS.map(function (f) {
      var v = last[f.k];
      if (f.k === 'weight') v = v ? DB.toDisplay(v) : (DB.latestWeight() ? DB.toDisplay(DB.latestWeight()) : '');
      return '<div class="field" style="margin-bottom:10px"><label class="label">' + f.label + ' <span style="color:var(--txt-3);font-weight:500">' + (f.unit === 'u' ? unit : f.unit) + '</span></label>' +
        '<input class="input sm" data-mf="' + f.k + '" inputmode="decimal" value="' + (v ? U.num(v, f.dec) : '') + '" placeholder="—"></div>';
    }).join('');
    var s = UI.sheet({
      title: 'Nova medição',
      sub: U.fmtDate(new Date(), 'long'),
      tall: true,
      body: '<div class="field"><label class="label">Data</label><input class="input sm" type="date" id="ms-date" value="' + U.todayKey() + '"></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 10px">' + rows + '</div>',
      foot: '<button class="btn btn-primary btn-block" id="ms-save">Guardar medição</button>',
      onMount: function (x) {
        x.root.querySelector('#ms-save').addEventListener('click', function () {
          var data = { date: x.body.querySelector('#ms-date').value || U.todayKey() };
          var any = false;
          x.body.querySelectorAll('[data-mf]').forEach(function (inp) {
            var k = inp.getAttribute('data-mf');
            var v = parseFloat(String(inp.value).replace(',', '.'));
            if (!isNaN(v) && v > 0) { data[k] = k === 'weight' ? DB.displayToKg(v) : v; any = true; }
          });
          if (!any) { UI.toast('Preenche pelo menos um valor', 'err'); return; }
          DB.addMeasurement(data);
          x.close(); UI.toast('Medição guardada'); F.app.refresh();
        });
      },
    });
  }

  function addPhoto() {
    UI.actions({
      title: 'Foto de progresso',
      sub: 'Escolhe o ângulo',
      options: [
        { label: 'Frente', value: 'Frente', icon: 'user' },
        { label: 'Lado', value: 'Lado', icon: 'user' },
        { label: 'Costas', value: 'Costas', icon: 'user' },
        { label: 'Sem etiqueta', value: '', icon: 'camera' },
      ],
    }).then(function (angle) {
      if (angle == null) return;
      U.pickFile('image/*').then(function (file) {
        if (!file) return;
        UI.toast('A processar foto…');
        U.compressImage(file, 1280, 0.76).then(function (blob) {
          var id = U.uid('ph');
          U.idb.put({ id: id, blob: blob }).then(function () {
            DB.addPhotoMeta({ id: id, date: U.todayKey(), angle: angle, note: '' });
            UI.toast('Foto adicionada');
            F.app.refresh();
          }).catch(function () { UI.toast('Sem espaço para fotos', 'err'); });
        });
      });
    });
  }

  function compareSheet(photos) {
    if (photos.length < 2) { UI.toast('Precisas de pelo menos duas fotos', 'err'); return; }
    var a = photos[photos.length - 1], b = photos[0];
    Promise.all([U.idb.get(a.id), U.idb.get(b.id)]).then(function (recs) {
      var urls = recs.map(function (r) { return r && r.blob ? URL.createObjectURL(r.blob) : ''; });
      var wA = DB.state.weights.filter(function (w) { return w.date <= a.date; }).pop();
      var wB = DB.state.weights.filter(function (w) { return w.date <= b.date; }).pop();
      var s = UI.sheet({
        title: 'Comparar',
        sub: U.fmtDate(a.date, 'short') + ' → ' + U.fmtDate(b.date, 'short'),
        body: '<div class="compare"><figure><img src="' + urls[0] + '" alt=""><figcaption>' + U.fmtDate(a.date, 'short') + (wA ? ' · ' + DB.fmtW(wA.value, 1) + ' ' + DB.unit : '') + '</figcaption></figure>' +
          '<figure><img src="' + urls[1] + '" alt=""><figcaption>' + U.fmtDate(b.date, 'short') + (wB ? ' · ' + DB.fmtW(wB.value, 1) + ' ' + DB.unit : '') + '</figcaption></figure></div>' +
          '<div class="mini center mt-12">' + (wA && wB ? 'Variação de ' + U.num(wB.value - wA.value, 1) + ' ' + DB.unit : 'Sem peso associado') + '</div>',
        onClose: function () { urls.forEach(function (u) { if (u) URL.revokeObjectURL(u); }); },
      });
    }).catch(function () { UI.toast('Não foi possível abrir as fotos', 'err'); });
  }

  F.views.body = function () {
    var weights = DB.state.weights;
    var measures = DB.state.measurements;
    var photos = DB.photosSorted();
    var latest = weights[weights.length - 1];
    var latestM = measures[measures.length - 1];
    var prevM = measures[measures.length - 2];
    var goal = DB.settings.bodyGoal;
    var startW = weights.length ? weights[0] : null;
    var monthAgo = U.addDays(new Date(), -30);
    var monthW = weights.filter(function (w) { return U.parse(w.date) >= monthAgo; })[0] || weights[0];
    var delta30 = latest && monthW ? latest.value - monthW.value : 0;

    var weightCard = '';
    if (latest) {
      var goalPct = 0;
      if (goal && startW) {
        var total = goal - startW.value;
        var done = latest.value - startW.value;
        goalPct = total ? U.clamp(Math.round(done / total * 100), 0, 100) : (Math.abs(latest.value - goal) < 0.2 ? 100 : 0);
      }
      weightCard = '<div class="card"><div class="row between"><div><div class="eyebrow">Peso atual</div>' +
        '<div class="row gap-8" style="align-items:baseline"><div class="hero-big" style="font-size:34px">' + DB.fmtW(latest.value, 1) + '</div>' +
        '<div class="mini">' + DB.unit + '</div></div>' +
        '<div class="delta ' + (delta30 <= 0 ? 'up' : 'down') + '">' + (delta30 > 0 ? '+' : '') + U.num(delta30, 1) + ' ' + DB.unit + ' em 30 dias</div></div>' +
        '<div class="center"><div class="mini">' + U.relative(latest.date) + '</div>' +
        '<button class="btn btn-sm btn-soft mt-8" data-act="weight">' + U.svg('plus') + 'Peso</button></div></div>' +
        (goal ? '<div class="mt-12"><div class="row between mini"><span>Objetivo ' + DB.fmtW(goal, 1) + ' ' + DB.unit + '</span><span>' + goalPct + '%</span></div>' +
          '<div class="bar-track mt-8"><div class="bar-fill" style="width:' + goalPct + '%"></div></div></div>' : '') +
        (weights.length > 1 ? '<div class="chart-box" style="height:120px;margin-top:12px"><canvas id="bd-chart"></canvas></div>' : '') + '</div>';
    } else {
      weightCard = UI.empty({ icon: 'scale', title: 'Regista o teu peso', text: 'Acompanha a evolução ao longo das semanas.', action: '<button class="btn btn-primary btn-sm" data-act="weight">Registar peso</button>' });
    }

    var bmi = DB.settings.height && latest ? C.bmi(latest.value, DB.settings.height) : 0;
    var bmiCat = bmi ? (bmi < 18.5 ? 'Abaixo do peso' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Excesso de peso' : 'Obesidade') : '';

    var measureGrid = latestM ? '<div class="measure-grid">' + FIELDS.map(function (f) {
      var v = latestM[f.k];
      if (v == null) return '';
      var prev = prevM ? prevM[f.k] : null;
      var d = prev != null ? v - prev : null;
      var disp = f.k === 'weight' ? DB.toDisplay(v) : v;
      return '<div class="measure"><div class="l">' + f.label + (f.unit === 'u' ? ' · ' + DB.unit : ' · ' + f.unit) + '</div>' +
        '<div class="v">' + U.num(disp, f.dec) + '</div>' +
        (d != null && Math.abs(d) > 0.01 ? '<div class="d" style="color:' + (d > 0 ? 'var(--txt-3)' : 'var(--ok)') + '">' + (d > 0 ? '+' : '') + U.num(f.k === 'weight' ? DB.toDisplay(d) : d, 1) + (f.unit === 'u' ? ' ' + DB.unit : ' ' + f.unit) + '</div>' : '<div class="d">' + U.fmtDate(latestM.date, 'short') + '</div>') +
        '</div>';
    }).join('') + '</div>' : '<div class="card"><div class="card-sub">Fita métrica, % de gordura, braços, cintura… registar tudo ajuda a ver o que a balança esconde.</div>' +
      '<button class="btn btn-soft btn-block mt-12" data-act="measure">' + U.svg('plus') + 'Adicionar medidas</button></div>';

    var photoHtml = '<div class="photo-grid">' + photos.map(function (p) {
      return '<button class="photo-cell" data-photo="' + p.id + '"><img data-img="' + p.id + '" alt="Foto de ' + U.fmtDate(p.date, 'short') + '"><div class="pd">' + U.fmtDate(p.date, 'short') + '</div></button>';
    }).join('') + '<button class="photo-add" data-act="photo">' + U.svg('camera') + '<span>Adicionar</span></button></div>';

    var html = '<div class="screen">' +
      '<header class="screen-head"><div class="page-head"><div><div class="eyebrow">Composição corporal</div><h1 class="page-title">Corpo</h1></div>' +
      '<button class="icon-btn accent" data-act="add" aria-label="Adicionar">' + U.svg('plus') + '</button></div></header>' +
      '<div class="screen-body">' + weightCard +
      (bmi ? '<div class="card tight mt-12"><div class="row between"><div><div class="card-title">IMC ' + U.num(bmi, 1) + '</div><div class="card-sub">' + bmiCat + ' · altura ' + DB.settings.height + ' cm</div></div>' + U.svg('scale') + '</div></div>' : '') +
      '<div class="sec"><div class="sec-head"><div class="sec-title">Medidas</div>' + (latestM ? '<button class="sec-link" data-act="measure">Atualizar</button>' : '') + '</div>' + measureGrid +
      (measures.length > 1 ? '<button class="btn btn-sm btn-ghost btn-block mt-8" data-act="history">Ver histórico de medidas</button>' : '') + '</div>' +
      '<div class="sec"><div class="sec-head"><div class="sec-title">Fotos de progresso</div>' + (photos.length >= 2 ? '<button class="sec-link" data-act="compare">Comparar</button>' : '<span class="mini">' + photos.length + '</span>') + '</div>' +
      photoHtml + '<div class="mini mt-8">As fotos ficam guardadas apenas neste dispositivo.</div></div>' +
      (weights.length ? '<div class="sec"><div class="sec-head"><div class="sec-title">Histórico de peso</div><span class="mini">' + weights.length + ' registos</span></div>' +
        '<div class="card" style="padding:4px 12px">' + weights.slice().reverse().slice(0, 8).map(function (w, i, arr) {
          var next = arr[i + 1];
          var d = next ? w.value - next.value : 0;
          return '<button class="row between" data-delw="' + w.id + '" style="width:100%;padding:9px 2px;border-bottom:1px solid var(--line-2)">' +
            '<div class="row gap-8"><span class="mini" style="width:52px">' + U.fmtDate(w.date, 'short') + '</span><span class="strong num">' + DB.fmtW(w.value, 1) + ' ' + DB.unit + '</span></div>' +
            '<span class="mini num">' + (d ? (d > 0 ? '+' : '') + U.num(d, 1) : '') + '</span></button>';
        }).join('') + '</div></div>' : '') +
      '<div style="height:20px"></div></div></div>';

    return {
      tab: 'body', title: 'Corpo', html: html,
      mount: function (root) {
        root.addEventListener('click', function (e) {
          var act = e.target.closest('[data-act]');
          if (act) {
            var a = act.getAttribute('data-act');
            if (a === 'add' || a === 'weight') addWeightSheet();
            if (a === 'measure') addMeasurementSheet();
            if (a === 'photo') addPhoto();
            if (a === 'compare') compareSheet(photos);
            if (a === 'history') measuresHistory();
            return;
          }
          var ph = e.target.closest('[data-photo]');
          if (ph) {
            var id = ph.getAttribute('data-photo');
            UI.actions({
              title: 'Foto',
              options: [
                { label: 'Ver em grande', value: 'view', icon: 'eye' },
                { label: 'Comparar com a mais recente', value: 'cmp', icon: 'copy' },
                { label: 'Eliminar', value: 'del', icon: 'trash', danger: true },
              ],
            }).then(function (v) {
              if (!v) return;
              if (v === 'view') viewPhoto(id);
              if (v === 'cmp') compareSheet(photos);
              if (v === 'del') {
                UI.confirm({ title: 'Eliminar foto?', message: 'A foto será removida deste dispositivo.', confirmText: 'Eliminar', danger: true }).then(function (ok) {
                  if (!ok) return;
                  DB.deletePhoto(id); UI.toast('Foto eliminada'); F.app.refresh();
                });
              }
            });
            return;
          }
          var delw = e.target.closest('[data-delw]');
          if (delw) {
            UI.confirm({ title: 'Eliminar registo?', message: 'Este registo de peso será removido.', confirmText: 'Eliminar', danger: true }).then(function (ok) {
              if (!ok) return;
              DB.deleteWeight(delw.getAttribute('data-delw')); F.app.refresh();
            });
          }
        });

        if (weights.length > 1) {
          var data = weights.slice(-16).map(function (w) { return { x: w.date, y: DB.toDisplay(w.value), label: U.fmtDate(w.date, 'short') }; });
          F.chart.line(root.querySelector('#bd-chart'), { data: data, yFmt: function (v) { return U.num(v, 1); } });
        }

        // carregar miniaturas
        var urls = [];
        photos.forEach(function (p) {
          U.idb.get(p.id).then(function (rec) {
            if (!rec || !rec.blob) return;
            var img = root.querySelector('[data-img="' + p.id + '"]');
            if (!img) return;
            var u = URL.createObjectURL(rec.blob);
            urls.push(u);
            img.src = u;
          }).catch(function () {});
        });
        F.app.onUnmount(function () { urls.forEach(function (u) { URL.revokeObjectURL(u); }); });
      },
    };

    function viewPhoto(id) {
      U.idb.get(id).then(function (rec) {
        if (!rec || !rec.blob) return;
        var u = URL.createObjectURL(rec.blob);
        var p = DB.state.photos.filter(function (x) { return x.id === id; })[0];
        UI.sheet({
          title: p ? U.fmtDate(p.date, 'long') : 'Foto',
          sub: p && p.angle ? p.angle : '',
          body: '<img src="' + u + '" style="width:100%;border-radius:16px" alt="">',
          onClose: function () { URL.revokeObjectURL(u); },
        });
      });
    }

    function measuresHistory() {
      var list = measures.slice().reverse().slice(0, 10);
      UI.sheet({
        title: 'Histórico de medidas',
        tall: true,
        body: list.map(function (m) {
          return '<div class="card tight mb-8"><div class="row between"><div class="card-title">' + U.fmtDate(m.date, 'medium') + '</div>' +
            '<span class="mini">' + (m.weight ? DB.fmtW(m.weight, 1) + ' ' + DB.unit : '') + '</span></div>' +
            '<div class="row wrap gap-6 mt-8">' + FIELDS.filter(function (f) { return m[f.k] != null && f.k !== 'weight'; }).map(function (f) {
              return '<span class="chip sm">' + f.label + ' ' + U.num(m[f.k], 1) + (f.unit === '%' ? '%' : ' cm') + '</span>';
            }).join('') + '</div></div>';
        }).join(''),
      });
    }
  };
})();
