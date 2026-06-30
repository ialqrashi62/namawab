# الدفعة 4C — مراجعة أمنية وتجارية (GATE 8)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-max-users-enforcement-candidate`.
**المُراجَع:** `entitlements.js` (+56، `countTenantUsers` + `makeUserLimitGuard`)، `server.js` (+8، init + إدراج الحارس)، `max_users_enforcement_test.js` (جديد).

## 1) قائمة التحقق الأمني
| البند | النتيجة | الدليل |
|---|---|---|
| لا enforcement افتراضي | ✅ | `ENTITLEMENTS_ENABLED != 'true'` → `next()` فوراً (بلا استعلام). مُختبَر (no-op + لا audit). |
| لا كسر عند غياب e25 | ✅ | resolver **fail-open** → defaults (max_users=null=غير محدود) → يسمح. مُختبَر (pool يرمي → 200). |
| لا production config / DDL | ✅ | لا env، لا نشر، لا DDL، لا e25. |
| لا route حساس بلا RBAC | ✅ | الحارس **بعد** `requireAuth`+`requireRole('settings')`+`requireTenantAdmin`. مُختبَر: غير الأدمن 403 قبل بلوغ منطق الحدّ. |
| لا client-side-only limit | ✅ | الحساب على الخادم؛ `tenantId` من الجلسة فقط. |
| لا bypass عبر tenant_id منتحَل | ✅ | `tenantId = req.session.user.tenantId` — **لا يُقرأ من الجسم**. |
| لا احتساب خاطئ لـ super admin خارج المستأجر | ✅ | العدّ tenant-scoped عبر `user_tenants WHERE tenant_id=? AND is_active=true`. |
| لا invoice / branches / modules enforcement | ✅ | نقطة واحدة فقط: إنشاء المستخدم. لا ربط بأي مسار آخر. |
| لا دفع / أسرار / hard delete | ✅ | لا شيء من ذلك؛ فحص الأسرار نظيف؛ قراءة + منع فقط. |
| رسالة المنع بلا تفاصيل داخلية | ✅ | `409` برسالة ثنائية اللغة + `code`؛ لا أسماء جداول/استعلامات. مُختبَر. |

## 2) المراجعة التجارية
- **مصفوفة سلوك واضحة:** disabled=no-op · observe=تسجيل بلا منع · enforce=منع عند `usage >= max_users`.
- **غير المحدود محترَم:** `max_users=null` → يسمح دائماً.
- **fail-open:** أي خطأ حلّ/عدّ → يسمح + `USER_CREATE_LIMIT_FAILOPEN` (لا يكسر إنشاء المستخدمين على خطأ داخلي).
- **تدقيق كامل:** OBSERVED / BLOCKED / FAILOPEN — بلا أسرار/PII.
- **409** (تعارض حالة المورد) للحدّ، تمييزاً عن **403** (RBAC).

## 3) المخاطر المتبقية (موثّقة، مقبولة)
1. **فجوة العدّ:** `POST /api/settings/users` لا يربط `user_tenants`، فالعدّ عبره قد لا ينمو؛ **يجب تأكيد/إصلاح ربط العضوية قبل التفعيل الحيّ** (مدرَج في runbook التفعيل). للمرشّح: العدّ صحيح دلالياً («أعضاء المستأجر النشطون»).
2. **مسار إنشاء ثانٍ (onboarding) غير مربوط** — مقصود (نطاق 4C = نقطة واحدة).
3. **لا تفعيل حيّ** — يبقى خلف flags؛ التفعيل بعد نجاح 4B على staging (observe ثم enforce على staging فقط).

## 4) الحكم
**لا enforcement افتراضي، لا كسر، RBAC أولاً، tenant من الجلسة، fail-open، نقطة واحدة.** → `PASS`.
