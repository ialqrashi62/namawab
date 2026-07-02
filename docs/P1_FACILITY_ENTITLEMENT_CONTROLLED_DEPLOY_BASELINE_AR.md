# P1 نشر استحقاقات المنشأة — 01 خط الأساس (Controlled Deploy Baseline)

> المرحلة: `P1_FACILITY_ENTITLEMENT_CONTROLLED_PRODUCTION_DEPLOY` | التاريخ: 2026-06-20

## 1. حالة Git (Gate 0 Preflight)
| البند | القيمة |
| ----- | ------ |
| parent HEAD | `b206272` ✓ |
| namaweb HEAD | `9897a6a` ✓ |
| `server.js` / `facility_entitlements.js` | لا فرق عن HEAD (نسخ مُلتزَمة — تُنشر كما هي) |
| md5 محلي server.js | `97aa0437…` |
| md5 محلي facility_entitlements.js | `89a9e81c…` |

## 2. النطاق والاستثناءات
- **داخل النطاق**: `server.js`, `facility_entitlements.js` فقط.
- **خارج النطاق (لن يُنشر)**: `public/login.html` و`public/js/app.js` (تعديلات سابقة في working tree ليست من عمل P1)، ملفات `tmp/*`, `public/AppServerPortal/` (غير متتبعة)، وملفات Stitch (غير متتبعة).
- لا DDL، لا تغيير بيانات، لا لمس Wave2B، لا Stitch.

## 3. البيئة
| البند | القيمة |
| ----- | ------ |
| النطاق | jumanasoft.com |
| الخادم | 204.168.144.74 |
| خدمة PM2 | nama-medical-erp |
| مسار التطبيق | /var/www/namaweb |
| نوع التعديل | code-only (بلا DDL) |

`CONTROLLED_DEPLOY_BASELINE_COMPLETE`
