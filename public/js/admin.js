// ===== Nama Medical ERP - Admin Panel =====
let currentUser = null;
let allUsers = [];
let selectedFacilityType = 'hospital';

const NAV_ITEMS = [
  { idx:0, icon:'📊', en:'Dashboard', ar:'لوحة التحكم' },
  { idx:1, icon:'🏥', en:'Reception', ar:'الاستقبال' },
  { idx:2, icon:'📅', en:'Appointments', ar:'المواعيد' },
  { idx:3, icon:'👨‍⚕️', en:'Doctor Station', ar:'محطة الطبيب' },
  { idx:4, icon:'🔬', en:'Laboratory', ar:'المختبر' },
  { idx:5, icon:'📡', en:'Radiology', ar:'الأشعة' },
  { idx:6, icon:'💊', en:'Pharmacy', ar:'الصيدلية' },
  { idx:7, icon:'🏢', en:'HR', ar:'الموارد البشرية' },
  { idx:8, icon:'💰', en:'Finance', ar:'المالية' },
  { idx:9, icon:'🛡️', en:'Insurance', ar:'التأمين' },
  { idx:10, icon:'📦', en:'Inventory', ar:'المخازن' },
  { idx:11, icon:'👩‍⚕️', en:'Nursing', ar:'التمريض' },
  { idx:12, icon:'🪑', en:'Waiting Queue', ar:'قائمة الانتظار' },
  { idx:13, icon:'💳', en:'Patient Accounts', ar:'حسابات المرضى' },
  { idx:14, icon:'📋', en:'Reports', ar:'التقارير' },
  { idx:15, icon:'✉️', en:'Messaging', ar:'الرسائل' },
  { idx:16, icon:'📂', en:'Catalog', ar:'الأصناف' },
  { idx:17, icon:'📤', en:'Dept Requests', ar:'طلبات الأقسام' },
  { idx:18, icon:'🏥', en:'Surgery', ar:'العمليات' },
  { idx:19, icon:'🩸', en:'Blood Bank', ar:'بنك الدم' },
  { idx:20, icon:'📜', en:'Consent Forms', ar:'الإقرارات' },
  { idx:21, icon:'🚨', en:'Emergency', ar:'الطوارئ' },
  { idx:22, icon:'🛏️', en:'Inpatient ADT', ar:'التنويم' },
  { idx:23, icon:'🫀', en:'ICU', ar:'العناية المركزة' },
  { idx:24, icon:'🧹', en:'CSSD', ar:'التعقيم المركزي' },
  { idx:25, icon:'🍽️', en:'Dietary', ar:'التغذية' },
  { idx:26, icon:'🦠', en:'Infection Control', ar:'مكافحة العدوى' },
  { idx:27, icon:'📊', en:'Quality', ar:'الجودة' },
  { idx:28, icon:'🔧', en:'Maintenance', ar:'الصيانة' },
  { idx:29, icon:'🚑', en:'Transport', ar:'نقل المرضى' },
  { idx:30, icon:'📁', en:'Medical Records', ar:'السجلات الطبية' },
  { idx:31, icon:'💊', en:'Clinical Pharmacy', ar:'الصيدلية السريرية' },
  { idx:32, icon:'🏋️', en:'Rehabilitation', ar:'إعادة التأهيل' },
  { idx:33, icon:'📱', en:'Patient Portal', ar:'بوابة المرضى' },
  { idx:34, icon:'🧾', en:'ZATCA E-Invoice', ar:'فوترة إلكترونية' },
  { idx:35, icon:'📹', en:'Telemedicine', ar:'الطب عن بعد' },
  { idx:36, icon:'🔬', en:'Pathology', ar:'علم الأمراض' },
  { idx:37, icon:'🤝', en:'Social Work', ar:'الخدمة الاجتماعية' },
  { idx:38, icon:'🏛️', en:'Mortuary', ar:'خدمة الوفيات' },
  { idx:39, icon:'🎓', en:'CME', ar:'التعليم الطبي' },
  { idx:40, icon:'💎', en:'Cosmetic Surgery', ar:'جراحة التجميل' },
  { idx:41, icon:'🤰', en:'OB/GYN', ar:'النساء والتوليد' },
  { idx:42, icon:'⚙️', en:'Settings', ar:'الإعدادات' }
];

// Facility type department mappings
const FACILITY_DEPTS = {
  hospital: NAV_ITEMS.map(n => n.idx), // All departments
  health_center: [0,1,2,3,4,5,6,7,8,9,11,12,13,14,15,20,21,30,33,34,35,41,42],
  clinic: [0,1,2,3,4,6,7,8,9,11,12,13,14,15,20,30,34,42]
};

