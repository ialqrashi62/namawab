// P3_EP pcc_neuro_ext7_engine v3.106.0
'use strict';
function SpinalMuscularAtrophy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinalMuscularAtrophy-none';
  if (t === 'yes') plan = 'spinalMuscularAtrophy-protocol';
  return { plan, t };
}
function BeckerMuscularDystrophy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'beckerMuscularDystrophy-none';
  if (t === 'yes') plan = 'beckerMuscularDystrophy-protocol';
  return { plan, t };
}
function DuchenneMuscularDystrophy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'duchenneMuscularDystrophy-none';
  if (t === 'yes') plan = 'duchenneMuscularDystrophy-protocol';
  return { plan, t };
}
function FacioscapulohumeralMD(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'facioscapulohumeralMD-none';
  if (t === 'yes') plan = 'facioscapulohumeralMD-protocol';
  return { plan, t };
}
function LimbGirdleMD(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'limbGirdleMD-none';
  if (t === 'yes') plan = 'limbGirdleMD-protocol';
  return { plan, t };
}
function OculopharyngealMD(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'oculopharyngealMD-none';
  if (t === 'yes') plan = 'oculopharyngealMD-protocol';
  return { plan, t };
}
function MyotonicDystrophyExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'myotonicDystrophyExt-none';
  if (t === 'yes') plan = 'myotonicDystrophyExt-protocol';
  return { plan, t };
}
function CongenitalMyopathy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'congenitalMyopathy-none';
  if (t === 'yes') plan = 'congenitalMyopathy-protocol';
  return { plan, t };
}
function MitochondrialMyopathy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mitochondrialMyopathy-none';
  if (t === 'yes') plan = 'mitochondrialMyopathy-protocol';
  return { plan, t };
}
function InflammatoryMyopathy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'inflammatoryMyopathy-none';
  if (t === 'yes') plan = 'inflammatoryMyopathy-protocol';
  return { plan, t };
}
module.exports = { SpinalMuscularAtrophy, BeckerMuscularDystrophy, DuchenneMuscularDystrophy, FacioscapulohumeralMD, LimbGirdleMD, OculopharyngealMD, MyotonicDystrophyExt, CongenitalMyopathy, MitochondrialMyopathy, InflammatoryMyopathy };
