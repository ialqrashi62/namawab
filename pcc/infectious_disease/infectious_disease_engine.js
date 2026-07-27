'use strict';
// Infectious Disease Engine: 10 pure deterministic functions
// Compliance: IDSA, CDC, WHO, Surviving Sepsis Campaign, HIV-OI guidelines

function QSOFA({ rr, sbp, alteredMental }) {
  let score = 0;
  if (rr >= 22) score += 1;
  if (sbp <= 100) score += 1;
  if (alteredMental) score += 1;
  return { score, sepsisLikely: score >= 2, mortalityPct: score >= 2 ? 16 : score === 1 ? 5 : 1 };
}

function SOFAScore({ pao2, fio2, platelets, bilirubin, map, gcs, creatinine, urineOutput, mechanicalVent, dopamine, dobutamine, norepinephrine, epinephrine }) {
  let resp = 0;
  if (mechanicalVent) {
    if (pao2 / fio2 >= 200) resp = 2; else if (pao2 / fio2 >= 100) resp = 2; else resp = 3;
  } else if (pao2 / fio2 < 400) resp = 1;
  let coag = 0;
  if (platelets < 20) coag = 4; else if (platelets < 50) coag = 3; else if (platelets < 100) coag = 2; else if (platelets < 150) coag = 1;
  let liver = 0;
  if (bilirubin >= 12) liver = 4; else if (bilirubin >= 6) liver = 3; else if (bilirubin >= 2) liver = 2; else if (bilirubin >= 1.2) liver = 1;
  let cardio = 0;
  if (dopamine > 15 || epinephrine > 0.1 || norepinephrine > 0.1) cardio = 4;
  else if (dopamine > 5 || norepinephrine <= 0.1) cardio = 3;
  else if (dobutamine) cardio = 2;
  else if (map < 70) cardio = 1;
  let neuro = 0;
  if (gcs < 6) neuro = 4; else if (gcs < 10) neuro = 3; else if (gcs < 13) neuro = 2; else if (gcs < 15) neuro = 1;
  let renal = 0;
  if (creatinine >= 5) renal = 4; else if (creatinine >= 3.5) renal = 3; else if (creatinine >= 2) renal = 2; else if (urineOutput < 500) renal = 3; else if (creatinine >= 1.2) renal = 1;
  return { score: resp + coag + liver + cardio + neuro + renal, components: { resp, coag, liver, cardio, neuro, renal }, sepsis: resp + coag + liver + cardio + neuro + renal >= 2 };
}

function HIVStage({ cd4, viralLoad, opportunisticInfection, symptoms }) {
  let stage;
  if (cd4 < 200 || opportunisticInfection) stage = 'AIDS';
  else if (cd4 < 350) stage = 'late-HIV';
  else if (cd4 < 500) stage = 'intermediate-HIV';
  else stage = 'early-HIV';
  let viral = 'undetectable';
  if (viralLoad > 100000) viral = 'very-high';
  else if (viralLoad > 10000) viral = 'high';
  else if (viralLoad > 200) viral = 'detectable';
  return { stage, viral, art: cd4 < 350 || viralLoad > 50000 ? 'start ART urgently' : 'continue/optimize' };
}

function SIRS({ temp, hr, rr, paco2, wbc, bands }) {
  let criteria = 0;
  if (temp < 36 || temp > 38) criteria += 1;
  if (hr > 90) criteria += 1;
  if (rr > 20 || (paco2 && paco2 < 32)) criteria += 1;
  if (wbc < 4 || wbc > 12) criteria += 1;
  if (bands > 10) criteria += 1;
  return { criteria, sirsPositive: criteria >= 2 };
}

function SepsisSepticShock({ qsofa, sofa, lactate, vasopressor, map }) {
  let diagnosis = 'no-sepsis';
  if (sofa >= 2 && (qsofa >= 2 || lactate > 2)) {
    diagnosis = 'sepsis';
    if (vasopressor || map < 65 || lactate > 4) {
      diagnosis = 'septic-shock';
    }
  }
  return { diagnosis, mortalityPct: diagnosis === 'septic-shock' ? 40 : diagnosis === 'sepsis' ? 15 : 2 };
}

