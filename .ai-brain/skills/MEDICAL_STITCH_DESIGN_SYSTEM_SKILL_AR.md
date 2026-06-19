# MEDICAL_STITCH_DESIGN_SYSTEM_SKILL_AR

## الهدف

اعتماد مشروع Google Stitch التالي كمصدر التصميم الرسمي لنظام الطبيب:

https://stitch.withgoogle.com/projects/17612445146025313712

أي إضافة شاشة جديدة، قسم جديد، بطاقة جديدة، لوحة تحكم جديدة، أو إعادة تصميم كبيرة يجب أن تمر عبر Stitch Design Source قبل تطبيقها في الكود.

## القاعدة الذهبية

لا تنفذ UI جديد من التخمين إذا كان المطلوب شاشة أو قسم أو تدفق جديد. يجب أولاً:

1. مراجعة التصميم الحالي في Stitch.
2. استخراج/مطابقة نمط التصميم.
3. كتابة Design Mapping قبل الكود.
4. تطبيق الشاشة في `namaweb` بنفس tokens والأنماط.
5. تشغيل UI QA.
6. توثيق الفرق بين Stitch والكود.

## متى تُستخدم هذه Skill؟

تُستخدم إلزامياً عند:

* إضافة قسم جديد.
* إضافة صفحة جديدة.
* إضافة شاشة Dashboard جديدة.
* إعادة تصميم شاشة موجودة.
* إضافة workflow جديد مثل:
  * Doctor Orders
  * eMAR
  * Bed Management
  * Surgery/OR
  * Insurance/NPHIES
  * Patient Portal
  * Admin Control Center
* تعديل كبير في sidebar/topbar/cards/tables/forms.
* بناء واجهة جوال جديدة.
* تحويل تصميم من Stitch أو Figma إلى كود.

ولا تُستخدم عند:

* إصلاح bug backend.
* RLS/security-only.
* backup/restore.
* تعديل نص صغير.
* migration/database-only.
* logs/monitoring-only.

## طريقة العمل الإلزامية قبل الكود

قبل تنفيذ أي UI جديد:

1. افتح أو راجع رابط Stitch:
   https://stitch.withgoogle.com/projects/17612445146025313712
2. حدد الشاشة أو النمط الأقرب.
3. وثق:
   * layout pattern
   * card style
   * typography
   * color tokens
   * spacing
   * buttons
   * forms
   * tables
   * empty/loading/error states
   * Arabic/English/RTL behavior
   * mobile behavior
4. أنشئ Design Mapping صغير في التقرير أو داخل خطة التنفيذ.
5. لا تبدأ الكود إلا بعد وضوح mapping.

## قواعد التطبيق داخل namaweb

عند تطبيق التصميم:

* استخدم الملفات الحالية:
  * namaweb/public/index.html
  * namaweb/public/login.html
  * namaweb/public/css/styles.css
  * namaweb/public/css/tailwind-compiled.css
  * namaweb/public/js/app.js
  * namaweb/public/js/login.js
* لا تضف مكتبات UI ضخمة بدون إذن.
* لا تكسر RLS أو auth أو session.
* لا تغيّر DB.
* لا تستخدم بيانات مرضى حقيقية.
* حافظ على warning:
  HTTPS-secured staging environment - Not production ready.
* حافظ على Arabic/English bilingual readiness.
* حافظ على RTL.
* اجعل الجداول responsive.
* اجعل الحالات الفارغة والأخطاء والتحميل واضحة.
* لا تعرض أي بيانات حقيقية.

## قاعدة Design Drift

إذا اختلف الكود عن Stitch:

* وثق سبب الاختلاف.
* الاختلاف مسموح فقط إذا:
  * قيود تقنية.
  * أمن/خصوصية.
  * قابلية وصول.
  * responsive/mobile.
  * توافق مع الكود الحالي.
* لا تغيّر الهوية البصرية بدون سبب.

## قاعدة إضافة قسم جديد

عند طلب إضافة قسم جديد:

1. ابدأ بـ Stitch Prompt أو Stitch Reference.
2. أنشئ screen spec.
3. أنشئ route/module plan.
4. نفّذ UI shell فقط أولاً.
5. أضف API/backend فقط في مرحلة منفصلة.
6. شغّل:
   * npm run build:css
   * node --check public/js/app.js
   * node --check public/js/login.js
   * node e2e_local_smoke_test.js
7. أنشئ تقرير UI.
8. حدّث AI_PROJECT_MEMORY.md.

## قاعدة التحويل من Stitch إلى كود

إذا تم تنزيل code zip من Stitch:

* لا تنسخه مباشرة فوق النظام.
* افحصه أولاً.
* استخرج منه:
  * layout
  * components
  * class names المفيدة
  * spacing/colors
* طبّقه تدريجياً داخل النظام الحالي.
* لا تضف ملفات غير ضرورية.
* no secrets or unauthorized assets.
* لا ترفع zip إلى Git إلا إذا كان مطلوباً ومرخصاً وآمناً.

## اختبارات إلزامية بعد أي UI من Stitch

* npm run build:css
* node --check server.js
* node --check db_postgres.js
* node --check public/js/app.js
* node --check public/js/login.js
* node e2e_local_smoke_test.js
* HTTPS smoke إذا تم النشر
* UI visual smoke للشاشة الجديدة
* mobile/responsive smoke
* Arabic UTF-8 audit

## صيغة تقرير أي مرحلة UI تعتمد على Stitch

كل تقرير يجب أن يحتوي:

* Stitch source URL.
* الشاشة أو القسم المستند إلى Stitch.
* Design mapping.
* الملفات المعدلة.
* ما تم تطبيقه.
* ما لم يتم تطبيقه ولماذا.
* نتائج الاختبارات.
* هل يوجد design drift؟
* هل تم النشر على Staging؟
* هل warning صحيح؟
* هل Production-ready؟
  NO

## قواعد Git

* لا تضف .env.
* لا تضف backups.
* no logs or keys.
* لا تضف ملفات Stitch zip إلا إذا تم اعتمادها.
* commit واضح.
* push بعد الاختبارات فقط.

## نهاية Skill
