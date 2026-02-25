// ===== Nama Medical ERP - Main App =====
let currentUser = null;
let isArabic = true;
let currentPage = 0;

const tr = (en, ar) => isArabic ? ar : en;

// Navigation items
const NAV_ITEMS = [
  { icon: '📊', en: 'Dashboard', ar: 'لوحة التحكم' },
  { icon: '🏥', en: 'Reception', ar: 'الاستقبال' },
  { icon: '📅', en: 'Appointments', ar: 'المواعيد' },
  { icon: '👨‍⚕️', en: 'Doctor Station', ar: 'محطة الطبيب' },
  { icon: '🔬', en: 'Laboratory', ar: 'المختبر' },
  { icon: '📡', en: 'Radiology', ar: 'الأشعة' },
  { icon: '💊', en: 'Pharmacy', ar: 'الصيدلية' },
  { icon: '🏢', en: 'HR', ar: 'الموارد البشرية' },
  { icon: '💰', en: 'Finance', ar: 'المالية' },
  { icon: '🛡️', en: 'Insurance', ar: 'التأمين' },
  { icon: '📦', en: 'Inventory', ar: 'المخازن' },
  { icon: '👩‍⚕️', en: 'Nursing', ar: 'التمريض' },
  { icon: '🪑', en: 'Waiting Queue', ar: 'قائمة الانتظار' },
  { icon: '💳', en: 'Patient Accounts', ar: 'حسابات المرضى' },
  { icon: '📋', en: 'Reports', ar: 'التقارير' },
  { icon: '✉️', en: 'Messaging', ar: 'الرسائل' },
  { icon: '📂', en: 'Catalog', ar: 'الأصناف' },
  { icon: '📤', en: 'Dept Requests', ar: 'طلبات الأقسام' },
  { icon: '🏥', en: 'Surgery & Pre-Op', ar: 'العمليات وما قبلها' },
  { icon: '🩸', en: 'Blood Bank', ar: 'بنك الدم' },
  { icon: '📜', en: 'Consent Forms', ar: 'الإقرارات' },
  { icon: '🚨', en: 'Emergency', ar: 'الطوارئ' },
  { icon: '🛏️', en: 'Inpatient ADT', ar: 'التنويم' },
  { icon: '🫀', en: 'ICU', ar: 'العناية المركزة' },
  { icon: '🧹', en: 'CSSD', ar: 'التعقيم المركزي' },
  { icon: '🍽️', en: 'Dietary', ar: 'التغذية' },
  { icon: '🦠', en: 'Infection Control', ar: 'مكافحة العدوى' },
  { icon: '📊', en: 'Quality', ar: 'الجودة' },
  { icon: '🔧', en: 'Maintenance', ar: 'الصيانة' },
  { icon: '🚑', en: 'Transport', ar: 'نقل المرضى' },
  { icon: '📁', en: 'Medical Records', ar: 'السجلات الطبية' },
  { icon: '💊', en: 'Clinical Pharmacy', ar: 'الصيدلية السريرية' },
  { icon: '🏋️', en: 'Rehabilitation', ar: 'إعادة التأهيل' },
  { icon: '📱', en: 'Patient Portal', ar: 'بوابة المرضى' },
  { icon: '🧾', en: 'ZATCA E-Invoice', ar: 'فوترة إلكترونية' },
  { icon: '📹', en: 'Telemedicine', ar: 'الطب عن بعد' },
  { icon: '🔬', en: 'Pathology', ar: 'علم الأمراض' },
  { icon: '🤝', en: 'Social Work', ar: 'الخدمة الاجتماعية' },
  { icon: '🏛️', en: 'Mortuary', ar: 'خدمة الوفيات' },
  { icon: '🎓', en: 'CME', ar: 'التعليم الطبي' },
  { icon: '💎', en: 'Cosmetic Surgery', ar: 'جراحة التجميل' },
  { icon: '🤰', en: 'OB/GYN', ar: 'النساء والتوليد' },
  { icon: '⚙️', en: 'Settings', ar: 'الإعدادات' },
];

// ===== INIT =====
(async function init() {
  try {
    const data = await API.get('/api/auth/me');
    currentUser = data.user;
  } catch {
    window.location.href = '/login.html';
    return;
  }
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('userRole').textContent = currentUser.role;
  document.getElementById('userAvatar').textContent = currentUser.name.charAt(0);

  // Load saved theme
  try {
    const s = await API.get('/api/settings');
    if (s.theme) { document.documentElement.setAttribute('data-theme', s.theme); document.getElementById('themeSelect').value = s.theme; }
  } catch { }

  buildNav();
  setupEvents();
  navigateTo(0);
})();

function buildNav() {
  const nav = document.getElementById('navList');
  const userPerms = currentUser?.permissions ? currentUser.permissions.split(',') : [];
  const isAdmin = currentUser?.role === 'Admin';

  nav.innerHTML = NAV_ITEMS.map((item, i) => {
    const hasPerm = isAdmin || i === 0 || userPerms.includes(i.toString());
    if (!hasPerm) return '';
    return `<div class="nav-item${i === currentPage ? ' active' : ''}" data-page="${i}">
      <span class="nav-icon">${item.icon}</span>
      <span class="nav-label">${tr(item.en, item.ar)}</span>
    </div>`;
  }).join('');

  nav.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', () => navigateTo(parseInt(el.dataset.page)));
  });
}


  // Add notification bell to header
  const headerR = document.querySelector('.header-right') || document.querySelector('.header');
  if (headerR) {
    const bellSpan = document.createElement('span');
    bellSpan.id = 'notifBell';
    bellSpan.style.cssText = 'cursor:pointer;font-size:20px;position:relative;margin-left:12px;margin-right:12px';
    bellSpan.innerHTML = '🔔';
    headerR.prepend(bellSpan);
  }

function setupEvents() {
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await API.post('/api/auth/logout');
    window.location.href = '/login.html';
  });
  document.getElementById('themeSelect').addEventListener('change', (e) => {
    document.documentElement.setAttribute('data-theme', e.target.value);
    API.put('/api/settings', { theme: e.target.value }).catch(() => { });
  });
  document.getElementById('langSelect').addEventListener('change', (e) => {
    isArabic = e.target.value === 'ar';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    buildNav();
    navigateTo(currentPage);
  });
  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('show');
  });
  document.getElementById('sidebarOverlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('show');
  });
  document.getElementById('globalSearch').addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      const txt = e.target.value.trim();
      if (!txt) return;
      const res = await API.get('/api/patients?search=' + encodeURIComponent(txt));
      let html = `<div id="searchResultPopup" class="card" style="position:absolute;top:60px;right:20px;width:700px;z-index:1000;box-shadow:0 10px 30px rgba(0,0,0,0.5)">
               <div style="display:flex;justify-content:space-between;margin-bottom:10px">
                 <strong>🔍 ${tr('Search Results', 'نتائج البحث')} (${res.length})</strong>
                 <button class="btn btn-danger btn-sm" onclick="document.getElementById('searchResultPopup').remove()">❌</button>
               </div>
               <div style="max-height:400px;overflow-y:auto">
                 ${makeTable(
        [tr('File#', 'رقم الملف'), tr('Name', 'الاسم'), tr('National ID', 'الهوية'), tr('Phone', 'الجوال'), tr('Dept', 'القسم')],
        res.map(p => ({ cells: [p.file_number, isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar), p.national_id, p.phone, p.department] }))
      )}
               </div>
            </div>`;
      const old = document.getElementById('searchResultPopup');
      if (old) old.remove();
      const div = document.createElement('div');
      div.innerHTML = html;
      document.body.appendChild(div.firstElementChild);
    }
  });
}

async function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach((el, i) => el.classList.toggle('active', i === page));
  const item = NAV_ITEMS[page];
  document.getElementById('headerTitle').textContent = tr(item.en, item.ar);
  // Close sidebar on mobile after navigation
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('show');
  await loadPage(page);
}

function showToast(msg, type = 'success') {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.className = `toast toast-${type} show`;
  t.innerHTML = `${type === 'success' ? '✅' : '❌'} ${msg}`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

function makeTable(headers, rows, actions) {
  if (!rows.length) return `<div class="empty-state"><div class="empty-icon">📭</div><p>${tr('No data found', 'لا توجد بيانات')}</p></div>`;
  let html = '<table class="data-table"><thead><tr>';
  headers.forEach(h => html += `<th>${h}</th>`);
  html += '</tr></thead><tbody>';
  rows.forEach(row => {
    html += '<tr>';
    row.cells.forEach(c => html += `<td>${c}</td>`);
    if (actions) html += `<td>${actions(row)}</td>`;
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

function badge(text, type) { return `<span class="badge badge-${type}">${text}</span>`; }

function statusBadge(status) {
  const map = { Waiting: 'warning', 'With Doctor': 'success', Confirmed: 'success', Pending: 'warning', Approved: 'success', Rejected: 'danger', Active: 'success', 'On Leave': 'info', Cancelled: 'danger', Completed: 'success', Requested: 'info', Done: 'success', Available: 'success', Reserved: 'warning', Used: 'info', Expired: 'danger', Compatible: 'success', Incompatible: 'danger', Signed: 'success', Dispensed: 'success', Scheduled: 'info', 'In Progress': 'warning' };
  return badge(status, map[status] || 'info');
}

// ===== PRINT UTILITY =====
window.printDocument = function (title, content, options = {}) {
  const rtl = isArabic ? 'dir="rtl"' : '';
  const w = window.open('', '_blank', 'width=800,height=600');
  w.document.write(`<!DOCTYPE html><html ${rtl}><head><meta charset="utf-8"><title>${title}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box}
      body{font-family:'Segoe UI',Tahoma,sans-serif;padding:20px;color:#333;font-size:13px;direction:${isArabic ? 'rtl' : 'ltr'}}
      .header{text-align:center;border-bottom:3px double #1a5276;padding-bottom:12px;margin-bottom:16px}
      .header h1{font-size:22px;color:#1a5276;margin-bottom:4px}
      .header p{font-size:11px;color:#666}
      .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;font-size:12px}
      .info-grid div{padding:4px 8px;background:#f8f9fa;border-radius:4px}
      .info-grid strong{color:#1a5276}
      table{width:100%;border-collapse:collapse;margin:12px 0}
      th{background:#1a5276;color:#fff;padding:8px 10px;text-align:${isArabic ? 'right' : 'left'};font-size:12px}
      td{padding:6px 10px;border-bottom:1px solid #ddd;font-size:12px}
      tr:nth-child(even){background:#f8f9fa}
      .total-row{font-weight:700;font-size:14px;background:#e8f4fd!important}
      .footer{text-align:center;margin-top:24px;padding-top:12px;border-top:1px solid #ddd;font-size:10px;color:#999}
      .signature{display:flex;justify-content:space-between;margin-top:40px}
      .signature div{text-align:center;min-width:150px;border-top:1px solid #333;padding-top:4px;font-size:11px}
      @media print{body{padding:10px} .no-print{display:none!important}}
    </style></head><body>
    <div class="header"><h1>${options.companyName || 'نما الطبي — Nama Medical'}</h1><p>${options.companyInfo || 'مستشفى نما الطبي | Nama Medical Hospital'}</p></div>
    <h2 style="text-align:center;color:#1a5276;margin-bottom:16px">${title}</h2>
    ${content}
    <div class="footer">${tr('Printed on', 'طُبع بتاريخ')}: ${new Date().toLocaleString('ar-SA')} | ${tr('Nama Medical ERP', 'نما الطبي')}</div>
    <button class="no-print" onclick="window.print()" style="position:fixed;top:10px;right:10px;padding:10px 24px;background:#1a5276;color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:14px">🖨️ ${tr('Print', 'طباعة')}</button>
  </body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 500);
};

window.printInvoice = async function (id) {
  try {
    const data = await API.get('/api/print/invoice/' + id);
    const inv = data.invoice;
    const content = `<div class="info-grid">
      <div><strong>${tr('Invoice #', 'فاتورة رقم')}:</strong> ${inv.invoice_number || inv.id}</div>
      <div><strong>${tr('Date', 'التاريخ')}:</strong> ${inv.created_at?.split('T')[0]}</div>
      <div><strong>${tr('Patient', 'المريض')}:</strong> ${inv.patient_name}</div>
      <div><strong>${tr('Payment', 'الدفع')}:</strong> ${inv.payment_method || '-'}</div>
    </div>
    <table><thead><tr><th>${tr('Description', 'الوصف')}</th><th>${tr('Amount', 'المبلغ')}</th><th>${tr('VAT', 'ضريبة')}</th><th>${tr('Total', 'الإجمالي')}</th></tr></thead>
    <tbody><tr><td>${inv.description || inv.service_type}</td><td>${inv.amount} SAR</td><td>${inv.vat_amount || 0} SAR</td><td>${inv.total} SAR</td></tr>
    <tr class="total-row"><td colspan="3">${tr('Grand Total', 'المجموع الكلي')}</td><td>${inv.total} SAR</td></tr></tbody></table>
    <div class="signature"><div>${tr('Cashier', 'أمين الصندوق')}</div><div>${tr('Patient Signature', 'توقيع المريض')}</div></div>`;
    printDocument(tr('Tax Invoice', 'فاتورة ضريبية'), content);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

window.printLabReport = async function (id) {
  try {
    const data = await API.get('/api/print/lab-report/' + id);
    const content = `<div class="info-grid">
      <div><strong>${tr('Patient', 'المريض')}:</strong> ${data.patient?.name_ar || data.patient?.name_en || '-'}</div>
      <div><strong>${tr('File #', 'رقم الملف')}:</strong> ${data.patient?.file_number || '-'}</div>
      <div><strong>${tr('Test', 'الفحص')}:</strong> ${data.order?.description}</div>
      <div><strong>${tr('Date', 'التاريخ')}:</strong> ${data.order?.created_at?.split('T')[0]}</div>
    </div>
    <table><thead><tr><th>${tr('Test', 'الفحص')}</th><th>${tr('Result', 'النتيجة')}</th><th>${tr('Normal Range', 'المعدل الطبيعي')}</th><th>${tr('Status', 'الحالة')}</th></tr></thead>
    <tbody>${(data.results || []).map(r => `<tr style="${r.is_abnormal ? 'color:#e74c3c;font-weight:700' : ''}"><td>${r.test_name || '-'}</td><td>${r.result_value || '-'}</td><td>${r.normal_range || '-'}</td><td>${r.is_abnormal ? '⚠️ ' + tr('Abnormal', 'غير طبيعي') : '✅ ' + tr('Normal', 'طبيعي')}</td></tr>`).join('')}</tbody></table>
    <div class="signature"><div>${tr('Lab Technician', 'فني المختبر')}</div><div>${tr('Doctor', 'الطبيب')}</div></div>`;
    printDocument(tr('Lab Report', 'تقرير مختبر'), content);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== EXPORT UTILITY =====
window.exportCSV = function (filename, headers, rows) {
  const BOM = '\uFEFF';
  const csv = BOM + headers.join(',') + '\n' + rows.map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename + '.csv'; a.click();
  showToast(tr('Exported!', 'تم التصدير'));
};
window.exportTableCSV = function (filename) {
  const table = document.querySelector('#pageContent table');
  if (!table) return showToast(tr('No table found', 'لا يوجد جدول'), 'error');
  const headers = [...table.querySelectorAll('th')].map(h => h.textContent);
  const rows = [...table.querySelectorAll('tbody tr')].map(r => [...r.querySelectorAll('td')].map(c => c.textContent.trim()));
  exportCSV(filename, headers, rows);
};


// ===== CONSENT FORMS =====
async function renderConsentForms(el) {
  const patients = await API.get('/api/patients');
  const templates = await API.get('/api/consent/templates');
  const recent = await API.get('/api/consent/recent');

  // Group templates by category
  const cats = {};
  templates.forEach(t => { if (!cats[t.category]) cats[t.category] = []; cats[t.category].push(t); });

  let catOptions = Object.keys(cats).map(c => '<option value="' + c + '">' + c + '</option>').join('');
  let tmplOptions = templates.map(t => '<option value="' + t.id + '">' + t.title_ar + '</option>').join('');
  let patientOptions = patients.map(p => '<option value="' + p.id + '">' + (p.name_ar || p.name_en) + ' (' + p.file_number + ')</option>').join('');

  let recentRows = recent.map(r => '<tr><td>' + (r.patient_name || '-') + '</td><td>' + (r.template_title || r.title || '-') + '</td><td>' + (r.category || '-') + '</td><td>' + new Date(r.signed_at || r.created_at).toLocaleString('ar-SA') + '</td><td>' + (r.doctor_name || r.created_by || '-') + '</td><td><button class="btn btn-sm" onclick="viewSignedConsent(' + r.id + ')">' + tr('View', 'عرض') + '</button> <button class="btn btn-sm btn-danger" onclick="printSignedConsent(' + r.id + ')">' + tr('Print', 'طباعة') + '</button></td></tr>').join('');

  el.innerHTML = '<div class="page-title">📜 ' + tr('Consent Forms', 'الإقرارات') + '</div>' +
    '<div class="card" style="margin-bottom:16px"><h3 style="margin-bottom:12px">📝 ' + tr('New Consent', 'إقرار جديد') + '</h3>' +
    '<div class="form-grid" style="gap:12px">' +
    '<div class="form-group"><label>' + tr('Patient', 'المريض') + '</label><select id="consentPatient" class="form-control"><option value="">' + tr('-- Select --', '-- اختر --') + '</option>' + patientOptions + '</select></div>' +
    '<div class="form-group"><label>' + tr('Consent Form', 'نوع الإقرار') + '</label><select id="consentTemplate" class="form-control" onchange="loadConsentText()"><option value="">' + tr('-- Select --', '-- اختر --') + '</option>' + tmplOptions + '</select></div>' +
    '<div class="form-group"><label>' + tr('Doctor Name', 'اسم الطبيب') + '</label><input id="consentDoctor" class="form-control" value="' + (currentUser?.display_name || '') + '"></div>' +
    '<div class="form-group"><label>' + tr('Procedure Details', 'تفاصيل الإجراء') + ' (' + tr('optional', 'اختياري') + ')</label><input id="consentProcedure" class="form-control" placeholder="' + tr('e.g. Appendectomy', 'مثال: استئصال الزائدة') + '"></div>' +
    '</div></div>' +

    '<div id="consentTextArea" style="display:none">' +
    '<div class="card" style="margin-bottom:16px;border-right:4px solid var(--primary)">' +
    '<h3 id="consentTitle" style="margin-bottom:12px;color:var(--primary)"></h3>' +
    '<div id="consentBody" style="white-space:pre-wrap;line-height:2;font-size:15px;padding:16px;background:var(--hover);border-radius:8px;max-height:500px;overflow-y:auto"></div>' +
    '</div>' +

    '<div class="card" style="margin-bottom:16px">' +
    '<h3 style="margin-bottom:12px">✍️ ' + tr('Patient Signature', 'توقيع المريض') + '</h3>' +
    '<p style="margin-bottom:8px;color:var(--text-muted)">' + tr('Please sign below to confirm you have read and agree', 'الرجاء التوقيع أدناه لتأكيد قراءتك وموافقتك') + '</p>' +
    '<canvas id="signaturePad" width="600" height="200" style="border:2px solid var(--border);border-radius:8px;background:#fff;cursor:crosshair;display:block;max-width:100%"></canvas>' +
    '<div style="margin-top:8px;display:flex;gap:8px">' +
    '<button class="btn btn-secondary" onclick="clearSignature()">' + tr('Clear', 'مسح') + '</button>' +
    '</div>' +
    '<div id="witnessSection" style="display:none;margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">' +
    '<h4 style="margin-bottom:8px">👤 ' + tr('Witness', 'الشاهد') + '</h4>' +
    '<div class="form-grid"><div class="form-group"><label>' + tr('Witness Name', 'اسم الشاهد') + '</label><input id="witnessName" class="form-control"></div></div>' +
    '</div>' +
    '<div style="margin-top:16px;text-align:center">' +
    '<button class="btn btn-primary btn-lg" onclick="submitConsent()" style="padding:12px 40px;font-size:16px">✅ ' + tr('Sign & Submit', 'توقيع وإرسال') + '</button>' +
    '</div></div></div>' +

    '<div class="card"><h3 style="margin-bottom:12px">📋 ' + tr('Recent Consents', 'الإقرارات الأخيرة') + '</h3>' +
    '<table class="data-table"><thead><tr><th>' + tr('Patient', 'المريض') + '</th><th>' + tr('Form', 'الإقرار') + '</th><th>' + tr('Category', 'القسم') + '</th><th>' + tr('Date', 'التاريخ') + '</th><th>' + tr('Doctor', 'الطبيب') + '</th><th>' + tr('Actions', 'إجراءات') + '</th></tr></thead><tbody>' + (recentRows || '<tr><td colspan="6" style="text-align:center;color:var(--text-muted)">' + tr('No consent forms yet', 'لا توجد إقرارات بعد') + '</td></tr>') + '</tbody></table></div>';

  // Initialize signature pad
  setTimeout(() => initSignaturePad(), 100);
}

let _signCtx = null, _signDrawing = false;
function initSignaturePad() {
  const canvas = document.getElementById('signaturePad');
  if (!canvas) return;
  _signCtx = canvas.getContext('2d');
  _signCtx.strokeStyle = '#000';
  _signCtx.lineWidth = 2;
  _signCtx.lineCap = 'round';

  canvas.addEventListener('mousedown', e => { _signDrawing = true; _signCtx.beginPath(); _signCtx.moveTo(e.offsetX, e.offsetY); });
  canvas.addEventListener('mousemove', e => { if (_signDrawing) { _signCtx.lineTo(e.offsetX, e.offsetY); _signCtx.stroke(); } });
  canvas.addEventListener('mouseup', () => _signDrawing = false);
  canvas.addEventListener('mouseleave', () => _signDrawing = false);
  // Touch support
  canvas.addEventListener('touchstart', e => { e.preventDefault(); _signDrawing = true; const r = canvas.getBoundingClientRect(); _signCtx.beginPath(); _signCtx.moveTo(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top); });
  canvas.addEventListener('touchmove', e => { e.preventDefault(); if (_signDrawing) { const r = canvas.getBoundingClientRect(); _signCtx.lineTo(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top); _signCtx.stroke(); } });
  canvas.addEventListener('touchend', () => _signDrawing = false);
}

function clearSignature() {
  const canvas = document.getElementById('signaturePad');
  if (canvas && _signCtx) _signCtx.clearRect(0, 0, canvas.width, canvas.height);
}

async function loadConsentText() {
  const id = document.getElementById('consentTemplate')?.value;
  const area = document.getElementById('consentTextArea');
  if (!id) { area.style.display = 'none'; return; }
  try {
    const t = await API.get('/api/consent/templates/' + id);
    document.getElementById('consentTitle').textContent = t.title_ar;
    document.getElementById('consentBody').textContent = isArabic ? t.body_text_ar : t.body_text;
    area.style.display = 'block';
    // Show witness section if required
    document.getElementById('witnessSection').style.display = t.requires_witness ? 'block' : 'none';
    clearSignature();
    setTimeout(() => initSignaturePad(), 50);
  } catch (e) { showToast(tr('Error loading form', 'خطأ في تحميل الإقرار'), 'error'); }
}

window.loadConsentText = loadConsentText;
window.clearSignature = clearSignature;

async function submitConsent() {
  const patientId = document.getElementById('consentPatient')?.value;
  const templateId = document.getElementById('consentTemplate')?.value;
  const canvas = document.getElementById('signaturePad');
  if (!patientId) return showToast(tr('Select patient', 'اختر المريض'), 'error');
  if (!templateId) return showToast(tr('Select consent form', 'اختر الإقرار'), 'error');
  // Check if canvas has content
  const sigData = canvas.toDataURL('image/png');
  const emptyCanvas = document.createElement('canvas');
  emptyCanvas.width = canvas.width; emptyCanvas.height = canvas.height;
  if (sigData === emptyCanvas.toDataURL('image/png')) return showToast(tr('Please sign the form', 'الرجاء التوقيع على الإقرار'), 'error');

  const patientSelect = document.getElementById('consentPatient');
  const patientName = patientSelect.options[patientSelect.selectedIndex]?.text || '';

  try {
    await API.post('/api/consent/sign', {
      template_id: templateId,
      patient_id: patientId,
      patient_name: patientName.split(' (')[0],
      signature_data: sigData,
      witness_name: document.getElementById('witnessName')?.value || '',
      doctor_name: document.getElementById('consentDoctor')?.value || '',
      procedure_details: document.getElementById('consentProcedure')?.value || ''
    });
    showToast(tr('Consent signed!', 'تم التوقيع على الإقرار!'));
    renderConsentForms(document.getElementById('pageContent'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
}
window.submitConsent = submitConsent;

window.viewSignedConsent = async function(id) {
  try {
    const consents = await API.get('/api/consent/recent');
    const c = consents.find(x => x.id === id);
    if (!c) return;
    const tmpl = await API.get('/api/consent/templates/' + c.template_id);
    let html = '<div style="direction:rtl;text-align:right">' +
      '<h3 style="margin-bottom:12px;color:var(--primary)">' + (tmpl.title_ar || c.title) + '</h3>' +
      '<div style="white-space:pre-wrap;line-height:2;font-size:14px;padding:12px;background:var(--hover);border-radius:8px;max-height:300px;overflow-y:auto;margin-bottom:16px">' + tmpl.body_text_ar + '</div>' +
      '<div style="display:flex;gap:20px;flex-wrap:wrap;margin-bottom:12px">' +
      '<div><strong>' + tr('Patient', 'المريض') + ':</strong> ' + c.patient_name + '</div>' +
      '<div><strong>' + tr('Doctor', 'الطبيب') + ':</strong> ' + (c.doctor_name || c.created_by) + '</div>' +
      '<div><strong>' + tr('Date', 'التاريخ') + ':</strong> ' + new Date(c.signed_at || c.created_at).toLocaleString('ar-SA') + '</div>' +
      (c.witness_name ? '<div><strong>' + tr('Witness', 'الشاهد') + ':</strong> ' + c.witness_name + '</div>' : '') +
      '</div>';
    if (c.signature_data) html += '<div style="margin-top:12px"><strong>' + tr('Signature', 'التوقيع') + ':</strong><br><img src="' + c.signature_data + '" style="max-width:300px;border:1px solid var(--border);border-radius:4px;margin-top:4px"></div>';
    html += '</div>';
    showModal(tr('Signed Consent', 'الإقرار الموقع'), html);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

window.printSignedConsent = async function(id) {
  try {
    const consents = await API.get('/api/consent/recent');
    const c = consents.find(x => x.id === id);
    if (!c) return;
    const tmpl = await API.get('/api/consent/templates/' + c.template_id);
    let html = '<div style="direction:rtl;text-align:right;font-family:Arial,sans-serif">' +
      '<div style="text-align:center;margin-bottom:20px"><h2>مركز نما الطبي</h2><h3 style="color:#1a56db">' + tmpl.title_ar + '</h3></div>' +
      '<div style="white-space:pre-wrap;line-height:2.2;font-size:14px;margin-bottom:20px">' + tmpl.body_text_ar + '</div>' +
      (c.procedure_details ? '<div style="margin-bottom:16px;padding:8px;border:1px solid #ccc;border-radius:4px"><strong>تفاصيل الإجراء:</strong> ' + c.procedure_details + '</div>' : '') +
      '<div style="margin-top:30px;display:flex;justify-content:space-between">' +
      '<div><strong>اسم المريض:</strong> ' + c.patient_name + '</div>' +
      '<div><strong>التاريخ:</strong> ' + new Date(c.signed_at || c.created_at).toLocaleDateString('ar-SA') + '</div>' +
      '</div>' +
      '<div style="margin-top:10px"><strong>الطبيب:</strong> ' + (c.doctor_name || '-') + '</div>' +
      (c.witness_name ? '<div style="margin-top:10px"><strong>الشاهد:</strong> ' + c.witness_name + '</div>' : '') +
      '<div style="margin-top:20px"><strong>التوقيع:</strong><br>' +
      (c.signature_data ? '<img src="' + c.signature_data + '" style="max-width:250px;margin-top:4px">' : '_______________') + '</div>' +
      '</div>';
    printDocument(tmpl.title_ar, html, { showHeader: false });
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};



// ===== OB/GYN DEPARTMENT PAGE =====
async function renderOBGYN(el) {
  let stats = { activePregnancies: 0, highRisk: 0, dueThisWeek: 0, deliveredThisMonth: 0 };
  try { stats = await API.get('/api/obgyn/stats'); } catch(e) {}
  const patients = await API.get('/api/patients');
  let patOpts = patients.map(p => '<option value="' + p.id + '" data-name="' + (p.name_ar || p.name_en) + '">' + (p.name_ar || p.name_en) + ' (' + p.file_number + ')</option>').join('');

  el.innerHTML = '<div class="page-title">🤰 ' + tr('OB/GYN Department', 'قسم النساء والتوليد') + '</div>' +
    '<div class="stats-grid">' +
    '<div class="stat-card" style="--stat-color:#ec4899"><div class="stat-label">' + tr('Active Pregnancies', 'حمل نشط') + '</div><div class="stat-value">' + stats.activePregnancies + '</div></div>' +
    '<div class="stat-card" style="--stat-color:#ef4444"><div class="stat-label">' + tr('High Risk', 'عالي الخطورة') + '</div><div class="stat-value">' + stats.highRisk + '</div></div>' +
    '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-label">' + tr('Due This Week', 'ولادة هذا الأسبوع') + '</div><div class="stat-value">' + stats.dueThisWeek + '</div></div>' +
    '<div class="stat-card" style="--stat-color:#22c55e"><div class="stat-label">' + tr('Delivered This Month', 'ولادات هذا الشهر') + '</div><div class="stat-value">' + stats.deliveredThisMonth + '</div></div>' +
    '</div>' +

    '<div class="card" style="margin-top:16px"><h3 style="margin-bottom:12px">📋 ' + tr('New Pregnancy Record', 'سجل حمل جديد') + '</h3>' +
    '<div class="form-grid" style="gap:10px">' +
    '<div class="form-group"><label>' + tr('Patient', 'المريضة') + '</label><select id="obPatient" class="form-control"><option value="">' + tr('-- Select --', '-- اختري --') + '</option>' + patOpts + '</select></div>' +
    '<div class="form-group"><label>' + tr('LMP (Last Menstrual Period)', 'آخر دورة شهرية') + '</label><input type="date" id="obLMP" class="form-control"></div>' +
    '<div class="form-group"><label>G (Gravida)</label><input type="number" id="obGravida" class="form-control" value="1" min="1"></div>' +
    '<div class="form-group"><label>P (Para)</label><input type="number" id="obPara" class="form-control" value="0" min="0"></div>' +
    '<div class="form-group"><label>A (Abortions)</label><input type="number" id="obAbort" class="form-control" value="0" min="0"></div>' +
    '<div class="form-group"><label>' + tr('Blood Group', 'فصيلة الدم') + '</label><select id="obBlood" class="form-control"><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select></div>' +
    '<div class="form-group"><label>Rh</label><select id="obRh" class="form-control"><option>Positive</option><option>Negative</option></select></div>' +
    '<div class="form-group"><label>' + tr('Risk Level', 'مستوى الخطورة') + '</label><select id="obRisk" class="form-control"><option value="Low">' + tr('Low', 'منخفض') + '</option><option value="Medium">' + tr('Medium', 'متوسط') + '</option><option value="High">' + tr('High', 'عالي') + '</option></select></div>' +
    '<div class="form-group"><label>' + tr('Previous C-Sections', 'قيصريات سابقة') + '</label><input type="number" id="obPrevCS" class="form-control" value="0" min="0"></div>' +
    '<div class="form-group"><label>' + tr('Chronic Conditions', 'أمراض مزمنة') + '</label><input id="obChronic" class="form-control" placeholder="' + tr('DM, HTN, etc', 'سكري، ضغط...') + '"></div>' +
    '<div class="form-group"><label>' + tr('Allergies', 'حساسية') + '</label><input id="obAllergy" class="form-control"></div>' +
    '<div class="form-group"><label>' + tr('Attending Doctor', 'الطبيب المعالج') + '</label><input id="obDoctor" class="form-control" value="' + (currentUser?.display_name || '') + '"></div>' +
    '</div>' +
    '<button class="btn btn-primary" onclick="createPregnancy()" style="margin-top:12px">✅ ' + tr('Create Record', 'إنشاء السجل') + '</button></div>' +

    '<div class="card" style="margin-top:16px"><h3 style="margin-bottom:12px">📊 ' + tr('Active Pregnancies', 'الحالات النشطة') + '</h3><div id="obActiveList">' + tr('Loading...', 'جاري التحميل...') + '</div></div>' +

    '<div class="card" style="margin-top:16px"><h3 style="margin-bottom:12px">🧪 ' + tr('Lab Panels', 'حزم الفحوصات') + '</h3><div id="obLabPanels">' + tr('Loading...', 'جاري التحميل...') + '</div></div>';

  // Load active pregnancies
  try {
    const preg = await API.get('/api/obgyn/pregnancies?status=Active');
    const list = document.getElementById('obActiveList');
    if (preg.length === 0) { list.innerHTML = '<p style="color:var(--text-muted)">' + tr('No active pregnancies', 'لا توجد حالات نشطة') + '</p>'; }
    else {
      let html = '<table class="data-table"><thead><tr><th>' + tr('Patient', 'المريضة') + '</th><th>GPAL</th><th>' + tr('EDD', 'تاريخ الولادة المتوقع') + '</th><th>' + tr('Risk', 'الخطورة') + '</th><th>' + tr('Doctor', 'الطبيب') + '</th><th>' + tr('Actions', 'إجراءات') + '</th></tr></thead><tbody>';
      preg.forEach(p => {
        const riskColor = p.risk_level === 'High' ? '#ef4444' : p.risk_level === 'Medium' ? '#f59e0b' : '#22c55e';
        html += '<tr><td>' + p.patient_name + '</td><td>G' + p.gravida + 'P' + p.para + 'A' + p.abortions + 'L' + p.living_children + '</td><td>' + (p.edd || '-') + '</td><td><span style="color:' + riskColor + ';font-weight:700">' + p.risk_level + '</span></td><td>' + (p.attending_doctor || '-') + '</td><td><button class="btn btn-sm" onclick="showAntenatalForm(' + p.id + ',' + p.patient_id + ')">📋 ' + tr('Antenatal', 'متابعة') + '</button></td></tr>';
      });
      html += '</tbody></table>';
      list.innerHTML = html;
    }
  } catch(e) { document.getElementById('obActiveList').innerHTML = '<p style="color:red">Error loading</p>'; }

  // Load lab panels
  try {
    const panels = await API.get('/api/obgyn/lab-panels');
    let ph = '<div style="display:grid;gap:8px">';
    panels.forEach(p => {
      ph += '<div style="padding:12px;border-radius:8px;background:var(--hover);border-right:3px solid #ec4899"><strong>' + p.panel_name_ar + '</strong> (' + p.trimester + ')<br><small style="color:var(--text-muted)">' + p.tests + '</small></div>';
    });
    ph += '</div>';
    document.getElementById('obLabPanels').innerHTML = ph;
  } catch(e) {}
}

window.createPregnancy = async () => {
  const patSel = document.getElementById('obPatient');
  const pid = patSel.value;
  if (!pid) return showToast(tr('Select patient', 'اختري مريضة'), 'error');
  const lmp = document.getElementById('obLMP').value;
  if (!lmp) return showToast(tr('Enter LMP date', 'أدخلي تاريخ آخر دورة'), 'error');
  try {
    await API.post('/api/obgyn/pregnancies', {
      patient_id: pid,
      patient_name: patSel.options[patSel.selectedIndex]?.dataset?.name || '',
      lmp, gravida: parseInt(document.getElementById('obGravida').value) || 1,
      para: parseInt(document.getElementById('obPara').value) || 0,
      abortions: parseInt(document.getElementById('obAbort').value) || 0,
      blood_group: document.getElementById('obBlood').value,
      rh_factor: document.getElementById('obRh').value,
      risk_level: document.getElementById('obRisk').value,
      previous_cs: parseInt(document.getElementById('obPrevCS').value) || 0,
      chronic_conditions: document.getElementById('obChronic').value,
      allergies: document.getElementById('obAllergy').value,
      attending_doctor: document.getElementById('obDoctor').value
    });
    showToast(tr('Pregnancy record created!', 'تم إنشاء سجل الحمل!'));
    navigateTo(currentPage);
  } catch(e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

window.showAntenatalForm = async (pregId, patientId) => {
  const visits = await API.get('/api/obgyn/antenatal/' + pregId);
  let vRows = visits.map(v => '<tr><td>' + v.visit_number + '</td><td>' + (v.gestational_age || '-') + '</td><td>' + v.blood_pressure + '</td><td>' + v.fetal_heart_rate + '</td><td>' + v.weight + 'kg</td><td>' + (v.risk_flags || '✅') + '</td></tr>').join('');

  let html = '<h4 style="margin-bottom:8px">' + tr('Previous Visits', 'الزيارات السابقة') + '</h4>' +
    (visits.length ? '<table class="data-table" style="margin-bottom:16px"><thead><tr><th>#</th><th>GA</th><th>BP</th><th>FHR</th><th>Wt</th><th>Flags</th></tr></thead><tbody>' + vRows + '</tbody></table>' : '<p style="color:var(--text-muted);margin-bottom:16px">' + tr('No visits yet', 'لا زيارات') + '</p>') +
    '<h4 style="margin-bottom:8px">' + tr('New Visit', 'زيارة جديدة') + '</h4>' +
    '<div class="form-grid" style="gap:8px">' +
    '<div class="form-group"><label>GA (weeks)</label><input id="antGA" class="form-control" placeholder="e.g. 28+3"></div>' +
    '<div class="form-group"><label>Weight (kg)</label><input type="number" id="antWt" class="form-control" step="0.1"></div>' +
    '<div class="form-group"><label>BP</label><input id="antBP" class="form-control" placeholder="120/80"></div>' +
    '<div class="form-group"><label>Systolic</label><input type="number" id="antSys" class="form-control"></div>' +
    '<div class="form-group"><label>Diastolic</label><input type="number" id="antDia" class="form-control"></div>' +
    '<div class="form-group"><label>FHR</label><input type="number" id="antFHR" class="form-control" placeholder="110-160"></div>' +
    '<div class="form-group"><label>Fundal Height</label><input type="number" id="antFH" class="form-control" step="0.5"></div>' +
    '<div class="form-group"><label>Hb</label><input type="number" id="antHb" class="form-control" step="0.1"></div>' +
    '<div class="form-group"><label>Presentation</label><select id="antPres" class="form-control"><option>Cephalic</option><option>Breech</option><option>Transverse</option></select></div>' +
    '<div class="form-group"><label>Edema</label><select id="antEdema" class="form-control"><option>None</option><option>Mild +</option><option>Moderate ++</option><option>Severe +++</option></select></div>' +
    '</div>' +
    '<div class="form-group" style="margin-top:8px"><label>Complaints</label><textarea id="antComp" class="form-control" rows="2"></textarea></div>' +
    '<div class="form-group"><label>Plan</label><textarea id="antPlan" class="form-control" rows="2"></textarea></div>' +
    '<button class="btn btn-primary" onclick="saveAntenatal(' + pregId + ',' + patientId + ')" style="margin-top:8px">💾 ' + tr('Save Visit', 'حفظ الزيارة') + '</button>';
  showModal(tr('Antenatal Visit', 'زيارة متابعة الحمل') + ' #' + pregId, html);
};

window.saveAntenatal = async (pregId, patientId) => {
  const bp = document.getElementById('antBP').value;
  try {
    await API.post('/api/obgyn/antenatal', {
      pregnancy_id: pregId, patient_id: patientId,
      gestational_age: document.getElementById('antGA').value,
      weight: parseFloat(document.getElementById('antWt').value) || 0,
      blood_pressure: bp,
      systolic: parseInt(document.getElementById('antSys').value) || (bp ? parseInt(bp.split('/')[0]) : 0),
      diastolic: parseInt(document.getElementById('antDia').value) || (bp ? parseInt(bp.split('/')[1]) : 0),
      fetal_heart_rate: parseInt(document.getElementById('antFHR').value) || 0,
      fundal_height: parseFloat(document.getElementById('antFH').value) || 0,
      hemoglobin: parseFloat(document.getElementById('antHb').value) || 0,
      fetal_presentation: document.getElementById('antPres').value,
      edema: document.getElementById('antEdema').value,
      complaints: document.getElementById('antComp').value,
      plan: document.getElementById('antPlan').value
    });
    showToast(tr('Visit saved!', 'تم حفظ الزيارة!'));
    document.querySelector('.modal-overlay')?.remove();
    navigateTo(currentPage);
  } catch(e) { showToast(tr('Error', 'خطأ'), 'error'); }
};


// ===== PAGE LOADER =====
async function loadPage(page) {
  const el = document.getElementById('pageContent');
  el.style.animation = 'none'; el.offsetHeight; el.style.animation = '';
  const pages = [renderDashboard, renderReception, renderAppointments, renderDoctor, renderLab, renderRadiology, renderPharmacy, renderHR, renderFinance, renderInsurance, renderInventory, renderNursing, renderWaitingQueue, renderPatientAccounts, renderReports, renderMessaging, renderCatalog, renderDeptRequests, renderSurgery, renderBloodBank, renderConsentForms, renderEmergency, renderInpatient, renderICU, renderCSSD, renderDietary, renderInfectionControl, renderQuality, renderMaintenance, renderTransport, renderMedicalRecords, renderClinicalPharmacy, renderRehabilitation, renderPatientPortal, renderZATCA, renderTelemedicine, renderPathology, renderSocialWork, renderMortuary, renderCME, renderCosmeticSurgery, renderOBGYN, renderSettings];
  if (pages[page]) await pages[page](el);
  else el.innerHTML = `<div class="page-title">${NAV_ITEMS[page]?.icon} ${tr(NAV_ITEMS[page]?.en, NAV_ITEMS[page]?.ar)}</div><div class="card"><p>${tr('Coming soon...', 'قريباً...')}</p></div>`;
}

// ===== DASHBOARD =====


// ===== MEDICAL REPORT / SICK LEAVE =====
window.showMedicalReportForm = (type) => {
  const patientId = document.getElementById('drPatientSelect')?.value;
  if (!patientId) return showToast(tr('Select patient first', 'اختر مريض أولاً'), 'error');
  const patientName = document.getElementById('drPatientSelect')?.selectedOptions[0]?.text || '';
  
  const typeLabels = {
    sick_leave: { en: 'Sick Leave', ar: 'إجازة مرضية' },
    medical_report: { en: 'Medical Report', ar: 'تقرير طبي' },
    fitness: { en: 'Fitness Certificate', ar: 'شهادة لياقة' },
  };
  const label = typeLabels[type] || typeLabels.medical_report;
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center';
  modal.innerHTML = '<div style="background:var(--bg-card,#fff);border-radius:16px;padding:24px;width:550px;max-height:90vh;overflow-y:auto;direction:rtl">' +
    '<h3 style="margin:0 0 16px;color:var(--primary)">' + (isArabic ? label.ar : label.en) + '</h3>' +
    '<div class="form-group"><label>' + tr('Patient', 'المريض') + '</label><input class="form-input" value="' + patientName + '" readonly></div>' +
    '<div class="form-group"><label>' + tr('Diagnosis', 'التشخيص') + '</label><input class="form-input" id="mrDiagnosis" placeholder="' + tr('Diagnosis', 'التشخيص') + '"></div>' +
    '<div class="form-group"><label>' + tr('ICD Code', 'رمز ICD') + '</label><input class="form-input" id="mrICD" placeholder="e.g. J06.9"></div>' +
    (type === 'sick_leave' ? 
      '<div style="display:flex;gap:12px">' +
      '<div class="form-group" style="flex:1"><label>' + tr('From', 'من') + '</label><input type="date" class="form-input" id="mrFrom"></div>' +
      '<div class="form-group" style="flex:1"><label>' + tr('To', 'إلى') + '</label><input type="date" class="form-input" id="mrTo"></div>' +
      '<div class="form-group" style="flex:1"><label>' + tr('Days', 'أيام') + '</label><input type="number" class="form-input" id="mrDays" min="1"></div>' +
      '</div>' : '') +
    (type === 'fitness' ?
      '<div class="form-group"><label>' + tr('Fitness Status', 'حالة اللياقة') + '</label>' +
      '<select class="form-input" id="mrFitness"><option value="fit">' + tr('Fit', 'لائق') + '</option><option value="unfit">' + tr('Unfit', 'غير لائق') + '</option><option value="conditional">' + tr('Conditional', 'مشروط') + '</option></select></div>' : '') +
    '<div class="form-group"><label>' + tr('Notes', 'ملاحظات') + '</label><textarea class="form-input" id="mrNotes" rows="3"></textarea></div>' +
    '<div style="display:flex;gap:12px;margin-top:16px">' +
    '<button class="btn btn-primary" onclick="saveMedicalReport(\'' + type + '\', ' + patientId + ', \'' + patientName.replace(/'/g, '') + '\')" style="flex:1">💾 ' + tr('Save & Print', 'حفظ وطباعة') + '</button>' +
    '<button class="btn btn-secondary" onclick="this.closest(\'.modal-overlay\').remove()" style="flex:1">' + tr('Cancel', 'إلغاء') + '</button>' +
    '</div></div>';
  document.body.appendChild(modal);
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
};

window.saveMedicalReport = async (type, patientId, patientName) => {
  try {
    const data = {
      patient_id: patientId,
      patient_name: patientName,
      report_type: type,
      diagnosis: document.getElementById('mrDiagnosis')?.value || '',
      icd_code: document.getElementById('mrICD')?.value || '',
      start_date: document.getElementById('mrFrom')?.value || null,
      end_date: document.getElementById('mrTo')?.value || null,
      duration_days: document.getElementById('mrDays')?.value || null,
      notes: document.getElementById('mrNotes')?.value || '',
      fitness_status: document.getElementById('mrFitness')?.value || null,
    };
    
    const result = await API.post('/api/medical-reports', data);
    document.querySelector('.modal-overlay')?.remove();
    showToast(tr('Report saved!', 'تم حفظ التقرير!'));
    
    // Print the report
    printMedicalReport(result, type);
  } catch(e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

window.printMedicalReport = (report, type) => {
  const typeLabels = { sick_leave: { ar: 'إجازة مرضية', en: 'Sick Leave Certificate' }, medical_report: { ar: 'تقرير طبي', en: 'Medical Report' }, fitness: { ar: 'شهادة لياقة طبية', en: 'Fitness Certificate' } };
  const label = typeLabels[type] || typeLabels.medical_report;
  
  let html = '<div style="font-family:Arial;padding:40px;direction:rtl;text-align:right;line-height:2">';
  html += '<div style="text-align:center;border-bottom:2px solid #1a73e8;padding-bottom:16px;margin-bottom:24px">';
  html += '<h2 style="color:#1a73e8;margin:0">نما الطبي - Nama Medical</h2>';
  html += '<p style="margin:4px 0;color:#666">المملكة العربية السعودية</p>';
  html += '</div>';
  html += '<h3 style="text-align:center;background:#f0f6ff;padding:12px;border-radius:8px;margin:20px 0">' + label.ar + ' / ' + label.en + '</h3>';
  html += '<table style="width:100%;margin:16px 0;border-collapse:collapse">';
  html += '<tr><td style="padding:8px;font-weight:bold;width:30%">رقم التقرير:</td><td style="padding:8px">' + (report.report_number || '') + '</td></tr>';
  html += '<tr><td style="padding:8px;font-weight:bold">اسم المريض:</td><td style="padding:8px">' + (report.patient_name || '') + '</td></tr>';
  html += '<tr><td style="padding:8px;font-weight:bold">التشخيص:</td><td style="padding:8px">' + (report.diagnosis || '') + '</td></tr>';
  if (report.icd_code) html += '<tr><td style="padding:8px;font-weight:bold">رمز ICD:</td><td style="padding:8px">' + report.icd_code + '</td></tr>';
  if (type === 'sick_leave') {
    html += '<tr><td style="padding:8px;font-weight:bold">من تاريخ:</td><td style="padding:8px">' + (report.start_date || '') + '</td></tr>';
    html += '<tr><td style="padding:8px;font-weight:bold">إلى تاريخ:</td><td style="padding:8px">' + (report.end_date || '') + '</td></tr>';
    html += '<tr><td style="padding:8px;font-weight:bold">عدد الأيام:</td><td style="padding:8px">' + (report.duration_days || '') + ' ' + (isArabic ? 'يوم' : 'days') + '</td></tr>';
  }
  if (type === 'fitness') {
    const statusAr = { fit: 'لائق طبياً', unfit: 'غير لائق', conditional: 'لائق بشروط' };
    html += '<tr><td style="padding:8px;font-weight:bold">الحالة:</td><td style="padding:8px;font-weight:bold;color:' + (report.fitness_status === 'fit' ? 'green' : 'red') + '">' + (statusAr[report.fitness_status] || '') + '</td></tr>';
  }
  if (report.notes) html += '<tr><td style="padding:8px;font-weight:bold">ملاحظات:</td><td style="padding:8px">' + report.notes + '</td></tr>';
  html += '</table>';
  html += '<div style="margin-top:40px;display:flex;justify-content:space-between">';
  html += '<div style="text-align:center"><p>_______________</p><p>توقيع الطبيب</p><p style="font-weight:bold">' + (report.doctor || '') + '</p></div>';
  html += '<div style="text-align:center"><p>_______________</p><p>ختم المنشأة</p></div>';
  html += '</div>';
  html += '<p style="text-align:center;margin-top:24px;font-size:11px;color:#999">تاريخ الإصدار: ' + new Date().toLocaleDateString('ar-SA') + ' | Report #' + (report.report_number || '') + '</p>';
  html += '</div>';
  
  printDocument(label.ar, html, { showHeader: false });
};

// ===== DRUG INTERACTION CHECK =====
window.checkDrugInteractions = async (drugs) => {
  try {
    if (!drugs || drugs.length < 2) return;
    const result = await API.post('/api/drug-interactions/check', { drugs });
    if (result.interactions && result.interactions.length > 0) {
      let alertHtml = '<div style="background:#fff3f3;border:2px solid #ff4444;border-radius:12px;padding:16px;direction:rtl">';
      alertHtml += '<h4 style="color:#cc0000;margin:0 0 12px">⚠️ ' + tr('Drug Interactions Found!', 'تم العثور على تعارضات دوائية!') + '</h4>';
      result.interactions.forEach(i => {
        const color = i.severity === 'critical' ? '#cc0000' : i.severity === 'high' ? '#ff6600' : '#ff9900';
        alertHtml += '<div style="margin:8px 0;padding:8px;background:#fff;border-right:4px solid ' + color + ';border-radius:4px">';
        alertHtml += '<strong>' + i.drugs.join(' ↔ ') + '</strong><br>';
        alertHtml += '<span style="color:' + color + '">[' + i.severity.toUpperCase() + '] ' + (isArabic ? i.message_ar : i.message_en) + '</span>';
        alertHtml += '</div>';
      });
      alertHtml += '</div>';
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center';
      modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;width:500px;max-height:80vh;overflow-y:auto">' +
        alertHtml +
        '<div style="display:flex;gap:12px;margin-top:16px">' +
        '<button class="btn btn-danger" onclick="this.closest(\'.modal-overlay\')?.remove();this.parentElement.parentElement.parentElement.remove()" style="flex:1;background:#cc0000;color:#fff">🚫 ' + tr('Cancel Prescription', 'إلغاء الوصفة') + '</button>' +
        '<button class="btn" onclick="this.parentElement.parentElement.parentElement.remove()" style="flex:1">⚠️ ' + tr('Continue Anyway', 'متابعة رغم التحذير') + '</button>' +
        '</div></div>';
      document.body.appendChild(modal);
    }
  } catch(e) { console.error('Interaction check failed:', e); }
};

// ===== ALLERGY CHECK =====
window.checkAllergyBeforePrescribe = async (patientId, drugs) => {
  try {
    if (!patientId || !drugs || drugs.length === 0) return true;
    const result = await API.post('/api/allergy-check', { patient_id: patientId, drugs });
    if (result.alerts && result.alerts.length > 0) {
      let alertHtml = '<div style="background:#ffe0e0;border:3px solid #ff0000;border-radius:12px;padding:20px;direction:rtl">';
      alertHtml += '<h3 style="color:#cc0000;margin:0 0 12px">🚨 ' + tr('ALLERGY ALERT!', 'تحذير حساسية!') + '</h3>';
      alertHtml += '<p style="margin:0 0 12px">' + tr('Patient allergies:', 'حساسية المريض:') + ' <strong style="color:#cc0000">' + result.patient_allergies + '</strong></p>';
      result.alerts.forEach(a => {
        alertHtml += '<div style="margin:8px 0;padding:10px;background:#fff;border-right:5px solid #ff0000;border-radius:4px">';
        alertHtml += '<strong style="color:#cc0000">💊 ' + a.drug + '</strong><br>';
        alertHtml += '<span>' + (isArabic ? a.message_ar : a.message_en) + '</span>';
        alertHtml += '</div>';
      });
      alertHtml += '</div>';
      
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(200,0,0,0.3);z-index:9999;display:flex;align-items:center;justify-content:center';
      modal.innerHTML = '<div style="background:#fff;border-radius:16px;padding:24px;width:500px">' +
        alertHtml +
        '<div style="margin-top:16px;text-align:center">' +
        '<button class="btn" onclick="this.parentElement.parentElement.parentElement.remove()" style="background:#cc0000;color:#fff;width:100%;padding:12px">❌ ' + tr('Understood - Review Prescription', 'مفهوم - مراجعة الوصفة') + '</button>' +
        '</div></div>';
      document.body.appendChild(modal);
      return false;
    }
    return true;
  } catch(e) { return true; }
};


async function renderDashboard(el) {
  const [s, enhanced] = await Promise.all([
    API.get('/api/dashboard/stats'),
    API.get('/api/dashboard/enhanced').catch(() => ({}))
  ]);
  // Schedule chart rendering after HTML is set
  setTimeout(() => renderDashboardCharts(el, enhanced), 50);
  let topDrHtml = '';
  if (enhanced.topDoctors && enhanced.topDoctors.length) {
    topDrHtml = enhanced.topDoctors.map(d => `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--hover);border-radius:8px;margin:4px 0">
      <span>👨‍⚕️ <strong>${d.display_name || tr('Unknown', 'غير معروف')}</strong> <span class="badge badge-info" style="font-size:10px">${d.patients} ${tr('patients', 'مريض')}</span></span>
      <span style="font-weight:600;color:var(--accent)">${Number(d.revenue).toLocaleString()} SAR</span>
    </div>`).join('');
  }
  let revTypeHtml = '';
  if (enhanced.revenueByType && enhanced.revenueByType.length) {
    const typeIcons = { 'File Opening': '📁', 'Lab Test': '🔬', 'Radiology': '📡', 'Consultation': '🩺', 'Pharmacy': '💊', 'Appointment': '📅' };
    revTypeHtml = enhanced.revenueByType.map(r => `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--hover);border-radius:8px;margin:4px 0">
      <span>${typeIcons[r.service_type] || '📄'} ${r.service_type} <span class="badge badge-info" style="font-size:10px">${r.cnt}</span></span>
      <span style="font-weight:600">${Number(r.total).toLocaleString()} SAR</span>
    </div>`).join('');
  }
  el.innerHTML = `
    <div class="page-title">📊 ${tr('System Dashboard', 'لوحة التحكم')}</div>
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:#60a5fa"><span class="stat-icon">👥</span><div class="stat-label">${tr('Patients', 'المرضى')}</div><div class="stat-value">${s.patients}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">💵</span><div class="stat-label">${tr('Revenue', 'الإيرادات')}</div><div class="stat-value">${Number(s.revenue).toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#f59e0b"><span class="stat-icon">⏳</span><div class="stat-label">${tr('Waiting', 'بانتظار')}</div><div class="stat-value">${s.waiting}</div></div>
      <div class="stat-card" style="--stat-color:#f87171"><span class="stat-icon">📄</span><div class="stat-label">${tr('Pending Claims', 'مطالبات معلقة')}</div><div class="stat-value">${s.pendingClaims}</div></div>
      <div class="stat-card" style="--stat-color:#a78bfa"><span class="stat-icon">📅</span><div class="stat-label">${tr("Today's Appts", 'مواعيد اليوم')}</div><div class="stat-value">${enhanced.todayAppts || s.todayAppts}</div></div>
      <div class="stat-card" style="--stat-color:#38bdf8"><span class="stat-icon">👨‍💼</span><div class="stat-label">${tr('Employees', 'الموظفين')}</div><div class="stat-value">${s.employees}</div></div>
    </div>
    <div class="stats-grid" style="margin-top:16px">
      <div class="stat-card" style="--stat-color:#22c55e"><span class="stat-icon">💰</span><div class="stat-label">${tr("Today's Revenue", 'إيراد اليوم')}</div><div class="stat-value">${Number(enhanced.todayRevenue || 0).toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">📈</span><div class="stat-label">${tr('Monthly Revenue', 'إيراد الشهر')}</div><div class="stat-value">${Number(enhanced.monthRevenue || 0).toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#ef4444"><span class="stat-icon">⚠️</span><div class="stat-label">${tr('Unpaid', 'غير مدفوع')}</div><div class="stat-value">${Number(enhanced.unpaidTotal || 0).toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#8b5cf6"><span class="stat-icon">🔬</span><div class="stat-label">${tr('Pending Lab', 'مختبر معلق')}</div><div class="stat-value">${enhanced.pendingLab || 0}</div></div>
      <div class="stat-card" style="--stat-color:#06b6d4"><span class="stat-icon">📡</span><div class="stat-label">${tr('Pending Rad', 'أشعة معلقة')}</div><div class="stat-value">${enhanced.pendingRad || 0}</div></div>
      <div class="stat-card" style="--stat-color:#ec4899"><span class="stat-icon">💊</span><div class="stat-label">${tr('Pending Rx', 'وصفات معلقة')}</div><div class="stat-value">${enhanced.pendingRx || 0}</div></div>
    </div>
    <div class="grid-equal" style="margin-top:16px">
      <div class="card">
        <div class="card-title">🏆 ${tr('Top Doctors (This Month)', 'أفضل الأطباء (هذا الشهر)')}</div>
        ${topDrHtml || `<div class="empty-state"><p>${tr('No data yet', 'لا توجد بيانات')}</p></div>`}
      </div>
      <div class="card">
        <div class="card-title">📊 ${tr('Revenue by Service Type', 'الإيرادات حسب نوع الخدمة')}</div>
        ${enhanced.revenueByType && enhanced.revenueByType.length ? (() => {
      const maxRev = Math.max(...enhanced.revenueByType.map(r => Number(r.total)));
      const typeIcons = { 'File Opening': '📁', 'Lab Test': '🔬', 'Radiology': '📡', 'Consultation': '🩺', 'Pharmacy': '💊', 'Appointment': '📅' };
      const colors = ['#3b82f6', '#4ade80', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      return enhanced.revenueByType.map((r, i) => `<div style="margin:8px 0">
            <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
              <span>${typeIcons[r.service_type] || '📄'} ${r.service_type} (${r.cnt})</span>
              <span style="font-weight:600">${Number(r.total).toLocaleString()} SAR</span>
            </div>
            <div style="background:var(--hover);border-radius:8px;height:22px;overflow:hidden">
              <div style="height:100%;width:${Math.round(Number(r.total) / maxRev * 100)}%;background:${colors[i % colors.length]};border-radius:8px;transition:width 1s ease"></div>
            </div>
          </div>`).join('');
    })() : `<div class="empty-state"><p>${tr('No data yet', 'لا توجد بيانات')}</p></div>`}
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-title">⚡ ${tr('Quick Actions', 'إجراءات سريعة')}</div>
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px">
        <button class="btn" onclick="navigateTo(1)">🏥 ${tr('Reception', 'الاستقبال')}</button>
        <button class="btn" onclick="navigateTo(2)">📅 ${tr('Appointments', 'المواعيد')}</button>
        <button class="btn" onclick="navigateTo(4)">🔬 ${tr('Lab', 'المختبر')}</button>
        <button class="btn" onclick="navigateTo(6)">💊 ${tr('Pharmacy', 'الصيدلية')}</button>
        <button class="btn" onclick="navigateTo(14)">📋 ${tr('Reports', 'التقارير')}</button>
        <button class="btn" onclick="navigateTo(8)">💰 ${tr('Finance', 'المالية')}</button>
      </div>
    </div>`;
}

// === DASHBOARD CHARTS (Chart.js) ===
function renderDashboardCharts(el, enhanced) {
  try {
    const revData = enhanced.revenueByType || [];
    if (revData.length === 0 || typeof Chart === 'undefined') return;
    const chartRow = document.createElement('div');
    chartRow.className = 'grid-equal';
    chartRow.style.marginTop = '16px';
    const leftCard = document.createElement('div');
    leftCard.className = 'card';
    leftCard.innerHTML = '<div class="card-title">\u{1F4CA} ' + tr('Revenue by Service', '\u0627\u0644\u0625\u064a\u0631\u0627\u062f\u0627\u062a \u062d\u0633\u0628 \u0627\u0644\u062e\u062f\u0645\u0629') + '</div><div style="max-height:280px;display:flex;justify-content:center"><canvas id="dashDoughnut"></canvas></div>';
    const rightCard = document.createElement('div');
    rightCard.className = 'card';
    rightCard.innerHTML = '<div class="card-title">\u{1F4C8} ' + tr('Revenue Breakdown', '\u062a\u0648\u0632\u064a\u0639 \u0627\u0644\u0625\u064a\u0631\u0627\u062f\u0627\u062a') + '</div><div style="max-height:280px"><canvas id="dashBar"></canvas></div>';
    chartRow.appendChild(leftCard);
    chartRow.appendChild(rightCard);
    el.appendChild(chartRow);
    const labels = revData.map(r => r.service_type);
    const values = revData.map(r => parseFloat(r.total) || 0);
    const clrs = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];
    new Chart(document.getElementById('dashDoughnut'), { type: 'doughnut', data: { labels, datasets: [{ data: values, backgroundColor: clrs.slice(0, labels.length), borderWidth: 2 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { family: 'Tajawal', size: 11 }, padding: 10 } } } } });
    new Chart(document.getElementById('dashBar'), { type: 'bar', data: { labels, datasets: [{ label: tr('Revenue', 'الإيراد'), data: values, backgroundColor: clrs.slice(0, labels.length), borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } } });
  } catch (e) { console.log('Chart error:', e); }
}

// === CRITICAL LAB VALUE DEFINITIONS ===
const CRITICAL_LAB_VALUES = {
  'Hemoglobin': { low: 7.0, high: 20.0, unit: 'g/dL' },
  'Platelets': { low: 50, high: 1000, unit: 'x10³/µL' },
  'WBC': { low: 2.0, high: 30.0, unit: 'x10³/µL' },
  'Potassium': { low: 2.5, high: 6.5, unit: 'mEq/L' },
  'Sodium': { low: 120, high: 160, unit: 'mEq/L' },
  'Glucose': { low: 40, high: 500, unit: 'mg/dL' },
  'Creatinine': { low: 0, high: 10.0, unit: 'mg/dL' },
  'Troponin': { low: 0, high: 0.04, unit: 'ng/mL' },
  'INR': { low: 0, high: 5.0, unit: '' },
  'Lactate': { low: 0, high: 4.0, unit: 'mmol/L' }
};
window.checkCriticalLabValue = (testName, resultText) => {
  const numMatch = resultText.match(/[\d.]+/);
  if (!numMatch) return null;
  const val = parseFloat(numMatch[0]);
  for (const [key, range] of Object.entries(CRITICAL_LAB_VALUES)) {
    if (testName.toLowerCase().includes(key.toLowerCase())) {
      if (val < range.low) return { test: key, value: val, status: 'CRITICALLY LOW', range };
      if (val > range.high) return { test: key, value: val, status: 'CRITICALLY HIGH', range };
    }
  }
  return null;
};

// === DRUG ALLERGY CHECK ===
window.checkDrugAllergy = async (patientId, drugName) => {
  try {
    const patients = await API.get('/api/patients');
    const patient = patients.find(p => p.id == patientId);
    if (!patient || !patient.allergies) return false;
    const allergies = patient.allergies.toLowerCase().split(/[,،;]+/).map(a => a.trim());
    const drug = drugName.toLowerCase();
    for (const allergy of allergies) {
      if (allergy && (drug.includes(allergy) || allergy.includes(drug))) {
        return allergy;
      }
    }
    return false;
  } catch { return false; }
};

// === PATIENT STATEMENT (Printable Account) ===
window.printPatientStatement = async (patientId) => {
  try {
    const account = await API.get('/api/patients/' + patientId + '/account');
    const p = account.patient;
    const invoices = account.invoices || [];
    let rows = invoices.map(inv =>
      '<tr><td>' + (inv.created_at ? new Date(inv.created_at).toLocaleDateString('ar-SA') : '-') +
      '</td><td>' + (inv.description || inv.service_type || '-') +
      '</td><td>' + (inv.total || 0) + ' SAR</td><td>' +
      (inv.paid ? '\u2705 ' + tr('Paid', 'مدفوع') : '\u26A0\uFE0F ' + tr('Unpaid', 'غير مدفوع')) + '</td></tr>'
    ).join('');
    const content = '<div style="text-align:center;margin-bottom:20px"><h2>\u{1F3E5} ' + tr('Nama Medical', 'نما الطبي') + '</h2><h3>' + tr('Patient Financial Statement', 'كشف حساب المريض') + '</h3></div>' +
      '<table style="width:100%;margin-bottom:15px"><tr><td><strong>' + tr('Name', 'الاسم') + ':</strong> ' + (p.name_ar || p.name_en) + '</td><td><strong>MRN:</strong> ' + (p.mrn || p.file_number) + '</td></tr>' +
      '<tr><td><strong>' + tr('ID', 'الهوية') + ':</strong> ' + (p.national_id || '-') + '</td><td><strong>' + tr('Phone', 'الجوال') + ':</strong> ' + (p.phone || '-') + '</td></tr></table>' +
      '<table border="1" cellpadding="6" cellspacing="0" style="width:100%;border-collapse:collapse"><thead><tr style="background:#f0f0f0"><th>' + tr('Date', 'التاريخ') + '</th><th>' + tr('Description', 'الوصف') + '</th><th>' + tr('Amount', 'المبلغ') + '</th><th>' + tr('Status', 'الحالة') + '</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div style="margin-top:20px;padding:10px;background:#f9f9f9;border-radius:8px"><strong>' + tr('Total Billed', 'إجمالي المبالغ') + ':</strong> ' + (account.totalBilled || 0) + ' SAR | <strong>' + tr('Total Paid', 'المدفوع') + ':</strong> ' + (account.totalPaid || 0) + ' SAR | <strong style="color:' + (account.balance > 0 ? 'red' : 'green') + '">' + tr('Balance', 'الرصيد') + ':</strong> ' + (account.balance || 0) + ' SAR</div>';
    printDocument(tr('Patient Statement', 'كشف حساب المريض'), content);
  } catch (e) { showToast(tr('Error loading statement', 'خطأ في تحميل الكشف'), 'error'); }
};

// === DIAGNOSIS TEMPLATES ===
let _diagTemplatesCache = null;
window.loadDiagTemplates = async () => {
  try {
    const templates = await API.get('/api/diagnosis-templates');
    _diagTemplatesCache = templates;
    const sel = document.getElementById('drDiagTemplate');
    if (!sel) return;
    sel.innerHTML = '<option value="">' + tr('-- Select Template --', '-- اختر قالب --') + '</option>';
    for (const [specialty, items] of Object.entries(templates)) {
      const group = document.createElement('optgroup');
      group.label = specialty;
      items.forEach((t, idx) => {
        const opt = document.createElement('option');
        opt.value = specialty + '|' + idx;
        opt.textContent = (isArabic ? t.name_ar : t.name) + ' [' + t.icd + ']';
        group.appendChild(opt);
      });
      sel.appendChild(group);
    }
    showToast(tr('Templates loaded!', 'تم تحميل القوالب!'));
  } catch (e) { showToast(tr('Error loading templates', 'خطأ في تحميل القوالب'), 'error'); }
};
window.applyDiagTemplate = () => {
  const val = document.getElementById('drDiagTemplate')?.value;
  if (!val || !_diagTemplatesCache) return;
  const [specialty, idx] = val.split('|');
  const t = _diagTemplatesCache[specialty]?.[parseInt(idx)];
  if (!t) return;
  document.getElementById('drDiag').value = isArabic ? t.name_ar : t.name;
  document.getElementById('drSymp').value = t.symptoms || '';
  document.getElementById('drIcd').value = t.icd || '';
  document.getElementById('drNotes').value = t.treatment || '';
};

// === PHARMACY LOW STOCK ALERTS ===
window.showPharmacyStockAlerts = async () => {
  try {
    const lowStock = await API.get('/api/pharmacy/low-stock');
    if (lowStock.length === 0) { showToast(tr('All stock levels OK!', 'جميع المخزونات بحالة جيدة!')); return; }
    let html = '<div style="max-height:400px;overflow-y:auto">';
    lowStock.forEach(d => {
      const pct = d.min_stock_level > 0 ? Math.round((d.stock_qty / d.min_stock_level) * 100) : 0;
      const color = d.stock_qty <= 0 ? '#dc2626' : d.stock_qty <= 5 ? '#f59e0b' : '#eab308';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px;margin:4px 0;border-radius:8px;border-right:4px solid ' + color + ';background:var(--hover)">' +
        '<div><strong>' + d.drug_name + '</strong>' + (d.category ? '<br><small>' + d.category + '</small>' : '') + '</div>' +
        '<div style="text-align:center"><span style="font-size:20px;font-weight:700;color:' + color + '">' + d.stock_qty + '</span><br><small>' + tr('of', 'من') + ' ' + (d.min_stock_level || 10) + ' min</small></div></div>';
    });
    html += '</div>';
    showModal(tr('Low Stock Alerts', 'تنبيهات المخزون المنخفض') + ' (' + lowStock.length + ')', html);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// === P&L REPORT VIEWER ===
window.renderPnlReport = async (fromDate, toDate) => {
  try {
    let url = '/api/reports/pnl';
    if (fromDate && toDate) url += '?from=' + fromDate + '&to=' + toDate;
    const data = await API.get(url);
    const el = document.getElementById('pnlResult');
    if (!el) return;
    let typeRows = data.byType.map(t =>
      '<tr><td>' + (t.service_type || '-') + '</td><td>' + t.cnt + '</td><td style="font-weight:600">' + Number(t.total).toLocaleString() + ' SAR</td></tr>'
    ).join('');
    el.innerHTML = '<div class="stats-grid" style="margin-bottom:16px">' +
      '<div class="stat-card" style="--stat-color:#22c55e"><div class="stat-label">' + tr('Total Revenue', 'إجمالي الإيراد') + '</div><div class="stat-value">' + Number(data.totalRevenue).toLocaleString() + '</div></div>' +
      '<div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">' + tr('Collected', 'المحصل') + '</div><div class="stat-value">' + Number(data.totalCollected).toLocaleString() + '</div></div>' +
      '<div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-label">' + tr('Discounts', 'الخصومات') + '</div><div class="stat-value">' + Number(data.totalDiscounts).toLocaleString() + '</div></div>' +
      '<div class="stat-card" style="--stat-color:#ef4444"><div class="stat-label">' + tr('Uncollected', 'غير محصل') + '</div><div class="stat-value">' + Number(data.totalUncollected).toLocaleString() + '</div></div>' +
      '<div class="stat-card" style="--stat-color:#64748b"><div class="stat-label">' + tr('Est. Costs', 'تكاليف تقديرية') + '</div><div class="stat-value">' + Number(data.estimatedCosts).toLocaleString() + '</div></div>' +
      '<div class="stat-card" style="--stat-color:' + (data.netProfit >= 0 ? '#10b981' : '#ef4444') + '"><div class="stat-label">' + tr('Net Profit', 'صافي الربح') + '</div><div class="stat-value">' + Number(data.netProfit).toLocaleString() + '</div></div>' +
      '</div><table class="data-table"><thead><tr><th>' + tr('Service', 'الخدمة') + '</th><th>' + tr('Count', 'العدد') + '</th><th>' + tr('Revenue', 'الإيراد') + '</th></tr></thead><tbody>' + typeRows + '</tbody></table>';
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// === SHOW MODAL HELPER ===
window.showModal = (title, content) => {
  let modal = document.getElementById('genericModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'genericModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999';
    modal.innerHTML = '<div style="background:var(--card-bg,#fff);border-radius:16px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3)"><div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:16px"><h3 id="genericModalTitle" style="margin:0"></h3><button onclick="this.closest(\'#genericModal\').style.display=\'none\'" style="border:none;background:none;font-size:20px;cursor:pointer">\u2715</button></div><div id="genericModalBody"></div></div>';
    document.body.appendChild(modal);
  }
  document.getElementById('genericModalTitle').textContent = title;
  document.getElementById('genericModalBody').innerHTML = content;
  modal.style.display = 'flex';
};

async function renderReception(el) {
  const [patients, doctors] = await Promise.all([API.get('/api/patients'), API.get('/api/employees?role=Doctor')]);
  const depts = ['العيادة العامة', 'الباطنية', 'الأطفال', 'العظام', 'الجلدية', 'الأنف والأذن', 'العيون', 'الأسنان', 'الطوارئ'];
  const deptsEn = ['General Clinic', 'Internal Medicine', 'Pediatrics', 'Orthopedics', 'Dermatology', 'ENT', 'Ophthalmology', 'Dental', 'Emergency'];
  const maxFile = patients.length ? Math.max(...patients.map(p => p.file_number || 1000)) + 1 : 1001;

  el.innerHTML = `
    <div class="page-title">🏥 ${tr('Reception', 'الاستقبال')}</div>
    <div class="split-layout">
      <div class="card">
        <div class="card-title">📝 ${tr('New Patient File', 'ملف مريض جديد')}</div>
        <div class="form-group mb-12"><label>${tr('File No.', 'رقم الملف')}</label><input class="form-input form-input-readonly" value="${maxFile}" readonly id="rFileNum"></div>
        <div class="form-group mb-12"><label>${tr('Full Name (Arabic)', 'الاسم بالعربية')}</label><input class="form-input" id="rNameAr" placeholder="${tr('Enter Arabic name', 'ادخل الاسم بالعربية')}"></div>
        <div class="form-group mb-12"><label>${tr('Full Name (English)', 'الاسم بالإنجليزية')}</label><input class="form-input" id="rNameEn" placeholder="${tr('Enter English name', 'ادخل الاسم بالإنجليزية')}"></div>
        <div class="form-group mb-12"><label>${tr('National ID', 'رقم الهوية')}</label><input class="form-input" id="rNatId"></div>
        <div class="form-group mb-12"><label>${tr('Phone', 'الجوال')}</label><input class="form-input" id="rPhone" placeholder="05XXXXXXXX"></div>
        <div class="form-group mb-12"><label>${tr('Nationality', 'الجنسية')}</label><select class="form-input" id="rNationality">
          <option value="سعودي">🇸🇦 ${tr('Saudi', 'سعودي')}</option>
          <option value="يمني">🇾🇪 ${tr('Yemeni', 'يمني')}</option>
          <option value="إماراتي">🇦🇪 ${tr('Emirati', 'إماراتي')}</option>
          <option value="كويتي">🇰🇼 ${tr('Kuwaiti', 'كويتي')}</option>
          <option value="بحريني">🇧🇭 ${tr('Bahraini', 'بحريني')}</option>
          <option value="قطري">🇶🇦 ${tr('Qatari', 'قطري')}</option>
          <option value="عماني">🇴🇲 ${tr('Omani', 'عماني')}</option>
          <option value="عراقي">🇮🇶 ${tr('Iraqi', 'عراقي')}</option>
          <option value="أردني">🇯🇴 ${tr('Jordanian', 'أردني')}</option>
          <option value="سوري">🇸🇾 ${tr('Syrian', 'سوري')}</option>
          <option value="لبناني">🇱🇧 ${tr('Lebanese', 'لبناني')}</option>
          <option value="فلسطيني">🇵🇸 ${tr('Palestinian', 'فلسطيني')}</option>
          <option value="مصري">🇪🇬 ${tr('Egyptian', 'مصري')}</option>
          <option value="سوداني">🇸🇩 ${tr('Sudanese', 'سوداني')}</option>
          <option value="ليبي">🇱🇾 ${tr('Libyan', 'ليبي')}</option>
          <option value="تونسي">🇹🇳 ${tr('Tunisian', 'تونسي')}</option>
          <option value="جزائري">🇩🇿 ${tr('Algerian', 'جزائري')}</option>
          <option value="مغربي">🇲🇦 ${tr('Moroccan', 'مغربي')}</option>
          <option value="موريتاني">🇲🇷 ${tr('Mauritanian', 'موريتاني')}</option>
          <option value="صومالي">🇸🇴 ${tr('Somali', 'صومالي')}</option>
          <option value="جيبوتي">🇩🇯 ${tr('Djiboutian', 'جيبوتي')}</option>
          <option value="جزر القمر">🇰🇲 ${tr('Comoran', 'جزر القمر')}</option>
          <option value="تركي">🇹🇷 ${tr('Turkish', 'تركي')}</option>
          <option value="إيراني">🇮🇷 ${tr('Iranian', 'إيراني')}</option>
          <option value="أفغاني">🇦🇫 ${tr('Afghan', 'أفغاني')}</option>
          <option value="باكستاني">🇵🇰 ${tr('Pakistani', 'باكستاني')}</option>
          <option value="هندي">🇮🇳 ${tr('Indian', 'هندي')}</option>
          <option value="بنغلاديشي">🇧🇩 ${tr('Bangladeshi', 'بنغلاديشي')}</option>
          <option value="سريلانكي">🇱🇰 ${tr('Sri Lankan', 'سريلانكي')}</option>
          <option value="نيبالي">🇳🇵 ${tr('Nepali', 'نيبالي')}</option>
          <option value="فلبيني">🇵🇭 ${tr('Filipino', 'فلبيني')}</option>
          <option value="إندونيسي">🇮🇩 ${tr('Indonesian', 'إندونيسي')}</option>
          <option value="ماليزي">🇲🇾 ${tr('Malaysian', 'ماليزي')}</option>
          <option value="تايلاندي">🇹🇭 ${tr('Thai', 'تايلاندي')}</option>
          <option value="فيتنامي">🇻🇳 ${tr('Vietnamese', 'فيتنامي')}</option>
          <option value="ميانماري">🇲🇲 ${tr('Myanmar', 'ميانماري')}</option>
          <option value="صيني">🇨🇳 ${tr('Chinese', 'صيني')}</option>
          <option value="ياباني">🇯🇵 ${tr('Japanese', 'ياباني')}</option>
          <option value="كوري">🇰🇷 ${tr('Korean', 'كوري')}</option>
          <option value="أمريكي">🇺🇸 ${tr('American', 'أمريكي')}</option>
          <option value="كندي">🇨🇦 ${tr('Canadian', 'كندي')}</option>
          <option value="مكسيكي">🇲🇽 ${tr('Mexican', 'مكسيكي')}</option>
          <option value="برازيلي">🇧🇷 ${tr('Brazilian', 'برازيلي')}</option>
          <option value="أرجنتيني">🇦🇷 ${tr('Argentine', 'أرجنتيني')}</option>
          <option value="كولومبي">🇨🇴 ${tr('Colombian', 'كولومبي')}</option>
          <option value="بريطاني">🇬🇧 ${tr('British', 'بريطاني')}</option>
          <option value="فرنسي">🇫🇷 ${tr('French', 'فرنسي')}</option>
          <option value="ألماني">🇩🇪 ${tr('German', 'ألماني')}</option>
          <option value="إيطالي">🇮🇹 ${tr('Italian', 'إيطالي')}</option>
          <option value="إسباني">🇪🇸 ${tr('Spanish', 'إسباني')}</option>
          <option value="برتغالي">🇵🇹 ${tr('Portuguese', 'برتغالي')}</option>
          <option value="هولندي">🇳🇱 ${tr('Dutch', 'هولندي')}</option>
          <option value="بلجيكي">🇧🇪 ${tr('Belgian', 'بلجيكي')}</option>
          <option value="سويسري">🇨🇭 ${tr('Swiss', 'سويسري')}</option>
          <option value="نمساوي">🇦🇹 ${tr('Austrian', 'نمساوي')}</option>
          <option value="سويدي">🇸🇪 ${tr('Swedish', 'سويدي')}</option>
          <option value="نرويجي">🇳🇴 ${tr('Norwegian', 'نرويجي')}</option>
          <option value="دنماركي">🇩🇰 ${tr('Danish', 'دنماركي')}</option>
          <option value="فنلندي">🇫🇮 ${tr('Finnish', 'فنلندي')}</option>
          <option value="بولندي">🇵🇱 ${tr('Polish', 'بولندي')}</option>
          <option value="روسي">🇷🇺 ${tr('Russian', 'روسي')}</option>
          <option value="أوكراني">🇺🇦 ${tr('Ukrainian', 'أوكراني')}</option>
          <option value="روماني">🇷🇴 ${tr('Romanian', 'روماني')}</option>
          <option value="يوناني">🇬🇷 ${tr('Greek', 'يوناني')}</option>
          <option value="أسترالي">🇦🇺 ${tr('Australian', 'أسترالي')}</option>
          <option value="نيوزيلندي">🇳🇿 ${tr('New Zealander', 'نيوزيلندي')}</option>
          <option value="جنوب أفريقي">🇿🇦 ${tr('South African', 'جنوب أفريقي')}</option>
          <option value="نيجيري">🇳🇬 ${tr('Nigerian', 'نيجيري')}</option>
          <option value="كيني">🇰🇪 ${tr('Kenyan', 'كيني')}</option>
          <option value="إثيوبي">🇪🇹 ${tr('Ethiopian', 'إثيوبي')}</option>
          <option value="أوغندي">🇺🇬 ${tr('Ugandan', 'أوغندي')}</option>
          <option value="تانزاني">🇹🇿 ${tr('Tanzanian', 'تانزاني')}</option>
          <option value="غاني">🇬🇭 ${tr('Ghanaian', 'غاني')}</option>
          <option value="سنغالي">🇸🇳 ${tr('Senegalese', 'سنغالي')}</option>
          <option value="كاميروني">🇨🇲 ${tr('Cameroonian', 'كاميروني')}</option>
          <option value="تشادي">🇹🇩 ${tr('Chadian', 'تشادي')}</option>
          <option value="مالي">🇲🇱 ${tr('Malian', 'مالي')}</option>
          <option value="إريتري">🇪🇷 ${tr('Eritrean', 'إريتري')}</option>
          <option value="أذربيجاني">🇦🇿 ${tr('Azerbaijani', 'أذربيجاني')}</option>
          <option value="أوزبكي">🇺🇿 ${tr('Uzbek', 'أوزبكي')}</option>
          <option value="كازاخي">🇰🇿 ${tr('Kazakh', 'كازاخي')}</option>
          <option value="تركمانستاني">🇹🇲 ${tr('Turkmen', 'تركمانستاني')}</option>
          <option value="قرغيزي">🇰🇬 ${tr('Kyrgyz', 'قرغيزي')}</option>
          <option value="طاجيكي">🇹🇯 ${tr('Tajik', 'طاجيكي')}</option>
          <option value="أخرى">🌍 ${tr('Other', 'أخرى')}</option>
        </select></div>
        <div class="form-group mb-12"><label>${tr('Gender', 'الجنس')}</label><select class="form-input" id="rGender">
          <option value="ذكر">👨 ${tr('Male', 'ذكر')}</option>
          <option value="أنثى">👩 ${tr('Female', 'أنثى')}</option>
        </select></div>
        <div class="flex gap-16 mb-12" style="flex-wrap:wrap">
          <div class="form-group" style="flex:3;min-width:220px"><label>${tr('DOB (Gregorian)', 'تاريخ الميلاد (ميلادي)')}</label>
            <div class="flex gap-4">
              <select class="form-input" id="rGregDay" style="flex:0.8"><option value="">${tr('Day', 'يوم')}</option>${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}</select>
              <select class="form-input" id="rGregMonth" style="flex:1.5"><option value="">${tr('Month', 'شهر')}</option>
                <option value="1">${tr('January', 'يناير')}</option><option value="2">${tr('February', 'فبراير')}</option><option value="3">${tr('March', 'مارس')}</option>
                <option value="4">${tr('April', 'أبريل')}</option><option value="5">${tr('May', 'مايو')}</option><option value="6">${tr('June', 'يونيو')}</option>
                <option value="7">${tr('July', 'يوليو')}</option><option value="8">${tr('August', 'أغسطس')}</option><option value="9">${tr('September', 'سبتمبر')}</option>
                <option value="10">${tr('October', 'أكتوبر')}</option><option value="11">${tr('November', 'نوفمبر')}</option><option value="12">${tr('December', 'ديسمبر')}</option>
              </select>
              <select class="form-input" id="rGregYear" style="flex:1"><option value="">${tr('Year', 'سنة')}</option>${Array.from({ length: 97 }, (_, i) => `<option value="${2026 - i}">${2026 - i}</option>`).join('')}</select>
            </div>
          </div>
          <div class="form-group" style="flex:3;min-width:220px"><label>${tr('DOB (Hijri)', 'تاريخ الميلاد (هجري)')}</label>
            <div class="flex gap-4">
              <select class="form-input" id="rHijriDay" style="flex:0.8"><option value="">${tr('Day', 'يوم')}</option>${Array.from({ length: 30 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}</select>
              <select class="form-input" id="rHijriMonth" style="flex:1.5"><option value="">${tr('Month', 'شهر')}</option>
                <option value="1">محرم</option><option value="2">صفر</option><option value="3">ربيع الأول</option><option value="4">ربيع الثاني</option>
                <option value="5">جمادى الأولى</option><option value="6">جمادى الثانية</option><option value="7">رجب</option><option value="8">شعبان</option>
                <option value="9">رمضان</option><option value="10">شوال</option><option value="11">ذو القعدة</option><option value="12">ذو الحجة</option>
              </select>
              <select class="form-input" id="rHijriYear" style="flex:1"><option value="">${tr('Year', 'سنة')}</option>${Array.from({ length: 101 }, (_, i) => `<option value="${1350 + i}">${1350 + i}</option>`).join('')}</select>
            </div>
          </div>
          <div class="form-group" style="flex:1;min-width:70px"><label>${tr('Age', 'العمر')}</label><input class="form-input form-input-readonly" id="rAge" readonly></div>
        </div>

        <div style="background:var(--hover);padding:12px;border-radius:8px;margin-bottom:12px">
          <h4 style="margin:0 0 8px;font-size:13px;color:var(--accent)">🏥 ${tr('Medical Information', 'المعلومات الطبية')}</h4>
          <div class="flex gap-8 mb-8" style="flex-wrap:wrap">
            <div class="form-group" style="flex:1;min-width:120px"><label>${tr('Blood Type', 'فصيلة الدم')}</label>
              <select class="form-input" id="rBloodType">
                <option value="">--</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>
            <div class="form-group" style="flex:2;min-width:200px"><label>⚠️ ${tr('Allergies', 'الحساسية')}</label><input class="form-input" id="rAllergies" placeholder="${tr('Drug allergies, food allergies...', 'حساسية أدوية، طعام...')}"></div>
            <div class="form-group" style="flex:2;min-width:200px"><label>🩺 ${tr('Chronic Diseases', 'الأمراض المزمنة')}</label><input class="form-input" id="rChronicDiseases" placeholder="${tr('Diabetes, Hypertension, Asthma...', 'سكري، ضغط، ربو...')}"></div>
          </div>
          <div class="flex gap-8 mb-8" style="flex-wrap:wrap">
            <div class="form-group" style="flex:1;min-width:150px"><label>🆘 ${tr('Emergency Contact Name', 'اسم جهة الطوارئ')}</label><input class="form-input" id="rEmergencyName"></div>
            <div class="form-group" style="flex:1;min-width:120px"><label>📞 ${tr('Emergency Phone', 'هاتف الطوارئ')}</label><input class="form-input" id="rEmergencyPhone" type="tel"></div>
            <div class="form-group" style="flex:2;min-width:200px"><label>📍 ${tr('Address', 'العنوان')}</label><input class="form-input" id="rAddress"></div>
          </div>
        </div>

        <div style="background:var(--hover);padding:12px;border-radius:8px;margin-bottom:12px">
          <h4 style="margin:0 0 8px;font-size:13px;color:var(--accent)">🏢 ${tr('Insurance Information', 'معلومات التأمين')}</h4>
          <div class="flex gap-8" style="flex-wrap:wrap">
            <div class="form-group" style="flex:2;min-width:180px"><label>${tr('Insurance Company', 'شركة التأمين')}</label><input class="form-input" id="rInsuranceCompany" placeholder="${tr('e.g. Bupa, Tawuniya, MedGulf...', 'مثال: بوبا، التعاونية...')}"></div>
            <div class="form-group" style="flex:1;min-width:140px"><label>${tr('Policy Number', 'رقم البوليصة')}</label><input class="form-input" id="rInsurancePolicyNo"></div>
            <div class="form-group" style="flex:1;min-width:120px"><label>${tr('Class', 'الفئة')}</label>
              <select class="form-input" id="rInsuranceClass">
                <option value="">--</option>
                <option value="VIP">VIP</option>
                <option value="A">A (Gold)</option>
                <option value="B">B (Silver)</option>
                <option value="C">C (Bronze)</option>
              </select>
            </div>
          </div>
        </div>

        <button class="btn btn-primary w-full" id="rSaveBtn" style="height:44px;font-size:15px">💾 ${tr('Save & Generate File', 'حفظ وإنشاء ملف')}</button>
      </div>
    </div>
    <div class="card mt-16">
      <div class="card-title">📋 ${tr('Patient Queue', 'قائمة المرضى')}</div>
      <input class="search-filter" id="rSearch" placeholder="${tr('Search by name, ID, phone, file#...', 'بحث بالاسم، الهوية، الجوال، رقم الملف...')}">
      <div id="rTable"></div>
    </div>
    <div class="card mt-16" id="pendingPaymentCard">
      <div class="card-title">💳 ${tr('Pending Payment Orders (Lab / Radiology)', 'طلبات فحوصات بانتظار السداد (مختبر / أشعة)')}</div>
      <div id="pendingPaymentTable"></div>
    </div>
    <div id="editPatientModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:9999;align-items:center;justify-content:center">
      <div style="background:#fff;padding:30px;border-radius:16px;width:550px;max-width:90%;max-height:85vh;overflow-y:auto;direction:rtl">
        <h3 style="margin-bottom:16px">✏️ ${tr('Edit Patient', 'تعديل بيانات المريض')}</h3>
        <input type="hidden" id="editPId">
        <div class="form-grid" style="gap:12px">
          <div><label>${tr('Name (Arabic)', 'الاسم بالعربية')}</label><input id="editPNameAr" class="form-control"></div>
          <div><label>${tr('Name (English)', 'الاسم بالإنجليزية')}</label><input id="editPNameEn" class="form-control"></div>
          <div><label>${tr('National ID', 'رقم الهوية')}</label><input id="editPNatId" class="form-control"></div>
          <div><label>${tr('Phone', 'الجوال')}</label><input id="editPPhone" class="form-control"></div>
          <div><label>${tr('Nationality', 'الجنسية')}</label><input id="editPNationality" class="form-control"></div>
          <div><label>${tr('DOB', 'تاريخ الميلاد')}</label><input id="editPDob" type="date" class="form-control"></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:16px">
          <button class="btn btn-primary" onclick="saveEditPatient()" style="flex:1">💾 ${tr('Save', 'حفظ')}</button>
          <button class="btn" onclick="document.getElementById('editPatientModal').style.display='none'" style="flex:1">❌ ${tr('Cancel', 'إلغاء')}</button>
        </div>
      </div>
    </div>
    <div id="newInvoiceModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:9999;align-items:center;justify-content:center">
      <div style="background:#fff;padding:30px;border-radius:16px;width:450px;max-width:90%;direction:rtl">
        <h3 style="margin-bottom:16px">🧾 ${tr('New Service Invoice', 'فاتورة خدمة جديدة')}</h3>
        <input type="hidden" id="invPId">
        <input type="hidden" id="invPName">
        <p id="invPLabel" style="font-weight:700;margin-bottom:12px"></p>
        <div class="form-grid" style="gap:12px">
          <div><label>${tr('Service Type', 'نوع الخدمة')}</label><select id="invServiceType" class="form-control" onchange="var v=this.value==='\u0643\u0634\u0641';document.getElementById('invDeptRow').style.display=v?'block':'none';document.getElementById('invDoctorRow').style.display=v?'block':'none'">
            <option value="كشف">🩺 ${tr('Consultation', 'كشف')}</option>
            <option value="مختبر">🧪 ${tr('Laboratory', 'مختبر')}</option>
            <option value="أشعة">📷 ${tr('Radiology', 'أشعة')}</option>
            <option value="إجراء">🏥 ${tr('Procedure', 'إجراء')}</option>
            <option value="أدوية">💊 ${tr('Medications', 'أدوية')}</option>
            <option value="عملية">🩸 ${tr('Surgery', 'عملية')}</option>
            <option value="تمريض">👩‍⚕️ ${tr('Nursing', 'تمريض')}</option>
            <option value="أخرى">📋 ${tr('Other', 'أخرى')}</option>
          </select></div>
          <div id="invDeptRow"><label>${tr('Department', 'القسم')}</label><select id="invDept" class="form-control">
            ${depts.map((d, i) => `<option value="${isArabic ? d : deptsEn[i]}">${isArabic ? d : deptsEn[i]}</option>`).join('')}
          </select></div>
          <div id="invDoctorRow"><label>${tr('Doctor', 'الطبيب')}</label><select id="invDoctor" class="form-control">
            <option value="">${tr('Select Doctor', 'اختر الطبيب')}</option>
            ${(doctors || []).map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
          </select></div>
          <div><label>${tr('Description', 'الوصف')}</label><input id="invDescription" class="form-control" placeholder="${tr('Service details', 'تفاصيل الخدمة')}"></div>
          <div><label>${tr('Amount (SAR)', 'المبلغ (ر.س)')}</label><input id="invAmount" type="number" step="0.01" class="form-control" placeholder="0.00"></div>
          <div class="flex gap-8" style="flex-wrap:wrap">
            <div style="flex:1"><label>🏷️ ${tr('Discount (SAR)', 'الخصم (ر.س)')}</label><input id="invDiscount" type="number" step="0.01" class="form-control" placeholder="0" value="0"></div>
            <div style="flex:2"><label>${tr('Discount Reason', 'سبب الخصم')}</label><input id="invDiscountReason" class="form-control" placeholder="${tr('e.g. Staff, Insurance, Coupon...', 'مثال: موظف، تأمين، كوبون...')}"></div>
          </div>
          <div><label>${tr('Payment Method', 'طريقة السداد')}</label><select id="invPayMethod" class="form-control">
            <option value="كاش">💵 ${tr('Cash', 'كاش')}</option>
            <option value="صرافة">💳 ${tr('Card/POS', 'صرافة')}</option>
            <option value="تحويل بنكي">🏦 ${tr('Bank Transfer', 'تحويل بنكي')}</option>
            <option value="تابي">🔵 ${tr('Tabby', 'تابي')}</option>
            <option value="تمارا">🟣 ${tr('Tamara', 'تمارا')}</option>
          </select></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:16px">
          <button class="btn btn-primary" onclick="confirmNewInvoice()" style="flex:1">✅ ${tr('Create Invoice', 'إنشاء فاتورة')}</button>
          <button class="btn" onclick="document.getElementById('newInvoiceModal').style.display='none'" style="flex:1">❌ ${tr('Cancel', 'إلغاء')}</button>
        </div>
      </div>
    </div>`;

  renderPatientTable(patients);
  loadPendingPaymentOrders();

  // Arabic to English transliteration (improved)
  const commonNames = {
    'محمد': 'Mohammed', 'أحمد': 'Ahmed', 'علي': 'Ali', 'عبدالله': 'Abdullah', 'عبد الله': 'Abdullah',
    'عبدالرحمن': 'Abdulrahman', 'عبد الرحمن': 'Abdulrahman', 'عبدالعزيز': 'Abdulaziz', 'عبد العزيز': 'Abdulaziz',
    'عبدالملك': 'Abdulmalik', 'عبد الملك': 'Abdulmalik', 'عبدالرحيم': 'Abdulrahim', 'عبد الرحيم': 'Abdulrahim',
    'فهد': 'Fahad', 'سعود': 'Saud', 'خالد': 'Khalid', 'سلطان': 'Sultan', 'تركي': 'Turki',
    'سعد': 'Saad', 'نايف': 'Naif', 'بندر': 'Bandar', 'فيصل': 'Faisal', 'سلمان': 'Salman',
    'ناصر': 'Nasser', 'صالح': 'Saleh', 'يوسف': 'Yousef', 'إبراهيم': 'Ibrahim', 'ابراهيم': 'Ibrahim',
    'حسن': 'Hassan', 'حسين': 'Hussein', 'عمر': 'Omar', 'عثمان': 'Othman', 'طلال': 'Talal',
    'ماجد': 'Majed', 'وليد': 'Waleed', 'مشعل': 'Mishal', 'منصور': 'Mansour', 'سارة': 'Sarah',
    'نورة': 'Noura', 'فاطمة': 'Fatimah', 'عائشة': 'Aisha', 'مريم': 'Mariam', 'هند': 'Hind',
    'لطيفة': 'Latifah', 'منيرة': 'Munirah', 'هيا': 'Haya', 'لمياء': 'Lamia', 'ريم': 'Reem',
    'دانة': 'Dana', 'لين': 'Leen', 'جواهر': 'Jawaher', 'بدور': 'Badoor', 'العنزي': 'Al-Anzi',
    'الشمري': 'Al-Shammari', 'الحربي': 'Al-Harbi', 'القحطاني': 'Al-Qahtani', 'الغامدي': 'Al-Ghamdi',
    'الدوسري': 'Al-Dosari', 'المطيري': 'Al-Mutairi', 'الزهراني': 'Al-Zahrani', 'العتيبي': 'Al-Otaibi',
    'السبيعي': 'Al-Subaie', 'الرشيدي': 'Al-Rashidi', 'البلوي': 'Al-Balawi', 'الجهني': 'Al-Juhani',
    'السعدي': 'Al-Saadi', 'المالكي': 'Al-Malki'
  };
  const arToEn = {
    'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'aa', 'ب': 'b', 'ت': 't', 'ث': 'th',
    'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
    'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'dh',
    'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
    'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'ah', 'ى': 'a',
    'ء': "'", 'ؤ': 'o', 'ئ': 'e', 'ّ': '', 'َ': 'a', 'ُ': 'u', 'ِ': 'i', 'ْ': '', 'ً': '', 'ٌ': '', 'ٍ': ''
  };
  document.getElementById('rNameAr').addEventListener('input', (e) => {
    const words = e.target.value.trim().split(/\s+/);
    const result = words.map(word => {
      // Check common names first
      if (commonNames[word]) return commonNames[word];
      // Handle ال prefix
      let prefix = '';
      let w = word;
      if (w.startsWith('ال') && w.length > 2) {
        prefix = 'Al-';
        w = w.substring(2);
      }
      let trans = '';
      for (let i = 0; i < w.length; i++) {
        const ch = w[i];
        if (arToEn[ch] !== undefined) {
          trans += arToEn[ch];
        } else if (ch.match(/[a-zA-Z0-9]/)) {
          trans += ch;
        }
      }
      if (trans.length > 0) {
        trans = trans.charAt(0).toUpperCase() + trans.slice(1);
      }
      return prefix + trans;
    }).filter(w => w.length > 0).join(' ');
    document.getElementById('rNameEn').value = result;
  });

  // Date conversion helpers
  const gToH = (g) => {
    try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(g).replace(/هـ/g, '').trim(); } catch (e) { return ''; }
  };
  const hToG = (hY, hM, hD) => {
    // Proper Hijri to Gregorian conversion using tabular Islamic calendar
    const a = Math.floor((11 * hY + 3) / 30);
    const b = Math.floor(hY / 100);
    const c = Math.floor(hY - 100 * b);
    const d = Math.floor(b / 4);
    const e1 = Math.floor((8 * (b + 1)) / 25) - 1;
    // Calculate Julian Day Number from Hijri date
    const jd = Math.floor(29.5001 * (hM - 1 + 12 * (hY - 1))) + hD + 1948439.5 - Math.floor((3 * (Math.floor((hY - 1) / 100) + 1)) / 4) + Math.floor((hY - 1) / 100) - Math.floor((hY - 1) / 400);
    // Simpler and more reliable method: iterate from a known epoch
    // Hijri epoch: July 16, 622 CE (Julian) = July 19, 622 CE (Gregorian)
    const hijriEpoch = 1948439.5; // Julian Day for 1/1/1 Hijri
    const monthDays = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
    // Leap year adds 1 day to month 12
    const isLeapYear = (y) => (11 * y + 14) % 30 < 11;
    let totalDays = 0;
    for (let y = 1; y < hY; y++) {
      totalDays += isLeapYear(y) ? 355 : 354;
    }
    for (let m = 1; m < hM; m++) {
      totalDays += monthDays[m - 1];
    }
    if (hM === 12 && isLeapYear(hY)) totalDays += 0; // already counted
    totalDays += hD - 1;
    // Hijri epoch in JavaScript Date: July 19, 622 CE
    const epochMs = new Date(622, 6, 19).getTime();
    const gDate = new Date(epochMs + totalDays * 86400000);
    // Fix JS Date quirk for years < 100
    if (gDate.getFullYear() < 100) gDate.setFullYear(gDate.getFullYear());
    const age = Math.abs(new Date(Date.now() - gDate.getTime()).getUTCFullYear() - 1970);
    const y = gDate.getFullYear();
    const m = String(gDate.getMonth() + 1).padStart(2, '0');
    const day = String(gDate.getDate()).padStart(2, '0');
    return { gDate: `${y}-${m}-${day}`, age };
  };

  // Gregorian dropdowns -> convert to Hijri
  const gregChange = () => {
    const gY = parseInt(document.getElementById('rGregYear').value);
    const gM = parseInt(document.getElementById('rGregMonth').value);
    const gD = parseInt(document.getElementById('rGregDay').value);
    if (!gY || !gM || !gD) return;
    const dob = new Date(gY, gM - 1, gD);
    const diff = Date.now() - dob.getTime();
    document.getElementById('rAge').value = Math.abs(new Date(diff).getUTCFullYear() - 1970);
    const hStr = gToH(dob);
    if (hStr) {
      const parts = hStr.replace(/[^0-9/]/g, '').split('/');
      if (parts.length === 3) {
        document.getElementById('rHijriDay').value = parseInt(parts[0]);
        document.getElementById('rHijriMonth').value = parseInt(parts[1]);
        document.getElementById('rHijriYear').value = parseInt(parts[2]);
      }
    }
  };
  document.getElementById('rGregYear').addEventListener('change', gregChange);
  document.getElementById('rGregMonth').addEventListener('change', gregChange);
  document.getElementById('rGregDay').addEventListener('change', gregChange);

  // Hijri dropdowns -> convert to Gregorian
  const hijriChange = () => {
    const hY = parseInt(document.getElementById('rHijriYear').value);
    const hM = parseInt(document.getElementById('rHijriMonth').value);
    const hD = parseInt(document.getElementById('rHijriDay').value);
    if (!hY || !hM || !hD) return;
    const res = hToG(hY, hM, hD);
    // Populate Gregorian dropdowns
    const gd = new Date(res.gDate);
    document.getElementById('rGregDay').value = gd.getDate();
    document.getElementById('rGregMonth').value = gd.getMonth() + 1;
    document.getElementById('rGregYear').value = gd.getFullYear();
    document.getElementById('rAge').value = res.age;
  };
  document.getElementById('rHijriYear').addEventListener('change', hijriChange);
  document.getElementById('rHijriMonth').addEventListener('change', hijriChange);
  document.getElementById('rHijriDay').addEventListener('change', hijriChange);

  document.getElementById('rSaveBtn').addEventListener('click', async () => {
    const nameAr = document.getElementById('rNameAr').value.trim();
    const nameEn = document.getElementById('rNameEn').value.trim();
    if (!nameAr && !nameEn) { showToast(tr('Enter patient name', 'ادخل اسم المريض'), 'error'); return; }
    try {
      await API.post('/api/patients', {
        name_ar: nameAr, name_en: nameEn,
        national_id: document.getElementById('rNatId').value,
        nationality: document.getElementById('rNationality').value,
        gender: document.getElementById('rGender').value,
        phone: document.getElementById('rPhone').value,
        blood_type: document.getElementById('rBloodType').value,
        allergies: document.getElementById('rAllergies').value,
        chronic_diseases: document.getElementById('rChronicDiseases').value,
        emergency_contact_name: document.getElementById('rEmergencyName').value,
        emergency_contact_phone: document.getElementById('rEmergencyPhone').value,
        address: document.getElementById('rAddress').value,
        insurance_company: document.getElementById('rInsuranceCompany').value,
        insurance_policy_number: document.getElementById('rInsurancePolicyNo').value,
        insurance_class: document.getElementById('rInsuranceClass').value,
        dob: (document.getElementById('rGregYear').value && document.getElementById('rGregMonth').value && document.getElementById('rGregDay').value) ? `${document.getElementById('rGregYear').value}-${String(document.getElementById('rGregMonth').value).padStart(2, '0')}-${String(document.getElementById('rGregDay').value).padStart(2, '0')}` : '',
        dob_hijri: (document.getElementById('rHijriYear').value && document.getElementById('rHijriMonth').value && document.getElementById('rHijriDay').value) ? `${document.getElementById('rHijriYear').value}/${String(document.getElementById('rHijriMonth').value).padStart(2, '0')}/${String(document.getElementById('rHijriDay').value).padStart(2, '0')}` : ''
      });
      showToast(tr('Patient saved!', 'تم حفظ المريض!'));
      await navigateTo(1);
    } catch (e) { showToast(tr('Error saving patient', 'خطأ في حفظ المريض'), 'error'); }
  });

  document.getElementById('rSearch').addEventListener('input', (e) => {
    const txt = e.target.value.toLowerCase();
    document.querySelectorAll('#rTable tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(txt) ? '' : 'none';
    });
  });
}

function renderPatientTable(patients) {
  const headers = [tr('MRN/File#', 'رقم الملف'), tr('Name', 'الاسم'), tr('ID', 'الهوية'), tr('Phone', 'الجوال'), tr('Blood', 'فصيلة'), tr('Insurance', 'التأمين'), tr('Date/Time', 'التاريخ/الوقت'), tr('Status', 'الحالة'), tr('Actions', 'إجراءات')];
  const rows = patients.map(p => ({
    cells: [
      p.mrn || p.file_number,
      `${p.gender === 'ذكر' ? '👨' : '👩'} ${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)}${p.allergies ? ' <span style="color:#ef4444;font-weight:700" title="' + p.allergies + '">⚠️</span>' : ''}`,
      p.national_id,
      p.phone,
      p.blood_type ? `<span class="badge" style="background:#dc2626;color:#fff;font-size:10px">${p.blood_type}</span>` : '-',
      p.insurance_company ? `<span style="font-size:11px">${p.insurance_company}${p.insurance_class ? ' (' + p.insurance_class + ')' : ''}</span>` : '-',
      p.created_at ? new Date(p.created_at).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }) : '-',
      statusBadge(p.status)
    ],
    id: p.id, raw: p
  }));
  document.getElementById('rTable').innerHTML = makeTable(headers, rows, (row) =>
    `<button class="btn btn-sm" onclick="editPatient(${row.id})" title="${tr('Edit', 'تعديل')}">✏️</button> <button class="btn btn-sm btn-success" onclick="showNewInvoiceModal(${row.id},'${(row.raw.name_ar || row.raw.name_en || '').replace(/'/g, "\\'")}')" title="${tr('Invoice', 'فاتورة')}">🧾</button> <button class="btn btn-danger btn-sm" onclick="deletePatient(${row.id})" title="${tr('Delete', 'حذف')}">🗑</button>`
  );
}

window.deletePatient = async (id) => {
  if (!confirm(tr('Delete this patient and all records?', 'حذف هذا المريض وجميع سجلاته؟'))) return;
  try {
    await API.del(`/api/patients/${id}`);
    showToast(tr('Patient deleted', 'تم حذف المريض'));
    await navigateTo(1);
  } catch (e) { showToast(tr('Error deleting', 'خطأ في الحذف'), 'error'); }
};

window.editPatient = async function (id) {
  try {
    const patients = await API.get('/api/patients');
    const p = patients.find(x => x.id === id);
    if (!p) return showToast(tr('Patient not found', 'المريض غير موجود'), 'error');
    document.getElementById('editPId').value = id;
    document.getElementById('editPNameAr').value = p.name_ar || '';
    document.getElementById('editPNameEn').value = p.name_en || '';
    document.getElementById('editPNatId').value = p.national_id || '';
    document.getElementById('editPPhone').value = p.phone || '';
    document.getElementById('editPNationality').value = p.nationality || '';
    document.getElementById('editPDob').value = p.dob || '';
    document.getElementById('editPatientModal').style.display = 'flex';
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.saveEditPatient = async function () {
  const id = document.getElementById('editPId').value;
  try {
    await API.put('/api/patients/' + id, {
      name_ar: document.getElementById('editPNameAr').value,
      name_en: document.getElementById('editPNameEn').value,
      national_id: document.getElementById('editPNatId').value,
      phone: document.getElementById('editPPhone').value,
      nationality: document.getElementById('editPNationality').value,
      dob: document.getElementById('editPDob').value
    });
    document.getElementById('editPatientModal').style.display = 'none';
    showToast(tr('Patient updated!', 'تم تحديث بيانات المريض!'));
    await navigateTo(1);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.showNewInvoiceModal = function (id, name) {
  document.getElementById('invPId').value = id;
  document.getElementById('invPName').value = name;
  document.getElementById('invPLabel').textContent = name;
  document.getElementById('invDescription').value = '';
  document.getElementById('invAmount').value = '';
  if (document.getElementById('invDiscount')) document.getElementById('invDiscount').value = '0';
  if (document.getElementById('invDiscountReason')) document.getElementById('invDiscountReason').value = '';
  document.getElementById('newInvoiceModal').style.display = 'flex';
};
window.confirmNewInvoice = async function () {
  const id = document.getElementById('invPId').value;
  const name = document.getElementById('invPName').value;
  const amount = parseFloat(document.getElementById('invAmount').value);
  const serviceType = document.getElementById('invServiceType').value;
  const discount = parseFloat(document.getElementById('invDiscount')?.value) || 0;
  const discountReason = document.getElementById('invDiscountReason')?.value || '';
  if (!amount || amount <= 0) return showToast(tr('Enter amount', 'ادخل المبلغ'), 'error');
  if (discount > amount) return showToast(tr('Discount cannot exceed amount', 'الخصم لا يمكن أن يتجاوز المبلغ'), 'error');
  try {
    let desc = document.getElementById('invDescription').value;
    if (serviceType === 'كشف') {
      const dept = document.getElementById('invDept').value;
      const doctor = document.getElementById('invDoctor').value;
      const parts = [dept, doctor, desc].filter(x => x);
      desc = parts.join(' - ');
      await API.put('/api/patients/' + id, { department: dept });
    }
    const finalAmount = amount - discount;
    await API.post('/api/invoices', {
      patient_id: id, patient_name: name,
      total: finalAmount,
      description: desc + (discount > 0 ? ' (خصم: ' + discount + ' SAR' + (discountReason ? ' - ' + discountReason : '') + ')' : ''),
      service_type: serviceType,
      payment_method: document.getElementById('invPayMethod').value,
      discount: discount,
      discount_reason: discountReason
    });
    document.getElementById('newInvoiceModal').style.display = 'none';
    showToast(tr('Invoice created!', 'تم إنشاء الفاتورة!') + (discount > 0 ? ' (' + tr('Discount', 'خصم') + ': ' + discount + ')' : ''));
    await navigateTo(1);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== APPOINTMENTS =====
async function renderAppointments(el) {
  const [appts, emps] = await Promise.all([API.get('/api/appointments'), API.get('/api/employees?role=Doctor')]);
  const patients = await API.get('/api/patients');
  el.innerHTML = `
    <div class="page-title">📅 ${tr('Appointments', 'المواعيد')}</div>
    <div class="split-layout">
      <div class="card">
        <div class="card-title">📝 ${tr('Book Appointment', 'حجز موعد')}</div>
        <div class="form-group mb-12"><label>${tr('Patient', 'المريض')}</label><select class="form-input" id="aPatient"><option value="">${tr('Select patient', 'اختر مريض')}</option>${patients.map(p => `<option value="${p.name_en}" data-pid="${p.id}">${isArabic ? p.name_ar : p.name_en} (#${p.file_number})</option>`).join('')}</select></div>
        <div class="form-group mb-12"><label>${tr('Doctor', 'الطبيب')}</label><select class="form-input" id="aDoctor"><option value="">${tr('Select doctor', 'اختر طبيب')}</option>${emps.map(d => `<option>${d.name}</option>`).join('')}</select></div>
        <div class="form-group mb-12"><label>${tr('Date', 'التاريخ')}</label><input class="form-input" type="date" id="aDate" value="${new Date().toISOString().split('T')[0]}"></div>
        <div class="form-group mb-12"><label>${tr('Time', 'الوقت')}</label><input class="form-input" type="time" id="aTime" value="${new Date().toTimeString().slice(0, 5)}"></div>
        <div class="form-group mb-12"><label>${tr('Notes', 'ملاحظات')}</label><input class="form-input" id="aNotes"></div>
        <div class="form-group mb-16"><label>${tr('Appointment Fee', 'رسوم الموعد')}</label><input class="form-input" id="aFee" type="number" value="0" placeholder="0.00"></div>
        <button class="btn btn-primary w-full" onclick="bookAppt()" style="height:44px">📅 ${tr('Book', 'حجز')}</button>
      </div>
      <div class="card">
        <div class="card-title">📋 ${tr('Appointments List', 'قائمة المواعيد')}</div>
        <input class="search-filter" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'aTable')">
        <div id="aTable">${makeTable(
    [tr('Patient', 'المريض'), tr('Doctor', 'الطبيب'), tr('Dept', 'القسم'), tr('Date', 'التاريخ'), tr('Time', 'الوقت'), tr('Status', 'الحالة'), tr('Delete', 'حذف')],
    appts.map(a => ({ cells: [a.patient_name, a.doctor_name, a.department, a.appt_date, a.appt_time, statusBadge(a.status)], id: a.id })),
    (row) => `<button class="btn btn-danger btn-sm" onclick="delAppt(${row.id})">🗑</button>`
  )}</div>
      </div>
    </div>`;
}
window.bookAppt = async () => {
  const pSelect = document.getElementById('aPatient');
  const pName = pSelect.value;
  const pId = pSelect.options[pSelect.selectedIndex]?.dataset?.pid || '';
  if (!pName) { showToast(tr('Select patient', 'اختر مريض'), 'error'); return; }
  try {
    await API.post('/api/appointments', { patient_name: pName, patient_id: pId, doctor_name: document.getElementById('aDoctor').value, department: '', appt_date: document.getElementById('aDate').value, appt_time: document.getElementById('aTime').value, notes: document.getElementById('aNotes').value, fee: parseFloat(document.getElementById('aFee').value) || 0 });
    showToast(tr('Appointment booked!', 'تم حجز الموعد!'));
    await navigateTo(2);
  } catch (e) { showToast(tr('Error booking', 'خطأ في الحجز'), 'error'); }
};
window.delAppt = async (id) => {
  if (!confirm(tr('Delete this appointment?', 'حذف هذا الموعد؟'))) return;
  try { await API.del(`/api/appointments/${id}`); showToast(tr('Deleted', 'تم الحذف')); await navigateTo(2); }
  catch (e) { showToast(tr('Error deleting', 'خطأ في الحذف'), 'error'); }
};
window.filterTable = (input, tableId) => {
  const txt = input.value.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(r => r.style.display = r.textContent.toLowerCase().includes(txt) ? '' : 'none');
};

// ===== DOCTOR STATION =====
async function renderDoctor(el) {
  const patients = await API.get('/api/patients');
  const records = await API.get('/api/medical/records');
  const drugs = await API.get('/api/pharmacy/drugs');
  const allServices = await API.get('/api/medical/services');
  // Get current user specialty
  const currentUser = await API.get('/api/auth/me');
  const drSpecialty = (currentUser.user && currentUser.user.speciality) || '';
  const filteredServices = drSpecialty ? allServices.filter(s => s.specialty === drSpecialty) : allServices;
  // Group services by category for display
  const svcCategories = {};
  filteredServices.forEach(s => { if (!svcCategories[s.category]) svcCategories[s.category] = []; svcCategories[s.category].push(s); });
  el.innerHTML = `
    <div class="page-title">👨‍⚕️ ${tr('Doctor Station', 'محطة الطبيب')}</div>
    <div class="split-layout">
      <div>
        <div class="card mb-16">
          <div class="card-title">📝 ${tr('Select Patient', 'اختيار المريض')}</div>
          <select class="form-input w-full" id="drPatient" onchange="loadPatientInfo()">
            <option value="">${tr('-- Select --', '-- اختر مريض --')}</option>
            ${patients.map(p => `<option value="${p.id}">${p.file_number} - ${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)} (${statusText(p.status)})</option>`).join('')}
          </select>
          <div id="drPatientInfo" class="mt-16"></div>
        </div>
        <div class="card mb-16">
          <div class="card-title">🩺 ${tr('Diagnosis & Notes', 'التشخيص والملاحظات')}</div>
          <div class="form-group mb-8"><label>📋 ${tr('Quick Diagnosis Template', 'قالب تشخيص سريع')}</label>
            <div class="flex gap-8">
              <select class="form-input" id="drDiagTemplate" style="flex:1" onchange="applyDiagTemplate()">
                <option value="">${tr('-- Select Template --', '-- اختر قالب --')}</option>
              </select>
              <button class="btn btn-sm" onclick="loadDiagTemplates()" style="white-space:nowrap">📥 ${tr('Load', 'تحميل')}</button>
            </div>
          </div>
          <div class="form-group mb-12"><label>${tr('Diagnosis', 'التشخيص')}</label><input class="form-input" id="drDiag"></div>
          <div class="form-group mb-12"><label>${tr('Symptoms', 'الأعراض')}</label><input class="form-input" id="drSymp"></div>
          <div class="form-group mb-12"><label>${tr('ICD-10', 'رمز التشخيص')}</label><input class="form-input" id="drIcd"></div>
          <div class="form-group mb-16"><label>${tr('Notes', 'ملاحظات')}</label><textarea class="form-input form-textarea" id="drNotes"></textarea></div>
          <button class="btn btn-primary w-full" onclick="saveMedRecord()" style="height:44px">💾 ${tr('Save Record', 'حفظ السجل')}</button>
        </div>
          <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
            <button class="btn btn-sm" onclick="showMedicalReportForm('sick_leave')" style="flex:1;background:#fff3e0;border:1px solid #ff9800;color:#e65100;min-width:120px">🏥 ${tr('Sick Leave','إجازة مرضية')}</button>
            <button class="btn btn-sm" onclick="showMedicalReportForm('medical_report')" style="flex:1;background:#e3f2fd;border:1px solid #1565c0;color:#1565c0;min-width:120px">📋 ${tr('Med Report','تقرير طبي')}</button>
            <button class="btn btn-sm" onclick="showMedicalReportForm('fitness')" style="flex:1;background:#e8f5e9;border:1px solid #2e7d32;color:#2e7d32;min-width:120px">✅ ${tr('Fitness','شهادة لياقة')}</button>
          </div>
        <div class="card mb-16">
          <div class="card-title">🏥 ${tr('Procedures / Services Performed', 'الإجراءات / الخدمات المنفذة')} ${drSpecialty ? `<span class="badge badge-info" style="font-size:11px;
margin-right:8px">${drSpecialty}</span>` : ''}</div>
          <div class="form-group mb-12"><label>${tr('Search Procedures', 'ابحث عن إجراء')}</label>
            <input class="form-input" id="drSvcSearch" placeholder="${tr('Type to search...', 'اكتب للبحث...')}" autocomplete="off" oninput="filterDrServices()">
            <div id="drSvcDropdown" style="max-height:200px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;display:none;margin-top:4px;background:var(--card)"></div>
          </div>
          <div id="drSvcTags" class="flex gap-8" style="flex-wrap:wrap;margin-bottom:12px"></div>
          <div style="font-size:12px;color:var(--text-dim);margin-bottom:8px">${tr('Available categories', 'التصنيفات المتاحة')}: <strong>${Object.keys(svcCategories).join(', ') || tr('All', 'الكل')}</strong></div>
          <button class="btn btn-success w-full" onclick="billDrProcedures()" id="drBillBtn" style="height:40px;margin-top:8px">💵 ${tr('Bill Selected Procedures', 'فوتر الإجراءات المختارة')}</button>
          <input type="hidden" id="drSvcData" value='${JSON.stringify(filteredServices)}'>
        </div>
        <div class="card mb-16">
          <div class="form-group mb-12"><label>${tr('Test Type', 'نوع الفحص')}</label>
            <select class="form-input" id="drLabType">
              <optgroup label="${tr('Hematology', 'أمراض الدم')}">
                <option>CBC (Complete Blood Count)</option>
                <option>ESR (Erythrocyte Sedimentation Rate)</option>
                <option>Coagulation Profile (PT, PTT, INR)</option>
                <option>Blood Film / Reticulocyte Count</option>
                <option>Hemoglobin Electrophoresis</option>
                <option>G6PD Deficiency Test</option>
                <option>Sickle Cell Test</option>
                <option>Bleeding Time / Clotting Time</option>
                <option>D-Dimer</option>
              </optgroup>
              <optgroup label="${tr('Biochemistry', 'الكيمياء الحيوية')}">
                <option>Comprehensive Metabolic Panel (CMP)</option>
                <option>Basic Metabolic Panel (BMP)</option>
                <option>Fasting Blood Sugar (FBS)</option>
                <option>Random Blood Sugar (RBS)</option>
                <option>Oral Glucose Tolerance Test (OGTT)</option>
                <option>HbA1c (Glycated Hemoglobin)</option>
                <option>Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)</option>
                <option>Renal Profile (Urea, Creatinine, Electrolytes: Na, K, Cl)</option>
                <option>Liver Function Test (LFT: ALT, AST, ALP, Total/Direct Bilirubin, Albumin, Total Protein)</option>
                <option>Cardiac Enzymes (Troponin T/I, CK-MB, CK-Total, LDH)</option>
                <option>Uric Acid</option>
                <option>Calcium / Phosphorus / Magnesium</option>
                <option>Iron Profile (Serum Iron, TIBC, Ferritin, Transferrin)</option>
                <option>Vitamin D3 (25-OH Cholecalciferol)</option>
                <option>Vitamin B12 / Folate</option>
                <option>Amylase / Lipase</option>
                <option>Serum Osmolality</option>
              </optgroup>
              <optgroup label="${tr('Hormones & Endocrinology', 'الهرمونات والغدد')}">
                <option>Thyroid Profile (TSH, Free T3, Free T4, Total T3, Total T4)</option>
                <option>Fertility Hormones (FSH, LH, Prolactin, Testosterone (Free/Total), Estradiol E2, Progesterone)</option>
                <option>Beta-hCG (Pregnancy Test - Blood Qualitative/Quantitative)</option>
                <option>Cortisol (AM/PM)</option>
                <option>Insulin (Fasting/Random)</option>
                <option>Parathyroid Hormone (PTH)</option>
                <option>Growth Hormone (GH)</option>
                <option>ACTH</option>
                <option>C-Peptide</option>
                <option>Anti-Mullerian Hormone (AMH)</option>
                <option>Aldosterone / Renin</option>
                <option>DHEA-S (Dehydroepiandrosterone Sulfate)</option>
                <option>17-OH Progesterone</option>
                <option>Calcitonin</option>
              </optgroup>
              <optgroup label="${tr('Immunology & Serology', 'المناعة والأمصال')}">
                <option>CRP (C-Reactive Protein - Qualitative/Quantitative)</option>
                <option>Rheumatoid Factor (RF)</option>
                <option>Anti-CCP (Anti-Cyclic Citrullinated Peptide)</option>
                <option>ANA (Anti-Nuclear Antibody) / Anti-dsDNA</option>
                <option>ANCA (Anti-Neutrophil Cytoplasmic Antibody)</option>
                <option>Anti-Scl-70 / Anti-Centromere</option>
                <option>ASO Titer</option>
                <option>Hepatitis Profile (HBsAg, HBsAb, HCV Ab, HAV IgM/IgG)</option>
                <option>HIV 1 & 2 Abs/Ag</option>
                <option>VDRL / RPR (Syphilis)</option>
                <option>Widal Test (Typhoid)</option>
                <option>Brucella (Abortus/Melitensis)</option>
                <option>Dengue NS1 Ag / IgM / IgG</option>
                <option>Toxoplasmosis (IgG/IgM)</option>
                <option>Rubella (IgG/IgM)</option>
                <option>Cytomegalovirus CMV (IgG/IgM)</option>
                <option>Herpes Simplex Virus HSV 1/2 (IgG/IgM)</option>
                <option>EBV (Epstein-Barr Virus)</option>
                <option>Celiac Disease Panel (Anti-tTG, Anti-Endomysial)</option>
                <option>Food Allergy Panel (IgE)</option>
                <option>Inhalant Allergy Panel (IgE)</option>
                <option>Flow Cytometry (Immunophenotyping / CD4 Count)</option>
              </optgroup>
              <optgroup label="${tr('Microbiology & Parasitology', 'الأحياء الدقيقة والطفيليات')}">
                <option>Urine Analysis (Routine & Microscopic)</option>
                <option>Urine Culture & Sensitivity</option>
                <option>Stool Analysis (Routine & Microscopic)</option>
                <option>Stool Culture</option>
                <option>Stool Occult Blood</option>
                <option>H. Pylori (Ag in Stool / Ab in Blood)</option>
                <option>Throat Swab Culture</option>
                <option>Sputum Culture & AFB (Tuberculosis)</option>
                <option>Wound/Pus Swab Culture</option>
                <option>Blood Culture (Aerobic/Anaerobic)</option>
                <option>Ear/Eye/Nasal Swab Culture</option>
                <option>High Vaginal Swab (HVS) Culture</option>
                <option>Urethral Swab Culture</option>
                <option>Fungal Culture (Skin/Nail/Hair)</option>
                <option>Malaria Film</option>
                <option>QuantiFERON-TB Gold / TB Spot</option>
                <option>Chlamydia trachomatis (PCR/Ag)</option>
                <option>Neisseria Gonorrhoeae (PCR/Culture)</option>
                <option>CSF Analysis (Cell Count, Protein, Glucose)</option>
                <option>Synovial Fluid Analysis</option>
                <option>Semen Analysis (Spermogram)</option>
              </optgroup>
              <optgroup label="${tr('Tumor Markers', 'دلالات الأورام')}">
                <option>PSA (Prostate Specific Antigen - Total/Free)</option>
                <option>CEA (Carcinoembryonic Antigen)</option>
                <option>CA 125 (Ovarian)</option>
                <option>CA 15-3 (Breast)</option>
                <option>CA 19-9 (Pancreatic/GI)</option>
                <option>AFP (Alpha-Fetoprotein)</option>
                <option>Beta-2 Microglobulin</option>
                <option>Thyroglobulin</option>
              </optgroup>
              <optgroup label="${tr('Molecular Diagnostics / PCR', 'التشخيص الجزيئي / PCR')}">
                <option>COVID-19 PCR</option>
                <option>HCV RNA PCR (Quantitative)</option>
                <option>HBV DNA PCR (Quantitative)</option>
                <option>HIV RNA PCR (Quantitative)</option>
                <option>Respiratory Pathogen Panel (PCR)</option>
                <option>HPV DNA Typing</option>
              </optgroup>
              <optgroup label="${tr('Histopathology / Cytology', 'علم الأنسجة والخلايا')}">
                <option>Pap Smear</option>
                <option>Biopsy Specimen Examination</option>
                <option>FNAC (Fine Needle Aspiration Cytology)</option>
                <option>Fluid Cytology (Pleural, Ascitic, CSF)</option>
              </optgroup>
              <optgroup label="${tr('Blood Bank / Transfusion', 'بنك الدم / نقل الدم')}">
                <option>Blood Group (ABO) & Rh Typing</option>
                <option>Crossmatch (Major & Minor)</option>
                <option>Direct Coombs Test (DAT)</option>
                <option>Indirect Coombs Test (IAT)</option>
                <option>Antibody Screening Panel</option>
                <option>Cold Agglutinins</option>
              </optgroup>
              <optgroup label="${tr('Blood Gas & Electrolytes', 'غازات الدم والشوارد')}">
                <option>Arterial Blood Gas (ABG)</option>
                <option>Venous Blood Gas (VBG)</option>
                <option>Lactate (Lactic Acid)</option>
                <option>Ionized Calcium</option>
                <option>Methemoglobin / Carboxyhemoglobin</option>
              </optgroup>
              <optgroup label="${tr('Therapeutic Drug Monitoring', 'مراقبة مستوى الأدوية')}">
                <option>Digoxin Level</option>
                <option>Phenytoin (Dilantin) Level</option>
                <option>Valproic Acid Level</option>
                <option>Carbamazepine Level</option>
                <option>Lithium Level</option>
                <option>Vancomycin Level (Trough/Peak)</option>
                <option>Gentamicin / Amikacin Level</option>
                <option>Theophylline Level</option>
                <option>Methotrexate Level</option>
                <option>Tacrolimus / Cyclosporine Level</option>
              </optgroup>
              <optgroup label="${tr('Special Chemistry', 'كيمياء متخصصة')}">
                <option>Protein Electrophoresis (SPEP)</option>
                <option>Immunoglobulins (IgA, IgG, IgM, IgE)</option>
                <option>Complement C3 / C4</option>
                <option>Ammonia Level</option>
                <option>Homocysteine</option>
                <option>Ceruloplasmin / Copper</option>
                <option>Lactate Dehydrogenase (LDH)</option>
                <option>Haptoglobin</option>
                <option>Procalcitonin (PCT)</option>
                <option>BNP / NT-proBNP</option>
                <option>Fibrinogen</option>
                <option>Anti-Xa (Heparin) Assay</option>
                <option>Cystatin C</option>
                <option>Microalbumin (Urine)</option>
                <option>24hr Urine Protein / Creatinine Clearance</option>
                <option>Serum Free Light Chains (Kappa/Lambda)</option>
              </optgroup>
              <optgroup label="${tr('Toxicology & Trace Elements', 'السموم والعناصر الدقيقة')}">
                <option>Myoglobin</option>
                <option>Vitamin A (Retinol)</option>
                <option>Zinc Level</option>
                <option>Selenium Level</option>
                <option>Lead Level (Blood)</option>
                <option>Mercury Level (Blood)</option>
                <option>Urine Drug Screen (UDS)</option>
                <option>Serum Ethanol (Alcohol) Level</option>
                <option>Acetaminophen (Paracetamol) Level</option>
                <option>Salicylate (Aspirin) Level</option>
              </optgroup>
              <optgroup label="${tr('Other', 'أخرى')}">
                <option>${tr('Other Specific Test (Specify in details)', 'فحص آخر (حدد في التفاصيل)')}</option>
              </optgroup>
            </select>
          </div>
          <div class="form-group mb-12"><label>${tr('Details', 'التفاصيل')}</label><input class="form-input" id="drLabDesc"></div>
          <button class="btn btn-success w-full" onclick="sendToLab()">🔬 ${tr('Send to Lab', 'تحويل للمختبر')}</button>
        </div>
        <div class="card mb-16">
          <div class="card-title">📡 ${tr('Refer to Radiology', 'تحويل للأشعة')}</div>
          <div class="form-group mb-12"><label>${tr('Scan Type', 'نوع الأشعة')}</label>
            <select class="form-input" id="drRadType">
              <optgroup label="${tr('X-Ray', 'الأشعة السينية')}">
                <option>X-Ray Chest (PA/LAT)</option>
                <option>X-Ray Abdomen (Erect/Supine)</option>
                <option>X-Ray KUB (Kidney, Ureter, Bladder)</option>
                <option>X-Ray Cervical Spine (AP/LAT/Open Mouth)</option>
                <option>X-Ray Thoracic Spine</option>
                <option>X-Ray Lumbar Spine (AP/LAT)</option>
                <option>X-Ray Pelvis (AP)</option>
                <option>X-Ray Skull / Facial Bones / PNS</option>
                <option>X-Ray Shoulder / Clavicle</option>
                <option>X-Ray Arm (Humerus/Radius/Ulna)</option>
                <option>X-Ray Hand / Wrist</option>
                <option>X-Ray Hip/Femur</option>
                <option>X-Ray Knee (AP/LAT/Skyline)</option>
                <option>X-Ray Ankle / Foot</option>
                <option>X-Ray Bone Age</option>
              </optgroup>
              <optgroup label="${tr('Ultrasound', 'الموجات فوق الصوتية / السونار')}">
                <option>Ultrasound Abdomen (Whole)</option>
                <option>Ultrasound Pelvis (Transabdominal/Transvaginal)</option>
                <option>Ultrasound Abdomen & Pelvis</option>
                <option>Ultrasound KUB / Prostate</option>
                <option>Ultrasound Thyroid / Neck</option>
                <option>Ultrasound Breast</option>
                <option>Ultrasound Scrotum / Testicular</option>
                <option>Obstetric Ultrasound (1st Trimester/Viability)</option>
                <option>Obstetric Ultrasound (Anomaly Scan 2nd Trimester)</option>
                <option>Obstetric Ultrasound (Growth 3rd Trimester)</option>
                <option>Folliculometry (Ovulation Tracking)</option>
                <option>Ultrasound Soft Tissue / Swelling</option>
                <option>Doppler Ultrasound - Carotid</option>
                <option>Doppler Ultrasound - Lower Limb Venous (DVT)</option>
                <option>Doppler Ultrasound - Lower Limb Arterial</option>
                <option>Doppler Ultrasound - Renal Artery</option>
                <option>Doppler Ultrasound - Obstetrics / Umbilical Artery</option>
                <option>Echocardiogram (Echo - Heart)</option>
              </optgroup>
              <optgroup label="${tr('CT Scan', 'الأشعة المقطعية')}">
                <option>CT Brain / Head (Without Contrast)</option>
                <option>CT Brain / Head (With Contrast)</option>
                <option>CT PNS (Paranasal Sinuses)</option>
                <option>CT Neck (With Contrast)</option>
                <option>CT Chest (HRCT) Without Contrast</option>
                <option>CT Chest / Lungs (With Contrast)</option>
                <option>CT Abdomen & Pelvis (Without Contrast - Triphasic)</option>
                <option>CT Abdomen & Pelvis (With Contrast)</option>
                <option>CT KUB (Stone Protocol - Non Contrast)</option>
                <option>CT Urography (With Contrast)</option>
                <option>CT Cervical Spine</option>
                <option>CT Lumbar Spine</option>
                <option>CT Angiography - Pulmonary (CTPA)</option>
                <option>CT Angiography - Brain</option>
                <option>CT Angiography - Aorta / Lower Limbs</option>
                <option>CT Virtual Colonoscopy</option>
              </optgroup>
              <optgroup label="${tr('MRI', 'الرنين المغناطيسي')}">
                <option>MRI Brain (Without Contrast)</option>
                <option>MRI Brain (With Contrast)</option>
                <option>MRI Pituitary Fossa</option>
                <option>MRI Cervical Spine</option>
                <option>MRI Thoracic Spine</option>
                <option>MRI Lumbar Spine</option>
                <option>MRI Whole Spine</option>
                <option>MRI Pelvis (Male/Female)</option>
                <option>MRI Prostate (Multiparametric)</option>
                <option>MRI Shoulder Joint</option>
                <option>MRI Knee Joint</option>
                <option>MRI Ankle / Wrist Joint</option>
                <option>MRI Abdomen</option>
                <option>MRCP (Magnetic Resonance Cholangiopancreatography)</option>
                <option>MR Venography (MRV)</option>
                <option>MRA (Magnetic Resonance Angiography) - Brain</option>
              </optgroup>
              <optgroup label="${tr('Specialized Imaging & Scans', 'تصوير متخصص والمناظير')}">
                <option>Mammogram (Bilateral/Unilateral)</option>
                <option>DEXA Scan (Bone Density)</option>
                <option>Fluoroscopy - Barium Swallow</option>
                <option>Fluoroscopy - Barium Meal / Follow Through</option>
                <option>Fluoroscopy - Barium Enema</option>
                <option>Fluoroscopy - HSG (Hysterosalpingography)</option>
                <option>Fluoroscopy - IVP (Intravenous Pyelogram)</option>
                <option>Panoramic Dental X-Ray (OPG)</option>
                <option>Cephalometric X-Ray</option>
                <option>CBCT (Cone Beam CT for Dentistry)</option>
                <option>PET Scan (Positron Emission Tomography)</option>
              </optgroup>
              <optgroup label="${tr('Cardiology & Neuro', 'قلب وأعصاب وأجهزة أخرى')}">
                <option>ECG (Electrocardiogram)</option>
                <option>Holter Monitor (24/48 Hours)</option>
                <option>Ambulatory Blood Pressure Monitoring (ABPM)</option>
                <option>Treadmill Stress Test (TMT)</option>
                <option>EEG (Electroencephalogram)</option>
                <option>EMG (Electromyography) / NCS</option>
                <option>Spirometry / Lung Function Test</option>
                <option>Upper GI Endoscopy (OGD)</option>
                <option>Colonoscopy</option>
              </optgroup>
              <optgroup label="${tr('Other', 'أخرى')}">
                <option>${tr('Other Scan (Specify in details)', 'تصوير آخر (حدد في التفاصيل)')}</option>
              </optgroup>
            </select>
          </div>
          <div class="form-group mb-12"><label>${tr('Details', 'التفاصيل')}</label><input class="form-input" id="drRadDesc"></div>
          <button class="btn btn-success w-full" onclick="sendToRad()">📡 ${tr('Send to Radiology', 'تحويل للأشعة')}</button>
        </div>
        <div class="card mb-16">
          <div class="card-title">💊 ${tr('Write Prescription', 'كتابة وصفة')}</div>
          <div class="form-group mb-12"><label>${tr('Medication', 'الدواء')}</label>
            <input list="drugsDataList" class="form-input" id="drRxDrug" placeholder="${tr('Type to search medication...', 'ابحث عن اسم الدواء...')}" autocomplete="off">
            <datalist id="drugsDataList">
              ${drugs.map(d => `<option value="${d.drug_name}">`).join('')}
              <option value="${tr('Other', 'أخرى')}">
            </datalist>
          </div>
          <div class="flex gap-8 mb-12" style="flex-wrap:wrap">
            <div class="form-group" style="flex:1;min-width:140px"><label>${tr('Dosage', 'الجرعة')}</label><input class="form-input" id="drRxDose" placeholder="${tr('e.g. 500mg', 'مثلاً 500مج')}"></div>
            <div class="form-group" style="flex:0.6;min-width:90px"><label>${tr('Qty/Day', 'الكمية/يوم')}</label><input class="form-input" id="drRxQty" type="number" min="1" value="1"></div>
          </div>
          <div class="flex gap-8 mb-12" style="flex-wrap:wrap">
            <div class="form-group" style="flex:1;min-width:160px"><label>${tr('Frequency', 'التكرار')}</label>
              <select class="form-input" id="drRxFreq"><option>×1 ${tr('daily', 'يومياً')}</option><option>×2 ${tr('daily', 'يومياً')}</option><option>×3 ${tr('daily', 'يومياً')}</option><option>×4 ${tr('daily', 'يومياً')}</option><option>${tr('Every 8 hours', 'كل 8 ساعات')}</option><option>${tr('Every 12 hours', 'كل 12 ساعة')}</option><option>${tr('As needed', 'عند الحاجة')}</option><option>${tr('Before meals', 'قبل الأكل')}</option><option>${tr('After meals', 'بعد الأكل')}</option><option>${tr('Before sleep', 'قبل النوم')}</option></select>
            </div>
            <div class="form-group" style="flex:0.8;min-width:120px"><label>${tr('Duration', 'المدة')}</label><input class="form-input" id="drRxDur" placeholder="${tr('e.g. 7 days', 'مثلاً 7 أيام')}"></div>
          </div>
          <button class="btn btn-primary w-full" onclick="sendRx()">💊 ${tr('Issue Prescription → Pharmacy', 'إصدار وصفة → الصيدلية')}</button>
        </div>
        <div class="card mb-16">
          <div class="card-title">📋 ${tr('Medical Certificate', 'التقارير الطبية')}</div>
          <div class="form-group mb-12"><label>${tr('Certificate Type', 'نوع التقرير')}</label>
            <select class="form-input" id="drCertType">
              <option value="sick_leave">🩺 ${tr('Sick Leave', 'إجازة مرضية')}</option>
              <option value="medical_report">📄 ${tr('Medical Report', 'تقرير طبي')}</option>
              <option value="fitness">✅ ${tr('Fitness Certificate', 'شهادة لياقة')}</option>
            </select>
          </div>
          <div class="form-group mb-12"><label>${tr('Diagnosis/Reason', 'التشخيص/السبب')}</label><input class="form-input" id="drCertDiag"></div>
          <div class="flex gap-8 mb-12">
            <div class="form-group" style="flex:1"><label>${tr('From', 'من')}</label><input class="form-input" type="date" id="drCertFrom" value="${new Date().toISOString().split('T')[0]}"></div>
            <div class="form-group" style="flex:1"><label>${tr('To', 'إلى')}</label><input class="form-input" type="date" id="drCertTo"></div>
            <div class="form-group" style="flex:0.5"><label>${tr('Days', 'أيام')}</label><input class="form-input" type="number" id="drCertDays" value="1" min="1"></div>
          </div>
          <div class="form-group mb-12"><label>${tr('Notes', 'ملاحظات')}</label><input class="form-input" id="drCertNotes"></div>
          <button class="btn btn-primary w-full" onclick="issueCertificate()">📋 ${tr('Issue Certificate', 'إصدار التقرير')}</button>
        </div>
        <div class="card mb-16">
          <div class="card-title">🔄 ${tr('Referral to Department', 'تحويل لقسم آخر')}</div>
          <div class="form-group mb-12"><label>${tr('To Department', 'إلى القسم')}</label>
            <select class="form-input" id="drRefDept">
              <option>الباطنية</option><option>الأطفال</option><option>العظام</option><option>الجلدية</option>
              <option>الأنف والأذن</option><option>العيون</option><option>الأسنان</option><option>النساء والولادة</option>
              <option>المخ والأعصاب</option><option>القلب</option><option>المسالك البولية</option><option>الطوارئ</option><option>الجراحة</option>
            </select>
          </div>
          <div class="form-group mb-12"><label>${tr('Reason', 'السبب')}</label><input class="form-input" id="drRefReason"></div>
          <div class="form-group mb-12"><label>${tr('Urgency', 'الأولوية')}</label>
            <select class="form-input" id="drRefUrg">
              <option value="Normal">🟢 ${tr('Normal', 'عادي')}</option>
              <option value="Urgent">🟠 ${tr('Urgent', 'عاجل')}</option>
              <option value="Emergency">🔴 ${tr('Emergency', 'طارئ')}</option>
            </select>
          </div>
          <button class="btn btn-warning w-full" onclick="sendReferral()">🔄 ${tr('Send Referral', 'إرسال التحويل')}</button>
        </div>
        <div class="card mb-16">
          <div class="card-title">📅 ${tr('Schedule Follow-up', 'جدولة متابعة')}</div>
          <div class="flex gap-8 mb-12">
            <div class="form-group" style="flex:1"><label>${tr('Date', 'التاريخ')}</label><input class="form-input" type="date" id="drFollowDate"></div>
            <div class="form-group" style="flex:1"><label>${tr('Time', 'الوقت')}</label><input class="form-input" type="time" id="drFollowTime" value="09:00"></div>
          </div>
          <div class="form-group mb-12"><label>${tr('Notes', 'ملاحظات')}</label><input class="form-input" id="drFollowNotes"></div>
          <button class="btn btn-info w-full" onclick="scheduleFollowup()">📅 ${tr('Book Follow-up', 'حجز موعد متابعة')}</button>
        </div>
      </div>
      <div class="card">
        <div class="card-title">📋 ${tr('Medical Records', 'السجلات الطبية')}</div>
        <input class="search-filter" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'drTable')">
        <div id="drTable">${makeTable([tr('Patient', 'المريض'), tr('Diagnosis', 'التشخيص'), tr('Symptoms', 'الأعراض'), tr('Date/Time', 'التاريخ/الوقت')], records.map(r => ({ cells: [r.patient_name || '', r.diagnosis, r.symptoms, r.visit_date ? new Date(r.visit_date).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }) : ''] })))}</div>
      </div>
    </div>`;
}
function statusText(s) { return s === 'Waiting' ? tr('Waiting', 'بالانتظار') : s === 'With Doctor' ? tr('With Doctor', 'مع الطبيب') : tr('Done', 'منتهي'); }
window.loadPatientInfo = async () => {
  const pid = document.getElementById('drPatient').value;
  if (!pid) { document.getElementById('drPatientInfo').innerHTML = ''; return; }
  try {
    await API.put(`/api/patients/${pid}`, { status: 'With Doctor' });
    const p = (await API.get('/api/patients')).find(x => x.id == pid);
    const vitals = await API.get(`/api/nursing/vitals/${pid}`).catch(() => []);
    const account = await API.get(`/api/patients/${pid}/account`).catch(() => null);
    const v = vitals.length > 0 ? vitals[0] : null;
    let vitalsHtml = '';
    if (v) {
      vitalsHtml = `<div style="margin-top:12px;padding:12px;border:1px solid var(--border-color,#e5e7eb);border-radius:10px;background:var(--card-bg,#fff)">
        <div style="font-weight:600;margin-bottom:8px;font-size:13px">🌡️ ${tr('Vitals from Nursing', 'العلامات الحيوية من التمريض')} <span style="font-weight:400;font-size:11px;color:var(--text-dim)">${v.created_at ? new Date(v.created_at).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }) : ''}</span></div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;font-size:12px">
          <div style="background:var(--bg-secondary,#f8f9fa);padding:6px;border-radius:6px;text-align:center">🩸 ${tr('BP', 'الضغط')}<br><strong>${v.bp || '-'}</strong></div>
          <div style="background:var(--bg-secondary,#f8f9fa);padding:6px;border-radius:6px;text-align:center">🌡️ ${tr('Temp', 'حرارة')}<br><strong>${v.temp ? v.temp + '°' : '-'}</strong></div>
          <div style="background:var(--bg-secondary,#f8f9fa);padding:6px;border-radius:6px;text-align:center">❤️ ${tr('Pulse', 'نبض')}<br><strong>${v.pulse || '-'}</strong></div>
          <div style="background:var(--bg-secondary,#f8f9fa);padding:6px;border-radius:6px;text-align:center">💨 ${tr('O2', 'أكسجين')}<br><strong>${v.o2_sat ? v.o2_sat + '%' : '-'}</strong></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;font-size:12px;margin-top:6px">
          <div style="background:var(--bg-secondary,#f8f9fa);padding:6px;border-radius:6px;text-align:center">💪 ${tr('Weight', 'وزن')}<br><strong>${v.weight ? v.weight + ' kg' : '-'}</strong></div>
          <div style="background:var(--bg-secondary,#f8f9fa);padding:6px;border-radius:6px;text-align:center">📏 ${tr('Height', 'طول')}<br><strong>${v.height ? v.height + ' cm' : '-'}</strong></div>
          <div style="background:var(--bg-secondary,#f8f9fa);padding:6px;border-radius:6px;text-align:center">🩸 ${tr('Sugar', 'سكر')}<br><strong>${v.blood_sugar || '-'}</strong></div>
          <div style="background:var(--bg-secondary,#f8f9fa);padding:6px;border-radius:6px;text-align:center">🌬️ ${tr('Resp', 'تنفس')}<br><strong>${v.respiratory_rate || '-'}</strong></div>
        </div>
        ${v.allergies ? `<div style="margin-top:6px"><span class="badge badge-danger">⚠️ ${tr('Allergies', 'حساسية')}: ${v.allergies}</span></div>` : ''}
        ${v.chronic_diseases ? `<div style="margin-top:4px"><span class="badge badge-warning">🏥 ${tr('Chronic', 'أمراض مزمنة')}: ${v.chronic_diseases}</span></div>` : ''}
        ${v.current_medications ? `<div style="margin-top:4px"><span class="badge badge-info">💊 ${tr('Medications', 'أدوية')}: ${v.current_medications}</span></div>` : ''}
      </div>`;
    }
    // Build patient history timeline
    let historyHtml = '';
    if (account) {
      const events = [];
      (account.records || []).forEach(r => events.push({ type: 'record', icon: '🩺', color: '#6366f1', label: tr('Visit/Diagnosis', 'زيارة/تشخيص'), detail: `${r.diagnosis || '-'}${r.symptoms ? ' | ' + r.symptoms : ''}${r.doctor_name ? ' | 👨‍⚕️ ' + r.doctor_name : ''}`, date: r.visit_date || r.created_at }));
      (account.labOrders || []).forEach(o => events.push({ type: 'lab', icon: '🔬', color: '#f59e0b', label: tr('Lab', 'مختبر'), detail: `${o.order_type} ${o.status === 'Done' ? '✅' : '⏳'} ${o.results ? '| ' + o.results.substring(0, 80) : ''}`, date: o.created_at }));
      (account.radOrders || []).forEach(o => events.push({ type: 'rad', icon: '📡', color: '#0ea5e9', label: tr('Radiology', 'أشعة'), detail: `${o.order_type} ${o.status === 'Done' ? '✅' : '⏳'}`, date: o.created_at }));
      (account.prescriptions || []).forEach(rx => events.push({ type: 'rx', icon: '💊', color: '#10b981', label: tr('Prescription', 'وصفة'), detail: `${rx.drug_name || rx.medication || '-'} | ${rx.dosage || ''} ${rx.frequency || ''}`, date: rx.created_at }));
      (account.invoices || []).forEach(inv => events.push({ type: 'inv', icon: '🧾', color: '#8b5cf6', label: tr('Invoice', 'فاتورة'), detail: `${inv.description || inv.service_type || '-'} | ${inv.total || 0} ${tr('SAR', 'ر.س')} ${inv.paid ? '✅' : '⏳'}`, date: inv.created_at }));
      events.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      if (events.length > 0) {
        historyHtml = `<div style="margin-top:12px;padding:12px;border:1px solid var(--border-color,#e5e7eb);border-radius:10px;background:var(--card-bg,#fff);max-height:350px;overflow-y:auto">
          <div style="font-weight:600;margin-bottom:10px;font-size:14px">📜 ${tr('Patient Full History', 'السجل الكامل للمريض')} (${events.length})</div>
          ${events.map(e => `<div style="display:flex;gap:10px;padding:8px;margin:4px 0;border-radius:8px;border-right:4px solid ${e.color};background:var(--hover,#f8f9fa);font-size:12px;align-items:flex-start">
            <span style="font-size:18px;min-width:24px">${e.icon}</span>
            <div style="flex:1"><strong style="color:${e.color}">${e.label}</strong><div style="margin-top:2px;color:var(--text)">${e.detail}</div></div>
            <span style="color:var(--text-dim);font-size:11px;white-space:nowrap">${e.date ? new Date(e.date).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }) : '-'}</span>
          </div>`).join('')}
        </div>`;
      }
    }
    document.getElementById('drPatientInfo').innerHTML = `<div class="flex gap-8 mt-16" style="flex-wrap:wrap;align-items:center"><span class="badge badge-info">📁 ${p.mrn || p.file_number}</span><span class="badge badge-warning">🎂 ${tr('Age', 'العمر')}: ${p.age || '?'}</span>${p.blood_type ? `<span class="badge" style="background:#dc2626;color:#fff;font-weight:700">🩸 ${p.blood_type}</span>` : ''}<span class="badge badge-success">📞 ${p.phone}</span><span class="badge badge-purple">🆔 ${p.national_id}</span>${p.gender ? `<span class="badge" style="background:${p.gender === 'ذكر' ? '#3b82f6' : '#ec4899'};color:#fff">${p.gender === 'ذكر' ? '👨' : '👩'} ${p.gender}</span>` : ''}${p.insurance_company ? `<span class="badge" style="background:#0d9488;color:#fff">🏢 ${p.insurance_company}${p.insurance_class ? ' (' + p.insurance_class + ')' : ''}</span>` : ''}<span class="badge" style="background:#0ea5e9;color:#fff">📅 ${tr('Visit', 'الزيارة')}: ${new Date().toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' })}</span><button class="btn btn-sm btn-primary" onclick="viewPatientResults(${p.id})">📋 ${tr('View Lab & Radiology Results', 'استعراض نتائج الفحوصات والأشعة')}</button><button class="btn btn-sm" onclick="dischargePatient(${p.id})" style="margin-right:auto;background:#dc3545;color:#fff;font-weight:600">🚪 ${tr('Patient Done', 'المريض طلع')}</button></div>${p.allergies ? `<div style="margin-top:8px;padding:10px;background:#fef2f2;border:2px solid #ef4444;border-radius:8px;font-size:13px;font-weight:600;color:#dc2626">⚠️ <strong>${tr('ALLERGIES', 'حساسية')}:</strong> ${p.allergies}</div>` : ''}${p.chronic_diseases ? `<div style="margin-top:6px;padding:8px;background:#fefce8;border:1px solid #facc15;border-radius:8px;font-size:12px;color:#854d0e">🩺 <strong>${tr('Chronic Diseases', 'أمراض مزمنة')}:</strong> ${p.chronic_diseases}</div>` : ''}${vitalsHtml}${historyHtml}<div id="drResultsPanel"></div>`;
  } catch (e) { }
};
window.dischargePatient = async (pid) => {
  try {
    await API.put(`/api/patients/${pid}`, { status: 'Done' });
    showToast(tr('Patient discharged!', 'تم خروج المريض! ✅'), 'success');
    document.getElementById('drPatientInfo').innerHTML = `<div class="badge badge-success" style="font-size:14px;padding:12px 20px;margin-top:12px">✅ ${tr('Patient discharged successfully', 'تم خروج المريض بنجاح')}</div>`;
    document.getElementById('drPatient').value = '';
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.viewPatientResults = async (pid) => {
  try {
    const data = await API.get(`/api/patients/${pid}/results`);
    const p = data.patient;
    let html = `<div class="card mt-16" style="border:2px solid var(--accent)">
          <div class="card-title">📋 ${tr('Results for', 'نتائج')} ${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)}</div>`;
    // Lab Results
    if (data.labOrders.length > 0) {
      html += `<div class="mb-16"><h4 style="color:var(--accent);margin:0 0 8px">🔬 ${tr('Lab Results', 'نتائج المختبر')} (${data.labOrders.length})</h4>`;
      data.labOrders.forEach(o => {
        html += `<div style="padding:10px;margin:6px 0;background:var(--hover);border-radius:8px;border-right:4px solid ${o.status === 'Done' ? '#4ade80' : '#f59e0b'}">
                  <div class="flex gap-8" style="flex-wrap:wrap;align-items:center"><strong>${o.order_type}</strong> ${statusBadge(o.status)} <span style="color:var(--text-dim);font-size:12px">${o.created_at ? new Date(o.created_at).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }) : ''}</span></div>
                  ${o.results ? `<div style="margin-top:8px;padding:8px;background:var(--bg);border-radius:6px;font-size:13px;white-space:pre-wrap">${o.results}</div>` : `<div style="margin-top:4px;color:var(--text-dim);font-size:12px">${tr('No results yet', 'لا توجد نتائج بعد')}</div>`}
                </div>`;
      });
      html += `</div>`;
    } else {
      html += `<div class="mb-16" style="color:var(--text-dim)">🔬 ${tr('No lab orders', 'لا توجد فحوصات مختبر')}</div>`;
    }
    // Radiology Results
    if (data.radOrders.length > 0) {
      html += `<div class="mb-16"><h4 style="color:var(--accent);margin:0 0 8px">📡 ${tr('Radiology Results', 'نتائج الأشعة')} (${data.radOrders.length})</h4>`;
      data.radOrders.forEach(o => {
        html += `<div style="padding:10px;margin:6px 0;background:var(--hover);border-radius:8px;border-right:4px solid ${o.status === 'Done' ? '#4ade80' : '#f59e0b'}">
                  <div class="flex gap-8" style="flex-wrap:wrap;align-items:center"><strong>${o.order_type}</strong> ${statusBadge(o.status)} <span style="color:var(--text-dim);font-size:12px">${o.created_at ? new Date(o.created_at).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }) : ''}</span></div>
                  ${o.results ? `<div style="margin-top:8px">${renderRadResults(o.results)}</div>` : `<div style="margin-top:4px;color:var(--text-dim);font-size:12px">${tr('No results yet', 'لا توجد نتائج بعد')}</div>`}
                </div>`;
      });
      html += `</div>`;
    } else {
      html += `<div class="mb-16" style="color:var(--text-dim)">📡 ${tr('No radiology orders', 'لا توجد أشعة')}</div>`;
    }
    html += `</div>`;
    document.getElementById('drResultsPanel').innerHTML = html;
  } catch (e) { showToast(tr('Error loading results', 'خطأ في تحميل النتائج'), 'error'); }
};
window.saveMedRecord = async () => {
  const pid = document.getElementById('drPatient').value;
  if (!pid) { showToast(tr('Select patient first', 'اختر المريض أولاً'), 'error'); return; }
  try {
    await API.post('/api/medical/records', { patient_id: pid, diagnosis: document.getElementById('drDiag').value, symptoms: document.getElementById('drSymp').value, icd10_codes: document.getElementById('drIcd').value, notes: document.getElementById('drNotes').value });
    showToast(tr('Record saved!', 'تم حفظ السجل!'));
    await navigateTo(3);
  } catch (e) { showToast(tr('Error saving', 'خطأ في الحفظ'), 'error'); }
};
window.sendToLab = async () => {
  const pid = document.getElementById('drPatient').value;
  if (!pid) { showToast(tr('Select patient first', 'اختر المريض أولاً'), 'error'); return; }
  try {
    await API.post('/api/lab/orders', { patient_id: pid, order_type: document.getElementById('drLabType').value, description: document.getElementById('drLabDesc').value });
    showToast(tr('Sent to Reception for payment → then Lab', 'تم الإرسال للاستقبال للسداد ← ثم المختبر'), 'success');
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.sendToRad = async () => {
  const pid = document.getElementById('drPatient').value;
  if (!pid) { showToast(tr('Select patient first', 'اختر المريض أولاً'), 'error'); return; }
  try {
    await API.post('/api/radiology/orders', { patient_id: pid, order_type: document.getElementById('drRadType').value, description: document.getElementById('drRadDesc').value });
    showToast(tr('Sent to Reception for payment → then Radiology', 'تم الإرسال للاستقبال للسداد ← ثم الأشعة'), 'success');
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.sendRx = async () => {
  const pid = document.getElementById('drPatient').value;
  if (!pid) { showToast(tr('Select patient first', 'اختر المريض أولاً'), 'error'); return; }
  const drugName = document.getElementById('drRxDrug').value;
  // Check drug allergy before prescribing
  const allergyMatch = await checkDrugAllergy(pid, drugName);
  if (allergyMatch) {
    const proceed = confirm('⚠️🚨 ' + tr('ALLERGY ALERT! Patient is allergic to: ', 'تنبيه حساسية! المريض لديه حساسية من: ') + allergyMatch.toUpperCase() + '\n\n' + tr('Drug: ', 'الدواء: ') + drugName + '\n\n' + tr('Do you want to proceed anyway?', 'هل تريد المتابعة رغم ذلك؟'));
    if (!proceed) return;
  }
  try {
    const qty = document.getElementById('drRxQty')?.value || '1';
    await API.post('/api/prescriptions', { patient_id: pid, medication_name: drugName, dosage: document.getElementById('drRxDose').value, quantity_per_day: qty, frequency: document.getElementById('drRxFreq').value, duration: document.getElementById('drRxDur').value });
    showToast(tr('Prescription sent to Pharmacy!', 'تم إرسال الوصفة للصيدلية!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.issueCertificate = async () => {
  const pid = document.getElementById('drPatient').value;
  if (!pid) { showToast(tr('Select patient first', 'اختر المريض أولاً'), 'error'); return; }
  const pSelect = document.getElementById('drPatient');
  const pName = pSelect.options[pSelect.selectedIndex]?.text?.split(' - ')[1]?.split(' (')[0] || '';
  try {
    await API.post('/api/medical/certificates', {
      patient_id: pid, patient_name: pName,
      cert_type: document.getElementById('drCertType').value,
      diagnosis: document.getElementById('drCertDiag').value,
      start_date: document.getElementById('drCertFrom').value,
      end_date: document.getElementById('drCertTo').value,
      days: parseInt(document.getElementById('drCertDays').value) || 1,
      notes: document.getElementById('drCertNotes').value
    });
    showToast(tr('Certificate issued!', 'تم إصدار التقرير!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.sendReferral = async () => {
  const pid = document.getElementById('drPatient').value;
  if (!pid) { showToast(tr('Select patient first', 'اختر المريض أولاً'), 'error'); return; }
  const pSelect = document.getElementById('drPatient');
  const pName = pSelect.options[pSelect.selectedIndex]?.text?.split(' - ')[1]?.split(' (')[0] || '';
  try {
    await API.post('/api/referrals', {
      patient_id: pid, patient_name: pName,
      to_department: document.getElementById('drRefDept').value,
      reason: document.getElementById('drRefReason').value,
      urgency: document.getElementById('drRefUrg').value
    });
    showToast(tr('Referral sent!', 'تم إرسال التحويل!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.scheduleFollowup = async () => {
  const pid = document.getElementById('drPatient').value;
  if (!pid) { showToast(tr('Select patient first', 'اختر المريض أولاً'), 'error'); return; }
  const followDate = document.getElementById('drFollowDate').value;
  if (!followDate) { showToast(tr('Select date', 'اختر التاريخ'), 'error'); return; }
  const pSelect = document.getElementById('drPatient');
  const pName = pSelect.options[pSelect.selectedIndex]?.text?.split(' - ')[1]?.split(' (')[0] || '';
  try {
    await API.post('/api/appointments/followup', {
      patient_id: pid, patient_name: pName,
      appt_date: followDate,
      appt_time: document.getElementById('drFollowTime').value,
      notes: document.getElementById('drFollowNotes').value
    });
    showToast(tr('Follow-up booked!', 'تم حجز موعد المتابعة!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
let selectedServices = [];
window.filterDrServices = () => {
  const q = document.getElementById('drSvcSearch').value.toLowerCase().trim();
  const dd = document.getElementById('drSvcDropdown');
  if (!q || q.length < 1) { dd.style.display = 'none'; return; }
  const svcs = JSON.parse(document.getElementById('drSvcData').value || '[]');
  const matches = svcs.filter(s => s.name_en.toLowerCase().includes(q) || s.name_ar.includes(q) || s.category.toLowerCase().includes(q)).slice(0, 15);
  if (!matches.length) { dd.innerHTML = `<div style="padding:10px;color:var(--text-dim)">${tr('No results', 'لا توجد نتائج')}</div>`; dd.style.display = 'block'; return; }
  dd.innerHTML = matches.map(s => `<div onclick="addDrService(${s.id},'${s.name_en.replace(/'/g, "\\'")}','${s.name_ar.replace(/'/g, "\\'")}',${s.price},'${s.category}')" style="padding:8px 12px;cursor:pointer;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center" onmouseover="this.style.background='var(--hover)'" onmouseout="this.style.background=''">
    <span><strong>${isArabic ? s.name_ar : s.name_en}</strong> <small style="color:var(--text-dim)">${s.category}</small></span>
    <span style="color:var(--accent);font-weight:600">${s.price} ${tr('SAR', 'ر.س')}</span>
  </div>`).join('');
  dd.style.display = 'block';
};
window.addDrService = (id, nameEn, nameAr, price, cat) => {
  if (selectedServices.find(s => s.id === id)) return;
  selectedServices.push({ id, nameEn, nameAr, price, cat });
  document.getElementById('drSvcSearch').value = '';
  document.getElementById('drSvcDropdown').style.display = 'none';
  renderSvcTags();
};
window.removeDrService = (id) => {
  selectedServices = selectedServices.filter(s => s.id !== id);
  renderSvcTags();
};
function renderSvcTags() {
  const c = document.getElementById('drSvcTags');
  if (!selectedServices.length) { c.innerHTML = `<span style="color:var(--text-dim);font-size:13px">${tr('No procedures selected', 'لم يتم اختيار إجراءات')}</span>`; return; }
  const total = selectedServices.reduce((s, x) => s + x.price, 0);
  c.innerHTML = selectedServices.map(s => `<span class="badge badge-info" style="font-size:12px;padding:6px 10px">${isArabic ? s.nameAr : s.nameEn} (${s.price} ${tr('SAR', 'ر.س')}) <span onclick="removeDrService(${s.id})" style="cursor:pointer;margin-right:4px;font-weight:bold">\u2715</span></span>`).join('') +
    `<span class="badge badge-success" style="font-size:12px;padding:6px 10px;margin-right:auto">\ud83d\udcb0 ${tr('Total', 'الإجمالي')}: ${total} ${tr('SAR', 'ر.س')}</span>`;
}
window.billDrProcedures = async () => {
  const pid = document.getElementById('drPatient').value;
  if (!pid) { showToast(tr('Select patient first', 'اختر المريض أولاً'), 'error'); return; }
  if (!selectedServices.length) { showToast(tr('Select procedures first', 'اختر الإجراءات أولاً'), 'error'); return; }
  try {
    const result = await API.post('/api/medical/bill-procedures', { patient_id: pid, services: selectedServices });
    showToast(`${tr('Billed successfully', 'تم إصدار الفاتورة')}: ${result.totalBilled} ${tr('SAR', 'ر.س')}`);
    selectedServices = [];
    renderSvcTags();
  } catch (e) { showToast(tr('Error billing', 'خطأ في الفوترة'), 'error'); }
};

// ===== LAB =====
// ===== LAB NORMAL RANGES (Gender-Specific: m=male, f=female) =====
const LAB_NORMAL_RANGES = {
  'CBC (Complete Blood Count)': {
    m: 'WBC: 4.5-11.0 ×10³/µL | RBC: 4.5-5.5 ×10⁶/µL | Hgb: 13.5-17.5 g/dL | Hct: 38-50% | Platelets: 150-400 ×10³/µL | MCV: 80-100 fL | MCH: 27-33 pg',
    f: 'WBC: 4.5-11.0 ×10³/µL | RBC: 4.0-5.0 ×10⁶/µL | Hgb: 12.0-16.0 g/dL | Hct: 36-44% | Platelets: 150-400 ×10³/µL | MCV: 80-100 fL | MCH: 27-33 pg'
  },
  'ESR (Erythrocyte Sedimentation Rate)': { m: '0-15 mm/hr', f: '0-20 mm/hr' },
  'Coagulation Profile (PT, PTT, INR)': 'PT: 11-13.5 sec | INR: 0.8-1.2 | PTT (aPTT): 25-35 sec',
  'Blood Film / Reticulocyte Count': 'Reticulocyte: 0.5-2.5%',
  'Hemoglobin Electrophoresis': 'HbA: 95-98% | HbA2: 1.5-3.5% | HbF: <2%',
  'G6PD Deficiency Test': 'Normal: 4.6-13.5 U/g Hb',
  'Sickle Cell Test': 'Negative (Normal)',
  'Bleeding Time / Clotting Time': 'Bleeding Time: 2-7 min | Clotting Time: 4-10 min',
  'D-Dimer': '<0.5 µg/mL (or <500 ng/mL)',
  'Comprehensive Metabolic Panel (CMP)': 'Glucose: 70-100 mg/dL | BUN: 7-20 mg/dL | Creatinine: 0.6-1.2 mg/dL | Na: 136-145 mEq/L | K: 3.5-5.0 mEq/L | Cl: 98-106 mEq/L | CO2: 23-29 mEq/L | Ca: 8.5-10.5 mg/dL | Total Protein: 6.0-8.3 g/dL | Albumin: 3.5-5.5 g/dL | Bilirubin(T): 0.1-1.2 mg/dL | ALP: 44-147 IU/L | ALT: 7-56 IU/L | AST: 10-40 IU/L',
  'Basic Metabolic Panel (BMP)': 'Glucose: 70-100 mg/dL | BUN: 7-20 mg/dL | Creatinine: 0.6-1.2 mg/dL | Na: 136-145 | K: 3.5-5.0 | Cl: 98-106 | CO2: 23-29 mEq/L | Ca: 8.5-10.5 mg/dL',
  'Fasting Blood Sugar (FBS)': 'Normal: 70-100 mg/dL (3.9-5.6 mmol/L) | Pre-diabetes: 100-125 | Diabetes: ≥126',
  'Random Blood Sugar (RBS)': 'Normal: <140 mg/dL (7.8 mmol/L) | Diabetes: ≥200',
  'Oral Glucose Tolerance Test (OGTT)': 'Fasting: <100 | 1hr: <180 | 2hr: <140 mg/dL | Diabetes 2hr: ≥200',
  'HbA1c (Glycated Hemoglobin)': 'Normal: <5.7% | Pre-diabetes: 5.7-6.4% | Diabetes: ≥6.5%',
  'Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)': { m: 'Total Cholesterol: <200 | LDL: <100 | HDL: >40 mg/dL | Triglycerides: <150 | VLDL: 5-40', f: 'Total Cholesterol: <200 | LDL: <100 | HDL: >50 mg/dL | Triglycerides: <150 | VLDL: 5-40' },
  'Renal Profile (Urea, Creatinine, Electrolytes: Na, K, Cl)': { m: 'BUN: 7-20 | Creatinine: 0.7-1.3 mg/dL | eGFR: >90 | Na: 136-145 | K: 3.5-5.0 | Cl: 98-106', f: 'BUN: 7-20 | Creatinine: 0.6-1.1 mg/dL | eGFR: >90 | Na: 136-145 | K: 3.5-5.0 | Cl: 98-106' },
  'Liver Function Test (LFT: ALT, AST, ALP, Total/Direct Bilirubin, Albumin, Total Protein)': { m: 'ALT: 7-56 | AST: 10-40 | ALP: 44-147 | GGT: 8-61 IU/L | Bilirubin(T): 0.1-1.2 | Direct: 0-0.3 | Albumin: 3.5-5.5 | Protein: 6.0-8.3', f: 'ALT: 7-45 | AST: 10-35 | ALP: 44-147 | GGT: 5-36 IU/L | Bilirubin(T): 0.1-1.2 | Direct: 0-0.3 | Albumin: 3.5-5.5 | Protein: 6.0-8.3' },
  'Cardiac Enzymes (Troponin T/I, CK-MB, CK-Total, LDH)': { m: 'Troponin I: <0.04 ng/mL | CK-Total: 39-308 IU/L | CK-MB: <25 | LDH: 140-280 | BNP: <100 pg/mL', f: 'Troponin I: <0.04 ng/mL | CK-Total: 26-192 IU/L | CK-MB: <25 | LDH: 140-280 | BNP: <100 pg/mL' },
  'Uric Acid': { m: '3.4-7.0 mg/dL', f: '2.4-6.0 mg/dL' },
  'Calcium / Phosphorus / Magnesium': 'Ca: 8.5-10.5 mg/dL | Ionized Ca: 4.5-5.6 mg/dL | Phosphorus: 2.5-4.5 mg/dL | Magnesium: 1.7-2.2 mg/dL',
  'Iron Profile (Serum Iron, TIBC, Ferritin, Transferrin)': { m: 'Serum Iron: 65-175 µg/dL | TIBC: 250-370 | Ferritin: 12-300 ng/mL | Transferrin Sat: 20-50%', f: 'Serum Iron: 50-170 µg/dL | TIBC: 250-370 | Ferritin: 12-150 ng/mL | Transferrin Sat: 20-50%' },
  'Vitamin D3 (25-OH Cholecalciferol)': 'Deficient: <20 ng/mL | Insufficient: 20-29 | Sufficient: 30-100 | Toxic: >100 ng/mL',
  'Vitamin B12 / Folate': 'B12: 200-900 pg/mL | Folate: 2.7-17.0 ng/mL',
  'Amylase / Lipase': 'Amylase: 28-100 U/L | Lipase: 0-160 U/L',
  'Serum Osmolality': '275-295 mOsm/kg',
  'Thyroid Profile (TSH, Free T3, Free T4, Total T3, Total T4)': 'TSH: 0.27-4.2 mIU/L | Free T4: 0.93-1.7 ng/dL | Free T3: 2.0-4.4 pg/mL | Total T4: 5.1-14.1 µg/dL | Total T3: 80-200 ng/dL',
  'Fertility Hormones (FSH, LH, Prolactin, Testosterone (Free/Total), Estradiol E2, Progesterone)': { m: 'FSH: 1.5-12.4 | LH: 1.7-8.6 mIU/mL | Prolactin: 4-15 ng/mL | Testosterone: 270-1070 ng/dL | Free Testosterone: 8.7-25.1 pg/mL | Estradiol: 10-40 pg/mL', f: 'FSH(follicular): 3.5-12.5 | LH(follicular): 2.4-12.6 mIU/mL | Prolactin: 4-23 ng/mL | Testosterone: 15-70 ng/dL | Estradiol(follicular): 12.5-166 pg/mL | Progesterone(luteal): 1.8-24 ng/mL' },
  'Beta-hCG (Pregnancy Test - Blood Qualitative/Quantitative)': { m: 'Normal: <2 mIU/mL', f: 'Non-pregnant: <5 mIU/mL | Pregnant: >25 mIU/mL' },
  'Cortisol (AM/PM)': 'AM (6-8am): 6.2-19.4 µg/dL | PM (4pm): 2.3-11.9 µg/dL',
  'Insulin (Fasting/Random)': 'Fasting: 2.6-24.9 µIU/mL',
  'Parathyroid Hormone (PTH)': '15-65 pg/mL',
  'Growth Hormone (GH)': { m: '0-5 ng/mL', f: '0-10 ng/mL' },
  'ACTH': 'AM: 10-60 pg/mL',
  'C-Peptide': '0.5-2.0 ng/mL (fasting)',
  'Anti-Mullerian Hormone (AMH)': { m: '1.4-14.0 ng/mL', f: 'Reproductive: 1.0-10.0 ng/mL | Low reserve: <1.0 | High (PCOS): >10' },
  'CRP (C-Reactive Protein - Qualitative/Quantitative)': 'Normal: <3 mg/L | Mild inflammation: 3-10 | Moderate: 10-100 | Severe: >100',
  'Rheumatoid Factor (RF)': 'Normal: <14 IU/mL',
  'ANA (Anti-Nuclear Antibody) / Anti-dsDNA': 'ANA: Negative (<1:40) | Anti-dsDNA: <30 IU/mL',
  'ASO Titer': 'Adults: <200 IU/mL | Children: <100 IU/mL',
  'Hepatitis Profile (HBsAg, HBsAb, HCV Ab, HAV IgM/IgG)': 'HBsAg: Negative | HBsAb: >10 mIU/mL (immune) | HCV Ab: Negative | HAV IgM: Negative',
  'HIV 1 & 2 Abs/Ag': 'Negative (Non-reactive)',
  'VDRL / RPR (Syphilis)': 'Non-reactive (Negative)',
  'Widal Test (Typhoid)': 'O & H Titers: <1:80 (Normal)',
  'Brucella (Abortus/Melitensis)': 'Titer: <1:80 (Negative)',
  'Toxoplasmosis (IgG/IgM)': 'IgG: <1.0 IU/mL (Negative) | IgM: Negative',
  'Rubella (IgG/IgM)': 'IgG: >10 IU/mL (Immune) | IgM: Negative',
  'Cytomegalovirus CMV (IgG/IgM)': 'IgG: Negative (<6 AU/mL) | IgM: Negative',
  'Herpes Simplex Virus HSV 1/2 (IgG/IgM)': 'IgG: <0.9 (Negative) | IgM: Negative',
  'EBV (Epstein-Barr Virus)': 'VCA IgM: Negative | VCA IgG: Negative | EBNA: Negative',
  'Celiac Disease Panel (Anti-tTG, Anti-Endomysial)': 'Anti-tTG IgA: <4 U/mL (Negative) | Anti-Endomysial: Negative',
  'Food Allergy Panel (IgE)': 'Total IgE: <100 IU/mL (Adults) | Specific IgE: <0.35 kU/L per allergen',
  'Inhalant Allergy Panel (IgE)': 'Total IgE: <100 IU/mL | Specific IgE: Class 0 (<0.35 kU/L)',
  'Urine Analysis (Routine & Microscopic)': 'pH: 4.6-8.0 | Specific Gravity: 1.005-1.030 | Protein: Negative | Glucose: Negative | Blood: Negative | WBC: 0-5/HPF | RBC: 0-2/HPF | Bacteria: None',
  'Urine Culture & Sensitivity': 'Negative: <10,000 CFU/mL | Positive: ≥100,000 CFU/mL',
  'Stool Analysis (Routine & Microscopic)': 'Color: Brown | Consistency: Formed | Occult Blood: Negative | WBC: None | RBC: None | Parasites: None',
  'Stool Culture': 'No pathogenic organisms',
  'Stool Occult Blood': 'Negative',
  'H. Pylori (Ag in Stool / Ab in Blood)': 'Stool Ag: Negative | Serum Ab: Negative',
  'Throat Swab Culture': 'Normal Flora | No Group A Strep',
  'Sputum Culture & AFB (Tuberculosis)': 'Culture: Normal flora | AFB Smear: Negative',
  'Wound/Pus Swab Culture': 'No pathogenic growth',
  'Blood Culture (Aerobic/Anaerobic)': 'No growth after 5 days',
  'PSA (Prostate Specific Antigen - Total/Free)': { m: 'Total PSA: <4.0 ng/mL | Free/Total ratio: >25%', f: 'N/A (خاص بالذكور)' },
  'CEA (Carcinoembryonic Antigen)': 'Non-smoker: <2.5 ng/mL | Smoker: <5.0 ng/mL',
  'CA 125 (Ovarian)': '<35 U/mL',
  'CA 15-3 (Breast)': '<30 U/mL',
  'CA 19-9 (Pancreatic/GI)': '<37 U/mL',
  'AFP (Alpha-Fetoprotein)': '<10 ng/mL (Adults)',
  'Beta-2 Microglobulin': '0.8-2.2 mg/L',
  'Thyroglobulin': '1.5-38.5 ng/mL (pre-thyroidectomy)',
  'COVID-19 PCR': 'Negative (Not Detected)',
  'HCV RNA PCR (Quantitative)': 'Not Detected (<15 IU/mL)',
  'HBV DNA PCR (Quantitative)': 'Not Detected (<10 IU/mL)',
  'HIV RNA PCR (Quantitative)': 'Not Detected (<20 copies/mL)',
  'Respiratory Pathogen Panel (PCR)': 'Negative for all targets',
  'HPV DNA Typing': 'Negative (No high-risk HPV detected)',
  'Pap Smear': 'NILM (Negative for Intraepithelial Lesion or Malignancy)',
  'Malaria Film': 'No parasites seen',
  // Blood Bank
  'Blood Group (ABO) & Rh Typing': 'A/B/AB/O | Rh+ or Rh-',
  'Crossmatch (Major & Minor)': 'Compatible (No agglutination)',
  'Direct Coombs Test (DAT)': 'Negative',
  'Indirect Coombs Test (IAT)': 'Negative',
  'Antibody Screening Panel': 'Negative (No clinically significant antibodies)',
  'Cold Agglutinins': 'Titer: <1:64',
  // Blood Gas
  'Arterial Blood Gas (ABG)': 'pH: 7.35-7.45 | pCO2: 35-45 mmHg | pO2: 80-100 mmHg | HCO3: 22-26 mEq/L | BE: -2 to +2 | O2 Sat: 95-100%',
  'Venous Blood Gas (VBG)': 'pH: 7.31-7.41 | pCO2: 41-51 mmHg | HCO3: 22-26 mEq/L',
  'Lactate (Lactic Acid)': 'Venous: 0.5-2.2 mmol/L | Arterial: 0.5-1.6 mmol/L | Critical: >4 mmol/L',
  'Ionized Calcium': '4.5-5.6 mg/dL (1.12-1.40 mmol/L)',
  'Methemoglobin / Carboxyhemoglobin': 'MetHb: <1.5% | COHb: Non-smoker: <2%, Smoker: <10%',
  // TDM
  'Digoxin Level': 'Therapeutic: 0.8-2.0 ng/mL | Toxic: >2.0',
  'Phenytoin (Dilantin) Level': 'Therapeutic: 10-20 µg/mL | Toxic: >20',
  'Valproic Acid Level': 'Therapeutic: 50-100 µg/mL | Toxic: >100',
  'Carbamazepine Level': 'Therapeutic: 4-12 µg/mL | Toxic: >12',
  'Lithium Level': 'Therapeutic: 0.6-1.2 mEq/L | Toxic: >1.5',
  'Vancomycin Level (Trough/Peak)': 'Trough: 10-20 µg/mL | Peak: 20-40 µg/mL',
  'Gentamicin / Amikacin Level': 'Gentamicin - Trough: <2 | Peak: 5-10 µg/mL | Amikacin - Trough: <10 | Peak: 20-30',
  'Theophylline Level': 'Therapeutic: 10-20 µg/mL | Toxic: >20',
  'Methotrexate Level': '24hr: <10 µmol/L | 48hr: <1 | 72hr: <0.1',
  'Tacrolimus / Cyclosporine Level': 'Tacrolimus: 5-20 ng/mL | Cyclosporine: 100-300 ng/mL (varies by transplant)',
  // Special Chemistry
  'Protein Electrophoresis (SPEP)': 'Albumin: 3.5-5.5 g/dL | Alpha-1: 0.1-0.3 | Alpha-2: 0.6-1.0 | Beta: 0.7-1.2 | Gamma: 0.7-1.6 g/dL',
  'Immunoglobulins (IgA, IgG, IgM, IgE)': 'IgG: 700-1600 mg/dL | IgA: 70-400 | IgM: 40-230 | IgE: <100 IU/mL',
  'Complement C3 / C4': 'C3: 90-180 mg/dL | C4: 10-40 mg/dL',
  'Ammonia Level': '15-45 µg/dL (11-32 µmol/L)',
  'Homocysteine': '5-15 µmol/L | High risk: >15',
  'Ceruloplasmin / Copper': 'Ceruloplasmin: 20-35 mg/dL | Serum Copper: 70-155 µg/dL | Wilson Disease: Ceruloplasmin <20',
  'Lactate Dehydrogenase (LDH)': '140-280 IU/L',
  'Haptoglobin': { m: '30-200 mg/dL', f: '30-200 mg/dL' },
  'Procalcitonin (PCT)': 'Normal: <0.1 ng/mL | Bacterial unlikely: <0.25 | Likely: 0.25-0.5 | Severe sepsis: >2.0',
  'BNP / NT-proBNP': 'BNP: <100 pg/mL (no HF) | NT-proBNP: <300 pg/mL (<50y), <900 (50-75y), <1800 (>75y)',
  'Fibrinogen': '200-400 mg/dL',
  'Anti-Xa (Heparin) Assay': 'LMWH prophylaxis: 0.2-0.5 IU/mL | Treatment: 0.5-1.0 | UFH: 0.3-0.7',
  'Cystatin C': '0.6-1.0 mg/L',
  'Microalbumin (Urine)': 'Normal: <30 mg/day | Microalbuminuria: 30-300 | Macroalbuminuria: >300',
  'Serum Free Light Chains (Kappa/Lambda)': 'Kappa: 3.3-19.4 mg/L | Lambda: 5.7-26.3 | Ratio: 0.26-1.65',
  '24hr Urine Protein / Creatinine Clearance': { m: 'Protein: <150 mg/24hr | Creatinine Clearance: 97-137 mL/min', f: 'Protein: <150 mg/24hr | Creatinine Clearance: 88-128 mL/min' },
  // Immunology additions
  'Anti-CCP (Anti-Cyclic Citrullinated Peptide)': 'Negative: <20 U/mL | Positive: ≥20',
  'ANCA (Anti-Neutrophil Cytoplasmic Antibody)': 'Negative (<1:20) | c-ANCA & p-ANCA',
  'Anti-Scl-70 / Anti-Centromere': 'Negative (<1.0 U) | Anti-Scl-70: Scleroderma | Anti-Centromere: CREST',
  'Dengue NS1 Ag / IgM / IgG': 'NS1 Ag: Negative | IgM: Negative | IgG: Negative',
  'Flow Cytometry (Immunophenotyping / CD4 Count)': 'CD4: 500-1500 cells/µL | CD4/CD8 ratio: 1.0-3.0',
  // Microbiology additions
  'QuantiFERON-TB Gold / TB Spot': 'Negative (<0.35 IU/mL) | Borderline: 0.35-0.50 | Positive: ≥0.35',
  'Chlamydia trachomatis (PCR/Ag)': 'Not Detected (Negative)',
  'Neisseria Gonorrhoeae (PCR/Culture)': 'Not Detected (Negative)',
  'CSF Analysis (Cell Count, Protein, Glucose)': 'WBC: 0-5/µL | RBC: 0 | Protein: 15-45 mg/dL | Glucose: 40-70 mg/dL | Opening pressure: 6-20 cmH2O',
  'Synovial Fluid Analysis': 'Color: Clear/Yellow | WBC: <200/µL | Crystals: None | Culture: No growth',
  'Semen Analysis (Spermogram)': { m: 'Volume: 1.5-5 mL | Count: ≥15 million/mL | Total: ≥39 million | Motility: ≥40% | Morphology: ≥4% normal | pH: 7.2-8.0', f: 'N/A' },
  // Hormones additions
  'Aldosterone / Renin': 'Aldosterone (upright): 7-30 ng/dL | Renin (upright): 0.5-4.0 ng/mL/hr | Ratio: <30',
  'DHEA-S (Dehydroepiandrosterone Sulfate)': { m: '80-560 µg/dL (varies by age)', f: '35-430 µg/dL (varies by age)' },
  'Calcitonin': { m: '<8.4 pg/mL', f: '<5.0 pg/mL' },
  '17-OH Progesterone': { m: '0.5-2.1 ng/mL', f: 'Follicular: 0.2-1.0 | Luteal: 1.0-4.0 ng/mL' },
  // Toxicology & Trace Elements
  'Myoglobin': { m: '28-72 ng/mL', f: '25-58 ng/mL' },
  'Vitamin A (Retinol)': '30-65 µg/dL (1.05-2.27 µmol/L)',
  'Zinc Level': '60-120 µg/dL (9.2-18.4 µmol/L)',
  'Selenium Level': '70-150 µg/L',
  'Lead Level (Blood)': 'Normal: <5 µg/dL | Action: ≥5 | Toxic: >70',
  'Mercury Level (Blood)': 'Normal: <10 µg/L | At risk: 10-50 | Toxic: >50',
  'Urine Drug Screen (UDS)': 'Negative for all classes (Amphetamines, Barbiturates, Benzodiazepines, Cannabinoids, Cocaine, Opiates)',
  'Serum Ethanol (Alcohol) Level': 'Negative: 0 | Legal limit: <80 mg/dL | Lethal: >400 mg/dL',
  'Acetaminophen (Paracetamol) Level': 'Therapeutic: 10-30 µg/mL | Toxic (4hr): >150 µg/mL',
  'Salicylate (Aspirin) Level': 'Therapeutic: 15-30 mg/dL | Toxic: >30 | Lethal: >60'
};
window.getLabNormalRange = (testName, gender) => {
  let entry = LAB_NORMAL_RANGES[testName];
  if (!entry) { for (const key in LAB_NORMAL_RANGES) { if (testName.includes(key) || key.includes(testName)) { entry = LAB_NORMAL_RANGES[key]; break; } } }
  if (!entry) return '';
  if (typeof entry === 'string') return entry;
  const g = (gender || '').trim();
  if (g === 'ذكر' || g === 'Male' || g === 'male' || g === 'M') return '👨 ' + (entry.m || '');
  if (g === 'أنثى' || g === 'Female' || g === 'female' || g === 'F') return '👩 ' + (entry.f || '');
  return '👨 ' + entry.m + '\n👩 ' + entry.f;

  // Auto-load diagnosis templates on page render
  setTimeout(() => { if (document.getElementById("drDiagTemplate")) loadDiagTemplates(); }, 500);
};

async function renderLab(el) {
  const [orders, patients] = await Promise.all([API.get('/api/lab/orders'), API.get('/api/patients')]);
  el.innerHTML = `<div class="page-title">🔬 ${tr('Laboratory', 'المختبر')}</div>
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-label">${tr('Pending', 'بالانتظار')}</div><div class="stat-value">${orders.filter(o => o.status === 'Requested').length}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('In Progress', 'قيد العمل')}</div><div class="stat-value">${orders.filter(o => o.status === 'In Progress').length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Completed', 'مكتمل')}</div><div class="stat-value">${orders.filter(o => o.status === 'Done').length}</div></div>
    </div>
    <div class="split-layout">
      <div class="card" style="flex:1">
        <div class="card-title">➕ ${tr('Direct Lab Order', 'إنشاء طلب فحص')}</div>
        <div class="form-group mb-12"><label>${tr('Select Patient (Optional)', 'اختر مريض (اختياري)')}</label>
          <select class="form-input" id="labPatientId"><option value="">--</option>${patients.map(p => `<option value="${p.id}">${p.name_ar || p.name_en}</option>`).join('')}</select>
        </div>
        <div class="form-group mb-12"><label>${tr('Test Name', 'اسم التحليل')}</label>
          <select class="form-input" id="labDirectType">
            <optgroup label="${tr('Hematology', 'أمراض الدم')}">
              <option>CBC (Complete Blood Count)</option>
              <option>ESR (Erythrocyte Sedimentation Rate)</option>
              <option>Coagulation Profile (PT, PTT, INR)</option>
              <option>Blood Film / Reticulocyte Count</option>
              <option>Hemoglobin Electrophoresis</option>
              <option>G6PD Deficiency Test</option>
              <option>Sickle Cell Test</option>
              <option>Bleeding Time / Clotting Time</option>
              <option>D-Dimer</option>
            </optgroup>
            <optgroup label="${tr('Biochemistry', 'الكيمياء الحيوية')}">
              <option>Comprehensive Metabolic Panel (CMP)</option>
              <option>Basic Metabolic Panel (BMP)</option>
              <option>Fasting Blood Sugar (FBS)</option>
              <option>Random Blood Sugar (RBS)</option>
              <option>Oral Glucose Tolerance Test (OGTT)</option>
              <option>HbA1c (Glycated Hemoglobin)</option>
              <option>Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)</option>
              <option>Renal Profile (Urea, Creatinine, Electrolytes: Na, K, Cl)</option>
              <option>Liver Function Test (LFT: ALT, AST, ALP, Total/Direct Bilirubin, Albumin, Total Protein)</option>
              <option>Cardiac Enzymes (Troponin T/I, CK-MB, CK-Total, LDH)</option>
              <option>Uric Acid</option>
              <option>Calcium / Phosphorus / Magnesium</option>
              <option>Iron Profile (Serum Iron, TIBC, Ferritin, Transferrin)</option>
              <option>Vitamin D3 (25-OH Cholecalciferol)</option>
              <option>Vitamin B12 / Folate</option>
              <option>Amylase / Lipase</option>
              <option>Serum Osmolality</option>
            </optgroup>
            <optgroup label="${tr('Hormones & Endocrinology', 'الهرمونات والغدد')}">
              <option>Thyroid Profile (TSH, Free T3, Free T4, Total T3, Total T4)</option>
              <option>Fertility Hormones (FSH, LH, Prolactin, Testosterone (Free/Total), Estradiol E2, Progesterone)</option>
              <option>Beta-hCG (Pregnancy Test - Blood Qualitative/Quantitative)</option>
              <option>Cortisol (AM/PM)</option>
              <option>Insulin (Fasting/Random)</option>
              <option>Parathyroid Hormone (PTH)</option>
              <option>Growth Hormone (GH)</option>
              <option>ACTH</option>
              <option>C-Peptide</option>
              <option>Anti-Mullerian Hormone (AMH)</option>
              <option>Aldosterone / Renin</option>
              <option>DHEA-S (Dehydroepiandrosterone Sulfate)</option>
              <option>17-OH Progesterone</option>
              <option>Calcitonin</option>
            </optgroup>
            <optgroup label="${tr('Immunology & Serology', 'المناعة والأمصال')}">
              <option>CRP (C-Reactive Protein - Qualitative/Quantitative)</option>
              <option>Rheumatoid Factor (RF)</option>
              <option>Anti-CCP (Anti-Cyclic Citrullinated Peptide)</option>
              <option>ANA (Anti-Nuclear Antibody) / Anti-dsDNA</option>
              <option>ANCA (Anti-Neutrophil Cytoplasmic Antibody)</option>
              <option>Anti-Scl-70 / Anti-Centromere</option>
              <option>ASO Titer</option>
              <option>Hepatitis Profile (HBsAg, HBsAb, HCV Ab, HAV IgM/IgG)</option>
              <option>HIV 1 & 2 Abs/Ag</option>
              <option>VDRL / RPR (Syphilis)</option>
              <option>Widal Test (Typhoid)</option>
              <option>Brucella (Abortus/Melitensis)</option>
              <option>Dengue NS1 Ag / IgM / IgG</option>
              <option>Toxoplasmosis (IgG/IgM)</option>
              <option>Rubella (IgG/IgM)</option>
              <option>Cytomegalovirus CMV (IgG/IgM)</option>
              <option>Herpes Simplex Virus HSV 1/2 (IgG/IgM)</option>
              <option>EBV (Epstein-Barr Virus)</option>
              <option>Celiac Disease Panel (Anti-tTG, Anti-Endomysial)</option>
              <option>Food Allergy Panel (IgE)</option>
              <option>Inhalant Allergy Panel (IgE)</option>
              <option>Flow Cytometry (Immunophenotyping / CD4 Count)</option>
            </optgroup>
            <optgroup label="${tr('Microbiology & Parasitology', 'الأحياء الدقيقة والطفيليات')}">
              <option>Urine Analysis (Routine & Microscopic)</option>
              <option>Urine Culture & Sensitivity</option>
              <option>Stool Analysis (Routine & Microscopic)</option>
              <option>Stool Culture</option>
              <option>Stool Occult Blood</option>
              <option>H. Pylori (Ag in Stool / Ab in Blood)</option>
              <option>Throat Swab Culture</option>
              <option>Sputum Culture & AFB (Tuberculosis)</option>
              <option>Wound/Pus Swab Culture</option>
              <option>Blood Culture (Aerobic/Anaerobic)</option>
              <option>Ear/Eye/Nasal Swab Culture</option>
              <option>High Vaginal Swab (HVS) Culture</option>
              <option>Urethral Swab Culture</option>
              <option>Fungal Culture (Skin/Nail/Hair)</option>
              <option>Malaria Film</option>
              <option>QuantiFERON-TB Gold / TB Spot</option>
              <option>Chlamydia trachomatis (PCR/Ag)</option>
              <option>Neisseria Gonorrhoeae (PCR/Culture)</option>
              <option>CSF Analysis (Cell Count, Protein, Glucose)</option>
              <option>Synovial Fluid Analysis</option>
              <option>Semen Analysis (Spermogram)</option>
            </optgroup>
            <optgroup label="${tr('Tumor Markers', 'دلالات الأورام')}">
              <option>PSA (Prostate Specific Antigen - Total/Free)</option>
              <option>CEA (Carcinoembryonic Antigen)</option>
              <option>CA 125 (Ovarian)</option>
              <option>CA 15-3 (Breast)</option>
              <option>CA 19-9 (Pancreatic/GI)</option>
              <option>AFP (Alpha-Fetoprotein)</option>
              <option>Beta-2 Microglobulin</option>
              <option>Thyroglobulin</option>
            </optgroup>
            <optgroup label="${tr('Molecular Diagnostics / PCR', 'التشخيص الجزيئي / PCR')}">
              <option>COVID-19 PCR</option>
              <option>HCV RNA PCR (Quantitative)</option>
              <option>HBV DNA PCR (Quantitative)</option>
              <option>HIV RNA PCR (Quantitative)</option>
              <option>Respiratory Pathogen Panel (PCR)</option>
              <option>HPV DNA Typing</option>
            </optgroup>
            <optgroup label="${tr('Histopathology / Cytology', 'علم الأنسجة والخلايا')}">
              <option>Pap Smear</option>
              <option>Biopsy Specimen Examination</option>
              <option>FNAC (Fine Needle Aspiration Cytology)</option>
              <option>Fluid Cytology (Pleural, Ascitic, CSF)</option>
            </optgroup>
            <optgroup label="${tr('Blood Bank / Transfusion', 'بنك الدم / نقل الدم')}">
              <option>Blood Group (ABO) & Rh Typing</option>
              <option>Crossmatch (Major & Minor)</option>
              <option>Direct Coombs Test (DAT)</option>
              <option>Indirect Coombs Test (IAT)</option>
              <option>Antibody Screening Panel</option>
              <option>Cold Agglutinins</option>
            </optgroup>
            <optgroup label="${tr('Blood Gas & Electrolytes', 'غازات الدم والشوارد')}">
              <option>Arterial Blood Gas (ABG)</option>
              <option>Venous Blood Gas (VBG)</option>
              <option>Lactate (Lactic Acid)</option>
              <option>Ionized Calcium</option>
              <option>Methemoglobin / Carboxyhemoglobin</option>
            </optgroup>
            <optgroup label="${tr('Therapeutic Drug Monitoring', 'مراقبة مستوى الأدوية')}">
              <option>Digoxin Level</option>
              <option>Phenytoin (Dilantin) Level</option>
              <option>Valproic Acid Level</option>
              <option>Carbamazepine Level</option>
              <option>Lithium Level</option>
              <option>Vancomycin Level (Trough/Peak)</option>
              <option>Gentamicin / Amikacin Level</option>
              <option>Theophylline Level</option>
              <option>Methotrexate Level</option>
              <option>Tacrolimus / Cyclosporine Level</option>
            </optgroup>
            <optgroup label="${tr('Special Chemistry', 'كيمياء متخصصة')}">
              <option>Protein Electrophoresis (SPEP)</option>
              <option>Immunoglobulins (IgA, IgG, IgM, IgE)</option>
              <option>Complement C3 / C4</option>
              <option>Ammonia Level</option>
              <option>Homocysteine</option>
              <option>Ceruloplasmin / Copper</option>
              <option>Lactate Dehydrogenase (LDH)</option>
              <option>Haptoglobin</option>
              <option>Procalcitonin (PCT)</option>
              <option>BNP / NT-proBNP</option>
              <option>Fibrinogen</option>
              <option>Anti-Xa (Heparin) Assay</option>
              <option>Cystatin C</option>
              <option>Microalbumin (Urine)</option>
              <option>24hr Urine Protein / Creatinine Clearance</option>
              <option>Serum Free Light Chains (Kappa/Lambda)</option>
            </optgroup>
            <optgroup label="${tr('Toxicology & Trace Elements', 'السموم والعناصر الدقيقة')}">
              <option>Myoglobin</option>
              <option>Vitamin A (Retinol)</option>
              <option>Zinc Level</option>
              <option>Selenium Level</option>
              <option>Lead Level (Blood)</option>
              <option>Mercury Level (Blood)</option>
              <option>Urine Drug Screen (UDS)</option>
              <option>Serum Ethanol (Alcohol) Level</option>
              <option>Acetaminophen (Paracetamol) Level</option>
              <option>Salicylate (Aspirin) Level</option>
            </optgroup>
            <optgroup label="${tr('Other', 'أخرى')}">
              <option>${tr('Other Specific Test (Specify in details)', 'فحص آخر (حدد في التفاصيل)')}</option>
            </optgroup>
          </select>
        </div>
        <div class="form-group mb-12"><label>${tr('Details', 'التفاصيل')}</label><input class="form-input" id="labDirectDesc"></div>
        <button class="btn btn-success w-full" onclick="sendDirectLab()">🔬 ${tr('Direct Lab Order', 'طلب مباشر')}</button>
      </div>
      <div class="flex-column" style="flex:2">
        <div class="card mb-16">
          <div class="card-title">📊 ${tr('Barcode Scanner', 'قارئ الباركود')}</div>
          <div class="flex gap-8"><input class="form-input" id="labBarcodeInput" placeholder="${tr('Scan barcode or enter order ID...', 'امسح الباركود أو ادخل رقم الطلب...')}" style="flex:3" onkeydown="if(event.key==='Enter')scanLabBarcode()"><button class="btn btn-primary" onclick="scanLabBarcode()" style="flex:1">🔍 ${tr('Search', 'بحث')}</button></div>
          <div id="labScanResult" class="mt-16"></div>
        </div>
        <div class="card">
          <div class="card-title">📋 ${tr('Lab Orders', 'طلبات المختبر')}</div>
          <input class="search-filter" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'labT')">
          <div id="labT"><div class="table-wrapper"><table class="data-table"><thead><tr>
            <th>${tr('Barcode', 'الباركود')}</th><th>${tr('Patient', 'المريض')}</th><th>${tr('Type', 'النوع')}</th><th>${tr('Normal Range', 'المعدل الطبيعي')}</th><th>${tr('Status', 'الحالة')}</th><th>${tr('Date', 'التاريخ')}</th><th>${tr('Report & Results', 'التقرير والنتائج')}</th><th>${tr('Actions', 'إجراءات')}</th>
          </tr></thead><tbody>
          ${orders.length === 0 ? `<tr><td colspan="8" style="text-align:center;padding:30px;color:var(--text-dim)">📭 ${tr('No orders', 'لا توجد طلبات')}</td></tr>` : orders.map(o => {
    const pt = patients.find(p => p.id == o.patient_id);
    const nRange = getLabNormalRange(o.order_type, pt ? pt.gender : ''); return `<tr>
            <td><svg id="labBC${o.id}" class="barcode-svg"></svg><br><button class="btn btn-sm btn-info" onclick="printLabBarcode(${o.id}, '${(o.patient_name || '').replace(/'/g, '\\')}', '${(o.order_type || '').replace(/'/g, '\\')}')" style="margin-top:4px;font-size:11px">🖨️ ${tr('Print', 'طباعة')}</button></td>
            <td>${o.patient_name || ''}</td><td>${o.order_type}</td>
            <td style="font-size:11px;max-width:200px;color:var(--text-dim);white-space:pre-wrap">${nRange || '-'}</td>
            <td>${statusBadge(o.status)}</td><td>${o.created_at ? new Date(o.created_at).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' }) : ''}</td>
            <td>${o.status === 'Done' && o.results ? `<div style="max-width:200px;padding:6px 10px;background:var(--hover);border-radius:6px;font-size:12px;white-space:pre-wrap">${o.results}</div>` : o.status !== 'Requested' ? `<textarea class="form-input form-textarea" id="labRpt${o.id}" rows="2" placeholder="${tr('Write report...', 'اكتب التقرير...')}" style="min-height:60px;font-size:12px">${o.results || ''}</textarea><button class="btn btn-sm btn-primary mt-8" onclick="saveLabReport(${o.id})">💾 ${tr('Save', 'حفظ')}</button>` : `<span style="color:var(--text-dim)">—</span>`}</td>
            <td>${o.status !== 'Done' ? `<button class="btn btn-sm btn-success" onclick="updateLabStatus(${o.id},'${o.status === 'Requested' ? 'In Progress' : 'Done'}')">▶ ${o.status === 'Requested' ? tr('Start', 'بدء') : tr('Complete', 'إتمام')}</button>` : `<span class="badge badge-success">✅</span>`}</td>
          </tr>`;
  }).join('')}
          </tbody></table></div></div>
        </div>
      </div>
    </div>`;
  setTimeout(() => { orders.forEach(o => { try { JsBarcode('#labBC' + o.id, 'LAB-' + o.id + '-' + (o.patient_name || '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 8), { format: 'CODE128', width: 1.2, height: 35, fontSize: 9, displayValue: true, margin: 2, textMargin: 1 }); } catch (e) { } }); }, 100);
}
window.printLabBarcode = (orderId, patientName, testType) => {
  const svgEl = document.getElementById('labBC' + orderId);
  if (!svgEl) { showToast(tr('Barcode not found', 'الباركود غير موجود'), 'error'); return; }
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const printWin = window.open('', '_blank', 'width=450,height=350');
  printWin.document.write(`<!DOCTYPE html><html><head><title>Lab Barcode</title>
    <style>body{font-family:'Segoe UI',Arial,sans-serif;text-align:center;padding:20px;margin:0}
    .label{border:2px solid #333;border-radius:10px;padding:20px;display:inline-block;min-width:300px}
    .clinic{font-size:16px;font-weight:bold;color:#1e40af;margin-bottom:8px}
    .patient{font-size:14px;margin:8px 0;color:#333}
    .test{font-size:13px;color:#666;margin:4px 0}
    .date{font-size:11px;color:#999;margin-top:8px}
    @media print{body{padding:5px}.label{border:2px solid #000}}
    </style></head><body>
    <div class="label">
      <div class="clinic">نما الطبي - Nama Medical</div>
      <div style="margin:10px 0">${svgData}</div>
      <div class="patient">👤 ${patientName}</div>
      <div class="test">🔬 ${testType}</div>
      <div class="date">📅 ${new Date().toLocaleDateString('en-CA')}</div>
    </div>
    <script>setTimeout(()=>{window.print();},300);<\/script></body></html>`);
  printWin.document.close();
};
window.updateLabStatus = async (id, status) => {
  try { await API.put(`/api/lab/orders/${id}`, { status }); showToast(tr('Updated', 'تم التحديث')); await navigateTo(4); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.saveLabReport = async (id) => {
  const rpt = document.getElementById('labRpt' + id).value.trim();
  if (!rpt) { showToast(tr('Write the report first', 'اكتب التقرير أولاً'), 'error'); return; }
  try {
    // Get test name for critical value check
    const orderRow = document.getElementById('labRpt' + id)?.closest('tr') || document.getElementById('labRpt' + id)?.closest('.card');
    const testName = orderRow?.querySelector('td')?.textContent || orderRow?.querySelector('.badge')?.textContent || '';
    const critical = checkCriticalLabValue(testName, rpt);
    if (critical) {
      alert('🚨🔴 ' + tr('CRITICAL VALUE ALERT!', 'تنبيه قيمة حرجة!') + '\n\n' + critical.test + ': ' + critical.value + ' ' + (critical.range.unit || '') + '\n' + tr('Status: ', 'الحالة: ') + critical.status + '\n' + tr('Normal range: ', 'المعدل الطبيعي: ') + critical.range.low + ' - ' + critical.range.high + ' ' + (critical.range.unit || '') + '\n\n' + tr('Please notify the attending physician immediately!', 'يرجى إبلاغ الطبيب المعالج فوراً!'));
    }
    await API.put(`/api/lab/orders/${id}`, { results: rpt });
    showToast(critical ? tr('⚠️ Report saved - CRITICAL VALUE!', '⚠️ تم حفظ التقرير - قيمة حرجة!') : tr('Report saved!', 'تم حفظ التقرير!'), critical ? 'error' : 'success');
    await navigateTo(4);
  }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.sendDirectLab = async () => {
  try {
    await API.post('/api/lab/orders/direct', { patient_id: document.getElementById('labPatientId')?.value || '', order_type: document.getElementById('labDirectType').value, description: document.getElementById('labDirectDesc')?.value || '' });
    showToast(tr('Lab order created!', 'تم إنشاء الطلب!')); await navigateTo(4);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
async function loadPendingPaymentOrders() {
  try {
    const orders = await API.get('/api/orders/pending-payment');
    const container = document.getElementById('pendingPaymentTable');
    if (!container) return;
    if (!orders.length) {
      container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-dim)">✅ ${tr('No pending payment orders', 'لا توجد طلبات بانتظار السداد')}</div>`;
      return;
    }
    container.innerHTML = `<div class="table-wrapper"><table class="data-table"><thead><tr>
      <th>#</th><th>${tr('Patient', 'المريض')}</th><th>${tr('File #', 'رقم الملف')}</th>
      <th>${tr('Dept', 'القسم')}</th><th>${tr('Test/Scan', 'الفحص/الأشعة')}</th>
      <th>${tr('Details', 'التفاصيل')}</th><th>${tr('Date', 'التاريخ')}</th>
      <th>${tr('Action', 'إجراء')}</th>
    </tr></thead><tbody>
    ${orders.map(o => `<tr style="background:${o.is_radiology ? '#fef9c3' : '#dbeafe'}">
      <td>${o.id}</td>
      <td><strong>${o.patient_name || o.name_en || ''}</strong></td>
      <td>${o.file_number || ''}</td>
      <td>${o.is_radiology ? `<span class="badge badge-warning">📡 ${tr('Radiology', 'أشعة')}</span>` : `<span class="badge badge-info">🔬 ${tr('Lab', 'مختبر')}</span>`}</td>
      <td>${o.order_type || ''}</td>
      <td>${o.description || ''}</td>
      <td>${o.created_at?.split('T')[0] || ''}</td>
      <td>
        <button class="btn btn-sm btn-success" onclick="approveOrderPayment(${o.id}, '${(o.patient_name || o.name_en || '').replace(/'/g, "\\'")}', '${(o.order_type || '').replace(/'/g, "\\'")}', ${o.is_radiology})">
          💵 ${tr('Pay & Approve', 'سداد وتحويل')}
        </button>
      </td>
    </tr>`).join('')}
    </tbody></table></div>`;
  } catch (e) { console.error(e); }
}
window.approveOrderPayment = async (orderId, patientName, testType, isRad) => {
  const deptName = isRad ? tr('Radiology', 'الأشعة') : tr('Lab', 'المختبر');
  const price = prompt(`${tr('Enter price for', 'أدخل سعر')} "${testType}" ${tr('for patient', 'للمريض')} ${patientName}:\n(${tr('Enter 0 for free', 'أدخل 0 لو مجاني')})`);
  if (price === null) return;
  const priceNum = parseFloat(price) || 0;
  const payMethod = priceNum > 0 ? (prompt(`${tr('Payment method', 'طريقة السداد')}:\n1 = ${tr('Cash', 'كاش')}\n2 = ${tr('Card/POS', 'شبكة')}\n3 = ${tr('Transfer', 'تحويل')}`) || '1') : '1';
  const methods = { '1': 'Cash', '2': 'Card', '3': 'Transfer' };
  try {
    await API.put(`/api/orders/${orderId}/approve-payment`, { price: priceNum, payment_method: methods[payMethod] || 'Cash' });
    showToast(`✅ ${tr('Paid & sent to', 'تم السداد والتحويل إلى')} ${deptName}!`, 'success');
    loadPendingPaymentOrders();
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.scanLabBarcode = async () => {
  const code = document.getElementById('labBarcodeInput').value.trim(); if (!code) return;
  const m = code.match(/LAB-(\d+)/); const oid = m ? m[1] : code;
  try {
    const orders = await API.get('/api/lab/orders'); const o = orders.find(x => x.id == oid);
    document.getElementById('labScanResult').innerHTML = o ? `<div class="card" style="border:2px solid var(--accent);margin-top:12px"><div class="card-title">🔍 ${tr('Order Found', 'تم العثور على الطلب')} #${o.id}</div><div class="flex gap-8" style="flex-wrap:wrap"><span class="badge badge-info">👤 ${o.patient_name}</span><span class="badge badge-purple">🔬 ${o.order_type}</span>${statusBadge(o.status)}</div>${getLabNormalRange(o.order_type) ? `<div style="margin-top:8px;padding:8px;background:#f0fdf4;border:1px solid #86efac;border-radius:8px;font-size:11px">📊 <strong>${tr('Normal Range', 'المعدل الطبيعي')}:</strong> ${getLabNormalRange(o.order_type)}</div>` : ''}${o.results ? `<div class="mt-16" style="padding:12px;background:var(--hover);border-radius:8px"><strong>${tr('Report:', 'التقرير:')}</strong><br><pre style="white-space:pre-wrap;margin:4px 0 0">${o.results}</pre></div>` : ''}</div>` : `<div class="badge badge-danger mt-16">${tr('Order not found', 'الطلب غير موجود')}</div>`;
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== RADIOLOGY =====
// Helper: parse results for image tags and render them
function renderRadResults(results) {
  if (!results) return '';
  const parts = results.split('\n');
  let html = '';
  parts.forEach(p => {
    const imgMatch = p.match(/\[IMG:(.*?)\]/);
    if (imgMatch) {
      html += `<a href="${imgMatch[1]}" target="_blank"><img src="${imgMatch[1]}" style="width:80px;height:60px;object-fit:cover;border-radius:6px;border:2px solid var(--border);cursor:pointer;margin:2px" title="${tr('Click to enlarge', 'اضغط للتكبير')}"></a>`;
    } else if (p.trim()) {
      html += `<div style="font-size:12px;color:var(--text)">${p}</div>`;
    }
  });
  return html;
}
async function renderRadiology(el) {
  const [orders, patients] = await Promise.all([API.get('/api/radiology/orders'), API.get('/api/patients')]);
  el.innerHTML = `<div class="page-title">📡 ${tr('Radiology', 'الأشعة')}</div>
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-label">${tr('Pending', 'بالانتظار')}</div><div class="stat-value">${orders.filter(o => o.status === 'Requested').length}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('In Progress', 'قيد العمل')}</div><div class="stat-value">${orders.filter(o => o.status === 'In Progress').length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Completed', 'مكتمل')}</div><div class="stat-value">${orders.filter(o => o.status === 'Done').length}</div></div>
    </div>
    <div class="split-layout">
      <div class="card" style="flex:1">
        <div class="card-title">➕ ${tr('Direct Radiology Order', 'إنشاء طلب أشعة')}</div>
        <div class="form-group mb-12"><label>${tr('Select Patient (Optional)', 'اختر مريض (اختياري)')}</label>
          <select class="form-input" id="radPatientId"><option value="">--</option>${patients.map(p => `<option value="${p.id}">${p.name_ar || p.name_en}</option>`).join('')}</select>
        </div>
        <div class="form-group mb-12"><label>${tr('Scan Type', 'نوع الأشعة')}</label>
          <select class="form-input" id="radDirectType">
            <optgroup label="${tr('X-Ray', 'الأشعة السينية')}">
              <option>X-Ray Chest (PA/LAT)</option>
              <option>X-Ray Abdomen (Erect/Supine)</option>
              <option>X-Ray KUB (Kidney, Ureter, Bladder)</option>
              <option>X-Ray Cervical Spine (AP/LAT/Open Mouth)</option>
              <option>X-Ray Thoracic Spine</option>
              <option>X-Ray Lumbar Spine (AP/LAT)</option>
              <option>X-Ray Pelvis (AP)</option>
              <option>X-Ray Skull / Facial Bones / PNS</option>
              <option>X-Ray Shoulder / Clavicle</option>
              <option>X-Ray Arm (Humerus/Radius/Ulna)</option>
              <option>X-Ray Hand / Wrist</option>
              <option>X-Ray Hip/Femur</option>
              <option>X-Ray Knee (AP/LAT/Skyline)</option>
              <option>X-Ray Ankle / Foot</option>
              <option>X-Ray Bone Age</option>
            </optgroup>
            <optgroup label="${tr('Ultrasound', 'الموجات فوق الصوتية / السونار')}">
              <option>Ultrasound Abdomen (Whole)</option>
              <option>Ultrasound Pelvis (Transabdominal/Transvaginal)</option>
              <option>Ultrasound Abdomen & Pelvis</option>
              <option>Ultrasound KUB / Prostate</option>
              <option>Ultrasound Thyroid / Neck</option>
              <option>Ultrasound Breast</option>
              <option>Ultrasound Scrotum / Testicular</option>
              <option>Obstetric Ultrasound (1st Trimester/Viability)</option>
              <option>Obstetric Ultrasound (Anomaly Scan 2nd Trimester)</option>
              <option>Obstetric Ultrasound (Growth 3rd Trimester)</option>
              <option>Folliculometry (Ovulation Tracking)</option>
              <option>Ultrasound Soft Tissue / Swelling</option>
              <option>Doppler Ultrasound - Carotid</option>
              <option>Doppler Ultrasound - Lower Limb Venous (DVT)</option>
              <option>Doppler Ultrasound - Lower Limb Arterial</option>
              <option>Doppler Ultrasound - Renal Artery</option>
              <option>Doppler Ultrasound - Obstetrics / Umbilical Artery</option>
              <option>Echocardiogram (Echo - Heart)</option>
            </optgroup>
            <optgroup label="${tr('CT Scan', 'الأشعة المقطعية')}">
              <option>CT Brain / Head (Without Contrast)</option>
              <option>CT Brain / Head (With Contrast)</option>
              <option>CT PNS (Paranasal Sinuses)</option>
              <option>CT Neck (With Contrast)</option>
              <option>CT Chest (HRCT) Without Contrast</option>
              <option>CT Chest / Lungs (With Contrast)</option>
              <option>CT Abdomen & Pelvis (Without Contrast - Triphasic)</option>
              <option>CT Abdomen & Pelvis (With Contrast)</option>
              <option>CT KUB (Stone Protocol - Non Contrast)</option>
              <option>CT Urography (With Contrast)</option>
              <option>CT Cervical Spine</option>
              <option>CT Lumbar Spine</option>
              <option>CT Angiography - Pulmonary (CTPA)</option>
              <option>CT Angiography - Brain</option>
              <option>CT Angiography - Aorta / Lower Limbs</option>
              <option>CT Virtual Colonoscopy</option>
            </optgroup>
            <optgroup label="${tr('MRI', 'الرنين المغناطيسي')}">
              <option>MRI Brain (Without Contrast)</option>
              <option>MRI Brain (With Contrast)</option>
              <option>MRI Pituitary Fossa</option>
              <option>MRI Cervical Spine</option>
              <option>MRI Thoracic Spine</option>
              <option>MRI Lumbar Spine</option>
              <option>MRI Whole Spine</option>
              <option>MRI Pelvis (Male/Female)</option>
              <option>MRI Prostate (Multiparametric)</option>
              <option>MRI Shoulder Joint</option>
              <option>MRI Knee Joint</option>
              <option>MRI Ankle / Wrist Joint</option>
              <option>MRI Abdomen</option>
              <option>MRCP (Magnetic Resonance Cholangiopancreatography)</option>
              <option>MR Venography (MRV)</option>
              <option>MRA (Magnetic Resonance Angiography) - Brain</option>
            </optgroup>
            <optgroup label="${tr('Specialized Imaging & Scans', 'تصوير متخصص والمناظير')}">
              <option>Mammogram (Bilateral/Unilateral)</option>
              <option>DEXA Scan (Bone Density)</option>
              <option>Fluoroscopy - Barium Swallow</option>
              <option>Fluoroscopy - Barium Meal / Follow Through</option>
              <option>Fluoroscopy - Barium Enema</option>
              <option>Fluoroscopy - HSG (Hysterosalpingography)</option>
              <option>Fluoroscopy - IVP (Intravenous Pyelogram)</option>
              <option>Panoramic Dental X-Ray (OPG)</option>
              <option>Cephalometric X-Ray</option>
              <option>CBCT (Cone Beam CT for Dentistry)</option>
              <option>PET Scan (Positron Emission Tomography)</option>
            </optgroup>
            <optgroup label="${tr('Cardiology & Neuro', 'قلب وأعصاب وأجهزة أخرى')}">
              <option>ECG (Electrocardiogram)</option>
              <option>Holter Monitor (24/48 Hours)</option>
              <option>Ambulatory Blood Pressure Monitoring (ABPM)</option>
              <option>Treadmill Stress Test (TMT)</option>
              <option>EEG (Electroencephalogram)</option>
              <option>EMG (Electromyography) / NCS</option>
              <option>Spirometry / Lung Function Test</option>
              <option>Upper GI Endoscopy (OGD)</option>
              <option>Colonoscopy</option>
            </optgroup>
            <optgroup label="${tr('Other', 'أخرى')}">
              <option>${tr('Other Scan (Specify in details)', 'تصوير آخر (حدد في التفاصيل)')}</option>
            </optgroup>
          </select>
        </div>
        <div class="form-group mb-12"><label>${tr('Details', 'التفاصيل')}</label><input class="form-input" id="radDirectDesc"></div>
        <button class="btn btn-success w-full" onclick="sendDirectRad()">📡 ${tr('Send to Radiology', 'إنشاء الطلب')}</button>
      </div>
      <div class="flex-column" style="flex:2">
        <div class="card mb-16">
          <div class="card-title">📊 ${tr('Barcode Scanner', 'قارئ الباركود')}</div>
          <div class="flex gap-8"><input class="form-input" id="radBarcodeInput" placeholder="${tr('Scan barcode or enter order ID...', 'امسح الباركود أو ادخل رقم الطلب...')}" style="flex:3" onkeydown="if(event.key==='Enter')scanRadBarcode()"><button class="btn btn-primary" onclick="scanRadBarcode()" style="flex:1">🔍 ${tr('Search', 'بحث')}</button></div>
          <div id="radScanResult" class="mt-16"></div>
        </div>
        <div class="card">
          <div class="card-title">📋 ${tr('Radiology Orders', 'طلبات الأشعة')}</div>
          <input class="search-filter" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'radT')">
          <div id="radT"><div class="table-wrapper"><table class="data-table"><thead><tr>
            <th>${tr('Barcode', 'الباركود')}</th><th>${tr('Patient', 'المريض')}</th><th>${tr('Type', 'النوع')}</th><th>${tr('Status', 'الحالة')}</th><th>${tr('Date', 'التاريخ')}</th><th>${tr('Report & Images', 'التقرير والصور')}</th><th>${tr('Actions', 'إجراءات')}</th>
          </tr></thead><tbody>
          ${orders.length === 0 ? `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-dim)">📭 ${tr('No orders', 'لا توجد طلبات')}</td></tr>` : orders.map(o => `<tr>
            <td><svg id="radBC${o.id}" class="barcode-svg"></svg></td>
            <td>${o.patient_name || ''}</td><td>${o.order_type}</td>
            <td>${statusBadge(o.status)}</td><td>${o.created_at?.split('T')[0] || ''}</td>
            <td>
              ${o.status === 'Done' ? `<div style="max-width:250px">${renderRadResults(o.results)}</div>` :
      o.status !== 'Requested' ? `
                <textarea class="form-input form-textarea" id="radRpt${o.id}" rows="2" placeholder="${tr('Write report...', 'اكتب التقرير...')}" style="min-height:50px;font-size:12px">${(o.results || '').replace(/\[IMG:.*?\]\n?/g, '')}</textarea>
                <div class="flex gap-8 mt-8">
                  <button class="btn btn-sm btn-primary" onclick="saveRadReport(${o.id})">💾 ${tr('Save', 'حفظ')}</button>
                  <label class="btn btn-sm btn-success" style="cursor:pointer">📷 ${tr('Upload Image', 'رفع صورة')}<input type="file" accept="image/*" style="display:none" onchange="uploadRadImage(${o.id}, this)"></label>
                </div>
                <div class="mt-8">${renderRadResults(o.results)}</div>` : `<span style="color:var(--text-dim)">—</span>`}
            </td>
            <td>${o.status !== 'Done' ? `<button class="btn btn-sm btn-success" onclick="updateRadStatus(${o.id},'${o.status === 'Requested' ? 'In Progress' : 'Done'}')">▶ ${o.status === 'Requested' ? tr('Start', 'بدء') : tr('Complete', 'إتمام')}</button>` : `<span class="badge badge-success">✅</span>`}</td>
          </tr>`).join('')}
          </tbody></table></div></div>
        </div>
      </div>
    </div>`;
  setTimeout(() => { orders.forEach(o => { try { JsBarcode('#radBC' + o.id, 'RAD-' + o.id + '-' + (o.patient_name || '').replace(/[^a-zA-Z0-9]/g, '').substring(0, 8), { format: 'CODE128', width: 1.2, height: 35, fontSize: 9, displayValue: true, margin: 2, textMargin: 1 }); } catch (e) { } }); }, 100);
}
window.updateRadStatus = async (id, status) => {
  try { await API.put(`/api/radiology/orders/${id}`, { status }); showToast(tr('Updated', 'تم التحديث')); await navigateTo(5); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.saveRadReport = async (id) => {
  const rpt = document.getElementById('radRpt' + id).value.trim();
  if (!rpt) { showToast(tr('Write the report first', 'اكتب التقرير أولاً'), 'error'); return; }
  try { await API.put(`/api/radiology/orders/${id}`, { result: rpt }); showToast(tr('Report saved!', 'تم حفظ التقرير!')); await navigateTo(5); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.uploadRadImage = async (id, input) => {
  if (!input.files[0]) return;
  const fd = new FormData();
  fd.append('image', input.files[0]);
  try {
    const res = await fetch(`/api/radiology/orders/${id}/upload`, { method: 'POST', body: fd, credentials: 'same-origin' });
    if (res.status === 401) { window.location.href = '/login.html'; return; }
    const data = await res.json();
    if (data.success) { showToast(tr('Image uploaded!', 'تم رفع الصورة!')); await navigateTo(5); }
    else showToast(tr('Upload failed', 'فشل الرفع'), 'error');
  } catch (e) { showToast(tr('Error uploading', 'خطأ في الرفع'), 'error'); }
};
window.scanRadBarcode = async () => {
  const code = document.getElementById('radBarcodeInput').value.trim(); if (!code) return;
  const m = code.match(/RAD-(\d+)/); const oid = m ? m[1] : code;
  try {
    const orders = await API.get('/api/radiology/orders'); const o = orders.find(x => x.id == oid);
    document.getElementById('radScanResult').innerHTML = o ? `<div class="card" style="border:2px solid var(--accent);margin-top:12px"><div class="card-title">🔍 ${tr('Order Found', 'تم العثور على الطلب')} #${o.id}</div><div class="flex gap-8" style="flex-wrap:wrap"><span class="badge badge-info">👤 ${o.patient_name}</span><span class="badge badge-purple">📡 ${o.order_type}</span>${statusBadge(o.status)}</div>${o.results ? `<div class="mt-16">${renderRadResults(o.results)}</div>` : ''}</div>` : `<div class="badge badge-danger mt-16">${tr('Order not found', 'الطلب غير موجود')}</div>`;
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== PHARMACY =====
async function renderPharmacy(el) {
  const [drugs, queue] = await Promise.all([API.get('/api/pharmacy/drugs'), API.get('/api/pharmacy/queue')]);
  // Helper to find drug price from catalog
  const findDrugPrice = (medName) => {
    if (!medName) return 0;
    const d = drugs.find(x => x.drug_name && medName.toLowerCase().includes(x.drug_name.toLowerCase()));
    return d ? (d.selling_price || 0) : 0;
  };
  el.innerHTML = `<div class="page-title">💊 ${tr('Pharmacy', 'الصيدلية')}</div>
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-label">${tr('Pending Prescriptions', 'وصفات بالانتظار')}</div><div class="stat-value">${queue.filter(q => q.status === 'Pending').length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Dispensed Today', 'تم صرفها')}</div><div class="stat-value">${queue.filter(q => q.status === 'Dispensed').length}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('Total Drugs', 'إجمالي الأدوية')}</div><div class="stat-value">${drugs.length}</div></div>
    </div>
    <div class="card mb-16"><div class="card-title">📜 ${tr('Prescription Queue', 'قائمة الوصفات')}</div>
    <div id="rxQueue"><div class="table-wrapper"><table class="data-table"><thead><tr>
      <th>${tr('Barcode', 'الباركود')}</th><th>${tr('Patient', 'المريض')}</th><th>${tr('Prescription', 'الوصفة')}</th><th>${tr('Price', 'السعر')}</th><th>${tr('Status', 'الحالة')}</th><th>${tr('Date', 'التاريخ')}</th><th>${tr('Actions', 'إجراءات')}</th>
    </tr></thead><tbody>
    ${queue.length === 0 ? `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-dim)">📭 ${tr('No prescriptions', 'لا توجد وصفات')}</td></tr>` : queue.map(q => {
    // Use individual columns if available, fallback to text parsing
    const txt = q.prescription_text || '';
    let parts = txt.includes(' | ') ? txt.split(' | ') : txt.split(' - ');
    const med = (q.medication_name && q.medication_name.trim()) || parts[0] || '';
    const dose = (q.dosage && q.dosage.trim()) || parts[1] || '';
    const qty = (q.quantity_per_day && q.quantity_per_day !== '1' && q.quantity_per_day.trim()) || '1';
    const freq = (q.frequency && q.frequency.trim()) || parts[2] || '';
    const dur = (q.duration && q.duration.trim()) || parts[3] || '';
    const autoPrice = q.price > 0 ? q.price : findDrugPrice(med);
    return `<tr>
        <td><svg id="rxBC${q.id}" class="barcode-svg"></svg><br>
          <button class="btn btn-sm btn-info" onclick="printRxLabel(${q.id}, '${(q.patient_name || '').replace(/'/g, "\\'")}', '${(q.age || '').toString().replace(/'/g, "\\'")}', '${(q.department || '').replace(/'/g, "\\'")}', '${med.replace(/'/g, "\\'")}', '${dose.replace(/'/g, "\\'")}', '${qty.toString().replace(/'/g, "\\'")}', '${freq.replace(/'/g, "\\'")}', '${dur.replace(/'/g, "\\'")}')" style="margin-top:4px;font-size:11px">🖨️ ${tr('Print Label', 'طباعة')}</button>
        </td>
        <td><strong>${q.patient_name || '#' + q.patient_id}</strong>${q.age ? '<br><small>🎂 ' + q.age + '</small>' : ''}${q.department ? '<br><small>🏥 ' + q.department + '</small>' : ''}</td>
        <td><strong>${med}</strong>${dose ? '<br>💊 ' + dose : ''}${freq ? '<br>🔄 ' + freq : ''}${dur ? '<br>📅 ' + dur : ''}</td>
        <td style="font-weight:bold;color:var(--accent)">${autoPrice > 0 ? autoPrice + ' ' + tr('SAR', 'ر.س') : '-'}</td>
        <td>${statusBadge(q.status)}</td>
        <td>${q.created_at?.split('T')[0] || ''}</td>
        <td>${q.status === 'Pending' ? `<button class="btn btn-sm btn-success" onclick="showDispensePanel(${q.id}, '${(q.patient_name || '').replace(/'/g, "\\'")}', '${med.replace(/'/g, "\\'")}', '${dose.replace(/'/g, "\\'")}', '${qty.toString().replace(/'/g, "\\'")}', '${freq.replace(/'/g, "\\'")}', '${dur.replace(/'/g, "\\'")}', ${q.patient_id || 0}, ${autoPrice}, '${(q.age || '').toString().replace(/'/g, "\\'")}', '${(q.department || '').replace(/'/g, "\\'")}')">💵 ${tr('Dispense & Sell', 'صرف وبيع')}</button>` : `<button class="btn btn-sm btn-info" onclick="printPharmacyInvoice(${q.id}, '${(q.patient_name || '').replace(/'/g, "\\'")}', '${med.replace(/'/g, "\\'")}', '${dose.replace(/'/g, "\\'")}', '${freq.replace(/'/g, "\\'")}', '${dur.replace(/'/g, "\\'")}', ${q.price || 0}, '${(q.payment_method || '').replace(/'/g, "\\'")}')">🧾 ${tr('Print Invoice', 'طباعة فاتورة')}</button>`}</td>
      </tr>`;
  }).join('')}
    </tbody></table></div></div>
    <div id="dispensePanel" style="display:none"></div>
    </div>
    <div class="card mb-16"><div class="card-title">💊 ${tr('Drug Catalog', 'قائمة الأدوية')}</div>
    <div class="flex gap-8 mb-12"><input class="form-input" id="phName" placeholder="${tr('Drug name', 'اسم الدواء')}" style="flex:2"><input class="form-input" id="phPrice" placeholder="${tr('Price', 'السعر')}" type="number" style="flex:1"><input class="form-input" id="phStock" placeholder="${tr('Stock', 'المخزون')}" type="number" style="flex:1"><button class="btn btn-primary" onclick="addDrug()">➕</button></div>
    <input class="search-filter" placeholder="${tr('Search drugs...', 'بحث في الأدوية...')}" oninput="filterTable(this,'phTable')">
    <div id="phTable">${makeTable([tr('Name', 'الاسم'), tr('Category', 'التصنيف'), tr('Price', 'السعر'), tr('Stock', 'المخزون')], drugs.map(d => ({ cells: [d.drug_name, d.category, d.selling_price, d.stock_qty] })))}</div></div>`;
  // Generate barcodes for prescriptions
  setTimeout(() => { queue.forEach(q => { try { JsBarcode('#rxBC' + q.id, 'RX-' + q.id, { format: 'CODE128', width: 1.2, height: 35, fontSize: 9, displayValue: true, margin: 2, textMargin: 1 }); } catch (e) { } }); }, 100);
}
window.printRxLabel = (rxId, patientName, age, dept, med, dose, qty, freq, dur) => {
  const svgEl = document.getElementById('rxBC' + rxId);
  const svgData = svgEl ? new XMLSerializer().serializeToString(svgEl) : '';
  // Clean dose field from embedded qty if present
  const pureDose = dose.replace(/\s*\(×\d+\)/, '').trim();
  const w = window.open('', '_blank', 'width=520,height=500');
  w.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>Rx Label</title>
<style>
@page{size:80mm auto;margin:3mm}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Tahoma,Arial,sans-serif;padding:10px;direction:rtl;font-size:13px}
.label{border:2px solid #333;border-radius:10px;padding:14px;max-width:420px;margin:0 auto}
.clinic{font-size:15px;font-weight:bold;color:#1a365d;text-align:center;margin-bottom:8px;border-bottom:2px solid #1a365d;padding-bottom:6px}
.barcode-area{text-align:center;margin:8px 0;direction:ltr}
.info-grid{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;font-size:12px;margin:8px 0;padding:8px;background:#f7f8fa;border-radius:8px}
.info-grid .lk{font-weight:700;color:#1a365d;white-space:nowrap}
.med-table{width:100%;border-collapse:collapse;margin:10px 0;font-size:11px}
.med-table th{background:#1a365d;color:#fff;padding:5px 4px;text-align:center;font-size:10px}
.med-table td{border:1px solid #ccc;padding:5px 4px;text-align:center;font-weight:600}
.footer{text-align:center;font-size:10px;color:#999;margin-top:8px;border-top:1px dashed #ccc;padding-top:6px}
.no-print{text-align:center;margin-bottom:12px}
@media print{.no-print{display:none!important}body{padding:2px}}
</style></head><body>
<div class="no-print">
  <button onclick="window.print()" style="padding:10px 30px;font-size:14px;background:#1a365d;color:#fff;border:none;border-radius:8px;cursor:pointer">🖨️ طباعة / Print</button>
  <button onclick="window.close()" style="padding:10px 20px;font-size:14px;background:#dc3545;color:#fff;border:none;border-radius:8px;cursor:pointer;margin-right:8px">✕</button>
</div>
<div class="label">
  <div class="clinic">💊 نما الطبي — الصيدلية<br><small style="font-size:11px;color:#666">Nama Medical — Pharmacy</small></div>
  <div class="barcode-area">${svgData}</div>
  <div class="info-grid">
    <span class="lk">👤 المريض / Patient:</span><span>${patientName}</span>
    <span class="lk">🎂 العمر / Age:</span><span>${age || '-'}</span>
    <span class="lk">🏥 القسم / Dept:</span><span>${dept || '-'}</span>
    <span class="lk">📅 التاريخ / Date:</span><span>${new Date().toLocaleDateString('ar-SA')}</span>
  </div>
  <table class="med-table">
    <thead><tr>
      <th>💊 الدواء<br>Drug</th>
      <th>📏 الجرعة<br>Dose</th>
      <th>💊 الكمية/يوم<br>Qty/Day</th>
      <th>🔄 المرات<br>Freq</th>
      <th>📅 الأيام<br>Days</th>
    </tr></thead>
    <tbody><tr>
      <td style="font-size:12px;color:#4338ca">${med}</td>
      <td>${pureDose || '-'}</td>
      <td style="font-size:14px;font-weight:bold;color:#e74c3c">${qty}</td>
      <td>${freq || '-'}</td>
      <td>${dur || '-'}</td>
    </tr></tbody>
  </table>
  <div class="footer">Rx #${rxId} | ${new Date().toLocaleDateString('en-CA')} | نما الطبي</div>
</div>
<script>setTimeout(()=>{window.print();},400);<\\/script>
</body></html>`);
  w.document.close();
};
window.showDispensePanel = (id, patientName, med, dose, qty, freq, dur, patientId, autoPrice, age, dept) => {
  const panel = document.getElementById('dispensePanel');
  panel.style.display = 'block';
  panel.innerHTML = `<div class="card mt-16" style="border:2px solid var(--accent);background:var(--hover)">
    <div class="card-title">💵 ${tr('Confirm Dispense & Sale', 'تأكيد الصرف والبيع')} — RX-${id}</div>
    <div class="flex gap-16" style="flex-wrap:wrap;align-items:flex-end">
      <div style="flex:1;min-width:150px">
        <div style="font-size:13px;margin-bottom:4px"><strong>👤 ${tr('Patient', 'المريض')}:</strong> ${patientName}</div>
        <div style="font-size:13px"><strong>💊 ${tr('Drug', 'الدواء')}:</strong> ${med} ${dose ? '— ' + dose : ''}</div>
        <div style="font-size:13px"><strong>📦 ${tr('Qty/Day', 'الكمية/يوم')}:</strong> ${qty} | <strong>🔄</strong> ${freq} | <strong>📅</strong> ${dur}</div>
      </div>
      <div class="form-group" style="flex:0.5;min-width:120px">
        <label>${tr('Price', 'السعر')} (${tr('SAR', 'ر.س')})</label>
        <input class="form-input" id="dispPrice" type="number" value="${autoPrice}" min="0" step="0.5" style="font-size:16px;font-weight:bold;text-align:center">
      </div>
      <div class="form-group" style="flex:1;min-width:250px">
        <label>${tr('Payment Method', 'طريقة السداد')}</label>
        <div class="flex gap-16" style="margin-top:6px">
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:14px"><input type="radio" name="dispPay" value="Cash" checked style="width:18px;height:18px;accent-color:var(--accent,#6c5ce7)"> 💵 ${tr('Cash', 'كاش')}</label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:14px"><input type="radio" name="dispPay" value="Card" style="width:18px;height:18px;accent-color:var(--accent,#6c5ce7)"> 💳 ${tr('POS/Card', 'شبكة')}</label>
          <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:14px"><input type="radio" name="dispPay" value="Transfer" style="width:18px;height:18px;accent-color:var(--accent,#6c5ce7)"> 🏦 ${tr('Transfer', 'تحويل')}</label>
        </div>
      </div>
      <div class="flex gap-8">
        <button class="btn btn-success" onclick="confirmDispense(${id}, '${patientName.replace(/'/g, "\\'")}', '${med.replace(/'/g, "\\'")}', '${dose.replace(/'/g, "\\'")}', '${qty.toString().replace(/'/g, "\\'")}', '${freq.replace(/'/g, "\\'")}', '${dur.replace(/'/g, "\\'")}', ${patientId}, '${(age || '').toString().replace(/'/g, "\\'")}', '${(dept || '').replace(/'/g, "\\'")}')">✅ ${tr('Confirm & Print', 'تأكيد وطباعة')}</button>
        <button class="btn btn-danger" onclick="document.getElementById('dispensePanel').style.display='none'">✕ ${tr('Cancel', 'إلغاء')}</button>
      </div>
    </div>
  </div>`;
  panel.scrollIntoView({ behavior: 'smooth' });
};
window.confirmDispense = async (id, patientName, med, dose, qty, freq, dur, patientId, age, dept) => {
  const priceNum = parseFloat(document.getElementById('dispPrice').value) || 0;
  const payMethod = document.querySelector('input[name="dispPay"]:checked')?.value || 'Cash';
  try {
    await API.put(`/api/pharmacy/queue/${id}`, { status: 'Dispensed', price: priceNum, payment_method: payMethod, patient_id: patientId });
    // Auto-create invoice for pharmacy sale
    if (priceNum > 0) {
      try { await API.post('/api/invoices', { patient_id: patientId, patient_name: patientName, total: priceNum, description: med + (dose ? ' ' + dose : '') + ' - ' + freq + ' - ' + dur, service_type: 'Pharmacy', payment_method: payMethod }); } catch(ie) { console.log('Invoice error:', ie); }
    }
    showToast(`✅ ${tr('Dispensed & sold!', 'تم الصرف والبيع!')} ${priceNum > 0 ? priceNum + ' ' + tr('SAR', 'ر.س') : tr('Free', 'مجاني')}`, 'success');
    // Auto-print barcode label with all doctor data
    printRxLabel(id, patientName, age, dept, med, dose, qty, freq, dur);
    // Auto-print invoice
    setTimeout(() => { printPharmacyInvoice(id, patientName, med, dose, freq, dur, priceNum, payMethod); }, 800);
    setTimeout(() => navigateTo(6), 1200);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.printPharmacyInvoice = (rxId, patientName, med, dose, freq, dur, price, payMethod) => {
  const w = window.open('', '_blank', 'width=500,height=600');
  const payAr = payMethod === 'Card' ? 'شبكة' : payMethod === 'Transfer' ? 'تحويل' : 'كاش';
  w.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>Pharmacy Invoice</title>
<style>
@page{size:80mm auto;margin:3mm}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Tahoma,Arial,sans-serif;padding:10px;direction:rtl;font-size:13px}
.inv{border:2px solid #333;border-radius:10px;padding:16px;max-width:400px;margin:0 auto}
.header{text-align:center;border-bottom:2px solid #1a365d;padding-bottom:8px;margin-bottom:10px}
.header h2{color:#1a365d;margin:0;font-size:16px}
.header small{color:#666;font-size:11px}
.row{display:flex;justify-content:space-between;padding:4px 0;font-size:12px;border-bottom:1px dotted #ddd}
.row .k{font-weight:700;color:#1a365d}
.med-tbl{width:100%;border-collapse:collapse;margin:10px 0;font-size:12px}
.med-tbl th{background:#1a365d;color:#fff;padding:6px;text-align:center}
.med-tbl td{border:1px solid #ccc;padding:6px;text-align:center;font-weight:600}
.total-box{background:#eef2ff;border:2px solid #6366f1;border-radius:8px;padding:10px;text-align:center;margin:10px 0;font-size:16px;font-weight:bold;color:#4338ca}
.footer{text-align:center;font-size:10px;color:#999;margin-top:10px;border-top:1px dashed #ccc;padding-top:6px}
.no-print{text-align:center;margin-bottom:12px}
@media print{.no-print{display:none!important}body{padding:2px}}
</style></head><body>
<div class="no-print">
  <button onclick="window.print()" style="padding:10px 30px;font-size:14px;background:#1a365d;color:#fff;border:none;border-radius:8px;cursor:pointer">🖨️ طباعة / Print</button>
  <button onclick="window.close()" style="padding:10px 20px;font-size:14px;background:#dc3545;color:#fff;border:none;border-radius:8px;cursor:pointer;margin-right:8px">✕</button>
</div>
<div class="inv">
  <div class="header"><h2>🏥 نما الطبي — فاتورة صيدلية</h2><small>Nama Medical — Pharmacy Invoice</small></div>
  <div class="row"><span class="k">📄 رقم الفاتورة:</span><span>RX-${rxId}</span></div>
  <div class="row"><span class="k">👤 المريض:</span><span>${patientName}</span></div>
  <div class="row"><span class="k">📅 التاريخ:</span><span>${new Date().toLocaleDateString('ar-SA')} — ${new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</span></div>
  <table class="med-tbl">
    <thead><tr><th>💊 الدواء</th><th>📏 الجرعة</th><th>🔄 المرات/يوم</th><th>📅 الأيام</th></tr></thead>
    <tbody><tr><td>${med}</td><td>${dose || '-'}</td><td>${freq || '-'}</td><td>${dur || '-'}</td></tr></tbody>
  </table>
  <div class="total-box">💰 الإجمالي: ${price || 0} ر.س</div>
  <div class="row"><span class="k">💳 طريقة الدفع:</span><span>${payAr} (${payMethod || 'Cash'})</span></div>
  <div class="row"><span class="k">✅ الحالة:</span><span style="color:green;font-weight:bold">مدفوع — Paid</span></div>
  <div class="footer">نما الطبي | ${new Date().toLocaleDateString('en-CA')} | شكراً لكم</div>
</div>
<script>setTimeout(()=>{window.print();},400);<\\/script>
</body></html>`);
  w.document.close();
};
window.addDrug = async () => {
  const name = document.getElementById('phName').value.trim();
  if (!name) { showToast(tr('Enter drug name', 'ادخل اسم الدواء'), 'error'); return; }
  try {
    await API.post('/api/pharmacy/drugs', { drug_name: name, selling_price: document.getElementById('phPrice').value, stock_qty: document.getElementById('phStock').value });
    showToast(tr('Drug added!', 'تمت الإضافة!'));
    await navigateTo(6);
  } catch (e) { showToast(tr('Error adding', 'خطأ في الإضافة'), 'error'); }
};

// ===== HR =====
async function renderHR(el) {
  const emps = await API.get('/api/employees');
  el.innerHTML = `<div class="page-title">🏢 ${tr('Human Resources', 'الموارد البشرية')}</div>
    <div class="card mb-16"><div class="card-title">👥 ${tr('Employees', 'الموظفين')}</div>
    <div class="flex gap-8 mb-12">
      <input class="form-input" id="hrNameAr" placeholder="${tr('Arabic name', 'الاسم بالعربية')}" style="flex:1.5">
      <input class="form-input" id="hrNameEn" placeholder="${tr('English name', 'الاسم بالإنجليزية')}" style="flex:1.5">
      <select class="form-input" id="hrRole" style="flex:1"><option>Staff</option><option>Doctor</option><option>Nurse</option><option>Admin</option><option>Receptionist</option></select>
      <select class="form-input" id="hrDept" style="flex:1.5">
        <option value="" data-ar="بدون قسم">-- ${tr('Department', 'القسم')} --</option>
        <optgroup label="${tr('Medical Departments', 'الأقسام الطبية')}">
          <option value="General Practice" data-ar="الطب العام">${tr('General Practice', 'الطب العام')}</option>
          <option value="Dentistry" data-ar="طب الأسنان">${tr('Dentistry', 'طب الأسنان')}</option>
          <option value="Endocrinology & Diabetes" data-ar="الغدد الصماء والسكري">${tr('Endocrinology & Diabetes', 'الغدد الصماء والسكري')}</option>
          <option value="Pediatrics" data-ar="طب الأطفال">${tr('Pediatrics', 'طب الأطفال')}</option>
          <option value="Orthopedics" data-ar="جراحة العظام">${tr('Orthopedics', 'جراحة العظام')}</option>
          <option value="Dermatology" data-ar="الجلدية">${tr('Dermatology', 'الجلدية')}</option>
          <option value="ENT" data-ar="الأنف والأذن والحنجرة">${tr('ENT', 'الأنف والأذن والحنجرة')}</option>
          <option value="Ophthalmology" data-ar="العيون">${tr('Ophthalmology', 'العيون')}</option>
          <option value="Cardiology" data-ar="القلب">${tr('Cardiology', 'القلب')}</option>
          <option value="Internal Medicine" data-ar="الباطنية">${tr('Internal Medicine', 'الباطنية')}</option>
          <option value="Obstetrics & Gynecology" data-ar="النساء والولادة">${tr('Obstetrics & Gynecology', 'النساء والولادة')}</option>
          <option value="Neurology" data-ar="المخ والأعصاب">${tr('Neurology', 'المخ والأعصاب')}</option>
          <option value="Psychiatry" data-ar="الطب النفسي">${tr('Psychiatry', 'الطب النفسي')}</option>
        </optgroup>
        <optgroup label="${tr('Other Departments', 'أقسام أخرى')}">
          <option value="Radiology" data-ar="الأشعة">${tr('Radiology', 'الأشعة')}</option>
          <option value="Laboratory" data-ar="المختبر">${tr('Laboratory', 'المختبر')}</option>
          <option value="Administration" data-ar="الإدارة">${tr('Administration', 'الإدارة')}</option>
          <option value="Reception" data-ar="الاستقبال">${tr('Reception', 'الاستقبال')}</option>
          <option value="Pharmacy" data-ar="الصيدلية">${tr('Pharmacy', 'الصيدلية')}</option>
        </optgroup>
      </select>
      <input class="form-input" id="hrSalary" placeholder="${tr('Salary', 'الراتب')}" type="number" style="flex:1">
      <button class="btn btn-primary" onclick="addEmp()">➕</button>
    </div>
    <div class="flex gap-8 mb-12" id="hrCommRow" style="display:none">
      <select class="form-input" id="hrCommType" style="flex:1">
        <option value="percentage">💰 ${tr('Commission %', 'عمولة %')}</option>
        <option value="fixed">💰 ${tr('Fixed per Patient', 'مبلغ ثابت/مريض')}</option>
      </select>
      <input class="form-input" id="hrCommValue" placeholder="${tr('Commission Value', 'قيمة العمولة')}" type="number" step="0.5" value="0" style="flex:1">
    </div>
    <div id="hrTable">${makeTable([tr('Name', 'الاسم'), tr('Role', 'الوظيفة'), tr('Department', 'القسم'), tr('Salary', 'الراتب'), tr('Commission', 'العمولة'), tr('Status', 'الحالة'), tr('Delete', 'حذف')], emps.map(e => ({ cells: [isArabic ? e.name_ar : e.name_en, e.role, isArabic ? e.department_ar : e.department_en, e.salary?.toLocaleString(), e.role === 'Doctor' ? `${e.commission_value || 0}${e.commission_type === 'percentage' ? '%' : ' SAR'}` : '-', statusBadge(e.status)], id: e.id })), r => `<button class="btn btn-danger btn-sm" onclick="delEmp(${r.id})">🗑</button>`)}</div></div>`;
  // Show/hide commission row when role changes
  const hrRoleEl = document.getElementById('hrRole');
  const showCommRow = () => { document.getElementById('hrCommRow').style.display = hrRoleEl.value === 'Doctor' ? 'flex' : 'none'; };
  hrRoleEl.addEventListener('change', showCommRow);
  showCommRow(); // Check on page load
}
window.addEmp = async () => {
  const nameEn = document.getElementById('hrNameEn').value.trim();
  const nameAr = document.getElementById('hrNameAr').value.trim();
  const deptSel = document.getElementById('hrDept');
  const opt = deptSel.options[deptSel.selectedIndex];

  if (!nameEn && !nameAr) { showToast(tr('Enter employee name', 'ادخل اسم الموظف'), 'error'); return; }
  try {
    const role = document.getElementById('hrRole').value;
    const commType = role === 'Doctor' ? (document.getElementById('hrCommType')?.value || 'percentage') : 'percentage';
    const commValue = role === 'Doctor' ? (parseFloat(document.getElementById('hrCommValue')?.value) || 0) : 0;
    await API.post('/api/employees', {
      name_ar: nameAr,
      name_en: nameEn,
      role,
      department_en: deptSel.value,
      department_ar: opt ? (opt.getAttribute('data-ar') || '') : '',
      salary: document.getElementById('hrSalary').value,
      commission_type: commType,
      commission_value: commValue
    });
    showToast(tr('Employee added!', 'تمت الإضافة!'));
    await navigateTo(7);
  } catch (e) { showToast(tr('Error adding', 'خطأ في الإضافة'), 'error'); }
};
window.delEmp = async (id) => {
  if (!confirm(tr('Delete this employee?', 'حذف هذا الموظف؟'))) return;
  try { await API.del(`/api/employees/${id}`); showToast(tr('Deleted', 'تم الحذف')); await navigateTo(7); }
  catch (e) { showToast(tr('Error deleting', 'خطأ في الحذف'), 'error'); }
};

// ===== FINANCE =====
async function renderFinance(el) {
  const [invoices, patients] = await Promise.all([API.get('/api/invoices'), API.get('/api/patients')]);
  const total = invoices.reduce((s, i) => s + (i.total || 0), 0);
  const paid = invoices.filter(i => i.paid).reduce((s, i) => s + (i.total || 0), 0);
  el.innerHTML = `<div class="page-title">💰 ${tr('Finance & Accounting', 'المالية والمحاسبة')}</div>
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('Total Invoices', 'إجمالي الفواتير')}</div><div class="stat-value">${total.toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Paid', 'المدفوع')}</div><div class="stat-value">${paid.toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#f87171"><div class="stat-label">${tr('Outstanding', 'المتبقي')}</div><div class="stat-value">${(total - paid).toLocaleString()} SAR</div></div>
    </div>
    <div class="card mb-16"><div class="card-title">🧾 ${tr('Generate Invoice', 'إصدار فاتورة')}</div>
      <div class="flex gap-8 mb-12">
        <select class="form-input" id="invPatient" style="flex:2">${patients.map(p => `<option value="${p.id}">${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)}</option>`).join('')}</select>
        <input class="form-input" id="invDesc" placeholder="${tr('Service description', 'وصف الخدمة')}" style="flex:2">
        <input class="form-input" id="invAmt" placeholder="${tr('Amount', 'المبلغ')}" type="number" style="flex:1">
        <button class="btn btn-primary" onclick="generateInvoice()">🧾 ${tr('Issue', 'إصدار')}</button>
      </div>
    </div>
    <div class="card"><div class="card-title">📋 ${tr('Invoices', 'الفواتير')}</div>
    <input class="search-filter" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'finTable')">
    <div id="finTable">${makeTable(
    [tr('Patient', 'المريض'), tr('Description', 'الوصف'), tr('Total', 'الإجمالي'), tr('Status', 'الحالة'), tr('Date', 'التاريخ'), tr('Actions', 'إجراءات')],
    invoices.map(i => ({ cells: [i.patient_name, i.description || '', `${i.total} SAR`, i.paid ? badge(tr('Paid', 'مدفوع'), 'success') : badge(tr('Unpaid', 'غير مدفوع'), 'danger'), i.created_at?.split('T')[0] || ''], id: i.id, paid: i.paid })),
    (row) => !row.paid ? `<button class="btn btn-sm btn-success" onclick="payInvoice(${row.id})">💵 ${tr('Pay', 'تسديد')}</button>` : `<span class="badge badge-success">✅</span>`
  )}</div></div>
    <div class="card mt-16">
      <div class="card-title">🔒 ${tr('Daily Cash Close', 'الإغلاق اليومي')}</div>
      <div class="flex gap-8 mb-12">
        <div class="form-group" style="flex:1"><label>${tr('Opening Balance', 'الرصيد الافتتاحي')}</label><input class="form-input" id="dcOpen" type="number" placeholder="0"></div>
        <div class="form-group" style="flex:1"><label>${tr('Closing Balance', 'الرصيد الختامي')}</label><input class="form-input" id="dcClose" type="number" placeholder="0"></div>
        <div class="form-group" style="flex:1"><label>${tr('Notes', 'ملاحظات')}</label><input class="form-input" id="dcNotes"></div>
        <button class="btn btn-primary" onclick="performDailyClose()" style="align-self:flex-end">🔒 ${tr('Close Day', 'إغلاق اليوم')}</button>
      </div>
    </div>
    <div style="margin-top:12px;display:flex;gap:8px">
      <button class="btn" onclick="exportTableCSV('invoices_export')">📥 ${tr('Export CSV', 'تصدير CSV')}</button>
    </div>`;
}
window.generateInvoice = async () => {
  const pid = document.getElementById('invPatient').value;
  const desc = document.getElementById('invDesc').value.trim();
  const amt = parseFloat(document.getElementById('invAmt').value) || 0;
  if (!desc || !amt) { showToast(tr('Enter description and amount', 'ادخل الوصف والمبلغ'), 'error'); return; }
  try {
    await API.post('/api/invoices/generate', { patient_id: pid, items: [{ description: desc, amount: amt }] });
    showToast(tr('Invoice issued!', 'تم إصدار الفاتورة!'));
    await navigateTo(8);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.payInvoice = async (id) => {
  try { await API.put(`/api/invoices/${id}/pay`, { payment_method: 'Cash' }); showToast(tr('Paid!', 'تم الدفع!')); await navigateTo(8); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.performDailyClose = async function () {
  try {
    const result = await API.post('/api/finance/daily-close', {
      opening_balance: document.getElementById('dcOpen').value || 0,
      closing_balance: document.getElementById('dcClose').value || 0,
      notes: document.getElementById('dcNotes').value
    });
    showToast(tr('Day closed! Variance: ' + result.variance + ' SAR', 'تم الإغلاق! الفرق: ' + result.variance + ' ر.س'));
    navigateTo(8);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== INSURANCE =====
async function renderInsurance(el) {
  const [claims, companies, policies] = await Promise.all([
    API.get('/api/insurance/claims'),
    API.get('/api/insurance/companies').catch(() => []),
    API.get('/api/insurance/policies').catch(() => [])
  ]);
  const approved = claims.filter(c => c.status === 'Approved').reduce((s, c) => s + (c.claim_amount || 0), 0);
  const pending = claims.filter(c => c.status === 'Pending').reduce((s, c) => s + (c.claim_amount || 0), 0);
  el.innerHTML = `<div class="page-title">🛡️ ${tr('Insurance Management', 'إدارة التأمين')}</div>
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('Total Claims', 'إجمالي المطالبات')}</div><div class="stat-value">${claims.length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Approved', 'معتمدة')}</div><div class="stat-value">${approved.toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-label">${tr('Pending', 'معلقة')}</div><div class="stat-value">${pending.toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#8b5cf6"><div class="stat-label">${tr('Companies', 'شركات التأمين')}</div><div class="stat-value">${companies.length}</div></div>
    </div>
    <div class="grid-equal">
      <div class="card">
        <div class="card-title">➕ ${tr('New Insurance Claim', 'مطالبة تأمين جديدة')}</div>
        <div class="form-group mb-12"><label>${tr('Patient', 'المريض')}</label><input class="form-input" id="insPatient" placeholder="${tr('Patient name', 'اسم المريض')}"></div>
        <div class="form-group mb-12"><label>${tr('Insurance Company', 'شركة التأمين')}</label>
          <select class="form-input" id="insCompany">
            <option value="Bupa Arabia">Bupa Arabia</option>
            <option value="Tawuniya">Tawuniya</option>
            <option value="MedGulf">MedGulf</option>
            <option value="Alrajhi Takaful">Alrajhi Takaful</option>
            <option value="CCHI">CCHI</option>
            <option value="AXA">AXA</option>
            <option value="Walaa">Walaa</option>
            ${companies.map(c => `<option value="${c.name_en || c.name_ar}">${c.name_en || c.name_ar}</option>`).join('')}
          </select></div>
        <div class="form-group mb-12"><label>${tr('Claim Amount', 'مبلغ المطالبة')}</label><input class="form-input" id="insAmount" type="number" placeholder="0.00"></div>
        <button class="btn btn-primary w-full" onclick="addClaim()">📤 ${tr('Submit Claim', 'إرسال المطالبة')}</button>
      </div>
      <div class="card">
        <div class="card-title">🏢 ${tr('Insurance Companies', 'شركات التأمين')}</div>
        <div class="flex gap-8 mb-12">
          <input class="form-input" id="insCoNameAr" placeholder="${tr('Arabic name', 'الاسم بالعربية')}" style="flex:1">
          <input class="form-input" id="insCoNameEn" placeholder="${tr('English name', 'الاسم بالإنجليزية')}" style="flex:1">
          <button class="btn btn-primary" onclick="addInsCompany()">➕</button>
        </div>
        ${makeTable([tr('Name (AR)', 'الاسم بالعربية'), tr('Name (EN)', 'الاسم بالإنجليزية')], companies.map(c => ({ cells: [c.name_ar, c.name_en] })))}
      </div>
    </div>
    <div class="card">
      <div class="card-title">📄 ${tr('Insurance Claims', 'المطالبات')}</div>
      <input class="search-filter" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'insClaimsT')">
      <div id="insClaimsT">${makeTable(
    [tr('Patient', 'المريض'), tr('Company', 'الشركة'), tr('Amount', 'المبلغ'), tr('Status', 'الحالة'), tr('Date', 'التاريخ'), tr('Actions', 'إجراءات')],
    claims.map(c => ({ cells: [c.patient_name, c.insurance_company, c.claim_amount + ' SAR', statusBadge(c.status), c.created_at?.split('T')[0] || ''], id: c.id, status: c.status })),
    (row) => row.status === 'Pending' ? `<div class="flex gap-4"><button class="btn btn-sm btn-success" onclick="updateClaim(${row.id},'Approved')">✅</button><button class="btn btn-sm btn-danger" onclick="updateClaim(${row.id},'Rejected')">❌</button></div>` : `<span class="badge badge-${row.status === 'Approved' ? 'success' : 'danger'}">${row.status}</span>`
  )}</div></div>`;
}
window.addClaim = async () => {
  const name = document.getElementById('insPatient').value.trim();
  if (!name) { showToast(tr('Enter patient name', 'ادخل اسم المريض'), 'error'); return; }
  try {
    await API.post('/api/insurance/claims', { patient_name: name, insurance_company: document.getElementById('insCompany').value, claim_amount: parseFloat(document.getElementById('insAmount').value) || 0 });
    showToast(tr('Claim submitted!', 'تم إرسال المطالبة!')); await navigateTo(9);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.updateClaim = async (id, status) => {
  try { await API.put(`/api/insurance/claims/${id}`, { status }); showToast(tr('Updated', 'تم التحديث')); await navigateTo(9); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.addInsCompany = async () => {
  const ar = document.getElementById('insCoNameAr').value.trim();
  const en = document.getElementById('insCoNameEn').value.trim();
  if (!ar && !en) { showToast(tr('Enter company name', 'ادخل اسم الشركة'), 'error'); return; }
  try {
    await API.post('/api/insurance/companies', { name_ar: ar, name_en: en });
    showToast(tr('Company added!', 'تمت الإضافة!')); await navigateTo(9);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== INVENTORY =====
async function renderInventory(el) {
  const items = await API.get('/api/inventory/items');
  const lowStock = items.filter(i => i.stock_qty <= i.min_qty);
  const totalValue = items.reduce((s, i) => s + (i.cost_price * i.stock_qty), 0);
  el.innerHTML = `<div class="page-title">📦 ${tr('Inventory Management', 'إدارة المخازن')}</div>
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('Total Items', 'إجمالي الأصناف')}</div><div class="stat-value">${items.length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Stock Value', 'قيمة المخزون')}</div><div class="stat-value">${totalValue.toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#f87171"><div class="stat-label">${tr('Low Stock Items', 'أصناف منخفضة')}</div><div class="stat-value">${lowStock.length}</div></div>
    </div>
    ${lowStock.length > 0 ? `<div class="card mb-16" style="border-left:4px solid #f87171">
      <div class="card-title">⚠️ ${tr('Low Stock Alert', 'تنبيه نقص المخزون')}</div>
      ${makeTable([tr('Item', 'الصنف'), tr('Code', 'الرمز'), tr('Current', 'الحالي'), tr('Minimum', 'الحد الأدنى')],
    lowStock.map(i => ({ cells: [i.item_name, i.item_code, `<span style="color:#f87171;font-weight:bold">${i.stock_qty}</span>`, i.min_qty] })))}
    </div>` : ''}
    <div class="card mb-16">
      <div class="card-title">➕ ${tr('Add New Item', 'إضافة صنف جديد')}</div>
      <div class="flex gap-8 mb-12">
        <input class="form-input" id="invName" placeholder="${tr('Item name', 'اسم الصنف')}" style="flex:2">
        <input class="form-input" id="invCode" placeholder="${tr('Code', 'الرمز')}" style="flex:1">
        <select class="form-input" id="invCat" style="flex:1">
          <option value="Medical Supplies">${tr('Medical Supplies', 'مستلزمات طبية')}</option>
          <option value="Office Supplies">${tr('Office Supplies', 'مستلزمات مكتبية')}</option>
          <option value="Cleaning">${tr('Cleaning', 'تنظيف')}</option>
          <option value="Equipment">${tr('Equipment', 'معدات')}</option>
          <option value="Other">${tr('Other', 'أخرى')}</option>
        </select>
        <input class="form-input" id="invCost" placeholder="${tr('Cost', 'التكلفة')}" type="number" style="flex:1">
        <input class="form-input" id="invQty" placeholder="${tr('Qty', 'الكمية')}" type="number" style="flex:1">
        <input class="form-input" id="invMin" placeholder="${tr('Min', 'الحد')}" type="number" value="5" style="flex:0.7">
        <button class="btn btn-primary" onclick="addInvItem()">➕</button>
      </div>
    </div>
    <div class="card">
      <div class="card-title">📦 ${tr('All Stock Items', 'جميع الأصناف')}</div>
      <input class="search-filter" placeholder="${tr('Search items...', 'بحث في الأصناف...')}" oninput="filterTable(this,'invTable')">
      <div id="invTable">${makeTable(
      [tr('Name', 'الاسم'), tr('Code', 'الرمز'), tr('Category', 'التصنيف'), tr('Cost', 'التكلفة'), tr('Stock', 'المخزون'), tr('Min', 'الحد'), tr('Value', 'القيمة')],
      items.map(i => ({
        cells: [i.item_name, i.item_code, i.category || '', (i.cost_price || 0).toLocaleString(),
        i.stock_qty <= i.min_qty ? `<span style="color:#f87171;font-weight:bold">${i.stock_qty}</span>` : i.stock_qty,
        i.min_qty, ((i.cost_price || 0) * (i.stock_qty || 0)).toLocaleString() + ' SAR']
      }))
    )}</div>
    </div>`;
}
window.addInvItem = async () => {
  const name = document.getElementById('invName').value.trim();
  if (!name) { showToast(tr('Enter item name', 'ادخل اسم الصنف'), 'error'); return; }
  try {
    await API.post('/api/inventory/items', {
      item_name: name,
      item_code: document.getElementById('invCode').value,
      category: document.getElementById('invCat').value,
      cost_price: parseFloat(document.getElementById('invCost').value) || 0,
      stock_qty: parseInt(document.getElementById('invQty').value) || 0,
      min_qty: parseInt(document.getElementById('invMin').value) || 5
    });
    showToast(tr('Item added!', 'تمت الإضافة!'));
    await navigateTo(10);
  } catch (e) { showToast(tr('Error adding', 'خطأ في الإضافة'), 'error'); }
};

// ===== SIMPLE MODULE PAGES =====
let nurseTab = 'vitals';
async function renderNursing(el) {
  const patients = await API.get('/api/patients');
  const vitals = await API.get('/api/nursing/vitals').catch(() => []);
  const emarOrders = await API.get('/api/emar/orders').catch(() => []);
  const carePlans = await API.get('/api/nursing/care-plans').catch(() => []);
  const assessments = await API.get('/api/nursing/assessments').catch(() => []);
  el.innerHTML = `
    <div class="page-title">👩‍⚕️ ${tr('Nursing Station', 'محطة التمريض')}</div>
    <div class="tab-bar">
      <button class="tab-btn ${nurseTab === 'vitals' ? 'active' : ''}" onclick="nurseTab='vitals';navigateTo(11)">🌡️ ${tr('Vitals', 'العلامات الحيوية')}</button>
      <button class="tab-btn ${nurseTab === 'emar' ? 'active' : ''}" onclick="nurseTab='emar';navigateTo(11)">💉 ${tr('eMAR', 'إعطاء الأدوية')}</button>
      <button class="tab-btn ${nurseTab === 'careplans' ? 'active' : ''}" onclick="nurseTab='careplans';navigateTo(11)">📋 ${tr('Care Plans', 'خطط الرعاية')}</button>
      <button class="tab-btn ${nurseTab === 'assess' ? 'active' : ''}" onclick="nurseTab='assess';navigateTo(11)">📊 ${tr('Assessments', 'التقييمات')}</button>
    </div>`;
  if (nurseTab === 'emar') {
    el.innerHTML += `<div class="card"><h3>💉 ${tr('Electronic Medication Administration Record', 'سجل إعطاء الأدوية الإلكتروني')}</h3>
    ${emarOrders.length ? makeTable(
      [tr('Patient', 'المريض'), tr('Medication', 'الدواء'), tr('Dose', 'الجرعة'), tr('Route', 'الطريقة'), tr('Frequency', 'التكرار'), tr('Status', 'الحالة'), tr('Actions', 'إجراءات')],
      emarOrders.map(o => ({
        cells: [o.patient_name, o.medication, o.dose, o.route, o.frequency, statusBadge(o.status),
        `<button class="btn btn-sm btn-success" onclick="administerMed(${o.id},${o.patient_id},'${o.medication}','${o.dose}')">💉 ${tr('Give', 'إعطاء')}</button>`
        ]
      }))
    ) : `<div class="empty-state"><p>${tr('No active orders', 'لا توجد أوامر نشطة')}</p></div>`}
    </div>`;
  } else if (nurseTab === 'careplans') {
    el.innerHTML += `<div class="card"><h3>📋 ${tr('Nursing Care Plans', 'خطط الرعاية التمريضية')}</h3>
    <button class="btn btn-primary" onclick="nurseTab='newplan';navigateTo(11)" style="margin-bottom:12px">➕ ${tr('New Plan', 'خطة جديدة')}</button>
    ${carePlans.length ? makeTable(
      [tr('Patient', 'المريض'), tr('Diagnosis', 'التشخيص'), tr('Priority', 'الأولوية'), tr('Goals', 'الأهداف'), tr('Status', 'الحالة')],
      carePlans.map(c => ({ cells: [c.patient_name, c.diagnosis, c.priority === 'High' ? '🔴 ' + tr('High', 'عالية') : c.priority === 'Low' ? '🟢 ' + tr('Low', 'منخفضة') : '🟡 ' + tr('Medium', 'متوسطة'), c.goals?.substring(0, 60) || '-', statusBadge(c.status)] }))
    ) : `<div class="empty-state"><p>${tr('No care plans', 'لا توجد خطط رعاية')}</p></div>`}
    </div>`;
  } else if (nurseTab === 'assess') {
    el.innerHTML += `<div class="card"><h3>📊 ${tr('Nursing Assessments', 'التقييمات التمريضية')}</h3>
    ${assessments.length ? makeTable(
      [tr('Patient', 'المريض'), tr('Type', 'النوع'), tr('Fall Risk', 'خطر السقوط'), tr('Braden', 'Braden'), tr('Pain', 'ألم'), tr('GCS', 'GCS'), tr('Nurse', 'الممرض'), tr('Shift', 'الوردية')],
      assessments.map(a => ({
        cells: [a.patient_name, a.assessment_type,
        `<span style="color:${a.fall_risk_score >= 45 ? '#ef4444' : a.fall_risk_score >= 25 ? '#f59e0b' : '#22c55e'}">${a.fall_risk_score}</span>`,
        `<span style="color:${a.braden_score <= 12 ? '#ef4444' : a.braden_score <= 18 ? '#f59e0b' : '#22c55e'}">${a.braden_score}/23</span>`,
        `<span style="color:${a.pain_score >= 7 ? '#ef4444' : a.pain_score >= 4 ? '#f59e0b' : '#22c55e'}">${a.pain_score}/10</span>`,
        a.gcs_score + '/15', a.nurse, a.shift
        ]
      }))
    ) : `<div class="empty-state"><p>${tr('No assessments', 'لا توجد تقييمات')}</p></div>`}
    </div>`;
  } else if (nurseTab === 'newplan') {
    el.innerHTML += `<div class="card"><h3>➕ ${tr('New Care Plan', 'خطة رعاية جديدة')}</h3>
    <div class="form-grid">
      <div><label>${tr('Patient', 'المريض')}</label><select id="cpPatientN" class="form-input">${patients.map(p => `<option value="${p.id}" data-name="${p.name_ar || p.name_en}">${p.file_number} - ${isArabic ? p.name_ar : p.name_en}</option>`).join('')}</select></div>
      <div><label>${tr('Priority', 'الأولوية')}</label><select id="cpPriorityN" class="form-input"><option value="Low">${tr('Low', 'منخفضة')}</option><option value="Medium" selected>${tr('Medium', 'متوسطة')}</option><option value="High">${tr('High', 'عالية')}</option></select></div>
      <div style="grid-column:1/-1"><label>${tr('Diagnosis', 'التشخيص')}</label><input id="cpDiagN" class="form-input"></div>
      <div style="grid-column:1/-1"><label>${tr('Goals', 'الأهداف')}</label><textarea id="cpGoalsN" class="form-input" rows="2"></textarea></div>
      <div style="grid-column:1/-1"><label>${tr('Interventions', 'التدخلات')}</label><textarea id="cpIntN" class="form-input" rows="2"></textarea></div>
    </div>
    <button class="btn btn-primary" onclick="saveCarePlan()" style="margin-top:8px">💾 ${tr('Save', 'حفظ')}</button></div>`;
  } else {
    el.innerHTML += `<div class="split-layout">
      <div>
        <div class="card mb-16">
          <div class="card-title">🌡️ ${tr('Record Patient Vitals', 'تسجيل العلامات الحيوية')}</div>
          <div class="form-group mb-12"><label>${tr('Patient', 'المريض')}</label><select class="form-input" id="nsPatient"><option value="">${tr('-- Select --', '-- اختر مريض --')}</option>${patients.map(p => `<option value="${p.id}" data-name="${p.name_en || p.name_ar}">${p.file_number} - ${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)}</option>`).join('')}</select></div>
          <div class="flex gap-8 mb-12">
            <div class="form-group" style="flex:1"><label>🩸 ${tr('Blood Pressure', 'ضغط الدم')}</label><input class="form-input" id="nsBp" placeholder="120/80"></div>
            <div class="form-group" style="flex:1"><label>🌡️ ${tr('Temp (°C)', 'الحرارة')}</label><input class="form-input" id="nsTemp" type="number" step="0.1" placeholder="37.0"></div>
          </div>
          <div class="flex gap-8 mb-12">
            <div class="form-group" style="flex:1"><label>❤️ ${tr('Pulse (bpm)', 'النبض')}</label><input class="form-input" id="nsPulse" type="number" placeholder="75"></div>
            <div class="form-group" style="flex:1"><label>💨 ${tr('O2 Sat (%)', 'الأكسجين')}</label><input class="form-input" id="nsO2" type="number" placeholder="98"></div>
          </div>
          <div class="flex gap-8 mb-12">
            <div class="form-group" style="flex:1"><label>💪 ${tr('Weight (kg)', 'الوزن')}</label><input class="form-input" id="nsWeight" type="number" step="0.1" placeholder="70.5"></div>
            <div class="form-group" style="flex:1"><label>📏 ${tr('Height (cm)', 'الطول')}</label><input class="form-input" id="nsHeight" type="number" placeholder="170"></div>
          </div>
          <div class="flex gap-8 mb-12">
            <div class="form-group" style="flex:1"><label>🌬️ ${tr('Respiratory Rate', 'معدل التنفس')}</label><input class="form-input" id="nsResp" type="number" placeholder="18"></div>
            <div class="form-group" style="flex:1"><label>🩸 ${tr('Blood Sugar', 'السكر')}</label><input class="form-input" id="nsSugar" type="number" placeholder="100"></div>
          </div>
        </div>
        <div class="card mb-16">
          <div class="card-title">📋 ${tr('Medical History', 'التاريخ المرضي')}</div>
          <div class="form-group mb-12"><label>🏥 ${tr('Chronic Diseases', 'الأمراض المزمنة')}</label><textarea class="form-input form-textarea" id="nsChronic" placeholder="${tr('e.g. Diabetes, Hypertension, Asthma...', 'مثلاً: سكري، ضغط، ربو...')}"></textarea></div>
          <div class="form-group mb-12"><label>💊 ${tr('Current Medications', 'الأدوية الحالية')}</label><textarea class="form-input form-textarea" id="nsMeds" placeholder="${tr('e.g. Metformin 500mg, Aspirin 100mg...', 'مثلاً: ميتفورمين 500مج، أسبرين 100مج...')}"></textarea></div>
          <div class="form-group mb-12"><label>⚠️ ${tr('Allergies', 'الحساسية')}</label><textarea class="form-input form-textarea" id="nsAllergies" placeholder="${tr('e.g. Penicillin, Peanuts, Latex...', 'مثلاً: بنسلين، فول سوداني، لاتكس...')}"></textarea></div>
          <div class="form-group mb-16"><label>📝 ${tr('Notes / Triage', 'ملاحظات / فرز')}</label><textarea class="form-input form-textarea" id="nsNotes"></textarea></div>
          <button class="btn btn-primary w-full" style="height:44px" onclick="saveVitals()">💾 ${tr('Save Vitals & Send to Doctor', 'حفظ وإرسال للطبيب')}</button>
        </div>
      </div>
      <div class="card">
        <div class="card-title">📋 ${tr('Recent Vitals Registry', 'سجل العلامات الحيوية')}</div>
        <input class="search-filter" id="nsSearch" placeholder="${tr('Search...', 'بحث...')}">
        <div id="nsTable">${vitals.length === 0 ? `<div class="empty-state"><div class="empty-icon">📭</div><p>${tr('No data found', 'لا توجد بيانات')}</p></div>` : vitals.map(v => `
          <div class="card mb-12" style="padding:12px;border:1px solid var(--border-color,#e5e7eb);border-radius:10px;background:var(--card-bg,#fff)">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
              <strong style="font-size:14px">👤 ${v.patient_name || v.patient_id}</strong>
              <span style="font-size:12px;color:var(--text-muted,#999)">📅 ${v.created_at?.split('T')[0] || ''}</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;font-size:13px">
              <div style="background:var(--bg-secondary,#f8f9fa);padding:6px 8px;border-radius:6px;text-align:center">🩸 ${tr('BP', 'الضغط')}<br><strong>${v.bp || '-'}</strong></div>
              <div style="background:var(--bg-secondary,#f8f9fa);padding:6px 8px;border-radius:6px;text-align:center">🌡️ ${tr('Temp', 'حرارة')}<br><strong>${v.temp ? v.temp + '°' : '-'}</strong></div>
              <div style="background:var(--bg-secondary,#f8f9fa);padding:6px 8px;border-radius:6px;text-align:center">❤️ ${tr('Pulse', 'نبض')}<br><strong>${v.pulse || '-'}</strong></div>
              <div style="background:var(--bg-secondary,#f8f9fa);padding:6px 8px;border-radius:6px;text-align:center">💨 ${tr('O2', 'أكسجين')}<br><strong>${v.o2_sat ? v.o2_sat + '%' : '-'}</strong></div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;font-size:13px;margin-top:6px">
              <div style="background:var(--bg-secondary,#f8f9fa);padding:6px 8px;border-radius:6px;text-align:center">💪 ${tr('Weight', 'وزن')}<br><strong>${v.weight ? v.weight + ' kg' : '-'}</strong></div>
              <div style="background:var(--bg-secondary,#f8f9fa);padding:6px 8px;border-radius:6px;text-align:center">📏 ${tr('Height', 'طول')}<br><strong>${v.height ? v.height + ' cm' : '-'}</strong></div>
              <div style="background:var(--bg-secondary,#f8f9fa);padding:6px 8px;border-radius:6px;text-align:center">🌬️ ${tr('Resp', 'تنفس')}<br><strong>${v.respiratory_rate || '-'}</strong></div>
              <div style="background:var(--bg-secondary,#f8f9fa);padding:6px 8px;border-radius:6px;text-align:center">🩸 ${tr('Sugar', 'سكر')}<br><strong>${v.blood_sugar || '-'}</strong></div>
            </div>
            ${v.allergies ? `<div style="margin-top:6px"><span class="badge badge-danger">⚠️ ${v.allergies}</span></div>` : ''}
            ${v.chronic_diseases ? `<div style="margin-top:4px;font-size:12px;color:var(--text-muted,#888)">🏥 ${v.chronic_diseases}</div>` : ''}
          </div>
        `).join('')}</div>
      </div>
    </div>`;
    // Search filter for vitals cards
    document.getElementById('nsSearch')?.addEventListener('input', (e) => {
      const txt = e.target.value.toLowerCase();
      document.querySelectorAll('#nsTable .card').forEach(c => {
        c.style.display = c.textContent.toLowerCase().includes(txt) ? '' : 'none';
      });
    });
  }
}

window.saveVitals = async () => {
  const sel = document.getElementById('nsPatient');
  const pid = sel.value;
  if (!pid) { showToast(tr('Select patient first', 'اختر المريض أولاً'), 'error'); return; }
  const pname = sel.options[sel.selectedIndex].getAttribute('data-name');
  try {
    await API.post('/api/nursing/vitals', {
      patient_id: pid, patient_name: pname,
      bp: document.getElementById('nsBp').value,
      temp: parseFloat(document.getElementById('nsTemp').value) || 0,
      weight: parseFloat(document.getElementById('nsWeight').value) || 0,
      height: parseFloat(document.getElementById('nsHeight').value) || 0,
      pulse: parseInt(document.getElementById('nsPulse').value) || 0,
      o2_sat: parseInt(document.getElementById('nsO2').value) || 0,
      respiratory_rate: parseInt(document.getElementById('nsResp').value) || 0,
      blood_sugar: parseInt(document.getElementById('nsSugar').value) || 0,
      chronic_diseases: document.getElementById('nsChronic').value,
      current_medications: document.getElementById('nsMeds').value,
      allergies: document.getElementById('nsAllergies').value,
      notes: document.getElementById('nsNotes').value
    });
    showToast(tr('Vitals recorded and patient routed to doctor!', 'تم تسجيل العلامات الحيوية وتحويل المريض!'));
    await navigateTo(11);
  } catch (e) { showToast(tr('Error saving', 'خطأ في الحفظ'), 'error'); }
};
window.administerMed = async function (orderId, patientId, med, dose) {
  const time = new Date().toTimeString().substring(0, 5);
  await API.post('/api/emar/administrations', { emar_order_id: orderId, patient_id: patientId, medication: med, dose: dose, scheduled_time: time, status: 'Given' });
  showToast(tr('Medication administered', 'تم إعطاء الدواء')); navigateTo(11);
};
window.saveCarePlan = async function () {
  const sel = document.getElementById('cpPatientN');
  const patient_name = sel.options[sel.selectedIndex].dataset.name;
  await API.post('/api/nursing/care-plans', { patient_id: sel.value, patient_name, diagnosis: document.getElementById('cpDiagN').value, priority: document.getElementById('cpPriorityN').value, goals: document.getElementById('cpGoalsN').value, interventions: document.getElementById('cpIntN').value });
  showToast(tr('Care plan saved', 'تم الحفظ')); nurseTab = 'careplans'; navigateTo(11);
};

async function renderWaitingQueue(el) {
  const patients = await API.get('/api/patients');
  const waiting = patients.filter(p => p.status === 'Waiting');
  const withDoctor = patients.filter(p => p.status === 'With Doctor');
  const completed = patients.filter(p => p.status === 'Completed');
  const depts = [...new Set(waiting.map(p => p.department).filter(Boolean))];
  const avgWait = withDoctor.length > 0 ? 10 : 5; // estimated minutes per patient
  el.innerHTML = `
    <div class="page-title">🪑 ${tr('Waiting Queue', 'قائمة الانتظار')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(5,1fr)">
      <div class="stat-card" style="--stat-color:#f59e0b"><span class="stat-icon">⏳</span><div class="stat-label">${tr('Waiting', 'بالانتظار')}</div><div class="stat-value">${waiting.length}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">👨‍⚕️</span><div class="stat-label">${tr('With Doctor', 'مع الطبيب')}</div><div class="stat-value">${withDoctor.length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">✅</span><div class="stat-label">${tr('Completed Today', 'مكتمل اليوم')}</div><div class="stat-value">${completed.length}</div></div>
      <div class="stat-card" style="--stat-color:#a78bfa"><span class="stat-icon">⏱️</span><div class="stat-label">${tr('Est. Wait', 'وقت الانتظار')}</div><div class="stat-value">${waiting.length * avgWait} ${tr('min', 'د')}</div></div>
      <div class="stat-card" style="--stat-color:#f87171"><span class="stat-icon">🏥</span><div class="stat-label">${tr('Departments', 'الأقسام')}</div><div class="stat-value">${depts.length}</div></div>
    </div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div class="card-title">⏳ ${tr('Waiting Patients', 'المرضى المنتظرين')}</div>
        <button class="btn btn-sm" onclick="navigateTo(12)" style="animation:pulse 2s infinite">🔄 ${tr('Refresh', 'تحديث')}</button>
      </div>
      ${makeTable([tr('#', '#'), tr('File#', 'رقم الملف'), tr('Name', 'الاسم'), tr('Department', 'القسم'), tr('Est. Wait', 'الانتظار'), tr('Actions', 'إجراءات')],
    waiting.map((p, i) => ({
      cells: [
        `<span style="background:var(--accent);color:#fff;padding:4px 10px;border-radius:50%;font-weight:700">${i + 1}</span>`,
        p.file_number, isArabic ? p.name_ar : p.name_en, p.department || '-',
        `~${(i + 1) * avgWait} ${tr('min', 'د')}`,
        `<button class="btn btn-sm btn-success" onclick="callPatient(${p.id})">📢 ${tr('Call', 'مناداة')}</button>`
      ]
    })))}
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-title">👨‍⚕️ ${tr('With Doctor', 'مع الطبيب')}</div>
      ${makeTable([tr('File#', 'رقم الملف'), tr('Name', 'الاسم'), tr('Department', 'القسم'), tr('Status', 'الحالة')],
      withDoctor.map(p => ({ cells: [p.file_number, isArabic ? p.name_ar : p.name_en, p.department, statusBadge(p.status)] })))}
    </div>`;
  // Auto-refresh every 30 seconds
  if (window._wqRefresh) clearInterval(window._wqRefresh);
  window._wqRefresh = setInterval(() => { if (currentPage === 12) navigateTo(12); else clearInterval(window._wqRefresh); }, 30000);
}
window.callPatient = async function (id) {
  await API.put('/api/patients/' + id, { status: 'With Doctor' });
  showToast(tr('Patient called', 'تم مناداة المريض'));
  navigateTo(12);
};


async function renderPatientAccounts(el) {
  const patients = await API.get('/api/patients');
  el.innerHTML = `<div class="page-title">💳 ${tr('Patient Accounts', 'حسابات المرضى')}</div>
    <div class="card mb-16"><div class="card-title">🔍 ${tr('Search Patient Account', 'البحث عن حساب مريض')}</div>
      <div class="flex gap-8">
        <select class="form-input" id="paPatient" style="flex:3">${patients.map(p => `<option value="${p.id}">${p.file_number} - ${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)}</option>`).join('')}</select>
        <button class="btn btn-primary" onclick="loadPatientAccount()" style="flex:1">📋 ${tr('Load Account', 'عرض الحساب')}</button>
      </div>
    </div>
    <div id="paResult"></div>`;
}
window.loadPatientAccount = async () => {
  const pid = document.getElementById('paPatient').value;
  if (!pid) return;
  try {
    const data = await API.get(`/api/billing/summary/${pid}`);
    const pInfo = await API.get(`/api/patients/${pid}/account`);
    const p = pInfo.patient;
    // Build billing breakdown by service type
    let breakdownHtml = '';
    const typeIcons = { 'File Opening': '📁', 'Lab Test': '🔬', 'Radiology': '📡', 'Consultation': '🩺', 'Pharmacy': '💊', 'Appointment': '📅', 'Medical Services': '🏥', 'Other': '📄' };
    const typeNames = { 'File Opening': tr('File Opening', 'فتح ملف'), 'Lab Test': tr('Lab Tests', 'فحوصات المختبر'), 'Radiology': tr('Radiology', 'الأشعة'), 'Consultation': tr('Consultation', 'الكشفية'), 'Pharmacy': tr('Pharmacy/Drugs', 'الصيدلية/الأدوية'), 'Appointment': tr('Appointments', 'المواعيد'), 'Medical Services': tr('Medical Services', 'خدمات طبية') };
    for (const [type, info] of Object.entries(data.byType)) {
      breakdownHtml += `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--hover);border-radius:8px;margin:6px 0">
        <span>${typeIcons[type] || '📄'} <strong>${typeNames[type] || type}</strong> <span class="badge badge-info" style="font-size:11px">${info.count}</span></span>
        <span style="font-weight:600">${info.total.toLocaleString()} ${tr('SAR', 'ر.س')}</span>
      </div>`;
    }
    document.getElementById('paResult').innerHTML = `
        <div class="card mb-16">
          <div class="card-title">👤 ${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)} - #${p.file_number}</div>
          <div class="stats-grid">
            <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('Total Billed', 'إجمالي الفواتير')}</div><div class="stat-value">${data.totalBilled.toLocaleString()} SAR</div></div>
            <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Total Paid', 'المدفوع')}</div><div class="stat-value">${data.totalPaid.toLocaleString()} SAR</div></div>
            <div class="stat-card" style="--stat-color:${data.balance > 0 ? '#f87171' : '#4ade80'}"><div class="stat-label">${tr('Balance Due', 'المتبقي')}</div><div class="stat-value">${data.balance.toLocaleString()} SAR</div></div>
          </div>
        </div>
        <div class="card mb-16">
          <div class="card-title">📊 ${tr('Billing Breakdown', 'تفصيل الفوترة')}</div>
          ${breakdownHtml || `<div class="empty-state"><p>${tr('No billing data', 'لا توجد فوترة')}</p></div>`}
        </div>
        <div class="card mb-16"><div class="card-title">🧾 ${tr('All Invoices', 'جميع الفواتير')} (${data.invoices.length})</div>
        ${makeTable([tr('Type', 'النوع'), tr('Description', 'الوصف'), tr('Amount', 'المبلغ'), tr('Status', 'الحالة'), tr('Date', 'التاريخ'), tr('Actions', 'إجراءات')],
      data.invoices.map(i => ({ cells: [i.service_type || '', i.description || '', `${i.total} SAR`, i.paid ? badge(tr('Paid', 'مدفوع'), 'success') : badge(tr('Unpaid', 'غير مدفوع'), 'danger'), i.created_at?.split('T')[0] || ''], id: i.id, paid: i.paid })),
      (row) => !row.paid ? `<button class="btn btn-sm btn-success" onclick="payInvoicePA(${row.id})">💵 ${tr('Pay', 'تسديد')}</button>` : `<span class="badge badge-success">✅</span>`
    )}</div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="btn btn-primary" onclick="printPatientStatement(${pid})">🖨️ ${tr('Print Statement', 'طباعة كشف الحساب')}</button>
          <button class="btn" onclick="exportTableCSV('patient_account')">📥 ${tr('Export CSV', 'تصدير CSV')}</button>
        </div>`;
  } catch (e) { showToast(tr('Error loading account', 'خطأ في تحميل الحساب'), 'error'); }
};
window.payInvoicePA = async (id) => {
  try { await API.put(`/api/invoices/${id}/pay`, { payment_method: 'Cash' }); showToast(tr('Paid!', 'تم الدفع!')); loadPatientAccount(); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

async function renderReports(el) {
  const [fin, pat, lab, invoices, emps, commissions] = await Promise.all([
    API.get('/api/reports/financial').catch(() => ({ totalRevenue: 0, totalPending: 0, invoiceCount: 0, monthlyRevenue: 0 })),
    API.get('/api/reports/patients').catch(() => ({ totalPatients: 0, todayPatients: 0, deptStats: [], statusStats: [] })),
    API.get('/api/reports/lab').catch(() => ({ totalOrders: 0, pendingOrders: 0, completedOrders: 0 })),
    API.get('/api/invoices').catch(() => []),
    API.get('/api/employees').catch(() => []),
    API.get('/api/reports/commissions').catch(() => [])
  ]);
  el.innerHTML = `<div class="page-title">📋 ${tr('Reports & Analytics', 'التقارير والتحليلات')}</div>
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('Total Revenue', 'إجمالي الإيرادات')}</div><div class="stat-value">${fin.totalRevenue.toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-label">${tr('Monthly Revenue', 'إيرادات الشهر')}</div><div class="stat-value">${fin.monthlyRevenue.toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#f87171"><div class="stat-label">${tr('Pending Payments', 'مبالغ معلقة')}</div><div class="stat-value">${fin.totalPending.toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Total Patients', 'إجمالي المرضى')}</div><div class="stat-value">${pat.totalPatients}</div></div>
    </div>
    <div class="grid-equal">
      <div class="card">
        <div class="card-title">💰 ${tr('Financial Summary', 'الملخص المالي')}</div>
        <div class="stats-grid">
          <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('Total Invoices', 'عدد الفواتير')}</div><div class="stat-value">${fin.invoiceCount}</div></div>
          <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Paid', 'مدفوعة')}</div><div class="stat-value">${invoices.filter(i => i.paid).length}</div></div>
          <div class="stat-card" style="--stat-color:#f87171"><div class="stat-label">${tr('Unpaid', 'غير مدفوعة')}</div><div class="stat-value">${invoices.filter(i => !i.paid).length}</div></div>
        </div>
        <div class="card-title mt-16">📊 ${tr('Recent Invoices', 'آخر الفواتير')}</div>
        ${makeTable([tr('Patient', 'المريض'), tr('Amount', 'المبلغ'), tr('Status', 'الحالة'), tr('Date', 'التاريخ')],
    invoices.slice(0, 10).map(i => ({ cells: [i.patient_name, i.total + ' SAR', i.paid ? badge(tr('Paid', 'مدفوع'), 'success') : badge(tr('Unpaid', 'غير مدفوع'), 'danger'), i.created_at?.split('T')[0] || ''] })))}
      </div>
      <div class="card">
        <div class="card-title">👥 ${tr('Patient Statistics', 'إحصائيات المرضى')}</div>
        <div class="stats-grid">
          <div class="stat-card" style="--stat-color:#8b5cf6"><div class="stat-label">${tr('Today', 'اليوم')}</div><div class="stat-value">${pat.todayPatients}</div></div>
          <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('Total', 'الإجمالي')}</div><div class="stat-value">${pat.totalPatients}</div></div>
          <div class="stat-card" style="--stat-color:#06b6d4"><div class="stat-label">${tr('Employees', 'الموظفين')}</div><div class="stat-value">${emps.length}</div></div>
        </div>
        <div class="card-title mt-16">📊 ${tr('By Department', 'حسب القسم')}</div>
        ${makeTable([tr('Department', 'القسم'), tr('Count', 'العدد')], pat.deptStats.map(d => ({ cells: [d.department || tr('Unassigned', 'غير محدد'), d.cnt] })))}
        <div class="card-title mt-16">📊 ${tr('By Status', 'حسب الحالة')}</div>
        ${makeTable([tr('Status', 'الحالة'), tr('Count', 'العدد')], pat.statusStats.map(s => ({ cells: [statusBadge(s.status), s.cnt] })))}
      </div>
    </div>
    <div class="card">
      <div class="card-title">🔬 ${tr('Lab & Radiology Summary', 'ملخص المختبر والأشعة')}</div>
      <div class="stats-grid">
        <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('Total Lab Orders', 'إجمالي طلبات المختبر')}</div><div class="stat-value">${lab.totalOrders}</div></div>
        <div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-label">${tr('Pending', 'بالانتظار')}</div><div class="stat-value">${lab.pendingOrders}</div></div>
        <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Completed', 'مكتمل')}</div><div class="stat-value">${lab.completedOrders}</div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">\ud83d\udcb0 ${tr('Doctor Commission Report', '\u062a\u0642\u0631\u064a\u0631 \u0639\u0645\u0648\u0644\u0627\u062a \u0627\u0644\u0623\u0637\u0628\u0627\u0621')}</div>
      ${commissions.length ? makeTable(
      [tr('Doctor', '\u0627\u0644\u0637\u0628\u064a\u0628'), tr('Speciality', '\u0627\u0644\u062a\u062e\u0635\u0635'), tr('Revenue', '\u0627\u0644\u0625\u064a\u0631\u0627\u062f\u0627\u062a'), tr('Type', '\u0627\u0644\u0646\u0648\u0639'), tr('Rate', '\u0627\u0644\u0645\u0639\u062f\u0644'), tr('Commission', '\u0627\u0644\u0639\u0645\u0648\u0644\u0629')],
      commissions.map(c => ({ cells: [c.doctor_name, c.speciality || '-', Number(c.totalRevenue).toLocaleString() + ' SAR', c.commission_type === 'percentage' ? badge('%', 'info') : badge('SAR', 'warning'), c.commission_type === 'percentage' ? c.commission_value + '%' : c.commission_value + ' SAR/' + tr('patient', '\u0645\u0631\u064a\u0636'), '<strong style="color:var(--accent)">' + c.commission.toLocaleString() + ' SAR</strong>'] }))
    ) : '<div class="empty-state"><p>' + tr('No doctors configured', '\u0644\u0645 \u064a\u062a\u0645 \u0625\u0639\u062f\u0627\u062f \u0623\u0637\u0628\u0627\u0621') + '</p></div>'}
      ${commissions.length ? '<div style="margin-top:12px;padding:12px;background:var(--hover);border-radius:8px;display:flex;justify-content:space-between;font-weight:600"><span>\ud83d\udcb0 ' + tr('Total Commissions', '\u0625\u062c\u0645\u0627\u0644\u064a \u0627\u0644\u0639\u0645\u0648\u0644\u0627\u062a') + '</span><span style="color:var(--accent)">' + commissions.reduce((s, c) => s + c.commission, 0).toLocaleString() + ' SAR</span></div>' : ''}
    </div>`;
}

let msgTab = 'inbox';
async function renderMessaging(el) {
  const [msgs, sent, users] = await Promise.all([
    API.get('/api/messages'), API.get('/api/messages/sent').catch(() => []),
    API.get('/api/settings/users').catch(() => [])
  ]);
  const unread = msgs.filter(m => !m.is_read).length;
  el.innerHTML = `
    <div class="page-title">✉️ ${tr('Messaging', 'الرسائل')} ${unread ? `<span class="badge badge-danger">${unread} ${tr('unread', 'غير مقروء')}</span>` : ''}</div>
    <div class="tab-bar">
      <button class="tab-btn ${msgTab === 'inbox' ? 'active' : ''}" onclick="msgTab='inbox';navigateTo(15)">📬 ${tr('Inbox', 'الوارد')} (${msgs.length})</button>
      <button class="tab-btn ${msgTab === 'sent' ? 'active' : ''}" onclick="msgTab='sent';navigateTo(15)">📤 ${tr('Sent', 'المرسل')} (${sent.length})</button>
      <button class="tab-btn ${msgTab === 'compose' ? 'active' : ''}" onclick="msgTab='compose';navigateTo(15)">✏️ ${tr('Compose', 'إنشاء')}</button>
    </div>
    <div class="card" id="msgContent"></div>`;
  const mc = document.getElementById('msgContent');
  if (msgTab === 'inbox') {
    mc.innerHTML = msgs.length ? makeTable(
      [tr('', ''), tr('From', 'من'), tr('Subject', 'الموضوع'), tr('Date', 'التاريخ'), tr('Actions', 'إجراءات')],
      msgs.map(m => ({
        cells: [
          m.is_read ? '' : '🔵',
          m.sender_name || 'System',
          `<strong>${m.subject}</strong>${m.body ? '<br><small style="color:#666">' + m.body.substring(0, 80) + '...</small>' : ''}`,
          m.created_at?.split('T')[0] || '',
          `${m.is_read ? '' : `<button class="btn btn-sm" onclick="markRead(${m.id})">✅</button>`} <button class="btn btn-sm btn-danger" onclick="deleteMsg(${m.id})">🗑️</button>`
        ]
      }))
    ) : `<div class="empty-state"><span style="font-size:48px">📭</span><p>${tr('No messages', 'لا توجد رسائل')}</p></div>`;
  } else if (msgTab === 'sent') {
    mc.innerHTML = sent.length ? makeTable(
      [tr('To', 'إلى'), tr('Subject', 'الموضوع'), tr('Priority', 'الأولوية'), tr('Date', 'التاريخ')],
      sent.map(m => ({ cells: [m.receiver_name || '-', m.subject, m.priority === 'High' ? '🔴 ' + tr('High', 'عالية') : m.priority === 'Low' ? '🟢 ' + tr('Low', 'منخفضة') : '🟡 ' + tr('Normal', 'عادية'), m.created_at?.split('T')[0] || ''] }))
    ) : `<div class="empty-state"><span style="font-size:48px">📤</span><p>${tr('No sent messages', 'لا توجد رسائل مرسلة')}</p></div>`;
  } else {
    mc.innerHTML = `<h3>✏️ ${tr('New Message', 'رسالة جديدة')}</h3>
    <div class="form-grid">
      <div><label>${tr('To', 'إلى')}</label><select id="msgTo" class="form-input">${users.map(u => `<option value="${u.id}">${u.display_name} (${u.role})</option>`).join('')}</select></div>
      <div><label>${tr('Priority', 'الأولوية')}</label><select id="msgPriority" class="form-input"><option value="Normal">${tr('Normal', 'عادية')}</option><option value="High">${tr('High', 'عالية')}</option><option value="Low">${tr('Low', 'منخفضة')}</option></select></div>
      <div style="grid-column:1/-1"><label>${tr('Subject', 'الموضوع')}</label><input id="msgSubject" class="form-input" placeholder="${tr('Subject', 'الموضوع')}"></div>
      <div style="grid-column:1/-1"><label>${tr('Message', 'الرسالة')}</label><textarea id="msgBody" class="form-input" rows="5" placeholder="${tr('Type your message...', 'اكتب رسالتك...')}"></textarea></div>
    </div>
    <button class="btn btn-primary" onclick="sendMsg()" style="margin-top:12px">📤 ${tr('Send', 'إرسال')}</button>`;
  }
}
window.sendMsg = async function () {
  const receiver_id = document.getElementById('msgTo').value;
  const subject = document.getElementById('msgSubject').value;
  const body = document.getElementById('msgBody').value;
  const priority = document.getElementById('msgPriority').value;
  if (!subject) return showToast(tr('Subject required', 'الموضوع مطلوب'), 'error');
  await API.post('/api/messages', { receiver_id, subject, body, priority });
  showToast(tr('Message sent', 'تم الإرسال')); msgTab = 'sent'; navigateTo(15);
};
window.markRead = async function (id) { await API.put('/api/messages/' + id + '/read', {}); navigateTo(15); };
window.deleteMsg = async function (id) { if (confirm(tr('Delete?', 'حذف؟'))) { await API.delete('/api/messages/' + id); navigateTo(15); } };

// ===== SETTINGS =====
let settingsUsersList = [];
let editingUserId = null;

async function renderSettings(el) {
  const [settings, users] = await Promise.all([API.get('/api/settings'), API.get('/api/settings/users')]);
  settingsUsersList = users;
  el.innerHTML = `<div class="page-title">⚙️ ${tr('Settings', 'الإعدادات')}</div>
    <div class="grid-equal">
      <div class="card"><div class="card-title">🏢 ${tr('Company Info', 'بيانات المنشأة')}</div>
        <div class="form-group mb-12"><label>${tr('Arabic Name', 'الاسم بالعربية')}</label><input class="form-input" id="sNameAr" value="${settings.company_name_ar || ''}"></div>
        <div class="form-group mb-12"><label>${tr('English Name', 'الاسم بالإنجليزية')}</label><input class="form-input" id="sNameEn" value="${settings.company_name_en || ''}"></div>
        <div class="form-group mb-12"><label>${tr('Tax Number', 'الرقم الضريبي')}</label><input class="form-input" id="sTax" value="${settings.tax_number || ''}"></div>
        <div class="form-group mb-12"><label>${tr('CR Number', 'السجل التجاري')}</label><input class="form-input" id="sCr" value="${settings.cr_number || ''}"></div>
        <div class="form-group mb-12"><label>${tr('Phone', 'الهاتف')}</label><input class="form-input" id="sPhone" value="${settings.phone || ''}"></div>
        <div class="form-group mb-16"><label>${tr('Address', 'العنوان')}</label><input class="form-input" id="sAddr" value="${settings.address || ''}"></div>
        <button class="btn btn-primary" onclick="saveSettings()">💾 ${tr('Save', 'حفظ')}</button>
      </div>
      <div class="card"><div class="card-title">👤 ${tr('System Users', 'مستخدمي النظام')}</div>
        <div class="flex gap-8 mb-12">
          <input class="form-input" id="suUser" placeholder="${tr('Username', 'المستخدم')}" style="flex:1">
          <input class="form-input" id="suPass" placeholder="${tr('Password', 'كلمة المرور')}" type="password" style="flex:1" title="${tr('Leave blank to keep same password', 'اترك الحقل فارغاً للاحتفاظ بكلمة المرور')}">
          <input class="form-input" id="suName" placeholder="${tr('Display Name', 'الاسم')}" style="flex:1">
          <select class="form-input" id="suRole" style="flex:1" onchange="document.getElementById('suSpecDiv').style.display = this.value === 'Doctor' ? 'block' : 'none'">
            <option>Admin</option>
            <option>Doctor</option>
            <option>Nurse</option>
            <option>Reception</option>
            <option>Lab</option>
            <option>Radiology</option>
            <option>Pharmacy</option>
            <option>HR</option>
            <option>Finance</option>
          </select>
        </div>
        <div class="form-group mb-12" id="suSpecDiv" style="display:none">
          <label>${tr('Doctor Speciality', 'تخصص الطبيب')}</label>
          <select class="form-input w-full" id="suSpec">
            <option value="General Practice">${tr('General Practice', 'الطب العام')}</option>
            <option value="Dentistry">${tr('Dentistry', 'طب الأسنان')}</option>
            <option value="Internal Medicine">${tr('Internal Medicine', 'الباطنية')}</option>
            <option value="Cardiology">${tr('Cardiology', 'القلب')}</option>
            <option value="Dermatology">${tr('Dermatology', 'الجلدية')}</option>
            <option value="Ophthalmology">${tr('Ophthalmology', 'العيون')}</option>
            <option value="ENT">${tr('ENT', 'الأنف والأذن والحنجرة')}</option>
            <option value="Orthopedics">${tr('Orthopedics', 'جراحة العظام')}</option>
            <option value="Obstetrics">${tr('OB/GYN', 'النساء والولادة')}</option>
            <option value="Pediatrics">${tr('Pediatrics', 'طب الأطفال')}</option>
            <option value="Neurology">${tr('Neurology', 'المخ والأعصاب')}</option>
            <option value="Psychiatry">${tr('Psychiatry', 'الطب النفسي')}</option>
            <option value="Urology">${tr('Urology', 'المسالك البولية')}</option>
            <option value="Endocrinology">${tr('Endocrinology', 'الغدد الصماء')}</option>
            <option value="Gastroenterology">${tr('Gastroenterology', 'الجهاز الهضمي')}</option>
            <option value="Pulmonology">${tr('Pulmonology', 'الصدرية')}</option>
            <option value="Nephrology">${tr('Nephrology', 'الكلى')}</option>
            <option value="Surgery">${tr('General Surgery', 'الجراحة العامة')}</option>
            <option value="Oncology">${tr('Oncology', 'الأورام')}</option>
            <option value="Physiotherapy">${tr('Physiotherapy', 'العلاج الطبيعي')}</option>
            <option value="Nutrition">${tr('Nutrition', 'التغذية')}</option>
            <option value="Emergency">${tr('Emergency', 'الطوارئ')}</option>
          </select>
        </div>
        <div class="form-group mb-12" id="suCommDiv" style="display:none">
          <label>💰 ${tr('Commission Setting', 'إعداد العمولة')}</label>
          <div class="flex gap-8">
            <select class="form-input" id="suCommType" style="flex:1">
              <option value="percentage">${tr('Percentage (%)', 'نسبة مئوية (%)')}</option>
              <option value="fixed">${tr('Fixed Amount per Patient (SAR)', 'مبلغ ثابت لكل مريض (ر.س)')}</option>
            </select>
            <input class="form-input" id="suCommValue" type="number" placeholder="${tr('Value', 'القيمة')}" value="0" step="0.5" style="flex:1">
          </div>
        </div>
        <div class="form-group mb-12">
          <label>${tr('Module Permissions (for non-admins)', 'صلاحيات الأقسام (لغير الإداريين)')}</label>
          <div class="card" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));gap:8px" id="suPerms">
            ${NAV_ITEMS.map((item, i) => i === 0 ? '' : `<label style="display:flex;align-items:center;gap:4px;cursor:pointer"><input type="checkbox" value="${i}" checked id="perm_${i}"> ${item.icon} ${tr(item.en, item.ar)}</label>`).join('')}
          </div>
        </div>
        <div class="flex gap-8 mb-16">
          <button class="btn btn-primary" id="suAddBtn" onclick="addOrUpdateUser()">➕ ${tr('Save User', 'حفظ المستخدم')}</button>
          <button class="btn btn-secondary" id="suCancelBtn" style="display:none" onclick="cancelEditUser()">❌ ${tr('Cancel', 'إلغاء')}</button>
        </div>
        <div id="suTable">${makeTable([tr('Username', 'المستخدم'), tr('Name', 'الاسم'), tr('Role', 'الدور'), tr('Speciality', 'التخصص'), tr('Commission', 'العمولة'), tr('Active', 'نشط'), tr('Actions', 'إجراءات')], users.map(u => ({ cells: [u.username, u.display_name, badge(u.role, 'info'), u.role === 'Doctor' ? u.speciality || '-' : '-', u.role === 'Doctor' ? `${u.commission_value || 0}${u.commission_type === 'percentage' ? '%' : ' SAR'}` : '-', u.is_active ? '✅' : '❌', `<div class="flex gap-4"><button class="btn btn-sm btn-info" onclick="editUser(${u.id})">✏️</button><button class="btn btn-sm btn-danger" onclick="deleteUser(${u.id})">🗑️</button></div>`] })))}</div>
      </div>
    </div>`;
  // Show commission div when role is Doctor
  document.getElementById('suRole').addEventListener('change', function () {
    document.getElementById('suSpecDiv').style.display = this.value === 'Doctor' ? 'block' : 'none';
    document.getElementById('suCommDiv').style.display = this.value === 'Doctor' ? 'block' : 'none';
  });
}
window.saveSettings = async () => {
  try {
    await API.put('/api/settings', { company_name_ar: document.getElementById('sNameAr').value, company_name_en: document.getElementById('sNameEn').value, tax_number: document.getElementById('sTax').value, cr_number: document.getElementById('sCr').value, phone: document.getElementById('sPhone').value, address: document.getElementById('sAddr').value });
    showToast(tr('Settings saved!', 'تم حفظ الإعدادات!'));
  } catch (e) { showToast(tr('Error saving', 'خطأ في الحفظ'), 'error'); }
};
window.addOrUpdateUser = async () => {
  const username = document.getElementById('suUser').value.trim();
  const password = document.getElementById('suPass').value.trim();

  if (!username) { showToast(tr('Enter username', 'ادخل المستخدم'), 'error'); return; }
  if (!editingUserId && !password) { showToast(tr('Enter password for new user', 'ادخل كلمة المرور للمستخدم الجديد'), 'error'); return; }

  try {
    const role = document.getElementById('suRole').value;
    const spec = role === 'Doctor' ? document.getElementById('suSpec').value : '';
    const perms = Array.from(document.querySelectorAll('#suPerms input:checked')).map(cb => cb.value).join(',');
    const commType = role === 'Doctor' ? (document.getElementById('suCommType')?.value || 'percentage') : 'percentage';
    const commValue = role === 'Doctor' ? (parseFloat(document.getElementById('suCommValue')?.value) || 0) : 0;

    if (editingUserId) {
      await API.put(`/api/settings/users/${editingUserId}`, { username, password: password || undefined, display_name: document.getElementById('suName').value, role, speciality: spec, permissions: perms, commission_type: commType, commission_value: commValue, is_active: 1 });
      showToast(tr('User updated!', 'تم تحديث المستخدم!'));
    } else {
      await API.post('/api/settings/users', { username, password, display_name: document.getElementById('suName').value, role, speciality: spec, permissions: perms, commission_type: commType, commission_value: commValue });
      showToast(tr('User added!', 'تم إنشاء المستخدم!'));
    }

    editingUserId = null;
    await navigateTo(18);
  } catch (e) { showToast(e.message || tr('Error saving user', 'خطأ في عملية الحفظ'), 'error'); }
};

window.editUser = (id) => {
  const user = settingsUsersList.find(u => u.id === id);
  if (!user) return;
  editingUserId = id;
  document.getElementById('suUser').value = user.username || '';
  document.getElementById('suName').value = user.display_name || '';
  document.getElementById('suRole').value = user.role || 'Reception';
  document.getElementById('suPass').value = '';

  if (user.role === 'Doctor') {
    document.getElementById('suSpecDiv').style.display = 'block';
    document.getElementById('suSpec').value = user.speciality || 'General Clinic';
    document.getElementById('suCommDiv').style.display = 'block';
    document.getElementById('suCommType').value = user.commission_type || 'percentage';
    document.getElementById('suCommValue').value = user.commission_value || 0;
  } else {
    document.getElementById('suSpecDiv').style.display = 'none';
    document.getElementById('suCommDiv').style.display = 'none';
  }

  document.querySelectorAll('#suPerms input').forEach(cb => cb.checked = false);
  const perms = (user.permissions || '').split(',');
  perms.forEach(p => {
    const cb = document.getElementById(`perm_${p}`);
    if (cb) cb.checked = true;
  });

  document.getElementById('suCancelBtn').style.display = 'inline-block';
  document.getElementById('suAddBtn').innerHTML = `🔄 ${tr('Update User', 'تحديث المستخدم')}`;
};

window.cancelEditUser = () => {
  editingUserId = null;
  document.getElementById('suUser').value = '';
  document.getElementById('suName').value = '';
  document.getElementById('suPass').value = '';
  document.getElementById('suRole').value = 'Reception';
  document.getElementById('suSpecDiv').style.display = 'none';
  document.getElementById('suCommDiv').style.display = 'none';
  document.querySelectorAll('#suPerms input').forEach(cb => cb.checked = true);
  document.getElementById('suCancelBtn').style.display = 'none';
  document.getElementById('suAddBtn').innerHTML = `➕ ${tr('Save User', 'حفظ المستخدم')}`;
};

window.deleteUser = async (id) => {
  if (!confirm(tr('Are you sure you want to delete this user? This cannot be undone.', 'هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.'))) return;
  try {
    await API.delete(`/api/settings/users/${id}`);
    showToast(tr('User deleted!', 'تم الحذف بنجاح!'));
    await navigateTo(18);
  } catch (e) { showToast(e.message || tr('Error deleting', 'خطأ في الحذف'), 'error'); }
};

// ===== CATALOG MODULE =====
async function renderCatalog(el) {
  const [labTests, radExams, services] = await Promise.all([
    API.get('/api/catalog/lab'),
    API.get('/api/catalog/radiology'),
    API.get('/api/medical/services')
  ]);

  // Group lab tests by category
  const labGroups = {};
  labTests.forEach(t => { if (!labGroups[t.category]) labGroups[t.category] = []; labGroups[t.category].push(t); });

  // Group radiology by modality
  const radGroups = {};
  radExams.forEach(r => { if (!radGroups[r.modality]) radGroups[r.modality] = []; radGroups[r.modality].push(r); });

  // Group services by specialty then category
  const svcGroups = {};
  services.forEach(s => {
    if (!svcGroups[s.specialty]) svcGroups[s.specialty] = {};
    if (!svcGroups[s.specialty][s.category]) svcGroups[s.specialty][s.category] = [];
    svcGroups[s.specialty][s.category].push(s);
  });

  const specNames = {
    'General Practice': 'الطب العام', 'Dentistry': 'طب الأسنان', 'Internal Medicine': 'الباطنية',
    'Cardiology': 'القلب', 'Dermatology': 'الجلدية', 'Ophthalmology': 'العيون',
    'ENT': 'الأنف والأذن', 'Orthopedics': 'العظام', 'Obstetrics': 'النساء والولادة',
    'Pediatrics': 'الأطفال', 'Neurology': 'الأعصاب', 'Psychiatry': 'الطب النفسي',
    'Urology': 'المسالك البولية', 'Endocrinology': 'الغدد الصماء', 'Gastroenterology': 'الجهاز الهضمي',
    'Pulmonology': 'الصدرية', 'Nephrology': 'الكلى', 'Surgery': 'الجراحة العامة',
    'Oncology': 'الأورام', 'Physiotherapy': 'العلاج الطبيعي', 'Nutrition': 'التغذية',
    'Emergency': 'الطوارئ'
  };

  const catIcons = { 'Consultation': '🩺', 'Procedure': '🔧', 'Diagnostic': '📊', 'Therapy': '💆', 'Service': '📝' };

  el.innerHTML = `
    <div class="page-title">📂 ${tr('Service Catalog', 'الأصناف والخدمات')}</div>
    <div class="flex gap-8 mb-16">
      <button class="btn btn-primary" id="catTabLab" onclick="switchCatTab('lab')" style="flex:1">🔬 ${tr('Lab Tests', 'فحوصات المختبر')} (${labTests.length})</button>
      <button class="btn btn-secondary" id="catTabRad" onclick="switchCatTab('rad')" style="flex:1">📡 ${tr('Radiology', 'الأشعة')} (${radExams.length})</button>
      <button class="btn btn-secondary" id="catTabSvc" onclick="switchCatTab('svc')" style="flex:1">🏥 ${tr('Procedures', 'الإجراءات الطبية')} (${services.length})</button>
    </div>
    <input class="form-input mb-12" id="catSearch" placeholder="${tr('Search...', 'بحث...')}" oninput="filterCatalog()">

    <div id="catLabContent">
      ${Object.entries(labGroups).map(([cat, tests]) => `
        <div class="card mb-12 cat-item">
          <div class="card-title" style="cursor:pointer" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
            🧪 ${cat} <span class="badge badge-info">${tests.length}</span> <span style="float:left;font-size:12px;color:var(--text-dim)">▼</span>
          </div>
          <div style="display:none">
            <table class="data-table"><thead><tr>
              <th style="width:40%">${tr('Test Name', 'اسم الفحص')}</th>
              <th>${tr('Normal Range', 'المعدل الطبيعي')}</th>
              <th style="width:100px">${tr('Price', 'السعر')}</th>
              <th style="width:60px"></th>
            </tr></thead><tbody>
            ${tests.map(t => `<tr class="cat-row" data-name="${t.test_name.toLowerCase()}">
              <td>${t.test_name}</td>
              <td style="font-size:11px;color:var(--text-dim)">${t.normal_range || '-'}</td>
              <td><input type="number" class="form-input" value="${t.price}" id="labP${t.id}" style="width:80px;text-align:center;padding:4px 6px;font-size:12px"></td>
              <td><button class="btn btn-sm btn-success" onclick="saveCatPrice('lab',${t.id})">💾</button></td>
            </tr>`).join('')}
            </tbody></table>
          </div>
        </div>
      `).join('')}
    </div>

    <div id="catRadContent" style="display:none">
      ${Object.entries(radGroups).map(([mod, exams]) => `
        <div class="card mb-12 cat-item">
          <div class="card-title" style="cursor:pointer" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
            📡 ${mod} <span class="badge badge-info">${exams.length}</span> <span style="float:left;font-size:12px;color:var(--text-dim)">▼</span>
          </div>
          <div style="display:none">
            <table class="data-table"><thead><tr>
              <th style="width:60%">${tr('Exam Name', 'اسم الفحص')}</th>
              <th style="width:100px">${tr('Price', 'السعر')}</th>
              <th style="width:60px"></th>
            </tr></thead><tbody>
            ${exams.map(r => `<tr class="cat-row" data-name="${r.exact_name.toLowerCase()}">
              <td>${r.exact_name}</td>
              <td><input type="number" class="form-input" value="${r.price}" id="radP${r.id}" style="width:80px;text-align:center;padding:4px 6px;font-size:12px"></td>
              <td><button class="btn btn-sm btn-success" onclick="saveCatPrice('rad',${r.id})">💾</button></td>
            </tr>`).join('')}
            </tbody></table>
          </div>
        </div>
      `).join('')}
    </div>

    <div id="catSvcContent" style="display:none">
      <div class="flex gap-8 mb-12" style="flex-wrap:wrap" id="catSpecFilter">
        <button class="btn btn-sm btn-primary" onclick="filterSpec('all')">📋 ${tr('All', 'الكل')}</button>
        ${Object.keys(svcGroups).map(s => `<button class="btn btn-sm btn-secondary" onclick="filterSpec('${s}')">${specNames[s] || s}</button>`).join('')}
      </div>
      ${Object.entries(svcGroups).map(([spec, cats]) => `
        <div class="spec-group" data-spec="${spec}">
          <div class="card mb-12">
            <div class="card-title" style="cursor:pointer;background:var(--hover);border-radius:8px;padding:12px" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
              🏥 ${specNames[spec] || spec} — ${spec} <span class="badge badge-info">${Object.values(cats).flat().length}</span> <span style="float:left;font-size:12px;color:var(--text-dim)">▼</span>
            </div>
            <div style="display:none">
              ${Object.entries(cats).map(([cat, items]) => `
                <div style="margin:12px 0">
                  <div style="font-weight:600;margin-bottom:8px;padding:6px 12px;background:var(--hover);border-radius:6px">${catIcons[cat] || '📌'} ${cat} <span class="badge badge-info" style="font-size:10px">${items.length}</span></div>
                  <table class="data-table"><thead><tr>
                    <th>${tr('Procedure (EN)', 'الإجراء (إنجليزي)')}</th>
                    <th>${tr('Procedure (AR)', 'الإجراء (عربي)')}</th>
                    <th style="width:100px">${tr('Price', 'السعر')}</th>
                    <th style="width:60px"></th>
                  </tr></thead><tbody>
                  ${items.map(s => `<tr class="cat-row" data-name="${s.name_en.toLowerCase()} ${s.name_ar}">
                    <td style="font-size:12px">${s.name_en}</td>
                    <td style="font-size:12px">${s.name_ar}</td>
                    <td><input type="number" class="form-input" value="${s.price}" id="svcP${s.id}" style="width:80px;text-align:center;padding:4px 6px;font-size:12px"></td>
                    <td><button class="btn btn-sm btn-success" onclick="saveCatPrice('svc',${s.id})">💾</button></td>
                  </tr>`).join('')}
                  </tbody></table>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>`;
}

window.switchCatTab = (tab) => {
  document.getElementById('catLabContent').style.display = tab === 'lab' ? 'block' : 'none';
  document.getElementById('catRadContent').style.display = tab === 'rad' ? 'block' : 'none';
  document.getElementById('catSvcContent').style.display = tab === 'svc' ? 'block' : 'none';
  document.getElementById('catTabLab').className = `btn ${tab === 'lab' ? 'btn-primary' : 'btn-secondary'}`;
  document.getElementById('catTabRad').className = `btn ${tab === 'rad' ? 'btn-primary' : 'btn-secondary'}`;
  document.getElementById('catTabSvc').className = `btn ${tab === 'svc' ? 'btn-primary' : 'btn-secondary'}`;
};

window.filterCatalog = () => {
  const q = document.getElementById('catSearch').value.toLowerCase();
  document.querySelectorAll('.cat-row').forEach(row => {
    row.style.display = row.dataset.name.includes(q) ? '' : 'none';
  });
};

window.filterSpec = (spec) => {
  document.querySelectorAll('.spec-group').forEach(g => {
    g.style.display = (spec === 'all' || g.dataset.spec === spec) ? 'block' : 'none';
  });
};

window.saveCatPrice = async (type, id) => {
  try {
    let url, price;
    if (type === 'lab') { url = `/api/catalog/lab/${id}`; price = parseFloat(document.getElementById(`labP${id}`).value); }
    else if (type === 'rad') { url = `/api/catalog/radiology/${id}`; price = parseFloat(document.getElementById(`radP${id}`).value); }
    else { url = `/api/medical/services/${id}`; price = parseFloat(document.getElementById(`svcP${id}`).value); }
    await API.put(url, { price });
    showToast(tr('Price saved!', 'تم حفظ السعر!'));
  } catch (e) { showToast(tr('Error saving', 'خطأ في الحفظ'), 'error'); }
};

// ===== DEPARTMENT RESOURCE REQUESTS =====
async function renderDeptRequests(el) {
  const [requests, items] = await Promise.all([
    API.get('/api/dept-requests').catch(() => []),
    API.get('/api/inventory/items').catch(() => [])
  ]);
  const depts = ['الاستقبال', 'العيادة العامة', 'الباطنية', 'الأطفال', 'العظام', 'الجلدية', 'الأنف والأذن', 'العيون', 'الأسنان', 'الطوارئ', 'المختبر', 'الأشعة', 'الصيدلية', 'التمريض', 'الإدارة'];
  const deptsEn = ['Reception', 'General Clinic', 'Internal Medicine', 'Pediatrics', 'Orthopedics', 'Dermatology', 'ENT', 'Ophthalmology', 'Dental', 'Emergency', 'Laboratory', 'Radiology', 'Pharmacy', 'Nursing', 'Administration'];
  const pending = requests.filter(r => r.status === 'Pending');
  const approved = requests.filter(r => r.status === 'Approved');
  el.innerHTML = `<div class="page-title">📤 ${tr('Department Resource Requests', 'طلبات موارد الأقسام')}</div>
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-label">${tr('Pending Requests', 'طلبات معلقة')}</div><div class="stat-value">${pending.length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Approved', 'معتمدة')}</div><div class="stat-value">${approved.length}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('Total Requests', 'إجمالي الطلبات')}</div><div class="stat-value">${requests.length}</div></div>
    </div>
    <div class="split-layout">
      <div class="card">
        <div class="card-title">➕ ${tr('New Resource Request', 'طلب موارد جديد')}</div>
        <div class="form-group mb-12"><label>${tr('Department', 'القسم')}</label>
          <select class="form-input" id="drqDept">${depts.map((d, i) => `<option value="${isArabic ? d : deptsEn[i]}">${isArabic ? d : deptsEn[i]}</option>`).join('')}</select>
        </div>
        <div class="form-group mb-12"><label>${tr('Select Item', 'اختر الصنف')}</label>
          <select class="form-input" id="drqItem">${items.map(i => `<option value="${i.id}">${i.item_name} (${tr('Stock', 'المخزون')}: ${i.stock_qty})</option>`).join('')}</select>
        </div>
        <div class="flex gap-8 mb-12">
          <div class="form-group" style="flex:1"><label>${tr('Quantity', 'الكمية')}</label><input class="form-input" id="drqQty" type="number" value="1" min="1"></div>
          <div class="form-group" style="flex:1;align-self:end"><button class="btn btn-primary w-full" onclick="addDrqItem()" style="height:40px">➕ ${tr('Add Item', 'إضافة صنف')}</button></div>
        </div>
        <div id="drqItemsList" style="margin-bottom:12px"><span style="color:var(--text-dim);font-size:13px">${tr('No items added', 'لم تتم إضافة أصناف')}</span></div>
        <div class="form-group mb-12"><label>${tr('Notes', 'ملاحظات')}</label><textarea class="form-input" id="drqNotes" rows="2"></textarea></div>
        <button class="btn btn-success w-full" onclick="submitDrq()" style="height:44px">📤 ${tr('Submit Request', 'إرسال الطلب')}</button>
      </div>
      <div class="card">
        <div class="card-title">📋 ${tr('All Requests', 'جميع الطلبات')}</div>
        <input class="search-filter" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'drqTable')">
        <div id="drqTable">${makeTable(
    [tr('Department', 'القسم'), tr('Requested By', 'مقدم الطلب'), tr('Date', 'التاريخ'), tr('Status', 'الحالة'), tr('Actions', 'إجراءات')],
    requests.map(r => ({
      cells: [r.department, r.requested_by, r.request_date || '', statusBadge(r.status)],
      id: r.id, status: r.status
    })),
    (row) => row.status === 'Pending' ? `<div class="flex gap-4"><button class="btn btn-sm btn-success" onclick="approveDrq(${row.id})">✅ ${tr('Approve', 'اعتماد')}</button><button class="btn btn-sm btn-danger" onclick="rejectDrq(${row.id})">❌ ${tr('Reject', 'رفض')}</button></div>` : `<span class="badge badge-${row.status === 'Approved' ? 'success' : 'danger'}">${row.status}</span>`
  )}</div>
      </div>
    </div>`;
}
let drqItems = [];
window.addDrqItem = () => {
  const sel = document.getElementById('drqItem');
  const itemId = parseInt(sel.value);
  const itemName = sel.options[sel.selectedIndex]?.text || '';
  const qty = parseInt(document.getElementById('drqQty').value) || 1;
  if (!itemId) return;
  if (drqItems.find(x => x.item_id === itemId)) { showToast(tr('Item already added', 'الصنف مضاف مسبقاً'), 'error'); return; }
  drqItems.push({ item_id: itemId, name: itemName, qty });
  renderDrqItems();
};
function renderDrqItems() {
  const c = document.getElementById('drqItemsList');
  if (!drqItems.length) { c.innerHTML = `<span style="color:var(--text-dim);font-size:13px">${tr('No items added', 'لم تتم إضافة أصناف')}</span>`; return; }
  c.innerHTML = drqItems.map((item, i) => `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--hover);border-radius:8px;margin:4px 0">
    <span>${item.name} × <strong>${item.qty}</strong></span>
    <button class="btn btn-danger btn-sm" onclick="drqItems.splice(${i},1);renderDrqItems()">🗑</button>
  </div>`).join('');
}
window.submitDrq = async () => {
  if (!drqItems.length) { showToast(tr('Add items first', 'أضف أصناف أولاً'), 'error'); return; }
  try {
    await API.post('/api/dept-requests', {
      department: document.getElementById('drqDept').value,
      requested_by: currentUser?.name || '',
      items: drqItems,
      notes: document.getElementById('drqNotes').value
    });
    showToast(tr('Request submitted!', 'تم إرسال الطلب!'));
    drqItems = [];
    await navigateTo(17);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.approveDrq = async (id) => {
  try { await API.put(`/api/dept-requests/${id}`, { status: 'Approved' }); showToast(tr('Approved!', 'تم الاعتماد!')); await navigateTo(17); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.rejectDrq = async (id) => {
  try { await API.put(`/api/dept-requests/${id}`, { status: 'Rejected' }); showToast(tr('Rejected', 'تم الرفض')); await navigateTo(17); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== SURGERY & PRE-OP =====
let surgeryTab = 'schedule';
async function renderSurgery(el) {
  const [surgeries, patients, ors, emps] = await Promise.all([
    API.get('/api/surgeries'), API.get('/api/patients'),
    API.get('/api/operating-rooms'), API.get('/api/employees')
  ]);
  const doctors = emps.filter(e => e.role === 'Doctor' || e.name);
  const priorityBadge = p => p === 'Urgent' ? badge(p, 'danger') : p === 'Emergency' ? badge(p, 'danger') : badge(p, 'info');
  const surgStatusBadge = s => ({ Scheduled: 'info', 'In Progress': 'warning', Completed: 'success', Cancelled: 'danger' }[s] || 'info');

  el.innerHTML = `
    <div class="page-title">🏥 ${tr('Surgery & Pre-Op Management', 'العمليات وما قبلها')}</div>
    <div class="flex gap-8 mb-16" style="flex-wrap:wrap">
      <button class="btn ${surgeryTab === 'schedule' ? 'btn-primary' : 'btn-secondary'}" onclick="surgeryTab='schedule';navigateTo(18)">📅 ${tr('Surgery Schedule', 'جدول العمليات')}</button>
      <button class="btn ${surgeryTab === 'preop' ? 'btn-primary' : 'btn-secondary'}" onclick="surgeryTab='preop';navigateTo(18)">📋 ${tr('Pre-Op Assessment', 'تقييم ما قبل العملية')}</button>
      <button class="btn ${surgeryTab === 'anesthesia' ? 'btn-primary' : 'btn-secondary'}" onclick="surgeryTab='anesthesia';navigateTo(18)">💉 ${tr('Anesthesia', 'التخدير')}</button>
      <button class="btn ${surgeryTab === 'rooms' ? 'btn-primary' : 'btn-secondary'}" onclick="surgeryTab='rooms';navigateTo(18)">🚪 ${tr('Operating Rooms', 'غرف العمليات')}</button>
    </div>
    <div id="surgeryContent"></div>`;

  const cont = document.getElementById('surgeryContent');
  if (surgeryTab === 'schedule') {
    cont.innerHTML = `
    <div class="split-layout"><div class="card">
      <div class="card-title">📝 ${tr('Schedule New Surgery', 'جدولة عملية جديدة')}</div>
      <div class="form-group mb-12"><label>${tr('Patient', 'المريض')}</label><select class="form-input" id="srgPatient">${patients.map(p => `<option value="${p.id}" data-name="${p.name_en || p.name_ar}">${p.file_number} - ${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)}</option>`).join('')}</select></div>
      <div class="form-group mb-12"><label>${tr('Procedure', 'الإجراء')}</label><input class="form-input" id="srgProc" placeholder="${tr('e.g. Appendectomy', 'مثال: استئصال الزائدة')}"></div>
      <div class="form-group mb-12"><label>${tr('Procedure (Arabic)', 'الإجراء بالعربية')}</label><input class="form-input" id="srgProcAr"></div>
      <div class="form-group mb-12"><label>${tr('Surgeon', 'الجراح')}</label><select class="form-input" id="srgSurgeon"><option value="">${tr('Select', 'اختر')}</option>${doctors.map(d => `<option value="${d.id}" data-name="${d.name}">${d.name}</option>`).join('')}</select></div>
      <div class="form-group mb-12"><label>${tr('Anesthetist', 'طبيب التخدير')}</label><select class="form-input" id="srgAnesth"><option value="">${tr('Select', 'اختر')}</option>${doctors.map(d => `<option value="${d.id}" data-name="${d.name}">${d.name}</option>`).join('')}</select></div>
      <div class="form-group mb-12"><label>${tr('Type', 'النوع')}</label><select class="form-input" id="srgType"><option value="Elective">${tr('Elective', 'اختيارية')}</option><option value="Urgent">${tr('Urgent', 'عاجلة')}</option><option value="Emergency">${tr('Emergency', 'طارئة')}</option></select></div>
      <div class="form-group mb-12"><label>${tr('Operating Room', 'غرفة العمليات')}</label><select class="form-input" id="srgOR">${ors.map(o => `<option value="${isArabic ? o.room_name_ar : o.room_name}">${isArabic ? o.room_name_ar : o.room_name} (${o.location})</option>`).join('')}</select></div>
      <div class="form-group mb-12"><label>${tr('Date', 'التاريخ')}</label><input class="form-input" type="date" id="srgDate" value="${new Date().toISOString().split('T')[0]}"></div>
      <div class="form-group mb-12"><label>${tr('Time', 'الوقت')}</label><input class="form-input" type="time" id="srgTime" value="08:00"></div>
      <div class="form-group mb-12"><label>${tr('Duration (min)', 'المدة (دقيقة)')}</label><input class="form-input" type="number" id="srgDur" value="60"></div>
      <div class="form-group mb-12"><label>${tr('Priority', 'الأولوية')}</label><select class="form-input" id="srgPriority"><option value="Normal">${tr('Normal', 'عادية')}</option><option value="Urgent">${tr('Urgent', 'عاجلة')}</option><option value="Emergency">${tr('Emergency', 'طارئة')}</option></select></div>
      <div class="form-group mb-12"><label>${tr('Notes', 'ملاحظات')}</label><textarea class="form-input form-textarea" id="srgNotes"></textarea></div>
      <button class="btn btn-primary w-full" onclick="scheduleSurgery()" style="height:44px">📅 ${tr('Schedule Surgery', 'جدولة العملية')}</button>
    </div><div class="card">
      <div class="card-title">📋 ${tr('Surgery Schedule', 'جدول العمليات')}</div>
      <input class="search-filter" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'srgTable')">
      <div id="srgTable">${makeTable(
      [tr('ID', '#'), tr('Patient', 'المريض'), tr('Procedure', 'الإجراء'), tr('Surgeon', 'الجراح'), tr('Date', 'التاريخ'), tr('Time', 'الوقت'), tr('OR', 'الغرفة'), tr('Priority', 'الأولوية'), tr('Pre-Op', 'ما قبل'), tr('Status', 'الحالة'), tr('Actions', 'إجراءات')],
      surgeries.map(s => ({ cells: [s.id, s.patient_name, isArabic ? (s.procedure_name_ar || s.procedure_name) : s.procedure_name, s.surgeon_name, s.scheduled_date, s.scheduled_time, s.operating_room, priorityBadge(s.priority), badge(s.preop_status, s.preop_status === 'Complete' ? 'success' : s.preop_status === 'In Progress' ? 'warning' : 'danger'), badge(s.status, surgStatusBadge(s.status))], id: s.id })),
      row => `<div class="flex gap-4" style="flex-wrap:wrap">
              ${row.cells[9]?.includes('Scheduled') || row.cells[9]?.includes('info') ? `<button class="btn btn-warning btn-sm" onclick="updateSurgStatus(${row.id},'In Progress')" style="font-size:11px">▶ ${tr('Start', 'بدء')}</button>` : ''}
              ${!row.cells[9]?.includes('Completed') && !row.cells[9]?.includes('success') ? `<button class="btn btn-success btn-sm" onclick="updateSurgStatus(${row.id},'Completed')" style="font-size:11px;font-weight:bold">✅ ${tr('Surgery Done', 'انتهت العملية')}</button>` : `<span class="badge badge-success">✅ ${tr('Done', 'منتهية')}</span>`}
              <button class="btn btn-danger btn-sm" onclick="deleteSurgery(${row.id})" style="font-size:11px">🗑</button>
            </div>`
    )}</div>
    </div></div>`;
  } else if (surgeryTab === 'preop') {
    cont.innerHTML = `<div class="card">
      <div class="card-title">📋 ${tr('Pre-Operative Assessment', 'تقييم ما قبل العملية')}</div>
      <div class="form-group mb-12"><label>${tr('Select Surgery', 'اختر العملية')}</label>
        <select class="form-input" id="preopSurgery" onchange="loadPreopAssessment()">
          <option value="">${tr('-- Select --', '-- اختر --')}</option>
          ${surgeries.filter(s => s.status === 'Scheduled').map(s => `<option value="${s.id}">${s.id} - ${s.patient_name} - ${s.procedure_name} (${s.scheduled_date})</option>`).join('')}
        </select>
      </div>
      <div id="preopForm" style="display:none">
        <div class="stats-grid" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px">
          ${[{ id: 'npo', icon: '🚫', l: 'NPO Confirmed (صيام مؤكد)' }, { id: 'allergies', icon: '⚠️', l: 'Allergies Reviewed (مراجعة الحساسية)', hasNotes: 1 }, { id: 'medications', icon: '💊', l: 'Medications Reviewed (مراجعة الأدوية)', hasNotes: 1 },
      { id: 'labs', icon: '🔬', l: 'Labs Reviewed (مراجعة الفحوصات)', hasNotes: 1 }, { id: 'imaging', icon: '📡', l: 'Imaging Reviewed (مراجعة الأشعة)', hasNotes: 1 }, { id: 'blood_type', icon: '🩸', l: 'Blood Type Confirmed (فصيلة الدم مؤكدة)' },
      { id: 'consent', icon: '📝', l: 'Consent Signed (الإقرار موقع)' }, { id: 'anesthesia_clr', icon: '💉', l: 'Anesthesia Clearance (موافقة التخدير)' }, { id: 'nursing', icon: '👩‍⚕️', l: 'Nursing Assessment (تقييم التمريض)', hasNotes: 1 },
      { id: 'cardiac', icon: '❤️', l: 'Cardiac Clearance (موافقة القلب)', hasNotes: 1 }, { id: 'pulmonary', icon: '🫁', l: 'Pulmonary Clearance (موافقة الرئة)' }, { id: 'infection', icon: '🦠', l: 'Infection Screening (فحص العدوى)' },
      { id: 'dvt', icon: '💉', l: 'DVT Prophylaxis (الوقاية من الجلطات)' }
      ].map(c => `<div class="stat-card" style="--stat-color:#60a5fa;padding:12px;cursor:pointer" onclick="document.getElementById('preop_${c.id}').checked=!document.getElementById('preop_${c.id}').checked">
            <div style="display:flex;align-items:center;gap:8px"><input type="checkbox" id="preop_${c.id}" style="width:20px;height:20px;accent-color:#4ade80" onclick="event.stopPropagation()"> <span>${c.icon} ${c.l}</span></div>
            ${c.hasNotes ? `<input class="form-input mt-8" id="preop_${c.id}_notes" placeholder="${tr('Notes', 'ملاحظات')}" style="font-size:12px" onclick="event.stopPropagation()">` : ''}</div>`).join('')}
        </div>
        <div class="flex gap-8 mt-16"><div class="form-group" style="flex:1"><label>${tr('Blood Reserved', 'دم محجوز')}</label><select class="form-input" id="preop_blood_reserved"><option value="0">${tr('No', 'لا')}</option><option value="1">${tr('Yes', 'نعم')}</option></select></div></div>
        <button class="btn btn-primary w-full mt-16" onclick="savePreopAssessment()" style="height:44px">💾 ${tr('Save Assessment', 'حفظ التقييم')}</button>
        <div class="card mt-16"><div class="card-title">🔬 ${tr('Required Pre-Op Tests', 'فحوصات مطلوبة قبل العملية')}</div>
          <div class="flex gap-8 mb-12"><select class="form-input" id="preopTestType" style="flex:1"><option value="Lab">${tr('Lab', 'مختبر')}</option><option value="Radiology">${tr('Radiology', 'أشعة')}</option><option value="ECG">ECG</option><option value="Other">${tr('Other', 'أخرى')}</option></select>
            <input class="form-input" id="preopTestName" placeholder="${tr('Test name', 'اسم الفحص')}" style="flex:2">
            <button class="btn btn-success" onclick="addPreopTest()">➕</button></div>
          <div id="preopTestsList"></div>
        </div>
      </div>
    </div>`;
  } else if (surgeryTab === 'anesthesia') {
    cont.innerHTML = `<div class="card">
      <div class="card-title">💉 ${tr('Anesthesia Record', 'سجل التخدير')}</div>
      <div class="form-group mb-12"><label>${tr('Select Surgery', 'اختر العملية')}</label>
        <select class="form-input" id="anesthSurgery" onchange="loadAnesthRecord()">
          <option value="">${tr('-- Select --', '-- اختر --')}</option>
          ${surgeries.map(s => `<option value="${s.id}">${s.id} - ${s.patient_name} - ${s.procedure_name} (${s.scheduled_date})</option>`).join('')}
        </select></div>
      <div id="anesthForm" style="display:none">
        <div class="grid-equal"><div>
          <div class="form-group mb-12"><label>${tr('Anesthetist', 'طبيب التخدير')}</label><input class="form-input" id="anName"></div>
          <div class="form-group mb-12"><label>ASA ${tr('Classification', 'التصنيف')}</label><select class="form-input" id="anASA"><option>ASA I</option><option>ASA II</option><option>ASA III</option><option>ASA IV</option><option>ASA V</option><option>ASA VI</option></select></div>
          <div class="form-group mb-12"><label>${tr('Anesthesia Type', 'نوع التخدير')}</label><select class="form-input" id="anType"><option value="General">${tr('General', 'عام')}</option><option value="Spinal">${tr('Spinal', 'نخاعي')}</option><option value="Epidural">${tr('Epidural', 'فوق الجافية')}</option><option value="Regional">${tr('Regional', 'موضعي')}</option><option value="Local">${tr('Local', 'موضعي')}</option><option value="Sedation">${tr('Sedation', 'تخدير واعي')}</option></select></div>
          <div class="form-group mb-12"><label>${tr('Airway Assessment', 'تقييم المجرى الهوائي')}</label><input class="form-input" id="anAirway"></div>
          <div class="form-group mb-12"><label>Mallampati Score</label><select class="form-input" id="anMallampati"><option value="">-</option><option>Class I</option><option>Class II</option><option>Class III</option><option>Class IV</option></select></div>
        </div><div>
          <div class="form-group mb-12"><label>${tr('Premedication', 'أدوية تحضيرية')}</label><input class="form-input" id="anPremed"></div>
          <div class="form-group mb-12"><label>${tr('Induction Agents', 'أدوية التحريض')}</label><input class="form-input" id="anInduction"></div>
          <div class="form-group mb-12"><label>${tr('Maintenance', 'أدوية الصيانة')}</label><input class="form-input" id="anMaint"></div>
          <div class="form-group mb-12"><label>${tr('Muscle Relaxants', 'مرخيات العضلات')}</label><input class="form-input" id="anRelax"></div>
          <div class="form-group mb-12"><label>${tr('IV Access', 'المدخل الوريدي')}</label><input class="form-input" id="anIV"></div>
        </div></div>
        <div class="grid-equal"><div>
          <div class="form-group mb-12"><label>${tr('Fluid Given', 'السوائل المعطاة')}</label><input class="form-input" id="anFluid"></div>
          <div class="form-group mb-12"><label>${tr('Blood Loss (ml)', 'فقدان الدم (مل)')}</label><input class="form-input" type="number" id="anBloodLoss" value="0"></div>
        </div><div>
          <div class="form-group mb-12"><label>${tr('Complications', 'مضاعفات')}</label><input class="form-input" id="anComp"></div>
          <div class="form-group mb-12"><label>${tr('Recovery Notes', 'ملاحظات الإفاقة')}</label><textarea class="form-input form-textarea" id="anRecovery"></textarea></div>
        </div></div>
        <button class="btn btn-primary w-full" onclick="saveAnesthRecord()" style="height:44px">💾 ${tr('Save Anesthesia Record', 'حفظ سجل التخدير')}</button>
      </div></div>`;
  } else if (surgeryTab === 'rooms') {
    cont.innerHTML = `<div class="card">
      <div class="card-title">🚪 ${tr('Operating Rooms', 'غرف العمليات')}</div>
      <div class="stats-grid" style="margin-bottom:16px">${ors.map(o => `<div class="stat-card" style="--stat-color:${o.status === 'Available' ? '#4ade80' : '#f87171'}">
        <span class="stat-icon">🚪</span><div class="stat-label">${isArabic ? o.room_name_ar : o.room_name}</div>
        <div class="stat-value" style="font-size:14px">${o.location}</div>
        <div>${badge(o.status, o.status === 'Available' ? 'success' : 'danger')}</div>
      </div>`).join('')}</div>
    </div>`;
  }
}

window.scheduleSurgery = async () => {
  const pSel = document.getElementById('srgPatient');
  try {
    await API.post('/api/surgeries', {
      patient_id: pSel.value, patient_name: pSel.options[pSel.selectedIndex]?.dataset?.name || '',
      surgeon_id: document.getElementById('srgSurgeon').value, surgeon_name: document.getElementById('srgSurgeon').options[document.getElementById('srgSurgeon').selectedIndex]?.dataset?.name || '',
      anesthetist_id: document.getElementById('srgAnesth').value, anesthetist_name: document.getElementById('srgAnesth').options[document.getElementById('srgAnesth').selectedIndex]?.dataset?.name || '',
      procedure_name: document.getElementById('srgProc').value, procedure_name_ar: document.getElementById('srgProcAr').value,
      surgery_type: document.getElementById('srgType').value, operating_room: document.getElementById('srgOR').value,
      scheduled_date: document.getElementById('srgDate').value, scheduled_time: document.getElementById('srgTime').value,
      estimated_duration: document.getElementById('srgDur').value, priority: document.getElementById('srgPriority').value,
      notes: document.getElementById('srgNotes').value
    });
    showToast(tr('Surgery scheduled!', 'تم جدولة العملية!')); surgeryTab = 'schedule'; await navigateTo(18);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.updateSurgStatus = async (id, status) => {
  try { await API.put(`/api/surgeries/${id}`, { status }); showToast(tr('Updated', 'تم التحديث')); await navigateTo(18); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.deleteSurgery = async (id) => {
  if (!confirm(tr('Delete this surgery?', 'حذف هذه العملية؟'))) return;
  try { await API.del(`/api/surgeries/${id}`); showToast(tr('Deleted', 'تم الحذف')); await navigateTo(18); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.loadPreopAssessment = async () => {
  const sid = document.getElementById('preopSurgery').value;
  if (!sid) { document.getElementById('preopForm').style.display = 'none'; return; }
  document.getElementById('preopForm').style.display = 'block';
  try {
    const data = await API.get(`/api/surgeries/${sid}/preop`);
    if (data) {
      const map = { npo: 'npo_confirmed', allergies: 'allergies_reviewed', medications: 'medications_reviewed', labs: 'labs_reviewed', imaging: 'imaging_reviewed', blood_type: 'blood_type_confirmed', consent: 'consent_signed', anesthesia_clr: 'anesthesia_clearance', nursing: 'nursing_assessment', cardiac: 'cardiac_clearance', pulmonary: 'pulmonary_clearance', infection: 'infection_screening', dvt: 'dvt_prophylaxis' };
      Object.entries(map).forEach(([k, v]) => { const el = document.getElementById('preop_' + k); if (el) el.checked = !!data[v]; });
      ['allergies', 'medications', 'labs', 'imaging', 'nursing', 'cardiac'].forEach(k => { const el = document.getElementById('preop_' + k + '_notes'); if (el) el.value = data[k + '_notes'] || ''; });
      document.getElementById('preop_blood_reserved').value = data.blood_reserved ? '1' : '0';
    }
    const tests = await API.get(`/api/surgeries/${sid}/preop-tests`);
    const tl = document.getElementById('preopTestsList');
    tl.innerHTML = tests.length ? makeTable([tr('Type', 'النوع'), tr('Test', 'الفحص'), tr('Status', 'الحالة'), tr('Result', 'النتيجة'), tr('Action', 'إجراء')],
      tests.map(t => ({ cells: [t.test_type, t.test_name, t.is_completed ? badge(tr('Done', 'تم'), 'success') : badge(tr('Pending', 'معلق'), 'warning'), t.result_summary || '-'], id: t.id })),
      row => `<button class="btn btn-success btn-sm" onclick="markTestDone(${row.id})">✅</button>`) : `<p style="color:var(--text-dim)">${tr('No tests added', 'لم تتم إضافة فحوصات')}</p>`;
  } catch (e) { console.error(e); }
};
window.savePreopAssessment = async () => {
  const sid = document.getElementById('preopSurgery').value;
  if (!sid) return;
  try {
    await API.post(`/api/surgeries/${sid}/preop`, {
      npo_confirmed: document.getElementById('preop_npo').checked, allergies_reviewed: document.getElementById('preop_allergies').checked,
      allergies_notes: document.getElementById('preop_allergies_notes')?.value || '', medications_reviewed: document.getElementById('preop_medications').checked,
      medications_notes: document.getElementById('preop_medications_notes')?.value || '', labs_reviewed: document.getElementById('preop_labs').checked,
      labs_notes: document.getElementById('preop_labs_notes')?.value || '', imaging_reviewed: document.getElementById('preop_imaging').checked,
      imaging_notes: document.getElementById('preop_imaging_notes')?.value || '', blood_type_confirmed: document.getElementById('preop_blood_type').checked,
      blood_reserved: document.getElementById('preop_blood_reserved').value === '1', consent_signed: document.getElementById('preop_consent').checked,
      anesthesia_clearance: document.getElementById('preop_anesthesia_clr').checked, nursing_assessment: document.getElementById('preop_nursing').checked,
      nursing_notes: document.getElementById('preop_nursing_notes')?.value || '', cardiac_clearance: document.getElementById('preop_cardiac').checked,
      cardiac_notes: document.getElementById('preop_cardiac_notes')?.value || '', pulmonary_clearance: document.getElementById('preop_pulmonary').checked,
      infection_screening: document.getElementById('preop_infection').checked, dvt_prophylaxis: document.getElementById('preop_dvt').checked
    });
    showToast(tr('Assessment saved!', 'تم حفظ التقييم!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.addPreopTest = async () => {
  const sid = document.getElementById('preopSurgery').value;
  if (!sid) return;
  try {
    await API.post(`/api/surgeries/${sid}/preop-tests`, { test_type: document.getElementById('preopTestType').value, test_name: document.getElementById('preopTestName').value });
    showToast(tr('Test added', 'تم إضافة الفحص')); loadPreopAssessment();
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.markTestDone = async (id) => {
  try { await API.put(`/api/surgery-preop-tests/${id}`, { is_completed: 1 }); showToast(tr('Done', 'تم')); loadPreopAssessment(); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.loadAnesthRecord = async () => {
  const sid = document.getElementById('anesthSurgery').value;
  if (!sid) { document.getElementById('anesthForm').style.display = 'none'; return; }
  document.getElementById('anesthForm').style.display = 'block';
  try {
    const d = await API.get(`/api/surgeries/${sid}/anesthesia`);
    if (d) {
      document.getElementById('anName').value = d.anesthetist_name || ''; document.getElementById('anASA').value = d.asa_class || 'ASA I';
      document.getElementById('anType').value = d.anesthesia_type || 'General'; document.getElementById('anAirway').value = d.airway_assessment || '';
      document.getElementById('anMallampati').value = d.mallampati_score || ''; document.getElementById('anPremed').value = d.premedication || '';
      document.getElementById('anInduction').value = d.induction_agents || ''; document.getElementById('anMaint').value = d.maintenance_agents || '';
      document.getElementById('anRelax').value = d.muscle_relaxants || ''; document.getElementById('anIV').value = d.iv_access || '';
      document.getElementById('anFluid').value = d.fluid_given || ''; document.getElementById('anBloodLoss').value = d.blood_loss_ml || 0;
      document.getElementById('anComp').value = d.complications || ''; document.getElementById('anRecovery').value = d.recovery_notes || '';
    }
  } catch (e) { }
};
window.saveAnesthRecord = async () => {
  const sid = document.getElementById('anesthSurgery').value;
  if (!sid) return;
  try {
    await API.post(`/api/surgeries/${sid}/anesthesia`, {
      anesthetist_name: document.getElementById('anName').value, asa_class: document.getElementById('anASA').value,
      anesthesia_type: document.getElementById('anType').value, airway_assessment: document.getElementById('anAirway').value,
      mallampati_score: document.getElementById('anMallampati').value, premedication: document.getElementById('anPremed').value,
      induction_agents: document.getElementById('anInduction').value, maintenance_agents: document.getElementById('anMaint').value,
      muscle_relaxants: document.getElementById('anRelax').value, iv_access: document.getElementById('anIV').value,
      fluid_given: document.getElementById('anFluid').value, blood_loss_ml: parseInt(document.getElementById('anBloodLoss').value) || 0,
      complications: document.getElementById('anComp').value, recovery_notes: document.getElementById('anRecovery').value
    });
    showToast(tr('Anesthesia record saved!', 'تم حفظ سجل التخدير!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== BLOOD BANK =====
let bbTab = 'inventory';
async function renderBloodBank(el) {
  const [stats, units, donors, crossmatches, transfusions, patients] = await Promise.all([
    API.get('/api/blood-bank/stats'), API.get('/api/blood-bank/units'),
    API.get('/api/blood-bank/donors'), API.get('/api/blood-bank/crossmatch'),
    API.get('/api/blood-bank/transfusions'), API.get('/api/patients')
  ]);
  const btColors = { 'A': '#ef4444', 'B': '#3b82f6', 'AB': '#8b5cf6', 'O': '#22c55e' };
  el.innerHTML = `
    <div class="page-title">🩸 ${tr('Blood Bank', 'بنك الدم')}</div>
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:#ef4444"><span class="stat-icon">🩸</span><div class="stat-label">${tr('Available Units', 'وحدات متاحة')}</div><div class="stat-value">${stats.total}</div></div>
      <div class="stat-card" style="--stat-color:#f59e0b"><span class="stat-icon">⏰</span><div class="stat-label">${tr('Expiring Soon', 'تنتهي قريباً')}</div><div class="stat-value">${stats.expiring}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">👥</span><div class="stat-label">${tr('Total Donors', 'إجمالي المتبرعين')}</div><div class="stat-value">${stats.totalDonors}</div></div>
      <div class="stat-card" style="--stat-color:#8b5cf6"><span class="stat-icon">🔄</span><div class="stat-label">${tr('Today Transfusions', 'نقل دم اليوم')}</div><div class="stat-value">${stats.todayTransfusions}</div></div>
      <div class="stat-card" style="--stat-color:#06b6d4"><span class="stat-icon">🧪</span><div class="stat-label">${tr('Pending Cross-Match', 'توافق معلق')}</div><div class="stat-value">${stats.pendingCrossmatch}</div></div>
    </div>
    <div class="stats-grid mt-16" style="grid-template-columns:repeat(8,1fr)">
      ${['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => {
    const bt = t.replace(/[+-]/, ''), rh = t.includes('+') ? '+' : '-';
    const cnt = stats.byType?.find(b => b.blood_type === bt && b.rh_factor === rh)?.cnt || 0;
    return `<div class="stat-card" style="--stat-color:${btColors[bt] || '#888'};text-align:center;padding:12px"><div style="font-size:24px;font-weight:800">${t}</div><div style="font-size:18px;font-weight:600">${cnt}</div><div style="font-size:10px">${tr('units', 'وحدة')}</div></div>`;
  }).join('')}
    </div>
    <div class="flex gap-8 mt-16 mb-16" style="flex-wrap:wrap">
      <button class="btn ${bbTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}" onclick="bbTab='inventory';navigateTo(19)">📦 ${tr('Inventory', 'المخزون')}</button>
      <button class="btn ${bbTab === 'donors' ? 'btn-primary' : 'btn-secondary'}" onclick="bbTab='donors';navigateTo(19)">👥 ${tr('Donors', 'المتبرعين')}</button>
      <button class="btn ${bbTab === 'crossmatch' ? 'btn-primary' : 'btn-secondary'}" onclick="bbTab='crossmatch';navigateTo(19)">🧪 ${tr('Cross-Match', 'التوافق')}</button>
      <button class="btn ${bbTab === 'transfusions' ? 'btn-primary' : 'btn-secondary'}" onclick="bbTab='transfusions';navigateTo(19)">💉 ${tr('Transfusions', 'نقل الدم')}</button>
    </div>
    <div id="bbContent"></div>`;
  const cont = document.getElementById('bbContent');
  if (bbTab === 'inventory') {
    cont.innerHTML = `<div class="split-layout"><div class="card">
      <div class="card-title">➕ ${tr('Add Blood Unit', 'إضافة وحدة دم')}</div>
      <div class="form-group mb-12"><label>${tr('Bag Number', 'رقم الكيس')}</label><input class="form-input" id="bbBag"></div>
      <div class="form-group mb-12"><label>${tr('Blood Type', 'فصيلة الدم')}</label><select class="form-input" id="bbType"><option>A</option><option>B</option><option>AB</option><option>O</option></select></div>
      <div class="form-group mb-12"><label>Rh</label><select class="form-input" id="bbRh"><option value="+">+</option><option value="-">-</option></select></div>
      <div class="form-group mb-12"><label>${tr('Component', 'المكون')}</label><select class="form-input" id="bbComp"><option>Whole Blood</option><option>Packed RBC</option><option>FFP</option><option>Platelets</option><option>Cryoprecipitate</option></select></div>
      <div class="form-group mb-12"><label>${tr('Collection Date', 'تاريخ التجميع')}</label><input class="form-input" type="date" id="bbCollDate" value="${new Date().toISOString().split('T')[0]}"></div>
      <div class="form-group mb-12"><label>${tr('Expiry Date', 'تاريخ الانتهاء')}</label><input class="form-input" type="date" id="bbExpDate"></div>
      <div class="form-group mb-12"><label>${tr('Volume (ml)', 'الحجم (مل)')}</label><input class="form-input" type="number" id="bbVol" value="450"></div>
      <button class="btn btn-primary w-full" onclick="addBloodUnit()" style="height:44px">💾 ${tr('Add Unit', 'إضافة وحدة')}</button>
    </div><div class="card">
      <div class="card-title">📦 ${tr('Blood Units', 'وحدات الدم')}</div>
      <div id="bbUnitsTable">${makeTable([tr('Bag#', 'رقم الكيس'), tr('Type', 'الفصيلة'), tr('Component', 'المكون'), tr('Collection', 'التجميع'), tr('Expiry', 'الانتهاء'), tr('Status', 'الحالة')],
      units.map(u => ({ cells: [u.bag_number, u.blood_type + u.rh_factor, u.component, u.collection_date, u.expiry_date, statusBadge(u.status)] })))}</div>
    </div></div>`;
  } else if (bbTab === 'donors') {
    cont.innerHTML = `<div class="split-layout"><div class="card">
      <div class="card-title">👤 ${tr('Register Donor', 'تسجيل متبرع')}</div>
      <div class="form-group mb-12"><label>${tr('Name (EN)', 'الاسم (إنجليزي)')}</label><input class="form-input" id="bbDonorName"></div>
      <div class="form-group mb-12"><label>${tr('Name (AR)', 'الاسم (عربي)')}</label><input class="form-input" id="bbDonorNameAr"></div>
      <div class="form-group mb-12"><label>${tr('National ID', 'الهوية')}</label><input class="form-input" id="bbDonorNID"></div>
      <div class="form-group mb-12"><label>${tr('Phone', 'الجوال')}</label><input class="form-input" id="bbDonorPhone"></div>
      <div class="form-group mb-12"><label>${tr('Blood Type', 'فصيلة الدم')}</label><select class="form-input" id="bbDonorBT"><option>A</option><option>B</option><option>AB</option><option>O</option></select></div>
      <div class="form-group mb-12"><label>Rh</label><select class="form-input" id="bbDonorRh"><option value="+">+</option><option value="-">-</option></select></div>
      <div class="form-group mb-12"><label>${tr('Age', 'العمر')}</label><input class="form-input" type="number" id="bbDonorAge"></div>
      <button class="btn btn-primary w-full" onclick="addDonor()" style="height:44px">💾 ${tr('Register', 'تسجيل')}</button>
    </div><div class="card">
      <div class="card-title">👥 ${tr('Donors List', 'قائمة المتبرعين')}</div>
      <div id="bbDonorsTable">${makeTable([tr('Name', 'الاسم'), tr('ID', 'الهوية'), tr('Blood Type', 'الفصيلة'), tr('Phone', 'الجوال'), tr('Last Donation', 'آخر تبرع'), tr('Eligible', 'مؤهل')],
      donors.map(d => ({ cells: [isArabic ? (d.donor_name_ar || d.donor_name) : d.donor_name, d.national_id, d.blood_type + d.rh_factor, d.phone, d.last_donation_date, d.is_eligible ? badge(tr('Yes', 'نعم'), 'success') : badge(tr('No', 'لا'), 'danger')] })))}</div>
    </div></div>`;
  } else if (bbTab === 'crossmatch') {
    cont.innerHTML = `<div class="split-layout"><div class="card">
      <div class="card-title">🧪 ${tr('Request Cross-Match', 'طلب فحص توافق')}</div>
      <div class="form-group mb-12"><label>${tr('Patient', 'المريض')}</label><select class="form-input" id="bbCMPatient">${patients.map(p => `<option value="${p.id}" data-name="${p.name_en || p.name_ar}">${p.file_number} - ${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)}</option>`).join('')}</select></div>
      <div class="form-group mb-12"><label>${tr('Blood Type', 'فصيلة المريض')}</label><select class="form-input" id="bbCMBT"><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option></select></div>
      <div class="form-group mb-12"><label>${tr('Units Needed', 'الوحدات المطلوبة')}</label><input class="form-input" type="number" id="bbCMUnits" value="1"></div>
      <button class="btn btn-primary w-full" onclick="requestCrossmatch()" style="height:44px">🧪 ${tr('Request', 'طلب')}</button>
    </div><div class="card">
      <div class="card-title">📋 ${tr('Cross-Match Results', 'نتائج التوافق')}</div>
      <div id="bbCMTable">${makeTable([tr('Patient', 'المريض'), tr('Type', 'الفصيلة'), tr('Units', 'الوحدات'), tr('Technician', 'الفني'), tr('Result', 'النتيجة'), tr('Action', 'إجراء')],
      crossmatches.map(c => ({ cells: [c.patient_name, c.patient_blood_type, c.units_needed, c.lab_technician, c.result === 'Pending' ? badge(c.result, 'warning') : c.result === 'Compatible' ? badge(c.result, 'success') : badge(c.result, 'danger')], id: c.id })),
      row => `<button class="btn btn-success btn-sm" onclick="updateCrossmatch(${row.id},'Compatible')">✅</button><button class="btn btn-danger btn-sm" onclick="updateCrossmatch(${row.id},'Incompatible')">❌</button>`)}</div>
    </div></div>`;
  } else if (bbTab === 'transfusions') {
    cont.innerHTML = `<div class="split-layout"><div class="card">
      <div class="card-title">💉 ${tr('Record Transfusion', 'تسجيل نقل دم')}</div>
      <div class="form-group mb-12"><label>${tr('Patient', 'المريض')}</label><select class="form-input" id="bbTrPatient">${patients.map(p => `<option value="${p.id}" data-name="${p.name_en || p.name_ar}">${p.file_number} - ${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)}</option>`).join('')}</select></div>
      <div class="form-group mb-12"><label>${tr('Blood Unit', 'وحدة الدم')}</label><select class="form-input" id="bbTrUnit">${units.filter(u => u.status === 'Available').map(u => `<option value="${u.id}" data-bag="${u.bag_number}" data-bt="${u.blood_type + u.rh_factor}" data-comp="${u.component}">${u.bag_number} (${u.blood_type}${u.rh_factor} - ${u.component})</option>`).join('')}</select></div>
      <div class="form-group mb-12"><label>${tr('Volume (ml)', 'الحجم (مل)')}</label><input class="form-input" type="number" id="bbTrVol" value="450"></div>
      <button class="btn btn-primary w-full" onclick="recordTransfusion()" style="height:44px">💉 ${tr('Record', 'تسجيل')}</button>
    </div><div class="card">
      <div class="card-title">📋 ${tr('Transfusion Records', 'سجل نقل الدم')}</div>
      <div id="bbTrTable">${makeTable([tr('Patient', 'المريض'), tr('Bag#', 'الكيس'), tr('Type', 'الفصيلة'), tr('Component', 'المكون'), tr('By', 'بواسطة'), tr('Time', 'الوقت'), tr('Reaction', 'تفاعل')],
      transfusions.map(t => ({ cells: [t.patient_name, t.bag_number, t.blood_type, t.component, t.administered_by, t.start_time?.split('T')[0] || '', t.adverse_reaction ? badge(tr('Yes', 'نعم'), 'danger') : badge(tr('No', 'لا'), 'success')] })))}</div>
    </div></div>`;
  }
}
window.addBloodUnit = async () => {
  try {
    await API.post('/api/blood-bank/units', { bag_number: document.getElementById('bbBag').value, blood_type: document.getElementById('bbType').value, rh_factor: document.getElementById('bbRh').value, component: document.getElementById('bbComp').value, collection_date: document.getElementById('bbCollDate').value, expiry_date: document.getElementById('bbExpDate').value, volume_ml: document.getElementById('bbVol').value });
    showToast(tr('Unit added!', 'تم إضافة الوحدة!')); bbTab = 'inventory'; await navigateTo(19);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.addDonor = async () => {
  try {
    await API.post('/api/blood-bank/donors', { donor_name: document.getElementById('bbDonorName').value, donor_name_ar: document.getElementById('bbDonorNameAr').value, national_id: document.getElementById('bbDonorNID').value, phone: document.getElementById('bbDonorPhone').value, blood_type: document.getElementById('bbDonorBT').value, rh_factor: document.getElementById('bbDonorRh').value, age: document.getElementById('bbDonorAge').value });
    showToast(tr('Donor registered!', 'تم تسجيل المتبرع!')); bbTab = 'donors'; await navigateTo(19);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.requestCrossmatch = async () => {
  const sel = document.getElementById('bbCMPatient');
  try {
    await API.post('/api/blood-bank/crossmatch', { patient_id: sel.value, patient_name: sel.options[sel.selectedIndex]?.dataset?.name || '', patient_blood_type: document.getElementById('bbCMBT').value, units_needed: document.getElementById('bbCMUnits').value });
    showToast(tr('Cross-match requested!', 'تم طلب فحص التوافق!')); bbTab = 'crossmatch'; await navigateTo(19);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.updateCrossmatch = async (id, result) => {
  try { await API.put(`/api/blood-bank/crossmatch/${id}`, { result }); showToast(tr('Updated', 'تم التحديث')); await navigateTo(19); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.recordTransfusion = async () => {
  const pSel = document.getElementById('bbTrPatient'), uSel = document.getElementById('bbTrUnit');
  const opt = uSel.options[uSel.selectedIndex];
  try {
    await API.post('/api/blood-bank/transfusions', { patient_id: pSel.value, patient_name: pSel.options[pSel.selectedIndex]?.dataset?.name || '', unit_id: uSel.value, bag_number: opt?.dataset?.bag || '', blood_type: opt?.dataset?.bt || '', component: opt?.dataset?.comp || '', volume_ml: document.getElementById('bbTrVol').value });
    showToast(tr('Transfusion recorded!', 'تم تسجيل نقل الدم!')); bbTab = 'transfusions'; await navigateTo(19);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== CONSENT FORMS =====
async function renderConsentForms(el) {
  const [forms, patients, templates] = await Promise.all([
    API.get('/api/consent-forms'), API.get('/api/patients'),
    API.get('/api/consent-forms/templates/list')
  ]);
  el.innerHTML = `
    <div class="page-title">📜 ${tr('Electronic Consent Forms', 'الإقرارات الإلكترونية')}</div>
    <div class="split-layout"><div class="card">
      <div class="card-title">📝 ${tr('Create Consent Form', 'إنشاء إقرار')}</div>
      <div class="form-group mb-12"><label>${tr('Template', 'القالب')}</label>
        <select class="form-input" id="cfTemplate" onchange="loadConsentTemplate()">
          <option value="">${tr('-- Select Template --', '-- اختر القالب --')}</option>
          ${templates.map(t => `<option value="${t.type}" data-title="${t.title}" data-title-ar="${t.title_ar}" data-content="${t.content}">${isArabic ? t.title_ar : t.title}</option>`).join('')}
        </select></div>
      <div class="form-group mb-12"><label>${tr('Patient', 'المريض')}</label><select class="form-input" id="cfPatient">${patients.map(p => `<option value="${p.id}" data-name="${p.name_en || p.name_ar}">${p.file_number} - ${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)}</option>`).join('')}</select></div>
      <div class="form-group mb-12"><label>${tr('Title', 'العنوان')}</label><input class="form-input" id="cfTitle"></div>
      <div class="form-group mb-12"><label>${tr('Content', 'المحتوى')}</label><textarea class="form-input form-textarea" id="cfContent" rows="6"></textarea></div>
      <div class="form-group mb-12"><label>${tr('Doctor', 'الطبيب')}</label><input class="form-input" id="cfDoctor"></div>
      <button class="btn btn-primary w-full" onclick="createConsentForm()" style="height:44px">📝 ${tr('Create Form', 'إنشاء الإقرار')}</button>
    </div><div>
      <div class="card mb-16">
        <div class="card-title">✍️ ${tr('Sign Consent Form', 'توقيع الإقرار')}</div>
        <div class="form-group mb-12"><label>${tr('Select Form', 'اختر الإقرار')}</label>
          <select class="form-input" id="cfSignSelect" onchange="loadConsentForSign()">
            <option value="">${tr('-- Select --', '-- اختر --')}</option>
            ${forms.filter(f => f.status === 'Pending').map(f => `<option value="${f.id}">#${f.id} - ${f.patient_name} - ${isArabic ? (f.form_title_ar || f.form_title) : f.form_title}</option>`).join('')}
          </select></div>
        <div id="cfSignArea" style="display:none">
          <div id="cfSignContent" class="card mb-12" style="background:var(--hover);padding:16px;font-size:14px;line-height:1.8;max-height:200px;overflow-y:auto"></div>
          <div class="form-group mb-12"><label>✍️ ${tr('Patient Signature', 'توقيع المريض')}</label>
            <canvas id="cfSigCanvas" width="400" height="150" style="border:2px solid var(--border);border-radius:8px;background:#fff;cursor:crosshair;touch-action:none;width:100%;max-width:400px"></canvas>
            <button class="btn btn-secondary btn-sm mt-8" onclick="clearSigCanvas()">🗑 ${tr('Clear', 'مسح')}</button></div>
          <div class="form-group mb-12"><label>${tr('Witness Name', 'اسم الشاهد')}</label><input class="form-input" id="cfWitness"></div>
          <button class="btn btn-success w-full" onclick="signConsentForm()" style="height:44px">✅ ${tr('Sign & Confirm', 'توقيع وتأكيد')}</button>
        </div>
      </div>
      <div class="card">
        <div class="card-title">📋 ${tr('All Consent Forms', 'جميع الإقرارات')}</div>
        <div id="cfTable">${makeTable([tr('ID', '#'), tr('Patient', 'المريض'), tr('Type', 'النوع'), tr('Title', 'العنوان'), tr('Doctor', 'الطبيب'), tr('Status', 'الحالة'), tr('Signed', 'التوقيع'), tr('Actions', 'إجراءات')],
    forms.map(f => ({ cells: [f.id, f.patient_name, f.form_type, isArabic ? (f.form_title_ar || f.form_title) : f.form_title, f.doctor_name, f.status === 'Signed' ? badge(tr('Signed', 'موقع'), 'success') : badge(tr('Pending', 'معلق'), 'warning'), f.signed_at || '-', `<button class="btn btn-sm" onclick="printConsentForm(${f.id})" title="${tr('Print', 'طباعة')}">🖨️</button>`] })))}</div>
      </div>
    </div></div>`;
}
window.printConsentForm = async (formId) => {
  try {
    const [form, settings] = await Promise.all([
      API.get('/api/consent-forms/' + formId),
      API.get('/api/settings')
    ]);
    // Try to use rich HTML template if available
    if (form.form_type) {
      const renderUrl = `/api/consent-forms/render/${form.form_type}?patient_id=${form.patient_id || ''}&doctor_name=${encodeURIComponent(form.doctor_name || '')}`;
      try {
        const resp = await fetch(renderUrl);
        if (resp.ok) {
          const w = window.open('', '_blank');
          const html = await resp.text();
          // Add print/close buttons at top
          const printBar = `<div class="no-print" style="text-align:center;margin-bottom:20px;padding:15px;background:#f8f9fa;border-bottom:2px solid #1a365d">
            <button onclick="window.print()" style="padding:12px 40px;font-size:16px;background:#1a365d;color:#fff;border:none;border-radius:8px;cursor:pointer">🖨️ طباعة / Print</button>
            <button onclick="window.close()" style="padding:12px 30px;font-size:16px;background:#dc3545;color:#fff;border:none;border-radius:8px;cursor:pointer;margin-right:10px">✕ إغلاق</button>
          </div><style>@media print{.no-print{display:none!important}}</style>`;
          const finalHtml = html.replace('<body>', '<body>' + printBar);
          w.document.write(finalHtml);
          w.document.close();
          return;
        }
      } catch (e) { /* fall through to legacy print */ }
    }
    // Legacy text-based print (fallback)
    const hospitalAr = settings.company_name_ar || 'نما الطبي';
    const hospitalEn = settings.company_name_en || 'Nama Medical';
    const phone = settings.phone || '';
    const address = settings.address || '';
    const taxNum = settings.tax_number || '';
    const title = form.form_title_ar || form.form_title || '';
    const titleEn = form.form_title || '';
    const contentText = (form.content || '').replace(/\\n/g, '\n');
    const contentParts = contentText.split('\n').filter(l => l.trim());
    const arabicContent = contentParts.filter(l => /[\u0600-\u06FF]/.test(l));
    const englishContent = contentParts.filter(l => !/[\u0600-\u06FF]/.test(l.replace(/[⚠️]/g, '')));
    const signedDate = form.signed_at ? new Date(form.signed_at).toLocaleDateString('ar-SA') : new Date().toLocaleDateString('ar-SA');
    const sigImg = form.patient_signature && form.patient_signature.startsWith('data:') ? `<img src="${form.patient_signature}" style="max-height:80px;max-width:200px">` : '<div style="height:60px;border-bottom:2px solid #333;width:200px"></div>';
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8">
<title>${title}</title>
<style>
@page{size:A4;margin:18mm}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Tahoma,Arial,sans-serif;padding:30px;color:#222;direction:rtl;line-height:1.8;font-size:14px}
.header{text-align:center;border-bottom:3px double #1a365d;padding-bottom:18px;margin-bottom:25px}
.header h1{font-size:22px;color:#1a365d;margin:6px 0}
.header h2{font-size:16px;color:#555;font-weight:500;margin-bottom:4px}
.header .hospital-info{font-size:11px;color:#888;margin-top:8px}
.patient-box{display:grid;grid-template-columns:1fr 1fr;gap:10px;border:1px solid #ccc;border-radius:8px;padding:16px;margin-bottom:20px;background:#fafbfc}
.patient-box .field{font-size:13px}
.patient-box .field label{font-weight:700;color:#1a365d}
.consent-section{margin:20px 0;padding:18px;border:1px solid #ddd;border-radius:10px}
.consent-section h3{color:#1a365d;font-size:16px;text-align:center;margin-bottom:14px;border-bottom:1px solid #eee;padding-bottom:8px}
.consent-text-ar{font-size:14px;line-height:2;text-align:justify;margin-bottom:16px;padding:12px;background:#f7f8fa;border-radius:8px}
.consent-text-en{font-size:12px;line-height:1.8;text-align:left;direction:ltr;color:#555;font-style:italic;padding:12px;background:#f0f4f8;border-radius:8px;margin-top:10px}
.sig-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;margin-top:35px;padding-top:15px;border-top:2px solid #eee}
.sig-box{text-align:center}
.sig-box .sig-label{font-weight:700;font-size:13px;color:#1a365d;margin-bottom:4px}
.sig-box .sig-label-en{font-size:11px;color:#888}
.sig-box .sig-area{margin-top:8px;min-height:70px;display:flex;align-items:flex-end;justify-content:center}
.sig-box .sig-line{border-top:2px solid #333;width:100%;margin-top:60px;padding-top:4px}
.status-badge{display:inline-block;padding:3px 14px;border-radius:12px;font-size:12px;font-weight:700}
.status-signed{background:#d4edda;color:#155724}
.status-pending{background:#fff3cd;color:#856404}
.footer{text-align:center;margin-top:30px;padding-top:12px;border-top:1px solid #ccc;font-size:10px;color:#999}
@media print{body{padding:15px}.no-print{display:none!important}}
</style></head><body>
<div class="no-print" style="text-align:center;margin-bottom:20px">
  <button onclick="window.print()" style="padding:12px 40px;font-size:16px;background:#1a365d;color:#fff;border:none;border-radius:8px;cursor:pointer">🖨️ طباعة / Print</button>
  <button onclick="window.close()" style="padding:12px 30px;font-size:16px;background:#dc3545;color:#fff;border:none;border-radius:8px;cursor:pointer;margin-right:10px">✕ إغلاق</button>
</div>
<div class="header">
  <h1>${hospitalAr}</h1>
  <h2>${hospitalEn}</h2>
  <div class="hospital-info">
    ${phone ? '📞 ' + phone + ' | ' : ''}${address ? '📍 ' + address + ' | ' : ''}${taxNum ? 'الرقم الضريبي: ' + taxNum : ''}
  </div>
</div>
<h3 style="text-align:center;color:#1a365d;font-size:18px;margin-bottom:5px">📜 ${title}</h3>
<p style="text-align:center;color:#777;font-size:13px;margin-bottom:20px">${titleEn}</p>
<div class="patient-box">
  <div class="field"><label>اسم المريض / Patient Name:</label> ${form.patient_name || ''}</div>
  <div class="field"><label>تاريخ الإقرار / Date:</label> ${signedDate}</div>
  <div class="field"><label>الطبيب المعالج / Doctor:</label> ${form.doctor_name || ''}</div>
  <div class="field"><label>الحالة / Status:</label> <span class="status-badge ${form.status === 'Signed' ? 'status-signed' : 'status-pending'}">${form.status === 'Signed' ? '✅ موقع Signed' : '⏳ معلق Pending'}</span></div>
</div>
<div class="consent-section">
  <h3>📋 نص الإقرار — Consent Declaration</h3>
  <div class="consent-text-ar">${arabicContent.join('<br>')}</div>
  ${englishContent.length ? `<div class="consent-text-en">${englishContent.join('<br>')}</div>` : ''}
</div>
<div class="sig-grid">
  <div class="sig-box">
    <div class="sig-label">توقيع المريض</div>
    <div class="sig-label-en">Patient Signature</div>
    <div class="sig-area">${sigImg}</div>
  </div>
  <div class="sig-box">
    <div class="sig-label">توقيع الطبيب</div>
    <div class="sig-label-en">Physician Signature</div>
    <div class="sig-area"><div class="sig-line">${form.doctor_name || ''}</div></div>
  </div>
  <div class="sig-box">
    <div class="sig-label">توقيع الشاهد</div>
    <div class="sig-label-en">Witness</div>
    <div class="sig-area"><div class="sig-line">${form.witness_name || ''}</div></div>
  </div>
</div>
<div class="footer">
  ${hospitalAr} — ${hospitalEn} | ${tr('Form #', 'إقرار رقم')} ${form.id} | ${tr('Printed on', 'طُبع بتاريخ')} ${new Date().toLocaleDateString('ar-SA')}
</div>
</body></html>`);
    w.document.close();
  } catch (e) { console.error(e); showToast(tr('Print error', 'خطأ في الطباعة'), 'error'); }
};
window.loadConsentTemplate = () => {
  const sel = document.getElementById('cfTemplate');
  const opt = sel.options[sel.selectedIndex];
  if (opt && opt.value) {
    document.getElementById('cfTitle').value = isArabic ? (opt.dataset.titleAr || opt.dataset.title) : opt.dataset.title;
    document.getElementById('cfContent').value = opt.dataset.content || '';
  }
};
window.createConsentForm = async () => {
  const pSel = document.getElementById('cfPatient');
  const tSel = document.getElementById('cfTemplate');
  const opt = tSel.options[tSel.selectedIndex];
  try {
    await API.post('/api/consent-forms', {
      patient_id: pSel.value, patient_name: pSel.options[pSel.selectedIndex]?.dataset?.name || '',
      form_type: tSel.value || 'general', form_title: document.getElementById('cfTitle').value,
      form_title_ar: opt?.dataset?.titleAr || document.getElementById('cfTitle').value,
      content: document.getElementById('cfContent').value, doctor_name: document.getElementById('cfDoctor').value
    });
    showToast(tr('Form created!', 'تم إنشاء الإقرار!')); await navigateTo(20);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.loadConsentForSign = async () => {
  const fid = document.getElementById('cfSignSelect').value;
  if (!fid) { document.getElementById('cfSignArea').style.display = 'none'; return; }
  document.getElementById('cfSignArea').style.display = 'block';
  try {
    const f = await API.get(`/ api / consent - forms / ${fid} `);
    document.getElementById('cfSignContent').innerHTML = `< h3 > ${isArabic ? (f.form_title_ar || f.form_title) : f.form_title}</h3 ><p>${f.content}</p><p><strong>${tr('Patient', 'المريض')}:</strong> ${f.patient_name}<br><strong>${tr('Doctor', 'الطبيب')}:</strong> ${f.doctor_name}</p>`;
    // Setup canvas
    setTimeout(() => {
      const canvas = document.getElementById('cfSigCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let drawing = false;
      canvas.onpointerdown = (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY); };
      canvas.onpointermove = (e) => { if (!drawing) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.stroke(); };
      canvas.onpointerup = () => drawing = false;
      canvas.onpointerout = () => drawing = false;
    }, 100);
  } catch (e) { console.error(e); }
};
window.clearSigCanvas = () => {
  const c = document.getElementById('cfSigCanvas');
  if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height);
};
window.signConsentForm = async () => {
  const fid = document.getElementById('cfSignSelect').value;
  if (!fid) return;
  const canvas = document.getElementById('cfSigCanvas');
  const sig = canvas ? canvas.toDataURL('image/png') : '';
  try {
    await API.put(`/ api / consent - forms / ${fid}/sign`, {
      patient_signature: sig, witness_name: document.getElementById('cfWitness').value
    });
    showToast(tr('Consent signed!', 'تم توقيع الإقرار!')); await navigateTo(20);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== EMERGENCY DEPARTMENT =====
let erTab = 'board';
async function renderEmergency(el) {
  const [stats, visits, beds, patients, doctors] = await Promise.all([
    API.get('/api/emergency/stats'), API.get('/api/emergency/visits'), API.get('/api/emergency/beds'),
    API.get('/api/patients'), API.get('/api/employees')
  ]);
  const drs = (doctors || []).filter(d => d.role === 'Doctor' || d.department_en === 'Emergency');
  const triageColors = { Red: '#e74c3c', Orange: '#e67e22', Yellow: '#f1c40f', Green: '#2ecc71', Blue: '#3498db' };
  const active = (visits || []).filter(v => v.status === 'Active');
  const discharged = (visits || []).filter(v => v.status === 'Discharged');
  const admitted = (visits || []).filter(v => v.status === 'Admitted');
  el.innerHTML = `<div class="page-title">🚨 ${tr('Emergency Department', 'الطوارئ')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(5,1fr)">
      <div class="stat-card"><div class="stat-icon" style="background:#e74c3c22;color:#e74c3c">🚨</div><div class="stat-value" style="color:#e74c3c">${stats.active}</div><div class="stat-label">${tr('Active Cases', 'حالات نشطة')}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#e67e2222;color:#e67e22">⚠️</div><div class="stat-value" style="color:#e67e22">${stats.critical}</div><div class="stat-label">${tr('Critical', 'حرجة')}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#3498db22;color:#3498db">📊</div><div class="stat-value" style="color:#3498db">${stats.today}</div><div class="stat-label">${tr('Today', 'اليوم')}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#2ecc7122;color:#2ecc71">✅</div><div class="stat-value" style="color:#2ecc71">${discharged.length}</div><div class="stat-label">${tr('Discharged', 'خارجين')}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#9b59b622;color:#9b59b6">🏥</div><div class="stat-value" style="color:#9b59b6">${admitted.length}</div><div class="stat-label">${tr('Transferred', 'محولين')}</div></div>
    </div>
    <div class="tab-bar"><button class="tab-btn ${erTab === 'board' ? 'active' : ''}" onclick="erTab='board';navigateTo(21)">🏥 ${tr('ER Board', 'لوحة الطوارئ')}</button>
      <button class="tab-btn ${erTab === 'register' ? 'active' : ''}" onclick="erTab='register';navigateTo(21)">➕ ${tr('Register', 'تسجيل حالة')}</button>
      <button class="tab-btn ${erTab === 'discharged' ? 'active' : ''}" onclick="erTab='discharged';navigateTo(21)">🚪 ${tr('Discharged', 'الخارجين')}</button>
      <button class="tab-btn ${erTab === 'transferred' ? 'active' : ''}" onclick="erTab='transferred';navigateTo(21)">🔄 ${tr('Transferred', 'المحولين للتنويم')}</button>
      <button class="tab-btn ${erTab === 'beds' ? 'active' : ''}" onclick="erTab='beds';navigateTo(21)">🛏️ ${tr('Bed Map', 'خريطة الأسرّة')}</button></div>
    <div class="card" id="erContent"></div>
    <div id="erDischargeModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:9999;align-items:center;justify-content:center">
      <div style="background:#fff;padding:30px;border-radius:16px;width:500px;max-width:90%;max-height:80vh;overflow-y:auto;direction:rtl">
        <h3 style="margin-bottom:16px">🚪 ${tr('Discharge from ER', 'خروج من الطوارئ')}</h3>
        <input type="hidden" id="erDischargeId">
        <div class="form-grid" style="gap:12px">
          <div><label>${tr('Diagnosis', 'التشخيص')}</label><textarea id="erDischargeDiag" class="form-control" rows="2"></textarea></div>
          <div><label>${tr('Instructions', 'تعليمات الخروج')}</label><textarea id="erDischargeInst" class="form-control" rows="2"></textarea></div>
          <div><label>${tr('Medications', 'الأدوية')}</label><input id="erDischargeMeds" class="form-control"></div>
          <div><label>${tr('Follow-up Date', 'موعد المراجعة')}</label><input id="erDischargeFollowup" type="date" class="form-control"></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:16px">
          <button class="btn btn-primary" onclick="confirmERDischarge()" style="flex:1">✅ ${tr('Confirm Discharge', 'تأكيد الخروج')}</button>
          <button class="btn" onclick="document.getElementById('erDischargeModal').style.display='none'" style="flex:1">❌ ${tr('Cancel', 'إلغاء')}</button>
        </div>
      </div>
    </div>`;
  const c = document.getElementById('erContent');
  if (erTab === 'board') {
    c.innerHTML = `<h3>🚨 ${tr('Active ER Cases', 'حالات الطوارئ النشطة')} (${active.length})</h3>
      <input class="form-control" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'erTable')" style="margin-bottom:12px">
      ${active.length ? `<table class="data-table" id="erTable"><thead><tr><th>#</th><th>${tr('Patient', 'المريض')}</th><th>${tr('Complaint', 'الشكوى')}</th><th>${tr('Triage', 'الفرز')}</th><th>${tr('Arrival', 'الوصول')}</th><th>${tr('Doctor', 'الطبيب')}</th><th>${tr('Bed', 'السرير')}</th><th>${tr('Actions', 'إجراءات')}</th></tr></thead><tbody>${active.map(v => {
      const tc = triageColors[v.triage_color] || '#999';
      return `<tr><td>${v.id}</td><td>${v.patient_name}</td><td>${v.chief_complaint_ar || v.chief_complaint}</td>
          <td><span style="background:${tc};color:#fff;padding:2px 10px;border-radius:12px;font-weight:700">${tr('ESI ' + v.triage_level, 'ESI ' + v.triage_level)} ${v.triage_color}</span></td>
          <td>${new Date(v.arrival_time).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</td><td>${v.assigned_doctor || '-'}</td><td>${v.assigned_bed || '-'}</td>
          <td><button class="btn btn-sm" onclick="showERDischargeModal(${v.id})">🚪 ${tr('Discharge', 'خروج')}</button> <button class="btn btn-sm btn-success" onclick="transferERToInpatient(${v.id},'${(v.patient_name || '').replace(/'/g, "\\'")}',${v.patient_id},'${(v.assigned_doctor || '').replace(/'/g, "\\'")}','${v.chief_complaint_ar || v.chief_complaint || ''}')">${tr('Admit', 'تنويم')}</button></td></tr>`;
    }).join('')}</tbody></table>` : `<div class="empty-state"><div class="empty-icon">✅</div><p>${tr('No active cases', 'لا توجد حالات نشطة')}</p></div>`}`;
  } else if (erTab === 'register') {
    c.innerHTML = `<h3>➕ ${tr('Register ER Visit', 'تسجيل حالة طوارئ')}</h3>
      <div class="form-grid">
        <div><label>${tr('Patient', 'المريض')}</label><select id="erPatient" class="form-control"><option value="">${tr('Select', 'اختر')}</option>${(patients || []).map(p => `<option value="${p.id}" data-name="${p.name_ar || p.name_en}">${p.name_ar || p.name_en} (${p.file_number})</option>`).join('')}</select></div>
        <div><label>${tr('Arrival Mode', 'طريقة الوصول')}</label><select id="erArrival" class="form-control"><option value="Walk-in">${tr('Walk-in', 'مشي')}</option><option value="Ambulance">${tr('Ambulance', 'إسعاف')}</option><option value="Referred">${tr('Referred', 'محوّل')}</option><option value="Police">${tr('Police', 'شرطة')}</option></select></div>
        <div><label>${tr('Chief Complaint', 'الشكوى الرئيسية')}</label><input id="erComplaint" class="form-control"></div>
        <div><label>${tr('Complaint (AR)', 'الشكوى بالعربي')}</label><input id="erComplaintAr" class="form-control"></div>
        <div><label>${tr('Triage Level', 'مستوى الفرز')}</label><select id="erTriage" class="form-control" onchange="document.getElementById('erTriageColor').value=['','Red','Orange','Yellow','Green','Blue'][this.value]">
          <option value="1">1 - ${tr('Resuscitation', 'إنعاش')}</option><option value="2">2 - ${tr('Emergent', 'طارئ')}</option><option value="3" selected>3 - ${tr('Urgent', 'عاجل')}</option><option value="4">4 - ${tr('Less Urgent', 'أقل إلحاحاً')}</option><option value="5">5 - ${tr('Non-Urgent', 'غير طارئ')}</option></select></div>
        <div><label>${tr('Triage Color', 'لون الفرز')}</label><select id="erTriageColor" class="form-control"><option value="Red">${tr('Red', 'أحمر')}</option><option value="Orange">${tr('Orange', 'برتقالي')}</option><option value="Yellow" selected>${tr('Yellow', 'أصفر')}</option><option value="Green">${tr('Green', 'أخضر')}</option><option value="Blue">${tr('Blue', 'أزرق')}</option></select></div>
        <div><label>${tr('Doctor', 'الطبيب')}</label><select id="erDoctor" class="form-control"><option value="">${tr('Select', 'اختر')}</option>${drs.map(d => `<option value="${d.name_ar || d.name}">${d.name_ar || d.name}</option>`).join('')}</select></div>
        <div><label>${tr('ER Bed', 'سرير الطوارئ')}</label><select id="erBed" class="form-control"><option value="">${tr('None', 'بدون')}</option>${(beds || []).filter(b => b.status === 'Available').map(b => `<option value="${b.bed_name}">${b.bed_name_ar} (${b.zone_ar})</option>`).join('')}</select></div>
      </div>
      <button class="btn btn-primary" onclick="registerERVisit()" style="margin-top:16px">🚨 ${tr('Register', 'تسجيل')}</button>`;
  } else if (erTab === 'discharged') {
    c.innerHTML = `<h3>🚪 ${tr('Discharged from ER', 'الخارجين من الطوارئ')} (${discharged.length})</h3>
      <input class="form-control" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'erDischTable')" style="margin-bottom:12px">
      ${discharged.length ? `<table class="data-table" id="erDischTable"><thead><tr><th>#</th><th>${tr('Patient', 'المريض')}</th><th>${tr('Complaint', 'الشكوى')}</th><th>${tr('Triage', 'الفرز')}</th><th>${tr('Arrival', 'الوصول')}</th><th>${tr('Discharge', 'الخروج')}</th><th>${tr('Doctor', 'الطبيب')}</th><th>${tr('Diagnosis', 'التشخيص')}</th></tr></thead><tbody>${discharged.map(v => {
      const tc = triageColors[v.triage_color] || '#999';
      return `<tr><td>${v.id}</td><td>${v.patient_name}</td><td>${v.chief_complaint_ar || v.chief_complaint || '-'}</td>
        <td><span style="background:${tc};color:#fff;padding:2px 8px;border-radius:12px;font-size:.85em">${v.triage_color}</span></td>
        <td>${v.arrival_time ? new Date(v.arrival_time).toLocaleString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
        <td>${v.discharge_time ? new Date(v.discharge_time).toLocaleString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
        <td>${v.assigned_doctor || '-'}</td><td>${v.discharge_diagnosis || '-'}</td></tr>`;
    }).join('')}</tbody></table>` : `<div class="empty-state"><div class="empty-icon">📋</div><p>${tr('No discharged patients', 'لا يوجد مرضى خارجين')}</p></div>`}`;
  } else if (erTab === 'transferred') {
    c.innerHTML = `<h3>🔄 ${tr('Transferred to Inpatient', 'المحولين للتنويم')} (${admitted.length})</h3>
      <input class="form-control" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'erTransTable')" style="margin-bottom:12px">
      ${admitted.length ? `<table class="data-table" id="erTransTable"><thead><tr><th>#</th><th>${tr('Patient', 'المريض')}</th><th>${tr('Complaint', 'الشكوى')}</th><th>${tr('Triage', 'الفرز')}</th><th>${tr('ER Doctor', 'طبيب الطوارئ')}</th><th>${tr('Arrival', 'الوصول')}</th><th>${tr('Status', 'الحالة')}</th></tr></thead><tbody>${admitted.map(v => {
      const tc = triageColors[v.triage_color] || '#999';
      return `<tr><td>${v.id}</td><td>${v.patient_name}</td><td>${v.chief_complaint_ar || v.chief_complaint || '-'}</td>
        <td><span style="background:${tc};color:#fff;padding:2px 8px;border-radius:12px;font-size:.85em">${v.triage_color}</span></td>
        <td>${v.assigned_doctor || '-'}</td>
        <td>${v.arrival_time ? new Date(v.arrival_time).toLocaleString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
        <td>${badge(tr('Admitted', 'تم التنويم'), 'success')}</td></tr>`;
    }).join('')}</tbody></table>` : `<div class="empty-state"><div class="empty-icon">🏥</div><p>${tr('No transferred patients', 'لا يوجد مرضى محولين')}</p></div>`}`;
  } else {
    const zones = ['Resuscitation', 'Critical', 'Acute', 'Observation'];
    c.innerHTML = `<h3>🛏️ ${tr('ER Bed Map', 'خريطة أسرّة الطوارئ')}</h3>
      ${zones.map(z => `<h4 style="margin:16px 0 8px">${tr(z, z === 'Resuscitation' ? 'الإنعاش' : z === 'Critical' ? 'الحرجة' : z === 'Acute' ? 'الحادة' : 'المراقبة')}</h4>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">${(beds || []).filter(b => b.zone === z).map(b => `<div style="padding:16px;border-radius:12px;text-align:center;background:${b.status === 'Available' ? '#d4edda' : '#f8d7da'};border:2px solid ${b.status === 'Available' ? '#28a745' : '#dc3545'}">
          <div style="font-size:1.4em;font-weight:700">${b.bed_name_ar}</div><div style="font-size:.85em;margin-top:4px">${statusBadge(b.status)}</div></div>`).join('')}</div>`).join('')}`;
  }
}
window.registerERVisit = async function () {
  const ps = document.getElementById('erPatient'); if (!ps.value) return showToast(tr('Select patient', 'اختر المريض'), 'error');
  try {
    await API.post('/api/emergency/visits', { patient_id: ps.value, patient_name: ps.options[ps.selectedIndex].dataset.name, arrival_mode: document.getElementById('erArrival').value, chief_complaint: document.getElementById('erComplaint').value, chief_complaint_ar: document.getElementById('erComplaintAr').value, triage_level: document.getElementById('erTriage').value, triage_color: document.getElementById('erTriageColor').value, assigned_doctor: document.getElementById('erDoctor').value, assigned_bed: document.getElementById('erBed').value });
    showToast(tr('ER visit registered!', 'تم تسجيل حالة الطوارئ!')); erTab = 'board'; await navigateTo(21);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.showERDischargeModal = function (id) {
  document.getElementById('erDischargeId').value = id;
  document.getElementById('erDischargeDiag').value = '';
  document.getElementById('erDischargeInst').value = '';
  document.getElementById('erDischargeMeds').value = '';
  document.getElementById('erDischargeFollowup').value = '';
  document.getElementById('erDischargeModal').style.display = 'flex';
};
window.confirmERDischarge = async function () {
  const id = document.getElementById('erDischargeId').value;
  try {
    await API.put('/api/emergency/visits/' + id, {
      status: 'Discharged',
      discharge_diagnosis: document.getElementById('erDischargeDiag').value,
      discharge_instructions: document.getElementById('erDischargeInst').value,
      discharge_medications: document.getElementById('erDischargeMeds').value,
      followup_date: document.getElementById('erDischargeFollowup').value
    });
    document.getElementById('erDischargeModal').style.display = 'none';
    showToast(tr('Patient discharged from ER!', 'تم خروج المريض من الطوارئ!'));
    erTab = 'discharged'; await navigateTo(21);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.transferERToInpatient = async function (visitId, patientName, patientId, doctor, complaint) {
  if (!confirm(tr('Transfer this patient to inpatient?', 'هل تريد تحويل هذا المريض للتنويم؟'))) return;
  try {
    await API.put('/api/emergency/visits/' + visitId, { status: 'Admitted' });
    await API.post('/api/admissions', {
      patient_id: patientId, patient_name: patientName,
      admission_type: 'Emergency', admitting_doctor: doctor, attending_doctor: doctor,
      department: 'Emergency', diagnosis: complaint
    });
    showToast(tr('Patient transferred to inpatient!', 'تم تحويل المريض للتنويم!'));
    erTab = 'transferred'; await navigateTo(21);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.updateERVisit = async function (id, status) {
  try { await API.put('/api/emergency/visits/' + id, { status }); showToast(tr('Updated', 'تم التحديث')); await navigateTo(21); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== INPATIENT ADT =====
let adtTab = 'census';
async function renderInpatient(el) {
  const [census, activeAdm, dischargedAdm, patients, doctors, wards] = await Promise.all([
    API.get('/api/beds/census'), API.get('/api/admissions?status=Active'),
    API.get('/api/admissions?status=Discharged'),
    API.get('/api/patients'), API.get('/api/employees'), API.get('/api/wards')
  ]);
  const drs = (doctors || []).filter(d => d.role === 'Doctor');
  el.innerHTML = `<div class="page-title">🛏️ ${tr('Inpatient ADT', 'التنويم')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(5,1fr)">
      <div class="stat-card"><div class="stat-value" style="color:#2ecc71">${census.available || 0}</div><div class="stat-label">${tr('Available Beds', 'أسرّة متاحة')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#e74c3c">${census.occupied || 0}</div><div class="stat-label">${tr('Occupied', 'مشغولة')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#3498db">${(activeAdm || []).length}</div><div class="stat-label">${tr('Current Patients', 'المنومين')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#27ae60">${(dischargedAdm || []).length}</div><div class="stat-label">${tr('Discharged', 'الخارجين')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#9b59b6">${census.occupancyRate || 0}%</div><div class="stat-label">${tr('Occupancy', 'نسبة الإشغال')}</div></div>
    </div>
    <div class="tab-bar"><button class="tab-btn ${adtTab === 'census' ? 'active' : ''}" onclick="adtTab='census';navigateTo(22)">🗺️ ${tr('Census', 'الإشغال')}</button>
      <button class="tab-btn ${adtTab === 'admit' ? 'active' : ''}" onclick="adtTab='admit';navigateTo(22)">➕ ${tr('Admit', 'تنويم')}</button>
      <button class="tab-btn ${adtTab === 'patients' ? 'active' : ''}" onclick="adtTab='patients';navigateTo(22)">📋 ${tr('Patients', 'المنومين')}</button>
      <button class="tab-btn ${adtTab === 'discharged' ? 'active' : ''}" onclick="adtTab='discharged';navigateTo(22)">🚪 ${tr('Discharged', 'الخارجين')}</button></div>
    <div class="card" id="adtContent"></div>
    <div id="adtDischargeModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:9999;align-items:center;justify-content:center">
      <div style="background:#fff;padding:30px;border-radius:16px;width:550px;max-width:90%;max-height:85vh;overflow-y:auto;direction:rtl">
        <h3 style="margin-bottom:16px">🚪 ${tr('Discharge Patient', 'خروج مريض')}</h3>
        <input type="hidden" id="adtDischargeId">
        <div class="form-grid" style="gap:12px">
          <div><label>${tr('Discharge Type', 'نوع الخروج')}</label><select id="adtDischargeType" class="form-control">
            <option value="Regular">${tr('Regular', 'عادي')}</option><option value="AMA">${tr('Against Medical Advice', 'ضد المشورة الطبية')}</option>
            <option value="Transfer">${tr('Transfer', 'تحويل')}</option><option value="Death">${tr('Death', 'وفاة')}</option></select></div>
          <div style="grid-column:span 2"><label>${tr('Discharge Summary', 'ملخص الخروج')}</label><textarea id="adtDischargeSummary" class="form-control" rows="3"></textarea></div>
          <div style="grid-column:span 2"><label>${tr('Instructions', 'تعليمات للمريض')}</label><textarea id="adtDischargeInst" class="form-control" rows="2"></textarea></div>
          <div><label>${tr('Medications', 'أدوية الخروج')}</label><textarea id="adtDischargeMeds" class="form-control" rows="2"></textarea></div>
          <div><label>${tr('Follow-up Date', 'موعد المراجعة')}</label><input id="adtFollowupDate" type="date" class="form-control"></div>
          <div><label>${tr('Follow-up Doctor', 'طبيب المتابعة')}</label><select id="adtFollowupDoctor" class="form-control"><option value="">${tr('Select', 'اختر')}</option>${drs.map(d => `<option value="${d.name_ar || d.name}">${d.name_ar || d.name}</option>`).join('')}</select></div>
        </div>
        <div style="display:flex;gap:10px;margin-top:16px">
          <button class="btn btn-primary" onclick="confirmInpatientDischarge()" style="flex:1">✅ ${tr('Confirm Discharge', 'تأكيد الخروج')}</button>
          <button class="btn" onclick="document.getElementById('adtDischargeModal').style.display='none'" style="flex:1">❌ ${tr('Cancel', 'إلغاء')}</button>
        </div>
      </div>
    </div>`;
  const c = document.getElementById('adtContent');
  if (adtTab === 'census') {
    c.innerHTML = (census.wards || []).map(w => {
      const wBeds = (census.beds || []).filter(b => b.ward_id === w.id);
      const occ = wBeds.filter(b => b.status === 'Occupied').length;
      return `<div style="margin-bottom:20px"><h4>${w.ward_name_ar} (${w.ward_name}) — <span style="color:${occ / wBeds.length > 0.8 ? '#e74c3c' : '#2ecc71'}">${occ}/${wBeds.length}</span></h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px">${wBeds.map(b => `<div style="padding:10px;border-radius:10px;text-align:center;font-size:.85em;background:${b.status === 'Available' ? '#d4edda' : '#f8d7da'};border:1px solid ${b.status === 'Available' ? '#28a745' : '#dc3545'};cursor:pointer" title="${b.patient_name || ''} ${b.diagnosis || ''}">
          <strong>${tr('Bed', 'سرير')} ${b.bed_number}</strong><br><small>${tr('Room', 'غرفة')} ${b.room_number}</small><br>${b.patient_name ? `<small>${b.patient_name}</small>` : statusBadge(b.status)}</div>`).join('')}</div></div>`;
    }).join('');
  } else if (adtTab === 'admit') {
    c.innerHTML = `<h3>➕ ${tr('New Admission', 'تنويم جديد')}</h3><div class="form-grid">
      <div><label>${tr('Patient', 'المريض')}</label><select id="admPatient" class="form-control"><option value="">${tr('Select', 'اختر')}</option>${(patients || []).map(p => `<option value="${p.id}" data-name="${p.name_ar || p.name_en}">${p.name_ar || p.name_en} (${p.file_number})</option>`).join('')}</select></div>
      <div><label>${tr('Type', 'النوع')}</label><select id="admType" class="form-control"><option value="Regular">${tr('Regular', 'عادي')}</option><option value="Emergency">${tr('Emergency', 'طوارئ')}</option><option value="Transfer">${tr('Transfer', 'تحويل')}</option></select></div>
      <div><label>${tr('Attending Doctor', 'الطبيب المعالج')}</label><select id="admDoctor" class="form-control"><option value="">${tr('Select', 'اختر')}</option>${drs.map(d => `<option value="${d.name_ar || d.name}">${d.name_ar || d.name}</option>`).join('')}</select></div>
      <div><label>${tr('Department', 'القسم')}</label><input id="admDept" class="form-control"></div>
      <div><label>${tr('Ward', 'الجناح')}</label><select id="admWard" class="form-control" onchange="loadWardBeds(this.value)"><option value="">${tr('Select', 'اختر')}</option>${(wards || []).map(w => `<option value="${w.id}">${w.ward_name_ar}</option>`).join('')}</select></div>
      <div><label>${tr('Bed', 'السرير')}</label><select id="admBed" class="form-control"><option value="">${tr('Select ward first', 'اختر الجناح أولاً')}</option></select></div>
      <div style="grid-column:span 2"><label>${tr('Diagnosis', 'التشخيص')}</label><textarea id="admDiagnosis" class="form-control" rows="2"></textarea></div>
      <div><label>${tr('Diet', 'الحمية')}</label><select id="admDiet" class="form-control"><option value="Regular">${tr('Regular', 'عادية')}</option><option value="Diabetic">${tr('Diabetic', 'سكري')}</option><option value="Renal">${tr('Renal', 'كلوي')}</option><option value="Cardiac">${tr('Cardiac', 'قلبي')}</option><option value="NPO">${tr('NPO', 'صائم')}</option><option value="Liquid">${tr('Liquid', 'سوائل')}</option></select></div>
      <div><label>${tr('Expected LOS', 'مدة الإقامة المتوقعة')}</label><input id="admLOS" type="number" value="3" class="form-control"></div>
    </div><button class="btn btn-primary" onclick="admitPatient()" style="margin-top:16px">🛏️ ${tr('Admit', 'تنويم')}</button>`;
  } else if (adtTab === 'patients') {
    c.innerHTML = `<h3>📋 ${tr('Current Inpatients', 'المنومين الحاليين')} (${(activeAdm || []).length})</h3>
      <input class="form-control" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'adtPatientsTable')" style="margin-bottom:12px">
      ${(activeAdm || []).length ? `<table class="data-table" id="adtPatientsTable"><thead><tr><th>#</th><th>${tr('Patient', 'المريض')}</th><th>${tr('Type', 'النوع')}</th><th>${tr('Doctor', 'الطبيب')}</th><th>${tr('Diagnosis', 'التشخيص')}</th><th>${tr('Admission Date', 'تاريخ التنويم')}</th><th>${tr('Days', 'أيام')}</th><th>${tr('Actions', 'إجراءات')}</th></tr></thead><tbody>${(activeAdm || []).map(a => {
      const days = Math.floor((new Date() - new Date(a.admission_date)) / 86400000);
      const typeBadge = a.admission_type === 'Emergency' ? badge(tr('ER', 'طوارئ'), 'danger') : a.admission_type === 'Transfer' ? badge(tr('Transfer', 'تحويل'), 'warning') : badge(tr('Regular', 'عادي'), 'info');
      return `<tr><td>${a.id}</td><td><strong>${a.patient_name}</strong></td><td>${typeBadge}</td><td>${a.attending_doctor || '-'}</td><td>${a.diagnosis || '-'}</td><td>${new Date(a.admission_date).toLocaleDateString('ar-SA')}</td><td><span style="font-weight:700;color:${days > 7 ? '#e74c3c' : '#2ecc71'}">${days}</span></td>
        <td><button class="btn btn-sm" onclick="showInpatientDischargeModal(${a.id})">🚪 ${tr('Discharge', 'خروج')}</button></td></tr>`;
    }).join('')}</tbody></table>` : `<div class="empty-state"><div class="empty-icon">🛏️</div><p>${tr('No inpatients', 'لا يوجد منومين')}</p></div>`}`;
  } else if (adtTab === 'discharged') {
    c.innerHTML = `<h3>🚪 ${tr('Discharged Patients', 'الخارجين من التنويم')} (${(dischargedAdm || []).length})</h3>
      <input class="form-control" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'adtDischTable')" style="margin-bottom:12px">
      ${(dischargedAdm || []).length ? `<table class="data-table" id="adtDischTable"><thead><tr><th>#</th><th>${tr('Patient', 'المريض')}</th><th>${tr('Type', 'نوع الخروج')}</th><th>${tr('Doctor', 'الطبيب')}</th><th>${tr('Diagnosis', 'التشخيص')}</th><th>${tr('Admitted', 'التنويم')}</th><th>${tr('Discharged', 'الخروج')}</th><th>${tr('LOS', 'المدة')}</th></tr></thead><tbody>${(dischargedAdm || []).map(a => {
      const los = a.discharge_date && a.admission_date ? Math.floor((new Date(a.discharge_date) - new Date(a.admission_date)) / 86400000) : '-';
      const dtBadge = a.discharge_type === 'AMA' ? badge(tr('AMA', 'ضد المشورة'), 'danger') : a.discharge_type === 'Death' ? badge(tr('Death', 'وفاة'), 'danger') : a.discharge_type === 'Transfer' ? badge(tr('Transfer', 'تحويل'), 'warning') : badge(tr('Regular', 'عادي'), 'success');
      return `<tr><td>${a.id}</td><td>${a.patient_name}</td><td>${dtBadge}</td><td>${a.attending_doctor || '-'}</td><td>${a.diagnosis || '-'}</td>
        <td>${a.admission_date ? new Date(a.admission_date).toLocaleDateString('ar-SA') : '-'}</td>
        <td>${a.discharge_date ? new Date(a.discharge_date).toLocaleDateString('ar-SA') : '-'}</td>
        <td><strong>${los}</strong> ${tr('days', 'يوم')}</td></tr>`;
    }).join('')}</tbody></table>` : `<div class="empty-state"><div class="empty-icon">📋</div><p>${tr('No discharged patients', 'لا يوجد مرضى خارجين')}</p></div>`}`;
  }
}
window.loadWardBeds = async function (wardId) {
  if (!wardId) return;
  const beds = await API.get('/api/beds?ward_id=' + wardId);
  const s = document.getElementById('admBed');
  s.innerHTML = `<option value="">${tr('Select', 'اختر')}</option>${(beds || []).filter(b => b.status === 'Available').map(b => `<option value="${b.id}">${tr('Bed', 'سرير')} ${b.bed_number} - ${tr('Room', 'غرفة')} ${b.room_number}</option>`).join('')}`;
};
window.admitPatient = async function () {
  const ps = document.getElementById('admPatient'); if (!ps.value) return showToast(tr('Select patient', 'اختر المريض'), 'error');
  try {
    await API.post('/api/admissions', { patient_id: ps.value, patient_name: ps.options[ps.selectedIndex].dataset.name, admission_type: document.getElementById('admType').value, attending_doctor: document.getElementById('admDoctor').value, admitting_doctor: document.getElementById('admDoctor').value, department: document.getElementById('admDept').value, ward_id: document.getElementById('admWard').value, bed_id: document.getElementById('admBed').value, diagnosis: document.getElementById('admDiagnosis').value, diet_order: document.getElementById('admDiet').value, expected_los: document.getElementById('admLOS').value });
    showToast(tr('Patient admitted!', 'تم التنويم!')); adtTab = 'patients'; await navigateTo(22);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.showInpatientDischargeModal = function (id) {
  document.getElementById('adtDischargeId').value = id;
  document.getElementById('adtDischargeSummary').value = '';
  document.getElementById('adtDischargeInst').value = '';
  document.getElementById('adtDischargeMeds').value = '';
  document.getElementById('adtFollowupDate').value = '';
  document.getElementById('adtDischargeModal').style.display = 'flex';
};
window.confirmInpatientDischarge = async function () {
  const id = document.getElementById('adtDischargeId').value;
  try {
    await API.put('/api/admissions/' + id + '/discharge', {
      discharge_type: document.getElementById('adtDischargeType').value,
      discharge_summary: document.getElementById('adtDischargeSummary').value,
      discharge_instructions: document.getElementById('adtDischargeInst').value,
      discharge_medications: document.getElementById('adtDischargeMeds').value,
      followup_date: document.getElementById('adtFollowupDate').value,
      followup_doctor: document.getElementById('adtFollowupDoctor').value
    });
    document.getElementById('adtDischargeModal').style.display = 'none';
    showToast(tr('Patient discharged!', 'تم خروج المريض!'));
    adtTab = 'discharged'; await navigateTo(22);
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.dischargePatient = async function (id) {
  showInpatientDischargeModal(id);
};
// ===== ICU =====
// ===== ICU =====
let icuTab = 'patients';
async function renderICU(el) {
  const [icuPatients, allAdmissions] = await Promise.all([
    API.get('/api/icu/patients'),
    API.get('/api/admissions')
  ]);
  const discharged = (allAdmissions || []).filter(a => a.status === 'Discharged' && a.department === 'ICU');
  const totalICU = (icuPatients || []).length;
  const onVent = (icuPatients || []).filter(p => p.activity_level === 'Ventilated' || p.dvt_prophylaxis).length;
  el.innerHTML = `<div class="page-title">🫀 ${tr('ICU / Critical Care', 'العناية المركزة')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card"><div class="stat-icon" style="background:#e74c3c22;color:#e74c3c">🫀</div><div class="stat-value" style="color:#e74c3c">${totalICU}</div><div class="stat-label">${tr('Current Patients', 'المرضى الحاليين')}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#3498db22;color:#3498db">🫁</div><div class="stat-value" style="color:#3498db">${onVent}</div><div class="stat-label">${tr('On Ventilator', 'على التنفس')}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#2ecc7122;color:#2ecc71">✅</div><div class="stat-value" style="color:#2ecc71">${discharged.length}</div><div class="stat-label">${tr('Discharged', 'خارجين')}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#9b59b622;color:#9b59b6">📊</div><div class="stat-value" style="color:#9b59b6">${totalICU > 0 ? Math.round((totalICU / (totalICU + discharged.length || 1)) * 100) : 0}%</div><div class="stat-label">${tr('Occupancy', 'الإشغال')}</div></div>
    </div>
    <div class="tab-bar"><button class="tab-btn ${icuTab === 'patients' ? 'active' : ''}" onclick="icuTab='patients';navigateTo(23)">👥 ${tr('Patients', 'المرضى')}</button>
      <button class="tab-btn ${icuTab === 'monitor' ? 'active' : ''}" onclick="icuTab='monitor';navigateTo(23)">📊 ${tr('Monitoring', 'المراقبة')}</button>
      <button class="tab-btn ${icuTab === 'ventilator' ? 'active' : ''}" onclick="icuTab='ventilator';navigateTo(23)">🫁 ${tr('Ventilator', 'التنفس')}</button>
      <button class="tab-btn ${icuTab === 'scores' ? 'active' : ''}" onclick="icuTab='scores';navigateTo(23)">📋 ${tr('Scores', 'المقاييس')}</button>
      <button class="tab-btn ${icuTab === 'fluid' ? 'active' : ''}" onclick="icuTab='fluid';navigateTo(23)">💧 ${tr('Fluid Balance', 'توازن السوائل')}</button>
      <button class="tab-btn ${icuTab === 'discharged' ? 'active' : ''}" onclick="icuTab='discharged';navigateTo(23)">🚪 ${tr('Discharged', 'الخارجين')}</button></div>
    <div class="card" id="icuContent"></div>`;
  const c = document.getElementById('icuContent');
  if (icuTab === 'patients') {
    c.innerHTML = `<h3>👥 ${tr('ICU Patients', 'مرضى العناية المركزة')} (${totalICU})</h3>
      <input class="form-control" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'icuPTable')" style="margin-bottom:12px">
      ${totalICU ? `<table class="data-table" id="icuPTable"><thead><tr><th>#</th><th>${tr('Patient', 'المريض')}</th><th>${tr('Ward', 'الجناح')}</th><th>${tr('Bed', 'السرير')}</th><th>${tr('Doctor', 'الطبيب')}</th><th>${tr('Diagnosis', 'التشخيص')}</th><th>${tr('Days', 'أيام')}</th><th>${tr('Actions', 'إجراءات')}</th></tr></thead><tbody>${(icuPatients || []).map(p => {
      const days = Math.floor((new Date() - new Date(p.admission_date)) / 86400000);
      return `<tr><td>${p.id}</td><td><strong>${p.patient_name}</strong></td><td>${p.ward_name_ar || '-'}</td><td>${tr('Bed', 'سرير')} ${p.bed_number || '-'}</td><td>${p.attending_doctor || '-'}</td><td>${p.diagnosis || '-'}</td>
        <td><span style="font-weight:700;color:${days > 7 ? '#e74c3c' : '#2ecc71'}">${days}</span></td>
        <td><button class="btn btn-sm" onclick="showInpatientDischargeModal(${p.id})">🚪 ${tr('Discharge', 'خروج')}</button></td></tr>`;
    }).join('')}</tbody></table>` : `<div class="empty-state"><div class="empty-icon">🫀</div><p>${tr('No ICU patients', 'لا يوجد مرضى بالعناية')}</p></div>`}`;
  } else if (icuTab === 'monitor') {
    c.innerHTML = `<h3>📊 ${tr('Record Vitals', 'تسجيل العلامات الحيوية')}</h3>
      <div class="form-grid">
        <div><label>${tr('Patient', 'المريض')}</label><select id="icuPatientMon" class="form-control"><option value="">${tr('Select', 'اختر')}</option>${(icuPatients || []).map(p => `<option value="${p.id}" data-pid="${p.patient_id}">${p.patient_name} - ${p.ward_name_ar || ''} ${tr('Bed', 'سرير')} ${p.bed_number || ''}</option>`).join('')}</select></div>
        <div><label>HR</label><input id="icuHR" type="number" class="form-control" placeholder="bpm"></div>
        <div><label>SBP/DBP</label><div style="display:flex;gap:4px"><input id="icuSBP" type="number" class="form-control" placeholder="SBP"><input id="icuDBP" type="number" class="form-control" placeholder="DBP"></div></div>
        <div><label>SpO2</label><input id="icuSpO2" type="number" class="form-control" placeholder="%"></div>
        <div><label>RR</label><input id="icuRR" type="number" class="form-control" placeholder="/min"></div>
        <div><label>Temp</label><input id="icuTemp" type="number" step="0.1" class="form-control" placeholder="°C"></div>
        <div><label>FiO2</label><input id="icuFiO2" type="number" class="form-control" placeholder="%"></div>
        <div><label>Urine (ml)</label><input id="icuUrine" type="number" class="form-control" placeholder="ml"></div>
      </div><button class="btn btn-primary" onclick="saveICUMonitor()" style="margin-top:12px">💾 ${tr('Save', 'حفظ')}</button>`;
  } else if (icuTab === 'ventilator') {
    c.innerHTML = `<h3>🫁 ${tr('Ventilator Settings', 'إعدادات التنفس الصناعي')}</h3>
      <div class="form-grid">
        <div><label>${tr('Patient', 'المريض')}</label><select id="icuPatientVent" class="form-control"><option value="">${tr('Select', 'اختر')}</option>${(icuPatients || []).map(p => `<option value="${p.id}" data-pid="${p.patient_id}">${p.patient_name}</option>`).join('')}</select></div>
        <div><label>${tr('Mode', 'الوضع')}</label><select id="ventMode" class="form-control"><option>CMV</option><option>SIMV</option><option>PSV</option><option>CPAP</option><option>BiPAP</option><option>APRV</option></select></div>
        <div><label>FiO2 %</label><input id="ventFiO2" type="number" value="21" class="form-control"></div>
        <div><label>TV (ml)</label><input id="ventTV" type="number" class="form-control"></div>
        <div><label>RR</label><input id="ventRR" type="number" class="form-control"></div>
        <div><label>PEEP</label><input id="ventPEEP" type="number" class="form-control"></div>
        <div><label>PIP</label><input id="ventPIP" type="number" class="form-control"></div>
        <div><label>PS</label><input id="ventPS" type="number" class="form-control"></div>
        <div><label>ETT Size</label><input id="ventETT" class="form-control"></div>
      </div><button class="btn btn-primary" onclick="saveVentilator()" style="margin-top:12px">💾 ${tr('Save', 'حفظ')}</button>`;
  } else if (icuTab === 'scores') {
    c.innerHTML = `<h3>📋 ${tr('Clinical Scores', 'المقاييس السريرية')}</h3>
      <div class="form-grid">
        <div><label>${tr('Patient', 'المريض')}</label><select id="icuPatientScore" class="form-control"><option value="">${tr('Select', 'اختر')}</option>${(icuPatients || []).map(p => `<option value="${p.id}" data-pid="${p.patient_id}">${p.patient_name}</option>`).join('')}</select></div>
        <div><label>APACHE II</label><input id="scoreAPACHE" type="number" class="form-control"></div>
        <div><label>SOFA</label><input id="scoreSOFA" type="number" class="form-control"></div>
        <div><label>GCS</label><input id="scoreGCS" type="number" value="15" class="form-control"></div>
        <div><label>RASS</label><input id="scoreRASS" type="number" value="0" class="form-control"></div>
        <div><label>Braden</label><input id="scoreBraden" type="number" value="23" class="form-control"></div>
        <div><label>Morse Fall</label><input id="scoreMorse" type="number" class="form-control"></div>
        <div><label>Pain (0-10)</label><input id="scorePain" type="number" class="form-control"></div>
      </div><button class="btn btn-primary" onclick="saveICUScores()" style="margin-top:12px">💾 ${tr('Save', 'حفظ')}</button>`;
  } else if (icuTab === 'fluid') {
    c.innerHTML = `<h3>💧 ${tr('Fluid Balance', 'توازن السوائل')}</h3>
      <div class="form-grid">
        <div><label>${tr('Patient', 'المريض')}</label><select id="icuPatientFluid" class="form-control"><option value="">${tr('Select', 'اختر')}</option>${(icuPatients || []).map(p => `<option value="${p.id}" data-pid="${p.patient_id}">${p.patient_name}</option>`).join('')}</select></div>
        <div><label>${tr('Shift', 'الوردية')}</label><select id="fluidShift" class="form-control"><option value="Day">${tr('Day', 'نهاري')}</option><option value="Night">${tr('Night', 'ليلي')}</option></select></div>
        <div style="grid-column:span 2"><h4 style="color:#2ecc71">⬇️ ${tr('Intake', 'الوارد')}</h4></div>
        <div><label>IV Fluids (ml)</label><input id="fluidIV" type="number" class="form-control"></div>
        <div><label>Oral (ml)</label><input id="fluidOral" type="number" class="form-control"></div>
        <div><label>Blood Products (ml)</label><input id="fluidBlood" type="number" class="form-control"></div>
        <div><label>IV Meds (ml)</label><input id="fluidMeds" type="number" class="form-control"></div>
        <div style="grid-column:span 2"><h4 style="color:#e74c3c">⬆️ ${tr('Output', 'الصادر')}</h4></div>
        <div><label>Urine (ml)</label><input id="fluidUrine" type="number" class="form-control"></div>
        <div><label>Drains (ml)</label><input id="fluidDrains" type="number" class="form-control"></div>
        <div><label>NGT (ml)</label><input id="fluidNGT" type="number" class="form-control"></div>
        <div><label>Vomit (ml)</label><input id="fluidVomit" type="number" class="form-control"></div>
      </div><button class="btn btn-primary" onclick="saveFluidBalance()" style="margin-top:12px">💾 ${tr('Save', 'حفظ')}</button>`;
  } else if (icuTab === 'discharged') {
    c.innerHTML = `<h3>🚪 ${tr('Discharged from ICU', 'الخارجين من العناية المركزة')} (${discharged.length})</h3>
      <input class="form-control" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'icuDischTable')" style="margin-bottom:12px">
      ${discharged.length ? `<table class="data-table" id="icuDischTable"><thead><tr><th>#</th><th>${tr('Patient', 'المريض')}</th><th>${tr('Discharge Type', 'نوع الخروج')}</th><th>${tr('Doctor', 'الطبيب')}</th><th>${tr('Diagnosis', 'التشخيص')}</th><th>${tr('Admitted', 'التنويم')}</th><th>${tr('Discharged', 'الخروج')}</th><th>${tr('LOS', 'المدة')}</th></tr></thead><tbody>${discharged.map(a => {
      const los = a.discharge_date && a.admission_date ? Math.floor((new Date(a.discharge_date) - new Date(a.admission_date)) / 86400000) : '-';
      const dtBadge = a.discharge_type === 'AMA' ? badge(tr('AMA', 'ضد المشورة'), 'danger') : a.discharge_type === 'Death' ? badge(tr('Death', 'وفاة'), 'danger') : a.discharge_type === 'Transfer' ? badge(tr('Transfer', 'تحويل'), 'warning') : badge(tr('Regular', 'عادي'), 'success');
      return `<tr><td>${a.id}</td><td>${a.patient_name}</td><td>${dtBadge}</td><td>${a.attending_doctor || '-'}</td><td>${a.diagnosis || '-'}</td>
        <td>${a.admission_date ? new Date(a.admission_date).toLocaleDateString('ar-SA') : '-'}</td>
        <td>${a.discharge_date ? new Date(a.discharge_date).toLocaleDateString('ar-SA') : '-'}</td>
        <td><strong>${los}</strong> ${tr('days', 'يوم')}</td></tr>`;
    }).join('')}</tbody></table>` : `<div class="empty-state"><div class="empty-icon">📋</div><p>${tr('No discharged patients', 'لا يوجد مرضى خارجين')}</p></div>`}`;
  }
}
window.saveICUMonitor = async function () {
  const s = document.getElementById('icuPatientMon'); if (!s.value) return showToast(tr('Select patient', 'اختر المريض'), 'error');
  try {
    await API.post('/api/icu/monitoring', { admission_id: s.value, patient_id: s.options[s.selectedIndex].dataset.pid, hr: document.getElementById('icuHR').value, sbp: document.getElementById('icuSBP').value, dbp: document.getElementById('icuDBP').value, spo2: document.getElementById('icuSpO2').value, rr: document.getElementById('icuRR').value, temp: document.getElementById('icuTemp').value, fio2: document.getElementById('icuFiO2').value, urine_output: document.getElementById('icuUrine').value, recorded_by: currentUser?.display_name });
    showToast(tr('Saved!', 'تم الحفظ!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.saveVentilator = async function () {
  const s = document.getElementById('icuPatientVent'); if (!s.value) return showToast(tr('Select patient', 'اختر المريض'), 'error');
  try {
    await API.post('/api/icu/ventilator', { admission_id: s.value, patient_id: s.options[s.selectedIndex].dataset.pid, vent_mode: document.getElementById('ventMode').value, fio2: document.getElementById('ventFiO2').value, tidal_volume: document.getElementById('ventTV').value, respiratory_rate: document.getElementById('ventRR').value, peep: document.getElementById('ventPEEP').value, pip: document.getElementById('ventPIP').value, ps: document.getElementById('ventPS').value, ett_size: document.getElementById('ventETT').value, recorded_by: currentUser?.display_name });
    showToast(tr('Saved!', 'تم الحفظ!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.saveICUScores = async function () {
  const s = document.getElementById('icuPatientScore'); if (!s.value) return showToast(tr('Select patient', 'اختر المريض'), 'error');
  try {
    await API.post('/api/icu/scores', { admission_id: s.value, patient_id: s.options[s.selectedIndex].dataset.pid, apache_ii: document.getElementById('scoreAPACHE').value, sofa: document.getElementById('scoreSOFA').value, gcs: document.getElementById('scoreGCS').value, rass: document.getElementById('scoreRASS').value, braden: document.getElementById('scoreBraden').value, morse_fall: document.getElementById('scoreMorse').value, pain_score: document.getElementById('scorePain').value, calculated_by: currentUser?.display_name });
    showToast(tr('Saved!', 'تم الحفظ!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.saveFluidBalance = async function () {
  const s = document.getElementById('icuPatientFluid'); if (!s.value) return showToast(tr('Select patient', 'اختر المريض'), 'error');
  try {
    await API.post('/api/icu/fluid-balance', { admission_id: s.value, patient_id: s.options[s.selectedIndex].dataset.pid, shift: document.getElementById('fluidShift').value, iv_fluids: document.getElementById('fluidIV').value, oral_intake: document.getElementById('fluidOral').value, blood_products: document.getElementById('fluidBlood').value, medications_iv: document.getElementById('fluidMeds').value, urine: document.getElementById('fluidUrine').value, drains: document.getElementById('fluidDrains').value, ngt_output: document.getElementById('fluidNGT').value, vomit: document.getElementById('fluidVomit').value, recorded_by: currentUser?.display_name });
    showToast(tr('Saved!', 'تم الحفظ!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
// ===== CSSD =====
async function renderCSSD(el) {
  const [instruments, cycles] = await Promise.all([API.get('/api/cssd/instruments'), API.get('/api/cssd/cycles')]);
  el.innerHTML = `<div class="page-title">🧹 ${tr('CSSD / Sterilization', 'التعقيم المركزي')}</div>
    <div class="card"><h3>📦 ${tr('Instrument Sets', 'أطقم الأدوات')}</h3>
      <div class="form-grid"><div><label>${tr('Set Name', 'اسم الطقم')}</label><input id="cssdName" class="form-control"></div>
        <div><label>${tr('Name AR', 'الاسم بالعربي')}</label><input id="cssdNameAr" class="form-control"></div>
        <div><label>${tr('Code', 'الكود')}</label><input id="cssdCode" class="form-control"></div>
        <div><label>${tr('Category', 'التصنيف')}</label><select id="cssdCat" class="form-control"><option>General Surgery</option><option>Orthopedic</option><option>Cardiac</option><option>Eye</option><option>ENT</option><option>Dental</option><option>Minor</option></select></div>
        <div><label>${tr('Count', 'العدد')}</label><input id="cssdCount" type="number" class="form-control"></div>
        <div><label>${tr('Dept', 'القسم')}</label><input id="cssdDept" class="form-control"></div>
      </div><button class="btn btn-primary" onclick="addInstrumentSet()" style="margin-top:8px">➕ ${tr('Add', 'إضافة')}</button>
      ${makeTable([tr('Name', 'الاسم'), tr('Code', 'الكود'), tr('Category', 'التصنيف'), tr('Count', 'العدد'), tr('Status', 'الحالة')],
    (instruments || []).map(i => ({ cells: [i.set_name_ar || i.set_name, i.set_code, i.category, i.instrument_count, statusBadge(i.status)] })))}
    </div>
    <div class="card" style="margin-top:20px"><h3>♨️ ${tr('Sterilization Cycles', 'دورات التعقيم')}</h3>
      <div class="form-grid"><div><label>${tr('Cycle #', 'رقم الدورة')}</label><input id="cycleNum" class="form-control"></div>
        <div><label>${tr('Machine', 'الجهاز')}</label><input id="cycleMachine" class="form-control"></div>
        <div><label>${tr('Type', 'النوع')}</label><select id="cycleType" class="form-control"><option>Steam Autoclave</option><option>ETO</option><option>Plasma</option><option>Dry Heat</option></select></div>
        <div><label>${tr('Temp °C', 'الحرارة')}</label><input id="cycleTemp" type="number" class="form-control"></div>
        <div><label>${tr('Duration', 'المدة')}</label><input id="cycleDur" type="number" class="form-control" placeholder="min"></div>
        <div><label>${tr('Operator', 'المشغّل')}</label><input id="cycleOp" class="form-control"></div>
      </div><button class="btn btn-primary" onclick="startCycle()" style="margin-top:8px">▶️ ${tr('Start Cycle', 'بدء الدورة')}</button>
      ${makeTable([tr('Cycle', 'الدورة'), tr('Machine', 'الجهاز'), tr('Type', 'النوع'), tr('BI', 'BI'), tr('Status', 'الحالة'), tr('Actions', 'إجراءات')],
      (cycles || []).map(c => ({
        cells: [c.cycle_number, c.machine_name, c.cycle_type, c.bi_test_result, statusBadge(c.status),
        c.status !== 'Completed' ? `<button class="btn btn-sm" onclick="completeCycle(${c.id})">✅ ${tr('Complete', 'إنهاء')}</button>` : '']
      })))}</div>`;
}
window.addInstrumentSet = async function () {
  try { await API.post('/api/cssd/instruments', { set_name: document.getElementById('cssdName').value, set_name_ar: document.getElementById('cssdNameAr').value, set_code: document.getElementById('cssdCode').value, category: document.getElementById('cssdCat').value, instrument_count: document.getElementById('cssdCount').value, department: document.getElementById('cssdDept').value }); showToast(tr('Added!', 'تمت الإضافة!')); await navigateTo(24); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.startCycle = async function () {
  try { await API.post('/api/cssd/cycles', { cycle_number: document.getElementById('cycleNum').value, machine_name: document.getElementById('cycleMachine').value, cycle_type: document.getElementById('cycleType').value, temperature: document.getElementById('cycleTemp').value, duration_minutes: document.getElementById('cycleDur').value, operator: document.getElementById('cycleOp').value }); showToast(tr('Cycle started!', 'بدأت الدورة!')); await navigateTo(24); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.completeCycle = async function (id) {
  try { await API.put('/api/cssd/cycles/' + id, { status: 'Completed', bi_test_result: 'Pass' }); showToast(tr('Completed!', 'اكتملت!')); await navigateTo(24); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== DIETARY =====
async function renderDietary(el) {
  const orders = await API.get('/api/dietary/orders');
  const admissions = await API.get('/api/admissions?status=Active');
  const dietTypes = [{ en: 'Regular', ar: 'عادي' }, { en: 'Diabetic', ar: 'سكري' }, { en: 'Renal', ar: 'كلوي' }, { en: 'Cardiac', ar: 'قلبي' }, { en: 'NPO', ar: 'صائم' }, { en: 'Liquid', ar: 'سوائل' }, { en: 'Soft', ar: 'لين' }, { en: 'High Protein', ar: 'عالي البروتين' }, { en: 'Low Salt', ar: 'قليل الملح' }, { en: 'Gluten Free', ar: 'خالي الجلوتين' }];
  el.innerHTML = `<div class="page-title">🍽️ ${tr('Dietary / Nutrition', 'التغذية')}</div>
    <div class="card"><h3>📝 ${tr('New Diet Order', 'طلب حمية جديد')}</h3>
      <div class="form-grid">
        <div><label>${tr('Patient', 'المريض')}</label><select id="dietPatient" class="form-control"><option value="">${tr('Select', 'اختر')}</option>${(admissions || []).map(a => `<option value="${a.id}" data-pid="${a.patient_id}" data-name="${a.patient_name}">${a.patient_name}</option>`).join('')}</select></div>
        <div><label>${tr('Diet Type', 'نوع الحمية')}</label><select id="dietType" class="form-control">${dietTypes.map(d => `<option value="${d.en}" data-ar="${d.ar}">${tr(d.en, d.ar)}</option>`).join('')}</select></div>
        <div><label>${tr('Texture', 'القوام')}</label><select id="dietTexture" class="form-control"><option>Normal</option><option>Soft</option><option>Pureed</option><option>Liquid</option></select></div>
        <div><label>${tr('Allergies', 'حساسية')}</label><input id="dietAllergies" class="form-control"></div>
      </div><button class="btn btn-primary" onclick="addDietOrder()" style="margin-top:8px">🍽️ ${tr('Order', 'طلب')}</button></div>
    <div class="card" style="margin-top:20px"><h3>📋 ${tr('Active Orders', 'الطلبات النشطة')}</h3>
      ${makeTable([tr('Patient', 'المريض'), tr('Diet', 'الحمية'), tr('Texture', 'القوام'), tr('Allergies', 'حساسية'), tr('Status', 'الحالة')],
    (orders || []).map(o => ({ cells: [o.patient_name, tr(o.diet_type, o.diet_type_ar), o.texture, o.allergies || '-', statusBadge('Active')] })))}</div>`;
}
window.addDietOrder = async function () {
  const s = document.getElementById('dietPatient'); if (!s.value) return showToast(tr('Select patient', 'اختر المريض'), 'error');
  const dt = document.getElementById('dietType');
  try { await API.post('/api/dietary/orders', { admission_id: s.value, patient_id: s.options[s.selectedIndex].dataset.pid, patient_name: s.options[s.selectedIndex].dataset.name, diet_type: dt.value, diet_type_ar: dt.options[dt.selectedIndex].dataset.ar, texture: document.getElementById('dietTexture').value, allergies: document.getElementById('dietAllergies').value, ordered_by: currentUser?.display_name }); showToast(tr('Diet ordered!', 'تم طلب الحمية!')); await navigateTo(25); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== INFECTION CONTROL =====
let icTab = 'surveillance';
async function renderInfectionControl(el) {
  const [stats, surveillance, outbreaks, hygiene] = await Promise.all([
    API.get('/api/infection/stats'), API.get('/api/infection/surveillance'), API.get('/api/infection/outbreaks'), API.get('/api/infection/hand-hygiene')
  ]);
  el.innerHTML = `<div class="page-title">🦠 ${tr('Infection Control', 'مكافحة العدوى')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card"><div class="stat-value" style="color:#e74c3c">${stats.totalInfections}</div><div class="stat-label">${tr('Total Infections', 'إجمالي العدوى')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#e67e22">${stats.activeOutbreaks}</div><div class="stat-label">${tr('Active Outbreaks', 'تفشيات نشطة')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#9b59b6">${stats.haiCount}</div><div class="stat-label">${tr('HAI Cases', 'عدوى مكتسبة')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#2ecc71">${stats.avgHandHygiene}%</div><div class="stat-label">${tr('Hand Hygiene', 'نظافة الأيدي')}</div></div>
    </div>
    <div class="tab-bar"><button class="tab-btn ${icTab === 'surveillance' ? 'active' : ''}" onclick="icTab='surveillance';navigateTo(26)">🔬 ${tr('Surveillance', 'المراقبة')}</button>
      <button class="tab-btn ${icTab === 'outbreaks' ? 'active' : ''}" onclick="icTab='outbreaks';navigateTo(26)">🚨 ${tr('Outbreaks', 'التفشيات')}</button>
      <button class="tab-btn ${icTab === 'hygiene' ? 'active' : ''}" onclick="icTab='hygiene';navigateTo(26)">🧴 ${tr('Hand Hygiene', 'نظافة الأيدي')}</button></div>
    <div class="card" id="icContent"></div>`;
  const c = document.getElementById('icContent');
  if (icTab === 'surveillance') {
    c.innerHTML = `<h3>🔬 ${tr('Report Infection', 'تسجيل عدوى')}</h3>
      <div class="form-grid">
        <div><label>${tr('Patient', 'المريض')}</label><input id="icPatient" class="form-control"></div>
        <div><label>${tr('Infection Type', 'نوع العدوى')}</label><select id="icType" class="form-control"><option>UTI</option><option>SSI</option><option>BSI</option><option>VAP</option><option>CAUTI</option><option>CLABSI</option><option>CDI</option><option>Other</option></select></div>
        <div><label>${tr('Organism', 'الكائن الممرض')}</label><input id="icOrganism" class="form-control"></div>
        <div><label>${tr('Ward', 'الجناح')}</label><input id="icWard" class="form-control"></div>
        <div><label>${tr('HAI Category', 'تصنيف HAI')}</label><select id="icHAI" class="form-control"><option value="">Not HAI</option><option>Device-Related</option><option>Procedure-Related</option><option>Other HAI</option></select></div>
        <div><label>${tr('Isolation', 'العزل')}</label><select id="icIsolation" class="form-control"><option value="">None</option><option>Contact</option><option>Droplet</option><option>Airborne</option><option>Contact+Droplet</option></select></div>
      </div><button class="btn btn-primary" onclick="reportInfection()" style="margin-top:8px">🦠 ${tr('Report', 'تسجيل')}</button>
      <h4 style="margin-top:20px">${tr('Recent Cases', 'الحالات الأخيرة')}</h4>
      ${makeTable([tr('Patient', 'المريض'), tr('Type', 'النوع'), tr('Organism', 'الكائن'), tr('Ward', 'الجناح'), tr('HAI', 'HAI'), tr('Date', 'التاريخ')],
      (surveillance || []).slice(0, 20).map(s => ({ cells: [s.patient_name, s.infection_type, s.organism || '-', s.ward, s.hai_category || '-', s.detection_date] })))}`;
  } else if (icTab === 'outbreaks') {
    c.innerHTML = `<h3>🚨 ${tr('Outbreaks', 'التفشيات')}</h3>
      ${makeTable([tr('Name', 'الاسم'), tr('Organism', 'الكائن'), tr('Ward', 'الجناح'), tr('Cases', 'الحالات'), tr('Status', 'الحالة'), tr('Date', 'التاريخ')],
      (outbreaks || []).map(o => ({ cells: [o.outbreak_name, o.organism, o.affected_ward, o.total_cases, statusBadge(o.status), o.start_date] })))}`;
  } else {
    c.innerHTML = `<h3>🧴 ${tr('Hand Hygiene Audit', 'تدقيق نظافة الأيدي')}</h3>
      <div class="form-grid">
        <div><label>${tr('Department', 'القسم')}</label><input id="hhDept" class="form-control"></div>
        <div><label>${tr('Moments Observed', 'اللحظات المرصودة')}</label><input id="hhObs" type="number" class="form-control"></div>
        <div><label>${tr('Compliant', 'متوافقة')}</label><input id="hhComp" type="number" class="form-control"></div>
      </div><button class="btn btn-primary" onclick="addHHAudit()" style="margin-top:8px">📝 ${tr('Record', 'تسجيل')}</button>
      ${makeTable([tr('Date', 'التاريخ'), tr('Dept', 'القسم'), tr('Observed', 'مرصودة'), tr('Compliant', 'متوافقة'), tr('Rate', 'النسبة')],
      (hygiene || []).map(h => ({ cells: [h.audit_date, h.department, h.moments_observed, h.moments_compliant, `<span style="color:${h.compliance_rate >= 80 ? '#2ecc71' : '#e74c3c'};font-weight:700">${h.compliance_rate}%</span>`] })))}`;
  }
}
window.reportInfection = async function () {
  try { await API.post('/api/infection/surveillance', { patient_name: document.getElementById('icPatient').value, infection_type: document.getElementById('icType').value, organism: document.getElementById('icOrganism').value, ward: document.getElementById('icWard').value, hai_category: document.getElementById('icHAI').value, isolation_type: document.getElementById('icIsolation').value, reported_by: currentUser?.display_name }); showToast(tr('Reported!', 'تم التسجيل!')); await navigateTo(26); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.addHHAudit = async function () {
  try { await API.post('/api/infection/hand-hygiene', { department: document.getElementById('hhDept').value, moments_observed: document.getElementById('hhObs').value, moments_compliant: document.getElementById('hhComp').value, auditor: currentUser?.display_name }); showToast(tr('Recorded!', 'تم التسجيل!')); await navigateTo(26); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== QUALITY =====
let qTab = 'incidents';
async function renderQuality(el) {
  const [stats, incidents, satisfaction, kpis] = await Promise.all([
    API.get('/api/quality/stats'), API.get('/api/quality/incidents'), API.get('/api/quality/satisfaction'), API.get('/api/quality/kpis')
  ]);
  el.innerHTML = `<div class="page-title">📊 ${tr('Quality & Patient Safety', 'الجودة وسلامة المرضى')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card"><div class="stat-value" style="color:#e74c3c">${stats.openIncidents}</div><div class="stat-label">${tr('Open Incidents', 'حوادث مفتوحة')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#3498db">${stats.totalIncidents}</div><div class="stat-label">${tr('Total Incidents', 'إجمالي الحوادث')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#f39c12">${stats.avgSatisfaction}/5</div><div class="stat-label">${tr('Satisfaction', 'رضا المرضى')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#2ecc71">${stats.kpiOnTrack}/${stats.kpiTotal}</div><div class="stat-label">${tr('KPIs On Track', 'مؤشرات على المسار')}</div></div>
    </div>
    <div class="tab-bar"><button class="tab-btn ${qTab === 'incidents' ? 'active' : ''}" onclick="qTab='incidents';navigateTo(27)">🚨 ${tr('Incidents', 'الحوادث')}</button>
      <button class="tab-btn ${qTab === 'satisfaction' ? 'active' : ''}" onclick="qTab='satisfaction';navigateTo(27)">⭐ ${tr('Satisfaction', 'الرضا')}</button>
      <button class="tab-btn ${qTab === 'kpis' ? 'active' : ''}" onclick="qTab='kpis';navigateTo(27)">📈 ${tr('KPIs', 'المؤشرات')}</button></div>
    <div class="card" id="qContent"></div>`;
  const c = document.getElementById('qContent');
  if (qTab === 'incidents') {
    c.innerHTML = `<h3>🚨 ${tr('Report Incident', 'تسجيل حادثة')}</h3>
      <div class="form-grid">
        <div><label>${tr('Type', 'النوع')}</label><select id="qiType" class="form-control"><option>Medication Error</option><option>Fall</option><option>Near Miss</option><option>Equipment Failure</option><option>Complaint</option><option>Delayed Treatment</option><option>Wrong Patient</option><option>Other</option></select></div>
        <div><label>${tr('Severity', 'الشدة')}</label><select id="qiSeverity" class="form-control"><option>Minor</option><option>Moderate</option><option>Major</option><option>Sentinel</option></select></div>
        <div><label>${tr('Department', 'القسم')}</label><input id="qiDept" class="form-control"></div>
        <div style="grid-column:span 2"><label>${tr('Description', 'الوصف')}</label><textarea id="qiDesc" class="form-control" rows="2"></textarea></div>
        <div style="grid-column:span 2"><label>${tr('Immediate Action', 'الإجراء الفوري')}</label><input id="qiAction" class="form-control"></div>
      </div><button class="btn btn-primary" onclick="reportIncident()" style="margin-top:8px">📝 ${tr('Report', 'تسجيل')}</button>
      ${makeTable([tr('Type', 'النوع'), tr('Severity', 'الشدة'), tr('Dept', 'القسم'), tr('Status', 'الحالة'), tr('Date', 'التاريخ'), tr('Actions', 'إجراءات')],
      (incidents || []).map(i => ({
        cells: [i.incident_type, `<span style="color:${i.severity === 'Sentinel' || i.severity === 'Major' ? '#e74c3c' : i.severity === 'Moderate' ? '#e67e22' : '#27ae60'};font-weight:700">${i.severity}</span>`, i.department, statusBadge(i.status), i.incident_date,
        i.status === 'Open' ? `<button class="btn btn-sm" onclick="closeIncident(${i.id})">✅ ${tr('Close', 'إغلاق')}</button>` : '']
      })))}`;
  } else if (qTab === 'satisfaction') {
    c.innerHTML = `<h3>⭐ ${tr('Patient Satisfaction Surveys', 'استبيانات رضا المرضى')}</h3>
      ${makeTable([tr('Patient', 'المريض'), tr('Dept', 'القسم'), tr('Rating', 'التقييم'), tr('Cleanliness', 'النظافة'), tr('Staff', 'الموظفين'), tr('Wait', 'الانتظار'), tr('Date', 'التاريخ')],
      (satisfaction || []).map(s => ({ cells: [s.patient_name || '-', s.department, `${'⭐'.repeat(s.overall_rating)}`, s.cleanliness + '/5', s.staff_courtesy + '/5', s.wait_time + '/5', s.survey_date] })))}`;
  } else {
    c.innerHTML = `<h3>📈 ${tr('Key Performance Indicators', 'مؤشرات الأداء الرئيسية')}</h3>
      <div class="form-grid">
        <div><label>${tr('KPI Name', 'اسم المؤشر')}</label><input id="kpiName" class="form-control"></div>
        <div><label>${tr('Target', 'الهدف')}</label><input id="kpiTarget" type="number" class="form-control"></div>
        <div><label>${tr('Actual', 'الفعلي')}</label><input id="kpiActual" type="number" class="form-control"></div>
        <div><label>${tr('Period', 'الفترة')}</label><input id="kpiPeriod" class="form-control" placeholder="Q1 2026"></div>
      </div><button class="btn btn-primary" onclick="addKPI()" style="margin-top:8px">➕ ${tr('Add', 'إضافة')}</button>
      ${makeTable([tr('KPI', 'المؤشر'), tr('Target', 'الهدف'), tr('Actual', 'الفعلي'), tr('Status', 'الحالة'), tr('Period', 'الفترة')],
      (kpis || []).map(k => ({ cells: [k.kpi_name_ar || k.kpi_name, k.target_value + k.unit, k.actual_value + k.unit, statusBadge(k.status === 'On Track' ? 'Active' : k.status === 'At Risk' ? 'Pending' : 'Rejected'), k.period] })))}`;
  }
}
window.reportIncident = async function () {
  try { await API.post('/api/quality/incidents', { incident_type: document.getElementById('qiType').value, severity: document.getElementById('qiSeverity').value, department: document.getElementById('qiDept').value, description: document.getElementById('qiDesc').value, immediate_action: document.getElementById('qiAction').value, reported_by: currentUser?.display_name }); showToast(tr('Reported!', 'تم التسجيل!')); await navigateTo(27); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.closeIncident = async function (id) {
  try { await API.put('/api/quality/incidents/' + id, { status: 'Closed' }); showToast(tr('Closed!', 'تم الإغلاق!')); await navigateTo(27); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.addKPI = async function () {
  try { await API.post('/api/quality/kpis', { kpi_name: document.getElementById('kpiName').value, target_value: document.getElementById('kpiTarget').value, actual_value: document.getElementById('kpiActual').value, period: document.getElementById('kpiPeriod').value }); showToast(tr('Added!', 'تمت الإضافة!')); await navigateTo(27); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== MAINTENANCE =====
let mtTab = 'orders';
async function renderMaintenance(el) {
  const [stats, orders, equipment] = await Promise.all([
    API.get('/api/maintenance/stats'), API.get('/api/maintenance/work-orders'), API.get('/api/maintenance/equipment')
  ]);
  el.innerHTML = `<div class="page-title">🔧 ${tr('Maintenance & Biomedical', 'الصيانة والأجهزة الطبية')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card"><div class="stat-value" style="color:#e74c3c">${stats.openWO}</div><div class="stat-label">${tr('Open WOs', 'أوامر مفتوحة')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#f39c12">${stats.inProgressWO}</div><div class="stat-label">${tr('In Progress', 'قيد التنفيذ')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#e67e22">${stats.overduePM}</div><div class="stat-label">${tr('Overdue PM', 'صيانة متأخرة')}</div></div>
      <div class="stat-card"><div class="stat-value" style="color:#2ecc71">${stats.totalEquipment}</div><div class="stat-label">${tr('Equipment', 'المعدات')}</div></div>
    </div>
    <div class="tab-bar"><button class="tab-btn ${mtTab === 'orders' ? 'active' : ''}" onclick="mtTab='orders';navigateTo(28)">📝 ${tr('Work Orders', 'أوامر العمل')}</button>
      <button class="tab-btn ${mtTab === 'equipment' ? 'active' : ''}" onclick="mtTab='equipment';navigateTo(28)">🏗️ ${tr('Equipment', 'المعدات')}</button></div>
    <div class="card" id="mtContent"></div>`;
  const c = document.getElementById('mtContent');
  if (mtTab === 'orders') {
    c.innerHTML = `<h3>📝 ${tr('New Work Order', 'أمر عمل جديد')}</h3>
      <div class="form-grid">
        <div><label>${tr('Type', 'النوع')}</label><select id="woType" class="form-control"><option>Corrective</option><option>Preventive</option><option>Emergency</option></select></div>
        <div><label>${tr('Priority', 'الأولوية')}</label><select id="woPriority" class="form-control"><option>Low</option><option>Normal</option><option>High</option><option>Critical</option></select></div>
        <div><label>${tr('Department', 'القسم')}</label><input id="woDept" class="form-control"></div>
        <div><label>${tr('Location', 'الموقع')}</label><input id="woLocation" class="form-control"></div>
        <div style="grid-column:span 2"><label>${tr('Description', 'الوصف')}</label><textarea id="woDesc" class="form-control" rows="2"></textarea></div>
      </div><button class="btn btn-primary" onclick="addWorkOrder()" style="margin-top:8px">🔧 ${tr('Create', 'إنشاء')}</button>
      ${makeTable([tr('WO#', 'رقم'), tr('Type', 'النوع'), tr('Priority', 'الأولوية'), tr('Dept', 'القسم'), tr('Status', 'الحالة'), tr('Actions', 'إجراءات')],
      (orders || []).map(o => ({
        cells: [o.wo_number, o.request_type, `<span style="color:${o.priority === 'Critical' ? '#e74c3c' : o.priority === 'High' ? '#e67e22' : '#27ae60'};font-weight:700">${o.priority}</span>`, o.department, statusBadge(o.status === 'Open' ? 'Pending' : o.status),
        o.status !== 'Completed' ? `<button class="btn btn-sm" onclick="completeWO(${o.id})">✅</button>` : '']
      })))}`;
  } else {
    c.innerHTML = `<h3>🏗️ ${tr('Equipment Registry', 'سجل المعدات')}</h3>
      <div class="form-grid">
        <div><label>${tr('Name', 'الاسم')}</label><input id="eqName" class="form-control"></div>
        <div><label>${tr('Name AR', 'بالعربي')}</label><input id="eqNameAr" class="form-control"></div>
        <div><label>${tr('Category', 'التصنيف')}</label><select id="eqCat" class="form-control"><option>Medical Device</option><option>Lab Equipment</option><option>IT Equipment</option><option>HVAC</option><option>Electrical</option><option>Plumbing</option><option>Furniture</option></select></div>
        <div><label>${tr('Manufacturer', 'الشركة المصنعة')}</label><input id="eqMfg" class="form-control"></div>
        <div><label>${tr('Serial #', 'الرقم التسلسلي')}</label><input id="eqSerial" class="form-control"></div>
        <div><label>${tr('Department', 'القسم')}</label><input id="eqDept" class="form-control"></div>
      </div><button class="btn btn-primary" onclick="addEquipment()" style="margin-top:8px">➕ ${tr('Add', 'إضافة')}</button>
      ${makeTable([tr('Name', 'الاسم'), tr('Category', 'التصنيف'), tr('Manufacturer', 'المصنع'), tr('Serial', 'الرقم'), tr('Dept', 'القسم'), tr('Status', 'الحالة')],
      (equipment || []).map(e => ({ cells: [e.equipment_name_ar || e.equipment_name, e.category, e.manufacturer, e.serial_number, e.department, statusBadge(e.status)] })))}`;
  }
}
window.addWorkOrder = async function () {
  try { await API.post('/api/maintenance/work-orders', { request_type: document.getElementById('woType').value, priority: document.getElementById('woPriority').value, department: document.getElementById('woDept').value, location: document.getElementById('woLocation').value, description: document.getElementById('woDesc').value, requested_by: currentUser?.display_name }); showToast(tr('Created!', 'تم الإنشاء!')); await navigateTo(28); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.completeWO = async function (id) {
  try { await API.put('/api/maintenance/work-orders/' + id, { status: 'Completed' }); showToast(tr('Completed!', 'اكتمل!')); await navigateTo(28); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.addEquipment = async function () {
  try { await API.post('/api/maintenance/equipment', { equipment_name: document.getElementById('eqName').value, equipment_name_ar: document.getElementById('eqNameAr').value, category: document.getElementById('eqCat').value, manufacturer: document.getElementById('eqMfg').value, serial_number: document.getElementById('eqSerial').value, department: document.getElementById('eqDept').value }); showToast(tr('Added!', 'تمت الإضافة!')); await navigateTo(28); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== TRANSPORT =====
async function renderTransport(el) {
  const requests = await API.get('/api/transport/requests');
  const patients = await API.get('/api/patients');
  el.innerHTML = `<div class="page-title">🚑 ${tr('Patient Transport', 'نقل المرضى')}</div>
    <div class="card"><h3>➕ ${tr('New Transport Request', 'طلب نقل جديد')}</h3>
      <div class="form-grid">
        <div><label>${tr('Patient', 'المريض')}</label><select id="trPatient" class="form-control"><option value="">${tr('Select', 'اختر')}</option>${(patients || []).map(p => `<option value="${p.id}" data-name="${p.name_ar || p.name_en}">${p.name_ar || p.name_en}</option>`).join('')}</select></div>
        <div><label>${tr('From', 'من')}</label><input id="trFrom" class="form-control" placeholder="${tr('e.g. Ward 2', 'مثال: جناح 2')}"></div>
        <div><label>${tr('To', 'إلى')}</label><input id="trTo" class="form-control" placeholder="${tr('e.g. Radiology', 'مثال: الأشعة')}"></div>
        <div><label>${tr('Type', 'النوع')}</label><select id="trType" class="form-control"><option>Wheelchair</option><option>Stretcher</option><option>Bed</option><option>Walking</option></select></div>
        <div><label>${tr('Priority', 'الأولوية')}</label><select id="trPriority" class="form-control"><option>Routine</option><option>Urgent</option><option>STAT</option></select></div>
        <div><label>${tr('Special Needs', 'احتياجات خاصة')}</label><input id="trNeeds" class="form-control"></div>
      </div><button class="btn btn-primary" onclick="addTransport()" style="margin-top:8px">🚑 ${tr('Request', 'طلب')}</button></div>
    <div class="card" style="margin-top:20px"><h3>📋 ${tr('Requests', 'الطلبات')}</h3>
      ${makeTable([tr('Patient', 'المريض'), tr('From', 'من'), tr('To', 'إلى'), tr('Type', 'النوع'), tr('Priority', 'الأولوية'), tr('Status', 'الحالة'), tr('Actions', 'إجراءات')],
    (requests || []).map(r => ({
      cells: [r.patient_name, r.from_location, r.to_location, r.transport_type, `<span style="color:${r.priority === 'STAT' ? '#e74c3c' : r.priority === 'Urgent' ? '#e67e22' : '#27ae60'};font-weight:700">${r.priority}</span>`, statusBadge(r.status),
      r.status === 'Pending' ? `<button class="btn btn-sm btn-success" onclick="completeTransport(${r.id})">✅ ${tr('Done', 'تم')}</button>` : '']
    })))}</div>`;
}
window.addTransport = async function () {
  const s = document.getElementById('trPatient'); if (!s.value) return showToast(tr('Select patient', 'اختر المريض'), 'error');
  try { await API.post('/api/transport/requests', { patient_id: s.value, patient_name: s.options[s.selectedIndex].dataset.name, from_location: document.getElementById('trFrom').value, to_location: document.getElementById('trTo').value, transport_type: document.getElementById('trType').value, priority: document.getElementById('trPriority').value, special_needs: document.getElementById('trNeeds').value, requested_by: currentUser?.display_name }); showToast(tr('Requested!', 'تم الطلب!')); await navigateTo(29); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.completeTransport = async function (id) {
  try { await API.put('/api/transport/requests/' + id, { status: 'Completed', dropoff_time: new Date().toISOString() }); showToast(tr('Done!', 'تم!')); await navigateTo(29); } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== MEDICAL RECORDS / HIM =====
let mrTab = 'requests';
async function renderMedicalRecords(el) {
  const [requests, coding, patients] = await Promise.all([
    API.get('/api/medical-records/requests').catch(() => []),
    API.get('/api/medical-records/coding').catch(() => []),
    API.get('/api/patients').catch(() => [])
  ]);
  const pending = requests.filter(r => r.status === 'Pending').length;
  const delivered = requests.filter(r => r.status === 'Delivered').length;
  el.innerHTML = `
    <div class="page-title">📁 ${tr('Medical Records / HIM', 'السجلات الطبية')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card" style="--stat-color:#f59e0b"><span class="stat-icon">📋</span><div class="stat-label">${tr('Pending Requests', 'طلبات معلقة')}</div><div class="stat-value">${pending}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">📤</span><div class="stat-label">${tr('Delivered', 'مسلّمة')}</div><div class="stat-value">${delivered}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">📊</span><div class="stat-label">${tr('Total Coded', 'مشفّرة')}</div><div class="stat-value">${coding.length}</div></div>
      <div class="stat-card" style="--stat-color:#a78bfa"><span class="stat-icon">📂</span><div class="stat-label">${tr('Total Files', 'إجمالي الملفات')}</div><div class="stat-value">${patients.length}</div></div>
    </div>
    <div class="tab-bar">
      <button class="tab-btn ${mrTab === 'requests' ? 'active' : ''}" onclick="mrTab='requests';navigateTo(30)">📋 ${tr('File Requests', 'طلبات الملفات')}</button>
      <button class="tab-btn ${mrTab === 'new' ? 'active' : ''}" onclick="mrTab='new';navigateTo(30)">➕ ${tr('Request File', 'طلب ملف')}</button>
      <button class="tab-btn ${mrTab === 'coding' ? 'active' : ''}" onclick="mrTab='coding';navigateTo(30)">🔢 ${tr('ICD-10 Coding', 'التشفير')}</button>
    </div>
    <div class="card" id="mrContent"></div>`;
  const mc = document.getElementById('mrContent');
  if (mrTab === 'requests') {
    mc.innerHTML = requests.length ? makeTable(
      [tr('File#', 'رقم الملف'), tr('Requested By', 'طالب الملف'), tr('Department', 'القسم'), tr('Purpose', 'الغرض'), tr('Status', 'الحالة'), tr('Actions', 'إجراءات')],
      requests.map(r => ({
        cells: [r.file_number, r.requested_by, r.department, r.purpose, statusBadge(r.status),
        r.status === 'Pending' ? `<button class="btn btn-sm btn-success" onclick="updateMRRequest(${r.id},'Delivered')">📤 ${tr('Deliver', 'تسليم')}</button>`
          : r.status === 'Delivered' ? `<button class="btn btn-sm" onclick="updateMRRequest(${r.id},'Returned')">↩️ ${tr('Return', 'إرجاع')}</button>` : ''
        ]
      }))
    ) : `<div class="empty-state"><span style="font-size:48px">📂</span><p>${tr('No requests', 'لا توجد طلبات')}</p></div>`;
  } else if (mrTab === 'new') {
    mc.innerHTML = `<h3>➕ ${tr('Request Patient File', 'طلب ملف مريض')}</h3>
    <div class="form-grid">
      <div><label>${tr('Patient', 'المريض')}</label><select id="mrPatient" class="form-input">${patients.map(p => `<option value="${p.id}" data-fn="${p.file_number}">${p.file_number} - ${isArabic ? p.name_ar : p.name_en}</option>`).join('')}</select></div>
      <div><label>${tr('Department', 'القسم')}</label><input id="mrDept" class="form-input" placeholder="${tr('Department', 'القسم')}"></div>
      <div><label>${tr('Purpose', 'الغرض')}</label><select id="mrPurpose" class="form-input"><option>Clinic Visit</option><option>Surgery</option><option>Insurance</option><option>Legal</option><option>Research</option><option>Audit</option></select></div>
      <div><label>${tr('Notes', 'ملاحظات')}</label><input id="mrNotes" class="form-input"></div>
    </div>
    <button class="btn btn-primary" onclick="submitMRRequest()" style="margin-top:8px">📋 ${tr('Submit Request', 'تقديم الطلب')}</button>`;
  } else {
    mc.innerHTML = `<h3>🔢 ${tr('ICD-10 Coding', 'تشفير التشخيصات')}</h3>
    ${coding.length ? makeTable([tr('Patient', 'المريض'), tr('Diagnosis', 'التشخيص'), tr('ICD-10', 'ICD-10'), tr('Coder', 'المشفّر'), tr('Date', 'التاريخ')],
      coding.map(c => ({ cells: [c.patient_id, c.primary_diagnosis, `<span class="badge badge-info">${c.primary_icd10}</span>`, c.coder, c.coding_date] }))
    ) : `<div class="empty-state"><p>${tr('No coding records', 'لا توجد سجلات تشفير')}</p></div>`}`;
  }
}
window.submitMRRequest = async function () {
  const sel = document.getElementById('mrPatient');
  const patient_id = sel.value;
  const file_number = sel.options[sel.selectedIndex].dataset.fn;
  await API.post('/api/medical-records/requests', { patient_id, file_number, department: document.getElementById('mrDept').value, purpose: document.getElementById('mrPurpose').value, notes: document.getElementById('mrNotes').value });
  showToast(tr('Request submitted', 'تم الطلب')); mrTab = 'requests'; navigateTo(30);
};
window.updateMRRequest = async function (id, status) {
  await API.put('/api/medical-records/requests/' + id, { status });
  showToast(tr('Updated', 'تم التحديث')); navigateTo(30);
};

// ===== CLINICAL PHARMACY =====
let cpTab = 'reviews';
async function renderClinicalPharmacy(el) {
  const [reviews, education, patients] = await Promise.all([
    API.get('/api/clinical-pharmacy/reviews').catch(() => []),
    API.get('/api/clinical-pharmacy/education').catch(() => []),
    API.get('/api/patients').catch(() => [])
  ]);
  const open = reviews.filter(r => r.status === 'Open').length;
  el.innerHTML = `
    <div class="page-title">💊 ${tr('Clinical Pharmacy', 'الصيدلية السريرية')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card" style="--stat-color:#ef4444"><span class="stat-icon">⚠️</span><div class="stat-label">${tr('Open Reviews', 'مراجعات مفتوحة')}</div><div class="stat-value">${open}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">📋</span><div class="stat-label">${tr('Total Reviews', 'إجمالي المراجعات')}</div><div class="stat-value">${reviews.length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">✅</span><div class="stat-label">${tr('Resolved', 'محلولة')}</div><div class="stat-value">${reviews.filter(r => r.status === 'Closed').length}</div></div>
      <div class="stat-card" style="--stat-color:#a78bfa"><span class="stat-icon">📚</span><div class="stat-label">${tr('Education Records', 'تثقيف دوائي')}</div><div class="stat-value">${education.length}</div></div>
    </div>
    <div class="tab-bar">
      <button class="tab-btn ${cpTab === 'reviews' ? 'active' : ''}" onclick="cpTab='reviews';navigateTo(31)">📋 ${tr('Reviews', 'المراجعات')}</button>
      <button class="tab-btn ${cpTab === 'new' ? 'active' : ''}" onclick="cpTab='new';navigateTo(31)">➕ ${tr('New Review', 'مراجعة جديدة')}</button>
      <button class="tab-btn ${cpTab === 'education' ? 'active' : ''}" onclick="cpTab='education';navigateTo(31)">📚 ${tr('Education', 'التثقيف')}</button>
    </div>
    <div class="card" id="cpContent"></div>`;
  const mc = document.getElementById('cpContent');
  if (cpTab === 'reviews') {
    mc.innerHTML = reviews.length ? makeTable(
      [tr('Patient', 'المريض'), tr('Type', 'النوع'), tr('Severity', 'الخطورة'), tr('Findings', 'النتائج'), tr('Status', 'الحالة'), tr('Actions', 'إجراءات')],
      reviews.map(r => ({
        cells: [r.patient_name, r.review_type,
        r.severity === 'High' ? '<span class="badge badge-danger">🔴 ' + tr('High', 'عالية') + '</span>' : r.severity === 'Medium' ? '<span class="badge badge-warning">🟡 ' + tr('Medium', 'متوسطة') + '</span>' : '<span class="badge badge-success">🟢 ' + tr('Low', 'منخفضة') + '</span>',
        r.findings?.substring(0, 50) || '-', statusBadge(r.status),
        r.status === 'Open' ? `<button class="btn btn-sm btn-success" onclick="resolveCPReview(${r.id})">✅ ${tr('Resolve', 'حل')}</button>` : ''
        ]
      }))
    ) : `<div class="empty-state"><span style="font-size:48px">💊</span><p>${tr('No reviews', 'لا توجد مراجعات')}</p></div>`;
  } else if (cpTab === 'new') {
    mc.innerHTML = `<h3>➕ ${tr('New Medication Review', 'مراجعة دوائية جديدة')}</h3>
    <div class="form-grid">
      <div><label>${tr('Patient', 'المريض')}</label><select id="cpPatient" class="form-input">${patients.map(p => `<option value="${p.id}" data-name="${p.name_ar || p.name_en}">${p.file_number} - ${isArabic ? p.name_ar : p.name_en}</option>`).join('')}</select></div>
      <div><label>${tr('Review Type', 'النوع')}</label><select id="cpType" class="form-input"><option>Medication Review</option><option>Drug Interaction</option><option>Dose Adjustment</option><option>ADR Report</option><option>TDM Review</option></select></div>
      <div><label>${tr('Severity', 'الخطورة')}</label><select id="cpSeverity" class="form-input"><option value="Low">${tr('Low', 'منخفضة')}</option><option value="Medium">${tr('Medium', 'متوسطة')}</option><option value="High">${tr('High', 'عالية')}</option></select></div>
      <div style="grid-column:1/-1"><label>${tr('Findings', 'النتائج')}</label><textarea id="cpFindings" class="form-input" rows="3"></textarea></div>
      <div style="grid-column:1/-1"><label>${tr('Recommendations', 'التوصيات')}</label><textarea id="cpRecs" class="form-input" rows="3"></textarea></div>
    </div>
    <button class="btn btn-primary" onclick="submitCPReview()" style="margin-top:8px">📋 ${tr('Submit', 'إرسال')}</button>`;
  } else {
    mc.innerHTML = `<h3>📚 ${tr('Patient Drug Education', 'التثقيف الدوائي')}</h3>
    ${education.length ? makeTable([tr('Patient', 'المريض'), tr('Medication', 'الدواء'), tr('Instructions', 'التعليمات'), tr('Educator', 'المثقّف'), tr('Date', 'التاريخ')],
      education.map(e => ({ cells: [e.patient_name, e.medication, e.instructions?.substring(0, 60) || '-', e.educated_by, e.created_at?.split('T')[0]] }))
    ) : `<div class="empty-state"><p>${tr('No records', 'لا توجد سجلات')}</p></div>`}`;
  }
}
window.submitCPReview = async function () {
  const sel = document.getElementById('cpPatient');
  const patient_name = sel.options[sel.selectedIndex].dataset.name;
  await API.post('/api/clinical-pharmacy/reviews', { patient_id: sel.value, patient_name, review_type: document.getElementById('cpType').value, severity: document.getElementById('cpSeverity').value, findings: document.getElementById('cpFindings').value, recommendations: document.getElementById('cpRecs').value });
  showToast(tr('Review submitted', 'تم الإرسال')); cpTab = 'reviews'; navigateTo(31);
};
window.resolveCPReview = async function (id) {
  await API.put('/api/clinical-pharmacy/reviews/' + id, { outcome: 'Resolved', status: 'Closed' });
  showToast(tr('Resolved', 'تم الحل')); navigateTo(31);
};

// ===== REHABILITATION / PT =====
let rehabTab = 'patients';
async function renderRehabilitation(el) {
  const [rehabPatients, sessions, allPatients] = await Promise.all([
    API.get('/api/rehab/patients').catch(() => []),
    API.get('/api/rehab/sessions').catch(() => []),
    API.get('/api/patients').catch(() => [])
  ]);
  const active = rehabPatients.filter(r => r.status === 'Active').length;
  el.innerHTML = `
    <div class="page-title">🏋️ ${tr('Rehabilitation / Physical Therapy', 'إعادة التأهيل / العلاج الطبيعي')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">👥</span><div class="stat-label">${tr('Active Patients', 'مرضى نشطين')}</div><div class="stat-value">${active}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">📅</span><div class="stat-label">${tr('Total Sessions', 'إجمالي الجلسات')}</div><div class="stat-value">${sessions.length}</div></div>
      <div class="stat-card" style="--stat-color:#f59e0b"><span class="stat-icon">🏥</span><div class="stat-label">${tr('Total Patients', 'إجمالي المرضى')}</div><div class="stat-value">${rehabPatients.length}</div></div>
      <div class="stat-card" style="--stat-color:#a78bfa"><span class="stat-icon">✅</span><div class="stat-label">${tr('Discharged', 'خرجوا')}</div><div class="stat-value">${rehabPatients.filter(r => r.status === 'Discharged').length}</div></div>
    </div>
    <div class="tab-bar">
      <button class="tab-btn ${rehabTab === 'patients' ? 'active' : ''}" onclick="rehabTab='patients';navigateTo(32)">👥 ${tr('Patients', 'المرضى')}</button>
      <button class="tab-btn ${rehabTab === 'new' ? 'active' : ''}" onclick="rehabTab='new';navigateTo(32)">➕ ${tr('New Referral', 'تحويل جديد')}</button>
      <button class="tab-btn ${rehabTab === 'sessions' ? 'active' : ''}" onclick="rehabTab='sessions';navigateTo(32)">📅 ${tr('Sessions', 'الجلسات')}</button>
    </div>
    <div class="card" id="rehabContent"></div>`;
  const mc = document.getElementById('rehabContent');
  if (rehabTab === 'patients') {
    mc.innerHTML = rehabPatients.length ? makeTable(
      [tr('Patient', 'المريض'), tr('Diagnosis', 'التشخيص'), tr('Therapy', 'العلاج'), tr('Therapist', 'المعالج'), tr('Status', 'الحالة'), tr('Sessions', 'الجلسات')],
      rehabPatients.map(r => ({
        cells: [r.patient_name, r.diagnosis, r.therapy_type, r.therapist, statusBadge(r.status),
        `<button class="btn btn-sm" onclick="viewRehabSessions(${r.id})">📋 ${tr('View', 'عرض')}</button>`
        ]
      }))
    ) : `<div class="empty-state"><span style="font-size:48px">🏋️</span><p>${tr('No rehab patients', 'لا يوجد مرضى تأهيل')}</p></div>`;
  } else if (rehabTab === 'new') {
    const therapyTypes = ['Physical Therapy', 'Occupational Therapy', 'Speech Therapy', 'Cardiac Rehab', 'Pulmonary Rehab', 'Neurological Rehab'];
    mc.innerHTML = `<h3>➕ ${tr('New Rehabilitation Referral', 'تحويل تأهيل جديد')}</h3>
    <div class="form-grid">
      <div><label>${tr('Patient', 'المريض')}</label><select id="rehabPatient" class="form-input">${allPatients.map(p => `<option value="${p.id}" data-name="${p.name_ar || p.name_en}">${p.file_number} - ${isArabic ? p.name_ar : p.name_en}</option>`).join('')}</select></div>
      <div><label>${tr('Therapy Type', 'نوع العلاج')}</label><select id="rehabType" class="form-input">${therapyTypes.map(t => `<option>${t}</option>`).join('')}</select></div>
      <div><label>${tr('Therapist', 'المعالج')}</label><input id="rehabTherapist" class="form-input"></div>
      <div><label>${tr('Referral Source', 'مصدر التحويل')}</label><input id="rehabSource" class="form-input" placeholder="${tr('Dr. Name / Dept', 'اسم الطبيب / القسم')}"></div>
      <div style="grid-column:1/-1"><label>${tr('Diagnosis', 'التشخيص')}</label><input id="rehabDiag" class="form-input"></div>
      <div style="grid-column:1/-1"><label>${tr('Notes', 'ملاحظات')}</label><textarea id="rehabNotes" class="form-input" rows="3"></textarea></div>
    </div>
    <button class="btn btn-primary" onclick="submitRehab()" style="margin-top:8px">🏋️ ${tr('Add Patient', 'إضافة مريض')}</button>`;
  } else {
    mc.innerHTML = sessions.length ? makeTable(
      [tr('Session#', 'جلسة#'), tr('Date', 'التاريخ'), tr('Therapist', 'المعالج'), tr('Duration', 'المدة'), tr('Pain Before', 'ألم قبل'), tr('Pain After', 'ألم بعد'), tr('Notes', 'ملاحظات')],
      sessions.map(s => ({
        cells: [s.session_number, s.session_date, s.therapist, s.duration_minutes + ' ' + tr('min', 'د'),
        `<span style="color:${s.pain_before > 5 ? '#ef4444' : '#22c55e'}">${s.pain_before}/10</span>`,
        `<span style="color:${s.pain_after > 5 ? '#ef4444' : '#22c55e'}">${s.pain_after}/10</span>`,
        s.progress_notes?.substring(0, 50) || '-'
        ]
      }))
    ) : `<div class="empty-state"><p>${tr('No sessions', 'لا توجد جلسات')}</p></div>`;
  }
}
window.submitRehab = async function () {
  const sel = document.getElementById('rehabPatient');
  const patient_name = sel.options[sel.selectedIndex].dataset.name;
  await API.post('/api/rehab/patients', { patient_id: sel.value, patient_name, diagnosis: document.getElementById('rehabDiag').value, referral_source: document.getElementById('rehabSource').value, therapist: document.getElementById('rehabTherapist').value, therapy_type: document.getElementById('rehabType').value, notes: document.getElementById('rehabNotes').value });
  showToast(tr('Patient added', 'تمت الإضافة')); rehabTab = 'patients'; navigateTo(32);
};
window.viewRehabSessions = async function (id) {
  rehabTab = 'sessions'; navigateTo(32);
};

// ===== PATIENT PORTAL =====
async function renderPatientPortal(el) {
  const [portalUsers, appts, patients] = await Promise.all([
    API.get('/api/portal/users').catch(() => []),
    API.get('/api/portal/appointments').catch(() => []),
    API.get('/api/patients').catch(() => [])
  ]);
  el.innerHTML = `
    <div class="page-title">📱 ${tr('Patient Portal Management', 'إدارة بوابة المرضى')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">👥</span><div class="stat-label">${tr('Portal Users', 'مستخدمو البوابة')}</div><div class="stat-value">${portalUsers.length}</div></div>
      <div class="stat-card" style="--stat-color:#f59e0b"><span class="stat-icon">📅</span><div class="stat-label">${tr('Pending Requests', 'طلبات معلقة')}</div><div class="stat-value">${appts.filter(a => a.status === 'Requested').length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">✅</span><div class="stat-label">${tr('Approved', 'مقبولة')}</div><div class="stat-value">${appts.filter(a => a.status === 'Approved').length}</div></div>
    </div>
    <div class="grid-equal">
      <div class="card"><div class="card-title">👥 ${tr('Portal Users', 'مستخدمو البوابة')}</div>
        ${portalUsers.length ? makeTable([tr('Patient', 'المريض'), tr('Username', 'المستخدم'), tr('Email', 'البريد'), tr('Status', 'الحالة')],
    portalUsers.map(u => ({ cells: [u.name_ar || u.name_en || u.patient_id, u.username, u.email || '-', u.is_active ? '<span class="badge badge-success">' + tr('Active', 'نشط') + '</span>' : '<span class="badge badge-danger">' + tr('Inactive', 'معطّل') + '</span>'] }))
  ) : `<div class="empty-state"><p>${tr('No portal users', 'لا يوجد مستخدمين')}</p></div>`}
      </div>
      <div class="card"><div class="card-title">📅 ${tr('Appointment Requests', 'طلبات المواعيد')}</div>
        ${appts.length ? makeTable([tr('Patient', 'المريض'), tr('Department', 'القسم'), tr('Date', 'التاريخ'), tr('Status', 'الحالة'), tr('Actions', 'إجراءات')],
    appts.map(a => ({
      cells: [a.patient_id, a.department, a.preferred_date, statusBadge(a.status),
      a.status === 'Requested' ? `<button class="btn btn-sm btn-success" onclick="approvePortalAppt(${a.id})">✅</button> <button class="btn btn-sm btn-danger" onclick="rejectPortalAppt(${a.id})">❌</button>` : ''
      ]
    }))
  ) : `<div class="empty-state"><p>${tr('No requests', 'لا توجد طلبات')}</p></div>`}
      </div>
    </div>`;
}
window.approvePortalAppt = async function (id) { await API.put('/api/portal/appointments/' + id, { status: 'Approved' }); showToast(tr('Approved', 'تمت الموافقة')); navigateTo(33); };
window.rejectPortalAppt = async function (id) { await API.put('/api/portal/appointments/' + id, { status: 'Rejected' }); showToast(tr('Rejected', 'تم الرفض')); navigateTo(33); };

// ===== ZATCA E-INVOICING =====
async function renderZATCA(el) {
  const [zatcaInvs, invoices] = await Promise.all([
    API.get('/api/zatca/invoices').catch(() => []),
    API.get('/api/invoices').catch(() => [])
  ]);
  const pending = invoices.filter(i => !zatcaInvs.find(z => z.invoice_id === i.id));
  el.innerHTML = `
    <div class="page-title">🧾 ${tr('ZATCA E-Invoicing', 'الفوترة الإلكترونية - زاتكا')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">✅</span><div class="stat-label">${tr('Generated', 'مُصدرة')}</div><div class="stat-value">${zatcaInvs.length}</div></div>
      <div class="stat-card" style="--stat-color:#f59e0b"><span class="stat-icon">⏳</span><div class="stat-label">${tr('Pending', 'بانتظار')}</div><div class="stat-value">${pending.length}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">💰</span><div class="stat-label">${tr('Total VAT', 'إجمالي الضريبة')}</div><div class="stat-value">${zatcaInvs.reduce((s, z) => s + Number(z.vat_amount), 0).toLocaleString()} SAR</div></div>
    </div>
    <div class="card"><div class="card-title">🧾 ${tr('E-Invoice Records', 'سجل الفواتير الإلكترونية')}</div>
    ${zatcaInvs.length ? makeTable([tr('Invoice#', 'رقم الفاتورة'), tr('Buyer', 'المشتري'), tr('Before VAT', 'قبل الضريبة'), tr('VAT', 'الضريبة'), tr('Total', 'الإجمالي'), tr('Status', 'الحالة')],
    zatcaInvs.map(z => ({ cells: [z.invoice_number, z.buyer_name, Number(z.total_before_vat).toLocaleString() + ' SAR', Number(z.vat_amount).toLocaleString() + ' SAR', Number(z.total_with_vat).toLocaleString() + ' SAR', statusBadge(z.submission_status)] }))
  ) : `<div class="empty-state"><p>${tr('No e-invoices generated', 'لم تُصدر فواتير إلكترونية')}</p></div>`}
    </div>`;
}

// ===== TELEMEDICINE =====
let teleTab = 'sessions';
async function renderTelemedicine(el) {
  const [sessions, patients] = await Promise.all([
    API.get('/api/telemedicine/sessions').catch(() => []),
    API.get('/api/patients').catch(() => [])
  ]);
  el.innerHTML = `
    <div class="page-title">📹 ${tr('Telemedicine', 'الطب عن بعد')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">📹</span><div class="stat-label">${tr('Scheduled', 'مجدولة')}</div><div class="stat-value">${sessions.filter(s => s.status === 'Scheduled').length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">✅</span><div class="stat-label">${tr('Completed', 'مكتملة')}</div><div class="stat-value">${sessions.filter(s => s.status === 'Completed').length}</div></div>
      <div class="stat-card" style="--stat-color:#a78bfa"><span class="stat-icon">📊</span><div class="stat-label">${tr('Total', 'الإجمالي')}</div><div class="stat-value">${sessions.length}</div></div>
    </div>
    <div class="tab-bar">
      <button class="tab-btn ${teleTab === 'sessions' ? 'active' : ''}" onclick="teleTab='sessions';navigateTo(35)">📋 ${tr('Sessions', 'الجلسات')}</button>
      <button class="tab-btn ${teleTab === 'new' ? 'active' : ''}" onclick="teleTab='new';navigateTo(35)">➕ ${tr('New Session', 'جلسة جديدة')}</button>
    </div>
    <div class="card" id="teleContent"></div>`;
  const mc = document.getElementById('teleContent');
  if (teleTab === 'new') {
    mc.innerHTML = `<h3>➕ ${tr('Schedule Telemedicine Session', 'جدولة جلسة طب عن بعد')}</h3>
    <div class="form-grid">
      <div><label>${tr('Patient', 'المريض')}</label><select id="telePatient" class="form-input">${patients.map(p => `<option value="${p.id}" data-name="${p.name_ar || p.name_en}">${p.file_number} - ${isArabic ? p.name_ar : p.name_en}</option>`).join('')}</select></div>
      <div><label>${tr('Type', 'النوع')}</label><select id="teleType" class="form-input"><option>Video</option><option>Audio</option><option>Chat</option></select></div>
      <div><label>${tr('Date', 'التاريخ')}</label><input id="teleDate" type="date" class="form-input"></div>
      <div><label>${tr('Time', 'الوقت')}</label><input id="teleTime" type="time" class="form-input"></div>
      <div><label>${tr('Duration (min)', 'المدة (دقيقة)')}</label><input id="teleDur" type="number" class="form-input" value="15"></div>
    </div>
    <button class="btn btn-primary" onclick="scheduleTele()" style="margin-top:8px">📹 ${tr('Schedule', 'جدولة')}</button>`;
  } else {
    mc.innerHTML = sessions.length ? makeTable(
      [tr('Patient', 'المريض'), tr('Type', 'النوع'), tr('Date', 'التاريخ'), tr('Time', 'الوقت'), tr('Doctor', 'الطبيب'), tr('Status', 'الحالة'), tr('Link', 'الرابط')],
      sessions.map(s => ({
        cells: [s.patient_name, s.session_type, s.scheduled_date, s.scheduled_time, s.doctor, statusBadge(s.status),
        s.status === 'Scheduled' ? `<a href="${s.meeting_link}" target="_blank" class="btn btn-sm btn-success">🔗 ${tr('Join', 'انضم')}</a>` : ''
        ]
      }))
    ) : `<div class="empty-state"><p>${tr('No sessions', 'لا توجد جلسات')}</p></div>`;
  }
}
window.scheduleTele = async function () {
  const sel = document.getElementById('telePatient');
  await API.post('/api/telemedicine/sessions', { patient_id: sel.value, patient_name: sel.options[sel.selectedIndex].dataset.name, session_type: document.getElementById('teleType').value, scheduled_date: document.getElementById('teleDate').value, scheduled_time: document.getElementById('teleTime').value, duration_minutes: document.getElementById('teleDur').value });
  showToast(tr('Session scheduled', 'تمت الجدولة')); teleTab = 'sessions'; navigateTo(35);
};

// ===== PATHOLOGY =====
async function renderPathology(el) {
  const [cases, patients] = await Promise.all([
    API.get('/api/pathology/cases').catch(() => []),
    API.get('/api/patients').catch(() => [])
  ]);
  el.innerHTML = `
    <div class="page-title">🔬 ${tr('Pathology / Histopathology', 'علم الأمراض')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card" style="--stat-color:#f59e0b"><span class="stat-icon">📥</span><div class="stat-label">${tr('Received', 'مستلمة')}</div><div class="stat-value">${cases.filter(c => c.status === 'Received').length}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">🔬</span><div class="stat-label">${tr('In Process', 'قيد المعالجة')}</div><div class="stat-value">${cases.filter(c => c.status === 'Processing').length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">📋</span><div class="stat-label">${tr('Reported', 'تم التقرير')}</div><div class="stat-value">${cases.filter(c => c.status === 'Reported').length}</div></div>
    </div>
    <div class="card">
    ${cases.length ? makeTable(
    [tr('Patient', 'المريض'), tr('Specimen', 'العينة'), tr('Collection', 'جمع'), tr('Diagnosis', 'التشخيص'), tr('Stage', 'المرحلة'), tr('Status', 'الحالة')],
    cases.map(c => ({ cells: [c.patient_name, c.specimen_type, c.collection_date, c.diagnosis || '-', c.stage || '-', statusBadge(c.status)] }))
  ) : `<div class="empty-state"><span style="font-size:48px">🔬</span><p>${tr('No pathology cases', 'لا توجد حالات')}</p></div>`}
    </div>`;
}

// ===== SOCIAL WORK =====
async function renderSocialWork(el) {
  const [cases, patients] = await Promise.all([
    API.get('/api/social-work/cases').catch(() => []),
    API.get('/api/patients').catch(() => [])
  ]);
  el.innerHTML = `
    <div class="page-title">🤝 ${tr('Social Work', 'الخدمة الاجتماعية')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card" style="--stat-color:#ef4444"><span class="stat-icon">📋</span><div class="stat-label">${tr('Open Cases', 'حالات مفتوحة')}</div><div class="stat-value">${cases.filter(c => c.status === 'Open').length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">✅</span><div class="stat-label">${tr('Closed', 'مغلقة')}</div><div class="stat-value">${cases.filter(c => c.status === 'Closed').length}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">📊</span><div class="stat-label">${tr('Total', 'الإجمالي')}</div><div class="stat-value">${cases.length}</div></div>
    </div>
    <div class="card">
    ${cases.length ? makeTable(
    [tr('Patient', 'المريض'), tr('Type', 'النوع'), tr('Worker', 'الأخصائي'), tr('Priority', 'الأولوية'), tr('Status', 'الحالة'), tr('Follow-up', 'المتابعة')],
    cases.map(c => ({ cells: [c.patient_name, c.case_type, c.social_worker, c.priority === 'High' ? '🔴 ' + tr('High', 'عالية') : c.priority === 'Low' ? '🟢 ' + tr('Low', 'منخفضة') : '🟡 ' + tr('Medium', 'متوسطة'), statusBadge(c.status), c.follow_up_date || '-'] }))
  ) : `<div class="empty-state"><span style="font-size:48px">🤝</span><p>${tr('No cases', 'لا توجد حالات')}</p></div>`}
    </div>`;
}

// ===== MORTUARY =====
async function renderMortuary(el) {
  const cases = await API.get('/api/mortuary/cases').catch(() => []);
  el.innerHTML = `
    <div class="page-title">🏛️ ${tr('Mortuary Services', 'خدمة الوفيات')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card" style="--stat-color:#ef4444"><span class="stat-icon">⏳</span><div class="stat-label">${tr('Pending Release', 'بانتظار التسليم')}</div><div class="stat-value">${cases.filter(c => c.release_status === 'Pending').length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">✅</span><div class="stat-label">${tr('Released', 'مسلّمة')}</div><div class="stat-value">${cases.filter(c => c.release_status === 'Released').length}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">📋</span><div class="stat-label">${tr('Total Records', 'إجمالي السجلات')}</div><div class="stat-value">${cases.length}</div></div>
    </div>
    <div class="card">
    ${cases.length ? makeTable(
    [tr('Name', 'الاسم'), tr('Date', 'التاريخ'), tr('Cause', 'السبب'), tr('Physician', 'الطبيب'), tr('Next of Kin', 'أقرب ذوي'), tr('Certificate#', 'رقم الشهادة'), tr('Status', 'الحالة')],
    cases.map(c => ({ cells: [c.deceased_name, c.date_of_death, c.cause_of_death || '-', c.attending_physician, c.next_of_kin || '-', c.death_certificate_number || '-', statusBadge(c.release_status)] }))
  ) : `<div class="empty-state"><span style="font-size:48px">🏛️</span><p>${tr('No records', 'لا توجد سجلات')}</p></div>`}
    </div>`;
}

// ===== CME (Continuing Medical Education) =====
let cmeTab = 'activities';
async function renderCME(el) {
  const [activities, registrations] = await Promise.all([
    API.get('/api/cme/activities').catch(() => []),
    API.get('/api/cme/registrations').catch(() => [])
  ]);
  el.innerHTML = `
    <div class="page-title">🎓 ${tr('Continuing Medical Education', 'التعليم الطبي المستمر')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">📚</span><div class="stat-label">${tr('Activities', 'الأنشطة')}</div><div class="stat-value">${activities.length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">👥</span><div class="stat-label">${tr('Registrations', 'التسجيلات')}</div><div class="stat-value">${registrations.length}</div></div>
      <div class="stat-card" style="--stat-color:#f59e0b"><span class="stat-icon">⏰</span><div class="stat-label">${tr('Upcoming', 'قادمة')}</div><div class="stat-value">${activities.filter(a => a.status === 'Upcoming').length}</div></div>
    </div>
    <div class="tab-bar">
      <button class="tab-btn ${cmeTab === 'activities' ? 'active' : ''}" onclick="cmeTab='activities';navigateTo(40)">📚 ${tr('Activities', 'الأنشطة')}</button>
      <button class="tab-btn ${cmeTab === 'new' ? 'active' : ''}" onclick="cmeTab='new';navigateTo(40)">➕ ${tr('New Activity', 'نشاط جديد')}</button>
    </div>
    <div class="card" id="cmeContent"></div>`;
  const mc = document.getElementById('cmeContent');
  if (cmeTab === 'new') {
    mc.innerHTML = `<h3>➕ ${tr('New CME Activity', 'نشاط تعليمي جديد')}</h3>
    <div class="form-grid">
      <div style="grid-column:1/-1"><label>${tr('Title', 'العنوان')}</label><input id="cmeTitle" class="form-input"></div>
      <div><label>${tr('Category', 'الفئة')}</label><select id="cmeCat" class="form-input"><option>Conference</option><option>Workshop</option><option>Lecture</option><option>Online Course</option><option>Grand Rounds</option></select></div>
      <div><label>${tr('Credit Hours', 'ساعات معتمدة')}</label><input id="cmeHours" type="number" class="form-input" value="1"></div>
      <div><label>${tr('Date', 'التاريخ')}</label><input id="cmeDate" type="date" class="form-input"></div>
      <div><label>${tr('Location', 'الموقع')}</label><input id="cmeLoc" class="form-input"></div>
    </div>
    <button class="btn btn-primary" onclick="addCME()" style="margin-top:8px">📚 ${tr('Add', 'إضافة')}</button>`;
  } else {
    mc.innerHTML = activities.length ? makeTable(
      [tr('Title', 'العنوان'), tr('Category', 'الفئة'), tr('Hours', 'ساعات'), tr('Date', 'التاريخ'), tr('Registered', 'مسجلين'), tr('Status', 'الحالة')],
      activities.map(a => ({ cells: [a.title, a.category, a.credit_hours, a.activity_date, a.registered + '/' + a.max_participants, statusBadge(a.status)] }))
    ) : `<div class="empty-state"><p>${tr('No activities', 'لا توجد أنشطة')}</p></div>`;
  }
}
window.addCME = async function () {
  await API.post('/api/cme/activities', { title: document.getElementById('cmeTitle').value, category: document.getElementById('cmeCat').value, credit_hours: document.getElementById('cmeHours').value, activity_date: document.getElementById('cmeDate').value, location: document.getElementById('cmeLoc').value });
  showToast(tr('Activity added', 'تمت الإضافة')); cmeTab = 'activities'; navigateTo(40);
};

// ===== COSMETIC / PLASTIC SURGERY =====
let cosTab = 'procedures';
async function renderCosmeticSurgery(el) {
  const [procedures, cases, consents, followups, patients] = await Promise.all([
    API.get('/api/cosmetic/procedures').catch(() => []),
    API.get('/api/cosmetic/cases').catch(() => []),
    API.get('/api/cosmetic/consents').catch(() => []),
    API.get('/api/cosmetic/followups').catch(() => []),
    API.get('/api/patients').catch(() => [])
  ]);
  const scheduled = cases.filter(c => c.status === 'Scheduled').length;
  const completed = cases.filter(c => c.status === 'Completed').length;
  const revenue = cases.reduce((s, c) => s + Number(c.total_cost || 0), 0);
  const catIcons = { Face: '👤', Body: '💪', 'Non-Surgical': '💉', Laser: '✨', Hair: '💇' };
  el.innerHTML = `
    <div class="page-title">💎 ${tr('Cosmetic & Plastic Surgery', 'جراحة التجميل والجراحة التقويمية')}</div>
    <div class="stats-grid" style="grid-template-columns:repeat(5,1fr)">
      <div class="stat-card" style="--stat-color:#ec4899"><span class="stat-icon">💎</span><div class="stat-label">${tr('Procedures', 'الإجراءات')}</div><div class="stat-value">${procedures.length}</div></div>
      <div class="stat-card" style="--stat-color:#f59e0b"><span class="stat-icon">📅</span><div class="stat-label">${tr('Scheduled', 'مجدولة')}</div><div class="stat-value">${scheduled}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">✅</span><div class="stat-label">${tr('Completed', 'مكتملة')}</div><div class="stat-value">${completed}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><span class="stat-icon">📋</span><div class="stat-label">${tr('Consents', 'إقرارات')}</div><div class="stat-value">${consents.length}</div></div>
      <div class="stat-card" style="--stat-color:#a78bfa"><span class="stat-icon">💰</span><div class="stat-label">${tr('Revenue', 'الإيرادات')}</div><div class="stat-value">${revenue.toLocaleString()}</div></div>
    </div>
    <div class="tab-bar">
      <button class="tab-btn ${cosTab === 'procedures' ? 'active' : ''}" onclick="cosTab='procedures';navigateTo(41)">📋 ${tr('Procedures', 'الإجراءات')}</button>
      <button class="tab-btn ${cosTab === 'cases' ? 'active' : ''}" onclick="cosTab='cases';navigateTo(41)">🏥 ${tr('Cases', 'الحالات')}</button>
      <button class="tab-btn ${cosTab === 'newcase' ? 'active' : ''}" onclick="cosTab='newcase';navigateTo(41)">➕ ${tr('New Case', 'حالة جديدة')}</button>
      <button class="tab-btn ${cosTab === 'consents' ? 'active' : ''}" onclick="cosTab='consents';navigateTo(41)">📜 ${tr('Consents', 'الإقرارات')}</button>
      <button class="tab-btn ${cosTab === 'newconsent' ? 'active' : ''}" onclick="cosTab='newconsent';navigateTo(41)">✍️ ${tr('New Consent', 'إقرار جديد')}</button>
      <button class="tab-btn ${cosTab === 'followups' ? 'active' : ''}" onclick="cosTab='followups';navigateTo(41)">🩺 ${tr('Follow-ups', 'المتابعات')}</button>
    </div>
    <div id="cosContent"></div>`;
  const mc = document.getElementById('cosContent');

  if (cosTab === 'procedures') {
    // Group by category
    const cats = {};
    procedures.forEach(p => { if (!cats[p.category]) cats[p.category] = []; cats[p.category].push(p); });
    mc.innerHTML = Object.entries(cats).map(([cat, procs]) => `
      <div class="card mb-16">
        <div class="card-title">${catIcons[cat] || '💎'} ${cat}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
          ${procs.map(p => `
            <div style="border:1px solid var(--border-color,#e5e7eb);border-radius:12px;padding:14px;background:var(--card-bg)">
              <div style="font-weight:700;font-size:15px;margin-bottom:6px">${isArabic ? p.name_ar : p.name_en}</div>
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">${p.description?.substring(0, 80) || ''}</div>
              <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:4px;font-size:11px">
                <span>⏱️ ${p.estimated_duration} ${tr('min', 'د')}</span>
                <span>💉 ${p.anesthesia_type}</span>
                <span>💰 ${Number(p.average_cost).toLocaleString()} SAR</span>
                <span>🔄 ${p.recovery_days} ${tr('days', 'يوم')}</span>
              </div>
              <div style="margin-top:8px;font-size:11px;color:#ef4444">⚠️ ${p.risks?.substring(0, 60) || ''}...</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  } else if (cosTab === 'cases') {
    mc.innerHTML = `<div class="card">${cases.length ? makeTable(
      [tr('Patient', 'المريض'), tr('Procedure', 'الإجراء'), tr('Surgeon', 'الجراح'), tr('Date', 'التاريخ'), tr('Cost', 'التكلفة'), tr('Payment', 'الدفع'), tr('Status', 'الحالة'), tr('Actions', 'إجراءات')],
      cases.map(c => ({
        cells: [c.patient_name, c.procedure_name, c.surgeon, c.surgery_date, Number(c.total_cost).toLocaleString() + ' SAR',
        c.payment_status === 'Paid' ? '<span class="badge badge-success">' + tr('Paid', 'مدفوع') + '</span>' : '<span class="badge badge-danger">' + tr('Pending', 'معلق') + '</span>',
        statusBadge(c.status),
        c.status === 'Scheduled' ? `<button class="btn btn-sm btn-success" onclick="completeCosCase(${c.id})">✅ ${tr('Complete', 'إكمال')}</button>` : ''
        ]
      }))
    ) : `<div class="empty-state"><span style="font-size:48px">💎</span><p>${tr('No cases yet', 'لا توجد حالات بعد')}</p></div>`}</div>`;
  } else if (cosTab === 'newcase') {
    mc.innerHTML = `<div class="card"><h3>➕ ${tr('Schedule New Cosmetic Case', 'جدولة حالة تجميل جديدة')}</h3>
    <div class="form-grid">
      <div><label>${tr('Patient', 'المريض')}</label><select id="cosPatient" class="form-input">${patients.map(p => `<option value="${p.id}" data-name="${p.name_ar || p.name_en}">${p.file_number} - ${isArabic ? p.name_ar : p.name_en}</option>`).join('')}</select></div>
      <div><label>${tr('Procedure', 'الإجراء')}</label><select id="cosProc" class="form-input" onchange="updateCosFields()">${procedures.map(p => `<option value="${p.id}" data-name="${isArabic ? p.name_ar : p.name_en}" data-cost="${p.average_cost}" data-anes="${p.anesthesia_type}" data-dur="${p.estimated_duration}">${isArabic ? p.name_ar : p.name_en}</option>`).join('')}</select></div>
      <div><label>${tr('Date', 'التاريخ')}</label><input id="cosSurgDate" type="date" class="form-input"></div>
      <div><label>${tr('Time', 'الوقت')}</label><input id="cosSurgTime" type="time" class="form-input"></div>
      <div><label>${tr('Anesthesia', 'التخدير')}</label><select id="cosAnes" class="form-input"><option>Local</option><option>General</option><option>Sedation</option><option>None</option></select></div>
      <div><label>${tr('Operating Room', 'غرفة العمليات')}</label><input id="cosOR" class="form-input" placeholder="${tr('OR-1', 'غ.ع-1')}"></div>
      <div><label>${tr('Cost (SAR)', 'التكلفة')}</label><input id="cosCost" type="number" class="form-input"></div>
      <div style="grid-column:1/-1"><label>${tr('Pre-Op Notes', 'ملاحظات ما قبل العملية')}</label><textarea id="cosPreNotes" class="form-input" rows="2"></textarea></div>
    </div>
    <button class="btn btn-primary" onclick="saveCosCase()" style="margin-top:10px;width:100%;height:44px">💎 ${tr('Schedule Case', 'جدولة الحالة')}</button></div>`;
    // Auto-fill fields from selected procedure
    setTimeout(() => {
      const sel = document.getElementById('cosProc');
      if (sel && sel.options.length) {
        const opt = sel.options[sel.selectedIndex];
        document.getElementById('cosCost').value = opt.dataset.cost || '';
        document.getElementById('cosAnes').value = opt.dataset.anes || 'Local';
      }
    }, 100);
  } else if (cosTab === 'consents') {
    mc.innerHTML = `<div class="card">${consents.length ? makeTable(
      [tr('Patient', 'المريض'), tr('Procedure', 'الإجراء'), tr('Type', 'النوع'), tr('Surgeon', 'الجراح'), tr('Date', 'التاريخ'), tr('📷', 'تصوير'), tr('💉', 'تخدير'), tr('🩸', 'نقل دم'), tr('Status', 'الحالة'), tr('Actions', 'إجراءات')],
      consents.map(c => ({
        cells: [c.patient_name, c.procedure_name, c.consent_type, c.surgeon, c.consent_date,
        c.is_photography_consent ? '✅' : '❌', c.is_anesthesia_consent ? '✅' : '❌', c.is_blood_transfusion_consent ? '✅' : '❌',
        statusBadge(c.status),
        `<button class="btn btn-sm" onclick="printCosConsent(${c.id})">🖨️ ${tr('Print', 'طباعة')}</button>`
        ]
      }))
    ) : `<div class="empty-state"><span style="font-size:48px">📜</span><p>${tr('No consents', 'لا توجد إقرارات')}</p></div>`}</div>`;
  } else if (cosTab === 'newconsent') {
    mc.innerHTML = `<div class="card"><h3>✍️ ${tr('New Consent Form', 'نموذج إقرار جديد')}</h3>
    <div class="form-grid">
      <div><label>${tr('Patient', 'المريض')}</label><select id="conPatient" class="form-input">${patients.map(p => `<option value="${p.id}" data-name="${p.name_ar || p.name_en}">${p.file_number} - ${isArabic ? p.name_ar : p.name_en}</option>`).join('')}</select></div>
      <div><label>${tr('Procedure', 'الإجراء')}</label><select id="conProc" class="form-input" onchange="fillConsentRisks()">${procedures.map(p => `<option value="${p.id}" data-name="${isArabic ? p.name_ar : p.name_en}" data-risks="${p.risks}" data-desc="${p.description}">${isArabic ? p.name_ar : p.name_en}</option>`).join('')}</select></div>
      <div><label>${tr('Consent Type', 'نوع الإقرار')}</label><select id="conType" class="form-input"><option value="Surgery">${tr('Surgery Consent', 'إقرار جراحة')}</option><option value="Non-Surgical">${tr('Non-Surgical', 'غير جراحي')}</option><option value="Anesthesia">${tr('Anesthesia', 'تخدير')}</option></select></div>
      <div><label>${tr('Witness', 'الشاهد')}</label><input id="conWitness" class="form-input"></div>
      <div style="grid-column:1/-1"><label>⚠️ ${tr('Risks Explained', 'المخاطر الموضّحة')}</label><textarea id="conRisks" class="form-input" rows="3"></textarea></div>
      <div style="grid-column:1/-1"><label>🔄 ${tr('Alternatives Explained', 'البدائل الموضّحة')}</label><textarea id="conAlts" class="form-input" rows="2" placeholder="${tr('Non-surgical options, different techniques...', 'الخيارات غير الجراحية، تقنيات مختلفة...')}"></textarea></div>
      <div style="grid-column:1/-1"><label>✅ ${tr('Expected Results', 'النتائج المتوقعة')}</label><textarea id="conResults" class="form-input" rows="2"></textarea></div>
      <div style="grid-column:1/-1"><label>⛔ ${tr('Limitations', 'القيود والمحددات')}</label><textarea id="conLimits" class="form-input" rows="2" placeholder="${tr('Results may vary, revision may be needed...', 'النتائج قد تختلف، قد تكون المراجعة ضرورية...')}"></textarea></div>
    </div>
    <div style="margin:16px 0;padding:16px;background:var(--hover);border-radius:12px">
      <h4 style="margin-bottom:12px">${tr('Additional Consents', 'موافقات إضافية')}</h4>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px"><input type="checkbox" id="conPhoto"> 📷 ${tr('Photography Consent', 'الموافقة على التصوير')}</label>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px"><input type="checkbox" id="conAnesC"> 💉 ${tr('Anesthesia Consent', 'الموافقة على التخدير')}</label>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:14px"><input type="checkbox" id="conBlood"> 🩸 ${tr('Blood Transfusion', 'نقل الدم')}</label>
      </div>
    </div>
    <button class="btn btn-primary" onclick="saveCosConsent()" style="width:100%;height:48px;font-size:16px">✍️ ${tr('Sign & Save Consent', 'توقيع وحفظ الإقرار')}</button></div>`;
    setTimeout(() => fillConsentRisks(), 100);
  } else if (cosTab === 'followups') {
    mc.innerHTML = `<div class="card">${followups.length ? makeTable(
      [tr('Patient', 'المريض'), tr('Date', 'التاريخ'), tr('Days Post-Op', 'أيام بعد العملية'), tr('Healing', 'التعافي'), tr('Pain', 'الألم'), tr('Swelling', 'التورم'), tr('Satisfaction', 'الرضا'), tr('Next', 'القادمة')],
      followups.map(f => ({
        cells: [f.patient_name, f.followup_date, f.days_post_op + ' ' + tr('days', 'يوم'),
        f.healing_status === 'Excellent' ? '🟢 ' + tr('Excellent', 'ممتاز') : f.healing_status === 'Good' ? '🟡 ' + tr('Good', 'جيد') : '🔴 ' + tr('Poor', 'ضعيف'),
        `<span style="color:${f.pain_level >= 7 ? '#ef4444' : f.pain_level >= 4 ? '#f59e0b' : '#22c55e'}">${f.pain_level}/10</span>`,
        f.swelling, '⭐'.repeat(Math.min(f.patient_satisfaction || 0, 5)), f.next_followup || '-'
        ]
      }))
    ) : `<div class="empty-state"><span style="font-size:48px">🩺</span><p>${tr('No follow-ups', 'لا توجد متابعات')}</p></div>`}</div>`;
  }
}

// Cosmetic Surgery Helper Functions
window.updateCosFields = function () {
  const sel = document.getElementById('cosProc');
  if (!sel) return;
  const opt = sel.options[sel.selectedIndex];
  document.getElementById('cosCost').value = opt.dataset.cost || '';
  document.getElementById('cosAnes').value = opt.dataset.anes || 'Local';
};
window.fillConsentRisks = function () {
  const sel = document.getElementById('conProc');
  if (!sel) return;
  const opt = sel.options[sel.selectedIndex];
  const risksEl = document.getElementById('conRisks');
  if (risksEl) risksEl.value = opt.dataset.risks || '';
};
window.saveCosCase = async function () {
  const patSel = document.getElementById('cosPatient');
  const procSel = document.getElementById('cosProc');
  await API.post('/api/cosmetic/cases', {
    patient_id: patSel.value, patient_name: patSel.options[patSel.selectedIndex].dataset.name,
    procedure_id: procSel.value, procedure_name: procSel.options[procSel.selectedIndex].dataset.name,
    surgery_date: document.getElementById('cosSurgDate').value, surgery_time: document.getElementById('cosSurgTime').value,
    anesthesia_type: document.getElementById('cosAnes').value, operating_room: document.getElementById('cosOR').value,
    total_cost: document.getElementById('cosCost').value, pre_op_notes: document.getElementById('cosPreNotes').value
  });
  showToast(tr('Case scheduled!', 'تمت الجدولة!')); cosTab = 'cases'; navigateTo(41);
};
window.completeCosCase = async function (id) {
  await API.put('/api/cosmetic/cases/' + id, { status: 'Completed' });
  showToast(tr('Case completed', 'تمت العملية')); navigateTo(41);
};
window.saveCosConsent = async function () {
  const patSel = document.getElementById('conPatient');
  const procSel = document.getElementById('conProc');
  await API.post('/api/cosmetic/consents', {
    patient_id: patSel.value, patient_name: patSel.options[patSel.selectedIndex].dataset.name,
    procedure_name: procSel.options[procSel.selectedIndex].dataset.name,
    consent_type: document.getElementById('conType').value,
    risks_explained: document.getElementById('conRisks').value,
    alternatives_explained: document.getElementById('conAlts').value,
    expected_results: document.getElementById('conResults').value,
    limitations: document.getElementById('conLimits').value,
    is_photography_consent: document.getElementById('conPhoto').checked,
    is_anesthesia_consent: document.getElementById('conAnesC').checked,
    is_blood_transfusion_consent: document.getElementById('conBlood').checked,
    witness_name: document.getElementById('conWitness').value
  });
  showToast(tr('Consent signed!', 'تم التوقيع!')); cosTab = 'consents'; navigateTo(41);
};
window.printCosConsent = async function (id) {
  const consents = await API.get('/api/cosmetic/consents');
  const c = consents.find(x => x.id === id);
  if (!c) return;
  const w = window.open('', '_blank', 'width=800,height=1000');
  w.document.write(`<!DOCTYPE html><html dir="rtl"><head><title>إقرار موافقة - Consent Form</title>
  <style>body{font-family:'Segoe UI',Tahoma,sans-serif;padding:30px;color:#333;direction:rtl}
  .header{text-align:center;border-bottom:3px double #333;padding:20px 0;margin-bottom:20px}
  .header h1{margin:0;font-size:22px;color:#1a365d} .header h2{margin:5px 0;font-size:16px;color:#666}
  .section{margin:20px 0;padding:15px;border:1px solid #ddd;border-radius:8px}
  .section h3{color:#1a365d;border-bottom:1px solid #eee;padding-bottom:8px;margin-top:0}
  .field{margin:10px 0;line-height:1.8} .field label{font-weight:700;color:#555}
  .sig-area{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:30px}
  .sig-box{text-align:center;border-top:2px solid #333;padding-top:10px}
  .checkbox{margin:8px 0;font-size:14px}
  @media print{body{padding:20px}}</style></head><body>
  <div class="header">
    <h1>نموذج إقرار وموافقة على إجراء تجميلي</h1>
    <h2>Cosmetic Procedure Consent Form</h2>
    <p style="margin:5px 0;color:#888">Nama Medical - نما الطبي</p>
  </div>
  <div class="section">
    <h3>📋 بيانات المريض / Patient Information</h3>
    <div class="field"><label>اسم المريض / Patient Name:</label> ${c.patient_name}</div>
    <div class="field"><label>الإجراء / Procedure:</label> ${c.procedure_name}</div>
    <div class="field"><label>الجراح / Surgeon:</label> ${c.surgeon}</div>
    <div class="field"><label>التاريخ / Date:</label> ${c.consent_date} &nbsp; <label>الوقت / Time:</label> ${c.consent_time}</div>
  </div>
  <div class="section">
    <h3>⚠️ المخاطر والمضاعفات المحتملة / Risks & Complications</h3>
    <p>${c.risks_explained || 'N/A'}</p>
  </div>
  <div class="section">
    <h3>🔄 البدائل المتاحة / Available Alternatives</h3>
    <p>${c.alternatives_explained || 'N/A'}</p>
  </div>
  <div class="section">
    <h3>✅ النتائج المتوقعة / Expected Results</h3>
    <p>${c.expected_results || 'N/A'}</p>
  </div>
  <div class="section">
    <h3>⛔ القيود والمحددات / Limitations</h3>
    <p>${c.limitations || 'N/A'}</p>
  </div>
  <div class="section">
    <h3>📋 موافقات إضافية / Additional Consents</h3>
    <div class="checkbox">${c.is_photography_consent ? '☑' : '☐'} الموافقة على التصوير / Photography Consent</div>
    <div class="checkbox">${c.is_anesthesia_consent ? '☑' : '☐'} الموافقة على التخدير / Anesthesia Consent</div>
    <div class="checkbox">${c.is_blood_transfusion_consent ? '☑' : '☐'} الموافقة على نقل الدم / Blood Transfusion Consent</div>
  </div>
  <div style="margin:25px 0;padding:15px;background:#f8f9fa;border-radius:8px;font-size:13px">
    <strong>إقرار / Declaration:</strong><br>
    أقر أنا الموقع أدناه بأنني قد فهمت طبيعة الإجراء التجميلي المذكور أعلاه، وتم شرح المخاطر والمضاعفات المحتملة والبدائل المتاحة لي. أوافق على إجراء العملية بكامل إرادتي.<br><br>
    <em>I, the undersigned, declare that I have fully understood the nature of the cosmetic procedure described above, and the risks, complications, and alternatives have been explained to me. I consent to the procedure of my own free will.</em>
  </div>
  <div class="sig-area">
    <div class="sig-box"><strong>توقيع المريض<br>Patient Signature</strong></div>
    <div class="sig-box"><strong>توقيع الجراح<br>Surgeon: ${c.surgeon}</strong></div>
    <div class="sig-box"><strong>توقيع الشاهد<br>Witness: ${c.witness_name || ''}</strong></div>
  </div>
  </body></html>`);
  setTimeout(() => { w.print(); }, 500);
};
