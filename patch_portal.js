const fs = require('fs');
let html = fs.readFileSync('portal.html', 'utf-8');

// 1. Update getMetric to also return the 'date'
html = html.replace(
    "const getMetric = (category, metric, field = 'current') => {",
    "const getMetric = (category, metric, field = 'current') => {\n                let currentDate = null;"
);
html = html.replace(
    "history.push(e[category][metric][field]);",
    "history.push(e[category][metric][field]);\n                        if (history.length === 1) currentDate = e.date;"
);
html = html.replace(
    "previous: history.length > 1 ? history[1] : null",
    "previous: history.length > 1 ? history[1] : null,\n                    date: currentDate"
);

// 2. Remove the global card dates
html = html.replace(
    /<span className="text-xs text-slate-400">\{latestEval\.date \|\| 'Sin fecha'\}<\/span>/g,
    ""
);

// 3. Add date under each metric name
const metrics = [
    { label: 'CMJ', class: 'font-medium truncate', tag: 'span' },
    { label: 'Abalakov', class: 'font-medium truncate', tag: 'span' },
    { label: 'Salto Horiz.', class: 'font-medium truncate', tag: 'span' },
    { label: 'Drop Jump', class: 'font-medium truncate', tag: 'span' },
    { label: 'Agarre (Grip)', class: 'font-medium', tag: 'span' },
    { label: 'Reps Kimono', class: 'font-medium', tag: 'span' },
    { label: 'Tiempo con gi \\(s\\)', class: 'font-medium', tag: 'span' },
    { label: 'Back Squat', class: 'font-medium', tag: 'span' },
    { label: 'Bench Press', class: 'font-medium', tag: 'span' },
    { label: 'Deadlift', class: 'font-medium', tag: 'span' },
    { label: 'Dominadas Lastradas', class: 'font-medium', tag: 'span' }
];

// Helper to determine the accessor dynamically based on the label, but it's easier to just do regex replacement
html = html.replace(/<span className="(.*?)">CMJ<\/span>/g, '<div className="flex justify-between items-center mb-1"><span className="$1">CMJ</span><span className="text-[9px] text-slate-500">{getMetric(\'power\', \'cmj\').date}</span></div>');
html = html.replace(/<span className="(.*?)">Abalakov<\/span>/g, '<div className="flex justify-between items-center mb-1"><span className="$1">Abalakov</span><span className="text-[9px] text-slate-500">{getMetric(\'power\', \'abalakov\').date}</span></div>');
html = html.replace(/<span className="(.*?)">Salto Horiz.<\/span>/g, '<div className="flex justify-between items-center mb-1"><span className="$1">Salto Horiz.</span><span className="text-[9px] text-slate-500">{getMetric(\'power\', \'broadJump\').date}</span></div>');

// Drop jump is tricky, let's look at its current structure:
// <span className="text-[11px] text-slate-400 font-medium truncate">Drop Jump</span>
html = html.replace(
    /<span className="text-\[11px\] text-slate-400 font-medium truncate">Drop Jump<\/span>/g,
    '<div className="flex items-center gap-2"><span className="text-[11px] text-slate-400 font-medium truncate">Drop Jump</span><span className="text-[9px] text-slate-500">{getMetric(\'power\', \'dropJump\', \'height\').date}</span></div>'
);

html = html.replace(/<span className="(.*?)">Agarre \(Grip\)<\/span>/g, '<div className="flex justify-between items-center mb-1"><span className="$1">Agarre (Grip)</span><span className="text-[9px] text-slate-500">{getMetric(\'grappling\', \'gripStrength\').date}</span></div>');
html = html.replace(/<span className="(.*?)">Reps Kimono<\/span>/g, '<div className="flex justify-between items-center mb-1"><span className="$1">Reps Kimono</span><span className="text-[9px] text-slate-500">{getMetric(\'grappling\', \'kimonoReps\').date}</span></div>');
html = html.replace(/<span className="(.*?)">Tiempo con gi \(s\)<\/span>/g, '<div className="flex justify-between items-center mb-1"><span className="$1">Tiempo con gi (s)</span><span className="text-[9px] text-slate-500">{getMetric(\'grappling\', \'kimonoTime\').date}</span></div>');

// For RM Section
// <span className="text-slate-300 font-medium">Back Squat</span>
html = html.replace(
    /<span className="text-slate-300 font-medium">Back Squat<\/span>/g,
    '<div className="flex flex-col"><span className="text-slate-300 font-medium">Back Squat</span><span className="text-[10px] text-slate-500">{getMetric(\'strength\', \'squat\').date}</span></div>'
);
html = html.replace(
    /<span className="text-slate-300 font-medium">Bench Press<\/span>/g,
    '<div className="flex flex-col"><span className="text-slate-300 font-medium">Bench Press</span><span className="text-[10px] text-slate-500">{getMetric(\'strength\', \'bench\').date}</span></div>'
);
html = html.replace(
    /<span className="text-slate-300 font-medium">Deadlift<\/span>/g,
    '<div className="flex flex-col"><span className="text-slate-300 font-medium">Deadlift</span><span className="text-[10px] text-slate-500">{getMetric(\'strength\', \'deadlift\').date}</span></div>'
);
html = html.replace(
    /<span className="text-slate-300 font-medium">Dominadas Lastradas<\/span>/g,
    '<div className="flex flex-col"><span className="text-slate-300 font-medium">Dominadas Lastradas</span><span className="text-[10px] text-slate-500">{getMetric(\'strength\', \'pullups\', \'weight\').date}</span></div>'
);


fs.writeFileSync('portal.html', html);
console.log("portal.html patched successfully");
