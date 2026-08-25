const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeFinanceRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, fe, E10_ACCOUNT_CLASSES, e10Err, e10IntId, e10PostingEnabled, e10RequireTenant, e10ZatcaEnabled, ensureCOAAccount, idempotencyGuard, postTransactionToGL }) {
    const router = express.Router();
router.get('/api/finance/accounts', requireAuth, requireRole('finance', 'accounts', 'invoices'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e10RequireTenant(req);

        res.json((await pool.query('SELECT * FROM finance_chart_of_accounts WHERE tenant_id=$1 AND is_active=1 ORDER BY account_code', [tenantId])).rows);

    } catch (e) { e10Err(res, e); }

});

router.post('/api/finance/accounts', requireAuth, requireRole('finance', 'accounts', 'invoices'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e10RequireTenant(req);

        const { account_code, account_name_ar, account_name_en, parent_id } = req.body;

        // account_class is server-validated (client cannot inject an arbitrary class).

        const account_class = E10_ACCOUNT_CLASSES.includes(req.body.account_class) ? req.body.account_class

            : (E10_ACCOUNT_CLASSES.includes(req.body.account_type) ? req.body.account_type : null);

        if (!account_code || !String(account_code).trim()) return res.status(422).json({ error: 'account_code required' });

        if (!account_class) return res.status(422).json({ error: 'account_class must be one of ' + E10_ACCOUNT_CLASSES.join('/') });

        const parentId = e10IntId(parent_id); // null if not a positive int

        // uniqueness within tenant

        const dup = (await pool.query('SELECT id FROM finance_chart_of_accounts WHERE tenant_id=$1 AND account_code=$2', [tenantId, String(account_code).trim()])).rows[0];

        if (dup) return res.status(409).json({ error: 'Account code already exists' });

        const result = await pool.query(

            'INSERT INTO finance_chart_of_accounts (account_code, account_name_ar, account_name_en, parent_id, account_type, account_class, tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',

            [String(account_code).trim(), account_name_ar || '', account_name_en || '', parentId || 0, account_class, account_class, tenantId]);

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_LEDGER_ACCOUNT', 'Finance', `CoA ${account_code} (${account_class})`, req.ip);

        res.json((await pool.query('SELECT * FROM finance_chart_of_accounts WHERE id=$1 AND tenant_id=$2', [result.rows[0].id, tenantId])).rows[0]);

    } catch (e) { e10Err(res, e); }

});

router.get('/api/finance/journal', requireAuth, requireRole('finance', 'accounts', 'invoices'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e10RequireTenant(req);

        const rows = (await pool.query(

            `SELECT je.*,

                    COALESCE((SELECT SUM(jl.debit)  FROM finance_journal_lines jl WHERE jl.entry_id=je.id AND jl.tenant_id=$1),0)  AS total_debit,

                    COALESCE((SELECT SUM(jl.credit) FROM finance_journal_lines jl WHERE jl.entry_id=je.id AND jl.tenant_id=$1),0) AS total_credit

               FROM finance_journal_entries je

              WHERE je.tenant_id=$1

              ORDER BY je.id DESC`, [tenantId])).rows;

        res.json(rows);

    } catch (e) { e10Err(res, e); }

});

router.get('/api/finance/journal/:id', requireAuth, requireRole('finance', 'accounts', 'invoices'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e10RequireTenant(req);

        const entryId = e10IntId(req.params.id);

        if (!entryId) return res.status(422).json({ error: 'Invalid entry id' });

        const entry = (await pool.query('SELECT * FROM finance_journal_entries WHERE id=$1 AND tenant_id=$2', [entryId, tenantId])).rows[0];

        if (!entry) return res.status(404).json({ error: 'Not found' });

        const lines = (await pool.query(

            `SELECT jl.*, coa.account_code, coa.account_name_en, coa.account_name_ar

               FROM finance_journal_lines jl

               LEFT JOIN finance_chart_of_accounts coa ON coa.id=jl.account_id AND coa.tenant_id=$2

              WHERE jl.entry_id=$1 AND jl.tenant_id=$2

              ORDER BY jl.id`, [entryId, tenantId])).rows;

        res.json({ entry, lines });

    } catch (e) { e10Err(res, e); }

});

