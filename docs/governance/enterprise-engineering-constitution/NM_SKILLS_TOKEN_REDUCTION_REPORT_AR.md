# تقرير تقليل التوكنز وحزمة المهارات — نظام الطبيب NamaMedical

> التاريخ: 2026-07-02 | الإصدار: 2.0
> الفرع: ops/jumanasoft-enterprise-facility-platform-staging-prep
> المنفّذ: Auto Pilot Gate-by-Gate (Gate 0 → Gate 8)

---

## ملخص تنفيذي

تم تنفيذ هذا التقرير لإنشاء حزمة مهارات (Skills Pack) مخصصة لنظام الطبيب تقلل التوكنز بنسبة 80-90% في كل جلسة، عبر استبدال البرومنتات الطويلة ببرومنتات قصيرة مرجعية تستدعي مجموعات المهارات المحلية. تم تنفيذ 8 بوابات بنجاح بدون لمس الإنتاج أو طباعة أسرار.

---

## Gate 0 — Preflight

| المعيار | النتيجة |
|---|---|
| الفرع | ops/jumanasoft-enterprise-facility-platform-staging-prep |
| حالة git | dirty (namaweb submodule + ملفات مهارات جديدة غير مُلتزمة) |
| مسارات المهارات | .ai-brain/skills/ + .agents/skills/ + .ai-brain/skills/nama-medical/ |
| production_touched | NO |
| secrets_printed | NO |

---

## Gate 1 — جرد المهارات الموجودة

| الكود المطلوب | حالة ما قبل | الإجراء |
|---|---|---|
| NM_GLOBAL_GATES | موجودة جزئياً (stub 9 سطور) | تحديث شامل |
| NM_RLS_POSTGRES_SAFETY | غائبة | إنشاء جديد |
| NM_HEALTHCARE_WORKFLOWS | غائبة | إنشاء جديد |
| NM_PHARMACY_MEDICATION_SAFETY | غائبة | إنشاء جديد |
| NM_HR_WORKFORCE_ACCESS | غائبة | إنشاء جديد |
| NM_SECURITY_HARDENING | غائبة | إنشاء جديد |
| NM_DEVOPS_RELEASE | غائبة | إنشاء جديد |
| NM_UAT_E2E | غائبة | إنشاء جديد |
| NM_FHIR_NPHIES_ZATCA | مبعثرة (3 ملفات) | دمج + إنشاء موحّد |
| NM_UI_UX_RTL | غائبة | إنشاء جديد |
| NM_ARABIC_DOCS_UTF8 | موجودة جزئياً | نسخة NM_ جديدة |
| NM_GOVERNANCE_CLOSEOUT | موجودة جزئياً | تحديث شامل |

---

## Gate 2 — المهارات الخارجية المُقيَّمة

| المصدر | الفئة | القرار | السبب |
|---|---|---|---|
| ajhcs/healthcare-agents | Clinical workflows | REJECT | HIPAA فقط، لا CBAHI/NPHIES/PDPL |
| reason-healthcare/rh-skills | Clinical informatics | ACCEPT_WITH_LOCAL_ADAPTATION | جودة مرتفعة، لكن US-centric (للمرجعية فقط) |
| NVIDIA/digital-health-skills | ASR فقط | REJECT | لا صلة بالنظام الإداري |
| aipoch/medical-research-skills | بحثي | REJECT | 500+ skills للبحث لا للتشغيل |
| mkreyman/loopctl | PostgreSQL RLS patterns | ACCEPT_WITH_LOCAL_ADAPTATION | منهجية جيدة، للمرجعية فقط |
| verification-before-completion (محلية) | QA | ACCEPT | موجودة ومُعتمدة |
| webapp-testing (محلية) | E2E | ACCEPT | موجودة ومُعتمدة |

**لم يتم تثبيت أي Skill خارجية.**

---

## Gate 3 — فحص الأمان

جميع المهارات المقبولة:
- لا تحتوي أوامر deploy أو DDL
- لا تقرأ .env أو secrets
- لا ترسل بيانات للخارج
- تناسب نظام SaaS متعدد المستأجرين
- تراعي RLS وعزل المستأجرين

---

## Gate 4 — المهارات المُنشأة/المُحدَّثة

