import React, { useState } from 'react';
import { Card, Input, Button, Grid, Text, Space, Alert, Table, Tag } from 'antd';
import { SaveOutlined, WarningOutlined, EyeOutlined } from '@ant-design/icons';

/**
 * Component: MolecularDiagnosticsForm
 * API Link: POST /api/diagnostics/molecular
 */
export const MolecularDiagnosticsForm = ({ patientId }) => {
    const [form, setForm] = useState({
        test_type: 'NGS',
        gene_mutation: '',
        variant_allele_frequency: 0,
        molecular_typing: ''
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/diagnostics/molecular', {
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
        <Card title="Advanced Molecular Diagnostics" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={12}><Text strong>Test Type</Text><Select value={form.test_type} onChange={v => setForm({...form, test_type: v})} style={{ width: '100%', color: '#fff', background: '#222' }}>
                    <Select.Option value="NGS">Next-Gen Sequencing</Select.Option>
                    <Select.Option value="Liquid Biopsy">Liquid Biopsy</Select.Option>
                    <Select.Option value="PCR">Quantitative PCR</Select.Option>
                </Select></Grid.Col>
                <Grid.Col span={12}><Text strong>Gene Mutation</Text><Input placeholder="e.g. KRAS G12C" value={form.gene_mutation} onChange={e => setForm({...form, gene_mutation: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>VAF (%)</Text><Input type="number" value={form.variant_allele_frequency} onChange={e => setForm({...form, variant_allele_frequency: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Molecular Typing</Text><Input value={form.molecular_typing} onChange={e => setForm({...form, molecular_typing: e.target.value})} /></Grid.Col>
            </Grid.Row>
            {alert && <Alert message={alert} type="error" showIcon style={{ marginTop: 10, backgroundColor: '#4a0000', color: '#fff' }} />}
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit to Molecular Registry</Button>
            </Space>
        </Card>
    );
};

/**
 * Component: AdvancedRadiologyPanel
 * API Link: POST /api/diagnostics/radiology-advanced
 */
export const AdvancedRadiologyPanel = ({ patientId, procedureId }) => {
    const [form, setForm] = useState({
        lesion_volume_mm3: 0,
        kinetic_curve_type: 'Wash-out',
        contrast_enhancement_rate: 0,
        ai_detection_confidence: 0
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/diagnostics/radiology-advanced', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patient_id: patientId, procedure_id: procedureId })
            });
            const data = await response.json();
            if (data.alert) setAlert(data.alert);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Advanced Volumetric Radiology" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={8}><Text strong>Lesion Volume (mm³)</Text><Input type="number" value={form.lesion_volume_mm3} onChange={e => setForm({...form, lesion_volume_mm3: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={8}><Text strong>Kinetic Curve</Text><Select value={form.kinetic_curve_type} onChange={v => setForm({...form, kinetic_curve_type: v})} style={{ width: '100%', color: '#fff', background: '#222' }}>
                    <Select.Option value="Wash-in">Wash-in</Select.Option>
                    <Select.Option value="Wash-out">Wash-out</Select.Option>
                    <Select.Option value="Plateau">Plateau</Select.Option>
                </Select></Grid.Col>
                <Grid.Col span={8}><Text strong>AI Confidence (%)</Text><Input type="number" value={form.ai_detection_confidence} onChange={e => setForm({...form, ai_detection_confidence: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={24}><Text strong>Contrast Enhancement Rate</Text><Input type="number" value={form.contrast_enhancement_rate} onChange={e => setForm({...form, contrast_enhancement_rate: parseFloat(e.target.value)})} /></Grid.Col>
            </Grid.Row>
            {alert && <Alert message={alert} type="error" showIcon style={{ marginTop: 10, backgroundColor: '#4a0000', color: '#fff' }} />}
            <Space style={{ marginTop: 20, justifyContent으로 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit Volumetric Data</Button>
            </Space>
        </Card>
    );
};
