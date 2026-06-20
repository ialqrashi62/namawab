/**
 * staging_posting_validation.js  —  STAGING ONLY (127.0.0.1:5433)
 * يثبت أن accounting_posting_service يعمل بأمان ضد مخطط staging المُرحَّل.
 * كل سيناريو داخل معاملة تُدحرَج (ROLLBACK) فتبقى staging نظيفة.
 * تشغيل: ACCOUNTING_POSTING_ENABLED=true node staging_posting_validation.js
 * حماية: يرفض العمل إن لم يكن المنفذ 5433 واسم القاعدة nama_medical_staging_rehearsal.
 */
const { Pool } = require('pg');
const svc = require('./accounting_posting_service');

const pool = new Pool({ host: '127.0.0.1', port: 5433, user: 'postgres', database: 'nama_medical_staging_rehearsal' });
const GREEN = '\x1b[32m', RED = '\x1b[31m', RESET = '\x1b[0m';
let pass = 0, fail = 0;
const ok = (c, n) => { if (c) { console.log(`  ${GREEN}PASS${RESET} ${n}`); pass++; } else { console.log(`  ${RED}FAIL${RESET} ${n}`); fail++; } };
const CTX = { tenantId: 1, facilityId: 1, branchId: 1, createdBy: 'staging_validation' };

async function inTx(fn) {
  const c = await pool.connect();
  try { await c.query('BEGIN'); const r = await fn(c); await c.query('ROLLBACK'); return r; }
  catch (e) { try { await c.query('ROLLBACK'); } catch (_) {} throw e; }
  finally { c.release(); }
}

