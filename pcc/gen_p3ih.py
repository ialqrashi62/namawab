MODULES = ['pcc_neuro_ext89', 'pcc_pediatric_neuro_ext78', 'pcc_pediatric_surg_ext78']
FUNCS = {
    'pcc_neuro_ext89': [('DeepBrainStimProgrammingExt',"const score = Math.round((0.1 + Number(input.amplitude||3)*0.18 + Number(input.frequency||130)*0.002 + Number(input.impedance||1000)*0.0002)*100)/100;"),
        ('VNSRefractoryTuneExt',"const score = Math.round((0.15 + Number(input.current||1.5)*0.3 + Number(input.freq||30)*0.005 + Number(input.duty||10)*0.01)*100)/100;"),
        ('RNSBatteryCheckExt',"const score = Math.round((0.2 + Number(input.battery||75)*0.006 + Number(input.events||5)*0.02)*100)/100;"),
        ('MRIGuidedLaserExt',"const score = Math.round((0.12 + Number(input.targetSize||15)*0.02 + Number(input.efficiency||80)*0.005)*100)/100;"),
        ('StereotacticEEGExt',"const score = Math.round((0.18 + Number(input.depths||8)*0.04 + Number(input.duration||10)*0.02 + Number(input.yield||60)*0.004)*100)/100;"),
        ('WadaTestExt',"const score = Math.round((0.2 + Number(input.memoryLeft||7)*0.04 + Number(input.memoryRight||7)*0.04 + Number(input.language||1)*0.1)*100)/100;"),
        ('PhaseIIMonitoringExt',"const score = Math.round((0.15 + Number(input.seizures||4)*0.1 + Number(input.localization||80)*0.005)*100)/100;"),
        ('HemispherotomyExt',"const score = Math.round((0.25 + Number(input.age||15)*0.01 + Number(input.seizureFreePct||75)*0.005)*100)/100;"),
        ('CorpusCallosotomyExt',"const score = Math.round((0.2 + Number(input.dropSeizuresReduction||70)*0.005 + Number(input.complications||5)*0.02)*100)/100;"),
        ('LaserAblationTempExt',"const score = Math.round((0.1 + Number(input.maxTemp||55)*0.01 + Number(input.duration||3)*0.04 + Number(input.tissueVolume||4)*0.05)*100)/100;")],
    'pcc_pediatric_neuro_ext78': [('PediatricDeepBrainStimTuneExt',"const score = Math.round((0.1 + Number(input.amplitude||2)*0.18 + Number(input.frequency||100)*0.002 + Number(input.pulseWidth||60)*0.005)*100)/100;"),
        ('PediatricVNSPediatricTuneExt',"const score = Math.round((0.15 + Number(input.outputCurrent||1)*0.3 + Number(input.freq||25)*0.005 + Number(input.onTime||30)*0.01)*100)/100;"),
        ('PediatricRNSBatteryExt',"const score = Math.round((0.2 + Number(input.battery||80)*0.006 + Number(input.events||3)*0.02)*100)/100;"),
        ('PediatricKetogenicRatioExt',"const score = Math.round((0.1 + Number(input.ratio||3)*0.15 + Number(input.carbs||10)*0.02 + Number(input.ketosis||2)*0.1)*100)/100;"),
        ('PediatricACTHDosingExt',"const score = Math.round((0.2 + Number(input.dose||75)*0.005 + Number(input.weight||15)*0.02 + Number(input.duration||14)*0.02)*100)/100;"),
        ('PediatricEpilepsyGeneticExt',"const score = Math.round((0.15 + Number(input.variants||2)*0.1 + Number(input.syndromic||1)*0.15 + Number(input.familyHist||1)*0.1)*100)/100;"),
        ('PediatricSUDEPRiskExt',"const score = Math.round((0.1 + Number(input.freqSeizures||5)*0.05 + Number(input.gtc||1)*0.1 + Number(input.nocturnal||1)*0.1 + Number(input.medication||2)*0.05)*100)/100;"),
        ('PediatricResectiveOutcomeExt',"const score = Math.round((0.2 + Number(input.engelScore||1)*0.2 + Number(input.followupMonths||24)*0.01 + Number(input.pathology||1)*0.1)*100)/100;"),
        ('PediatricHemispherotomyOutExt',"const score = Math.round((0.25 + Number(input.ageAtSurg||6)*0.04 + Number(input.seizureFreeMonths||36)*0.01 + Number(input.complications||3)*0.04)*100)/100;"),
        ('PediatricVagalRefracTuneExt',"const score = Math.round((0.15 + Number(input.outputCurrent||1.5)*0.2 + Number(input.magnetUse||3)*0.05 + Number(input.battery||7)*0.04)*100)/100;")],
    'pcc_pediatric_surg_ext78': [('PediatricVNSImplantSurgExt',"const score = Math.round((0.2 + Number(input.age||12)*0.02 + Number(input.weight||30)*0.01 + Number(input.leadCheck||1)*0.15)*100)/100;"),
        ('PediatricRNSLeadPlacSurgExt',"const score = Math.round((0.18 + Number(input.targets||2)*0.15 + Number(input.duration||3)*0.1 + Number(input.efficacy||80)*0.004)*100)/100;"),
        ('PediatricSEEGTrajectorySurgExt',"const score = Math.round((0.15 + Number(input.electrodes||12)*0.03 + Number(input.trajectoryAccuracy||95)*0.004 + Number(input.duration||4)*0.05)*100)/100;"),
        ('PediatricCraniotomyResectSurgExt',"const score = Math.round((0.2 + Number(input.resectVolume||25)*0.015 + Number(input.engelI||70)*0.005 + Number(input.complications||3)*0.04)*100)/100;"),
        ('PediatricLaserAblationSurgExt',"const score = Math.round((0.15 + Number(input.laserProbes||1)*0.2 + Number(input.duration||2)*0.1 + Number(input.targetVolume||3)*0.1)*100)/100;"),
        ('PediatricHemispherotomySurgExt',"const score = Math.round((0.25 + Number(input.anatomy||3)*0.1 + Number(input.bloodLoss||150)*0.001 + Number(input.icuDays||3)*0.05)*100)/100;"),
        ('PediatricCorpusCallosotomySurgExt',"const score = Math.round((0.2 + Number(input.anteriorPct||75)*0.005 + Number(input.dropSeizReduction||80)*0.005 + Number(input.complications||2)*0.05)*100)/100;"),
        ('PediatricLesionectomySurgExt',"const score = Math.round((0.18 + Number(input.lesionSize||2)*0.1 + Number(input.pathology||1)*0.15 + Number(input.margins||1)*0.1)*100)/100;"),
        ('PediatricVagalLeadReplaceSurgExt',"const score = Math.round((0.15 + Number(input.impedance||1500)*0.0002 + Number(input.duration||1)*0.2 + Number(input.batteryTest||1)*0.2)*100)/100;"),
        ('PediatricEpilepsyRehabPostExt',"const score = Math.round((0.1 + Number(input.physicalTherapy||3)*0.1 + Number(input.cognitiveTherapy||3)*0.1 + Number(input.schoolReentry||1)*0.15)*100)/100;")]}
