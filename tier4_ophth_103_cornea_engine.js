'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aao_cornea: 'AAO Preferred Practice Pattern Cornea/External Disease 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function cornealUlcer(input) {
  ensureObj(input, 'input');
  const size_mm = ensureNumber(input.size_mm, 'size_mm');
  const central = !!input.central;
  const hypopyon = !!input.hypopyon;
  const contact_lens_wearer = !!input.contact_lens_wearer;
  let therapy;
  if (central && hypopyon) { therapy = 'fortified_antibiotics_hourly_culture'; }
  else if (contact_lens_wearer) { therapy = 'fluoroquinolone_culture_ps_aeruginosa'; }
  else if (central) { therapy = 'fluoroquinolone_culture'; }
  else { therapy = 'topical_antibiotic_ointment'; }
  return { size_mm, central, hypopyon, contact_lens_wearer, therapy, citations:['aao_cornea'] };
}

function dryEye(input) {
  ensureObj(input, 'input');
  const schirmer = ensureNumber(input.schirmer, 'schirmer');
  const osmolarity = ensureNumber(input.osmolarity, 'osmolarity');
  const staining = !!input.staining;
  let severity;
  if (osmolarity >= 320 || schirmer < 5) { severity = 'severe'; }
  else if (osmolarity >= 308 || schirmer < 10) { severity = 'moderate'; }
  else { severity = 'mild'; }
  const therapy = severity === 'severe' ? 'cyclosporine_lifitegrast_punctal_plug' : severity === 'moderate' ? 'artificial_tears_cyclosporine' : 'artificial_tears_warm_compress';
  return { schirmer, osmolarity, staining, severity, therapy };
}

module.exports = { cornealUlcer, dryEye, CITATIONS, ValidationError };
