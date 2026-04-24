/* ============================================
   JOIS PRODUCT STORYTELLING v43
   Narrative & Content System
   ============================================ */

/**
 * Product Storytelling Content
 * Each product has rich narrative content
 */
const productStories = {
    'shirt-jacket': {
        narrative: "The Shirt Jacket is not just a jacket. It's a statement of intent—designed for those who understand that true luxury lies in the details others overlook. Each piece is crafted from hand-selected full-grain leather, aged to perfection.",
        inspiration: "Inspired by the utilitarian elegance of military outerwear, reimagined for the modern urban landscape.",
        craftsmanship: "Hand-stitched by master artisans in our Mexico City atelier. Every seam reinforced with waxed thread. Every edge burnished to silk. This is not manufactured—it's built.",
        material: "Sourced from tanneries in León, Mexico—world-renowned for premium leather since 1576. Full-grain cowhide, vegetable-tanned, 1.2mm thickness.",
        limited: "Limited to 50 pieces per colorway. Once they're gone, they're gone.",
        details: [
            "Full-grain vegetable-tanned leather",
            "YKK brass hardware",
            "Waxed thread seams",
            "Hand-burnished edges",
            "Cotton twill lining",
            "Interior zip pocket"
        ],
        priceMXN: '$6,650 MXN',
        priceUSD: '$380 USD',
        badge: 'New Collection'
    },
    'weekender': {
        narrative: "The Weekender is built for the journey. Designed for those who move through life with purpose, it carries everything you need—and nothing you don't. This is travel without compromise.",
        inspiration: "Born from the golden age of travel, when crossing oceans meant something. Reimagined for the carry-on generation.",
        craftsmanship: "Constructed from a single hide whenever possible. No shortcuts, no compromises. Reinforced corners that could survive a decade of airports. Brass feet that protect from wet floors.",
        material: "Full-grain Argentine leather, known worldwide for its supple strength. Solid brass hardware that develops patina over time, telling your story.",
        limited: "Each batch limited to 30 pieces. Once sold out, the next batch takes 6 weeks.",
        details: [
            "Full-grain Argentine leather",
            "Solid brass hardware",
            "Reinforced corners",
            "Adjustable shoulder strap",
            "Interior cotton lining",
            "Multiple compartments"
        ],
        priceMXN: '$8,450 MXN',
        priceUSD: '$485 USD',
        badge: 'Best Seller'
    },
    'crossbody': {
        narrative: "The essentials, nothing more. This crossbody holds your world in perfect balance—phone, wallet, keys, and the confidence that comes from carrying something built to last.",
        inspiration: "Stripped to the essential. Every element serves a purpose. The rest is eliminated.",
        craftsmanship: "Single-piece construction where possible. Minimal seams, maximum durability. Each strap attachment point reinforced with hidden rivets.",
        material: "Soft-pull leather from León. Flexible yet structured. It ages beautifully, developing a unique character with every use.",
        limited: "Produced in runs of 40 units. When they're gone, they're gone.",
        details: [
            "Soft-pull full-grain leather",
            "Adjustable strap",
            "Hidden magnetic closure",
            "Interior card slots",
            "Key ring attachment",
            "Weight: 320g"
        ],
        priceMXN: '$3,200 MXN',
        priceUSD: '$185 USD',
        badge: 'Essential'
    },
    'wallet': {
        narrative: "A wallet is the one leather good you touch every day. This one is designed to age with you—developing patina and character, becoming unmistakably yours.",
        inspiration: "The bifold, perfected. No RFID paranoia, no fake leather, no planned obsolescence. Just timeless design that works.",
        craftsmanship: "Eight cards, four pockets, one billfold. Cut from the finest part of the hide. Edges painted and burnished by hand.",
        material: "León leather, 1.0mm thickness. Dense enough to hold its shape, supple enough to fit in your front pocket.",
        limited: null,
        details: [
            "8 card slots",
            "4 hidden pockets",
            "Billfold section",
            "Hand-painted edges",
            "Vegetable-tanned leather",
            "Slim profile"
        ],
        priceMXN: '$1,850 MXN',
        priceUSD: '$105 USD',
        badge: null
    }
};

