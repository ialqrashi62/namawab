'use strict';
// Lab Engine: 10 pure deterministic functions
// Compliance: CLSI, CAP, AACC, IFCC

function CriticalValue({ analyte, value, units, age }) {
  const limits = {
    potassium: { low: 2.5, high: 6.5, units: 'mEq/L' },
    sodium: { low: 120, high: 160, units: 'mEq/L' },
    glucose: { low: 40, high: 500, units: 'mg/dL' },
    hgb: { low: 6, high: 21, units: 'g/dL' },
    calcium: { low: 6, high: 13, units: 'mg/dL' },
    magnesium: { low: 1.0, high: 4.5, units: 'mg/dL' },
    inr: { low: 0.5, high: 5.0, units: 'ratio' },
    plt: { low: 20, high: 1000, units: 'K/uL' },
  };
  const lim = limits[analyte];
  if (!lim) return { critical: false, reason: 'unknown analyte' };
  if (value < lim.low) return { critical: true, direction: 'low', value, threshold: lim.low, action: 'call provider immediately' };
  if (value > lim.high) return { critical: true, direction: 'high', value, threshold: lim.high, action: 'call provider immediately' };
  return { critical: false, value, reference: [lim.low, lim.high] };
}

function HemolysisCheck({ potassium, ldh, haptoglobin, hgb, reticPct }) {
  const markers = [];
  if (potassium > 5.5) markers.push('hyperkalemia');
  if (ldh > 250) markers.push('LDH elevated');
  if (haptoglobin < 30) markers.push('low haptoglobin');
  if (hgb < 10) markers.push('anemia');
  if (reticPct > 2) markers.push('reticulocytosis');
  let classification;
  if (markers.length >= 3) classification = 'hemolysis likely';
  else if (markers.length >= 1) classification = 'hemolysis possible';
  else classification = 'no hemolysis';
  return { markers, classification };
}

function CoagProfile({ pt, ptt, inr, fibrinogen, dDimer, mixingStudy }) {
  const ptElev = pt > 14;
  const pttElev = ptt > 35;
  const inrHigh = inr > 1.2;
  const fibLow = fibrinogen < 200;
  const ddHigh = dDimer > 500;
  let interpretation;
  if (ptElev && pttElev) {
    if (mixingStudy === 'corrects') interpretation = 'factor deficiency';
    else if (mixingStudy === 'no-correction') interpretation = 'inhibitor present';
    else interpretation = 'mixing study pending';
  } else if (ptElev) interpretation = 'extrinsic pathway';
  else if (pttElev) interpretation = 'intrinsic pathway';
  else if (fibLow && ddHigh) interpretation = 'DIC screen positive';
  else interpretation = 'normal';
  return { ptElev, pttElev, inrHigh, fibLow, ddHigh, interpretation };
}

function ABGAnalysis({ ph, pco2, hco3, pao2, fio2 }) {
  const acidemia = ph < 7.35;
  const alkalemia = ph > 7.45;
  let primary = 'normal';
  let compensation = 'none';
  if (acidemia) {
    if (hco3 < 22) primary = 'metabolic acidosis';
    else if (pco2 > 45) primary = 'respiratory acidosis';
    else primary = 'mixed';
  } else if (alkalemia) {
    if (hco3 > 26) primary = 'metabolic alkalosis';
    else if (pco2 < 35) primary = 'respiratory alkalosis';
    else primary = 'mixed';
  }
  const pfRatio = pao2 / fio2;
  let oxygenation = 'normal';
  if (pfRatio < 100) oxygenation = 'severe hypoxemia (ARDS)';
  else if (pfRatio < 200) oxygenation = 'moderate hypoxemia';
  else if (pfRatio < 300) oxygenation = 'mild hypoxemia';
  return { acidemia, alkalemia, primary, oxygenation, pfRatio };
}

function TumorMarkerTrend({ marker, priorValue, currentValue, intervalDays }) {
  if (!priorValue) return { trend: 'baseline', deltaPct: 0 };
  const deltaPct = ((currentValue - priorValue) / priorValue) * 100;
  let trend;
  if (Math.abs(deltaPct) < 10) trend = 'stable';
  else if (deltaPct > 50) trend = 'rising significantly';
  else if (deltaPct > 20) trend = 'rising';
  else if (deltaPct < -50) trend = 'falling significantly';
  else if (deltaPct < -20) trend = 'falling';
  else trend = 'stable';
  const isLikely = (marker === 'CEA' || marker === 'CA 19-9' || marker === 'PSA') && trend.startsWith('rising');
  return { trend, deltaPct, priorValue, currentValue, intervalDays, isLikelyProgression: isLikely };
}

