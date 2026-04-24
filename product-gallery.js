/* ============================================
   JOIS PRODUCT GALLERY v43
   Premium Image Gallery System
   ============================================ */

/**
 * Product Media Configuration
 * High-quality Unsplash images for each product
 */
const productMedia = {
    'shirt-jacket': {
        name: 'Shirt Jacket',
        hero: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1400&q=95',
        angles: [
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1400&q=95',
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1400&q=95',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1400&q=95',
            'https://images.unsplash.com/photo-1627123424574-724758594e93?w=1400&q=95'
        ],
        details: [
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=90',
            'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=90'
        ],
        lifestyle: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400&q=95',
        texture: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=90'
    },
    'weekender': {
        name: 'Weekender Bag',
        hero: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1400&q=95',
        angles: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1400&q=95',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1400&q=95',
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1400&q=95'
        ],
        details: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=90',
            'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=90'
        ],
        lifestyle: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400&q=95',
        texture: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=90'
    },
    'crossbody': {
        name: 'Crossbody Bag',
        hero: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1400&q=95',
        angles: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1400&q=95',
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1400&q=95'
        ],
        details: [
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=90'
        ],
        lifestyle: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400&q=95',
        texture: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=90'
    },
    'wallet': {
        name: 'Classic Wallet',
        hero: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=1400&q=95',
        angles: [
            'https://images.unsplash.com/photo-1627123424574-724758594e93?w=1400&q=95',
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1400&q=95'
        ],
        details: [
            'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=90'
        ],
        lifestyle: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=1400&q=95',
        texture: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=90'
    }
};

/**
 * Gallery State
 */
class ProductGallery {
    constructor() {
        this.currentIndex = 0;
        this.currentProduct = 'shirt-jacket';
        this.isZoomed = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.preloadImages = [];
    }
    
    /**
     * Initialize gallery with product
     */
    init(productKey = 'shirt-jacket') {
        this.currentProduct = productKey;
        this.currentIndex = 0;
        
        const product = productMedia[productKey];
        if (!product) return;
        
        // Set main image
        this.setMainImage(product.hero);
        
        // Create thumbnails
        this.createThumbnails(product.angles);
        
        // Create navigation arrows
        this.createNavArrows();
        
        // Create dots indicator
        this.createDots(product.angles.length);
        
        // Setup zoom
        this.setupZoom();
        
        // Setup touch swipe
        this.setupTouchSwipe();
        
        // Preload images
        this.preloadImagesFn(product.angles);
    }
    
