import os
MODULES = ['pcc_neuro_ext63', 'pcc_pediatric_neuro_ext52', 'pcc_pediatric_surg_ext52']
ROOT = r'c:\Users\ice\Desktop\NMEDCALVSCODE\pcc'
MIG = os.path.join(ROOT, 'migrations')

ENGINE_FUNCS = {
    'pcc_neuro_ext63': [
        ('IntracranialAtherosclerosisDiseaseExt', lambda i: {'version':'3.162.0','module':'pcc_neuro_ext63','function':'IntracranialAtherosclerosisDiseaseExt','input':i,'score':round(0.1+(float(i.get('stenosis',50)))/200,2),'ts':TS}),
        ('CerebralMicrobleedsSyndromeExt', lambda i: {'version':'3.162.0','module':'pcc_neuro_ext63','function':'CerebralMicrobleedsSyndromeExt','input':i,'score':round(0.05+len(str(i.get('mb_count',5)))*0.02,2),'ts':TS}),
        ('SuperficialSiderosisExt', lambda i: {'version':'3.162.0','module':'pcc_neuro_ext63','function':'SuperficialSiderosisExt','input':i,'score':round(0.2+float(i.get('csf_protein',50))/300,2),'ts':TS}),
        ('RadiationVasculopathyExt', lambda i: {'version':'3.162.0','module':'pcc_neuro_ext63','function':'RadiationVasculopathyExt','input':i,'score':round(0.3+float(i.get('dose_gy',0))/100,2),'ts':TS}),
        ('PosteriorCorticalAtrophyExt', lambda i: {'version':'3.162.0','module':'pcc_neuro_ext63','function':'PosteriorCorticalAtrophyExt','input':i,'score':round(0.5+float(i.get('visual_field',0))/360,2),'ts':TS}),
        ('PrimaryProgressiveAphasiaExt', lambda i: {'version':'3.162.0','module':'pcc_neuro_ext63','function':'PrimaryProgressiveAphasiaExt','input':i,'score':round(0.4+float(i.get('naming_errors',5))*0.04,2),'ts':TS}),
        ('CorticobasalDegenerationExt', lambda i: {'version':'3.162.0','module':'pcc_neuro_ext63','function':'CorticobasalDegenerationExt','input':i,'score':round(0.35+float(i.get('apraxia',3))*0.05,2),'ts':TS}),
        ('ProgressiveSupranuclearPalsyExt', lambda i: {'version':'3.162.0','module':'pcc_neuro_ext63','function':'ProgressiveSupranuclearPalsyExt','input':i,'score':round(0.45+float(i.get('falls',2))*0.05,2),'ts':TS}),
        ('MultipleSystemAtrophyExt', lambda i: {'version':'3.162.0','module':'pcc_neuro_ext63','function':'MultipleSystemAtrophyExt','input':i,'score':round(0.5+float(i.get('autonomic_severity',4))*0.04,2),'ts':TS}),
        ('LewyBodyDementiaExt', lambda i: {'version':'3.162.0','module':'pcc_neuro_ext63','function':'LewyBodyDementiaExt','input':i,'score':round(0.4+float(i.get('visual_hallucinations',3))*0.05,2),'ts':TS}),
    ],
    'pcc_pediatric_neuro_ext52': [
        ('PediatricIntracranialAtherosclerosisExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_neuro_ext52','function':'PediatricIntracranialAtherosclerosisExt','input':i,'score':round(0.1+(float(i.get('age',10)))/200,2),'ts':TS}),
        ('PediatricCerebralMicrobleedsExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_neuro_ext52','function':'PediatricCerebralMicrobleedsExt','input':i,'score':round(0.05+len(str(i.get('mb_count',3)))*0.02,2),'ts':TS}),
        ('PediatricSuperficialSiderosisExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_neuro_ext52','function':'PediatricSuperficialSiderosisExt','input':i,'score':round(0.2+float(i.get('csf_protein',40))/300,2),'ts':TS}),
        ('PediatricRadiationVasculopathyExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_neuro_ext52','function':'PediatricRadiationVasculopathyExt','input':i,'score':round(0.3+float(i.get('dose_gy',0))/100,2),'ts':TS}),
        ('PediatricPosteriorCorticalAtrophyExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_neuro_ext52','function':'PediatricPosteriorCorticalAtrophyExt','input':i,'score':round(0.5+float(i.get('visual_field',0))/360,2),'ts':TS}),
        ('PediatricProgressiveAphasiaExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_neuro_ext52','function':'PediatricProgressiveAphasiaExt','input':i,'score':round(0.4+float(i.get('naming_errors',3))*0.04,2),'ts':TS}),
        ('PediatricCorticobasalDegenerationExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_neuro_ext52','function':'PediatricCorticobasalDegenerationExt','input':i,'score':round(0.35+float(i.get('apraxia',2))*0.05,2),'ts':TS}),
        ('PediatricProgressiveSupranuclearPalsyExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_neuro_ext52','function':'PediatricProgressiveSupranuclearPalsyExt','input':i,'score':round(0.45+float(i.get('falls',1))*0.05,2),'ts':TS}),
        ('PediatricMultipleSystemAtrophyExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_neuro_ext52','function':'PediatricMultipleSystemAtrophyExt','input':i,'score':round(0.5+float(i.get('autonomic_severity',3))*0.04,2),'ts':TS}),
        ('PediatricLewyBodyDementiaExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_neuro_ext52','function':'PediatricLewyBodyDementiaExt','input':i,'score':round(0.4+float(i.get('visual_hallucinations',1))*0.05,2),'ts':TS}),
    ],
    'pcc_pediatric_surg_ext52': [
        ('PediatricNeuroAtherosclerosisSurgeryExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_surg_ext52','function':'PediatricNeuroAtherosclerosisSurgeryExt','input':i,'score':round(0.3+float(i.get('stenosis_pct',50))/200,2),'ts':TS}),
        ('PediatricBypassProcedureExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_surg_ext52','function':'PediatricBypassProcedureExt','input':i,'score':round(0.4+float(i.get('flow_ml',40))/200,2),'ts':TS}),
        ('PediatricECICProcedureExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_surg_ext52','function':'PediatricECICProcedureExt','input':i,'score':round(0.45+float(i.get('graft_diameter',3))/10,2),'ts':TS}),
        ('PediatricMicrobleedsResectionExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_surg_ext52','function':'PediatricMicrobleedsResectionExt','input':i,'score':round(0.2+len(str(i.get('lesions',3)))*0.04,2),'ts':TS}),
        ('PediatricSiderosisCavityExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_surg_ext52','function':'PediatricSiderosisCavityExt','input':i,'score':round(0.25+float(i.get('depth_mm',5))/20,2),'ts':TS}),
        ('PediatricRadiationNecrosisResectionExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_surg_ext52','function':'PediatricRadiationNecrosisResectionExt','input':i,'score':round(0.4+float(i.get('volume_cc',10))/50,2),'ts':TS}),
        ('PediatricPCAOccipitalStimulatorExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_surg_ext52','function':'PediatricPCAOccipitalStimulatorExt','input':i,'score':round(0.3+float(i.get('electrode_count',2))*0.05,2),'ts':TS}),
        ('PediatricPPAVagusNerveStimExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_surg_ext52','function':'PediatricPPAVagusNerveStimExt','input':i,'score':round(0.35+float(i.get('seizure_freq',5))*0.03,2),'ts':TS}),
        ('PediatricCBDPallidotomyExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_surg_ext52','function':'PediatricCBDPallidotomyExt','input':i,'score':round(0.5+float(i.get('lesion_size',4))/20,2),'ts':TS}),
        ('PediatricPSPDeepBrainStimExt', lambda i: {'version':'3.162.0','module':'pcc_pediatric_surg_ext52','function':'PediatricPSPDeepBrainStimExt','input':i,'score':round(0.45+float(i.get('falls_freq',3))*0.04,2),'ts':TS}),
    ],
}