router.post('/api/finance/journal', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, validateBody(RS.journalCreate), async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e10RequireTenant(req);

        await client.query("SELECT set_config('app.tenant_id', $1, false)", [String(tenantId)]);

        const { entry_date, description, reference, lines } = req.body;

        const sourceType = ['MANUAL', 'INVOICE', 'SYSTEM'].includes(req.body.source_type) ? req.body.source_type : 'MANUAL';



        // 1) SERVER-SIDE balanced-entry validation (anti-spoof: client totals never trusted).

        const v = fe.validateBalancedEntry(lines);

        if (!v.ok) {

            const code = v.reason === 'unbalanced' ? 422 : 422;

            return res.status(code).json({ error: 'Unbalanced or invalid journal entry', reason: v.reason, debit: v.debit, credit: v.credit });

        }



        // 2) every referenced account must belong to THIS tenant (cross-tenant account => 422, no leak).

        const accountIds = [...new Set(v.lines.map(l => l.account_id))];

        const owned = (await client.query('SELECT id FROM finance_chart_of_accounts WHERE tenant_id=$1 AND id = ANY($2::int[])', [tenantId, accountIds])).rows;

        if (owned.length !== accountIds.length) return res.status(422).json({ error: 'One or more accounts are invalid for this tenant' });



        await client.query('BEGIN');

        const entryNumber = 'JV-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-8);

        const entry = (await client.query(

            `INSERT INTO finance_journal_entries (entry_number, entry_date, description, reference, source_type, posting_status, is_posted, created_by, tenant_id, balanced_at)

             VALUES ($1,$2,$3,$4,$5,'DRAFT',0,$6,$7, now()) RETURNING *`,

            [entryNumber, entry_date || new Date().toISOString().slice(0, 10), description || '', reference || '', sourceType, req.session.user?.display_name || '', tenantId])).rows[0];

        for (const ln of v.lines) {

            await client.query(

                'INSERT INTO finance_journal_lines (entry_id, account_id, debit, credit, notes, tenant_id) VALUES ($1,$2,$3,$4,$5,$6)',

                [entry.id, ln.account_id, ln.debit, ln.credit, '', tenantId]);

        }

        await client.query('COMMIT');

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CREATE_JOURNAL_ENTRY', 'Finance',

            `${entryNumber} DRAFT balanced (${v.debit}=${v.credit}) src=${sourceType}`, req.ip);

        res.json({ entry, debit: v.debit, credit: v.credit, posting_status: 'DRAFT' });

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) { }

        e10Err(res, e);

    } finally {

        try { await client.query("SELECT set_config('app.tenant_id', '', false)"); } catch (_) { }

        client.release();

    }

});

