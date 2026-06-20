# P1 نقل تصميم Stitch — 02 ربط الواجهة الحالية (Current UI Mapping)

> التاريخ: 2026-06-20 | مبني على ملفات حقيقية (`public/js/app.js` NAV_ITEMS، `index.html`/`login.html`/`admin.html`، `styles.css`) + تقارير Stitch الموجودة. **لم يُجرَ سحب حيّ من MCP.**

## 1. الواجهة الحالية (دليل)
- SPA: `index.html` (قشرة) + `app.js` (43 موديولاً عبر `NAV_ITEMS`، تبديل صفحات client-side) + `admin.html` + `login.html`.
- نظام التصميم: `styles.css` (Stitch Premium، 8 ثيمات، `data-theme`، accent/glow، glassmorphism) — **مُطبَّق مسبقاً**.

## 2. جدول الربط (Current ↔ Stitch)
> Stitch Equivalent مستند لحالة الحزم: B/C/D/E = COMPLETED، A = PENDING.

| Current Page/Section | Current File | Stitch Equivalent | Keep | Replace | Merge | Risk | Notes |
| -------------------- | ------------ | ----------------- | :--: | :-----: | :---: | ---- | ----- |
| Design system (tokens/themes) | styles.css | Stitch Premium (مُطبَّق) | ✅ | | | منخفض | يبقى — لا يُعاد بناؤه |
| Login | login.html + login.js | Batch A (PENDING) | | | ✅ | متوسط | يحتاج سحب Stitch حيّ (blocked) |
| Dashboard shell | index.html + app.js renderDashboard | Stitch dashboard | | | ✅ | متوسط | shell موجود؛ تحسين بصري عند توفر MCP |
| Sidebar/Nav | app.js buildNav | Stitch sidebar | ✅ | | ✅ | متوسط | يحترم RBAC + facility entitlement (لا يُكسر) |
| Reception | app.js renderReception | **Batch A PENDING** | | | ✅ | متوسط | معلّق على MCP |
| Appointments | app.js renderAppointments | **Batch A PENDING** | | | ✅ | متوسط | معلّق على MCP |
| Patient Portal | app.js renderPatientPortal | **Batch A PENDING** | | | ✅ | متوسط | معلّق على MCP |
| Lab / Radiology / Pharmacy | app.js (renderLab/...) | Batch B COMPLETED | ✅ | | | منخفض | مُطبَّق |
| Inventory / Supply / Suppliers | app.js | Batch C COMPLETED | ✅ | | | منخفض | مُطبَّق |
| Finance / HR / Quality | app.js | Batch D COMPLETED | ✅ | | | منخفض | مُطبَّق |
| Security/Maintenance/Analytics | app.js | Batch E COMPLETED | ✅ | | | منخفض | مُطبَّق |
| Patients / EMR / Doctor / Nursing | app.js | (ضمن الحزم المطبّقة) | ✅ | | | منخفض | لا يُكسر منطقها |
| Billing / Insurance / Accounting | app.js | Batch D محاسبة (بصري فقط) | ✅ | | | **عالٍ** | **ممنوع** ربط accounting_posting.js أو لمس منطق الفوترة |
| Admin / Settings | admin.html / renderSettings | Stitch admin | ✅ | | | متوسط | يحترم role(settings) |

## 3. الثوابت التي يجب الحفاظ عليها أثناء أي دمج
- Auth/session، RLS P0 (app.tenant_id binding)، facility entitlement (fail-closed)، مسارات الـ API، النماذج/الإجراءات القائمة، الصلاحيات (`requireRole`)، RTL عربي/LTR إنجليزي، الاستجابة.
- **ممنوع** لمس: server.js الأمني (إلا UI routing بمراجعة)، accounting engine، DB، RLS، facility entitlement.

## 4. الخلاصة
معظم الواجهة مُصمَّمة بـ Stitch مسبقاً (B-E). المتبقي = **Batch A** (استقبال/مواعيد/بوابة) + تحسينات shell/sidebar/login — وكلها تحتاج **سحب Stitch حيّ عبر MCP** (غير متاح الآن). لا يوجد ما يُنفَّذ كوداً دون اختلاق.

`CURRENT_UI_MAPPING_COMPLETE`
