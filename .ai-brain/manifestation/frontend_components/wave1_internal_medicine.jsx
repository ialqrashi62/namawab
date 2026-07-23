import React, { useState } from 'react';
import { Card, Input, Button, Grid, Text, Space, Alert } from 'antd';
import { SaveOutlined, WarningOutlined } from '@ant-design/icons';

/**
 * Component: CardiologyAssessmentForm
 * API Link: POST /api/cardiology/assessment
 */
export const CardiologyAssessmentForm = ({ patientId, encounterId }) => {
    const [form, setForm] = useState({
        heart_sounds: '',
        jvp_height: '',
        edema_grade: '',
        carotid_bruit: ''
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/cardiology/assessment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patient_id: patientId, encounter_id: encounterId })
            });
            const data = await response.json();
            if (data.success) alert('Assessment saved successfully');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Cardiology Physical Assessment" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={12}><Text strong>Heart Sounds</Text><Input value={form.heart_sounds} onChange={e => setForm({...form, heart_sounds: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>JVP Height</Text><Input value={form.jvp_height} onChange={e => setForm({...form, jvp_height: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Edema Grade</Text><Input value={form.edema_grade} onChange={e => setForm({...form, edema_grade: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Carotid Bruit</Text><Input value={form.carotid_bruit} onChange={e => setForm({...form, carotid_bruit: e.target.value})} /></Grid.Col>
            </Grid.Row>
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit</Button>
            </Space>
        </Card>
    );
};

/**
 * Component: RespiratoryPFTForm
 * API Link: POST /api/respiratory/pft
 */
export const RespiratoryPFTForm = ({ patientId, encounterId }) la-Surgical logic for precision respiratory diagnostics.
    const [form, setForm] = useState({
        fev1_predicted: 0, fev1_actual: 0, fvc_predicted: 0, fvc_actual: 0, dlco_percent: 0
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/respiratory/pft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patient_id: patientId, encounter_id: encounterId })
            });
            const data = await response.json();
            if (data.alert) setAlert(data.alert);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Pulmonary Function Test (PFT)" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={6}><Text strong>FEV1 Pred</Text><Input type="number" value={form.fev1_predicted} onChange={e => setForm({...form, fev1_predicted: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={6}><Text strong>FEV1 Act</Text><Input type="number" value={form.fev1_actual} onChange={e => setForm({...form, fev1_actual: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={6}><Text strong>FVC Pred</Text><Input type="number" value={form.fvc_predicted} onChange={e => setForm({...form, fvc_predicted: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={6}><Text strong>FVC Act</Text><Input type="number" value={form.fvc_actual} onChange={e => setForm({...form, fvc_actual: parseFloat(e.target.value)})} /></Grid.Col>
            </Grid.Row>
            {alert && <Alert message={alert} type="warning" showIcon style={{ marginTop: 10 }} />}
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit</Button>
            </Space>
        </Card>
    );
};
