// P3-BE: Neonatal-Ext Engine — 10 pure functions
const Engine = {};

Engine.APHARScore = function ({ pH = 7.2, baseDeficit = 10, fiveMinApgar = 7, resuscitation = 'O2-only' } = {}) {
  let points = 0;
  if (pH < 7.0) points += 3;
  else if (pH < 7.1) points += 2;
  else if (pH < 7.2) points += 1;
  if (baseDeficit >= 16) points += 3;
  else if (baseDeficit >= 10) points += 2;
  else if (baseDeficit >= 5) points += 1;
  if (fiveMinApgar < 4) points += 3;
  else if (fiveMinApgar < 7) points += 2;
  if (resuscitation === 'intubation') points += 3;
  else if (resuscitation === 'mask-CPR') points += 2;
  else if (resuscitation === 'O2-only') points += 1;
  let classification;
  if (points >= 7) classification = 'severe-HIE';
  else if (points >= 4) classification = 'moderate-HIE';
  else if (points >= 1) classification = 'mild-HIE';
  else classification = 'no-HIE';
  return { points, classification, recommendation: 'therapeutic-hypothermia-if-qualifies' };
};

Engine.TherapeuticHypothermia = function ({ qualifies = 'yes', hoursAfterBirth = 4, targetTemp = 33.5, hoursDuration = 72 } = {}) {
  let plan;
  if (qualifies === 'yes' && hoursAfterBirth <= 6 && targetTemp === 33.5 && hoursDuration === 72) plan = 'whole-body-cooling-72-hours-and-rewarm';
  else if (qualifies === 'yes' && hoursAfterBirth <= 6) plan = 'cooling-with-modifications';
  else if (hoursAfterBirth > 6) plan = 'past-window-and-individualized';
  else if (qualifies === 'no') plan = 'not-eligible-and-supportive-care';
  else plan = 'standard-eval';
  return { plan, recommendation: 'neonatal-team-and-CNS-monitoring' };
};

Engine.NEC = function ({ abdominalDistension = 'mild', pneumatosis = 'no', systemic = 'stable', labs = 'normal' } = {}) {
  let diagnosis;
  if (pneumatosis === 'yes' && systemic === 'unstable') diagnosis = 'NEC-stage-IIB-or-IIIA-and-surgery-eval';
  else if (pneumatosis === 'yes' && labs === 'abnormal') diagnosis = 'NEC-stage-IIA-and-NPO-and-ABX';
  else if (pneumatosis === 'no' && abdominalDistension === 'severe') diagnosis = 'NEC-suspect-and-NPO-and-ABX';
  else if (abdominalDistension === 'mild' && labs === 'normal') diagnosis = 'mild-feeding-intolerance';
  else diagnosis = 'unspecified';
  return { diagnosis, recommendation: 'surgery-consult-and-NPO-and-ABX' };
};

Engine.RDS = function ({ ga = 32, surfactant = 'available', CPAP = 'available', FiO2 = 0.30 } = {}) {
  let plan;
  if (ga < 28 && FiO2 >= 0.40) plan = 'severe-RDS-and-surfactant-and-vent';
  else if (ga < 32 && FiO2 >= 0.30) plan = 'moderate-RDS-and-surfactant-and-CPAP';
  else if (ga < 34 && surfactant === 'available') plan = 'early-CPAP-and-rescue-surfactant';
  else if (ga >= 34) plan = 'mild-RDS-and-CPAP-only';
  else if (FiO2 < 0.30) plan = 'mild-RDS-and-NC-or-RA';
  else plan = 'standard-RDS';
  return { plan, recommendation: 'neonatal-team-and-surfactant-protocol' };
};

Engine.BPD = function ({ ga = 28, oxygenAt36w = 0.30, ventilationDays = 14 } = {}) {
  let classification;
  if (ga < 28 && oxygenAt36w >= 0.30 && ventilationDays >= 14) classification = 'severe-BPD';
  else if (ga < 30 && oxygenAt36w >= 0.22) classification = 'moderate-BPD';
  else if (ga < 32 && oxygenAt36w >= 0.22) classification = 'mild-BPD';
  else if (oxygenAt36w < 0.22) classification = 'no-BPD';
  else classification = 'unspecified';
  return { classification, recommendation: 'NICU-team-and-steroid-eval' };
};

