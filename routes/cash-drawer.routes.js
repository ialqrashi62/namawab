const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeCashDrawerRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.post('/api/cash-drawer/open', requireAuth, async (req, res) => {
    try {
        const { opening_balance } = req.body;
        // cash_drawer schema provisioned out-of-band (route_level_ddl_cleanup_candidate_*); no DDL in handler.
        // Check if already open
        const existing = (await pool.query("SELECT * FROM cash_drawer WHERE user_id=$1 AND status='open'", [req.session.user?.id])).rows[0];
        if (existing) return res.status(400).json({ error: 'Drawer already open. Close current session first.' });

        const result = await pool.query(
            'INSERT INTO cash_drawer (user_id, user_name, opening_balance) VALUES ($1,$2,$3) RETURNING *',
            [req.session.user?.id, req.session.user?.display_name, opening_balance || 0]
        );
        res.json(result.rows[0]);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.post('/api/cash-drawer/close', requireAuth, async (req, res) => {
    try {
        const { counted_cash, notes } = req.body;
        const drawer = (await pool.query("SELECT * FROM cash_drawer WHERE user_id=$1 AND status='open'", [req.session.user?.id])).rows[0];
        if (!drawer) return res.status(400).json({ error: 'No open drawer found' });

        // Calculate expected from invoices during session
        const cashInvoices = (await pool.query(
            "SELECT COALESCE(SUM(CASE WHEN total > 0 THEN total ELSE 0 END),0) as income, COALESCE(SUM(CASE WHEN total < 0 THEN ABS(total) ELSE 0 END),0) as refunds FROM invoices WHERE payment_method='Cash' AND created_at >= $1 AND created_by=$2",
            [drawer.opened_at, drawer.user_name]
        )).rows[0];

        const expected = parseFloat(drawer.opening_balance) + parseFloat(cashInvoices.income) - parseFloat(cashInvoices.refunds);
        const difference = parseFloat(counted_cash) - expected;

        await pool.query(
            "UPDATE cash_drawer SET closing_balance=$1, expected_balance=$2, difference=$3, status='closed', closed_at=CURRENT_TIMESTAMP, notes=$4 WHERE id=$5",
            [counted_cash, expected, difference, notes, drawer.id]
        );

        logAudit(req.session.user?.id, req.session.user?.display_name, 'CLOSE_CASH_DRAWER', 'Finance',
            'Expected: ' + expected.toFixed(2) + ' Counted: ' + counted_cash + ' Diff: ' + difference.toFixed(2), req.ip);

        res.json({ expected: expected.toFixed(2), counted: counted_cash, difference: difference.toFixed(2), income: cashInvoices.income, refunds: cashInvoices.refunds });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/cash-drawer/current', requireAuth, async (req, res) => {
    try {
        const drawer = (await pool.query("SELECT * FROM cash_drawer WHERE user_id=$1 AND status='open' ORDER BY id DESC LIMIT 1", [req.session.user?.id])).rows[0];
        if (!drawer) return res.json({ open: false });

        const cashInvoices = (await pool.query(
            "SELECT COALESCE(SUM(CASE WHEN total > 0 THEN total ELSE 0 END),0) as income, COUNT(CASE WHEN total > 0 THEN 1 END) as tx_count FROM invoices WHERE payment_method='Cash' AND created_at >= $1 AND created_by=$2",
            [drawer.opened_at, drawer.user_name]
        )).rows[0];

        res.json({ open: true, drawer, income: cashInvoices.income, tx_count: cashInvoices.tx_count });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
