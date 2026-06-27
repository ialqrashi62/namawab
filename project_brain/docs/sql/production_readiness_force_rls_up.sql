-- ===========================================================================
-- DDL Upgrade Script: Enforce FORCE ROW LEVEL SECURITY on 13 Tables
-- NamaMedical — Production Readiness Execution
-- ===========================================================================

-- 1. Patients Table
ALTER TABLE patients FORCE ROW LEVEL SECURITY;

-- 2. Appointments Table
ALTER TABLE appointments FORCE ROW LEVEL SECURITY;

-- 3. Invoices Table
ALTER TABLE invoices FORCE ROW LEVEL SECURITY;

-- 4. Prescriptions Table
ALTER TABLE prescriptions FORCE ROW LEVEL SECURITY;

-- 5. Lab Results Table
ALTER TABLE lab_results FORCE ROW LEVEL SECURITY;

-- 6. Lab Samples Table
ALTER TABLE lab_samples FORCE ROW LEVEL SECURITY;

-- 7. Lab & Radiology Orders Table
ALTER TABLE lab_radiology_orders FORCE ROW LEVEL SECURITY;

-- 8. Emergency Visits Table
ALTER TABLE emergency_visits FORCE ROW LEVEL SECURITY;

-- 9. Emergency Beds Table
ALTER TABLE emergency_beds FORCE ROW LEVEL SECURITY;

-- 10. Insurance Claims Table
ALTER TABLE insurance_claims FORCE ROW LEVEL SECURITY;

-- 11. Pharmacy Sales Table
ALTER TABLE pharmacy_sales FORCE ROW LEVEL SECURITY;

-- 12. Pharmacy Sale Items Table
ALTER TABLE pharmacy_sale_items FORCE ROW LEVEL SECURITY;

-- 13. Pharmacy Prescriptions Queue Table
ALTER TABLE pharmacy_prescriptions_queue FORCE ROW LEVEL SECURITY;
