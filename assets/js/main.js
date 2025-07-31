/**
 * StartAnime - Enhanced Core JavaScript Functionality
 * Modern 2025 implementation with ES6+ features, PWA support, and advanced optimizations
 */

class StartAnime {
    constructor() {
        this.config = {
            enableServiceWorker: true,
            enablePerformanceMonitoring: true,
            enableOfflineSupport: true,
            enablePushNotifications: false,
            animationReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            isLowPerformance: this.detectLowPerformance(),
            cacheVersion: 'v1.0.0'
        };
        
        this.state = {
            isOnline: navigator.onLine,
            currentPage: window.location.pathname,
            userPreferences: this.loadUserPreferences(),
            performanceMetrics: {},
            activeAnimations: new Set()
        };
        
        this.init();
    }

    async init() {
        try {
            // Initialize core functionality
            await this.initializeCore();
            
            // Setup advanced features
            this.setupAdvancedFeatures();
            
            // Initialize performance monitoring
            if (this.config.enablePerformanceMonitoring) {
                this.initializePerformanceMonitoring();
            }
            
            // Register service worker for PWA features
            if (this.config.enableServiceWorker && 'serviceWorker' in navigator) {
                await this.registerServiceWorker();
            }
            
            // Setup offline support
            if (this.config.enableOfflineSupport) {
                this.setupOfflineSupport();
            }
            
            console.log('StartAnime enhanced initialization complete');
        } catch (error) {
            console.error('StartAnime initialization failed:', error);
            this.handleInitializationError(error);
        }
    }

    async initializeCore() {
        this.setupEventListeners();
        this.initializeComponents();
        this.handlePageLoad();
        this.setActiveNavigation();
        this.initializeAccessibility();
        this.setupMobileOptimizations();
    }

    setupAdvancedFeatures() {
        // Advanced caching system
        this.setupAdvancedCaching();
        
        // Enhanced error handling
        this.setupErrorHandling();
        
        // Analytics and tracking
        this.setupAnalytics();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Touch gesture support
        this.setupTouchGestures();
        
        // Memory management
        this.setupMemoryManagement();
    }

    setupEventListeners() {
        // Enhanced smooth scroll with better performance
        document.addEventListener('click', this.throttle((e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            }
        }, 100));

        // Enhanced mobile menu with better touch support
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            // Touch events for better mobile experience
            this.setupTouchEvents(mobileMenuBtn, {
                touchstart: () => this.toggleMobileMenu(mobileMenu),
                touchmove: (e) => e.preventDefault()
            });
            
