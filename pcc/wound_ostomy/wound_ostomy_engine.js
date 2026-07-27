// P3-BA: Wound-Ostomy Engine — 10 pure functions
const Engine = {};

Engine.WoundAssessment = function ({ woundType = 'pressure-injury', stage = 2, size = [3, 2, 0.5], exudate = 'moderate', tissue = 'granulating', infection = 'none' } = {}) {
  let classification;
  if (woundType === 'pressure-injury') {
    if (stage >= 4) classification = 'stage-4-or-unstageable-pressure-injury';
    else if (stage === 3) classification = 'stage-3-pressure-injury-full-thickness';
    else if (stage === 2) classification = 'stage-2-pressure-injury-partial-thickness';
    else if (stage === 1) classification = 'stage-1-pressure-injury-non-blanchable';
    else classification = 'unstageable-or-DTI';
  } else if (woundType === 'diabetic-foot') {
    classification = 'DFU-' + (infection === 'active' ? 'infected' : 'uninfected') + '-' + (size[0] >= 2 ? 'large' : 'small');
  } else if (woundType === 'venous') classification = 'venous-stasis-ulcer-mayo-grade';
  else if (woundType === 'arterial') classification = 'arterial-insufficiency-ulcer-vascular-eval';
  else if (woundType === 'surgical') classification = 'surgical-wound-' + (infection === 'none' ? 'healing' : 'infected');
  else classification = 'standard-wound-eval';
  return { classification, recommendation: 'WOCN-and-physician-eval' };
};

Engine.PressureInjuryStage = function ({ stage = 2, location = 'sacrum', mobility = 'limited' } = {}) {
  let plan;
  if (stage === 1) plan = 'repositioning-and-pressure-redistribution';
  else if (stage === 2) plan = 'moisture-retentive-dressing-and-offloading';
  else if (stage === 3) plan = 'advanced-dressing-and-debridement-eval';
  else if (stage === 4) plan = 'surgical-debridement-and-NPWT-eval';
  else if (stage === 'unstageable') plan = 'slough-or-eschar-cover-and-reassess-2-weeks';
  else if (stage === 'DTI') plan = 'DTI-suspected-color-change-no-blanching-monitor';
  else plan = 'standard-pressure-injury-care';
  return { plan, recommendation: `${plan}-${location}-mobility-${mobility}` };
};

Engine.WoundDressing = function ({ exudate = 'moderate', depth = 'superficial', infection = 'none', tissue = 'granulating' } = {}) {
  let dressing;
  if (infection === 'active') dressing = 'antimicrobial-silver-or-Meditfill';
  else if (exudate === 'heavy') dressing = 'foam-or-Aquacel-extra-absorbent';
  else if (exudate === 'moderate') dressing = 'foam-or-hydrofiber';
  else if (exudate === 'low') dressing = 'hydrocolloid-or-thin-foam';
  else if (depth === 'deep' && tissue === 'slough') dressing = 'NPWT-eval-and-enzymatic-debridement';
  else if (depth === 'superficial' && tissue === 'granulating') dressing = 'transparent-film-or-hydrocolloid';
  else if (tissue === 'necrotic') dressing = 'debridement-eval-autolytic-or-sharp';
  else dressing = 'moisture-retentive-dressing';
  return { dressing, recommendation: `${dressing}-change-every-3-to-7-days` };
};

Engine.NPWT = function ({ woundSize = [5, 3, 1.5], exudate = 'heavy', infection = 'none', weeks = 2 } = {}) {
  let plan;
  if (infection === 'active' || woundSize[0] >= 10) plan = 'contraindicated-NPWT-not-recommended';
  else if (weeks >= 6 && exudate === 'heavy') plan = 'consider-discontinuation-and-evaluation';
  else if (exudate === 'heavy' && woundSize[2] >= 1) plan = 'NPWT-125mmHg-continuous-and-change-every-2-to-3-days';
  else if (exudate === 'moderate') plan = 'NPWT-125mmHg-intermittent-and-change-every-3-days';
  else if (exudate === 'low') plan = 'NPWT-75mmHg-low-pressure-or-consider-discontinue';
  else plan = 'standard-NPWT-protocol';
  return { plan, recommendation: 'NPWT-team-and-WOCN-monitoring' };
};

