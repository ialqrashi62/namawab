# مهارة تدقيق الأمن وخصوصية المريض (Security & Privacy Audit)

## Purpose
تدقيق الأمن وخصوصية بيانات المرضى: المصادقة، التفويض، IDOR، عزل المستأجرين، حماية البيانات السريرية/المالية، رفع الملفات/المرفقات الطبية، السجلات الحساسة، الأسرار، Webhooks، أمن الدفع، rate limiting، CSRF/XSS، العبث بسجل التدقيق.

## When to Use
عند تدقيق الأمن، أو قبل أي نشر إنتاجي، أو عند فحص مخاطر الخصوصية.

## Inputs Needed
server.js (auth/session/helmet/cors/rate-limit/multer/logAudit)، db_postgres.js، إعدادات Nginx/Redis إن لزم.

## Procedure
1. المصادقة (bcrypt)، الجلسات (Redis/httpOnly/sameSite/secure)، منع التراجع لـ MemoryStore.
2. التفويض وIDOR وعزل المستأجرين على API.
3. CSRF (CORS origin)، XSS (تطهير/CSP)، rate limiting، قفل الحساب.
4. رفع الملفات (نوع/مسار/MIME)، الأسرار (env، لا قيم افتراضية مضمّنة)، سجل التدقيق (old/new، عدم العبث).

## Safety Rules
قراءة فقط. **لا طباعة أي أسرار/سلاسل اتصال/هاشات** — أسماء المتغيرات فقط مع `YES_REDACTION_NOTE`. لا اختبار اختراق على الإنتاج.

## Output Format
`docs/MEDICAL_SECURITY_PRIVACY_AUDIT_AR.md` — سجل مخاطر: الخطر | المستوى (Critical/High/Medium/Low) | الدليل | الأثر | الحل | عاجل؟.

## Done Criteria
كل بنود الأمن مُقيّمة بأدلة وتصنيف خطورة وحلول، دون تسريب أي سرّ.
