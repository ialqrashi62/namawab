// P3-DN pcc_electrolyte_acid_base_engine v3.78.0
'use strict';
function HyponatremiaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hyponatremiaworkup-none';
  if (t === 'yes') plan = 'hyponatremiaworkup-protocol';
  return { plan, t };
}
function HypernatremiaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypernatremiaworkup-none';
  if (t === 'yes') plan = 'hypernatremiaworkup-protocol';
  return { plan, t };
}
function HypokalemiaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypokalemiaworkup-none';
  if (t === 'yes') plan = 'hypokalemiaworkup-protocol';
  return { plan, t };
}
function HyperkalemiaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hyperkalemiaworkup-none';
  if (t === 'yes') plan = 'hyperkalemiaworkup-protocol';
  return { plan, t };
}
function HypocalcemiaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypocalcemiaworkup-none';
  if (t === 'yes') plan = 'hypocalcemiaworkup-protocol';
  return { plan, t };
}
function HypercalcemiaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypercalcemiaworkup-none';
  if (t === 'yes') plan = 'hypercalcemiaworkup-protocol';
  return { plan, t };
}
function HypomagnesemiaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypomagnesemiaworkup-none';
  if (t === 'yes') plan = 'hypomagnesemiaworkup-protocol';
  return { plan, t };
}
function HypophosphatemiaWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypophosphatemiaworkup-none';
  if (t === 'yes') plan = 'hypophosphatemiaworkup-protocol';
  return { plan, t };
}
function MetabolicAcidosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'metabolicacidosis-none';
  if (t === 'yes') plan = 'metabolicacidosis-protocol';
  return { plan, t };
}
function MetabolicAlkalosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'metabolicalkalosis-none';
  if (t === 'yes') plan = 'metabolicalkalosis-protocol';
  return { plan, t };
}
module.exports = {
  HyponatremiaWorkup, HypernatremiaWorkup, HypokalemiaWorkup, HyperkalemiaWorkup, HypocalcemiaWorkup, HypercalcemiaWorkup, HypomagnesemiaWorkup, HypophosphatemiaWorkup, MetabolicAcidosis, MetabolicAlkalosis
};
