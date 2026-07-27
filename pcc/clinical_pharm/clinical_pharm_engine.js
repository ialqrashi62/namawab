// P3-AO: Clinical-Pharmacology Engine — 10 pure functions
const Engine = {};

Engine.QTRiskAssessment = function ({ drugName = 'ondansetron', qtcBaseline = 400, age = 50, female = false, electrolytesOk = true } = {}) {
  let risk;
  const ageFactor = age >= 65 ? 10 : 0;
  const femaleFactor = female ? 15 : 0;
  const electrolyteFactor = electrolytesOk ? 0 : 25;
  const drugEffect = drugName === 'sotalol' ? 50 : (drugName === 'amiodarone' ? 40 : (drugName === 'ondansetron' ? 20 : 10));
  const projectedQTc = qtcBaseline + ageFactor + femaleFactor + electrolyteFactor + drugEffect;
  if (projectedQTc >= 500) risk = 'high-risk-torsades-avoid';
  else if (projectedQTc >= 480) risk = 'moderate-high-risk-monitor';
  else if (projectedQTc >= 450) risk = 'borderline-monitor';
  else risk = 'low-risk';
  return { projectedQTc, risk, recommendation: risk.includes('high') || risk.includes('moderate-high') ? 'ECG-monitor-electrolytes' : 'standard-monitoring' };
};

Engine.CytochromeP450 = function ({ substrate = 'warfarin', inhibitor = 'fluconazole', inducer = 'rifampin', coadministered = [] } = {}) {
  const affectedEnzymes = [];
  if (inhibitor === 'fluconazole' || inhibitor === 'ketoconazole') affectedEnzymes.push('CYP2C9', 'CYP3A4');
  if (inhibitor === 'erythromycin' || inhibitor === 'clarithromycin') affectedEnzymes.push('CYP3A4');
  if (inhibitor === 'cimetidine') affectedEnzymes.push('CYP1A2', 'CYP2D6', 'CYP3A4');
  if (inducer === 'rifampin' || inducer === 'phenytoin' || inducer === 'carbamazepine') affectedEnzymes.push('CYP3A4', 'CYP2C9');
  if (inducer === 'st-johns-wort') affectedEnzymes.push('CYP3A4');
  let interaction;
  if (affectedEnzymes.length > 0 && substrate) interaction = `${substrate}-metabolism-${inhibitor ? 'inhibited' : 'induced'}-by-${inhibitor || inducer}`;
  else interaction = 'no-significant-interaction';
  return { affectedEnzymes, interaction, recommendation: affectedEnzymes.length > 0 ? 'monitor-levels-or-reduce-dose' : 'continue' };
};

Engine.SerotoninSyndromeRisk = function ({ serotonergicDrugs = 1, maoi = false, meperidine = false, tramadol = false, linezolid = false } = {}) {
  let risk;
  const highRiskCombo = maoi || (serotonergicDrugs >= 2 && (meperidine || tramadol || linezolid));
  if (highRiskCombo) risk = 'high-risk-serotonin-syndrome-avoid-combination';
  else if (serotonergicDrugs >= 3) risk = 'moderate-risk-monitor';
  else if (serotonergicDrugs >= 2) risk = 'mild-risk-watch-symptoms';
  else risk = 'low-risk';
  return { risk, recommendation: risk.includes('high') ? 'discontinue-and-supportive-care' : 'monitor-symptoms' };
};

Engine.NeurolepticMalignantSyndrome = function ({ temperature = 37, rigidity = 'mild', ckLevel = 0, alteredMental = false, recentAntipsychotic = false } = {}) {
  let risk;
  if (temperature >= 38 && rigidity === 'severe' && ckLevel > 1000 && recentAntipsychotic) risk = 'NMS-confirmed-stop-antipsychotic';
  else if (temperature >= 37.5 && rigidity === 'moderate' && ckLevel > 500 && recentAntipsychotic) risk = 'probable-NMS-stop-and-monitor';
  else if (recentAntipsychotic && (rigidity === 'mild' || temperature >= 37.5)) risk = 'possible-NMS-watch-closely';
  else risk = 'low-risk';
  return { risk, recommendation: risk.includes('NMS') ? 'ICU-supportive-care' : 'monitor' };
};

