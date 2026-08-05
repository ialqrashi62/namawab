// P3_CU pcc_womens_health_engine v3.59.0
'use strict';
function Pregnancy(input) {
  const i = input || {};
  const w = Number(i.w ?? 0);
  let plan = 'not-pregnant';
  if (w >= 37) plan = 'term';
  else if (w >= 1) plan = 'pregnant';
  return { plan, w };
}
function Contraception(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-contraception';
  if (t === 'OCP') plan = 'OCP-rx';
  else if (t === 'IUD') plan = 'IUD-insertion';
  return { plan, t };
}
function Menopause(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pre-menopause';
  if (t === 'peri') plan = 'peri-menopause';
  else if (t === 'post') plan = 'post-menopause';
  return { plan, t };
}
function Pcos(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-PCOS';
  if (t === 'confirmed') plan = 'PCOS-confirmed';
  return { plan, t };
}
function Endometriosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-endometriosis';
  if (t === 'confirmed') plan = 'endometriosis-confirmed';
  return { plan, t };
}
function Infertility(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-infertility';
  if (t === 'eval') plan = 'infertility-eval';
  return { plan, t };
}
function Postpartum(input) {
  const i = input || {};
  const d = Number(i.d ?? 0);
  let plan = 'no-postpartum';
  if (d <= 6) plan = 'immediate-postpartum';
  else if (d <= 42) plan = 'early-postpartum';
  return { plan, d };
}
function Sti(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-STI';
  if (t === 'positive') plan = 'STI-positive';
  return { plan, t };
}
function Domestic(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-DV';
  if (t === 'concern') plan = 'DV-concern';
  return { plan, t };
}
function Vaginitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-vaginitis';
  if (t === 'recurrent') plan = 'recurrent-vaginitis';
  return { plan, t };
}
module.exports = {
  Pregnancy, Contraception, Menopause, Pcos, Endometriosis, Infertility, Postpartum, Sti, Domestic, Vaginitis
};
