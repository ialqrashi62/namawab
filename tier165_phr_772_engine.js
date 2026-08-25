// filepath: tier165_phr_772_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cyp_metabolizer(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.gene, 'ge', ['CYP2D6','CYP2C19','CYP2C9','CYP3A4','CYP3A5','TPMT','NUDT15','SLCO1B1','VKORC1','NA']);
  ensureEnum(req.metabolizer, 'mt', ['ultra_rapid','rapid','normal','intermediate','poor','NA']);
  ensureEnum(req.clinical_significance, 'cs', ['high','moderate','low','none','NA']);
  ensureStr(req.allele, 'al'); ensureStr(req.drug, 'dr');
  ensureEnum(req.action, 'ac', ['no_action','reduce','increase','alternate','monitor','NA']);
  ensureStr(req.provider, 'pr');
  return { cm_id: `cm_${Date.now()}`, patient_id: req.patient_id, gene: req.gene, met: req.metabolizer };
}

function drug_response(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureStr(req.drug, 'dr');
  ensureStr(req.gene, 'ge'); ensureStr(req.variant, 'vr');
  ensureEnum(req.expected_response, 'er', ['increased','decreased','normal','none','NA']);
  ensureNum(req.dose_adjustment_pct, 'da'); ensureEnum(req.monitoring, 'mn', ['none','baseline','frequent','continuous','NA']);
  ensureEnum(req.outcome, 'ot', ['responds','partial','no_response','NA']);
  ensureStr(req.provider, 'pr');
  return { dr_id: `dr_${Date.now()}`, patient_id: req.patient_id, drug: req.drug, response: req.expected_response };
}

function dose_adjust(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.standard_dose_mg, 'sd');
  ensureNum(req.adjusted_dose_mg, 'ad'); ensureStr(req.gene, 'ge');
  ensureEnum(req.metabolizer, 'mt', ['ultra_rapid','rapid','normal','intermediate','poor','NA']);
  ensureStr(req.drug, 'dr'); ensureStr(req.rationale, 'ra');
  ensureEnum(req.result, 'rs', ['appropriate','under','over','NA']);
  ensureStr(req.provider, 'pr');
  return { da_id: `da_${Date.now()}`, patient_id: req.patient_id, adj: req.adjusted_dose_mg, original: req.standard_dose_mg };
}

function adverse_risk(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureStr(req.drug, 'dr');
  ensureStr(req.gene, 'ge'); ensureStr(req.variant, 'vr');
  ensureNum(req.risk_score, 'rs'); ensureEnum(req.risk_category, 'rc', ['low','moderate','high','very_high','NA']);
  ensureEnum(req.monitoring, 'mn', ['none','baseline','frequent','continuous','NA']);
  ensureEnum(req.outcome, 'ot', ['safe','precaution','avoid','NA']);
  ensureStr(req.provider, 'pr');
  return { ar_id: `ar_${Date.now()}`, patient_id: req.patient_id, drug: req.drug, risk: req.risk_category };
}

function regimen_select(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureStr(req.primary_drug, 'pd');
  ensureStr(req.alternative_drug, 'ad'); ensureStr(req.gene, 'ge');
  ensureEnum(req.metabolizer, 'mt', ['ultra_rapid','rapid','normal','intermediate','poor','NA']);
  ensureNum(req.score, 'sc'); ensureStr(req.rationale, 'ra');
  ensureEnum(req.recommendation, 'rc', ['no_change','switch','dose_adjust','monitor','NA']);
  ensureStr(req.provider, 'pr');
  return { rs_id: `rs_${Date.now()}`, patient_id: req.patient_id, primary: req.primary_drug, alt: req.alternative_drug };
}

function funcs() { return { cyp_metabolizer, drug_response, dose_adjust, adverse_risk, regimen_select }; }
module.exports = { funcs, ValidationError };