/**
 * Render product story section
 */
function renderProductStory(productKey) {
    const story = productStories[productKey];
    if (!story) return;
    
    const container = document.querySelector('.product-story');
    if (!container) return;
    
    let html = `
        <p class="product-narrative">${story.narrative}</p>
        <p class="product-inspiration">${story.inspiration}</p>
        <p class="product-craftsmanship">${story.craftsmanship}</p>
        <p class="product-material">${story.material}</p>
    `;
    
    if (story.limited) {
        html += `
            <div class="product-limited">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>${story.limited}</span>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

/**
 * Render trust elements
 */
function renderTrustElements() {
    const container = document.querySelector('.trust-elements');
    if (!container) return;
    
    container.innerHTML = `
        <div class="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Handcrafted in Mexico City</span>
        </div>
        <div class="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
            </svg>
            <span>Full-grain Leather</span>
        </div>
        <div class="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            <span>Limited Production</span>
        </div>
        <div class="trust-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Certificate of Authenticity</span>
        </div>
    `;
}

/**
 * Render scarcity signals
 */
function renderScarcitySignals(productKey) {
    const story = productStories[productKey];
    if (!story || !story.limited) return;
    
    const container = document.querySelector('.scarcity-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="scarcity-signal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span class="scarcity-text">
                <strong>Limited Run:</strong> Only 50 pieces available per colorway. Made to order.
                Production time: 2-3 weeks.
            </span>
        </div>
    `;
}

/**
 * Render NFT badge
 */
function renderNFTBadge() {
    const container = document.querySelector('.nft-badge-container');
    if (!container) return;
    
    container.innerHTML = `
        <div class="nft-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Verified Authentic</span>
            <div class="nft-badge-tooltip">
                Blockchain-verified ownership certificate included with this piece.
            </div>
        </div>
    `;
}

/**
 * Render product details accordion content
 */
function renderProductDetails(productKey) {
    const story = productStories[productKey];
    if (!story) return;
    
    // Update accordion content if needed
    const detailItem = document.querySelector('.accordion-item[data-section="details"]');
    if (detailItem) {
        const content = detailItem.querySelector('.accordion-content');
        if (content && story.details) {
            content.innerHTML = `<ul style="list-style: none; padding: 0;">
                ${story.details.map(d => `<li style="margin-bottom: 8px;">• ${d}</li>`).join('')}
            </ul>`;
        }
    }
}

/**
 * Update price display
 */
function updatePriceDisplay(productKey) {
    const story = productStories[productKey];
    if (!story) return;
    
    const priceElement = document.querySelector('.product-price');
    if (priceElement) {
        priceElement.innerHTML = `
            ${story.priceMXN}
            <span class="product-price-secondary">${story.priceUSD}</span>
        `;
    }
    
    // Update CTA price
    const ctaPrice = document.querySelector('.cta-premium .cta-price');
    if (ctaPrice) {
        ctaPrice.textContent = story.priceMXN;
    }
    
    // Update badge
    if (story.badge) {
        let badge = document.querySelector('.product-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'product-badge';
            const header = document.querySelector('.product-header');
            if (header) {
                header.appendChild(badge);
            }
        }
        badge.textContent = story.badge;
    }
}

/**
 * Render all storytelling elements
 */
function initProductStory(productKey = 'shirt-jacket') {
    renderProductStory(productKey);
    renderTrustElements();
    renderScarcitySignals(productKey);
    renderNFTBadge();
    renderProductDetails(productKey);
    updatePriceDisplay(productKey);
    
    // Trigger accordion animations
    animateStoryElements();
}

/**
 * Animate story elements on scroll
 */
function animateStoryElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.product-story > *').forEach(el => {
        observer.observe(el);
    });
}

// Export functions
window.JOISStory = {
    init: initProductStory,
    stories: productStories,
    renderStory: renderProductStory,
    renderTrust: renderTrustElements
};
