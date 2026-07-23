import React, { useState } from 'react';
import { Card, Input, Button, Grid, Text, Space, Table, Tag, Upload, Select } from 'antd';
import { SaveOutlined, FileSearchOutlined, RadarOutlined } from '@ant-design/icons';

/**
 * Component: AdvancedLabPanel
 * API Link: POST /api/diagnostics/lab-panel
 */
export const AdvancedLabPanel = ({ patientId }) => {
    const [form, setForm] = useState({
        panel_type: 'Comprehensive Metabolic',
        biomarkers: '',
        interpretation: '',
        critical_flag: false
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/diagnostics/lab-panel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patient_id: patientId })
            });
            const data = await response.json();
            if (data.success) alert('Lab panel committed.');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Advanced Diagnostic Lab Panel" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={12}><Text strong>Panel Type</Text><Select defaultValue="Comprehensive Metabolic" style={{ width: '100%' }} onChange={val => setForm({...form, panel_type: val})}>
                    <Select.Option value="Comprehensive Metabolic">Comprehensive Metabolic</Select.Option>
                    <Select.Option value="Lipid Profile">Lipid Profile</Select.Option>
                    <Select.Option value="Thyroid Panel">Thyroid Panel</Select.Option>
                    <Select.Option value="Tumor Markers">Tumor Markers</Select.Option>
                </Select></Grid.Col>
                <Grid.Col span={12}><Text strong>Biomarkers (Comma Separated)</Text><Input value={form.biomarkers} onChange={e => setForm({...form, biomarkers: e.target.value})} /></Grid.Col>
                <Grid.Col span={24}><Text strong>Clinical Interpretation</Text><Input.TextArea rows={3} value={form.interpretation} onChange={e => setForm({...form, interpretation: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Critical Value Flag</Text><Select defaultValue="false" style={{ width: '100%' }} onChange={val => setForm({...form, critical_flag: val === 'true'})}>
                    <Select.Option value="false">No</Select.Option>
                    <Select.Option value="true">Yes (Critical)</Select.Option>
                </Select></Grid.Col>
            </Grid.Row>
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit Lab Results</Button>
            </Space>
        </Card>
    );
};

/**
 * Component: RadiologyAIAnalysis
 * API Link: POST /api/diagnostics/radiology-ai
 */
export const RadiologyAIAnalysis = ({ patientId, imageId }) => {
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);

    const runAIAnalysis = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/diagnostics/radiology-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patient_id: patientId, image_id: imageId })
            });
            const data = await response.json();
            setAnalysis(data.ai_interpretation);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Radiology AI-Assisted Interpretation" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <div style={{ marginBottom: 16, textAlign: 'center' }}>
                <div style={{ width: '100%', height: '200px', background: '#222', border: '1px dashed #444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                    [DICOM Image Viewer Placeholder]
                </div>
            </div>
            <Space style={{ marginBottom: 16, justifyContent: 'center' }}>
                <Button type="primary" icon={<RadarOutlined />} onClick={runAIAnalysis} loading={loading} style={{ background: '#00e5ff', color: '#000' }}>Run AI Analysis</Button>
            </Space>
            <div style={{ background: '#111', padding: '12px', borderLeft: '4px solid #00e5ff', color: '#ccc', fontStyle: 'italic' }}>
                {analysis || 'Click "Run AI Analysis" to generate an automated interpretation based on the DICOM metadata.'}
            </div>
        </Card>
    );
};
