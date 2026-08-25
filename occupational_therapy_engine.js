// filepath: namaweb/occupational_therapy_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['Berg 1989', 'FIM 1987'];

function bergBalance(input) {
    const items = ['sitting', 'standing', 'sittingToStanding', 'standingToSitting', 'transfers', 'eyesClosed', 'feetTogether', 'tandemStanding', 'singleLeg', 'reachingForward', 'pickingUp', 'turningToLook', 'turning360', 'alternatingFeet', 'standingOneLeg'];
    const scores = items.map(k => input[k] || 0);
    const total = scores.reduce((a, b) => a + b, 0);
    let risk = 'low', rec = 'Independent';
    if (total < 20) { risk = 'high'; rec = 'Wheelchair-bound'; }
    else if (total < 40) { risk = 'moderate'; rec = 'High fall risk'; }
    return { score: total, max_score: 56, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = scores[i]; return o; }, {}), cite: CITATIONS[0], version: VERSION };
}

function fimScore(input) {
    const items = ['eating', 'grooming', 'bathing', 'dressingUpper', 'dressingLower', 'toileting', 'bladder', 'bowel', 'chairTransfer', 'toiletTransfer', 'tubShower', 'walking', 'stairs', 'comprehension', 'expression', 'socialInteraction', 'problemSolving', 'memory'];
    const scores = items.map(k => input[k] || 1);
    const total = scores.reduce((a, b) => a + b, 0);
    let risk = 'low', rec = 'Independent';
    if (total < 36) { risk = 'very_high'; rec = 'Total dependence'; }
    else if (total < 72) { risk = 'moderate'; rec = 'Needs assistance'; }
    return { score: total, max_score: 126, risk, recommendation: rec, components: items.reduce((o, k, i) => { o[k] = scores[i]; return o; }, {}), cite: CITATIONS[1], version: VERSION };
}

module.exports = { bergBalance, fimScore, VERSION, CITATIONS };
