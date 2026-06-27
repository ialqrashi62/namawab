# Gate 1 — Production Backup (PHI Class A DDL)

> المرحلة: `P1_PHI_CLASS_A_RESIDUAL_RLS_PRODUCTION_DDL_CONTROLLED_EXECUTION` | التاريخ: 2026-06-21 | قبل أي DDL.

```text
DB_BACKUP_PATH: ~/nama_deploy_backups/phi_class_a_20260621/phi_class_a_5tables.sql
  (pg_dump للجداول الخمسة فقط: schema+data، --no-owner --no-privileges، 445 سطراً، خارج المستودع)
SCHEMA_SNAPSHOT_PATH: ~/nama_deploy_backups/phi_class_a_20260621/phi_class_a_snapshot.json
  (أعمدة + أنواع + nullability + بيانات الجداول المأهولة + أعداد الصفوف)
TARGET_TABLES: portal_users, audit_trail, packages, blood_bank_donors, blood_bank_units
ROW_COUNTS_BEFORE:
  portal_users      = 0   (cols=11, لديه tenant_id)
  audit_trail       = 44  (cols=13, لديه tenant_id)
  packages          = 0   (cols=8,  بلا tenant_id)
  blood_bank_donors = 0   (cols=14, بلا tenant_id)
  blood_bank_units  = 0   (cols=13, بلا tenant_id)
ROLLBACK_READY: YES (down.sql + pg_dump restore + JSON snapshot)
SECRETS_PRINTED: NO (كلمة مرور postgres مُرِّرت عبر PGPASSWORD في الأمر فقط، لم تُطبع ولا تُحفظ)
```

## ملاحظة أمان
الجداول الثلاثة بلا `tenant_id` **فارغة (0 صفوف)** ⇒ إضافة العمود additive آمنة بلا backfill ولا صفوف يتيمة. تأكيد تفصيلي في Gate 2.

`PRODUCTION_BACKUP: READY`
