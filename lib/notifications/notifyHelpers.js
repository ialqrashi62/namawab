// Extracted from server.js (behavior-preserving). Deps injected via factory.
module.exports = function makeNotifyHelpers({ pool, smsService, emailService }) {
    async function sendLabResultNotification(orderId, sampleId, tenantId) {
        try {
            let patientId = null;
            let phone = null;
            let orderRef = orderId;

            if (sampleId) {
                const sampleRow = (await pool.query('SELECT patient_id FROM lab_samples WHERE id = $1', [sampleId])).rows[0];
                if (sampleRow) patientId = sampleRow.patient_id;
            }
            if (!patientId && orderId) {
                const orderRow = (await pool.query('SELECT patient_id FROM lab_radiology_orders WHERE id = $1', [orderId])).rows[0];
                if (orderRow) patientId = orderRow.patient_id;
            }

            if (patientId) {
                const patientRow = (await pool.query('SELECT phone FROM patients WHERE id = $1', [patientId])).rows[0];
                if (patientRow && patientRow.phone) {
                    phone = patientRow.phone;
                }
            }

            if (phone) {
                const smsText = `عزيزي المريض، نتائج تحاليلك الطبية جاهزة الآن. يمكنك الاطلاع عليها عبر بوابة المرضى. مجمع نما الطبي.\nDear Patient, your lab results are now ready. You can view them on the Patient Portal. Nama Medical.`;
                const sent = await smsService.sendSMS(phone, smsText, 'LAB_RESULT_READY');
                if (sent && orderRef) {
                    await pool.query('UPDATE lab_radiology_orders SET sms_sent = 1 WHERE id = $1', [orderRef]);
                }
            }

            // Send email to patient
            if (patientId && tenantId) {
                const emailSubject = `نتائج التحاليل الطبية جاهزة - مجمع نما الطبي | Lab Results Ready`;
                const emailHtml = `
                    <div style="direction: rtl; text-align: right; font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #006970;">عزيزي المريض، نتائج تحاليلك الطبية جاهزة الآن.</h2>
                        <p>يمكنك الاطلاع عليها وتحميلها في أي وقت عبر تسجيل الدخول إلى بوابة المرضى الخاصة بك.</p>
                        <p>شكراً لاختياركم مجمع نما الطبي.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <div style="direction: ltr; text-align: left;">
                            <h2 style="color: #006970;">Dear Patient, your lab results are now ready.</h2>
                            <p>You can view and download them at any time by logging into your Patient Portal.</p>
                            <p>Thank you for choosing Nama Medical.</p>
                        </div>
                    </div>
                `;
                sendPatientEmail(patientId, emailSubject, emailHtml, tenantId);
            }
        } catch (err) {
            console.error('[SMS ERROR] Failed to send lab result notification:', err.message);
        }
    }

    async function sendDoctorSMS(doctorId, text, eventType) {
        try {
            if (!doctorId) return;
            const userRow = (await pool.query('SELECT display_name FROM system_users WHERE id = $1', [doctorId])).rows[0];
            if (!userRow) return;
            const name = userRow.display_name;
            const empRow = (await pool.query('SELECT phone FROM hr_employees WHERE phone IS NOT NULL AND (name_en = $1 OR name_ar = $1 OR name_en LIKE $2 OR name_ar LIKE $2) LIMIT 1', [name, `%${name}%`])).rows[0];
            if (empRow && empRow.phone) {
                await smsService.sendSMS(empRow.phone, text, eventType);
            }
        } catch (e) {
            console.error('[SMS ERROR] Failed to send SMS to doctor:', e.message);
        }
    }

    async function sendRadiologyResultNotification(orderId, patientId, tenantId) {
        try {
            if (!patientId) return;
            const patientRow = (await pool.query('SELECT phone FROM patients WHERE id = $1', [patientId])).rows[0];
            if (patientRow && patientRow.phone) {
                const smsText = `عزيزي المريض، نتائج أشعتك الطبية جاهزة الآن. يمكنك الاطلاع عليها عبر بوابة المرضى. مجمع نما الطبي.\nDear Patient, your radiology results are now ready. You can view them on the Patient Portal. Nama Medical.`;
                const sent = await smsService.sendSMS(patientRow.phone, smsText, 'RAD_REPORT_READY');
                if (sent && orderId) {
                    await pool.query('UPDATE lab_radiology_orders SET sms_sent = 1 WHERE id = $1', [orderId]);
                }
            }

            // Send email to patient
            if (patientId && tenantId) {
                const emailSubject = `نتائج تقرير الأشعة جاهزة - مجمع نما الطبي | Radiology Report Ready`;
                const emailHtml = `
                    <div style="direction: rtl; text-align: right; font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                        <h2 style="color: #006970;">عزيزي المريض، تقرير أشعتك الطبية جاهز الآن.</h2>
                        <p>يمكنك الاطلاع على التقرير والصور وتحميلها في أي وقت عبر تسجيل الدخول إلى بوابة المرضى الخاصة بك.</p>
                        <p>شكراً لاختياركم مجمع نما الطبي.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <div style="direction: ltr; text-align: left;">
                            <h2 style="color: #006970;">Dear Patient, your radiology report is now ready.</h2>
                            <p>You can view and download the report and images at any time by logging into your Patient Portal.</p>
                            <p>Thank you for choosing Nama Medical.</p>
                        </div>
                    </div>
                `;
                sendPatientEmail(patientId, emailSubject, emailHtml, tenantId);
            }
        } catch (err) {
            console.error('[SMS ERROR] Failed to send radiology result notification:', err.message);
        }
    }

    async function sendPatientEmail(patientId, subject, html, tenantId) {
        try {
            if (!patientId || !tenantId) return;
            const pUser = (await pool.query('SELECT email FROM portal_users WHERE patient_id=$1 AND tenant_id=$2 AND is_active=1', [patientId, tenantId])).rows[0];
            if (pUser && pUser.email) {
                await emailService.sendEmail(pUser.email, subject, html);
            }
        } catch (err) {
            console.error('[EMAIL ERROR] Failed to send patient email:', err.message);
        }
    }

    async function sendDoctorEmail(doctorId, subject, html) {
        try {
            if (!doctorId) return;
            const userRow = (await pool.query('SELECT display_name FROM system_users WHERE id = $1', [doctorId])).rows[0];
            if (!userRow) return;
            const name = userRow.display_name;
            const empRow = (await pool.query('SELECT email FROM hr_employees WHERE email IS NOT NULL AND (name_en = $1 OR name_ar = $1 OR name_en LIKE $2 OR name_ar LIKE $2) LIMIT 1', [name, `%${name}%`])).rows[0];
            if (empRow && empRow.email) {
                await emailService.sendEmail(empRow.email, subject, html);
            }
        } catch (err) {
            console.error('[EMAIL ERROR] Failed to send doctor email:', err.message);
        }
    }

    return { sendLabResultNotification, sendDoctorSMS, sendRadiologyResultNotification, sendPatientEmail, sendDoctorEmail };
};
