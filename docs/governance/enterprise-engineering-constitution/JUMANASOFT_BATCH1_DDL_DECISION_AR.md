# الدفعة 1 — قرار DDL/Migration (GATE 4)

**التاريخ:** 2026-06-30 · **القرار: NO-DDL لهذه الدفعة.**

## 1) لماذا no-DDL
- `tenants.status` (DEFAULT 'active') و `tenants.plan_type` (DEFAULT 'standard') **موجودان** بالفعل (db_postgres.js:1682) → تغيير الحالة وعرض الخطة لا يحتاجان أي تعديل مخطّط.
- عدد المستخدمين/المنشآت وآخر نشاط = **محسوبة** من `user_tenants`/`facilities`/`audit_trail` الموجودة (لا أعمدة جديدة).
- هوية Super Admin = قائمة بيئية `SUPER_ADMIN_USERS` (لا عمود/جدول).
- ⟹ الدفعة تُنفَّذ بالكامل **بلا DDL** → نختار no-DDL (القاعدة 3/GATE 4).

## 2) أثر الإنتاج
- **لا migration ولا DDL على أي قاعدة** (إنتاج أو غيره) في هذه الدفعة. **NO production touch. NO DDL run.**

## 3) مرشّح اختياري (NOT RUN — لدفعات لاحقة فقط)
لتحسينات مستقبلية (آخر نشاط مخزّن، نهاية التجربة)، أُنشئ **مرشّح migration** إضافياً غير مُشغَّل:
- الملف: `namaweb/migrations/e24_tenants_control_center_candidate_{up,down,validate}.sql`
- **additive فقط** (`ADD COLUMN IF NOT EXISTS`): `last_activity_at TIMESTAMPTZ`, `trial_ends_at TIMESTAMPTZ`, `suspended_at TIMESTAMPTZ`, `suspended_reason TEXT`.
- **الجداول المتأثّرة:** `tenants` فقط.
- **لا DROP، لا تغيير نوع، لا حذف** — لا شيء مدمّر.
- **rollback:** `down` يزيل الأعمدة المضافة (`DROP COLUMN IF EXISTS`) — الأعمدة جديدة بلا بيانات أعمال.
- **الحالة:** **CANDIDATE — لم يُشغَّل، وغير مطلوب لهذه الدفعة.** يُطبَّق لاحقاً على معزول أولاً (G9) عند الحاجة، بإذن صريح.

## 4) قرار البوابة (GATE 4)
- ✅ **PASS** — الدفعة no-DDL؛ مرشّح additive جاهز كمرجع غير مُشغَّل، بلا أي تغيير مدمّر. ننتقل إلى GATE 5.
