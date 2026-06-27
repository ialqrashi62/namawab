# مهارة تدقيق نهايات الـ API (API Endpoints Audit)

## Purpose
تدقيق كل نهاية API: الطريقة، المسار، الغرض، الموديول، أنواع المنشآت المسموحة، المصادقة، الصلاحية، عزل المستأجر، إنفاذ استحقاق المنشأة، التحقق، idempotency، rate limiting، معالجة الأخطاء، التسجيل، الاختبارات، المخاطر.

## When to Use
عند تدقيق طبقة الـ API أو بعد إضافة/تعديل مسارات.

## Inputs Needed
كل `app.(get|post|put|patch|delete)` في server.js (~371 مساراً)، الـ middlewares، دوال السياق.

## Procedure
1. استخرج كل المسارات مع سلسلة الـ middleware.
2. صنّف كلاً: requireAuth فقط؟ requireTenantScope؟ يصفّي tenant_id في الاستعلام؟ يختم في create؟ يتحقّق من الملكية؟
3. حدّد الفئة: آمن / يحتاج تحسين / خطر / مكسور / غير معروف.
4. ربط بالموديول وأنواع المنشآت المسموحة.

## Safety Rules
قراءة فقط. لا طباعة أسرار. كل تصنيف بدليل (مسار/سطر).

## Output Format
`docs/MEDICAL_API_ENDPOINTS_AUDIT_AR.md` — جدول: Method | Path | الموديول | منشآت مسموحة | Auth | Permission | Tenant | Entitlement | Validation | Rate-limit | الأخطاء | Tests | المخاطر | التصنيف.

## Done Criteria
كل نهاية مصنّفة بأدلة، المسارات الخطرة/المكسورة مُحدّدة بإجراءات.
