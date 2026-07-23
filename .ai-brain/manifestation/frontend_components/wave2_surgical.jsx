import React, { useState } from 'react';
import { Card, Input, Button, Grid, Text, Space, Alert, Select } from 'antd';
import { SaveOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

/**
 * Component: SurgicalSafetyChecklist
 * API Link: POST /api/surgery/safety-checklist
 */
export const SurgicalSafetyChecklist = ({ procedureId }) => {
    const [form, setForm] = useState({
        phase: 'Pre-Op',
        checklist_completed: false,
        verified_by: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/surgery/safety-checklist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, procedure_id: procedureId })
            });
            const data = await response.json();
            if (data.success) alert('Checklist verified and locked.');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="WHO Surgical Safety Checklist" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={12}>
                    <Text strong>Phase</Text>
                    <Select 
                        value={form.phase} 
                        onChange={v => setForm({...form, phase: v})} 
                        style={{ width: '100%', color: '#fff', background: '#222' }}
                    >
                        <Select.Option value="Pre-Op">Pre-Op (Sign-In)</Select.Option>
                        <Select.Option value="Intra-Op">Intra-Op (Time-Out)</Select.Option>
                        <Select.Option value="Post-Op">Post-Op (Sign-Out)</Select.Option>
                    </Select>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Text strong>Verified By</Text>
                    <Input value={form.verified_by} onChange={e => setForm({...form, verified_by: e.target.value})} />
                </Grid.Col>
                <Grid.Col span={24}>
                    <Text strong>Completion Status</Text>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Input.Checkbox checked={form.checklist_completed} onChange={e => setForm({...form, checklist_completed: e.target.checked})} />
                        <Text>All safety items verified</Text>
                    </div>
                </Grid.Col>
            </Grid.Row>
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Lock Checklist</Button>
            </Space>
        </Card>
    );
};

/**
 * Component: NeuroSurgicalLog
 * API Link: POST /api/neurosurgery/log
 */
export const NeuroSurgicalLog = ({ patientId }) => {
    const [form, setForm] = useState({
        surgeon_id: '',
        procedure_type: '',
        approach: '',
        side: 'Bilateral',
        duration_minutes: 0,
        blood_loss_ml: 0,
        intraop_findings: '',
        complications: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/neurosurgery/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patient_id: patientId })
            });
            const data = await response.json();
            if (data.success) alert('Neuro-log committed.');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Neurosurgical Intervention Log" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={12}><Text strong>Surgeon ID</Text><Input value={form.surgeon_id} onChange={e => setForm({...form, surgeon_id: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Procedure</Text><Input value={form.procedure_type} onChange={e => setForm({...form, procedure_type: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Approach</Text><Input value={form.approach} onChange={e => setForm({...form, approach: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Side</Text><Select value={form.side} onChange={v => setForm({...form, side: v})} style={{ width: '100%', color: '#fff', background: '#222' }}>
                    <Select.Option value="Left">Left</Select.Option>
                    <Select.Option value="Right">Right</Select.Option>
                    <Select.Option value="Bilateral">Bilateral</Select.Option>
                </Select></Grid.Col>
                <Grid.Col span={12}><Text strong>Duration (min)</Text><Input type="number" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Blood Loss (ml)</Text><Input type="number" value={form.blood_loss_ml} onChange={e => setForm({...form, blood_loss_ml: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={24}><Text strong>Intra-op Findings</Text><Input.TextArea rows={3} value={form.intraop_findings} onChange={e => setForm({...form, intraop_findings: e.target.value})} /></Grid.Col>
            </Grid.Row>
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit</Button>
            </Space>
        </Card>
    );
};
