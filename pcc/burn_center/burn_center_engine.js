// P3-AQ: Burn-Center Engine — 10 pure functions
const Engine = {};

Engine.BurnTBSA = function ({ head = 0, chest = 0, back = 0, arms = 0, hands = 0, legs = 0, genitals = 0 } = {}) {
  const total = head + chest + back + arms + hands + legs + genitals;
  let classification;
  if (total >= 80) classification = 'fatal-burn-extensive';
  else if (total >= 40) classification = 'major-burn';
  else if (total >= 20) classification = 'moderate-burn';
  else if (total >= 10) classification = 'minor-burn-but-consider-center';
  else if (total >= 1) classification = 'minor-burn-outpatient';
  else classification = 'no-burn';
  return { total, classification, recommendation: total >= 20 ? 'burn-center-referral' : 'outpatient-burn-care' };
};

Engine.BurnDepth = function ({ appearance = 'red-painful', blanching = true, blisters = false, sensation = 'present', color = 'pink' } = {}) {
  let depth;
  if (appearance === 'white-or-charred' || sensation === 'absent') depth = 'fourth-degree';
  else if (appearance === 'white-or-leathery' || color === 'white') depth = 'third-degree-full-thickness';
  else if (blisters && color === 'red') depth = 'second-degree-deep-partial-thickness';
  else if (blisters && blanching) depth = 'second-degree-superficial-partial';
  else if (appearance === 'red-painful' && blanching) depth = 'first-degree-superficial';
  else if (!blanching) depth = 'deep-partial-or-full';
  else depth = 'unspecified';
  return { depth, recommendation: depth.includes('third') || depth.includes('fourth') || depth.includes('full') ? 'surgical-burn-center' : 'wound-care-and-monitor' };
};

Engine.ParklandFormula = function ({ weight = 70, tbsa = 30 } = {}) {
  const totalMl = 4 * weight * tbsa;
  const firstEightHrs = totalMl / 2;
  const nextSixteenHrs = totalMl / 2;
  return { total24hrMl: totalMl, firstEightHrsMl: firstEightHrs, nextSixteenHrsMl: nextSixteenHrs, rateFirst8hr: Math.round(firstEightHrs / 8), rateNext16hr: Math.round(nextSixteenHrs / 16), recommendation: 'LR-bolus-and-monitor-urine-output-0.5-1ml-per-kg-per-hr' };
};

Engine.InhalationInjury = function ({ facialBurns = false, singedNasalHairs = false, carbonaceousSputum = false, hoarseness = false, stridor = false, carboxyhemoglobin = 0 } = {}) {
  let severity;
  if (stridor || carboxyhemoglobin >= 30) severity = 'severe-inhalation-injury-intubate-immediately';
  else if (carbonaceousSputum || hoarseness) severity = 'moderate-inhalation-injury-consider-intubation';
  else if (facialBurns || singedNasalHairs) severity = 'mild-inhalation-injury-monitor-ABG';
  else severity = 'no-inhalation-injury';
  return { severity, recommendation: severity.includes('severe') ? 'intubate-and-100-percent-O2' : severity.includes('moderate') ? 'bronchoscopy-and-monitor' : 'reassess' };
};

Engine.BurnShock = function ({ sbp = 100, hr = 100, lactate = 1.0, urineOutput = 50, weight = 70, hours = 12 } = {}) {
  let shock;
  if (sbp < 90 && hr > 120) shock = 'severe-burn-shock-massive-fluid';
  else if (lactate > 4 || urineOutput < 0.5 * weight) shock = 'moderate-burn-shock-increase-fluids';
  else if (lactate > 2) shock = 'early-burn-shock-monitor';
  else if (urineOutput >= 0.5 * weight && urineOutput <= 1 * weight) shock = 'adequate-resuscitation';
  else shock = 'monitor';
  return { shock, recommendation: shock.includes('severe') || shock.includes('moderate') ? 'increase-fluids-per-Parkland' : 'continue-current' };
};

