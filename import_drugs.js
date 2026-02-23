const fs = require('fs');
const { getDb } = require('./database.js');

try {
    const db = getDb();

    // Read drugs_export.txt - try UTF-16LE first (common SQL Server export format)
    let lines;
    try {
        const rawData = fs.readFileSync('./drugs_export.txt', 'utf16le');
        lines = rawData.split(/\r?\n/);
        if (lines.length < 100) throw new Error('Too few lines for UTF-16LE');
    } catch (e) {
        const rawData = fs.readFileSync('E:\\NamaMedical\\drugs_export.txt', 'utf8');
        lines = rawData.split(/\r?\n/);
    }

    console.log(`Parsed ${lines.length} lines from drugs_export.txt`);

    const stmtCat = db.prepare('INSERT INTO pharmacy_drug_catalog (drug_name, active_ingredient, category, selling_price, cost_price, stock_qty) VALUES (?, ?, ?, ?, ?, ?)');
    const checkCat = db.prepare('SELECT id FROM pharmacy_drug_catalog WHERE drug_name = ?');

    let inserted = 0;
    let skipped = 0;

    db.transaction(() => {
        for (const line of lines) {
            const parts = line.split('\t');
            if (parts.length < 4) continue;

            const fullName = parts[1] ? parts[1].replace(/\x00/g, '').trim() : '';
            if (!fullName || !isNaN(fullName) || fullName.length < 3) continue;

            let name = fullName;
            let active = 'Various';

            if (fullName.includes('(')) {
                let chunks = fullName.split('(');
                name = chunks[0].trim();
                active = chunks[chunks.length - 1].replace(')', '').trim();
            }
            if (name.length < 3) continue;

            const cat = parts[3] ? parts[3].replace(/\x00/g, '').trim() : 'General Medication';

            // Handle prices
            const p1 = parseFloat(parts[parts.length - 1]);
            const p2 = parseFloat(parts[parts.length - 2]);
            const price = (!isNaN(p1) ? p1 : (!isNaN(p2) ? p2 : 15.0));
            const cost = parseFloat((price * 0.7).toFixed(2));
            const stock = Math.floor(Math.random() * 50) + 10;

            try {
                if (!checkCat.get(name)) {
                    stmtCat.run(name, active, cat, price, cost, stock);
                    inserted++;
                } else {
                    skipped++;
                }
            } catch (e) {
                // Ignore unique constraint errors
            }
        }
    })();

    const totalDrugs = db.prepare('SELECT COUNT(*) as cnt FROM pharmacy_drug_catalog').get().cnt;
    console.log(`✅ Inserted ${inserted} drugs (${skipped} skipped as duplicates)`);
    console.log(`📦 Total drugs in catalog: ${totalDrugs}`);

} catch (error) {
    console.error("Error:", error.message);
}
