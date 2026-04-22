/* ============================================
   JOIS LEATHER — App Logic
   ============================================ */

// Cart state
let cart = [];

// Crypto prices (fetched from CoinGecko)
let btcPrice = 0;
let usdtPrice = 1; // USDT is always ~1 USD

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initMatrix();
    fetchCryptoPrices();
    setInterval(fetchCryptoPrices, 60000); // Update every minute
});

// ============================================
// MATRIX ANIMATION
// ============================================
function initMatrix() {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Bright lead character
            ctx.fillStyle = '#ffffff';
            ctx.fillText(char, x, y);

            // Rest in green
            ctx.fillStyle = '#00ff41';

            // Reset drop
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(draw, 50);

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ============================================
// CRYPTO PRICES
// ============================================
async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin, tether&vs_currencies=usd');
        const data = await response.json();
        
        btcPrice = data.bitcoin.usd;
        // USDT is always 1 USD by definition
        usdtPrice = 1;
        
        updateAllPrices();
    } catch (error) {
        console.log('Error fetching crypto prices:', error);
        // Fallback values
        btcPrice = 65000;
        usdtPrice = 1;
        updateAllPrices();
    }
}

function updateAllPrices() {
    // Update product prices
    document.querySelectorAll('.product-card').forEach(card => {
        const price = parseInt(card.dataset.price);
        const btcEl = card.querySelector('.btc');
        const usdtEl = card.querySelector('.usdt');
        
        if (btcEl) btcEl.textContent = '₿ ' + (price / btcPrice).toFixed(8);
        if (usdtEl) usdtEl.textContent = '⚡ ' + price.toFixed(2);
    });

    // Update hero price
    const heroBtc = document.getElementById('heroBtc');
    const heroUsdt = document.getElementById('heroUsdt');
    if (heroBtc && btcPrice > 0) {
        heroBtc.textContent = '₿ ' + (1 / btcPrice).toFixed(8) + ' BTC';
        heroUsdt.textContent = '⚡ 1.00 USDT';
    }

    // Update cart total if cart is open
    updateCartDisplay();
}

// ============================================
// CART FUNCTIONS
// ============================================
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    updateCartCount();
    showNotification(`${name} añadido al carrito`);
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartBtc = document.getElementById('cartBtc');
    const cartUsdt = document.getElementById('cartUsdt');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color: #888; text-align: center;">Tu carrito está vacío</p>';
        cartTotal.textContent = '$0 USD';
        if (cartBtc) cartBtc.textContent = '₿ 0.00';
        if (cartUsdt) cartUsdt.textContent = '⚡ 0.00';
        return;
    }
    
    let totalUSD = 0;
    let html = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalUSD += itemTotal;
        html += `
            <div class="cart-item">
                <span>${item.name} x${item.quantity}</span>
                <span>$${itemTotal} USD</span>
                <button onclick="removeFromCart('${item.name}')" style="background: none; border: none; color: #ff4444; cursor: pointer;">×</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = '$' + totalUSD + ' USD';
    
    if (cartBtc && btcPrice > 0) {
        cartBtc.textContent = '₿ ' + (totalUSD / btcPrice).toFixed(8);
    }
    if (cartUsdt) {
        cartUsdt.textContent = '⚡ ' + totalUSD.toFixed(2);
    }
}

// ============================================
// CHECKOUT FUNCTIONS
// ============================================
function checkoutStripe() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // For demo purposes, show a payment link
    // In production, you would redirect to Stripe Checkout
    showNotification('Redirigiendo a pago con tarjeta...');
    
    // Placeholder for Stripe integration
    setTimeout(() => {
        alert('En producción, esto te llevaría a Stripe Checkout.\nTotal: $' + total + ' USD');
    }, 1000);
}

function checkoutCrypto() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalBtc = (total / btcPrice).toFixed(8);
    const totalUsdt = total.toFixed(2);
    
    showNotification('Generando dirección de pago crypto...');
    
    // Placeholder for NOWPayments integration
    setTimeout(() => {
        alert(`Para pagar con crypto:\n\nBTC: Envía ${totalBtc} BTC\nUSDT: Envía ${totalUsdt} USDT\n\nDirección de pago se generará en producción.`);
    }, 1000);
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #d4af37;
        color: #0a0a0a;
        padding: 15px 30px;
        border-radius: 5px;
        font-weight: bold;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});