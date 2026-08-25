const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeReportsRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/reports/financial', requireAuth, requireRole('finance'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const params = tenantId ? [tenantId] : [];

        const totalRevenueQuery = tenantId ?
            'SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1 AND tenant_id=$1' :
            'SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1';

        const totalPendingQuery = tenantId ?
            'SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=0 AND tenant_id=$1' :
            'SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=0';

        const invoiceCountQuery = tenantId ?
            'SELECT COUNT(*) as cnt FROM invoices WHERE tenant_id=$1' :
            'SELECT COUNT(*) as cnt FROM invoices';

        const monthlyRevenueQuery = tenantId ?
            "SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1 AND created_at >= date_trunc('month', CURRENT_DATE) AND tenant_id=$1" :
            "SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1 AND created_at >= date_trunc('month', CURRENT_DATE)";

        const totalRevenue = (await pool.query(totalRevenueQuery, params)).rows[0].total;
        const totalPending = (await pool.query(totalPendingQuery, params)).rows[0].total;
        const invoiceCount = (await pool.query(invoiceCountQuery, params)).rows[0].cnt;
        const monthlyRevenue = (await pool.query(monthlyRevenueQuery, params)).rows[0].total;

        res.json({ totalRevenue, totalPending, invoiceCount, monthlyRevenue });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/reports/patients', requireAuth, requireRole('reports'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const params = tenantId ? [tenantId] : [];
        const tenantFilter = tenantId ? ' WHERE tenant_id=$1' : '';
        const todayTenantFilter = tenantId ? ' AND tenant_id=$1' : '';
        const todayParams = tenantId ? [tenantId] : [];

        const totalPatients = (await pool.query(`SELECT COUNT(*) as cnt FROM patients${tenantFilter}`, params)).rows[0].cnt;
        const todayPatients = (await pool.query(`SELECT COUNT(*) as cnt FROM patients WHERE created_at >= CURRENT_DATE${todayTenantFilter}`, todayParams)).rows[0].cnt;
        const deptStats = (await pool.query(`SELECT department, COUNT(*) as cnt FROM patients${tenantFilter} GROUP BY department ORDER BY cnt DESC`, params)).rows;
        const statusStats = (await pool.query(`SELECT status, COUNT(*) as cnt FROM patients${tenantFilter} GROUP BY status`, params)).rows;
        res.json({ totalPatients, todayPatients, deptStats, statusStats });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/reports/lab', requireAuth, requireRole('reports'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const params = tenantId ? [tenantId] : [];
        const tenantFilter = tenantId ? ' AND tenant_id=$1' : '';

        const totalOrders = (await pool.query(`SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE is_radiology=0${tenantFilter}`, params)).rows[0].cnt;
        const pendingOrders = (await pool.query(`SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE is_radiology=0 AND status='Requested'${tenantFilter}`, params)).rows[0].cnt;
        const completedOrders = (await pool.query(`SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE is_radiology=0 AND status='Completed'${tenantFilter}`, params)).rows[0].cnt;
        res.json({ totalOrders, pendingOrders, completedOrders });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/reports/commissions', requireAuth, requireRole('finance', 'doctor'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);

        // system_users is a deferred risk table (no tenant_id column)
        const doctors = (await pool.query("SELECT id, display_name, speciality, commission_type, commission_value FROM system_users WHERE role='Doctor'")).rows;
        const results = [];
        for (const dr of doctors) {
            // Get all invoices where doctor is linked via medical_records or consultation invoices
            const revenueQuery = tenantId ?
                `SELECT COALESCE(SUM(i.total), 0) as total FROM invoices i
                 WHERE i.service_type = 'Consultation'
                 AND i.description ILIKE $1 AND i.tenant_id = $2` :
                `SELECT COALESCE(SUM(i.total), 0) as total FROM invoices i
                 WHERE i.service_type = 'Consultation'
                 AND i.description ILIKE $1`;
            const revenueParams = tenantId ? [`%${dr.display_name}%`, tenantId] : [`%${dr.display_name}%`];
            const revenue = (await pool.query(revenueQuery, revenueParams)).rows[0].total || 0;

            // Also get revenue from lab/radiology orders by this doctor
            const orderRevenueQuery = tenantId ?
                `SELECT COALESCE(SUM(price), 0) as total FROM lab_radiology_orders WHERE doctor_id=$1 AND tenant_id=$2` :
                `SELECT COALESCE(SUM(price), 0) as total FROM lab_radiology_orders WHERE doctor_id=$1`;
            const orderRevenueParams = tenantId ? [dr.id, tenantId] : [dr.id];
            const orderRevenue = (await pool.query(orderRevenueQuery, orderRevenueParams)).rows[0].total || 0;

            const totalRevenue = parseFloat(revenue) + parseFloat(orderRevenue);
            let commission = 0;
            if (dr.commission_type === 'percentage') {
                commission = totalRevenue * (dr.commission_value / 100);
            } else {
                // Fixed per patient
                const patientCountQuery = tenantId ?
                    'SELECT COUNT(DISTINCT patient_id) as cnt FROM medical_records WHERE doctor_id=$1 AND tenant_id=$2' :
                    'SELECT COUNT(DISTINCT patient_id) as cnt FROM medical_records WHERE doctor_id=$1';
                const patientCountParams = tenantId ? [dr.id, tenantId] : [dr.id];
                const patientCount = (await pool.query(patientCountQuery, patientCountParams)).rows[0].cnt || 0;
                commission = patientCount * dr.commission_value;
            }
            results.push({
                doctor_id: dr.id, doctor_name: dr.display_name, speciality: dr.speciality,
                commission_type: dr.commission_type, commission_value: dr.commission_value,
                totalRevenue, commission: Math.round(commission * 100) / 100
            });
        }
        res.json(results);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/reports/pnl', requireAuth, requireRole('finance'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { from, to } = req.query;

        let dateFilter = '';
        let params = [];
        if (from && to && /^\d{4}-\d{2}-\d{2}$/.test(from) && /^\d{4}-\d{2}-\d{2}$/.test(to)) {
            dateFilter = 'created_at BETWEEN $1 AND $2';
            params = [from, to + ' 23:59:59'];
        }

        let whereClause = '';
        if (dateFilter) {
            whereClause = 'WHERE ' + dateFilter;
            if (tenantId) {
                whereClause += ' AND tenant_id = $' + (params.length + 1);
                params.push(tenantId);
            }
        } else {
            if (tenantId) {
                whereClause = 'WHERE tenant_id = $1';
                params.push(tenantId);
            }
        }

        const revenue = (await pool.query(`SELECT COALESCE(SUM(total),0) as total, COALESCE(SUM(CASE WHEN paid=1 THEN total ELSE 0 END),0) as collected, COALESCE(SUM(discount),0) as discounts FROM invoices ${whereClause}`, params)).rows[0];
        const byType = (await pool.query(`SELECT service_type, COUNT(*) as cnt, COALESCE(SUM(total),0) as total FROM invoices ${whereClause} GROUP BY service_type ORDER BY total DESC`, params)).rows;

        const expensesQuery = tenantId ?
            'SELECT COALESCE(SUM(cost_price * stock_qty),0) as drug_cost FROM pharmacy_drug_catalog WHERE is_active=1 AND tenant_id=$1' :
            'SELECT COALESCE(SUM(cost_price * stock_qty),0) as drug_cost FROM pharmacy_drug_catalog WHERE is_active=1';
        const expensesParams = tenantId ? [tenantId] : [];
        const expenses = (await pool.query(expensesQuery, expensesParams)).rows[0];

        res.json({
            totalRevenue: parseFloat(revenue.total),
            totalCollected: parseFloat(revenue.collected),
            totalDiscounts: parseFloat(revenue.discounts),
            totalUncollected: parseFloat(revenue.total) - parseFloat(revenue.collected),
            estimatedCosts: parseFloat(expenses.drug_cost),
            netProfit: parseFloat(revenue.collected) - parseFloat(expenses.drug_cost),
            byType
        });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/reports/daily-cash', requireAuth, requireRole('finance', 'accounts'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const date = req.query.date || new Date().toISOString().split('T')[0];
        const params = tenantId ? [date, tenantId] : [date];
        const tenantFilter = tenantId ? ' AND tenant_id=$2' : '';

        const byCash = (await pool.query(`SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE payment_method='Cash' AND DATE(created_at)=$1 AND cancelled=0${tenantFilter}`, params)).rows[0].total;
        const byCard = (await pool.query(`SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE payment_method IN ('Card','POS','شبكة') AND DATE(created_at)=$1 AND cancelled=0${tenantFilter}`, params)).rows[0].total;
        const byTransfer = (await pool.query(`SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE payment_method IN ('Transfer','تحويل') AND DATE(created_at)=$1 AND cancelled=0${tenantFilter}`, params)).rows[0].total;
        const byInsurance = (await pool.query(`SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE payment_method='Insurance' AND DATE(created_at)=$1 AND cancelled=0${tenantFilter}`, params)).rows[0].total;
        const total = (await pool.query(`SELECT COALESCE(SUM(total),0) as total, COUNT(*) as cnt FROM invoices WHERE DATE(created_at)=$1 AND cancelled=0${tenantFilter}`, params)).rows[0];
        const byCreator = (await pool.query(`SELECT COALESCE(created_by,'Unknown') as staff, COUNT(*) as cnt, COALESCE(SUM(total),0) as total FROM invoices WHERE DATE(created_at)=$1 AND cancelled=0${tenantFilter} GROUP BY created_by ORDER BY total DESC`, params)).rows;
        const byService = (await pool.query(`SELECT service_type, COUNT(*) as cnt, COALESCE(SUM(total),0) as total FROM invoices WHERE DATE(created_at)=$1 AND cancelled=0${tenantFilter} GROUP BY service_type ORDER BY total DESC`, params)).rows;

        res.json({ date, totalRevenue: parseFloat(total.total), invoiceCount: parseInt(total.cnt), cash: parseFloat(byCash), card: parseFloat(byCard), transfer: parseFloat(byTransfer), insurance: parseFloat(byInsurance), byStaff: byCreator, byService });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/reports/doctor-revenue', requireAuth, requireRole('finance', 'doctor'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const { from, to } = req.query;
        let dateFilter = '', params = [];

        if (from && to) {
            dateFilter = " AND i.created_at BETWEEN $1 AND ($2::text || ' 23:59:59')::timestamp";
            params = [from, to];
        }

        let tenantFilter = '';
        if (tenantId) {
            tenantFilter = ` AND i.tenant_id = $${params.length + 1}`;
            params.push(tenantId);
        }

        const queryStr = `SELECT su.id, su.display_name, su.speciality, su.commission_type, su.commission_value,
            COALESCE(COUNT(DISTINCT i.id),0) as invoice_count,
            COALESCE(SUM(i.total),0) as total_revenue
            FROM system_users su
            LEFT JOIN invoices i ON i.description LIKE '%' || su.display_name || '%' AND i.cancelled=0 ${dateFilter}${tenantFilter}
            WHERE su.role='Doctor' AND su.is_active=1
            GROUP BY su.id ORDER BY total_revenue DESC`;

        const doctors = (await pool.query(queryStr, params)).rows;
        doctors.forEach(d => {
            d.total_revenue = parseFloat(d.total_revenue);
            if (d.commission_type === 'percentage') d.commission = (d.total_revenue * (d.commission_value || 0) / 100);
            else d.commission = parseFloat(d.commission_value || 0) * parseInt(d.invoice_count || 0);
        });
        res.json(doctors);
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});
router.get('/api/reports/aging', requireAuth, requireRole('finance'), requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const params = tenantId ? [tenantId] : [];
        const tenantFilter = tenantId ? ' AND tenant_id=$1' : '';

        const currentQuery = `SELECT patient_name, total, created_at, invoice_number FROM invoices WHERE paid=0 AND cancelled=0 AND created_at >= CURRENT_DATE - 30${tenantFilter} ORDER BY created_at DESC`;
        const d30Query = `SELECT patient_name, total, created_at, invoice_number FROM invoices WHERE paid=0 AND cancelled=0 AND created_at BETWEEN CURRENT_DATE - 60 AND CURRENT_DATE - 30${tenantFilter} ORDER BY created_at DESC`;
        const d60Query = `SELECT patient_name, total, created_at, invoice_number FROM invoices WHERE paid=0 AND cancelled=0 AND created_at BETWEEN CURRENT_DATE - 90 AND CURRENT_DATE - 60${tenantFilter} ORDER BY created_at DESC`;
        const d90Query = `SELECT patient_name, total, created_at, invoice_number FROM invoices WHERE paid=0 AND cancelled=0 AND created_at < CURRENT_DATE - 90${tenantFilter} ORDER BY created_at DESC`;

        const current = (await pool.query(currentQuery, params)).rows;
        const d30 = (await pool.query(d30Query, params)).rows;
        const d60 = (await pool.query(d60Query, params)).rows;
        const d90 = (await pool.query(d90Query, params)).rows;

        const sum = arr => arr.reduce((s, r) => s + parseFloat(r.total), 0);
        res.json({
            current: { items: current, total: sum(current), count: current.length },
            days30: { items: d30, total: sum(d30), count: d30.length },
            days60: { items: d60, total: sum(d60), count: d60.length },
            days90plus: { items: d90, total: sum(d90), count: d90.length },
            grandTotal: sum(current) + sum(d30) + sum(d60) + sum(d90)
        });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

    return router;
}
