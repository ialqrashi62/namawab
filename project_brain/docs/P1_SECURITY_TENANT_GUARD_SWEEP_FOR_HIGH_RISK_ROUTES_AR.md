# P1 — مسح حارس المستأجر للمسارات عالية الخطورة (Tenant-Guard IDOR Sweep)

> الوضع: `MEDICAL_MASTER_AUTOPILOT_ALL_PHASES_AND_GROUPS_CONTINUATION` — المرحلة المختارة + الإغلاق
> التاريخ: 2026-06-21 | **code-only، لم يُنشَر** | لا DDL/Data/flag/journal/Stitch/RLS-policy/force.

## ACTIVE_SKILLS
```text
ACTIVE_SKILLS:
- MEDICAL_AUTOPILOT_CORE_SKILL_AR
- MEDICAL_NEXT_PHASE_SELECTOR_SKILL_AR
- MEDICAL_ULTIMATE_AUTOPILOT_DECISION_ENGINE_SKILL_AR
- MEDICAL_SECURITY_PRIVACY_AUDIT_SKILL_AR
- MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR
- MEDICAL_API_AUDIT_SKILL_AR
- MEDICAL_PATIENT_DATA_SAFETY_SKILL_AR
- MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR
- MEDICAL_TEST_SCENARIOS_SKILL_AR
- MEDICAL_CONTROLLED_WEBSITE_DEPLOY_AND_GIT_SKILL_AR
- MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR
- MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## لماذا هذه المرحلة (القرار)
سرّ `nama_medical_app` غير جاهز ⇒ تحويل دور RLS (P0) محجوب. وبما أن RLS **مُتجاوَز فعلياً** (التطبيق=postgres superuser)، فإن **فلاتر التطبيق هي خط العزل الوحيد** حالياً ⇒ أعلى أولوية آمنة بلا سرّ = مسح المسارات عالية الخطورة التي تعدّل سجلات بـ id فقط (نفس فئة refund IDOR).

## منهج التدقيق
حصر كل استعلامات `WHERE id=$1` في `server.js` وتصنيفها:
- **آمنة**: إعادة قراءة صف مُدرَج للتوّ (`[result.rows[0].id]`)، أو لوكاب مع `AND tenant_id=$2`/tenantCheck.
- **خطرة (IDOR)**: تعديل/قراءة سجل مملوك للمستأجر بـ id فقط دون فلتر tenant.

## الثغرات المؤكَّدة والمُصلَحة (كتابة عابرة للمستأجر)
| المسار | السطر | قبل | الإصلاح |
| ------ | ----- | --- | ------- |
| `PUT /api/queue/patients/:id/status` | 1798 | `UPDATE patients … WHERE id=$2` بلا فلتر tenant (ولا requireRole) | فحص ملكية `SELECT id FROM patients WHERE id=$1 [AND tenant_id]` → 404 إن لم تُملَك |
| `PUT /api/patients/:id/referral` | 1821 | `UPDATE patients … WHERE id=$2` بلا فلتر tenant | فحص ملكية مماثل → 404 |
| `PUT /api/insurance/claims/:id` | 781 | `UPDATE insurance_claims … WHERE id=$2` بلا فلتر tenant | فحص ملكية `insurance_claims` → 404 |

النمط المعتمد يطابق المسارات الشقيقة المُثبتة (pay/cancel/partial-pay): تحقّق ملكية مشروط بـ tenant قبل الطفرة ⇒ المستأجر A لا يعدّل سجل المستأجر B (يُرجَع 404). لا اعتماد على RLS.

## ما تأكّد أنه آمن (لا تغيير)
- `UPDATE_PATIENT` (556/562): الطفرة مفلترة tenant بالفعل.
- `partial-pay` (6451)، pay (1736)، cancel (5603): محروسة tenant.
- معظم `WHERE id=$1` الأخرى = إعادة قراءة صف مُدرَج للتوّ (آمنة).

## فجوات متوسطة مُسجَّلة (مراجعة لاحقة، لم تُلمَس)
- `DELETE /api/employees/:id` (706) و`DELETE /api/system_users/:id` (1586) و`UPDATE form_templates … WHERE id=$1` (1788): جداول **بلا tenant_id** (employees/system_users/form_templates) ⇒ نموذج وصول مختلف (global/admin/facility) — تحتاج قرار تصميم، لا إصلاح أعمى.
- لوكاب قراءة بـ id لمسارات أقل خطورة (online_bookings…): تُراجَع في مسح موسّع لاحق.

## الاختبارات
- `cross_tenant_idor_sweep_test.js` (جديد): **8/8 PASS**.
- انحدار: refund 11/0 · leak OK · entitlement 41/0 · failclosed 50/0 · wave2 38/0 · accounting 28/0 · `node --check` OK.

## الإغلاق (Gate 4)
```text
FINAL_STATUS: CODE_ONLY_PUSHED_NOT_DEPLOYED
SELECTED_PHASE: P1_SECURITY_TENANT_GUARD_SWEEP_FOR_HIGH_RISK_ROUTES
USER_VISIBLE_ON_WEBSITE: NO (الكود مدفوع، غير منشور؛ التطبيق الحيّ على 8f012a0)
LOCAL_CHANGES_REMAINING: NO (بعد commit/push)
COMMITTED: YES (namaweb + parent gitlink) ; PUSHED: YES (بلا force)
PRODUCTION_DEPLOYED: NO ; DEPLOYMENT_APPROVAL_REQUIRED: YES
DDL_EXECUTED: NO ; SEED_EXECUTED: NO ; DATA_CHANGED: NO
RUNTIME_CODE_CHANGED: YES (3 مسارات + ملف اختبار)
ACCOUNTING_POSTING_ENABLED: OFF ; JOURNAL_CREATED: NO
RLS_CHANGED: NO ; RLS_RUNTIME_ENFORCEMENT: NOT_YET (يبقى متجاوَزاً حتى تبديل الدور)
DB_ROLE_BEFORE: postgres ; DB_ROLE_AFTER: postgres
STITCH_MCP_USED: NO ; SECRETS_FOUND: NO ; SECRETS_PRINTED: NO
FILES_CHANGED: namaweb(2) + parent gitlink + 4 تقارير + ذاكرة
FILES_DEPLOYED: 0 ; FILES_NOT_DEPLOYED: الكل
OUT_OF_SCOPE_FILES_PRESENT: NO ; FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: CONTROLLED_DEPLOY_TENANT_GUARD_SWEEP + (الاستراتيجي) P0_RLS_RUNTIME_ROLE_SWITCH عند توفّر السرّ
```

## تدقيق UTF-8
`UTF8_ARABIC_AUDIT: PASS`

## ملاحظة استراتيجية
هذه الإصلاحات تعالج ثغرات محدّدة. **الحل الجذري** يبقى تبديل دور التشغيل إلى `nama_medical_app` (يُفعّل الـ115 FORCE فيُغلق كل فئة IDOR على مستوى DB دفعةً واحدة) — محجوب على السرّ.

`SECURITY_TENANT_GUARD_SWEEP_COMPLETE`
