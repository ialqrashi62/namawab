# Phase A1 — إغلاق EMR Lock/Signature

> 2026-06-22 | candidate مُصمَّم ومُرهَّن (PASS)؛ توقّف قبل DDL الإنتاج/نشر الكود لحين موافقة صريحة. لا تغيير إنتاجي.

## ملخّص
صُمّمت آلية قفل/توقيع السجل الطبي (draft→signed→locked + amendments + audit)، أُعدّ مرشّح DDL (إضافي، الجداول السريرية فارغة ⇒ بلا backfill/PHI)، **ورُهِن على قاعدة معزولة بنجاح (10/10)** تحت دور non-superuser: أثبت القفل ومنع التعديل بعد القفل وعزل RLS ومنع التزوير. الكود (endpoints/UI) موثّق كنطاق دقيق ولم يُنفَّذ على الحيّ (إبقاء main نظيفة + كود سريري يحتاج موافقة نشر).

## الحقول
```text
FINAL_STATUS: PHASE_A1_EMR_LOCK_SIGNATURE_CANDIDATE_READY_PENDING_DDL_APPROVAL
EMR_LOCK_SIGNATURE_STATUS: DESIGNED + DDL_CANDIDATE + REHEARSAL_PASS (code scope documented, not deployed)
TABLES_AFFECTED (مقترح): medical_records, nursing_assessments, medical_reports, medical_certificates, surgery_anesthesia_records (+ جدول جديد emr_amendments) — كلها فارغة الآن
APIS_AFFECTED (مقترح): POST /sign, POST /amend, تحصين UPDATE/DELETE بـemr_status<>'locked'
UI_AFFECTED (مقترح): زر Sign/Finalize, badge Signed/Locked, amendment modal, disabled edit, audit display
DDL_EXECUTED: NO (rehearsal على قاعدة معزولة فقط، أُسقطت)
DATA_CHANGED: NO
CODE_DEPLOYED: NO
TESTS_RUN: rehearsal 10/10
TESTS_PASS: YES (rehearsal)؛ live-code tests pending implementation
RBAC_STATUS: مصمّم (Doctor/Nurse/Admin؛ amend عبر مسار مدقّق)
RLS_STATUS: محفوظ (emr_amendments FORCE+policy؛ كل العمليات tenant-scoped)
TENANT_ISOLATION_STATUS: مُثبَت في rehearsal (ctx999=0، forge 42501)
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
HEALTH_STATUS: 200 (domain + local)
ROLLBACK_READY: YES (down.sql + الجداول فارغة)
SECRETS_PRINTED: NO
FORCE_PUSH_USED: NO
GIT_COMMIT: docs only (هذه الحزمة)
GIT_PUSH: FF
NEXT_RECOMMENDED_ACTION: موافقة صريحة لتنفيذ DDL + نشر الكود (يُفضّل على فرع phase-a1-emr-lock ثم نشر محكوم + smoke؛ ومثالياً Browser E2E بحساب اختبار). توجيه مقترح: APPROVE_EMR_LOCK_SIGNATURE_DDL_AND_DEPLOY
```

## لماذا التوقّف عند candidate
- DDL على جداول سجل طبي (PHI) + نشر كود يغيّر سلوك تحرير السجل السريري = يستحق موافقة نشر صريحة (نمط daily_close: رُهِن ثم نُفِّذ بموافقة منفصلة).
- إبقاء `namaweb/main` نظيفة (لا أترك working tree متّسخاً كحالة R17 السابقة)؛ التنفيذ يكون على فرع مخصّص عند الموافقة.

تم تجهيز مرشح EMR Lock/Signature وتوقفت قبل DDL الإنتاج لحين موافقة backup/rehearsal
