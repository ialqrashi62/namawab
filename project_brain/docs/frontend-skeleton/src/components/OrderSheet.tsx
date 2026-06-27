import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePlaceOrder } from '../hooks/useCardio';

const ORDER_TYPES = ['cath','ep_study','echo','holter','ecg','tte','tee'] as const;
const PRIORITIES = ['routine','urgent','stat','emergent'] as const;

export function OrderSheet({ patientId, visitId }: { patientId: string; visitId: string }) {
  const { t } = useTranslation();
  const [type, setType] = useState<typeof ORDER_TYPES[number]>('echo');
  const [priority, setPriority] = useState<typeof PRIORITIES[number]>('routine');
  const [indication, setIndication] = useState('');
  const place = usePlaceOrder();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (priority === 'stat' || priority === 'emergent') {
      if (!confirm(t('common.confirm') + ': ' + t('cardiology.order.priority.stat'))) return;
    }
    place.mutate({
      patient_id: patientId,
      visit_id: visitId,
      order_type: type,
      priority,
      indication,
    });
  };

  return (
    <form onSubmit={onSubmit} className="bg-darkSurface rounded-lg border border-darkRaised p-4 space-y-3">
      <h3 className="text-base font-bold">{t('cardiology.order.actions.place')}</h3>

      <label className="block text-xs text-mutedDark">
        {t('cardiology.order.type.echo')} / Type
        <select value={type} onChange={(e) => setType(e.target.value as any)}
                className="w-full mt-1 bg-darkBase border border-darkRaised rounded p-2 text-sm">
          {ORDER_TYPES.map((o) => (
            <option key={o} value={o}>{t(`cardiology.order.type.${o}`)}</option>
          ))}
        </select>
      </label>

      <label className="block text-xs text-mutedDark">
        {t('cardiology.order.priority.routine')} / Priority
        <select value={priority} onChange={(e) => setPriority(e.target.value as any)}
                className="w-full mt-1 bg-darkBase border border-darkRaised rounded p-2 text-sm">
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{t(`cardiology.order.priority.${p}`)}</option>
          ))}
        </select>
      </label>

      <label className="block text-xs text-mutedDark">
        Indication
        <textarea value={indication} required minLength={3}
                  onChange={(e) => setIndication(e.target.value)}
                  className="w-full mt-1 bg-darkBase border border-darkRaised rounded p-2 text-sm"/>
      </label>

      <button disabled={place.isPending}
              className="bg-brand-primary text-darkBase px-4 py-1.5 rounded text-sm font-bold disabled:opacity-50">
        {place.isPending ? t('common.loading') : t('common.submit')}
      </button>

      {place.isError && <div className="text-xs text-danger">{t('common.error')}</div>}
      {place.isSuccess && <div className="text-xs text-success">{t('common.success')}</div>}
    </form>
  );
}
