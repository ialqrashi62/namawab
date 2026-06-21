# Master Autopilot — حارس الحالة العامة (State Guard)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_ALL_PHASES_AND_GROUPS_CONTINUATION` — البوابة 0 | محدّث 2026-06-21 | read-only.

## حارس الحالة (هذه الجولة)
| البند | القيمة | الحالة |
| ----- | ------ | ------ |
| المسار | `C:\Users\ice\Desktop\NamaMedical` | ✅ الوحيد |
| git HEAD/origin (بداية الجولة) | `336ee02` = متزامن (0/0) | ✅ |
| جلسة كتابة ثانية | لا دليل آني | ⚠️ R17 قائم |
| PM2 `nama-app` | online (restarts=0) — يخدم 8f012a0 | ✅ |
| `ACCOUNTING_POSTING_ENABLED` | غائب ⇒ OFF | ✅ |
| journal_count | 0 | ✅ |
| RLS runtime | 115 FORCE لكن **مُتجاوَز** (app=postgres superuser) | ⚠️ P0 محجوب على سرّ |
| ملفات خارج النطاق | Stitch/UI سابقة فقط (لا تُلمَس) | ✅ |

## ضوابط
read-only للاختيار؛ تنفيذ المرحلة المختارة code-only بلا deploy/DDL/data/flag/force/Stitch. لا طلب أسرار.

```text
GATE0_STATUS: GLOBAL_STATE_GUARD_PASS
SELECTED_THIS_ROUND: P1_SECURITY_TENANT_GUARD_SWEEP_FOR_HIGH_RISK_ROUTES (code-only)
```

`MASTER_AUTOPILOT_STATE_GUARD_CONTINUATION_COMPLETE`
