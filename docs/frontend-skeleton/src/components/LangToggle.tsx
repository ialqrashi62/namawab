import { useTranslation } from 'react-i18next';

export function LangToggle() {
  const { i18n } = useTranslation();
  const switchTo = i18n.language === 'ar' ? 'en' : 'ar';
  return (
    <button
      onClick={() => i18n.changeLanguage(switchTo)}
      className="text-xs px-2 py-1 rounded border border-darkRaised text-secondaryDark hover:bg-darkRaised"
      aria-label="Switch language"
    >
      {switchTo.toUpperCase()}
    </button>
  );
}
