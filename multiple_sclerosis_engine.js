// filepath: namaweb/multiple_sclerosis_engine.js
'use strict';
const VERSION = '1.0.0';
const CITATIONS = ['EDSS (Kurtzke 1983)', 'MSSS (Roxburgh 2005)'];

function edssScore(input) {
    const { pyramidal, cerebellar, brainstem, sensory, bowelBladder, visual, cerebral, ambulation } = input;
    const total = (pyramidal ?? 0) + (cerebellar ?? 0) + (brainstem ?? 0) + (sensory ?? 0) + (bowelBladder ?? 0) + (visual ?? 0) + (cerebral ?? 0);
    let edss = total;
    if (ambulation !== undefined) edss = Math.max(total, ambulation);
    let risk = 'mild', rec = 'Standard care';
    if (edss >= 7) { risk = 'severe'; rec = 'Wheelchair — secondary progressive'; }
    else if (edss >= 4) { risk = 'moderate'; rec = 'DMT optimization'; }
    else if (edss >= 1) { risk = 'mild'; rec = 'Monitor'; }
    return { score: edss, max_score: 10, risk, recommendation: rec, components: { pyramidal, cerebellar, brainstem, sensory, bowelBladder, visual, cerebral, ambulation }, cite: CITATIONS[0], version: VERSION };
}

module.exports = { edssScore, VERSION, CITATIONS };
