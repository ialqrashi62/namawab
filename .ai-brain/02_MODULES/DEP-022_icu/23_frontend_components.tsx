// filepath: 02_MODULES/DEP-022/23_frontend_components.tsx
// Stitch components for ICU_Adult (DEP-022)

import React from 'react';
import { useTranslation } from 'next-i18next';

const API = (typeof window !== 'undefined') ? window.IcuAPI : null;

// ============ ResultCard ============
export function ResultCard({ result }: { result: any }) {
  const { t, i18n } = useTranslation('icu');
  const isAbnormal = result.abnormal_flag && result.abnormal_flag !== 'N';
  return (
    <div className={`result-card ${isAbnormal ? 'result-card--abnormal' : ''}`}>
      <header className="result-card__header">
        <span className="result-card__type">{result.result_type}</span>
        {isAbnormal && <span className="badge badge--danger">{result.abnormal_flag}</span>}
      </header>
      <div className="result-card__body">
        <div className="result-card__value">{result.result_value}</div>
        <div className="result-card__unit">{result.result_unit}</div>
      </div>
      <footer className="result-card__footer">
        <span className="result-card__ref">Ref: {result.reference_range}</span>
        <time className="result-card__time">{new Date(result.result_at).toLocaleString(i18n.language)}</time>
      </footer>
    </div>
  );
}

// ============ NotesEditor ============
export function NotesEditor({ patientId, encounterId }: { patientId: number; encounterId?: number }) {
  const [text, setText] = React.useState('');
  const [signed, setSigned] = React.useState(false);

  const saveDraft = async () => {
    if (API) await API.saveNote({ patientId, encounterId, note_text: text });
  };

  const sign = async () => {
    if (API) await API.signNote({ patientId, encounterId });
    setSigned(true);
  };

  return (
    <div className="notes-editor">
      <textarea
        className="notes-editor__textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="S/O: ... A/P: ..."
        rows={12}
      />
      <div className="notes-editor__actions">
        <button className="btn btn--ghost" onClick={saveDraft}>حفظ مسودة</button>
        <button className="btn btn--primary" onClick={sign} disabled={signed}>
          {signed ? '✓ موقّعة' : 'توقيع'}
        </button>
      </div>
    </div>
  );
}