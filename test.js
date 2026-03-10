const fs = require('fs');

const csvText = fs.readFileSync('atletas_importar.csv', 'utf8');

const lines = csvText.split(/\r?\n/).filter(l => l.trim() !== '');
const separator = lines[0].includes(';') ? ';' : ',';
const headers = lines[0].split(separator).map(h => h.trim().toLowerCase().replace(/"/g, ''));

const getCol = (row, potentialNames) => {
    for(let name of potentialNames) {
        const idx = headers.findIndex(h => h.includes(name));
        if(idx !== -1 && row[idx]) return row[idx].trim().replace(/"/g, '');
    }
    return '';
};

const row = lines.find(l => l.includes('Francisca r')).split(separator);

console.log('Row matches:');
console.log('Email:', getCol(row, ['correo', 'email', 'mail']));

const weight = getCol(row, ['peso', 'weight']);
const cmj = getCol(row, ['cmj']);
const abalakov = getCol(row, ['abalakov', 'aba']);
const broadJump = getCol(row, ['salto horizontal']);
const rsi = getCol(row, ['rsi']);

const squat = getCol(row, ['squat', 'sentadilla', 'back squat']);
const bench = getCol(row, ['bench', 'pecho', 'bench press']);
const deadlift = getCol(row, ['deadlift', 'peso muerto']);
const pullups = getCol(row, ['dominadas', 'pull-up (lastre kg)', 'pullup']);

const grip = getCol(row, ['handgrip derecha', 'handgrip']);
const kimono = getCol(row, ['rept con gi', 'kimono']);

console.log({ weight, cmj, abalakov, broadJump, rsi, squat, bench, deadlift, pullups, grip, kimono });

const isValidVal = (val) => val && val.trim() !== '' && val.trim() !== '0' && val.trim() !== '0.0';

console.log('Is valid cmj:', isValidVal(cmj));
console.log('Is valid grip:', isValidVal(grip));
