// filepath: tier133_pop_680_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cohort_builder(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.cohort_name, 'cn');
  ensureStr(req.criteria, 'crit');
  ensureNum(req.age_min, 'amin');
  ensureNum(req.age_max, 'amax');
  ensureNum(req.size, 'sz');
  return { cohort_id: `cohort_${Date.now()}`, name: req.cohort_name, criteria: req.criteria, age_range: { min: req.age_min, max: req.age_max }, size: req.size };
}
function risk_stratifier(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.risk_score, 'rs');
  ensureEnum(req.risk_tier, 'rt', ['low','moderate','high','very_high']);
  ensureStr(req.factors, 'fct');
  return { patient_id: req.patient_id, tier: req.risk_tier, score: req.risk_score, factors: req.factors };
}
function outreach_campaign(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.campaign_name, 'cn');
  ensureNum(req.target_count, 'tc');
  ensureEnum(req.channel, 'ch', ['sms','email','phone','mail']);
  ensureEnum(req.status, 'st', ['draft','active','paused','completed']);
  return { campaign_id: `camp_${Date.now()}`, name: req.campaign_name, target: req.target_count, channel: req.channel, status: req.status };
}
function social_determinants(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.domain, 'dm', ['housing','food','transport','employment','education','safety']);
  ensureEnum(req.need_level, 'nl', ['none','mild','moderate','severe']);
  ensureStr(req.notes, 'nt');
  return { patient_id: req.patient_id, sdoh_domain: req.domain, level: req.need_level, notes: req.notes };
}
function health_equity(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.metric_name, 'mn');
  ensureNum(req.disparity_score, 'ds');
  ensureStr(req.population, 'pop');
  ensureStr(req.recommendation, 'rec');
  return { metric: req.metric_name, disparity: req.disparity_score, population: req.population, recommendation: req.recommendation };
}

function funcs() { return { cohort_builder, risk_stratifier, outreach_campaign, social_determinants, health_equity }; }
module.exports = { funcs, ValidationError };
