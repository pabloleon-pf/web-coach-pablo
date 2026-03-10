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

// ... copy the logic from admin.html ...
const emptyAthlete = {
    name: '',
    email: '',
    status: 'Activo', // Activo o Inactivo
    profileImg: '', // URL
    summary: {
        bodyWeight: '',
        relativeStrength: '',
        nextGoal: ''
    },
    evaluations: []
};

const emptyEvaluation = {
    date: '', // Format string "DD/MM/YYYY"
    power: {
        dropJump: { height: '', rsi: '' },
        broadJump: { current: '' },
        cmj: { current: '' },
        abalakov: { current: '' }
    },
    strength: {
        squat: { current: '' },
        bench: { current: '' },
        deadlift: { current: '' },
        pullups: { weight: '', reps: '' }
    },
    grappling: {
        gripStrength: { current: '' },
        kimonoReps: { current: '' },
        kimonoTime: { current: '' }
    }
};

const athletesCache = {};

for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(separator);
    if (row.length < 2) continue;

    const email = getCol(row, ['correo', 'email', 'mail']);
    if (!email) continue;
    const emailKey = email.toLowerCase();
    
    if (emailKey !== 'jhansjimenez200@gmail.com') continue;

    let name = getCol(row, ['nombre', 'atleta', 'name']);
    if (!name) name = row[0] ? row[0].trim().replace(/"/g, '') : "Sin nombre";
    
    const status = getCol(row, ['estado', 'status']) || 'Activo';
    const weight = getCol(row, ['peso', 'weight']);
    const date = getCol(row, ['fecha', 'date']);

    const cmj = getCol(row, ['cmj']);
    const abalakov = getCol(row, ['abalakov', 'aba']);
    const broadJump = getCol(row, ['salto horizontal']);
    const rsi = getCol(row, ['rsi', 'drop jump', 'dj']);

    const squat = getCol(row, ['squat', 'sentadilla', 'back squat']);
    const bench = getCol(row, ['bench', 'pecho', 'bench press']);
    const deadlift = getCol(row, ['deadlift', 'peso muerto']);
    const pullups = getCol(row, ['dominadas', 'pull-up (lastre kg)', 'pullup']);

    const grip = getCol(row, ['handgrip derecha', 'handgrip']);
    const kimono = getCol(row, ['rept con gi', 'kimono']);
    const kimonoTime = getCol(row, ['tiempo con gi', 'tiempo']);

    let athleteData;
    if (athletesCache[emailKey]) {
        athleteData = athletesCache[emailKey];
    } else {
        athleteData = { ...JSON.parse(JSON.stringify(emptyAthlete)), email: emailKey, name, status };
        athletesCache[emailKey] = athleteData;
    }

    if (name && !athleteData.name) athleteData.name = name;

    const isValidVal = (val) => val && val.trim() !== '' && val.trim() !== '0' && val.trim() !== '0.0';

    if (isValidVal(weight)) {
        if (!athleteData.summary) athleteData.summary = { ...emptyAthlete.summary };
        athleteData.summary.bodyWeight = weight;
    }

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
            if (!athleteData.evaluations) athleteData.evaluations = [];

            const existingEvalIndex = athleteData.evaluations.findIndex(e => e.date === date);
            if (existingEvalIndex >= 0) {
                const existing = athleteData.evaluations[existingEvalIndex];

                const safeSet = (obj, category, metric, field, val) => {
                    if (!obj[category]) obj[category] = {};
                    if (!obj[category][metric]) obj[category][metric] = {};
                    obj[category][metric][field] = val;
                };

                if (isValidVal(cmj)) safeSet(existing, 'power', 'cmj', 'current', cmj);
                if (isValidVal(abalakov)) safeSet(existing, 'power', 'abalakov', 'current', abalakov);
                if (isValidVal(broadJump)) safeSet(existing, 'power', 'broadJump', 'current', broadJump);
                if (isValidVal(rsi)) safeSet(existing, 'power', 'dropJump', 'rsi', rsi);

                if (isValidVal(squat)) safeSet(existing, 'strength', 'squat', 'current', squat);
                if (isValidVal(bench)) safeSet(existing, 'strength', 'bench', 'current', bench);
                if (isValidVal(deadlift)) safeSet(existing, 'strength', 'deadlift', 'current', deadlift);
                if (isValidVal(pullups)) safeSet(existing, 'strength', 'pullups', 'weight', pullups);

                if (isValidVal(grip)) safeSet(existing, 'grappling', 'gripStrength', 'current', grip);
                if (isValidVal(kimono)) safeSet(existing, 'grappling', 'kimonoReps', 'current', kimono);
                if (isValidVal(kimonoTime)) safeSet(existing, 'grappling', 'kimonoTime', 'current', kimonoTime);

            } else {
                athleteData.evaluations.push(newEval);
            }
        }
    }
}

console.log(JSON.stringify(athletesCache, null, 2));
