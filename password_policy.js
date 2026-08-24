/**
 * password_policy.js
 * Centralized server-side password strength validation.
 */
'use strict';

function validatePasswordPolicy(password, context = {}) {
    if (!password || typeof password !== 'string') {
        return { valid: false, error: 'Password is required', error_ar: 'كلمة المرور مطلوبة' };
    }
    if (password.length < 12) {
        return { valid: false, error: 'Password must be at least 12 characters', error_ar: 'يجب أن تتكون كلمة المرور من 12 حرفاً على الأقل' };
    }
    const common = ['password', '123456', 'admin', 'welcome', 'changeme', 'nama123', 'nama_medical'];
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

module.exports = { validatePasswordPolicy };
