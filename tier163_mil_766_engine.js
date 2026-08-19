// filepath: tier163_mil_766_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function triage(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.category, 'ct', ['T1_immediate','T2_delayed','T3_minimal','T4_expectant','NA']);
  ensureNum(req.bp_systolic, 'bs'); ensureNum(req.hr, 'hr');
  ensureNum(req.rr, 'rr'); ensureNum(req.gcs, 'gc');
  ensureEnum(req.mechanism, 'me', ['blast','gsw','penetrating','burn','mvc','fall','other','NA']);
  ensureNum(req.iss, 'is'); ensureEnum(req.triage_tag, 'tt', ['red','yellow','green','black','NA']);
  ensureNum(req.transport_priority, 'tp'); ensureStr(req.provider, 'pr');
  return { tr_id: `tr_${Date.now()}`, patient_id: req.patient_id, category: req.category, tag: req.triage_tag };
}

function combat_casualty(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.injury_type, 'it', ['hemorrhage','amputation','burn','tbi','abdominal','other','NA']);
  ensureNum(req.time_to_care_min, 'tc'); ensureNum(req.blood_loss_ml, 'bl');
  ensureEnum(req.battle_pressure, 'bp', ['low','moderate','high','NA']);
  ensureNum(req.tourniquet_min, 'tm'); ensureBool(req.tourniquet_used, 'tu');
  ensureNum(req.blood_products_ml, 'bp'); ensureNum(req.damage_control_done, 'dc');
  ensureEnum(req.outcome, 'ot', ['alive','alive_evac','died','NA']);
  ensureStr(req.provider, 'pr');
  return { cc_id: `cc_${Date.now()}`, patient_id: req.patient_id, injury: req.injury_type, outcome: req.outcome };
}

function vaccine_mil(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.deployment_region, 'dr', ['middle_east','asia','africa','europe','americas','NA']);
  ensureEnum(req.vaccine, 'vc', ['yellow_fever','japanese_enc','typhoid','rabies','meningococcal','anthrax','smallpox','other','NA']);
  ensureNum(req.dose_number, 'dn'); ensureNum(req.doses_total, 'dt');
  ensureBool(req.contraindication, 'ci'); ensureNum(req.observation_min, 'ob');
  ensureBool(req.ae, 'ae'); ensureEnum(req.readiness, 'rd', ['full','limited','unfit','NA']);
  ensureStr(req.provider, 'pr');
  return { vm_id: `vm_${Date.now()}`, patient_id: req.patient_id, vaccine: req.vaccine, region: req.deployment_region };
}

function biodefense(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.agent, 'ag', ['anthrax','smallpox','botulism','plague','tularemia','ebola','ricin','other','NA']);
  ensureEnum(req.exposure_type, 'et', ['inhalation','cutaneous','ingestion','injection','unknown','NA']);
  ensureNum(req.exposure_level, 'el'); ensureNum(req.decontamination_min, 'dc');
  ensureBool(req.isolation, 'ip'); ensureEnum(req.prophylaxis, 'pp', ['ABX','vaccine','antiviral','antitoxin','combination','NA']);
  ensureBool(req.contact_tracing, 'ct'); ensureEnum(req.quarantine, 'qu', ['none','home','facility','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { bd_id: `bd_${Date.now()}`, patient_id: req.patient_id, agent: req.agent, exposure: req.exposure_type };
}

function fit_for_duty(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.unit_type, 'ut', ['combat','support','medical','logistics','admin','NA']);
  ensureNum(req.years_service, 'ys'); ensureEnum(req.duty_station, 'ds', ['home','deployed','training','garrison','NA']);
  ensureNum(req.fitness_pct, 'fp'); ensureNum(req.psych_clear, 'pc');
  ensureEnum(req.disposition, 'di', ['fit','fit_w_restrictions','unfit','pending','NA']);
  ensureEnum(req.discharge_type, 'dt', ['none','medical','honorable','dishonorable','NA']);
  ensureBool(req.deployment_ready, 'dr'); ensureStr(req.provider, 'pr');
  return { ff_id: `ff_${Date.now()}`, patient_id: req.patient_id, fitness: req.fitness_pct, disposition: req.disposition };
}

function funcs() { return { triage, combat_casualty, vaccine_mil, biodefense, fit_for_duty }; }
module.exports = { funcs, ValidationError };