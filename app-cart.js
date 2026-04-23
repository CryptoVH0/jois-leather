// JOIS — Cart with Multi-Currency Display
// USD, MXN, Crypto

// Exchange rate (USD to MXN) - Update this periodically
const USD_TO_MXN = 17.50;
const USD_TO_EUR = 0.92;

// Crypto prices (updated from CoinGecko API)
let cryptoPrices = {
    'BTC': 0,
    'ETH': 0,
    'USDT': 1,
    'USDC': 1,
    'LTC': 0,
    'XRP': 0
};

let selectedCurrency = 'MXN'; // 'MXN', 'USD', 'CRYPTO'
let cart = JSON.parse(localStorage.getItem('jois_cart')) || [];

// Fetch crypto prices
async function fetchCryptoPrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin,litecoin,ripple&vs_currencies=usd');
        const data = await response.json();
        
        cryptoPrices = {
            'BTC': data.bitcoin?.usd || 0,
            'ETH': data.ethereum?.usd || 0,
            'USDT': data.tether?.usd || 1,
            'USDC': data['usd-coin']?.usd || 1,
            'LTC': data.litecoin?.usd || 0,
            'XRP': data.ripple?.usd || 0
        };
        
        // Update crypto display in cart if open
        updateCartPrices();
    } catch (error) {
        console.log('Crypto API unavailable, using fallback prices');
        cryptoPrices = { 'BTC': 65000, 'ETH': 3500, 'USDT': 1, 'USDC': 1, 'LTC': 80, 'XRP': 0.5 };
        updateCartPrices();
    }
}

// Format currency
function formatMXN(amount) {
    return '$' + amount.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' MXN';
}

function formatUSD(amount) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';
}

function formatCrypto(amount, symbol) {
    if (!cryptoPrices[symbol] || cryptoPrices[symbol] === 0) return '...';
    const converted = amount / cryptoPrices[symbol];
    return converted.toFixed(6) + ' ' + symbol;
}

// Calculate totals
function calculateTotals() {
    const subtotalUSD = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const subtotalMXN = subtotalUSD * USD_TO_MXN;
    
    return {
        usd: subtotalUSD,
        mxn: subtotalMXN,
        btc: subtotalUSD / (cryptoPrices.BTC || 1),
        eth: subtotalUSD / (cryptoPrices.ETH || 1)
    };
}

// Update cart prices display
function updateCartPrices() {
    const totals = calculateTotals();
    
    // Update main total display
    const totalEl = document.getElementById('cartTotal');
    const totalMXNEl = document.getElementById('cartTotalMXN');
    const totalCryptoEl = document.getElementById('cartTotalCrypto');
    
    if (totalEl) {
        totalEl.textContent = formatMXN(totals.mxn);
    }
    if (totalMXNEl) {
        totalMXNEl.textContent = formatUSD(totals.usd);
    }
    if (totalCryptoEl) {
        totalCryptoEl.innerHTML = `
            <span class="crypto-total" data-crypto="BTC">${formatCrypto(totals.usd, 'BTC')}</span>
            <span class="crypto-total" data-crypto="ETH">${formatCrypto(totals.usd, 'ETH')}</span>
        `;
    }
    
    // Update item prices
    document.querySelectorAll('.cart-item').forEach((item, index) => {
        const cartItem = cart[index];
        if (!cartItem) return;
        
        const priceEl = item.querySelector('.cart-item-price');
        if (priceEl) {
            const itemTotal = cartItem.price * cartItem.qty;
            const itemMXN = itemTotal * USD_TO_MXN;
            priceEl.innerHTML = `
                <span class="price-mxn">${formatMXN(itemMXN)}</span>
                <span class="price-usd">${formatUSD(itemTotal)}</span>
            `;
        }
    });
}

// Switch currency display in cart
function switchCurrency(currency) {
    selectedCurrency = currency;
    
    // Update buttons
    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.currency === currency);
    });
    
    // Update price display
    const totals = calculateTotals();
    const mainTotal = document.getElementById('cartTotal');
    
    if (mainTotal) {
        switch(currency) {
            case 'MXN':
                mainTotal.textContent = formatMXN(totals.mxn);
                break;
            case 'USD':
                mainTotal.textContent = formatUSD(totals.usd);
                break;
            case 'CRYPTO':
                mainTotal.innerHTML = `
                    <span class="crypto-main">${formatCrypto(totals.usd, 'BTC')}</span>
                    <span class="crypto-alt">${formatCrypto(totals.usd, 'ETH')}</span>
                `;
                break;
        }
    }
}

// Add to cart
function addToCart(name, price, image = '', size = '') {
    const existing = cart.find(item => item.name === name && item.size === size);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ 
            id: name.toLowerCase().replace(/ /g, '-'), 
            name, 
            price, 
            qty: 1, 
            size,
            image: image || getProductImage(name)
        });
    }
    saveCart();
    updateCartUI();
    showCartNotification(name);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('jois_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    
    if (!cartItems) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty"><span>Tu bolsa está vacía</span></div>';
        updateCartPrices();
        return;
    }
    
    const totals = calculateTotals();
    
    cartItems.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.qty;
        const itemMXN = itemTotal * USD_TO_MXN;
        
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">
                        <span class="price-mxn">${formatMXN(itemMXN)}</span>
                        <span class="price-usd">${formatUSD(itemTotal)}</span>
                    </div>
                    ${item.size ? `<div class="cart-item-size">Talla: ${item.size}</div>` : ''}
                    <div class="cart-item-qty">Cantidad: ${item.qty}</div>
                    <div class="cart-item-remove" onclick="removeFromCart(${index})">Eliminar</div>
                </div>
            </div>
        `;
    }).join('');
    
    updateCartPrices();
}

function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.querySelector('.cart-overlay');
    if (drawer) drawer.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
}

function checkoutStripe() {
    if (cart.length === 0) {
        alert('Tu bolsa está vacía');
        return;
    }
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

function checkoutCrypto() {
    if (cart.length === 0) {
        alert('Tu bolsa está vacía');
        return;
    }
    const totals = calculateTotals();
    alert(`Pago con Crypto\n\nTotal: ${formatMXN(totals.mxn)}\n${formatUSD(totals.usd)}\n\nBTC: ${formatCrypto(totals.usd, 'BTC')}\nETH: ${formatCrypto(totals.usd, 'ETH')}\n\nPróximamente disponible.\nContáctanos: info@joisleather.io`);
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('Tu bolsa está vacía');
        return;
    }
    // Redirect to checkout page with WhatsApp option
    window.location.href = 'checkout.html';
}

function getProductImage(productName) {
    const images = {
        'shirt jacket': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80',
        'bomber': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
        'weekender': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
        'wallet': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80'
    };
    const key = Object.keys(images).find(k => productName.toLowerCase().includes(k));
    return images[key] || 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&q=80';
}

function showCartNotification(productName) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #C4A35A;
        color: #0A0A0A;
        padding: 15px 25px;
        font-size: 12px;
        letter-spacing: 0.1em;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        border-radius: 8px;
    `;
    toast.innerHTML = `✓ ${productName} añadido a tu bolsa`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Init
window.addEventListener('load', () => {
    fetchCryptoPrices();
    updateCartUI();
});