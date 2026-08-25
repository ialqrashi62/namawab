// filepath: namaweb/clinical_pathway_engine.js
// Clinical pathway / workflow engine.
// Defines reusable pathways (steps + dependencies), runs them per patient.
// Server-side state machine, JSONB for step state.
'use strict';

const db = require('./db_postgres');

// Built-in pathway templates (clinical best-practice workflows)
const TEMPLATES = {
    'sepsis_bundle': {
        name_en: 'Sepsis 1-Hour Bundle',
        name_ar: 'حزمة sepsis لمدة ساعة',
        department: 'critical_care',
        steps: [
            { idx: 0, name: 'Lactate measurement', action: 'measure_lactate', required: true, time_minutes: 0 },
            { idx: 1, name: 'Blood cultures × 2', action: 'order_blood_cultures', required: true, time_minutes: 0 },
            { idx: 2, name: 'Broad-spectrum antibiotics', action: 'order_antibiotics', required: true, time_minutes: 60 },
            { idx: 3, name: 'IV crystalloid 30 mL/kg', action: 'order_fluid_resuscitation', required: true, time_minutes: 180 },
            { idx: 4, name: 'Vasopressors (if MAP <65)', action: 'order_vasopressors', required: false, time_minutes: 360 }
        ],
        description: 'Surviving Sepsis Campaign 1-hour bundle. All interventions within 1 hour.'
    },
    'stroke_acute': {
        name_en: 'Acute Ischemic Stroke Pathway',
        name_ar: 'مسار السكتة الدماغية الحادة',
        department: 'neurology',
        steps: [
            { idx: 0, name: 'NIHSS assessment', action: 'doc_nihss', required: true, time_minutes: 0 },
            { idx: 1, name: 'CT head non-contrast', action: 'order_ct_head', required: true, time_minutes: 25 },
            { idx: 2, name: 'CT angiography', action: 'order_cta', required: false, time_minutes: 45 },
            { idx: 3, name: 'Eligibility for tPA', action: 'assess_tpa', required: true, time_minutes: 60 },
            { idx: 4, name: 'Administer tPA (if eligible)', action: 'admin_tpa', required: false, time_minutes: 270 },
            { idx: 5, name: 'Mechanical thrombectomy consult', action: 'consult_neurointervention', required: false, time_minutes: 360 }
        ],
        description: 'Acute stroke workflow with door-to-needle time targets.'
    },
    'ami_stemi': {
        name_en: 'STEMI Pathway',
        name_ar: 'مسار STEMI',
        department: 'cardiology',
        steps: [
            { idx: 0, name: '12-lead ECG within 10 min', action: 'order_ecg', required: true, time_minutes: 10 },
            { idx: 1, name: 'Aspirin 162-325 mg', action: 'admin_aspirin', required: true, time_minutes: 20 },
            { idx: 2, name: 'P2Y12 inhibitor loading', action: 'admin_p2y12', required: true, time_minutes: 30 },
            { idx: 3, name: 'Anticoagulation', action: 'admin_anticoag', required: true, time_minutes: 45 },
            { idx: 4, name: 'Cath lab activation', action: 'activate_cath_lab', required: true, time_minutes: 60 },
            { idx: 5, name: 'PCI performed', action: 'doc_pci', required: false, time_minutes: 90 }
        ],
        description: 'ST-elevation MI: door-to-balloon <90 minutes.'
    },
    'dka_protocol': {
        name_en: 'DKA Management Protocol',
        name_ar: 'بروتوكول DKA',
        department: 'endocrinology',
        steps: [
            { idx: 0, name: 'Confirm diagnosis (glucose, ketones, pH)', action: 'order_dka_labs', required: true, time_minutes: 0 },
            { idx: 1, name: 'IV access × 2', action: 'establish_iv_access', required: true, time_minutes: 15 },
            { idx: 2, name: 'IV fluids (NS 15-20 mL/kg/hr)', action: 'order_iv_fluids', required: true, time_minutes: 30 },
            { idx: 3, name: 'Insulin drip 0.1 U/kg/hr', action: 'start_insulin_drip', required: true, time_minutes: 60 },
            { idx: 4, name: 'Potassium replacement per K+', action: 'replace_potassium', required: true, time_minutes: 120 },
            { idx: 5, name: 'Monitor glucose hourly', action: 'monitor_glucose', required: true, time_minutes: 180 },
            { idx: 6, name: 'Transition to subcutaneous insulin', action: 'transition_to_sc', required: false, time_minutes: 720 }
        ],
        description: 'Diabetic ketoacidosis standard management.'
    },
    'post_op_check': {
        name_en: 'Post-operative Check Protocol',
        name_ar: 'بروتوكول الفحص بعد العملية',
        department: 'surgery',
        steps: [
            { idx: 0, name: 'Vital signs on arrival', action: 'record_vitals', required: true, time_minutes: 0 },
            { idx: 1, name: 'Pain assessment', action: 'assess_pain', required: true, time_minutes: 30 },
            { idx: 2, name: 'Wound inspection', action: 'inspect_wound', required: true, time_minutes: 60 },
            { idx: 3, name: 'Ambulation trial', action: 'trial_ambulation', required: false, time_minutes: 240 },
            { idx: 4, name: 'Discharge criteria met', action: 'assess_discharge', required: true, time_minutes: 360 }
        ],
        description: 'Post-op recovery milestones for stable discharge.'
    }
};

function getTemplate(code) {
    return TEMPLATES[code] || null;
}

