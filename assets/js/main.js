/**
 * StartAnime - Core JavaScript Functionality
 * Modern 2025 implementation with ES6+ features
 */

class StartAnime {
    constructor() {
      this.init();
    }
  
    init() {
      this.setupEventListeners();
      this.initializeComponents();
      this.handlePageLoad();
      this.setActiveNavigation(); // Add active navigation handling
    }
  
    setupEventListeners() {
      // Smooth scroll for navigation links
      document.addEventListener('click', (e) => {
        if (e.target.matches('a[href^="#"]')) {
          e.preventDefault();
          const targetId = e.target.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            this.smoothScrollTo(targetElement);
          }
        }
      });
  
      // Mobile menu toggle
      const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
      const mobileMenu = document.querySelector('.mobile-menu');
      
      if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
          this.toggleMobileMenu(mobileMenu);
        });
      }
  
      // Anime card interactions
      this.initializeAnimeCards();
  
      // Genre guide interactions
      this.initializeGenreGuide();
  
      // CTA button interactions
      this.initializeCTAButtons();
  
      // Window scroll events
      window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
      
      // Window resize events
      window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    }
  
    initializeComponents() {
      // Initialize parallax effects
      this.initializeParallax();
      
      // Initialize intersection observer for animations
      this.setupIntersectionObserver();
      
      // Initialize lazy loading
      this.initializeLazyLoading();
    }
  
    handlePageLoad() {
      // Trigger entry animations
      document.body.classList.add('page-loaded');
      
      // Initialize hero animations
      setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-animate');
        heroElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('animate-in');
          }, index * 200);
        });
      }, 100);
    }
  
    // Smooth scroll implementation
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
  
    // Easing function for smooth animations
    easeInOutCubic(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t * t + b;
      t -= 2;
      return c / 2 * (t * t * t + 2) + b;
    }
  
    // Mobile menu toggle
    toggleMobileMenu(menu) {
      const isOpen = menu.classList.contains('open');
      
      if (isOpen) {
        menu.classList.remove('open');
        document.body.classList.remove('menu-open');
      } else {
        menu.classList.add('open');
        document.body.classList.add('menu-open');
      }
    }
  
    // Initialize anime card interactions
    initializeAnimeCards() {
      const animeCards = document.querySelectorAll('.anime-card');
      
      animeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          this.handleCardHover(card, true);
        });
        
        card.addEventListener('mouseleave', () => {
          this.handleCardHover(card, false);
        });
        
        card.addEventListener('click', () => {
          this.handleCardClick(card);
        });
      });
    }
  
    handleCardHover(card, isHovering) {
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
  
    handleCardClick(card) {
      const animeTitle = card.querySelector('.anime-title')?.textContent;
      
      // Add click animation
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150);
      
      // Analytics or future navigation logic
      console.log(`Anime card clicked: ${animeTitle}`);
      
      // Future: Navigate to anime details or external link
      // this.navigateToAnime(animeTitle);
    }
  
    // Initialize genre guide interactions
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
  
    // Initialize CTA buttons
    initializeCTAButtons() {
      const ctaButtons = document.querySelectorAll('.cta-button');
      
      ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          this.handleCTAClick(e, button);
        });
      });
    }
  
    handleCTAClick(event, button) {
      // Add ripple effect
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
    }
  
    // Parallax effects
    initializeParallax() {
      this.parallaxElements = document.querySelectorAll('[data-parallax]');
    }
  
    updateParallax() {
      if (!this.parallaxElements.length) return;
      
      const scrollTop = window.pageYOffset;
      
      this.parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }
  
    // Intersection Observer for scroll animations
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
  
    // Lazy loading for images
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
  
    // Scroll handler
    handleScroll() {
      const scrollTop = window.pageYOffset;
      
      // Update parallax
      this.updateParallax();
      
      // Update header state
      this.updateHeaderState(scrollTop);
      
      // Update scroll progress
      this.updateScrollProgress();
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
  
    // Resize handler
    handleResize() {
      // Recalculate parallax elements
      this.initializeParallax();
      
      // Update mobile menu state
      if (window.innerWidth > 768) {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.remove('open');
          document.body.classList.remove('menu-open');
        }
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

    // Add active navigation functionality
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