const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeDashboardRouter({ pool, requireAuth, requireTenantScope, getRequestTenantContext }) {
    const router = express.Router();

router.get('/api/dashboard/stats', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);

        const patientsQuery = tenantId ? 'SELECT COUNT(*) as cnt FROM patients WHERE tenant_id=$1' : 'SELECT COUNT(*) as cnt FROM patients';
        const revenueQuery = tenantId ? 'SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1 AND tenant_id=$1' : 'SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE paid=1';
        const waitingQuery = tenantId ? "SELECT COUNT(*) as cnt FROM patients WHERE status='Waiting' AND tenant_id=$1" : "SELECT COUNT(*) as cnt FROM patients WHERE status='Waiting'";
        const pendingClaimsQuery = tenantId ? "SELECT COUNT(*) as cnt FROM insurance_claims WHERE status='Pending' AND tenant_id=$1" : "SELECT COUNT(*) as cnt FROM insurance_claims WHERE status='Pending'";
        const todayApptsQuery = tenantId ? "SELECT COUNT(*) as cnt FROM appointments WHERE appt_date=CURRENT_DATE::TEXT AND tenant_id=$1" : "SELECT COUNT(*) as cnt FROM appointments WHERE appt_date=CURRENT_DATE::TEXT";

        const params = tenantId ? [tenantId] : [];

        const patients = (await pool.query(patientsQuery, params)).rows[0].cnt;
        const revenue = (await pool.query(revenueQuery, params)).rows[0].total;
        const waiting = (await pool.query(waitingQuery, params)).rows[0].cnt;
        const pendingClaims = (await pool.query(pendingClaimsQuery, params)).rows[0].cnt;
        const todayAppts = (await pool.query(todayApptsQuery, params)).rows[0].cnt;

        // employees is a deferred risk table (no tenant_id column)
        const employees = (await pool.query('SELECT COUNT(*) as cnt FROM employees')).rows[0].cnt;

        res.json({ patients, revenue, waiting, pendingClaims, todayAppts, employees });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/api/dashboard/enhanced', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const params = tenantId ? [tenantId] : [];

        const todayRevenueQuery = tenantId ?
            'SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE created_at::date = CURRENT_DATE AND tenant_id = $1' :
            'SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE created_at::date = CURRENT_DATE';

        const monthRevenueQuery = tenantId ?
            'SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE created_at >= date_trunc(\'month\', CURRENT_DATE) AND tenant_id = $1' :
            'SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE created_at >= date_trunc(\'month\', CURRENT_DATE)';

        const unpaidTotalQuery = tenantId ?
            'SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE paid = 0 AND tenant_id = $1' :
            'SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE paid = 0';

        const todayApptsQuery = tenantId ?
            'SELECT COUNT(*) as cnt FROM appointments WHERE appt_date = CURRENT_DATE::TEXT AND tenant_id = $1' :
            'SELECT COUNT(*) as cnt FROM appointments WHERE appt_date = CURRENT_DATE::TEXT';

        const pendingLabQuery = tenantId ?
            'SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE status = \'Requested\' AND is_radiology = 0 AND tenant_id = $1' :
            'SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE status = \'Requested\' AND is_radiology = 0';

        const pendingRadQuery = tenantId ?
            'SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE status = \'Requested\' AND is_radiology = 1 AND tenant_id = $1' :
            'SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE status = \'Requested\' AND is_radiology = 1';

        const pendingRxQuery = tenantId ?
            'SELECT COUNT(*) as cnt FROM pharmacy_prescriptions_queue WHERE status = \'Pending\' AND tenant_id = $1' :
            'SELECT COUNT(*) as cnt FROM pharmacy_prescriptions_queue WHERE status = \'Pending\'';

        const pendingReferralsQuery = tenantId ?
            'SELECT COUNT(*) as cnt FROM patient_referrals WHERE status = \'Pending\' AND tenant_id = $1' :
            'SELECT COUNT(*) as cnt FROM patient_referrals WHERE status = \'Pending\'';

        const todayRevenue = (await pool.query(todayRevenueQuery, params)).rows[0].total;
        const monthRevenue = (await pool.query(monthRevenueQuery, params)).rows[0].total;
        const unpaidTotal = (await pool.query(unpaidTotalQuery, params)).rows[0].total;
        const todayAppts = (await pool.query(todayApptsQuery, params)).rows[0].cnt;
        const pendingLab = (await pool.query(pendingLabQuery, params)).rows[0].cnt;
        const pendingRad = (await pool.query(pendingRadQuery, params)).rows[0].cnt;
        const pendingRx = (await pool.query(pendingRxQuery, params)).rows[0].cnt;
        const pendingReferrals = (await pool.query(pendingReferralsQuery, params)).rows[0].cnt;

        // Top doctors by revenue this month
        const topDoctorsQuery = tenantId ? `
            SELECT mr.doctor_id, su.display_name, COUNT(DISTINCT mr.patient_id) as patients,
                   COALESCE(SUM(i.total), 0) as revenue
            FROM medical_records mr
            LEFT JOIN system_users su ON mr.doctor_id = su.id
            LEFT JOIN invoices i ON i.patient_id = mr.patient_id AND i.service_type = 'Consultation' AND i.tenant_id = $1
            WHERE mr.visit_date >= date_trunc('month', CURRENT_DATE) AND mr.tenant_id = $1
            GROUP BY mr.doctor_id, su.display_name
            ORDER BY revenue DESC LIMIT 5
        ` : `
            SELECT mr.doctor_id, su.display_name, COUNT(DISTINCT mr.patient_id) as patients,
                   COALESCE(SUM(i.total), 0) as revenue
            FROM medical_records mr
            LEFT JOIN system_users su ON mr.doctor_id = su.id
            LEFT JOIN invoices i ON i.patient_id = mr.patient_id AND i.service_type = 'Consultation'
            WHERE mr.visit_date >= date_trunc('month', CURRENT_DATE)
            GROUP BY mr.doctor_id, su.display_name
            ORDER BY revenue DESC LIMIT 5
        `;
        const topDoctors = (await pool.query(topDoctorsQuery, params)).rows;

        // Revenue by service type
        const revenueByTypeQuery = tenantId ? `
            SELECT service_type, COALESCE(SUM(total), 0) as total, COUNT(*) as cnt
            FROM invoices WHERE created_at >= date_trunc('month', CURRENT_DATE) AND tenant_id = $1
            GROUP BY service_type ORDER BY total DESC
        ` : `
            SELECT service_type, COALESCE(SUM(total), 0) as total, COUNT(*) as cnt
            FROM invoices WHERE created_at >= date_trunc('month', CURRENT_DATE)
            GROUP BY service_type ORDER BY total DESC
        `;
        const revenueByType = (await pool.query(revenueByTypeQuery, params)).rows;

        res.json({ todayRevenue, monthRevenue, unpaidTotal, todayAppts, pendingLab, pendingRad, pendingRx, pendingReferrals, topDoctors, revenueByType });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/api/dashboard/today', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const params = tenantId ? [tenantId] : [];

        const todayRevQuery = tenantId ?
            "SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE DATE(created_at)=CURRENT_DATE AND cancelled=0 AND tenant_id=$1" :
            "SELECT COALESCE(SUM(total),0) as total FROM invoices WHERE DATE(created_at)=CURRENT_DATE AND cancelled=0";

        const todayPatientsQuery = tenantId ?
            "SELECT COUNT(DISTINCT patient_id) as cnt FROM invoices WHERE DATE(created_at)=CURRENT_DATE AND tenant_id=$1" :
            "SELECT COUNT(DISTINCT patient_id) as cnt FROM invoices WHERE DATE(created_at)=CURRENT_DATE";

        const todayInvoicesQuery = tenantId ?
            "SELECT COUNT(*) as cnt FROM invoices WHERE DATE(created_at)=CURRENT_DATE AND cancelled=0 AND tenant_id=$1" :
            "SELECT COUNT(*) as cnt FROM invoices WHERE DATE(created_at)=CURRENT_DATE AND cancelled=0";

        const pendingLabQuery = tenantId ?
            "SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE status='Requested' AND is_radiology=0 AND tenant_id=$1" :
            "SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE status='Requested' AND is_radiology=0";

        const pendingRadQuery = tenantId ?
            "SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE status='Requested' AND is_radiology=1 AND tenant_id=$1" :
            "SELECT COUNT(*) as cnt FROM lab_radiology_orders WHERE status='Requested' AND is_radiology=1";

        const pendingRxQuery = tenantId ?
            "SELECT COUNT(*) as cnt FROM pharmacy_prescriptions_queue WHERE status='Pending' AND tenant_id=$1" :
            "SELECT COUNT(*) as cnt FROM pharmacy_prescriptions_queue WHERE status='Pending'";

        const waitingPatientsQuery = tenantId ?
            "SELECT COUNT(*) as cnt FROM patients WHERE status='Waiting' AND tenant_id=$1" :
            "SELECT COUNT(*) as cnt FROM patients WHERE status='Waiting'";

        const todayRev = (await pool.query(todayRevQuery, params)).rows[0].total;
        const todayPatients = (await pool.query(todayPatientsQuery, params)).rows[0].cnt;
        const todayInvoices = (await pool.query(todayInvoicesQuery, params)).rows[0].cnt;
        const pendingLab = (await pool.query(pendingLabQuery, params)).rows[0].cnt;
        const pendingRad = (await pool.query(pendingRadQuery, params)).rows[0].cnt;
        const pendingRx = (await pool.query(pendingRxQuery, params)).rows[0].cnt;
        const waitingPatients = (await pool.query(waitingPatientsQuery, params)).rows[0].cnt;

        res.json({ todayRevenue: parseFloat(todayRev), todayPatients: parseInt(todayPatients), todayInvoices: parseInt(todayInvoices), pendingLab: parseInt(pendingLab), pendingRad: parseInt(pendingRad), pendingRx: parseInt(pendingRx), waitingPatients: parseInt(waitingPatients) });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/api/dashboard/charts', requireAuth, requireTenantScope, async (req, res) => {
    try {
        const { tenantId } = getRequestTenantContext(req);
        const params = tenantId ? [tenantId] : [];

        // Revenue trend (last 30 days)
        const revenueTrendQuery = tenantId ? `
            SELECT DATE(created_at) as day, COALESCE(SUM(total),0) as revenue, COUNT(*) as count
            FROM invoices WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' AND total > 0 AND tenant_id = $1
            GROUP BY DATE(created_at) ORDER BY day
        ` : `
            SELECT DATE(created_at) as day, COALESCE(SUM(total),0) as revenue, COUNT(*) as count
            FROM invoices WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' AND total > 0
            GROUP BY DATE(created_at) ORDER BY day
        `;
        const revenueTrend = (await pool.query(revenueTrendQuery, params)).rows;

        // Patients by department (this month)
        const byDepartmentQuery = tenantId ? `
            SELECT COALESCE(department,'General') as dept, COUNT(*) as count
            FROM appointments WHERE NULLIF(appt_date, '')::DATE >= DATE_TRUNC('month', CURRENT_DATE) AND tenant_id = $1
            GROUP BY department ORDER BY count DESC LIMIT 10
        ` : `
            SELECT COALESCE(department,'General') as dept, COUNT(*) as count
            FROM appointments WHERE NULLIF(appt_date, '')::DATE >= DATE_TRUNC('month', CURRENT_DATE)
            GROUP BY department ORDER BY count DESC LIMIT 10
        `;
        const byDepartment = (await pool.query(byDepartmentQuery, params)).rows;

        // Top doctors by patient count (this month)
        const topDoctorsQuery = tenantId ? `
            SELECT doctor_name as doctor, COUNT(*) as patients, COALESCE(SUM(i.total),0) as revenue
            FROM appointments a LEFT JOIN invoices i ON i.description ILIKE '%' || a.doctor_name || '%'
            AND i.created_at >= DATE_TRUNC('month', CURRENT_DATE) AND i.tenant_id = $1
            WHERE NULLIF(a.appt_date, '')::DATE >= DATE_TRUNC('month', CURRENT_DATE) AND a.tenant_id = $1
            GROUP BY a.doctor_name ORDER BY patients DESC LIMIT 8
        ` : `
            SELECT doctor_name as doctor, COUNT(*) as patients, COALESCE(SUM(i.total),0) as revenue
            FROM appointments a LEFT JOIN invoices i ON i.description ILIKE '%' || a.doctor_name || '%'
            AND i.created_at >= DATE_TRUNC('month', CURRENT_DATE)
            WHERE NULLIF(a.appt_date, '')::DATE >= DATE_TRUNC('month', CURRENT_DATE)
            GROUP BY a.doctor_name ORDER BY patients DESC LIMIT 8
        `;
        const topDoctors = (await pool.query(topDoctorsQuery, params)).rows;

        // Patient flow by hour (today)
        const hourlyFlowQuery = tenantId ? `
            SELECT EXTRACT(HOUR FROM created_at) as hour, COUNT(*) as count
            FROM appointments WHERE NULLIF(appt_date, '')::DATE = CURRENT_DATE AND tenant_id = $1
            GROUP BY hour ORDER BY hour
        ` : `
            SELECT EXTRACT(HOUR FROM created_at) as hour, COUNT(*) as count
            FROM appointments WHERE NULLIF(appt_date, '')::DATE = CURRENT_DATE
            GROUP BY hour ORDER BY hour
        `;
        const hourlyFlow = (await pool.query(hourlyFlowQuery, params)).rows;

        // Payment methods breakdown (this month)
        const paymentMethodsQuery = tenantId ? `
            SELECT COALESCE(payment_method,'Cash') as method, COUNT(*) as count, COALESCE(SUM(total),0) as total
            FROM invoices WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) AND total > 0 AND tenant_id = $1
            GROUP BY payment_method
        ` : `
            SELECT COALESCE(payment_method,'Cash') as method, COUNT(*) as count, COALESCE(SUM(total),0) as total
            FROM invoices WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) AND total > 0
            GROUP BY payment_method
        `;
        const paymentMethods = (await pool.query(paymentMethodsQuery, params)).rows;

        // Weekly comparison
        const thisWeekQuery = tenantId ?
            "SELECT COUNT(*) as patients, COALESCE(SUM(total),0) as revenue FROM invoices WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE) AND total > 0 AND tenant_id = $1" :
            "SELECT COUNT(*) as patients, COALESCE(SUM(total),0) as revenue FROM invoices WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE) AND total > 0";
        const lastWeekQuery = tenantId ?
            "SELECT COUNT(*) as patients, COALESCE(SUM(total),0) as revenue FROM invoices WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' AND created_at < DATE_TRUNC('week', CURRENT_DATE) AND total > 0 AND tenant_id = $1" :
            "SELECT COUNT(*) as patients, COALESCE(SUM(total),0) as revenue FROM invoices WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7 days' AND created_at < DATE_TRUNC('week', CURRENT_DATE) AND total > 0";

        const thisWeek = (await pool.query(thisWeekQuery, params)).rows[0];
        const lastWeek = (await pool.query(lastWeekQuery, params)).rows[0];

        res.json({ revenueTrend, byDepartment, topDoctors, hourlyFlow, paymentMethods, thisWeek, lastWeek });
    } catch (e) { console.error(e); res.status(500).json({ error: 'Server error' }); }
});

    return router;
};
