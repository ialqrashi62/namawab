// filepath: tier50_cardiology_ext_284_card_arr_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function atrial_fibrillation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.rhythm, 'rh', ['afib_rvr','afib_controlled','afib_with_rvr','paroxysmal_afib','persistent_afib','long_standing_afib']);
  ensureNum(req.ventricular_rate, 'vr');
  ensureNum(req.chads_vasc, 'cv');
  ensureNum(req.has_bled, 'hb');
  ensureStr(req.anticoagulation, 'ac');
  ensureStr(req.rate_control, 'rc');
  ensureStr(req.rhythm_control, 'rhyc');
  return { rhythm: req.rhythm, chads_vasc: req.chads_vasc };
}
function supraventricular_tachy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['avnrt','avrt','atrial_tachycardia','junctional','mat','sinus_tachy']);
  ensureNum(req.rate, 'rate');
  ensureEnum(req.hemodynamic, 'hd', ['stable','unstable']);
  ensureStr(req.intervention, 'int');
  ensureEnum(req.response, 'resp', ['converted_to_sinus','persisted','partial_response']);
  ensureEnum(req.follow_up, 'fu', ['observation','medication','ep_study_consideration','ablation_planned']);
  return { type: req.type, rate: req.rate };
}
function ventricular_tachycardia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['monomorphic_sustained','polymorphic','nonsustained','torsades','idiopathic']);
  ensureNum(req.rate, 'rate');
  ensureEnum(req.hemodynamic, 'hd', ['stable','unstable','pulseless']);
  ensureStr(req.intervention, 'int');
  ensureBool(req.success, 'succ');
  ensureStr(req.follow_up, 'fu');
  return { type: req.type };
}
function bradycardia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['sinus_bradycardia','first_degree_av','mobitz_1','mobitz_2','complete_av_block','sick_sinus']);
  ensureNum(req.rate, 'rate');
  ensureStr(req.symptom, 'sx');
  ensureStr(req.pacemaker_type, 'pmt');
  ensureBool(req.implant_success, 'is');
  return { type: req.type, rate: req.rate };
}
function channelopathies(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.condition, 'cond', ['long_qt_syndrome','short_qt_syndrome','brugada','catecholaminergic_polymorphic_vt','early_repolarization']);
  ensureNum(req.qtc_ms, 'qtc');
  ensureStr(req.trigger, 'trig');
  ensureStr(req.genetic_test, 'gt');
  ensureStr(req.beta_blocker_therapy, 'bb');
  ensureStr(req.activity_restrictions, 'ar');
  return { condition: req.condition, qtc: req.qtc_ms };
}

function funcs() { return { atrial_fibrillation, supraventricular_tachy, ventricular_tachycardia, bradycardia, channelopathies }; }
module.exports = { funcs, ValidationError };