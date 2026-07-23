import React, { useState } from 'react';
import { Card, Input, Button, Grid, Text, Space, Table, Tag, Select, Upload } from 'antd';
import { SaveOutlined, ExperimentOutlined, BookOutlined } from '@ant-design/icons';

/**
 * Component: RareDiseaseRegistry
 * API Link: POST /api/rare-specialties/registry
 */
export const RareDiseaseRegistry = ({ patientId }) => {
    const [form, setForm] = useState({
        disease_code: '',
        genetic_marker: '',
        phenotype_description: '',
        orphan_drug_status: 'Not Applicable'
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/rare-specialties/registry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patient_id: patientId })
            });
            const data = await response.json();
            if (data.success) alert('Rare disease record committed to global registry.');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Rare Disease & Orphan Registry" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={12}><Text strong>Disease Code (ICD-11/Orphanet)</Text><Input value={form.disease_code} onChange={e => setForm({...form, disease_code: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Genetic Marker</Text><Input value={form.genetic_marker} onChange={e => setForm({...form, genetic_marker: e.target.value})} /></Grid.Col>
                <Grid.Col span={24}><Text strong>Phenotype Description</Text><Input.TextArea rows={3} value={form.phenotype_description} onChange={e => setForm({...form, phenotype_description: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Orphan Drug Status</Text><Select defaultValue="Not Applicable" style={{ width: '100%' }} onChange={val => setForm({...form, orphan_drug_status: val})}>
                    <Select.Option value="Not Applicable">Not Applicable</Select.Option>
                    <Select.Option value="Approved">Approved</Select.Option>
                    <Select.Option value="Clinical Trial">Clinical Trial</Select.HOption value="Compassionate Use">Compassionate Use</Select.Option>
                </Select></Grid.Col>
            </Grid.Row>
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit to Registry</Button>
            </Space>
        </Card>
    );
};

/**
 * Component: ClinicalTrialManager
 * API Link: POST /api/research/trial-entry
 */
export const ClinicalTrialManager = ({ patientId, trialId }) => {
    const [form, setForm] = useState({
        phase: 'Phase II',
        cohort: 'Experimental',
        adverse_events: '',
        endpoint_met: false
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/research/trial-entry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patient_id: patientId, trial_id: trialId })
            });
            const data = await response.json();
            if (data.success) alert('Clinical trial data committed.');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Clinical Research & Trial Management" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={12}><Text strong>Trial Phase</Text><Select defaultValue="Phase II" style={{ width: '100%' }} onChange={val => setForm({...form, phase: val})}>
                    <Select.Option value="Phase I">Phase I</Select.Option>
                    <Select.Option value="Phase II">Phase II</Select.Option>
                    <Select.Option value="Phase III">Phase III</Select.Option>
                    <Select.Option value="Phase IV">Phase IV</Select.Option>
                </Select></Grid.Col>
                <Grid.Col span={12}><Text strong>Cohort</Text><Input value={form.cohort} onChange={e => setForm({...form, cohort: e.target.value})} /></Grid.Col>
                <Grid.Col span={24}><Text strong>Adverse Events / Observations</Text><Input.TextArea rows={3} value={form.adverse_events} onChange={e => setForm({...form, adverse_events: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Primary Endpoint Met</Text><Select defaultValue="false" style={{ width: '100%' }} onChange={val => setForm({...form, endpoint_met: val === 'true'})}>
                    <Select.Option value="false">No</Select.Option>
                    <Select.Option value="true">Yes</Select.Option>
                </Select></HOption>
            </Grid.Row>
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit Research Data</Button>
            </Space>
        </Card>
    );
};
