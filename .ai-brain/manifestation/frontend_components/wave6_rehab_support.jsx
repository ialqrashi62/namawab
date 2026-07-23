import React, { useState } from 'react';
import { Card, Input, Button, Grid, Text, Space, Alert, Rate } from 'antd';
import { SaveOutlined, TrendingUpOutlined } from '@ant-design/icons';

/**
 * Component: PhysicalRehabLog
 * API Link: POST /api/rehab/physical
 */
export const PhysicalRehabLog = ({ patientId }) => {
    const [form, setForm] = useState({
        joint_name: '',
        rom_degrees: 0,
        mmt_grade: 3,
        gait_status: 'Assisted',
        balance_score: 0
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/rehab/physical', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patient_id: patientId })
            });
            const data = await response.json();
            if (data.success) alert('Physical rehab log committed.');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Physical Therapy & ROM Tracking" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={12}><Text strong>Joint Name</Text><Input value={form.joint_name} onChange={e => setForm({...form, joint_name: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>ROM (Degrees)</Text><Input type="number" value={form.rom_degrees} onChange={e => setForm({...form, rom_degrees: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>MMT Grade (0-5)</Text><Input type="number" value={form.mmt_grade} onChange={e => setForm({...form, mmt_grade: parseInt(e.target.value)})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Gait Status</Text><Input value={form.gait_status} onChange={e => setForm({...form, gait_status: e.target.value})} /></Grid.Col>
            </Grid.Row>
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit Progress</Button>
            </Space>
        </Card>
    );
};

/**
 * Component: PsychosocialSupportForm
 * API Link: POST /api/rehab/psychosocial
 */
export const PsychosocialSupportForm = ({ patientId }) => {
    const [form, setForm] = useState({
        phq9_score: 0,
        gad7_score: 0,
        sdoh_markers: '',
        support_system_grade: 'Moderate'
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/rehab/psychosocial', {
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
        <Card title="Psychosocial & Mental Health Support" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={8}><Text strong>PHQ-9 (Depression)</Text><Input type="number" value={form.phq9_score} onChange={e => setForm({...form, phq9_score: parseInt(e.target.value)})} /></Grid.Col>
                <Grid.Col span={8}><Text strong>GAD-7 (Anxiety)</Text><Input type="number" value={form.gad7_score} onChange={e => setForm({...form, gad7_score: parseInt(e.target.value)})} /></Grid.Col>
                <Grid.Col span={8}><Text strong>Support Grade</Text><Input value={form.support_system_grade} onChange={e => setForm({...form, support_system_grade: e.target.value})} /></Grid.Col>
                <Grid.Col span={24}><Text strong>SDOH Markers</Text><Input.TextArea rows={3} value={form.sdoh_markers} onChange={e => setForm({...form, sdoh_markers: e.target.value})} /></Grid.Col>
            </Grid.Row>
            {alert && <Alert message={alert} type="error" showIcon style={{ marginTop: 10, backgroundColor: '#4a0000', color: '#fff' }} />}
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit Support Log</Button>
            </Space>
        </Card>
    );
};
