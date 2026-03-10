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

const emptyAthlete = {
    name: '', email: '', profileImg: '', status: 'Activo',
    summary: { bodyWeight: '', relativeStrength: '', nextGoal: '' }, evaluations: []
};

const emptyEvaluation = { date: '', power: { cmj: { current: '', past: '' }, abalakov: { current: '', past: '' }, broadJump: { current: '', past: '' }, dropJump: { rsi: '', height: '' } }, strength: { squat: { current: '', past: '' }, bench: { current: '', past: '' }, deadlift: { current: '', past: '' }, pullups: { weight: '', reps: '' } }, grappling: { gripStrength: { current: '', past: '' }, kimonoReps: { current: '', past: '' }, kimonoTime: { current: '', past: '' } } };

const athletesCache = {};

for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(separator);
    if (row.length < 2) continue;

    const email = getCol(row, ['correo', 'email', 'mail']);
    if (!email) continue;
    const emailKey = email.toLowerCase();
    
    let name = getCol(row, ['nombre', 'name', 'atleta']);
    if (!name && headers[0] === '') name = row[0].trim().replace(/"/g, '');
    
    const status = getCol(row, ['estado', 'status']) || 'Activo';
    const weight = getCol(row, ['peso', 'weight']);
    const date = getCol(row, ['fecha', 'date']);

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
    const kimonoTime = getCol(row, ['tiempo con gi', 'tiempo']);

    let athleteData = athletesCache[emailKey] || { ...emptyAthlete, email: emailKey, name, status };
    if (!athleteData.evaluations) athleteData.evaluations = [];
    athletesCache[emailKey] = athleteData;
    
    const isValidVal = (val) => val && val.trim() !== '' && val.trim() !== '0' && val.trim() !== '0.0';

    const newEval = JSON.parse(JSON.stringify(emptyEvaluation));
    newEval.date = date;

    let hasNewData = false;
    if (date) {
        if (isValidVal(cmj)) { newEval.power.cmj.current = cmj; hasNewData = true; }
        if (isValidVal(abalakov)) { newEval.power.abalakov.current = abalakov; hasNewData = true; }
        if (isValidVal(broadJump)) { newEval.power.broadJump.current = broadJump; hasNewData = true; }
        if (isValidVal(rsi)) { newEval.power.dropJump.rsi = rsi; hasNewData = true; }
        if (isValidVal(squat)) { newEval.strength.squat.current = squat; hasNewData = true; }
        if (isValidVal(bench)) { newEval.strength.bench.current = bench; hasNewData = true; }
        if (isValidVal(deadlift)) { newEval.strength.deadlift.current = deadlift; hasNewData = true; }
        if (isValidVal(pullups)) { newEval.strength.pullups.weight = pullups; hasNewData = true; }
        if (isValidVal(grip)) { newEval.grappling.gripStrength.current = grip; hasNewData = true; }
        if (isValidVal(kimono)) { newEval.grappling.kimonoReps.current = kimono; hasNewData = true; }
        if (isValidVal(kimonoTime)) { newEval.grappling.kimonoTime = { current: kimonoTime }; hasNewData = true; }

        if (hasNewData) {
            const existingEvalIndex = athleteData.evaluations.findIndex(e => e.date === date);
            if (existingEvalIndex >= 0) {
            } else {
                athleteData.evaluations.push(newEval);
            }
        }
    }
}
console.log(JSON.stringify(athletesCache['lukasleivalukas123456789@gmail.com'].evaluations.length));
console.log(JSON.stringify(athletesCache['francisca.retes97@gmail.com'].evaluations.length));
