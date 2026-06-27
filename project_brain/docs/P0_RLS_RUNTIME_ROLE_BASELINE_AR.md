# P0 — أساس واقع الإنتاج لدور التشغيل (Runtime Role Baseline)

> المرحلة: `P0_RLS_RUNTIME_ROLE_ENFORCEMENT_RESTORE` — البوابة 0 | التاريخ: 2026-06-21 | **read-only**.

## ACTIVE_SKILLS
```text
ACTIVE_SKILLS:
- MEDICAL_AUTOPILOT_CORE_SKILL_AR
- MEDICAL_RLS_PRODUCTION_ENABLEMENT_SKILL_AR
- MEDICAL_RLS_RECONCILIATION_AUTOPILOT_SKILL_AR
- MEDICAL_RLS_AUTOPILOT_BLOCKER_SKILL_AR
- MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR
- MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR
- MEDICAL_SECURITY_PRIVACY_AUDIT_SKILL_AR
- MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR
- MEDICAL_BACKUP_RESTORE_DRILL_SKILL_AR
- MEDICAL_CONTROLLED_WEBSITE_DEPLOY_AND_GIT_SKILL_AR
- MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR
- MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## الأساس
| البند | القيمة | الحالة |
| ----- | ------ | ------ |
| parent HEAD/origin | `a1516c0` = متزامن | ✅ |
| PM2 `nama-app` | online (restarts=0) | ✅ يخدم بالكود المُصحَّح (refund fix) |
| دور التطبيق الحالي (`.env` DB_USER) | **`postgres`** | ⚠️ |
| `postgres`: super / bypassrls | **true / true** | ⚠️ يتجاوز RLS |
| التحقق من التجاوز | كـ postgres مع `app.tenant_id='999'` → patients = **3** (كل الصفوف) | ⚠️ مؤكَّد: RLS لا يُطبَّق |
| RLS على الإنتاج | **115 FORCE / 115 policies** | ✅ مُسلّحة |
| دور `nama_medical_app` | موجود: login=t, **super=f, bypassrls=f**, createdb=f, createrole=f | ✅ أقل صلاحية |
| `nama_medical_app` has_password | **true** (مضبوط خارج git) | (سرّ غير معروف لي) |

## التحقق المقيّد بـ `nama_medical_app` (Gate 0 خطوة 10)
**لم يُنفَّذ** — يتطلّب الاتصال بدور `nama_medical_app`، وهو يحتاج كلمة مروره الفعلية (pg_hba = scram-sha-256، لا trust). كلمة المرور سرّ خارج git ولا أملكه ولا يجوز تخمينه. يُنفَّذ بعد توفير السرّ بقناة آمنة (انظر الإغلاق).

## الخلاصة
RLS مُسلّحة (115 FORCE) لكنها **غير فعّالة** لأن التطبيق يتصل بدور superuser يتجاوزها. استعادة الإنفاذ = تحويل التطبيق إلى `nama_medical_app` (الجاهز) — مشروط بتوفير سرّه.

```text
GATE0_STATUS: RUNTIME_ROLE_BASELINE_VERIFIED
CURRENT_APP_ROLE: postgres (super=true, bypassrls=true)
TARGET_ROLE: nama_medical_app (super=false, bypassrls=false, ready)
NEXT: GATE1_GRANT_READINESS
```

`RLS_RUNTIME_ROLE_BASELINE_COMPLETE`
