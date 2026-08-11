# {{DEPT_NAME_AR}} — Data Model (ERD)
## NamaMedical Department

> **القسم:** `{{DEPT_SLUG}}`
> **التاريخ:** {{DATE}}
> **المالك:** {{OWNER}}
> **Schema:** `{{SCHEMA_NAME}}`

---

## 1. نظرة عامة على البيانات

هذا القسم يتعامل مع:
- {{ENTITY_1}}: بيانات المرضى والعلاجات
- {{ENTITY_2}}: السجلات السريرية
- {{ENTITY_3}}: التقييمات والقياسات
- {{ENTITY_4}}: التقارير والإحصائيات

**إجمالي الجداول:** {{NUM_TABLES}}
**عدد الـ views:** {{NUM_VIEWS}}
**عدد الـ functions:** {{NUM_FUNCTIONS}}
**عدد الـ triggers:** {{NUM_TRIGGERS}}

---

## 2. ERD (Entity-Relationship Diagram)

```
┌──────────────────────┐         ┌──────────────────────┐
│  {{TABLE_1}}         │  1───N  │  {{TABLE_2}}         │
│ ────────────────────│◄────────│ ────────────────────│
│ id (PK, uuid)        │         │ id (PK, uuid)        │
│ tenant_id (FK)       │         │ tenant_id (FK)       │
│ patient_id (FK)      │         │ {{table1}}_id (FK)   │
│ created_at           │         │ patient_id (FK)      │
│ updated_at           │         │ ...                  │
│ created_by (FK)      │         │ created_at           │
└──────────────────────┘         │ updated_at           │
                                  │ ...                  │
                                  └──────────────────────┘

{{ADDITIONAL_ENTITIES}}
```

---

## 3. الجداول (Tables)

### 3.1 {{TABLE_1}}

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | uuid | PK, default `gen_random_uuid()` | معرّف فريد |
| `tenant_id` | uuid | NOT NULL, FK → `tenants(id)` | معرّف المستأجر (RLS) |
| `{{COL_1}}` | {{TYPE_1}} | {{CONSTRAINTS_1}} | {{DESC_1_AR}} |
| `{{COL_2}}` | {{TYPE_2}} | {{CONSTRAINTS_2}} | {{DESC_2_AR}} |
| `{{COL_3}}` | {{TYPE_3}} | {{CONSTRAINTS_3}} | {{DESC_3_AR}} |
| `created_at` | timestamptz | NOT NULL, default `now()` | وقت الإنشاء |
| `updated_at` | timestamptz | NOT NULL, default `now()` | وقت آخر تعديل |
| `created_by` | uuid | NOT NULL, FK → `users(id)` | المنشئ |
| `updated_by` | uuid | FK → `users(id)` | آخر معدّل |
| `is_deleted` | boolean | NOT NULL, default `false` | soft delete |

**Indexes:**
- `idx_{{TABLE_1}}_tenant` on `(tenant_id)`
- `idx_{{TABLE_1}}_patient` on `(patient_id)`
- `idx_{{TABLE_1}}_created_at` on `(created_at DESC)`
- `idx_{{TABLE_1}}_composite` on `(tenant_id, patient_id, created_at DESC)`

**RLS Policy:**
```sql
ALTER TABLE {{SCHEMA_NAME}}.{{TABLE_1}} ENABLE ROW LEVEL SECURITY;
ALTER TABLE {{SCHEMA_NAME}}.{{TABLE_1}} FORCE ROW LEVEL SECURITY;

CREATE POLICY {{TABLE_1}}_tenant_isolation ON {{SCHEMA_NAME}}.{{TABLE_1}}
  USING (tenant_id = current_setting('app.tenant_id')::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid);
```

**Audit:**
- INSERT/UPDATE/DELETE → `audit_log` table (hash chained)

---

### 3.2 {{TABLE_2}}

(نفس النمط...)

---

## 4. الـ Views

