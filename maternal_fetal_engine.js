// filepath: namaweb/maternal_fetal_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Bishop 1964', 'ACOG 2019'];

function bishopScore(input) {
    const { dilation, effacement, station, position, consistency } = input;
    let score = 0;
    const c = {};
    if (dilation !== undefined) {
        if (dilation >= 4) score += 2;
        else if (dilation >= 2) score += 1;
        else if (dilation >= 1) score += 0;
        c.dilation = dilation;
    }
    if (effacement !== undefined) {
        if (effacement >= 80) score += 2;
        else if (effacement >= 50) score += 1;
        c.effacement = effacement;
    }
    if (station !== undefined) {
        if (station <= -2) score += 2;
        else if (station <= -1) score += 1;
        c.station = station;
    }
    if (position === 'anterior') { score += 2; c.position = 'anterior'; }
    else if (position === 'mid') { score += 1; c.position = 'mid'; }
    if (consistency === 'soft') { score += 2; c.consistency = 'soft'; }
    else if (consistency === 'medium') { score += 1; c.consistency = 'medium'; }
    let risk = 'unfavorable', rec = 'Not suitable for induction';
    if (score >= 8) { risk = 'favorable'; rec = 'Ready for induction'; }
    else if (score >= 6) { risk = 'favorable'; rec = 'Likely to deliver with induction'; }
    return { score, max_score: 13, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

function gbsScreening(input) {
    const { gestation, gbsStatus, priorInfant, priorGBS, screen35 } = input;
    let score = 0;
    const c = {};
    if (gbsStatus === 'positive') { score += 3; c.positive = 3; }
    if (priorInfant) { score += 2; c.priorInfant = 2; }
    if (priorGBS) { score += 1; c.priorGBS = 1; }
    if (gestation < 37) { score += 1; c.preterm = 1; }
    if (screen35 === 'inadequate') { score += 1; c.inadequate = 1; }
    let risk = 'low', rec = 'No antibiotic needed';
    if (score >= 2) { risk = 'high'; rec = 'IV penicillin G in labor'; }
    return { score, risk, recommendation: rec, components: c, cite: CITATIONS[1], version: VERSION };
}

module.exports = { bishopScore, gbsScreening, VERSION, CITATIONS };
