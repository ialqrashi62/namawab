// filepath: 02_MODULES/DEP-058/24_frontend_api_client.ts
// API client for Insurance_Claims_NPHIES (DEP-058)

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://jumanasoft.com/api';

interface APIOptions {
  tenantId: number;
  token?: string;
  lang?: 'ar' | 'en';
}

async function request(path: string, options: RequestInit & APIOptions): Promise<any> {
  const { tenantId, token, lang = 'ar', ...init } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-tenant-id': String(tenantId),
    'Accept-Language': lang,
    ...(init.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const InsuranceAPI = {
  listEncounters(opts: { patientId?: number; status?: string } & APIOptions) {
    const params = new URLSearchParams();
    if (opts.patientId) params.set('patient_id', String(opts.patientId));
    if (opts.status) params.set('status', opts.status);
    return request(`/insurance/list?${params}`, { method: 'GET', ...opts });
  },
  getEncounter(id: number, opts: APIOptions) {
    return request(`/insurance/${id}`, { method: 'GET', ...opts });
  },
  createEncounter(payload: any, opts: APIOptions) {
    return request(`/insurance/`, { method: 'POST', body: JSON.stringify(payload), ...opts });
  },
  updateEncounter(id: number, payload: any, opts: APIOptions) {
    return request(`/insurance/${id}`, { method: 'PUT', body: JSON.stringify(payload), ...opts });
  },
  deleteEncounter(id: number, opts: APIOptions) {
    return request(`/insurance/${id}`, { method: 'DELETE', ...opts });
  },
  listOrders(opts: { patientId?: number } & APIOptions) {
    const params = new URLSearchParams();
    if (opts.patientId) params.set('patient_id', String(opts.patientId));
    return request(`/insurance/orders?${params}`, { method: 'GET', ...opts });
  },
  listResults(opts: { patientId?: number } & APIOptions) {
    const params = new URLSearchParams();
    if (opts.patientId) params.set('patient_id', String(opts.patientId));
    return request(`/insurance/results?${params}`, { method: 'GET', ...opts });
  },
  saveNote(payload: any, opts: APIOptions) {
    return request(`/insurance/notes`, { method: 'POST', body: JSON.stringify(payload), ...opts });
  },
  signNote(payload: any, opts: APIOptions) {
    return request(`/insurance/notes/sign`, { method: 'POST', body: JSON.stringify(payload), ...opts });
  },
  aiDiagnose(payload: { question: string }, opts: APIOptions) {
    return request(`/insurance/ai/diagnose`, { method: 'POST', body: JSON.stringify(payload), ...opts });
  },
};