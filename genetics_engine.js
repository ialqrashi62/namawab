// filepath: namaweb/genetics_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['NCCN 2024', 'Amp ltr 2013'];

function brcaRisk(input) {
    const { breastCancer50, ovarianCancer, maleBreastCancer, brcaFifty, tripleneg, twoRelatives, ashkenazi } = input;
    let score = 0;
    const c = {};
    if (breastCancer50) { score += 2; c.bc50 = 2; }
    if (ovarianCancer) { score += 2; c.oc = 2; }
    if (maleBreastCancer) { score += 2; c.mbc = 2; }
    if (brcaFifty) { score += 1; c.brca = 1; }
    if (tripleneg) { score += 2; c.tnbc = 2; }
    if (twoRelatives) { score += 1; c.fam = 1; }
    if (ashkenazi) { score += 1; c.ashk = 1; }
    let risk = 'low', rec = 'No referral';
    if (score >= 4) { risk = 'high'; rec = 'Genetic referral — BRCA1/2 testing'; }
    else if (score >= 2) { risk = 'moderate'; rec = 'Consider genetic counseling'; }
    return { score, max_score: 11, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

function lynchProbability(input) {
    const { colonCancer, endometrialCancer, colorectalCancer50, synchronousTumor, firstDegreeLynch, mmrLoss } = input;
    let score = 0;
    const c = {};
    if (colonCancer) { score += 1; c.crc = 1; }
    if (endometrialCancer) { score += 1; c.ec = 1; }
    if (colorectalCancer50) { score += 2; c.crc50 = 2; }
    if (synchronousTumor) { score += 2; c.syn = 2; }
    if (firstDegreeLynch) { score += 2; c.fam = 2; }
    if (mmrLoss) { score += 3; c.mmr = 3; }
    let risk = 'low', rec = 'No referral';
    if (score >= 5) { risk = 'high'; rec = 'Lynch testing — MMR IHC, germline'; }
    else if (score >= 2) { risk = 'moderate'; rec = 'Consider MSI testing'; }
    return { score, max_score: 11, risk, recommendation: rec, components: c, cite: CITATIONS[0], version: VERSION };
}

module.exports = { brcaRisk, lynchProbability, VERSION, CITATIONS };
