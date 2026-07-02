# NM_TOKEN_SAVING_PROMPTS — برومنتات قصيرة جاهزة لنظام الطبيب

> بدلاً من تكرار 500 سطر من القواعد، استخدم هذه البرومنتات القصيرة.
> كل برومنت يستدعي مجموعة مهارات محددة من `NM_SKILLS_INDEX_AR.md`.

---

## 1. برومنت عام (أي مهمة)

```
فعّل NM_GLOBAL_GATES + NM_GOVERNANCE_CLOSEOUT.
نفّذ المهمة بأقل تعديل آمن، توقف عند الفشل، لا تلمس Production، ولا تطبع أسراراً.

المهمة: [وصف المهمة هنا]
```

---

## 2. برومنت ميزة طبية (سريرية أو إدارية)

```
فعّل NM_GLOBAL_GATES + NM_HEALTHCARE_WORKFLOWS + NM_SECURITY_HARDENING + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
نفّذ الميزة عبر Auto Pilot gate-by-gate مع مراعاة الأطباء والتمريض والصيدلية والصلاحيات.

القسم المستهدف: [طوارئ / تنويم / مختبر / أشعة / صيدلية / ...]
الميزة: [وصف الميزة]
الدور المنفّذ: [طبيب / ممرض / صيدلاني / ...]
```

---

## 3. برومنت RLS وقاعدة البيانات

```
فعّل NM_GLOBAL_GATES + NM_RLS_POSTGRES_SAFETY + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
افحص tenant isolation وFORCE RLS بدون لمس Production إلا بتصريح صريح.

الجداول المستهدفة: [أسماء الجداول]
المهمة: [وصف الفحص أو التعديل]
```

---

## 4. برومنت الصيدلية

```
فعّل NM_GLOBAL_GATES + NM_PHARMACY_MEDICATION_SAFETY + NM_HEALTHCARE_WORKFLOWS + NM_SECURITY_HARDENING + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
نفّذ سير عمل الصيدلية والوصفات والصرف والتنبيهات كمتطلبات نظامية لا كنصيحة علاجية نهائية.

المهمة الصيدلانية: [وصف]
```

---

## 5. برومنت الموارد البشرية والصلاحيات

```
فعّل NM_GLOBAL_GATES + NM_HR_WORKFORCE_ACCESS + NM_SECURITY_HARDENING + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
نفّذ الموارد البشرية والصلاحيات والحضور والأدوار بأقل صلاحية ممكنة مع Audit Logs.

المهمة: [إضافة دور / تعديل صلاحية / جدولة وردية / ...]
```

---

## 6. برومنت الواجهات والتصميم

```
فعّل NM_GLOBAL_GATES + NM_UI_UX_RTL + NM_HEALTHCARE_WORKFLOWS + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
حسّن الواجهة العربية RTL لكل دور سريري وإداري مع اختبارات smoke.

الصفحة/المكوّن: [وصف]
الأدوار المستهدفة: [طبيب / ممرض / ...]
```

---

## 7. برومنت الأمن والمراجعة الأمنية

```
فعّل NM_GLOBAL_GATES + NM_SECURITY_HARDENING + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
افحص الثغرات: XSS، SQL injection، CSRF، CORS، CSP، Rate Limiting، secrets hygiene.

النطاق: [endpoint / ملف / وحدة]
```

---

## 8. برومنت الإنتاج والنشر

```
فعّل NM_GLOBAL_GATES + NM_DEVOPS_RELEASE + NM_RLS_POSTGRES_SAFETY + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
جهّز خطة نشر أو تحقق إنتاجي بدون تنفيذ deploy إلا بتصريح صريح.
نفّذ: backup → build → health check → smoke test → تقرير.

الهدف: [وصف التغيير المراد نشره]
```

---

## 9. برومنت التكاملات السعودية

```
فعّل NM_GLOBAL_GATES + NM_FHIR_NPHIES_ZATCA + NM_SECURITY_HARDENING + NM_UAT_E2E + NM_GOVERNANCE_CLOSEOUT.
اختبر على sandbox فقط. لا اتصالات NPHIES/ZATCA حقيقية بدون موافقة صريحة.

التكامل المستهدف: [NPHIES / ZATCA / FHIR / CBAHI]
المهمة: [وصف]
```

---

## 10. برومنت Auto Pilot كامل (كل المراحل)

```
فعّل NM_GLOBAL_GATES + NM_HEALTHCARE_WORKFLOWS + NM_RLS_POSTGRES_SAFETY + NM_SECURITY_HARDENING + NM_DEVOPS_RELEASE + NM_UAT_E2E + NM_FHIR_NPHIES_ZATCA + NM_UI_UX_RTL + NM_ARABIC_DOCS_UTF8 + NM_GOVERNANCE_CLOSEOUT.
نفّذ Auto Pilot gate-by-gate، توقف عند الفشل، لا تلمس Production بدون تصريح صريح.

المهام المطلوبة:
1. [مهمة 1]
2. [مهمة 2]
3. [مهمة 3]
```

---

## 11. برومنت تقليل التوكنز للجلسات الطويلة

```
هذا برومنت استمرارية. استدعِ NM_SKILLS_INDEX_AR.md للقواعد بدل تكرارها.

الحالة الحالية: [Gate X مكتملة، Gate Y قيد التنفيذ]
المهمة المتبقية: [وصف]
قواعد إلزامية: NM_GLOBAL_GATES (مُفعَّل ضمنياً)
```

---

## ملاحظة على التوكنز

| طريقة | توكنز تقريبية | النتيجة |
|---|---|---|
| قواعد كاملة في كل برومنت | ~3,000-5,000 | مُكلف جداً |
| استدعاء NM_GLOBAL_GATES فقط | ~200 | 90% توفير |
| مجموعة متكاملة (4-6 skills) | ~500 | 85% توفير |
| برومنت Auto Pilot كامل | ~800 | 80% توفير |