            // Click fallback
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu(mobileMenu);
            });
        }

        // Enhanced anime card interactions with performance optimization
        this.initializeAnimeCards();

        // Enhanced genre guide interactions
        this.initializeGenreGuide();

        // Enhanced CTA button interactions
        this.initializeCTAButtons();

        // Advanced scroll handling with RAF
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Enhanced resize handling
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Online/offline status handling
        window.addEventListener('online', () => {
            this.state.isOnline = true;
            this.handleOnlineStatusChange(true);
        });

        window.addEventListener('offline', () => {
            this.state.isOnline = false;
            this.handleOnlineStatusChange(false);
        });

        // Page visibility API for performance optimization
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Before unload for cleanup
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    initializeComponents() {
        // Initialize component loader
        this.initializeComponentLoader();
        
        // Initialize parallax effects with performance optimization
        this.initializeParallax();
        
        // Initialize intersection observer for animations
        this.setupIntersectionObserver();
        
        // Initialize lazy loading with enhanced features
        this.initializeLazyLoading();
        
        // Initialize virtual scrolling for large lists
        this.initializeVirtualScrolling();
        
        // Initialize progressive enhancement
        this.initializeProgressiveEnhancement();
    }

    async initializeComponentLoader() {
        try {
            // Initialize component loader if available
            if (window.ComponentLoader) {
                this.componentLoader = new ComponentLoader();
                await this.componentLoader.init();
                
                // Replace existing navigation and footer with components
                await this.componentLoader.replaceNavigation();
                await this.componentLoader.replaceFooter();
                
                console.log('ComponentLoader: Successfully initialized');
                
                // Test component creation
                this.testComponentSystem();
            } else {
                console.warn('ComponentLoader: Not available, skipping component initialization');
            }
        } catch (error) {
            console.error('ComponentLoader: Failed to initialize:', error);
        }
    }

    async testComponentSystem() {
        try {
            // Test creating an anime card
            const testAnimeData = {
                id: 'test-1',
                title: 'Test Anime',
                image: 'assets/images/anime-covers/attack-on-titan.jpg',
                description: 'This is a test anime card created by the component system.',
                rating: '9.0',
                genres: 'Action, Drama',
                episodes: '25'
            };
            
            const animeCard = await this.componentLoader.createComponent('anime-card', testAnimeData);
            if (animeCard) {
                console.log('ComponentLoader: Successfully created anime card component');
                
                // Add it to the page for testing (if there's a suitable container)
                const testContainer = document.querySelector('.anime-grid');
                if (testContainer) {
                    testContainer.appendChild(animeCard);
                }
            }
            
            // Test creating a genre card
            const testGenreData = {
                name: 'Test Genre',
                description: 'This is a test genre created by the component system.',
                icon: '🎭',
                examples: 'Example 1, Example 2, Example 3'
            };
            
            const genreCard = await this.componentLoader.createComponent('genre-card', testGenreData);
            if (genreCard) {
                console.log('ComponentLoader: Successfully created genre card component');
                
                // Add it to the page for testing (if there's a suitable container)
                const testContainer = document.querySelector('.genre-grid');
                if (testContainer) {
                    testContainer.appendChild(genreCard);
                }
            }
            
        } catch (error) {
            console.error('ComponentLoader: Test failed:', error);
        }
    }

    handlePageLoad() {
        // Enhanced page load handling
        document.body.classList.add('page-loaded');
        
        // Initialize hero animations with performance consideration
        if (!this.config.animationReducedMotion) {
            setTimeout(() => {
                const heroElements = document.querySelectorAll('.hero-animate');
                heroElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('animate-in');
                    }, index * 200);
                });
            }, 100);
        }

        // Track page load performance
        this.trackPageLoadPerformance();
        
        // Initialize search functionality
        this.initializeSearch();
        
        // Initialize filters
        this.initializeFilters();
    }

    // Enhanced smooth scroll with easing and performance optimization
    smoothScrollTo(target, duration = 800) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutCubic(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    // Enhanced easing function
    easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    // Enhanced mobile menu with animations
    toggleMobileMenu(menu) {
        const isOpen = menu.classList.contains('open');
        
        if (isOpen) {
            menu.classList.remove('open');
            document.body.classList.remove('menu-open');
            this.enableScroll();
        } else {
            menu.classList.add('open');
            document.body.classList.add('menu-open');
            this.disableScroll();
        }
    }

    // Enhanced anime card interactions
    initializeAnimeCards() {
        const animeCards = document.querySelectorAll('.anime-card');
        
        animeCards.forEach(card => {
            // Enhanced hover with performance optimization
            let hoverTimeout;
            
            card.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    this.handleCardHover(card, true);
                }, 50);
            });
            
            card.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                this.handleCardHover(card, false);
            });
            
            // Enhanced click with haptic feedback
            card.addEventListener('click', (e) => {
                this.handleCardClick(card, e);
            });

            // Touch events for mobile
            this.setupTouchEvents(card, {
                touchstart: () => this.handleCardTouchStart(card),
                touchend: () => this.handleCardTouchEnd(card)
            });
        });
    }

    handleCardHover(card, isHovering) {
        if (this.config.animationReducedMotion) return;

        const cardImage = card.querySelector('.card-image');
        const cardContent = card.querySelector('.card-content');
        
        if (isHovering) {
            card.classList.add('hovered');
            if (cardImage) {
                cardImage.style.transform = 'scale(1.05)';
            }
            if (cardContent) {
                cardContent.style.transform = 'translateY(-5px)';
            }
        } else {
            card.classList.remove('hovered');
            if (cardImage) {
                cardImage.style.transform = 'scale(1)';
            }
            if (cardContent) {
                cardContent.style.transform = 'translateY(0)';
            }
        }
    }

    handleCardClick(card, event) {
        const animeTitle = card.querySelector('.anime-title')?.textContent;
        
        // Enhanced click animation
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // Haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
        
        // Analytics tracking
        this.trackEvent('anime_card_click', { title: animeTitle });
        
        // Future: Navigate to anime details or external link
        // this.navigateToAnime(animeTitle);
    }

    // Enhanced genre guide interactions
    initializeGenreGuide() {
        const genreItems = document.querySelectorAll('.genre-item');
        
        genreItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.classList.add('active');
                this.showGenreTooltip(item);
            });
            
            item.addEventListener('mouseleave', () => {
                item.classList.remove('active');
                this.hideGenreTooltip(item);
            });

            // Keyboard navigation
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleGenreSelection(item);
                }
            });
        });
    }

    showGenreTooltip(genreItem) {
        const tooltip = genreItem.querySelector('.genre-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(-10px)';
        }
    }

    hideGenreTooltip(genreItem) {
        const tooltip = genreItem.querySelector('.genre-tooltip');
        if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(0)';
        }
    }

    // Enhanced CTA buttons
    initializeCTAButtons() {
        const ctaButtons = document.querySelectorAll('.cta-button');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleCTAClick(e, button);
            });

            // Keyboard support
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleCTAClick(e, button);
                }
            });
        });
    }

    handleCTAClick(event, button) {
        // Enhanced ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);

        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(100);
        }
    }

    // Enhanced parallax effects
    initializeParallax() {
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
    }

    updateParallax() {
        if (!this.parallaxElements.length || this.config.animationReducedMotion) return;
        
        const scrollTop = window.pageYOffset;
        
        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrollTop * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Enhanced intersection observer
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Trigger staggered animations for children
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-in');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .fade-in-up, .slide-in-left, .slide-in-right');
        animatedElements.forEach(el => this.observer.observe(el));
    }

    // Enhanced lazy loading
    initializeLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Enhanced scroll handler
    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Update parallax
        this.updateParallax();
        
        // Update header state
        this.updateHeaderState(scrollTop);
        
        // Update scroll progress
        this.updateScrollProgress();
        
        // Update active navigation
        this.updateActiveNavigationOnScroll(scrollTop);
    }

    updateHeaderState(scrollTop) {
        const header = document.querySelector('.main-header');
        if (!header) return;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    updateScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;
        
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + '%';
    }

    // Enhanced resize handler
    handleResize() {
        // Recalculate parallax elements
        this.initializeParallax();
        
        // Update mobile menu state
        if (window.innerWidth > 768) {
            const mobileMenu = document.querySelector('.mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
                this.enableScroll();
            }
        }

        // Update virtual scrolling
        this.updateVirtualScrolling();
    }

    // Enhanced active navigation
    setActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Remove any existing active class
            link.classList.remove('active');
            
            // Check if this link matches the current page
            if (href === currentPath || 
                (currentPath === '/' && href === 'index.html') ||
                (currentPath === '/index.html' && href === '/') ||
                (currentPath.includes('recommend') && href.includes('recommend'))) {
                link.classList.add('active');
            }
            
            // For anchor links on the same page, check if we're in that section
            if (href.startsWith('#') && currentPath === '/' || currentPath === '/index.html') {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Check if this section is currently in view
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                // Remove active from all nav links
                                navLinks.forEach(navLink => navLink.classList.remove('active'));
                                // Add active to this link
                                link.classList.add('active');
                            }
                        });
                    }, { threshold: 0.5 });
                    
                    observer.observe(targetElement);
                }
            }
        });
    }

    // New advanced features

    // Service Worker Registration
    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);
            
            // Handle updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdateNotification();
                    }
                });
            });
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    // Advanced caching system
    setupAdvancedCaching() {
        // Cache frequently accessed data
        this.cache = new Map();
        
        // Cache anime data
        this.cacheAnimeData();
        
        // Cache user preferences
        this.cacheUserPreferences();
    }

    // Performance monitoring
    initializePerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Monitor memory usage
        this.monitorMemoryUsage();
        
        // Monitor animation performance
        this.monitorAnimationPerformance();
    }

    // Mobile optimizations
    setupMobileOptimizations() {
        if (this.config.isLowPerformance) {
            this.reduceAnimations();
            this.optimizeImages();
            this.reduceParticleEffects();
        }

        // Touch optimizations
        this.setupTouchOptimizations();
        
        // Viewport optimizations
        this.setupViewportOptimizations();
    }

    // Accessibility improvements
    initializeAccessibility() {
        // Skip to main content
        this.setupSkipToContent();
        
        // Focus management
        this.setupFocusManagement();
        
        // ARIA enhancements
        this.setupARIAEnhancements();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
    }

    // Touch gesture support
    setupTouchGestures() {
        // Swipe navigation
        this.setupSwipeNavigation();
        
        // Pinch to zoom
        this.setupPinchToZoom();
        
        // Long press
        this.setupLongPress();
    }

    // Memory management
    setupMemoryManagement() {
        // Cleanup unused resources
        setInterval(() => {
            this.cleanupUnusedResources();
        }, 30000);

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                this.checkMemoryUsage();
            }, 10000);
        }
    }

    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Helper methods for new features
    detectLowPerformance() {
        return navigator.hardwareConcurrency < 4 || 
               navigator.deviceMemory < 4 ||
               /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
    }

    loadUserPreferences() {
        try {
            return JSON.parse(localStorage.getItem('startanime_preferences')) || {};
        } catch (error) {
            return {};
        }
    }

    saveUserPreferences(preferences) {
        try {
            localStorage.setItem('startanime_preferences', JSON.stringify(preferences));
        } catch (error) {
            console.warn('Could not save user preferences:', error);
        }
    }

    setupTouchEvents(element, handlers) {
        if (handlers.touchstart) {
            element.addEventListener('touchstart', handlers.touchstart, { passive: true });
        }
        if (handlers.touchmove) {
            element.addEventListener('touchmove', handlers.touchmove, { passive: false });
        }
        if (handlers.touchend) {
            element.addEventListener('touchend', handlers.touchend, { passive: true });
        }
    }

    enableScroll() {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
    }

    disableScroll() {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${window.scrollY}px`;
    }

    handleCardTouchStart(card) {
        card.style.transform = 'scale(0.98)';
    }

    handleCardTouchEnd(card) {
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    trackEvent(eventName, data = {}) {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, data);
        }
        
        // Custom analytics
        this.state.performanceMetrics[eventName] = {
            timestamp: Date.now(),
            data
        };
    }

    trackPageLoadPerformance() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.state.performanceMetrics.pageLoad = {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
                firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
            };
        }
    }

    handleOnlineStatusChange(isOnline) {
        if (isOnline) {
            this.showNotification('Back online!', 'success');
            this.syncOfflineData();
        } else {
            this.showNotification('You are offline. Some features may be limited.', 'warning');
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAnimations();
        } else {
            this.resumeAnimations();
        }
    }

    cleanup() {
        // Cleanup resources
        this.state.activeAnimations.clear();
        
        // Save user preferences
        this.saveUserPreferences(this.state.userPreferences);
        
        // Clear timeouts
        clearTimeout(this.hoverTimeout);
    }

    // Placeholder methods for new features (to be implemented)
    setupAdvancedCaching() {}
    setupErrorHandling() {}
    setupAnalytics() {}
    setupKeyboardNavigation() {}
    setupTouchGestures() {}
    setupMemoryManagement() {}
    initializeVirtualScrolling() {}
    initializeProgressiveEnhancement() {}
    initializeSearch() {}
    initializeFilters() {}
    updateActiveNavigationOnScroll() {}
    showUpdateNotification() {}
    cacheAnimeData() {}
    cacheUserPreferences() {}
    monitorCoreWebVitals() {}
    monitorMemoryUsage() {}
    monitorAnimationPerformance() {}
    reduceAnimations() {}
    optimizeImages() {}
    reduceParticleEffects() {}
    setupTouchOptimizations() {}
    setupViewportOptimizations() {}
    setupSkipToContent() {}
    setupFocusManagement() {}
    setupARIAEnhancements() {}
    setupSwipeNavigation() {}
    setupPinchToZoom() {}
    setupLongPress() {}
    cleanupUnusedResources() {}
    checkMemoryUsage() {}
    syncOfflineData() {}
    pauseAnimations() {}
    resumeAnimations() {}
    showNotification() {}
    updateVirtualScrolling() {}
    handleInitializationError() {}
    handleGenreSelection() {}
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.startAnimeApp = new StartAnime();
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);