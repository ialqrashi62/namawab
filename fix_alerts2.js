const fs = require('fs');

const files = [
  'namaweb/public/js/anesthesia-station.js',
  'namaweb/public/js/cardiothoracic-station.js',
  'namaweb/public/js/ent-station.js',
  'namaweb/public/js/er-station.js',
  'namaweb/public/js/functional-tests-station.js',
  'namaweb/public/js/icu-station.js',
  'namaweb/public/js/lab-station.js',
  'namaweb/public/js/neurosurgery-station.js',
  'namaweb/public/js/nicu-station.js',
  'namaweb/public/js/ophthalmology-station.js',
  'namaweb/public/js/orthopedics-station.js',
  'namaweb/public/js/pacu-station.js',
  'namaweb/public/js/plastic-surgery-station.js',
  'namaweb/public/js/radiology-station.js',
  'namaweb/public/js/urology-station.js',
];

const re = /alert\(\s*['"]([^'"\n]+)['"]\s*\)\s*;?/g;

let total = 0;
for (const f of files) {
  if (!fs.existsSync(f)) { console.log('MISSING', f); continue; }
  const src = fs.readFileSync(f, 'utf8');
  let count = 0;
  const newSrc = src.replace(re, (m, content) => {
    count++;
    const verbMatch = content.match(/^(POST|GET|PUT|DELETE|PATCH)\s/i);
    const verb = verbMatch ? verbMatch[1] : 'API';
    const endpointMatch = content.match(/\/api\/[A-Za-z0-9_\/\-]+/);
    const endpoint = endpointMatch ? endpointMatch[0] : 'backend';
    const title = JSON.stringify(content);
    const body = '<p style="font-size:14px;color:#334155">' + content + '</p>'
      + '<div style="background:#f1f5f9;border-radius:6px;padding:10px;font-size:12px;color:#475569;margin-top:10px">'
      + '<strong>HTTP:</strong> ' + verb + ' &nbsp;&nbsp;<strong>Endpoint:</strong> <code>' + endpoint + '</code></div>'
      + '<p style="font-size:13px;color:#64748b;margin-top:10px">This action will be wired to the live backend. Configure Department Mappings to enable persistent capture.</p>';
    const bodyJson = JSON.stringify(body);
    return 'Modal.open({ title: ' + title + ', body: ' + bodyJson + ", primaryLabel: 'OK', secondaryLabel: 'Close', hidePrimary: true })";
  });
  if (count > 0) {
    fs.writeFileSync(f, newSrc, 'utf8');
    console.log('FIXED', f, '(' + count + ' replaced)');
    total += count;
  } else {
    console.log('no change', f);
  }
}
console.log('Total replacements:', total);
