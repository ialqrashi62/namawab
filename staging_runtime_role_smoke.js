/**
 * staging_runtime_role_smoke.js  —  STAGING ONLY (127.0.0.1:5433)
 * يثبت أن التطبيق يعمل تحت دور غير-superuser `nama_medical_app` مع إنفاذ RLS.
 * يستخدم admin pool (postgres) للتهيئة/التنظيف فقط، و app pool (nama_medical_app) لكل اختبارات الـ smoke.
 * تصنيف الأخطاء: "permission denied" => GRANT GAP ؛ "row-level security" => رفض RLS (متوقَّع).
 */
const { Pool } = require('pg');
const svc = require('./accounting_posting_service');
const admin = new Pool({ host:'127.0.0.1', port:5433, user:'postgres', database:'nama_medical_staging_rehearsal' });
const app   = new Pool({ host:'127.0.0.1', port:5433, user:'nama_medical_app', database:'nama_medical_staging_rehearsal' });
const G='\x1b[32m', R='\x1b[31m', Y='\x1b[33m', X='\x1b[0m';
let pass=0, fail=0, gaps=[]; const ok=(c,n)=>{console.log(`  ${c?G+'PASS':R+'FAIL'}${X} ${n}`); c?pass++:fail++;};
const note=(n)=>console.log(`  ${Y}NOTE${X} ${n}`);

async function appCount(table, tenant) {
  const c = await app.connect();
  try { await c.query('BEGIN'); if (tenant!=null) await c.query("SELECT set_config('app.tenant_id',$1,true)",[String(tenant)]);
    const r = await c.query(`SELECT count(*)::int n FROM ${table} WHERE __marker IS NOT DISTINCT FROM __marker`); // placeholder replaced below
    await c.query('ROLLBACK'); return r.rows[0].n;
  } catch(e){ await c.query('ROLLBACK').catch(()=>{}); throw e; } finally { c.release(); }
}
// نسخة آمنة: عدّ صفوف الاختبار فقط عبر شرط مميّز لكل جدول
async function appCountWhere(table, where, tenant) {
  const c = await app.connect();
  try { await c.query('BEGIN'); if (tenant!=null) await c.query("SELECT set_config('app.tenant_id',$1,true)",[String(tenant)]);
    const r = await c.query(`SELECT count(*)::int n FROM ${table} WHERE ${where}`);
    await c.query('ROLLBACK'); return r.rows[0].n;
  } catch(e){ await c.query('ROLLBACK').catch(()=>{}); return {err:e}; } finally { c.release(); }
}

