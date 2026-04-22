/* ============================================
   JOIS — Application Logic
   ============================================ */

// State
let cart = [];
let btcPrice = 0;
const usdtPrice = 1;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavbarScroll();
    fetchCryptoPrices();
    setInterval(fetchCryptoPrices, 60000);
});

// ============================================
// PRELOADER
// ============================================
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2000);
    }
}

// ============================================
// NAVIGATION
// ============================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function toggleMobileNav() {
    // Mobile nav toggle logic
}

// ============================================
// CRYPTO PRICES
// ============================================
async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether&vs_currencies=usd');
        const data = await response.json();
        btcPrice = data.bitcoin.usd;
        updateAllCryptoPrices();
    } catch (error) {
        console.log('Error fetching prices, using fallback');
        btcPrice = 65000;
        updateAllCryptoPrices();
    }
}

function updateAllCryptoPrices() {
    if (btcPrice === 0) return;
    
    // Update all product cards
    document.querySelectorAll('.product-card').forEach(card => {
        const price = parseFloat(card.dataset.price);
        const btcEl = card.querySelector('.btc-price');
        const usdtEl = card.querySelector('.usdt-price');
        
        if (btcEl) btcEl.textContent = '₿ ' + (price / btcPrice).toFixed(6);
        if (usdtEl) usdtEl.textContent = 'USDT ' + price.toFixed(2);
    });
    
    // Update cart if open
    updateCartDisplay();
}

// ============================================
// CART FUNCTIONS
// ============================================
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    updateCartCount();
    showNotification(`${name} añadida a tu bolsa`);
    
    // Open cart drawer
    toggleCart();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById('cartCount');
    if (countEl) countEl.textContent = count;
}

function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.querySelector('.cart-overlay');
    
    if (drawer) drawer.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
    
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    const cartBtcEl = document.getElementById('cartBtc');
    const cartUsdtEl = document.getElementById('cartUsdt');
    
    if (!cartItemsEl) return;
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = '<div class="cart-empty"><span>Tu bolsa está vacía</span></div>';
        if (cartTotalEl) cartTotalEl.textContent = '$0 USD';
        if (cartBtcEl) cartBtcEl.textContent = '₿ 0.00';
        if (cartUsdtEl) cartUsdtEl.textContent = 'USDT 0.00';
        return;
    }
    
    let totalUSD = 0;
    let html = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalUSD += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price} USD × ${item.quantity}</div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.name}')">×</button>
            </div>
        `;
    });
    
    cartItemsEl.innerHTML = html;
    
    if (cartTotalEl) cartTotalEl.textContent = `$${totalUSD} USD`;
    if (cartBtcEl && btcPrice > 0) cartBtcEl.textContent = '₿ ' + (totalUSD / btcPrice).toFixed(6);
    if (cartUsdtEl) cartUsdtEl.textContent = 'USDT ' + totalUSD.toFixed(2);
}

// ============================================
// CHECKOUT
// ============================================
function checkoutStripe() {
    if (cart.length === 0) {
        showNotification('Tu bolsa está vacía');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification('Redirigiendo a Stripe Checkout...');
    
    setTimeout(() => {
        alert(`Stripe Checkout\nTotal: $${total} USD\n\nEn producción, esto te llevaría al pago seguro de Stripe.`);
    }, 1000);
}

function checkoutCrypto() {
    if (cart.length === 0) {
        showNotification('Tu bolsa está vacía');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalBtc = (total / btcPrice).toFixed(6);
    
    showNotification('Generando dirección de pago crypto...');
    
    setTimeout(() => {
        alert(`Pago con Criptomoneda\n\nBTC: ${totalBtc} BTC\nUSDT: ${total} USDT\n\nEn producción, esto generaría una dirección única de pago.`);
    }, 1000);
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message) {
    // Remove existing
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #000;
        color: #fff;
        padding: 20px 40px;
        font-size: 12px;
        letter-spacing: 1px;
        z-index: 9999;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
        font-family: 'Inter', sans-serif;
    }
    .notification.show {
        transform: translateX(0);
    }
`;
document.head.appendChild(notificationStyle);

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================
// PARALLAX (optional enhancement)
// ============================================
function initParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
    }
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(initParallax);
});