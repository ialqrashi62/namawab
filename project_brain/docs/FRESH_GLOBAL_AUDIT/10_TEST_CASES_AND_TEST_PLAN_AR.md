# 10 — حالات الاختبار وخطة الاختبار (Test Plan)

> 2026-06-22 | ≥120 حالة عبر unit/integration/API/UI/E2E/security/RBAC/RLS/performance/backup/RTL/a11y. صيغة مضغوطة: ID | الفئة | الحالة | المتوقّع.

## الهدف/النطاق/المنهجية
تغطية كل الطبقات. الحالي: اختبارات static (settings/employees guards) + harness DB (عزل). الناقص: مجموعة آلية شاملة (P2). أداة مقترحة: Jest/supertest + Playwright (E2E عند توفّر حسابات).

## Security / RBAC / RLS (1-30)
| ID | الفئة | الحالة | المتوقّع |
|---|---|---|---|
| S1 | RLS | قراءة patients ctx=1 | صفوف المستأجر 1 فقط |
| S2 | RLS | قراءة patients ctx=999 | 0 |
| S3 | RLS | قراءة بلا سياق | 0 (fail-closed) |
| S4 | RLS | INSERT يحذف tenant_id ctx=1 | يُختم 1 (DEFAULT) |
| S5 | RLS | INSERT بتزوير tenant_id=1 ctx=999 | 42501 |
| S6 | RLS | تكرار S1-S5 على employees/branches/daily_close | مطابق |
| S7 | role | current_user للتطبيق | nama_medical_app super=false bypass=false |
| S8 | RBAC | POST /api/settings/users كـIT | 403 + audit |
| S9 | RBAC | POST /api/settings/users كـAdmin | 201 |
| S10 | RBAC | PUT settings/users تغيير دور كـnon-admin | 403 |
| S11 | RBAC | POST/DELETE employees كـnon-HR | 403 |
| S12 | RBAC | GET employees كـReception | 200 (مفتوح) |
| S13 | auth | أي مسار محمي بلا جلسة | 401 |
| S14 | auth | login خاطئ متكرر | 429 (loginLimiter) |
| S15 | tenant-trust | إرسال tenant_id في body | يُتجاهل (من الجلسة) |
| S16 | session | cookie httpOnly/secure/sameSite | موجودة |
| S17 | headers | helmet headers | حاضرة |
| S18 | audit | حدث BLOCKED_PRIVILEGE_ESCALATION | يُسجّل |
| S19 | audit | audit_trail append-only | لا UPDATE/DELETE policy |
| S20 | least-priv | app لا يملك BYPASSRLS | مؤكّد |
| S21 | IDOR | GET /api/patients/:id لمريض مستأجر آخر | 0/404 (RLS) |
| S22 | IDOR | refund فاتورة مستأجر آخر | 404 (tenant-scoped) |
| S23 | secrets | لا أسرار في الكود/الردود | نظيف |
| S24 | CSRF | طلب cross-origin | مرفوض (sameSite) |
| S25 | input | حقن SQL في حقل بحث | مُعقّم (parametrized) |
| S26 | input | XSS في حقل نص | مُهرّب عند العرض |
| S27 | mfa | (candidate) تحقّق MFA | مطلوب بعد كلمة المرور |
| S28 | audit-reader | (gated) SET ROLE خارج super-admin | مرفوض |
| S29 | rate | (candidate) per-route limit | 429 عند التجاوز |
| S30 | file | رفع ملف PHI | تخزين آمن (فجوة) |

## API / Integration (31-60)
| ID | الفئة | الحالة | المتوقّع |
|---|---|---|---|
| A1-A10 | API | كل CRUD patients/appointments/invoices/lab/pharmacy | 2xx + tenant-scoped |
| A11 | API | POST /api/lab/orders ينشئ أمر | 201 + lab_radiology_orders |
| A12 | API | PUT نتيجة مختبر | 200 + lab_results |
| A13 | API | POST وصفة | 201 + prescriptions |
| A14 | API | POST فاتورة | 201 + invoices مختوم |
| A15 | API | refund | سجل سالب tenant-scoped |
| A16 | API | POST مطالبة تأمين | 201 |
| A17 | API | daily-close | يُنشئ سجل tenant |
| A18 | API | health | 200 (عام) |
| A19 | API | 404 لمسار غير موجود | 404 |
| A20 | API | حقل ناقص في POST | 400 |
| A21-A25 | Integration(candidate) | FHIR upsert/HL7 ADT/NPHIES eligibility/PACS/SMS | عقد متوقّع |
| A26 | API | finance/post (gated) | 409 (posting OFF) |
| A27 | API | audit/search (gated) | 403 لغير super-admin |
| A28 | API | تزامن طلبين على نفس المورد | اتساق |
| A29 | API | pagination على قوائم كبيرة | حدود صفحات |
| A30 | API | استجابة JSON صحيحة | schema متوافق |

