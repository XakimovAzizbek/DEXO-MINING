const tg = window.Telegram.WebApp;
tg.expand();

const userBalanceEl = document.getElementById('userBalance');
const userNameEl = document.getElementById('userName');
const withdrawBtn = document.getElementById('withdrawBtn');
const modalOverlay = document.getElementById('modalOverlay');
const closeModal = document.getElementById('closeModal');

// Foydalanuvchi ismini chiqarish
userNameEl.innerText = tg.initDataUnsafe.user?.first_name || "Foydalanuvchi";

// Balansni yuklash
tg.CloudStorage.getItem('user_balance', (err, value) => {
    if (!err && value) {
        userBalanceEl.innerText = parseFloat(value).toFixed(2);
    }
});

// Modalni ochish
withdrawBtn.onclick = () => {
    modalOverlay.style.display = 'flex';
};

// Modalni yopish
closeModal.onclick = () => {
    modalOverlay.style.display = 'none';
};
