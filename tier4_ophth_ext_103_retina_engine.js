'use strict';
// TIER4_OPHTH_EXT-103: Retina - DM retinopathy, AMD, RD
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAO_Diabetic_Retinopathy_2019', 'AAO_AMD_2019', 'AAO_RD_2020'];

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

function dr(req) {
  ensureBool(req.microaneurysms, 'microaneurysms');
  ensureBool(req.hemorrhages, 'hemorrhages');
  ensureBool(req.hard_exudates, 'hard_exudates');
  ensureBool(req.cotton_wool_spots, 'cotton_wool_spots');
  ensureBool(req.venous_beading, 'venous_beading');
  ensureBool(req.irmas, 'irmas');
  ensureBool(req.neovascularization_disc, 'neovascularization_disc');
  ensureBool(req.neovascularization_elsewhere, 'neovascularization_elsewhere');
  ensureBool(req.vitreous_bleeding, 'vitreous_bleeding');
  ensureBool(req.diabetic_macular_edema, 'diabetic_macular_edema');

  let stage = 'no_dr';
  if (req.neovascularization_disc || req.neovascularization_elsewhere || req.vitreous_bleeding) stage = 'proliferative_dr';
  else if (req.venous_beading || req.irmas) stage = 'severe_npdr';
  else if (req.hemorrhages && (req.cotton_wool_spots || req.hard_exudates)) stage = 'moderate_npdr';
  else if (req.microaneurysms) stage = 'mild_npdr';
  const treatment = stage === 'proliferative_dr' ? 'panretinal_photocoagulation_or_anti_vegf' :
    req.diabetic_macular_edema ? 'anti_vegf_injections' :
      stage === 'severe_npdr' ? 'observe_q3_months_or_early_laser' :
        'observe_annually';
  return {
    stage,
    diabetic_macular_edema: req.diabetic_macular_edema,
    treatment,
    monitoring: stage === 'proliferative_dr' ? 'monthly' : stage === 'severe_npdr' ? 'q3_months' : 'q6_12_months',
    citations: CITATIONS,
  };
}

function amd(req) {
  ensureNumber(req.age, 'age');
  ensureBool(req.metamorphopsia, 'metamorphopsia');
  ensureBool(req.drusen, 'drusen');
  ensureBool(req.cnv, 'cnv');
  ensureNumber(req.bcva, 'bcva');

  let classification = 'no_amd';
  if (req.cnv) classification = 'wet_amd';
  else if (req.drusen) classification = 'dry_amd_intermediate';
  return {
    classification,
    metamorphopsia: req.metamorphopsia,
    treatment: classification === 'wet_amd' ? 'intravitreal_anti_vegf_lucentis_or_eylea_or_eyliahu' :
      classification === 'dry_amd_intermediate' ? 'areds2_supplementation_q6_months_oct' :
        'observe_age_appropriate_screening',
    monitoring: classification === 'wet_amd' ? 'q4_8_weeks_with_treat_and_extend' : 'q6_12_months',
    citations: CITATIONS,
  };
}

function retinal_detachment(req) {
  ensureBool(req.flashers, 'flashers');
  ensureBool(req.floaters, 'floaters');
  ensureBool(req.curtain, 'curtain');
  ensureBool(req.tear_identified, 'tear_identified');
  ensureBool(req.macula_off, 'macula_off');

  const emergency = req.curtain || req.flashers && req.floaters;
  return {
    symptoms: { flashers: req.flashers, floaters: req.floaters, curtain: req.curtain },
    retinal_detachment_suspected: emergency,
    macula_off: req.macula_off,
    urgent_referral: emergency,
    procedure: req.macula_off ? 'urgent_vitrectomy_or_scleral_buckle' :
      req.tear_identified ? 'laser_retinopexy_within_24h' :
        'urgent_dilated_exam_with_retinal_specialist',
    citations: CITATIONS,
  };
}

module.exports = { dr, amd, retinal_detachment, CITATIONS, ValidationError };