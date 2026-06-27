# التدقيق العالمي 12 — المصفوفة الشاملة للفجوات (Global Gap Matrix)

> التاريخ: 2026-06-20 | القرار: FIX_NOW / FIX_NEXT / IMPROVE_LATER / KEEP_AS_IS / NEEDS_RESEARCH / BLOCKED.

| المجال | الوضع الحالي | المستوى العالمي | الفجوة | الأولوية | الجهد | المخاطر | القرار |
| ------ | ------------ | --------------- | ------ | -------- | ----- | ------- | ------ |
| عزل الموديولات الحديثة (سجلات/تأهيل/بوابة/صيدلية سريرية/تغذية) | `requireAuth` بلا tenant scope | عزل كامل لكل البيانات | تسريب بين المستأجرين | P0 | متوسط | عالٍ جداً | **FIX_NOW** |
| حوكمة RLS (مصدر vs إنتاج) | 13 جدولاً على الإنتاج خارج Git | migration متتبع idempotent | إسقاط RLS صامت عند الاستعادة | P0 | منخفض | عالٍ | **FIX_NOW** |
| أسرار افتراضية في الكود (SESSION_SECRET/DB_PASSWORD) | قيم fallback مضمّنة | إلزام env + رفض الافتراضي | تزوير جلسات | P1 | منخفض | عالٍ | **FIX_NOW** |
| CORS origin:true + لا CSRF | مفتوح + sameSite=lax | origin مقيّد + CSRF token | CSRF | P1 | منخفض | متوسط | FIX_NEXT |
| قفل الحساب بعد محاولات فاشلة | rate limit فقط | lockout + CAPTCHA | تخمين كلمات مرور | P1 | منخفض | متوسط | FIX_NEXT |
| اختبارات الموديولات الحديثة | مفقودة | تغطية عزل كاملة + CI | لا كشف للتسريب | P0/P1 | متوسط | عالٍ | **FIX_NOW** |
| مراقبة/تنبيه آلي | يدوي + runbooks | observability + alerting | اكتشاف أعطال متأخر | P1 | متوسط | متوسط | FIX_NEXT |
| نسخ احتياطي مجدول off-site | يدوي موثّق | آلي + off-site + DR drill | فقدان بيانات | P1 | منخفض | عالٍ | FIX_NEXT |
| تذكير SMS للمواعيد | مفقود | SMS/WhatsApp | no-show + تجربة | P1 | منخفض | منخفض | FIX_NEXT |
| بوابة دفع | payment_method نصي | Mada/Moyasar/Tap | تحصيل رقمي | P1 | متوسط | منخفض | FIX_NEXT |
| ZATCA Phase 2 فعلي | QR محلي | توقيع + تقديم معتمد | إلزام نظامي سعودي | P1 | متوسط | عالٍ قانونياً | FIX_NEXT |
| تكامل NPHIES (تأمين/مطالبات) | سجلات داخلية | EDI/NPHIES | تحصيل + سوق سعودي | P1 | عالٍ | متوسط | NEEDS_RESEARCH |
| HL7/FHIR | مفقود | تبادل معياري | تكامل مؤسسي | P1 | عالٍ | متوسط | NEEDS_RESEARCH |
| LIS / PACS-DICOM فعلي | إدخال/رفع يدوي | تكامل أجهزة | كفاءة + معيار أشعة | P1 | عالٍ | متوسط | NEEDS_RESEARCH |
| بنية SaaS التجارية (خطط/اشتراك/فوترة/provisioning) | بنية عزل فقط | منصة SaaS كاملة | لا نموذج إيراد متعدد العملاء | P1 | عالٍ | متوسط | FIX_NEXT |
| تقسيم Monolith + service layer | server.js 7K سطر | معماري معياري | صيانة/توسع | P1/P2 | عالٍ | متوسط | IMPROVE_LATER |
| activeSessions في الذاكرة | Map داخل العملية | حالة في Redis | يكسر التوسع الأفقي | P2 | منخفض | متوسط | FIX_NEXT |
| إتاحة الوصول (WCAG/ARIA) | غائبة | WCAG 2.1 AA | يعيق الشراء المؤسسي | P1 | متوسط | متوسط | FIX_NEXT |
| البحث على الموبايل + focus trap + pagination | ناقصة | UX حديث | تجربة | P2 | منخفض | منخفض | FIX_NEXT |
| audit: old_values + tamper-proof + retention | جزئي | تدقيق كامل محصّن | امتثال/تحقيق | P2 | متوسط | متوسط | IMPROVE_LATER |
| soft-delete + updated_at/created_by | مفقود | تتبع كامل | استرجاع/تدقيق | P2 | متوسط | منخفض | IMPROVE_LATER |
| SSO/MFA | جلسات داخلية | SAML/OIDC + MFA | مؤسسي | P2 | متوسط | منخفض | IMPROVE_LATER |
| محرك تفاعلات دوائية معتمد | فحص محلي محدود | First Databank/Multum | سلامة المريض | P1/P2 | عالٍ | متوسط | NEEDS_RESEARCH |
| CI/CD pipeline | لا يوجد | CI آلي | regression | P1 | منخفض | متوسط | FIX_NEXT |
| **التوطين عربي/RTL** | كامل | عالمي | — | — | — | — | **KEEP_AS_IS** |
| **عزل الموديولات الأساسية + 63 اختبار** | قوي | عالمي | — | — | — | — | **KEEP_AS_IS** |
| **اتساع الموديولات (43)** | استثنائي | تنافسي | — | — | — | — | **KEEP_AS_IS** |
| **Redis/HTTPS/PM2/least-privilege DB** | منشور ومستقر | قياسي | — | — | — | — | **KEEP_AS_IS** |
| **runbooks التشغيلية** | شاملة | ممتاز | — | — | — | — | **KEEP_AS_IS** |
| **التوثيق العربي (488+ تقرير)** | استثنائي | نادر | — | — | — | — | **KEEP_AS_IS** |

---

## ملخص القرارات

- **FIX_NOW (P0)**: عزل الموديولات الحديثة + اختباراتها، حوكمة RLS، إلزام الأسرار من env.
- **FIX_NEXT (P1)**: CORS/CSRF، قفل الحساب، مراقبة/تنبيه، نسخ off-site، SMS، بوابة دفع، ZATCA Phase 2، بنية SaaS، CI، WCAG، نقل activeSessions.
- **NEEDS_RESEARCH**: NPHIES، HL7/FHIR، LIS/PACS، محرك تفاعلات دوائية.
- **IMPROVE_LATER**: تقسيم Monolith، audit كامل، soft-delete، SSO/MFA.
- **KEEP_AS_IS**: التوطين، العزل الأساسي، الاتساع الوظيفي، البنية التحتية المنشورة، runbooks، التوثيق.

`GLOBAL_GAP_MATRIX_COMPLETE`
