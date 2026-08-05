// P3_EV pcc_pediatric_surg_ext2_engine v3.112.0
'use strict';
function PediatricCircumcision(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCircumcision-none';
  if (t === 'yes') plan = 'pediatricCircumcision-protocol';
  return { plan, t };
}
function PediatricHerniaRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHerniaRepair-none';
  if (t === 'yes') plan = 'pediatricHerniaRepair-protocol';
  return { plan, t };
}
function PediatricAppendectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAppendectomy-none';
  if (t === 'yes') plan = 'pediatricAppendectomy-protocol';
  return { plan, t };
}
function PediatricCholecystectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCholecystectomy-none';
  if (t === 'yes') plan = 'pediatricCholecystectomy-protocol';
  return { plan, t };
}
function PediatricFundoplication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricFundoplication-none';
  if (t === 'yes') plan = 'pediatricFundoplication-protocol';
  return { plan, t };
}
function PediatricGTube(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricGTube-none';
  if (t === 'yes') plan = 'pediatricGTube-protocol';
  return { plan, t };
}
function PediatricOrchiopexy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricOrchiopexy-none';
  if (t === 'yes') plan = 'pediatricOrchiopexy-protocol';
  return { plan, t };
}
function PediatricHypospadias(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHypospadias-none';
  if (t === 'yes') plan = 'pediatricHypospadias-protocol';
  return { plan, t };
}
function PediatricCleftLip(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCleftLip-none';
  if (t === 'yes') plan = 'pediatricCleftLip-protocol';
  return { plan, t };
}
function PediatricCleftPalate(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCleftPalate-none';
  if (t === 'yes') plan = 'pediatricCleftPalate-protocol';
  return { plan, t };
}
module.exports = { PediatricCircumcision, PediatricHerniaRepair, PediatricAppendectomy, PediatricCholecystectomy, PediatricFundoplication, PediatricGTube, PediatricOrchiopexy, PediatricHypospadias, PediatricCleftLip, PediatricCleftPalate };
