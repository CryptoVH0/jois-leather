/* ============================================
   JOIS NFT — Application Logic
   ============================================ */

// NFT Data
const nftData = {
    'jacket-noir': { name: 'Chamarra Noir', edition: '#001 / 888', rarity: 'Legendary', traits: 7, price: '0.15 ETH', usd: '~$280 USD' },
    'jacket-imperial': { name: 'Chamarra Imperial', edition: '#002 / 888', rarity: 'Epic', traits: 5, price: '0.12 ETH', usd: '~$220 USD' },
    'jacket-phantom': { name: 'Chamarra Phantom', edition: '#003 / 888', rarity: 'Legendary', traits: 8, price: '0.18 ETH', usd: '~$340 USD' },
    'wallet-eclipse': { name: 'Cartera Eclipse', edition: '#004 / 888', rarity: 'Rare', traits: 4, price: '0.05 ETH', usd: '~$95 USD' },
    'wallet-sovereign': { name: 'Cartera Sovereign', edition: '#005 / 888', rarity: 'Epic', traits: 6, price: '0.08 ETH', usd: '~$150 USD' },
    'wallet-matrix': { name: 'Cartera Matrix', edition: '#006 / 888', rarity: 'Legendary', traits: 9, price: '0.10 ETH', usd: '~$190 USD' },
    'bag-cipher': { name: 'Bolso Cipher', edition: '#007 / 888', rarity: 'Epic', traits: 5, price: '0.14 ETH', usd: '~$265 USD' },
    'bag-vault': { name: 'Bolso Vault', edition: '#008 / 888', rarity: 'Legendary', traits: 7, price: '0.20 ETH', usd: '~$380 USD' }
};

// State
let connectedWallet = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initNavbarScroll();
});

// ============================================
// COUNTDOWN TIMER
// ============================================
function initCountdown() {
    // Set end date to 2 days, 14 hours, 32 minutes from now
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2);
    endDate.setHours(endDate.getHours() + 14);
    endDate.setMinutes(endDate.getMinutes() + 32);
    
    function updateCountdown() {
        const now = new Date();
        const diff = endDate - now;
        
        if (diff <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ============================================
// NAVBAR SCROLL
// ============================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'linear-gradient(to bottom, rgba(10,10,10,0.95), transparent)';
        }
    });
}

// ============================================
// LIGHTBOX
// ============================================
function openLightbox(card) {
    const nftId = card.dataset.nft;
    const nft = nftData[nftId];
    
    if (!nft) return;
    
    // Get image source from the clicked card
    const imgSrc = card.querySelector('.nft-image').src;
    
    document.getElementById('lightbox-image').src = imgSrc;
    document.getElementById('lightbox-title').textContent = nft.name;
    document.getElementById('lightbox-edition').textContent = 'Edition ' + nft.edition;
    document.getElementById('lightbox-rarity').textContent = nft.rarity;
    document.getElementById('lightbox-traits').textContent = nft.traits;
    document.getElementById('lightbox-price').textContent = nft.price;
    document.getElementById('lightbox-usd').textContent = nft.usd;
    
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close lightbox on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lightbox')) {
        closeLightbox();
    }
});

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        closeWalletModal();
    }
});

// ============================================
// WALLET CONNECTION
// ============================================
function connectWallet() {
    document.getElementById('walletModal').classList.add('active');
}

function closeWalletModal() {
    document.getElementById('walletModal').classList.remove('active');
}

function connectMetaMask() {
    showNotification('Conectando con MetaMask...');
    
    // Simulate connection (in production, use wagmi or ethers.js)
    setTimeout(() => {
        connectedWallet = '0x1234...5678';
        updateWalletButton();
        closeWalletModal();
        showNotification('Wallet conectada correctamente ✓');
    }, 1500);
}

function connectWalletConnect() {
    showNotification('Abriendo WalletConnect...');
    
    setTimeout(() => {
        connectedWallet = '0xabcd...efgh';
        updateWalletButton();
        closeWalletModal();
        showNotification('Wallet conectada correctamente ✓');
    }, 1500);
}

function connectCoinbase() {
    showNotification('Conectando con Coinbase...');
    
    setTimeout(() => {
        connectedWallet = '0x9999...0000';
        updateWalletButton();
        closeWalletModal();
        showNotification('Wallet conectada correctamente ✓');
    }, 1500);
}

function updateWalletButton() {
    const btn = document.querySelector('.btn-connect-wallet');
    if (connectedWallet) {
        btn.innerHTML = '<span class="wallet-icon">✓</span><span>' + connectedWallet + '</span>';
        btn.style.background = 'var(--gold)';
        btn.style.color = 'var(--black)';
    }
}

// ============================================
// MINT NFT
// ============================================
function mintNFT(nftId) {
    if (!connectedWallet) {
        showNotification('Primero conecta tu wallet');
        setTimeout(() => connectWallet(), 1000);
        return;
    }
    
    const nft = nftData[nftId];
    if (!nft) return;
    
    showNotification('Iniciando mint de ' + nft.name + '...');
    
    // Simulate minting process
    setTimeout(() => {
        showNotification('Confirmando transacción en blockchain...');
        
        setTimeout(() => {
            showNotification('🎉 ¡' + nft.name + ' es tuyo! Transacción confirmada.');
        }, 2000);
    }, 1500);
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message) {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #c9a962, #e8d5a3);
        color: #000;
        padding: 20px 40px;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 1px;
        z-index: 3000;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    }
    .notification.show {
        transform: translateX(0);
    }
`;
document.head.appendChild(notificationStyles);

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