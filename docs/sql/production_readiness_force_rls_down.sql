-- ===========================================================================
-- DDL Downgrade Script: Disable FORCE ROW LEVEL SECURITY on 13 Tables
-- NamaMedical — Production Readiness Rollback
-- ===========================================================================

-- 1. Patients Table
ALTER TABLE patients NO FORCE ROW LEVEL SECURITY;

-- 2. Appointments Table
ALTER TABLE appointments NO FORCE ROW LEVEL SECURITY;

-- 3. Invoices Table
ALTER TABLE invoices NO FORCE ROW LEVEL SECURITY;

-- 4. Prescriptions Table
ALTER TABLE prescriptions NO FORCE ROW LEVEL SECURITY;

-- 5. Lab Results Table
ALTER TABLE lab_results NO FORCE ROW LEVEL SECURITY;

-- 6. Lab Samples Table
ALTER TABLE lab_samples NO FORCE ROW LEVEL SECURITY;

-- 7. Lab & Radiology Orders Table
ALTER TABLE lab_radiology_orders NO FORCE ROW LEVEL SECURITY;

-- 8. Emergency Visits Table
ALTER TABLE emergency_visits NO FORCE ROW LEVEL SECURITY;

-- 9. Emergency Beds Table
ALTER TABLE emergency_beds NO FORCE ROW LEVEL SECURITY;

-- 10. Insurance Claims Table
ALTER TABLE insurance_claims NO FORCE ROW LEVEL SECURITY;

-- 11. Pharmacy Sales Table
ALTER TABLE pharmacy_sales NO FORCE ROW LEVEL SECURITY;

-- 12. Pharmacy Sale Items Table
ALTER TABLE pharmacy_sale_items NO FORCE ROW LEVEL SECURITY;

-- 13. Pharmacy Prescriptions Queue Table
ALTER TABLE pharmacy_prescriptions_queue NO FORCE ROW LEVEL SECURITY;
