// filepath: namaweb/lab_trends_engine.js
// Lab result trends: trends, deltas, abnormal flagging, panel summaries.
// Uses existing lab_results table (test_name, value, unit, ref_low, ref_high, abnormal_flag).
'use strict';

const db = require('./db_postgres');

const NUMERIC_TESTS = new Set([
    'glucose', 'hba1c', 'wbc', 'hgb', 'hct', 'plt', 'sodium', 'potassium',
    'chloride', 'co2', 'bun', 'creatinine', 'egfr', 'calcium', 'magnesium',
    'phosphorus', 'alt', 'ast', 'alp', 'bilirubin', 'albumin', 'protein',
    'cholesterol_total', 'ldl', 'hdl', 'triglycerides', 'tsh', 't4', 't3',
    'inr', 'pt', 'ptt', 'crp', 'esr', 'ferritin', 'iron', 'tibc',
    'vitamin_d', 'vitamin_b12', 'folate', 'psa', 'uric_acid'
]);

function parseNumeric(value) {
    if (value === null || value === undefined) return null;
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : null;
}

/**
 * Get trend for a single test for a patient.
 * Returns time-series with delta vs first reading.
 */
async function getTestTrend(tenantId, patientId, testName, limit = 30) {
    const result = await db.query(`
        SELECT id, test_name, value, unit, ref_low, ref_high, abnormal_flag, reported_at, is_critical
        FROM lab_results
        WHERE tenant_id = $1 AND patient_id = $2 AND LOWER(test_name) = LOWER($3)
        ORDER BY reported_at DESC
        LIMIT $4
    `, [tenantId, patientId, testName, limit]);
    const rows = result.rows.reverse(); // chronological
    if (rows.length === 0) return { test_name: testName, count: 0, points: [], trend: null };

    const isNumeric = NUMERIC_TESTS.has(testName.toLowerCase());
    const points = rows.map(r => {
        const num = isNumeric ? parseNumeric(r.value) : null;
        return {
            id: r.id,
            value: r.value,
            value_num: num,
            unit: r.unit || '',
            ref_low: r.ref_low != null ? +r.ref_low : null,
            ref_high: r.ref_high != null ? +r.ref_high : null,
            abnormal_flag: r.abnormal_flag || '',
            is_critical: r.is_critical === 1,
            reported_at: r.reported_at
        };
    });

    let trend = null;
    if (isNumeric && points.length >= 2) {
        const first = points[0].value_num;
        const last = points[points.length - 1].value_num;
        if (first != null && last != null) {
            const delta = last - first;
            const deltaPct = first !== 0 ? (delta / first) * 100 : null;
            // Linear slope (per reading)
            const n = points.length;
            let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
            for (let i = 0; i < n; i++) {
                const y = points[i].value_num;
                if (y == null) continue;
                sumX += i; sumY += y; sumXY += i * y; sumXX += i * i;
            }
            const slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) : 0;

            // Abnormal count
            const abnormal = points.filter(p =>
                (p.ref_low != null && p.value_num < p.ref_low) ||
                (p.ref_high != null && p.value_num > p.ref_high)
            ).length;

            trend = {
                first: first,
                last: last,
                delta: +delta.toFixed(3),
                delta_pct: deltaPct != null ? +deltaPct.toFixed(2) : null,
                slope_per_reading: +slope.toFixed(3),
                direction: delta > 0 ? 'increasing' : (delta < 0 ? 'decreasing' : 'stable'),
                min: Math.min(...points.filter(p => p.value_num != null).map(p => p.value_num)),
                max: Math.max(...points.filter(p => p.value_num != null).map(p => p.value_num)),
                abnormal_count: abnormal,
                critical_count: points.filter(p => p.is_critical).length
            };
        }
    }

    return {
        test_name: testName,
        count: points.length,
        is_numeric: isNumeric,
        points: points,
        trend: trend,
        latest: points[points.length - 1] || null
    };
}

/**
 * Get all abnormal results for a patient in the last N days.
 */
