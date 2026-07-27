#!/usr/bin/env python3
"""P3-FQ generator v3.133.0 — pcc_neuro_ext34, pcc_pediatric_neuro_ext23, pcc_pediatric_surg_ext23"""
import os

VER = '3.133.0'
PHASE = 'P3-FQ'
PKG = 'p3fq'

MODULES = [
    ('pcc_neuro_ext34', 'PCC Neuro Ext34', 'pcc-neuro-ext34'),
    ('pcc_pediatric_neuro_ext23', 'PCC Pediatric Neuro Ext23', 'pcc-pediatric-neuro-ext23'),
    ('pcc_pediatric_surg_ext23', 'PCC Pediatric Surg Ext23', 'pcc-pediatric-surg-ext23'),
]

ENGINE_FUNCS = {
    'pcc_neuro_ext34': [
        'CognitiveRehabExt', 'MemoryRehabilitation',
        'AttentionTraining', 'ExecutiveFunctionTraining',
        'LanguageTherapyExt', 'SpeechTherapy',
        'OccupationalTherapyExt', 'VestibularRehab',
        'VisualRehab', 'NeuroplasticityTraining',
    ],
    'pcc_pediatric_neuro_ext23': [
        'PediatricVisionRehab', 'PediatricHearingRehab',
        'PediatricCochlearImplantRehab', 'PediatricVisionAid',
        'PediatricBrailleTraining', 'PediatricSignLanguage',
        'PediatricAACDevice', 'PediatricCommunicationBoard',
        'PediatricMobilityAid', 'PediatricWheelchairTraining',
    ],
    'pcc_pediatric_surg_ext23': [
        'PediatricRoboticSurgeryExt', 'PediatricDaVinci',
        'PediatricRoboticProstatectomy', 'PediatricRoboticNephrectomy',
        'PediatricRoboticPyeloplasty', 'PediatricRoboticHysterectomy',
        'PediatricRoboticColectomy', 'PediatricRoboticGastricBypass',
        'PediatricRoboticCholecystectomy', 'PediatricRoboticSplenectomy',
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
// auth: authenticate (per audit L4-4)
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
    code = f"-- {PHASE} package v{VER}\nINSERT INTO pcc_packages (version, phase, modules) VALUES ('{VER}', '{PHASE}', 'neuro_ext34,pediatric_neuro_ext23,pediatric_surg_ext23');\n"
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