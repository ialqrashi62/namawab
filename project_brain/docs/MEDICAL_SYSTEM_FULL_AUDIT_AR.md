# تقرير التدقيق الشامل للنظام الطبي (Medical System Full Audit Report)

يوثق هذا التقرير التدقيق الشامل لبيئة ونظام **نما الطبي** (NamaMedical)، مع تقييم معماري وأمني ووظيفي كامل لتحديد الفجوات البرمجية وتحويله إلى منصة Healthcare SaaS عالمية ومنافسة.

---

## 1. الملخص التنفيذي (Executive Summary)
من خلال الفحص الشامل للشيفرة المصدرية (خصوصاً خادم التطبيق `server.js` ومخطط قاعدة بيانات PostgreSQL)، يتضح أن النظام الحالي عبارة عن تطبيق ويب متكامل ومبني على معمارية أحادية (Monolith) يخدم احتياجات مجمع طبي محلي بنجاح. يحتوي النظام على ما يزيد عن 40 وحدة برمجية تغطي طيفاً واسعاً من العمليات الطبية والإدارية. ومع ذلك، يفتقر النظام إلى المعايير القياسية لمنصات الـ SaaS متعددة المستأجرين (Multi-tenant) والامتثال الأمني المتقدم والربط الإلكتروني الفعلي مع الهيئات التنظيمية (مثل منصة NPHIES و ZATCA المرحلة الثانية).

---

## 2. التقنيات وقاعدة البيانات المستخدمة (Technology Stack & DB Models)

* **الخادم**: Node.js / Express.js مع إدارة الجلسات عبر `express-session`.
* **قاعدة البيانات**: PostgreSQL (عبر مكتبة `pg`).
* **نماذج قاعدة البيانات والجداول الأساسية**:
  * **إدارة المستخدمين والصلاحيات**: `system_users` (تخزن الحسابات والأدوار والعمولات).
  * **الملف الطبي والمرضى**: `patients`, `medical_records`, `nursing_vitals`, `nursing_assessments`, `patient_visits`, `patient_referrals`.
  * **الجدولة والعمليات**: `appointments`, `waiting_queue`, `surgeries`, `operating_rooms`, `surgery_preop_assessments`, `surgery_preop_tests`, `surgery_anesthesia_records`.
  * **الخدمات الطبية المساعدة**: `lab_radiology_orders`, `pharmacy_drug_catalog`, `pharmacy_prescriptions_queue`, `blood_bank_units`, `wards`, `beds`, `admissions`, `admission_daily_rounds`, `bed_transfers`.
  * **الأنظمة المتخصصة**: `diet_orders`, `diet_meals`, `nutrition_assessments`, `infection_surveillance`, `infection_outbreaks`, `pathology_specimens`, `cssd_batches`, `cme_events`, `infection_control_reports`, `maintenance_orders`, `insurance_policies`, `inventory`.
  * **الفوترة والمالية**: `invoices` (تدعم الفواتير، السداد الجزئي، المرتجعات)، `daily_close`, `cash_drawer`.

---

## 3. خريطة نهايات API والصلاحيات (API Endpoints & RBAC)

يستخدم النظام جدار حماية وصلاحيات وسيط (`requireRole`) للتحقق من الأدوار والوصول للنهايات الطرفية:
* **الأدوار المحددة**: `Admin`, `Doctor`, `Nurse`, `Pharmacist`, `Lab Technician`, `Radiologist`, `Reception`, `Finance`, `HR`, `IT`, `Staff`.
* **المسارات الأساسية لـ API**:
  * **المصادقة**: `/api/auth/login` (POST)، `/api/auth/logout` (POST)، `/api/auth/me` (GET)، `/api/auth/change-password` (PUT).
  * **المرضى والمواعيد**: `/api/patients` (GET, POST, PUT, DELETE)، `/api/appointments` (GET, POST, DELETE)، `/api/appointments/check-duplicate` (POST).
  * **الفحوصات والأشعة والصيدلية**: `/api/lab/orders` (GET, POST)، `/api/radiology/orders` (GET, POST)، `/api/pharmacy/queue` (GET, PUT).
  * **المالية والتقارير**: `/api/invoices` (GET, POST)، `/api/invoices/:id/pay` (PUT)، `/api/invoices/:id/partial-pay` (PUT)، `/api/reports/financial` (GET)، `/api/reports/pnl` (GET).

---

## 4. الفجوات والنواقص مقارنة بالأنظمة العالمية (Gaps & Deficiencies)

1. **غياب عزل المستأجرين الفعلي (Lack of Multi-tenancy)**: لا تحتوي الجداول الحالية على عمود `tenant_id` أو آليات عزل على مستوى قاعدة البيانات، مما يجعل النظام غير جاهز لنموذج الـ SaaS السحابي.
2. **عدم الامتثال الكامل لـ ZATCA (Phase 2)**: التوليد الحالي للرمز الاستجابي السريع (QR Code) يعتمد على تشفير نص بسيط بتنسيق JSON محول لـ Base64 (وهو متوافق مع المرحلة الأولى فقط)، ويفتقر للربط الحقيقي والمطابقة الأمنية الفورية (Cryptographic Signing & XML Invoice submission) للمرحلة الثانية.
3. **غياب الربط مع منصة نفيس (NPHIES)**: لا يوجد تكامل برمجي لإرسال مطالبات التأمين الطبي أو طلب الموافقات الفورية عبر منصة NPHIES السعودية، وهو متطلب إلزامي للمنشآت الطبية.
4. **ضعف إدارة الأدوية والوصفات الإلكترونية**: يتم التعامل مع الأدوية كقائمة نصية عامة دون تكامل مع أدلة الأدوية القياسية أو التحقق التلقائي للتعارضات الدوائية والحساسية (Drug-Drug & Drug-Allergy Interactions) بناءً على ملف المريض.

---

## 5. المخاطر الأمنية والتشغيلية (Security & Operational Risks)

* **خطر P0: تسريب البيانات بين المستأجرين**: غياب عزل البيانات البرمجي يعرض المنشآت الطبية لخطر تداخل البيانات وتجاوز الحدود الأمنية للمستندات.
* **خطر P1: تخزين وصيانة كلمات المرور**: آلية التحقق من كلمة المرور في تسجيل الدخول تدعم التحقق من النصوص الصريحة كخيار احتياطي ومزامنتها لاحقاً لـ bcrypt. هذا يعني وجود كلمات مرور غير مشفرة بالكامل في قاعدة البيانات القديمة.
* **خطر P1: ضعف حماية الجلسة**: ضبط الجلسة يحتوي على `secure: false` مما يسمح بنقل ملفات تعريف الارتباط الحساسة عبر بروتوكول HTTP غير المشفر، ويعرض النظام لهجمات سرقة الجلسة (Session Hijacking).
* **خطر P2: غياب الصلاحيات لبعض النهايات الطرفية**: نهايات طرفية حساسة مثل حذف المريض وإدارة الملفات الطبية لا تخضع لفحص أدوار دقيق بالكامل بل تعتمد على التحقق من وجود مستخدم مسجل فقط (`requireAuth`).

---

## 6. قرار المرحلة والتوصية (Phase Decision & Recommendation)

* **قرار الإغلاق الحالي**: **MEDICAL_SAFE_AUDIT_COMPLETED**
* **التوصية**: الانتقال فوراً لإعداد خارطة الطريق العالمية (Global SaaS Roadmap) لتفصيل بنية وهيكلية حل هذه الفجوات والمخاطر.
