// P3-BC: Community-Health unit tests
const Engine = require('./community_health_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  \u2713 ' + name); passed++; } catch (e) { console.log('  \u2717 ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }

console.log('community_health engine tests:');
it('Risk', () => {
  const r = Engine.CommunityRiskAssessment({ population: 'urban-low-income', sdoh: { economic: 'high', education: 'low', housing: 'insecure', food: 'insecure' }, age: 35 });
  assertEq(r.risk, 'very-high-community-need');
});
it('Disparities', () => {
  const r = Engine.HealthDisparities({ race: 'minority', insurance: 'uninsured', language: 'non-English', chronicDisease: 'multiple' });
  assertEq(r.disparity, 'triple-disparity-and-CMS-OE-eligible');
});
it('SDOH', () => {
  const r = Engine.SDOH({ housing: 'insecure', food: 'insecure', transport: 'limited', education: 'low', safety: 'safe' });
  assertEq(r.plan, 'comprehensive-SDOH-eval-and-CHW-and-housing');
});
it('Literacy', () => {
  const r = Engine.HealthLiteracy({ literacy: 'low', language: 'non-English', teachBack: 'no', caregiver: 'present' });
  assertEq(r.plan, 'teach-back-and-interpreter-and-visual');
});
it('Vax', () => {
  const r = Engine.VaccinationOutreach({ age: 35, vaccines: 'routine', population: 'underserved', hesitancy: 'severe' });
  assertEq(r.plan, 'culturally-tailored-messaging-and-trusted-messenger');
});
it('Maternal', () => {
  const r = Engine.CommunityMaternal({ maternalAge: 25, prenatalCare: 'inadequate', income: 'low', transport: 'limited' });
  assertEq(r.risk, 'high-risk-maternal-need-CDC-PER');
});
it('Mental', () => {
  const r = Engine.CommunityMental({ depression: 'high', suicide: 'yes', substance: 'no', access: 'limited' });
  assertEq(r.plan, 'crisis-team-and-tele-psych');
});
it('Screening', () => {
  const r = Engine.CommunityScreening({ age: 55, sdoh: 'low', lastScreen: 'overdue', access: 'limited' });
  assertEq(r.plan, 'mobile-clinic-and-CHW-screen');
});
it('Outbreak', () => {
  const r = Engine.CommunityOutbreak({ pathogen: 'COVID', cases: 25, population: '5k', severity: 'severe' });
  assertEq(r.plan, 'outbreak-declare-and-public-health-emergency');
});
it('Eval', () => {
  const r = Engine.CommunityEval({ program: 'FQHC', reach: 5, outcomes: 'improved', cost: 'low' });
  assertEq(r.evaluation, 'highly-effective-FQHC-and-replicate');
});

console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