Engine.OstomySite = function ({ stomaType = 'colostomy', location = 'LLQ', output = 'formed', peristomal = 'intact' } = {}) {
  let plan;
  if (peristomal === 'broken-down') plan = 'peristomal-skin-breakdown-and-paste-eval';
  else if (output === 'liquid' && stomaType === 'ileostomy') plan = 'high-output-ileostomy-electrolyte-eval';
  else if (output === 'liquid' && stomaType === 'urostomy') plan = 'mucus-and-electrolyte-eval';
  else if (output === 'formed' && stomaType === 'colostomy') plan = 'standard-colostomy-pouch-system';
  else if (location === 'LLQ' || location === 'RUQ') plan = 'standard-stoma-location-eval';
  else plan = 'comprehensive-stoma-eval';
  return { plan, recommendation: 'WOCN-stoma-therapist-and-pouch-system' };
};

Engine.StomaComplication = function ({ stomaColor = 'pink', retraction = false, prolapse = 'none', hernia = 'none' } = {}) {
  let diagnosis;
  if (stomaColor === 'dusky' || stomaColor === 'black') diagnosis = 'stomal-ischemia-emergent-surgical-eval';
  else if (stomaColor === 'purple') diagnosis = 'stomal-congestion-and-vascular-eval';
  else if (retraction) diagnosis = 'stomal-retraction-pouch-system-and-eval';
  else if (prolapse === 'severe') diagnosis = 'stomal-prolapse-surg-eval';
  else if (hernia === 'large') diagnosis = 'parastomal-hernia-support-belt-and-eval';
  else if (prolapse === 'mild') diagnosis = 'mild-stomal-prolapse-monitor';
  else diagnosis = 'no-stomal-complication';
  return { diagnosis, recommendation: 'colorectal-or-WOCN-team' };
};

Engine.WoundInfection = function ({ size = [3, 2, 0.5], erythema = 'none', drainage = 'serous', systemic = 'none', weeks = 1 } = {}) {
  let diagnosis;
  if (systemic === 'sepsis' || (systemic === 'febrile' && erythema === 'spreading')) diagnosis = 'wound-related-sepsis-IV-antibiotics';
  else if (erythema === 'spreading' && drainage === 'purulent') diagnosis = 'cellulitis-and-wound-infection-oral-ABX';
  else if (drainage === 'purulent' || erythema === 'localized') diagnosis = 'local-wound-infection-topical-antimicrobial';
  else if (weeks >= 4 && erythema === 'none') diagnosis = 'chronic-wound-evaluate-biofilm';
  else diagnosis = 'no-infection-monitor';
  return { diagnosis, recommendation: 'WOCN-and-ABX-team-eval' };
};

Engine.Continence = function ({ type = 'fecal', frequency = 'weekly', severity = 'mild', skin = 'intact' } = {}) {
  let plan;
  if (type === 'fecal' && severity === 'severe' && skin === 'broken-down') plan = 'IAD-severe-and-bowel-program';
  else if (type === 'urinary' && severity === 'severe') plan = 'catheter-or-pessary-and-skin-care';
  else if (severity === 'mild' && frequency === 'weekly') plan = 'pelvic-floor-PT-and-dietary-mod';
  else if (severity === 'moderate') plan = 'structured-bowel-or-bladder-program';
  else if (skin === 'broken-down') plan = 'skin-barrier-and-continence-program';
  else plan = 'monitor-and-reassess';
  return { plan, recommendation: 'WOCN-and-continence-team' };
};

Engine.WoundOutcome = function ({ week0 = 20, week4 = 10, scale = 'PWAT', weeksElapsed = 4 } = {}) {
  const delta = week0 - week4;
  const pctChange = (delta / week0) * 100;
  let result;
  if (pctChange >= 50) result = 'large-wound-improvement';
  else if (pctChange >= 30) result = 'moderate-wound-improvement';
  else if (pctChange >= 10) result = 'small-wound-improvement';
  else if (pctChange >= 0) result = 'plateau-reassess-plan';
  else if (pctChange < 0) result = 'wound-worsening-or-no-progress';
  return { delta, pctChange: Math.round(pctChange), result, recommendation: result.includes('large') || result.includes('moderate') ? 'continue-plan' : 'modify-and-evaluate' };
};

Engine.WoundDosing = function ({ visitsPerWeek = 3, weeks = 4 } = {}) {
  const totalVisits = visitsPerWeek * weeks;
  let intensity;
  if (totalVisits >= 16) intensity = 'intensive-WOCN-care';
  else if (totalVisits >= 8) intensity = 'standard-WOCN-care';
  else if (totalVisits >= 4) intensity = 'maintenance-WOCN-care';
  else intensity = 'supportive-WOCN-care';
  return { totalVisits, intensity, recommendation: `${intensity}-${weeks}-weeks` };
};

module.exports = Engine;
