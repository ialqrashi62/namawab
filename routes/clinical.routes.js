const crypto = require('crypto');
const express = require('express');
// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeClinicalRouter({ addVAT, calcVAT, getRequestTenantContext, logAudit, pool, requireAuth, requireRole, requireTenantScope, RS, validateBody }) {
    const router = express.Router();
router.get('/api/clinical/templates/:dept_id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const deptId = parseInt(req.params.dept_id, 10);

        if (!Number.isInteger(deptId)) return res.status(400).json({ error: 'Invalid department ID' });

        // clinical_templates has no tenant_id/RLS of its own, so enforce isolation TRANSITIVELY

        // via clinical_departments (which is FORCE-RLS): the JOIN yields rows only when the

        // department belongs to the caller's tenant, so a foreign dept_id returns nothing

        // instead of leaking another tenant's form templates. (Pending the e50 candidate that

        // gives clinical_templates its own tenant_id + RLS.)

        const rows = (await pool.query(

            `SELECT t.* FROM clinical_templates t

             JOIN clinical_departments d ON d.id = t.department_id

             WHERE t.department_id=$1 AND t.is_active=true`, [deptId])).rows;

        res.json(rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/clinical/knowledge/search', requireAuth, requireRole('doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { query_embedding, department_id, limit } = req.query;

        if (!query_embedding) return res.status(400).json({ error: 'query_embedding is required' });

        const embedding = JSON.parse(query_embedding);

        if (!Array.isArray(embedding)) return res.status(400).json({ error: 'query_embedding must be a JSON array' });

        

        const RAG = require('./clinical_knowledge_rag');

        const results = await RAG.searchKnowledge(

            tenantId,

            embedding,

            department_id ? parseInt(department_id, 10) : null,

            limit ? parseInt(limit, 10) : 3

        );

        res.json(results);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/clinical/knowledge', requireAuth, requireRole('Admin'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { department_id, content_chunk, embedding, metadata } = req.body;

        if (!content_chunk || !embedding) {

            return res.status(400).json({ error: 'content_chunk and embedding are required' });

        }

        if (!Array.isArray(embedding)) return res.status(400).json({ error: 'embedding must be an array' });

        

        const RAG = require('./clinical_knowledge_rag');

        const chunkId = await RAG.indexGuidelineChunk(

            pool,

            tenantId,

            department_id ? parseInt(department_id, 10) : null,

            content_chunk,

            embedding,

            metadata || {}

        );

        res.status(201).json({ success: true, id: chunkId });

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/clinical/ai/ask', requireAuth, requireRole('doctor', 'nursing'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { question, query_embedding, department_id } = req.body;

        if (!question || !query_embedding) {

            return res.status(400).json({ error: 'question and query_embedding are required' });

        }

        if (!Array.isArray(query_embedding)) return res.status(400).json({ error: 'query_embedding must be an array' });



        const RAG = require('./clinical_knowledge_rag');

        const response = await RAG.askClinicalCopilot(

            tenantId,

            question,

            query_embedding,

            department_id ? parseInt(department_id, 10) : null

        );

        res.json(response);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/clinical/records', requireAuth, requireRole('patients'), async (req, res, next) => {

    try {

        const { patient_id, encounter_id, template_id, recorded_values } = req.body;

        if (!recorded_values) {

            return next();

        }

        if (!patient_id || !template_id) {

            return res.status(400).json({ error: 'patient_id, template_id, and recorded_values are required' });

        }

        const { tenantId } = getRequestTenantContext(req);

        

        // Verify patient belongs to tenant

        const p = (await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [patient_id, tenantId])).rows[0];

        if (!p) return res.status(403).json({ error: 'Access denied' });



        const result = await pool.query(

            `INSERT INTO patient_clinical_records (patient_id, encounter_id, template_id, recorded_values, doctor_id, tenant_id)

             VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,

            [patient_id, encounter_id || null, template_id, JSON.stringify(recorded_values), req.session.user.id, tenantId]

        );

        res.status(201).json({ id: result.rows[0].id, success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/clinical/records/:id/lock', requireAuth, requireRole('patients'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const idParam = req.params.id;

        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idParam);



        let record;

        let tableName;



        if (isUuid) {

            tableName = 'clinical_records';

            const query = await pool.query('SELECT * FROM clinical_records WHERE id = $1 AND tenant_id = $2', [idParam, tenantId]);

            if (query.rowCount === 0) return res.status(404).json({ error: 'Record not found' });

            record = query.rows[0];

        } else {

            tableName = 'patient_clinical_records';

            const idInt = parseInt(idParam, 10);

            if (isNaN(idInt)) return res.status(400).json({ error: 'Invalid record ID format' });

            const query = await pool.query('SELECT * FROM patient_clinical_records WHERE id = $1 AND tenant_id = $2', [idInt, tenantId]);

            if (query.rowCount === 0) return res.status(404).json({ error: 'Record not found' });

            record = query.rows[0];

        }



        if (record.is_locked || record.is_locked === 1) {

            return res.status(409).json({ error: 'Record is already locked' });

        }



        // Clinical Signature Boundary: Check if the template represents a physician EMR or nursing record.

        const templateId = record.template_id;

        let isPhysicianEMR = true; // default fail-closed: treat as physician EMR



        if (templateId) {

            const templateQuery = await pool.query(

                'SELECT t.template_name_en, d.code as department_code FROM clinical_templates t JOIN clinical_departments d ON t.department_id = d.id WHERE t.id = $1',

                [templateId]

            );

            if (templateQuery.rowCount > 0) {

                const temp = templateQuery.rows[0];

                const nameLower = String(temp.template_name_en || '').toLowerCase();

                // Nursing templates list

                const isNursingTemplate = nameLower.includes('braden') || 

                                         nameLower.includes('morse') || 

                                         nameLower.includes('fall risk') || 

                                         nameLower.includes('pain assessment') || 

                                         nameLower.includes('count sheet') || 

                                         nameLower.includes('nursing') || 

                                         nameLower.includes('care plan') ||

                                         nameLower.includes('triage') ||

                                         nameLower.includes('apgar');

                if (isNursingTemplate) {

                    isPhysicianEMR = false;

                }

            }

        }



        // Role Boundary check

        const userRole = req.session.user.role;

        const allowedPhysicianRoles = new Set(['Doctor', 'OB/GYN', 'Neonatologist', 'Pathologist', 'Radiologist', 'Admin']);

        

        if (isPhysicianEMR && !allowedPhysicianRoles.has(userRole)) {

            return res.status(403).json({ error: 'Only medical practitioners are authorized to sign physician EMR records.' });

        }



        const crypto = require('crypto');

        if (tableName === 'clinical_records') {

            const dataToHash = typeof record.record_data === 'string' ? record.record_data : JSON.stringify(record.record_data);

            const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

            const signature = `Signed by ${req.session.user?.display_name || 'System'} on ${new Date().toISOString()} | Hash: ${hash}`;

            

            const result = await pool.query(

                'UPDATE clinical_records SET is_locked = 1, content_hash = $1, digital_signature = $2 WHERE id = $3 AND tenant_id = $4 RETURNING *',

                [hash, signature, idParam, tenantId]

            );

            logAudit(req.session.user?.id, req.session.user?.display_name, 'LOCK_EMR_RECORD', 'EMR', `Locked clinical_records #${idParam} with hash ${hash}`, req.ip);

            res.json(result.rows[0]);

        } else {

            const signaturePayload = `${record.id}|${JSON.stringify(record.recorded_values)}|${req.session.user.id}`;

            const signature = crypto.createHash('sha256').update(signaturePayload).digest('hex');

            await pool.query('UPDATE patient_clinical_records SET is_locked=true, signature=$1 WHERE id=$2 AND tenant_id=$3', [signature, parseInt(idParam, 10), tenantId]);

            logAudit(req.session.user?.id, req.session.user?.display_name, 'LOCK_EMR_RECORD', 'EMR', `Locked patient_clinical_records #${idParam} with signature`, req.ip);

            res.json({ success: true, signature });

        }

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/clinical-pharmacy/reviews', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        res.json((await pool.query('SELECT * FROM clinical_pharmacy_reviews WHERE tenant_id=$1 ORDER BY created_at DESC', [tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/clinical-pharmacy/reviews', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, patient_name, prescription_id, review_type, findings, recommendations, interventions, severity } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const result = await pool.query('INSERT INTO clinical_pharmacy_reviews (patient_id, patient_name, prescription_id, review_type, pharmacist, findings, recommendations, interventions, severity, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',

            [patient_id, patient_name || '', prescription_id || 0, review_type || 'Medication Review', req.session.user.name, findings || '', recommendations || '', interventions || '', severity || 'Low', tenantId || null, facilityId || null]);

        logAudit(req.session.user.id, req.session.user.name, 'CLINICAL_REVIEW', 'Clinical Pharmacy', `Review for patient ${patient_name}`, req.ip);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.put('/api/clinical-pharmacy/reviews/:id', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { outcome, status } = req.body;

        const { tenantId } = getRequestTenantContext(req);

        // IDOR: only update a review owned by this tenant.

        const r = await pool.query('UPDATE clinical_pharmacy_reviews SET outcome=$1, status=$2 WHERE id=$3 AND tenant_id=$4', [outcome || 'Resolved', status || 'Closed', req.params.id, tenantId]);

        if (!r.rowCount) return res.status(404).json({ error: 'Review not found' });

        res.json({ success: true });

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/clinical-pharmacy/interactions', requireAuth, requireTenantScope, async (req, res) => {

    try {

        res.json((await pool.query('SELECT * FROM drug_interactions ORDER BY severity DESC')).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/clinical-pharmacy/education', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        res.json((await pool.query('SELECT * FROM patient_drug_education WHERE tenant_id=$1 ORDER BY created_at DESC', [tenantId])).rows);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.post('/api/clinical-pharmacy/education', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { patient_id, patient_name, medication, instructions, side_effects, precautions } = req.body;

        const { tenantId, facilityId } = getRequestTenantContext(req);

        const result = await pool.query('INSERT INTO patient_drug_education (patient_id, patient_name, medication, instructions, side_effects, precautions, educated_by, tenant_id, facility_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',

            [patient_id, patient_name || '', medication || '', instructions || '', side_effects || '', precautions || '', req.session.user.name, tenantId || null, facilityId || null]);

        res.json(result.rows[0]);

    } catch (e) { res.status(500).json({ error: 'Server error' }); }

});

router.get('/api/clinical/departments', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const result = await pool.query('SELECT * FROM clinical_departments WHERE tenant_id = $1 ORDER BY id DESC', [tenantId]);

        res.json(result.rows);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/clinical/departments', requireAuth, requireRole('Admin'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { code, name_ar, name_en } = req.body;

        if (!code) return res.status(400).json({ error: 'Department code is required' });

        

        const result = await pool.query(

            'INSERT INTO clinical_departments (tenant_id, code, name_ar, name_en) VALUES ($1, $2, $3, $4) ON CONFLICT (tenant_id, code) DO UPDATE SET name_ar=$3, name_en=$4 RETURNING *',

            [tenantId, code, name_ar || '', name_en || '']

        );

        res.status(201).json(result.rows[0]);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/clinical/templates', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { department_id } = req.query;

        let q = 'SELECT t.*, d.code as department_code FROM clinical_templates t JOIN clinical_departments d ON t.department_id = d.id';

        const params = [];

        if (department_id) {

            q += ' WHERE t.department_id = $1';

            params.push(parseInt(department_id));

        }

        const result = await pool.query(q, params);

        res.json(result.rows);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/clinical/templates', requireAuth, requireRole('Admin'), requireTenantScope, async (req, res) => {

    try {

        const { department_id, form_structure, version } = req.body;

        if (!department_id || !form_structure) {

            return res.status(400).json({ error: 'department_id and form_structure are required' });

        }

        

        const result = await pool.query(

            'INSERT INTO clinical_templates (department_id, version, form_structure) VALUES ($1, $2, $3) RETURNING *',

            [parseInt(department_id), version || '1.0.0', typeof form_structure === 'object' ? JSON.stringify(form_structure) : form_structure]

        );

        res.status(201).json(result.rows[0]);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/clinical/records', requireAuth, requireRole('patients'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { patient_id } = req.query;

        if (!patient_id) return res.status(400).json({ error: 'patient_id is required' });

        

        const result = await pool.query(

            'SELECT * FROM clinical_records WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC',

            [tenantId, parseInt(patient_id)]

        );

        res.json(result.rows);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/clinical/records', requireAuth, requireRole('patients'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { id, patient_id, template_id, record_data } = req.body;

        

        if (!patient_id || !record_data) {

            return res.status(400).json({ error: 'patient_id and record_data are required' });

        }

        

        let data = typeof record_data === 'string' ? JSON.parse(record_data) : record_data;

        

        let template = null;

        if (template_id) {

            template = (await pool.query('SELECT t.template_name_en, d.code as department_code FROM clinical_templates t JOIN clinical_departments d ON t.department_id = d.id WHERE t.id = $1', [parseInt(template_id)])).rows[0];

        }

        

        let clinicalWarning = null;

        let highRiskFlag = false;

        let apgarCritical = false;

        

        if (template) {

            if (template.template_name_en === 'Surgical Count Sheet') {

                const sponge_pre = Number(data.sponge_count_pre || 0);

                const sponge_post = Number(data.sponge_count_post || 0);

                const inst_pre = Number(data.instrument_count_pre || 0);

                const inst_post = Number(data.instrument_count_post || 0);

                const sharp_pre = Number(data.sharp_count_pre || 0);

                const sharp_post = Number(data.sharp_count_post || 0);

                const override = String(data.override_reason || '').trim();

                

                const isMismatch = (sponge_pre !== sponge_post) || (inst_pre !== inst_post) || (sharp_pre !== sharp_post);

                if (isMismatch) {

                    if (!override) {

                        return res.status(422).json({

                            error: 'Surgical count mismatch! Please provide an override reason.',

                            message_ar: 'مخالفة في عدد الأدوات الجراحية! يرجى تقديم تبرير للتجاوز.',

                            blocked: true

                        });

                    } else {

                        logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'SURGERY_COUNT_OVERRIDE', 'Clinical Safety', 

                            `Surgical count mismatch overridden for patient #${patient_id}: ${override}`, tenantId);

                        clinicalWarning = `Surgical count mismatch overridden: ${override}`;

                    }

                }

            } else if (template.template_name_en === 'Braden Scale Assessment') {

                const score = Number(data.sensory_perception || 0) + Number(data.moisture || 0) + Number(data.activity || 0) + Number(data.mobility || 0) + Number(data.nutrition || 0) + Number(data.friction_shear || 0);

                data.total_score = score;

                if (score <= 12) {

                    highRiskFlag = true;

                    clinicalWarning = `High Risk for Pressure Ulcers (Braden Score: ${score})`;

                }

            } else if (template.template_name_en === 'Morse Fall Risk Assessment') {

                const score = Number(data.history_of_falls || 0) + Number(data.secondary_diagnosis || 0) + Number(data.ambulatory_aid || 0) + Number(data.iv_heparin_lock || 0) + Number(data.gait_transferring || 0) + Number(data.mental_status || 0);

                data.total_score = score;

                if (score >= 45) {

                    highRiskFlag = true;

                    clinicalWarning = `High Risk for Falls (Morse Score: ${score})`;

                }

            } else if (template.template_name_en === 'Neonatal Apgar Score') {

                const fields = [

                    'apgar_1m_appearance', 'apgar_1m_pulse', 'apgar_1m_grimace', 'apgar_1m_activity', 'apgar_1m_respiration',

                    'apgar_5m_appearance', 'apgar_5m_pulse', 'apgar_5m_grimace', 'apgar_5m_activity', 'apgar_5m_respiration'

                ];

                for (const f of fields) {

                    if (data[f] !== undefined && data[f] !== null) {

                        const val = Number(data[f]);

                        if (![0, 1, 2].includes(val)) {

                            return res.status(400).json({ error: `Invalid APGAR value for field ${f}: must be 0, 1, or 2` });

                        }

                    }

                }

                const score1m = Number(data.apgar_1m_appearance || 0) + Number(data.apgar_1m_pulse || 0) + Number(data.apgar_1m_grimace || 0) + Number(data.apgar_1m_activity || 0) + Number(data.apgar_1m_respiration || 0);

                const score5m = Number(data.apgar_5m_appearance || 0) + Number(data.apgar_5m_pulse || 0) + Number(data.apgar_5m_grimace || 0) + Number(data.apgar_5m_activity || 0) + Number(data.apgar_5m_respiration || 0);

                data.apgar_1m_total = score1m;

                data.apgar_5m_total = score5m;

                if (score5m < 7) {

                    apgarCritical = true;

                    clinicalWarning = `Critical 5-min APGAR score: ${score5m}`;

                    logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'APGAR_CRITICAL', 'Clinical Safety', 

                        `Neonatal APGAR score 5-min is critical (${score5m}) for patient #${patient_id}`, tenantId);

                }

            }

        }

        

        const recordDataStr = JSON.stringify(data);

        

        if (id) {

            // Update flow - check lock status first

            const existing = await pool.query('SELECT * FROM clinical_records WHERE id = $1 AND tenant_id = $2', [id, tenantId]);

            if (existing.rowCount === 0) return res.status(404).json({ error: 'Record not found' });

            if (existing.rows[0].is_locked === 1) {

                return res.status(409).json({ error: 'Cannot modify locked EMR record' });

            }

            

            const result = await pool.query(

                'UPDATE clinical_records SET record_data = $1 WHERE id = $2 AND tenant_id = $3 RETURNING *',

                [recordDataStr, id, tenantId]

            );

            return res.json({ ...result.rows[0], clinical_warning: clinicalWarning, high_risk_flag: highRiskFlag, apgar_critical: apgarCritical });

        } else {

            // Insert flow

            const newId = crypto.randomUUID();

            const result = await pool.query(

                'INSERT INTO clinical_records (id, tenant_id, patient_id, template_id, record_data, is_locked) VALUES ($1, $2, $3, $4, $5, 0) RETURNING *',

                [newId, tenantId, parseInt(patient_id), template_id ? parseInt(template_id) : null, recordDataStr]

            );

            return res.status(201).json({ ...result.rows[0], clinical_warning: clinicalWarning, high_risk_flag: highRiskFlag, apgar_critical: apgarCritical });

        }

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/clinical/notes', requireAuth, requireRole('patients'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { patient_id } = req.query;

        if (!patient_id) {

            return res.status(400).json({ error: 'patient_id is required' });

        }

        const result = await pool.query(

            'SELECT * FROM clinical_notes WHERE tenant_id = $1 AND patient_id = $2 ORDER BY created_at DESC',

            [tenantId, parseInt(patient_id)]

        );

        res.json(result.rows);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/clinical/notes', requireAuth, requireRole('patients'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const { id, patient_id, encounter_ref, type, subjective, objective, assessment, plan } = req.body;

        

        if (!patient_id) {

            return res.status(400).json({ error: 'patient_id is required' });

        }

        

        const noteType = type || 'SOAP';

        if (noteType !== 'SOAP') {

            return res.status(400).json({ error: 'Invalid note type: only SOAP is supported' });

        }

        

        if (id) {

            // Update flow

            const existing = await pool.query('SELECT * FROM clinical_notes WHERE id = $1 AND tenant_id = $2', [parseInt(id), tenantId]);

            if (existing.rowCount === 0) return res.status(404).json({ error: 'Note not found' });

            if (existing.rows[0].emr_status === 'locked') {

                return res.status(409).json({ error: 'Cannot modify locked EMR record' });

            }

            

            const result = await pool.query(

                `UPDATE clinical_notes 

                 SET encounter_ref = $1, subjective = $2, objective = $3, assessment = $4, plan = $5 

                 WHERE id = $6 AND tenant_id = $7 RETURNING *`,

                [encounter_ref ? parseInt(encounter_ref) : null, subjective || '', objective || '', assessment || '', plan || '', parseInt(id), tenantId]

            );

            

            logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'UPDATE_CLINICAL_NOTE', 'EMR', `Updated SOAP note #${id} for patient #${patient_id}`, tenantId);

            return res.json(result.rows[0]);

        } else {

            // Insert flow

            const result = await pool.query(

                `INSERT INTO clinical_notes (tenant_id, patient_id, encounter_ref, type, subjective, objective, assessment, plan, author_id, emr_status) 

                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft') RETURNING *`,

                [tenantId, parseInt(patient_id), encounter_ref ? parseInt(encounter_ref) : null, noteType, subjective || '', objective || '', assessment || '', plan || '', req.session.user?.id || null]

            );

            

            logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'CREATE_CLINICAL_NOTE', 'EMR', `Created SOAP note #${result.rows[0].id} for patient #${patient_id}`, tenantId);

            return res.status(201).json(result.rows[0]);

        }

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/clinical/notes/:id/lock', requireAuth, requireRole('patients'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const noteId = parseInt(req.params.id);

        

        const noteQuery = await pool.query('SELECT * FROM clinical_notes WHERE id = $1 AND tenant_id = $2', [noteId, tenantId]);

        if (noteQuery.rowCount === 0) return res.status(404).json({ error: 'Note not found' });

        

        const note = noteQuery.rows[0];

        if (note.emr_status === 'locked') {

            return res.status(409).json({ error: 'Record is already locked' });

        }

        

        // Calculate integrity hash of SOAP contents

        const dataToHash = JSON.stringify({

            subjective: note.subjective || '',

            objective: note.objective || '',

            assessment: note.assessment || '',

            plan: note.plan || ''

        });

        const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

        

        // Dynamic Signature

        const signature = `Signed by ${req.session.user?.display_name || 'System'} on ${new Date().toISOString()} | Hash: ${hash}`;

        

        const result = await pool.query(

            `UPDATE clinical_notes 

             SET emr_status = 'locked', locked_at = CURRENT_TIMESTAMP, signed_by_user_id = $1, signed_at = CURRENT_TIMESTAMP, integrity_hash = $2 

             WHERE id = $3 AND tenant_id = $4 RETURNING *`,

            [req.session.user?.id || null, signature, noteId, tenantId]

        );

        

        logAudit(req.session.user?.id, req.session.user?.display_name || req.session.user?.name, 'LOCK_CLINICAL_NOTE', 'EMR', `Locked SOAP note #${noteId} with hash ${hash}`, tenantId);

        res.json(result.rows[0]);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/clinical/smart-templates', requireAuth, requireRole('patients'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const doctorId = req.session.user?.id;

        

        const result = await pool.query(

            'SELECT * FROM clinical_smart_templates WHERE tenant_id = $1 AND doctor_id = $2 ORDER BY shortcut ASC',

            [tenantId, doctorId]

        );

        res.json(result.rows);

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.post('/api/clinical/smart-templates', requireAuth, requireRole('patients'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const doctorId = req.session.user?.id;

        const { id, shortcut, template_text } = req.body;

        

        if (!shortcut || !shortcut.startsWith('.') || shortcut.includes(' ')) {

            return res.status(400).json({ error: 'Shortcut must start with a dot and contain no spaces (e.g. .htn)' });

        }

        if (!template_text) {

            return res.status(400).json({ error: 'template_text is required' });

        }

        

        if (id) {

            // Update flow

            const existing = await pool.query('SELECT * FROM clinical_smart_templates WHERE id = $1 AND doctor_id = $2 AND tenant_id = $3', [parseInt(id), doctorId, tenantId]);

            if (existing.rowCount === 0) return res.status(404).json({ error: 'Template not found' });

            

            // Check unique shortcut for other templates

            const dup = await pool.query('SELECT 1 FROM clinical_smart_templates WHERE tenant_id = $1 AND doctor_id = $2 AND shortcut = $3 AND id <> $4', [tenantId, doctorId, shortcut, parseInt(id)]);

            if (dup.rowCount > 0) {

                return res.status(409).json({ error: 'Shortcut already exists' });

            }

            

            const result = await pool.query(

                'UPDATE clinical_smart_templates SET shortcut = $1, template_text = $2 WHERE id = $3 AND tenant_id = $4 RETURNING *',

                [shortcut, template_text, parseInt(id), tenantId]

            );

            return res.json(result.rows[0]);

        } else {

            // Insert flow

            const dup = await pool.query('SELECT 1 FROM clinical_smart_templates WHERE tenant_id = $1 AND doctor_id = $2 AND shortcut = $3', [tenantId, doctorId, shortcut]);

            if (dup.rowCount > 0) {

                return res.status(409).json({ error: 'Shortcut already exists' });

            }

            

            const result = await pool.query(

                'INSERT INTO clinical_smart_templates (tenant_id, doctor_id, shortcut, template_text) VALUES ($1, $2, $3, $4) RETURNING *',

                [tenantId, doctorId, shortcut, template_text]

            );

            return res.status(201).json(result.rows[0]);

        }

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.delete('/api/clinical/smart-templates/:id', requireAuth, requireRole('patients'), requireTenantScope, async (req, res) => {

    try {

        const { tenantId } = getRequestTenantContext(req);

        const doctorId = req.session.user?.id;

        const templateId = parseInt(req.params.id);

        

        const result = await pool.query(

            'DELETE FROM clinical_smart_templates WHERE id = $1 AND doctor_id = $2 AND tenant_id = $3 RETURNING *',

            [templateId, doctorId, tenantId]

        );

        if (result.rowCount === 0) {

            return res.status(404).json({ error: 'Template not found' });

        }

        res.json({ success: true });

    } catch (e) {

        res.status(500).json({ error: 'Server error' });

    }

});

router.get('/api/clinical/medication-reconciliation/:patientId', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const pid = parseInt(req.params.patientId);

        

        // Verify patient belongs to tenant (IDOR check)

        const pat = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tid]);

        if (!pat.rows.length) return res.status(403).json({ error: 'Patient not found or access denied' });

        

        const rows = await pool.query('SELECT * FROM medication_reconciliations WHERE patient_id=$1 AND tenant_id=$2 ORDER BY performed_at DESC', [pid, tid]);

        res.json(rows.rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/clinical/medication-reconciliation', requireAuth, requireRole('pharmacist', 'doctor', 'clinical-pharmacy'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { patient_id, admission_id, reconciliation_type = 'Admission', status = 'Completed', home_medications = [], hospital_medications = [], discrepancies = [], allergy_verified = false, high_alert_checked = false, patient_counselled = false, notes = '' } = req.body;

        if (!patient_id) return res.status(400).json({ error: 'patient_id required' });

        

        // IDOR check

        const pat = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [parseInt(patient_id), tid]);

        if (!pat.rows.length) return res.status(403).json({ error: 'Patient access denied' });

        

        const r = await pool.query(

            `INSERT INTO medication_reconciliations 

                (patient_id, admission_id, reconciliation_type, performed_by, performed_by_name, status, home_medications, hospital_medications, discrepancies, allergy_verified, high_alert_checked, patient_counselled, notes, tenant_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,

            [parseInt(patient_id), admission_id ? parseInt(admission_id) : null, reconciliation_type, req.session.user.id, req.session.user.display_name, status,

             JSON.stringify(home_medications), JSON.stringify(hospital_medications), JSON.stringify(discrepancies), allergy_verified, high_alert_checked, patient_counselled, notes, tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'MED_RECONCILED', 'Clinical', `Med Reconciliation performed for Patient#${patient_id} (Type: ${reconciliation_type})`, tid);

        res.json({ success: true, record: r.rows[0] });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.get('/api/clinical/problem-list/:patientId', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const pid = parseInt(req.params.patientId);

        

        const pat = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [pid, tid]);

        if (!pat.rows.length) return res.status(403).json({ error: 'Patient access denied' });

        

        const rows = await pool.query('SELECT * FROM patient_problem_list WHERE patient_id=$1 AND tenant_id=$2 ORDER BY is_active DESC, onset_date DESC NULLS LAST', [pid, tid]);

        res.json(rows.rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/clinical/problem-list', requireAuth, requireRole('doctor', 'nurse', 'clinical'), requireTenantScope, async (req, res) => {

    try {

        const tid = getRequestTenantContext(req);

        const { patient_id, admission_id, icd10_code, icd10_description, snomed_code, problem_name, problem_type = 'Chronic', onset_date, resolved_date, severity = 'Moderate', status = 'Active', notes, principal_diagnosis = false } = req.body;

        if (!patient_id || !problem_name) return res.status(400).json({ error: 'patient_id and problem_name required' });

        

        // IDOR check

        const pat = await pool.query('SELECT id FROM patients WHERE id=$1 AND tenant_id=$2', [parseInt(patient_id), tid]);

        if (!pat.rows.length) return res.status(403).json({ error: 'Patient access denied' });

        

        const r = await pool.query(

            `INSERT INTO patient_problem_list 

                (patient_id, admission_id, icd10_code, icd10_description, snomed_code, problem_name, problem_type, onset_date, resolved_date, severity, status, added_by, added_by_id, notes, principal_diagnosis, tenant_id)

             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,

            [parseInt(patient_id), admission_id ? parseInt(admission_id) : null, icd10_code || '', icd10_description || '', snomed_code || '', problem_name, problem_type, onset_date || null, resolved_date || null, severity, status, 

             req.session.user.display_name, req.session.user.id, notes || '', principal_diagnosis, tid]

        );

        logAudit(req.session.user.id, req.session.user.display_name, 'PROBLEM_ADDED', 'Clinical', `Problem ${problem_name} (ICD10: ${icd10_code}) added for Patient#${patient_id}`, tid);

        res.json({ success: true, problem: r.rows[0] });

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.get('/api/clinical/icd10', requireAuth, async (req, res) => {

    try {

        const { query: searchQuery } = req.query;

        let q = 'SELECT * FROM icd10_codes WHERE TRUE';

        const params = [];

        if (searchQuery) {

            params.push(`%${searchQuery}%`);

            q += ` AND (code ILIKE $1 OR description_en ILIKE $1 OR description_ar ILIKE $1)`;

        }

        q += ' LIMIT 100';

        const rows = await pool.query(q, params);

        res.json(rows.rows);

    } catch (e) { res.status(500).json({ error: e.message }); }

});

router.post('/api/clinical/safety-check', requireAuth, requireTenantScope, async (req, res) => {

    try {

        const { tenantId: tid } = getRequestTenantContext(req);

        const { patient_id, drug_name } = req.body;

        if (!patient_id || !drug_name) {

            return res.status(400).json({ error: 'patient_id and drug_name are required' });

        }



        // Fetch patient details (IDOR check)

        const patRes = await pool.query('SELECT name_en, notes FROM patients WHERE id=$1 AND tenant_id=$2', [parseInt(patient_id), tid]);

        if (!patRes.rows.length) {

            return res.status(403).json({ error: 'Patient access denied' });

        }



        const patient = patRes.rows[0];

        let allergies = [];



        // 1) Scan patients.notes

        if (patient.notes && patient.notes.toLowerCase().includes('allerg')) {

            allergies.push(patient.notes);

        }



        // 2) Scan nursing_vitals

        const vitalsRes = await pool.query('SELECT allergies FROM nursing_vitals WHERE patient_id=$1 AND tenant_id=$2 ORDER BY id DESC LIMIT 1', [parseInt(patient_id), tid]);

        if (vitalsRes.rows.length && vitalsRes.rows[0].allergies) {

            allergies.push(vitalsRes.rows[0].allergies);

        }



        // 3) Scan patient_problem_list (Allergy problem type)

        const probRes = await pool.query("SELECT problem_name, icd10_description FROM patient_problem_list WHERE patient_id=$1 AND problem_type='Allergy' AND is_active=true AND tenant_id=$2", [parseInt(patient_id), tid]);

        probRes.rows.forEach(p => {

            allergies.push(p.problem_name || p.icd10_description);

        });



        // Cross-check drug name against found allergies

        let conflictDetected = false;

        let conflictDetails = '';

        const drugClean = drug_name.toLowerCase().trim();



        for (const allergy of allergies) {

            const allergyClean = allergy.toLowerCase();

            // Simple keyword overlap check

            if (allergyClean.includes(drugClean) || drugClean.split(' ').some(word => word.length > 3 && allergyClean.includes(word))) {

                conflictDetected = true;

                conflictDetails = `Patient has documented allergy: "${allergy}"`;

                break;

            }

        }



        logAudit(req.session.user.id, req.session.user.display_name || req.session.user.name, 'DRUG_ALLERGY_CHECK', 'Clinical Safety', 

            `Checked allergy safety for patient #${patient_id} and drug ${drug_name}. Conflict: ${conflictDetected}`, tid);



        res.json({

            patient_id,

            drug_name,

            alert: conflictDetected,

            message: conflictDetected ? `WARNING: Potential allergy conflict detected! ${conflictDetails}` : 'No known drug-allergy conflict detected.',

            details: conflictDetails

        });

    } catch (e) {

        res.status(500).json({ error: e.message });

    }

});


    return router;
}
