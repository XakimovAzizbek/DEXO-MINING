// MAHSULOTLAR RO'YXATI - Shu yerdan o'zingiz qo'shasiz
const products = [
    {
        name: "Telegram Premium (1 oylik)",
        desc: "Rasmiy obuna, barcha imkoniyatlar ochiladi.",
        image: "https://xakimovazizbek.github.io/DEXO-MARKET/telegram_premium.jpeg",
        oldPrice: "50 000",
        price: "45 000",
        discount: "20%",
    },
    {
        name: "Telegram stars (100 ta)",
        desc: "Telegramning ichki valyutasi.",
        image: "https://xakimovazizbek.github.io/DEXO-MARKET/telegram_stars.webp",
        oldPrice: "30 479",
        price: "29 209",
        discount: "4.17%",
    },
    {
        name: "Ton",
        desc: "Ton hozirgi kurs boyicha olib beriladi (shunchaki sotib olish tugmasini bosing).",
        image: "https://xakimovazizbek.github.io/DEXO-MARKET/ton.jpg",
        oldPrice: "",
        price: "",
        discount: "",
    },
    {
        name: "tez kunda",
        desc: "Yangi mahsulot.",
        image: "https://xakimovazizbek.github.io/DEXO-MARKET/lv_7577647309404507393_20260510145434.mp4",
        oldPrice: "",
        price: "",
        discount: "",
    },
    {
        name: "tez kunda",
        desc: "Yangi mahsulot.",
        image: "https://picsum.photos/200/200?random=2",
        oldPrice: "",
        price: "",
        discount: "",
    },
    // YANGI MAHSULOTNI SHU YERDAN QO'SHING
];

const container = document.getElementById('market-products');

// Mahsulotlarni ekranga chiqarish
products.forEach(p => {
    // Fayl kengaytmasini tekshirish (video yoki rasm)
    const isVideo = p.image.toLowerCase().endsWith('.mp4');

    container.innerHTML += `
        <div class="card">
            ${p.discount ? `<div class="discount-badge">-${p.discount}</div>` : ''}
            
            <div class="card-img-wrapper">
                ${isVideo 
                    ? `<video src="${p.image}" autoplay loop muted playsinline class="product-media"></video>` 
                    : `<img src="${p.image}" alt="${p.name}" class="product-media">`
                }
            </div>

            <div class="card-body">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="price-row">
                    ${p.oldPrice ? `<span class="old-price">${p.oldPrice} so'm</span>` : ''}
                    ${p.price ? `<span class="current-price">${p.price} so'm</span>` : ''}
                </div>
                <button class="buy-btn" onclick="order('${p.name}')">Sotib olish</button>
            </div>
        </div>
    `;
});

// Telegram lichkaga o'tish funksiyasi
function order(productName) {
    const myTelegram = "Azizbek_on"; // Sizning username
    const message = encodeURIComponent(`Assalomu alaykum, men marketdan "${productName}" sotib olmoqchiman.`);
    window.location.href = `https://t.me/${myTelegram}?text=${message}`;
}

// Barcha resurslarni agressiv yuklash funksiyasi
function aggressivePreload() {
    products.forEach(p => {
        const link = p.image;
        
        // Agar video bo'lsa
        if (link.toLowerCase().endsWith('.mp4')) {
            const v = document.createElement('video');
            v.src = link;
            v.preload = 'auto';
        } 
        // Agar rasm bo'lsa
        else {
            const img = new Image();
            img.src = link;
            img.fetchPriority = "high";
        }
    });
}

// Sayt yuklanishi bilan ishga tushadi
window.addEventListener('load', aggressivePreload);
