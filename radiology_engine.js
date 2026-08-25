// filepath: namaweb/radiology_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['BI-RADS (ACR 2013)', 'Lung-RADS (ACR 2014)', 'TI-RADS (ACR 2017)'];

function birads(input) {
    const { assessment, density } = input;
    const cat = ['0', '1', '2', '3', '4', '5', '6'];
    if (!cat.includes(String(assessment))) return { error: 'invalid_birads', valid: '0-6' };
    const recs = {
        '0': 'Incomplete — additional imaging needed',
        '1': 'Negative — routine screening',
        '2': 'Benign — routine screening',
        '3': 'Probably benign — 6-month follow-up',
        '4': 'Suspicious — biopsy consideration',
        '5': 'Highly suggestive — biopsy/treatment',
        '6': 'Known biopsy-proven malignancy'
    };
    const risk = ['1', '2'].includes(String(assessment)) ? 'low' : (String(assessment) === '3' ? 'low-moderate' : 'high');
    return { score: Number(assessment), max_score: 6, risk, recommendation: recs[String(assessment)], components: { assessment, density }, cite: CITATIONS[0], version: VERSION };
}

function lungRADS(input) {
    const { noduleSize, density } = input;
    let score = 0;
    const components = {};
    if (noduleSize !== undefined) {
        score = Math.round(noduleSize);
        components.size = noduleSize;
        components.density = density;
    }
    let risk = 'low', rec = 'Routine annual screening';
    if (noduleSize >= 30) { risk = 'high'; rec = 'PET/CT, biopsy consideration'; }
    else if (noduleSize >= 8) { risk = 'moderate'; rec = '3-month LDCT'; }
    else if (noduleSize >= 6) { risk = 'low-moderate'; rec = '6-month LDCT'; }
    return { score, max_score: 100, risk, recommendation: rec, components, cite: CITATIONS[1], version: VERSION };
}

function tirads(input) {
    const { composition, echogenicity, shape, margin, echogenicFoci } = input;
    let score = 0;
    const components = {};
    if (composition === 'solid') { score += 2; components.composition = 'solid'; }
    else if (composition === 'mixed') { score += 1; components.composition = 'mixed'; }
    if (echogenicity === 'hypoechoic') { score += 2; components.echogenicity = 'hypoechoic'; }
    if (shape === 'taller_than_wide') { score += 3; components.shape = 'taller_than_wide'; }
    if (margin === 'irregular') { score += 2; components.margin = 'irregular'; }
    if (echogenicFoci === 'microcalcifications') { score += 3; components.echoFoci = 'microcalcifications'; }
    else if (echogenicFoci === 'macrocalcifications') { score += 1; components.echoFoci = 'macrocalcifications'; }
    let risk = 'low', rec = 'No FNA';
    if (score >= 7) { risk = 'high'; rec = 'FNA if ≥1cm'; }
    else if (score >= 4) { risk = 'moderate'; rec = 'FNA if ≥1.5cm'; }
    else if (score > 0) { risk = 'low-moderate'; rec = 'FNA if ≥2.5cm'; }
    return { score, max_score: 13, risk, recommendation: rec, components, cite: CITATIONS[2], version: VERSION };
}

module.exports = { birads, lungRADS, tirads, VERSION, CITATIONS };
