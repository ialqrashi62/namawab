'use strict';
const Engine = require('./telehealth_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log('  \u2713 ' + name); } catch (err) { failed++; console.error('  \u2717 ' + name + ': ' + err.message); } }
function describe(s, fn) { console.log('\n' + s); fn(); }
function assertEq(a, b) { if (a !== b) throw new Error('eq: ' + JSON.stringify(a) + ' != ' + JSON.stringify(b)); }
function assert(v) { if (!v) throw new Error('assertion failed'); }

console.log('TELEHEALTH ENGINE TESTS\n========================================');

describe('VideoSessionCheck', () => {
  it('ready', () => {
    const r = Engine.VideoSessionCheck({ bandwidthMbps: 5, latencyMs: 50, browser: 'chrome', deviceClass: 'desktop', hasCamera: true, hasMicrophone: true, hasSpeaker: true });
    assertEq(r.ready, true);
  });
  it('no camera', () => {
    const r = Engine.VideoSessionCheck({ bandwidthMbps: 5, latencyMs: 50, browser: 'chrome', deviceClass: 'desktop', hasCamera: false, hasMicrophone: true, hasSpeaker: true });
    assert(r.failed.includes('camera'));
  });
});

describe('Eligibility', () => {
  it('eligible urgent', () => {
    const r = Engine.Eligibility({ insurance: 'PHI', location: 'Riyadh', visitType: 'urgent', hasDevice: true, languagePreference: 'ar' });
    assertEq(r.eligible, true);
    assertEq(r.plan, 'on-demand-available');
  });
});

describe('StoreAndForwardImage', () => {
  it('photo valid', () => {
    const r = Engine.StoreAndForwardImage({ modality: 'photo', sizeMb: 5, anonymized: true });
    assertEq(r.valid, true);
  });
  it('DICOM no DICOM SR', () => {
    const r = Engine.StoreAndForwardImage({ modality: 'DICOM-XR', sizeMb: 10, dicomCompliant: true, anonymized: true, hasDicomSR: false });
    assertEq(r.valid, true);
  });
  it('PHI present', () => {
    const r = Engine.StoreAndForwardImage({ modality: 'photo', sizeMb: 5, anonymized: false });
    assertEq(r.valid, false);
  });
});

describe('VisitDocumentation', () => {
  it('complete', () => {
    const r = Engine.VisitDocumentation({ durationMinutes: 15, participants: 2, chiefComplaint: 'cough', rosDocumented: true, examFindings: 'normal', assessmentPlan: 'viral URI' });
    assertEq(r.complete, true);
  });
});

describe('RemoteMonitoringAlert', () => {
  it('critical hypoxia', () => {
    const r = Engine.RemoteMonitoringAlert({ heartRate: 80, spo2: 85, sbp: 120, dbp: 80, temperature: 37 });
    assert(r.alerts.includes('adult-hypoxia'));
  });
  it('all normal', () => {
    const r = Engine.RemoteMonitoringAlert({ heartRate: 80, spo2: 98, sbp: 120, dbp: 80, temperature: 37 });
    assertEq(r.urgent, false);
  });
});

describe('ConsentAndPrivacy', () => {
  it('compliant', () => {
    const r = Engine.ConsentAndPrivacy({ hipaaAck: true, recordingConsent: true, photoConsent: true, locationVerified: true, twoFactorVerified: true, encryptionVerified: true });
    assertEq(r.ready, true);
  });
  it('missing MFA', () => {
    const r = Engine.ConsentAndPrivacy({ hipaaAck: true, recordingConsent: true, photoConsent: true, locationVerified: true, twoFactorVerified: false, encryptionVerified: true });
    assertEq(r.ready, false);
  });
});

describe('PrescribingRemote', () => {
  it('controlled needs DEA', () => {
    const r = Engine.PrescribingRemote({ visitType: 'follow-up', controlledSubstance: true, stateLicense: 'CA-12345' });
    assertEq(r.canPrescribe, false);
    assertEq(r.reason, 'no-DEA');
  });
  it('non-controlled OK', () => {
    const r = Engine.PrescribingRemote({ visitType: 'follow-up', controlledSubstance: false, stateLicense: 'CA-12345', hasLabReviewed: true });
    assertEq(r.canPrescribe, true);
  });
});

describe('BillingTelehealth', () => {
  it('urgent', () => {
    const r = Engine.BillingTelehealth({ visitDurationMinutes: 20, visitType: 'urgent', modifier: '95', location: 'home' });
    assertEq(r.base, 150);
    assertEq(r.eligible, true);
  });
});

describe('QualityMeasure', () => {
  it('excellent', () => {
    const r = Engine.QualityMeasure({ satisfactionScore: 95, technicalScore: 90, clinicalOutcomeScore: 92, completionRate: 95 });
    assertEq(r.grade, 'excellent');
  });
  it('poor', () => {
    const r = Engine.QualityMeasure({ satisfactionScore: 50, technicalScore: 60, clinicalOutcomeScore: 55, completionRate: 70 });
    assertEq(r.grade, 'poor');
  });
});

describe('AsynchronousConsult', () => {
  it('urgent within SLA', () => {
    const r = Engine.AsynchronousConsult({ questionType: 'urgent', hasImages: true, hasHistory: true, hasLabs: true, timeToResponse: 3 });
    assertEq(r.withinSLA, true);
  });
  it('low priority', () => {
    const r = Engine.AsynchronousConsult({ questionType: 'follow-up', hasImages: false, hasHistory: true, timeToResponse: 48 });
    assertEq(r.priority, 'medium');
  });
});

console.log();
console.log('telehealth engine tests: ' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
