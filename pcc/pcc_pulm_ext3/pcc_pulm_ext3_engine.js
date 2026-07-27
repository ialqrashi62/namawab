// P3-CN pcc_pulm_ext3_engine v3.52.0
'use strict';
function Asthma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-asthma';
  if (t === 'mild') plan = 'mild-asthma';
  else if (t === 'severe') plan = 'severe-asthma';
  else if (t === 'exacerbation') plan = 'asthma-exacerbation';
  return { plan, t };
}
function Copd(input) {
  const i = input || {};
  const gold = String(i.g || '');
  let plan = 'no-COPD';
  if (gold === 'D') plan = 'GOLD-D-severe';
  else if (gold === 'C') plan = 'GOLD-C';
  else if (gold === 'B') plan = 'GOLD-B';
  return { plan, gold };
}
function Pna(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-pneumonia';
  if (t === 'CAP') plan = 'community-pneumonia';
  else if (t === 'HAP') plan = 'hospital-pneumonia';
  return { plan, t };
}
function Tb(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-pulm-TB';
  if (t === 'active') plan = 'active-pulm-TB';
  return { plan, t };
}
function Pe(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-PE';
  if (t === 'confirmed') plan = 'PE-anticoagulation';
  return { plan, t };
}
function Ca(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-lung-CA';
  if (t === 'NSCLC') plan = 'NSCLC-treatment';
  else if (t === 'SCLC') plan = 'SCLC-treatment';
  return { plan, t };
}
function Mesothelioma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-mesothelioma';
  if (t === 'confirmed') plan = 'mesothelioma-workup';
  return { plan, t };
}
function Sarcoid(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-sarcoid';
  if (t === 'stage-1') plan = 'sarcoid-stage-1';
  return { plan, t };
}
function Ipf(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-IPF';
  if (t === 'confirmed') plan = 'IPF-antifibrotic';
  return { plan, t };
}
function Sleep(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-sleep-apnea';
  if (t === 'severe') plan = 'severe-OSA-CPAP';
  else if (t === 'mild') plan = 'mild-OSA';
  return { plan, t };
}
module.exports = {
  Asthma, Copd, Pna, Tb, Pe, Ca, Mesothelioma, Sarcoid, Ipf, Sleep
};