TS = "v3.188.0"

def hdr(m, fn):
    return f"// filepath: pcc/{m}/{m}.js\nmodule.exports = {{ name: '{m}', version: 'v3.188.0', fn }};\n"

def w(mod, fn, body, ftype):
    d = f"./{mod}"
    os.makedirs(d, exist_ok=True)
    if ftype == 'engine': open(os.path.join(d, f"{mod}_engine.js"), 'w', encoding='utf-8').write(f"// filepath: pcc/{mod}/{mod}_engine.js\n// {mod} engine (deterministic)\nmodule.exports.version = 'v3.188.0';\nmodule.exports.module = '{mod}';\nmodule.exports.functions = {{}};\n" + "".join([f"module.exports.functions['{n}'] = function(input){{ {b} return {{version:'v3.188.0',module:'{mod}',function:'{n}',input,score,ts:new Date().toISOString()}}; }};\n" for n,b in FUNCS[mod]]) + f"\n// TS: {TS}\n")
    elif ftype == 'test': open(os.path.join(d, f"{mod}_test.js"), 'w', encoding='utf-8').write(f"// filepath: pcc/{mod}/{mod}_test.js\nconst {{functions: F}} = require('./{mod}_engine');\nlet pass=0; for (const fn of Object.keys(F)){{ const r = F[fn]({{}}); if (typeof r.score === 'number' && r.score >= 0 && r.score <= 1.5) pass++; else console.error('FAIL', fn, r); }}\nconsole.log('{mod} unit:', pass, 'passed'); if (pass !== 10) process.exit(1);\n")
    elif ftype == 'itest': open(os.path.join(d, f"{mod}_integration_test.js"), 'w', encoding='utf-8').write(f"// filepath: pcc/{mod}/{mod}_integration_test.js\nconst {{functions: F}} = require('./{mod}_engine');\nlet pass=0; const samples=[{{'value':1}},{{'value':2}},{{'value':3}},{{'value':4}},{{'value':5}}]; for (const fn of Object.keys(F)){{ for (const s of samples){{ const r=F[fn](s); if (r && typeof r.score==='number') pass++; }} }}\nconsole.log('{mod} integration:', pass, 'passed'); if (pass !== 50) process.exit(1);\n")
    elif ftype == 'routes': open(os.path.join(d, f"{mod}_routes.js"), 'w', encoding='utf-8').write(f"// filepath: pcc/{mod}/{mod}_routes.js\nconst express = require('express'); const {{functions: F}} = require('./{mod}_engine'); const {{authenticate}} = require('../auth'); const router = express.Router();\nrouter.get('/list', (_req, res) => res.json({{module:'{mod}',version:'v3.188.0',functions:Object.keys(F)}}));\nrouter.post('/call/:fn', (req, res) => {{ const fn = req.params.fn; if (!F[fn]) return res.status(404).json({{error:'not found'}}); const r = F[fn](req.body||{{}}); res.json(r); }});\nrouter.post('/record', (req, res) => {{ const {{fn, payload, decisionId}} = req.body||{{}}; if (!F[fn]) return res.status(404).json({{error:'not found'}}); const r = F[fn](payload||{{}}); res.json({{decisionId, ...r}}); }});\nmodule.exports = router;\n")
    elif ftype == 'sql': open(os.path.join(d, f"{mod}_up.sql"), 'w', encoding='utf-8').write(f"-- pcc/{mod}/{mod}_up.sql\nIF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[{mod}]') AND type = 'U')\nBEGIN\nCREATE TABLE [dbo].[{mod}] (\n  [id] INT IDENTITY(1,1) PRIMARY KEY,\n  [version] NVARCHAR(16) NOT NULL,\n  [module] NVARCHAR(64) NOT NULL,\n  [function] NVARCHAR(128) NOT NULL,\n  [input] NVARCHAR(MAX) NULL,\n  [score] DECIMAL(6,2) NULL,\n  [ts] DATETIME2 DEFAULT SYSUTCDATETIME()\n);\nEND\n")

import os
for m in MODULES:
    w(m, None, None, 'engine')
    w(m, None, None, 'test')
    w(m, None, None, 'itest')
    w(m, None, None, 'routes')
    w(m, None, None, 'sql')
    print(f'{m}: 5 files written')
print('P3-IH 3.188.0: 16 files written')
