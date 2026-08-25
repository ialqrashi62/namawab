// filepath: namaweb/rbac_rate_limit.js
// Role-based rate limiter. Different limits per role + endpoint category.
// Uses in-memory store (process-local). For multi-instance deploys, swap to Redis.
'use strict';

const rateLimit = require('express-rate-limit');

// Limits per minute by role × endpoint category
const LIMITS = {
    // Heavy/compute endpoints (CDS, SOAP generate, AI summary)
    heavy: {
        doctor: 60,
        nurse: 30,
        admin: 120,
        owner: 240,
        pharmacist: 60,
        radiologist: 60,
        default: 30
    },
    // Standard read endpoints (GET list, search)
    read: {
        doctor: 300,
        nurse: 200,
        admin: 600,
        owner: 1200,
        patient: 60,
        receptionist: 120,
        default: 60
    },
    // Write/mutation endpoints (POST, PUT, DELETE)
    write: {
        doctor: 120,
        nurse: 60,
        admin: 240,
        owner: 600,
        pharmacist: 120,
        radiologist: 60,
        default: 30
    },
    // Money/billing endpoints (strict)
    billing: {
        admin: 60,
        owner: 120,
        doctor: 30,
        finance: 60,
        default: 5
    }
};

// Per-tenant fallback for unauthenticated/anonymous
const ANON_LIMIT = 30;

const inMemoryStore = new Map(); // IP → { count, resetAt }

function categoryRateLimit(category) {
    const limits = LIMITS[category] || LIMITS.read;
    return rateLimit({
        windowMs: 60 * 1000, // 1 minute
        max: (req) => {
            const role = req.session?.user?.role?.toLowerCase() || req.user?.role?.toLowerCase();
            if (!role) return ANON_LIMIT;
            return limits[role] || limits.default;
        },
        keyGenerator: (req) => {
            // Combine tenant + user + IP for accurate limiting
            const tenantId = req.tenantId || 'anon';
            const userId = req.userId || req.session?.user?.id || 'anon';
            const ip = req.ip || req.connection?.remoteAddress;
            return `${tenantId}:${userId}:${role}:${category}:${ip}`;
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            res.status(429).json({
                error: 'rate_limit_exceeded',
                category,
                retry_after_seconds: 60,
                message: 'Too many requests. Please slow down.'
            });
        }
    });
}

// Express middleware factory: tag a route with its category
function rateLimitByCategory(category) {
    return categoryRateLimit(category);
}

module.exports = { rateLimitByCategory, LIMITS };