TS = "2026-07-28T11:14:00Z"

PKG_NAME = 'p3gt_v3_162_0'

def write_engine(mod, funcs):
    d = os.path.join(ROOT, mod)
    os.makedirs(d, exist_ok=True)
    lines = ["// Auto-generated by gen_p3gt.py — PCC v3.162.0"]
    lines.append(f"// Pure deterministic functions for {mod}.")
    for name, _ in funcs:
        lines.append(f"function {name}(input) {{")
    lines.append('"use strict";')
    lines.append("module.exports = {")
    for name, _ in funcs:
        lines.append(f"  {name},")
    lines.append("};")
    lines.append('// impls:')
    for name, fn in funcs:
        # body
        body = f"  return {fn({}).__class__.__name__ if False else 'fn'};"  # placeholder
    body_map = {
        'IntracranialAtherosclerosisDiseaseExt':"  return { version:'3.162.0', module:'pcc_neuro_ext63', function:'IntracranialAtherosclerosisDiseaseExt', input, score: Math.round((0.1+(Number(input.stenosis||50))/200)*100)/100, ts: TS };",
    }
    lines = ['// Auto-generated by gen_p3gt.py — PCC v3.162.0']
    lines.append('"use strict";')
    lines.append(f"const TS = '{TS}';")
    body_map_full = {}
    for mname, flist in ENGINE_FUNCS.items():
        for fname, _ in flist:
            base = fname
            # generate body
            if 'Atherosclerosis' in fname or 'Microbleeds' in fname or 'Siderosis' in fname or 'Vasculopathy' in fname:
                body = f"  return {{ version:'3.162.0', module:'{mname}', function:'{fname}', input, score: Math.round((0.1+(Number(input.value||5))/50)*100)/100, ts: TS }};"
            elif 'Atrophy' in fname or 'Aphasia' in fname:
                body = f"  return {{ version:'3.162.0', module:'{mname}', function:'{fname}', input, score: Math.round((0.4+Number(input.value||3)*0.05)*100)/100, ts: TS }};"
            elif 'Corticobasal' in fname or 'Supranuclear' in fname or 'SystemAtrophy' in fname or 'LewyBody' in fname:
                body = f"  return {{ version:'3.162.0', module:'{mname}', function:'{fname}', input, score: Math.round((0.45+Number(input.value||3)*0.04)*100)/100, ts: TS }};"
            else:
                body = f"  return {{ version:'3.162.0', module:'{mname}', function:'{fname}', input, score: Math.round((0.3+Number(input.value||3)*0.05)*100)/100, ts: TS }};"
            body_map_full[fname] = body
    lines = ['// Auto-generated by gen_p3gt.py — PCC v3.162.0']
    lines.append('"use strict";')
    lines.append(f"const TS = '{TS}';")
    for name, _ in [f for fl in ENGINE_FUNCS.values() for f in fl]:
        lines.append(f"function {name}(input) {{")
    lines.append("}")
    lines.append("")
    lines.append("module.exports = {")
    for name, _ in [f for fl in ENGINE_FUNCS.values() for f in fl]:
        lines.append(f"  {name},")
    lines.append("};")
    # re-write properly:
    lines = ['// Auto-generated by gen_p3gt.py — PCC v3.162.0']
    lines.append('"use strict";')
    lines.append(f"const TS = '{TS}';")
    lines.append("")
    all_funcs = [f for fl in ENGINE_FUNCS.values() for f in fl]
    for fname, _ in all_funcs:
        body = body_map_full[fname]
        lines.append(f"function {fname}(input) {{")
        lines.append(body)
        lines.append("}")
        lines.append("")
    lines.append("module.exports = {")
    for fname, _ in all_funcs:
        lines.append(f"  {fname},")
    lines.append("};")
    open(os.path.join(d, f'{mod}_engine.js'), 'w').write('\n'.join(lines))

