const tg = window.Telegram.WebApp;
const BOT_TOKEN = "8622477036:AAHjspvxxJ8MKzl1TPJuWOZK59uHPt54aQ4"; 
const ADMIN_ID = "7915445661"; 

const sendBtn = document.getElementById('sendRequest');
const statusMsg = document.getElementById('statusMsg');
let selectedMethod = "Uzcard";

// Karta turini tanlash
document.querySelectorAll('.method-card').forEach(card => {
    card.onclick = () => {
        document.querySelector('.method-card.active').classList.remove('active');
        card.classList.add('active');
        selectedMethod = card.getAttribute('data-type');
    };
});

sendBtn.onclick = async () => {
    const cardNumber = document.getElementById('cardNumber').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (cardNumber.length < 16) {
        showStatus("Karta raqami xato!", "#ff5f56");
        return;
    }
    if (amount < 5000) {
        showStatus("Minimal summa 5,000 so'm!", "#ff5f56");
        return;
    }

    tg.CloudStorage.getItem('user_balance', async (err, value) => {
        let currentBalance = parseFloat(value) || 0;

        if (currentBalance < amount) {
            showStatus("Mablag' yetarli emas!", "#ff5f56");
            return;
        }

        sendBtn.disabled = true;
        showStatus("Yuborilmoqda...", "#ffbd2e");

        const newBalance = (currentBalance - amount).toFixed(2);
        tg.CloudStorage.setItem('user_balance', newBalance.toString(), async (err) => {
            if (err) {
                showStatus("Xatolik yuz berdi!", "#ff5f56");
                sendBtn.disabled = false;
                return;
            }

            const user = tg.initDataUnsafe.user;
            const message = `
🔔 *Yangi pul yechish so'rovi!*
💰 Miqdor: ${amount.toLocaleString()} so'm
💳 Karta: ${cardNumber} (${selectedMethod})
👤 Foydalanuvchi: ${user?.first_name}
🆔 ID: ${user?.id}
🔗 Username: @${user?.username || "yo'q"}
            `;

            try {
                await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: ADMIN_ID,
                        text: message,
                        parse_mode: "Markdown"
                    })
                });

                showStatus("So'rov yuborildi! Balansdan ayirildi.", "#00ff41");
                setTimeout(() => {
                    window.parent.postMessage('closeModal', '*');
                }, 2000);

            } catch (e) {
                showStatus("Botga yuborishda xato!", "#ff5f56");
                sendBtn.disabled = false;
            }
        });
    });
};

function showStatus(text, color) {
    statusMsg.innerText = text;
    statusMsg.style.color = color;
}
