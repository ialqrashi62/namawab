// Insert tier14-17 mounts into the real server.js
const fs = require('fs');
const c = fs.readFileSync('server.js.full', 'utf8');
const idx = c.lastIndexOf('startServer();');
if (idx < 0) { console.error('startServer not found'); process.exit(1); }
const mounts = `
try { app.use('/api/pharm_order', require('./tier14_pharm_ext_101_order_router')); } catch(e) { console.error('pharm_order mount failed', e.message); }
try { app.use('/api/pharm_compounding', require('./tier14_pharm_ext_102_compounding_router')); } catch(e) { console.error('pharm_compounding mount failed', e.message); }
try { app.use('/api/pharm_interaction', require('./tier14_pharm_ext_103_interaction_router')); } catch(e) { console.error('pharm_interaction mount failed', e.message); }
try { app.use('/api/pharm_formulary', require('./tier14_pharm_ext_104_formulary_router')); } catch(e) { console.error('pharm_formulary mount failed', e.message); }
try { app.use('/api/pharm_inventory', require('./tier14_pharm_ext_105_inventory_router')); } catch(e) { console.error('pharm_inventory mount failed', e.message); }
try { app.use('/api/pharm_stewardship', require('./tier14_pharm_ext_106_stewardship_router')); } catch(e) { console.error('pharm_stewardship mount failed', e.message); }
try { app.use('/api/icu_vitals', require('./tier15_icu_ext_107_vitals_router')); } catch(e) { console.error('icu_vitals mount failed', e.message); }
try { app.use('/api/icu_hemodynamics', require('./tier15_icu_ext_108_hemodynamics_router')); } catch(e) { console.error('icu_hemodynamics mount failed', e.message); }
try { app.use('/api/icu_renal', require('./tier15_icu_ext_109_renal_router')); } catch(e) { console.error('icu_renal mount failed', e.message); }
try { app.use('/api/icu_nutrition', require('./tier15_icu_ext_110_nutrition_router')); } catch(e) { console.error('icu_nutrition mount failed', e.message); }
try { app.use('/api/icu_admin', require('./tier15_icu_ext_111_icu_admin_router')); } catch(e) { console.error('icu_admin mount failed', e.message); }
try { app.use('/api/or_preop', require('./tier16_or_ext_112_preop_router')); } catch(e) { console.error('or_preop mount failed', e.message); }
try { app.use('/api/or_intraop', require('./tier16_or_ext_113_intraop_router')); } catch(e) { console.error('or_intraop mount failed', e.message); }
try { app.use('/api/or_postop', require('./tier16_or_ext_114_postop_router')); } catch(e) { console.error('or_postop mount failed', e.message); }
try { app.use('/api/or_scheduling', require('./tier16_or_ext_115_scheduling_router')); } catch(e) { console.error('or_scheduling mount failed', e.message); }
try { app.use('/api/or_surgical', require('./tier16_or_ext_116_surgical_router')); } catch(e) { console.error('or_surgical mount failed', e.message); }
try { app.use('/api/portal_auth', require('./tier17_portal_ext_117_auth_router')); } catch(e) { console.error('portal_auth mount failed', e.message); }
try { app.use('/api/portal_records', require('./tier17_portal_ext_118_records_router')); } catch(e) { console.error('portal_records mount failed', e.message); }
try { app.use('/api/portal_appointments', require('./tier17_portal_ext_119_appointments_router')); } catch(e) { console.error('portal_appointments mount failed', e.message); }
try { app.use('/api/portal_billing', require('./tier17_portal_ext_120_billing_router')); } catch(e) { console.error('portal_billing mount failed', e.message); }
try { app.use('/api/portal_messaging', require('./tier17_portal_ext_121_messaging_router')); } catch(e) { console.error('portal_messaging mount failed', e.message); }
try { app.use('/api/infx_outbreak', require('./tier18_infx_ext_122_outbreak_router')); } catch(e) { console.error('infx_outbreak mount failed', e.message); }
try { app.use('/api/infx_isolation', require('./tier18_infx_ext_123_isolation_router')); } catch(e) { console.error('infx_isolation mount failed', e.message); }
try { app.use('/api/infx_mdro', require('./tier18_infx_ext_124_mdro_router')); } catch(e) { console.error('infx_mdro mount failed', e.message); }
try { app.use('/api/infx_surveillance', require('./tier18_infx_ext_125_surveillance_router')); } catch(e) { console.error('infx_surveillance mount failed', e.message); }
try { app.use('/api/infx_employee', require('./tier18_infx_ext_126_employee_router')); } catch(e) { console.error('infx_employee mount failed', e.message); }
try { app.use('/api/him_coding', require('./tier19_him_ext_127_coding_router')); } catch(e) { console.error('him_coding mount failed', e.message); }
try { app.use('/api/him_roi', require('./tier19_him_ext_128_roi_router')); } catch(e) { console.error('him_roi mount failed', e.message); }
try { app.use('/api/him_deficiency', require('./tier19_him_ext_129_deficiency_router')); } catch(e) { console.error('him_deficiency mount failed', e.message); }
try { app.use('/api/him_audit', require('./tier19_him_ext_130_audit_router')); } catch(e) { console.error('him_audit mount failed', e.message); }
try { app.use('/api/him_release', require('./tier19_him_ext_131_release_router')); } catch(e) { console.error('him_release mount failed', e.message); }
try { app.use('/api/research_trial', require('./tier20_research_ext_132_trial_router')); } catch(e) { console.error('research_trial mount failed', e.message); }
try { app.use('/api/research_consent', require('./tier20_research_ext_133_consent_router')); } catch(e) { console.error('research_consent mount failed', e.message); }
try { app.use('/api/research_irb', require('./tier20_research_ext_134_irb_router')); } catch(e) { console.error('research_irb mount failed', e.message); }
try { app.use('/api/research_recruitment', require('./tier20_research_ext_135_recruitment_router')); } catch(e) { console.error('research_recruitment mount failed', e.message); }
try { app.use('/api/research_biobank', require('./tier20_research_ext_136_biobank_router')); } catch(e) { console.error('research_biobank mount failed', e.message); }
try { app.use('/api/sched_provider', require('./tier21_sched_ext_137_provider_router')); } catch(e) { console.error('sched_provider mount failed', e.message); }
try { app.use('/api/sched_call', require('./tier21_sched_ext_138_call_router')); } catch(e) { console.error('sched_call mount failed', e.message); }
try { app.use('/api/sched_template', require('./tier21_sched_ext_139_template_router')); } catch(e) { console.error('sched_template mount failed', e.message); }
try { app.use('/api/sched_waitlist', require('./tier21_sched_ext_140_waitlist_router')); } catch(e) { console.error('sched_waitlist mount failed', e.message); }
try { app.use('/api/sched_appointment', require('./tier21_sched_ext_141_appointment_router')); } catch(e) { console.error('sched_appointment mount failed', e.message); }
try { app.use('/api/sched_staff', require('./tier21_sched_ext_142_staff_router')); } catch(e) { console.error('sched_staff mount failed', e.message); }
try { app.use('/api/wound_assessment', require('./tier22_wound_ext_143_assessment_router')); } catch(e) { console.error('wound_assessment mount failed', e.message); }
try { app.use('/api/wound_dressing', require('./tier22_wound_ext_144_dressing_router')); } catch(e) { console.error('wound_dressing mount failed', e.message); }
try { app.use('/api/wound_healing', require('./tier22_wound_ext_145_healing_router')); } catch(e) { console.error('wound_healing mount failed', e.message); }
try { app.use('/api/wound_measurement', require('./tier22_wound_ext_146_measurement_router')); } catch(e) { console.error('wound_measurement mount failed', e.message); }
try { app.use('/api/wound_staging', require('./tier22_wound_ext_147_staging_router')); } catch(e) { console.error('wound_staging mount failed', e.message); }
try { app.use('/api/dialysis_access', require('./tier23_dialysis_ext_148_access_router')); } catch(e) { console.error('dialysis_access mount failed', e.message); }
try { app.use('/api/dialysis_adequacy', require('./tier23_dialysis_ext_149_adequacy_router')); } catch(e) { console.error('dialysis_adequacy mount failed', e.message); }
try { app.use('/api/dialysis_complication', require('./tier23_dialysis_ext_150_complication_router')); } catch(e) { console.error('dialysis_complication mount failed', e.message); }
try { app.use('/api/dialysis_peritoneal', require('./tier23_dialysis_ext_151_peritoneal_router')); } catch(e) { console.error('dialysis_peritoneal mount failed', e.message); }
try { app.use('/api/dialysis_dialyzer', require('./tier23_dialysis_ext_152_dialyzer_router')); } catch(e) { console.error('dialysis_dialyzer mount failed', e.message); }
try { app.use('/api/tx_candidate', require('./tier24_transplant_ext_153_candidate_router')); } catch(e) { console.error('tx_candidate mount failed', e.message); }
try { app.use('/api/tx_donor', require('./tier24_transplant_ext_154_donor_router')); } catch(e) { console.error('tx_donor mount failed', e.message); }
try { app.use('/api/tx_immuno', require('./tier24_transplant_ext_155_immuno_router')); } catch(e) { console.error('tx_immuno mount failed', e.message); }
try { app.use('/api/tx_outcome', require('./tier24_transplant_ext_156_outcome_router')); } catch(e) { console.error('tx_outcome mount failed', e.message); }
try { app.use('/api/tx_followup', require('./tier24_transplant_ext_157_followup_router')); } catch(e) { console.error('tx_followup mount failed', e.message); }
`;
const newC = c.slice(0, idx) + mounts + '\n' + c.slice(idx);
fs.writeFileSync('server.js', newC);
console.log('Inserted', mounts.split('\n').length, 'mounts. New file size:', newC.length);