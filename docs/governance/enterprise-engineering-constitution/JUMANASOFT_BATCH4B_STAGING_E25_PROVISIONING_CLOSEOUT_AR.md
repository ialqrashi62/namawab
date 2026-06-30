# الدفعة 4B — تقرير إغلاق توفير e25 على staging (GATE 12)

**التاريخ:** 2026-06-30 · الفرع: `feature/jumanasoft-staging-e25-provisioning` (توثيق فقط).
**الحالة النهائية:** **`BATCH4B_STAGING_E25_PROVISIONING_BLOCKED`** — محوّلة لتنفيذ devops اليدوي على staging.

## 1) ملخّص التنفيذ
توقّفت الدفعة عند **GATE 0** وفق شرط البدء الذي حدّدته: لا تنفيذ DDL بلا موافقة مالك صريحة على staging فقط. الحجب قائم على سببين مستقلّين، وقرار المالك = **تسليم Runbook 4B لفريق devops** لتنفيذه يدوياً على بيئة staging حقيقية. **لم يُنفَّذ أي DDL من هذه الجلسة.**

## 2) سبب الحجب (GATE 0)
1. **غياب الموافقة الصريحة:** لم تَرِد عبارة الموافقة المطلوبة («أوافق على تشغيل e25 على staging فقط، بدون production») في الطلب.
2. **غياب بيئة staging موفّرة:** لا اتصال/صلاحيات قاعدة staging معزولة في هذه الجلسة (سجلّ المشروع: توفير staging محجوب؛ الجداول غير موفّرة). البيئتان المتاحتان (محلي + الحيّ `jumanasoft.com`) **ليستا staging** — وتشغيل e25 على أيٍّ منهما يخالف «staging فقط / لا production».

## 3) القرار التشغيلي
- **المسار المعتمد:** `Runbook 4B` ([JUMANASOFT_BATCH4B_STAGING_E25_PROVISIONING_RUNBOOK_AR.md](JUMANASOFT_BATCH4B_STAGING_E25_PROVISIONING_RUNBOOK_AR.md)) — جاهز وكامل (preflight, backup, migration command, validate, seed, rollback, observe flags, smoke, owner checklist) — **ينفّذه devops يدوياً** على staging حقيقية بصلاحياتها.
- لا تنفيذ من هذه الجلسة لعدم توفّر هدف staging معتمد.

## 4) أسئلة الامتثال (إجابات صريحة)
| سؤال | الجواب |
|---|---|
| هل تم لمس production؟ | **NO.** |
| هل تم تشغيل DDL؟ | **NO.** (لا staging، ولا أي قاعدة). |
| هل تم تشغيل e25؟ | **NO** — محوّل لـ devops عبر Runbook 4B. |
| هل تم seed؟ | **NO.** |
| هل تم تفعيل observe؟ | **NO** (يبقى `ENTITLEMENTS_ENABLED=false`). |
| هل تم تفعيل enforce؟ | **NO.** |
| هل أُضيف دفع فعلي؟ | **NO.** |
| هل ظهرت أسرار؟ | **NO.** (لم يُطبع connection string/password/env). |
| force push / حذف بيانات / boilerplate / كسر دفعات؟ | **NO / NO / NO / NO.** |

## 5) ما لم يحدث (تأكيد)
لم يُنشأ فرع تنفيذي للـ DDL، ولم يُشغَّل `e25_up`، ولم تُضف بذور، ولم تُفعَّل أعلام الاستحقاقات. هذا الفرع **توثيقي فقط** (تقرير إغلاق الحالة).

## 6) المتطلّبات لرفع الحجب لاحقاً (لـ devops/المالك)
1. بيئة **staging معزولة** (قاعدة منفصلة، تطبيق منفصل، صلاحية DDL).
2. عبارة موافقة صريحة: «أوافق على تشغيل e25 على staging فقط، بدون production».
3. اتباع `Runbook 4B` خطوة-بخطوة (نسخة احتياطية أولاً → e25_up → validate (`all_ok=true`) → seed → تفعيل observe → smoke).
4. **يبقى observe فقط** — لا enforce (القاعدة 8).

## 7) خطة التراجع (إن نُفِّذ لاحقاً على staging)
- إزالة seed: حذف صفوف الخطط التجريبية (staging).
- تعطيل الاستحقاقات: `ENTITLEMENTS_ENABLED=false` (يُزيل المسار كلياً، فوري).
- التراجع عن e25: `e25_plans_pricing_candidate_down.sql` (يُسقِط 3 جداول جديدة فقط — لا بيانات قائمة على staging).
- الأثر على البيانات: لا شيء (الجداول جديدة، additive).

## 8) القرار النهائي
**BATCH4B_STAGING_E25_PROVISIONING_BLOCKED** — محوّلة لتنفيذ devops عبر Runbook 4B (بقرار المالك).

## 9) الخطوة التالية
- **devops:** تنفيذ Runbook 4B على staging عند توفّرها.
- **بالتوازي (لا يتطلّب staging):** الدفعة 4C — بناء كود إنفاذ نقطة `max_users` على `POST /api/settings/users` خلف `ENFORCEMENT_MODE=enforce` مع unit tests بـ pool وهمي، ويبقى التفعيل الحيّ مؤجّلاً حتى نجاح observe على staging.
