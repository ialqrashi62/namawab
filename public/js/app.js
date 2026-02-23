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
  const map = { Waiting: 'warning', 'With Doctor': 'success', Confirmed: 'success', Pending: 'warning', Approved: 'success', Rejected: 'danger', Active: 'success', 'On Leave': 'info', Cancelled: 'danger', Completed: 'success', Requested: 'info', Done: 'success' };
  return badge(status, map[status] || 'info');
}

// ===== PAGE LOADER =====
async function loadPage(page) {
  const el = document.getElementById('pageContent');
  el.style.animation = 'none'; el.offsetHeight; el.style.animation = '';
  const pages = [renderDashboard, renderReception, renderAppointments, renderDoctor, renderLab, renderRadiology, renderPharmacy, renderHR, renderFinance, renderInsurance, renderInventory, renderNursing, renderWaitingQueue, renderPatientAccounts, renderReports, renderMessaging, renderCatalog, renderSettings];
  if (pages[page]) await pages[page](el);
  else el.innerHTML = `<div class="page-title">${NAV_ITEMS[page]?.icon} ${tr(NAV_ITEMS[page]?.en, NAV_ITEMS[page]?.ar)}</div><div class="card"><p>${tr('Coming soon...', 'قريباً...')}</p></div>`;
}

// ===== DASHBOARD =====
async function renderDashboard(el) {
  const s = await API.get('/api/dashboard/stats');
  el.innerHTML = `
    <div class="page-title">📊 ${tr('System Dashboard', 'لوحة التحكم')}</div>
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:#60a5fa"><span class="stat-icon">👥</span><div class="stat-label">${tr('Patients', 'المرضى')}</div><div class="stat-value">${s.patients}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><span class="stat-icon">💵</span><div class="stat-label">${tr('Revenue', 'الإيرادات')}</div><div class="stat-value">${Number(s.revenue).toLocaleString()} SAR</div></div>
      <div class="stat-card" style="--stat-color:#f59e0b"><span class="stat-icon">⏳</span><div class="stat-label">${tr('Waiting', 'بانتظار')}</div><div class="stat-value">${s.waiting}</div></div>
      <div class="stat-card" style="--stat-color:#f87171"><span class="stat-icon">📄</span><div class="stat-label">${tr('Pending Claims', 'مطالبات معلقة')}</div><div class="stat-value">${s.pendingClaims}</div></div>
      <div class="stat-card" style="--stat-color:#a78bfa"><span class="stat-icon">📅</span><div class="stat-label">${tr("Today's Appts", 'مواعيد اليوم')}</div><div class="stat-value">${s.todayAppts}</div></div>
      <div class="stat-card" style="--stat-color:#38bdf8"><span class="stat-icon">👨‍💼</span><div class="stat-label">${tr('Employees', 'الموظفين')}</div><div class="stat-value">${s.employees}</div></div>
    </div>`;
}