### 4.1 `vw_{{DEPT_SLUG}}_active_patients`
```sql
CREATE OR REPLACE VIEW {{SCHEMA_NAME}}.vw_{{DEPT_SLUG}}_active_patients AS
SELECT
  p.id, p.full_name_ar, p.full_name_en, p.national_id,
  a.id AS admission_id, a.admitted_at, a.bed_id
FROM patients p
JOIN {{TABLE_2}} t ON t.patient_id = p.id
WHERE a.discharged_at IS NULL
  AND p.tenant_id = current_setting('app.tenant_id')::uuid;
```

---

## 5. الـ Functions

### 5.1 `fn_{{DEPT_SLUG}}_next_available_slot`
```sql
CREATE OR REPLACE FUNCTION {{SCHEMA_NAME}}.fn_{{DEPT_SLUG}}_next_available_slot(
  p_resource_id uuid,
  p_after timestamptz DEFAULT now()
) RETURNS timestamptz AS $$
-- ... implementation
$$ LANGUAGE plpgsql;
```

---

## 6. الـ Triggers

### 6.1 `trg_{{TABLE_1}}_audit`
```sql
CREATE TRIGGER trg_{{TABLE_1}}_audit
AFTER INSERT OR UPDATE OR DELETE ON {{SCHEMA_NAME}}.{{TABLE_1}}
FOR EACH ROW EXECUTE FUNCTION audit.fn_log_change();
```

### 6.2 `trg_{{TABLE_1}}_updated_at`
```sql
CREATE TRIGGER trg_{{TABLE_1}}_updated_at
BEFORE UPDATE ON {{SCHEMA_NAME}}.{{TABLE_1}}
FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
```

---

## 7. الـ Constraints

- **PK:** على كل `id` (uuid)
- **FK:** كل مرجع لجدول آخر → `ON DELETE RESTRICT` (لا cascade)
- **CHECK:** للتحقق من صحة البيانات (e.g., `score >= 0 AND score <= 100`)
- **UNIQUE:** للجداول المرجعية (e.g., `icd10_code` unique per tenant)
- **NOT NULL:** كل الحقول المطلوبة (no silent nulls)

---

## 8. Tenant isolation

كل جدول يحتوي على:
- ✅ `tenant_id uuid NOT NULL` column
- ✅ `FORCE ROW LEVEL SECURITY`
- ✅ Policy `USING (tenant_id = current_setting('app.tenant_id')::uuid)`
- ✅ Policy `WITH CHECK (tenant_id = current_setting('app.tenant_id')::uuid)`

**Test:**
```sql
SET app.tenant_id = 'tenant-A-uuid';
SELECT count(*) FROM {{TABLE_1}}; -- only tenant A rows
SET app.tenant_id = 'tenant-B-uuid';
SELECT count(*) FROM {{TABLE_1}}; -- only tenant B rows, must be different
```

---

## 9. الـ Sample data (anonymized)

```sql
-- 3 sample patients
INSERT INTO {{SCHEMA_NAME}}.{{TABLE_1}} (id, tenant_id, patient_id, ...) VALUES
  ('...', 'tenant-A', 'patient-1', ...),
  ('...', 'tenant-A', 'patient-2', ...),
  ('...', 'tenant-A', 'patient-3', ...);
```

(See `seeders/sample_data.json` for full fixtures.)

---

## 10. الـ Migrations

| # | File | Description |
|---|---|---|
| 01 | `migration_01_up.sql` | Create {{TABLE_1}} |
| 02 | `migration_01_down.sql` | Drop {{TABLE_1}} |
| 03 | `migration_02_up.sql` | Create {{TABLE_2}} |
| 04 | `migration_02_down.sql` | Drop {{TABLE_2}} |
| ... | ... | ... |

---

> **Next:** [03_API_CONTRACT_AR.md](03_API_CONTRACT_AR.md) — OpenAPI 3.0 spec.
