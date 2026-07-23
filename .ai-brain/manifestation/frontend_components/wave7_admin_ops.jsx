import React, { useState } from 'react';
import { Card, Input, Button, Grid, Text, Space, Table, Tag, Select, Alert } from 'antd';
import { SaveOutlined, DashboardOutlined, SyncOutlined } from '@ant-design/icons';

/**
 * Component: HospitalResourceMonitor
 * API Link: GET /api/admin/resources
 */
export const HospitalResourceMonitor = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/resources');
            const data = await response.json();
            setResources(data.resources || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Real-time Resource Utilization" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Space style={{ marginBottom: 16, justifyContent: 'flex-end' }}>
                <Button icon={<SyncOutlined />} onClick={fetchResources} loading={loading}>Refresh Metrics</Button>
            </Space>
            <Table 
                dataSource={resources} 
                columns={[
                    { title: 'Resource', dataIndex: 'name', key: 'name' },
                    { title: 'Capacity', dataIndex: 'total', key: 'total' },
                    { title: 'Occupied', dataIndex: 'used', key: 'used' },
                    { title: 'Status', dataIndex: 'status', key: 'status', 
                      render: (status) => <Tag color={status === 'Critical' ? 'red' : 'green'}>{status}</Tag> 
                    },
                ]} 
                pagination={false}
                style={{ background: 'transparent', color: '#fff' }}
            />
        </Card>
    );
};

/**
 * Component: RevenueCycleManagement
 * API Link: POST /api/finance/billing-audit
 */
export const RevenueCycleManagement = ({ facilityId }) => {
    const [auditLog, setAuditLog] = useState([]);
    const [loading, setLoading] = useState(false);

    const runAudit = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/finance/billing-audit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ facility_id: facilityId })
            });
            const data = await response.json();
            setAuditLog(data.discrepancies || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <Card title="Revenue Cycle & Billing Integrity" className="stitch-google-card" style={{ background: '#0a0a0a', color: '#fff', border: '1px solid #333' }}>
            <Space style={{ marginBottom: 16, justifyContent: 'flex-end' }}>
                <Button type="primary" icon={<DashboardOutlined />} onClick={runAudit} loading={loading} style={{ background: '#00e5ff', color: '#000' }}>Run Integrity Audit</Button>
            </Space>
            <Table 
                dataSource={auditLog} 
                columns={[
                    { title: 'Invoice ID', dataIndex: 'invoice_id', key: 'invoice_id' },
                    { title: 'Discrepancy', dataIndex: 'issue', key: 'issue' },
                    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
                    { title: 'Risk', dataIndex: 'risk_level', key: 'risk_level', 
                      render: (risk) => <Tag color={risk === 'High' ? 'red' : 'orange'}>{risk}</Tag> 
                    },
                ]} 
                pagination={false}
                style={{ background: 'transparent', color: '#fff' }}
            />
        </Card>
    );
};
