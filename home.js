const tg = window.Telegram.WebApp;
// Adsgram blok ID-ingiz
const AdController = window.Adsgram.init({ blockId: "int-28391" });

tg.expand(); // Ilovani to'liq ekranga yoyish

const balanceEl = document.getElementById('balance');
const startBtn = document.getElementById('startBtn');
const consoleOutput = document.getElementById('console-output');

let currentBalance = 0.00;
let isMining = false;
let sessionEarned = 0.00; 

// CloudStorage-dan ma'lumotlarni yuklash
tg.CloudStorage.getItems(['user_balance', 'session_earned'], (err, values) => {
    if (!err) {
        currentBalance = parseFloat(values.user_balance) || 0.00;
        sessionEarned = parseFloat(values.session_earned) || 0.00;
        balanceEl.innerText = currentBalance.toFixed(2);
        
        addLog("Tizim tayyor.");
        
        if (sessionEarned >= 0.50) {
            addLog("Eslatma: Miningni davom ettirish uchun reklamani ko'rishingiz shart!", "#ff5f56");
        }
    }
});

function saveProgress() {
    tg.CloudStorage.setItem('user_balance', currentBalance.toString());
    tg.CloudStorage.setItem('session_earned', sessionEarned.toString());
}

function addLog(msg, color = null) {
    const div = document.createElement('div');
    div.className = 'line';
    if (color) div.style.color = color;
    div.innerText = `> ${msg}`;
    consoleOutput.appendChild(div);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

startBtn.onclick = async () => {
    if (isMining) return;

    if (sessionEarned >= 0.50) {
        const adSuccess = await showAd();
        if (!adSuccess) {
            addLog("Reklamani oxirigacha ko'rmasangiz mining boshlanmaydi!", "#ff5f56");
            return;
        }
    }

    startMiningUI();
    runMining();
};

function startMiningUI() {
    isMining = true;
    startBtn.innerText = "MINING ACTIVE (2X)...";
    startBtn.style.background = "#333";
    startBtn.style.color = "#888";
    startBtn.disabled = true;
    addLog("Mining algoritmi ishga tushdi (Tezlik: 2x)...", "#00ff41");
}

function runMining() {
    // Tezlik 1000ms (1 sekund) qilib belgilandi - bu avvalgidan 2x tezroq
    const miningInterval = setInterval(async () => {
        if (!isMining) return;

        const hash = Math.random().toString(36).substring(2, 10).toUpperCase();
        addLog(`HASH: ${hash} | +0.01 SO'M`);

        currentBalance = parseFloat((currentBalance + 0.01).toFixed(2));
        sessionEarned = parseFloat((sessionEarned + 0.01).toFixed(2));

        balanceEl.innerText = currentBalance.toFixed(2);
        saveProgress();

        if (sessionEarned >= 0.50) {
            isMining = false; 
            addLog("Sessiya yakunlandi. Reklama yuklanmoqda...", "#ffbd2e");
            
            const adFinished = await showAd();
            if (adFinished) {
                isMining = true; 
                addLog("Mining qayta tiklandi.");
            } else {
                startBtn.disabled = false;
                startBtn.innerText = "START MINING (REKLAMA KERAK)";
                startBtn.style.background = "var(--neon-green)";
                startBtn.style.color = "#000";
                clearInterval(miningInterval);
            }
        }
    }, 650); // 2x tezlik uchun 1000ms
}

async function showAd() {
    return new Promise((resolve) => {
        AdController.show().then(() => {
            addLog("Reklama tugadi. Mukofot tasdiqlandi.", "#27c93f");
            sessionEarned = 0; 
            saveProgress();
            resolve(true);
        }).catch(() => {
            addLog("Reklama yuklashda xatolik yoki foydalanuvchi yopdi.", "#ff5f56");
            resolve(false);
        });
    });
}