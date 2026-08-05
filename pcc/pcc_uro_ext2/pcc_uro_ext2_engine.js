// P3_CO pcc_uro_ext2_engine v3.53.0
'use strict';
function Bph(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-BPH';
  if (t === 'mild') plan = 'mild-BPH-monitor';
  else if (t === 'severe') plan = 'severe-BPH-TURP';
  return { plan, t };
}
function Pca(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-PCA';
  if (t === 'low-risk') plan = 'low-risk-PCA';
  else if (t === 'metastatic') plan = 'metastatic-PCA';
  return { plan, t };
}
function Renal(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-renal-mass';
  if (t === 'RCC') plan = 'RCC-workup';
  return { plan, t };
}
function Stone(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-stone';
  if (t === 'large') plan = 'large-stone-intervention';
  return { plan, t };
}
function Bladder(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-bladder-issue';
  if (t === 'cancer') plan = 'bladder-cancer-TURBT';
  return { plan, t };
}
function Incontinence(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-incontinence';
  if (t === 'urge') plan = 'urge-incontinence';
  return { plan, t };
}
function Erectile(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-ED';
  if (t === 'PDE5') plan = 'PDE5-responsive-ED';
  return { plan, t };
}
function Urethritis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-urethritis';
  if (t === 'gonococcal') plan = 'gonococcal-urethritis';
  return { plan, t };
}
function Prostatitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-prostatitis';
  if (t === 'acute') plan = 'acute-bacterial-prostatitis';
  return { plan, t };
}
function Hematuria(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-hematuria';
  if (t === 'gross') plan = 'gross-hematuria-workup';
  return { plan, t };
}
module.exports = {
  Bph, Pca, Renal, Stone, Bladder, Incontinence, Erectile, Urethritis, Prostatitis, Hematuria
};
