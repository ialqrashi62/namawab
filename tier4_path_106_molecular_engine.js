'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = {
  nccn: 'National Comprehensive Cancer Network. Molecular Testing Guidelines 2020',
  cap: 'College of American Pathologists. Molecular Pathology Standards 2018'
};
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function egfrMolecular(input) {
  ensureObj(input, 'input');
  const tumor_type = ensureEnum(input.tumor_type, ['lung_adenocarcinoma','colon_cancer','breast_cancer','glioma','melanoma','crc_msi_high'], 'tumor_type');
  const mutation = ensureEnum(input.mutation, ['egfr_l858r','egfr_t790m','egfr_exon19del','kras_g12c','braf_v600e','alk_fusion','ros1_fusion','her2_amplified','pd_l1_tps'], 'mutation');
  const tumor_pct = ensureNumber(input.tumor_pct, 'tumor_pct');
  const matched_therapy = {
    egfr_l858r: 'osimertinib_first_line',
    egfr_t790m: 'osimertinib_resistance',
    egfr_exon19del: 'osimertinib_first_line',
    kras_g12c: 'sotorasib_adagrasib',
    braf_v600e: 'dabrafenib_trametinib',
    alk_fusion: 'alectinib_lorlatinib',
    ros1_fusion: 'crizotinib_entrectinib',
    her2_amplified: 'trastuzumab_deruxtecan',
    pd_l1_tps: 'pembrolizumab_monotherapy_or_chemo'
  };
  const eligible = tumor_pct >= 20 ? 'sufficient_tissue' : 'insufficient_consider_rebiopsy';
  const therapy = matched_therapy[mutation];
  return { tumor_type, mutation, tumor_pct, eligible, therapy, citations:['nccn','cap'] };
}

function msiKrasBraf(input) {
  ensureObj(input, 'input');
  const msi_status = ensureEnum(input.msi_status, ['msi_high','msi_low','mss','unknown'], 'msi_status');
  const kras = ensureEnum(input.kras, ['wild_type','mutant','unknown'], 'kras');
  const braf = ensureEnum(input.braf, ['wild_type','v600e','other_mutant','unknown'], 'braf');
  const side = ensureEnum(input.side, ['right','left','rectum','unknown'], 'side');
  let first_line;
  if (msi_status === 'msi_high') { first_line = 'immunotherapy_pembrolizumab'; }
  else if (side === 'right') { first_line = 'FOLOXIRI_bevacizumab'; }
  else if (kras === 'wild_type') { first_line = 'FOLFOX_cetuximab'; }
  else { first_line = 'FOLFOX_bevacizumab'; }
  return { msi_status, kras, braf, side, first_line, citations:['nccn'] };
}

module.exports = { egfrMolecular, msiKrasBraf, CITATIONS, ValidationError };
