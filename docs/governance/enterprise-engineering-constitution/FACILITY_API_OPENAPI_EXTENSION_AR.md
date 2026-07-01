# مواصفات وامتداد واجهات التطبيق البرمجية (Facility API OpenAPI Extension)

* **المشروع:** منصة نما الطبية (NamaMedical ERP)
* **المرحلة:** منصة المنشآت الصحية المتعددة (PHASE_ENTERPRISE_FACILITY_PLATFORM_WITH_MEDICAL_CITY_SELECTOR)
* **المستند:** امتداد واجهات التطبيق البرمجية (FACILITY_API_OPENAPI_EXTENSION_AR)
* **الحالة:** معتمد ✅

---

## 1. مسارات وواجهات الـ API المقترحة (OpenAPI Specification)

تم تحديد وتعريف مسارات الـ API الجديدة المطلوبة لإدارة المدن الطبية والمنشآت وفق مواصفات OpenAPI لتسهيل دمج الأنظمة وتفعيل بوابة نفيس:

```yaml
openapi: 3.0.3
info:
  title: NamaMedical Enterprise Facility API
  version: 1.0.0
paths:
  /api/public/homepage:
    get:
      summary: استرجاع بيانات الصفحة الرئيسية العامة (الأقسام، أرقام الإسعاف، الاعتمادات)
      responses:
        '200':
          description: OK

  /api/public/facilities:
    get:
      summary: استرجاع المنشآت المتاحة للجمهور (تصفية حسب المنطقة والنوع)
      responses:
        '200':
          description: OK

  /api/public/medical-cities:
    get:
      summary: استرجاع قائمة المدن الطبية والتجمعات الصحية النشطة
      responses:
        '200':
          description: OK

  /api/medical-cities:
    get:
      summary: استرجاع المدن الطبية (تحتاج مصادقة RBAC)
      responses:
        '200':
          description: OK

  /api/medical-cities/{id}/facilities:
    get:
      summary: استرجاع جميع المنشآت والمستشفيات التابعة لمدينة طبية محددة
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: OK

  /api/facilities:
    get:
      summary: استرجاع كافة المنشآت الطبية للشبكة الصحية
      responses:
        '200':
          description: OK

  /api/facilities/{id}:
    get:
      summary: استرجاع تفاصيل وإعدادات منشأة صحية محددة
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: OK

  /api/facilities/{id}/departments:
    get:
      summary: استرجاع الأقسام الطبية المفعّلة والنشطة داخل منشأة محددة
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: OK

  /api/facilities/{id}/services:
    get:
      summary: استرجاع وتصفية الخدمات والأسعار الطبية المخصصة للمنشأة
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: OK

  /api/facilities/{id}/dashboard:
    get:
      summary: استرجاع بيانات ودجات لوحة تشغيل المنشأة (معدلات الأسرة، إحصائيات الطوارئ)
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: OK

  /api/facilities/{id}/enable-department:
    post:
      summary: تفعيل قسم طبي بالمنشأة وتطبيق الفحوصات الآمنة لـ CBAHI
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                department_id:
                  type: integer
      responses:
        '200':
          description: Section enabled successfully

  /api/facilities/{id}/disable-department:
    post:
      summary: تعطيل قسم طبي في المنشأة بأمان (يمنع في حال وجود مرضى تنويم)
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                department_id:
                  type: integer
      responses:
        '200':
          description: Section disabled safely

  /api/facility-templates:
    post:
      summary: إنشاء قالب قسم افتراضي جديد لنوع منشأة
      responses:
        '201':
          description: Template created

  /api/facility-templates/{type}:
    get:
      summary: استرجاع إعدادات قالب التعيين الافتراضي لنوع منشأة محدد
      parameters:
        - name: type
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
```
---
* **سياسة الحماية للواجهات:** تتطلب كافة الروابط المبتدئة بـ `/api/facilities` و `/api/medical-cities` التحقق من صلاحية المستخدم (Token Auth) وجواز وصوله للمنشأة المطلوبة (RBAC Filter) لضمان الخصوصية.
