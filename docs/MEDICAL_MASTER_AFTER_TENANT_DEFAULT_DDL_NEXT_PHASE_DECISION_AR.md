# قرار المرحلة التالية بعد tenant_id DEFAULT DDL (Master Reselect)

> المرحلة: `P0_RLS_TENANT_ID_DEFAULT_POST_DDL_MONITORING_AND_RESELECT` | التاريخ: 2026-06-21.
> مدخل القرار: post-DDL monitoring = **PASS** (31/31 recheck، 0 أخطاء 42501/RLS جديدة)، لا `TEST_ACCOUNT_READY`.

## مقارنة الخيارات
| الخيار | الوصف | القرار | السبب |
| --- | --- | --- | --- |
| A | Full Browser E2E UAT بحساب اختبار | **مرفوض الآن** | `TEST_ACCOUNT_READY` لم يصدر (قاعدة صريحة) |
| B | audit-reader runtime GRANT + deploy محكوم | مؤجّل | ميزة خاملة آمنة (NOLOGIN، غير ممنوحة)؛ خطر منخفض؛ ليست الأعلى أولوية |
| **C** | **defense-in-depth ختم tenant_id في الكود + توفيق فرعَي namaweb** | **مُختار** | أعلى خطر متبقٍّ بنيوياً: الكود المنشور (039a7d7) لا يختم tenant_id (يعتمد على DEFAULT وحده)، وlogAudit 6-أعمدة، وتشعّب الفرعين يعني أن إصلاحاتي الأمنية ليست في الفرع الحي |
| D | accounting posting controlled enablement | **مرفوض** | محظور بلا أمر صريح؛ تفعيل المحاسبة بوابة كبرى منفصلة؛ يبقى OFF |
| E | clinical workflow UAT expansion | مؤجّل | يحتاج حساب اختبار/أدنى أولوية من الدين البنيوي |

## القرار
```text
SELECTED_NEXT_PHASE: C — P1_RLS_CODE_LEVEL_TENANT_STAMPING_DEFENSE_IN_DEPTH_AND_NAMAWEB_RECONCILIATION (candidate)
PRIORITY: P1 (دفاع-في-العمق + حوكمة؛ الخطر الوظيفي مرفوع بالفعل بالـDEFAULT)
SCOPE (مقترح، مُقاس — لا churn أعمى لـ44 مسار):
  1. توفيق فرعَي namaweb: تحديد أي من commits الأمنية الخاصة بي (logAudit stamping، blood-bank stamping) مفقود من 039a7d7، وقرار دمج آمن (cherry-pick انتقائي، بلا force/overwrite).
  2. إعادة ختم tenant_id كـcode candidate للمسارات الأعلى قيمة (logAudit + blood-bank + عينة) كدفاع-في-العمق فوق DEFAULT.
  3. candidate فقط — لا deploy/restart بلا موافقة لاحقة.
WHY_NOT_RELY_ON_DEFAULT_ALONE: الـDEFAULT شبكة أمان على مستوى القاعدة؛ لو أُسقط أو أُضيف جدول FORCE-RLS بلا default يعود الانحدار؛ والكود يبقى "غير صحيح" + إصلاحاتي ليست في الفرع المنشور.
GUARDRAILS: لا تفعيل محاسبة، لا audit-reader GRANT، لا Stitch، حتى أوامر صريحة.
```

## ملاحظة
هذا قرار/توصية فقط؛ لا أبدأ المرحلة C بلا توجيه `ابدأ وضع` صريح من المالك (حوكمة: لا يحدد آخر تقرير المرحلة وحده). البديل المقبول: المالك يختار B أو D (بموافقة) أو يؤجّل.

`NEXT_PHASE_DECISION_COMPLETE`
