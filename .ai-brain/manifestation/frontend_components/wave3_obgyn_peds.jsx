import React, { useState } from 'react';
import { Card, Input, Button, Grid, Text, Space, Alert, Select, Table } from 'antd';
import { SaveOutlined, WarningOutlined } from '@ant-design/icons';

/**
 * Component: IVFEmbryoGrader
 * API Link: POST /api/obgyn/ivf/embryo-grade
 */
export const IVFEmbryoGrader = ({ patientId, cycleId }) => {
    const [form, setForm] = useState({
        oocyte_count: 0,
        fertilization_rate: 0,
        embryo_grade: '',
        embryo_stage: 'Blastocyst',
        transfer_date: '',
        cryopreservation_count: 0
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/obgyn/ivf/embryo-grade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, patient_id: patientId, cycle_id: cycleId })
            });
            const data = await response.json();
            if (data.success) alert('Embryo grade committed to registry.');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="IVF Embryo Grading (Gardner Scale)" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={8}><Text strong>Oocyte Count</Text><Input type="number" value={form.oocyte_count} onChange={e => setForm({...form, oocyte_count: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={8}><Text strong>Fertilization Rate (%)</Text><Input type="number" value={form.fertilization_rate} onChange={e => setForm({...form, fertilization_rate: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={8}><Text strong>Embryo Grade</Text><Input placeholder="e.g. 4AA" value={form.embryo_grade} onChange={e => setForm({...form, embryo_grade: e.target.value})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Stage</Text><Select value={form.embryo_stage} onChange={v => setForm({...form, embryo_stage: v})} style={{ width: '100%', color: '#fff', background: '#222' }}>
                    <Select.Option value="Cleavage">Cleavage</Select.Option>
                    <Select.Option value="Blastocyst">Blastocyst</Select.Option>
                </Select></Grid.Col>
                <Grid.Col span={12}><Text strong>Transfer Date</Text><Input type="date" value={form.transfer_date} onChange={e => setForm({...form, transfer_date: e.target.value})} /></Grid.Col>
            </Grid.Row>
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit to IVF Lab</Button>
            </Space>
        </Card>
    );
};

/**
 * Component: MFMGrowthTracker
 * API Link: POST /api/obgyn/mfm/growth-track
 */
export const MFMGrowthTracker = ({ patientId }) => {
    const [form, setForm] = useState({
        gestational_age_weeks: 0,
        bpd_mm: 0, hc_mm: 0, ac_mm: 0, fl_mm: 0,
        estimated_fetal_weight_g: 0,
        growth_percentile: 0,
        doppler_velocity_cm_s: 0
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/obgyn/mfm/growth-track', {
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
        <Card title="Maternal-Fetal Medicine (MFM) Growth Tracking" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={6}><Text strong>GA (Weeks)</Text><Input type="number" value={form.gestational_age_weeks} onChange={e => setForm({...form, gestational_age_weeks: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={6}><Text strong>BPD (mm)</Text><Input type="number" value={form.bpd_mm} onChange={e => setForm({...form, bpd_mm: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={6}><Text strong>HC (mm)</Text><Input type="number" value={form.hc_mm} onChange={e => setForm({...form, hc_mm: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={6}><Text strong>AC (mm)</Text><Input type="number" value={form.ac_mm} onChange={e => setForm({...form, ac_mm: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={6}><Text strong>FL (mm)</Text><Input type="number" value={form.fl_mm} onChange={e => setForm({...form, fl_mm: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={6}><Text strong>Est. Weight (g)</Text><Input type="number" value={form.estimated_fetal_weight_g} onChange={e => setForm({...form, estimated_fetal_weight_g: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Growth Percentile (%)</Text><Input type="number" value={form.growth_percentile} onChange={e => setForm({...form, growth_percentile: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Doppler Velocity (cm/s)</Text><Input type="number" value={form.doppler_velocity_cm_s} onChange={e => setForm({...form, doppler_velocity_cm_s: parseFloat(e.target.value)})} /></Grid.Col>
            </Grid.Row>
            {alert && <Alert message={alert} type="error" showIcon style={{ marginTop: 10, backgroundColor: '#4a0000', color: '#fff' }} />}
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit to MFM Registry</Button>
            </Space>
        </Card>
    );
};

/**
 * Component: NICUVentilationPanel
 * API Link: POST /api/nicu/vent-settings
 */
export const NICUVentilationPanel = ({ patientId }) => {
    const [form, setForm] = useState({
        vent_mode: 'HFOV',
        fio2_percent: 21,
        peep_cmh2o: 5,
        mean_airway_pressure_cmh2o: 10,
        tidal_volume_ml: 0,
        respiratory_rate_bpm: 0,
        spo2_percent: 95
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/nicu/vent-settings', {
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
        <Card title="NICU Level III/IV Ventilation Control" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={8}><Text strong>Mode</Text><Select value={form.vent_mode} onChange={v => setForm({...form, vent_mode: v})} style={{ width: '100%', color: '#fff', background: '#222' }}>
                    <Select.Option value="HFOV">HFOV</Select.Option>
                    <Select.Option value="Conventional">Conventional</Select.Option>
                    <Select.Option value="CPAP">CPAP</Select.Option>
                </Select></Grid.Col>
                <Grid.Col span={8}><Text strong>FiO2 (%)</Text><Input type="number" value={form.fio2_percent} onChange={e => setForm({...form, fio2_percent: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={8}><Text strong>PEEP (cmH2O)</Text><Input type="number" value={form.peep_cmh2o} onChange={e => setForm({...form, peep_cmh2o: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>Mean Airway Pressure</Text><Input type="number" value={form.mean_airway_pressure_cmh2o} onChange={e => setForm({...form, mean_airway_pressure_cmh2o: parseFloat(e.target.value)})} /></Grid.Col>
                <Grid.Col span={12}><Text strong>SpO2 (%)</Text><Input type="number" value={form.spo2_percent} onChange={e => setForm({...form, spo2_percent: parseFloat(e.target.value)})} /></Grid.Col>
            </Grid.Row>
            {alert && <Alert message={alert} type="error" showIcon style={{ marginTop: 10, backgroundColor: '#4a0000', color: '#fff' }} />}
            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000' }}>Commit to NICU Log</Button>
            </Space>
        </Card>
    );
};
