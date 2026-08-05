// P3_EQ pcc_neuro_ext8_engine v3.107.0
'use strict';
function AcuteFlaccidMyelitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'acuteFlaccidMyelitis-none';
  if (t === 'yes') plan = 'acuteFlaccidMyelitis-protocol';
  return { plan, t };
}
function TransverseMyelitisEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'transverseMyelitisEval-none';
  if (t === 'yes') plan = 'transverseMyelitisEval-protocol';
  return { plan, t };
}
function NeuromyelitisOpticaExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neuromyelitisOpticaExt-none';
  if (t === 'yes') plan = 'neuromyelitisOpticaExt-protocol';
  return { plan, t };
}
function OpticNeuritisEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'opticNeuritisEval-none';
  if (t === 'yes') plan = 'opticNeuritisEval-protocol';
  return { plan, t };
}
function ConusMedullarisSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'conusMedullarisSyndrome-none';
  if (t === 'yes') plan = 'conusMedullarisSyndrome-protocol';
  return { plan, t };
}
function CaudaEquinaEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'caudaEquinaEval-none';
  if (t === 'yes') plan = 'caudaEquinaEval-protocol';
  return { plan, t };
}
function SyringomyeliaEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'syringomyeliaEval-none';
  if (t === 'yes') plan = 'syringomyeliaEval-protocol';
  return { plan, t };
}
function TetheredCordSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tetheredCordSyndrome-none';
  if (t === 'yes') plan = 'tetheredCordSyndrome-protocol';
  return { plan, t };
}
function DiastematomyeliaEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'diastematomyeliaEval-none';
  if (t === 'yes') plan = 'diastematomyeliaEval-protocol';
  return { plan, t };
}
function SpinalDuralAVFistula(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinalDuralAVFistula-none';
  if (t === 'yes') plan = 'spinalDuralAVFistula-protocol';
  return { plan, t };
}
module.exports = { AcuteFlaccidMyelitis, TransverseMyelitisEval, NeuromyelitisOpticaExt, OpticNeuritisEval, ConusMedullarisSyndrome, CaudaEquinaEval, SyringomyeliaEval, TetheredCordSyndrome, DiastematomyeliaEval, SpinalDuralAVFistula };
