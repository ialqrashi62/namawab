-- e21_clinical_specialties_up.sql
-- Migrations for Metadata-Driven EMR & Clinical Subspecialties

-- 1. Clinical Departments (supports 100+ specialties)
CREATE TABLE IF NOT EXISTS clinical_departments (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'CARDIOLOGY', 'PEDIATRICS_NICU'
    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL, -- Internal Medicine, Surgical, Pediatrics, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clinical Templates for each specialty (form structures in JSONB)
CREATE TABLE IF NOT EXISTS clinical_templates (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES clinical_departments(id) ON DELETE CASCADE,
    template_name_en VARCHAR(150) NOT NULL,
    template_name_ar VARCHAR(150) NOT NULL,
    form_structure JSONB NOT NULL, -- Describes fields: { fields: [...] }
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Patient Clinical Records (locked and signed EMR records)
CREATE TABLE IF NOT EXISTS patient_clinical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    encounter_id INTEGER, -- Visit / admission ID
    template_id INTEGER NOT NULL REFERENCES clinical_templates(id),
    recorded_values JSONB NOT NULL, -- Form input values: { 'bp': 120, 'hr': 80 }
    doctor_id INTEGER NOT NULL REFERENCES system_users(id),
    is_locked BOOLEAN DEFAULT FALSE,
    signature VARCHAR(256),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL
);

-- 4. Clinical Knowledge Vectors (for RAG/LangChain)
-- Using REAL[] as a highly portable vector fallback to ensure out-of-the-box compatibility
CREATE TABLE IF NOT EXISTS clinical_knowledge_vectors (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES clinical_departments(id) ON DELETE CASCADE,
    content_chunk TEXT NOT NULL,
    embedding REAL[], -- 1536-dimensional OpenAI embeddings array
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast search and tenant isolation
CREATE INDEX IF NOT EXISTS idx_patient_clinical_records_patient ON patient_clinical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_clinical_records_tenant ON patient_clinical_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clinical_templates_dept ON clinical_templates(department_id);
