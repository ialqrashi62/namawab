// k6 smoke test — verifies basic API health under light load.
// Run:  k6 run --env BASE=https://staging-api.nama.local --env TOKEN=$TOKEN k6_smoke.js

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '1m',
  thresholds: {
    http_req_failed:   ['rate<0.01'],   // < 1% errors
    http_req_duration: ['p(95)<500'],   // p95 < 500ms
  },
};

const BASE = __ENV.BASE  || 'http://localhost:8000';
const TOKEN = __ENV.TOKEN || '';

const headers = TOKEN
  ? { Authorization: `Bearer ${TOKEN}`, 'X-Request-Id': `${__VU}-${__ITER}` }
  : { 'X-Request-Id': `${__VU}-${__ITER}` };

export default function () {
  const r1 = http.get(`${BASE}/health`);
  check(r1, { '/health 200': (r) => r.status === 200 });

  const r2 = http.get(`${BASE}/api/v1/cardio/orders?status=requested&page_size=10`, { headers });
  check(r2, { 'orders ok': (r) => r.status === 200 || r.status === 401 });

  sleep(1);
}
