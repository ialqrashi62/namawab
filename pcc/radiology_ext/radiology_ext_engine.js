// P3-AS: Radiology-Ext Engine — 10 pure functions
const Engine = {};

Engine.CTHeadInterpretation = function ({ midlineShift = 0, hemorrhage = 'none', edema = false, massEffect = false, fracture = false } = {}) {
  let finding;
  if (midlineShift >= 5) finding = 'significant-midline-shift-neurosurgical-emergent';
  else if (hemorrhage === 'subdural' && massEffect) finding = 'subdural-with-mass-effect-emergent';
  else if (hemorrhage === 'epidural') finding = 'epidural-emergent-evacuation';
  else if (hemorrhage === 'subarachnoid') finding = 'SAH-evaluate-aneurysm';
  else if (hemorrhage === 'intraparenchymal') finding = 'intraparenchymal-hematoma';
  else if (edema && massEffect) finding = 'edema-with-mass-effect';
  else if (fracture) finding = 'skull-fracture';
  else if (edema) finding = 'edema-no-mass-effect';
  else finding = 'no-acute-finding';
  return { finding, recommendation: finding.includes('emergent') ? 'emergent-neurosurgery' : (finding.includes('aneurysm') ? 'CTA-and-neurosurgery' : 'routine') };
};

Engine.MRISafety = function ({ device = 'pacemaker', aneurysmClip = false, cochlearImplant = false, shrapnel = false, pregnancy = false } = {}) {
  let safe;
  if (device === 'pacemaker' || aneurysmClip || cochlearImplant || shrapnel) safe = 'MRI-conditional-or-contraindicated';
  else if (pregnancy && device === 'gadolinium') safe = 'avoid-gadolinium-in-pregnancy';
  else if (device === 'none') safe = 'MRI-safe';
  else safe = 'review-specific-device';
  return { safe, recommendation: safe.includes('contraindicated') ? 'consider-CT-or-XR-alternative' : 'proceed-with-MRI' };
};

Engine.ContrastReaction = function ({ severity = 'mild', renalFunction = 'normal', symptoms = 'urticaria' } = {}) {
  let pathway;
  if (severity === 'severe' || symptoms === 'anaphylaxis') pathway = 'severe-contrast-reaction-treat-and-avoid-future';
  else if (severity === 'moderate' || symptoms === 'bronchospasm') pathway = 'moderate-treat-and-premedicate-next-time';
  else if (renalFunction === 'dialysis') pathway = 'dialysis-dialyze-after-contrast';
  else if (renalFunction === 'egfr-below-30') pathway = 'egfr-low-consider-non-contrast-or-prehydrate';
  else if (severity === 'mild') pathway = 'mild-urticaria-monitor';
  else pathway = 'no-reaction';
  return { pathway, recommendation: pathway.includes('severe') ? 'epinephrine-and-ICU' : pathway.includes('moderate') ? 'benadryl-and-steroid' : 'monitor' };
};

Engine.MammographyBIRADS = function ({ findings = 'negative', mass = false, calcifications = 'none', asymmetry = false } = {}) {
  let category;
  if (calcifications === 'pleomorphic' || findings === 'suspicious-mass') category = 'BIRADS-4C-high-suspicion-biopsy';
  else if (calcifications === 'fine-linear' || findings === 'highly-suspicious') category = 'BIRADS-5-highly-suspicious-biopsy';
  else if (mass && findings === 'indeterminate') category = 'BIRADS-4A-low-suspicion-biopsy-consider';
  else if (calcifications === 'clustered' || mass) category = 'BIRADS-3-probably-benign-6-month-followup';
  else if (asymmetry) category = 'BIRADS-2-benign';
  else if (findings === 'negative') category = 'BIRADS-1-negative';
  else category = 'BIRADS-0-incomplete';
  return { category, recommendation: category.startsWith('BIRADS-4') || category.startsWith('BIRADS-5') ? 'biopsy-and-surgical' : (category.startsWith('BIRADS-3') ? '6-month-followup' : 'routine-screening') };
};

Engine.CTPulmonaryAngiogram = function ({ heartRate = 80, bmi = 25, indication = 'PE-suspected' } = {}) {
  let interpretation;
  if (indication === 'PE-suspected') interpretation = 'high-sensitivity-CTPA-for-PE';
  else if (indication === 'aortic-dissection') interpretation = 'CTPA-extends-to-aorta';
  else if (heartRate >= 90) interpretation = 'high-HR-may-need-beta-blocker';
  else if (bmi >= 40) interpretation = 'high-BMI-consider-alternate';
  else interpretation = 'standard-CTPA';
  return { interpretation, recommendation: 'contrast-and-image-acquisition' };
};

