/* ============================================
   JOIS — Complete App JS
   Cart + Crypto + User System
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initCart();
    initCryptoPrices();
});

// ===== NAVIGATION =====
function initNav() {
    const navbar = document.querySelector('.nav-main');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

function toggleMenu() {
    alert('Navegación:\nHombre | Mujer | Colección | Nosotros | Contacto');
}

function toggleSearch() {
    const query = prompt('Buscar producto:');
    if (query) {
        alert(`Buscando: ${query}`);
    }
}

// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem('jois_cart')) || [];
let cryptoPrices = {};
let selectedCrypto = 'BTC';

// ===== CRYPTO PRICES =====
async function initCryptoPrices() {
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
        
        renderCryptoPrices();
    } catch (error) {
        console.log('Crypto API unavailable');
        // Fallback prices
        cryptoPrices = { 'BTC': 65000, 'ETH': 3500, 'USDT': 1, 'USDC': 1, 'LTC': 80, 'XRP': 0.5 };
        renderCryptoPrices();
    }
}

function renderCryptoPrices() {
    // This is called from product pages that have the crypto display
}

function convertToCrypto(usdPrice, symbol) {
    if (!cryptoPrices[symbol]) return '...';
    const converted = (usdPrice / cryptoPrices[symbol]).toFixed(6);
    return converted;
}

// ===== CART FUNCTIONS =====
function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.querySelector('.cart-overlay');
    if (drawer) drawer.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
}

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
    
    // Show feedback
    showCartNotification(name);
}

function showCartNotification(productName) {
    // Create toast notification
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
    `;
    toast.innerHTML = `✓ ${productName} añadido a tu bolsa`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('jois_cart', JSON.stringify(cart));
    
    // Also save to user account if logged in
    const currentUser = localStorage.getItem('jois_current_user');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const userCartKey = `jois_cart_${user.email}`;
        localStorage.setItem(userCartKey, JSON.stringify(cart));
    }
}

function getProductImage(productName) {
    // Map product names to image URLs
    const images = {
        'shirt jacket': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80',
        'bomber': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
        'weekender': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
        'wallet': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80'
    };
    
    const key = Object.keys(images).find(k => productName.toLowerCase().includes(k));
    return images[key] || 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&q=80';
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartTotalCrypto = document.getElementById('cartTotalCrypto');
    
    if (!cartItems) return;
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Update cart count in nav (if exists different elements)
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = totalItems);
    
    // Update items
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty"><span>Tu bolsa está vacía</span></div>';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price font-mono">$${item.price} USD</div>
                    ${item.size ? `<div style="font-size: 11px; color: #888; margin: 4px 0;">Talla: ${item.size}</div>` : ''}
                    <div style="font-size: 11px; color: #888;">Cantidad: ${item.qty}</div>
                    <div class="cart-item-remove" onclick="removeFromCart(${index})">Eliminar</div>
                </div>
            </div>
        `).join('');
    }
    
    // Update total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (cartTotal) cartTotal.textContent = `$${subtotal} USD`;
    
    // Update crypto total
    if (cartTotalCrypto && cryptoPrices[selectedCrypto]) {
        const converted = (subtotal / cryptoPrices[selectedCrypto]).toFixed(6);
        cartTotalCrypto.textContent = `≈ ${converted} ${selectedCrypto}`;
    }
    
    window.cartSubtotal = subtotal;
}

function selectCryptoInCart(symbol) {
    selectedCrypto = symbol;
    
    // Update selector UI
    document.querySelectorAll('.crypto-btn').forEach(btn => {
        if (btn.getAttribute('data-crypto') === symbol) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    // Update button text
    const btnText = document.getElementById('cryptoBtnText');
    if (btnText) {
        btnText.textContent = `Pagar con ${symbol}`;
    }
    
    updateCartUI();
}

// ===== CHECKOUT =====
function checkoutStripe() {
    if (cart.length === 0) {
        alert('Tu bolsa está vacía');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    alert(`Stripe Checkout\n\nTotal: $${subtotal} USD\n\nPróximamente disponible.\nContáctanos: info@joisleather.io`);
}

function checkoutCrypto() {
    if (cart.length === 0) {
        alert('Tu bolsa está vacía');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const converted = cryptoPrices[selectedCrypto] ? (subtotal / cryptoPrices[selectedCrypto]).toFixed(6) : '...';
    
    alert(`Pago con Crypto\n\nTotal: $${subtotal} USD\n${selectedCrypto}: ${converted}\n\nPróximamente disponible.\nContáctanos: info@joisleather.io`);
}

// ===== USER AUTH =====
function checkAuth() {
    const currentUser = localStorage.getItem('jois_current_user');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        // Load user's saved cart
        const userCartKey = `jois_cart_${user.email}`;
        const savedCart = localStorage.getItem(userCartKey);
        if (savedCart) {
            cart = JSON.parse(savedCart);
            saveCart();
            updateCartUI();
        }
        return user;
    }
    return null;
}

// ===== INIT =====
window.addEventListener('load', () => {
    updateCartUI();
    checkAuth();
});

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
    }
`;
document.head.appendChild(style);
// Mobile Menu Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Create overlay if not exists
        if (!document.querySelector('.nav-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'nav-overlay';
            document.body.appendChild(overlay);
            overlay.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                overlay.classList.remove('active');
            });
        }
        
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) overlay.classList.toggle('active');
    });
}
