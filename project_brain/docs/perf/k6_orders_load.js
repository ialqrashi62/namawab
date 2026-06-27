// k6 load test — Cardio orders create + list under sustained load.
// Run:  k6 run --env BASE=... --env TOKEN=... k6_orders_load.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration{name:'create'}: ['p(95)<400'],
    http_req_duration{name:'list'}:   ['p(95)<200'],
  },
};

const BASE  = __ENV.BASE  || 'http://localhost:8000';
const TOKEN = __ENV.TOKEN || '';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Content-Type':  'application/json',
};

const ORDER_TYPES = ['echo','holter','ecg','tte'];
const PRIORITIES  = ['routine','urgent'];

export default function () {
  // Create
  const ot = ORDER_TYPES[Math.floor(Math.random()*ORDER_TYPES.length)];
  const pr = PRIORITIES[Math.floor(Math.random()*PRIORITIES.length)];
  const create = http.post(
    `${BASE}/api/v1/cardio/orders`,
    JSON.stringify({
      patient_id: 'P-90001',
      visit_id:   'V-7788',
      order_type: ot,
      priority:   pr,
      indication: 'Load test',
    }),
    { headers: { ...headers, 'Idempotency-Key': uuidv4() }, tags: { name: 'create' } },
  );
  check(create, { 'create 201': (r) => r.status === 201 });

  // List
  const list = http.get(
    `${BASE}/api/v1/cardio/orders?status=requested&page_size=50`,
    { headers, tags: { name: 'list' } },
  );
  check(list, { 'list 200': (r) => r.status === 200 });

  sleep(0.5);
}
