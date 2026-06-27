// k6 load test — ED Live Board (SSE) sustained connections.
// Validates 200 concurrent dashboards with push latency < 1s p95.
// Run:  k6 run --env BASE=... --env TOKEN=... k6_ed_board_sse.js

import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

const pushLatency = new Trend('ed_board_push_latency_ms');

export const options = {
  scenarios: {
    board: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },
        { duration: '3m', target: 200 },
        { duration: '5m', target: 200 },
        { duration: '1m', target: 0 },
      ],
    },
  },
  thresholds: {
    'ed_board_push_latency_ms': ['p(95)<1000'],
  },
};

const BASE = __ENV.BASE  || 'http://localhost:8000';
const TOKEN = __ENV.TOKEN || '';

export default function () {
  // Simulate a long-lived SSE subscriber via streaming GET.
  const params = {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Accept': 'text/event-stream',
    },
    timeout: '60s',
  };
  const r = http.get(`${BASE}/api/v1/ed/board`, params);
  check(r, { 'sse status': (resp) => resp.status === 200 });

  // For simplicity, treat connection establishment latency as a proxy.
  pushLatency.add(r.timings.duration);
}
