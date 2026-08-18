// filepath: tier72_er_391_er_trauma_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function primary_survey(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.survey_id, 'sid');
  ensureEnum(req.a_airway, 'a', ['patent','partially_obstructed','obstructed','intubated','cricothyrotomy','surgical_airway','protected','maintained','nasal_airway','oral_airway','other']);
  ensureEnum(req.b_breathing, 'b', ['normal','tachypneic','bradypneic','apneic','labored','shallow','use_of_accessory_muscles','decreased_breath_sounds','absent_breath_sounds','stridor','wheezing','barrel_chest','flail_chest','other']);
  ensureEnum(req.c_circulation, 'c', ['normal','hypertensive','hypotensive','tachycardic','bradycardic','pulseless','bleeding_controlled','bleeding_uncontrolled','shock','other']);
  ensureEnum(req.d_disability, 'd', ['gcs_15','gcs_14','gcs_13','gcs_12','gcs_11','gcs_10','gcs_9','gcs_8','gcs_7','gcs_6','gcs_5','gcs_4','gcs_3','unresponsive','alert','other']);
  ensureEnum(req.e_exposure, 'e', ['no_significant_injury','lacerations','abrasions','contusions','penetrating_injury','open_fracture','burn','rash','other','completely_examined']);
  ensureEnum(req.iv_access, 'iva', ['two_lines','one_line','central_line','io_line','none_established','none_needed','not_applicable','other']);
  ensureBool(req.fluid_resuscitation, 'fr');
  ensureBool(req.cervical_collar, 'cc');
  ensureBool(req.log_roll, 'lr');
  ensureStr(req.documented_by, 'db');
  return { survey: req.survey_id };
}
function secondary_survey(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.survey_id, 'sid');
  ensureStr(req.head_injuries, 'hi');
  ensureStr(req.cspine_injuries, 'csi');
  ensureStr(req.chest_injuries, 'chi');
  ensureStr(req.abdomen_injuries, 'ai');
  ensureEnum(req.pelvis_injuries, 'pi', ['stable','unstable','fracture','dislocation','open_fracture','tenderness','no_significant_injury','other']);
  ensureStr(req.extremity_injuries, 'exi');
  ensureStr(req.back_injuries, 'bi');
  ensureEnum(req.neurological_assessment, 'na', ['grossly_intact','focal_deficits','altered','grossly_intact_altered','grossly_intact_other','decreased','absent','gcs_15','other']);
  ensureStr(req.documented_by, 'db');
  return { survey: req.survey_id };
}
function fracture_reduction(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.fracture_id, 'fid');
  ensureEnum(req.fracture_type, 'ft', ['distal_radius','radial_head','olecranon','humeral_shaft','hip_femur','tibia_fibula','ankle','shoulder','patella','clavicle','scaphoid','finger_toe','mandible','other']);
  ensureEnum(req.displacement, 'disp', ['dorsal','volar','medial','lateral','anterior','posterior','rotational','shortening','angulated','lateral_dorsal','valgus','varus','minimal','other']);
  ensureEnum(req.method, 'method', ['closed_reduction','open_reduction','external_fixation','skeletal_traction','splint','cast','other']);
  ensureBool(req.sedation_used, 'su');
  ensureBool(req.reduction_adequate, 'ra');
  ensureBool(req.splint_applied, 'sa');
  ensureEnum(req.post_reduction_xray, 'prx', ['good_alignment','acceptable_alignment','repeat_reduction_needed','c_spine_clear','not_performed','other']);
  ensureNum(req.follow_up_ortho, 'fuo');
  ensureStr(req.documented_by, 'db');
  ensureStr(req.analgesia, 'an');
  return { fid: req.fracture_id };
}
function wound_exploration(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.wound_id, 'wid');
  ensureStr(req.wound_location, 'wl');
  ensureNum(req.wound_length_cm, 'wlc');
  ensureNum(req.wound_depth_cm, 'wdc');
  ensureBool(req.foreign_body_present, 'fbp');
  ensureBool(req.tissue_devitalized, 'td');
  ensureBool(req.debris_present, 'dp');
  ensureNum(req.irrigation_volume_ml, 'ivm');
  ensureEnum(req.closure_method, 'cm', ['simple_sutures','mattress_sutures','subcuticular','staples','tissue_adhesive','steri_strips','secondary_intention','delayed_primary','other']);
  ensureNum(req.suture_count, 'sc');
  ensureBool(req.antibiotics_given, 'ag');
  ensureBool(req.tetanus_prophylaxis, 'tp');
  ensureStr(req.documented_by, 'db');
  return { wid: req.wound_id };
}
function trauma_sedation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.sedation_id, 'sid');
  ensureEnum(req.procedure, 'proc', ['fracture_reduction','wound_exploration','dislocation_reduction','joint_aspiration','lumbar_puncture','chest_tube','central_line','dressing_change','cardioversion','other']);
  ensureEnum(req.sedation_type, 'st', ['procedural','conscious_sedation','deep_sedation','minimal_sedation','general_anesthesia','moderate_sedation','other']);
  ensureEnum(req.agent, 'agent', ['ketamine','propofol','midazolam','fentanyl','etomidate','dexmedetomidine','remifentanil','sevoflurane','isoflurane','nitrous_oxide','chloral_hydrate','other']);
  ensureNum(req.dose_mg, 'dm');
  ensureEnum(req.route, 'route', ['iv','im','po','pr','intranasal','inhaled','subcutaneous','other']);
  ensureEnum(req.sedation_depth, 'sd', ['minimal','moderate','deep','general_anesthesia','conscious_sedation','dissociative','analgesia_only','other']);
  ensureEnum(req.monitoring, 'mon', ['etco2','continuous_cardiac','continuous_pulse_ox','continuous_nibp','q5min_vitals','verbal_stimulation','other']);
  ensureBool(req.reversal_agent_needed, 'ran');
  ensureNum(req.recovery_min, 'rm');
  ensureEnum(req.complications, 'comp', ['none','hypoxia','apnea','hypotension','bradycardia','vomiting','agitation','hallucinations','laryngospasm','need_reversal','other']);
  ensureStr(req.documented_by, 'db');
  return { proc: req.procedure };
}

function funcs() { return { primary_survey, secondary_survey, fracture_reduction, wound_exploration, trauma_sedation }; }
module.exports = { funcs, ValidationError };