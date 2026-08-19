// filepath: tier133_epi_682_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function incidence_rate(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.condition, 'c');
  ensureNum(req.new_cases, 'nc');
  ensureNum(req.population, 'pop');
  ensureStr(req.period, 'p');
  const rate = (req.new_cases / req.population) * 100000;
  return { condition: req.condition, new_cases: req.new_cases, population: req.population, rate_per_100k: rate, period: req.period };
}
function prevalence_study(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.condition, 'c');
  ensureNum(req.existing_cases, 'ec');
  ensureNum(req.population, 'pop');
  ensureStr(req.period, 'p');
  const rate = (req.existing_cases / req.population) * 100;
  return { condition: req.condition, existing_cases: req.existing_cases, population: req.population, rate_pct: rate, period: req.period };
}
function outbreak_analysis(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.outbreak_id, 'ob');
  ensureNum(req.attack_rate, 'ar');
  ensureNum(req.r0, 'r0');
  ensureEnum(req.trend, 'tr', ['increasing','stable','decreasing','resolved']);
  return { outbreak_id: req.outbreak_id, attack_rate: req.attack_rate, r0: req.r0, trend: req.trend };
}
function risk_factor(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.outcome, 'o');
  ensureStr(req.exposure, 'e');
  ensureNum(req.odds_ratio, 'or');
  ensureNum(req.ci_lower, 'cl');
  ensureNum(req.ci_upper, 'cu');
  return { outcome: req.outcome, exposure: req.exposure, or: req.odds_ratio, ci: [req.ci_lower, req.ci_upper] };
}
function mortality_stats(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.cause, 'c');
  ensureNum(req.deaths, 'd');
  ensureNum(req.population, 'pop');
  ensureStr(req.age_group, 'ag');
  const rate = (req.deaths / req.population) * 100000;
  return { cause: req.cause, deaths: req.deaths, population: req.population, rate_per_100k: rate, age_group: req.age_group };
}

function funcs() { return { incidence_rate, prevalence_study, outbreak_analysis, risk_factor, mortality_stats }; }
module.exports = { funcs, ValidationError };
