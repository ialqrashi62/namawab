const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeBedsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.get('/api/beds', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { ward_id } = req.query;

        const { tenantId } = getRequestTenantContext(req);



        // If ward_id is provided, verify ward belongs to tenant

        if (ward_id && tenantId) {

            const wardCheck = (await pool.query('SELECT id FROM wards WHERE id=$1 AND tenant_id=$2', [ward_id, tenantId])).rows[0];

            if (!wardCheck) {

                return res.status(403).json({ error: 'Invalid ward context or access denied' });

            }

        }



        let qText = '';

        let params = [];

        if (ward_id) {

            qText = tenantId

                ? 'SELECT b.*, w.ward_name, w.ward_name_ar FROM beds b JOIN wards w ON b.ward_id=w.id WHERE b.ward_id=$1 AND b.tenant_id=$2 ORDER BY b.bed_number'

                : 'SELECT b.*, w.ward_name, w.ward_name_ar FROM beds b JOIN wards w ON b.ward_id=w.id WHERE b.ward_id=$1 ORDER BY b.bed_number';

            params = tenantId ? [ward_id, tenantId] : [ward_id];

        } else {

            qText = tenantId

                ? 'SELECT b.*, w.ward_name, w.ward_name_ar FROM beds b JOIN wards w ON b.ward_id=w.id WHERE b.tenant_id=$1 ORDER BY w.id, b.bed_number'

                : 'SELECT b.*, w.ward_name, w.ward_name_ar FROM beds b JOIN wards w ON b.ward_id=w.id ORDER BY w.id, b.bed_number';

            params = tenantId ? [tenantId] : [];

        }



        const q = await pool.query(qText, params);

        res.json(q.rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/beds/census', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);



        const wardsQ = tenantId

            ? 'SELECT * FROM wards WHERE tenant_id = $1 ORDER BY id'

            : 'SELECT * FROM wards ORDER BY id';

        const wardsParams = tenantId ? [tenantId] : [];

        const wards = (await pool.query(wardsQ, wardsParams)).rows;



        const bedsQ = tenantId

            ? `SELECT b.*, w.ward_name, w.ward_name_ar, a.patient_name, a.diagnosis, a.admission_date, a.attending_doctor

               FROM beds b JOIN wards w ON b.ward_id=w.id

               LEFT JOIN admissions a ON b.current_admission_id=a.id AND a.status='Active' AND a.tenant_id=$1

               WHERE b.tenant_id=$1

               ORDER BY w.id, b.bed_number`

            : `SELECT b.*, w.ward_name, w.ward_name_ar, a.patient_name, a.diagnosis, a.admission_date, a.attending_doctor

               FROM beds b JOIN wards w ON b.ward_id=w.id

               LEFT JOIN admissions a ON b.current_admission_id=a.id AND a.status='Active'

               ORDER BY w.id, b.bed_number`;

        const bedsParams = tenantId ? [tenantId] : [];

        const beds = (await pool.query(bedsQ, bedsParams)).rows;



        const total = beds.length;

        const occupied = beds.filter(b => b.status === 'Occupied').length;

        res.json({ wards, beds, total, occupied, available: total - occupied, occupancyRate: total > 0 ? Math.round(occupied / total * 100) : 0 });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