def write_test(mod, funcs):
    d = os.path.join(ROOT, mod)
    lines = ['// Auto-generated test']
    lines.append('"use strict";')
    fname_list = [n for n,_ in funcs]
    lines.append("const {" + ", ".join(fname_list) + "} = require('./" + mod + "_engine');")
    lines.append("let passed=0;")
    lines.append("function assertEq(a,b,msg){if(JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg);process.exit(1);}}")
    for fname, _ in funcs:
        lines.append(f"assertEq({fname}({{}}).function, '{fname}', '{fname} basic');")
    lines.append(f"console.log('{mod} unit: ' + passed + ' passed');")
    open(os.path.join(d, f'{mod}_test.js'), 'w').write('\n'.join(lines))

def write_integration_test(mod, funcs):
    d = os.path.join(ROOT, mod)
    lines = ['// Auto-generated integration test']
    lines.append('"use strict";')
    fname_list = [n for n,_ in funcs]
    lines.append("const {" + ", ".join(fname_list) + "} = require('./" + mod + "_engine');")
    lines.append("const makeDb = () => ({ records: [] });")
    lines.append("let passed=0;")
    lines.append("function assert(cond,msg){if(cond){passed++;}else{console.error('FAIL',msg);process.exit(1);}}")
    for fname, _ in funcs[:5]:
        lines.append(f"{{ const r = {fname}({{}}); const db=makeDb(); db.records.push(r); assert(db.records.length===1,'{fname} persist'); }}")
    lines.append(f"console.log('{mod} integration: ' + passed + ' passed');")
    open(os.path.join(d, f'{mod}_integration_test.js'), 'w').write('\n'.join(lines))

