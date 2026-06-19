const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({ host: 'localhost', port: 5432, database: 'nama_medical_web', user: 'postgres', password: 'postgres' });

(async () => {
    try {
        console.log("Starting database backup for target tables...");
        const targetTables = ['patients', 'admissions', 'bed_transfers', 'beds', 'wards'];
        const backupData = {};

        for (const table of targetTables) {
            console.log(`Backing up table: ${table}...`);
            const res = await pool.query(`SELECT * FROM ${table}`);
            backupData[table] = res.rows;
            console.log(`Backed up ${res.rows.length} rows from ${table}`);
        }

        const backupDir = path.join(__dirname, 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        const backupFilePath = path.join(backupDir, 'beds_batch3_data_backup.json');
        fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf8');
        console.log(`Backup successfully saved to: ${backupFilePath}`);
        console.log(`Backup size: ${fs.statSync(backupFilePath).size} bytes`);
    } catch (e) {
        console.error("Backup process failed:", e.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
})();