router.post('/api/finance/journal/:id/post', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, idempotencyGuard, async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e10RequireTenant(req);

        await client.query("SELECT set_config('app.tenant_id', $1, false)", [String(tenantId)]);

        const entryId = e10IntId(req.params.id);

        if (!entryId) return res.status(422).json({ error: 'Invalid entry id' });

        if (!e10PostingEnabled()) {

            return res.status(403).json({ error: 'Accounting posting is disabled (ACCOUNTING_POSTING_ENABLED off)', posting_enabled: false });

        }

        await client.query('BEGIN');

        // lock the row before the state flip (no double-post race).

        const entry = (await client.query('SELECT * FROM finance_journal_entries WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [entryId, tenantId])).rows[0];

        if (!entry) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Not found' }); }

        if (entry.posting_status !== 'DRAFT') { await client.query('ROLLBACK'); return res.status(409).json({ error: `Cannot post entry in ${entry.posting_status} state` }); }

        // re-verify balance from PERSISTED lines before posting (defence-in-depth; never trust prior state).

        const lines = (await client.query('SELECT account_id, debit, credit FROM finance_journal_lines WHERE entry_id=$1 AND tenant_id=$2', [entryId, tenantId])).rows;

        const v = fe.validateBalancedEntry(lines);

        if (!v.ok) { await client.query('ROLLBACK'); return res.status(422).json({ error: 'Persisted lines are not balanced; refusing to post', reason: v.reason }); }

        await client.query(

            `UPDATE finance_journal_entries SET posting_status='POSTED', is_posted=1, posted_by=$1, posted_at=now() WHERE id=$2 AND tenant_id=$3`,

            [req.session.user?.id || null, entryId, tenantId]);

        await client.query('COMMIT');

        logAudit(req.session.user?.id, req.session.user?.display_name, 'POST_JOURNAL_ENTRY', 'Finance',

            `${entry.entry_number} POSTED (${v.debit}=${v.credit})`, req.ip);

        res.json({ success: true, id: entryId, posting_status: 'POSTED' });

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) { }

        e10Err(res, e);

    } finally {

        try { await client.query("SELECT set_config('app.tenant_id', '', false)"); } catch (_) { }

        client.release();

    }

});

router.post('/api/finance/journal/:id/reverse', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, idempotencyGuard, async (req, res) => {

    const client = await pool.connect();

    try {

        const tenantId = e10RequireTenant(req);

        await client.query("SELECT set_config('app.tenant_id', $1, false)", [String(tenantId)]);

        const entryId = e10IntId(req.params.id);

        if (!entryId) return res.status(422).json({ error: 'Invalid entry id' });

        if (!e10PostingEnabled()) return res.status(403).json({ error: 'Accounting posting is disabled', posting_enabled: false });

        await client.query('BEGIN');

        const entry = (await client.query('SELECT * FROM finance_journal_entries WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [entryId, tenantId])).rows[0];

        if (!entry) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Not found' }); }

        if (entry.posting_status !== 'POSTED') { await client.query('ROLLBACK'); return res.status(409).json({ error: `Only POSTED entries can be reversed (state ${entry.posting_status})` }); }

        const origLines = (await client.query('SELECT account_id, debit, credit FROM finance_journal_lines WHERE entry_id=$1 AND tenant_id=$2', [entryId, tenantId])).rows;

        const revLines = fe.buildReversalLines(origLines);

        const v = fe.validateBalancedEntry(revLines);

        if (!v.ok) { await client.query('ROLLBACK'); return res.status(422).json({ error: 'Reversal not balanced', reason: v.reason }); }

        const revNumber = 'JV-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-8) + 'R';

        const rev = (await client.query(

            `INSERT INTO finance_journal_entries (entry_number, entry_date, description, reference, source_type, posting_status, is_posted, created_by, posted_by, posted_at, balanced_at, reversal_of, tenant_id)

             VALUES ($1,$2,$3,$4,'REVERSAL','POSTED',1,$5,$6,now(),now(),$7,$8) RETURNING *`,

            [revNumber, new Date().toISOString().slice(0, 10), 'Reversal of ' + entry.entry_number, entry.entry_number, req.session.user?.display_name || '', req.session.user?.id || null, entryId, tenantId])).rows[0];

        for (const ln of v.lines) {

            await client.query('INSERT INTO finance_journal_lines (entry_id, account_id, debit, credit, notes, tenant_id) VALUES ($1,$2,$3,$4,$5,$6)',

                [rev.id, ln.account_id, ln.debit, ln.credit, 'Reversal', tenantId]);

        }

        await client.query(`UPDATE finance_journal_entries SET posting_status='REVERSED' WHERE id=$1 AND tenant_id=$2`, [entryId, tenantId]);

        await client.query('COMMIT');

        logAudit(req.session.user?.id, req.session.user?.display_name, 'REVERSE_JOURNAL_ENTRY', 'Finance', `${entry.entry_number} reversed by ${revNumber}`, req.ip);

        res.json({ success: true, reversal: rev, posting_status: 'REVERSED' });

    } catch (e) {

        try { await client.query('ROLLBACK'); } catch (_) { }

        e10Err(res, e);

    } finally {

        try { await client.query("SELECT set_config('app.tenant_id', '', false)"); } catch (_) { }

        client.release();

    }

});

router.get('/api/finance/aging', requireAuth, requireRole('finance', 'accounts', 'invoices'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e10RequireTenant(req);

        // outstanding balance per invoice = total - paid; aged by created_at. Tenant-scoped.

        const rows = (await pool.query(

            `SELECT id, patient_name,

                    (COALESCE(total,0) - COALESCE(paid,0))               AS balance,

                    GREATEST(0, DATE_PART('day', now() - created_at))::int AS age_days

               FROM invoices

              WHERE tenant_id=$1 AND (COALESCE(total,0) - COALESCE(paid,0)) > 0`, [tenantId])).rows;

        const summary = fe.ageInvoices(rows);

        res.json({ summary, invoices: rows });

    } catch (e) { e10Err(res, e); }

});

router.get('/api/finance/posting-status', requireAuth, requireRole('finance', 'accounts', 'invoices'), requireTenantScope, async (req, res) => {

    try { e10RequireTenant(req); res.json({ posting_enabled: e10PostingEnabled(), zatca_enabled: e10ZatcaEnabled() }); }

    catch (e) { e10Err(res, e); }

});

router.get('/api/finance/vouchers', requireAuth, requireRole('finance', 'accounts', 'invoices'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e10RequireTenant(req);

        res.json((await pool.query('SELECT * FROM finance_vouchers WHERE tenant_id=$1 ORDER BY id DESC', [tenantId])).rows);

    } catch (e) { e10Err(res, e); }

});

