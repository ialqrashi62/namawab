// filepath: namaweb/fetal_medicine_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Manning 1980', 'King 2003'];

function biophysicalProfile(input) {
    const { breathing, movement, tone, amnioticFluid, nonStressTest } = input;
    const items = [breathing, movement, tone, amnioticFluid, nonStressTest];
    let score = 0;
    items.forEach((v, i) => { if (v === 2) score += 2; else if (v === 0) score += 0; });
    let risk = 'reassuring', rec = 'Standard OB care';
    if (score <= 4) { risk = 'abnormal'; rec = 'Deliver immediately or close fetal monitoring'; }
    else if (score <= 6) { risk = 'indeterminate'; rec = 'Repeat in 24h, extended monitoring'; }
    return { score, max_score: 10, risk, recommendation: rec, components: { breathing, movement, tone, amnioticFluid, nonStressTest }, cite: CITATIONS[0], version: VERSION };
}

function umbilicalDoppler(input) {
    const { systolicDiastolicRatio, absentEndDiastolicFlow, reversedEndDiastolicFlow } = input;
    let risk = 'normal', rec = 'Standard care';
    if (reversedEndDiastolicFlow) { risk = 'very_high'; rec = 'Reverse EDF — deliver (if viable)'; }
    else if (absentEndDiastolicFlow) { risk = 'high'; rec = 'Absent EDF — intensive monitoring'; }
    else if (systolicDiastolicRatio > 95) { risk = 'elevated'; rec = 'Elevated S/D ratio — closer monitoring'; }
    return { score: systolicDiastolicRatio, risk, recommendation: rec, components: { systolicDiastolicRatio, absentEndDiastolicFlow, reversedEndDiastolicFlow }, cite: CITATIONS[1], version: VERSION };
}

module.exports = { biophysicalProfile, umbilicalDoppler, VERSION, CITATIONS };
