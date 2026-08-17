// filepath: extract_ai_bodies.js
const fs = require('fs');
const src = fs.readFileSync('gen_tier60.js', 'utf8');
const startMarker = 'const smokeCases = [';
const startIdx = src.indexOf(startMarker);
const startBody = src.indexOf('[', startIdx);
let depth = 0; let endBody = -1;
for (let i = startBody; i < src.length; i++) {
  if (src[i] === '[') depth++;
  else if (src[i] === ']') { depth--; if (depth === 0) { endBody = i; break; } }
}
const arr = eval(src.substring(startBody, endBody + 1));
arr.forEach((c, i) => {
  fs.writeFileSync(`C:/tmp/ai_body_${i}.json`, JSON.stringify(c[2]));
});
console.log('Wrote', arr.length, 'bodies');