async function getAbnormalSummary(tenantId, patientId, days = 90) {
    const result = await db.query(`
        SELECT id, test_name, value, unit, ref_low, ref_high, abnormal_flag, reported_at, is_critical
        FROM lab_results
        WHERE tenant_id = $1 AND patient_id = $2
          AND reported_at >= NOW() - ($3 || ' days')::interval
          AND (
            (ref_low IS NOT NULL AND value::numeric < ref_low) OR
            (ref_high IS NOT NULL AND value::numeric > ref_high) OR
            is_critical = 1 OR
            abnormal_flag IN ('L', 'H', 'LL', 'HH', 'A')
          )
        ORDER BY reported_at DESC
        LIMIT 100
    `, [tenantId, patientId, days]);
    return {
        days: days,
        count: result.rows.length,
        critical: result.rows.filter(r => r.is_critical === 1),
        flagged: result.rows
    };
}

/**
 * Get all unique test names for a patient (for trend discovery).
 */
async function listPatientTests(tenantId, patientId) {
    const result = await db.query(`
        SELECT test_name, COUNT(*) as cnt, MAX(reported_at) as latest
        FROM lab_results
        WHERE tenant_id = $1 AND patient_id = $2
        GROUP BY test_name
        ORDER BY latest DESC
    `, [tenantId, patientId]);
    return result.rows;
}

/**
 * Pure-SVG line chart for a single test trend.
 */
function renderTrendSvg(testName, points, refLow, refHigh, unit) {
    const W = 720, H = 280;
    const padL = 50, padR = 20, padT = 30, padB = 50;
    const innerW = W - padL - padR, innerH = H - padT - padB;
    const nums = points.filter(p => p.value_num != null).map(p => p.value_num);
    if (nums.length === 0) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="white"/><text x="${W/2}" y="${H/2}" text-anchor="middle" font-size="14" fill="#94a3b8">No data for ${testName}</text></svg>`;
    }
    let min = Math.min(...nums);
    let max = Math.max(...nums);
    if (refLow != null) min = Math.min(min, refLow);
    if (refHigh != null) max = Math.max(max, refHigh);
    const pad = (max - min) * 0.1 || 1;
    min -= pad; max += pad;

    function x(i) { return padL + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW); }
    function y(v) { return padT + (1 - (v - min) / (max - min || 1)) * innerH; }

    const path = points
        .map((p, i) => p.value_num != null ? `${i === 0 || points[i-1].value_num == null ? 'M' : 'L'} ${x(i).toFixed(1)},${y(p.value_num).toFixed(1)}` : null)
        .filter(Boolean)
        .join(' ');

    const dots = points
        .map((p, i) => p.value_num != null ? `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value_num).toFixed(1)}" r="4" fill="${p.is_critical ? '#dc2626' : (p.abnormal_flag && p.abnormal_flag !== 'N' ? '#f59e0b' : '#10b981')}" stroke="white" stroke-width="1.5"/>` : '')
        .join('');

    const refLines = [];
    if (refLow != null && refLow >= min && refLow <= max) {
        refLines.push(`<line x1="${padL}" y1="${y(refLow).toFixed(1)}" x2="${W - padR}" y2="${y(refLow).toFixed(1)}" stroke="#94a3b8" stroke-dasharray="4,3" stroke-width="1"/><text x="${W - padR - 5}" y="${(y(refLow) - 4).toFixed(1)}" font-size="10" fill="#64748b" text-anchor="end">Low ${refLow}</text>`);
    }
    if (refHigh != null && refHigh >= min && refHigh <= max) {
        refLines.push(`<line x1="${padL}" y1="${y(refHigh).toFixed(1)}" x2="${W - padR}" y2="${y(refHigh).toFixed(1)}" stroke="#94a3b8" stroke-dasharray="4,3" stroke-width="1"/><text x="${W - padR - 5}" y="${(y(refHigh) - 4).toFixed(1)}" font-size="10" fill="#64748b" text-anchor="end">High ${refHigh}</text>`);
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
        <rect width="${W}" height="${H}" fill="white"/>
        ${refLines.join('')}
        <text x="${padL}" y="20" font-size="13" font-weight="600" fill="#0f766e">${testName} Trend${unit ? ' (' + unit + ')' : ''} · ${points.length} reading${points.length === 1 ? '' : 's'}</text>
        <path d="${path}" fill="none" stroke="#0f766e" stroke-width="2"/>
        ${dots}
    </svg>`;
}

module.exports = {
    getTestTrend,
    getAbnormalSummary,
    listPatientTests,
    renderTrendSvg,
    NUMERIC_TESTS
};