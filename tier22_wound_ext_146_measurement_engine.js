// filepath: tier22_wound_ext_146_measurement_engine.js
// TIER22_WOUND_EXT-146: Wound measurement (length, width, depth, tunneling)
'use strict';

const CITATIONS = ['NPUAP_2024','WUWHS_2024'];

class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function wound_measure(req) {
  ensureStr(req.measurement_id, 'measurement_id');
  ensureStr(req.wound_id, 'wound_id');
  ensureNumber(req.length_cm, 'length_cm');
  ensureNumber(req.width_cm, 'width_cm');
  ensureNumber(req.depth_cm, 'depth_cm');
  ensureBool(req.head_to_head_method, 'head_to_head');
  ensureBool(req.photo_documented, 'photo');
  ensureEnum(req.measurement_position, 'measurement_position', ['supine','prone','lateral_left','lateral_right','sitting','standing','other']);

  let status;
  if (!req.head_to_head_method) status = 'head_to_head_method_required';
  else if (!req.photo_documented) status = 'photo_documentation_recommended';
  else if (req.length_cm === 0 && req.width_cm === 0 && req.depth_cm === 0) status = 'zero_dimensions_review';
  else status = 'measurement_documented';
  return { status, area: Math.round(req.length_cm * req.width_cm * 10) / 10 };
}

function wound_area_change(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureNumber(req.area_current, 'area_current');
  ensureNumber(req.area_previous, 'area_previous');
  ensureNumber(req.days_between, 'days_between');
  ensureEnum(req.trend, 'trend', ['healing','stable','worsening','insufficient_data','other']);
  ensureNumber(req.healing_pct, 'healing_pct');

  let status;
  if (req.days_between < 7) status = 'under_7d_review_reassess';
  else if (req.healing_pct >= 30) status = 'over_30pct_healing_at_30d_good_prognosis';
  else if (req.trend === 'worsening') status = 'worsening_review_treatment';
  else if (req.trend === 'healing') status = 'healing_continue_plan';
  else if (req.trend === 'stable') status = 'stable_review_intervention';
  else status = 'area_trend_documented';
  return { status, change: req.area_current - req.area_previous };
}

function wound_tunnel(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureNumber(req.tunnel_count, 'tunnel_count');
  ensureNumber(req.tunnel_max_depth_cm, 'max_depth_cm');
  ensureNumber(req.undermining_pct, 'undermining_pct');
  ensureEnum(req.direction, 'direction', ['none','clock_12','clock_3','clock_6','clock_9','multiple','unknown','other']);
  ensureBool(req.explored_with_cotton, 'explored');

  let status;
  if (req.tunnel_count === 0) status = 'no_tunneling';
  else if (!req.explored) status = 'tunnel_must_be_explored_with_cotton_swab';
  else if (req.tunnel_max_depth_cm > 3) status = 'tunnel_over_3cm_deep_advanced_wound_care';
  else if (req.undermining_pct > 30) status = 'undermining_over_30pct_complex_wound';
  else status = 'tunneling_documented';
  return { status, count: req.tunnel_count };
}

function wound_granulation(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureEnum(req.granulation_pct, 'granulation_pct', ['under_25','25_to_49','50_to_74','75_to_100','none','not_applicable','other']);
  ensureEnum(req.epithelialization_pct, 'epithelialization_pct', ['none','under_25','25_to_49','50_to_74','75_to_100','complete','other']);
  ensureBool(req.healthy_red_beefy, 'healthy_appearance');
  ensureBool(req.fragile_bleeds_easily, 'fragile_bleeding');

  let status;
  if (req.fragile_bleeding) status = 'fragile_bleeding_cautious_care_review';
  else if (req.granulation_pct === 'under_25' && req.epithelialization_pct === 'none') status = 'minimal_granulation_review_bioburden';
  else if (req.granulation_pct === '75_to_100' && req.healthy_red_beefy) status = 'healthy_granulation_ready_for_epithelialization';
  else status = 'granulation_documented';
  return { status, gran: req.granulation_pct };
}

function wound_exudate(req) {
  ensureStr(req.wound_id, 'wound_id');
  ensureEnum(req.exudate_amount, 'exudate_amount', ['none','scant','small','moderate','large','copious','other']);
  ensureEnum(req.exudate_type, 'exudate_type', ['serous','sanguineous','serosanguineous','purulent','seropurulent','hemopurulent','none','other']);
  ensureBool(req.odor_present, 'odor');
  ensureBool(req.dressing_saturated, 'dressing_saturated');
  ensureNumber(req.dressing_change_frequency_h, 'dressing_change_frequency');

  let status;
  if (req.exudate_type === 'purulent' && req.odor) status = 'purulent_with_odor_infection_culture';
  else if (req.exudate_amount === 'copious' && req.dressing_change_frequency_h < 24) status = 'copious_frequent_dressing_change_overwhelmed';
  else if (req.exudate_type === 'purulent') status = 'purulent_exudate_review_infection';
  else status = 'exudate_documented';
  return { status, type: req.exudate_type };
}

function funcs() { return { wound_measure, wound_area_change, wound_tunnel, wound_granulation, wound_exudate }; }
module.exports = { funcs, CITATIONS, ValidationError };