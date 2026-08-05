---
id: DATA-STORAGE
version: 1.0
date: 2026-08-01
owner: SA
status: ACTIVE
---

# Data & Storage — pgvector + Outbox + CDC + Data Vault 2.0

> **Purpose:** Multi-model persistence — relational, JSON, vector — with strong RLS, audit retention, and analytics path.

---

## 1. Global systems comparison

| System | Storage |
|--------|---------|
| **Epic** | Caché (InterSystems) + Oracle + SQL Server |
| **Cerner** | Oracle + DB2 + Millennium model |
| **MEDITECH** | SQL Server + Magic |
| **athena** | PostgreSQL-compatible cloud |
| **SAP IS-H** | HANA in-memory |
| **InterSystems IRIS** | Multi-model DB |
| **AWS HealthLake** | S3 + Athena + FHIR |
| **NamaMedical** | **PostgreSQL + JSONB + pgvector (+ optional ClickHouse for analytics)** |

---

## 2. Production PostgreSQL setup

```sql
-- Already on PostgreSQL 14+, 150+ tables with RLS

-- Add pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Add JSONB for flexibility
ALTER TABLE patients ADD COLUMN extended_attrs JSONB DEFAULT '{}';
```

**Schema layering**:
- **Layer 1 (OLTP)**: hot tables (encounters, orders, results)
- **Layer 2 (warm)**: historical, JSONB-flex
- **Layer 3 (cold)**: archived to S3-compatible (Hetzner Storage Box)

---

## 3. Multi-tenancy + RLS

Every tenant-scoped table:
```sql
ALTER TABLE tablename ENABLE ROW LEVEL SECURITY;
ALTER TABLE tablename FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_scope ON tablename
  USING (tenant_id::text = current_setting('app.tenant_id')::text)
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id')::text);
```

`FORCE_RLS=150` (per AGENTS.md).

**Mandatory test**: cross-tenant query returns 0 rows.

---

## 4. Outbox Pattern (covered in 07-backend/)

See `event_outbox` table in BACKEND_LOGIC.md.

---

## 5. CDC + Analytics path

```sql
-- Logical replication → external consumer (e.g. ClickHouse, BigQuery-equivalent)

CREATE PUBLICATION nama_cdc_pub FOR TABLE
  encounters, orders, lab_orders, imaging_orders, results, payments, claims;

-- Optional: ClickHouse for analytical queries
-- ClickHouse DB: nama_analytics
-- Sync via MaterializedPostgres or kafka-connect
```

---

## 6. Data Vault 2.0 (analytics schema)

```sql
-- Hubs (business keys)
CREATE TABLE hub_patient (patient_bk TEXT PRIMARY KEY, load_dts TIMESTAMPTZ, src TEXT);
-- Links (relationships)
CREATE TABLE link_encounter_order (encounter_bk TEXT, order_bk TEXT, load_dts TIMESTAMPTZ);
-- Satellites (attributes)
CREATE TABLE sat_patient_demographics (patient_bk TEXT, name_ciphered BYTEA, dob_ciphered BYTEA, ...);
```

Built nightly from OLTP via materialized ETL.

---

## 7. Encryption

- **Disk**: at-rest via LUKS on Hetzner Storage Box
- **DB columns**: envelope encryption for sensitive PHI (`crypto_envelope.js`, DPAPI KEK)
- **In transit**: TLS 1.3 minimum
- **Backups**: encrypted separately (`age`/`gpg`)
- **Key rotation**: quarterly (manual or via Vault)

---

## 8. Retention

| Data type | Retention | Reason |
|-----------|-----------|--------|
| Clinical records | 7 years after last encounter | PDPL, CBAHI |
| Audit log | 7 years hash-chained | CBAHI |
| Imaging | 7 years (DICOM) | CBAHI |
| Financial | 7 years | ZATCA |
| Consent records | Until revoked + 7y | PDPL |
| Backups | 30 days rolling | DR |
| Logs (app) | 90 days hot, 2y cold | ops |
| AI prompt audit | 7 years | compliance |

---

## 9. Migrations

Path: `namaweb/migrations/`

**Conventions**:
- One migration per change
- Numbered series: `eN_*` (per epic) / `p1_*` (cross-cutting) / `ex_*` (externally-driven)
- Forward `*_up.sql` + reverse `*_down.sql` (both non-destructive)
- Test in staging before prod
- Linting via `sqlfluff`

---

## 10. Files

```
namaweb/
├── db_postgres.js           # pool + tenant context
├── migrations/
│   ├── eN_*/                # per-epic migrations
│   ├── p1_*/                # cross-cutting
│   └── ex_*/                # external
├── seeds/
└── tests/migrations/
```

---

*Owner: SA — version 1.0 — 2026-08-01*
