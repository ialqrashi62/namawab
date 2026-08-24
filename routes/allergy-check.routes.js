const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeAllergyCheckRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit }) {
    const router = express.Router();
router.post('/api/allergy-check', requireAuth, async (req, res) => {

    try {

        const { patient_id, drugs } = req.body;

        if (!patient_id || !drugs) return res.json({ alerts: [] });



        // E1 ENHANCE: scope the patient lookup by tenant when context is present (defense-in-depth;

        // RLS also enforces isolation). Behavior unchanged when no tenant context (dev/test).

        const { tenantId } = getRequestTenantContext(req);

        const patient = (await pool.query(

            tenantId ? 'SELECT allergies FROM patients WHERE id=$1 AND tenant_id=$2' : 'SELECT allergies FROM patients WHERE id=$1',

            tenantId ? [patient_id, tenantId] : [patient_id])).rows[0];

        if (!patient || !patient.allergies) return res.json({ alerts: [] });



        const allergyGroups = {

            'penicillin': ['amoxicillin', 'ampicillin', 'augmentin', 'amoxicillin-clavulanate', 'piperacillin', 'flucloxacillin'],

            'sulfa': ['sulfamethoxazole', 'tmp/smx', 'co-trimoxazole', 'sulfasalazine', 'dapsone'],

            'nsaid': ['ibuprofen', 'diclofenac', 'naproxen', 'ketorolac', 'indomethacin', 'piroxicam', 'meloxicam', 'celecoxib'],

            'aspirin': ['aspirin', 'acetylsalicylic'],

            'cephalosporin': ['cephalexin', 'cefuroxime', 'ceftriaxone', 'cefazolin', 'cefixime', 'ceftazidime'],

            'macrolide': ['erythromycin', 'azithromycin', 'clarithromycin'],

            'quinolone': ['ciprofloxacin', 'levofloxacin', 'moxifloxacin', 'ofloxacin'],

            'tetracycline': ['doxycycline', 'tetracycline', 'minocycline'],

            'codeine': ['codeine', 'tramadol', 'morphine', 'oxycodone'],

            'contrast': ['iodine', 'contrast', 'gadolinium'],

        };



        const allergies = patient.allergies.toLowerCase();

        const alerts = [];



        for (const drug of drugs) {

            const drugLower = drug.toLowerCase();

            // Direct match

            if (allergies.includes(drugLower)) {

                alerts.push({ drug, severity: 'critical', message_ar: 'حساسية مباشرة مسجلة!', message_en: 'Direct allergy recorded!' });

                continue;

            }

            // Group match

            for (const [allergen, family] of Object.entries(allergyGroups)) {

                if (allergies.includes(allergen) && family.some(f => drugLower.includes(f))) {

                    alerts.push({ drug, severity: 'high', message_ar: 'ينتمي لعائلة ' + allergen + ' المسجل حساسية منها', message_en: 'Belongs to ' + allergen + ' family (allergy recorded)' });

                }

            }

        }



        res.json({ alerts, patient_allergies: patient.allergies });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
