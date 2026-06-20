/**
 * accounting_posting_service.js
 * ==========================================
 * طبقة توصيل محرك الترحيل المحاسبي بأحداث الفوترة — DB-bound، معاملاتية، idempotent، وعية بالمستأجر.
 *
 * مبادئ السلامة:
 *  - مُعطَّل افتراضياً: لا يعمل إلا عند ACCOUNTING_POSTING_ENABLED === 'true' (الإنتاج يبقى OFF حتى موافقة منفصلة).
 *  - معاملاتي: كل دوال postX تعمل داخل عميل/معاملة واحدة يُمرَّر إليها (fail-closed مع حدث العمل).
 *  - idempotent: يعتمد القيد الفريد uq_journal_idempotency(tenant_id, source_type, source_id)؛
 *    إعادة الترحيل لنفس المستند تُرفَض بهدوء (لا تكرار، لا خطأ).
 *  - وعي المستأجر: يبحث عن الحساب بـ (tenant_id, account_code) فقط؛ يستحيل استخدام حساب مستأجر آخر.
 *  - يرفض غير المتوازن (Σ مدين = Σ دائن) عبر validateBalanced من محرك accounting_posting.
 */

const A = require('./accounting_posting');

function isEnabled() {
  return String(process.env.ACCOUNTING_POSTING_ENABLED).toLowerCase() === 'true';
}

// يبحث عن معرّف الحساب الورقي بالرمز ضمن مستأجر محدّد. يرمي خطأ آمن إن غاب (يُدحرج المعاملة).
async function resolveAccountId(client, tenantId, accountCode) {
  const r = await client.query(
    `SELECT id FROM finance_chart_of_accounts
     WHERE tenant_id = $1 AND account_code = $2 AND is_postable = TRUE AND is_active = 1
     LIMIT 1`,
    [tenantId, accountCode]
  );
  if (!r.rows[0]) {
    const err = new Error(`MISSING_ACCOUNT_MAPPING: tenant=${tenantId} code=${accountCode}`);
    err.code = 'MISSING_ACCOUNT_MAPPING';
    throw err;
  }
  return r.rows[0].id;
}

/**
 * يرحّل قيداً متوازناً واحداً ضمن المعاملة المُمرَّرة.
 * posting = { sourceType, sourceId, description, reference, lines:[{accountCode,debit,credit}] }
 * ctx = { tenantId, facilityId, branchId, createdBy }
 * يعيد: { posted:true, entryId } أو { idempotent:true } إن كان المستند مُرحَّلاً سابقاً.
 */
