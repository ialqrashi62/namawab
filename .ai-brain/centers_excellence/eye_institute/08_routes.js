const { funcs, ValidationError } = require('./tierAUTO_eye_institute_engine.js');
const r = require('express').Router();
for (const fn of Object.keys(funcs())) {
  r.post('/'+fn, /* auth, tenant, RBAC */ (req,res)=>{
    try { res.json({ ok:true, result: funcs()[fn](req.body||{}) }); }
    catch(e) { res.status(e instanceof ValidationError?400:500).json({ok:false,error:e.message}); }
  });
}
module.exports = r;
