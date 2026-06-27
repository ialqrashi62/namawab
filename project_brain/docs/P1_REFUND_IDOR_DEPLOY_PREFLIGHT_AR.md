# P1 — Preflight النشر المحكوم لإصلاح Refund IDOR

> المرحلة: `P1_REFUND_IDOR_CONTROLLED_PRODUCTION_DEPLOY` — البوابة 0 | التاريخ: 2026-06-21.

## ACTIVE_SKILLS
```text
ACTIVE_SKILLS:
- MEDICAL_AUTOPILOT_CORE_SKILL_AR
- MEDICAL_CONTROLLED_WEBSITE_DEPLOY_AND_GIT_SKILL_AR
- MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR
- MEDICAL_SECURITY_PRIVACY_AUDIT_SKILL_AR
- MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR
- MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR
- MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
- MEDICAL_RLS_AUTOPILOT_BLOCKER_SKILL_AR
```

## طوبولوجيا النشر
**single-box**: تطبيق PM2 (`nama-app`) يعمل مباشرةً من `namaweb/server.js` على هذا الصندوق (لا remote منفصل). لذا «النشر» = تأكيد أن الملف على إصدار 8f012a0 + restart محكوم + smoke.

## فحص Preflight
| البند | القيمة | الحالة |
| ----- | ------ | ------ |
| parent HEAD/origin | `7cbc44d` = `7cbc44d` | ✅ متزامن |
| namaweb gitlink | `8f012a0…` | ✅ |
| working tree `server.js` | نظيف (= 8f012a0) | ✅ |
| ملفات خارج النطاق staged | لا | ✅ |
| `ACCOUNTING_POSTING_ENABLED` | غائب ⇒ OFF | ✅ |
| journal_count | 0 | ✅ |
| RLS runtime role bypassed | معروف (postgres/superuser) — **لا يُعالَج هنا** | ⚠️ مخطر متبقٍ موثّق |
| البنية: Docker / Redis :6379 | UP / OPEN | ✅ (يمنع crash-loop في prod mode) |
| الحالة قبل: PM2 / :3000 | لا عملية / مغلق | (سيُبدأ) |

## القيود
نشر `server.js` (8f012a0) فقط + التقارير. ممنوع: DDL، تغيير بيانات، تفعيل flag، journal، ربط محاسبي، تعديل RLS policies/role، Stitch، force push، إدخال `.env`، لمس `.gitmodules`، ملفات خارج النطاق.

```text
GATE0_STATUS: DEPLOY_PREFLIGHT_PASS
NEXT: GATE1_BACKUP → UPLOAD(N/A single-box) → SYNTAX → PM2 → SMOKE
```

`REFUND_IDOR_DEPLOY_PREFLIGHT_COMPLETE`
