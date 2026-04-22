/* ============================================
   JOIS — Video/Carousel Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initSlider();
    initScrollEffects();
    initPreloader();
});

/* ============================================
   SLIDER
   ============================================ */
let currentSlide = 0;
let slideInterval;
const slideDuration = 6000;

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('sliderDots');
    
    if (!slides.length) return;
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(index);
        if (dotsContainer) dotsContainer.appendChild(dot);
    });
    
    // Start auto-play
    startSlideInterval();
}

function startSlideInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        const slides = document.querySelectorAll('.slide');
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }, slideDuration);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!slides.length) return;
    
    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
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

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 800);
        });
    }
}

/* ============================================
   SCROLL EFFECTS
   ============================================ */
function initScrollEffects() {
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
   MOBILE NAVIGATION
   ============================================ */
function toggleMobileNav() {
    const nav = document.querySelector('.nav-left');
    if (nav) {
        nav.classList.toggle('mobile-open');
    }
}