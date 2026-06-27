# P1 ضبط نوع المنشأة والنشر — 02 التنفيذ (Seed & Deploy)

> التاريخ: 2026-06-20 | على الإنتاج. تغيير بيانات محدود (facility_type فقط) + نشر code-only، بلا DDL.

## Gate 1 — النسخة الاحتياطية للقيمة الحالية
- القيمة قبل التغيير: **UNSET** (لا صف لـ `facility_type` في `company_settings`).
- **rollback (بيانات)**: `DELETE FROM company_settings WHERE setting_key='facility_type';` (يعيد الحالة UNSET بدقة).

## Gate 2 — التغيير المحدود (مفتاح واحد فقط)
```sql
INSERT INTO company_settings (setting_key, setting_value, tenant_id)
VALUES ('facility_type','large_hospital',1)
ON CONFLICT (setting_key) DO UPDATE SET setting_value='large_hospital';
```
- النتيجة: `INSERT 0 1`. المستأجر المتأثّر: **tenant id=1 فقط**.
- القيمة: `large_hospital` (معروفة في السجل = `'*'` كل الموديولات → صفر كسر).

## Gate 3 — التحقق (read-only)
- `facility_type=large_hospital (tenant_id=1)` ✓.
- إجمالي صفوف `company_settings`: 8 → **9** (أُضيف مفتاح واحد فقط).
- **لا تغيير** على بيانات مرضى/مالية/مخزون/صلاحيات.

## Gate 4 — النشر المحكوم لكود fail-closed
| البند | القيمة |
| ----- | ------ |
| نسخة احتياطية للملفات | `server.js.bak.20260620_062407` + `facility_entitlements.js.bak.20260620_062407` |
| md5 قبل | server.js `97aa0437…` / facility_entitlements `89a9e81c…` (نسخة P1 السابقة) |
| الملفات المنشورة | server.js `d7e74eeb…` / facility_entitlements `dc9b4f6d…` (fail-closed، مطابقة للمحلي) |
| node --check | server.js OK + facility_entitlements OK |
| PM2 restart | online |
| health | 200 `{"status":"UP"}` ؛ HTTP→HTTPS 301 |
| الكوميت المنشور | namaweb `3e1c0cd` |

## Rollback المُجهّز
- بيانات: `DELETE FROM company_settings WHERE setting_key='facility_type';`
- كود: `cp server.js.bak.20260620_062407 server.js && cp facility_entitlements.js.bak.20260620_062407 facility_entitlements.js && pm2 restart nama-medical-erp`
- **لم يُستخدم** (كل البوابات نجحت).

`SEED_AND_DEPLOY_COMPLETE`
