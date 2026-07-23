import React, { useState } from 'react';
import { Card, Input, Button, Grid, Text, Space, Alert, Select } from 'antd';
import { SaveOutlined, WarningOutlined, ThunderboltOutlined } from '@ant-design/icons';

/**
 * Component: HemodynamicDashboard
 * API Link: POST /api/critical-care/hemodynamics
 */
export const HemodynamicDashboard = ({ patientId }) => {
    const [metrics, setMetrics] = useState({
        map_value: 0,
        cvp_value: 0,
        cardiac_output: 0,
        stroke_volume: 0,
        heart_rate: 0
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/critical-care/hemodynamics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...metrics, patient_id: patientId })
            });
            const data = await response.json();
            if (data.alert) setAlert(data.alert);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Critical Care Hemodynamic Dashboard" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={6}><Text strong>MAP (mmHg)</Text><Input type="number" value={metrics.map_value} onChange={e => setMetrics({...metrics, map_value: parseFloat(e.target.value)})} style={{ color: metrics.map_value < 60 ? '#ff4d4f' : '#fff' }} /></Grid.Col>
                <Grid.Col span={6}><Text strong>CVP (mmHg)</Text><Input type="number" value={metrics.cvp_value} onChange={e => setMetrics({...metrics, cvp_value: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={6}><Text strong>CO (L/min)</Text><Input type="number" value={metrics.cardiac_output} onChange={e => setMetrics({...metrics, cardiac_output: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.ColP span={6}><Text strong>HR (bpm)</Text><Input type="number" value={metrics.heart_rate} onChange={e => setMetrics({...metrics, heart_rate: parseFloat(e.target.value)})} /></Grid.Col>
            </Grid.Row>
            {alert && <Alert message={alert} type="error" showIcon style={{ marginTop: 10, backgroundColor: '#4a0000', color: '#fff' }} />}
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit Hemodynamics</Button>
            </Space>
        </Card>
    );
};

/**
 * Component: SepsisBundleTracker
 * API Link: POST /api/critical-care/sepsis-bundle
 */
export const SepsisBundleTracker = ({ patientId }) => {
    const [form, setForm] = useState({
        lactate_initial: 0,
        lactate_followup: 0,
        antibiotics_administered: false,
        fluid_resuscitation_ml: 0,
        bundle_compliance_status: 'Partial'
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/critical-care/sepsis-bundle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patient_id: patientId })
            });
            const data = await response.json();
            if (data.alert) setAlert(data.alert);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Sepsis Bundle Compliance (SSC)" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={8}><Text strong>Initial Lactate</Text><Input type="number" value={form.lactate_initial} onChange={e => setForm({...form, lactate_initial: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={8}><Text strong>Follow-up Lactate</Text><Input type="number" value={form.lactate_followup} onChange={e => setForm({...form, lactate_followup: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={8}><Text strong>Compliance</Text><Select value={form.bundle_compliance_status} onChange={v => setForm({...form, bundle_compliance_status: v})} style={{ width: '100%', color: '#fff', background: '#222' }}>
                    <Select.Option value="Fully Compliant">Fully Compliant</Select.Option>
                    <Select.Option value="Partial">Partial</Select.Option>
                    <Select.Option value="Non-Compliant">Non-Compliant</Select.Option>
                </Select></Grid.Col>
                <Grid.Col span={12}><Text strong>Fluid Resuscitation (ml)</Text><Input type="number" value={form.fluid_resuscitation_ml} onChange={e => setForm({...form, fluid_resuscitation_ml: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Antibiotics Given</Text><Input.Checkbox checked={form.antibiotics_administered} onChange={e => setForm({...form, antibiotics_administered: e.target.checked})} /></Grid.Col>
            </Grid.Row>
            {alert && <Alert message={alert} type="error" showIcon style={{ marginTop: 10, backgroundColor: '#4a0000', color: '#fff' }} />}
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit Bundle Status</Button>
            </Space>
        </Card>
    );
};
