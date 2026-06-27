# Phase B — سطح التكامل الحالي (Discovery، للقراءة فقط)

> 2026-06-22 | مسح فعلي للكود وقاعدة البيانات (بلا أي استدعاء خارجي، بلا تغيير إنتاجي). الغرض: توثيق ما هو موجود فعلاً قبل أي قرار تكامل.

## المنهجية
grep على `namaweb/server.js` + استعلام `information_schema` + فحص `package.json` و`.env` (أسماء المفاتيح فقط، بلا قيم). لا اتصال بأي طرف خارجي.

## النتائج الإجمالية
| المؤشر | الواقع |
|---|---|
| مكتبات تكامل (axios/soap/xml/hl7/fhir/dicom/qrcode/jsrsasign) | **لا يوجد أي منها** في package.json |
| مفاتيح بيئة تكامل (.env، 11 مفتاحاً إجمالاً) | فقط DB_HOST / REDIS_HOST / SESSION_SECRET + اعتمادات DB/NODE_ENV — **لا endpoint/cert/token/secret خارجي** |
| FHIR / HL7 / NPHIES / Mirth / SOAP / WSDL | **0 إشارة في الكود** (greenfield تماماً) |
| ZATCA | موجود لكنه **محاكاة** (لا امتثال Phase 2) |
| PACS / DICOM | فقط امتداد ملف مسموح (`.dcm`) في رفع الأشعة — **لا اتصال PACS** |
| Insurance | CRUD داخلي فقط (لا إرسال لطرف دافع خارجي) |

## المسارات الموجودة (داخلية)
- **Insurance** (CRUD داخلي): `GET/POST /api/insurance/companies`، `GET/POST/PUT /api/insurance/claims`، `GET /api/insurance/policies`.
- **ZATCA** (محاكاة): `GET /api/zatca/invoices`، `POST /api/zatca/generate` — يولّد "QR" = base64 لـJSON (ليس TLV ZATCA)، يخزّن في `zatca_invoices`، `submission_status='Generated'`، **بلا استدعاء API لـFatoora ولا ختم تشفيري ولا CSID**.
- **Lab**: `/api/lab/orders`, `/api/lab/catalog`, `/api/catalog/lab`, `/api/lab/orders/direct`, `/api/lab/reference-ranges`, `/api/reports/lab`, `/api/print/lab-report/:id`.
- **Radiology**: `/api/radiology/orders`, `/api/radiology/catalog`, `/api/radiology/orders/:id/upload` (محمي بـA3A).
- **Telemedicine**: جلسات داخلية + رابط اجتماع وهمي (`meet.nama.sa/<random>`) — لا تكامل مزوّد فيديو حقيقي.

## الجداول الموجودة (ذات صلة)
`zatca_invoices` · `insurance_claims` · `insurance_companies` · `insurance_contracts` · `insurance_policies` · `lab_radiology_orders` · `lab_results` · `lab_samples` · `lab_tests_catalog` · `radiology_catalog` · `tenant_lab_test_overrides` · `tenant_radiology_overrides` · `telemedicine_sessions` · `company_settings` (يحوي `vat_number`/`company_name`). **لا جداول fhir/hl7/nphies/pacs.**

## الخلاصة
النظام اليوم **مغلق على نفسه** (HIS/EMR/ERP داخلي) بلا أي تكامل خارجي حيّ. كل بنود Phase B تكاملات **جديدة (greenfield)** عدا ZATCA الذي يحتاج ترقية من محاكاة إلى امتثال Phase 2. لا يوجد نموذج أسرار/شهادات خارجية بعد — وهو مرتبط مباشرة بتبعية مفتاح A3 (انظر التقرير 06).

التالي: التقارير 02–05 (جاهزية كل مجال)، 06 (نموذج الأسرار)، 07 (طابور المرشّحات)، 08 (قائمة قرار المالك).