(async () => {
  // حارس الهدف: staging فقط
  const id = await pool.query("SELECT current_database() db, inet_server_port() port");
  if (id.rows[0].db !== 'nama_medical_staging_rehearsal' || String(id.rows[0].port) !== '5433') {
    console.error('ABORT: not the staging target'); process.exit(2);
  }
  console.log(`Target OK: ${id.rows[0].db}:${id.rows[0].port}\n`);

  console.log('[1] فاتورة نقدية صدرت (issued) — قيد متوازن');
  await inTx(async (c) => {
    const inv = { id: 990001, invoice_number: 'INV-TEST-990001', total: 115 };
    const r = await svc.postInvoiceIssued(c, inv, CTX);
    ok(r.posted === true, 'تم الترحيل');
    const sums = await c.query('SELECT round(sum(debit),2) d, round(sum(credit),2) cr, count(*) n FROM finance_journal_lines WHERE entry_id=$1', [r.entryId]);
    ok(Number(sums.rows[0].d) === 115 && Number(sums.rows[0].cr) === 115, `متوازن d=${sums.rows[0].d} c=${sums.rows[0].cr}`);
    ok(Number(sums.rows[0].n) === 3, '3 أسطر (ذمم/إيراد/ضريبة)');
    const tn = await c.query('SELECT bool_and(tenant_id=1) t FROM finance_journal_lines WHERE entry_id=$1', [r.entryId]);
    ok(tn.rows[0].t === true, 'كل الأسطر tenant_id=1');
  });

  console.log('[2] idempotency — إعادة ترحيل نفس الفاتورة لا تُكرّر');
  await inTx(async (c) => {
    const inv = { id: 990002, invoice_number: 'INV-TEST-990002', total: 230 };
    const r1 = await svc.postInvoiceIssued(c, inv, CTX); ok(r1.posted === true, 'الترحيل الأول');
    const r2 = await svc.postInvoiceIssued(c, inv, CTX); ok(r2.idempotent === true, 'الثاني idempotent (مرفوض بهدوء)');
    const cnt = await c.query("SELECT count(*) n FROM finance_journal_entries WHERE tenant_id=1 AND source_type='invoice' AND source_id=990002");
    ok(Number(cnt.rows[0].n) === 1, 'قيد واحد فقط في DB');
  });

  console.log('[3] تحصيل دفعة (receipt) — نقد مقابل ذمم');
  await inTx(async (c) => {
    const r = await svc.postInvoicePayment(c, { id: 990003, amount: 50 }, CTX, { toBank: false });
    ok(r.posted === true, 'تم ترحيل سند القبض');
    const sums = await c.query('SELECT round(sum(debit),2) d, round(sum(credit),2) cr FROM finance_journal_lines WHERE entry_id=$1', [r.entryId]);
    ok(Number(sums.rows[0].d) === 50 && Number(sums.rows[0].cr) === 50, 'متوازن 50=50');
  });

  console.log('[4] فاتورة تأمين — ذمم تأمين (1110)');
  await inTx(async (c) => {
    const r = await svc.postInvoiceIssued(c, { id: 990004, total: 115 }, CTX, { insurance: true });
    const has = await c.query("SELECT count(*) n FROM finance_journal_lines l JOIN finance_chart_of_accounts a ON a.id=l.account_id WHERE l.entry_id=$1 AND a.account_code='1110' AND l.debit=115", [r.entryId]);
    ok(Number(has.rows[0].n) === 1, 'Dr ذمم تأمين 1110 = 115');
  });

  console.log('[5] إلغاء فاتورة — قيد عكسي');
  await inTx(async (c) => {
    const inv = { id: 990005, invoice_number: 'INV-TEST-990005', total: 115 };
    await svc.postInvoiceIssued(c, inv, CTX);
    const rev = await svc.postInvoiceReversal(c, inv, CTX);
    ok(rev.posted === true, 'تم القيد العكسي');
    const sums = await c.query('SELECT round(sum(debit),2) d, round(sum(credit),2) cr FROM finance_journal_lines WHERE entry_id=$1', [rev.entryId]);
    ok(Number(sums.rows[0].d) === 115 && Number(sums.rows[0].cr) === 115, 'العكس متوازن');
    const arCredit = await c.query("SELECT count(*) n FROM finance_journal_lines l JOIN finance_chart_of_accounts a ON a.id=l.account_id WHERE l.entry_id=$1 AND a.account_code='1100' AND l.credit=115", [rev.entryId]);
    ok(Number(arCredit.rows[0].n) === 1, 'العكس: ذمم مريض تصبح دائنة 115');
  });

  console.log('[6] fail-safe: mapping مفقود يرمي خطأً آمناً (لا قيد)');
  await inTx(async (c) => {
    let threw = null;
    try { await svc.postEntry(c, { sourceType: 'invoice', sourceId: 990006, reference: 'POST:INVOICE:990006', description: 'bad', lines: [{ accountCode: '9999', debit: 10, credit: 0 }, { accountCode: '4000', debit: 0, credit: 10 }] }, CTX); }
    catch (e) { threw = e.code; }
    ok(threw === 'MISSING_ACCOUNT_MAPPING', 'رمز حساب غير موجود => MISSING_ACCOUNT_MAPPING');
  });

  console.log('[7] fail-safe: مستأجر غير صالح (لا حسابات) => يفشل بأمان');
  await inTx(async (c) => {
    let threw = null;
    try { await svc.postInvoiceIssued(c, { id: 990007, total: 115 }, { tenantId: 999, facilityId: 1, branchId: 1 }); }
    catch (e) { threw = e.code; }
    ok(threw === 'MISSING_ACCOUNT_MAPPING', 'مستأجر 999 بلا حسابات => فشل آمن (لا تسريب عبر المستأجرين)');
  });

  console.log('[8] fail-safe: قيد غير متوازن مرفوض');
  await inTx(async (c) => {
    let threw = null;
    try { await svc.postEntry(c, { sourceType: 'invoice', sourceId: 990008, reference: 'POST:INVOICE:990008', description: 'unbal', lines: [{ accountCode: '1100', debit: 100, credit: 0 }, { accountCode: '4000', debit: 0, credit: 90 }] }, CTX); }
    catch (e) { threw = e.code; }
    ok(threw === 'UNBALANCED', '100<>90 => UNBALANCED مرفوض');
  });

  console.log('[9] flag-guard: isEnabled يعكس ACCOUNTING_POSTING_ENABLED');
  ok(svc.isEnabled() === (String(process.env.ACCOUNTING_POSTING_ENABLED).toLowerCase() === 'true'), `isEnabled=${svc.isEnabled()}`);

  console.log('[cleanliness] staging journals غير مكتوبة (كل السيناريوهات ROLLBACK)');
  const left = await pool.query("SELECT count(*) n FROM finance_journal_entries");
  ok(Number(left.rows[0].n) === 0, `journal_entries=${left.rows[0].n} (متوقع 0)`);

  console.log(`\nالنتيجة: ${pass} PASS | ${fail} FAIL`);
  await pool.end();
  process.exit(fail ? 1 : 0);
})().catch(async (e) => { console.error('HARNESS ERROR:', e.message); try { await pool.end(); } catch (_) {} process.exit(3); });
