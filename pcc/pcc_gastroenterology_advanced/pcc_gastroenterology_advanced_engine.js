// P3_DO pcc_gastroenterology_advanced_engine v3.79.0
'use strict';
function ChronicDiarrheaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'chronicdiarrheaworkup-none';
  if (t === 'yes') plan = 'chronicdiarrheaworkup-protocol';
  return { plan, t };
}
function ConstipationRefractory(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'constipationrefractory-none';
  if (t === 'yes') plan = 'constipationrefractory-protocol';
  return { plan, t };
}
function IBDFlareManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ibdflaremanagement-none';
  if (t === 'yes') plan = 'ibdflaremanagement-protocol';
  return { plan, t };
}
function IBSRefractory(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ibsrefractory-none';
  if (t === 'yes') plan = 'ibsrefractory-protocol';
  return { plan, t };
}
function CeliacDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'celiacdisease-none';
  if (t === 'yes') plan = 'celiacdisease-protocol';
  return { plan, t };
}
function Gastroparesis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'gastroparesis-none';
  if (t === 'yes') plan = 'gastroparesis-protocol';
  return { plan, t };
}
function EosinophilicEsophagitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'eosinophilicesophagitis-none';
  if (t === 'yes') plan = 'eosinophilicesophagitis-protocol';
  return { plan, t };
}
function GIBleedAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'gibleedadvanced-none';
  if (t === 'yes') plan = 'gibleedadvanced-protocol';
  return { plan, t };
}
function PancreatitisChronic(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pancreatitischronic-none';
  if (t === 'yes') plan = 'pancreatitischronic-protocol';
  return { plan, t };
}
function SmallIntestinalBacterialOvergrowth(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'smallintestinalbacterialovergrowth-none';
  if (t === 'yes') plan = 'smallintestinalbacterialovergrowth-protocol';
  return { plan, t };
}
module.exports = {
  ChronicDiarrheaWorkup, ConstipationRefractory, IBDFlareManagement, IBSRefractory, CeliacDisease, Gastroparesis, EosinophilicEsophagitis, GIBleedAdvanced, PancreatitisChronic, SmallIntestinalBacterialOvergrowth
};
