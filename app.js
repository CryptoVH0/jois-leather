/* ============================================
   JOIS — Core JS v10
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initScrollNav();
});

/* ============================================
   NAVIGATION
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

function toggleMenu() {
    alert('Tienda: Hombre | Mujer\nColección NFT\nNosotros\nContacto');
}

function toggleSearch() {
    const query = prompt('Buscar producto:');
    if (query) {
        alert(`Buscando: ${query}`);
    }
}

/* ============================================
   CART
   ============================================ */
let cart = [];

function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.querySelector('.cart-overlay');
    drawer?.classList.toggle('open');
    overlay?.classList.toggle('open');
}

function addToCart(name, price, weight = 1.0) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1, weight });
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
    
    if (!cartItems) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
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
                    <div class="cart-item-price font-mono">$${item.price} × ${item.qty}</div>
                    <div class="cart-item-remove" onclick="removeFromCart('${item.name}')">Eliminar</div>
                </div>
            </div>
        `).join('');
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (cartTotal) cartTotal.textContent = `$${subtotal} USD`;
    
    window.cartSubtotal = subtotal;
}

function checkoutStripe() {
    if (cart.length === 0) {
        alert('Tu bolsa está vacía');
        return;
    }
    alert('Stripe checkout próximamente.\nContáctanos: info@joisleather.io');
}

function checkoutCrypto() {
    if (cart.length === 0) {
        alert('Tu bolsa está vacía');
        return;
    }
    alert('Pago con crypto próximamente.\nContáctanos: info@joisleather.io');
}