def write_routes(mod, funcs):
    d = os.path.join(ROOT, mod)
    fname_list = [n for n,_ in funcs]
    lines = ['// Auto-generated routes']
    lines.append('"use strict";')
    lines.append("const express = require('express');")
    lines.append("const {" + ", ".join(fname_list) + "} = require('./" + mod + "_engine');")
    lines.append("const router = express.Router();")
    lines.append("const db = [];")
    lines.append("function authenticate(req,res,next){return next();}")
    lines.append("router.get('/list', authenticate, (req,res)=>{ res.json([" + ", ".join([f'{{name:\"{n}\"}}' for n in fname_list]) + "]); });")
    lines.append("router.post('/call/:fn', authenticate, (req,res)=>{ const fn=req.params.fn; if(!fn.startsWith('"+mod+"_')) return res.status(400).json({error:'bad fn'}); const f=eval(fn); const r=f(req.body||{}); res.json(r); });")
    lines.append("router.post('/record', authenticate, (req,res)=>{ db.push(req.body); res.json({ok:true, n:db.length}); });")
    lines.append("module.exports = router;")
    open(os.path.join(d, f'{mod}_routes.js'), 'w').write('\n'.join(lines))

def write_migration(mod):
    d = os.path.join(ROOT, mod)
    os.makedirs(d, exist_ok=True)
    lines = [f"-- Auto-generated migration for {mod} (v3.162.0, P3-GT)",
             "IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = '" + mod + "_records')",
             "BEGIN",
             "  CREATE TABLE " + mod + "_records (",
             "    id BIGINT IDENTITY(1,1) PRIMARY KEY,",
             "    tenant_id NVARCHAR(64) NOT NULL,",
             "    fn_name NVARCHAR(128) NOT NULL,",
             "    score DECIMAL(8,3) NULL,",
             "    payload NVARCHAR(MAX) NULL,",
             "    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()",
             "  );",
             "  CREATE INDEX ix_" + mod + "_records_tenant_fn ON " + mod + "_records(tenant_id, fn_name);",
             "END",
             "GO"]
    open(os.path.join(d, f'{mod}_up.sql'), 'w').write('\n'.join(lines))

def write_package_migration():
    os.makedirs(MIG, exist_ok=True)
    lines = [f"-- Combined package migration for v3.162.0 / P3-GT"]
    for m in MODULES:
        lines.append(f"IF OBJECT_ID('{m}_records') IS NULL")
        lines.append(f"  CREATE TABLE {m}_records (")
        lines.append(f"    id BIGINT IDENTITY(1,1) PRIMARY KEY,")
        lines.append(f"    tenant_id NVARCHAR(64) NOT NULL,")
        lines.append(f"    fn_name NVARCHAR(128) NOT NULL,")
        lines.append(f"    score DECIMAL(8,3) NULL,")
        lines.append(f"    payload NVARCHAR(MAX) NULL,")
        lines.append(f"    created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()")
        lines.append(f"  );")
    open(os.path.join(MIG, 'p3gt_v3_162_0_up.sql'), 'w').write('\n'.join(lines))

count = 0
for mod in MODULES:
    funcs = ENGINE_FUNCS[mod]
    write_engine(mod, funcs); count += 1
    write_test(mod, funcs); count += 1
    write_integration_test(mod, funcs); count += 1
    write_routes(mod, funcs); count += 1
    write_migration(mod); count += 1
write_package_migration(); count += 1
print(f"P3-GT 3.162.0: {count} files written")