router.get('/api/finance/daily-close', requireAuth, requireRole('finance', 'accounts', 'invoices'), requireTenantScope, async (req, res) => {

    try {

        const tenantId = e10RequireTenant(req);

        res.json((await pool.query('SELECT * FROM daily_close WHERE tenant_id=$1 ORDER BY created_at DESC LIMIT 30', [tenantId])).rows);

    } catch (e) { e10Err(res, e); }

});

router.post('/api/finance/daily-close', requireAuth, requireRole('finance', 'accounts', 'invoices'), requireTenantScope, idempotencyGuard, async (req, res) => {

    try {

        const tenantId = e10RequireTenant(req); // E10: fail-closed; aggregate only THIS tenant's invoices (no cross-tenant leak)

        const today = new Date().toISOString().split('T')[0];

        // Aggregate today's transactions — every invoices aggregation explicitly tenant-scoped.

        const cash = (await pool.query("SELECT COALESCE(SUM(total),0) as t, COUNT(*) as c FROM invoices WHERE tenant_id=$1 AND created_at::date=CURRENT_DATE AND payment_method='Cash'", [tenantId])).rows[0];

        const card = (await pool.query("SELECT COALESCE(SUM(total),0) as t FROM invoices WHERE tenant_id=$1 AND created_at::date=CURRENT_DATE AND payment_method='Card'", [tenantId])).rows[0];

        const ins = (await pool.query("SELECT COALESCE(SUM(total),0) as t FROM invoices WHERE tenant_id=$1 AND created_at::date=CURRENT_DATE AND payment_method='Insurance'", [tenantId])).rows[0];

        const totalTx = (await pool.query("SELECT COUNT(*) as c FROM invoices WHERE tenant_id=$1 AND created_at::date=CURRENT_DATE", [tenantId])).rows[0];

        const { opening_balance, closing_balance, notes } = req.body;

        const totalCash = Number(cash.t); const totalCard = Number(card.t); const totalIns = Number(ins.t);

        const variance = Number(closing_balance || 0) - (Number(opening_balance || 0) + totalCash);

        const result = await pool.query('INSERT INTO daily_close (close_date, cashier, total_cash, total_card, total_insurance, total_transactions, opening_balance, closing_balance, variance, notes, status, closed_by, tenant_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',

            [today, req.session.user.name, totalCash, totalCard, totalIns, Number(totalTx.c), Number(opening_balance || 0), Number(closing_balance || 0), variance, notes || '', 'Closed', req.session.user.name, tenantId]);

        logAudit(req.session.user.id, req.session.user.name, 'DAILY_CLOSE', 'Finance', `Daily close for ${today}: Cash=${totalCash}, Card=${totalCard}`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { e10Err(res, e); }

});

router.get('/api/finance/summary', requireAuth, requireRole('finance', 'accounts', 'invoices'), requireTenantScope, async (req, res) => {

    try {

        // I-2 fix: fail-closed — no unscoped fallback. e10RequireTenant throws 403 if tenant missing.

        const tenantId = e10RequireTenant(req);

        const { from, to } = req.query;

        let where = "WHERE total > 0 AND tenant_id = $1";

        let p = [tenantId];

        if (from) { where += " AND created_at >= $" + (p.length + 1); p.push(from); }

        if (to) { where += " AND created_at <= $" + (p.length + 1); p.push(to + ' 23:59:59'); }



        const total = (await pool.query("SELECT COALESCE(SUM(total),0) as revenue, COUNT(*) as count FROM invoices " + where, p)).rows[0];

        const paid = (await pool.query("SELECT COALESCE(SUM(total),0) as paid FROM invoices " + where + " AND paid=1", p)).rows[0];

        const unpaid = (await pool.query("SELECT COALESCE(SUM(total),0) as unpaid FROM invoices " + where + " AND (paid=0 OR paid IS NULL)", p)).rows[0];

        const byMethod = (await pool.query("SELECT COALESCE(payment_method,'Cash') as method, SUM(total) as amount, COUNT(*) as cnt FROM invoices " + where + " AND paid=1 GROUP BY payment_method ORDER BY amount DESC", p)).rows;

        const byService = (await pool.query("SELECT COALESCE(service_type,description,'Other') as service, SUM(total) as amount, COUNT(*) as cnt FROM invoices " + where + " GROUP BY COALESCE(service_type,description,'Other') ORDER BY amount DESC LIMIT 10", p)).rows;

        const daily = (await pool.query("SELECT DATE(created_at) as day, SUM(total) as amount FROM invoices " + where + " GROUP BY DATE(created_at) ORDER BY day", p)).rows;



        res.json({ revenue: total.revenue, count: total.count, paid: paid.paid, unpaid: unpaid.unpaid, byMethod, byService, daily });

    } catch (e) { e10Err(res, e); }

});

router.get('/api/finance/ap', requireAuth, requireRole('finance', 'accounts', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { vendor_id, status } = req.query;

        let q = 'SELECT * FROM finance_accounts_payable WHERE tenant_id=$1';

        const params = [tid];

        if (vendor_id) { params.push(parseInt(vendor_id)); q += ` AND vendor_id=$${params.length}`; }

        if (status) { params.push(status); q += ` AND payment_status=$${params.length}`; }

        q += ' ORDER BY due_date ASC';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/finance/ap', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, idempotencyGuard, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { vendor_id, vendor_name, invoice_number, invoice_date, due_date, po_reference, description, subtotal, vat_amount, total_amount, gl_account_code, cost_center, notes } = req.body;

        if (!vendor_name || !invoice_number || !total_amount) return res.status(400).json({ error: 'vendor_name, invoice_number, total_amount required' });

        

        // IDOR check for vendor if supplied

        if (vendor_id) {

            const vCheck = await pool.query('SELECT id FROM vendors WHERE id=$1 AND tenant_id=$2', [parseInt(vendor_id), tid]);

            if (!vCheck.rows.length) return res.status(403).json({ error: 'Vendor not found or access denied' });

        }

        

        const r = await pool.query(

            `INSERT INTO finance_accounts_payable 

                (vendor_id, vendor_name, invoice_number, invoice_date, due_date, po_reference, description, subtotal, vat_amount, total_amount, payment_status, gl_account_code, cost_center, tenant_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Unpaid', $11, $12, $13) RETURNING *`,

            [vendor_id ? parseInt(vendor_id) : null, vendor_name, invoice_number, invoice_date || new Date().toISOString().slice(0,10), due_date || null, po_reference || '', description || '', parseFloat(subtotal)||0, parseFloat(vat_amount)||0, parseFloat(total_amount), gl_account_code || '', cost_center || '', tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'AP_INVOICE_CREATE', 'Finance', `AP Invoice #${invoice_number} created for vendor ${vendor_name}`, tid);

        res.json({ success: true, record: r.rows[0] });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/finance/ap/:id/pay', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, idempotencyGuard, async (req, res) => {

    const client = await pool.connect();

    try {

        const { tenantId: tid } = getRequestTenantContext(req);

        const id = parseInt(req.params.id);

        const { payment_amount, payment_method, payment_reference } = req.body;

        if (!payment_amount) return res.status(400).json({ error: 'payment_amount required' });

        

        await client.query('BEGIN');

        await client.query("SELECT set_config('app.tenant_id', $1, true)", [String(tid)]);

        

        const ap = (await client.query('SELECT * FROM finance_accounts_payable WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [id, tid])).rows[0];

        if (!ap) {

            await client.query('ROLLBACK');

            return res.status(404).json({ error: 'AP invoice not found' });

        }

        

        const payAmt = parseFloat(payment_amount);

        const newPaid = parseFloat(ap.paid_amount || 0) + payAmt;

        let newStatus = 'Partial';

        if (newPaid >= parseFloat(ap.total_amount)) newStatus = 'Paid';

        

        const r = await client.query(

            `UPDATE finance_accounts_payable 

             SET paid_amount=$1, payment_status=$2, payment_method=$3, payment_reference=$4, payment_date=CURRENT_DATE, approved_by=$5, approved_at=NOW()

             WHERE id=$6 AND tenant_id=$7 RETURNING *`,

            [newPaid, newStatus, payment_method || 'Bank Transfer', payment_reference || '', req.session.user.display_name, id, tid]

        );

        

        // Ensure GL accounts exist in the tenant's Chart of Accounts

        const apAccountCode = ap.gl_account_code || '210101';

        const apAccountId = await ensureCOAAccount(tid, apAccountCode, 'Accounts Payable Control Account', 'حساب مراقبة الذمم الدائنة', 'Liability', client);

        const cashAccountId = await ensureCOAAccount(tid, '110101', 'Cash/Bank Clearing Account', 'حساب تسوية النقدية/البنك', 'Asset', client);

        

        // Generate Entry Number

        const entryNumber = 'JV-AP-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-6);

        

        // Post transaction to GL

        const lines = [

            { accountId: apAccountId, debit: payAmt, credit: 0, notes: `Debit Accounts Payable for Invoice#${ap.invoice_number}` },

            { accountId: cashAccountId, debit: 0, credit: payAmt, notes: `Credit Cash/Bank for Invoice#${ap.invoice_number}` }

        ];

        

        await postTransactionToGL(tid, entryNumber, `Payment of AP Invoice#${ap.invoice_number} to ${ap.vendor_name}`, `AP-PAY-${id}`, 'SYSTEM', lines, client);

        

        await client.query('COMMIT');

        logAudit(req.session.user.id, req.session.user.display_name, 'AP_INVOICE_PAID', 'Finance', `AP Invoice #${id} paid SAR ${payAmt} (Status: ${newStatus})`, tid);

        res.json({ success: true, record: r.rows[0] });

    } catch (e) {

        await client.query('ROLLBACK');

        res.status(500).json({ error: e.message });

    } finally {

        client.release();

    }

});

router.get('/api/finance/ar', requireAuth, requireRole('finance', 'accounts', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { patient_id, status } = req.query;

        let q = 'SELECT * FROM finance_accounts_receivable WHERE tenant_id=$1';

        const params = [tid];

        if (patient_id) { params.push(parseInt(patient_id)); q += ` AND patient_id=$${params.length}`; }

        if (status) { params.push(status); q += ` AND collection_status=$${params.length}`; }

        q += ' ORDER BY due_date ASC';

        res.json((await pool.query(q, params)).rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/finance/ar', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, idempotencyGuard, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { patient_id, patient_name, payer_type = 'Patient', payer_id, payer_name, invoice_number, visit_id, admission_id, due_date, subtotal, discount_amount, insurance_share, patient_share, vat_amount, total_amount, notes } = req.body;

        if (!invoice_number || !total_amount) return res.status(400).json({ error: 'invoice_number, total_amount required' });

        

        // IDOR check for patient

        if (patient_id) {

            const pCheck = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [parseInt(patient_id), tid]);

            if (!pCheck.rows.length) return res.status(403).json({ error: 'Patient not found or access denied' });

        }

        

        const r = await pool.query(

            `INSERT INTO finance_accounts_receivable 

                (patient_id, patient_name, payer_type, payer_id, payer_name, invoice_number, visit_id, admission_id, invoice_date, due_date, subtotal, discount_amount, insurance_share, patient_share, vat_amount, total_amount, collected_amount, collection_status, notes, tenant_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_DATE, $9, $10, $11, $12, $13, $14, $15, 0, 'Outstanding', $16, $17) RETURNING *`,

            [patient_id ? parseInt(patient_id) : null, patient_name || '', payer_type, payer_id ? parseInt(payer_id) : null, payer_name || '', invoice_number, visit_id ? parseInt(visit_id) : null, admission_id ? parseInt(admission_id) : null, due_date || null, parseFloat(subtotal)||0, parseFloat(discount_amount)||0, parseFloat(insurance_share)||0, parseFloat(patient_share)||0, parseFloat(vat_amount)||0, parseFloat(total_amount), notes || '', tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'AR_INVOICE_CREATE', 'Finance', `AR Invoice #${invoice_number} created (Total: SAR ${total_amount})`, tid);

        res.json({ success: true, record: r.rows[0] });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/finance/ar/:id/collect', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, idempotencyGuard, async (req, res) => {

    const client = await pool.connect();

    try {

        const { tenantId: tid } = getRequestTenantContext(req);

        const id = parseInt(req.params.id);

        const { collection_amount } = req.body;

        if (!collection_amount) return res.status(400).json({ error: 'collection_amount required' });

        

        await client.query('BEGIN');

        await client.query("SELECT set_config('app.tenant_id', $1, true)", [String(tid)]);

        

        const ar = (await client.query('SELECT * FROM finance_accounts_receivable WHERE id=$1 AND tenant_id=$2 FOR UPDATE', [id, tid])).rows[0];

        if (!ar) {

            await client.query('ROLLBACK');

            return res.status(404).json({ error: 'AR invoice not found' });

        }

        

        const colAmt = parseFloat(collection_amount);

        const newCol = parseFloat(ar.collected_amount || 0) + colAmt;

        let newStatus = 'Partial';

        if (newCol >= parseFloat(ar.total_amount)) newStatus = 'Collected';

        

        const r = await client.query(

            `UPDATE finance_accounts_receivable 

             SET collected_amount=$1, collection_status=$2, last_payment_date=CURRENT_DATE, last_payment_amount=$3

             WHERE id=$4 AND tenant_id=$5 RETURNING *`,

            [newCol, newStatus, colAmt, id, tid]

        );

        

        // Ensure GL accounts exist in the tenant's Chart of Accounts

        const cashAccountId = await ensureCOAAccount(tid, '110101', 'Cash/Bank Clearing Account', 'حساب تسوية النقدية/البنك', 'Asset', client);

        const arAccountId = await ensureCOAAccount(tid, '120101', 'Accounts Receivable Control Account', 'حساب مراقبة الذمم المدينة', 'Asset', client);

        

        // Generate Entry Number

        const entryNumber = 'JV-AR-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-6);

        

        // Post transaction to GL

        const lines = [

            { accountId: cashAccountId, debit: colAmt, credit: 0, notes: `Debit Cash/Bank for Collection on Invoice#${ar.invoice_number}` },

            { accountId: arAccountId, debit: 0, credit: colAmt, notes: `Credit Accounts Receivable for Collection on Invoice#${ar.invoice_number}` }

        ];

        

        await postTransactionToGL(tid, entryNumber, `Collection of AR Invoice#${ar.invoice_number} from patient ${ar.patient_name}`, `AR-COLLECT-${id}`, 'SYSTEM', lines, client);

        

        await client.query('COMMIT');

        logAudit(req.session.user.id, req.session.user.display_name, 'AR_INVOICE_COLLECTED', 'Finance', `AR Invoice #${id} collected SAR ${colAmt} (Status: ${newStatus})`, tid);

        res.json({ success: true, record: r.rows[0] });

    } catch (e) {

        await client.query('ROLLBACK');

        res.status(500).json({ error: e.message });

    } finally {

        client.release();

    }

});

router.get('/api/finance/reports/snapshots', requireAuth, requireRole('finance', 'accounts', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const rows = await pool.query('SELECT id, report_type, report_period_start, report_period_end, generated_at, generated_by, total_revenue, total_expenses, net_income, status FROM finance_report_snapshots WHERE tenant_id=$1 ORDER BY report_period_end DESC', [tid]);

        res.json(rows.rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/finance/reports/generate', requireAuth, requireRole('finance', 'accounts', 'admin'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { report_type = 'PL', period_start, period_end } = req.body;

        if (!period_start || !period_end) return res.status(400).json({ error: 'period_start and period_end required (YYYY-MM-DD)' });

        

        // Sum revenue and expenses for the period in the General Ledger / billing records

        const rev = await pool.query(

            "SELECT COALESCE(SUM(total_with_vat - vat_amount), 0) val FROM zatca_invoices WHERE tenant_id=$1 AND created_at BETWEEN $2::timestamp AND $3::timestamp",

            [tid, period_start + ' 00:00:00', period_end + ' 23:59:59']

        );

        const apSum = await pool.query(

            "SELECT COALESCE(SUM(total_amount - vat_amount), 0) val FROM finance_accounts_payable WHERE tenant_id=$1 AND invoice_date BETWEEN $2::date AND $3::date",

            [tid, period_start, period_end]

        );

        

        const totalRevenue = parseFloat(rev.rows[0].val) || 0;

        const totalExpenses = parseFloat(apSum.rows[0].val) || 0;

        const netIncome = totalRevenue - totalExpenses;

        

        const reportData = {

            metadata: { generated_by: req.session.user.display_name, generated_at: new Date() },

            summary: { totalRevenue, totalExpenses, netIncome }

        };

        

        const r = await pool.query(

            `INSERT INTO finance_report_snapshots 

                (report_type, report_period_start, report_period_end, generated_by, report_data, total_revenue, total_expenses, net_income, status, tenant_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Final', $9) RETURNING *`,

            [report_type, period_start, period_end, req.session.user.display_name, JSON.stringify(reportData), totalRevenue, totalExpenses, netIncome, tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'FINANCIAL_REPORT_SNAPSHOT', 'Finance', `Financial report generated (${report_type}) for ${period_start} to ${period_end}`, tid);

        res.json({ success: true, snapshot: r.rows[0] });

    } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }

});


    return router;
}
