import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCardioAI } from '../hooks/useCardio';

export function AINotePad({ patientId, visitId }: { patientId?: string; visitId?: string }) {
  const { t, i18n } = useTranslation();
  const [q, setQ] = useState('');
  const ai = useCardioAI();

  const lang = (i18n.language === 'ar' ? 'ar' : 'en') as 'ar' | 'en';

  return (
    <section className="bg-darkSurface rounded-lg border border-darkRaised p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">{t('ai.askAssistant')}</h3>
        <span className="text-[11px] bg-warning/15 text-warning border border-warning/40 px-2 py-0.5 rounded">
          {t('ai.advisoryOnly')}
        </span>
      </div>

      <textarea
        value={q}
        onChange={(e) => setQ(e.target.value)}
        rows={3}
        placeholder={t('ai.askAssistant') + '...'}
        className="w-full bg-darkBase border border-darkRaised rounded p-2 text-sm focus:border-brand-primary outline-none"
      />

      <button
        disabled={ai.isPending || q.trim().length < 2}
        onClick={() => ai.mutate({ question: q, patient_id: patientId, visit_id: visitId, lang })}
        className="bg-brand-primary text-darkBase px-4 py-1.5 rounded text-sm font-bold disabled:opacity-50"
      >
        {ai.isPending ? t('ai.thinking') : t('common.submit')}
      </button>

      {ai.data && (
        <div className="mt-3 border-t border-darkRaised pt-3 space-y-2">
          {ai.data.requires_human_confirm && (
            <div className="text-xs bg-danger/15 text-danger border border-danger/40 rounded px-2 py-1">
              ⚠ {t('ai.needsHuman')}
            </div>
          )}
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">{ai.data.answer}</pre>
          <div className="text-[11px] text-mutedDark">
            {t('ai.askAssistant')} · confidence={ai.data.confidence.toFixed(2)} · audit={ai.data.audit_hash.slice(0, 8)}
          </div>
          {ai.data.citations.length > 0 && (
            <div className="text-[11px] text-mutedDark">
              Sources: {ai.data.citations.join(', ')}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
