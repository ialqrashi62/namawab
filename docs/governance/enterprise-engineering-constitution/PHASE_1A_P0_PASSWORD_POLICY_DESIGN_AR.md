# تصميم سياسة قوة كلمات المرور خادمياً (PHASE_1A_P0_PASSWORD_POLICY_DESIGN)

**المشروع:** NamaMedical / الطبيب
**الحالة:** مراجعة التصميم (Gate 1)
**المستهدف:** بيئة Staging
**المستوى:** P0 - حرج

---

## 1. الأهداف والمتطلبات

منع استخدام كلمات مرور ضعيفة أو شائعة لحماية حسابات الموظفين والمديرين من الاختراق الخارجي، من خلال تطبيق سياسة تحقق صارمة في جهة الخادم (Server-side) وليس فقط في الواجهة الأمامية.

### القواعد البرمجية المستهدفة:
1. **الحد الأدنى للطول:** 12 حرفاً على الأقل.
2. **العبارات المرورية (Passphrases):** السماح بها بالكامل ودعم المسافات والرموز الخاصة.
3. **منع الكلمات الشائعة:** منع الكلمات الافتراضية والشائعة مثل `password`, `123456`, `admin`, `welcome`, `changeme`.
4. **منع استخدام المعلومات الشخصية:** التحقق من عدم احتواء كلمة المرور على اسم المستخدم، أجزاء من البريد الإلكتروني، أو رقم الهاتف للمستخدم في حال توفرها.
5. **رسائل خطأ آمنة:** إرجاع رسائل خطأ واضحة باللغتين العربية والإنجليزية دون الكشف عن تفاصيل حساسة للنظام.

---

## 2. نقاط التحقق والملفات المرشحة للتعديل

سيتم تطبيق دالة التحقق المركزية `validatePasswordPolicy(password, context)` في المسارات التالية داخل ملف [server.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/server.js):

1. **إنشاء موظف/مستخدم جديد:**
   - المسار: `POST /api/settings/users`
   - التحقق: مطابقة كلمة المرور المدخلة مع اسم المستخدم والبريد المدخل.
2. **تحديث بيانات مستخدم أو تغيير كلمة المرور:**
   - المسار: `PUT /api/settings/users/:id`
   - التحقق: إذا تم إدخال كلمة مرور جديدة، يتم فحصها مع اسم المستخدم المستهدف.
3. **تغيير كلمة المرور الشخصية:**
   - المسار: `PUT /api/auth/change-password`
   - التحقق: فحص كلمة المرور الجديدة مع معلومات المستخدم الحالي بالجلسة.
4. **تسجيل مستخدمي البوابة (Portal Users):**
   - المسار: `POST /api/portal/users`
   - التحقق: إذا تم تمرير كلمة مرور يدوية، يتم فحصها وتطبيق السياسة عليها.

---

## 3. الهيكل البرمجي المقترح (Implementation Blueprint)

سيتم إنشاء ملف منفصل للمنفّذ [password_policy.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/password_policy.js) لتسهيل الفحص واختبار الوحدة بشكل مستقل:

```javascript
function validatePasswordPolicy(password, context = {}) {
    if (!password || typeof password !== 'string') {
        return { valid: false, error: 'Password is required', error_ar: 'كلمة المرور مطلوبة' };
    }
    if (password.length < 12) {
        return { valid: false, error: 'Password must be at least 12 characters', error_ar: 'يجب أن تتكون كلمة المرور من 12 حرفاً على الأقل' };
    }
    const common = ['password', '123456', 'admin', 'welcome', 'changeme', 'nama123'];
    const lower = password.toLowerCase();
    if (common.some(c => lower.includes(c))) {
        return { valid: false, error: 'Password is too weak or common', error_ar: 'كلمة المرور ضعيفة جداً أو شائعة' };
    }
    const { username, email, phone } = context;
    if (username && lower.includes(username.toLowerCase())) {
        return { valid: false, error: 'Password cannot contain username', error_ar: 'لا يمكن أن تحتوي كلمة المرور على اسم المستخدم' };
    }
    if (email && email.includes('@')) {
        const parts = email.split('@')[0];
        if (parts.length >= 4 && lower.includes(parts.toLowerCase())) {
            return { valid: false, error: 'Password cannot contain email parts', error_ar: 'لا يمكن أن تحتوي كلمة المرور على أجزاء من البريد الإلكتروني' };
        }
    }
    if (phone && phone.length >= 6 && lower.includes(phone)) {
        return { valid: false, error: 'Password cannot contain phone number', error_ar: 'لا يمكن أن تحتوي كلمة المرور على رقم الهاتف' };
    }
    return { valid: true };
}
```

---

## 4. خطة الاختبار والتحقق

سيتم إنشاء ملف اختبار وحدة مخصص `namaweb/password_policy_test.js` للتحقق من الحالات التالية:
- رفض كلمات المرور أقل من 12 حرفاً.
- رفض كلمات المرور الشائعة.
- رفض كلمات المرور التي تحتوي على اسم المستخدم أو البريد الإلكتروني.
- قبول عبارات مرور طويلة وقوية.
- التأكد من عدم طباعة كلمات المرور في أي سجلات أو تقارير.
