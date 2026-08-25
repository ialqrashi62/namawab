// local migration runner for f016-f018 (uses app's own pool)
require('dotenv').config();
const fs = require('fs');
const { pool } = require('./db_postgres');

(async () => {
  const files = ['migrations/f016_analytics_up.sql','migrations/f017_helpdesk_up.sql','migrations/f018_apm_up.sql'];
  for (const f of files) {
    const sql = fs.readFileSync(f, 'utf8');
    try { await pool.query(sql); console.log('APPLIED', f); }
    catch (e) { console.log('ERR', f, e.message); }
  }
  // quick verify tables exist
  const r = await pool.query("SELECT tablename FROM pg_tables WHERE tablename IN ('analytics_events','helpdesk_tickets','apm_metrics') ORDER BY 1");
  console.log('TABLES:', r.rows.map(x => x.tablename).join(','));
  process.exit(0);
})();
