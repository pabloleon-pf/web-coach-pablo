const fs = require('fs');
let code = fs.readFileSync('portal.html', 'utf8');

const replacements = [
    { oldPath: 'power?.cmj?.current', args: "'power', 'cmj'" },
    { oldPath: 'power?.abalakov?.current', args: "'power', 'abalakov'" },
    { oldPath: 'power?.broadJump?.current', args: "'power', 'broadJump'" },
    { oldPath: 'power?.dropJump?.rsi', args: "'power', 'dropJump', 'rsi'" },
    { oldPath: 'power?.dropJump?.height', args: "'power', 'dropJump', 'height'" },
    { oldPath: 'grappling?.gripStrength?.current', args: "'grappling', 'gripStrength'" },
    { oldPath: 'grappling?.kimonoReps?.current', args: "'grappling', 'kimonoReps'" },
    { oldPath: 'grappling?.kimonoTime?.current', args: "'grappling', 'kimonoTime'" },
    { oldPath: 'strength?.squat?.current', args: "'strength', 'squat'" },
    { oldPath: 'strength?.bench?.current', args: "'strength', 'bench'" },
    { oldPath: 'strength?.deadlift?.current', args: "'strength', 'deadlift'" },
    { oldPath: 'strength?.pullups?.reps', args: "'strength', 'pullups', 'reps'" },
    { oldPath: 'strength?.pullups?.weight', args: "'strength', 'pullups', 'weight'" }
];

replacements.forEach(({ oldPath, args }) => {
    const escapedOldPath = oldPath.replace(/\?/g, '\\?').replace(/\./g, '\\.');
    const previousRegex = new RegExp(`previous=\\{prevEval\\?\\.${escapedOldPath}\\}`, 'g');
    code = code.replace(previousRegex, `previous={getMetric(${args}).previous}`);
});

fs.writeFileSync('portal.html', code);
console.log('Fixed previous references');
