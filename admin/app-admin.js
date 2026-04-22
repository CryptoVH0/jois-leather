/**
 * JOIS Admin Dashboard - Application Logic
 */

// Check auth
if (!sessionStorage.getItem('jois_admin')) {
    window.location.href = 'login.html';
}

// Sample Data
let orders = [
    { id: 'JOIS-2024-001', customer: 'Carlos Méndez', email: 'carlos@email.com', date: '2024-04-20', status: 'pending', total: 520, items: [{ name: 'Chamarra Imperial', qty: 1, price: 520 }], address: 'Av. Roma 456, CDMX', phone: '+52 55 4567 8901' },
    { id: 'JOIS-2024-002', customer: 'Ana García', email: 'ana@email.com', date: '2024-04-19', status: 'shipped', total: 380, items: [{ name: 'Bolso Cipher', qty: 1, price: 380 }], address: 'Calle 13 #123, Guadalajara', phone: '+52 33 1234 5678', tracking: 'TRACK123456' },
    { id: 'JOIS-2024-003', customer: 'Miguel Torres', email: 'miguel@email.com', date: '2024-04-18', status: 'delivered', total: 900, items: [{ name: 'Chamarra Noir', qty: 1, price: 450 }, { name: 'Cartera Eclipse', qty: 1, price: 180 }], address: 'Av. Universidad 789, Monterrey', phone: '+52 81 9876 5432' },
    { id: 'JOIS-2024-004', customer: 'Laura Sánchez', email: 'laura@email.com', date: '2024-04-17', status: 'pending', total: 220, items: [{ name: 'Cartera Sovereign', qty: 1, price: 220 }], address: 'Calle 5 #45, Puebla', phone: '+52 22 2345 6789' },
    { id: 'JOIS-2024-005', customer: 'Diego Ruiz', email: 'diego@email.com', date: '2024-04-15', status: 'cancelled', total: 480, items: [{ name: 'Chamarra Phantom', qty: 1, price: 480 }], address: 'Av. Insurgentes 321, CDMX', phone: '+52 55 3456 7890' },
];

let products = [
    { id: 1, name: 'Chamarra Noir', category: 'chamarra', price: 450, stock: 12, status: 'active', description: 'Cuero premium negro, diseño minimalista' },
    { id: 2, name: 'Chamarra Imperial', category: 'chamarra', price: 520, stock: 8, status: 'active', description: 'Cuero marrón con acabados dorados' },
    { id: 3, name: 'Chamarra Phantom', category: 'chamarra', price: 480, stock: 5, status: 'active', description: 'Cuero oscuro, estilo futurista' },
    { id: 4, name: 'Cartera Eclipse', category: 'cartera', price: 180, stock: 25, status: 'active', description: 'Cartera compacta, cuero negro italiano' },
    { id: 5, name: 'Cartera Sovereign', category: 'cartera', price: 220, stock: 15, status: 'active', description: 'Diseño executivo, cuero premium' },
    { id: 6, name: 'Cartera Matrix', category: 'cartera', price: 200, stock: 0, status: 'out_of_stock', description: 'Diseño único, textura exclusiva' },
    { id: 7, name: 'Bolso Cipher', category: 'bolso', price: 380, stock: 10, status: 'active', description: 'Bolso de viaje, espacio completo' },
    { id: 8, name: 'Bolso Vault', category: 'bolso', price: 420, stock: 7, status: 'active', description: 'Bolso premium, cierre biométrico' },
];

let customers = [
    { id: 1, name: 'Carlos Méndez', email: 'carlos@email.com', orders: 3, total: 1240 },
    { id: 2, name: 'Ana García', email: 'ana@email.com', orders: 2, total: 680 },
    { id: 3, name: 'Miguel Torres', email: 'miguel@email.com', orders: 5, total: 2100 },
    { id: 4, name: 'Laura Sánchez', email: 'laura@email.com', orders: 1, total: 220 },
    { id: 5, name: 'Diego Ruiz', email: 'diego@email.com', orders: 2, total: 760 },
];

// Load data on init
document.addEventListener('DOMContentLoaded', () => {
    loadRecentOrders();
    loadAllOrders();
    loadProducts();
    loadCustomers();
});

// Navigation
function showSection(section) {
    document.querySelectorAll('.admin-section').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    
    document.getElementById(`section-${section}`).style.display = 'block';
    event.target.closest('a').classList.add('active');
}

// Orders
function loadRecentOrders() {
    const container = document.getElementById('recentOrders');
    container.innerHTML = orders.slice(0, 5).map(order => createOrderRow(order)).join('');
}

function loadAllOrders(filter = 'all') {
    const container = document.getElementById('allOrders');
    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    container.innerHTML = filtered.map(order => createOrderRow(order)).join('');
}

function createOrderRow(order) {
    return `
        <div class="table-row">
            <span class="order-id">${order.id}</span>
            <span>${order.customer}<br><small style="color: #888;">${order.email}</small></span>
            <span><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></span>
            <span>$${order.total} USD</span>
            <span><button class="action-btn" onclick="viewOrder('${order.id}')">Ver</button></span>
        </div>
    `;
}

