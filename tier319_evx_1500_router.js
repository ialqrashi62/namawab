// tier319_evx_1500_router.js — DB persistence for analytics events (multi-tenant RLS)
const express = require('express');
const { query } = require('./db_postgres');
const { funcs, ValidationError } = require('./tier319_evx_1500_engine.js');
const r = express.Router();
r.post('/event', async (req,res)=>{ try{
  const shaped = funcs().validate_event(req.body||{});
  const q = 'INSERT INTO analytics_events (tenant_id,user_role,event,payload) VALUES ($1,$2,$3,$4) RETURNING id';
  const row = (await query(q,[shaped.tenant_id,shaped.user_role||null,shaped.event,{}])).rows[0];
  res.json({ok:true,result:{id:row.id}});
}catch(e){ res.status(e instanceof ValidationError?400:500).json({ok:false,error:e.message}); }});
r.post('/funnel', async (req,res)=>{ try{
  const { steps, counts } = funcs().shape_funnel_query(req.body||{});
  const rows = (await query("SELECT event, count(*)::int c FROM analytics_events WHERE tenant_id=current_setting('app.tenant_id',true)::uuid AND event=ANY($1) GROUP BY event",[steps])).rows;
  const map = Object.fromEntries(rows.map(x=>[x.event,x.c]));
  res.json({ok:true,result:{steps,counts:steps.map(s=>map[s]||0)}});
}catch(e){ res.status(500).json({ok:false,error:e.message}); }});
module.exports = r;
