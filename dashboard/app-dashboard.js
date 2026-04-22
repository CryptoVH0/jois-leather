/**
 * JOIS Customer Dashboard - Application Logic
 */

// Sample Orders
let myOrders = [
    { id: 'JOIS-2024-003', date: '2024-04-18', status: 'delivered', total: 900, items: [{ name: 'Chamarra Noir', qty: 1, price: 450 }, { name: 'Cartera Eclipse', qty: 1, price: 180 }] },
    { id: 'JOIS-2024-006', date: '2024-04-21', status: 'shipped', total: 520, items: [{ name: 'Chamarra Imperial', qty: 1, price: 520 }], tracking: 'JOIS-EXPRESS-789456' },
    { id: 'JOIS-2024-007', date: '2024-04-22', status: 'pending', total: 380, items: [{ name: 'Bolso Cipher', qty: 1, price: 380 }] },
];

document.addEventListener('DOMContentLoaded', () => {
    loadOrders();
});

function loadOrders() {
    const activeContainer = document.getElementById('activeOrders');
    const historyContainer = document.getElementById('orderHistory');
    
    if (!activeContainer && !historyContainer) return;
    
    const active = myOrders.filter(o => o.status === 'pending' || o.status === 'shipped');
    const history = myOrders.filter(o => o.status === 'delivered' || o.status === 'cancelled');
    
    if (activeContainer) {
        activeContainer.innerHTML = active.length ? active.map(order => createOrderCard(order)).join('') : '<p style="padding: 40px; text-align: center; color: #888;">No tienes pedidos activos</p>';
    }
    
    if (historyContainer) {
        historyContainer.innerHTML = history.length ? history.map(order => createOrderCard(order)).join('') : '<p style="padding: 40px; text-align: center; color: #888;">No hay historial de pedidos</p>';
    }
}

function createOrderCard(order) {
    const statusClass = order.status;
    const statusText = { pending: 'Pendiente', shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado' };
    
    return `
        <div class="order-card">
            <div class="order-header">
                <span class="order-id">${order.id}</span>
                <span class="order-date">${formatDate(order.date)}</span>
                <span class="order-status ${statusClass}">${statusText[order.status]}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} × ${item.qty}</span>
                        <span>$${item.price} USD</span>
                    </div>
                `).join('')}
            </div>
            ${order.tracking ? `<p style="font-size: 12px; color: #888; margin-bottom: 15px;">Tracking: ${order.tracking}</p>` : ''}
            <div class="order-total"><strong>Total: $${order.total} USD</strong></div>
            <div class="order-actions">
                ${order.status === 'shipped' ? `<button class="btn-track-order" onclick="trackOrderById('${order.id}')">Rastrear</button>` : ''}
                ${order.status === 'delivered' ? `<button class="btn-track-order" onclick="reorder('${order.id}')">Volver a comprar</button>` : ''}
            </div>
        </div>
    `;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
}

function trackOrder() {
    const orderNum = document.getElementById('orderNumber').value.trim();
    const result = document.getElementById('trackResult');
    
    if (!orderNum) {
        alert('Ingresa el número de pedido');
        return;
    }
    
    const order = myOrders.find(o => o.id === orderNum);
    
    if (!order) {
        result.innerHTML = '<p style="color: #C41E3A;">Pedido no encontrado. Verifica el número e intenta de nuevo.</p>';
        result.classList.add('active');
        return;
    }
    
    const steps = [
        { status: 'ordered', label: 'Pedido confirmado', done: true },
        { status: 'processing', label: 'Preparando envío', done: order.status !== 'pending' },
        { status: 'shipped', label: 'Enviado', done: order.status === 'shipped' || order.status === 'delivered' },
        { status: 'delivered', label: 'Entregado', done: order.status === 'delivered' }
    ];
    
    result.innerHTML = `
        <div style="margin-bottom: 30px;">
            <h3 style="margin-bottom: 20px;">Estado de ${order.id}</h3>
            ${steps.map(step => `
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; ${step.done ? '' : 'opacity: 0.4;'}">
                    <div style="width: 30px; height: 30px; border-radius: 50%; background: ${step.done ? '#4CAF50' : '#ddd'}; display: flex; align-items: center; justify-content: center; color: #fff;">✓</div>
                    <span>${step.label}</span>
                </div>
            `).join('')}
        </div>
        ${order.tracking ? `<p style="font-size: 14px;">Número de tracking: <strong>${order.tracking}</strong></p>` : ''}
        <p style="font-size: 14px; color: #888; margin-top: 20px;">Fecha estimada de entrega: 5-7 días hábiles</p>
    `;
    result.classList.add('active');
}

function trackOrderById(orderId) {
    document.getElementById('orderNumber').value = orderId;
    trackOrder();
    window.scrollTo({ top: document.querySelector('.track-order').offsetTop - 100, behavior: 'smooth' });
}

function reorder(orderId) {
    alert('Función de reordenado: ' + orderId);
}

function editProfile() {
    alert('Función de editar perfil');
}

function filterOrders(filter) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    
    const allOrders = document.querySelectorAll('.order-card');
    allOrders.forEach(card => {
        const status = card.querySelector('.order-status').classList[1];
        if (filter === 'all' || status === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}