function MicrobeSusceptibility({ organism, sensitivities, antibiotic, isResistance, source }) {
  if (!sensitivities[antibiotic]) return { susceptible: false, reason: 'not in panel' };
  if (sensitivities[antibiotic] === 'S') return { susceptible: true, recommendation: 'first-line' };
  if (sensitivities[antibiotic] === 'I') return { susceptible: 'intermediate', recommendation: 'consider if max dose' };
  if (sensitivities[antibiotic] === 'R') return { susceptible: false, recommendation: 'avoid' };
  return { susceptible: false, reason: 'unknown' };
}

function BMPAbnormalities({ na, k, cl, hco3, bun, cr, glucose, ca }) {
  const abn = [];
  if (na < 135 || na > 145) abn.push({ analyte: 'Na', value: na });
  if (k < 3.5 || k > 5.0) abn.push({ analyte: 'K', value: k });
  if (cl < 98 || cl > 107) abn.push({ analyte: 'Cl', value: cl });
  if (hco3 < 22 || hco3 > 29) abn.push({ analyte: 'HCO3', value: hco3 });
  if (bun > 20) abn.push({ analyte: 'BUN', value: bun });
  if (cr > 1.3) abn.push({ analyte: 'Cr', value: cr });
  if (glucose < 70 || glucose > 200) abn.push({ analyte: 'Glucose', value: glucose });
  if (ca < 8.5 || ca > 10.5) abn.push({ analyte: 'Ca', value: ca });
  const anionGap = na - (cl + hco3);
  let agInterpret = 'normal';
  if (anionGap > 12) agInterpret = 'elevated';
  return { abnormalities: abn, count: abn.length, anionGap, agInterpret };
}

function LiverProfile({ ast, alt, alp, ggt, tbili, albumin, pt }) {
  const hepatocellular = alt > ast && alt > 5 * 40;
  const cholestatic = alp > 2 * 120 || ggt > 2 * 50;
  let pattern = 'normal';
  if (hepatocellular) pattern = 'hepatocellular';
  else if (cholestatic) pattern = 'cholestatic';
  const synthetic = albumin < 3.0 || pt > 14;
  let severity = 'mild';
  if (synthetic) severity = 'severe (synthetic dysfunction)';
  else if (alt > 1000) severity = 'severe (massive elevation)';
  return { pattern, synthetic, severity, tbili };
}

function LipidProfile({ ldl, hdl, tg, totalChol }) {
  const ldlOptimal = ldl < 100;
  const hdlLow = hdl < 40;
  const tgHigh = tg > 150;
  const totalHigh = totalChol > 200;
  const ascvdRisk = ldl >= 190 || (ldl >= 70 && tg >= 200) || (hdlLow && totalHigh);
  let plan = 'lifestyle';
  if (ascvdRisk) plan = 'statin (high-intensity)';
  else if (ldlOptimal && !hdlLow) plan = 'continue lifestyle';
  return { ldlOptimal, hdlLow, tgHigh, totalHigh, plan };
}

function SampleRejection({ hemolysisIndex, lipemiaIndex, icterusIndex, clottingPresent, volumeMl, requiredMl }) {
  const reasons = [];
  if (hemolysisIndex > 100) reasons.push('hemolyzed');
  if (lipemiaIndex > 200) reasons.push('lipemic');
  if (icterusIndex > 100) reasons.push('icteric');
  if (clottingPresent) reasons.push('clotted');
  if (volumeMl < requiredMl) reasons.push('insufficient volume');
  return { reject: reasons.length > 0, reasons, canReport: reasons.length === 0 };
}

module.exports = {
  CriticalValue, HemolysisCheck, CoagProfile, ABGAnalysis, TumorMarkerTrend,
  MicrobeSusceptibility, BMPAbnormalities, LiverProfile, LipidProfile, SampleRejection,
};
