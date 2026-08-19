# P0-3 BCMA — Data Model

## Tables

### bcma_mar_entries (Master)
- id SERIAL PK
- tenant_id INTEGER (RLS)
- mar_id VARCHAR(50) UNIQUE
- patient_id INTEGER
- order_id INTEGER (link to pharmacy_orders)
- drug_id INTEGER
- drug_name VARCHAR(255)
- dose VARCHAR(50)
- route VARCHAR(30)
- scheduled_at TIMESTAMPTZ
- administered_at TIMESTAMPTZ
- five_rights JSONB
- status VARCHAR(20)
- alerts TEXT[]
- created_by INTEGER

### bcma_overrides
- id SERIAL PK
- tenant_id INTEGER
- override_id VARCHAR(50)
- mar_id VARCHAR(50)
- reason_code VARCHAR(20)
- override_notes TEXT
- witness_id INTEGER
- approved_by INTEGER
- created_at TIMESTAMPTZ

### bcma_disposals
- id SERIAL PK
- tenant_id INTEGER
- disposal_id VARCHAR(50)
- drug_name VARCHAR(255)
- witness_id INTEGER
- disposal_method VARCHAR(30)
- logged_by INTEGER

### bcma_patient_scans
- id SERIAL PK
- tenant_id INTEGER
- patient_id INTEGER
- barcode VARCHAR(80)
- scanned_by INTEGER
- scanned_at TIMESTAMPTZ

### bcma_drug_scans
- id SERIAL PK
- tenant_id INTEGER
- drug_id INTEGER
- barcode VARCHAR(80)
- lot_number VARCHAR(50)
- exp_date DATE
- scanned_by INTEGER