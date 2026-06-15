import { Route, Routes, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppShell } from './components/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';

const Dashboard      = lazy(() => import('./pages/Dashboard'));
const PatientSearch  = lazy(() => import('./pages/PatientSearch'));
const PatientView    = lazy(() => import('./pages/PatientView'));
const CardioDash     = lazy(() => import('./pages/cardio/CardioDashboard'));
const CardioOrders   = lazy(() => import('./pages/cardio/Orders'));
const EcgReader      = lazy(() => import('./pages/cardio/EcgReader'));
const EdBoard        = lazy(() => import('./pages/ed/Board'));
const EdTriage       = lazy(() => import('./pages/ed/Triage'));
const Settings       = lazy(() => import('./pages/Settings'));
const Login          = lazy(() => import('./pages/Login'));
const NotFound       = lazy(() => import('./pages/NotFound'));

export function App() {
  return (
    <Suspense fallback={<div className="p-6 text-muted">Loading…</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<PatientSearch />} />
          <Route path="patients/:mrn" element={<PatientView />} />
          <Route path="cardio" element={<CardioDash />} />
          <Route path="cardio/orders" element={<CardioOrders />} />
          <Route path="cardio/ecg/:id" element={<EcgReader />} />
          <Route path="ed/board" element={<EdBoard />} />
          <Route path="ed/triage" element={<EdTriage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
