/* ============================================
   JOIS — Core JS (Cart + Nav)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initScrollNav();
});

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1000);
    }
}

/* ============================================
   SCROLL NAVIGATION
   ============================================ */
function initScrollNav() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
}

/* ============================================
   CART FUNCTIONS
   ============================================ */
let cart = [];

function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.querySelector('.cart-overlay');
    drawer?.classList.toggle('open');
    overlay?.classList.toggle('open');
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    
    updateCartUI();
    toggleCart();
}

function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartBtc = document.getElementById('cartBtc');
    const cartUsdt = document.getElementById('cartUsdt');
    
    if (!cartItems) return;
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Update items list
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty"><span>Tu bolsa está vacía</span></div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="assets/images/${item.name.toLowerCase().replace(/ /g, '-')}.png" alt="${item.name}" onerror="this.style.display='none'">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price font-mono">$${item.price} USD × ${item.qty}</div>
                    <div class="cart-item-remove" onclick="removeFromCart('${item.name}')">Eliminar</div>
                </div>
            </div>
        `).join('');
    }
    
    // Update totals
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (cartTotal) cartTotal.textContent = `$${total} USD`;
    if (cartBtc) cartBtc.textContent = `₿ ${(total / 65000).toFixed(5)}`;
    if (cartUsdt) cartUsdt.textContent = `USDT ${total}`;
}

function checkoutStripe() {
    alert('Stripe checkout próximamente.\nPor ahora contáctanos en info@joisleather.io para completar tu compra.');
}

function checkoutCrypto() {
    alert('Pago con crypto próximamente.\nPor ahora contáctanos en info@joisleather.io para opciones de BTC/USDT.');
}