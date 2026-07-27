// P3-DO pcc_hepatology_advanced_engine v3.79.0
'use strict';
function AscitesRefractory(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ascitesrefractory-none';
  if (t === 'yes') plan = 'ascitesrefractory-protocol';
  return { plan, t };
}
function HepaticEncephalopathyRecurrent(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hepaticencephalopathyrecurrent-none';
  if (t === 'yes') plan = 'hepaticencephalopathyrecurrent-protocol';
  return { plan, t };
}
function HepatorenalSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hepatorenalsyndrome-none';
  if (t === 'yes') plan = 'hepatorenalsyndrome-protocol';
  return { plan, t };
}
function HepatopulmonarySyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hepatopulmonarysyndrome-none';
  if (t === 'yes') plan = 'hepatopulmonarysyndrome-protocol';
  return { plan, t };
}
function PortopulmonaryHypertension(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'portopulmonaryhypertension-none';
  if (t === 'yes') plan = 'portopulmonaryhypertension-protocol';
  return { plan, t };
}
function AcuteLiverFailure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'acuteliverfailure-none';
  if (t === 'yes') plan = 'acuteliverfailure-protocol';
  return { plan, t };
}
function AutoimmuneHepatitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'autoimmunehepatitis-none';
  if (t === 'yes') plan = 'autoimmunehepatitis-protocol';
  return { plan, t };
}
function PrimaryBiliaryCholangitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'primarybiliarycholangitis-none';
  if (t === 'yes') plan = 'primarybiliarycholangitis-protocol';
  return { plan, t };
}
function PrimarySclerosingCholangitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'primarysclerosingcholangitis-none';
  if (t === 'yes') plan = 'primarysclerosingcholangitis-protocol';
  return { plan, t };
}
function LiverTransplantEvaluation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'livertransplantevaluation-none';
  if (t === 'yes') plan = 'livertransplantevaluation-protocol';
  return { plan, t };
}
module.exports = {
  AscitesRefractory, HepaticEncephalopathyRecurrent, HepatorenalSyndrome, HepatopulmonarySyndrome, PortopulmonaryHypertension, AcuteLiverFailure, AutoimmuneHepatitis, PrimaryBiliaryCholangitis, PrimarySclerosingCholangitis, LiverTransplantEvaluation
};
