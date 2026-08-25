require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const path = require("path");
const { pool } = require(path.join(__dirname, "db_postgres"));
(async () => {
  const c1 = await pool.query("SELECT count(*)::int c FROM knowledge_chunks_fb");
  console.log("total rows:", c1.rows[0].c);
  const c2 = await pool.query("SELECT count(*)::int c FROM knowledge_chunks_fb WHERE tenant_id::text = current_setting('app.tenant_id', true)");
  console.log("rows w/ unset app.tenant_id filter:", c2.rows[0].c);
  const c3 = await pool.query("SELECT count(*)::int c FROM knowledge_chunks_fb WHERE tenant_id::text = '11111111-1111-1111-1111-111111111111'");
  console.log("rows w/ explicit tenant:", c3.rows[0].c);
  process.exit(0);
})();