function getStatusText(status) {
    const texts = { pending: 'Pendiente', shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado' };
    return texts[status] || status;
}

function filterOrdersAdmin(filter) {
    document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    loadAllOrders(filter);
}

function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    document.getElementById('orderDetailContent').innerHTML = `
        <div style="margin-bottom: 30px;">
            <p><strong>Pedido:</strong> ${order.id}</p>
            <p><strong>Fecha:</strong> ${order.date}</p>
            <p><strong>Cliente:</strong> ${order.customer}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Teléfono:</strong> ${order.phone}</p>
            <p><strong>Dirección:</strong> ${order.address}</p>
            ${order.tracking ? `<p><strong>Tracking:</strong> ${order.tracking}</p>` : ''}
        </div>
        
        <div style="margin-bottom: 30px;">
            <h3 style="margin-bottom: 15px; color: #B8860B;">Estado del Pedido</h3>
            <select id="orderStatusSelect" onchange="updateOrderStatus('${order.id}', this.value)" style="padding: 10px; background: #0D0D0D; border: 1px solid #333; color: #fff;">
                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Enviado</option>
                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Entregado</option>
                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
            </select>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h3 style="margin-bottom: 15px; color: #B8860B;">Productos</h3>
            ${order.items.map(item => `
                <div style="padding: 15px; background: #252525; margin-bottom: 10px;">
                    <p>${item.name} × ${item.qty}</p>
                    <p style="color: #B8860B;">$${item.price} USD</p>
                </div>
            `).join('')}
            <div style="border-top: 1px solid #333; padding-top: 15px; margin-top: 15px;">
                <p style="font-size: 18px;"><strong>Total: $${order.total} USD</strong></p>
            </div>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h3 style="margin-bottom: 15px; color: #B8860B;">Información de Envío</h3>
            <div class="form-group">
                <label>Tiempo de Entrega (días)</label>
                <input type="text" id="deliveryInput" value="${order.tracking ? '3-5' : '5-7'}" style="padding: 10px; background: #0D0D0D; border: 1px solid #333; color: #fff;">
            </div>
            <div class="form-group">
                <label>Número de Tracking</label>
                <input type="text" id="trackingInput" value="${order.tracking || ''}" placeholder="Ingresa número de tracking" style="padding: 10px; background: #0D0D0D; border: 1px solid #333; color: #fff;">
            </div>
            <button class="btn-save" onclick="updateShipping('${order.id}')" style="margin-top: 10px;">Actualizar Envío</button>
        </div>
    `;
    
    document.getElementById('orderModal').classList.add('active');
}

function updateOrderStatus(orderId, status) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        loadRecentOrders();
        loadAllOrders();
        showNotification('Estado actualizado');
    }
}

function updateShipping(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.tracking = document.getElementById('trackingInput').value;
        order.status = 'shipped';
        loadRecentOrders();
        loadAllOrders();
        showNotification('Información de envío actualizada');
    }
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

// Products
function loadProducts() {
    const container = document.getElementById('productsTable');
    container.innerHTML = products.map(p => `
        <div class="table-row">
            <span>${p.name}</span>
            <span style="text-transform: capitalize;">${p.category}</span>
            <span>$${p.price} USD</span>
            <span>${p.stock > 0 ? p.stock : '<span style="color: #C41E3A;">Agotado</span>'}</span>
            <span><button class="action-btn" onclick="editProduct(${p.id})">Editar</button></span>
        </div>
    `).join('');
}

function openProductModal(productId = null) {
    const product = productId ? products.find(p => p.id === productId) : null;
    
    document.getElementById('productName').value = product ? product.name : '';
    document.getElementById('productCategory').value = product ? product.category : 'chamarra';
    document.getElementById('productPrice').value = product ? product.price : '';
    document.getElementById('productStock').value = product ? product.stock : '';
    document.getElementById('productDescription').value = product ? product.description : '';
    document.getElementById('productStatus').value = product ? product.status : 'active';
    
    document.getElementById('productModal').classList.add('active');
}

function editProduct(productId) {
    openProductModal(productId);
}

function saveProduct() {
    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const description = document.getElementById('productDescription').value;
    const status = document.getElementById('productStatus').value;
    
    // Find existing or create new
    const existing = products.find(p => p.name === name);
    if (existing) {
        existing.price = price;
        existing.stock = stock;
        existing.status = status;
        existing.description = description;
    }
    
    loadProducts();
    closeProductModal();
    showNotification('Producto guardado');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

// Customers
function loadCustomers() {
    const container = document.getElementById('customersTable');
    container.innerHTML = customers.map(c => `
        <div class="table-row">
            <span>${c.name}</span>
            <span>${c.email}</span>
            <span>${c.orders}</span>
            <span>$${c.total} USD</span>
            <span><button class="action-btn" onclick="viewCustomer('${c.email}')">Ver</button></span>
        </div>
    `).join('');
}

function viewCustomer(email) {
    alert('Ver historial de: ' + email);
}

// Inventory
function saveInventory() {
    const deliveryTime = document.getElementById('deliveryTime').value;
    const shippingCost = document.getElementById('shippingCost').value;
    const shippingInfo = document.getElementById('shippingInfo').value;
    
    // Save to localStorage
    localStorage.setItem('jois_settings', JSON.stringify({ deliveryTime, shippingCost, shippingInfo }));
    
    showNotification('Configuración de inventario guardada');
}

// Settings
function saveSettings() {
    const settings = {
        storeName: document.getElementById('storeName').value,
        storeEmail: document.getElementById('storeEmail').value,
        storePhone: document.getElementById('storePhone').value,
        storeAddress: document.getElementById('storeAddress').value,
        brandDescription: document.getElementById('brandDescription').value
    };
    
    localStorage.setItem('jois_settings', JSON.stringify(settings));
    showNotification('Configuración guardada');
}

// Logout
function logout() {
    sessionStorage.removeItem('jois_admin');
    window.location.href = 'login.html';
}

// Notification
function showNotification(message) {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.classList.add('show');
    
    setTimeout(() => notif.classList.remove('show'), 3000);
}

// Close modals on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});