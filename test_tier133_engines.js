'use strict';
const path = require('path');
const Tier133Pop = require('./tier133_pop_680_engine.js');
const Tier133Php = require('./tier133_php_681_engine.js');
const Tier133Epi = require('./tier133_epi_682_engine.js');
const Tier133Vax = require('./tier133_vax_683_engine.js');

const tests = [
  { engine: 'pop_680', fn: 'cohort_builder', body: { tenant_id: 't1', cohort_name: 'CHF over 65', criteria: 'age>65 AND dx=CHF', age_min: 65, age_max: 99, size: 1200 } },
  { engine: 'pop_680', fn: 'risk_stratifier', body: { tenant_id: 't1', patient_id: 'P1', risk_score: 8.2, risk_tier: 'high', factors: 'CHF,DM2,CKD' } },
  { engine: 'pop_680', fn: 'outreach_campaign', body: { tenant_id: 't1', campaign_name: 'Flu reminders', target_count: 5000, channel: 'sms', status: 'active' } },
  { engine: 'pop_680', fn: 'social_determinants', body: { tenant_id: 't1', patient_id: 'P2', domain: 'housing', need_level: 'severe', notes: 'Facing eviction' } },
  { engine: 'pop_680', fn: 'health_equity', body: { tenant_id: 't1', metric_name: 'Maternal mortality disparity', disparity_score: 3.4, population: 'Black women', recommendation: 'Increase prenatal access' } },
  { engine: 'php_681', fn: 'disease_surveillance', body: { tenant_id: 't1', disease: 'Influenza', case_count: 142, region: 'Region A', severity: 'elevated' } },
  { engine: 'php_681', fn: 'immunization_registry', body: { tenant_id: 't1', vaccine: 'MMR', doses_given: 3200, coverage_pct: 91.5, age_group: '5-12' } },
  { engine: 'php_681', fn: 'outbreak_investigation', body: { tenant_id: 't1', outbreak_id: 'OB-2026-04', pathogen: 'Salmonella', cases: 48, status: 'confirmed' } },
  { engine: 'php_681', fn: 'environmental_health', body: { tenant_id: 't1', site: 'Well #3', hazard: 'water', reading: 4.5, compliance: 'pass' } },
  { engine: 'php_681', fn: 'health_promotion', body: { tenant_id: 't1', program: 'Smoking cessation', participants: 280, outcome: 'reduced smoking', effectiveness: 67.5 } },
  { engine: 'epi_682', fn: 'incidence_rate', body: { tenant_id: 't1', condition: 'TB', new_cases: 12, population: 100000, period: '2026-Q1' } },
  { engine: 'epi_682', fn: 'prevalence_study', body: { tenant_id: 't1', condition: 'Diabetes', existing_cases: 9500, population: 100000, period: '2026-Q1' } },
  { engine: 'epi_682', fn: 'outbreak_analysis', body: { tenant_id: 't1', outbreak_id: 'OB-2026-04', attack_rate: 4.8, r0: 1.4, trend: 'decreasing' } },
  { engine: 'epi_682', fn: 'risk_factor', body: { tenant_id: 't1', outcome: 'Lung cancer', exposure: 'Smoking', odds_ratio: 15.2, ci_lower: 12.1, ci_upper: 19.1 } },
  { engine: 'epi_682', fn: 'mortality_stats', body: { tenant_id: 't1', cause: 'CVD', deaths: 240, population: 100000, age_group: '65+' } },
  { engine: 'vax_683', fn: 'vaccine_admin', body: { tenant_id: 't1', patient_id: 'P3', vaccine: 'COVID-19', dose_number: 2, lot: 'L2026A', site: 'LA' } },
  { engine: 'vax_683', fn: 'schedule_recommend', body: { tenant_id: 't1', patient_id: 'P4', recommended_vaccine: 'HPV', due_date: '2026-09-15', priority: 'routine' } },
  { engine: 'vax_683', fn: 'adverse_event', body: { tenant_id: 't1', admin_id: 'A1', event: 'Anaphylaxis', severity: 'severe', outcome: 'recovered' } },
  { engine: 'vax_683', fn: 'contraindication', body: { tenant_id: 't1', patient_id: 'P5', vaccine: 'MMR', type: 'allergy', reason: 'Egg allergy' } },
  { engine: 'vax_683', fn: 'coverage_report', body: { tenant_id: 't1', vaccine: 'Influenza', target_population: 50000, vaccinated: 38500, period: '2026' } }
];

(async () => {
  let pass = 0, fail = 0;
  const engines = {
    'pop_680': Tier133Pop.funcs(),
    'php_681': Tier133Php.funcs(),
    'epi_682': Tier133Epi.funcs(),
    'vax_683': Tier133Vax.funcs()
  };
  for (const t of tests) {
    try {
      const res = engines[t.engine][t.fn](t.body);
      if (res && typeof res === 'object') { console.log('PASS ' + t.engine + '.' + t.fn); pass++; }
      else { console.log('FAIL ' + t.engine + '.' + t.fn, res); fail++; }
    } catch (e) {
      console.log('FAIL ' + t.engine + '.' + t.fn + ' - ' + e.message);
      fail++;
    }
  }
  console.log('Engine self-test: PASS=' + pass + ' FAIL=' + fail);
  process.exit(fail > 0 ? 1 : 0);
})();
