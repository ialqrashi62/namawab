---
name: jumanasoft-security-audit
description: بوابات التدقيق الأمني لجمانة سوفت — مُستخلصة من تدقيق GATE 0-18؛ قائمة تحقّق للمراجعة الأمنية.
---

# جمانة سوفت — التدقيق الأمني

مُستخلص من التدقيق المعياري (GATE 0–18) والإصلاحات المنشورة. استخدمه كقائمة مراجعة أمنية دورية.

## المصادقة والجلسة
- bcrypt (يرفض غير `$2`)، lockout (5/15د)، MFA TOTP + رموز استرداد. جلسة آمنة (`resave:false`، httpOnly، secure خلف HTTPS).
- حراسة P0 على مستخدمي النظام (إنشاء/تعديل/حذف + ترقية Admin).

## العزل والصلاحيات
- RLS FORCE على كل جدول حسّاس، دور غير ممتاز. RBAC مصفوفي fail-closed. راجع [[jumanasoft-multi-tenant-rbac]].
- منع IDOR: حمّل السجلّ مقيّداً بالمستأجر (FOR UPDATE في المالية) لا بالـ id المجرّد.

## المدخلات والمخرجات
- **المدخلات**: `validateBody` fail-closed على المسارات الحرجة (غير كاسر). المال خادمي (parseMoney/caps).
- **المخرجات (XSS)**: `escapeHTML` عند إدراج بيانات المستخدم في DOM (escapeHTML 20→373 عبر كنسات). لا تُدخِل تهريباً مزدوجاً.

## الحدود (Perimeter)
- **CSP enforce** مفعّل حيّاً (تحقّق بصري بعد أي تشديد). HTTPS (Let's Encrypt). راجعِ CORS/CSRF.
- لا أسرار في الكود/السجلّ. المستودع العام `namawab` فيه أسرار تاريخية → لا تدفع إليه؛ راجع [[namamedical-secret-exposure-public-remote]].

## المالية والتدقيق
- سلامة المال (NUMERIC + parseMoney)، idempotency على مسارات المال، audit_trail لكل طفرة (بلا PHI).

## PHI (بيانات المرضى)
- ملفّات PHI خارج webroot، مسار محروس (auth+RLS+منع traversal+audit). تشفير at-rest (envelope). **لا تستعلم جداول PHI إلا لمهمّة مصرّح بها.**

## منهجية
- للتدقيق: read-only أولاً، تحقّق سطراً-بسطر قبل التصعيد (تجنّب المبالغة — XSS صُحّح HIGH→MEDIUM بعد التحقّق).
- **الدقّة على المجاملة**؛ اكتب BLOCKED عند فشل بوابة. راجع [[jumanasoft-global-gates]].
