// ── ADSGRAM INIT ──
const AdController = window.Adsgram
    ? window.Adsgram.init({ blockId: "int-28772" })
    : null;

// ── ELEMENTLAR ──
const timerNum  = document.getElementById('timerNum');
const ringFill  = document.getElementById('ringFill');
const adBtn     = document.getElementById('adBtn');

// SVG aylanasi uzunligi: 2π × r = 2π × 15 ≈ 94.25
const CIRCUMFERENCE = 2 * Math.PI * 15; // 94.25
const TOTAL_SEC     = 35;

let secondsLeft = TOTAL_SEC;
let countdown   = null;
let adRunning   = false;

// ── TAYMER ──
function startCountdown() {
    secondsLeft = TOTAL_SEC;
    adBtn.disabled = true;
    adBtn.classList.remove('ready');
    timerNum.classList.remove('done');
    ringFill.classList.remove('done');

    updateRing(TOTAL_SEC);
    timerNum.textContent = TOTAL_SEC;

    clearInterval(countdown);
    countdown = setInterval(() => {
        secondsLeft--;
        timerNum.textContent = secondsLeft;
        updateRing(secondsLeft);

        if (secondsLeft <= 0) {
            clearInterval(countdown);
            onReady();
        }
    }, 1000);
}

function updateRing(sec) {
    // offset: to'liq = 0, bo'sh = CIRCUMFERENCE
    const progress = sec / TOTAL_SEC;
    const offset   = CIRCUMFERENCE * progress;
    ringFill.style.strokeDashoffset = offset;
}

function onReady() {
    timerNum.textContent = '✓';
    timerNum.classList.add('done');
    ringFill.classList.add('done');
    ringFill.style.strokeDashoffset = 0;

    adBtn.disabled = false;
    adBtn.classList.add('ready');

    // Avtomatik reklamani ko'rsatish
    showAd();
}

// ── REKLAMA KO'RSATISH ──
async function showAd() {
    if (adRunning) return;
    if (!AdController) {
        console.warn('Adsgram yuklanmagan');
        startCountdown();
        return;
    }

    adRunning = true;
    adBtn.disabled = true;
    adBtn.classList.remove('ready');

    try {
        await AdController.show();
        // Muvaffaqiyatli tugadi — qayta boshlash
    } catch (e) {
        // Foydalanuvchi yopdi yoki xatolik — baribir qayta boshlash
        console.warn('Reklama yopildi yoki xatolik:', e);
    } finally {
        adRunning = false;
        startCountdown();
    }
}

// ── TUGMA BOSILGANDA ──
adBtn.addEventListener('click', () => {
    if (!adBtn.disabled) showAd();
});

// ── BOSHLASH ──
startCountdown();