async function postEntry(client, posting, ctx) {
  const tenantId = ctx.tenantId;
  if (tenantId == null) { const e = new Error('TENANT_REQUIRED'); e.code = 'TENANT_REQUIRED'; throw e; }

  const bal = A.validateBalanced(posting.lines);
  if (!bal.balanced) {
    const e = new Error(`UNBALANCED: debit=${bal.debit} credit=${bal.credit}`);
    e.code = 'UNBALANCED'; throw e;
  }

  // حلّ كل الحسابات أولاً (fail-fast قبل أي إدراج)
  const resolved = [];
  for (const ln of posting.lines) {
    resolved.push({ accountId: await resolveAccountId(client, tenantId, ln.accountCode), debit: A.round2(ln.debit), credit: A.round2(ln.credit) });
  }

  // إدراج رأس القيد — القيد الفريد uq_journal_idempotency يمنع التكرار.
  // نستخدم SAVEPOINT حتى لا يُجهِض unique_violation المعاملةَ الخارجية (سلوك Postgres)،
  // فيبقى حدث العمل المرافق قابلاً للإكمال بأمان عند الترحيل المكرّر.
  let entryId;
  await client.query('SAVEPOINT sp_post_entry');
  try {
    const ins = await client.query(
      `INSERT INTO finance_journal_entries
        (entry_number, entry_date, description, reference, is_auto, is_posted, created_by,
         tenant_id, facility_id, branch_id, source_type, source_id, posting_reference, status, posted_at, posted_by)
       VALUES ($1,$2,$3,$4,1,1,$5,$6,$7,$8,$9,$10,$11,'posted',NOW(),$12)
       RETURNING id`,
      [posting.reference, new Date().toISOString().slice(0, 10), posting.description || '', posting.reference,
       ctx.createdBy || '', tenantId, ctx.facilityId || 0, ctx.branchId || 0,
       posting.sourceType, posting.sourceId, posting.reference, ctx.createdBy || '']
    );
    entryId = ins.rows[0].id;
    await client.query('RELEASE SAVEPOINT sp_post_entry');
  } catch (err) {
    if (err && err.code === '23505') {
      await client.query('ROLLBACK TO SAVEPOINT sp_post_entry'); // المعاملة تبقى صالحة
      return { idempotent: true }; // مُرحَّل سابقاً — لا تكرار
    }
    throw err;
  }

  for (const ln of resolved) {
    await client.query(
      `INSERT INTO finance_journal_lines (entry_id, account_id, debit, credit, tenant_id, facility_id, branch_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [entryId, ln.accountId, ln.debit, ln.credit, tenantId, ctx.facilityId || 0, ctx.branchId || 0]
    );
  }
  return { posted: true, entryId };
}

// ===== أغلفة الأحداث (تستخدم بُناة المحرك) =====

// فاتورة مريض صدرت (نقدي/تأمين حسب الخيار)
async function postInvoiceIssued(client, invoice, ctx, { insurance = false } = {}) {
  const posting = A.buildPatientInvoicePosting(invoice, { insurance });
  return postEntry(client, posting, ctx);
}

// تحصيل دفعة (سند قبض): نقد/بنك حسب طريقة الدفع
async function postInvoicePayment(client, receipt, ctx, { toBank = false } = {}) {
  const posting = A.buildReceiptPosting(receipt, { toBank });
  return postEntry(client, posting, ctx);
}

// إلغاء فاتورة: قيد عكسي للفاتورة الأصلية (مرجع idempotency مستقل لمنع تكرار العكس)
async function postInvoiceReversal(client, invoice, ctx, { insurance = false } = {}) {
  const original = A.buildPatientInvoicePosting(invoice, { insurance });
  const reversed = A.buildReversalLines(original.lines);
  const posting = {
    sourceType: 'invoice_cancel', sourceId: invoice.id,
    description: `إلغاء/عكس فاتورة ${invoice.invoice_number || invoice.id}`,
    reference: A.buildPostingReference('invoice_cancel', invoice.id),
    lines: reversed,
  };
  return postEntry(client, posting, ctx);
}

// استرداد نقدي
async function postRefund(client, refund, ctx, { fromBank = false } = {}) {
  const posting = A.buildRefundPosting(refund, { fromBank });
  return postEntry(client, posting, ctx);
}

// يربط سياق المستأجر على الاتصال حتى تُطبَّق سياسات finance RLS (عند تفعيلها مع دور غير-superuser).
// SET LOCAL عبر set_config(...,true) يُعاد ضبطه تلقائياً عند COMMIT/ROLLBACK (لا تلوّث للـ pool).
async function bindTenant(client, ctx) {
  if (ctx && ctx.tenantId != null) await client.query("SELECT set_config('app.tenant_id', $1, true)", [String(ctx.tenantId)]);
  if (ctx && ctx.facilityId != null) await client.query("SELECT set_config('app.facility_id', $1, true)", [String(ctx.facilityId)]);
}

// يشغّل دالة ترحيل داخل معاملة مخصّصة من الـ pool، مع ربط سياق المستأجر (RLS-ready).
// نموذج pending-posting: الترحيل بعد حفظ حدث العمل؛ idempotency يجعل إعادة المحاولة آمنة بلا تكرار.
async function postInTransaction(pool, ctx, fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await bindTenant(client, ctx);
    const r = await fn(client);
    await client.query('COMMIT');
    return r;
  } catch (e) { try { await client.query('ROLLBACK'); } catch (_) {} throw e; }
  finally { client.release(); }
}

// ===== fail-closed: حدث العمل + الترحيل في معاملة واحدة (يثبّتان معاً أو يتدحرجان معاً) =====
// doEvent(client) ينفّذ حدث العمل (إدراج/تحديث الفاتورة) ويعيد نتيجته (عادةً صف الفاتورة).
// doPost(client, result) يرحّل القيد في نفس المعاملة — يُستدعى فقط عند تفعيل العلم.
// أي فشل (حدث أو ترحيل) => ROLLBACK كامل => لا فاتورة جزئية ولا قيد يتيم.
// idempotency محفوظ عبر SAVEPOINT داخل postEntry. سياق المستأجر مربوط داخل نفس المعاملة.
async function runEventWithPosting(pool, ctx, doEvent, doPost) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await bindTenant(client, ctx);
    const result = await doEvent(client);
    if (isEnabled() && typeof doPost === 'function') {
      await doPost(client, result);
    }
    await client.query('COMMIT');
    return result;
  } catch (e) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    throw e;
  } finally {
    client.release();
  }
}

module.exports = {
  isEnabled, resolveAccountId, postEntry, postInTransaction, bindTenant, runEventWithPosting,
  postInvoiceIssued, postInvoicePayment, postInvoiceReversal, postRefund,
};
