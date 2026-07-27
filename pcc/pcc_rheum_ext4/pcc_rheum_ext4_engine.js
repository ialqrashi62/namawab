// P3-CM pcc_rheum_ext4_engine v3.51.0
'use strict';
function Ra(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-RA';
  if (t === 'active') plan = 'active-RA-DMARD';
  else if (t === 'remission') plan = 'RA-remission-monitor';
  return { plan, t };
}
function Sle(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-SLE';
  if (t === 'active') plan = 'active-SLE';
  else if (t === 'flare') plan = 'SLE-flare';
  return { plan, t };
}
function Spa(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-SpA';
  if (t === 'axial') plan = 'axial-SpA';
  return { plan, t };
}
function Vasculitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-vasculitis';
  if (t === 'GCA') plan = 'GCA-steroids';
  else if (t === 'ANCA') plan = 'ANCA-vasculitis';
  return { plan, t };
}
function Gout(input) {
  const i = input || {};
  const ua = Number(i.ua ?? 5);
  let plan = 'normal-uric-acid';
  if (ua >= 9) plan = 'severe-hyperuricemia';
  else if (ua >= 7) plan = 'mild-hyperuricemia';
  return { plan, ua };
}
function Osteo(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-OA';
  if (t === 'severe') plan = 'severe-OA';
  return { plan, t };
}
function Sjogren(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-Sjogren';
  if (t === 'confirmed') plan = 'Sjogren-syndrome';
  return { plan, t };
}
function Scleroderma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-scleroderma';
  if (t === 'diffuse') plan = 'diffuse-scleroderma';
  return { plan, t };
}
function Myositis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-myositis';
  if (t === 'active') plan = 'active-myositis';
  return { plan, t };
}
function Biologic(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-biologic';
  if (t === 'anti-TNF') plan = 'anti-TNF-monitor';
  else if (t === 'ritux') plan = 'rituximab';
  return { plan, t };
}
module.exports = {
  Ra, Sle, Spa, Vasculitis, Gout, Osteo, Sjogren, Scleroderma, Myositis, Biologic
};
