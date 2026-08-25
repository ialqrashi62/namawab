'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { aaoms: 'American Association of Oral and Maxillofacial Surgeons 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function thirdMolar(input) {
  ensureObj(input, 'input');
  const angulation = ensureEnum(input.angulation, ['vertical','mesioangular','distoangular','horizontal','buccolingual','inverted'], 'angulation');
  const depth = ensureEnum(input.depth, ['soft_tissue','partial_bony','full_bony'], 'depth');
  const symptoms = !!input.symptoms;
  const pericoronitis = !!input.pericoronitis;
  const caries = !!input.caries;
  const cyst_tumor = !!input.cyst_tumor;
  let intervention;
  if (cyst_tumor || pericoronitis) { intervention = 'prophylactic_extraction'; }
  else if (caries || symptoms) { intervention = 'extraction'; }
  else if (depth === 'full_bony' && angulation === 'horizontal') { intervention = 'surgical_extraction'; }
  else if (depth === 'soft_tissue') { intervention = 'observation_or_simple_extraction'; }
  else { intervention = 'observation_or_elective'; }
  return { angulation, depth, symptoms, pericoronitis, caries, cyst_tumor, intervention };
}

function facialFracture(input) {
  ensureObj(input, 'input');
  const fracture_type = ensureEnum(input.fracture_type, ['mandible','midface','nasal','zygoma','orbital_floor','dental_alveolar','lefort_i','lefort_ii','lefort_iii'], 'fracture_type');
  const displacement = ensureEnum(input.displacement, ['non_displaced','minimally_displaced','displaced','comminuted'], 'displacement');
  const occlusion_disturbed = !!input.occlusion_disturbed;
  const open = !!input.open;
  let management;
  if (fracture_type === 'lefort_iii') { management = 'panfacial_reconstruction_airway_MRI_CT'; }
  else if (fracture_type === 'mandible' && occlusion_disturbed) { management = 'open_reduction_internal_fixation_maxillomandibular_fixation'; }
  else if (fracture_type === 'orbital_floor' && displacement !== 'non_displaced') { management = 'orbital_floor_reconstruction'; }
  else if (displacement === 'non_displaced' && !open) { management = 'soft_diet_observation_2_4wk'; }
  else if (open) { management = 'open_reduction_internal_fixation_antibiotics'; }
  else { management = 'closed_reduction_with_splinting'; }
  return { fracture_type, displacement, occlusion_disturbed, open, management, citations:['aaoms'] };
}

module.exports = { thirdMolar, facialFracture, CITATIONS, ValidationError };
