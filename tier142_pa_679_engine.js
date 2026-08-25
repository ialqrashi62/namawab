// filepath: tier142_pa_679_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pain_assess(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.nrs_score, 'ns');
  ensureNum(req.vas_score, 'vs');
  ensureStr(req.location, 'lc');
  ensureEnum(req.character, 'ch', ['sharp','dull','burning','tingling','throbbing','aching','shooting','stabbing','cramping','numb']);
  ensureEnum(req.duration, 'du', ['acute','subacute','chronic','breakthrough','incident','procedural']);
  ensureNum(req.duration_days, 'dd');
  ensureStr(req.provider, 'pr');
  return { pa_id: `pa_${Date.now()}`, patient_id: req.patient_id, nrs: req.nrs_score, character: req.character };
}
function nerve_block(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.nerve, 'nr', ['brachial_plexus','lumbar_plexus','cervical_plexus','sciatic','femoral','popliteal','axillary','interscalene','supraclavicular','infraclavicular','spinal','epidural','TAP','rectus_sheath','paravertebral','stellate','other']);
  ensureStr(req.approach, 'ap');
  ensureEnum(req.guidance, 'gu', ['landmark','US','fluoroscopy','CT','paresthesia','nerve_stimulator','combined']);
  ensureStr(req.local_anesthetic, 'la');
  ensureNum(req.volume_ml, 'vl');
  ensureNum(req.duration_hr, 'du');
  ensureStr(req.provider, 'pr');
  return { nb_id: `nb_${Date.now()}`, patient_id: req.patient_id, nerve: req.nerve, guidance: req.guidance };
}
function pump(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['patient_controlled_analgesia_PCA','epidural','intrathecal','regional','peripheral_nerve','continuous','continuous_plus_PCA','continuous_plus_bolus']);
  ensureNum(req.dose_mg, 'ds');
  ensureNum(req.lockout_min, 'lo');
  ensureNum(req.basal_rate_mg_hr, 'br');
  ensureNum(req.demand_doses, 'dd');
  ensureNum(req.delivered_doses, 'de');
  ensureStr(req.medication, 'md');
  ensureStr(req.provider, 'pr');
  return { pu_id: `pu_${Date.now()}`, patient_id: req.patient_id, type: req.type, delivered: req.delivered_doses };
}
function spinal_cord_stim(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.lead_type, 'lt', ['percutaneous','paddle','burst','high_frequency','dorsal_root','HF_10K','closed_loop','DRG','other']);
  ensureNum(req.paresthesia_pct, 'pp');
  ensureNum(req.pain_reduction_pct, 'pr');
  ensureEnum(req.phase, 'ph', ['trial','permanent','replacement','revision','explant']);
  ensureNum(req.battery_pct, 'bp');
  ensureStr(req.provider, 'pr');
  ensureNum(req.oswestry_score, 'od');
  return { sc_id: `sc_${Date.now()}`, patient_id: req.patient_id, lead_type: req.lead_type, phase: req.phase };
}
function intrathecal(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.medication, 'md', ['morphine','baclofen','ziconotide','hydromorphone','clonidine','bupivacaine','fentanyl','sufentanil','triamcinolone','other']);
  ensureNum(req.dose_mg_d, 'do');
  ensureNum(req.refill_days, 'rd');
  ensureBool(req.pump_connected, 'pc');
  ensureNum(req.pain_reduction_pct, 'pr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.oswestry_score, 'od');
  return { it_id: `it_${Date.now()}`, patient_id: req.patient_id, med: req.medication, dose: req.dose_mg_d };
}

function funcs() { return { pain_assess, nerve_block, pump, spinal_cord_stim, intrathecal }; }
module.exports = { funcs, ValidationError };
