// P3-EL pcc_pediatric_imaging_engine v3.102.0
'use strict';
function PediatricBrainMRI(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBrainMRI-none';
  if (t === 'yes') plan = 'pediatricBrainMRI-protocol';
  return { plan, t };
}
function PediatricCTHead(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCTHead-none';
  if (t === 'yes') plan = 'pediatricCTHead-protocol';
  return { plan, t };
}
function PediatricChestImaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricChestImaging-none';
  if (t === 'yes') plan = 'pediatricChestImaging-protocol';
  return { plan, t };
}
function PediatricAbdomenImaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAbdomenImaging-none';
  if (t === 'yes') plan = 'pediatricAbdomenImaging-protocol';
  return { plan, t };
}
function PediatricSpineImaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSpineImaging-none';
  if (t === 'yes') plan = 'pediatricSpineImaging-protocol';
  return { plan, t };
}
function PediatricMusculoskeletalImaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricMusculoskeletalImaging-none';
  if (t === 'yes') plan = 'pediatricMusculoskeletalImaging-protocol';
  return { plan, t };
}
function PediatricCardiacImaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCardiacImaging-none';
  if (t === 'yes') plan = 'pediatricCardiacImaging-protocol';
  return { plan, t };
}
function PediatricFetalImaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricFetalImaging-none';
  if (t === 'yes') plan = 'pediatricFetalImaging-protocol';
  return { plan, t };
}
function PediatricUltrasound(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricUltrasound-none';
  if (t === 'yes') plan = 'pediatricUltrasound-protocol';
  return { plan, t };
}
function PediatricNuclearMedicine(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNuclearMedicine-none';
  if (t === 'yes') plan = 'pediatricNuclearMedicine-protocol';
  return { plan, t };
}
module.exports = { PediatricBrainMRI, PediatricCTHead, PediatricChestImaging, PediatricAbdomenImaging, PediatricSpineImaging, PediatricMusculoskeletalImaging, PediatricCardiacImaging, PediatricFetalImaging, PediatricUltrasound, PediatricNuclearMedicine };
