const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ host: 'localhost', port: 5432, database: 'nama_medical_web', user: 'postgres', password: 'postgres' });

(async () => {
    try {
        console.log("Applying RLS fix DDL...");
        const sqlPath = path.join(__dirname, '..', 'docs', 'sql', 'rls_blocker_admissions_transfers_fix_up.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Clean comments from each query properly
        const queries = sqlContent
            .split(';')
            .map(q => q.trim())
            .map(q => {
                return q.split('\n')
                    .filter(line => !line.trim().startsWith('--'))
                    .join('\n')
                    .trim();
            })
            .filter(q => q.length > 0);

        for (const query of queries) {
            console.log(`Executing: ${query}`);
            await pool.query(query);
            console.log("Success.");
        }

        console.log("\nVerifying post-fix RLS status:");
        const res = await pool.query(`
            SELECT relname, relrowsecurity, relforcerowsecurity 
            FROM pg_class c 
            JOIN pg_namespace n ON n.oid = c.relnamespace 
            WHERE n.nspname = 'public' 
              AND c.relname IN ('admissions', 'bed_transfers')
        `);
        console.log(res.rows);

    } catch (e) {
        console.error("Failed to apply RLS DDL:", e.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
})();
