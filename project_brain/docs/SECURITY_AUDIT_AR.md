# تدقيق الأمن (Security Audit)

> التاريخ: 2026-06-20 | مرجع: [GLOBAL_AUDIT_06_SECURITY_RISK_REGISTER_AR.md](GLOBAL_AUDIT_06_SECURITY_RISK_REGISTER_AR.md). هذا تحديث — عدة مخاطر P1 سابقة عولجت.

## 1. ما عولج منذ التدقيق السابق (تحسينات مؤكَّدة)
| الخطر السابق | الحالة الآن |
| ------------ | ----------- |
| SESSION_SECRET افتراضي مضمّن | ✅ **حارس إنتاج يرفض الإقلاع** بالسرّ الافتراضي/الناقص |
| rate limit على login فقط | ✅ **rate limiter اختياري على `/api`** (opt-in) أُضيف |
| تراجع MemoryStore في الإنتاج | ✅ يرفض الإقلاع بلا Redis (لا تراجع) |
| عزل الموديولات الحديثة | ✅ جزئياً (Wave1/Wave2 كود + binding)؛ بنك الدم متبقٍ |
| نوع المنشأة UI-only | ✅ **إنفاذ backend fail-closed** |
| التطبيق يقرأ 0 صف من جداول RLS | ✅ **P0 binding** (app.tenant_id لكل طلب) |
| مستخدم DB superuser | ✅ `nama_medical_app` محدود (NOBYPASSRLS) |

## 2. سجل المخاطر المتبقية
| الخطر | المستوى | الدليل | الحل |
| ----- | ------- | ------ | ---- |
| **تباين RLS موثّق 115 مقابل 13 فعلي** | **P1** | prod relforcerowsecurity=13؛ docs تدّعي 115 | تحقق وتسوية فعلية |
| عزل ناقص: blood_bank/approvals/packages | **P1** | لا tenant_id/RLS | DDL + كود (Class A) |
| rate limiter `/api` opt-in (غير مفعّل افتراضياً) | P1 | 9 refs، اختياري | تفعيل افتراضي للمسارات الحساسة |
| لا حماية CSRF صريحة | P1 | لا csrf token | توكن/فحص Origin + sameSite |
| لا قفل حساب بعد محاولات فاشلة | P1 | rate limit فقط | lockout + CAPTCHA |
| CSP معطّل في helmet (يُتحقق) | P2 | — | تفعيل CSP محكم |
| idempotency للمدفوعات/المحاسبة | P2 | لا فهرس فريد | DDL idempotency |
| audit: old_values + tamper-proof + retention | P2 | جزئي | تدقيق كامل |
| رفع الملفات في public/ | P2 | multer | نقل خارج public + فحص MIME |

## 3. الأسرار
- لا أسرار مطبوعة؛ `.env` gitignored؛ لا مفاتيح في الكود (فحص نظيف). توصية: تدوير أي SESSION_SECRET/مفتاح سبق كشفه؛ المفاتيح عبر env فقط.

## القرار
`SECURITY_STATUS: WARNING (تحسّن ملموس)`. الأساس قوي وعدة P1 أُغلقت. الأولويات الباقية: **تسوية تباين RLS**، عزل بنك الدم، تفعيل rate limiter العام، CSRF، قفل الحساب.

`SECURITY_AUDIT_COMPLETE`
