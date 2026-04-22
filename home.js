const tg = window.Telegram.WebApp;
const AdController = window.Adsgram.init({ blockId: "int-28209" });

tg.expand(); // Mini appni to'liq ekranga yoyish

const balanceEl = document.getElementById('balance');
const startBtn = document.getElementById('startBtn');
const consoleOutput = document.getElementById('console-output');

let currentBalance = 0.00;
let isMining = false;
let sessionEarned = 0.00;

// Telegram xotirasidan balansni yuklash
tg.CloudStorage.getItem('user_balance', (err, value) => {
    if (!err && value) {
        currentBalance = parseFloat(value);
        balanceEl.innerText = currentBalance.toFixed(2);
    } else {
        currentBalance = 0.00;
        saveBalance(0.00);
    }
});

function saveBalance(val) {
    tg.CloudStorage.setItem('user_balance', val.toString());
}

function addLog(msg) {
    const div = document.createElement('div');
    div.className = 'line';
    div.innerText = `> ${msg}`;
    consoleOutput.appendChild(div);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

startBtn.onclick = () => {
    if (isMining) return;
    
    isMining = true;
    startBtn.innerText = "MINING ACTIVE...";
    startBtn.style.background = "#333";
    startBtn.style.color = "#888";
    startBtn.disabled = true;

    addLog("Mining algoritmi ishga tushdi...");
    runMining();
};

function runMining() {
    setInterval(() => {
        const hash = Math.random().toString(36).substring(2, 10).toUpperCase();
        addLog(`HASH: ${hash} | +0.01 SO'M`);

        currentBalance = parseFloat((currentBalance + 0.01).toFixed(2));
        sessionEarned = parseFloat((sessionEarned + 0.01).toFixed(2));

        balanceEl.innerText = currentBalance.toFixed(2);
        saveBalance(currentBalance);

        // Har 0.50 so'mda reklama chiqarish
        if (sessionEarned >= 0.50) {
            showAd();
        }
    }, 2000);
}

function showAd() {
    addLog("Reklama yuklanmoqda...");
    AdController.show().then(() => {
        addLog("Reklama tugadi. Mukofot saqlandi.");
        sessionEarned = 0;
    }).catch(() => {
        addLog("Reklama xatosi, lekin mining davom etadi.");
        sessionEarned = 0;
    });
}