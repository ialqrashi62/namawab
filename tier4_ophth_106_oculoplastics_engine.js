'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { bops: 'British Oculoplastic Surgery Society 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function ptosis(input) {
  ensureObj(input, 'input');
  const mr_distance = ensureNumber(input.mr_distance, 'mr_distance');
  const levator_function = ensureNumber(input.levator_function, 'levator_function');
  const pupillary_involvement = !!input.pupillary_involvement;
  const onset = ensureEnum(input.onset, ['congenital','acquired','acute','chronic'], 'onset');
  let surgery_indications;
  if (pupillary_involvement) { surgery_indications = 'urgent_aneurysm_workup_cta'; }
  else if (levator_function < 4) { surgery_indications = 'frontalis_suspension'; }
  else if (levator_function >= 4 && mr_distance < 2) { surgery_indications = 'levator_advancement'; }
  else { surgery_indications = 'observation_photographs'; }
  return { mr_distance, levator_function, pupillary_involvement, onset, surgery_indications };
}

function eyelidLaceration(input) {
  ensureObj(input, 'input');
  const involves_margin = !!input.involves_margin;
  const involves_lacrimal_system = !!input.involves_lacrimal_system;
  const tissue_loss = !!input.tissue_loss;
  const levator_laceration = !!input.levator_laceration;
  const intraocular_fb = !!input.intraocular_fb;
  let mgmt;
  if (intraocular_fb) { mgmt = 'ophthalmology_orbit_ct_refer_o_r'; }
  else if (levator_laceration) { mgmt = 'o_r_laceration_repair_levator'; }
  else if (involves_lacrimal_system) { mgmt = 'o_r_laceration_with_stenting'; }
  else if (involves_margin) { mgmt = 'o_r_margin_repair_aligned'; }
  else { mgmt = 'er_great_care_tissue_alignment'; }
  return { involves_margin, involves_lacrimal_system, tissue_loss, levator_laceration, intraocular_fb, mgmt };
}

module.exports = { ptosis, eyelidLaceration, CITATIONS, ValidationError };
