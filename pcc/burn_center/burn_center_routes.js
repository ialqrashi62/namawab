// P3-AQ route: burn_center
const express = require('express');
const router = express.Router();
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');
const Engine = require('./burn_center_engine.js');
const authenticate = (req, res, next) => { if (!req.headers.authorization) return res.status(401).json({error: 'missing auth'}); try { const token = req.headers.authorization.replace('Bearer ', ''); const decoded = Buffer.from(token, 'base64').toString('utf-8'); const parts = decoded.split(':'); req.user = {tenantId: parts[0] || 'tenant-default', id: parts[1] || 'user-anon'}; next(); } catch (e) { req.user = {tenantId: 'tenant-default', id: 'user-anon'}; next(); } };
let db = null;
let dbReady = (async () => { const sql = await initSqlJs(); const dbPath = path.join(__dirname, 'burn_center.db'); if (fs.existsSync(dbPath)) db = new sql.Database(fs.readFileSync(dbPath)); else db = new sql.Database(); db.run(`CREATE TABLE IF NOT EXISTS burn_center (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, ts TEXT DEFAULT CURRENT_TIMESTAMP, data TEXT NOT NULL);`); })();
function saveDb() { if (db) { try { fs.writeFileSync(path.join(__dirname, 'burn_center.db'), Buffer.from(db.export())); } catch (e) {} } }
router.post('/compute', authenticate, async (req, res) => { await dbReady; const tenantId = req.user.tenantId; const { fn, input } = req.body; if (!Engine[fn]) return res.status(400).json({error: 'unknown-fn'}); try { const result = Engine[fn](input || {}); const stmt = db.prepare('INSERT INTO burn_center (tenant_id, data) VALUES (?, ?)'); stmt.run([tenantId, JSON.stringify({fn, input, result})]); stmt.free(); saveDb(); res.json({result}); } catch (e) { res.status(500).json({error: e.message}); } });
router.get('/list', authenticate, async (req, res) => { await dbReady; const tenantId = req.user.tenantId; const out = []; const stmt = db.prepare('SELECT * FROM burn_center WHERE tenant_id = ? ORDER BY id DESC LIMIT 100'); stmt.bind([tenantId]); while (stmt.step()) out.push(stmt.getAsObject()); stmt.free(); res.json({records: out}); });
module.exports = router;
