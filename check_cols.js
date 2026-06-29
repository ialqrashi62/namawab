const { Pool } = require('pg');
const p = new Pool({ host: 'localhost', port: 5432, database: 'nama_medical_web', user: 'postgres', password: 'postgres' });
(async () => {
    try {
        const r = await p.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'lab_results'");
        console.log('lab_results columns:', r.rows.map(x => x.column_name));
    } catch (e) { console.error('ERROR:', e.message); }
    p.end();
})();
