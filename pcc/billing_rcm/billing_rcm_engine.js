'use strict';
// Billing/RCM Engine: 10 pure deterministic functions
// Compliance: CPT, ICD-10-CM, HCPCS, NPHIES (KSA), CMS, AAPC

function CPTLookup({ code }) {
  const cpt = (code || '').replace(/[^0-9]/g, '');
  const c = parseInt(cpt);
  let category, description, baseRVU;
  if (c >= 99201 && c <= 99499) { category = 'E/M'; description = 'Evaluation and Management'; baseRVU = 1.0 + (c - 99201) * 0.5; }
  else if (c >= 10004 && c <= 69990) { category = 'Surgery'; description = 'Surgical procedure'; baseRVU = 5.0 + (c % 50); }
  else if (c >= 70010 && c <= 79999) { category = 'Radiology'; description = 'Imaging'; baseRVU = 2.0 + (c % 20) * 0.3; }
  else if (c >= 80047 && c <= 89398) { category = 'Pathology/Lab'; description = 'Lab testing'; baseRVU = 0.5 + (c % 30) * 0.1; }
  else if (c >= 90281 && c <= 99607) { category = 'Medicine'; description = 'Medicine service'; baseRVU = 1.5 + (c % 20) * 0.2; }
  else if (c >= 99201 && c <= 99215) { category = 'Office E/M'; description = 'Office visit'; baseRVU = 1.5 + (c - 99201) * 0.2; }
  else { category = 'unknown'; description = 'unknown code'; baseRVU = 0; }
  return { code, category, description, baseRVU: Math.round(baseRVU * 100) / 100 };
}

function ICD10Lookup({ code }) {
  const c = (code || '').toUpperCase();
  const letter = c.match(/[A-Z]/g) || [];
  if (letter.length === 0) return { valid: false, reason: 'no letter' };
  const cat = letter[0];
  let chapter;
  if (['A', 'B'].includes(cat)) chapter = 'Infectious diseases';
  else if (['C'].includes(cat) || (cat >= 'D' && c.startsWith('D0'))) chapter = 'Neoplasms';
  else if (cat === 'D' && c.startsWith('D5')) chapter = 'Blood diseases';
  else if (cat === 'E') chapter = 'Endocrine';
  else if (cat === 'F') chapter = 'Mental/behavioral';
  else if (cat === 'G') chapter = 'Nervous system';
  else if (cat === 'H') chapter = 'Eye/Ear';
  else if (cat === 'I') chapter = 'Circulatory';
  else if (cat === 'J') chapter = 'Respiratory';
  else if (cat === 'K') chapter = 'Digestive';
  else if (cat === 'L') chapter = 'Skin';
  else if (cat === 'M') chapter = 'Musculoskeletal';
  else if (cat === 'N') chapter = 'Genitourinary';
  else if (cat === 'O') chapter = 'Pregnancy';
  else if (cat === 'P') chapter = 'Perinatal';
  else if (cat === 'Q') chapter = 'Congenital';
  else if (cat === 'R') chapter = 'Symptoms';
  else if (cat === 'S' || cat === 'T') chapter = 'Injury';
  else if (['V', 'W', 'X', 'Y'].includes(cat)) chapter = 'External causes';
  else if (cat === 'Z') chapter = 'Health services';
  else chapter = 'unknown';
  return { code: c, valid: /^[A-Z]\d{2}(\.\d{1,4})?$/.test(c) || c.length >= 3, chapter, specificity: c.includes('.') ? 'specific' : 'category' };
}

function ModifierValidation({ cpt, modifier }) {
  const validModifiers = {
    '25': 'significant-separate-E/M',
    '59': 'distinct-procedural-service',
    '50': 'bilateral-procedure',
    '51': 'multiple-procedures',
    '22': 'increased-procedural-service',
    '23': 'unusual-anesthesia',
    '24': 'unrelated-E/M',
    '57': 'decision-for-surgery',
    '78': 'return-to-OR',
    '79': 'unrelated-procedure',
    '26': 'professional-component',
    'TC': 'technical-component',
  };
  return { cpt, modifier, valid: !!validModifiers[modifier], description: validModifiers[modifier] || 'unknown modifier' };
}

