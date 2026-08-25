// filepath: tier141_hec_675_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cost_qaly(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.intervention_id, 'ii');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.qaly_gained, 'qg');
  ensureNum(req.cost, 'ct');
  ensureEnum(req.timeframe, 'tf', ['1y','5y','10y','lifetime']);
  ensureNum(req.cost_per_qaly, 'cq');
  ensureEnum(req.cost_effective, 'ce', ['dominates','highly_cost_effective','cost_effective','borderline','not_cost_effective','dominated','unknown']);
  ensureStr(req.provider, 'pr');
  return { cq_id: `cq_${Date.now()}`, intervention_id: req.intervention_id, qaly_gained: req.qaly_gained, cost_per_qaly: req.cost_per_qaly };
}
function budget_impact(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.scenario_id, 'si');
  ensureStr(req.scenario_name, 'sn');
  ensureNum(req.year1_cost, 'y1');
  ensureNum(req.year5_cost, 'y5');
  ensureNum(req.population_affected, 'pa');
  ensureNum(req.cost_per_member, 'cm');
  ensureStr(req.cost_savings, 'cs');
  ensureStr(req.provider, 'pr');
  return { bi_id: `bi_${Date.now()}`, scenario_id: req.scenario_id, cost_per_member: req.cost_per_member, year5: req.year5_cost };
}
function value_based(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.program_id, 'pi');
  ensureEnum(req.program_type, 'pt', ['bundle','capitation','shared_savings','pay_for_performance','capitated_global','episodes_of_care','other']);
  ensureNum(req.spend, 'sp');
  ensureNum(req.quality_score, 'qs');
  ensureNum(req.outcome_score, 'os');
  ensureNum(req.efficiency, 'ef');
  ensureNum(req.shared_savings, 'ss');
  ensureStr(req.provider, 'pr');
  return { vb_id: `vb_${Date.now()}`, program_id: req.program_id, type: req.program_type, efficiency: req.efficiency };
}
function payor_mix(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.period, 'pp');
  ensureNum(req.total_volume, 'tv');
  ensureNum(req.tier1_pct, 't1');
  ensureNum(req.medicare_pct, 'mr');
  ensureNum(req.medicaid_pct, 'md');
  ensureNum(req.commercial_pct, 'cm');
  ensureNum(req.self_pay_pct, 'sp');
  ensureNum(req.collected_pct, 'cp');
  ensureStr(req.provider, 'pr');
  return { pm_id: `pm_${Date.now()}`, period: req.period, tier1_pct: req.tier1_pct, medicare_pct: req.medicare_pct };
}
function price_transparency(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.cpt_code, 'cc');
  ensureNum(req.negotiated_rate, 'nr');
  ensureNum(req.cash_rate, 'cr');
  ensureNum(req.min_rate, 'mn');
  ensureNum(req.max_rate, 'mx');
  ensureStr(req.payor_id, 'pi');
  ensureBool(req.compliant, 'cp');
  ensureStr(req.provider, 'pr');
  return { pr_id: `pr_${Date.now()}`, cpt_code: req.cpt_code, negotiated_rate: req.negotiated_rate, compliant: req.compliant };
}

function funcs() { return { cost_qaly, budget_impact, value_based, payor_mix, price_transparency }; }
module.exports = { funcs, ValidationError };
