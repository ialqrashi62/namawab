'use strict';

// Forensic-Medicine PCC — 10 pure deterministic functions
// Compliance: NAME, AAFS, NAME-USA, INTERPOL-DVI, ICADTS, WHO-ICD-10

const Engine = module.exports = {};

// 1) Manner of death — natural vs unnatural
Engine.MannerOfDeath = function (input = {}) {
  const { cause = 'natural', intent = 'none', mechanism = 'disease', autopsyFindings = 'consistent' } = input;
  let manner;
  if (cause === 'natural' && mechanism === 'disease') manner = 'natural';
  else if (intent === 'suicide') manner = 'suicide';
  else if (intent === 'homicide') manner = 'homicide';
  else if (intent === 'accident') manner = 'accident';
  else if (cause === 'undetermined') manner = 'undetermined';
  else if (autopsyFindings === 'inconsistent') manner = 'undetermined';
  else manner = 'undetermined';
  return { manner, recommendation: manner === 'undetermined' ? 'additional-investigation-required' : 'case-closed-deaths-cert' };
};

// 2) Time of death — postmortem changes
Engine.TimeSinceDeath = function (input = {}) {
  const { algorMortis = 25, rigorMortisStage = 'generalized', livorMortis = 'fixed', gastricContents = 'digested', insectActivity = 'minimal' } = input;
  const tempDrop = 37 - algorMortis;
  const hoursByTemp = tempDrop / 1.0;
  let timeEstimate;
  if (insectActivity === 'advanced') timeEstimate = 'more-than-72-hours';
  else if (rigorMortisStage === 'passed' && livorMortis === 'fixed') timeEstimate = '24-48-hours';
  else if (rigorMortisStage === 'generalized') timeEstimate = '12-24-hours';
  else if (rigorMortisStage === 'early') timeEstimate = '3-12-hours';
  else if (hoursByTemp < 6) timeEstimate = '1-6-hours';
  else timeEstimate = 'uncertain';
  return { timeEstimate, recommendation: timeEstimate === 'uncertain' ? 'use-additional-forensic-methods' : 'preliminary-estimate' };
};

// 3) Mechanism of death
Engine.MechanismOfDeath = function (input = {}) {
  const { primaryCause = 'cardiac', secondaryCause = 'arrhythmia', contributing = [], forensic = false } = input;
  const allCauses = [primaryCause, secondaryCause, ...contributing].join(' + ');
  return { allCauses, recommendation: forensic ? 'forensic-autopsy-required' : 'medical-examiner-sign-off' };
};

// 4) Gunshot wound — range of fire
Engine.GunshotWoundRange = function (input = {}) {
  const { soot = 'absent', stippling = 'absent', muzzleImprint = false, woundType = 'penetrating', firearm = 'unknown' } = input;
  let range;
  if (soot === 'present' && stippling === 'present' && muzzleImprint) range = 'contact-or-near-contact';
  else if (soot === 'present' && stippling === 'present') range = 'intermediate-range';
  else if (stippling === 'present') range = 'close-range';
  else if (woundType === 'penetrating') range = 'distant-range';
  else range = 'indeterminate';
  return { range, recommendation: range === 'indeterminate' ? 'wound-ballistics-reconstruction' : 'standard-forensic-documentation' };
};

// 5) Strangulation vs hanging
Engine.StrangulationClassification = function (input = {}) {
  const { ligatureMark = false, ligatureContinuity = 'broken', hyoidFracture = false, facialCongestion = false, petechiae = false } = input;
  let classification;
  if (ligatureMark && ligatureContinuity === 'complete' && hyoidFracture) classification = 'throttling-manual-or-ligature';
  else if (ligatureMark && ligatureContinuity === 'broken') classification = 'hanging-typical-suicidal';
  else if (facialCongestion && petechiae && !ligatureMark) classification = 'manual-strangulation-throttling';
  else if (hyoidFracture) classification = 'manual-strangulation-throttling-with-fracture';
  else classification = 'indeterminate';
  return { classification, recommendation: classification === 'indeterminate' ? 'full-autopsy-toxicology-histology' : 'scene-investigation-completion' };
};