Engine.PETCTInterpretation = function ({ suvMax = 2.0, lesionSite = 'lung', size = 1.0, priorForComparison = 'baseline' } = {}) {
  let interpretation;
  if (suvMax >= 5 && size >= 1) interpretation = 'highly-suspicious-malignancy';
  else if (suvMax >= 3.5) interpretation = 'suspicious-biopsy-consider';
  else if (suvMax >= 2.5) interpretation = 'indeterminate-short-interval-followup';
  else if (suvMax < 2) interpretation = 'low-suspicion-benign-likely';
  else interpretation = 'equivocal';
  return { interpretation, recommendation: interpretation.includes('suspicious') || interpretation.includes('malignancy') ? 'biopsy-and-oncology' : 'followup' };
};

Engine.MRIBrainIndication = function ({ indication = 'stroke', gcs = 12, contrast = true, renalFunction = 'normal' } = {}) {
  let pathway;
  if (indication === 'stroke' && gcs < 9) pathway = 'acute-stroke-CT-first-not-MRI';
  else if (indication === 'tumor' && contrast && renalFunction === 'egfr-below-30') pathway = 'avoid-gadolinium-in-tumor';
  else if (indication === 'tumor' && contrast) pathway = 'MRI-with-and-without-contrast';
  else if (indication === 'ms') pathway = 'MRI-with-and-without-contrast-FLAIR';
  else if (indication === 'stroke' && gcs >= 9) pathway = 'MRI-DWI-and-FLAIR';
  else pathway = 'standard-MRI';
  return { pathway, recommendation: 'radiology-protocols' };
};

Engine.UltrasoundFAST = function ({ freeFluid = 'no', pericardial = 'no', pneumothorax = 'no', hepatic = 'no', splenic = 'no' } = {}) {
  let finding;
  if (pericardial === 'yes') finding = 'pericardial-effusion-emergent';
  else if (freeFluid === 'massive') finding = 'massive-hemoperitoneum-emergent';
  else if (freeFluid === 'moderate' || hepatic === 'yes' || splenic === 'yes') finding = 'positive-FAST';
  else if (pneumothorax === 'yes') finding = 'pneumothorax-emergent';
  else if (freeFluid === 'trace') finding = 'trace-fluid-monitor';
  else finding = 'negative-FAST';
  return { finding, recommendation: finding.includes('emergent') ? 'emergent-OR' : (finding.includes('positive') ? 'CT-and-decision' : 'monitor') };
};

Engine.XRayChest = function ({ consolidation = 'no', pleuralEffusion = 'no', pneumothorax = 'no', cardiomegaly = false, mediastinalWidening = false } = {}) {
  let finding;
  if (pneumothorax === 'large') finding = 'large-pneumothorax-emergent-chest-tube';
  else if (mediastinalWidening) finding = 'mediastinal-widening-evaluate-aortic-dissection';
  else if (consolidation === 'lobar') finding = 'lobar-pneumonia';
  else if (pleuralEffusion === 'large') finding = 'large-pleural-effusion-thoracentesis';
  else if (consolidation === 'patchy') finding = 'patchy-infiltrate-pneumonia';
  else if (pleuralEffusion === 'small') finding = 'small-pleural-effusion';
  else if (cardiomegaly) finding = 'cardiomegaly';
  else finding = 'normal-chest-XR';
  return { finding, recommendation: finding.includes('emergent') ? 'emergent-intervention' : (finding.includes('lobar') || finding.includes('pneumonia') ? 'antibiotics' : 'routine') };
};

Engine.ProcedureConsent = function ({ procedure = 'biopsy', riskLevel = 'low', language = 'english', capacity = true } = {}) {
  let requirement;
  if (!capacity) requirement = 'surrogate-decision-maker';
  else if (language !== 'english') requirement = 'certified-interpreter-required';
  else if (riskLevel === 'high') requirement = 'informed-consent-attending-and-witness';
  else if (riskLevel === 'moderate') requirement = 'informed-consent-attending';
  else requirement = 'verbal-consent-and-documentation';
  return { requirement, recommendation: 'document-and-time-out' };
};

module.exports = Engine;