function MalariaSeverity({ parasitemia, hypoglycemia, hemoglobin, creatinine, bilirubin, impairedConsciousness, acidosis }) {
  let severe = 0;
  if (parasitemia > 5) severe += 1;
  if (hypoglycemia) severe += 1;
  if (hemoglobin < 7) severe += 1;
  if (creatinine > 3) severe += 1;
  if (bilirubin > 3) severe += 1;
  if (impairedConsciousness) severe += 1;
  if (acidosis) severe += 1;
  return { severityCount: severe, severeMalaria: severe >= 1, mortality: severe >= 3 ? 30 : 5 };
}

function TBClassification({ smear, culture, cxr, symptoms, contact, hivStatus, drugResistant }) {
  const active = smear || culture || (cxr && cxr.suggestive);
  const classification = drugResistant ? 'MDR-TB' : active ? 'active-TB' : symptoms && contact ? 'latent-TB' : 'not-TB';
  const contagious = smear && !drugResistant;
  return { classification, active, contagious, isolation: active ? 'respiratory isolation' : 'standard', treatment: drugResistant ? 'RIPE+second-line' : 'RIPE 6-9mo' };
}

function CdiffSeverity({ wbc, creatinine, hypotension, ileus, megacolon }) {
  let severity = 'mild-moderate';
  if (wbc > 15000 || creatinine > 1.5) severity = 'severe';
  if (hypotension || ileus || megacolon) severity = 'fulminant';
  let treatment;
  if (severity === 'mild-moderate') treatment = 'vancomycin PO or fidaxomicin';
  else if (severity === 'severe') treatment = 'vancomycin PO + IV metronidazole';
  else treatment = 'surgical consult + combination';
  return { severity, treatment, mortalityPct: severity === 'fulminant' ? 30 : severity === 'severe' ? 5 : 1 };
}

function TravelRisk({ destination, durationDays, prophylaxis, vaccines, exposureRisks }) {
  const highRisk = ['ssa', 'sea', 'sa', 'indian-subcontinent'].includes(destination);
  const risks = [];
  if (highRisk && durationDays > 14) risks.push('malaria');
  if (highRisk && !prophylaxis) risks.push('malaria-prophylaxis-needed');
  if (!vaccines || vaccines.length < 3) risks.push('vaccine-update');
  if (exposureRisks && exposureRisks.food) risks.push('enteric');
  if (exposureRisks && exposureRisks.water) risks.push('waterborne');
  if (exposureRisks && exposureRisks.sexual) risks.push('sti');
  return { highRisk, risks, recommendations: risks.length ? ['pre-travel consult'] : ['standard precautions'] };
}

function ImmunizationStatus({ age, vaccines, comorbidities, occupation }) {
  const standard = age >= 65 ? ['flu-annual', 'covid-booster', 'ppsv23', 'pcv20', 'shingles', 'tdap'] : ['flu-annual', 'covid-booster', 'tdap'];
  const missing = standard.filter(v => !vaccines || !vaccines.includes(v));
  let special = [];
  if (comorbidities && comorbidities.asplenia) special.push('meningococcal-B', 'meningococcal-ACWY');
  if (comorbidities && comorbidities.diabetes) special.push('hepatitis-B');
  if (occupation === 'healthcare') special.push('hepatitis-B', 'varicella');
  return { missing, specialNeeded: special, catchUpNeeded: missing.length > 0, recommendation: missing.length === 0 ? 'up-to-date' : 'schedule' };
}

module.exports = {
  QSOFA, SOFAScore, HIVStage, SIRS, SepsisSepticShock,
  MalariaSeverity, TBClassification, CdiffSeverity, TravelRisk, ImmunizationStatus,
};
