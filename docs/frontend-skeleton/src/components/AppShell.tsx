import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/auth';
import { LangToggle } from './LangToggle';

export function AppShell() {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-darkBase text-primaryDark grid grid-cols-[240px_1fr]">
      <aside className="bg-darkSurface border-e border-darkRaised flex flex-col">
        <div className="p-4 text-xl font-display tracking-wider text-brand-primary">
          NamaMedical
        </div>
        <nav className="flex-1 p-2 space-y-1">
          <Item to="/dashboard" label={t('common.all')} />
          <Item to="/patients" label={t('patient.search')} />
          <Item to="/cardio" label={t('departments.cardiology')} />
          <Item to="/ed/board" label={t('departments.ed')} />
          <Item to="/settings" label={t('common.select')} />
        </nav>
        <div className="p-3 text-xs text-mutedDark">v1.0.0</div>
      </aside>
      <div className="flex flex-col">
        <header className="h-14 bg-darkSurface border-b border-darkRaised flex items-center justify-between px-4">
          <div className="text-sm text-secondaryDark">{user?.name}</div>
          <div className="flex items-center gap-3">
            <LangToggle />
            <button onClick={logout} className="text-xs text-danger hover:underline">
              {t('auth.logout')}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Item({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-sm transition ${
          isActive
            ? 'bg-brand-primary/10 text-brand-primary'
            : 'text-secondaryDark hover:bg-darkRaised hover:text-primaryDark'
        }`
      }
    >
      {label}
    </NavLink>
  );
}
