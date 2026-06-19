const { Pool } = require('pg');
const pool = new Pool({ host: 'localhost', port: 5432, database: 'nama_medical_web', user: 'postgres', password: 'postgres' });

(async () => {
    try {
        console.log("=== DB ENVIRONMENT & METADATA ===");
        const dbMeta = await pool.query("SELECT current_database(), current_schema(), current_user, version()");
        console.log(dbMeta.rows[0]);

        console.log("\n=== RECORD COUNTS ===");
        const admCount = await pool.query("SELECT COUNT(*) AS count FROM admissions");
        const transCount = await pool.query("SELECT COUNT(*) AS count FROM bed_transfers");
        console.log(`Admissions: ${admCount.rows[0].count}`);
        console.log(`Bed Transfers: ${transCount.rows[0].count}`);

        console.log("\n=== PG_CLASS RLS STATE ===");
        const pgClassRes = await pool.query(`
            SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity 
            FROM pg_class c 
            JOIN pg_namespace n ON n.oid = c.relnamespace 
            WHERE n.nspname = 'public' 
              AND c.relname IN ('admissions', 'bed_transfers')
        `);
        console.log(pgClassRes.rows);

        console.log("\n=== PG_POLICIES ===");
        const policies = await pool.query("SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('admissions', 'bed_transfers')");
        console.log(policies.rows);

        console.log("\n=== COLUMNS IN admissions ===");
        const admCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'admissions'");
        console.log(admCols.rows.map(c => c.column_name).join(', '));

        console.log("\n=== COLUMNS IN bed_transfers ===");
        const transCols = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bed_transfers'");
        console.log(transCols.rows.map(c => c.column_name).join(', '));

    } catch (e) {
        console.error("Error running metadata checks:", e);
    } finally {
        await pool.end();
    }
})();
