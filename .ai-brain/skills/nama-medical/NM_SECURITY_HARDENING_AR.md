# NM_SECURITY_HARDENING — تصليب أمان التطبيق

## متى تُستخدم
أي مراجعة أمنية، إضافة endpoint جديد، أو تعديل في auth/session/headers.

## الهدف
ضمان أن التطبيق محمي من الثغرات الشائعة مع audit trail محمي ولا تسريب للبيانات.

## قواعد إلزامية
```
NO_XSS: YES — كل إخراج HTML يجب escapeHTML
NO_SQL_INJECTION: YES — لا query concatenation، استخدم parameterized queries
NO_CSRF: YES — CSRF token على كل form POST
CORS_RESTRICTED: YES — CORS محدود بالـ domains المصرّح بها فقط
CSP_ENFORCED: YES — Content Security Policy فعّال
AUTH_REQUIRED: YES — requireAuth على كل endpoint يحتاج login
RATE_LIMITING: YES — حد للطلبات على endpoints الحساسة
NO_SENSITIVE_LOGS: YES — لا طباعة passwords/tokens/session في logs
DEPENDENCY_REVIEW: YES — مراجعة npm packages قبل إضافة أي dependency
HTTPS_ONLY: YES — كل الاتصالات عبر HTTPS في الإنتاج
SECRETS_HYGIENE: YES — الأسرار خارج git في .env وغير مُلتزمة
AUDIT_PRIVACY: YES — audit logs لا تحتوي PHI/passwords
```

## فحوصات الأمان السريعة
```bash
# فحص XSS — ابحث عن innerHTML بدون escape
grep -rn "innerHTML" namaweb/public/js/ | grep -v "escapeHTML"

# فحص SQL injection — ابحث عن query concatenation
grep -rn "query.*\${" namaweb/server.js | head -20

# فحص secrets في git
git log --all -p | grep -E "(password|secret|token|key)" | grep "+" | head -10

# فحص CSP headers
curl -I https://jumanasoft.com | grep -i "content-security-policy"

# فحص rate limiting
grep -rn "rateLimit\|rate_limit" namaweb/server.js | head -10
```

## أدلة النجاح
- كل innerHTML يمر بـ `escapeHTML()`
- لا query concatenation مباشرة بدون params
- CSP header موجود
- Rate limiting على `/api/auth/login`
- لا secrets في git history

## حالات الحظر
- innerHTML بدون escape → BLOCKED_XSS_RISK
- Query concatenation مكتشفة → BLOCKED_SQL_INJECTION_RISK
- Secret في git → BLOCKED_SECRET_IN_GIT
- لا Auth على endpoint حساس → BLOCKED_MISSING_AUTH

## صيغة التقرير المختصر
```
SECURITY_GATE: PASS/BLOCKED
XSS_CHECK: PASS/FAIL | SQL_INJECTION_CHECK: PASS/FAIL
CSP_PRESENT: YES/NO | RATE_LIMITING: YES/NO
HTTPS_ENFORCED: YES/NO | SECRETS_IN_GIT: NO
sensitive_logs_found: NO
```
