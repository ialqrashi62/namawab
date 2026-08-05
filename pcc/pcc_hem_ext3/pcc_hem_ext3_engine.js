// P3_CN pcc_hem_ext3_engine v3.52.0
'use strict';
function Anemia(input) {
  const i = input || {};
  const hb = Number(i.hb ?? 14);
  let plan = 'normal-Hb';
  if (hb < 7) plan = 'severe-anemia-transfuse';
  else if (hb < 10) plan = 'moderate-anemia';
  else if (hb < 12) plan = 'mild-anemia';
  return { plan, hb };
}
function Transfusion(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-transfusion';
  if (t === 'PRBC') plan = 'PRBC-transfusion';
  else if (t === 'platelets') plan = 'platelet-transfusion';
  else if (t === 'FFP') plan = 'FFP-transfusion';
  return { plan, t };
}
function Coag(input) {
  const i = input || {};
  const inr = Number(i.inr ?? 1);
  let plan = 'normal-coag';
  if (inr >= 4) plan = 'over-anticoagulated';
  else if (inr >= 2) plan = 'therapeutic-anticoag';
  return { plan, inr };
}
function Marrow(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-biopsy';
  if (t === 'scheduled') plan = 'scheduled-biopsy';
  else if (t === 'urgent') plan = 'urgent-biopsy';
  return { plan, t };
}
function Mds(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-MDS';
  if (t === 'low-risk') plan = 'low-risk-MDS';
  else if (t === 'high-risk') plan = 'high-risk-MDS';
  return { plan, t };
}
function Mpn(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-MPN';
  if (t === 'PV') plan = 'polycythemia-vera';
  else if (t === 'ET') plan = 'essential-thrombocytosis';
  return { plan, t };
}
function Lymphoma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-lymphoma';
  if (t === 'HL') plan = 'Hodgkin-lymphoma';
  else if (t === 'NHL') plan = 'non-Hodgkin-lymphoma';
  return { plan, t };
}
function Leukemia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-leukemia';
  if (t === 'AML') plan = 'AML-treatment';
  else if (t === 'ALL') plan = 'ALL-treatment';
  return { plan, t };
}
function Transplant(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-transplant';
  if (t === 'autologous') plan = 'autologous-transplant';
  else if (t === 'allogeneic') plan = 'allogeneic-transplant';
  return { plan, t };
}
function Iron(input) {
  const i = input || {};
  const fer = Number(i.fer ?? 100);
  let plan = 'normal-iron';
  if (fer < 30) plan = 'iron-deficiency';
  else if (fer > 300) plan = 'iron-overload';
  return { plan, fer };
}
module.exports = {
  Anemia, Transfusion, Coag, Marrow, Mds, Mpn, Lymphoma, Leukemia, Transplant, Iron
};