(async()=>{
  const id = await admin.query("SELECT current_database() db, inet_server_port() p");
  if (id.rows[0].db!=='nama_medical_staging_rehearsal'||String(id.rows[0].p)!=='5433'){console.error('ABORT target');process.exit(2);}
  // confirm app role is non-super/non-bypass
  const rp = await app.query("SELECT rolsuper, rolbypassrls FROM pg_roles WHERE rolname=current_user");
  ok(rp.rows[0].rolsuper===false && rp.rows[0].rolbypassrls===false, `smoke runs as non-superuser/non-bypassrls (${(await app.query('SELECT current_user')).rows[0].current_user})`);

  console.log('\n=== SETUP (admin): seed 2-tenant data ===');
  await admin.query("INSERT INTO patients (name_ar,name_en,tenant_id,facility_id) VALUES ('SMK مريض1','SMK Pat1',1,1),('SMK مريض2','SMK Pat2',2,1)");
  await admin.query("INSERT INTO appointments (patient_name,doctor_name,department,appt_date,appt_time,status,tenant_id) VALUES ('SMK_A1','D','C','2026-06-22','09:00','Booked',1),('SMK_A2','D','C','2026-06-22','10:00','Booked',2)");
  await admin.query("INSERT INTO invoices (patient_name,total,invoice_number,tenant_id,facility_id) VALUES ('SMK_I1',100,'INV-SMK-1',1,1),('SMK_I2',200,'INV-SMK-2',2,1)");
  await admin.query("INSERT INTO finance_journal_entries (entry_number,entry_date,tenant_id,facility_id,branch_id,source_type,source_id,status,is_posted) VALUES ('SMKJ1','2026-06-22',1,1,1,'invoice',970001,'posted',1),('SMKJ2','2026-06-22',2,1,1,'invoice',970002,'posted',1)");
  await admin.query("INSERT INTO medical_records (patient_id,diagnosis,tenant_id) VALUES (1,'SMK_dx1',1),(2,'SMK_dx2',2)");

  console.log('\n=== Gate 4: READ smoke under runtime role (RLS tables) ===');
  for (const [tbl, where] of [['patients',"name_en LIKE 'SMK%'"],['appointments',"patient_name LIKE 'SMK%'"],['invoices',"invoice_number LIKE 'INV-SMK%'"],['finance_journal_entries',"source_id IN (970001,970002)"]]) {
    const n0 = await appCountWhere(tbl, where, null);
    const n1 = await appCountWhere(tbl, where, 1);
    const n2 = await appCountWhere(tbl, where, 2);
    if (n0.err||n1.err||n2.err) { const e=(n0.err||n1.err||n2.err); const gap=/permission denied/i.test(e.message); if(gap) gaps.push(`${tbl}: ${e.message}`); ok(false, `${tbl} read (${gap?'GRANT GAP':'err'}: ${e.message})`); continue; }
    ok(n0===0 && n1===1 && n2===1, `${tbl}: no-ctx=${n0} t1=${n1} t2=${n2} (expect 0/1/1)`);
  }
  // finance_chart_of_accounts read (tenant 1 = 30)
  const coa = await appCountWhere('finance_chart_of_accounts', 'is_active=1', 1);
  ok(coa===30 || (typeof coa==='number' && coa>0), `finance_chart_of_accounts read under role (t1)=${typeof coa==='number'?coa:coa.err?.message}`);

  console.log('\n=== Gate 4b: non-RLS tenant table (residual risk) ===');
  const mr0 = await appCountWhere('medical_records', "diagnosis LIKE 'SMK%'", null);
  note(`medical_records (NO RLS) no-context returns ${typeof mr0==='number'?mr0:mr0.err?.message} rows => relies on APP-LEVEL filter (residual risk, in 72-table backlog)`);

  console.log('\n=== Gate 5: WRITE smoke under runtime role ===');
  // insert appointment tenant 1 (context 1) => ok
  {
    const c = await app.connect();
    try { await c.query('BEGIN'); await c.query("SELECT set_config('app.tenant_id','1',true)");
      await c.query("INSERT INTO appointments (patient_name,doctor_name,department,appt_date,appt_time,status,tenant_id) VALUES ('SMK_W1','D','C','2026-06-23','09:00','Booked',1)");
      ok(true,'insert appointment (tenant1, context1) under role'); await c.query('ROLLBACK');
    } catch(e){ const gap=/permission denied/i.test(e.message); if(gap)gaps.push('appointments insert: '+e.message); ok(false,`insert appointment (${gap?'GRANT GAP':e.message})`); await c.query('ROLLBACK').catch(()=>{}); } finally{ c.release(); }
  }
  // cross-tenant insert rejected
  {
    const c = await app.connect(); let msg=null;
    try { await c.query('BEGIN'); await c.query("SELECT set_config('app.tenant_id','1',true)");
      await c.query("INSERT INTO invoices (patient_name,total,invoice_number,tenant_id) VALUES ('SMK_XT',1,'INV-SMK-XT',2)"); await c.query('COMMIT');
    } catch(e){ msg=e.message; await c.query('ROLLBACK').catch(()=>{}); } finally{ c.release(); }
    ok(msg && /row-level security/i.test(msg), `cross-tenant invoice insert rejected (${msg?msg.slice(0,42):'NOT rejected!'})`);
  }
  // update under role (context 1)
  {
    const c = await app.connect();
    try { await c.query('BEGIN'); await c.query("SELECT set_config('app.tenant_id','1',true)");
      const u = await c.query("UPDATE invoices SET total=101 WHERE invoice_number='INV-SMK-1'"); ok(u.rowCount===1,`update own-tenant invoice under role (rows=${u.rowCount})`); await c.query('ROLLBACK');
    } catch(e){ const gap=/permission denied/i.test(e.message); if(gap)gaps.push('invoices update: '+e.message); ok(false,`update invoice (${gap?'GRANT GAP':e.message})`); await c.query('ROLLBACK').catch(()=>{}); } finally{ c.release(); }
  }

  console.log('\n=== Gate 6: POSTING engine smoke under runtime role ===');
  process.env.ACCOUNTING_POSTING_ENABLED='true';
  try {
    const r = await svc.postInTransaction(app, {tenantId:1,facilityId:1,branchId:1,createdBy:'smoke'}, (c)=> svc.postInvoiceIssued(c, {id:970501,invoice_number:'INV-SMK-P1',total:115}, {tenantId:1,facilityId:1,branchId:1,createdBy:'smoke'}));
    ok(r.posted===true || r.idempotent===true, 'posting under role committed');
    // verify + balanced, then clean the committed posting
    const v = await admin.query("SELECT round(sum(l.debit),2) d, round(sum(l.credit),2) cr FROM finance_journal_lines l JOIN finance_journal_entries e ON e.id=l.entry_id WHERE e.source_type='invoice' AND e.source_id=970501");
    ok(Number(v.rows[0].d)===115 && Number(v.rows[0].cr)===115, `posted entry balanced (d=${v.rows[0].d} c=${v.rows[0].cr})`);
    // idempotent retry
    const r2 = await svc.postInTransaction(app, {tenantId:1,facilityId:1,branchId:1,createdBy:'smoke'}, (c)=> svc.postInvoiceIssued(c, {id:970501,invoice_number:'INV-SMK-P1',total:115}, {tenantId:1,facilityId:1,branchId:1,createdBy:'smoke'}));
    ok(r2.idempotent===true, 'retry idempotent (no duplicate)');
  } catch(e){ const gap=/permission denied/i.test(e.message); if(gap)gaps.push('posting: '+e.message); ok(false,`posting under role (${gap?'GRANT GAP':e.message})`); }
  // missing mapping fail-safe under role
  try {
    await svc.postInTransaction(app, {tenantId:1,facilityId:1,branchId:1,createdBy:'smoke'}, (c)=> svc.postEntry(c, {sourceType:'invoice',sourceId:970599,reference:'POST:INVOICE:970599',description:'bad',lines:[{accountCode:'9999',debit:5,credit:0},{accountCode:'4000',debit:0,credit:5}]}, {tenantId:1,facilityId:1,branchId:1,createdBy:'smoke'}));
    ok(false,'missing mapping should have failed');
  } catch(e){ ok(e.code==='MISSING_ACCOUNT_MAPPING', `missing mapping fails safely under role (${e.code})`); }

  console.log('\n=== CLEANUP (admin) ===');
  await admin.query("DELETE FROM finance_journal_entries WHERE source_id IN (970001,970002,970501)");
  await admin.query("DELETE FROM patients WHERE name_en LIKE 'SMK%'");
  await admin.query("DELETE FROM appointments WHERE patient_name LIKE 'SMK%'");
  await admin.query("DELETE FROM invoices WHERE invoice_number LIKE 'INV-SMK%'");
  await admin.query("DELETE FROM medical_records WHERE diagnosis LIKE 'SMK%'");

  console.log(`\nSMOKE RESULT: ${pass} PASS | ${fail} FAIL | grant_gaps=${gaps.length}`);
  if (gaps.length) gaps.forEach(g=>console.log('  GAP: '+g));
  await admin.end(); await app.end();
  process.exit(fail?1:0);
})().catch(async e=>{console.error('HARNESS ERROR:', e.message); try{await admin.end();await app.end();}catch(_){}process.exit(3);});