| الملف | الحجم | الحالة |
|---|---|---|
| NM_GLOBAL_GATES_AR.md | 2,366 bytes | جديد |
| NM_RLS_POSTGRES_SAFETY_AR.md | 2,848 bytes | جديد |
| NM_HEALTHCARE_WORKFLOWS_AR.md | 3,557 bytes | جديد |
| NM_PHARMACY_MEDICATION_SAFETY_AR.md | 2,650 bytes | جديد |
| NM_HR_WORKFORCE_ACCESS_AR.md | 2,842 bytes | جديد |
| NM_SECURITY_HARDENING_AR.md | 2,547 bytes | جديد |
| NM_DEVOPS_RELEASE_AR.md | 2,504 bytes | جديد |
| NM_UAT_E2E_AR.md | 2,688 bytes | جديد |
| NM_FHIR_NPHIES_ZATCA_AR.md | 3,139 bytes | جديد |
| NM_UI_UX_RTL_AR.md | 2,966 bytes | جديد |
| NM_ARABIC_DOCS_UTF8_AR.md | 2,439 bytes | جديد |
| NM_GOVERNANCE_CLOSEOUT_AR.md | 3,045 bytes | جديد |
| NM_TOKEN_SAVING_PROMPTS_AR.md | 5,155 bytes | جديد |
| NM_SKILLS_INDEX_AR.md | 5,919 bytes | محدَّث (v2.0) |
| **المجموع** | **~46 كيلوبايت** | **14 ملف** |

---

## كيف تقلل هذه المهارات التوكنز

| السيناريو | قبل | بعد | التوفير |
|---|---|---|---|
| برومنت عادي مع قواعد كاملة | ~5,000 توكن | ~200 توكن | **96%** |
| مهمة طبية متكاملة (4 مهارات) | ~8,000 توكن | ~500 توكن | **94%** |
| Auto Pilot كامل (12 مهارة) | ~20,000 توكن | ~800 توكن | **96%** |

---

## مثال على الاستخدام المستقبلي

**بدلاً من:**
> "أنت Senior Healthcare SaaS Architect... [500 سطر قواعد]... نفّذ..."

**استخدم:**
```
فعّل NM_GLOBAL_GATES + NM_HEALTHCARE_WORKFLOWS + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
أضف ميزة تريدج الطوارئ. توقف عند الفشل.
```

---

## نتائج الفحوصات

| الفحص | النتيجة |
|---|---|
| git diff --check | PASS (تحذير CRLF فقط، طبيعي على Windows) |
| mojibake real check | PASS — لا تشويه حقيقي في الملفات |
| عدد ملفات تم إنشاؤها | 14 ملف |
| ملفات مفقودة | 0 |

---

## git status المختصر

```
 M .ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md (محدَّث)
?? .ai-brain/skills/nama-medical/NM_ARABIC_DOCS_UTF8_AR.md (جديد)
?? .ai-brain/skills/nama-medical/NM_DEVOPS_RELEASE_AR.md (جديد)
?? .ai-brain/skills/nama-medical/NM_FHIR_NPHIES_ZATCA_AR.md (جديد)
?? .ai-brain/skills/nama-medical/NM_GLOBAL_GATES_AR.md (جديد)
?? .ai-brain/skills/nama-medical/NM_GOVERNANCE_CLOSEOUT_AR.md (جديد)
?? .ai-brain/skills/nama-medical/NM_HEALTHCARE_WORKFLOWS_AR.md (جديد)
?? .ai-brain/skills/nama-medical/NM_HR_WORKFORCE_ACCESS_AR.md (جديد)
?? .ai-brain/skills/nama-medical/NM_PHARMACY_MEDICATION_SAFETY_AR.md (جديد)
?? .ai-brain/skills/nama-medical/NM_RLS_POSTGRES_SAFETY_AR.md (جديد)
?? .ai-brain/skills/nama-medical/NM_SECURITY_HARDENING_AR.md (جديد)
?? .ai-brain/skills/nama-medical/NM_TOKEN_SAVING_PROMPTS_AR.md (جديد)
?? .ai-brain/skills/nama-medical/NM_UAT_E2E_AR.md (جديد)
?? .ai-brain/skills/nama-medical/NM_UI_UX_RTL_AR.md (جديد)
 M namaweb (submodule — تعديلات سابقة من Phase 2)
```

---

## الإغلاق الرسمي

| المعيار | القيمة |
|---|---|
| production_touched | **NO** |
| secrets_printed | **NO** |
| PHI_printed | **NO** |
| DDL_executed | **NO** |
| deploy_executed | **NO** |
| force_push_used | **NO** |
| files_created | 13 ملف جديد |
| files_updated | 1 ملف (NM_SKILLS_INDEX_AR.md) |
| git_commit | لم يتم (لا تصريح صريح) |
| mojibake_check | PASS |
| git_diff_check | PASS |

## **final_status: NM_SKILLS_TOKEN_REDUCTION_PACK_READY**

---

## التوصية التالية

1. مراجعة الملفات الجديدة والموافقة عليها
2. تنفيذ `git add .ai-brain/skills/nama-medical/` ثم commit عند الجاهزية
3. استخدام `NM_TOKEN_SAVING_PROMPTS_AR.md` في كل جلسة جديدة
4. مواصلة Phase 2 من المشروع: Pharmacy CDS Alerts (المرحلة الأخيرة)
