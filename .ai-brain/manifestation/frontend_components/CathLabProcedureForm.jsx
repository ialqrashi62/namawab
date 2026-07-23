import React, { useState } from 'react';
import { Card, Input, Button, Alert, Space, Grid, Text } from 'antd';
import { SaveOutlined, WarningOutlined } from '@ant-design/icons';

/**
 * Component: CathLabProcedureForm
 * Purpose: High-precision logging for Interventional Cardiology.
 * API Link: POST /api/cardiology/cath-lab/procedure
 */
const CathLabProcedureForm = ({ patientId, encounterId }) => {
    const [form, setForm] = useState({
        operator_id: '',
        access_site: 'Radial',
        fluoroscopy_time_min: 0,
        contrast_volume_ml: 0,
        status: 'In-Progress'
    });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitProcedure = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/cardiology/cath-lab/procedure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patient_id: patientId, encounter_id: encounterId })
            });
            const data = await response.json();
            if (data.success) {
                alert('Procedure logged successfully');
            }
        } catch (error) {
            console.error('API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card 
            title="Cath Lab Procedure Log" 
            className="stitch-google-card" 
            style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}
        >
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={12}>
                    <Text strong>Operator ID</Text>
                    <Input value={form.operator_id} onChange={(e) => setForm({...form, operator_id: e.target.value})} />
                </Grid.Col>
                <Grid.Col span={12}>
                    <Text strong>Access Site</Text>
                    <Input value={form.access_site} onChange={(e) => setForm({...form, access_site: e.target.value})} />
                </Grid.Col>
                <Grid.Col span={12}>
                    <Text strong>Fluoroscopy Time (min)</Text>
                    <Input type="number" value={form.fluoroscopy_time_min} onChange={(e) => setForm({...form, fluoroscopy_time_min: parseFloat(e.target.value)})} />
                </Grid.Col>
                <Grid.Col span={12}>
                    <Text strong>Contrast Volume (ml)</Text>
                    <Input type="number" value={form.contrast_volume_ml} onChange={(e) => setForm({...form, contrast_volume_ml: parseFloat(e.target.value)})} />
                </Grid.Col>
            </Grid.Row>

            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={submitProcedure} style={{ background: '#00e5ff', color: '#000', border: 'none' }}>
                    Commit to EHR
                </Button>
            </Space>
        </Card>
    );
};

export default CathLabProcedureForm;
