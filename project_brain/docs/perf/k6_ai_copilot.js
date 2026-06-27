// k6 load test — AI co-pilot under realistic clinical query mix.
// Run: k6 run --env BASE=... --env TOKEN=... k6_ai_copilot.js

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const lowConf = new Counter('ai_low_confidence_total');
const needsHuman = new Counter('ai_needs_human_total');

export const options = {
  scenarios: {
    realistic: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 50,
      stages: [
        { duration: '2m', target: 5 },
        { duration: '5m', target: 10 },
        { duration: '2m', target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<5000', 'p(99)<8000'],
  },
};

const BASE  = __ENV.BASE  || 'http://localhost:8000';
const TOKEN = __ENV.TOKEN || '';

const QUESTIONS = [
  'AFib new-onset, CHA2DS2-VASc=4, HAS-BLED=2, CrCl=48. Best DOAC?',
  'COPD GOLD III group D — escalation options?',
  'Pediatric paracetamol 8 kg child fever — dose?',
  'STEMI anterior, door-to-balloon plan in 90 min?',
  'Sepsis suspected, qSOFA=2, what bundle?',
];

export default function () {
  const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
  const r = http.post(
    `${BASE}/api/v1/cardio/ai/ask`,
    JSON.stringify({
      question: q,
      patient_id: 'P-90001',
      visit_id:   'V-7788',
      lang: 'ar',
    }),
    { headers: { 'Authorization': `Bearer ${TOKEN}`, 'Content-Type': 'application/json' } },
  );
  const ok = check(r, {
    '200': (resp) => resp.status === 200,
    'has answer': (resp) => resp.json('answer') && resp.json('answer').length > 10,
  });
  if (ok && r.status === 200) {
    if (r.json('confidence') < 0.7) lowConf.add(1);
    if (r.json('requires_human_confirm')) needsHuman.add(1);
  }
  sleep(1);
}
