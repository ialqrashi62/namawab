'use strict';
// Heme Engine: 10 pure deterministic functions
// Compliance: ASH, NCCN, ASCO, ITP-ASH, DIC-ISTH, HIT-4T

function CoagulopathyPanel({ pt, ptt, plt, fibrinogen, dDimer }) {
  const items = [];
  if (pt > 14) items.push('PT prolonged');
  if (ptt > 35) items.push('PTT prolonged');
  if (plt < 150) items.push('Thrombocytopenia');
  if (fibrinogen < 200) items.push('Hypofibrinogenemia');
  if (dDimer > 500) items.push('Elevated D-dimer');
  let interpretation;
  if (items.length === 0) interpretation = 'normal';
  else if (items.includes('PT prolonged') && items.includes('PTT prolonged') && items.includes('Thrombocytopenia') && items.includes('Hypofibrinogenemia')) interpretation = 'DIC-like';
  else if (items.length === 1) interpretation = 'mild abnormality';
  else interpretation = 'multi-factorial';
  return { abnormalities: items, interpretation };
}

function AnemiaWorkup({ hgb, mcv, reticPct, ferritin, tibc, transferrinSat }) {
  const microcytic = mcv < 80;
  const normocytic = mcv >= 80 && mcv <= 100;
  const macrocytic = mcv > 100;
  const ironDef = ferritin < 30 || (ferritin < 100 && transferrinSat < 20);
  const anemiaChronic = tibc < 250 && transferrinSat > 20 && ferritin > 100;
  const reticLow = reticPct < 2;
  const reticHigh = reticPct > 2;
  let classification;
  if (!ironDef && !anemiaChronic) {
    if (normocytic && reticLow) classification = 'anemia of chronic disease (normocytic)';
    else if (normocytic && reticHigh) classification = 'hemolysis suspected';
    else if (macrocytic) classification = 'macrocytic anemia';
    else classification = 'other';
  } else if (ironDef) {
    classification = microcytic ? 'iron deficiency anemia' : 'early iron deficiency';
  } else {
    classification = 'anemia of chronic disease';
  }
  return { microcytic, normocytic, macrocytic, ironDeficient: ironDef, chronicDisease: anemiaChronic, classification };
}

function SickleCellCrisis({ hgb, reticPct, haptoglobin, totalBilirubin, hasChestPain, hasFever }) {
  const hemolysis = haptoglobin < 30 && totalBilirubin > 2;
  const marrowResponse = reticPct > 3;
  const acuteChest = hasChestPain && hasFever;
  let classification;
  let severity = 'mild';
  if (acuteChest) { classification = 'acute chest syndrome'; severity = 'critical'; }
  else if (hgb < 7) { classification = 'severe hemolytic crisis'; severity = 'severe'; }
  else if (hemolysis) { classification = 'vaso-occlusive + hemolysis'; severity = 'moderate'; }
  else { classification = 'vaso-occlusive crisis'; }
  return { hemolysis, marrowResponse, acuteChest, classification, severity };
}

function HemophiliaSeverity({ factorVIII, factorIX, bleedingHistory, ageMonths }) {
  if (ageMonths < 6) return { severe: false, reason: 'too young to characterize' };
  const f8 = factorVIII || 100;
  const f9 = factorIX || 100;
  const lowest = Math.min(f8, f9);
  let severity;
  if (lowest < 1) severity = 'severe';
  else if (lowest < 5) severity = 'moderate';
  else if (lowest < 40) severity = 'mild';
  else severity = 'normal';
  return { severity, deficientFactor: f8 < f9 ? 'VIII' : 'IX', factorVIII: f8, factorIX: f9 };
}

function ITPScore({ plt, bleeding, infection, drugInduced }) {
  if (drugInduced) return { likelyImmune: false, reason: 'drug-induced thrombocytopenia' };
  if (plt < 20 && bleeding) return { likelyImmune: true, severity: 'severe', action: 'IVIG + steroids' };
  if (plt < 50) return { likelyImmune: true, severity: 'moderate', action: 'steroids' };
  if (plt < 100 && infection) return { likelyImmune: false, reason: 'infectious thrombocytopenia' };
  return { likelyImmune: false, reason: 'workup needed' };
}

