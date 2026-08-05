// P3_EK pcc_pediatric_surg_subspec_engine v3.101.0
'use strict';
function PediatricHepatobiliarySurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHepatobiliarySurg-none';
  if (t === 'yes') plan = 'pediatricHepatobiliarySurg-protocol';
  return { plan, t };
}
function PediatricThoracicSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricThoracicSurg-none';
  if (t === 'yes') plan = 'pediatricThoracicSurg-protocol';
  return { plan, t };
}
function PediatricUrologicSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricUrologicSurg-none';
  if (t === 'yes') plan = 'pediatricUrologicSurg-protocol';
  return { plan, t };
}
function PediatricColorectalSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricColorectalSurg-none';
  if (t === 'yes') plan = 'pediatricColorectalSurg-protocol';
  return { plan, t };
}
function PediatricENT(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricENT-none';
  if (t === 'yes') plan = 'pediatricENT-protocol';
  return { plan, t };
}
function PediatricOphthalmicSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricOphthalmicSurg-none';
  if (t === 'yes') plan = 'pediatricOphthalmicSurg-protocol';
  return { plan, t };
}
function PediatricPlasticRecon(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPlasticRecon-none';
  if (t === 'yes') plan = 'pediatricPlasticRecon-protocol';
  return { plan, t };
}
function PediatricBariatricSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBariatricSurg-none';
  if (t === 'yes') plan = 'pediatricBariatricSurg-protocol';
  return { plan, t };
}
function PediatricTransplantSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTransplantSurg-none';
  if (t === 'yes') plan = 'pediatricTransplantSurg-protocol';
  return { plan, t };
}
function PediatricTraumaSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTraumaSurg-none';
  if (t === 'yes') plan = 'pediatricTraumaSurg-protocol';
  return { plan, t };
}
module.exports = { PediatricHepatobiliarySurg, PediatricThoracicSurg, PediatricUrologicSurg, PediatricColorectalSurg, PediatricENT, PediatricOphthalmicSurg, PediatricPlasticRecon, PediatricBariatricSurg, PediatricTransplantSurg, PediatricTraumaSurg };
