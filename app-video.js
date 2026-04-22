/* ============================================
   JOIS — Video Handling Logic
   ============================================ */

// Video Slider State
let currentSlide = 0;
let slideInterval;
let slideDuration = 6000; // 6 seconds per slide

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initVideoSlider();
    initProductVideoBadges();
    initProgressBar();
});

// ============================================
// VIDEO SLIDER
// ============================================
function initVideoSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('sliderDots');
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });
    
    // Auto-play slides
    startSlideInterval();
}

function startSlideInterval() {
    const slides = document.querySelectorAll('.slide');
    
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }, slideDuration);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
            // Play video in active slide
            const video = slide.querySelector('video');
            if (video) {
                video.currentTime = 0;
                video.play();
            }
        }
    });
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
    
    // Reset progress bar
    resetProgressBar();
    startSlideInterval();
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
}

// ============================================
// PROGRESS BAR
// ============================================
let progressInterval;
let progressWidth = 0;

function initProgressBar() {
    resetProgressBar();
}

function resetProgressBar() {
    clearInterval(progressInterval);
    progressWidth = 0;
    const bar = document.getElementById('progressBar');
    if (bar) {
        bar.style.width = '0%';
    }
    
    progressInterval = setInterval(() => {
        progressWidth += 100 / (slideDuration / 100);
        const bar = document.getElementById('progressBar');
        if (bar) {
            bar.style.width = progressWidth + '%';
        }
    }, 100);
}

// ============================================
// SOUND TOGGLE
// ============================================
let soundEnabled = false;

function toggleSound() {
    soundEnabled = !soundEnabled;
    const icon = document.querySelector('.sound-icon');
    
    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        heroVideo.muted = !soundEnabled;
    }
    
    // Update all videos
    document.querySelectorAll('video').forEach(video => {
        video.muted = !soundEnabled;
    });
    
    if (icon) {
        icon.textContent = soundEnabled ? '🔊' : '🔇';
    }
}

// ============================================
// PRODUCT VIDEO BADGES
// ============================================
function initProductVideoBadges() {
    const badges = document.querySelectorAll('.product-video-badge');
    
    badges.forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.preventDefault();
            const card = badge.closest('.product-card');
            const productName = card.dataset.name;
            openProductVideo(productName);
        });
    });
}

function openProductVideo(productName) {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    
    if (!modal || !video) return;
    
    // Map product names to video paths
    const videoMap = {
        'Chamarra Noir': 'assets/videos/chamarra-noir.mp4',
        'Chamarra Imperial': 'assets/videos/chamarra-imperial.mp4',
        'Chamarra Phantom': 'assets/videos/chamarra-phantom.mp4',
        'Cartera Eclipse': 'assets/videos/cartera-eclipse.mp4',
        'Cartera Sovereign': 'assets/videos/cartera-sovereign.mp4',
        'Cartera Matrix': 'assets/videos/cartera-matrix.mp4',
        'Bolso Cipher': 'assets/videos/bolso-cipher.mp4',
        'Bolso Vault': 'assets/videos/bolso-vault.mp4'
    };
    
    const videoSrc = videoMap[productName] || 'assets/videos/product-detail.mp4';
    
    // For demo, show alert that video would open
    alert(`Reproduciendo video de: ${productName}\n\n(En producción, se cargaría: ${videoSrc})`);
    
    modal.classList.add('active');
    
    // In production, uncomment below:
    // video.src = videoSrc;
    // video.play();
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    
    if (modal) modal.classList.remove('active');
    if (video) {
        video.pause();
        video.src = '';
    }
}

// ============================================
// CLOSE MODAL ON ESCAPE
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeVideoModal();
    }
});

// ============================================
// PRELOADER VIDEO (optional)
// ============================================
const preloaderVideo = document.querySelector('.preloader video');
if (preloaderVideo) {
    preloaderVideo.play().catch(() => {
        // Video autoplay blocked, continue anyway
    });
}

// ============================================
// LAZY LOAD VIDEOS
// ============================================
function lazyLoadVideo(videoElement) {
    if (videoElement.dataset.loaded) return;
    
    const source = videoElement.querySelector('source');
    if (source && source.src) {
        videoElement.load();
        videoElement.dataset.loaded = 'true';
    }
}

// Intersection Observer for lazy loading
if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                lazyLoadVideo(entry.target);
            }
        });
    });
    
    document.querySelectorAll('video').forEach(video => {
        videoObserver.observe(video);
    });
}