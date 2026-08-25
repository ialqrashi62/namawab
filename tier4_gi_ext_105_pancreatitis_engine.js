'use strict';
// TIER4_GI_EXT-105: Pancreatitis severity + management
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACG_Pancreatitis_2016', 'IAP_APA_APG_2018'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function severity(req) {
  ensureStr(req.type, 'type'); // acute | recurrent | chronic
  ensureNumber(req.bisap, 'bisap');
  ensureBool(req.organ_failure, 'organ_failure');
  ensureBool(req.local_complication, 'local_complication');
  ensureBool(req.sirs, 'sirs');
  ensureNumber(req.hct, 'hct');

  const severe = req.organ_failure && req.local_complication || req.bisap >= 3;
  const moderately_severe = req.organ_failure || req.local_complication;
  return {
    type: req.type,
    bisap: req.bisap,
    severe,
    moderately_severe,
    mild: !severe && !moderately_severe,
    management: severe ? 'icu_care_aggressive_fluid_necrosectomy_evaluation' :
      moderately_severe ? 'intermediate_care_fluid_analgesia_monitor_organs' :
        'ward_fluid_analgesia_early_feeding',
    citations: CITATIONS,
  };
}

function manage(req) {
  ensureStr(req.cause, 'cause'); // gallstone | alcohol | hypertriglyceridemia | idiopathic | drug | post_ercp | autoimmune
  ensureBool(req.gallstone_evidenced, 'gallstone_evidenced');
  ensureNumber(req.triglycerides, 'triglycerides');
  ensureNumber(req.alt, 'alt');
  ensureBool(req.drg_dilation, 'drg_dilation');
  ensureBool(req.early_feeding, 'early_feeding');

  let definitive;
  if (req.cause === 'gallstone' && req.gallstone_evidenced) definitive = 'ercp_with_sphincterotomy_then_cholecystectomy_same_admission';
  else if (req.cause === 'hypertriglyceridemia' && req.triglycerides > 1000) definitive = 'insulin_infusions_or_plasmapheresis_then_fibrates';
  else if (req.cause === 'alcohol') definitive = 'alcohol_cessation_counsel_thiamine_folate';
  else if (req.cause === 'post_ercp') definitive = 'conservative_management';
  else definitive = 'investigate_other_causes_mri_mrcp_eus';
  const supportive = req.early_feeding ? 'oral_feeding_if_tolerated' : 'npo_then_low_fat_diet';
  return {
    cause: req.cause,
    definitive_treatment: definitive,
    supportive_care: supportive,
    followup: 'ct_q48_72h_if_not_improving',
    citations: CITATIONS,
  };
}

module.exports = { severity, manage, CITATIONS, ValidationError };