const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== AI modules ==="
ls /var/www/namaweb/lib/ai 2>/dev/null || find /var/www/namaweb/lib -name "ai*" -o -name "*rag*" -o -name "*llm*" -o -name "*langchain*" -type f 2>/dev/null | head -20
echo "=== discharge route? ==="
ls /var/www/namaweb/routes/discharge.js 2>&1
echo "=== discharge source head ==="
head -40 /var/www/namaweb/routes/discharge.js 2>&1
echo "=== LangChain module ==="
node -e "const m=require(\\"./lib/ai/UniversalLangChain\\"); console.log(\\"keys:\\", Object.keys(m).slice(0,15));" 2>&1
echo "=== Prompt registry ==="
node -e "const m=require(\\"./lib/ai/PromptRegistry\\"); console.log(\\"keys:\\", Object.keys(m).slice(0,15));" 2>&1
echo "=== existing discharge endpoint ==="
curl -s -o /tmp/b.txt -w "%{http_code}\\n" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" "http://127.0.0.1:3000/api/v4/discharge/list" 2>&1'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