// ===== RECEPTION =====
async function renderReception(el) {
  const patients = await API.get('/api/patients');
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
        <div class="flex gap-16 mb-12" style="flex-wrap:wrap">
          <div class="form-group" style="flex:2;min-width:120px"><label>${tr('DOB (Gregorian)', 'تاريخ الميلاد (ميلادي)')}</label><input class="form-input" type="date" id="rDob"></div>
          <div class="form-group" style="flex:2;min-width:120px"><label>${tr('DOB (Hijri)', 'تاريخ الميلاد (هجري)')}</label><input class="form-input" type="text" id="rDobHijri" placeholder="1400/01/01" pattern="[0-9]{4}/[0-9]{2}/[0-9]{2}"></div>
          <div class="form-group" style="flex:1;min-width:70px"><label>${tr('Age', 'العمر')}</label><input class="form-input form-input-readonly" id="rAge" readonly></div>
        </div>
        <div class="form-group mb-12"><label>${tr('Department', 'القسم')}</label><select class="form-input" id="rDept">${depts.map((d, i) => `<option value="${isArabic ? d : deptsEn[i]}">${isArabic ? d : deptsEn[i]}</option>`).join('')}</select></div>
        <div class="form-group mb-12"><label>${tr('Amount', 'المبلغ')}</label><input class="form-input" id="rAmount" value="0.00" type="number"></div>
        <div class="form-group mb-16"><label>${tr('Payment', 'طريقة السداد')}</label><select class="form-input" id="rPay"><option>${tr('Cash', 'كاش')}</option><option>${tr('POS/Card', 'شبكة')}</option><option>${tr('Transfer', 'حوالة بنكية')}</option></select></div>
        <button class="btn btn-primary w-full" id="rSaveBtn" style="height:44px;font-size:15px">💾 ${tr('Save & Generate File', 'حفظ وإنشاء ملف')}</button>
      </div>
      <div class="card">
        <div class="card-title">📋 ${tr('Patient Queue', 'قائمة المرضى')}</div>
        <input class="search-filter" id="rSearch" placeholder="${tr('Search by name, ID, phone, file#...', 'بحث بالاسم، الهوية، الجوال، رقم الملف...')}">
        <div id="rTable"></div>
      </div>
    </div>`;

  renderPatientTable(patients);

  // Arabic to English transliteration
  const arToEn = { 'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'h', 'ء': "'", 'أ': 'a', 'إ': 'e', 'ؤ': 'o', 'ئ': 'e', 'آ': 'aa', 'ى': 'a' };
  document.getElementById('rNameAr').addEventListener('input', (e) => {
    let result = '', wordStart = true;
    for (const ch of e.target.value) {
      if (ch === ' ') { result += ' '; wordStart = true; }
      else if (arToEn[ch]) { let m = arToEn[ch]; if (wordStart) { m = m.charAt(0).toUpperCase() + m.slice(1); wordStart = false; } result += m; }
      else { result += ch; wordStart = false; }
    }
    document.getElementById('rNameEn').value = result;
  });

  // Date conversion helpers
  const gToH = (g) => {
    try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(g).replace(/هـ/g, '').trim(); } catch (e) { return ''; }
  };
  const hToG = (hY, hM, hD) => {
    // Approximate conversion for input (1 Hijri year ≈ 354.36 days)
    // A more accurate method is to just rely on the API or a library, but here's a basic client-side approximation
    const hDays = (hY - 1) * 354.36 + (hM - 1) * 29.53 + hD;
    const gDate = new Date(19456200000 + hDays * 86400000); // Base epoch approx
    // Modern Intl check (doesn't parse back natively, so we approximate the year roughly to calculate age)
    const age = Math.abs(new Date(Date.now() - gDate.getTime()).getUTCFullYear() - 1970);
    return { gDate: gDate.toISOString().split('T')[0], age };
  };

  document.getElementById('rDob').addEventListener('change', (e) => {
    if (!e.target.value) { document.getElementById('rAge').value = ''; document.getElementById('rDobHijri').value = ''; return; }
    const dob = new Date(e.target.value);
    const diff = Date.now() - dob.getTime();
    document.getElementById('rAge').value = Math.abs(new Date(diff).getUTCFullYear() - 1970);
    document.getElementById('rDobHijri').value = gToH(dob);
  });

  // Initialize Flatpickr for Hijri date
  flatpickr('#rDobHijri', {
    locale: 'ar',
    dateFormat: "Y/m/d",
    allowInput: true,
    onChange: function (selectedDates, dateStr) {
      if (!dateStr || !dateStr.includes('/')) return;
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const res = hToG(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
        document.getElementById('rDob').value = res.gDate;
        document.getElementById('rAge').value = res.age;
      }
    }
  });

  document.getElementById('rDobHijri').addEventListener('blur', (e) => {
    const v = e.target.value;
    if (!v || !v.includes('/')) return;
    const parts = v.split('/');
    if (parts.length === 3) {
      const res = hToG(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
      document.getElementById('rDob').value = res.gDate;
      document.getElementById('rAge').value = res.age;
    }
  });

  document.getElementById('rSaveBtn').addEventListener('click', async () => {
    const nameAr = document.getElementById('rNameAr').value.trim();
    const nameEn = document.getElementById('rNameEn').value.trim();
    if (!nameAr && !nameEn) { showToast(tr('Enter patient name', 'ادخل اسم المريض'), 'error'); return; }
    try {
      await API.post('/api/patients', {
        name_ar: nameAr, name_en: nameEn,
        national_id: document.getElementById('rNatId').value,
        phone: document.getElementById('rPhone').value,
        dob: document.getElementById('rDob').value,
        dob_hijri: document.getElementById('rDobHijri').value,
        department: document.getElementById('rDept').value,
        amount: parseFloat(document.getElementById('rAmount').value) || 0,
        payment_method: document.getElementById('rPay').value
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
  const headers = [tr('File#', 'رقم الملف'), tr('Name', 'الاسم'), tr('ID', 'الهوية'), tr('Phone', 'الجوال'), tr('Dept', 'القسم'), tr('Status', 'الحالة'), tr('Delete', 'حذف')];
  const rows = patients.map(p => ({
    cells: [p.file_number, isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar), p.national_id, p.phone, p.department, statusBadge(p.status)],
    id: p.id
  }));
  document.getElementById('rTable').innerHTML = makeTable(headers, rows, (row) =>
    `<button class="btn btn-danger btn-sm" onclick="deletePatient(${row.id})">🗑 ${tr('Delete', 'حذف')}</button>`
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

// ===== APPOINTMENTS =====
async function renderAppointments(el) {
  const [appts, emps] = await Promise.all([API.get('/api/appointments'), API.get('/api/employees?role=Doctor')]);
  const patients = await API.get('/api/patients');
  el.innerHTML = `
    <div class="page-title">📅 ${tr('Appointments', 'المواعيد')}</div>
    <div class="split-layout">
      <div class="card">
        <div class="card-title">📝 ${tr('Book Appointment', 'حجز موعد')}</div>
        <div class="form-group mb-12"><label>${tr('Patient', 'المريض')}</label><select class="form-input" id="aPatient"><option value="">${tr('Select patient', 'اختر مريض')}</option>${patients.map(p => `<option value="${p.name_en}">${isArabic ? p.name_ar : p.name_en} (#${p.file_number})</option>`).join('')}</select></div>
        <div class="form-group mb-12"><label>${tr('Doctor', 'الطبيب')}</label><select class="form-input" id="aDoctor"><option value="">${tr('Select doctor', 'اختر طبيب')}</option>${emps.map(d => `<option>${d.name}</option>`).join('')}</select></div>
        <div class="form-group mb-12"><label>${tr('Date', 'التاريخ')}</label><input class="form-input" type="date" id="aDate" value="${new Date().toISOString().split('T')[0]}"></div>
        <div class="form-group mb-12"><label>${tr('Time', 'الوقت')}</label><input class="form-input" type="time" id="aTime" value="${new Date().toTimeString().slice(0, 5)}"></div>
        <div class="form-group mb-16"><label>${tr('Notes', 'ملاحظات')}</label><input class="form-input" id="aNotes"></div>
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
  const p = document.getElementById('aPatient').value;
  if (!p) { showToast(tr('Select patient', 'اختر مريض'), 'error'); return; }
  try {
    await API.post('/api/appointments', { patient_name: p, doctor_name: document.getElementById('aDoctor').value, department: '', appt_date: document.getElementById('aDate').value, appt_time: document.getElementById('aTime').value, notes: document.getElementById('aNotes').value });
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
          <div class="form-group mb-12"><label>${tr('Diagnosis', 'التشخيص')}</label><input class="form-input" id="drDiag"></div>
          <div class="form-group mb-12"><label>${tr('Symptoms', 'الأعراض')}</label><input class="form-input" id="drSymp"></div>
          <div class="form-group mb-12"><label>${tr('ICD-10', 'رمز التشخيص')}</label><input class="form-input" id="drIcd"></div>
          <div class="form-group mb-16"><label>${tr('Notes', 'ملاحظات')}</label><textarea class="form-input form-textarea" id="drNotes"></textarea></div>
          <button class="btn btn-primary w-full" onclick="saveMedRecord()" style="height:44px">💾 ${tr('Save Record', 'حفظ السجل')}</button>
        </div>
        <div class="card mb-16">
          <div class="card-title">🏥 ${tr('Procedures / Services Performed', 'الإجراءات / الخدمات المنفذة')} ${drSpecialty ? `<span class="badge badge-info" style="font-size:11px;margin-right:8px">${drSpecialty}</span>` : ''}</div>
          <div class="form-group mb-12"><label>${tr('Search Procedures', 'ابحث عن إجراء')}</label>
            <input class="form-input" id="drSvcSearch" placeholder="${tr('Type to search...', 'اكتب للبحث...')}" autocomplete="off" oninput="filterDrServices()">
            <div id="drSvcDropdown" style="max-height:200px;overflow-y:auto;border:1px solid var(--border);border-radius:8px;display:none;margin-top:4px;background:var(--card)"></div>
          </div>
          <div id="drSvcTags" class="flex gap-8" style="flex-wrap:wrap;margin-bottom:12px"></div>
          <div style="font-size:12px;color:var(--text-dim);margin-bottom:8px">${tr('Available categories', 'التصنيفات المتاحة')}: <strong>${Object.keys(svcCategories).join(', ') || tr('All', 'الكل')}</strong></div>
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
              </optgroup>
              <optgroup label="${tr('Immunology & Serology', 'المناعة والأمصال')}">
                <option>CRP (C-Reactive Protein - Qualitative/Quantitative)</option>
                <option>Rheumatoid Factor (RF)</option>
                <option>ANA (Anti-Nuclear Antibody) / Anti-dsDNA</option>
                <option>ASO Titer</option>
                <option>Hepatitis Profile (HBsAg, HBsAb, HCV Ab, HAV IgM/IgG)</option>
                <option>HIV 1 & 2 Abs/Ag</option>
                <option>VDRL / RPR (Syphilis)</option>
                <option>Widal Test (Typhoid)</option>
                <option>Brucella (Abortus/Melitensis)</option>
                <option>Toxoplasmosis (IgG/IgM)</option>
                <option>Rubella (IgG/IgM)</option>
                <option>Cytomegalovirus CMV (IgG/IgM)</option>
                <option>Herpes Simplex Virus HSV 1/2 (IgG/IgM)</option>
                <option>EBV (Epstein-Barr Virus)</option>
                <option>Celiac Disease Panel (Anti-tTG, Anti-Endomysial)</option>
                <option>Food Allergy Panel (IgE)</option>
                <option>Inhalant Allergy Panel (IgE)</option>
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
          <div class="flex gap-8 mb-12">
            <div class="form-group" style="flex:1"><label>${tr('Dosage', 'الجرعة')}</label><input class="form-input" id="drRxDose" placeholder="${tr('e.g. 500mg', 'مثلاً 500مج')}"></div>
            <div class="form-group" style="flex:1"><label>${tr('Frequency', 'التكرار')}</label>
              <select class="form-input" id="drRxFreq"><option>×1 ${tr('daily', 'يومياً')}</option><option>×2 ${tr('daily', 'يومياً')}</option><option>×3 ${tr('daily', 'يومياً')}</option><option>${tr('As needed', 'عند الحاجة')}</option></select>
            </div>
            <div class="form-group" style="flex:1"><label>${tr('Duration', 'المدة')}</label><input class="form-input" id="drRxDur" placeholder="${tr('e.g. 7 days', 'مثلاً 7 أيام')}"></div>
          </div>
          <button class="btn btn-primary w-full" onclick="sendRx()">💊 ${tr('Issue Prescription → Pharmacy', 'إصدار وصفة → الصيدلية')}</button>
        </div>
      </div>
      <div class="card">
        <div class="card-title">📋 ${tr('Medical Records', 'السجلات الطبية')}</div>
        <input class="search-filter" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'drTable')">
        <div id="drTable">${makeTable([tr('Patient', 'المريض'), tr('Diagnosis', 'التشخيص'), tr('Symptoms', 'الأعراض'), tr('Date', 'التاريخ')], records.map(r => ({ cells: [r.patient_name || '', r.diagnosis, r.symptoms, r.visit_date?.split('T')[0] || ''] })))}</div>
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
    document.getElementById('drPatientInfo').innerHTML = `<div class="flex gap-8 mt-16" style="flex-wrap:wrap"><span class="badge badge-info">📁 ${p.file_number}</span><span class="badge badge-warning">🎂 ${tr('Age', 'العمر')}: ${p.age || '?'}</span><span class="badge badge-success">📞 ${p.phone}</span><span class="badge badge-purple">🆔 ${p.national_id}</span><button class="btn btn-sm btn-primary" onclick="viewPatientResults(${p.id})" style="margin-right:auto">📋 ${tr('View Lab & Radiology Results', 'استعراض نتائج الفحوصات والأشعة')}</button></div><div id="drResultsPanel"></div>`;
  } catch (e) { }
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
                  <div class="flex gap-8" style="flex-wrap:wrap;align-items:center"><strong>${o.order_type}</strong> ${statusBadge(o.status)} <span style="color:var(--text-dim);font-size:12px">${o.created_at?.split('T')[0] || ''}</span></div>
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
                  <div class="flex gap-8" style="flex-wrap:wrap;align-items:center"><strong>${o.order_type}</strong> ${statusBadge(o.status)} <span style="color:var(--text-dim);font-size:12px">${o.created_at?.split('T')[0] || ''}</span></div>
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
    showToast(tr('Sent to Lab!', 'تم التحويل للمختبر!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.sendToRad = async () => {
  const pid = document.getElementById('drPatient').value;
  if (!pid) { showToast(tr('Select patient first', 'اختر المريض أولاً'), 'error'); return; }
  try {
    await API.post('/api/radiology/orders', { patient_id: pid, order_type: document.getElementById('drRadType').value, description: document.getElementById('drRadDesc').value });
    showToast(tr('Sent to Radiology!', 'تم التحويل للأشعة!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.sendRx = async () => {
  const pid = document.getElementById('drPatient').value;
  if (!pid) { showToast(tr('Select patient first', 'اختر المريض أولاً'), 'error'); return; }
  try {
    await API.post('/api/prescriptions', { patient_id: pid, medication_name: document.getElementById('drRxDrug').value, dosage: document.getElementById('drRxDose').value, frequency: document.getElementById('drRxFreq').value, duration: document.getElementById('drRxDur').value });
    showToast(tr('Prescription sent to Pharmacy!', 'تم إرسال الوصفة للصيدلية!'));
  } catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};

// ===== PROCEDURES AUTOCOMPLETE =====
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

// ===== LAB =====
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
            </optgroup>
            <optgroup label="${tr('Immunology & Serology', 'المناعة والأمصال')}">
              <option>CRP (C-Reactive Protein - Qualitative/Quantitative)</option>
              <option>Rheumatoid Factor (RF)</option>
              <option>ANA (Anti-Nuclear Antibody) / Anti-dsDNA</option>
              <option>ASO Titer</option>
              <option>Hepatitis Profile (HBsAg, HBsAb, HCV Ab, HAV IgM/IgG)</option>
              <option>HIV 1 & 2 Abs/Ag</option>
              <option>VDRL / RPR (Syphilis)</option>
              <option>Widal Test (Typhoid)</option>
              <option>Brucella (Abortus/Melitensis)</option>
              <option>Toxoplasmosis (IgG/IgM)</option>
              <option>Rubella (IgG/IgM)</option>
              <option>Cytomegalovirus CMV (IgG/IgM)</option>
              <option>Herpes Simplex Virus HSV 1/2 (IgG/IgM)</option>
              <option>EBV (Epstein-Barr Virus)</option>
              <option>Celiac Disease Panel (Anti-tTG, Anti-Endomysial)</option>
              <option>Food Allergy Panel (IgE)</option>
              <option>Inhalant Allergy Panel (IgE)</option>
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
            <optgroup label="${tr('Other', 'أخرى')}">
              <option>${tr('Other Specific Test (Specify in details)', 'فحص آخر (حدد في التفاصيل)')}</option>
            </optgroup>
          </select>
        </div>
        <div class="form-group mb-12"><label>${tr('Details', 'التفاصيل')}</label><input class="form-input" id="labDirectDesc"></div>
        <button class="btn btn-success w-full" onclick="sendDirectLab()">🔬 ${tr('Send to Lab', 'إنشاء الطلب')}</button>
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
            <th>${tr('Barcode', 'الباركود')}</th><th>${tr('Patient', 'المريض')}</th><th>${tr('Type', 'النوع')}</th><th>${tr('Status', 'الحالة')}</th><th>${tr('Date', 'التاريخ')}</th><th>${tr('Report & Results', 'التقرير والنتائج')}</th><th>${tr('Actions', 'إجراءات')}</th>
          </tr></thead><tbody>
          ${orders.length === 0 ? `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--text-dim)">📭 ${tr('No orders', 'لا توجد طلبات')}</td></tr>` : orders.map(o => `<tr>
            <td><svg id="labBC${o.id}" class="barcode-svg"></svg><br><button class="btn btn-sm btn-info" onclick="printLabBarcode(${o.id}, '${(o.patient_name || '').replace(/'/g, '\\&#39;')}', '${(o.order_type || '').replace(/'/g, '\\&#39;')}')" style="margin-top:4px;font-size:11px">🖨️ ${tr('Print', 'طباعة')}</button></td>
            <td>${o.patient_name || ''}</td><td>${o.order_type}</td>
            <td>${statusBadge(o.status)}</td><td>${o.created_at?.split('T')[0] || ''}</td>
            <td>${o.status === 'Done' && o.results ? `<div style="max-width:200px;padding:6px 10px;background:var(--hover);border-radius:6px;font-size:12px;white-space:pre-wrap">${o.results}</div>` : o.status !== 'Requested' ? `<textarea class="form-input form-textarea" id="labRpt${o.id}" rows="2" placeholder="${tr('Write report...', 'اكتب التقرير...')}" style="min-height:60px;font-size:12px">${o.results || ''}</textarea><button class="btn btn-sm btn-primary mt-8" onclick="saveLabReport(${o.id})">💾 ${tr('Save', 'حفظ')}</button>` : `<span style="color:var(--text-dim)">—</span>`}</td>
            <td>${o.status !== 'Done' ? `<button class="btn btn-sm btn-success" onclick="updateLabStatus(${o.id},'${o.status === 'Requested' ? 'In Progress' : 'Done'}')">▶ ${o.status === 'Requested' ? tr('Start', 'بدء') : tr('Complete', 'إتمام')}</button>` : `<span class="badge badge-success">✅</span>`}</td>
          </tr>`).join('')}
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
  try { await API.put(`/api/lab/orders/${id}`, { result: rpt }); showToast(tr('Report saved!', 'تم حفظ التقرير!')); await navigateTo(4); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
};
window.scanLabBarcode = async () => {
  const code = document.getElementById('labBarcodeInput').value.trim(); if (!code) return;
  const m = code.match(/LAB-(\d+)/); const oid = m ? m[1] : code;
  try {
    const orders = await API.get('/api/lab/orders'); const o = orders.find(x => x.id == oid);
    document.getElementById('labScanResult').innerHTML = o ? `<div class="card" style="border:2px solid var(--accent);margin-top:12px"><div class="card-title">🔍 ${tr('Order Found', 'تم العثور على الطلب')} #${o.id}</div><div class="flex gap-8" style="flex-wrap:wrap"><span class="badge badge-info">👤 ${o.patient_name}</span><span class="badge badge-purple">🔬 ${o.order_type}</span>${statusBadge(o.status)}</div>${o.results ? `<div class="mt-16" style="padding:12px;background:var(--hover);border-radius:8px"><strong>${tr('Report:', 'التقرير:')}</strong><br><pre style="white-space:pre-wrap;margin:4px 0 0">${o.results}</pre></div>` : ''}</div>` : `<div class="badge badge-danger mt-16">${tr('Order not found', 'الطلب غير موجود')}</div>`;
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
  el.innerHTML = `<div class="page-title">💊 ${tr('Pharmacy', 'الصيدلية')}</div>
    <div class="stats-grid">
      <div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-label">${tr('Pending Prescriptions', 'وصفات بالانتظار')}</div><div class="stat-value">${queue.filter(q => q.status === 'Pending').length}</div></div>
      <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Dispensed Today', 'تم صرفها')}</div><div class="stat-value">${queue.filter(q => q.status === 'Dispensed').length}</div></div>
      <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('Total Drugs', 'إجمالي الأدوية')}</div><div class="stat-value">${drugs.length}</div></div>
    </div>
    <div class="card mb-16"><div class="card-title">📜 ${tr('Prescription Queue', 'قائمة الوصفات')}</div>
    <div id="rxQueue">${makeTable(
    [tr('Patient', 'المريض'), tr('Prescription', 'الوصفة'), tr('Status', 'الحالة'), tr('Date', 'التاريخ'), tr('Actions', 'إجراءات')],
    queue.map(q => ({ cells: [q.patient_name || `#${q.patient_id}`, q.prescription_text || '', statusBadge(q.status), q.created_at?.split('T')[0] || ''], id: q.id, status: q.status })),
    (row) => row.status === 'Pending' ? `<button class="btn btn-sm btn-success" onclick="dispenseRx(${row.id})">💊 ${tr('Dispense', 'صرف')}</button>` : `<span class="badge badge-success">✅ ${tr('Dispensed', 'تم الصرف')}</span>`
  )}</div></div>
    <div class="card mb-16"><div class="card-title">💊 ${tr('Drug Catalog', 'قائمة الأدوية')}</div>
    <div class="flex gap-8 mb-12"><input class="form-input" id="phName" placeholder="${tr('Drug name', 'اسم الدواء')}" style="flex:2"><input class="form-input" id="phPrice" placeholder="${tr('Price', 'السعر')}" type="number" style="flex:1"><input class="form-input" id="phStock" placeholder="${tr('Stock', 'المخزون')}" type="number" style="flex:1"><button class="btn btn-primary" onclick="addDrug()">➕</button></div>
    <input class="search-filter" placeholder="${tr('Search drugs...', 'بحث في الأدوية...')}" oninput="filterTable(this,'phTable')">
    <div id="phTable">${makeTable([tr('Name', 'الاسم'), tr('Category', 'التصنيف'), tr('Price', 'السعر'), tr('Stock', 'المخزون')], drugs.map(d => ({ cells: [d.drug_name, d.category, d.selling_price, d.stock_qty] })))}</div></div>`;
}
window.dispenseRx = async (id) => {
  try { await API.put(`/api/pharmacy/queue/${id}`, { status: 'Dispensed' }); showToast(tr('Dispensed!', 'تم الصرف!')); await navigateTo(6); }
  catch (e) { showToast(tr('Error', 'خطأ'), 'error'); }
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
    <div id="hrTable">${makeTable([tr('Name', 'الاسم'), tr('Role', 'الوظيفة'), tr('Department', 'القسم'), tr('Salary', 'الراتب'), tr('Status', 'الحالة'), tr('Delete', 'حذف')], emps.map(e => ({ cells: [isArabic ? e.name_ar : e.name_en, e.role, isArabic ? e.department_ar : e.department_en, e.salary?.toLocaleString(), statusBadge(e.status)], id: e.id })), r => `<button class="btn btn-danger btn-sm" onclick="delEmp(${r.id})">🗑</button>`)}</div></div>`;
}
window.addEmp = async () => {
  const nameEn = document.getElementById('hrNameEn').value.trim();
  const nameAr = document.getElementById('hrNameAr').value.trim();
  const deptSel = document.getElementById('hrDept');
  const opt = deptSel.options[deptSel.selectedIndex];

  if (!nameEn && !nameAr) { showToast(tr('Enter employee name', 'ادخل اسم الموظف'), 'error'); return; }
  try {
    await API.post('/api/employees', {
      name_ar: nameAr,
      name_en: nameEn,
      role: document.getElementById('hrRole').value,
      department_en: deptSel.value,
      department_ar: opt ? (opt.getAttribute('data-ar') || '') : '',
      salary: document.getElementById('hrSalary').value
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
  )}</div></div>`;
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
async function renderNursing(el) {
  const patients = await API.get('/api/patients');
  const vitals = await API.get('/api/nursing/vitals').catch(() => []);
  el.innerHTML = `
    <div class="page-title">👩‍⚕️ ${tr('Nursing Station', 'محطة التمريض')}</div>
    <div class="split-layout">
      <div class="card">
        <div class="card-title">🌡️ ${tr('Record Patient Vitals', 'تسجيل العلامات الحيوية')}</div>
        <div class="form-group mb-12"><label>${tr('Patient', 'المريض')}</label><select class="form-input" id="nsPatient"><option value="">${tr('-- Select --', '-- اختر مريض --')}</option>${patients.map(p => `<option value="${p.id}" data-name="${p.name_en}">${p.file_number} - ${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)}</option>`).join('')}</select></div>
        <div class="flex gap-8 mb-12">
          <div class="form-group" style="flex:1"><label>${tr('Blood Pressure', 'ضغط الدم')}</label><input class="form-input" id="nsBp" placeholder="120/80"></div>
          <div class="form-group" style="flex:1"><label>${tr('Temp (°C)', 'الحرارة')}</label><input class="form-input" id="nsTemp" type="number" step="0.1" placeholder="37.0"></div>
        </div>
        <div class="flex gap-8 mb-12">
          <div class="form-group" style="flex:1"><label>${tr('Weight (kg)', 'الوزن')}</label><input class="form-input" id="nsWeight" type="number" step="0.1" placeholder="70.5"></div>
          <div class="form-group" style="flex:1"><label>${tr('Pulse (bpm)', 'النبض')}</label><input class="form-input" id="nsPulse" type="number" placeholder="75"></div>
          <div class="form-group" style="flex:1"><label>${tr('O2 Sat (%)', 'الأكسجين')}</label><input class="form-input" id="nsO2" type="number" placeholder="98"></div>
        </div>
        <div class="form-group mb-16"><label>${tr('Notes / Triage', 'ملاحظات / فرز')}</label><textarea class="form-input form-textarea" id="nsNotes"></textarea></div>
        <button class="btn btn-primary w-full" id="nsSaveSaveBtn" style="height:44px" onclick="saveVitals()">💾 ${tr('Save Vitals & Send to Doctor', 'حفظ وإرسال للطبيب')}</button>
      </div>
      <div class="card">
        <div class="card-title">📋 ${tr('Recent Vitals Registry', 'سجل العلامات الحيوية')}</div>
        <input class="search-filter" placeholder="${tr('Search...', 'بحث...')}" oninput="filterTable(this,'nsTable')">
        <div id="nsTable">${makeTable(
    [tr('Patient', 'المريض'), tr('BP', 'الضغط'), tr('Temp', 'الحرارة'), tr('Pulse', 'النبض'), tr('O2', 'الأكسجين'), tr('Date', 'التاريخ')],
    vitals.map(v => ({ cells: [v.patient_name || v.patient_id, v.bp, v.temp + ' °C', v.pulse, v.o2_sat + '%', v.created_at?.split('T')[0] || ''] }))
  )}</div>
      </div>
    </div>`;
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
      pulse: parseInt(document.getElementById('nsPulse').value) || 0,
      o2_sat: parseInt(document.getElementById('nsO2').value) || 0,
      notes: document.getElementById('nsNotes').value
    });
    showToast(tr('Vitals recorded and patient routed to doctor!', 'تم تسجيل العلامات الحيوية وتحويل المريض!'));
    await navigateTo(11);
  } catch (e) { showToast(tr('Error saving', 'خطأ في الحفظ'), 'error'); }
};

async function renderWaitingQueue(el) {
  const patients = await API.get('/api/patients');
  const waiting = patients.filter(p => p.status === 'Waiting');
  const withDoctor = patients.filter(p => p.status === 'With Doctor');
  el.innerHTML = `<div class="page-title">🪑 ${tr('Waiting Queue', 'قائمة الانتظار')}</div><div class="stats-grid"><div class="stat-card" style="--stat-color:#f59e0b"><div class="stat-label">${tr('Waiting', 'بالانتظار')}</div><div class="stat-value">${waiting.length}</div></div><div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('With Doctor', 'مع الطبيب')}</div><div class="stat-value">${withDoctor.length}</div></div></div>
    <div class="card"><div class="card-title">⏳ ${tr('Waiting Patients', 'المرضى المنتظرين')}</div><div id="wqTable">${makeTable([tr('File#', 'رقم الملف'), tr('Name', 'الاسم'), tr('Department', 'القسم'), tr('Status', 'الحالة')], waiting.map(p => ({ cells: [p.file_number, isArabic ? p.name_ar : p.name_en, p.department, statusBadge(p.status)] })))}</div></div>
    <div class="card"><div class="card-title">👨‍⚕️ ${tr('With Doctor', 'مع الطبيب')}</div><div>${makeTable([tr('File#', 'رقم الملف'), tr('Name', 'الاسم'), tr('Department', 'القسم'), tr('Status', 'الحالة')], withDoctor.map(p => ({ cells: [p.file_number, isArabic ? p.name_ar : p.name_en, p.department, statusBadge(p.status)] })))}</div></div>`;
}

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
    const data = await API.get(`/api/patients/${pid}/account`);
    const p = data.patient;
    document.getElementById('paResult').innerHTML = `
        <div class="card mb-16">
          <div class="card-title">👤 ${isArabic ? (p.name_ar || p.name_en) : (p.name_en || p.name_ar)} - #${p.file_number}</div>
          <div class="stats-grid">
            <div class="stat-card" style="--stat-color:#3b82f6"><div class="stat-label">${tr('Total Billed', 'إجمالي الفواتير')}</div><div class="stat-value">${data.totalBilled.toLocaleString()} SAR</div></div>
            <div class="stat-card" style="--stat-color:#4ade80"><div class="stat-label">${tr('Total Paid', 'المدفوع')}</div><div class="stat-value">${data.totalPaid.toLocaleString()} SAR</div></div>
            <div class="stat-card" style="--stat-color:${data.balance > 0 ? '#f87171' : '#4ade80'}"><div class="stat-label">${tr('Balance', 'الرصيد')}</div><div class="stat-value">${data.balance.toLocaleString()} SAR</div></div>
          </div>
        </div>
        <div class="card mb-16"><div class="card-title">🧾 ${tr('Invoices', 'الفواتير')} (${data.invoices.length})</div>
        ${makeTable([tr('Description', 'الوصف'), tr('Amount', 'المبلغ'), tr('Status', 'الحالة'), tr('Date', 'التاريخ')], data.invoices.map(i => ({ cells: [i.description || i.service_type, `${i.total} SAR`, i.paid ? badge(tr('Paid', 'مدفوع'), 'success') : badge(tr('Unpaid', 'غير مدفوع'), 'danger'), i.created_at?.split('T')[0] || ''] })))}</div>
        <div class="card mb-16"><div class="card-title">🩺 ${tr('Medical Records', 'السجلات الطبية')} (${data.records.length})</div>
        ${makeTable([tr('Diagnosis', 'التشخيص'), tr('Symptoms', 'الأعراض'), tr('Date', 'التاريخ')], data.records.map(r => ({ cells: [r.diagnosis, r.symptoms, r.visit_date?.split('T')[0] || ''] })))}</div>
        <div class="card mb-16"><div class="card-title">🔬 ${tr('Lab Orders', 'فحوصات المختبر')} (${data.labOrders.length})</div>
        ${makeTable([tr('Type', 'النوع'), tr('Status', 'الحالة'), tr('Date', 'التاريخ')], data.labOrders.map(o => ({ cells: [o.order_type, statusBadge(o.status), o.created_at?.split('T')[0] || ''] })))}</div>
        <div class="card mb-16"><div class="card-title">📡 ${tr('Radiology', 'الأشعة')} (${data.radOrders.length})</div>
        ${makeTable([tr('Type', 'النوع'), tr('Status', 'الحالة'), tr('Date', 'التاريخ')], data.radOrders.map(o => ({ cells: [o.order_type, statusBadge(o.status), o.created_at?.split('T')[0] || ''] })))}</div>
        <div class="card"><div class="card-title">💊 ${tr('Prescriptions', 'الوصفات')} (${data.prescriptions.length})</div>
        ${makeTable([tr('Medication', 'الدواء'), tr('Status', 'الحالة'), tr('Date', 'التاريخ')], data.prescriptions.map(rx => ({ cells: [rx.dosage || '', statusBadge(rx.status), rx.created_at?.split('T')[0] || ''] })))}</div>`;
  } catch (e) { showToast(tr('Error loading account', 'خطأ في تحميل الحساب'), 'error'); }
};

async function renderReports(el) {
  const [fin, pat, lab, invoices, emps] = await Promise.all([
    API.get('/api/reports/financial').catch(() => ({ totalRevenue: 0, totalPending: 0, invoiceCount: 0, monthlyRevenue: 0 })),
    API.get('/api/reports/patients').catch(() => ({ totalPatients: 0, todayPatients: 0, deptStats: [], statusStats: [] })),
    API.get('/api/reports/lab').catch(() => ({ totalOrders: 0, pendingOrders: 0, completedOrders: 0 })),
    API.get('/api/invoices').catch(() => []),
    API.get('/api/employees').catch(() => [])
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
    </div>`;
}

async function renderMessaging(el) {
  const msgs = await API.get('/api/messages');
  el.innerHTML = `<div class="page-title">✉️ ${tr('Messaging', 'الرسائل')}</div><div class="card"><div class="card-title">📬 ${tr('Inbox', 'الوارد')}</div><div id="msgTable">${makeTable([tr('From', 'من'), tr('Subject', 'الموضوع'), tr('Date', 'التاريخ'), tr('Read', 'مقروء')], msgs.map(m => ({ cells: [m.sender_name || '', m.subject, m.created_at?.split('T')[0] || '', m.is_read ? '✅' : '🔵'] })))}</div></div>`;
}

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
        <div id="suTable">${makeTable([tr('Username', 'المستخدم'), tr('Name', 'الاسم'), tr('Role', 'الدور'), tr('Speciality', 'التخصص'), tr('Active', 'نشط'), tr('Actions', 'إجراءات')], users.map(u => ({ cells: [u.username, u.display_name, badge(u.role, 'info'), u.role === 'Doctor' ? u.speciality || '-' : '-', u.is_active ? '✅' : '❌', `<div class="flex gap-4"><button class="btn btn-sm btn-info" onclick="editUser(${u.id})">✏️</button><button class="btn btn-sm btn-danger" onclick="deleteUser(${u.id})">🗑️</button></div>`] })))}</div>
      </div>
    </div>`;
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
    const spec = document.getElementById('suRole').value === 'Doctor' ? document.getElementById('suSpec').value : '';
    const perms = Array.from(document.querySelectorAll('#suPerms input:checked')).map(cb => cb.value).join(',');

    if (editingUserId) {
      await API.put(`/api/settings/users/${editingUserId}`, { username, password: password || undefined, display_name: document.getElementById('suName').value, role: document.getElementById('suRole').value, speciality: spec, permissions: perms, is_active: 1 });
      showToast(tr('User updated!', 'تم تحديث المستخدم!'));
    } else {
      await API.post('/api/settings/users', { username, password, display_name: document.getElementById('suName').value, role: document.getElementById('suRole').value, speciality: spec, permissions: perms });
      showToast(tr('User added!', 'تم إنشاء المستخدم!'));
    }

    editingUserId = null;
    await navigateTo(17);
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
  } else {
    document.getElementById('suSpecDiv').style.display = 'none';
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
  document.querySelectorAll('#suPerms input').forEach(cb => cb.checked = true); // Check all by default
  document.getElementById('suCancelBtn').style.display = 'none';
  document.getElementById('suAddBtn').innerHTML = `➕ ${tr('Save User', 'حفظ المستخدم')}`;
};

window.deleteUser = async (id) => {
  if (!confirm(tr('Are you sure you want to delete this user? This cannot be undone.', 'هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.'))) return;
  try {
    await API.delete(`/api/settings/users/${id}`);
    showToast(tr('User deleted!', 'تم الحذف بنجاح!'));
    await navigateTo(17);
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