function listTemplates() {
    return Object.entries(TEMPLATES).map(([code, t]) => ({
        code, name_en: t.name_en, name_ar: t.name_ar, department: t.department,
        step_count: t.steps.length, description: t.description
    }));
}

/**
 * Seed templates into the DB as active pathways (idempotent per tenant).
 */
async function seedTemplates(tenantId, createdBy) {
    const seeded = [];
    for (const [code, tpl] of Object.entries(TEMPLATES)) {
        const result = await db.query(`
            INSERT INTO clinical_pathways
                (tenant_id, code, name_en, name_ar, department, steps, description, version, active, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 1, TRUE, $8)
            ON CONFLICT (tenant_id, code, version) DO UPDATE
                SET name_en = EXCLUDED.name_en, name_ar = EXCLUDED.name_ar, steps = EXCLUDED.steps, description = EXCLUDED.description, updated_at = NOW()
            RETURNING id, code
        `, [tenantId, code, tpl.name_en, tpl.name_ar || '', tpl.department || '', JSON.stringify(tpl.steps), tpl.description || '', createdBy]);
        seeded.push({ code, id: result.rows[0].id });
    }
    return seeded;
}

/**
 * Start a new pathway instance for a patient.
 */
async function startInstance(tenantId, pathwayId, patientId, startedBy) {
    const pathwayRes = await db.query(`
        SELECT id, code, name_en, steps FROM clinical_pathways
        WHERE id = $1 AND tenant_id = $2 AND active = TRUE
    `, [pathwayId, tenantId]);
    if (pathwayRes.rows.length === 0) {
        return { error: 'pathway_not_found' };
    }
    const pathway = pathwayRes.rows[0];
    const steps = typeof pathway.steps === 'string' ? JSON.parse(pathway.steps) : pathway.steps;
    const stepState = steps.map(() => ({ status: 'pending', completed_at: null, completed_by: null, notes: '' }));

    const result = await db.query(`
        INSERT INTO clinical_pathway_instances
            (tenant_id, pathway_id, patient_id, started_by, current_step, step_state, status)
        VALUES ($1, $2, $3, $4, 0, $5, 'active')
        RETURNING id, current_step, status, started_at
    `, [tenantId, pathwayId, patientId, startedBy, JSON.stringify(stepState)]);

    return {
        ok: true,
        instance_id: result.rows[0].id,
        pathway_code: pathway.code,
        pathway_name: pathway.name_en,
        current_step: 0,
        total_steps: steps.length,
        step_state: stepState,
        started_at: result.rows[0].started_at
    };
}

/**
 * Complete a step in an active pathway.
 */
async function completeStep(tenantId, instanceId, stepIdx, completedBy, notes) {
    const res = await db.query(`
        SELECT id, pathway_id, current_step, step_state, status
        FROM clinical_pathway_instances
        WHERE id = $1 AND tenant_id = $2 AND status = 'active'
    `, [instanceId, tenantId]);
    if (res.rows.length === 0) {
        return { error: 'instance_not_found_or_not_active' };
    }
    const inst = res.rows[0];
    let stepState = typeof inst.step_state === 'string' ? JSON.parse(inst.step_state) : inst.step_state;
    if (stepIdx < 0 || stepIdx >= stepState.length) {
        return { error: 'invalid_step_index' };
    }
    if (stepState[stepIdx].status === 'completed') {
        return { error: 'step_already_completed' };
    }
    stepState[stepIdx] = {
        status: 'completed',
        completed_at: new Date().toISOString(),
        completed_by: completedBy,
        notes: notes || ''
    };
    const newCurrent = stepIdx + 1 < stepState.length ? stepIdx + 1 : stepIdx;
    const allDone = stepState.every(s => s.status === 'completed');
    const newStatus = allDone ? 'completed' : 'active';
    const completedAt = allDone ? new Date().toISOString() : null;

    await db.query(`
        UPDATE clinical_pathway_instances
        SET step_state = $1, current_step = $2, status = $3, completed_at = $4, updated_at = NOW()
        WHERE id = $5
    `, [JSON.stringify(stepState), newCurrent, newStatus, completedAt, instanceId]);

    return {
        ok: true,
        step_idx: stepIdx,
        completed: true,
        all_steps_done: allDone,
        new_status: newStatus,
        current_step: newCurrent,
        step_state: stepState
    };
}

/**
 * Get active instances for a patient.
 */
async function getPatientInstances(tenantId, patientId) {
    const result = await db.query(`
        SELECT i.id, i.pathway_id, i.current_step, i.status, i.started_at, i.completed_at, i.step_state,
               p.code, p.name_en, p.name_ar, p.steps, p.department
        FROM clinical_pathway_instances i
        JOIN clinical_pathways p ON p.id = i.pathway_id
        WHERE i.tenant_id = $1 AND i.patient_id = $2
        ORDER BY i.started_at DESC
        LIMIT 20
    `, [tenantId, patientId]);
    return result.rows.map(r => ({
        instance_id: r.id,
        pathway_code: r.code,
        pathway_name: r.name_en,
        pathway_name_ar: r.name_ar,
        department: r.department,
        current_step: r.current_step,
        status: r.status,
        started_at: r.started_at,
        completed_at: r.completed_at,
        total_steps: typeof r.steps === 'string' ? JSON.parse(r.steps).length : r.steps.length,
        step_state: typeof r.step_state === 'string' ? JSON.parse(r.step_state) : r.step_state
    }));
}

module.exports = { TEMPLATES, getTemplate, listTemplates, seedTemplates, startInstance, completeStep, getPatientInstances };