// 6) Drowning — diatom test
Engine.DrowningDiagnosis = function (input = {}) {
  const { waterInLungs = 'minimal', frothAirways = 'absent', diatomTest = 'negative', pleuralEffusion = 'minimal' } = input;
  let diagnosis;
  if (diatomTest === 'positive' && frothAirways === 'present' && pleuralEffusion === 'significant') diagnosis = 'confirmed-drowning';
  else if (frothAirways === 'present' && pleuralEffusion === 'significant') diagnosis = 'highly-suspected-drowning';
  else if (waterInLungs === 'significant' || frothAirways === 'present') diagnosis = 'possible-drowning';
  else diagnosis = 'no-drowning-evidence';
  return { diagnosis, recommendation: diagnosis === 'confirmed-drowning' ? 'death-by-drowning' : 'differential-exclude-other-causes' };
};

// 7) Drug-related death — toxicology severity
Engine.DrugRelatedDeath = function (input = {}) {
  const { opiates = 'none', benzodiazepines = 'none', alcohol = 0, cocaine = 'none', mixed = false } = input;
  let category;
  if ((opiates === 'high' || cocaine === 'high') && alcohol > 200) category = 'poly-substance-overdose';
  else if (opiates === 'high' || cocaine === 'high') category = 'single-substance-overdose';
  else if (mixed && alcohol > 200) category = 'substance-intoxication';
  else if (alcohol > 400) category = 'acute-alcohol-poisoning';
  else category = 'no-drug-related';
  return { category, recommendation: category.includes('overdose') ? 'manner-accident-or-suicide' : 'exclude-drug-as-cause' };
};

// 8) Age estimation from skeletal remains
Engine.SkeletalAgeEstimation = function (input = {}) {
  const { epiphysealFusion = 'complete', dentalEruption = 'mature', pubicSymphysis = 'phase-VI', degenerativeChanges = 'moderate' } = input;
  let ageEstimate;
  if (epiphysealFusion === 'incomplete' && dentalEruption === 'mixed') ageEstimate = 'adolescent-12-18';
  else if (pubicSymphysis === 'phase-I' || pubicSymphysis === 'phase-II') ageEstimate = 'young-adult-18-25';
  else if (pubicSymphysis === 'phase-III' || pubicSymphysis === 'phase-IV') ageEstimate = 'adult-25-40';
  else if (pubicSymphysis === 'phase-V' || pubicSymphysis === 'phase-VI') ageEstimate = 'middle-aged-40-55';
  else if (degenerativeChanges === 'severe') ageEstimate = 'older-adult-55+';
  else ageEstimate = 'indeterminate';
  return { ageEstimate, recommendation: ageEstimate === 'indeterminate' ? 'DNA-analysis-radiographs' : 'biological-profile-complete' };
};

// 9) Sexual assault — injury documentation
Engine.SexualAssaultInjury = function (input = {}) {
  const { genitalInjury = 'absent', analInjury = 'absent', nongenitalInjury = 'absent', spermatozoa = 'absent', dnaProfile = 'unknown' } = input;
  let evidenceStrength;
  if ((genitalInjury === 'present' || analInjury === 'present') && spermatozoa === 'present') evidenceStrength = 'high-evidence-of-assault';
  else if (genitalInjury === 'present' || analInjury === 'present' || spermatozoa === 'present') evidenceStrength = 'moderate-evidence';
  else if (nongenitalInjury === 'present') evidenceStrength = 'low-evidence-physical-only';
  else evidenceStrength = 'no-physical-evidence-consent-issue';
  return { evidenceStrength, recommendation: 'chain-of-custody-kit-rape-kit-collection' };
};

// 10) Blunt force trauma — injury severity
Engine.BluntForceTrauma = function (input = {}) {
  const { hemorrhage = 'minimal', organLaceration = 'absent', fracture = 'absent', brainInjury = 'absent' } = input;
  let severity;
  if (brainInjury === 'massive' || organLaceration === 'multi-organ') severity = 'catastrophic-immediate-death';
  else if (brainInjury === 'significant' || organLaceration === 'major' || hemorrhage === 'massive') severity = 'severe-life-threatening';
  else if (fracture === 'multiple' || organLaceration === 'minor' || hemorrhage === 'moderate') severity = 'moderate';
  else if (fracture === 'simple' || hemorrhage === 'minor') severity = 'mild';
  else severity = 'minimal';
  return { severity, recommendation: severity === 'catastrophic-immediate-death' ? 'manner-accident-or-homicide' : 'manner-accident' };
};
