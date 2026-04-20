import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBUkCUhNzMGSBc7q23QVOAh0yK0OOl80uM",
  authDomain: "kazino-b83b8.firebaseapp.com",
  databaseURL: "https://kazino-b83b8-default-rtdb.firebaseio.com",
  projectId: "kazino-b83b8",
  storageBucket: "kazino-b83b8.firebasestorage.app",
  messagingSenderId: "46554087265",
  appId: "1:46554087265:web:240e6e2808b62ded448f20",
  measurementId: "G-M6YG9P3PV8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Foydalanuvchi ID (Hozircha statik, tizimga kirish bo'lsa dinamik bo'ladi)
const userId = "user_123"; 
const userRef = ref(db, 'users/' + userId);

let currentBalance = 0;
let isMining = false;

// Balansni realtime yuklab olish
onValue(userRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        currentBalance = data.balance || 0;
        document.getElementById('balance').innerText = currentBalance.toLocaleString();
    } else {
        // Agar foydalanuvchi bazada bo'lmasa, yangi ochish
        set(userRef, { balance: 0 });
    }
});

const startBtn = document.getElementById('startBtn');
const consoleOutput = document.getElementById('console-output');

startBtn.onclick = () => {
    if (isMining) return;
    isMining = true;
    startBtn.innerText = "MINING...";
    startBtn.style.opacity = "0.5";
    
    miningProcess();
};

function miningProcess() {
    setInterval(() => {
        if (!isMining) return;

        // Tasodifiy hash yaratish
        const hash = Math.random().toString(36).substring(2, 15).toUpperCase();
        const code = "DEXO_" + Math.floor(Math.random() * 9999);
        
        // Konsolga chiqarish
        const p = document.createElement('div');
        p.innerHTML = `> Hash: ${hash} | <span style="color:white">${code}</span> | +5 SO'M`;
        consoleOutput.appendChild(p);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;

        // Balansni yangilash (Har bir intervalda 5 so'm qo'shiladi)
        currentBalance += 5;
        update(userRef, { balance: currentBalance });

    }, 2000); // Har 2 soniyada mayning qiladi
}
