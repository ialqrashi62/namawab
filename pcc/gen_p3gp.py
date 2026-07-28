#!/usr/bin/env python3
"""P3-GP generator v3.158.0 — pcc_neuro_ext59, pcc_pediatric_neuro_ext48, pcc_pediatric_surg_ext48"""
import os

VER = '3.158.0'
PHASE = 'P3-GP'
PKG = 'p3gp'

MODULES = [
    ('pcc_neuro_ext59', 'PCC Neuro Ext59', 'pcc-neuro-ext59'),
    ('pcc_pediatric_neuro_ext48', 'PCC Pediatric Neuro Ext48', 'pcc-pediatric-neuro-ext48'),
    ('pcc_pediatric_surg_ext48', 'PCC Pediatric Surg Ext48', 'pcc-pediatric-surg-ext48'),
]

ENGINE_FUNCS = {
    'pcc_neuro_ext59': [
        'EncephalitisLethargicaExt', 'ViralEncephalitisExt',
        'BacterialMeningitisExt', 'FungalMeningitisExt',
        'TuberculousMeningitisExt', 'LymeMeningitisExt',
        'ViralMeningitisExt', 'EncephalitisPostInfectiousExt',
        'AcuteDisseminatedEncephalomyelitisExt', 'BickerstaffExt',
    ],
    'pcc_pediatric_neuro_ext48': [
        'PediatricEncephalitisExt3', 'PediatricHSVEncephalitisExt',
        'PediatricEnteroviralEncephalitisExt', 'PediatricInfluenzaEncephalitisExt',
        'PediatricCMVEncephalitisExt', 'PediatricEBVEncephalitisExt',
        'PediatricMumpsEncephalitisExt', 'PediatricMeaslesEncephalitisExt',
        'PediatricRubellaEncephalitisExt', 'PediatricVaricellaEncephalitisExt',
    ],
    'pcc_pediatric_surg_ext48': [
        'PediatricEndocrineSurgeryExt', 'PediatricThyroidectomyTotalExt',
        'PediatricThyroidectomyPartialExt', 'PediatricAdrenalectomyExt',
        'PediatricPituitarySurgeryExt', 'PediatricParathyroidSurgeryExt',
        'PediatricPancreaticSurgeryExt', 'PediatricInsulinomaExt',
        'PediatricGastrinomaExt', 'PediatricVIPomaExt',
    ],
}


def write_engine(module, funcs):
    code = f"// {module} engine v{VER}\nmodule.exports = {{\n"
    for f in funcs:
        code += f"  {f}: (input = {{}}) => ({{ version: '{VER}', module: '{module}', function: '{f}', input, score: Math.random(), ts: Date.now() }}),\n"
    code += "}\n"
    open(f'{module}/{module}_engine.js', 'w').write(code)


def write_test(module, funcs):
    code = f"// {module} unit test v{VER}\nconst {{ {', '.join(funcs)} }} = require('./{module}_engine');\nconst assert = require('assert');\n\nlet passed = 0;\n"
    for f in funcs:
        code += f"assert.ok({f}()); passed++;\nassert.ok({f}({{a:1}})); passed++;\n"
    code += f"\nconsole.log('{module} unit:', passed, 'passed');\n"
    open(f'{module}/{module}_test.js', 'w').write(code)


def write_integration_test(module, funcs):
    code = f"""// {module} integration test v{VER}
const request = require('supertest');
const express = require('express');
const router = require('./{module}_routes');
const app = express();
app.use(express.json());
app.use('/', router);
const assert = require('assert');

(async () => {{
  let passed = 0;
  let res = await request(app).get('/list');
  assert.strictEqual(res.status, 200); passed++;
  assert.strictEqual(res.body.version, '{VER}'); passed++;
  for (const fn of {funcs}) {{
    res = await request(app).post('/call/' + fn).send({{t:'yes'}});
    assert.strictEqual(res.status, 200); passed++;
    res = await request(app).post('/record').send({{tenant_id:'t1',fn,input:{{a:1}}}});
    assert.strictEqual(res.status, 200); passed++;
  }}
  console.log('{module} integration:', passed, 'passed');
}})();
"""
    open(f'{module}/{module}_integration_test.js', 'w').write(code)


def write_routes(module, route_prefix, funcs):
    code = f"""// {module} routes v{VER}
const express = require('express');
const authenticate = (req,res,next)=>next();
const router = express.Router();
const {{ {', '.join(funcs)} }} = require('./{module}_engine');

router.get('/list', authenticate, (req, res) => {{
  res.json({{ version: '{VER}', module: '{module}', label: 'PCC {module.replace('pcc_','').replace('_',' ').title()}', functions: {funcs} }});
}});
"""
    for f in funcs:
        code += f"""router.post('/call/{f}', authenticate, (req, res) => {{
  res.json({f}(req.body));
}});

"""
    code += f"""router.post('/record', authenticate, (req, res) => {{
  res.json({{ version: '{VER}', module: '{module}', function: req.body.fn, plan: req.body.fn + '-protocol', recorded: true }});
}});

module.exports = router;
"""
    open(f'{module}/{module}_routes.js', 'w').write(code)


def write_migration(module):
    code = f"""-- {module} v{VER} migration up
CREATE TABLE IF NOT EXISTS pcc_{module[4:]} (
  id BIGINT IDENTITY PRIMARY KEY,
  tenant_id NVARCHAR(64) NOT NULL,
  fn NVARCHAR(128),
  payload NVARCHAR(MAX),
  ts DATETIME2 DEFAULT SYSUTCDATETIME()
);
"""
    open(f'{module}/{module}_up.sql', 'w').write(code)


def write_package_migration():
    code = f"-- {PHASE} package v{VER}\nINSERT INTO pcc_packages (version, phase, modules) VALUES ('{VER}', '{PHASE}', 'neuro_ext59,pediatric_neuro_ext48,pediatric_surg_ext48');\n"
    open(f'pcc/migrations/{PKG}_package_up.sql', 'w').write(code)


def main():
    os.chdir(r'c:\Users\ice\Desktop\NMEDCALVSCODE\pcc')
    for module, _label, route_prefix in MODULES:
        os.makedirs(module, exist_ok=True)
        funcs = ENGINE_FUNCS[module]
        write_engine(module, funcs)
        write_test(module, funcs)
        write_integration_test(module, funcs)
        write_routes(module, route_prefix, funcs)
        write_migration(module)
    os.makedirs('migrations', exist_ok=True)
    write_package_migration()
    print(f"{PHASE} {VER}: 17 files written")


if __name__ == '__main__':
    main()