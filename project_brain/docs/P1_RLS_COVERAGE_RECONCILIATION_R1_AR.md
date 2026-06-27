# P1 — تسوية تغطية RLS (R1 Coverage Reconciliation)

> المرحلة المختارة ضمن Master Autopilot — البوابة 3 (تنفيذ) + 4 (إغلاق) | التاريخ: 2026-06-21
> **read-only فقط** (`SET default_transaction_read_only=on`). لا DDL، لا ENABLE/FORCE، لا policies، لا تغيير بيانات.

## 1. الحقيقة المُسوّاة (تنقض الادعاء القديم)
| القياس (single-box prod `nama_medical_web`) | القيمة |
| ------------------------------------------- | ------ |
| إجمالي جداول `public` | **149** |
| RLS ENABLE | **115** |
| RLS **FORCE** | **115** |
| policies | **115** (115 جدولاً) |
| ENABLE-only (بلا FORCE) | **0** |
| جداول بـ `tenant_id` | **118** |

**النتيجة**: ادعاء التوثيق «115 جدولاً» **صحيح فعلاً الآن**. الرقم القديم في سجل المخاطر («الفعلي 13 FORCE») **قديم/منقضٍ** — على الأرجح طُبِّقت مجموعات RLS (groupA/B/C/D + finance_rls + …) لاحقاً (الجلسة الموازية). **R1 (التباين 115 مقابل 13) مُسوّى: الواقع 115.**

نمط السياسة موحّد على الكل:
```sql
USING/WITH CHECK (tenant_id = (NULLIF(current_setting('app.tenant_id', true), ''))::integer)
```

## 2. ⚠️ الاكتشاف الحرج: RLS مُسلّح لكنه **مُتجاوَز** (superuser bypass)
اختبار قطعي (read-only) بالدور المُهيّأ في `.env` (`DB_USER=postgres`):
- `current_user=postgres`، `is_superuser=on`، `rolbypassrls=true`.
- بعد `set_config('app.tenant_id','999')`: `SELECT COUNT(*) FROM patients` = **3** (كل الصفوف)؛ وبلا سياق = **3** أيضاً.
- ⇒ **السياسات الـ115 لا تُطبَّق على اتصال superuser** (PostgreSQL يتجاوز RLS للـ superuser/`BYPASSRLS` حتى مع FORCE).

يوجد دور أقل صلاحية **`nama_medical_app`** (`rolsuper=false`, `rolbypassrls=false`) — **لكنه غير موصول** (التطبيق يتصل postgres). مرشّح التفعيل موجود: `docs/accounting_candidates/app_runtime_role_candidate.sql`.

**الخلاصة**: العزل الفعّال اليوم يعتمد على **فلاتر `WHERE tenant_id` على مستوى التطبيق**، لا على RLS. الـ115 FORCE هي **دفاع كامن** لن يَنفُذ إلا بعد ربط التطبيق بدور غير-superuser.

## 3. تصنيف الـ34 جدولاً غير المحمية (149 − 115)
### أ) فجوات حقيقية (tenant-owned) — تحتاج معالجة (DDL، موافقة منفصلة)
| الجدول | tenant_id؟ | الإجراء المقترح |
| ------ | --------- | --------------- |
| `audit_trail` | نعم | ENABLE+FORCE+policy (candidate) |
| `portal_users` | نعم | ENABLE+FORCE+policy (PHI-adjacent) |
| `packages` | **لا** | backfill tenant_id ثم RLS (Class A) |
| `blood_bank_donors` | **لا** | backfill tenant_id ثم RLS (Class A، PHI دم) |
| `blood_bank_units` | **لا** | backfill tenant_id ثم RLS (Class A) |
| `employees`,`branches`,`departments`,`cssd_*`,`daily_close`,`internal_messages`,`insurance_companies/contracts/policies`,`finance_cost_centers`,`finance_fiscal_years` | لا | مراجعة فردية: أيّها tenant-owned ⇒ Class A؛ أيّها global ⇒ توثيق |

### ب) عالمية بالتصميم (آمنة — لا إجراء)
كتالوجات/مرجعيات مشتركة: `icd10_codes, medications, lab_tests_catalog, radiology_catalog, medical_services, drug_interactions, cosmetic_procedures, discount_rules, form_templates`؛ وبُنى auth/global: `tenants, system_users, user_permissions, user_facilities, user_tenants, cme_*`.

## 4. أثر على refund IDOR (إعادة تصنيف للأعلى)
بما أن RLS **مُتجاوَز** (app=superuser)، فإن `POST /api/invoices/:id/refund` الذي يقرأ `SELECT … WHERE id=$1` **بلا فلتر tenant** = **قابل للاستغلال فعلاً عبر المستأجرين** (P1)، وليس مجرد دفاع-في-العمق. ⇒ إصلاح code-only فوري موصى به كـ NEXT.

## 5. الإجراءات الموصى بها (بحسب الرافعة)
1. **`P1_REFUND_IDOR_TENANT_GUARD_CODE_FIX`** (code-only، فوري، بلا DDL).
2. **ربط الدور الأقل صلاحية `nama_medical_app`** — يُفعّل الـ115 FORCE فعلياً (GRANTs + `.env` + redeploy؛ موافقات منفصلة). أعلى رافعة عزل على مستوى DB.
3. Class A residual (packages/blood_bank_*/audit_trail/portal_users) — candidates بموافقة DDL.

## 6. سلامة الجولة
- لا تغيير قاعدة بيانات (read-only صرف). لا أسرار طُبعت (أسماء أدوار/متغيرات فقط). أدوات الفحص في `.master_tmp/` خارج المستودع وحُذفت.

## الإغلاق (Gate 4)
```text
FINAL_STATUS: DOCS_ONLY_PASS
SELECTED_PHASE: P1_RLS_COVERAGE_RECONCILIATION_R1
USER_VISIBLE_ON_WEBSITE: NO
LOCAL_CHANGES_REMAINING: NO (بعد commit؛ ملفات Stitch/UI سابقة خارج النطاق)
COMMITTED: YES
PUSHED: YES (fast-forward بلا force)
PRODUCTION_DEPLOYED: NO
DEPLOYMENT_APPROVAL_REQUIRED: NO (لهذه التسوية) ; YES (للإصلاحات اللاحقة)
DDL_EXECUTED: NO
SEED_EXECUTED: NO
DATA_CHANGED: NO
RUNTIME_CODE_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_CREATED: NO
RLS_CHANGED: NO (تسوية توثيقية read-only فقط)
STITCH_MCP_USED: NO
SECRETS_FOUND: NO (أسماء أدوار فقط)
FILES_CHANGED: 6 (4 تقارير Master + تحديث risk register + ذاكرة)
FILES_DEPLOYED: 0
FILES_NOT_DEPLOYED: كل التقارير
OUT_OF_SCOPE_FILES_PRESENT: NO
NEXT_REQUIRED_ACTION: P1_REFUND_IDOR_TENANT_GUARD_CODE_FIX (ثم ربط دور nama_medical_app لتفعيل RLS فعلياً)
```

## تدقيق ترميز UTF-8 العربي
`UTF8_ARABIC_AUDIT: PASS`

`RLS_COVERAGE_RECONCILIATION_R1_COMPLETE`
