// P3-AW: Lymphedema Engine — 10 pure functions
const Engine = {};

Engine.LymphedemaStage = function ({ tissueTexture = 'pitting', skinFold = 5, fibrotic = false, historyDuration = 12 } = {}) {
  let stage;
  if (tissueTexture === 'normal') stage = 'stage-0-subclinical';
  else if (tissueTexture === 'pitting' && !fibrotic && historyDuration < 12) stage = 'stage-1-reversible-elevate';
  else if (tissueTexture === 'pitting' && historyDuration >= 12) stage = 'stage-2-spontaneously-irreversible';
  else if (fibrotic && skinFold >= 5) stage = 'stage-2-fibrotic-pitting-reduces';
  else if (fibrotic && skinFold >= 10) stage = 'stage-3-lymphostatic-elephantiasis';
  else if (historyDuration >= 60) stage = 'stage-3-chronic-lipedema';
  else stage = 'unspecified';
  return { stage, recommendation: stage.includes('1') ? 'CDT-and-elevation' : (stage.includes('2') ? 'CDT-MLD-compression' : 'lymphatic-team') };
};

Engine.LimbVolume = function ({ limbCircumferences = [10, 20, 30, 40, 50, 60, 70], truncatedCone = true } = {}) {
  let volume = 0;
  if (truncatedCone && limbCircumferences.length >= 2) {
    for (let i = 0; i < limbCircumferences.length - 1; i++) {
      const c1 = limbCircumferences[i], c2 = limbCircumferences[i + 1];
      const h = 10; // 10cm between measurements
      volume += (h / 3) * (Math.PI) * ((c1 / (2 * Math.PI)) ** 2 + (c2 / (2 * Math.PI)) ** 2 + (c1 / (2 * Math.PI)) * (c2 / (2 * Math.PI)));
    }
  } else {
    // simple frustum method with constant h=10
    for (let i = 0; i < limbCircumferences.length - 1; i++) {
      volume += limbCircumferences[i] ** 2 + limbCircumferences[i + 1] ** 2;
    }
  }
  return { volumeMl: Math.round(volume), recommendation: 'compare-to-contralateral-limb' };
};

Engine.LymphedemaExcess = function ({ affectedVol = 2500, unaffectedVol = 2000 } = {}) {
  const excessMl = affectedVol - unaffectedVol;
  const excessPct = (excessMl / unaffectedVol) * 100;
  let classification;
  if (excessPct < 5) classification = 'normal-asymmetry';
  else if (excessPct < 10) classification = 'mild-lymphedema-5-to-10-percent';
  else if (excessPct < 20) classification = 'moderate-lymphedema-10-to-20';
  else if (excessPct < 40) classification = 'severe-lymphedema-20-to-40';
  else classification = 'very-severe-lymphedema-over-40-percent';
  return { excessMl, excessPct: Math.round(excessPct), classification, recommendation: classification.includes('mild') ? 'compression-class-1' : (classification.includes('moderate') ? 'CDT-and-compression-2' : 'CDT-and-compression-3-or-4') };
};

Engine.CompressionClass = function ({ stage = 2, activity = 'maintenance', arterial = 'intact' } = {}) {
  let cls;
  if (arterial === 'compromised') cls = 'no-compression-arterial-disease';
  else if (stage === 1 && activity === 'acute') cls = 'class-1-light-compression';
  else if (stage === 2 && activity === 'maintenance') cls = 'class-2-medium-compression';
  else if (stage === 3) cls = 'class-3-high-compression-or-class-3-flat-knit';
  else if (stage === 1) cls = 'class-1-2-prevention';
  else cls = 'class-2-default';
  return { cls, recommendation: cls.includes('no-compression') ? 'arterial-eval-first' : 'daily-compression-and-skin-care' };
};

