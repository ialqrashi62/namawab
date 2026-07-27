// P3-AS: Lab-Specialty Engine — 10 pure functions
const Engine = {};

Engine.TumorMarkerInterpretation = function ({ cea = 2.5, ca125 = 35, psa = 4, afp = 10, ca199 = 37 } = {}) {
  let interpretation;
  if (cea > 5 || ca125 > 200 || psa > 10 || afp > 400 || ca199 > 1000) interpretation = 'markedly-elevated-suspicious-malignancy';
  else if (cea > 3 || ca125 > 35 || psa > 4 || afp > 10 || ca199 > 37) interpretation = 'mildly-elevated-monitor-and-imaging';
  else interpretation = 'within-normal-limits';
  return { interpretation, recommendation: interpretation.includes('suspicious') ? 'imaging-and-oncology' : interpretation.includes('mildly') ? 'repeat-and-imaging' : 'routine' };
};

Engine.CultureSensitivity = function ({ culture = 'blood', organism = 'e.coli', sensitivities = { cipro: 'S', vanco: 'R', pipTazo: 'S' } } = {}) {
  let pathway;
  const sensitive = Object.keys(sensitivities).filter(k => sensitivities[k] === 'S');
  if (sensitive.length === 0) pathway = 'pan-resistant-no-options';
  else if (sensitive.length === 1) pathway = 'XDR-only-one-option-treat-and-monitor';
  else if (organism === 'mrsa' && sensitive.includes('vanco')) pathway = 'MRSA-vanco-susceptible-treat';
  else if (organism === 'pseudomonas' && sensitive.includes('pipTazo')) pathway = 'pseudomonas-pip-tazo-susceptible';
  else pathway = 'multi-sensitive-choose-narrowest';
  return { pathway, recommendation: 'narrow-to-pathogen-directed' };
};

Engine.CriticalValue = function ({ value = 0, test = 'potassium', age = 50 } = {}) {
  let critical;
  if (test === 'potassium' && (value < 2.5 || value > 6.5)) critical = 'critical-call-immediately';
  else if (test === 'sodium' && (value < 120 || value > 160)) critical = 'critical-call-immediately';
  else if (test === 'glucose' && (value < 40 || value > 500)) critical = 'critical-call-immediately';
  else if (test === 'calcium' && (value < 6 || value > 13)) critical = 'critical-call-immediately';
  else if (test === 'hemoglobin' && value < 7) critical = 'critical-call-immediately';
  else if (test === 'platelets' && value < 20) critical = 'critical-call-immediately';
  else if (test === 'inr' && value > 5) critical = 'critical-call-immediately';
  else critical = 'within-normal-range-no-critical';
  return { critical, recommendation: critical.includes('immediately') ? 'call-and-document-time' : 'routine' };
};

Engine.CoagulationInterpretation = function ({ pt = 12, inr = 1.0, ptt = 30, fibrinogen = 300, dDimer = 0.3 } = {}) {
  let interpretation;
  if (inr >= 5 || pt >= 30) interpretation = 'severe-coagulopathy-FFP-and-vitamin-K';
  else if (inr >= 1.5 || pt >= 15) interpretation = 'mild-coagulopathy-monitor-or-FFP';
  else if (ptt >= 40 && inr < 1.2) interpretation = 'isolated-PTT-prolongation-mixing-study';
  else if (fibrinogen < 100 && dDimer > 1.0) interpretation = 'DIC-cryo-and-FFP';
  else if (dDimer > 1.0) interpretation = 'D-dimer-elevated-evaluate-DVT-or-PE';
  else interpretation = 'normal-coagulation';
  return { interpretation, recommendation: interpretation.includes('DIC') || interpretation.includes('severe') ? 'treat-and-monitor' : 'monitor' };
};

Engine.HepaticFunctionPanel = function ({ alt = 30, ast = 30, alp = 80, bilirubin = 0.8, albumin = 4.0 } = {}) {
  let pattern;
  const altAstRatio = alt / ast;
  if (alt > 1000 || ast > 1000) pattern = 'acute-hepatocellular-injury';
  else if (alt > 200 && altAstRatio > 2) pattern = 'viral-or-drug-induced-hepatitis';
  else if (alt > 200 && altAstRatio <= 2) pattern = 'alcoholic-hepatitis';
  else if (alp > 400 && bilirubin > 4) pattern = 'cholestatic-or-obstructive';
  else if (alt > 50 && alt < 200) pattern = 'mild-hepatic-injury';
  else pattern = 'normal';
  return { pattern, recommendation: pattern.includes('acute') || pattern.includes('cholestatic') ? 'workup-and-imaging' : 'monitor' };
};

