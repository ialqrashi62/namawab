'use strict';
// Telehealth Engine: 10 pure deterministic functions
// Compliance: CMS, ATA, ONC, HIPAA, AAFP, RSNA, ACR

function VideoSessionCheck({ bandwidthMbps, latencyMs, browser, deviceClass, osVersion, hasCamera, hasMicrophone, hasSpeaker }) {
  const checks = {
    bandwidth: bandwidthMbps >= 1.5,
    latency: latencyMs < 200,
    camera: hasCamera,
    microphone: hasMicrophone,
    speaker: hasSpeaker,
    browser: ['chrome', 'firefox', 'safari', 'edge'].includes((browser || '').toLowerCase()),
    device: deviceClass && deviceClass !== 'unsupported',
  };
  const failed = Object.entries(checks).filter(([_, v]) => !v).map(([k]) => k);
  return { ready: failed.length === 0, failed, recommendations: failed.map(k => `upgrade ${k}`) };
}

function Eligibility({ insurance, location, visitType, hasDevice, languagePreference }) {
  const eligible = !!insurance && !!location && !!hasDevice;
  const languageMatch = languagePreference !== undefined;
  let plan;
  if (visitType === 'urgent') plan = 'on-demand-available';
  else if (visitType === 'follow-up') plan = 'scheduled-24h';
  else if (visitType === 'chronic-care') plan = 'monthly-check-in';
  else plan = 'standard';
  return { eligible: eligible && languageMatch, plan, requirements: !eligible ? ['insurance', 'location', 'device'] : [] };
}

function StoreAndForwardImage({ modality, sizeMb, dicomCompliant, anonymized, studyType, hasDicomSR }) {
  const isValid = (modality === 'photo' || modality === 'DICOM-XR' || modality === 'DICOM-CT' || modality === 'DICOM-MR');
  if (!isValid) return { valid: false, reason: 'unsupported modality' };
  if (modality !== 'photo' && !dicomCompliant) return { valid: false, reason: 'not DICOM' };
  if (!anonymized) return { valid: false, reason: 'PHI not removed' };
  if (sizeMb > 100) return { valid: false, reason: 'file too large' };
  return { valid: true, studyType, hasDicomSR, ready: true };
}

function VisitDocumentation({ durationMinutes, participants, chiefComplaint, rosDocumented, examFindings, assessmentPlan }) {
  const score = (chiefComplaint ? 1 : 0) + (rosDocumented ? 1 : 0) + (examFindings ? 1 : 0) + (assessmentPlan ? 1 : 0);
  return { durationMinutes, participants, complete: score === 4, score, missing: score < 4 ? ['chiefComplaint', 'rosDocumented', 'examFindings', 'assessmentPlan'].filter((k, i) => [chiefComplaint, rosDocumented, examFindings, assessmentPlan][i] === undefined || ![chiefComplaint, rosDocumented, examFindings, assessmentPlan][i]) : [] };
}

function RemoteMonitoringAlert({ heartRate, spo2, sbp, dbp, temperature, glucose, ageMonths }) {
  const alerts = [];
  if (ageMonths && ageMonths < 18) {
    if (heartRate < 50 || heartRate > 200) alerts.push('pedi-tachy-or-brady');
    if (spo2 < 90) alerts.push('pedi-hypoxia');
  } else {
    if (heartRate < 40 || heartRate > 130) alerts.push('adult-tachy-or-brady');
    if (spo2 < 88) alerts.push('adult-hypoxia');
  }
  if (sbp < 90 || sbp > 180) alerts.push('bp-critical');
  if (dbp < 50 || dbp > 110) alerts.push('bp-critical');
  if (temperature < 35 || temperature > 39) alerts.push('temp-critical');
  if (glucose < 60 || glucose > 400) alerts.push('glucose-critical');
  return { alerts, urgent: alerts.length > 0, count: alerts.length };
}

function ConsentAndPrivacy({ hipaaAck, recordingConsent, photoConsent, locationVerified, twoFactorVerified, encryptionVerified }) {
  const checks = { hipaa: hipaaAck, recording: recordingConsent, photo: photoConsent, location: locationVerified, mfa: twoFactorVerified, encryption: encryptionVerified };
  const missing = Object.entries(checks).filter(([_, v]) => !v).map(([k]) => k);
  return { ready: missing.length === 0, missing, status: missing.length === 0 ? 'compliant' : 'incomplete' };
}

function PrescribingRemote({ visitType, controlledSubstance, hasLabReviewed, inPersonVisitRecentDays, stateLicense, deaNumber }) {
  if (controlledSubstance) {
    if (!deaNumber) return { canPrescribe: false, reason: 'no-DEA' };
    if (inPersonVisitRecentDays > 90 && visitType !== 'urgent') return { canPrescribe: false, reason: 'in-person-visit-required' };
  }
  if (!stateLicense) return { canPrescribe: false, reason: 'no-license' };
  if (!hasLabReviewed && visitType === 'follow-up') return { canPrescribe: false, reason: 'labs-pending' };
  return { canPrescribe: true, visitType, controlledSubstance };
}

function BillingTelehealth({ visitDurationMinutes, visitType, modifier, location, originatingSite, placeOfService }) {
  const base = visitType === 'urgent' ? 150 : 90;
  const modifierValid = ['95', 'GT', 'GQ'].includes(modifier || '');
  const pos = placeOfService || (location === 'home' ? '10' : '02');
  return { base, modifierValid, placeOfService: pos, originatingSite, eligible: modifierValid && visitDurationMinutes >= 10 };
}

function QualityMeasure({ satisfactionScore, technicalScore, clinicalOutcomeScore, completionRate }) {
  const overall = (satisfactionScore * 0.3 + technicalScore * 0.2 + clinicalOutcomeScore * 0.4 + completionRate * 0.1);
  let grade;
  if (overall >= 90) grade = 'excellent';
  else if (overall >= 80) grade = 'good';
  else if (overall >= 70) grade = 'fair';
  else grade = 'poor';
  return { overall: Math.round(overall * 10) / 10, grade, components: { satisfaction: satisfactionScore, technical: technicalScore, clinical: clinicalOutcomeScore, completion: completionRate } };
}

function AsynchronousConsult({ questionType, hasImages, hasHistory, hasLabs, provider, timeToResponse }) {
  let priority;
  if (questionType === 'urgent') priority = 'high';
  else if (questionType === 'follow-up') priority = 'medium';
  else priority = 'low';
  const completeness = [hasImages, hasHistory, hasLabs].filter(Boolean).length;
  const sla = priority === 'high' ? 4 : priority === 'medium' ? 24 : 72;
  const withinSLA = timeToResponse <= sla;
  return { priority, completeness, sla, timeToResponse, withinSLA, provider };
}

module.exports = {
  VideoSessionCheck, Eligibility, StoreAndForwardImage, VisitDocumentation, RemoteMonitoringAlert,
  ConsentAndPrivacy, PrescribingRemote, BillingTelehealth, QualityMeasure, AsynchronousConsult,
};