Engine.BurnSepsis = function ({ temperature = 37, hr = 100, rr = 18, wbc = 8, lactate = 1.0, mental = 'alert' } = {}) {
  const qsofa = (rr >= 22 ? 1 : 0) + (lactate >= 2 ? 1 : 0) + (mental === 'altered' ? 1 : 0);
  const abaCriteria = (temperature > 39 || temperature < 36) || (hr > 110) || (rr > 25) || (wbc > 12 || wbc < 4);
  let pathway;
  if (qsofa >= 2 && abaCriteria) pathway = 'burn-sepsis-confirmed-ABAtx';
  else if (qsofa >= 1 && abaCriteria) pathway = 'burn-sepsis-suspected-monitor';
  else pathway = 'no-sepsis';
  return { pathway, qsofa, recommendation: pathway.includes('confirmed') ? 'antibiotics-and-source-control' : pathway.includes('suspected') ? 'cultures-and-monitor' : 'monitor' };
};

Engine.BurnNutrition = function ({ weight = 70, tbsa = 30, age = 30 } = {}) {
  const curreriJunior = 1500 + 20 * tbsa;
  const curreri = 25 * weight + 40 * tbsa;
  const calories = age < 12 ? curreriJunior : curreri;
  const protein = tbsa >= 30 ? 2.0 * weight : 1.5 * weight;
  return { totalCalories: Math.round(calories), proteinGrams: Math.round(protein), recommendation: 'enteral-nutrition-within-24-hours' };
};

Engine.ElectricalBurn = function ({ voltage = 110, contact = 'low-voltage', rhabdo = false, cardiacArrest = false, compartment = false } = {}) {
  let severity;
  if (voltage >= 1000) severity = 'high-voltage-electrical-burn-extensive-tissue-damage';
  else if (cardiacArrest) severity = 'cardiac-arrest-and-electrical-burn';
  else if (rhabdo) severity = 'rhabdomyolysis-alkalinize-urine-and-IVF';
  else if (compartment) severity = 'compartment-syndrome-fasciotomy';
  else if (voltage >= 220) severity = 'medium-voltage-electrical-burn';
  else severity = 'low-voltage-burn';
  return { severity, recommendation: severity.includes('high-voltage') || severity.includes('fasciotomy') ? 'burn-center-and-trauma-team' : 'burn-clinic' };
};

Engine.ChemicalBurn = function ({ agent = 'acid', concentration = 'low', area = 5, eyeInvolved = false, inhalation = false } = {}) {
  let severity;
  if (agent === 'hydrofluoric-acid' && concentration === 'high') severity = 'HF-burn-calcium-gluconate-and-burn-center';
  else if (eyeInvolved) severity = 'chemical-eye-burn-immediate-irrigation-and-ophthalmology';
  else if (inhalation) severity = 'chemical-inhalation-burn-and-ARDS-risk';
  else if (agent === 'alkali' && concentration === 'high') severity = 'alkali-burn-deep-tissue-damage';
  else if (area >= 10) severity = 'chemical-burn-extensive-burn-center';
  else severity = 'chemical-burn-irrigation-and-monitor';
  return { severity, recommendation: severity.includes('burn-center') || severity.includes('ophthalmology') ? 'specialist-immediate' : 'irrigate-and-burn-clinic' };
};

Engine.BurnRehab = function ({ daysPostBurn = 5, romLimitations = true, contracture = false, scarHypertrophy = false, handInjury = false, splintingNeeded = true } = {}) {
  let pathway;
  if (handInjury || contracture) pathway = 'OT-PT-intensive-and-splinting';
  else if (scarHypertrophy) pathway = 'compression-garment-and-silicone';
  else if (romLimitations && daysPostBurn < 30) pathway = 'early-mobilization-and-OT';
  else if (daysPostBurn < 14) pathway = 'acute-burn-rehab-positioning';
  else if (daysPostBurn < 90) pathway = 'subacute-burn-rehab-strengthening';
  else pathway = 'long-term-burn-rehab-functional-restoration';
  return { pathway, recommendation: pathway.includes('intensive') || pathway.includes('OT') ? 'OT-PT-daily' : 'PT-as-needed' };
};

module.exports = Engine;