const FACILITY_INFO = {
  hospital: { icon:'🏥', title:'مستشفى', titleEn:'Hospital', subtitle:'جميع الأقسام الطبية والإدارية', count: FACILITY_DEPTS.hospital.length },
  health_center: { icon:'🏪', title:'مركز صحي', titleEn:'Health Center', subtitle:'أقسام الرعاية الأولية والعيادات', count: FACILITY_DEPTS.health_center.length },
  clinic: { icon:'🏬', title:'مستوصف', titleEn:'Clinic / Dispensary', subtitle:'أقسام العيادات الأساسية', count: FACILITY_DEPTS.clinic.length }
};

const ROLES = ['Admin','Doctor','Nurse','Pharmacist','Lab Technician','Radiologist','Reception','Finance','HR','IT','Staff'];

// ===== INIT =====
(async function init() {
  try {
    const data = await API.get('/api/auth/me');
    currentUser = data.user;
    if (currentUser.role !== 'Admin') {
      document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:#ef4444;font-size:24px;font-family:Tajawal">⛔ الوصول مقيد — فقط المدير يمكنه الدخول</div>';
      return;
    }
  } catch {
    window.location.href = '/login.html';
    return;
  }
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('userAvatar').textContent = currentUser.name.charAt(0);
  await loadUsers();
  await loadFacilityType();
  renderFacilityCards();
})();

