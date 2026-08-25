'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = {
  who2016: 'World Health Organization. Classification of Tumours of Haematopoietic and Lymphoid Tissues 2016',
  ascp: 'American Society for Clinical Pathology. CBC Interpretation Guidelines 2019'
};
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function cbcInterpretation(input) {
  ensureObj(input, 'input');
  const hgb = ensureNumber(input.hgb, 'hgb');
  const wbc = ensureNumber(input.wbc, 'wbc');
  const platelet = ensureNumber(input.platelet, 'platelet');
  const mcv = ensureNumber(input.mcv, 'mcv');
  const neutrophil = ensureNumber(input.neutrophil, 'neutrophil');
  const interpretation = [];
  if (hgb < 12) { interpretation.push('anemia'); }
  if (wbc > 11) { interpretation.push('leukocytosis'); }
  else if (wbc < 4) { interpretation.push('leukopenia'); }
  if (platelet < 150) { interpretation.push('thrombocytopenia'); }
  else if (platelet > 450) { interpretation.push('thrombocytosis'); }
  if (mcv < 80) { interpretation.push('microcytic'); }
  else if (mcv > 100) { interpretation.push('macrocytic'); }
  if (neutrophil < 1.5) { interpretation.push('neutropenia'); }
  let pancytopenia = (hgb < 12 && wbc < 4 && platelet < 150) ? 'pancytopenia_refer_bma' : 'no_pancytopenia';
  return { hgb, wbc, platelet, mcv, neutrophil, interpretation, pancytopenia, citations:['ascp'] };
}

function peripheralSmear(input) {
  ensureObj(input, 'input');
  const smear_features = input.features || '';
  const schistocytes = !!input.schistocytes;
  const blasts = !!input.blasts;
  const atypical_lymphocytes = !!input.atypical_lymphocytes;
  const target_cells = !!input.target_cells;
  const impression = [];
  if (schistocytes) { impression.push('schistocytes_microangiopathic'); }
  if (blasts) { impression.push('blasts_refer_immuno'); }
  if (atypical_lymphocytes) { impression.push('atypical_lymphocytes_viral'); }
  if (target_cells) { impression.push('target_cells_liver_hemoglobinopathy'); }
  return { smear_features, schistocytes, blasts, atypical_lymphocytes, target_cells, impression };
}

module.exports = { cbcInterpretation, peripheralSmear, CITATIONS, ValidationError };
