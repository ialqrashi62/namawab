// P3-CM pcc_gi_ext3_engine v3.51.0
'use strict';
function Dysphagia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-dysphagia';
  if (t === 'oropharyngeal') plan = 'oropharyngeal-eval';
  else if (t === 'esophageal') plan = 'esophageal-eval';
  return { plan, t };
}
function GERD(input) {
  const i = input || {};
  const sev = String(i.s || '');
  let plan = 'mild-GERD';
  if (sev === 'severe') plan = 'severe-GERD-PPI';
  else if (sev === 'refractory') plan = 'refractory-GERD-endoscopy';
  return { plan, sev };
}
function IBS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-IBS';
  if (t === 'IBS-D') plan = 'IBS-D-treatment';
  else if (t === 'IBS-C') plan = 'IBS-C-treatment';
  return { plan, t };
}
function IBD(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-IBD';
  if (t === 'UC') plan = 'ulcerative-colitis';
  else if (t === 'CD') plan = 'crohns-disease';
  return { plan, t };
}
function Celiac(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-celiac';
  if (t === 'serology') plan = 'celiac-serology';
  else if (t === 'biopsy') plan = 'celiac-biopsy';
  return { plan, t };
}
function HepB(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-hepB';
  if (t === 'chronic') plan = 'chronic-HBV';
  else if (t === 'acute') plan = 'acute-HBV';
  return { plan, t };
}
function HepC(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-hepC';
  if (t === 'detected') plan = 'HCV-treatment';
  return { plan, t };
}
function Cirr(input) {
  const i = input || {};
  const m = Number(i.meld ?? 0);
  let plan = 'no-cirrhosis';
  if (m >= 30) plan = 'decompensated-cirrhosis';
  else if (m >= 15) plan = 'compensated-cirrhosis';
  else if (m >= 10) plan = 'mild-liver-disease';
  return { plan, meld: m };
}
function Ppi(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-PPI';
  if (t === 'long-term') plan = 'long-term-PPI-caution';
  return { plan, t };
}
function Scope(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-scope';
  if (t === 'screening') plan = 'screening-colonoscopy';
  if (t === 'EGD') plan = 'EGD-upper-endoscopy';
  return { plan, t };
}
module.exports = {
  Dysphagia, GERD, IBS, IBD, Celiac, HepB, HepC, Cirr, Ppi, Scope
};
