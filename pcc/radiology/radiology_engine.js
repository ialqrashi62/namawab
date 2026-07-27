'use strict';
// Radiology Engine: 10 pure deterministic functions
// Compliance: ACR, BI-RADS, Lung-RADS, TI-RADS, Fleischner, O-RADS, RADS systems

function BIRADS({ mass, calcifications, asymmetry, architecturalDistortion, skinChanges, nippleChanges, lymphNodes }) {
  let cat;
  if (skinChanges === 'peau-orange' || nippleChanges === 'retraction' || lymphNodes === 'palpable') cat = 5;
  else if (mass === 'spiculated' || calcifications === 'pleomorphic-clustered' || architecturalDistortion) cat = 4;
  else if (calcifications === 'amorphous' || asymmetry === 'developing' || mass === 'indistinct') cat = 3;
  else if (mass === 'circumscribed-solid' || calcifications === 'round-scattered') cat = 2;
  else cat = 1;
  const rec = cat === 0 ? 'incomplete' : cat === 1 ? 'routine screening' : cat === 2 ? '6mo short interval' : cat === 3 ? '6mo + biopsy' : cat === 4 ? 'biopsy' : 'biopsy + oncology';
  return { birads: cat, recommendation: rec, malignancyRisk: cat === 1 ? 0.1 : cat === 2 ? 0.5 : cat === 3 ? 2 : cat === 4 ? 30 : cat === 5 ? 95 : 0 };
}

function LungRADS({ noduleType, sizeMm, solid, spiculation, upperLobe, growth }) {
  let cat;
  if (sizeMm >= 30) cat = 5;
  else if (sizeMm >= 15 && spiculation) cat = 4;
  else if (sizeMm >= 8 && growth) cat = 4;
  else if (sizeMm >= 8 && solid && upperLobe) cat = 3;
  else if (sizeMm >= 6 && solid) cat = 2;
  else if (sizeMm >= 4) cat = 2;
  else cat = 1;
  const rec = cat === 1 ? '12mo CT' : cat === 2 ? '6mo CT' : cat === 3 ? '3mo CT or PET' : cat === 4 ? 'PET + biopsy' : 'definitive treatment';
  return { lungRADS: cat, sizeMm, solid, spiculation, recommendation: rec, malignancyRisk: cat === 1 ? 1 : cat === 2 ? 5 : cat === 3 ? 15 : cat === 4 ? 50 : 95 };
}

function TIRADS({ composition, echogenicity, shape, margin, echogenicFoci }) {
  let tr = 0, components = 0;
  if (composition === 'solid') { tr += 2; components += 2; }
  else if (composition === 'mixed') { tr += 1; components += 1; }
  if (echogenicity === 'marked-hypoechoic') { tr += 2; components += 2; }
  else if (echogenicity === 'hypoechoic') { tr += 1; components += 1; }
  if (shape === 'taller-than-wide') { tr += 3; components += 3; }
  if (margin === 'irregular' || margin === 'microlobulated') { tr += 2; components += 2; }
  if (echogenicFoci === 'microcalcifications') { tr += 3; components += 3; }
  else if (echogenicFoci === 'macrocalcifications') { tr += 1; components += 1; }
  let acrTI = components >= 7 ? 'TR5' : components >= 4 ? 'TR4' : components >= 1 ? 'TR3' : 'TR2';
  const rec = acrTI === 'TR5' ? 'FNA >= 1cm' : acrTI === 'TR4' ? 'FNA >= 1.5cm' : acrTI === 'TR3' ? 'follow-up' : 'no FNA';
  return { points: tr, acrTI, recommendation: rec, components };
}

function FleischnerPulmonaryNodule({ sizeMm, solid, upperLobe, spiculation, age, smoking, multiple, growth }) {
  if (sizeMm < 6) return { risk: 'low', recommendation: 'no routine follow-up' };
  if (!solid) {
    if (sizeMm < 6) return { risk: 'low', recommendation: 'no follow-up' };
    if (sizeMm < 8) return { risk: 'low', recommendation: 'CT 6-12mo' };
    if (sizeMm >= 8) return { risk: 'intermediate', recommendation: 'CT 3-6mo then 18-24mo' };
  }
  if (sizeMm < 6) {
    if (upperLobe && spiculation) return { risk: 'intermediate', recommendation: 'optional CT 12mo' };
    return { risk: 'low', recommendation: 'no routine follow-up' };
  }
  if (sizeMm < 8) {
    if (upperLobe || spiculation) return { risk: 'intermediate', recommendation: 'CT 6-12mo' };
    return { risk: 'low', recommendation: 'CT 12mo optional' };
  }
  if (sizeMm < 30) return { risk: 'intermediate', recommendation: 'CT 3mo or PET/biopsy' };
  return { risk: 'high', recommendation: 'biopsy or resection' };
}

