# تقرير تصميم الرقعة البرمجية الآمنة لـ PHASE_2A - ميثاق الهندسة المؤسسية

- **FINAL_STATUS**: PASS ✅
- **Phase 2A Safe Patch Design**: تم إعداد تصميم رقعة برمجية آمنة (Candidate Patch) خالية من تعديلات DDL وجاهزة للمراجعة.

---

## 1. تفاصيل الملفات المعدلة والنطاق (Target Files & Scope)

- **الملفات المستهدفة بالتحديث:**
  1. [namaweb/server.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/server.js) (إضافة أحداث التدقيق لنقاط النهاية والوسيط requireRole).
  2. [namaweb/rbac.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/rbac.js) (إضافة أحداث التدقيق لمحاولات رفض الأذونات المرفوضة DB).
  3. [namaweb/clinical_cpoe.js](file:///c:/Users/ice/Desktop/NamaMedical/namaweb/clinical_cpoe.js) (إضافة أحداث تدقيق لمحاولات تعديل SOAP المقفلة).
- **الاعتماد على قاعدة البيانات (DDL dependency):** **NO** (لا تحتاج الرقعة لأي تعديل في جداول قاعدة البيانات أو تشغيل سكربتات ترقية المخطط).

---

## 2. تفاصيل تصميم الرقعة البرمجية المقترحة (Proposed Candidate Diffs)

### 2.1 إضافة تدقيق إنشاء وحذف الموظفين (User Create & Delete Audit)

```diff
-- server.js (POST /api/settings/users)
         const hash = await bcrypt.hash(password, 10);
         const result = await pool.query('INSERT INTO system_users (username, password_hash, display_name, role, speciality, permissions, commission_type, commission_value) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
             [username, hash, display_name || '', role || 'Reception', speciality || '', permissions || '', commission_type || 'percentage', parseFloat(commission_value) || 0]);
+        logAudit(req.session.user.id, req.session.user.display_name, 'CREATE_USER', 'Settings', `Admin created user ${username} (role=${role})`, req.ip);
         res.json((await pool.query('SELECT id, username, display_name, role, speciality, permissions, commission_type, commission_value, is_active, created_at FROM system_users WHERE id=$1', [result.rows[0].id])).rows[0]);

-- server.js (DELETE /api/settings/users/:id)
         }
         await pool.query('DELETE FROM system_users WHERE id=$1', [userId]);
+        logAudit(req.session.user.id, req.session.user.display_name, 'DELETE_USER', 'Settings', `Admin deleted user #${userId}`, req.ip);
         res.json({ success: true });
```

### 2.2 إضافة تدقيق استعلامات سجل التدقيق ومحاولات الرفض (Audit Read & Blocked Auth)

```diff
-- server.js (GET /api/audit-trail)
         const q = tenantId
             ? 'SELECT * FROM audit_trail WHERE tenant_id=$1 ORDER BY created_at DESC LIMIT $2'
             : 'SELECT * FROM audit_trail ORDER BY created_at DESC LIMIT $1';
         const params = tenantId ? [tenantId, lim] : [lim];
+        logAudit(req.session.user.id, req.session.user.display_name, 'READ_AUDIT_LOGS', 'Settings', `Admin read audit logs (limit=${lim})`, req.ip);
         res.json((await pool.query(q, params)).rows);

-- server.js (requireRole Middleware)
 function requireRole(...modules) {
     return (req, res, next) => {
-        if (!req.session || !req.session.user) return res.status(401).json({ error: 'Unauthorized' });
+        if (!req.session || !req.session.user) {
+            const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
+            logAudit(null, 'Anonymous', 'BLOCKED_AUTHORIZATION', 'Auth', `Unauthenticated access to route requiring modules [${modules.join(', ')}]`, clientIp);
+            return res.status(401).json({ error: 'Unauthorized' });
+        }
         const role = req.session.user.role;
         const perms = ROLE_PERMISSIONS[role];
         if (perms === '*') return next(); // Admin
         if (perms && modules.some(m => perms.includes(m))) return next();
+        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
+        logAudit(req.session.user.id, req.session.user.display_name, 'BLOCKED_AUTHORIZATION', 'Auth', `Blocked role ${role} from route requiring modules [${modules.join(', ')}]`, clientIp);
         res.status(403).json({ error: 'Access denied' });
     };
 }
```

### 2.3 إضافة تدقيق محاولات تعديل السجلات المقفلة (Blocked SOAP Edit Attempt)

```diff
-- clinical_cpoe.js (PATCH /api/clinical-notes/:id)
             if (!cur) return res.status(404).json({ error: 'Note not found' });
             if (cur.emr_status === 'locked') {
+                audit(req.session?.user?.id, req.session?.user?.display_name, 'BLOCKED_SOAP_EDIT', 'Doctor', `Attempted to edit locked SOAP note #${id}`, req.ip);
                 return res.status(409).json({ error: 'Note is locked and cannot be edited directly', error_ar: 'الملاحظة مقفلة ولا يمكن تعديلها مباشرة' });
             }
```

---

## 3. خطة اختبار الفحوصات والتحقق (Test Plan)

- **نوع الاختبار:** اختبارات وحدة ساكنة واستجابة مع محاكاة الطلبات (Harness Tests).
- **ملف الاختبار المستهدف:** إنشاء `access_control_audit_hardening_test.js` للتحقق التلقائي من كتابة سجلات التدقيق عند إجراء العمليات المذكورة وتأكيد عمل الأحداث الأمنية بكفاءتها الكاملة.
