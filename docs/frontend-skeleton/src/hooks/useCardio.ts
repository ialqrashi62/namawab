import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface CardioOrder {
  id: string;
  patient_id: string;
  visit_id: string;
  order_type: 'cath'|'ep_study'|'echo'|'holter'|'ecg'|'tte'|'tee';
  sub_type?: string;
  priority: 'routine'|'urgent'|'stat'|'emergent';
  indication: string;
  status: string;
  ordered_at: string;
  scheduled_for?: string;
  fulfilled_at?: string;
}

export function useCardioOrders(patientId?: string, status?: string) {
  return useQuery<CardioOrder[]>({
    queryKey: ['cardio', 'orders', { patientId, status }],
    queryFn: async () => {
      const r = await api.get('/v1/cardio/orders', { params: { patient_id: patientId, status } });
      return r.data;
    },
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<CardioOrder, 'id'|'status'|'ordered_at'>) => {
      const r = await api.post('/v1/cardio/orders', input);
      return r.data as CardioOrder;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cardio', 'orders'] }),
  });
}

export interface RiskScores {
  heart: number;
  grace: number;
  cha2ds2_vasc: number;
  has_bled: number;
  syntax?: number;
}

export function useCardioRisk(patientId: string) {
  return useQuery<RiskScores>({
    queryKey: ['cardio', 'risk', patientId],
    queryFn: async () => (await api.get(`/v1/cardio/risk/${patientId}`)).data,
    enabled: !!patientId,
  });
}

export interface AIResponse {
  answer: string;
  confidence: number;
  requires_human_confirm: boolean;
  safety_critical: boolean;
  citations: string[];
  audit_hash: string;
}

export function useCardioAI() {
  return useMutation({
    mutationFn: async (req: {
      question: string;
      patient_id?: string;
      visit_id?: string;
      lang?: 'ar'|'en';
    }) => (await api.post('/v1/cardio/ai/ask', req)).data as AIResponse,
  });
}
