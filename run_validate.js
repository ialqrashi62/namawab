const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ host: 'localhost', port: 5432, database: 'nama_medical_web', user: 'postgres', password: 'postgres' });

(async () => {
    try {
        console.log("Running SQL Validation Queries...");

        // 1. Verify that no new tables were created in the public schema
        const r1 = await pool.query(`
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public' 
              AND tablename IN ('discharge', 'discharges', 'occupancy', 'census', 'bed_occupancy')
        `);
        console.log("=== 1. New Tables Check ===");
        console.log(r1.rows);

        // 2. Inspect RLS policy active status on core tables
        const r2 = await pool.query(`
            SELECT tablename, rowsecurity
            FROM pg_tables
            WHERE schemaname = 'public'
              AND tablename IN ('admissions', 'beds', 'patients', 'wards', 'bed_transfers')
        `);
        console.log("\n=== 2. RLS Status ===");
        console.log(r2.rows);

        // 3. Confirm tenant_id index configuration on admissions and beds
        const r3 = await pool.query(`
            SELECT indexname, indexdef
            FROM pg_indexes
            WHERE schemaname = 'public'
              AND tablename IN ('admissions', 'beds')
        `);
        console.log("\n=== 3. Indexes ===");
        console.log(r3.rows);

        // 4. Count current total capacity, occupied beds, and available beds by tenant
        const r4 = await pool.query(`
            SELECT tenant_id,
                   COUNT(*) AS total_beds,
                   SUM(CASE WHEN status = 'Occupied' THEN 1 ELSE 0 END) AS occupied_beds,
                   SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) AS available_beds
            FROM beds
            GROUP BY tenant_id
        `);
        console.log("\n=== 4. Beds counts by Tenant ===");
        console.log(r4.rows);

        // 5. Count admissions status by tenant to verify no nulls or leakage
        const r5 = await pool.query(`
            SELECT tenant_id, status, COUNT(*) AS admission_count
            FROM admissions
            GROUP BY tenant_id, status
        `);
        console.log("\n=== 5. Admissions count by Tenant and Status ===");
        console.log(r5.rows);

    } catch (e) {
        console.error("Error executing queries:", e);
    } finally {
        await pool.end();
    }
})();
