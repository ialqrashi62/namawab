require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const fs = require("fs");
const path = require("path");
const { pool } = require(path.join(__dirname, "db_postgres"));
(async () => {
  for (const f of ["f019_knowledge_fallback_up.sql"]) {
    const p = path.join(__dirname, "migrations", f);
    try { await pool.query(fs.readFileSync(p,"utf8")); console.log("APPLIED", f); }
    catch(e){ console.log("ERR", f, e.message.slice(0,120)); }
  }
  process.exit(0);
})();
