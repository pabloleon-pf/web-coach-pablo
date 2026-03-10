const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');

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

async function checkData() {
    const email = 'ddelpozob@gmail.com';

    console.log(`Buscando atleta: ${email}`);
    const docRef = doc(db, 'athletes', email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log('Datos del atleta:', docSnap.data());
    } else {
        console.log('El atleta no existe.');
    }

    console.log('\n--- Buscando evaluaciones ---');
    const evalSnapshot = await getDocs(collection(db, 'athletes', email, 'evaluaciones'));

    if (evalSnapshot.empty) {
        console.log('No tiene evaluaciones cargadas.');
    } else {
        console.log(`Encontradas ${evalSnapshot.size} evaluaciones:`);
        evalSnapshot.forEach(d => {
            console.log(d.id, d.data());
        });
    }

    console.log('\n--- Buscando sRPE (monitoreo_diario) ---');
    const srpeSnapshot = await getDocs(collection(db, 'athletes', email, 'monitoreo_diario'));

    if (srpeSnapshot.empty) {
        console.log('No tiene registros de monitoreo diario (sRPE).');
    } else {
        console.log(`Encontrados ${srpeSnapshot.size} registros de sRPE:`);
        srpeSnapshot.forEach(d => {
            console.log(d.id, d.data());
        });
    }

    process.exit(0);
}

checkData().catch(console.error);
