// Orthanc PACS sandbox — LOCAL DICOM simulator (no Orthanc install, no Docker, no network).
// DUMMY DICOM METADATA ONLY — no real image pixel bytes, no PHI. Run: node tools/orthanc-sandbox/dicom_sim.js
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

// offline tripwire
for (const m of ['http', 'https']) {
  const mod = require(m);
  mod.request = () => { throw new Error(`EXTERNAL CALL BLOCKED (${m}.request)`); };
  mod.get = () => { throw new Error(`EXTERNAL CALL BLOCKED (${m}.get)`); };
}

const store = path.join(os.tmpdir(), 'nama_orthanc_sbx', 'store');
function reset() { try { fs.rmSync(path.dirname(store), { recursive: true, force: true }); } catch (e) {} fs.mkdirSync(store, { recursive: true }); }

// synthetic DICOM-like instance: METADATA ONLY (no pixel bytes). patientID synthetic (>=9000).
function dummyInstance(i) {
  return {
    StudyInstanceUID: `1.2.840.SBX.${9000 + i}.1`,
    SeriesInstanceUID: `1.2.840.SBX.${9000 + i}.1.1`,
    SOPInstanceUID: `1.2.840.SBX.${9000 + i}.1.1.1`,
    PatientID: String(9000 + i),              // synthetic only
    PatientName: 'TEST^DUMMY',                // fabricated, not real PHI
    Modality: 'CR',
    pixelData: null,                          // NO real image bytes in sandbox
    sandbox: true,
  };
}

// "STOW-RS store": persist metadata to isolated local store; PHI tripwire rejects real markers.
function stowStore(inst) {
  // synthetic ids live only in 9000-9999; anything outside (incl. real-looking 10-digit national ids) is rejected
  const pid = Number(inst.PatientID);
  if (!(Number.isInteger(pid) && pid >= 9000 && pid <= 9999)) throw new Error('PHI TRIPWIRE: non-synthetic PatientID');
  if (JSON.stringify(inst).includes('REAL_PHI')) throw new Error('PHI TRIPWIRE: real-PHI marker');
  if (inst.pixelData) throw new Error('PHI TRIPWIRE: pixel bytes not allowed in sandbox');
  fs.writeFileSync(path.join(store, `${inst.SOPInstanceUID}.json`), JSON.stringify(inst));
  return true;
}

// "WADO-RS retrieve" — but client-facing access is modeled through the A3A guarded route, NOT Orthanc directly.
function clientFacingUrl(phiFileId) { return `/api/phi-files/${phiFileId}`; } // guarded: auth+RLS+tenant+encryption

const R = []; const T = (n, ok) => R.push((ok ? 'PASS' : 'FAIL') + ' ' + n);
reset();
try {
  const instances = [0, 1, 2].map(dummyInstance);
  let stored = 0; instances.forEach(x => { if (stowStore(x)) stored++; });
  T('dummy DICOM metadata accepted (STOW-RS sim)', stored === 3 && fs.readdirSync(store).length === 3);
  T('no real image bytes (pixelData null in all)', instances.every(x => x.pixelData === null));

  // PHI tripwire: a non-synthetic patient id must be rejected
  let phiBlocked = false; try { stowStore({ ...dummyInstance(0), PatientID: '1234567890' }); } catch (e) { phiBlocked = /PHI TRIPWIRE/.test(e.message); }
  T('PHI tripwire blocks non-synthetic PatientID', phiBlocked);

  // pixel-bytes tripwire
  let pixBlocked = false; try { stowStore({ ...dummyInstance(0), pixelData: Buffer.from('fake') }); } catch (e) { pixBlocked = /PHI TRIPWIRE/.test(e.message); }
  T('PHI tripwire blocks pixel bytes in sandbox', pixBlocked);

  // A3A guarded-route model: client URL is /api/phi-files/:id (never Orthanc direct)
  const url = clientFacingUrl(1234);
  T('A3A guarded-route model respected (client url = /api/phi-files/:id)', /^\/api\/phi-files\/\d+$/.test(url));

  // network tripwire
  T('network tripwire intact (no external calls)', (() => { try { require('https').get('https://x'); return false; } catch (e) { return /BLOCKED/.test(e.message); } })());
} catch (e) { R.push('FAIL simulator-exception :: ' + e.message); }
finally {
  // storage cleanup
  const existedBefore = fs.existsSync(store);
  try { fs.rmSync(path.dirname(store), { recursive: true, force: true }); } catch (e) {}
  T('storage cleanup (sandbox store removed)', existedBefore && !fs.existsSync(store));
}

console.log(R.join('\n'));
const fail = R.filter(x => x.startsWith('FAIL')).length;
console.log(`\n${R.length - fail}/${R.length} PASS (dummy DICOM metadata only; no Orthanc/Docker/network/PHI)`);
process.exit(fail ? 1 : 0);
