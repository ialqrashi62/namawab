// P3-AR: Stroke-Ext Engine — 10 pure functions
const Engine = {};

Engine.NIHSS = function ({ levelOfConsciousness = 0, locQuestions = 0, locCommands = 0, gaze = 0, visualFields = 0, facialPalsy = 0, motorArm = 0, motorLeg = 0, limbAtaxia = 0, sensory = 0, language = 0, dysarthria = 0, extinction = 0 } = {}) {
  const total = levelOfConsciousness + locQuestions + locCommands + gaze + visualFields + facialPalsy + motorArm + motorLeg + limbAtaxia + sensory + language + dysarthria + extinction;
  let severity;
  if (total >= 21) severity = 'severe-stroke';
  else if (total >= 16) severity = 'moderate-to-severe-stroke';
  else if (total >= 5) severity = 'moderate-stroke';
  else if (total >= 1) severity = 'minor-stroke';
  else severity = 'no-stroke-symptoms';
  return { total, severity, recommendation: total >= 6 ? 'consider-tPA-or-thrombectomy' : 'observation' };
};

Engine.tPAMeta = function ({ nihss = 10, timeOnset = 2, age = 70, priorStroke = false, anticoagulation = false, bp = 150, glucose = 100 } = {}) {
  let eligible;
  if (nihss < 1 || nihss > 25) eligible = 'NIHSS-out-of-range-not-eligible';
  else if (timeOnset > 4.5) eligible = 'outside-window-not-eligible';
  else if (age > 80 && priorStroke) eligible = 'age-and-prior-stroke-increased-risk';
  else if (anticoagulation === 'therapeutic') eligible = 'on-anticoagulation-not-eligible';
  else if (bp > 185) eligible = 'BP-too-high-treat-first';
  else if (glucose < 50 || glucose > 400) eligible = 'glucose-out-of-range';
  else eligible = 'eligible-for-tPA';
  return { eligible, recommendation: eligible === 'eligible-for-tPA' ? 'give-tPA-0.9mg-per-kg' : 'reassess-and-document' };
};

Engine.Thrombectomy = function ({ largeVesselOcclusion = true, timeOnset = 4, nihss = 18, age = 70, preMorbid = 'mrs-0' } = {}) {
  let eligible;
  if (!largeVesselOcclusion) eligible = 'no-LVO-not-eligible';
  else if (timeOnset > 24) eligible = 'outside-thrombectomy-window';
  else if (nihss < 6) eligible = 'low-NIHSS-medical-management';
  else if (preMorbid === 'mrs-3-or-4') eligible = 'premorbid-disability-consider-medical';
  else if (age > 90) eligible = 'age-90-caution';
  else eligible = 'eligible-for-thrombectomy';
  return { eligible, recommendation: eligible === 'eligible-for-thrombectomy' ? 'IR-and-CT-angio-and-thrombectomy' : 'medical-management' };
};

Engine.HemorrhagicStroke = function ({ intracerebral = true, location = 'basal-ganglia', volume = 30, gcs = 8, inr = 1.0, anticoag = false } = {}) {
  let pathway;
  if (volume >= 30 && gcs <= 8) pathway = 'large-hematoma-consider-surgical-evacuation';
  else if (volume >= 30) pathway = 'large-hematoma-neurosurgery-consult';
  else if (location === 'cerebellar' && volume >= 10) pathway = 'cerebellar-hematoma-surgical-evacuation';
  else if (anticoag && inr >= 1.5) pathway = 'anticoag-reversal-4F-PCC-and-vitamin-K';
  else pathway = 'medical-management-BP-control';
  return { pathway, recommendation: pathway.includes('surgical') ? 'neurosurgery-OR' : (pathway.includes('reversal') ? 'reversal-and-monitor' : 'medical') };
};

Engine.AtrialFibrillationStroke = function ({ chadsvasc = 4, hasbled = 2, strokeType = 'ischemic', anticoagCurrently = false } = {}) {
  let decision;
  if (chadsvasc >= 2 && strokeType === 'ischemic') decision = 'start-OAC-after-hemorrhage-excluded';
  else if (chadsvasc >= 1 && hasbled <= 2) decision = 'OAC-acceptable';
  else if (hasbled >= 3) decision = 'high-bleed-risk-consider-LAA-closure';
  else decision = 'no-OAC-needed';
  return { decision, recommendation: decision.includes('start') || decision.includes('OAC-acceptable') ? 'initiate-DOAC-or-warfarin' : 'reassess' };
};

