# مرشح ومخطط الربط الطبي لـ FHIR Sandbox (FHIR Local Sandbox Blueprint)

**تاريخ الإصدار**: 2026-07-03  
**الحالة**: معتمد ونشط  
**النطاق**: نظام إدارة المستشفيات NamaMedical (طبقة FHIR Integration)  
**المطابقة المعيارية**: HL7 FHIR R4 (Release 4)  

---

## 1. مقدمة وأهداف المخطط
يهدف هذا المخطط إلى تيسير تهيئة بيئة اختبار محلية معزولة (Sandbox) خالية من بيانات المرضى الحقيقية (No PHI)، لمحاكاة وتأكيد عمليات التحول والربط الرقمي السريرية بما يطابق الهيكلية المعتمدة وطنياً (مثل منصة NPHIES).

---

## 2. مصفوفة مطابقة حقول البيانات (Data Field Mapping Matrix)

يقوم محرك التحويل بمطابقة حقول جداول قاعدة البيانات الحالية لـ NamaMedical وتوليد حزم JSON المتوافقة مع هيكلية FHIR R4:

### أ. مورد المريض (Patient Resource)
* **جدول المصدر**: `patients`

| حقل قاعدة البيانات (PostgreSQL) | حقل FHIR R4 JSON Node | الوصف والمعايير |
|---|---|---|
| `id` | `Patient.identifier[0].value` | المعرف الداخلي للمريض في النظام. |
| `national_id` / `iqama_id` | `Patient.identifier[1].value` | الهوية الوطنية أو الإقامة (مع تحديد النظام المرجعي). |
| `first_name` + `last_name` | `Patient.name[0].given` / `family` | الاسم الكامل باللغة المحددة. |
| `gender` | `Patient.gender` | الجنس (مطابقة القيم: male, female, other). |
| `birth_date` | `Patient.birthDate` | تاريخ الميلاد بصيغة (YYYY-MM-DD). |
| `phone` | `Patient.telecom[filter:phone].value` | رقم الاتصال الفعال. |
| `tenant_id` | `Patient.extension[url:tenant].valueString` | معرف المستأجر لضمان عزل البيانات البرمجية. |

---

### ب. مورد الزيارة الطبية (Encounter Resource)
* **جدول المصدر**: `visit_lifecycle`

| حقل قاعدة البيانات (PostgreSQL) | حقل FHIR R4 JSON Node | الوصف والمعايير |
|---|---|---|
| `id` | `Encounter.id` | معرف الزيارة الفريد. |
| `patient_id` | `Encounter.subject.reference` | مرجع المريض (مثل `Patient/123`). |
| `status` | `Encounter.status` | حالة الزيارة (planned, arrived, in-progress, finished, cancelled). |
| `visit_type` | `Encounter.class.code` | تصنيف الزيارة (ambulatory, emergency, inpatient). |
| `start_time` / `end_time` | `Encounter.period.start` / `end` | فترة الزيارة الفعلية بالتوقيت العالمي المنسق. |
| `department_id` | `Encounter.location[0].location.reference` | مرجع القسم الطبي أو العيادة المعنية. |

---

### ج. مورد الملاحظات الطبية والعلامات الحيوية (Observation Resource)
* **جدول المصدر**: `clinical_records` (عند قفل السجل)

| حقل قاعدة البيانات (PostgreSQL) | حقل FHIR R4 JSON Node | الوصف والمعايير |
|---|---|---|
| `id` | `Observation.id` | معرف الملاحظة الطبية. |
| `patient_id` | `Observation.subject.reference` | مرجع المريض. |
| `visit_id` | `Observation.encounter.reference` | مرجع الزيارة المرتبطة بالملاحظة. |
| `vitals.blood_pressure` | `Observation.component[0].valueQuantity` | ضغط الدم (لوينك كود مطبق). |
| `vitals.temperature` | `Observation.valueQuantity` | درجة الحرارة (مطابقة ترميز Celsius). |
| `vitals.pulse` | `Observation.valueQuantity` | معدل النبض. |

---

## 3. خطة تهيئة وتشغيل الـ Sandbox المحلي (Local HAPI FHIR Sandbox)

للقيام بالاختبارات والتحقق من القبول المعياري دون لمس بيئة الإنتاج:

### الخطوة الأولى: تشغيل خادم HAPI FHIR عبر Docker
نقوم بتشغيل نسخة محاورة من خادم HAPI FHIR التجريبي (المثبت على منفذ `8080` محلياً):
```powershell
docker run -d --name nama-fhir-sandbox -p 8080:8080 hapiproject/hapi-fhir-jpaserver-starter:latest
```

### الخطوة الثانية: محاكاة إدخال مريض تجريبي (Dummy Patient POST)
نقوم بإرسال حزمة مريض تجريبي للتأكد من استجابة الخادم:
```powershell
$headers = @{
    "Content-Type" = "application/fhir+json"
}
$body = @{
    "resourceType" = "Patient"
    "active" = $true
    "name" = @(
        @{
            "use" = "official"
            "family" = "Al-Harbi"
            "given" = @("Ahmad")
        }
    )
    "gender" = "male"
    "birthDate" = "1990-05-15"
} | ConvertTo-Json -Depth 5

$response = Invoke-RestMethod -Uri "http://localhost:8080/fhir/Patient" -Method Post -Headers $headers -Body $body
$response.id
```

### الخطوة الثالثة: التحقق والاسترجاع
التحقق من إدراج المريض وقراءة سجله المعياري:
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/fhir/Patient?name=Ahmad" -Method Get
```

---

## 4. قيود الأمن وحماية الخصوصية (Privacy Guards)
- **منع استخدام البيانات الحية (Zero Production PHI Policy)**: يمنع منعاً باتاً نقل أو استخدام أي بيانات مرضى حقيقية داخل الـ Sandbox المحلي. كافة أسماء المرضى والتواريخ والهويات المستخدمة في الاختبارات تكون وهمية (Synthesized Data) ويتم إتلافها دورياً.
- **تحديد الصلاحيات**: يتم حظر واجهة التحكم الإدارية لـ HAPI FHIR عن الوصول الخارجي ويسمح فقط للمضيف المحلي `127.0.0.1` بالاتصال والتفاعل مع خادم الاختبار.
