// filepath: tier175_psy_820_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function depression_screen(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.phq9_score, 'ps'); ensureNum(req.duration_days, 'du');
  ensureNum(req.sleep_quality, 'sq'); ensureNum(req.energy, 'en');
  ensureNum(req.interest, 'in'); ensureBool(req.suicidal_ideation, 'si');
  ensureEnum(req.treatment, 'tr', ['none','SSRI','SNRI','CBT','combination','NA']);
  ensureNum(req.followup_months, 'fu'); ensureStr(req.provider, 'pr');
  return { ds_id: `ds_${Date.now()}`, patient_id: req.patient_id, phq9: req.phq9_score, tr: req.treatment };
}

function anxiety_screen(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.gad7_score, 'gs'); ensureNum(req.duration_days, 'du');
  ensureEnum(req.triggers, 'tr', ['work','family','health','financial','social','NA']);
  ensureBool(req.somatic, 'so'); ensureNum(req.sleep_quality, 'sq');
  ensureEnum(req.treatment, 'tm', ['none','SSRI','buspirone','CBT','benzodiazepine','NA']);
  ensureEnum(req.response, 're', ['good','partial','poor','NA']);
  ensureNum(req.followup_months, 'fu'); ensureStr(req.provider, 'pr');
  return { as_id: `as_${Date.now()}`, patient_id: req.patient_id, gad7: req.gad7_score, re: req.response };
}

function ptsd_screen(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.pcl5_score, 'ps'); ensureEnum(req.trauma_type, 'tt', ['combat','sexual','MVC','combat_other','natural_disaster','other','NA']);
  ensureBool(req.avoidance, 'av'); ensureBool(req.hyperarousal, 'hy');
  ensureBool(req.dissociative, 'di'); ensureEnum(req.treatment, 'tr', ['none','CBT','EMDR','SSRI','combination','NA']);
  ensureNum(req.therapy_sessions, 'ts'); ensureNum(req.followup_months, 'fu');
  ensureStr(req.provider, 'pr');
  return { ps_id: `ps_${Date.now()}`, patient_id: req.patient_id, pcl5: req.pcl5_score, tr: req.treatment };
}

function bipolar_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.mood_state, 'ms', ['depressed','manic','mixed','euthymic','NA']);
  ensureNum(req.young_score, 'ys'); ensureNum(req.lithium_level, 'll');
  ensureEnum(req.mood_stabilizer, 'ms2', ['lithium','valproate','lamotrigine','carbamazepine','combination','NA']);
  ensureNum(req.compliance_pct, 'co'); ensureNum(req.hospitalizations_30d, 'ho');
  ensureNum(req.followup_months, 'fu'); ensureStr(req.provider, 'pr');
  return { bf_id: `bf_${Date.now()}`, patient_id: req.patient_id, ms: req.mood_state, ys: req.young_score };
}

function schizophrenia_follow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.panss_score, 'ps');
  ensureNum(req.positive_score, 'p2'); ensureNum(req.negative_score, 'ns');
  ensureEnum(req.antipsychotic, 'ap', ['haloperidol','risperidone','olanzapine','quetiapine','aripiprazole','clozapine','NA']);
  ensureNum(req.compliance_pct, 'co'); ensureEnum(req.side_effects, 'se', ['none','EPS','weight_gain','metabolic','sedation','NA']);
  ensureNum(req.followup_months, 'fu'); ensureStr(req.provider, 'pr');
  return { sf_id: `sf_${Date.now()}`, patient_id: req.patient_id, panss: req.panss_score, ap: req.antipsychotic };
}

function funcs() { return { depression_screen, anxiety_screen, ptsd_screen, bipolar_follow, schizophrenia_follow }; }
module.exports = { funcs, ValidationError };