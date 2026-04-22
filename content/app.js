/**
 * JOIS Content Management System
 * Load content from texts.json and apply to page elements
 */

(function() {
    'use strict';
    
    // Cache for content data
    let contentCache = null;
    
    /**
     * Initialize content system
     */
    async function init() {
        try {
            // Try to load from localStorage first (user overrides)
            const stored = localStorage.getItem('jois_content');
            if (stored) {
                contentCache = JSON.parse(stored);
            } else {
                // Load from JSON file
                const response = await fetch('content/texts.json');
                contentCache = await response.json();
                contentCache = contentCache.store;
            }
            
            // Determine which page we're on
            const page = getCurrentPage();
            
            // Apply content to page
            if (contentCache[page]) {
                applyContent(contentCache[page]);
            }
            
        } catch (error) {
            console.error('Content system error:', error);
        }
    }
    
    /**
     * Get current page identifier from URL
     */
    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('nft')) return 'nft';
        return 'index';
    }
    
    /**
     * Apply content to elements with data-content attribute
     */
    function applyContent(pageContent) {
        // Find all elements with data-content attribute
        const elements = document.querySelectorAll('[data-content]');
        
        elements.forEach(el => {
            const key = el.getAttribute('data-content');
            if (pageContent[key]) {
                el.textContent = pageContent[key];
            }
        });
        
        // Also update elements by ID mapping
        const idMappings = getIdMappings();
        
        for (const [key, id] of Object.entries(idMappings)) {
            if (pageContent[key]) {
                const el = document.getElementById(id);
                if (el) {
                    el.textContent = pageContent[key];
                }
            }
        }
    }
    
    /**
     * Get ID to content key mappings
     */
    function getIdMappings() {
        // This maps content keys to element IDs
        // Add more as needed
        return {
            // Navigation
            'nav_colecciones': 'nav-colecciones-link',
            'nav_historia': 'nav-historia-link',
            'nav_nft': 'nav-nft-link',
            'nav_contacto': 'nav-contacto-link',
            'logo': 'logo-text',
            
            // Hero
            'hero_subtitle': 'hero-subtitle',
            'hero_title': 'hero-title',
            'hero_tagline': 'hero-tagline',
            'hero_description': 'hero-description',
            'hero_btn': 'hero-btn',
            
            // NFT
            'hero_status': 'hero-status',
            'hero_title': 'hero-title-nft',
            'hero_subtitle': 'hero-subtitle-nft',
            'hero_description': 'hero-description-nft',
            'timer_label': 'timer-label'
        };
    }
    
    /**
     * Get content by key
     */
    function get(key) {
        if (!contentCache) return key;
        
        const page = getCurrentPage();
        if (contentCache[page] && contentCache[page][key]) {
            return contentCache[page][key];
        }
        
        return key;
    }
    
    /**
     * Update content (for editor)
     */
    function update(key, value) {
        if (!contentCache) return;
        
        const page = getCurrentPage();
        if (contentCache[page]) {
            contentCache[page][key] = value;
            
            // Save to localStorage
            localStorage.setItem('jois_content', JSON.stringify(contentCache));
            
            // Update element
            const el = document.querySelector(`[data-content="${key}"]`);
            if (el) {
                el.textContent = value;
            }
        }
    }
    
    // Export API
    window.JoisContent = {
        init: init,
        get: get,
        update: update,
        getCurrentPage: getCurrentPage
    };
    
    // Auto-init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();