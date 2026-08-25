// Food & Nutrition Services engine — pure functions
class ValidationError extends Error { constructor(m,f){super(m);this.field=f;} }
function ensureStr(v,f){ if(typeof v!=='string'||!v.trim()) throw new ValidationError(f+' must be string',f); }
function nutritional_screen_must(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for nutritional_screen_must
  return { id: `nutritional_screen_must_${Date.now()}`, ok: true, echo: req };
}

function tpn_formula(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for tpn_formula
  return { id: `tpn_formula_${Date.now()}`, ok: true, echo: req };
}

function diet_order(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for diet_order
  return { id: `diet_order_${Date.now()}`, ok: true, echo: req };
}

function room_service_menu(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for room_service_menu
  return { id: `room_service_menu_${Date.now()}`, ok: true, echo: req };
}

function malnutrition_grade(req) { ensureStr(req.tenant_id,'tid'); if(!req.patient_id) throw new ValidationError('patient_id required','patient_id');
  // TODO clinical rules for malnutrition_grade
  return { id: `malnutrition_grade_${Date.now()}`, ok: true, echo: req };
}
function funcs() { return { nutritional_screen_must, tpn_formula, diet_order, room_service_menu, malnutrition_grade }; }
module.exports = { funcs, ValidationError };
