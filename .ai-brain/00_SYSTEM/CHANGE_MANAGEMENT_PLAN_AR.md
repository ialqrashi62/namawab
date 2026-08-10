# خطة إدارة التغيير (Change Management) — NamaMedical
**التاريخ:** 2026-08-10 · **الإصدار:** v3.0

---

## 1. نظرة عامة

تحدد هذه الوثيقة كيفية:
- تقييم التغييرات
- اعتماد التغييرات
- نشر التغييرات
- تتبع التغييرات
- التراجع عند الحاجة

**المالك:** Change Advisory Board (CAB)
**الاجتماع:** أسبوعياً (كل ثلاثاء 10am)

---

## 2. أنواع التغييرات

| النوع | الوصف | الموافقة المطلوبة |
|---|---|---|
| **Standard** | منخفض المخاطر، مكرر، له runbook | DevOps Lead |
| **Normal** | متوسط المخاطر | CAB |
| **Emergency** | عالي المخاطر، فوري | CAB + CTO + CEO |
| **Major** | يغيّر العمارة | CAB + CTO + CEO + Board |

---

## 3. CAB (Change Advisory Board)

| العضو | الدور | التصويت |
|---|---|---|
| CTO (Chair) | القائد التقني | ✅ |
| DevOps Lead | البنية التحتية | ✅ |
| DBA | قواعد البيانات | ✅ |
| Security Lead | الأمان | ✅ (veto) |
| Product Owner | المنتج | ✅ |
| QA Lead | الجودة | ✅ |
| On-call engineer | صوت من الميدان | استشاري |

**النصاب:** 5 من 7
**الموافقة:** majority

---

## 4. Change Request (CR)

### الحقول المطلوبة

```yaml
id: CR-2026-0810-001
title: "Migrate user sessions from MemoryStore to Redis"
type: normal
risk: medium
impact: high
description: |
  Currently using MemoryStore fallback. Move to Redis for HA.
  Estimated downtime: 5 minutes during deploy.
rollback_plan: |
  Revert to MemoryStore by setting SESSION_STORE=memory
schedule:
  start: 2026-08-15T02:00:00Z
  end: 2026-08-15T04:00:00Z
impacted_systems:
  - nama-medical-erp
  - redis
test_plan: |
  1. Unit tests pass
  2. Integration tests pass
  3. Manual login test in staging
  4. Smoke test all routes
approver: cto@namasoft.com
emergency_contact: oncall@jumanasoft.com
```

---

## 5. Emergency Change

### تعريف

- Hotfix لـ security vulnerability (CVE)
- Production down incident
- Compliance violation
- Patient safety risk

### العملية

1. **0-15min:** CTO + Security Lead موافقة
2. **15-30min:** Implement + test in staging
3. **30-60min:** Deploy (يمكن خارج النافذة)
4. **60-90min:** Verify + monitor
5. **+24h:** Post-mortem + retroactive CAB approval

### مثال

`CR-2026-0810-EMERGENCY-001`: zero-day في dependency
- Type: emergency
- Skip CAB approval: yes (retroactive within 24h)
- Required sign-off: CTO + Security Lead
- Rollback time: < 5min

---

## 6. النافذة الزمنية

| النافذة | الوقت | المسموح |
|---|---|---|
| Business hours | 8am-5pm | Standard + Normal |
| After hours | 5pm-12am | Standard only |
| Maintenance window | Fri 10pm-Sat 6am | Standard + Normal + Major |
| Emergency | anytime | Emergency only |

**الجمعة 10pm-السبت 6am** هي النافذة الرئيسية للتغييرات الكبرى.

---

## 7. Pre-Deploy Checklist

- [ ] CR approved
- [ ] Tests pass (unit + integration + guard + BDD)
- [ ] Migrations forward + backward tested
- [ ] Rollback plan documented
- [ ] On-call engineer notified
- [ ] Monitoring dashboards ready
- [ ] Rollback tested in staging
- [ ] Feature flag (if applicable) configured
- [ ] Documentation updated
- [ ] Communication sent

---

## 8. Post-Deploy Checklist

- [ ] Health check passes
- [ ] Smoke tests pass
- [ ] Error rate normal
- [ ] Latency normal
- [ ] No alerts in first 30min
- [ ] User-facing feature working
- [ ] Rollback NOT triggered
- [ ] Close CR

---

## 9. Rollback Triggers

| Trigger | Action |
|---|---|
| Error rate > 5% | Auto rollback |
| p99 latency > 5s | Auto rollback |
| Health check fails | Auto rollback |
| Critical bug report | Manual rollback |
| Security incident | Manual rollback |

**Auto rollback time:** < 5 minutes

---

## 10. Communication

### Pre-deploy

- **24h before:** email to all stakeholders
- **1h before:** Slack notification + status page
- **During:** real-time updates in #deploys

### Post-deploy

- **On completion:** Slack + email + status page
- **On incident:** PagerDuty + phone tree
- **Weekly summary:** changelog email

---

## 11. Audit Trail

كل change يجب أن يُسجل في:
- `audit_log` table (hash-chained)
- `.ai-brain/changelog/YYYY-MM-DD_CR-*.md`
- GitHub commit + PR link
- CAB minutes (`.ai-brain/cab/YYYY-MM-DD.md`)

---

## 12. Metrics

| Metric | Target |
|---|---|
| Change success rate | > 95% |
| Mean time to deploy | < 30min |
| Rollback rate | < 5% |
| Emergency changes per month | < 3 |
| CAB approval time | < 24h |

---

## 13. الأدوات

- **Jira:** CR tracking
- **GitHub:** code + PR + Actions
- **Slack:** communication
- **PagerDuty:** emergency
- **Status page:** external comms
- **Grafana:** metrics
