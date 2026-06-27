# P1 ضبط نوع المنشأة — 01 الفحص المسبق (Production Seed Preflight)

> المرحلة: `P1_FACILITY_TYPE_PRODUCTION_SEED_AND_FAIL_CLOSED_DEPLOY` | التاريخ: 2026-06-20
> **read-only فقط — لم يُنفَّذ أي UPDATE/INSERT.**

## 1. المستأجرون الفعّالون (read-only، بلا أسرار)
| id | name | subdomain | status | plan_type |
| -- | ---- | --------- | ------ | --------- |
| 1 | Nama Medical Default Tenant | default | active | standard |

- إجمالي المستأجرين: **1**. إجمالي المنشآت (facilities): **1**.

## 2. أين تُخزَّن `facility_type` وقيمتها الحالية
- التخزين: جدول `company_settings` (key/value)، المفتاح الأساسي **`setting_key`** (عام للنظام، تصميم أحادي المستأجر).
- صفوف `facility_type`: **0 → القيمة UNSET**.
- المفاتيح الموجودة (كلها `tenant_id=1`): address, company_name_ar, company_name_en, logo_path, phone, sample_data_inserted, tax_number, theme.

## 3. المستأجر المستهدف والقيمة المقترحة
- **المستهدف**: tenant id=1 (المستأجر الإنتاجي الوحيد).
- **التحليل**: منشأة واحدة، مستأجر واحد، تستخدم كل الموديولات الـ43 حالياً. ليست مجموعة مستشفيات/مدينة طبية متعددة المنشآت.
- **القيمة المقترحة**: **`large_hospital`**.
  - السبب: التصنيف الدقيق لمنشأة مفردة كاملة الموديولات؛ وفي السجل `large_hospital = '*'` (كل الموديولات مسموحة) → **صفر كسر** عند الانتقال إلى fail-closed (مكافئ لـ medical_city في الأثر، لكنه أدق دلالةً لمنشأة مفردة).
  - البديل `medical_city` (أيضاً `'*'`) مقبول وآمن بنفس القدر، لكنه يوحي بمجموعة متعددة المستشفيات غير قائمة فعلياً.
  - **مرفوض**: health_center/polyclinic/pharmacy_only/lab_only/radiology_only (ستحجب موديولات حساسة يستخدمها المستأجر فعلاً).

## 4. خطة التغيير المحدود (للـ Gate 2)
- تغيير واحد فقط: إضافة مفتاح `facility_type='large_hospital'` للمستأجر 1 في `company_settings` (tenant_id=1).
- **rollback**: `DELETE FROM company_settings WHERE setting_key='facility_type'` (يعيد الحالة UNSET تماماً — المفتاح غير موجود حالياً).
- لا مساس ببيانات مرضى/مالية/مخزون/صلاحيات؛ لا DDL.

`PRODUCTION_SEED_PREFLIGHT_COMPLETE — التوصية: large_hospital`