function DICAgain({ pt, ptt, plt, fibrinogen, dDimer, infection, malignancy }) {
  let score = 0;
  if (plt < 50) score += 2; else if (plt < 100) score += 1;
  if (dDimer > 1000) score += 2; else if (dDimer > 500) score += 1;
  if (fibrinogen < 100) score += 1;
  if (pt > 14) score += 1;
  if (ptt > 35) score += 1;
  if (infection || malignancy) score += 2;
  let interpretation;
  if (score >= 5) interpretation = 'overt DIC';
  else if (score >= 3) interpretation = 'DIC suggestive';
  else interpretation = 'DIC unlikely';
  return { score, interpretation, riskFactors: { infection, malignancy } };
}

function HIT4T({ pltDropPct, timingDays, thrombosis, otherCauses }) {
  let points = 0;
  if (pltDropPct > 50) points += 2; else if (pltDropPct > 30) points += 1;
  if (timingDays >= 5 && timingDays <= 10) points += 2;
  else if (timingDays > 10 && timingDays <= 14) points += 1;
  if (thrombosis) points += 1;
  if (!otherCauses) points += 2; else if (otherCauses < 2) points += 1;
  let probability;
  if (points >= 6) probability = 'high';
  else if (points >= 4) probability = 'intermediate';
  else probability = 'low';
  return { points, probability, action: probability === 'high' ? 'stop heparin, start argatroban' : 'consider alternative' };
}

function ThalassemiaClassification({ mcv, mch, hgbA2, hgbF, ferritin, ageYears }) {
  if (ferritin < 30) return { diagnosis: 'iron deficiency (not thalassemia)', needGenetic: false };
  if (hgbA2 > 3.5) return { diagnosis: 'beta-thalassemia trait', beta: true, needGenetic: true };
  if (hgbF > 2) return { diagnosis: 'delta-beta or hereditary persistence of HbF', needGenetic: true };
  if (mcv < 75 && mch < 25) return { diagnosis: 'alpha-thalassemia trait (suspected)', needGenetic: true };
  return { diagnosis: 'workup needed', needGenetic: true };
}

function TransfusionThreshold({ hgb, age, hasCardiac, activeBleeding }) {
  if (activeBleeding) return { transfuse: true, target: 8.0, threshold: 8.0, reason: 'active bleeding' };
  if (hasCardiac) return { transfuse: hgb < 8.0, target: 9.0, threshold: 8.0, reason: 'cardiac' };
  if (age < 1) return { transfuse: hgb < 11.0, target: 12.0, threshold: 11.0, reason: 'neonate' };
  if (age > 65) return { transfuse: hgb < 8.0, target: 9.0, threshold: 8.0, reason: 'elderly' };
  return { transfuse: hgb < 7.0, target: 8.0, threshold: 7.0, reason: 'restrictive strategy' };
}

function BleedingScore({ plt, hasMucosal, hasCNS, fibrinogen, weightKg }) {
  let grade = 0;
  if (hasCNS) grade = 4;
  else if (hasMucosal) grade = 2;
  if (plt < 20) grade = Math.max(grade, 3);
  if (fibrinogen < 100) grade = Math.max(grade, 2);
  let action;
  if (grade >= 4) action = 'platelet + cryoprecipitate immediate';
  else if (grade >= 3) action = 'platelet transfusion';
  else if (grade >= 2) action = 'consider platelet';
  else action = 'monitor';
  return { grade, action };
}

module.exports = {
  CoagulopathyPanel, AnemiaWorkup, SickleCellCrisis, HemophiliaSeverity,
  ITPScore, DICAgain, HIT4T, ThalassemiaClassification,
  TransfusionThreshold, BleedingScore,
};
