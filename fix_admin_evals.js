const fs = require('fs');
let code = fs.readFileSync('admin.html', 'utf8');

// 1. Fix the date logic in CSV parsing
const oldDateLogic = "const date = getCol(row, ['fecha', 'date']) || new Date().toLocaleDateString('es-ES');";
const newDateLogic = "const date = getCol(row, ['fecha', 'date']); // Remove default to today to prevent accidental current-day entries";

code = code.replace(oldDateLogic, newDateLogic);

// 2. Wrap evaluation logic to only execute if date exists
const oldHasNewData = "let hasNewData = false;";
const newHasNewData = "let hasNewData = false;\n                    if (date) {";

code = code.replace(oldHasNewData, newHasNewData);

const oldCountPlus = "} else {\n                            athleteData.evaluations.push(newEval);\n                        }\n                    }\n\n                    count++;";
const newCountPlus = "} else {\n                            athleteData.evaluations.push(newEval);\n                        }\n                    }\n                    }\n\n                    count++;";

code = code.replace(oldCountPlus, newCountPlus);

// 3. Remove "Historial de Evaluaciones" section from UI
// The section starts around 533 with <div className="grid grid-cols-1 gap-8 mt-8 border-t border-slate-800 pt-8"
// and ends right before {/* FIXED ACTION BAR at the bottom */}
const startIdx = code.indexOf('<div className="grid grid-cols-1 gap-8 mt-8 border-t border-slate-800 pt-8">');
const endIdx = code.indexOf('{/* FIXED ACTION BAR at the bottom */}');

if (startIdx > -1 && endIdx > -1) {
    code = code.substring(0, startIdx) + code.substring(endIdx);
}

fs.writeFileSync('admin.html', code);
console.log('Fixed admin.html');
