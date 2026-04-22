/* ============================================
   JOIS — Core JS + Shipping Integration
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initScrollNav();
    initCartShipping();
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
    alert('Menú: Colecciones | Heritage | NFT | Contacto');
}

function toggleSearch() {
    const query = prompt('Buscar producto:');
    if (query) {
        alert(`Buscando: ${query}`);
    }
}

/* ============================================
   CART SHIPPING ESTIMATOR
   ============================================ */
let selectedShippingOption = null;

async function initCartShipping() {
    const countrySelect = document.getElementById('cartCountrySelect');
    if (countrySelect) {
        countrySelect.addEventListener('change', updateCartShipping);
    }
}

async function updateCartShipping() {
    const countrySelect = document.getElementById('cartCountrySelect');
    const optionsContainer = document.getElementById('cartShippingOptions');
    const shippingSection = document.getElementById('cartShippingSection');
    
    const country = countrySelect?.value;
    
    if (!country) {
        if (optionsContainer) optionsContainer.innerHTML = '';
        return;
    }
    
    // Show shipping section
    if (shippingSection) shippingSection.style.display = 'block';
    
    // Calculate total weight
    const totalWeight = cart.reduce((sum, item) => sum + (item.weight * item.qty), 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    try {
        const estimate = await shippingCalculator.calculate(country, totalWeight, subtotal);
        displayCartShipping(optionsContainer, estimate);
    } catch (error) {
        console.error('Shipping estimate error:', error);
    }
}

function displayCartShipping(container, estimate) {
    if (!container) return;
    
    if (estimate.error) {
        container.innerHTML = `
            <div class="shipping-no-result">
                <p>Envío no disponible para esta dirección.</p>
                <p>Contáctanos: <a href="mailto:info@joisleather.io">info@joisleather.io</a></p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = estimate.options.map(opt => `
        <div class="cart-shipping-option" data-type="${opt.type}" data-cost="${opt.cost}">
            <div class="cart-shipping-option-info">
                <span class="cart-shipping-option-name">${opt.type === 'standard' ? 'Estándar' : 'Express'}</span>
                <span class="cart-shipping-option-days">${opt.estimated_days} días — ${opt.provider}</span>
            </div>
            <div class="cart-shipping-option-price">
                ${opt.cost === 0 ? 'GRATIS' : `${estimate.currency_symbol}${Math.round(opt.cost)}`}
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('.cart-shipping-option').forEach(option => {
        option.addEventListener('click', () => {
            container.querySelectorAll('.cart-shipping-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            
            selectedShippingOption = {
                type: option.dataset.type,
                cost: parseFloat(option.dataset.cost),
                display: option.querySelector('.cart-shipping-option-price').textContent
            };
            
            updateCartTotalWithShipping();
        });
    });
}

function updateCartTotalWithShipping() {
    const cartTotal = document.getElementById('cartTotal');
    const cartShipping = document.getElementById('cartShippingCost');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    if (selectedShippingOption) {
        const total = subtotal + (selectedShippingOption.cost / 20); // Convert to USD approx
        if (cartTotal) cartTotal.textContent = `$${Math.round(total)} USD`;
        if (cartShipping) {
            cartShipping.textContent = selectedShippingOption.display;
            document.getElementById('cartShippingRow').style.display = 'flex';
        }
    }
}

/* ============================================
   CART
   ============================================ */
let cart = [];
let selectedShipping = null;

function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.querySelector('.cart-overlay');
    drawer?.classList.toggle('open');
    overlay?.classList.toggle('open');
    
    // Reset shipping when cart opens
    if (!drawer?.classList.contains('open')) {
        const countrySelect = document.getElementById('cartCountrySelect');
        if (countrySelect) countrySelect.value = '';
        const optionsContainer = document.getElementById('cartShippingOptions');
        if (optionsContainer) optionsContainer.innerHTML = '';
    }
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
    const cartBtc = document.getElementById('cartBtc');
    const cartUsdt = document.getElementById('cartUsdt');
    
    if (!cartItems) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty"><span>Tu bolsa está vacía</span></div>';
        // Hide shipping section when cart is empty
        const shippingSection = document.getElementById('cartShippingSection');
        if (shippingSection) shippingSection.style.display = 'none';
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
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (cartTotal) cartTotal.textContent = `$${subtotal} USD`;
    if (cartBtc) cartBtc.textContent = `₿ ${(subtotal / 65000).toFixed(5)}`;
    if (cartUsdt) cartUsdt.textContent = `USDT ${subtotal}`;
    
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