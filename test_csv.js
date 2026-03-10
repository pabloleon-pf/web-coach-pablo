const fs = require('fs');

const csvText = fs.readFileSync('DOC WEB ANTIGRABITY.xlsx - Mediciones.csv', 'utf-8');

const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== '');
const separator = lines[0].includes(';') ? ';' : ',';
const headers = lines[0].split(separator).map(h => h.trim().toLowerCase().replace(/"/g, ''));

console.log("Headers:", headers);

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
    
    if (emailKey === 'lukasleivalukas123456789@gmail.com') {
        const bench = getCol(row, ['bench', 'pecho', 'bench press']);
        const pullups = getCol(row, ['dominadas', 'pull-up (lastre kg)', 'pullup']);
        const grip = getCol(row, ['handgrip derecha', 'handgrip']);
        const kimonoTime = getCol(row, ['tiempo con gi', 'tiempo']);
        
        console.log(`Lukas row ${i}: bench=${bench}, pullups=${pullups}, grip=${grip}, kimonoTime=${kimonoTime}`);
        
        const isValidVal = (val) => val && val.trim() !== '' && val.trim() !== '0' && val.trim() !== '0.0';
        console.log("isValidVal(bench)?", isValidVal(bench));
        console.log("isValidVal(grip)?", isValidVal(grip));
    }
}