Engine.DysphagiaStroke = function ({ waterSwallowTest = 'pass', nationalInstitutes = 'positive', gcs = 12 } = {}) {
  let pathway;
  if (waterSwallowTest === 'fail') pathway = 'failed-swallow-screen-NPO-and-SLP';
  else if (nationalInstitutes === 'positive') pathway = 'possible-aspiration-modify-diet-and-SLP';
  else if (gcs < 13) pathway = 'low-mental-status-NPO';
  else pathway = 'pass-screen-advance-diet';
  return { pathway, recommendation: pathway.includes('NPO') ? 'SLP-eval-and-tubes' : 'advance-diet' };
};

Engine.SecStrokePrev = function ({ strokeType = 'ischemic', daysPost = 14, antiplatelet = 'none', statin = false, bpControl = false, dm = false } = {}) {
  let pathway;
  if (strokeType === 'ischemic' && antiplatelet === 'none' && daysPost > 14) pathway = 'initiate-aspirin-or-clopidogrel';
  else if (strokeType === 'ischemic' && !statin) pathway = 'start-high-intensity-statin';
  else if (!bpControl) pathway = 'optimize-BP-control';
  else if (dm) pathway = 'optimize-diabetes-control';
  else pathway = 'secondary-prevention-optimized';
  return { pathway, recommendation: pathway.includes('initiate') || pathway.includes('start') ? 'start-medication' : 'continue-monitoring' };
};

Engine.StrokeRecovery = function ({ daysPostStroke = 30, nihssInitial = 12, nihssCurrent = 6, rehabIntensity = 'standard', fmaScore = 0 } = {}) {
  let pathway;
  const nihssImprovement = nihssInitial - nihssCurrent;
  if (daysPostStroke < 14) pathway = 'acute-rehab-early-mobilization';
  else if (daysPostStroke < 90 && nihssImprovement > 0) pathway = 'subacute-rehab-intensive';
  else if (daysPostStroke < 180) pathway = 'continued-rehab-community';
  else if (nihssImprovement < 1) pathway = 'plateau-maintenance-therapy';
  else pathway = 'long-term-recovery';
  if (rehabIntensity === 'minimal' && daysPostStroke < 90) pathway += '-consider-more-intensive-rehab';
  return { pathway, recommendation: pathway.includes('intensive') || pathway.includes('acute') ? 'high-intensity-therapy' : 'standard-therapy' };
};

Engine.CarotidStenosis = function ({ stenosis = 50, symptomatic = true, surgicalRisk = 'low' } = {}) {
  let decision;
  if (stenosis >= 70 && symptomatic && surgicalRisk === 'low') decision = 'CEA-recommended';
  else if (stenosis >= 60 && symptomatic && surgicalRisk === 'low') decision = 'CEA-consider';
  else if (stenosis >= 60 && symptomatic && surgicalRisk === 'high') decision = 'CAS-or-medical-management';
  else if (stenosis >= 60 && !symptomatic) decision = 'medical-management-or-CEA-if-high-grade';
  else decision = 'medical-management';
  return { decision, recommendation: decision.includes('CEA') || decision.includes('CAS') ? 'vascular-surgery-consult' : 'medical-management' };
};

Engine.TIAManagement = function ({ abcde2 = 5, age = 70, bp = 160, diabetes = false, duration = 20 } = {}) {
  let pathway;
  if (abcde2 >= 4) pathway = 'high-7-day-stroke-risk-urgent-imaging-and-treatment';
  else if (abcde2 >= 1) pathway = 'moderate-risk-imaging-and-treatment';
  else pathway = 'low-risk-imaging-and-treatment';
  return { pathway, recommendation: pathway.includes('high') ? 'urgent-imaging-and-dual-antiplatelet' : 'imaging-and-antiplatelet' };
};

module.exports = Engine;
