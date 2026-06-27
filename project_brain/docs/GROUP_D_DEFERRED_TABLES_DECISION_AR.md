# Phase 4 — Group D: قرار الجداول المؤجَّلة (Deferred Decision)

> التاريخ: 2026-06-20. القاعدة: لا تخمين لمصدر tenant_id؛ أي جدول بلا مصدر حتمي آمن = DEFERRED مع السبب.

## الجداول الآمنة (تُعالَج الآن — candidate جاهز، staging PASS)
| الجدول | مصدر tenant_id | القرار |
|---|---|---|
| blood_bank_transfusions | patient_id → patients.tenant_id | backfill + RLS (candidate) |
| blood_bank_crossmatch | patient_id → patients.tenant_id | backfill + RLS (candidate) |
| package_sessions | patient_id → patients.tenant_id | backfill + RLS (candidate) |
| approvals | patient_id → patients.tenant_id | backfill + RLS (candidate) |

## الجداول المؤجَّلة (18) — لا مصدر tenant حتمي آمن
| الجدول | السبب | المسار المقترح |
|---|---|---|
| blood_bank_units | donor_id → blood_bank_donors (الأخير بلا tenant)؛ لا patient | مراجعة يدوية / facility-scoping |
| blood_bank_donors | لا مرجع مستأجر (متبرّع قد يكون عابراً للمنشآت) | قرار عمل: per-tenant أم مشترك |
| cssd_instrument_sets | department فقط، لا مريض/مستأجر | facility-scoping يدوي |
| cssd_load_items | cycle_id/set_id → جداول cssd بلا tenant | تابع لـ cssd |
| cssd_sterilization_cycles | machine/operator فقط | facility-scoping يدوي |
| cme_activities | provider/title؛ قد يكون عالمياً أو per-tenant | قرار عمل |
| cme_registrations | employee_id → employees (بلا tenant) | تابع لـ employees |
| packages | تعريف باقات؛ قد يكون كتالوج عالمي أو per-tenant | قرار عمل |
| daily_close | إقفال مالي؛ لا مريض/عمود مستأجر؛ cashier اسم | facility/tenant-scoping مالي دقيق |
| internal_messages | sender/receiver؛ رسائل قد تعبر المستأجرين | تصميم خاص (طرفا الرسالة) |
| form_templates | قوالب؛ عالمي أو per-tenant | قرار عمل |
| discount_rules | قواعد خصم؛ عالمي أو per-tenant | قرار عمل |
| cosmetic_procedures | كتالوج إجراءات (اسم/تكلفة) — غالباً مرجعي عالمي | الأرجح عالمي (لا RLS) |
| insurance_contracts | company_id → insurance_companies (عالمي)؛ العقد per-tenant لكن لا مصدر | مراجعة يدوية |
| insurance_policies | تعريفات بوالص (حدود/فئات) — غالباً مرجعي عالمي | الأرجح عالمي (لا RLS) |
| user_facilities | ربط user↔facility (auth/mapping) | تصميم خاص (كـ user_tenants) |
| user_permissions | صلاحيات RBAC للمستخدم | تصميم خاص (auth) |
| employees | لا عمود/مرجع مستأجر؛ قد يكون legacy مقابل hr_employees | مراجعة يدوية (legacy؟) |

## القاعدة المطبَّقة
- لم يُضَف tenant_id لأي جدول مرجعي/عالمي (cosmetic_procedures، insurance_policies مرشّحان كعالميين).
- لم يُخمَّن مصدر مستأجر لأي جدول auth/audit/mapping (user_facilities، user_permissions) — تصميم خاص لاحق.
- الجداول التابعة (cssd_*، cme_registrations) مؤجَّلة حتى يُحسَم أصلها.

```text
GROUP_D_SAFE_TABLES: 4 (candidate ready, staging PASS)
GROUP_D_DEFERRED_TABLES: 18 (rationale above)
STATUS: GROUP_D_DDL_PARTIAL_DEFERRED
```
