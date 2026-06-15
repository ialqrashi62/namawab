/**
 * NamaMedical SDK example (TypeScript)
 * Run:
 *   npm i axios zod
 *   NAMA_TOKEN=... ts-node example.ts
 */

import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';

const BASE = process.env.NAMA_BASE ?? 'https://staging-api.nama.local';
const TOKEN = process.env.NAMA_TOKEN ?? '';
if (!TOKEN) throw new Error('NAMA_TOKEN required');

// ─── Schemas ────────────────────────────────────────────────────────
const CardioOrderInput = z.object({
  patient_id: z.string(),
  visit_id: z.string(),
  order_type: z.enum(['cath','ep_study','echo','holter','ecg','tte','tee']),
  sub_type: z.string().optional(),
  priority: z.enum(['routine','urgent','stat','emergent']).default('routine'),
  indication: z.string(),
  notes: z.string().optional(),
});
type CardioOrderInput = z.infer<typeof CardioOrderInput>;

const AIRequest = z.object({
  question: z.string(),
  patient_id: z.string().optional(),
  visit_id: z.string().optional(),
  context: z.record(z.any()).optional(),
  lang: z.enum(['ar','en']).default('ar'),
});
type AIRequest = z.infer<typeof AIRequest>;

const AIResponse = z.object({
  answer: z.string(),
  confidence: z.number(),
  requires_human_confirm: z.boolean(),
  safety_critical: z.boolean(),
  citations: z.array(z.string()),
  audit_hash: z.string(),
});

// ─── Client ─────────────────────────────────────────────────────────
class NamaClient {
  private http: AxiosInstance;

  constructor(base = BASE, token = TOKEN) {
    this.http = axios.create({
      baseURL: base,
      timeout: 15000,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'User-Agent': 'nama-ts-sdk/0.1',
      },
    });
  }

  async searchPatient(q: string) {
    const r = await this.http.get('/api/v1/patients', { params: { q } });
    return r.data;
  }

  async placeCardioOrder(input: CardioOrderInput) {
    const validated = CardioOrderInput.parse(input);
    const r = await this.http.post('/api/v1/cardio/orders', validated, {
      headers: { 'Idempotency-Key': randomUUID() },
    });
    return r.data;
  }

  async getCardioRisk(patientId: string) {
    const r = await this.http.get(`/api/v1/cardio/risk/${patientId}`);
    return r.data;
  }

  async cardioAIask(req: AIRequest) {
    const validated = AIRequest.parse(req);
    const r = await this.http.post('/api/v1/cardio/ai/ask', validated);
    return AIResponse.parse(r.data);
  }

  async activateCode(code: 'STEMI'|'STROKE'|'SEPSIS'|'TRAUMA_L1'|'BLUE',
                     edVisitId: string, triggeredBy: string) {
    const r = await this.http.post(`/api/v1/ed/codes/${code}/activate`,
      { ed_visit_id: edVisitId, triggered_by: triggeredBy });
    return r.data;
  }
}

// ─── Demo ───────────────────────────────────────────────────────────
async function main() {
  const c = new NamaClient();

  const patients = await c.searchPatient('Al-Omari');
  console.log(`Found ${patients?.data?.length ?? 0} patients`);

  const order = await c.placeCardioOrder({
    patient_id: 'P-90001',
    visit_id: 'V-7788',
    order_type: 'echo',
    sub_type: 'tte',
    priority: 'routine',
    indication: 'HF follow-up',
  });
  console.log('Order created:', order.id);

  const risk = await c.getCardioRisk('P-90001');
  console.log('HEART=', risk.heart, 'CHA2DS2-VASc=', risk.cha2ds2_vasc);

  const ai = await c.cardioAIask({
    question: 'AFib new-onset, CHA2DS2-VASc=4, HAS-BLED=2, CrCl=48. Best DOAC?',
    patient_id: 'P-90001',
    visit_id: 'V-7788',
    lang: 'ar',
  });
  console.log(`AI confidence=${ai.confidence} needs_human=${ai.requires_human_confirm}`);
  console.log(ai.answer.slice(0, 300));
}

main().catch(err => { console.error(err); process.exit(1); });
