const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeDrugInteractionsRouter({ pool, requireAuth, requireRole, requireTenantScope, validateBody, RS, getRequestTenantContext, calcVAT, addVAT, logAudit, cds }) {
    const router = express.Router();
router.post('/api/drug-interactions/check', requireAuth, async (req, res) => {

    try {

        const { drugs } = req.body; // Array of drug names

        if (!drugs || !Array.isArray(drugs)) return res.json({ interactions: [] });



        // Common drug interaction database

        const INTERACTIONS = [

            { drugs: ['Warfarin', 'Aspirin'], severity: 'high', message_ar: 'خطر نزيف شديد', message_en: 'High bleeding risk' },

            { drugs: ['Warfarin', 'Ibuprofen'], severity: 'high', message_ar: 'خطر نزيف شديد', message_en: 'High bleeding risk' },

            { drugs: ['Warfarin', 'Diclofenac'], severity: 'high', message_ar: 'خطر نزيف', message_en: 'Bleeding risk' },

            { drugs: ['Warfarin', 'Omeprazole'], severity: 'moderate', message_ar: 'قد يزيد تأثير الوارفارين', message_en: 'May increase Warfarin effect' },

            { drugs: ['Warfarin', 'Ciprofloxacin'], severity: 'high', message_ar: 'يزيد INR بشكل خطير', message_en: 'Dangerously increases INR' },

            { drugs: ['Warfarin', 'Metronidazole'], severity: 'high', message_ar: 'يزيد تأثير الوارفارين', message_en: 'Increases Warfarin effect' },

            { drugs: ['Metformin', 'Contrast'], severity: 'high', message_ar: 'خطر حماض لاكتيكي', message_en: 'Lactic acidosis risk' },

            { drugs: ['ACE Inhibitor', 'Potassium'], severity: 'high', message_ar: 'خطر ارتفاع البوتاسيوم', message_en: 'Hyperkalemia risk' },

            { drugs: ['Enalapril', 'Spironolactone'], severity: 'high', message_ar: 'خطر ارتفاع البوتاسيوم', message_en: 'Hyperkalemia risk' },

            { drugs: ['Lisinopril', 'Spironolactone'], severity: 'high', message_ar: 'خطر ارتفاع البوتاسيوم', message_en: 'Hyperkalemia risk' },

            { drugs: ['Digoxin', 'Amiodarone'], severity: 'high', message_ar: 'سمية الديجوكسين', message_en: 'Digoxin toxicity' },

            { drugs: ['Digoxin', 'Verapamil'], severity: 'high', message_ar: 'سمية الديجوكسين', message_en: 'Digoxin toxicity' },

            { drugs: ['Methotrexate', 'TMP/SMX'], severity: 'high', message_ar: 'سمية الميثوتركسات', message_en: 'Methotrexate toxicity' },

            { drugs: ['Methotrexate', 'NSAIDs'], severity: 'high', message_ar: 'سمية كلوية', message_en: 'Renal toxicity' },

            { drugs: ['Simvastatin', 'Clarithromycin'], severity: 'high', message_ar: 'خطر انحلال العضلات', message_en: 'Rhabdomyolysis risk' },

            { drugs: ['Atorvastatin', 'Clarithromycin'], severity: 'moderate', message_ar: 'زيادة تأثير الستاتين', message_en: 'Increased statin effect' },

            { drugs: ['Clopidogrel', 'Omeprazole'], severity: 'moderate', message_ar: 'يقلل فعالية كلوبيدوقرل', message_en: 'Reduces Clopidogrel efficacy' },

            { drugs: ['Lithium', 'NSAIDs'], severity: 'high', message_ar: 'سمية الليثيوم', message_en: 'Lithium toxicity' },

            { drugs: ['Lithium', 'ACE Inhibitor'], severity: 'high', message_ar: 'سمية الليثيوم', message_en: 'Lithium toxicity' },

            { drugs: ['Ciprofloxacin', 'Theophylline'], severity: 'high', message_ar: 'سمية الثيوفيلين', message_en: 'Theophylline toxicity' },

            { drugs: ['MAO Inhibitor', 'SSRI'], severity: 'critical', message_ar: 'متلازمة السيروتونين - مميت', message_en: 'Serotonin syndrome - FATAL' },

            { drugs: ['Tramadol', 'SSRI'], severity: 'high', message_ar: 'خطر متلازمة السيروتونين', message_en: 'Serotonin syndrome risk' },

            { drugs: ['Tramadol', 'Sertraline'], severity: 'high', message_ar: 'خطر متلازمة السيروتونين', message_en: 'Serotonin syndrome risk' },

            { drugs: ['Sildenafil', 'Nitrate'], severity: 'critical', message_ar: 'انخفاض ضغط مميت', message_en: 'Fatal hypotension' },

            { drugs: ['Sildenafil', 'Nitroglycerin'], severity: 'critical', message_ar: 'انخفاض ضغط مميت', message_en: 'Fatal hypotension' },

            { drugs: ['Amlodipine', 'Simvastatin'], severity: 'moderate', message_ar: 'لا تتجاوز سيمفاستاتين 20مج', message_en: 'Do not exceed Simvastatin 20mg' },

            { drugs: ['Carbamazepine', 'OCP'], severity: 'high', message_ar: 'يقلل فعالية حبوب منع الحمل', message_en: 'Reduces OCP efficacy' },

            { drugs: ['Phenytoin', 'Warfarin'], severity: 'high', message_ar: 'تفاعل معقد - مراقبة', message_en: 'Complex interaction - monitor' },

            { drugs: ['Erythromycin', 'Simvastatin'], severity: 'high', message_ar: 'انحلال عضلات', message_en: 'Rhabdomyolysis' },

            { drugs: ['Fluconazole', 'Warfarin'], severity: 'high', message_ar: 'يزيد نزيف', message_en: 'Increases bleeding' },

            { drugs: ['Amiodarone', 'Warfarin'], severity: 'high', message_ar: 'يزيد INR', message_en: 'Increases INR' },

            { drugs: ['Aspirin', 'Ibuprofen'], severity: 'moderate', message_ar: 'يقلل تأثير الأسبرين القلبي', message_en: 'Reduces cardiac aspirin effect' },

            { drugs: ['Metformin', 'Alcohol'], severity: 'moderate', message_ar: 'خطر حماض لاكتيكي', message_en: 'Lactic acidosis risk' },

            { drugs: ['Insulin', 'Beta Blocker'], severity: 'moderate', message_ar: 'يخفي أعراض هبوط السكر', message_en: 'Masks hypoglycemia symptoms' },

            { drugs: ['Potassium', 'Spironolactone'], severity: 'high', message_ar: 'خطر ارتفاع بوتاسيوم شديد', message_en: 'Severe hyperkalemia risk' },

            { drugs: ['Azithromycin', 'Amiodarone'], severity: 'high', message_ar: 'إطالة QT', message_en: 'QT prolongation' },

            { drugs: ['Domperidone', 'Clarithromycin'], severity: 'high', message_ar: 'إطالة QT', message_en: 'QT prolongation' },

            { drugs: ['Metoclopramide', 'Haloperidol'], severity: 'moderate', message_ar: 'أعراض خارج هرمية', message_en: 'Extrapyramidal symptoms' },

            { drugs: ['Rifampin', 'OCP'], severity: 'high', message_ar: 'يلغي فعالية حبوب منع الحمل', message_en: 'Eliminates OCP efficacy' },

            { drugs: ['Rifampin', 'Warfarin'], severity: 'high', message_ar: 'يقلل فعالية الوارفارين بشدة', message_en: 'Greatly reduces Warfarin' },

            { drugs: ['Ciprofloxacin', 'Antacid'], severity: 'moderate', message_ar: 'يقلل امتصاص سيبرو', message_en: 'Reduces Cipro absorption' },

            { drugs: ['Tetracycline', 'Antacid'], severity: 'moderate', message_ar: 'يقلل الامتصاص', message_en: 'Reduces absorption' },

            { drugs: ['Levothyroxine', 'Calcium'], severity: 'moderate', message_ar: 'يقلل امتصاص الثايروكسين', message_en: 'Reduces thyroxine absorption' },

            { drugs: ['Levothyroxine', 'Iron'], severity: 'moderate', message_ar: 'يقلل امتصاص الثايروكسين', message_en: 'Reduces thyroxine absorption' },

            { drugs: ['Bisoprolol', 'Verapamil'], severity: 'high', message_ar: 'بطء قلب خطير', message_en: 'Dangerous bradycardia' },

            { drugs: ['Atenolol', 'Verapamil'], severity: 'high', message_ar: 'بطء قلب خطير', message_en: 'Dangerous bradycardia' },

            { drugs: ['Clonidine', 'Beta Blocker'], severity: 'high', message_ar: 'ارتداد ارتفاع ضغط', message_en: 'Rebound hypertension' },

            { drugs: ['Allopurinol', 'Azathioprine'], severity: 'critical', message_ar: 'سمية نخاع العظم', message_en: 'Bone marrow toxicity' },

            { drugs: ['Clarithromycin', 'Colchicine'], severity: 'high', message_ar: 'سمية الكولشيسين', message_en: 'Colchicine toxicity' },

        ];



        const found = [];

        const drugNamesLower = drugs.map(d => d.toLowerCase());



        for (const interaction of INTERACTIONS) {

            const [d1, d2] = interaction.drugs.map(d => d.toLowerCase());

            const match1 = drugNamesLower.some(dn => dn.includes(d1) || d1.includes(dn));

            const match2 = drugNamesLower.some(dn => dn.includes(d2) || d2.includes(dn));

            if (match1 && match2) {

                found.push(interaction);

            }

        }



        // E1 ENHANCE (additive, tenant-aware): also consult the DB-driven drug_interactions table so

        // tenant-curated pairs are honored alongside the built-in matrix. Failure here NEVER drops the

        // built-in results (FAIL-SAFE: a DB error must not silently weaken the interaction check).

        try {

            const { tenantId } = getRequestTenantContext(req);

            const dbRows = (await pool.query(

                tenantId

                    ? 'SELECT drug_a, drug_b, severity, description, clinical_action FROM drug_interactions WHERE tenant_id=$1'

                    : 'SELECT drug_a, drug_b, severity, description, clinical_action FROM drug_interactions',

                tenantId ? [tenantId] : []

            )).rows;

            for (const row of dbRows) {

                const a = (row.drug_a || '').toLowerCase(), b = (row.drug_b || '').toLowerCase();

                if (!a || !b) continue;

                const hasA = drugNamesLower.some(dn => dn.includes(a) || a.includes(dn));

                const hasB = drugNamesLower.some(dn => dn.includes(b) || b.includes(dn));

                if (hasA && hasB) {

                    const already = found.some(f => {

                        const [f1, f2] = f.drugs.map(d => d.toLowerCase());

                        return (f1.includes(a) || a.includes(f1)) && (f2.includes(b) || b.includes(f2));

                    });

                    if (!already) {

                        found.push({

                            drugs: [row.drug_a, row.drug_b],

                            // map via the shared cds engine so DB severities follow the same info|warning|critical contract

                            severity: cds.mapSeverity(row.severity),

                            message_ar: row.description || 'تعارض دوائي مسجل', message_en: row.description || 'Recorded interaction',

                            clinical_action: row.clinical_action || '', source: 'db',

                        });

                    }

                }

            }

        } catch (e) { /* FAIL-SAFE: DB augmentation optional; built-in matrix results stand */ }



        res.json({ interactions: found, total_checked: INTERACTIONS.length });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});


    return router;
}