// ===== TAB SWITCHING =====
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('tab' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
  document.getElementById('content' + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add('active');
}

// ===== TOAST =====
function showToast(msg, type = 'success') {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.className = `toast toast-${type} show`;
  t.textContent = msg;
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== USERS =====
async function loadUsers() {
  try {
    allUsers = await API.get('/api/settings/users');
    renderUsersTable();
    renderUserStats();
    populatePermUserSelect();
  } catch (e) { showToast('خطأ في تحميل المستخدمين', 'error'); }
}

function renderUserStats() {
  const total = allUsers.length;
  const active = allUsers.filter(u => u.is_active === 1 || u.is_active === true).length;
  const admins = allUsers.filter(u => u.role === 'Admin').length;
  const doctors = allUsers.filter(u => u.role === 'Doctor').length;
  document.getElementById('userStats').innerHTML = `
    <div class="stat-card"><div class="icon" style="background:var(--grad1)">👥</div><div class="label">إجمالي المستخدمين</div><div class="value">${total}</div></div>
    <div class="stat-card"><div class="icon" style="background:var(--grad2)">✅</div><div class="label">نشط</div><div class="value" style="color:var(--success)">${active}</div></div>
    <div class="stat-card"><div class="icon" style="background:var(--grad3)">🛡️</div><div class="label">مدراء</div><div class="value" style="color:var(--warning)">${admins}</div></div>
    <div class="stat-card"><div class="icon" style="background:var(--grad4)">👨‍⚕️</div><div class="label">أطباء</div><div class="value" style="color:var(--info)">${doctors}</div></div>
  `;
  document.getElementById('userCount').textContent = total;
}

function renderUsersTable() {
  const tbody = document.getElementById('usersBody');
  if (!allUsers.length) {
    tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><div class="icon">👥</div><p>لا يوجد مستخدمون</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = allUsers.map((u, i) => `<tr>
    <td>${i + 1}</td>
    <td><strong>${u.display_name || '-'}</strong></td>
    <td><code style="color:var(--primary)">${u.username}</code></td>
    <td>${roleBadge(u.role)}</td>
    <td>${u.speciality || '-'}</td>
    <td class="ip-cell">${u.last_ip || '—'}</td>
    <td>${u.is_active ? '<span class="badge badge-success">نشط</span>' : '<span class="badge badge-danger">معطّل</span>'}</td>
    <td style="font-size:12px;color:var(--text3)">${u.created_at ? new Date(u.created_at).toLocaleDateString('ar-SA') : '-'}</td>
    <td>
      <button class="btn btn-sm btn-outline" onclick="editUser(${u.id})" title="تعديل">✏️</button>
      <button class="btn btn-sm btn-outline" onclick="toggleUser(${u.id},${u.is_active ? 0 : 1})" title="${u.is_active ? 'تعطيل' : 'تفعيل'}">${u.is_active ? '🔒' : '🔓'}</button>
      <button class="btn btn-sm btn-danger btn-icon" onclick="deleteUser(${u.id})" title="حذف">🗑️</button>
    </td>
  </tr>`).join('');
}

function roleBadge(role) {
  const map = { Admin:'primary', Doctor:'info', Nurse:'success', Pharmacist:'warning', 'Lab Technician':'info', Radiologist:'info', Reception:'success', Finance:'warning', HR:'warning', IT:'primary', Staff:'info' };
  return `<span class="badge badge-${map[role] || 'info'}">${role}</span>`;
}

// ===== ADD/EDIT USER MODAL =====
function showAddUserModal(user) {
  const isEdit = !!user;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `<div class="modal">
    <h3>${isEdit ? '✏️ تعديل مستخدم' : '➕ إضافة مستخدم جديد'}</h3>
    <div class="form-grid">
      <div class="form-group"><label>الاسم الكامل</label><input class="form-input" id="muName" value="${isEdit ? user.display_name || '' : ''}"></div>
      <div class="form-group"><label>اسم المستخدم</label><input class="form-input" id="muUsername" value="${isEdit ? user.username || '' : ''}"></div>
      <div class="form-group"><label>كلمة المرور ${isEdit ? '(اتركها فارغة للإبقاء)' : ''}</label><input type="password" class="form-input" id="muPassword" placeholder="${isEdit ? '••••••' : 'كلمة المرور'}"></div>
      <div class="form-group"><label>الدور</label><select class="form-input" id="muRole" onchange="toggleDoctorFields()">
        ${ROLES.map(r => `<option value="${r}" ${isEdit && user.role === r ? 'selected' : ''}>${r}</option>`).join('')}
      </select></div>
      <div class="form-group" id="muSpecDiv" style="display:${isEdit && user.role === 'Doctor' ? 'flex' : 'none'}"><label>التخصص</label><input class="form-input" id="muSpec" value="${isEdit ? user.speciality || '' : ''}"></div>
      <div class="form-group" id="muCommDiv" style="display:${isEdit && user.role === 'Doctor' ? 'flex' : 'none'}">
        <label>العمولة</label>
        <div style="display:flex;gap:8px">
          <select class="form-input" id="muCommType" style="width:120px">
            <option value="percentage" ${isEdit && user.commission_type === 'percentage' ? 'selected' : ''}>نسبة %</option>
            <option value="fixed" ${isEdit && user.commission_type === 'fixed' ? 'selected' : ''}>ثابت</option>
          </select>
          <input type="number" class="form-input" id="muCommValue" value="${isEdit ? user.commission_value || 0 : 0}" step="0.1" min="0">
        </div>
      </div>
    </div>
    <div style="display:flex;gap:12px;margin-top:20px">
      <button class="btn btn-primary" onclick="saveUser(${isEdit ? user.id : 'null'})" style="flex:1">💾 ${isEdit ? 'تحديث' : 'إضافة'}</button>
      <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()" style="flex:1">إلغاء</button>
    </div>
  </div>`;
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  document.body.appendChild(overlay);
}

window.toggleDoctorFields = () => {
  const role = document.getElementById('muRole')?.value;
  const show = role === 'Doctor';
  const sd = document.getElementById('muSpecDiv');
  const cd = document.getElementById('muCommDiv');
  if (sd) sd.style.display = show ? 'flex' : 'none';
  if (cd) cd.style.display = show ? 'flex' : 'none';
};

window.saveUser = async (id) => {
  const username = document.getElementById('muUsername').value.trim();
  const password = document.getElementById('muPassword').value.trim();
  const display_name = document.getElementById('muName').value.trim();
  const role = document.getElementById('muRole').value;
  const speciality = document.getElementById('muSpec')?.value || '';
  const commission_type = document.getElementById('muCommType')?.value || 'percentage';
  const commission_value = parseFloat(document.getElementById('muCommValue')?.value) || 0;

  if (!username) return showToast('أدخل اسم المستخدم', 'error');
  if (!id && !password) return showToast('أدخل كلمة المرور', 'error');

  try {
    const data = { username, display_name, role, speciality, commission_type, commission_value, permissions: '' };
    if (password) data.password = password;
    if (id) {
      data.is_active = 1;
      await API.put(`/api/settings/users/${id}`, data);
      showToast('تم تحديث المستخدم ✅');
    } else {
      await API.post('/api/settings/users', data);
      showToast('تم إضافة المستخدم ✅');
    }
    document.querySelector('.modal-overlay')?.remove();
    await loadUsers();
  } catch (e) { showToast(e.message || 'خطأ في الحفظ', 'error'); }
};

window.editUser = (id) => {
  const user = allUsers.find(u => u.id === id);
  if (user) showAddUserModal(user);
};

window.toggleUser = async (id, active) => {
  try {
    const user = allUsers.find(u => u.id === id);
    if (!user) return;
    await API.put(`/api/settings/users/${id}`, { ...user, is_active: active, password: '' });
    showToast(active ? 'تم تفعيل المستخدم ✅' : 'تم تعطيل المستخدم 🔒');
    await loadUsers();
  } catch (e) { showToast('خطأ', 'error'); }
};

window.deleteUser = async (id) => {
  if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.')) return;
  try {
    await API.delete(`/api/settings/users/${id}`);
    showToast('تم الحذف ✅');
    await loadUsers();
  } catch (e) { showToast(e.message || 'خطأ في الحذف', 'error'); }
};

// ===== PERMISSIONS =====
function populatePermUserSelect() {
  const sel = document.getElementById('permUser');
  sel.innerHTML = '<option value="">-- اختر مستخدم --</option>' +
    allUsers.map(u => `<option value="${u.id}">${u.display_name || u.username} (${u.role})</option>`).join('');
}

window.loadUserPermissions = () => {
  const userId = document.getElementById('permUser').value;
  if (!userId) { document.getElementById('permsContainer').style.display = 'none'; return; }
  
  const user = allUsers.find(u => u.id === parseInt(userId));
  if (!user) return;
  
  document.getElementById('permsContainer').style.display = 'block';
  document.getElementById('savePermBtn').style.display = 'inline-flex';
  document.getElementById('selectAllBtn').style.display = 'inline-flex';
  document.getElementById('deselectAllBtn').style.display = 'inline-flex';

  const currentPerms = (user.permissions || '').split(',').filter(p => p);
  const isAdmin = user.role === 'Admin';
  
  // Get departments based on current facility type
  const allowedDepts = FACILITY_DEPTS[selectedFacilityType] || FACILITY_DEPTS.hospital;
  const depts = NAV_ITEMS.filter(n => allowedDepts.includes(n.idx));

  document.getElementById('permsGrid').innerHTML = depts.map(n => {
    const checked = isAdmin || currentPerms.includes(n.idx.toString());
    return `<label class="perm-item ${checked ? 'checked' : ''}">
      <input type="checkbox" value="${n.idx}" ${checked ? 'checked' : ''} ${isAdmin ? 'disabled' : ''} onchange="this.parentElement.classList.toggle('checked',this.checked)">
      <span>${n.icon}</span>
      <span>${n.ar}</span>
    </label>`;
  }).join('');
};

window.savePermissions = async () => {
  const userId = document.getElementById('permUser').value;
  if (!userId) return;
  const user = allUsers.find(u => u.id === parseInt(userId));
  if (!user) return;
  
  const perms = Array.from(document.querySelectorAll('#permsGrid input:checked')).map(cb => cb.value).join(',');
  try {
    await API.put(`/api/settings/users/${userId}`, { ...user, permissions: perms, password: '' });
    showToast('تم حفظ الصلاحيات ✅');
    await loadUsers();
  } catch (e) { showToast('خطأ في الحفظ', 'error'); }
};

window.selectAllPerms = () => {
  document.querySelectorAll('#permsGrid input').forEach(cb => { cb.checked = true; cb.parentElement.classList.add('checked'); });
};
window.deselectAllPerms = () => {
  document.querySelectorAll('#permsGrid input').forEach(cb => { cb.checked = false; cb.parentElement.classList.remove('checked'); });
};

// ===== FACILITY TYPE =====
async function loadFacilityType() {
  try {
    const settings = await API.get('/api/settings');
    selectedFacilityType = settings.facility_type || 'hospital';
  } catch { selectedFacilityType = 'hospital'; }
}

function renderFacilityCards() {
  const grid = document.getElementById('facilityGrid');
  grid.innerHTML = Object.entries(FACILITY_INFO).map(([key, info]) => {
    const depts = FACILITY_DEPTS[key];
    const deptNames = depts.map(idx => {
      const nav = NAV_ITEMS.find(n => n.idx === idx);
      return nav ? `${nav.icon} ${nav.ar}` : '';
    }).filter(Boolean);
    
    return `<div class="facility-card ${selectedFacilityType === key ? 'selected' : ''}" onclick="selectFacility('${key}')">
      <span class="f-icon">${info.icon}</span>
      <div class="f-title">${info.title}</div>
      <div class="f-subtitle">${info.subtitle}</div>
      <div class="f-count">${info.count} قسم</div>
      <div class="dept-list">${deptNames.join('<br>')}</div>
    </div>`;
  }).join('');
}

window.selectFacility = (type) => {
  selectedFacilityType = type;
  document.querySelectorAll('.facility-card').forEach(c => c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
};

window.saveFacilityType = async () => {
  try {
    await API.put('/api/settings', { facility_type: selectedFacilityType });
    showToast('تم حفظ نوع المنشأة ✅ — سيتم تحديث الأقسام في النظام');
    renderFacilityCards();
  } catch (e) { showToast('خطأ في الحفظ', 'error'); }
};

// ===== LOGOUT =====
window.logout = async () => {
  try { await API.post('/api/auth/logout'); } catch {}
  window.location.href = '/login.html';
};
