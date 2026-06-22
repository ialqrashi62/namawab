# Phase A — الإغلاق النهائي (مع تبعية مفتاح تشفير A3)

> 2026-06-22 | تُغلق Phase A (تصلّب الأمان وسلامة الإكلينيكي بعد القبول) رسمياً. كل البنود العملية الآمنة نُفِّذت وتُحقّق منها عبر OPTION_2 (بلا كلمة مرور في المتصفح، بلا كشف أسرار). البند الوحيد المتبقّي — **تشفير at-rest الكامل (A3)** — محجوب على تبعية بنية مفاتيح خارجية/KMS (قرار بنية تحتية للمالك). هذا التقرير لا يُحدث أي تغيير إنتاجي (docs فقط).

## ملخّص البنود المنفّذة
| البند | الحالة | الإثبات / المرجع |
|---|---|---|
| **A1 — EMR Lock/Signature (backend)** | منشور ومُتحقَّق | sign/amend/amendments، قفل `emr_status`, sha256 integrity، RLS+tenant، FORCE_RLS 148→149 |
| **A1 — EMR Lock/Signature (UI)** | منشور ومُتحقَّق (OPTION_2) | زر توقيع + badge + amendment modal + أعمدة Status/Actions؛ static 8/8، harness 13/13 |
| **A2 — MFA (TOTP، opt-in)** | منشور ومُتحقَّق (OPTION_2) | crypto مدمج RFC-6238؛ enroll/verify/2FA/recovery/disable/admin-reset؛ harness 22، static 19/19؛ +تصليب مراجعة أمان (brute-force/replay/session-fixation/step-up) |
| **A3A — PHI File Guard** | منشور ومُتحقَّق (OPTION_2) | خزنة خارج الويب-روت + `GET /api/phi-files/:id` (auth+RLS+traversal-deny+content-type pinning+audit)؛ legacy hard-404؛ FORCE_RLS 149→150؛ harness 18/18 |
| **A3B — تجميد رفع PHI** | مرفوع للرفع المحمي فقط | PHI_UPLOAD_ALLOWED = عبر المسار المحمي فقط |
| **النسخ الاحتياطي غير المراقب** | مُتحقَّق | مهمة مجدولة يومية pg_dump عبر pgpass (بلا سرّ في السكربت/Git)؛ pg_restore -l صالح |
| **تصلّب التدقيق** | منشور ومُتحقَّق | FAILED_LOGIN (مساري 401) + LOGOUT + أحداث MFA مُدقّقة |
| **تنظيف حسابات E2E** | مكتمل | 4 حسابات e2e_* soft-disabled + سحب صلاحيات؛ 77 صفّ تدقيق محفوظ؛ مستخدمون إنتاجيون بلا تغيير؛ ملف الاعتماد حُذف |
| **A3 — تشفير at-rest الكامل** | **محجوب** | لا KMS/مفتاح خارجي جاهز؛ توقّف بلا تغيير إنتاجي (Gate 1) |

## الحقول
```text
FINAL_STATUS: PHASE_A_CLOSED_WITH_A3_ENCRYPTION_KEY_DEPENDENCY
A1_BACKEND_STATUS: DEPLOYED_AND_VERIFIED
A1_UI_STATUS: DEPLOYED_AND_VERIFIED
A2_MFA_STATUS: DEPLOYED_AND_VERIFIED
A3A_PHI_FILE_GUARD_STATUS: DEPLOYED_AND_VERIFIED
A3B_UPLOAD_FREEZE_STATUS: LIFTED_FOR_GUARDED_UPLOADS_ONLY
BACKUP_STATUS: UNATTENDED_VERIFIED
AUDIT_HARDENING_STATUS: DEPLOYED_AND_VERIFIED
E2E_ACCOUNTS_CLEANUP_STATUS: COMPLETED
A3_FULL_ENCRYPTION_STATUS: BLOCKED_PENDING_KMS_OR_EXTERNAL_RUNTIME_KEY
OPEN_INFRA_DEPENDENCIES: at-rest key (one of: owner external key-file excluded-from-backup | Windows DPAPI | cloud KMS) — AES-256-GCM envelope design ready; offsite+encrypted backups also gated on same key
PRODUCTION_HEALTH: local 200, domain 200
FORCE_RLS_COUNT: 150
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
PHI_UPLOAD_ALLOWED: YES_THROUGH_GUARDED_ROUTE_ONLY
MFA_ENFORCEMENT_MODE: OPT_IN_NOT_GLOBAL
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
FORCE_PUSH_USED: NO
R17_STATUS: UNTOUCHED (namaweb master 10ded01; my line = origin/main 15e6dfa)
NEXT_RECOMMENDED_ACTION: CHOOSE_PHASE_B_OR_PROVIDE_KMS_FOR_A3_ENCRYPTION
```

## المتبقّيات المفتوحة (تبعية بنية تحتية / قرار مالك)
1. **تشفير at-rest الكامل (A3)** — `mfa_secret` (نصّ حالياً؛ recovery codes مُجزّأة bcrypt أصلاً) + ملفات `phi_vault` (0 ملف حالياً؛ الوصول محمي بـA3A). يحتاج مفتاحاً خارجياً: ملف يضعه المالك (مستثنى من النسخ) أو Windows DPAPI أو KMS سحابي. الكود جاهز فور توفّر المفتاح. مرجع: `docs/PHASE_A3_FULL_ENCRYPTION_AT_REST/01_CLOSEOUT_AR.md`.
2. **نسخ احتياطي مشفّر + offsite** — يعتمد على نفس قرار المفتاح.
3. **بوابات مالك قائمة (اختيارية، غير حاجزة)**: audit-reader GRANT، tenant_id index (59/150 مفهرسة، لا عائق أداء)، تفعيل المحاسبة (بوابة مخصّصة منفصلة، تبقى OFF). لا يُعاد طلبها — تُنفَّذ عند قرار المالك.

## ملاحظات سلامة
- لا تغيير إنتاجي في هذا الإغلاق (لا DDL، لا data، لا نشر كود، لا GRANT، لا محاسبة). التزام docs فقط، Push FF.
- لم يُطبع/يُلتزَم أي سرّ أو مفتاح. R17 لم تُمَسّ. كل ضوابط A1/A2/A3A نشطة.

تم إغلاق Phase A مع تسجيل تشفير at-rest كمتطلب بنية مفاتيح خارجية دون أي تغيير إنتاجي جديد
