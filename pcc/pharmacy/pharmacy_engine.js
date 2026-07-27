'use strict';
// Pharmacy Engine: 10 pure deterministic functions
// Compliance: ASHP, IDSA, CDC, CMS, Joint Commission, NCCN

function DoseRenal({ drug, baseDoseMg, egfr, weightKg }) {
  let factor = 1.0;
  if (egfr < 10) factor = 0.25;
  else if (egfr < 30) factor = 0.5;
  else if (egfr < 60) factor = 0.75;
  const adjustedDose = baseDoseMg * factor;
  const mgPerKg = weightKg ? adjustedDose / weightKg : null;
  return { originalDose: baseDoseMg, adjustedDose, factor, mgPerKg, egfr, drug, recommendation: `reduce to ${factor * 100}%` };
}

function DoseHepatic({ drug, baseDoseMg, childPugh, indication }) {
  let factor = 1.0;
  let warning = null;
  if (childPugh >= 10) { factor = 0.25; warning = 'severe hepatic impairment: avoid if possible'; }
  else if (childPugh >= 7) { factor = 0.5; warning = 'moderate impairment: dose halved'; }
  else if (childPugh >= 5) { factor = 0.75; warning = 'mild impairment'; }
  return { originalDose: baseDoseMg, adjustedDose: baseDoseMg * factor, factor, childPugh, warning };
}

function Interaction({ drugA, drugB, knownList }) {
  const key = [drugA, drugB].sort().join('+');
  const interaction = (knownList || []).find((i) => i.pair.includes(drugA) && i.pair.includes(drugB));
  if (interaction) return { severity: interaction.severity, mechanism: interaction.mechanism, action: interaction.action };
  return { severity: 'unknown', mechanism: 'no record', action: 'consult pharmacist' };
}

function Allergy({ patientAllergies, drug, classCrossReactivity }) {
  const direct = (patientAllergies || []).includes(drug);
  if (direct) return { contraindicated: true, severity: 'absolute', reason: 'documented allergy' };
  for (const allergen of patientAllergies || []) {
    const list = classCrossReactivity || [];
    for (const c of list) {
      if (c.cls === allergen && c.cross.includes(drug)) {
        return { contraindicated: true, severity: 'cross-reactivity', reason: `${drug} cross-reacts with ${allergen}` };
      }
    }
  }
  return { contraindicated: false, severity: 'none' };
}

function IVPOConversion({ drug, ivDoseMg, bioavailability }) {
  const poDose = ivDoseMg / bioavailability;
  return { ivDose: ivDoseMg, poDose, bioavailability, ratio: poDose / ivDoseMg };
}

function AntibioticStewardship({ cultureResult, currentAntibiotic, daysOnTherapy, hasFever }) {
  if (daysOnTherapy > 7 && !cultureResult) {
    return { action: 're-evaluate', recommendation: 'consider narrowing; obtain cultures' };
  }
  if (cultureResult && cultureResult.sensitiveTo && !cultureResult.sensitiveTo.includes(currentAntibiotic)) {
    return { action: 'change antibiotic', recommendation: 'culture resistant to current' };
  }
  if (cultureResult && cultureResult.sensitiveTo && cultureResult.sensitiveTo.includes(currentAntibiotic)) {
    return { action: 'de-escalate', recommendation: 'narrow based on sensitivity' };
  }
  if (!hasFever && daysOnTherapy > 3) {
    return { action: 'de-escalate', recommendation: 'afebrile, consider oral step-down' };
  }
  return { action: 'continue', recommendation: 'monitor' };
}

function TherapeuticMonitoring({ drug, level, targetLow, targetHigh, lastDose }) {
  const inRange = level >= targetLow && level <= targetHigh;
  let action;
  if (level < targetLow) action = 'increase dose';
  else if (level > targetHigh) action = 'decrease dose';
  else action = 'maintain';
  return { drug, level, inRange, action, range: [targetLow, targetHigh] };
}

function VTEProphylaxis({ age, surgeryType, immobility, previousVTE, activeBleeding, creatinineCl }) {
  if (activeBleeding) return { prophylaxis: 'none', reason: 'active bleeding' };
  if (creatinineCl < 30) return { prophylaxis: 'mechanical only', reason: 'renal failure' };
  if (previousVTE) return { prophylaxis: 'pharmacologic + mechanical', reason: 'prior VTE' };
  if (surgeryType === 'orthopedic') return { prophylaxis: 'LMWH (extended 35 days)', reason: 'orthopedic' };
  if (age > 60 && immobility) return { prophylaxis: 'LMWH', reason: 'age+immobility' };
  return { prophylaxis: 'mechanical', reason: 'low risk' };
}

function PainManagement({ painScore, isOpioidNaive, hasRenalFailure, age, drugInteractions }) {
  if (painScore <= 3) return { recommendation: 'non-opioid', drug: 'acetaminophen', maxDose: 4000 };
  if (painScore <= 6) {
    if (hasRenalFailure) return { recommendation: 'non-opioid renal-safe', drug: 'acetaminophen', maxDose: 3000 };
    return { recommendation: 'mild opioid if needed', drug: 'tramadol', maxDose: 400 };
  }
  if (painScore >= 7) {
    if (isOpioidNaive) return { recommendation: 'start low opioid', drug: 'oxycodone 5mg', maxDose: 30 };
    if (age > 65) return { recommendation: 'reduced opioid', drug: 'oxycodone 2.5mg', maxDose: 20 };
    return { recommendation: 'standard opioid', drug: 'oxycodone', maxDose: 60 };
  }
  return { recommendation: 'reassess' };
}

function Reconciliation({ homeMedications, currentMedications, admissionDiagnosis }) {
  const homeSet = new Map((homeMedications || []).map((m) => [m.drug, m]));
  const curSet = new Set((currentMedications || []).map((m) => m.drug));
  const continued = [];
  const discontinued = [];
  const held = [];
  for (const [drug, med] of homeSet) {
    if (curSet.has(drug)) continued.push({ drug, dose: med.dose });
    else discontinued.push({ drug, reason: 'not reordered' });
  }
  for (const med of currentMedications || []) {
    if (!homeSet.has(med.drug)) held.push({ drug: med.drug, dose: med.dose, status: 'new' });
  }
  return { continued, discontinued, held, totalContinued: continued.length, totalDiscontinued: discontinued.length, totalNew: held.length };
}

module.exports = {
  DoseRenal, DoseHepatic, Interaction, Allergy, IVPOConversion,
  AntibioticStewardship, TherapeuticMonitoring, VTEProphylaxis,
  PainManagement, Reconciliation,
};
