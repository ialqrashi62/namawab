/* Jumanasoft Super Admin — Tenant Control Center client (CSP-friendly: no inline handlers). */
(function () {
  'use strict';
  var API = '/api/super-admin';
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function state(msg, isError) {
    var el = $('sa-state');
    if (!msg) { el.hidden = true; el.textContent = ''; el.className = 'sa-state'; return; }
    el.hidden = false; el.textContent = msg; el.className = 'sa-state' + (isError ? ' sa-error' : '');
  }
  function fmtDate(d) { if (!d) return '—'; try { return new Date(d).toLocaleDateString('ar'); } catch (e) { return esc(d); } }
  function badge(status) {
    var label = { active: 'نشط', trial: 'تجريبي', suspended: 'معلّق', cancelled: 'ملغى' }[status] || esc(status);
    return '<span class="sa-badge ' + esc(status) + '">' + label + '</span>';
  }

  function rowHtml(t) {
    var act = '';
    if (t.status === 'suspended') act += '<button class="sa-btn" data-action="reactivate" data-id="' + t.id + '">إعادة تفعيل</button>';
    else if (t.status === 'active' || t.status === 'trial') act += '<button class="sa-btn sa-danger" data-action="suspend" data-id="' + t.id + '">تعليق</button>';
    act += '<button class="sa-btn sa-ghost" data-action="details" data-id="' + t.id + '">تفاصيل</button>';
    return '<tr>' +
      '<td>' + esc(t.id) + '</td>' +
      '<td>' + esc(t.name) + '</td>' +
      '<td>' + esc(t.subdomain) + '</td>' +
      '<td>' + badge(t.status) + '</td>' +
      '<td>' + esc(t.plan) + '</td>' +
      '<td>' + fmtDate(t.created_at) + '</td>' +
      '<td><div class="sa-row-actions">' + act + '</div></td>' +
    '</tr>';
  }

  function load() {
    state('جارٍ التحميل…');
    $('sa-detail').hidden = true;
    var qs = new URLSearchParams();
    if ($('sa-status').value) qs.set('status', $('sa-status').value);
    if ($('sa-plan').value.trim()) qs.set('plan', $('sa-plan').value.trim());
    if ($('sa-search').value.trim()) qs.set('q', $('sa-search').value.trim());
    fetch(API + '/tenants?' + qs.toString(), { credentials: 'same-origin' })
      .then(function (r) {
        if (r.status === 403) throw new Error('يتطلّب صلاحية Super Admin.');
        if (!r.ok) throw new Error('تعذّر التحميل (' + r.status + ').');
        return r.json();
      })
      .then(function (data) {
        var tb = $('sa-tbody'); tb.innerHTML = '';
        if (!data.tenants || !data.tenants.length) { state('لا يوجد مستأجرون مطابقون.'); return; }
        state('');
        tb.innerHTML = data.tenants.map(rowHtml).join('');
      })
      .catch(function (e) { state(e.message || 'خطأ.', true); $('sa-tbody').innerHTML = ''; });
  }

  function details(id) {
    state('جارٍ تحميل التفاصيل…');
    fetch(API + '/tenants/' + encodeURIComponent(id), { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('تعذّر تحميل التفاصيل (' + r.status + ').'); return r.json(); })
      .then(function (data) {
        state('');
        var t = data.tenant; var d = $('sa-detail'); d.hidden = false;
        d.innerHTML = '<h3>تفاصيل المستأجر — ' + esc(t.name) + ' ' + badge(t.status) + '</h3>' +
          '<div class="sa-kv">' +
          '<span class="k">المعرّف</span><span>' + esc(t.id) + '</span>' +
          '<span class="k">النطاق الفرعي</span><span>' + esc(t.subdomain) + '</span>' +
          '<span class="k">الخطة</span><span>' + esc(t.plan) + '</span>' +
          '<span class="k">عدد المستخدمين</span><span>' + (t.users == null ? '—' : esc(t.users)) + '</span>' +
          '<span class="k">عدد المنشآت</span><span>' + (t.facilities == null ? '—' : esc(t.facilities)) + '</span>' +
          '<span class="k">آخر نشاط</span><span>' + fmtDate(t.last_activity) + '</span>' +
          '<span class="k">أُنشئ</span><span>' + fmtDate(t.created_at) + '</span>' +
          '</div>';
      })
      .catch(function (e) { state(e.message || 'خطأ.', true); });
  }

  function changeStatus(id, action) {
    var verb = action === 'suspend' ? 'تعليق' : 'إعادة تفعيل';
    if (!window.confirm('تأكيد ' + verb + ' المستأجر #' + id + '؟')) return;
    state('جارٍ ' + verb + '…');
    fetch(API + '/tenants/' + encodeURIComponent(id) + '/' + action, { method: 'POST', credentials: 'same-origin' })
      .then(function (r) {
        if (r.status === 409) return r.json().then(function (j) { throw new Error(j.error || 'انتقال حالة غير مسموح.'); });
        if (!r.ok) throw new Error('فشل الإجراء (' + r.status + ').');
        return r.json();
      })
      .then(function () { load(); })
      .catch(function (e) { state(e.message || 'خطأ.', true); });
  }

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-action]'); if (!b) return;
    var id = b.getAttribute('data-id'); var action = b.getAttribute('data-action');
    if (action === 'details') details(id);
    else if (action === 'suspend' || action === 'reactivate') changeStatus(id, action);
  });
  $('sa-refresh').addEventListener('click', load);
  $('sa-search').addEventListener('keydown', function (e) { if (e.key === 'Enter') load(); });
  $('sa-status').addEventListener('change', load);
  load();
})();