## UI / E2E / RTL / a11y (61-95)
| ID | الفئة | الحالة | المتوقّع |
|---|---|---|---|
| U1 | E2E | login→dashboard | نجاح + شاشة الدور |
| U2 | E2E | logout | إنهاء جلسة |
| U3 | E2E | تسجيل مريض | يظهر في القائمة |
| U4 | E2E | حجز موعد | يظهر بالتقويم |
| U5 | E2E | فتح EMR وتدوين | يُحفظ |
| U6 | E2E | أمر مختبر→نتيجة | دورة كاملة |
| U7 | E2E | صرف صيدلية | خصم مخزون |
| U8 | E2E | إصدار فاتورة ودفع | حالة paid |
| U9 | E2E | non-admin يحاول إدارة مستخدمين | محظور UI + 403 |
| U10 | E2E | مستخدم مستأجر آخر لا يرى البيانات | معزول |
| U11-U20 | UI | عرض كل شاشة من 27 (تحميل/فارغ/خطأ) | حالات صحيحة |
| U21 | RTL | اتجاه عربي صحيح | dir=rtl سليم |
| U22 | RTL | أرقام/تواريخ | تنسيق صحيح |
| U23 | i18n | تبديل ar/en | tr() يبدّل |
| U24 | a11y | تباين ألوان | WCAG AA |
| U25 | a11y | تنقّل لوحة مفاتيح | كل العناصر قابلة للوصول |
| U26 | a11y | ARIA labels | حاضرة |
| U27 | responsive | موبايل | sidebar collapsible |
| U28 | responsive | تابلت | تخطيط مرن |
| U29 | UI | skeleton أثناء التحميل | يظهر |
| U30 | UI | toast خطأ | يظهر + إعادة |
| U31-U35 | E2E(facility) | health_center/clinic يرى شاشات النوع فقط | FACILITY_ALLOWED |

## Performance / Backup / Regression (96-125)
| ID | الفئة | الحالة | المتوقّع |
|---|---|---|---|
| P1 | perf | قائمة patients كبيرة | <500ms (مع فهرس) |
| P2 | perf | تقرير مالي | زمن مقبول |
| P3 | perf | RLS overhead | ضئيل (جداول كبيرة مفهرسة) |
| P4 | perf | 50 طلب متزامن /health | بلا تدهور |
| P5 | perf | استعلام بلا فهرس tenant_id | مراقبة (89 جدول صغير) |
| P6-P10 | perf | الصفحات الثقيلة (EMR/dashboard/reports) | زمن تحميل مقبول |
| B1 | backup | dump schema+data | ينجح |
| B2 | backup | استرداد على قاعدة معزولة | يطابق |
| B3 | backup | down.sql لكل دفعة | يرجع نظيفاً |
| B4 | backup | daily_close down | يرجع |
| B5 | backup | (candidate) جدولة آلية + offsite | مجدول |
| B6 | DR | reboot→autorecovery | health يعود (watchdog) |
| B7 | DR | Redis down→watchdog | docker start + resurrect |
| R1-R10 | regression | إعادة اختبارات guards/RLS بعد أي نشر | كلها PASS |
| R11 | regression | suite كامل قبل deploy | بوابة خضراء |
| C1-C5 | unit | دوال requireRole/getRequestTenantContext/logAudit/discount/norm | تغطية منطق |

## 6-12
المتطلبات: بناء suite آلي (Jest+supertest+Playwright). الأولويات: security/RLS/RBAC (P0-P1)، E2E (P1 عند الحسابات). المخاطر: غياب اختبارات آلية شاملة يضعف الانحدار. توصيات: CI gate (راجع 13). Acceptance: ≥120 حالة (✅ ~125). Next: 11 Architecture.