Engine.StevensJohnsonSyndrome = function ({ drug = 'lamotrigine', rashSeverity = 'mild', mucosalInvolvement = false, onset = 7 } = {}) {
  let risk;
  if (rashSeverity === 'severe' && mucosalInvolvement && onset < 14) risk = 'high-risk-SJS-stop-immediately';
  else if (rashSeverity === 'moderate' && mucosalInvolvement) risk = 'moderate-risk-stop-and-derm';
  else if (rashSeverity === 'mild' && !mucosalInvolvement) risk = 'mild-monitor-closely';
  else risk = 'low-risk';
  return { risk, recommendation: risk.includes('high') ? 'urgent-dermatology-and-burns' : 'monitor-and-document' };
};

Engine.AntimicrobialStewardship = function ({ culture = 'pending', empiric = 'pip-tazo', daysOnEmpiric = 3, mrsaRisk = false } = {}) {
  let decision;
  if (culture === 'negative' && daysOnEmpiric >= 3) decision = 'de-escalate-or-stop';
  else if (culture === 'positive' && mrsaRisk === false) decision = 'narrow-to-pathogen-directed';
  else if (mrsaRisk && !culture.includes('MRSA')) decision = 'consider-MRSA-coverage-or-de-escalate';
  else if (culture === 'pending' && daysOnEmpiric < 3) decision = 'continue-empiric';
  else decision = 'continue-current-regimen';
  return { decision, recommendation: decision.includes('de-escalate') || decision.includes('narrow') ? 'pharmacy-stewardship-intervention' : 'continue-with-monitoring' };
};

Engine.SteroidTapering = function ({ currentDose = 40, duration = 14, indication = 'copd' } = {}) {
  let taper;
  if (duration <= 7) taper = 'no-taper-needed';
  else if (duration <= 14) taper = 'reduce-5mg-every-3-days';
  else if (duration <= 30) taper = 'reduce-5mg-every-week-until-10mg-then-2.5mg-slow';
  else taper = 'slow-taper-1-2.5mg-per-week-physiologic-replacement';
  const totalDays = Math.ceil(currentDose / 5) * 3;
  return { taper, totalDays, recommendation: 'monitor-adrenal-suppression-if-long-course' };
};

Engine.HighAlertMedication = function ({ drug = 'heparin', indication = 'dvt', dose = 5000, weight = 70 } = {}) {
  let protocol;
  if (drug === 'heparin' || drug === 'unfractionated-heparin') {
    const bolus = 80 * weight;
    const infusion = 18 * weight;
    protocol = `bolus-${bolus}-then-${infusion}-per-hour`;
  } else if (drug === 'warfarin') protocol = '5mg-daily-load-expect-5-7d-therapeutic';
  else if (drug === 'insulin') protocol = 'weight-based-0.5-1U-per-kg-per-day';
  else if (drug === 'potassium') protocol = 'central-20mEq-per-hour-max-peripheral-10mEq';
  else if (drug === 'magnesium') protocol = '2g-IV-over-20-min';
  else if (drug === 'chemo') protocol = 'double-check-with-pharmacy-and-second-nurse';
  else protocol = 'high-alert-double-check-policy';
  return { protocol, recommendation: 'double-independent-verification-required' };
};

Engine.PolypharmacyAssessment = function ({ medicationCount = 5, age = 65, anticholinergic = 0, beersList = 0, fallsRisk = false } = {}) {
  let risk;
  if (medicationCount >= 10) risk = 'severe-polypharmacy-deprescribe';
  else if (medicationCount >= 7 && age >= 65) risk = 'high-polypharmacy-review';
  else if (beersList >= 3) risk = 'high-beers-list-medications-review';
  else if (anticholinergic >= 2) risk = 'high-anticholinergic-burden';
  else if (fallsRisk && medicationCount >= 5) risk = 'fall-risk-review';
  else if (medicationCount >= 5) risk = 'moderate-polypharmacy-monitor';
  else risk = 'low-polypharmacy';
  return { risk, recommendation: risk.includes('high') || risk.includes('severe') ? 'pharmacy-deprescribing-clinic' : 'continue-review' };
};

Engine.AdverseDrugReaction = function ({ causality = 'possible', severity = 'moderate', expectedness = 'expected', seriousness = 'non-serious' } = {}) {
  let pathway;
  if (seriousness === 'serious' || severity === 'severe') pathway = 'serious-ADR-report-to-pharmacovigilance-and-stop';
  else if (causality === 'probable' || causality === 'definite') pathway = 'causality-likely-stop-and-document';
  else if (expectedness === 'unexpected') pathway = 'unexpected-ADR-report';
  else if (severity === 'moderate') pathway = 'moderate-ADR-monitor-or-reduce-dose';
  else pathway = 'mild-ADR-document-and-monitor';
  return { pathway, recommendation: seriousness === 'serious' ? 'medwatch-report' : 'document-in-chart' };
};

module.exports = Engine;
