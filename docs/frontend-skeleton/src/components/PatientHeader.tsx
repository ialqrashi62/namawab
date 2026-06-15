import { useTranslation } from 'react-i18next';

export interface Patient {
  mrn: string;
  name_ar?: string;
  name_en: string;
  age: number;
  sex: 'male' | 'female';
  allergies: string[];
  active_problems: { code: string; desc: string }[];
}

export function PatientHeader({ patient }: { patient: Patient }) {
  const { t, i18n } = useTranslation();
  const name = i18n.language === 'ar' ? patient.name_ar ?? patient.name_en : patient.name_en;

  return (
    <header className="bg-darkSurface rounded-lg border border-darkRaised p-4 mb-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-bold">{name}</div>
          <div className="text-xs text-mutedDark mt-1 flex gap-3">
            <span>{t('patient.mrn')}: <span className="text-secondaryDark">{patient.mrn}</span></span>
            <span>{t('patient.age')}: {patient.age}</span>
            <span>{t(`patient.${patient.sex}`)}</span>
          </div>
        </div>
        {patient.allergies.length > 0 && (
          <div className="bg-danger/15 border border-danger/40 rounded px-3 py-2 text-xs">
            <div className="text-danger font-bold mb-1">⚠ {t('patient.allergies')}</div>
            <ul className="space-y-0.5">
              {patient.allergies.map((a) => <li key={a}>• {a}</li>)}
            </ul>
          </div>
        )}
      </div>
      {patient.active_problems.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {patient.active_problems.map((p) => (
            <span key={p.code}
                  className="text-[11px] bg-darkRaised px-2 py-0.5 rounded text-secondaryDark">
              {p.code} · {p.desc}
            </span>
          ))}
        </div>
      )}
    </header>
  );
}
