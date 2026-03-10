import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, addDoc, serverTimestamp } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyCdgdlZ9DHy6c3joXiWbWqUJJ4cPAwJeMc",
    authDomain: "webcoachleon.firebaseapp.com",
    projectId: "webcoachleon",
    storageBucket: "webcoachleon.firebasestorage.app",
    messagingSenderId: "1010557067374",
    appId: "1:1010557067374:web:d22ec870bc6165e1fd867f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const weeks_data = [
    {week: 1, sRPE_Total: 3420, RPE_Promedio: 2.71},
    {week: 2, sRPE_Total: 4410, RPE_Promedio: 3.71},
    {week: 3, sRPE_Total: 8550, RPE_Promedio: 6.00},
    {week: 4, sRPE_Total: 5460, RPE_Promedio: 5.17},
    {week: 5, sRPE_Total: 5840, RPE_Promedio: 4.33},
    {week: 6, sRPE_Total: 8670, RPE_Promedio: 5.60},
    {week: 7, sRPE_Total: 6840, RPE_Promedio: 5.40},
    {week: 8, sRPE_Total: 4590, RPE_Promedio: 2.71},
    {week: 9, sRPE_Total: 6870, RPE_Promedio: 4.71},
    {week: 10, sRPE_Total: 2610, RPE_Promedio: 2.71}
];

// Helper to calculate theoretical date based on week number 
// We will assign days of 2026 based on their ISO week so they sort correctly
function getDateForWeek(year, week) {
    const d = new Date(Date.UTC(year, 0, 1));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + (week - 1) * 7 + (4 - dayNum)); // Add week offset
    return d.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

async function run() {
    try {
        console.log("Fetching athletes collection to find Matías Muller...");
        const athletesSnapshot = await getDocs(collection(db, "athletes"));
        let matiasEmail = null;
        athletesSnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.name && data.name.toLowerCase().includes("mati")) {
                matiasEmail = doc.id;
                console.log(`Found Matías Muller: name: ${data.name}, ID: ${doc.id}`);
            } else if (doc.id.toLowerCase().includes("matimuller")) {
                matiasEmail = doc.id;
                console.log(`Fallback found Matías Muller by ID: ${doc.id}`);
            }
        });

        if (!matiasEmail) {
            console.error("Could not find Matías Muller in the athletes collection.");
            return;
        }

        console.log(`Selected Athlete ID: ${matiasEmail}`);
        
        for (const data of weeks_data) {
            console.log(`Adding week ${data.week}...`);
            const sessionDate = getDateForWeek(2026, data.week);
            
            // To make average work and total SRPE match without creating false counts, 
            // since we modified `parseFloat` on the frontend, inserting ONE record per week works perfectly!
            // Wait: the chart uses `count` = number of records. If count = 1, `sumRpe / 1` = `rpe`.
            // So avgRpe = d.sumRpe / d.count => exactly Promedio!
            
            const docData = {
                fecha_sesion: sessionDate,
                rpe: data.RPE_Promedio,
                duracion: Math.round(data.sRPE_Total / data.RPE_Promedio), // dummy but mathematically correct
                srpe: data.sRPE_Total,
                semana_del_ano: data.week,
                anio: 2026,
                timestamp: serverTimestamp()
            };

            await addDoc(collection(db, "athletes", matiasEmail, "monitoreo_diario"), docData);
        }
        
        console.log("Successfully added all 10 weeks of sRPE data!");
    } catch (e) {
        console.error("Error occurred:", e);
    }
}

run();