Engine.MLDTechnique = function ({ quadrant = 'upper-extremity-proximal', fibrosis = false, intact = true } = {}) {
  let technique;
  if (!intact) technique = 'contraindicated-active-cancer-or-DVT';
  else if (fibrosis) technique = 'fibrosis-technique-skin-stretching-and-cross-hand';
  else if (quadrant.includes('proximal')) technique = 'proximal-clearing-first-then-distal';
  else if (quadrant.includes('distal')) technique = 'distal-clearing-and-stroke-to-proximal';
  else if (quadrant.includes('trunk')) technique = 'trunk-anastomoses-stimulation';
  else technique = 'standard-Vodder-MLD-strokes';
  return { technique, recommendation: 'MLD-30-to-60-min-5-days-per-week' };
};

Engine.ExerciseLymphedema = function ({ compression = true, intensity = 'low', mode = 'aerobic' } = {}) {
  let plan;
  if (mode === 'aerobic' && intensity === 'low' && compression) plan = 'low-impact-aerobic-with-compression-30-min-5x-week';
  else if (mode === 'aerobic' && intensity === 'low' && !compression) plan = 'add-compression-before-aerobic';
  else if (mode === 'resistance') plan = 'resistance-band-low-load-high-rep-with-compression';
  else if (mode === 'aquatic') plan = 'aquatic-lymphatic-exercise-water-pressure-compression';
  else if (intensity === 'high') plan = 'high-intensity-not-recommended';
  else plan = 'standard-decongestive-exercise';
  return { plan, recommendation: 'graduated-exercise-with-compression-garment' };
};

Engine.SkinCare = function ({ skinCondition = 'intact', cellulitisEpisodes = 0, fungalRisk = false } = {}) {
  let care;
  if (cellulitisEpisodes >= 2) care = 'recurrent-cellulitis-prophylactic-antibiotic-and-skin-care';
  else if (skinCondition === 'cracked') care = 'barrier-cream-and-fungal-treatment';
  else if (fungalRisk) care = 'antifungal-prophylaxis-and-foot-care';
  else if (skinCondition === 'intact') care = 'pH-neutral-cleanser-and-emollient-daily';
  else care = 'wound-care-and-lymphatic-team';
  return { care, recommendation: 'daily-skin-inspection-and-moisturize' };
};

Engine.LymphedemaRisk = function ({ axillaryDissection = false, radiation = false, bmi = 30, sentinel = true } = {}) {
  let risk;
  if (axillaryDissection && radiation) risk = 'very-high-risk-BCRL';
  else if (axillaryDissection || radiation) risk = 'high-risk-BCRL';
  else if (sentinel && bmi >= 30) risk = 'moderate-risk-BCRL';
  else if (sentinel) risk = 'low-risk-BCRL';
  else risk = 'no-surgery-no-risk';
  return { risk, recommendation: risk.includes('very-high') || risk.includes('high') ? 'prehab-education-and-lymphatic-team' : 'monitor' };
};

Engine.PneumaticCompression = function ({ homeUse = true, pressure = 50, hoursPerDay = 2 } = {}) {
  let plan;
  if (homeUse && pressure >= 30 && hoursPerDay >= 1) plan = 'home-pneumatic-compression-daily';
  else if (homeUse && pressure < 30) plan = 'inadequate-pressure-adjust';
  else if (!homeUse) plan = 'in-clinic-pneumatic-compression-MLD-combined';
  else if (hoursPerDay < 1) plan = 'increase-duration-2-to-4-hours';
  else plan = 'standard-PCT-protocol';
  return { plan, recommendation: 'PCT-20-to-60-min-2x-daily-in-compression' };
};

Engine.PediatricLymphedema = function ({ age = 5, primary = true, milroy = false, lateOnset = false } = {}) {
  let plan;
  if (primary && milroy) plan = 'Milroy-disease-pediatric-lymphatic-team-and-genetic-counseling';
  else if (primary && age < 2) plan = 'infant-lymphedema-MLD-and-compression-pediatric';
  else if (primary && lateOnset) plan = 'late-onset-Meige-or-other-pediatric-lymphedema';
  else if (!primary) plan = 'secondary-pediatric-lymphedema-evaluate-cause';
  else plan = 'pediatric-lymphedema-CDT';
  return { plan, recommendation: 'pediatric-lymphatic-team-and-genetic-counsel' };
};

module.exports = Engine;
