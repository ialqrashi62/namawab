const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -lc '
echo "=== SCHEMA ==="
sudo -u postgres psql -d nama_medical_web -c "\\d invoices" 2>&1 | grep -E "currency|fx_|base_cur" | head -10
echo "=== ENDPOINTS ==="
for path in "api/v4/billing/currencies" "api/v4/billing/currencies/AED" "api/v4/billing/fx?from=USD&to=AED" "api/v4/billing/fx?from=EUR&to=SAR" "api/v4/billing/fx/history?from=USD&to=SAR" "api/v4/billing/invoices" ; do
  code=$(curl -s -o /tmp/b.txt -w "%{http_code}" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" "http://127.0.0.1:3000/$path" 2>/dev/null)
  body=$(head -c 150 /tmp/b.txt 2>/dev/null | tr -d "\\n")
  echo "  $path => $code | $body"
done
echo "=== POST /convert (USD 100 -> AED) ==="
curl -s -X POST -H "Content-Type: application/json" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" -d "{\\"amount\\":100,\\"from\\":\\"USD\\",\\"to\\":\\"AED\\"}" http://127.0.0.1:3000/api/v4/billing/convert | head -c 300
echo ""
echo "=== POST /invoice (EUR 100 -> SAR) ==="
curl -s -X POST -H "Content-Type: application/json" -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: doctor" -d "{\\"amount\\":100,\\"currency\\":\\"EUR\\",\\"baseCurrency\\":\\"SAR\\",\\"description\\":\\"Test EUR invoice\\",\\"serviceType\\":\\"consultation\\"}" http://127.0.0.1:3000/api/v4/billing/invoice | head -c 500
echo ""'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
