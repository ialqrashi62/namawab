-- saudi_compliance_up.sql
-- Migrations for ZATCA Phase 2, CBAHI OVR, and PDPL Consent

-- 1. PDPL Patient Consent Columns
ALTER TABLE patients ADD COLUMN IF NOT EXISTS privacy_consent_signed BOOLEAN DEFAULT FALSE;
ALTER TABLE patients ADD COLUMN IF NOT EXISTS privacy_consent_date TIMESTAMP;

-- 2. ZATCA Phase 2 Hashing & Chaining Columns
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS invoice_hash VARCHAR(64);
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS previous_invoice_hash VARCHAR(64);

-- 3. quality_incidents facility_id Column
ALTER TABLE quality_incidents ADD COLUMN IF NOT EXISTS facility_id INTEGER;

-- 4. CBAHI OVR Incident Table (fallback/extra)
CREATE TABLE IF NOT EXISTS clinical_incidents (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    reporter_id INTEGER REFERENCES system_users(id),
    reporter_name VARCHAR(150),
    incident_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    department VARCHAR(100),
    severity VARCHAR(50), -- Low, Medium, High, Extreme
    description TEXT,
    action_taken TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Under Review, Resolved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
