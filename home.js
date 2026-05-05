const tg = window.Telegram.WebApp;
const AdController = window.Adsgram.init({ blockId: "int-28391" });

tg.expand();

const balanceEl = document.getElementById('balance');
const startBtn = document.getElementById('startBtn');
const consoleOutput = document.getElementById('console-output');

let currentBalance = 0.00;
let isMining = false;
let sessionEarned = 0.00;

tg.CloudStorage.getItems(['user_balance', 'session_earned'], (err, values) => {
    if (!err) {
        currentBalance = parseFloat(values.user_balance) || 0.00;
        sessionEarned = parseFloat(values.session_earned) || 0.00;
        balanceEl.innerText = currentBalance.toFixed(2);
    }
});

function addLog(msg) {
    const div = document.createElement('div');
    div.innerText = `> ${msg}`;
    consoleOutput.appendChild(div);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

startBtn.onclick = () => {
    if (isMining) return;
    isMining = true;
    startBtn.disabled = true;
    startBtn.innerText = "MINING...";
    startBtn.style.background = "#1a1a1a";
    startBtn.style.color = "#444";
    
    setInterval(async () => {
        const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
        addLog(`HASH: ${hash} | +0.01`);

        currentBalance = parseFloat((currentBalance + 0.01).toFixed(2));
        sessionEarned = parseFloat((sessionEarned + 0.01).toFixed(2));
        balanceEl.innerText = currentBalance.toFixed(2);

        tg.CloudStorage.setItem('user_balance', currentBalance.toString());
        tg.CloudStorage.setItem('session_earned', sessionEarned.toString());

        if (sessionEarned >= 0.50) {
            isMining = false;
            AdController.show().then(() => {
                isMining = true;
                sessionEarned = 0;
            }).catch(() => {
                isMining = true;
            });
        }
    }, 1000);
};
