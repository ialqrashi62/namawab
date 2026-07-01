/**
 * sanitize_local_staging_data.js
 * ============================================================================
 * Safe Local Staging Sanitizer for Jumanasoft
 * strictly guarded against production touch.
 * ============================================================================
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log('== Jumanasoft Local Staging Data Sanitizer ==');

// 1. Check NODE_ENV
if (process.env.NODE_ENV !== 'staging') {
    console.error('⛔ ABORT: NODE_ENV must be exactly "staging".');
    process.exit(1);
}

// 2. Load .env.staging
const envPath = path.join(__dirname, '..', '..', 'namaweb', '.env.staging');
if (!fs.existsSync(envPath)) {
    console.error(`⛔ ABORT: .env.staging file not found at: ${envPath}`);
    process.exit(1);
}

dotenv.config({ path: envPath, override: true });

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432');
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// 3. Strict DB Name Check
if (!dbName || dbName === 'nama_medical_web' || dbName.includes('nama_medical')) {
    console.error(`⛔ ABORT: Invalid DB_NAME "${dbName}". Must not connect to production.`);
    process.exit(1);
}

const client = new Client({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword
});

async function runSanitization() {
    const isApply = process.argv.includes('--apply');
    if (!isApply) {
        console.log('Mode: DRY-RUN (No changes will be written to DB)');
    } else {
        console.log('Mode: APPLY (Changes will be written to DB)');
    }

    try {
        await client.connect();

        // 4. Query DB safety details
        const dbCheck = await client.query(`
            SELECT current_database(), current_user,
            COALESCE((SELECT rolsuper FROM pg_roles WHERE rolname=current_user), false) as super,
            COALESCE((SELECT rolbypassrls FROM pg_roles WHERE rolname=current_user), false) as bypass
        `);
        const { current_database, current_user, super: isSuper, bypass: isBypass } = dbCheck.rows[0];

        console.log(`Connected Database: ${current_database}`);
        console.log(`Connected User: ${current_user}`);

        // 5. Database safety verification
        if (current_database !== 'jumanasoft_staging') {
            console.error(`⛔ ABORT: Connected DB is "${current_database}" (expected "jumanasoft_staging")`);
            process.exit(1);
        }
        if (current_database.includes('nama_medical')) {
            console.error('⛔ ABORT: Target database contains forbidden production keywords.');
            process.exit(1);
        }

        let tables_processed = 0;
        let skipped_tables = 0;
        let total_rows_scanned = 0;
        let total_rows_updated = 0;

        // --- Helper for sanitizing table ---
        async function sanitizeTable(tableName, idCol, updateFields, generateValueFn) {
            tables_processed++;
            // Check if table exists
            const tableCheck = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = $1
                )
            `, [tableName]);

            if (!tableCheck.rows[0].exists) {
                console.log(`  Table "${tableName}" not found, skipping.`);
                skipped_tables++;
                return;
            }

            // Fetch IDs of rows
            const rows = await client.query(`SELECT ${idCol} FROM ${tableName} ORDER BY ${idCol}`);
            const rowCount = rows.rows.length;
            total_rows_scanned += rowCount;
            console.log(`Processing table "${tableName}": Found ${rowCount} rows.`);

            if (rowCount === 0) return;

            if (isApply) {
                for (let i = 0; i < rowCount; i++) {
                    const rowId = rows.rows[i][idCol];
                    const updates = [];
                    const params = [rowId];

                    updateFields.forEach((field, index) => {
                        const val = generateValueFn(field, i + 1);
                        updates.push(`${field} = $${index + 2}`);
                        params.push(val);
                    });

                    await client.query(`
                        UPDATE ${tableName} 
                        SET ${updates.join(', ')} 
                        WHERE ${idCol} = $1
                    `, params);
                    total_rows_updated++;
                }
                console.log(`  ✓ Table "${tableName}": Sanitized ${rowCount} rows.`);
            } else {
                console.log(`  [DRY-RUN] Will sanitize ${rowCount} rows in table "${tableName}".`);
            }
        }

        // --- Value Generation logic (deterministic synthetic) ---
        const fakeValue = (field, index) => {
            if (field.includes('name')) {
                if (field.includes('ar')) return `مريض افتراضي رقم ${index}`;
                if (field.includes('en')) return `Synthetic Patient #${index}`;
                return `User #${index}`;
            }
            if (field.includes('phone') || field.includes('mobile')) {
                return `05000000${String(index).padStart(2, '0')}`;
            }
            if (field.includes('national_id') || field.includes('iqama') || field.includes('passport') || field.includes('doc_number')) {
                return `10000000${String(index).padStart(2, '0')}`;
            }
            if (field.includes('notes') || field.includes('clinical_notes') || field.includes('description') || field.includes('report') || field.includes('results')) {
                return `Synthetic clinical text for index #${index}`;
            }
            if (field.includes('diagnosis')) {
                return `Synthetic diagnosis #${index}`;
            }
            if (field.includes('symptoms')) {
                return `Synthetic symptom assessment #${index}`;
            }
            if (field.includes('email')) {
                return `synthetic.user.${index}@example.com`;
            }
            if (field.includes('text')) {
                return `Synthetic text content #${index}`;
            }
            return `Fake #${index}`;
        };

        // 6. Execute Sanitization on listed tables
        await sanitizeTable('patients', 'id', ['name_ar', 'name_en', 'national_id', 'phone', 'notes'], fakeValue);
        await sanitizeTable('appointments', 'id', ['patient_name', 'notes'], fakeValue);
        await sanitizeTable('waiting_queue', 'id', ['patient_name'], fakeValue);
        await sanitizeTable('employees', 'id', ['name', 'name_ar', 'name_en'], fakeValue);
        await sanitizeTable('invoices', 'id', ['patient_name', 'description'], fakeValue);
        await sanitizeTable('medical_records', 'id', ['diagnosis', 'symptoms', 'notes'], fakeValue);
        await sanitizeTable('hr_employees', 'id', ['name_ar', 'name_en', 'national_id', 'phone', 'email'], fakeValue);
        await sanitizeTable('insurance_claims', 'id', ['patient_name'], fakeValue);
        await sanitizeTable('lab_radiology_orders', 'id', ['description', 'results', 'structured_report'], fakeValue);
        await sanitizeTable('pharmacy_prescriptions_queue', 'id', ['prescription_text'], fakeValue);
        await sanitizeTable('pharmacy_suppliers', 'id', ['contact_person', 'phone', 'email', 'address', 'notes'], fakeValue);
        await sanitizeTable('hr_employee_documents', 'id', ['doc_number'], fakeValue);
        await sanitizeTable('hr_leaves', 'id', ['notes'], fakeValue);
        await sanitizeTable('hr_advances', 'id', ['notes'], fakeValue);

        console.log('\n== Sanitization Results Summary ==');
        console.log(`Tables Processed: ${tables_processed}`);
        console.log(`Tables Skipped:   ${skipped_tables}`);
        console.log(`Rows Scanned:     ${total_rows_scanned}`);
        console.log(`Rows Sanitized:   ${total_rows_updated}`);
        
        if (isApply) {
            console.log('✅ Sanitization Apply completed successfully!');
        } else {
            console.log('✅ Sanitization Dry-Run completed successfully! No data was changed.');
        }

    } catch (err) {
        console.error('⛔ ERROR during sanitization:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

runSanitization();
