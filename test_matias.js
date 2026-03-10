const fs = require('fs');

const csvText = fs.readFileSync('DOC WEB ANTIGRABITY.xlsx - Mediciones.csv', 'utf-8');
const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== '');
const separator = lines[0].includes(';') ? ';' : ',';
const headers = lines[0].split(separator).map(h => h.trim().toLowerCase().replace(/"/g, ''));

const getCol = (row, potentialNames) => {
    for (let name of potentialNames) {
        const idx = headers.findIndex(h => h.includes(name));
        if (idx !== -1 && row[idx]) return row[idx].trim().replace(/"/g, '');
    }
    return '';
};

for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(separator);
    if (row.length < 2) continue;

    const email = getCol(row, ['correo', 'email', 'mail']);
    if (!email) continue;
    const emailKey = email.toLowerCase();
    
    let name = getCol(row, ['nombre', 'name', 'atleta']);
    if (!name && headers[0] === '') name = row[0].trim().replace(/"/g, '');
    
    if (name.toLowerCase().includes('matias') || name.toLowerCase().includes('matías') || emailKey.includes('matias') || emailKey.includes('mati') || emailKey.includes('muller')) {
        console.log(`Row ${i} - Name: ${name}, Email: ${emailKey}`);
    }
}
