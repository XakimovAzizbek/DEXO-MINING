// ── ADSGRAM INIT ──
let AdController = null;

function initAd() {
    if (window.Adsgram) {
        AdController = window.Adsgram.init({ blockId: "int-28772" });
    }
}

// ── ELEMENTLAR ──
const timerNum = document.getElementById('timerNum');
const ringFill = document.getElementById('ringFill');
const adBtn    = document.getElementById('adBtn');
const adStatus = document.getElementById('adStatus');

// SVG r=15 => circumference = 2π×15 ≈ 94.25
const CIRCUMFERENCE = 2 * Math.PI * 15;
const TOTAL_SEC     = 35;

let secondsLeft = TOTAL_SEC;
let countdown   = null;
let adRunning   = false;
let cycleCount  = 0;

// ── RING YANGILASH ──
function updateRing(sec) {
    const progress = Math.max(0, sec) / TOTAL_SEC;
    ringFill.style.strokeDashoffset = CIRCUMFERENCE * progress;
}

// ── STATUS MATNI ──
function setStatus(text, color) {
    adStatus.textContent = text;
    adStatus.style.color = color || 'var(--muted)';
}

// ── TAYMER BOSHLASH ──
function startCountdown() {
    if (countdown) {
        clearInterval(countdown);
        countdown = null;
    }

    secondsLeft = TOTAL_SEC;
    adRunning   = false;

    adBtn.disabled = true;
    adBtn.classList.remove('ready');
    timerNum.classList.remove('done');
    ringFill.classList.remove('done');
    ringFill.style.stroke = 'var(--accent)';
    ringFill.style.filter = 'drop-shadow(0 0 4px var(--accent))';

    updateRing(TOTAL_SEC);
    timerNum.textContent = TOTAL_SEC;
    setStatus('KEYINGI REKLAMA...', 'var(--muted)');

    countdown = setInterval(() => {
        secondsLeft--;
        if (secondsLeft > 0) {
            timerNum.textContent = secondsLeft;
            updateRing(secondsLeft);
        } else {
            clearInterval(countdown);
            countdown = null;
            onReady();
        }
    }, 1000);
}

// ── TAYMER TUGADI ──
function onReady() {
    timerNum.textContent = '▶';
    timerNum.classList.add('done');
    ringFill.classList.add('done');
    ringFill.style.stroke = '#00ff88';
    ringFill.style.filter = 'drop-shadow(0 0 6px #00ff88)';
    updateRing(0);

    adBtn.disabled = false;
    adBtn.classList.add('ready');
    setStatus('REKLAMA TAYYOR!', '#00ff88');

    setTimeout(() => showAd(), 400);
}

// ── REKLAMA KO'RSATISH ──
async function showAd() {
    if (adRunning) return;
    if (countdown !== null) return;

    adRunning = true;
    adBtn.disabled = true;
    adBtn.classList.remove('ready');
    setStatus('YUKLANMOQDA...', 'var(--accent)');

    if (!AdController) initAd();

    if (!AdController) {
        console.warn('[DEXO AD] Adsgram yuklanmagan');
        setStatus('AD XIZMAT YO\'Q', '#ff5f56');
        await sleep(1500);
        adRunning = false;
        cycleCount++;
        startCountdown();
        return;
    }

    try {
        setStatus('KO\'RILMOQDA...', 'var(--accent)');
        await AdController.show();
        cycleCount++;
        setStatus('✓ MUKOFOT #' + cycleCount, '#00ff88');
        await sleep(700);
    } catch (err) {
        console.warn('[DEXO AD] Xatolik:', err);
        setStatus('YOPILDI — QAYTA...', '#ffbd2e');
        await sleep(700);
    }

    // HAR DOIM yangi countdown — loop uzilmaydi
    adRunning = false;
    startCountdown();
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// ── TUGMA ──
adBtn.addEventListener('click', () => {
    if (!adBtn.disabled && !adRunning && countdown === null) {
        showAd();
    }
});

// ── START ──
document.addEventListener('DOMContentLoaded', () => {
    initAd();
    startCountdown();
});
