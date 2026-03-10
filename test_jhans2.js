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

const athletesCache = {};

for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(separator);
    if (row.length < 2) continue;

    const email = getCol(row, ['correo', 'email', 'mail']);
    if (!email) continue;
    const emailKey = email.toLowerCase();
    
    if (emailKey === 'jhansjimenez200@gmail.com') {
        const date = getCol(row, ['fecha', 'date']);
        const rsi = getCol(row, ['rsi']);
        const cmj = getCol(row, ['cmj']);
        
        console.log(`Jhans row ${i}: date=${date}, cmj=${cmj}, rsi=${rsi}`);
        const isValidVal = (val) => val && val.trim() !== '' && val.trim() !== '0' && val.trim() !== '0.0';
        console.log("isValid cmj?", isValidVal(cmj));
        console.log("isValid rsi?", isValidVal(rsi));
    }
}
