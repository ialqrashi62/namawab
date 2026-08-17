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
`;
const newC = c.slice(0, idx) + mounts + '\n' + c.slice(idx);
fs.writeFileSync('server.js', newC);
console.log('Inserted', mounts.split('\n').length, 'mounts. New file size:', newC.length);