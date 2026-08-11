SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname='public'
  AND tablename IN ('patients','invoices','lab_tests_catalog','beds','radiology_catalog',
                    'medical_services','pharmacy_drug_catalog','emergency_beds','wards',
                    'insurance_claims','employees','clinical_departments')
ORDER BY tablename, indexname;
