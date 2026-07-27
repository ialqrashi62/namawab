// P3-AX: Recreational-Therapy unit tests
const Engine = require('./recreational_therapy_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('recreational_therapy engine tests:');
it('RT Assessment', () => {
  const r = Engine.RTAssessment({ age: 30, diagnosis: 'spinal-cord-injury', leisureHistory: 'active', goals: 'community-reintegration' });
  assertEq(r.plan, 'community-reintegration-and-leisure-re-education');
});
it('Barriers', () => {
  const r = Engine.LeisureBarriers({ physical: 'wheelchair', cognitive: 'mild-impairment', social: 'limited-support', financial: 'low' });
  assertEq(r.barriers.length, 4);
  assertEq(r.priority, 'comprehensive-barriers-multi-disciplinary');
});
it('Community', () => {
  const r = Engine.CommunityReintegration({ dischargeLevel: 'home', leisurePref: 'sports', family: 'supportive', accessibility: 'partial' });
  assertEq(r.plan, 'home-leisure-modifications-and-adapted-equipment');
});
it('Adapted sports', () => {
  const r = Engine.AdaptedSports({ sport: 'basketball', mobility: 'wheelchair', level: 'recreational', assistiveTech: 'sport-wheelchair' });
  assertEq(r.plan, 'wheelchair-basketball-league-or-intro');
});
it('Pediatric', () => {
  const r = Engine.RTPediatric({ age: 8, indication: 'developmental-delay', setting: 'outpatient', familyEngagement: 'high' });
  assertEq(r.plan, 'family-recreation-and-leisure-counseling');
});
it('Geriatric', () => {
  const r = Engine.RTGeriatric({ age: 80, cognition: 'severe-impairment', funcStatus: 'institutional', engagement: 'reluctant' });
  assertEq(r.plan, 'sensory-stimulation-and-familiar-recreation');
});
it('Dosing', () => {
  const r = Engine.RTDosing({ sessionsPerWeek: 5, minutesPerSession: 60, weeks: 8 });
  assertEq(r.totalHours, 40);
  assertEq(r.intensity, 'intensive-RT');
});
it('Inpatient', () => {
  const r = Engine.RTInpatient({ setting: 'rehab', mobility: 'wheelchair', acuity: 'subacute', goal: 'community' });
  assertEq(r.plan, 'community-outing-rehearsal-and-leisure-trials');
});
it('Wellness', () => {
  const r = Engine.RTWellness({ stressLevel: 'high', burnout: 'severe', physicalActivity: 'sedentary', socialIsolation: 'severe' });
  assertEq(r.plan, 'nature-based-recreation-and-mindfulness-walk');
});
it('Discharge', () => {
  const r = Engine.RTDischarge({ planComplete: true, familyTrained: true, communityRef: 'made', equipment: 'obtained', followup: 'scheduled' });
  assertEq(r.readiness, 'ready-for-discharge-leisure-plan-intact');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
