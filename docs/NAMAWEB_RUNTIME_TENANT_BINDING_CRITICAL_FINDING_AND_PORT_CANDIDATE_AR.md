# 🔴 اكتشاف حرج P0: الفرع المنشور بلا ربط app.tenant_id + مرشّح النقل (Critical Finding + Port Candidate)

> المرحلة: `OWNER_RESOLVE_NAMAWEB_MAIN_MASTER_DIVERGENCE_SECURITY_CHERRYPICK_CANDIDATE` | التاريخ: 2026-06-21 | read-only تحليل + candidate spec. **لا تعديل/نشر.**

## الاكتشاف (يتجاوز مهمة Batch-1)
الفرع المنشور **namaweb main @ 039a7d7** يتصل بقاعدة البيانات كـ `nama_medical_app` لكنه **لا يملك أي آلية لضبط `app.tenant_id` لكل طلب**:
```text
db_postgres.js (039a7d7): Pool عادي + query() رفيع فوق pool.query — لا AsyncLocalStorage، لا tenantStore،
  لا set_config('app.tenant_id')، لا pool.query monkey-patch. exports = {pool, query, getPool, initDatabase}.
server.js (039a7d7): لا يستورد/يستخدم tenantStore ولا tenant_context_pg_session؛ 784 نداء pool.query خام؛
  withTenantTransaction (في tenant_context_pg_session.js) غير مُستخدم.
role/db config: nama_medical_app rolconfig=NULL ؛ لا db-role setting لـ app.tenant_id.
```
**النتيجة (مؤكَّدة كوداً+تهيئةً+تجريبياً)**: تحت FORCE RLS (USING tenant_id = current_setting('app.tenant_id'))، وبما أن `app.tenant_id` لا يُضبط أبداً:
- **كل قراءة على جدول tenant ترجع 0 صفوف** (إثبات: كـ nama_medical_app بلا سياق، `SELECT patients`=0 و`WHERE tenant_id=1`=0).
- **كل INSERT يفشل 42501** (الـ DB default يحتاج app.tenant_id مضبوطاً ليُنتج قيمة مطابقة).
⇒ **طبقة بيانات المستأجر معطّلة فعلياً في الإنتاج منذ تبديل الدور** (قراءات فارغة + إنشاء يفشل).

## لماذا لم يُكتشف سابقاً؟
- UAT السابق (Phase 152/158) اختبر القراءة/الكتابة بضبط app.tenant_id يدوياً في probe خاصّتي، لا عبر مسار طلب التطبيق الفعلي.
- health 200 لا يلمس جداول tenant ؛ pool التطبيق خامل (لا استخدام حيّ فعلي حالياً).
- السبب الجذري = تشعّب الفرعين: **سطري (10ded01) فيه الربط؛ الفرع المنشور (039a7d7) لا**. تبديل الدور نُشر بلا الربط المطلوب.

## الأثر على Batch-1
ختم tenant_id في الـ INSERT (Batch-1) **لا يكفي**: WITH CHECK يقارن tenant_id بالصف مع `current_setting('app.tenant_id')`؛ إن لم يُضبط app.tenant_id يفشل الإدراج (42501) رغم الختم. والقراءات تبقى 0. ⇒ **الربط شرط مسبق لكل شيء**. Batch-1 ثانوي بعده.

## ✅ المرشّح الأساسي (نقل الربط المُثبَت من 10ded01) — غير مُطبَّق
### 1) db_postgres.js — بعد إنشاء pool (بعد السطر 12): أدرج
```js
const { AsyncLocalStorage } = require('async_hooks');
const tenantStore = new AsyncLocalStorage();
function runWithTenant(context, fn) { return tenantStore.run(context || {}, fn); }
function getCurrentTenantId() { const s = tenantStore.getStore(); return s && s.tenantId ? s.tenantId : null; }
const _poolQuery = pool.query.bind(pool);
pool.query = function (text, params) {
  const tid = getCurrentTenantId();
  if (!tid) return _poolQuery(text, params);               // login/health/init بلا سياق → سلوك أصلي
  return (async () => {
    const client = await pool.connect();
    try {
      await client.query("SELECT set_config('app.tenant_id', $1, false)", [String(tid)]);
      return params === undefined ? await client.query(text) : await client.query(text, params);
    } finally {
      try { await client.query("SELECT set_config('app.tenant_id', '', false)"); } catch (e) {}
      client.release();
    }
  })();
};
```
وحدِّث: `module.exports = { pool, query, getPool, initDatabase, tenantStore, runWithTenant, getCurrentTenantId };`

### 2) server.js — استيراد + middleware (بعد app.use(session...), قبل المسارات)
```js
const { pool, initDatabase, tenantStore } = require('./db_postgres');   // أضف tenantStore (و getCurrentTenantId لـ logAudit لاحقاً)
app.use((req, res, next) => {
  const { tenantId, facilityId } = getRequestTenantContext(req);        // getRequestTenantContext موجود في server.js
  if (tenantId) { tenantStore.run({ tenantId, facilityId }, () => next()); } else { next(); }
});
```
(getRequestTenantContext معرّف في server.js 039a7d7 — مؤكَّد. المرشّح مُثبَت 9/9 على سطري سابقاً: نفس الاتصال، بلا تسرّب بين الطلبات، fail-closed.)

### ملاحظة ثانوية
`initDatabase` في 039a7d7 لا يحوي حارس `if (NODE_ENV==='production') return;` (يُشغّل CREATE TABLE IF NOT EXISTS عند الإقلاع). يُفضَّل نقل الحارس أيضاً (دور nama_medical_app قد لا يملك CREATE على schema).

## التحقق المطلوب قبل التطبيق
- **عاجل (المالك)**: اختبار قراءة مصادق فعلي عبر الواجهة (تسجيل دخول + فتح قائمة مرضى) لتأكيد القراءات الفارغة (الختم النهائي للـ P0).
- بعد نقل الربط + نشر مُصرَّح: قراءة المستأجر ترجع بياناته، الإنشاء ينجح (مع DB default/Batch-1)، forge محجوب، no-ctx fail-closed.

`RUNTIME_TENANT_BINDING_CRITICAL_FINDING_AND_PORT_CANDIDATE_COMPLETE`
