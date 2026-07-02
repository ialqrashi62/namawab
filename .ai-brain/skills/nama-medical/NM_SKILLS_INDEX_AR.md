# NM_SKILLS_INDEX — فهرس مهارات نظام الطبيب (Token Reduction Pack)

> الإصدار 2.0 | محدَّث 2026-07-02
> استشهد بهذا الفهرس في كل برومنت بدلاً من تكرار القواعد الطويلة.

---

## قائمة المهارات الكاملة

| الكود | الملف | الغرض | أولوية التفعيل |
|---|---|---|---|
| **NM_GLOBAL_GATES** | `NM_GLOBAL_GATES_AR.md` | قواعد Auto Pilot العامة — لا تنفيذ بدونها | **إلزامية دائماً** |
| **NM_RLS_POSTGRES_SAFETY** | `NM_RLS_POSTGRES_SAFETY_AR.md` | RLS، عزل المستأجرين، دور التطبيق | أي بوابة DB |
| **NM_HEALTHCARE_WORKFLOWS** | `NM_HEALTHCARE_WORKFLOWS_AR.md` | كل أقسام المستشفى 20+ قسم | أي ميزة سريرية/إدارية |
| **NM_PHARMACY_MEDICATION_SAFETY** | `NM_PHARMACY_MEDICATION_SAFETY_AR.md` | الصيدلية، الوصفات، DDI/DAI، الصرف | بوابات الصيدلية |
| **NM_HR_WORKFORCE_ACCESS** | `NM_HR_WORKFORCE_ACCESS_AR.md` | الموظفون، الأدوار، الحضور، الصلاحيات | بوابات HR/RBAC |
| **NM_SECURITY_HARDENING** | `NM_SECURITY_HARDENING_AR.md` | XSS، SQL injection، CSP، CORS، Auth | أي بوابة أمنية |
| **NM_DEVOPS_RELEASE** | `NM_DEVOPS_RELEASE_AR.md` | PM2، backup، health check، نشر آمن | بوابات النشر |
| **NM_UAT_E2E** | `NM_UAT_E2E_AR.md` | Jest، smoke tests، cross-tenant tests | قبل كل نشر |
| **NM_FHIR_NPHIES_ZATCA** | `NM_FHIR_NPHIES_ZATCA_AR.md` | FHIR R4، NPHIES، ZATCA، CBAHI، PDPL | بوابات التكاملات |
| **NM_UI_UX_RTL** | `NM_UI_UX_RTL_AR.md` | Arabic RTL، ثنائية اللغة، دور-specific UI | بوابات الواجهة |
| **NM_ARABIC_DOCS_UTF8** | `NM_ARABIC_DOCS_UTF8_AR.md` | UTF-8 نظيف، لا mojibake، تقارير مختصرة | كل تقرير عربي |
| **NM_GOVERNANCE_CLOSEOUT** | `NM_GOVERNANCE_CLOSEOUT_AR.md` | إغلاق البوابة، final_status، أدلة | نهاية كل بوابة |

---

## المجموعات الجاهزة (Preset Bundles)

### 🔰 مجموعة أساسية (أي مهمة)
```
فعّل NM_GLOBAL_GATES + NM_GOVERNANCE_CLOSEOUT.
نفّذ المهمة بأقل تعديل آمن، توقف عند الفشل، لا تلمس Production، ولا تطبع أسراراً.
```

### 🔐 مجموعة RLS وقاعدة البيانات
```
فعّل NM_GLOBAL_GATES + NM_RLS_POSTGRES_SAFETY + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
افحص tenant isolation وFORCE RLS بدون لمس Production إلا بتصريح صريح.
```

### 🏥 مجموعة ميزة طبية
```
فعّل NM_GLOBAL_GATES + NM_HEALTHCARE_WORKFLOWS + NM_SECURITY_HARDENING + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
نفّذ الميزة عبر Auto Pilot gate-by-gate مع مراعاة الأطباء والتمريض والصيدلية والصلاحيات.
```

### 💊 مجموعة الصيدلية
```
فعّل NM_GLOBAL_GATES + NM_PHARMACY_MEDICATION_SAFETY + NM_HEALTHCARE_WORKFLOWS + NM_SECURITY_HARDENING + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
نفّذ سير عمل الصيدلية والوصفات والصرف والتنبيهات كمتطلبات نظامية لا كنصيحة علاجية نهائية.
```

### 👥 مجموعة الموارد البشرية
```
فعّل NM_GLOBAL_GATES + NM_HR_WORKFORCE_ACCESS + NM_SECURITY_HARDENING + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
نفّذ الموارد البشرية والصلاحيات والحضور والأدوار بأقل صلاحية ممكنة مع Audit Logs.
```

### 🛡️ مجموعة الأمن
```
فعّل NM_GLOBAL_GATES + NM_SECURITY_HARDENING + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
افحص XSS، SQL injection، CSP، CORS، rate limiting، secrets hygiene.
```

### 🎨 مجموعة الواجهات
```
فعّل NM_GLOBAL_GATES + NM_UI_UX_RTL + NM_HEALTHCARE_WORKFLOWS + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
حسّن الواجهة العربية RTL لكل دور سريري وإداري مع اختبارات smoke.
```

### 🚀 مجموعة الإنتاج
```
فعّل NM_GLOBAL_GATES + NM_DEVOPS_RELEASE + NM_RLS_POSTGRES_SAFETY + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
جهّز خطة نشر أو تحقق إنتاجي بدون تنفيذ deploy إلا بتصريح صريح.
```

### 🔗 مجموعة التكاملات
```
فعّل NM_GLOBAL_GATES + NM_FHIR_NPHIES_ZATCA + NM_SECURITY_HARDENING + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
اختبر NPHIES/ZATCA/FHIR على sandbox فقط. لا اتصالات حقيقية بدون موافقة.
```

### 🌍 مجموعة كل النظام
```
فعّل NM_GLOBAL_GATES + NM_HEALTHCARE_WORKFLOWS + NM_RLS_POSTGRES_SAFETY + NM_SECURITY_HARDENING + NM_DEVOPS_RELEASE + NM_UAT_E2E + NM_FHIR_NPHIES_ZATCA + NM_UI_UX_RTL + NM_ARABIC_DOCS_UTF8 + NM_GOVERNANCE_CLOSEOUT.
نفّذ Auto Pilot gate-by-gate على النظام كاملاً، توقف عند أول فشل.
```

---

## أمثلة برومنتات قصيرة

```
# إضافة ميزة في الطوارئ
فعّل NM_GLOBAL_GATES + NM_HEALTHCARE_WORKFLOWS + NM_UAT_E2E.
أضف [الميزة] للطوارئ. توقف عند الفشل.

# مراجعة أمنية للـ API
فعّل NM_GLOBAL_GATES + NM_SECURITY_HARDENING.
افحص [endpoint] للثغرات. لا تُعدِّل إنتاجياً.

# تحقق من RLS جديد
فعّل NM_GLOBAL_GATES + NM_RLS_POSTGRES_SAFETY + NM_UAT_E2E.
تحقق أن [جدول] معزول صحيحاً بين المستأجرين.
```

---

## المهارات الموجودة مسبقاً في `.ai-brain/skills/`

تحتوي المجلدات الأم على 59 مهارة MEDICAL_* تُغطي تفاصيل دقيقة لكل مرحلة.
استشهد بمجموعة NM_ للبرومنتات اليومية، وبـ MEDICAL_* للتفاصيل التقنية العميقة.
