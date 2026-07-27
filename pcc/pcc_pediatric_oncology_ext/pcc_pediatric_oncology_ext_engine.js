// P3-ES pcc_pediatric_oncology_ext_engine v3.109.0
'use strict';
function PediatricALLRelapse(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricALLRelapse-none';
  if (t === 'yes') plan = 'pediatricALLRelapse-protocol';
  return { plan, t };
}
function PediatricAMLExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAMLExt-none';
  if (t === 'yes') plan = 'pediatricAMLExt-protocol';
  return { plan, t };
}
function PediatricCML(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCML-none';
  if (t === 'yes') plan = 'pediatricCML-protocol';
  return { plan, t };
}
function PediatricMDS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricMDS-none';
  if (t === 'yes') plan = 'pediatricMDS-protocol';
  return { plan, t };
}
function PediatricJMML(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricJMML-none';
  if (t === 'yes') plan = 'pediatricJMML-protocol';
  return { plan, t };
}
function PediatricBurkittLymphoma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBurkittLymphoma-none';
  if (t === 'yes') plan = 'pediatricBurkittLymphoma-protocol';
  return { plan, t };
}
function PediatricHodgkinLymphoma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHodgkinLymphoma-none';
  if (t === 'yes') plan = 'pediatricHodgkinLymphoma-protocol';
  return { plan, t };
}
function PediatricNHL(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNHL-none';
  if (t === 'yes') plan = 'pediatricNHL-protocol';
  return { plan, t };
}
function PediatricBrainstemGlioma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBrainstemGlioma-none';
  if (t === 'yes') plan = 'pediatricBrainstemGlioma-protocol';
  return { plan, t };
}
function PediatricMedulloblastoma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricMedulloblastoma-none';
  if (t === 'yes') plan = 'pediatricMedulloblastoma-protocol';
  return { plan, t };
}
module.exports = { PediatricALLRelapse, PediatricAMLExt, PediatricCML, PediatricMDS, PediatricJMML, PediatricBurkittLymphoma, PediatricHodgkinLymphoma, PediatricNHL, PediatricBrainstemGlioma, PediatricMedulloblastoma };
