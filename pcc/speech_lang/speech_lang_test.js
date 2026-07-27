'use strict';

const Engine = require('./speech_lang_engine');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log(`  ✓ ${name}`); passed++; } catch (e) { console.log(`  ✗ ${name}: ${e.message}`); failed++; } }
function describe(s, fn) { console.log(s); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`eq: ${JSON.stringify(a)} != ${JSON.stringify(b)}${m ? ' — ' + m : ''}`); }

describe('speech_lang engine tests', () => {
  it('aphasia global', () => {
    const r = Engine.AphasiaTypeAssessment({ fluency: 'non-fluent', comprehension: 'absent', repetition: 'absent', naming: 'absent' });
    assertEq(r.type, 'global-aphasia');
  });
  it('dysarthria severe', () => {
    const r = Engine.DysarthriaAssessment({ intelligibility: 0.2, rate: 'slow', voice: 'strained' });
    assertEq(r.severity, 'severe-dysarthria');
  });
  it('dysphagia severe', () => {
    const r = Engine.DysphagiaFEES({ penetrationAspiration: 'silent-aspiration', valleculaPooling: 'severe', pharyngealDelay: 'severe' });
    assertEq(r.severity, 'severe-dysphagia-NPO-immediate');
  });
  it('stuttering moderate', () => {
    const r = Engine.StutteringSeverity({ percentSyllablesStuttered: 12, secondaryBehaviors: 'absent', duration: 18 });
    assertEq(r.severity, 'moderate-stuttering');
  });
  it('voice severe', () => {
    const r = Engine.VoiceDisorderGRBAS({ grade: 3, roughness: 2, breathiness: 3, asthenia: 2, strain: 3 });
    assertEq(r.severity, 'severe-dysphonia');
  });
  it('aphasia severity severe', () => {
    const r = Engine.AphasiaSeverityAQ({ aqScore: 35 });
    assertEq(r.severity, 'severe-aphasia');
  });
  it('AAC needed severe', () => {
    const r = Engine.AACNeed({ intelligibleSpeech: 0.1, motorImpairment: 'severe', cognitiveAdequate: true });
    assertEq(r.need, 'high-AAC-needed');
  });
  it('language delay significant', () => {
    const r = Engine.ChildLanguageDisorder({ ageMonths: 60, expressiveVocabulary: 10, receptiveVocabulary: 80, milestonesMet: false });
    assertEq(r.classification, 'significant-language-delay');
  });
  it('dysphagia MMSE competent', () => {
    const r = Engine.DysphagiaOralCareCognitive({ mmse: 28, oralHygiene: 'good' });
    assertEq(r.assessment, 'cognitively-competent-oral-care-good');
  });
  it('cognitive-comm severe', () => {
    const r = Engine.CognitiveCommunicationDisorder({ memory: 'severe-impairment', attention: 'severe', executive: 'severe' });
    assertEq(r.severity, 'severe-cognitive-communication-disorder');
  });
});

console.log(`\nspeech_lang engine tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