function NPHIESClaim({ diagnosisCodes, serviceCodes, payer, authorizationNumber, priorAuthRequired, attachmentCount }) {
  const errors = [];
  if (!diagnosisCodes || diagnosisCodes.length === 0) errors.push('at least one diagnosis required');
  if (!serviceCodes || serviceCodes.length === 0) errors.push('at least one service required');
  if (priorAuthRequired && !authorizationNumber) errors.push('authorization number required');
  if (payer === 'PHI' && (!attachmentCount || attachmentCount < 2)) errors.push('PHI requires attachments');
  const status = errors.length === 0 ? 'ready-to-submit' : 'incomplete';
  return { status, errors, payer, requiresAuth: priorAuthRequired, hasAuthNumber: !!authorizationNumber };
}

function DenialReason({ reason, remittance }) {
  const reasons = {
    'CO-16': 'claim/service lacks information',
    'CO-18': 'duplicate claim/service',
    'CO-22': 'care may be covered by another payer',
    'CO-29': 'time limit for filing has expired',
    'CO-50': 'non-covered service',
    'CO-97': 'service bundled into another payment',
    'PR-1': 'deductible amount',
    'PR-2': 'coinsurance amount',
    'PR-3': 'copay amount',
  };
  const category = reason.startsWith('CO') ? 'contractual' : reason.startsWith('PR') ? 'patient-responsibility' : 'unknown';
  return { reason, category, description: reasons[reason] || 'unknown code', action: category === 'contractual' ? 'appeal with documentation' : 'bill patient' };
}

function ChargeCapture({ encounterType, services, time, modifier }) {
  let totalRVU = 0;
  for (const s of services || []) {
    const c = parseInt((s.cpt || '0').replace(/[^0-9]/g, ''));
    if (c >= 99201 && c <= 99215) totalRVU += 1.0 + (c - 99201) * 0.3 + (s.units || 1) * 0.5;
    else if (c >= 10004 && c <= 69990) totalRVU += 5.0;
    else if (c >= 80047 && c <= 89398) totalRVU += 0.3;
  }
  return { totalRVU: Math.round(totalRVU * 100) / 100, encounterType, serviceCount: (services || []).length, time };
}

function CodingAccuracy({ actualEncounter, codedEncounter, missedCodes }) {
  let accuracy = 100;
  if (!codedEncounter.includes(actualEncounter)) accuracy -= 30;
  const missed = (missedCodes || []).length;
  accuracy -= missed * 10;
  const level = accuracy >= 90 ? 'excellent' : accuracy >= 70 ? 'good' : accuracy >= 50 ? 'fair' : 'poor';
  return { accuracy: Math.max(0, accuracy), level, missedCodes: missed };
}

function AR_AgingBucket({ daysOut, amount }) {
  let bucket, action;
  if (daysOut <= 30) { bucket = 'current'; action = 'no-action'; }
  else if (daysOut <= 60) { bucket = '31-60'; action = 'monitor'; }
  else if (daysOut <= 90) { bucket = '61-90'; action = 'follow-up'; }
  else if (daysOut <= 180) { bucket = '91-180'; action = 'escalate'; }
  else { bucket = '180+'; action = 'write-off-consider'; }
  return { bucket, amount, daysOut, action };
}

function PreAuthRequirement({ procedure, payer, elective, inpatient, emergency }) {
  if (emergency) return { required: false, reason: 'emergency' };
  if (inpatient) return { required: true, reason: 'inpatient' };
  const electiveHighCost = ['MRI', 'CT', 'PET', 'cardiac-cath', 'surgery'].includes(procedure);
  if (electiveHighCost) return { required: true, reason: 'high-cost-elective' };
  return { required: false, reason: 'standard' };
}

function RevenueCycleKPI({ charges, payments, denials, daysInAR, cleanClaimRate, collectionRate }) {
  const netCollectionRate = payments / Math.max(1, charges);
  const denialRate = denials / Math.max(1, charges);
  let health;
  if (daysInAR <= 35 && denialRate <= 0.05 && cleanClaimRate >= 0.95) health = 'excellent';
  else if (daysInAR <= 50 && denialRate <= 0.10) health = 'good';
  else health = 'needs-improvement';
  return { netCollectionRate: Math.round(netCollectionRate * 1000) / 10, denialRatePct: Math.round(denialRate * 1000) / 10, daysInAR, cleanClaimRatePct: cleanClaimRate * 100, health };
}

module.exports = {
  CPTLookup, ICD10Lookup, ModifierValidation, NPHIESClaim, DenialReason,
  ChargeCapture, CodingAccuracy, AR_AgingBucket, PreAuthRequirement, RevenueCycleKPI,
};
