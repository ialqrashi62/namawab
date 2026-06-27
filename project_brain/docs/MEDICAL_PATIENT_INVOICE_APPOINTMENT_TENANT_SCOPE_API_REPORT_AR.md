# تقرير: Patient, Invoice & Appointment Tenant Scope API Implementation
**التاريخ:** 2026-06-15  
**المرحلة:** Patient, Invoice & Appointment Tenant Scope API  
**الملف المُعدَّل:** `namaweb/server.js`  
**الحالة:** ✅ مكتمل

---

## الملخص التنفيذي

تم تطبيق فلاتر عزل المستأجر (`tenant_id`) والمنشأة (`facility_id`) على جميع مسارات API الخاصة بالمرضى والفواتير والمواعيد في `namaweb/server.js`. التعديلات تمنع تسرب البيانات عبر المستأجرين (Cross-Tenant Leakage) وتحمي من ثغرات IDOR.

---

## المسارات المُعدَّلة

### 👤 المرضى (Patients)

| المسار | النوع | التعديل |
|---|---|---|
| `GET /api/patients` | قراءة | تصفية بـ `tenant_id` من الجلسة |
| `GET /api/patients/:id` | قراءة | **مسار جديد** — تحقق من `tenant_id` قبل الإرجاع (IDOR prevention) |
| `POST /api/patients` | إنشاء | ختم `tenant_id` و`facility_id` من الجلسة في INSERT |
| `PUT /api/patients/:id` | تعديل | تحقق من ملكية السجل قبل التعديل، إضافة `logAudit` |
| `DELETE /api/patients/:id` | حذف | تحقق من `tenant_id` قبل الحذف (IDOR prevention) |
| `GET /api/patients/:id/summary` | قراءة | تحقق من `tenant_id` في استعلام الملخص |
| `GET /api/patients/:id/timeline` | قراءة | تحقق من `tenant_id` في استعلام الجدول الزمني |

### 💰 الفواتير (Invoices)

| المسار | النوع | التعديل |
|---|---|---|
| `GET /api/invoices` | قراءة | تصفية بـ `tenant_id` من الجلسة |
| `POST /api/invoices` | إنشاء | ختم `tenant_id` و`facility_id` في INSERT |
| `POST /api/invoices/generate` | إنشاء | تحقق من `tenant_id` للمريض + ختم الفاتورة + `logAudit` |
| `PUT /api/invoices/:id/pay` | تعديل | تحقق من ملكية الفاتورة قبل الدفع + إضافة `logAudit` |
| `PUT /api/invoices/:id/partial-pay` | تعديل | تحقق من `tenant_id` قبل الدفع الجزئي |
| `POST /api/invoices/cancel/:id` | تعديل | تحقق من `tenant_id` قبل الإلغاء (IDOR prevention) |

### 📅 المواعيد (Appointments)

| المسار | النوع | التعديل |
|---|---|---|
| `GET /api/appointments` | قراءة | تصفية بـ `tenant_id` من الجلسة |
| `POST /api/appointments` | إنشاء | ختم `tenant_id` و`facility_id` + إصلاح متغير `date` → `appt_date` + `logAudit` |
| `DELETE /api/appointments/:id` | حذف | تحقق من `tenant_id` قبل الحذف + `logAudit` |
| `PUT /api/appointments/:id/checkin` | تعديل | تحقق من `tenant_id` قبل تسجيل الحضور |
| `PUT /api/appointments/:id/noshow` | تعديل | تحقق من `tenant_id` قبل تسجيل الغياب (جلب القبل-حذف) |
| `POST /api/appointments/followup` | إنشاء | ختم `tenant_id` و`facility_id` + إصلاح `req.session.user.name` → `?.display_name` + `logAudit` |

---

## الإصلاحات الإضافية (Bug Fixes)

### 1. متغير غير معرَّف: `date` → `appt_date`
في مسار `POST /api/appointments`، كان الكود يستخدم `new Date(date)` للمقارنة مع اليوم، لكن المتغير الصحيح هو `appt_date`. **تم الإصلاح.**

### 2. خاصية غير موجودة: `req.session.user.name`
في `POST /api/appointments/followup`، كان الاحتياط يستخدم `req.session.user.name` بدلاً من `req.session.user?.display_name`. **تم الإصلاح.**

### 3. مسار `GET /api/patients/:id` لم يكن موجوداً
أُضيف مسار جديد `GET /api/patients/:id` مع تحقق `tenant_id` لمنع IDOR عند جلب مريض مفرد.

---

## النمط المُتَّبَع في التحقق

```javascript
// IDOR Prevention Pattern (Read/Update/Delete)
const { tenantId } = getRequestTenantContext(req);
const tenantCheck = tenantId ? ' AND tenant_id=$2' : '';
const tenantParams = tenantId ? [req.params.id, tenantId] : [req.params.id];
const record = (await pool.query(`SELECT * FROM table WHERE id=$1${tenantCheck}`, tenantParams)).rows[0];
if (!record) return res.status(404).json({ error: 'Not found' });

// Insert Stamping Pattern (Create)
const { tenantId, facilityId } = getRequestTenantContext(req);
// ... INSERT ... VALUES (..., $N, $N+1) ... , [... tenantId || null, facilityId || null]
```

---

## الضمانات والقواعد

- ✅ `tenant_id` يُجلب دائماً من الجلسة (`req.session.user.tenantId`) — لا يقبله من الـ body.
- ✅ في حالة `tenantId = null` (بيئة غير إنتاجية أو مشغّل بدون tenant)، يعمل النظام بدون قيود.
- ✅ في الإنتاج (`NODE_ENV === 'production'`)، يرفض الطلب إذا لم يكن `tenantId` محدداً.
- ✅ جميع عمليات INSERT تختم `tenant_id` و`facility_id` من الجلسة فقط.
- ✅ لم تُضَف أي `NOT NULL` constraints — الأعمدة تقبل `null` للتوافق مع البيانات القديمة.
- ✅ لم تُشغَّل أي migrations.
- ✅ لم تُعدَّل قاعدة البيانات.

---

## المرحلة القادمة المقترحة

**Lab & Radiology Orders Tenant Scope API**  
تطبيق نفس نمط العزل على مسارات طلبات المختبر والأشعة (`/api/lab-orders`, `/api/radiology`).