function PIRADS({ peripheralZoneScore, transitionZoneScore, lesionalSizeMm, prostateVolumeMl, psad }) {
  const score = Math.max(peripheralZoneScore || 0, transitionZoneScore || 0);
  const pi = score <= 2 ? 2 : score === 3 ? 3 : score === 4 ? 4 : 5;
  return { pirads: pi, sizeMm: lesionalSizeMm, prostateVolumeMl, psad, recommendation: pi <= 2 ? 'no biopsy' : pi === 3 ? 'shared decision' : 'biopsy' };
}

function CADRADS({ stenosis, plaque, calciumScoreAgatston, symptoms, age }) {
  let cat;
  if (stenosis >= 70) cat = 4;
  else if (stenosis >= 50) cat = 3;
  else if (plaque && calciumScoreAgatston >= 100) cat = 2;
  else if (plaque || calciumScoreAgatston >= 100) cat = 1;
  else cat = 0;
  const mod = age >= 60 ? 'consider functional' : '';
  return { cadRADS: cat, stenosis, calciumScore: calciumScoreAgatston, recommendation: cat === 0 ? 'no further workup' : cat === 1 ? 'risk-factor management' : cat === 2 ? 'consider stress test' : cat === 3 ? 'consider ICA' : 'ICA + revascularization', modifier: mod };
}

function LIRADSCategories({ massSizeMm, apheOnArterial, washout, thresholdGrowth, tumorInVein, afp, mildMass }) {
  let cat;
  if (tumorInVein) cat = 5;
  else if (massSizeMm >= 20 && (apheOnArterial === 'non-rim-APHE' || washout === 'non-peripheral')) cat = 5;
  else if (massSizeMm >= 20 && apheOnArterial === 'non-rim-APHE') cat = 4;
  else if (massSizeMm >= 20 && (apheOnArterial || thresholdGrowth)) cat = 4;
  else if (massSizeMm >= 20 && mildMass) cat = 3;
  else if (massSizeMm >= 10 && apheOnArterial) cat = 3;
  else if (massSizeMm < 10) cat = 2;
  else cat = 1;
  const rec = cat === 1 ? 'no routine' : cat === 2 ? '6mo CT/MRI' : cat === 3 ? '3-6mo or biopsy' : cat === 4 ? 'biopsy' : 'definitive Tx';
  return { lirads: cat, rec, afp };
}

function MammographyRecall({ birads0, birads3, birads4, birads5, additionalViewsNeeded, comparisonStudies }) {
  const total = Math.max(1, birads0 + birads3 + birads4 + birads5);
  const rate = birads0 / total;
  const ppv = birads5 / Math.max(1, birads4 + birads5);
  return { recallRate: rate, ppv4_5: ppv, additionalViewsNeeded, recommendation: rate > 0.10 ? 'review screening protocols' : 'within target' };
}

function TraumaFAST({ freeFluidRUQ, freeFluidLUQ, freeFluidPelvis, freeFluidPericardial, pneumothorax, pleuralFluid }) {
  const posFast = freeFluidRUQ || freeFluidLUQ || freeFluidPelvis;
  const pericardialEffusion = freeFluidPericardial;
  let injury;
  if (pericardialEffusion) injury = 'cardiac tamponade suspected';
  else if (posFast) injury = 'intra-abdominal hemorrhage';
  else if (pneumothorax) injury = 'pneumothorax';
  else if (pleuralFluid) injury = 'hemothorax';
  return { positive: !!(posFast || pericardialEffusion), pericardialEffusion, intraAbdominal: posFast, injury };
}

function ContrastNephropathyRisk({ baselineCr, egfr, age, diabetes, heartFailure, contrastVolume, dehydration }) {
  let risk = 0;
  if (egfr < 30) risk += 3; else if (egfr < 45) risk += 2; else if (egfr < 60) risk += 1;
  if (age >= 75) risk += 1;
  if (diabetes) risk += 1;
  if (heartFailure) risk += 1;
  if (contrastVolume > 100) risk += 1;
  if (dehydration) risk += 1;
  let category;
  if (risk >= 5) category = 'very-high';
  else if (risk >= 3) category = 'high';
  else if (risk >= 1) category = 'moderate';
  else category = 'low';
  return { risk, category, recommendation: risk >= 3 ? 'prophylaxis + iso-osmolar contrast' : 'standard hydration' };
}

module.exports = {
  BIRADS, LungRADS, TIRADS, FleischnerPulmonaryNodule, PIRADS,
  CADRADS, LIRADSCategories, MammographyRecall, TraumaFAST, ContrastNephropathyRisk,
};
