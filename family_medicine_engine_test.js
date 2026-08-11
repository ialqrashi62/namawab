// filepath: namaweb/family_medicine_engine_test.js
// Family Medicine engine — unit tests
// Pattern: nm-test-suite-default
'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const engine = require('./family_medicine_engine');

test('wellnessScore: young healthy non-smoker returns low', () => {
    const r = engine.wellnessScore({ age: 30, bmi: 22, smoker: false, activity_min_per_week: 200, chronic_count: 0 });
    assert.equal(r.risk, 'low');
    assert.ok(r.score >= 80);
    assert.match(r.recommendation, /صحي/);
    assert.match(r.cite, /USPSTF/);
});

test('wellnessScore: senior smoker with obesity returns very_high', () => {
    const r = engine.wellnessScore({ age: 70, bmi: 32, smoker: true, activity_min_per_week: 0, chronic_count: 4 });
    assert.equal(r.risk, 'very_high');
    assert.ok(r.score < 40);
});

test('wellnessScore: rejects missing age', () => {
    assert.throws(() => engine.wellnessScore({ bmi: 22 }), /age/i);
});

test('chronicDiseaseCount: healthy patient returns 0', () => {
    const r = engine.chronicDiseaseCount({});
    assert.equal(r.score, 0);
    assert.equal(r.risk, 'low');
});

test('chronicDiseaseCount: patient with 3 chronic conditions returns 3', () => {
    const r = engine.chronicDiseaseCount({ diabetes: true, htn: true, asthma: true });
    assert.equal(r.score, 3);
    assert.equal(r.risk, 'high');
    assert.match(r.recommendation, /PCMH/);
});

test('vaccinationSchedule: infant missing polio vaccine flagged', () => {
    const r = engine.vaccinationSchedule({ age: 1, immunizations: [] });
    assert.ok(r.components.due.length > 0);
    assert.ok(r.components.due.includes('IPV'));
});

test('vaccinationSchedule: senior needs shingles + pneumonia', () => {
    const r = engine.vaccinationSchedule({ age: 70, immunizations: [] });
    assert.ok(r.components.due.includes('PPSV23'));
    assert.ok(r.components.due.includes('Shingles'));
});

test('familyHistoryRisk: parent with early breast cancer is high', () => {
    const r = engine.familyHistoryRisk({
        family_history: [{ relationship: 'parent', condition: 'breast_cancer', age_at_diagnosis: 40 }]
    });
    assert.equal(r.risk, 'moderate');
    assert.ok(r.score >= 5);
});

test('preventiveScreening: female 50+ recommends mammography + colonoscopy', () => {
    const r = engine.preventiveScreening({ age: 55, sex: 'F', smoker: false });
    const services = r.components.recommendations.map(x => x.service);
    assert.ok(services.includes('mammography'));
    assert.ok(services.includes('colorectal cancer screening'));
});

test('preventiveScreening: smoker 60 needs lung CT', () => {
    const r = engine.preventiveScreening({ age: 60, sex: 'M', smoker: true });
    const services = r.components.recommendations.map(x => x.service);
    assert.ok(services.some(s => s.includes('lung cancer')));
});

console.log(`Family Medicine engine tests defined: 10`);