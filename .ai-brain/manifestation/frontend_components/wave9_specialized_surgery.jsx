import React, { useState } from 'react';
import { Card, Input, Button, Grid, Text, Space, Table, Tag, Select, Alert } from 'antd';
import { SaveOutlined, DeploymentUnitOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

/**
 * Component: SurgicalChecklist
 * API Link: POST /api/surgery/checklist
 */
export const SurgicalChecklist = ({ patientId, surgeryId }) => {
    const [checklist, setChecklist] = useState({
        site_marked: false,
        antibiotics_given: false,
        equipment_verified: false,
        patient_id_confirmed: false,
        blood_crossmatch_ready: false
    });
    const [loading, setLoading] = useState(false);

    const handleToggle = (key) => {
        setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/surgery/checklist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...checklist, patient_id: patientId, surgery_id: surgeryId })
            });
            const data = await response.json();
            if (data.success) alert('Surgical safety checklist committed.');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="WHO Surgical Safety Checklist" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {Object.entries(checklist).map(([key, value]) => (
                            <div key={key} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #222' }}>
                                <input type="checkbox" checked={value} onChange={() => handleToggle(key)} style={{ marginRight: 12, width: 18, height: 18 }} />
                                <Text style={{ color: value ? '#00e5ff' : '#ccc' }}>{key.replace(/_/g, ' ').toUpperCase()}</Text>
                            </div>
                        ))}
                    </Space>
                </Grid.Col>
            </Grid.Row>
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit Safety Lock</Button>
            </Space>
        </Card>
    );
};

/**
 * Component: AnesthesiaLog
 * API Link: POST /api/surgery/anesthesia
 */
export const AnesthesiaLog = ({ patientId, surgeryId }) => {
    const [form, setForm] = useState({
        agent_type: 'Propofol',
        dosage_mg: 0,
        vitals_stability: 'Stable',
        intubation_time: '',
        recovery_score: 0
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/surgery/anesthesia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patient_id: patientId, surgery_id: surgeryId })
            });
            const data = await response.json();
            if (data.success) alert('Anesthesia log committed.');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Intraoperative Anesthesia & Vitals" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={12}><Text strong>Agent Type</Text><Select defaultValue="Propofol" style={{ width: '100%' }} onChange={val => setForm({...form, agent_type: val})}>
                    <Select.Option value="Propofol">Propofol</Select.Option>
                    <Select.Option value="Sevoflurane">Sevoflurane</Select.Option>
                    <Select.Option value="Ketamine">Ketamine</Select.Option>
                    <Select.Option value="Isoflurane">Isoflurane</Select.Option>
                </Select></Grid.Col>
                <Grid.Col span={12}><Text strong>Dosage (mg)</Text><Input type="number" value={form.dosage_mg} onChange={e => setForm({...form, dosage_mg: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Vitals Stability</Text><Select defaultValue="Stable" style={{ width: '100%' }} onChange={val => setForm({...form, vitals_stability: val})}>
                    <Select.Option value="Stable">Stable</Select.Option>
                    <Select.Option value="Fluctuating">Fluctuating</Select.Option>
                    <Select.Option value="Unstable">Unstable</Select.Option>
                </Select></Grid.Col>
                <Grid.Col span={12}><Text strong>Intubation Time</Text><Input value={form.intubation_time} onChange={e => setForm({...form, intubation_time: e.target.value})} /></Grid.Col>
            </Grid.Row>
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit Anesthesia Log</Button>
            </Space>
        </Card>
    );
};
