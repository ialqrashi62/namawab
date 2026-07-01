-- ==========================================
-- Staging-tested artifact for NamaMedical ERP
-- Feature: Facility Platform Extension
-- Status: Tested & Verified on Staging
-- Tables: 17 tables created (pre-existing 'facilities' table excluded)
-- RLS: Enabled & Forced on all 11 tenant-scoped tables
-- ==========================================

-- 1. health_networks
CREATE TABLE IF NOT EXISTS health_networks (
    id SERIAL PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. regions
CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    network_id INTEGER REFERENCES health_networks(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. medical_cities
CREATE TABLE IF NOT EXISTS medical_cities (
    id SERIAL PRIMARY KEY,
    region_id INTEGER REFERENCES regions(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. facility_types
CREATE TABLE IF NOT EXISTS facility_types (
    code VARCHAR(10) PRIMARY KEY,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT
);

-- 5. facility_templates
CREATE TABLE IF NOT EXISTS facility_templates (
    id SERIAL PRIMARY KEY,
    type_code VARCHAR(10) REFERENCES facility_types(code) ON DELETE CASCADE,
    template_name TEXT NOT NULL
);

-- 6. facility_template_departments
CREATE TABLE IF NOT EXISTS facility_template_departments (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES facility_templates(id) ON DELETE CASCADE,
    department_id INTEGER NOT NULL
);

-- 7. facility_enabled_departments
CREATE TABLE IF NOT EXISTS facility_enabled_departments (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    department_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_modified_by INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL
);

-- 8. facility_buildings
CREATE TABLE IF NOT EXISTS facility_buildings (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id INTEGER NOT NULL
);

-- 9. facility_floors
CREATE TABLE IF NOT EXISTS facility_floors (
    id SERIAL PRIMARY KEY,
    building_id INTEGER REFERENCES facility_buildings(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    floor_number INTEGER,
    tenant_id INTEGER NOT NULL
);

-- 10. facility_rooms
CREATE TABLE IF NOT EXISTS facility_rooms (
    id SERIAL PRIMARY KEY,
    floor_id INTEGER REFERENCES facility_floors(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,
    type TEXT,
    tenant_id INTEGER NOT NULL
);

-- 11. facility_beds
CREATE TABLE IF NOT EXISTS facility_beds (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES facility_rooms(id) ON DELETE CASCADE,
    bed_number TEXT NOT NULL,
    status TEXT DEFAULT 'Available',
    tenant_id INTEGER NOT NULL
);

-- 12. facility_services
CREATE TABLE IF NOT EXISTS facility_services (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    service_code TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    price REAL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    tenant_id INTEGER NOT NULL
);

-- 13. facility_operating_hours
CREATE TABLE IF NOT EXISTS facility_operating_hours (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    day_of_week INTEGER,
    start_time TIME,
    end_time TIME,
    tenant_id INTEGER NOT NULL
);

-- 14. facility_accreditations
CREATE TABLE IF NOT EXISTS facility_accreditations (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    accreditation_name TEXT,
    expiry_date DATE,
    status TEXT,
    tenant_id INTEGER NOT NULL
);

-- 15. facility_insurance_contracts
CREATE TABLE IF NOT EXISTS facility_insurance_contracts (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    insurance_company_id INTEGER,
    contract_number TEXT,
    discount_percentage REAL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    tenant_id INTEGER NOT NULL
);

-- 16. facility_dashboard_widgets
CREATE TABLE IF NOT EXISTS facility_dashboard_widgets (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    widget_key TEXT NOT NULL,
    display_order INTEGER,
    is_visible BOOLEAN DEFAULT TRUE,
    tenant_id INTEGER NOT NULL
);

-- 17. facility_navigation_items
CREATE TABLE IF NOT EXISTS facility_navigation_items (
    id SERIAL PRIMARY KEY,
    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
    role_id INTEGER,
    nav_title_ar TEXT,
    nav_title_en TEXT,
    route_path TEXT,
    tenant_id INTEGER NOT NULL
);

-- RLS Enforcement & Policies for all 11 tenant-scoped tables
ALTER TABLE "facility_enabled_departments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "facility_enabled_departments" FORCE ROW LEVEL SECURITY;
CREATE POLICY "rls_facility_enabled_departments_tenant_isolation" ON "facility_enabled_departments"
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

ALTER TABLE "facility_buildings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "facility_buildings" FORCE ROW LEVEL SECURITY;
CREATE POLICY "rls_facility_buildings_tenant_isolation" ON "facility_buildings"
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

ALTER TABLE "facility_floors" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "facility_floors" FORCE ROW LEVEL SECURITY;
CREATE POLICY "rls_facility_floors_tenant_isolation" ON "facility_floors"
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

ALTER TABLE "facility_rooms" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "facility_rooms" FORCE ROW LEVEL SECURITY;
CREATE POLICY "rls_facility_rooms_tenant_isolation" ON "facility_rooms"
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

ALTER TABLE "facility_beds" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "facility_beds" FORCE ROW LEVEL SECURITY;
CREATE POLICY "rls_facility_beds_tenant_isolation" ON "facility_beds"
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

ALTER TABLE "facility_services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "facility_services" FORCE ROW LEVEL SECURITY;
CREATE POLICY "rls_facility_services_tenant_isolation" ON "facility_services"
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

ALTER TABLE "facility_operating_hours" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "facility_operating_hours" FORCE ROW LEVEL SECURITY;
CREATE POLICY "rls_facility_operating_hours_tenant_isolation" ON "facility_operating_hours"
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

ALTER TABLE "facility_accreditations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "facility_accreditations" FORCE ROW LEVEL SECURITY;
CREATE POLICY "rls_facility_accreditations_tenant_isolation" ON "facility_accreditations"
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

ALTER TABLE "facility_insurance_contracts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "facility_insurance_contracts" FORCE ROW LEVEL SECURITY;
CREATE POLICY "rls_facility_insurance_contracts_tenant_isolation" ON "facility_insurance_contracts"
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

ALTER TABLE "facility_dashboard_widgets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "facility_dashboard_widgets" FORCE ROW LEVEL SECURITY;
CREATE POLICY "rls_facility_dashboard_widgets_tenant_isolation" ON "facility_dashboard_widgets"
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

ALTER TABLE "facility_navigation_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "facility_navigation_items" FORCE ROW LEVEL SECURITY;
CREATE POLICY "rls_facility_navigation_items_tenant_isolation" ON "facility_navigation_items"
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
