// filepath: 02_MODULES/DEP-033/22_frontend_page.tsx
// Main page for Pediatric_Development_Rehab (DEP-033)

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { DeptPage, VitalPanel, AllergyBanner, RiskStratifier, OrderCard, PatientIDCard, CDSAlertBar } from '@nama/stitch-medical';
import { PedsdevAPI } from './24_frontend_api_client';

interface PedsdevPageProps {
  tenantId: number;
  patientId: number;
  lang?: 'ar' | 'en';
}

export default function PedsdevPage({ tenantId, patientId, lang = 'ar' }: PedsdevPageProps) {
  const { t } = useTranslation('pedsDev');
  const [encounter, setEncounter] = useState(null);
  const [orders, setOrders] = useState([]);
  const [results, setResults] = useState([]);
  const [tab, setTab] = useState<'overview'|'orders'|'results'|'notes'>('overview');

  useEffect(() => {
    PedsdevAPI.listEncounters({ patientId, tenantId }).then(setEncounter);
    PedsdevAPI.listOrders({ patientId, tenantId }).then(setOrders);
    PedsdevAPI.listResults({ patientId, tenantId }).then(setResults);
  }, [patientId, tenantId]);

  return (
    <DeptPage
      title_ar="تطور وإعادة تأهيل الأطفال"
      title_en="Pediatric_Development_Rehab"
      tenantId={tenantId}
      lang={lang}
      sidebar={
        <>
          <PatientIDCard patientId={patientId} />
          <AllergyBanner patientId={patientId} />
          <RiskStratifier scoreType="GMFCS" patientId={patientId} />
        </>
      }
      main={
        <>
          {tab === 'overview' && (
            <>
              <VitalPanel patientId={patientId} metrics={['HR','BP','SpO2','RR','Temp']} />
              <CDSAlertBar tenantId={tenantId} patientId={patientId} />
            </>
          )}
          {tab === 'orders' && (
            <div className="orders-list">
              {orders.map(o => <OrderCard key={o.id} order={o} />)}
            </div>
          )}
          {tab === 'results' && (
            <div className="results-list">
              {results.map(r => <ResultCard key={r.id} result={r} />)}
            </div>
          )}
          {tab === 'notes' && (
            <NotesEditor patientId={patientId} encounterId={encounter?.id} />
          )}
        </>
      }
      tabs={[
        { id: 'overview', label_ar: 'نظرة عامة', label_en: 'Overview' },
        { id: 'orders', label_ar: `الطلبات (${orders.length})`, label_en: `Orders (${orders.length})` },
        { id: 'results', label_ar: 'النتائج', label_en: 'Results' },
        { id: 'notes', label_ar: 'الملاحظات', label_en: 'Notes' }
      ]}
      activeTab={tab}
      onTabChange={setTab}
    />
  );
}