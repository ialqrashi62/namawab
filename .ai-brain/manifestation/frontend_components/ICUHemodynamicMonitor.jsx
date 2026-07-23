import React, { useState, useEffect } from 'react';
import { Alert, Card, Input, Button, Text, Grid, Space } from 'antd'; // Using AntD for rapid high-density medical UI
import { WarningOutlined, SaveOutlined, SyncOutlined } from '@ant-design/icons';

/**
 * Component: ICUHemodynamicMonitor
 * Purpose: Real-time monitoring of MAP, CVP, and CO with critical alert integration.
 * API Link: POST /api/critical-care/hemodynamics
 */
const ICUHemodynamicMonitor = ({ patientId }) => {
    const [metrics, setMetrics] = useState({
        map: 0,
        cvp: 0,
        co: 0,
        hr: 0
    });
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/critical-care/hemodynamics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_id: patientId,
                    map_value: metrics.map,
                    cvp_value: metrics.cvp,
                    cardiac_output: metrics.co,
                    heart_rate: metrics.hr
                })
            });
            const data = await response.json();
            if (data.alert) {
                setAlert(data.alert);
            } else {
                setAlert(null);
            }
        } catch (error) {
            console.error('API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card 
            title="ICU Hemodynamic Monitor" 
            className="stitch-google-card" 
            style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}
        >
            <Grid.Row gutter={[16, 16]}>
                <Grid.Col span={6}>
                    <Text strong>MAP (mmHg)</Text>
                    <Input 
                        type="number" 
                        value={metrics.map} 
                        onChange={(e) => setMetrics({...metrics, map: parseFloat(e.target.value)})} 
                        style={{ fontSize: '24px', textAlign: 'center', color: metrics.map < 60 ? '#ff4d4f' : '#fff' }}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text strong>CVP (mmHg)</Text>
                    <Input 
                        type="number" 
                        value={metrics.cvp} 
                        onChange={(e) => setMetrics({...metrics, cvp: parseFloat(e.target.value)})} 
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text strong>CO (L/min)</Text>
                    <Input 
                        type="number" 
                        value={metrics.co} 
                        onChange={(e) => setMetrics({...metrics, co: parseFloat(e.target.value)})} 
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Text strong>HR (bpm)</sText>
                    <Input 
                        type="number" 
                        value={metrics.hr} 
                        onChange={(e) => setMetrics({...metrics, hr: parseFloat(e.target.value)})} 
                    />
                </Grid.Col>
            </Grid.Row>

            {alert && (
                <Alert 
                    message="CRITICAL ALERT" 
                    description={alert} 
                    type="error" 
                    showIcon 
                    style={{ marginTop: 20, backgroundColor: '#4a0000', color: '#fff', borderColor: '#ff0000' }}
                    icon={<WarningOutlined />}
                />
            )}

            <Space style={{ marginTop: 20, justifyContent: 'flex-end' }}>
                <Button icon={<SyncOutlined />} onClick={() => window.location.reload()}>Refresh</Button>
                <Button type="primary" icon={<SaveOutlined />} loading={loading} onClick={handleSave} style={{ background: '#00e5ff', color: '#000', border: 'none' }}>
                    Commit to EHR
                </Button>
            </Space>
        </Card>
    );
};

export default ICUHemodynamicMonitor;