Engine.RenalFunctionTrend = function ({ cr1 = 1.0, cr2 = 1.5, cr3 = 2.0, hours = 48, urineOutput = 50, weight = 70 } = {}) {
  let trend;
  const crRise = cr3 - cr1;
  const ratePerDay = crRise / (hours / 24);
  if (crRise >= 0.3 && hours <= 48) trend = 'AKI-stage-1-2-or-3-rapid-rise';
  else if (crRise >= 0.5) trend = 'acute-kidney-injury';
  else if (urineOutput < 0.5 * weight && hours >= 6) trend = 'oliguria-AKI-stage-2-or-3';
  else if (urineOutput < 0.3 * weight && hours >= 24) trend = 'anuria-AKI-stage-3';
  else if (ratePerDay > 0.5) trend = 'rapid-AKI';
  else trend = 'stable-CKD-or-normal';
  return { trend, recommendation: trend.includes('AKI') ? 'nephrology-consult-and-monitor' : 'monitor' };
};

Engine.CardiacBiomarker = function ({ troponin = 0.0, delta = 0, ck = 100, bnp = 100 } = {}) {
  let interpretation;
  if (troponin > 0.5 && delta > 0.1) interpretation = 'acute-MI-elevated-and-rising';
  else if (troponin > 0.5 && delta < 0.1) interpretation = 'elevated-chronic-elevation';
  else if (troponin > 0.1 && delta > 0.05) interpretation = 'acute-coronary-syndrome';
  else if (bnp > 500) interpretation = 'elevated-BNP-heart-failure';
  else if (bnp > 100 && bnp <= 500) interpretation = 'borderline-BNP';
  else if (troponin < 0.04) interpretation = 'normal-troponin';
  else interpretation = 'borderline-elevated';
  return { interpretation, recommendation: interpretation.includes('MI') || interpretation.includes('ACS') ? 'cardiology-and-ACS-pathway' : interpretation.includes('failure') ? 'heart-failure-workup' : 'monitor' };
};

Engine.CBCInterpretation = function ({ hemoglobin = 14, wbc = 8, platelets = 250, neutrophils = 60, lymphocytes = 30 } = {}) {
  let interpretation;
  if (hemoglobin < 7) interpretation = 'severe-anemia-transfuse';
  else if (hemoglobin < 10) interpretation = 'moderate-anemia-workup';
  else if (wbc < 1) interpretation = 'severe-neutropenia-isolation';
  else if (wbc > 30) interpretation = 'leukocytosis-evaluate-leukemia-or-severe-infection';
  else if (platelets < 20) interpretation = 'severe-thrombocytopenia-transfuse';
  else if (platelets < 50) interpretation = 'moderate-thrombocytopenia-monitor';
  else if (neutrophils < 1) interpretation = 'neutropenia-isolation';
  else interpretation = 'within-normal-limits';
  return { interpretation, recommendation: interpretation.includes('severe') ? 'transfuse-or-isolate' : interpretation.includes('moderate') ? 'workup' : 'routine' };
};

Engine.MicrobiologyGramStain = function ({ gramStain = 'gram-positive', morphology = 'cocci-in-clusters', source = 'wound' } = {}) {
  let interpretation;
  if (gramStain === 'gram-positive' && morphology === 'cocci-in-clusters') interpretation = 'staph-aureus-suspected-MRSA-cover-pending-culture';
  else if (gramStain === 'gram-positive' && morphology === 'cocci-in-chains') interpretation = 'streptococcus-or-enterococcus-cover-with-ampicillin';
  else if (gramStain === 'gram-negative' && morphology === 'cocci') interpretation = 'neisseria-or-meningococcus-cover-with-ceftriaxone';
  else if (gramStain === 'gram-negative' && morphology === 'rods') interpretation = 'enterobacteriaceae-or-pseudomonas-cover-with-pipTazo';
  else if (gramStain === 'yeast') interpretation = 'candida-cover-with-fluconazole-or-echinocandin';
  else if (gramStain === 'no-organism-seen') interpretation = 'no-organism-empiric-therapy';
  else interpretation = 'unspecified-manual-review';
  return { interpretation, recommendation: 'empiric-therapy-while-awaiting-culture' };
};

Engine.BloodCultureInterpretation = function ({ bottle1 = 'negative', bottle2 = 'negative', timeToPositive = 0, organism = 'none', contaminantSuspected = false } = {}) {
  let interpretation;
  if (bottle1 === 'positive' && bottle2 === 'positive' && !contaminantSuspected) interpretation = 'true-bacteremia-treat-fully';
  else if (bottle1 === 'positive' && bottle2 === 'negative') interpretation = 'one-of-two-possible-contaminant-or-true';
  else if (bottle1 === 'positive' && timeToPositive < 24) interpretation = 'rapid-true-bacteremia';
  else if (bottle1 === 'negative' && bottle2 === 'negative') interpretation = 'no-growth-48-hours-or-final';
  else interpretation = 'unspecified';
  return { interpretation, recommendation: interpretation.includes('bacteremia') ? 'treat-and-ID-consult' : interpretation.includes('contaminant') ? 'consider-contaminant-and-repeat' : 'monitor' };
};

module.exports = Engine;