Engine.ROP = function ({ ga = 28, weeksPostBirth = 4, exam = 'immature', zone = '2', stage = 2 } = {}) {
  let plan;
  if (stage >= 3 && zone === '1' && exam === 'plus-disease') plan = 'type-1-ROP-and-laser-or-anti-VEGF';
  else if (stage >= 2 && zone === '1') plan = 'pre-plus-ROP-and-frequent-eval';
  else if (stage >= 2 && zone === '2') plan = 'stage-2-zone-2-and-eval-2-weeks';
  else if (ga < 30 && weeksPostBirth >= 4) plan = 'screening-ROP-eval';
  else if (exam === 'mature') plan = 'no-ROP-and-discharge-screen';
  else plan = 'standard-ROP-screen';
  return { plan, recommendation: 'pediatric-ophthalmology-and-NICU-team' };
};

Engine.NEOScore = function ({ support = 'CPAP', ga = 30, vasopressor = 'no', nutrition = 'TPN' } = {}) {
  let result;
  if (support === 'vent' && ga < 28 && vasopressor === 'yes') result = 'high-NEOS-and-3-staff';
  else if (support === 'vent' && ga < 32) result = 'high-NEOS-and-2-to-3-staff';
  else if (support === 'CPAP' && ga < 32) result = 'moderate-NEOS-and-2-staff';
  else if (support === 'CPAP' && ga >= 32) result = 'moderate-NEOS-and-1-staff';
  else if (support === 'NC' && ga >= 34) result = 'low-NEOS-and-1-staff';
  else if (nutrition === 'PO') result = 'low-NEOS-and-1-staff';
  else result = 'unspecified';
  return { result, recommendation: 'NICU-staffing-and-acuity' };
};

Engine.SEPSISScreen = function ({ temp = 38.5, hr = 180, wbc = 25, crp = 5, age = 5 } = {}) {
  let classification;
  if (temp >= 38.5 && hr >= 180 && wbc >= 30 && crp >= 5) classification = 'probable-sepsis-and-ABX';
  else if (temp >= 38.5 && crp >= 5) classification = 'suspected-sepsis-and-ABX-eval';
  else if (temp < 36 && crp >= 5) classification = 'hypothermia-and-sepsis-eval';
  else if (age < 7) classification = 'early-onset-and-eval';
  else if (crp < 1) classification = 'low-risk-monitor';
  else classification = 'unspecified';
  return { classification, recommendation: 'ABX-and-eval-and-blood-culture' };
};

Engine.NeuroOutcomes = function ({ apgar5 = 7, hie = 'no', prematurity = 'no', sepsis = 'no', mri = 'normal' } = {}) {
  let plan;
  if (hie === 'severe') plan = 'severe-HIE-and-CP-risk-and-early-intervention';
  else if (prematurity === 'GA-less-than-28') plan = 'extreme-premature-and-NICU-followup';
  else if (hie === 'moderate' && mri === 'abnormal') plan = 'moderate-HIE-and-CP-eval';
  else if (sepsis === 'meningitis' && mri === 'abnormal') plan = 'meningitis-and-HIE-and-eval';
  else if (apgar5 < 4 && hie === 'no') plan = 'low-apgar-and-monitoring';
  else if (hie === 'no' && mri === 'normal') plan = 'standard-neuro-followup';
  else plan = 'standard-followup';
  return { plan, recommendation: 'NICU-followup-and-early-intervention' };
};

Engine.Dehydration = function ({ weightLoss = 8, feeding = 'poor', urineOutput = 'low', sodium = 150 } = {}) {
  let plan;
  if (weightLoss >= 12) plan = 'severe-dehydration-and-IV-bolus';
  else if (weightLoss >= 8 && feeding === 'poor') plan = 'moderate-dehydration-and-OR-or-IVF';
  else if (sodium >= 150) plan = 'hypernatremic-and-correct-slowly';
  else if (weightLoss < 5) plan = 'mild-dehydration-and-OR-or-Lactaid';
  else if (urineOutput === 'low' && feeding === 'poor') plan = 'poor-intake-and-OR';
  else plan = 'standard-eval';
  return { plan, recommendation: 'neonatal-team-and-peds-nephro' };
};

module.exports = Engine;
