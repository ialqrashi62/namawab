'use strict';
// TIER4_HEMONC_EXT-104: MGUS + Myeloma diagnosis + staging
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['IMWG_Myeloma_2014', 'IMWG_MGUS_2010', 'Mayo_Mgus_2018'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}

function mgus(req) {
  ensureNumber(req.m_protein_g_dl, 'm_protein_g_dl');
  ensureNumber(req.kappa_lambda_ratio, 'kappa_lambda_ratio');
  ensureBool(req.bone_marrow_plasma_cells_above_10, 'bone_marrow_plasma_cells_above_10');
  ensureBool(req.end_organ_damage, 'end_organ_damage');

  const mgus = req.m_protein_g_dl < 3 && !req.bone_marrow_plasma_cells_above_10 && !req.end_organ_damage;
  const smoldering = req.m_protein_g_dl >= 3 && !req.bone_marrow_plasma_cells_above_10 && !req.end_organ_damage ||
    req.m_protein_g_dl >= 3 && req.bone_marrow_plasma_cells_above_10 && !req.end_organ_damage;
  const myeloma = req.bone_marrow_plasma_cells_above_10 && req.end_organ_damage || req.kappa_lambda_ratio >= 100 || req.kappa_lambda_ratio <= 0.01;
  return {
    diagnosis: mgus ? 'mgus' : smoldering ? 'smoldering_myeloma' : myeloma ? 'multiple_myeloma' : 'undetermined',
    m_protein_g_dl: req.m_protein_g_dl,
    kappa_lambda_ratio: req.kappa_lambda_ratio,
    end_organ_damage: req.end_organ_damage,
    monitoring: mgus ? 'serum_protein_electrophoresis_q6_months_x_1_year_then_annually' :
      smoldering ? 'q3_to_6_months_for_2_years_then_q6_to_12_months' : 'refer_hematology_staging_imaging',
    citations: CITATIONS,
  };
}

function myeloma(req) {
  ensureNumber(req.beta_2_microglobulin, 'beta_2_microglobulin');
  ensureNumber(req.albumin, 'albumin');
  ensureNumber(req.ldh, 'ldh');
  ensureNumber(req.creatinine, 'creatinine');
  ensureNumber(req.hgb, 'hgb');
  ensureNumber(req.calcium, 'calcium');
  ensureBool(req.bone_lesions, 'bone_lesions');

  const iss = (req.beta_2_microglobulin >= 5.5 ? 3 : req.beta_2_microglobulin >= 3.5 ? 2 : 1) + (req.albumin < 3.5 ? 1 : 0);
  const r_iss = iss + (req.ldh > 1 ? 1 : 0);
  const crab = (req.creatinine >= 2 ? 1 : 0) + (req.hgb < 10 ? 1 : 0) + (req.calcium > 11 ? 1 : 0) + (req.bone_lesions ? 1 : 0);
  return {
    stage: iss >= 3 ? 'stage_3' : iss === 2 ? 'stage_2' : 'stage_1',
    r_iss,
    crab_count: crab,
    induction: 'triplet_vrd_bortezomib_lenalidomide_dexamethasone',
    transplant_eligible: r_iss < 3,
    maintenance: 'lenalidomide_if_response',
    citations: CITATIONS,
  };
}

module.exports = { mgus, myeloma, CITATIONS, ValidationError };