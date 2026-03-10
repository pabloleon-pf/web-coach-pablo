const fs = require('fs');
let code = fs.readFileSync('portal.html', 'utf8');

const replacement = `
            // Remove duplicates (latest evaluation for a given date overwrites earlier ones for the same date)
            const uniqueEvalsMap = new Map();
            data.evaluations.forEach(e => {
                uniqueEvalsMap.set(e.date, e);
            });
            const evals = Array.from(uniqueEvalsMap.values());
            evals.sort((a, b) => parseDate(a.date) - parseDate(b.date));
`;

code = code.replace(
    /const evals = \[...data\.evaluations\];\s+evals\.sort\(\(a, b\) => parseDate\(a\.date\) - parseDate\(b\.date\)\);/,
    replacement.trim()
);

fs.writeFileSync('portal.html', code);
console.log('Fixed duplications');
