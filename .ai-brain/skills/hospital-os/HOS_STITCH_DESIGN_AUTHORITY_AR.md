# HOS_STITCH_DESIGN_AUTHORITY_AR
# قانون اعتماد التصميم عبر Stitch

## القاعدة الأساسية
كل تصميم UI/UX في نظام المستشفى يجب أن يكون مصدره Stitch:
- إما تصميم موجود في Stitch يتم أخذه كمصدر معتمد.
- أو تصميم جديد يتم إنشاؤه أولاً في Stitch قبل التنفيذ.
- لا يجوز تنفيذ واجهة جديدة من الخيال مباشرة داخل الكود بدون Stitch Source أو Stitch Design Prompt.

## عند توفر Stitch
استخرج من Stitch:
- Layouts.
- Design Tokens.
- Colors.
- Typography.
- Spacing.
- Components.
- States.
- Empty States.
- Loading States.
- Error States.
- Responsive behavior.
- RTL Arabic behavior.
- Accessibility notes.
- Component-to-code mapping.

## عند عدم توفر Stitch
لا تدّعِ وجود تصميم.
اكتب أولاً Stitch Prompt كامل للواجهة المطلوبة.
ثم أوقف التنفيذ بحالة:
STITCH_SOURCE_REQUIRED

## قواعد صارمة
- لا تنفذ UI قبل وجود Stitch Source أو Stitch Prompt معتمد.
- لا تكسر RTL.
- لا تستخدم بيانات مرضى حقيقية في التصاميم.
- لا تغيّر Workflow طبي لمجرد أن التصميم أجمل.
- كل شاشة طبية يجب أن تراعي السلامة، الصلاحيات، Audit، والتنبيهات.
- كل تصميم يجب أن يخضع إلى Visual Smoke Test بعد التنفيذ.

## الحالة النهائية
- STITCH_DESIGN_READY
- STITCH_SOURCE_REQUIRED
- STITCH_IMPLEMENTATION_READY
- STITCH_VISUAL_SMOKE_PASS
- STITCH_VISUAL_SMOKE_BLOCKED
