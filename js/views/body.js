/* =========================================================
   FERRO — Corpo e medidas
   ========================================================= */
(function () {
  'use strict';
  var F = window.Ferro;
  var U = F.u, C = F.calc, DB = F.db, UI = F.ui;
  var FIELDS = [
    { k: 'weight', label: 'Weight', unit: 'u', dec: 1 },
    { k: 'bodyfat', label: 'Body fat', unit: '%', dec: 1 },
    { k: 'chest', label: 'Chest', unit: 'cm', dec: 1 },
    { k: 'waist', label: 'Waist', unit: 'cm', dec: 1 },
    { k: 'hips', label: 'Hips', unit: 'cm', dec: 1 },
    { k: 'arm', label: 'Arm', unit: 'cm', dec: 1 },
    { k: 'thigh', label: 'Thigh', unit: 'cm', dec: 1 },
    { k: 'calf', label: 'Calf', unit: 'cm', dec: 1 },
    { k: 'neck', label: 'Neck', unit: 'cm', dec: 1 },
    { k: 'shoulders', label: 'Shoulders', unit: 'cm', dec: 1 },
  ];

  // stored angle keys → visible labels
  var ANGLE_LABELS = { Frente: 'Front', Lado: 'Side', Costas: 'Back' };

  function addWeightSheet() {
    var s = UI.sheet({
      title: 'Log weight',
      body: '<div class="field"><label class="label">Weight</label><div class="input-suffix"><input class="input num" id="bw-val" inputmode="decimal" placeholder="' + (DB.latestWeight() ? DB.fmtW(DB.latestWeight()) : '78.5') + '"><span class="sfx">' + DB.unit + '</span></div></div>' +
        '<div class="field"><label class="label">Date</label><input class="input" type="date" id="bw-date" value="' + U.todayKey() + '"></div>',
      foot: '<button class="btn btn-primary btn-block" id="bw-save">Save</button>',
      onMount: function (x) {
        setTimeout(function () { x.body.querySelector('#bw-val').focus(); }, 250);
        x.root.querySelector('#bw-save').addEventListener('click', function () {
          var v = parseFloat(String(x.body.querySelector('#bw-val').value).replace(',', '.'));
          if (!v) { UI.toast('Enter your weight', 'err'); return; }
          DB.addWeight(x.body.querySelector('#bw-date').value || U.todayKey(), DB.displayToKg(v));
          x.close(); UI.toast('Weight logged'); F.app.refresh();
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
      title: 'New measurement',
      sub: U.fmtDate(new Date(), 'long'),
      tall: true,
      body: '<div class="field"><label class="label">Date</label><input class="input sm" type="date" id="ms-date" value="' + U.todayKey() + '"></div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 10px">' + rows + '</div>',
      foot: '<button class="btn btn-primary btn-block" id="ms-save">Save measurement</button>',
      onMount: function (x) {
        x.root.querySelector('#ms-save').addEventListener('click', function () {
          var data = { date: x.body.querySelector('#ms-date').value || U.todayKey() };
          var any = false;
          x.body.querySelectorAll('[data-mf]').forEach(function (inp) {
            var k = inp.getAttribute('data-mf');
            var v = parseFloat(String(inp.value).replace(',', '.'));
            if (!isNaN(v) && v > 0) { data[k] = k === 'weight' ? DB.displayToKg(v) : v; any = true; }
          });
          if (!any) { UI.toast('Fill in at least one value', 'err'); return; }
          DB.addMeasurement(data);
          x.close(); UI.toast('Measurement saved'); F.app.refresh();
        });
      },
    });
  }

  function addPhoto() {
    UI.actions({
      title: 'Progress photo',
      sub: 'Choose the angle',
      options: [
        { label: 'Front', value: 'Frente', icon: 'user' },
        { label: 'Side', value: 'Lado', icon: 'user' },
        { label: 'Back', value: 'Costas', icon: 'user' },
        { label: 'No tag', value: '', icon: 'camera' },
      ],
    }).then(function (angle) {
      if (angle == null) return;
      U.pickFile('image/*').then(function (file) {
        if (!file) return;
        UI.toast('Processing photo…');
        U.compressImage(file, 1280, 0.76).then(function (blob) {
          var id = U.uid('ph');
          U.idb.put({ id: id, blob: blob }).then(function () {
            DB.addPhotoMeta({ id: id, date: U.todayKey(), angle: angle, note: '' });
            UI.toast('Photo added');
            F.app.refresh();
          }).catch(function () { UI.toast('No space for photos', 'err'); });
        });
      });
    });
  }

  function compareSheet(photos) {
    if (photos.length < 2) { UI.toast('You need at least two photos', 'err'); return; }
    var a = photos[photos.length - 1], b = photos[0];
    Promise.all([U.idb.get(a.id), U.idb.get(b.id)]).then(function (recs) {
      var urls = recs.map(function (r) { return r && r.blob ? URL.createObjectURL(r.blob) : ''; });
      var wA = DB.state.weights.filter(function (w) { return w.date <= a.date; }).pop();
      var wB = DB.state.weights.filter(function (w) { return w.date <= b.date; }).pop();
      var s = UI.sheet({
        title: 'Compare',
        sub: U.fmtDate(a.date, 'short') + ' → ' + U.fmtDate(b.date, 'short'),
        body: '<div class="compare"><figure><img src="' + urls[0] + '" alt=""><figcaption>' + U.fmtDate(a.date, 'short') + (wA ? ' · ' + DB.fmtW(wA.value, 1) + ' ' + DB.unit : '') + '</figcaption></figure>' +
          '<figure><img src="' + urls[1] + '" alt=""><figcaption>' + U.fmtDate(b.date, 'short') + (wB ? ' · ' + DB.fmtW(wB.value, 1) + ' ' + DB.unit : '') + '</figcaption></figure></div>' +
          '<div class="mini center mt-12">' + (wA && wB ? 'Change of ' + U.num(wB.value - wA.value, 1) + ' ' + DB.unit : 'No linked weight') + '</div>',
        onClose: function () { urls.forEach(function (u) { if (u) URL.revokeObjectURL(u); }); },
      });
    }).catch(function () { UI.toast('Could not open the photos', 'err'); });
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
      weightCard = '<div class="card"><div class="row between"><div><div class="eyebrow">Current weight</div>' +
        '<div class="row gap-8" style="align-items:baseline"><div class="hero-big" style="font-size:34px">' + DB.fmtW(latest.value, 1) + '</div>' +
        '<div class="mini">' + DB.unit + '</div></div>' +
        '<div class="delta ' + (delta30 <= 0 ? 'up' : 'down') + '">' + (delta30 > 0 ? '+' : '') + U.num(delta30, 1) + ' ' + DB.unit + ' in 30 days</div></div>' +
        '<div class="center"><div class="mini">' + U.relative(latest.date) + '</div>' +
        '<button class="btn btn-sm btn-soft mt-8" data-act="weight">' + U.svg('plus') + 'Weight</button></div></div>' +
        (goal ? '<div class="mt-12"><div class="row between mini"><span>Goal ' + DB.fmtW(goal, 1) + ' ' + DB.unit + '</span><span>' + goalPct + '%</span></div>' +
          '<div class="bar-track mt-8"><div class="bar-fill" style="width:' + goalPct + '%"></div></div></div>' : '') +
        (weights.length > 1 ? '<div class="chart-box" style="height:120px;margin-top:12px"><canvas id="bd-chart"></canvas></div>' : '') + '</div>';
    } else {
      weightCard = UI.empty({ icon: 'scale', title: 'Log your weight', text: 'Track how you change over the weeks.', action: '<button class="btn btn-primary btn-sm" data-act="weight">Log weight</button>' });
    }

    var bmi = DB.settings.height && latest ? C.bmi(latest.value, DB.settings.height) : 0;
    var bmiCat = bmi ? (bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obese') : '';

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
    }).join('') + '</div>' : '<div class="card"><div class="card-sub">Tape measure, body fat %, arms, waist… logging everything shows what the scales hide.</div>' +
      '<button class="btn btn-soft btn-block mt-12" data-act="measure">' + U.svg('plus') + 'Add measurements</button></div>';

    var photoHtml = '<div class="photo-grid">' + photos.map(function (p) {
      return '<button class="photo-cell" data-photo="' + p.id + '"><img data-img="' + p.id + '" alt="Photo from ' + U.fmtDate(p.date, 'short') + '"><div class="pd">' + U.fmtDate(p.date, 'short') + '</div></button>';
    }).join('') + '<button class="photo-add" data-act="photo">' + U.svg('camera') + '<span>Add</span></button></div>';

    var html = '<div class="screen">' +
      '<header class="screen-head"><div class="page-head"><div><div class="eyebrow">Body composition</div><h1 class="page-title">Body</h1></div>' +
      '<button class="icon-btn accent" data-act="add" aria-label="Add">' + U.svg('plus') + '</button></div></header>' +
      '<div class="screen-body">' + weightCard +
      (bmi ? '<div class="card tight mt-12"><div class="row between"><div><div class="card-title">BMI ' + U.num(bmi, 1) + '</div><div class="card-sub">' + bmiCat + ' · height ' + DB.settings.height + ' cm</div></div>' + U.svg('scale') + '</div></div>' : '') +
      '<div class="sec"><div class="sec-head"><div class="sec-title">Measurements</div>' + (latestM ? '<button class="sec-link" data-act="measure">Update</button>' : '') + '</div>' + measureGrid +
      (measures.length > 1 ? '<button class="btn btn-sm btn-ghost btn-block mt-8" data-act="history">See measurement history</button>' : '') + '</div>' +
      '<div class="sec"><div class="sec-head"><div class="sec-title">Progress photos</div>' + (photos.length >= 2 ? '<button class="sec-link" data-act="compare">Compare</button>' : '<span class="mini">' + photos.length + '</span>') + '</div>' +
      photoHtml + '<div class="mini mt-8">Photos are stored on this device only.</div></div>' +
      (weights.length ? '<div class="sec"><div class="sec-head"><div class="sec-title">Weight history</div><span class="mini">' + weights.length + ' entries</span></div>' +
        '<div class="card" style="padding:4px 12px">' + weights.slice().reverse().slice(0, 8).map(function (w, i, arr) {
          var next = arr[i + 1];
          var d = next ? w.value - next.value : 0;
          return '<button class="row between" data-delw="' + w.id + '" style="width:100%;padding:9px 2px;border-bottom:1px solid var(--line-2)">' +
            '<div class="row gap-8"><span class="mini" style="width:52px">' + U.fmtDate(w.date, 'short') + '</span><span class="strong num">' + DB.fmtW(w.value, 1) + ' ' + DB.unit + '</span></div>' +
            '<span class="mini num">' + (d ? (d > 0 ? '+' : '') + U.num(d, 1) : '') + '</span></button>';
        }).join('') + '</div></div>' : '') +
      '<div style="height:20px"></div></div></div>';

    return {
      tab: 'body', title: 'Body', html: html,
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
              title: 'Photo',
              options: [
                { label: 'View full size', value: 'view', icon: 'eye' },
                { label: 'Compare with latest', value: 'cmp', icon: 'copy' },
                { label: 'Delete', value: 'del', icon: 'trash', danger: true },
              ],
            }).then(function (v) {
              if (!v) return;
              if (v === 'view') viewPhoto(id);
              if (v === 'cmp') compareSheet(photos);
              if (v === 'del') {
                UI.confirm({ title: 'Delete photo?', message: 'The photo will be removed from this device.', confirmText: 'Delete', danger: true }).then(function (ok) {
                  if (!ok) return;
                  DB.deletePhoto(id); UI.toast('Photo deleted'); F.app.refresh();
                });
              }
            });
            return;
          }
          var delw = e.target.closest('[data-delw]');
          if (delw) {
            UI.confirm({ title: 'Delete entry?', message: 'This weight entry will be removed.', confirmText: 'Delete', danger: true }).then(function (ok) {
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
          title: p ? U.fmtDate(p.date, 'long') : 'Photo',
          sub: p && p.angle ? (ANGLE_LABELS[p.angle] || p.angle) : '',
          body: '<img src="' + u + '" style="width:100%;border-radius:16px" alt="">',
          onClose: function () { URL.revokeObjectURL(u); },
        });
      });
    }

    function measuresHistory() {
      var list = measures.slice().reverse().slice(0, 10);
      UI.sheet({
        title: 'Measurement history',
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
