# NM_GLOBAL_GATES — قواعد Auto Pilot العامة لنظام الطبيب

## متى تُستخدم
كل بوابة وكل مهمة بدون استثناء. يجب تفعيلها دائماً مع أي Skill أخرى.

## الهدف
ضمان تنفيذ آمن، تسلسلي، قائم على الأدلة لكل مراحل نظام الطبيب.

## قواعد إلزامية (لا استثناء)
```
STOP_ON_FAILURE: YES — أي فشل يوقف التنفيذ فوراً
NO_PRODUCTION_WITHOUT_APPROVAL: YES — لا لمس Production بدون تصريح صريح
NO_SECRETS_PRINTED: YES — لا طباعة كلمات مرور / tokens / private keys / .env
NO_PHI_PRINTED: YES — لا بيانات مرضى حقيقية
NO_FORCE_PUSH: YES — ممنوع force push
NO_DDL_WITHOUT_APPROVAL: YES — لا ALTER/DROP/CREATE بدون تصريح
NO_MIGRATIONS_WITHOUT_APPROVAL: YES — لا migrations بدون موافقة
NO_DEPLOY_WITHOUT_APPROVAL: YES — لا deploy بدون موافقة صريحة
ARABIC_UTF8_ONLY: YES — كل التوثيق العربي UTF-8 نظيف
NO_MOJIBAKE: YES — احجب Ø Ù ï»¿ و المحارف التالفة
SMALLEST_SAFE_DIFF: YES — أصغر تغيير آمن يحقق الهدف
EVIDENCE_BEFORE_PASS: YES — لا ادعاء نجاح بدون إخراج أوامر حقيقي
GATE_BY_GATE: YES — نفّذ بوابة بوابة، لا تقفز
```

## خطوات التنفيذ
```bash
# GATE 0 — Preflight (في كل بداية)
git branch --show-current              # اعرض الفرع
git status --short                      # نظيف أو وصف التغييرات
# لا تغيير في هذه الخطوة
```

## أدلة النجاح
- عرض git status واضح
- عرض الفرع الحالي
- تأكيد: production_touched=NO, secrets_printed=NO

## حالات الحظر
- Git dirty بتغييرات غير مفهومة → BLOCKED_WORKTREE_DIRTY
- فشل health check → BLOCKED_HEALTH_CHECK_FAILED
- محتوى مكسور UTF-8 → BLOCKED_ENCODING_AUDIT_FAILED
- أسرار في الكود → BLOCKED_SECRETS_DETECTED

## صيغة التقرير المختصر
```
GATE: X | STATUS: PASS/BLOCKED
branch: [name] | git: clean/dirty
production_touched: NO | secrets_printed: NO | PHI_printed: NO
force_push_used: NO | DDL_executed: NO | deploy_executed: NO
next_action: [وصف]
```
