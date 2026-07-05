# تقرير إغلاق Gate 5 — عزل جداول EMR الوصفية (e21) + مرشّح RLS
**التاريخ:** 2026-07-03  •  **الحالة:** ✅ ناجح  •  **Commit محلي:** namaweb `de3ddd8` على `integration/all-epics` (لا push، لا DDL منفَّذ، لا نشر)

## المشكلة (تحقيق ميداني في Gate 5)
اكتشاف Gate 0 كان جزئيًا؛ القراءة الفعلية للمخطط + server.js كشفت الصورة الدقيقة:
- **`patient_clinical_records`** (يحمل PHI في `recorded_values`) — من migration e21 فقط، **بلا RLS وبلا FK إلى tenants**؛ الحماية app-layer فقط (`WHERE tenant_id=$`)، وقفل السجل (سطر 4044) بلا فلتر مستأجر.
- **`clinical_templates`** — **بلا tenant_id وبلا RLS**؛ ونقطة `GET /api/clinical/templates/:dept_id` كانت تقرأ `WHERE department_id=$1` **بلا أي تحقق مستأجر** → قراءة قوالب مستأجر آخر عبر تمرير dept_id أجنبي.
- **`clinical_knowledge_vectors`** (شرائح RAG) — بلا tenant_id/RLS.
- **`clinical_departments`** — له RLS فعلًا (db_postgres.js)، لكن `code` فريد **عالميًا** مع `ON CONFLICT (code)` (server.js:16884) → تصادم عبر المستأجرين (لا يمكن لمستأجرين امتلاك 'CARDIOLOGY' معًا).

## ما نُفّذ
### 1) إصلاح كود آمن فورًا (بلا DDL)
`GET /api/clinical/templates/:dept_id`: أُضيف `requireTenantScope` + **JOIN إلى `clinical_departments` المحمي بـFORCE RLS**؛ فيصبح العزل متعديًّا — dept_id أجنبي يُرجع صفرًا بدل تسريب قوالب مستأجر آخر. (اعتمادًا على RLS الموجود فعلًا على جدول الأقسام.)

### 2) مرشّح DDL e50 (لم يُنفَّذ — بانتظار اعتماد المالك)
- **FORCE RLS + FK** على `patient_clinical_records` (الأولوية — PHI).
- **tenant_id + FORCE RLS** على `clinical_templates` و`clinical_knowledge_vectors`، مع **backfill من القسم الأب** (لا `DEFAULT 1` أعمى) و**RAISE EXCEPTION** على أي صف غير محلول (يفشل بصوت عالٍ بدل إسناد PHI خطأً).
- **UNIQUE(tenant_id, code)** بدل UNIQUE(code) العالمي على `clinical_departments`.
- كل السياسات USING + WITH CHECK (حماية مسار الكتابة).
- ملفات up/down/validate كاملة.

### 3) اقتران موثّق (لم يُقلَب)
`ON CONFLICT (code)` → `ON CONFLICT (tenant_id, code)` في server.js **مقترن بالـDDL**؛ قلبه قبل تطبيق e50 يُخطئ ضد المخطط الحالي — لذا يُطبَّق e50 أولًا ثم يُقلَب الكود (موثّق في رأس المرشّح).

## الأدلة
- اختبار السلامة الساكن للمرشّح: **12/12 PASS** (يتحقق: لا DROP/DELETE في up، معاملة، FORCE RLS على PHI، backfill لا DEFAULT 1، RAISE على غير المحلول، unique لكل مستأجر، USING+WITH CHECK، down عكسي، validate).
- الحزمة الآمنة: **108/108 PASS** • `node --check` سليم.
- اختبارات RLS التكاملية (58 معطّلة) تحتاج قاعدة مُهيّأة — لا تُشغَّل هنا؛ المرشّح يُختبر ساكنًا ويُطبَّق عند بوابة DDL معتمدة.

## قائمة انتظار مرشّحات DDL (كلها لم تُنفَّذ)
e48 (أنواع درجات EWS) • e49 (إقرار النتائج) • **e50 (RLS جداول e21)** — جاهزة لبوابة اعتماد المالك.

## التالي
**Gate 6 (موجة العزل):** مرشّحات لحل **تعارضات المخطط** — e46 يعيد إنشاء `obgyn_pregnancies` رقيق يصطدم بـe14 الغني، وe43 يكرر `eye_exams` الخاص بـe38.
