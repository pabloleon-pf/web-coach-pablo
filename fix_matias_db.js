import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCdgdlZ9DHy6c3joXiWbWqUJJ4cPAwJeMc",
    authDomain: "webcoachleon.firebaseapp.com",
    projectId: "webcoachleon",
    storageBucket: "webcoachleon.firebasestorage.app",
    messagingSenderId: "1010557067374",
    appId: "1:1010557067374:web:d22ec870bc6165e1fd867f"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

const getISOWeek = (dateInput) => {
    let date;
    if (typeof dateInput === 'string') {
        const [year, month, day] = dateInput.split('-').map(Number);
        date = new Date(year, month - 1, day);
    } else {
        date = new Date(dateInput);
    }
    if (isNaN(date.getTime())) return null;
    
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
};

const fixedWeeks = [
    { week: 1, sesiones: 6, volumen: 540, sRPE: 3420 },
    { week: 2, sesiones: 7, volumen: 630, sRPE: 4410 },
    { week: 3, sesiones: 14, volumen: 1260, sRPE: 8550 },
    { week: 4, sesiones: 13, volumen: 1140, sRPE: 5460 },
    { week: 5, sesiones: 12, volumen: 1190, sRPE: 5840 },
    { week: 6, sesiones: 15, volumen: 1290, sRPE: 8670 },
    { week: 7, sesiones: 14, volumen: 1260, sRPE: 6840 },
    { week: 8, sesiones: 11, volumen: 960, sRPE: 4590 },
    { week: 9, sesiones: 11, volumen: 960, sRPE: 6870 },
    { week: 10, sesiones: 6, volumen: 541, sRPE: 2610 }
];

async function fixMatiasData() {
    const email = "matimuller91@gmail.com"; // Matías Muller
    const athleteRef = db.collection("athletes").doc(email);
    const monitoringRef = athleteRef.collection("monitoreo_diario");

    console.log(`Buscando sesiones de Matías (${email})...`);

    // 1. Arreglar sesiones con NaN o Sem NaN
    const snapshot = await monitoringRef.get();
    const batch = db.batch();
    let fixCount = 0;

    snapshot.forEach(doc => {
        const data = doc.data();
        const semanaActual = data.semana_del_ano;
        
        if (semanaActual === "NaN" || isNaN(semanaActual) || semanaActual === "Sem NaN") {
            const fecha = data.fecha_sesion;
            if (fecha) {
                const nuevaSemana = getISOWeek(fecha);
                if (nuevaSemana) {
                    batch.update(doc.ref, { semana_del_ano: nuevaSemana });
                    fixCount++;
                    console.log(`Corrigiendo sesión ${doc.id}: ${fecha} -> Semana ${nuevaSemana}`);
                }
            }
        }
    });

    if (fixCount > 0) {
        await batch.commit();
        console.log(`Se corrigieron ${fixCount} sesiones con semana NaN.`);
    } else {
        console.log("No se encontraron sesiones con semana NaN.");
    }

    // 2. Sobrescribir consolidados históricos (S1-S10)
    console.log("Sobrescribiendo consolidados históricos S1-S10...");
    
    for (const data of fixedWeeks) {
        // Buscamos si ya existe una sesión "resumen" para esa semana o simplemente insertamos una que represente el total
        // Para simplificar y asegurar los valores exactos, insertamos un registro que represente el total de la semana.
        // Primero borramos registros previos de esa semana si son de tipo "resumen" o si queremos empezar de cero para esas semanas.
        
        // Nota: En este sistema, el portal suma los registros individuales. 
        // Para forzar los valores S1-S10 exactos, borraremos los registros existentes de esas semanas 
        // y crearemos un único registro por semana con los valores consolidados.
        
        const existingWeekDocs = await monitoringRef.where("semana_del_ano", "==", data.week).get();
        const deleteBatch = db.batch();
        existingWeekDocs.forEach(d => deleteBatch.delete(d.ref));
        await deleteBatch.commit();

        // Insertar el consolidado
        const rpeMedio = data.sRPE / data.volumen;
        await monitoringRef.add({
            fecha_sesion: `2026-01-${String(data.week).padStart(2, '0')}`, // Fecha ficticia para orden
            semana_del_ano: data.week,
            anio: 2026,
            rpe: parseFloat(rpeMedio.toFixed(2)),
            duracion: data.volumen,
            sesiones: data.sesiones,
            srpe: data.sRPE,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            is_consolidated: true
        });
        console.log(`Semana ${data.week} consolidada: sRPE ${data.sRPE}`);
    }

    console.log("Proceso completado con éxito.");
    process.exit(0);
}

fixMatiasData().catch(err => {
    console.error("Error:", err);
    process.exit(1);
});