    /**
     * Set main gallery image
     */
    setMainImage(src) {
        const mainImage = document.getElementById('mainImage');
        if (mainImage) {
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = src;
                mainImage.onload = () => {
                    mainImage.style.opacity = '1';
                };
            }, 150);
        }
    }
    
    /**
     * Create thumbnail navigation
     */
    createThumbnails(images) {
        const thumbsContainer = document.querySelector('.gallery-thumbs');
        if (!thumbsContainer) return;
        
        thumbsContainer.innerHTML = '';
        
        images.forEach((src, index) => {
            const thumb = document.createElement('div');
            thumb.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
            thumb.dataset.index = index;
            thumb.innerHTML = `<img src="${this.getThumbnailUrl(src)}" alt="Angle ${index + 1}">`;
            
            thumb.addEventListener('click', () => {
                this.goToIndex(index);
            });
            
            thumbsContainer.appendChild(thumb);
        });
    }
    
    /**
     * Create navigation arrows
     */
    createNavArrows() {
        const main = document.querySelector('.gallery-main');
        if (!main) return;
        
        // Remove existing navs
        document.querySelectorAll('.gallery-nav').forEach(n => n.remove());
        
        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'gallery-nav prev';
        prevBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>`;
        prevBtn.addEventListener('click', () => this.prev());
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'gallery-nav next';
        nextBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`;
        nextBtn.addEventListener('click', () => this.next());
        
        main.appendChild(prevBtn);
        main.appendChild(nextBtn);
    }
    
    /**
     * Create dots indicator
     */
    createDots(count) {
        const main = document.querySelector('.gallery-main');
        if (!main) return;
        
        // Remove existing dots
        document.querySelectorAll('.gallery-dots').forEach(d => d.remove());
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'gallery-dots';
        
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.className = `gallery-dot ${i === 0 ? 'active' : ''}`;
            dot.dataset.index = i;
            dot.addEventListener('click', () => this.goToIndex(i));
            dotsContainer.appendChild(dot);
        }
        
        main.appendChild(dotsContainer);
    }
    
    /**
     * Navigate to specific index
     */
    goToIndex(index) {
        const product = productMedia[this.currentProduct];
        if (!product) return;
        
        const maxIndex = product.angles.length - 1;
        
        if (index < 0) index = maxIndex;
        if (index > maxIndex) index = 0;
        
        this.currentIndex = index;
        
        // Update main image
        this.setMainImage(product.angles[index]);
        
        // Update thumbnails
        document.querySelectorAll('.gallery-thumb').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        // Update dots
        document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    /**
     * Go to previous image
     */
    prev() {
        this.goToIndex(this.currentIndex - 1);
    }
    
    /**
     * Go to next image
     */
    next() {
        this.goToIndex(this.currentIndex + 1);
    }
    
    /**
     * Setup zoom functionality
     */
    setupZoom() {
        const main = document.querySelector('.gallery-main');
        const mainImage = document.getElementById('mainImage');
        
        if (!main || !mainImage) return;
        
        // Desktop: hover to zoom
        main.addEventListener('mouseenter', () => {
            main.classList.add('zoomed');
            mainImage.style.transform = 'scale(1.5)';
        });
        
        main.addEventListener('mouseleave', () => {
            main.classList.remove('zoomed');
            mainImage.style.transform = 'scale(1)';
        });
        
        // Track mouse position for zoom
        main.addEventListener('mousemove', (e) => {
            if (!main.classList.contains('zoomed')) return;
            
            const rect = main.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            mainImage.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        });
    }
    
    /**
     * Setup touch swipe for mobile
     */
    setupTouchSwipe() {
        const main = document.querySelector('.gallery-main');
        if (!main) return;
        
        main.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        main.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }
    
    /**
     * Handle swipe gesture
     */
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
    }
    
    /**
     * Get thumbnail URL (smaller version)
     */
    getThumbnailUrl(url) {
        return url.replace('w=1400', 'w=200').replace('q=95', 'q=80');
    }
    
    /**
     * Preload images for smoother experience
     */
    preloadImagesFn(urls) {
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
            this.preloadImages.push(img);
        });
    }
}

/**
 * Accordion functionality
 */
class ProductAccordion {
    init() {
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.parentElement;
                const content = header.nextElementSibling;
                const isOpen = item.classList.contains('open');
                
                // Close all
                document.querySelectorAll('.accordion-item').forEach(i => {
                    i.classList.remove('open');
                    i.querySelector('.accordion-content').style.maxHeight = null;
                });
                
                // Toggle current
                if (!isOpen) {
                    item.classList.add('open');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });
    }
}

/**
 * Size selector functionality
 */
class SizeSelector {
    init() {
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }
}

/**
 * Initialize all product page functionality
 */
function initProductPage() {
    const gallery = new ProductGallery();
    const accordion = new ProductAccordion();
    const sizeSelector = new SizeSelector();
    
    // Get product from URL or default
    const urlParams = new URLSearchParams(window.location.search);
    const productKey = urlParams.get('product') || 'shirt-jacket';
    
    gallery.init(productKey);
    accordion.init();
    sizeSelector.init();
    
    // Add to cart handler
    const addToCartBtn = document.querySelector('.cta-premium');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productName = document.querySelector('.product-name')?.textContent || '';
            const activeSize = document.querySelector('.size-btn.active')?.textContent || 'M';
            
            if (typeof addToCart === 'function') {
                addToCart(productName, window.currentProductPrice || 380, '', activeSize);
            }
            
            // Visual feedback
            addToCartBtn.innerHTML = `
                <span class="cta-label">Added ✓</span>
                <span class="cta-arrow">→</span>
            `;
            
            setTimeout(() => {
                addToCartBtn.innerHTML = `
                    <span class="cta-label">Add to Collection</span>
                    <span class="cta-price">$6,650 MXN</span>
                    <span class="cta-arrow">→</span>
                `;
            }, 2000);
        });
    }
    
    // Currency conversion display
    updateCurrencyDisplay();
}

// Update currency display based on selection
function updateCurrencyDisplay() {
    const currencyBtns = document.querySelectorAll('.currency-btn');
    currencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currencyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const currency = btn.dataset.currency || 'MXN';
            const priceElement = document.querySelector('.product-price');
            
            if (priceElement) {
                // Update price display based on currency
                // This would integrate with your existing cart system
            }
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductPage);
} else {
    initProductPage();
}

// Export for external use
window.JOISGallery = ProductGallery;
window.JOISAccordion = ProductAccordion;
