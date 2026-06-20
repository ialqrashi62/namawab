/**
 * staging_failclosed_test.js  —  STAGING ONLY (127.0.0.1:5433)
 * يثبت سلوك fail-closed: حدث الفاتورة + الترحيل يثبّتان معاً أو يتدحرجان معاً.
 * admin pool (postgres) للتهيئة/التنظيف؛ app pool (nama_medical_app) لتشغيل المنطق.
 * لا يلمس الإنتاج. كل البيانات اصطناعية وتُحذف في النهاية.
 */
const { Pool } = require('pg');
const svc = require('./accounting_posting_service');
const admin = new Pool({ host:'127.0.0.1', port:5433, user:'postgres', database:'nama_medical_staging_rehearsal' });
const app   = new Pool({ host:'127.0.0.1', port:5433, user:'nama_medical_app', database:'nama_medical_staging_rehearsal' });
const G='\x1b[32m',R='\x1b[31m',X='\x1b[0m'; let pass=0,fail=0;
const ok=(c,n)=>{console.log(`  ${c?G+'PASS':R+'FAIL'}${X} ${n}`);c?pass++:fail++;};
const CTX={tenantId:1,facilityId:1,branchId:1,createdBy:'failclosed_test'};

// محاكاة منطق المسار fail-closed: إدراج فاتورة + ترحيل في نفس المعاملة
async function issueInvoice(total, {forceBadPost=false, insurance=false}={}) {
  return svc.runEventWithPosting(app, CTX,
    async (c) => {
      const r = await c.query("INSERT INTO invoices (patient_name,total,invoice_number,tenant_id,facility_id) VALUES ($1,$2,$3,1,1) RETURNING id",
        ['FC_TEST', total, 'INV-FC-'+total+'-'+(forceBadPost?'BAD':'OK')]);
      return (await c.query('SELECT * FROM invoices WHERE id=$1',[r.rows[0].id])).rows[0];
    },
    async (c, inv) => {
      if (forceBadPost) {
        // ترحيل إلى حساب غير موجود => يجب أن يفشل ويُدحرج كل شيء
        return svc.postEntry(c, {sourceType:'invoice',sourceId:inv.id,reference:'POST:INVOICE:'+inv.id,description:'bad',
          lines:[{accountCode:'9999',debit:total,credit:0},{accountCode:'4000',debit:0,credit:total}]}, CTX);
      }
      return svc.postInvoiceIssued(c, inv, CTX, { insurance });
    }
  );
}

(async()=>{
  const g=await admin.query("SELECT current_database() db, inet_server_port() p");
  if(g.rows[0].db!=='nama_medical_staging_rehearsal'||String(g.rows[0].p)!=='5433'){console.error('ABORT target');process.exit(2);}

  console.log('\n=== SETUP: ensure finance foundation + role on staging ===');
  // foundation: DDL up + CoA seed (idempotent) + role + grants
  const fs=require('fs');
  const ddl=fs.readFileSync('C:/Users/ice/nama_staging_artifacts/up.sql','utf8');
  const coa=fs.readFileSync('C:/Users/ice/nama_staging_artifacts/coa.sql','utf8');
  await admin.query(ddl); await admin.query(coa);
  await admin.query("DO $$ BEGIN IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname='nama_medical_app') THEN CREATE ROLE nama_medical_app LOGIN NOSUPERUSER NOBYPASSRLS; END IF; END $$;");
  await admin.query("GRANT USAGE ON SCHEMA public TO nama_medical_app; GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO nama_medical_app; GRANT USAGE,SELECT ON ALL SEQUENCES IN SCHEMA public TO nama_medical_app;");
  ok(true,'staging foundation ready (DDL+CoA+role)');

  console.log('\n=== flag ON: success path (invoice + balanced journal atomic) ===');
  process.env.ACCOUNTING_POSTING_ENABLED='true';
  const inv1 = await issueInvoice(115);
  ok(!!inv1 && inv1.id>0, 'invoice committed');
  const j1 = await admin.query("SELECT round(sum(l.debit),2) d, round(sum(l.credit),2) cr, count(*) n FROM finance_journal_lines l JOIN finance_journal_entries e ON e.id=l.entry_id WHERE e.source_type='invoice' AND e.source_id=$1",[inv1.id]);
  ok(Number(j1.rows[0].d)===115 && Number(j1.rows[0].cr)===115, `journal balanced d=${j1.rows[0].d} c=${j1.rows[0].cr}`);
  ok(Number(j1.rows[0].n)===3, '3 journal lines');
  const tn = await admin.query("SELECT bool_and(tenant_id=1) t FROM finance_journal_lines WHERE entry_id=(SELECT id FROM finance_journal_entries WHERE source_type='invoice' AND source_id=$1)",[inv1.id]);
  ok(tn.rows[0].t===true,'journal tenant_id=1 correct');

  console.log('\n=== flag ON: posting failure => invoice ROLLED BACK (fail-closed) ===');
  let threw=null;
  try { await issueInvoice(77,{forceBadPost:true}); } catch(e){ threw=e.code||e.message; }
  ok(threw==='MISSING_ACCOUNT_MAPPING','posting failure threw (event aborted)');
  const orphan = await admin.query("SELECT count(*) n FROM invoices WHERE invoice_number='INV-FC-77-BAD'");
  ok(Number(orphan.rows[0].n)===0,'NO orphan invoice persisted (both rolled back)');

  console.log('\n=== flag ON: idempotency (retry same invoice => no duplicate journal) ===');
  const r2a = await svc.runEventWithPosting(app, CTX, async(c)=>inv1, async(c,inv)=>svc.postInvoiceIssued(c,inv,CTX,{}));
  const dup = await admin.query("SELECT count(*) n FROM finance_journal_entries WHERE source_type='invoice' AND source_id=$1",[inv1.id]);
  ok(Number(dup.rows[0].n)===1,'still exactly 1 journal entry after retry (idempotent)');

  console.log('\n=== flag OFF: invoice created, NO journal ===');
  process.env.ACCOUNTING_POSTING_ENABLED='false';
  const inv3 = await issueInvoice(50);
  ok(!!inv3 && inv3.id>0,'invoice committed with flag OFF');
  const j3 = await admin.query("SELECT count(*) n FROM finance_journal_entries WHERE source_type='invoice' AND source_id=$1",[inv3.id]);
  ok(Number(j3.rows[0].n)===0,'NO journal created when flag OFF');

  console.log('\n=== CLEANUP ===');
  await admin.query("DELETE FROM finance_journal_lines WHERE entry_id IN (SELECT id FROM finance_journal_entries WHERE created_by='failclosed_test')");
  await admin.query("DELETE FROM finance_journal_entries WHERE created_by='failclosed_test'");
  await admin.query("DELETE FROM invoices WHERE patient_name='FC_TEST'");
  await admin.query("DROP OWNED BY nama_medical_app; DROP ROLE IF EXISTS nama_medical_app;").catch(()=>{});

  console.log(`\nFAIL-CLOSED TESTS: ${pass} PASS | ${fail} FAIL`);
  await admin.end(); await app.end();
  process.exit(fail?1:0);
})().catch(async e=>{console.error('HARNESS ERROR:',e.message);try{await admin.end();await app.end();}catch(_){}process.exit(3);});
