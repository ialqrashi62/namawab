# 12 — خطة الأمن (Security Plan)

> 2026-06-22 | تهديدات/ضوابط/اختبارات/فجوات/خطة. لا تغيير إنتاجي.

## 1-4 الهدف/النطاق/المنهجية/الأدلة
حماية PHI/المالية وعزل المستأجرين. الأدلة: 148 FORCE RLS، دور non-superuser، helmet/cookie/rate-limit، RBAC guards منشورة.

## الضوابط (الحالة ↔ التهديد ↔ الاختبار)
| المجال | الحالة الحالية | التهديد | ضابط/اختبار | فجوة |
|---|---|---|---|---|
| Authentication | session + bcrypt + loginLimiter | brute-force/سرقة جلسة | rate-limit + httpOnly/secure cookie؛ S13/S14 | MFA (P1) |
| Authorization/RBAC | 11 دور، guards على settings/employees | تصعيد امتياز | requireRole + Admin guards؛ S8-S12 | حقول per-role أدقّ (P1) |
| Tenant isolation | 148 FORCE RLS، binding ALS | تسريب عبر مستأجرين | RLS + 0 body/query trust؛ S1-S6,S15,S21 | — (قوي) |
| Least privilege | app=nama_medical_app (super/bypass=false) | تجاوز RLS | مؤكّد؛ S7,S20 | — |
| Session | connect-redis، secure cookie | تثبيت/سرقة | sameSite؛ S16,S24 | تدوير/إدارة أجهزة (P3) |
| CSRF/CORS/CSP | sameSite + helmet | CSRF/XSS | S24,S26 | CSP صارم (P3) |
| Input validation | parametrized queries | SQLi/XSS | S25,S26 | تحقّق موحّد (P2) |
| Rate limiting | loginLimiter | إغراق | S14 | per-route (P3) |
| Secrets | ملفات خارج repo، .env غير ملتزَم | تسريب أسرار | secrets scan؛ S23 | vault مركزي (P3) |
| Audit logging | audit_trail FORCE append-only | عبث/إنكار | S18,S19 | قارئ معزول (gated) |
| PHI/PII privacy | RLS على كل PHI | كشف بيانات | S21 | تشفير at-rest + storage آمن (P1) |
| Backup security | dumps خارجية | فقد/تسريب نسخ | B1-B3 | تشفير نسخ + offsite (P1) |
| Incident response | runbook + watchdog | انقطاع | B6,B7 | severity/SLA رسمي (P2) |
| Security testing | static + harness | انحدار أمني | S*-suite | suite آلي + pentest (P2) |

## خطة التنفيذ (مراحل)
1. **P0/P1 فوري (بعد بوابات)**: قفل/توقيع EMR، MFA، تشفير at-rest + secure file vault، نسخ مشفّرة offsite مجدولة.
2. **P2**: CSP صارم، per-route rate-limit، تحقّق إدخال موحّد، pentest، entitlement guard backend، severity/SLA.
3. **مستمر**: secrets rotation، مراجعة دورية للأدوار، اختبارات أمنية في CI.

## 6-12
المتطلبات/الأولويات/المخاطر: أعلاه. توصيات: تبنّي مبدأ defense-in-depth فوق RLS (موجود جزئياً). Acceptance: تهديدات+ضوابط+اختبارات+فجوات+خطة (✅). Next: 13 Deployment.
