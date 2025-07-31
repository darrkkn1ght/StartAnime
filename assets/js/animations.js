/**
 * StartAnime - Animation Controllers
 * Advanced 2025 animation system with performance optimization
 */

class AnimationController {
    constructor() {
      this.animations = new Map();
      this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.init();
    }
  
    init() {
      this.setupAnimationFramework();
      this.initializeHeroAnimations();
      this.initializeCardAnimations();
      this.initializeTextAnimations();
      this.initializeParticleSystem();
      this.setupPerformanceOptimizations();
    }
  
    setupAnimationFramework() {
      // Create animation timeline system
      this.timeline = {
        queue: [],
        isRunning: false,
        currentTime: 0
      };
  
      // Animation presets for consistency
      this.presets = {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        swift: 'cubic-bezier(0.4, 0, 0.6, 1)',
        gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      };
  
      // Duration presets
      this.durations = {
        fast: 200,
        normal: 300,
        slow: 500,
        verySlow: 800
      };
    }
  
    // Hero section animations
    initializeHeroAnimations() {
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection) return;
  
      // Floating background elements
      this.createFloatingElements();
      
      // Text reveal animations
      this.setupTextReveal();
      
      // Button pulse animation
      this.setupButtonAnimations();
      
      // Scroll indicator animation
      this.setupScrollIndicator();
    }
  
    createFloatingElements() {
      const heroSection = document.querySelector('.hero-section');
      if (!heroSection || this.isReducedMotion) return;
  
      const floatingContainer = document.createElement('div');
      floatingContainer.className = 'floating-elements';
      floatingContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
      `;
  
      // Create floating shapes
      for (let i = 0; i < 6; i++) {
        const shape = this.createFloatingShape(i);
        floatingContainer.appendChild(shape);
      }
  
      heroSection.appendChild(floatingContainer);
      this.animateFloatingElements();
    }
  
    createFloatingShape(index) {
      const shape = document.createElement('div');
      const size = Math.random() * 60 + 20;
      const delay = index * 0.5;
      
      shape.className = `floating-shape floating-shape-${index}`;
      shape.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
        border-radius: 50%;
        animation: float ${8 + Math.random() * 4}s infinite ease-in-out;
        animation-delay: ${delay}s;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      `;
  
      return shape;
    }
  
    animateFloatingElements() {
      if (this.isReducedMotion) return;
  
      const style = document.createElement('style');
      style.textContent = `
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
            opacity: 0.8;
          }
          75% {
            transform: translateY(-30px) rotate(270deg);
            opacity: 0.9;
          }
        }
      `;
      document.head.appendChild(style);
    }
  
    setupTextReveal() {
      const textElements = document.querySelectorAll('.hero-text, .hero-subtitle');
      
      textElements.forEach((element, index) => {
        this.createTextRevealAnimation(element, index * 200);
      });
    }
  
    createTextRevealAnimation(element, delay = 0) {
      if (this.isReducedMotion) {
        element.style.opacity = '1';
        return;
      }
  
      const text = element.textContent;
      element.innerHTML = '';
      
      // Split text into spans for individual animation
      text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.cssText = `
          display: inline-block;
          opacity: 0;
          transform: translateY(50px);
          animation: textReveal 0.6s ${this.presets.bounce} forwards;
          animation-delay: ${delay + (index * 50)}ms;
        `;
        element.appendChild(span);
      });
  
      // Add text reveal keyframes
      if (!document.querySelector('#textRevealStyle')) {
        const style = document.createElement('style');
        style.id = 'textRevealStyle';
        style.textContent = `
          @keyframes textReveal {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  
    setupButtonAnimations() {
      const buttons = document.querySelectorAll('.cta-button, .btn-primary');
      
      buttons.forEach(button => {
        this.enhanceButtonAnimation(button);
      });
    }
  
    enhanceButtonAnimation(button) {
      // Add magnetic effect
      button.addEventListener('mousemove', (e) => {
        if (this.isReducedMotion) return;
        
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
      });
  
      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
  
      // Add click wave animation
      button.addEventListener('click', (e) => {
        this.createClickWave(e, button);
      });
    }
  
    createClickWave(event, element) {
      if (this.isReducedMotion) return;
  
      const wave = document.createElement('div');
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
  
      wave.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        animation: clickWave 0.8s ease-out forwards;
        pointer-events: none;
      `;
  
      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      element.appendChild(wave);
  
      setTimeout(() => wave.remove(), 800);
  
      // Add click wave keyframes
      if (!document.querySelector('#clickWaveStyle')) {
        const style = document.createElement('style');
        style.id = 'clickWaveStyle';
        style.textContent = `
          @keyframes clickWave {
            from {
              transform: scale(0);
              opacity: 0.5;
            }
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  
    setupScrollIndicator() {
      const scrollIndicator = document.querySelector('.scroll-indicator');
      if (!scrollIndicator || this.isReducedMotion) return;
  
      scrollIndicator.style.cssText += `
        animation: scrollBounce 2s infinite ease-in-out;
      `;
  
      if (!document.querySelector('#scrollBounceStyle')) {
        const style = document.createElement('style');
        style.id = 'scrollBounceStyle';
        style.textContent = `
          @keyframes scrollBounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  
    // Card animations
    initializeCardAnimations() {
      const cards = document.querySelectorAll('.anime-card, .feature-card, .genre-card');
      
      cards.forEach((card, index) => {
        this.enhanceCardAnimation(card, index);
      });
    }
  
    enhanceCardAnimation(card, index) {
      // Stagger initial animation
      if (!this.isReducedMotion) {
        card.style.cssText += `
          opacity: 0;
          transform: translateY(30px);
          animation: cardSlideIn 0.6s ${this.presets.smooth} forwards;
          animation-delay: ${index * 100}ms;
        `;
      }
  
      // Enhanced hover effects
      card.addEventListener('mouseenter', () => {
        this.animateCardHover(card, true);
      });
  
      card.addEventListener('mouseleave', () => {
        this.animateCardHover(card, false);
      });
  
      // Add card slide-in keyframes
      if (!document.querySelector('#cardSlideInStyle')) {
        const style = document.createElement('style');
        style.id = 'cardSlideInStyle';
        style.textContent = `
          @keyframes cardSlideIn {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  
    animateCardHover(card, isHovering) {
      if (this.isReducedMotion) return;
  
      const image = card.querySelector('.card-image, img');
      const content = card.querySelector('.card-content');
      const shadow = card;
  
      if (isHovering) {
        card.style.transform = 'translateY(-8px) scale(1.02)';
        card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
        
        if (image) {
          image.style.transform = 'scale(1.1)';
          image.style.filter = 'brightness(1.1)';
        }
        
        if (content) {
          content.style.transform = 'translateY(-4px)';
        }
      } else {
        card.style.transform = '';
        card.style.boxShadow = '';
        
        if (image) {
          image.style.transform = '';
          image.style.filter = '';
        }
        
        if (content) {
          content.style.transform = '';
        }
      }
    }
  
    // Text animations
    initializeTextAnimations() {
      this.setupCountUpAnimation();
      this.setupTypewriterEffect();
      this.setupTextGradientAnimation();
    }
  
    setupCountUpAnimation() {
      const countElements = document.querySelectorAll('[data-count]');
      
      countElements.forEach(element => {
        const target = parseInt(element.dataset.count);
        const duration = parseInt(element.dataset.duration) || 2000;
        
        this.animateCountUp(element, target, duration);
      });
    }
  
    animateCountUp(element, target, duration) {
      if (this.isReducedMotion) {
        element.textContent = target;
        return;
      }
  
      let start = 0;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
          element.textContent = target;
          clearInterval(timer);
        }
      }, 16);
    }
  
    setupTypewriterEffect() {
      const typewriterElements = document.querySelectorAll('.typewriter');
      
      typewriterElements.forEach(element => {
        this.createTypewriterEffect(element);
      });
    }
  
    createTypewriterEffect(element) {
      if (this.isReducedMotion) return;
  
      const text = element.textContent;
      const speed = parseInt(element.dataset.speed) || 50;
      
      element.textContent = '';
      element.style.cssText += `
        border-right: 2px solid var(--primary-purple);
        animation: blink 1s infinite;
      `;
  
      let i = 0;
      const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        
        if (i >= text.length) {
          clearInterval(timer);
        }
      }, speed);
  
      // Add blink animation
      if (!document.querySelector('#blinkStyle')) {
        const style = document.createElement('style');
        style.id = 'blinkStyle';
        style.textContent = `
          @keyframes blink {
            0%, 50% { border-color: transparent; }
            51%, 100% { border-color: var(--primary-purple); }
          }
        `;
        document.head.appendChild(style);
      }
    }
  
    setupTextGradientAnimation() {
      const gradientTexts = document.querySelectorAll('.gradient-text');
      
      gradientTexts.forEach(text => {
        if (!this.isReducedMotion) {
          text.style.cssText += `
            background: linear-gradient(45deg, var(--primary-purple), var(--primary-pink), var(--primary-blue));
            background-size: 300% 300%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientMove 3s ease infinite;
          `;
        }
      });
  
      if (!document.querySelector('#gradientMoveStyle')) {
        const style = document.createElement('style');
        style.id = 'gradientMoveStyle';
        style.textContent = `
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `;
        document.head.appendChild(style);
      }
    }
  
    // Particle system
    initializeParticleSystem() {
      if (this.isReducedMotion) return;
  
      const particleContainer = document.querySelector('.particle-container');
      if (!particleContainer) return;
  
      this.createParticles(particleContainer);
    }
  
    createParticles(container) {
      const particleCount = 20;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.8), transparent);
          border-radius: 50%;
          left: ${x}%;
          top: ${y}%;
          animation: particleFloat ${duration}s infinite linear;
          animation-delay: ${delay}s;
          pointer-events: none;
        `;
        
        container.appendChild(particle);
      }
  
      if (!document.querySelector('#particleFloatStyle')) {
        const style = document.createElement('style');
        style.id = 'particleFloatStyle';
        style.textContent = `
          @keyframes particleFloat {
            0% {
              transform: translateY(100vh) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100px) rotate(360deg);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  
    // Performance optimizations
    setupPerformanceOptimizations() {
      // Use will-change for frequently animated elements
      const animatedElements = document.querySelectorAll('.anime-card, .floating-shape, .particle');
      animatedElements.forEach(el => {
        el.style.willChange = 'transform, opacity';
      });
  
      // Reduce animations on low-performance devices
      this.detectPerformance();
      
      // Cleanup animations when elements are out of view
      this.setupAnimationCleanup();
      
      // Pause animations when tab is not visible
      this.setupVisibilityOptimization();
    }
  
    detectPerformance() {
      // Simple performance detection
      const isLowPerformance = navigator.hardwareConcurrency < 4 || 
                             navigator.deviceMemory < 4 ||
                             /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
      
      if (isLowPerformance) {
        document.body.classList.add('low-performance');
        this.reduceAnimations();
      }
    }
  
    reduceAnimations() {
      // Reduce particle count
      const particles = document.querySelectorAll('.particle');
      particles.forEach((particle, index) => {
        if (index % 2 === 0) {
          particle.remove();
        }
      });
  
      // Reduce floating elements
      const floatingElements = document.querySelectorAll('.floating-shape');
      floatingElements.forEach((element, index) => {
        if (index > 3) {
          element.remove();
        }
      });
    }
  
    setupAnimationCleanup() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const element = entry.target;
          
          if (entry.isIntersecting) {
            element.style.animationPlayState = 'running';
          } else {
            element.style.animationPlayState = 'paused';
          }
        });
      }, { rootMargin: '100px' });
  
      // Observe animated elements
      const animatedElements = document.querySelectorAll('.floating-shape, .particle, [data-animate]');
      animatedElements.forEach(el => observer.observe(el));
    }
  
    setupVisibilityOptimization() {
      document.addEventListener('visibilitychange', () => {
        const animatedElements = document.querySelectorAll('.floating-shape, .particle');
        
        animatedElements.forEach(element => {
          if (document.hidden) {
            element.style.animationPlayState = 'paused';
          } else {
            element.style.animationPlayState = 'running';
          }
        });
      });
    }
  
    // Timeline animation system
    createTimeline() {
      return {
        animations: [],
        add: (element, properties, duration, delay = 0) => {
          this.animations.push({
            element,
            properties,
            duration,
            delay,
            startTime: null
          });
          return this;
        },
        play: () => {
          this.animations.forEach((anim, index) => {
            setTimeout(() => {
              this.animateElement(anim.element, anim.properties, anim.duration);
            }, anim.delay);
          });
        }
      };
    }
  
    animateElement(element, properties, duration) {
      if (this.isReducedMotion) return;
  
      const startValues = {};
      const endValues = {};
      
      // Parse properties
      Object.keys(properties).forEach(prop => {
        const currentValue = getComputedStyle(element)[prop];
        startValues[prop] = this.parseValue(currentValue);
        endValues[prop] = this.parseValue(properties[prop]);
      });
  
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = this.easeInOutCubic(progress);
  
        // Apply interpolated values
        Object.keys(properties).forEach(prop => {
          const startVal = startValues[prop];
          const endVal = endValues[prop];
          const current = startVal + (endVal - startVal) * easedProgress;
          
          element.style[prop] = this.formatValue(current, prop);
        });
  
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
  
      requestAnimationFrame(animate);
    }
  
    parseValue(value) {
      return parseFloat(value) || 0;
    }
  
    formatValue(value, property) {
      const units = {
        'opacity': '',
        'transform': 'px',
        'left': 'px',
        'top': 'px',
        'width': 'px',
        'height': 'px'
      };
  
      return value + (units[property] || '');
    }
  
    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
  
    // Advanced animation methods
    morphElement(element, targetShape, duration = 500) {
      if (this.isReducedMotion) return;
  
      const currentBounds = element.getBoundingClientRect();
      const morphContainer = document.createElement('div');
      
      morphContainer.style.cssText = `
        position: fixed;
        top: ${currentBounds.top}px;
        left: ${currentBounds.left}px;
        width: ${currentBounds.width}px;
        height: ${currentBounds.height}px;
        background: ${getComputedStyle(element).background};
        border-radius: ${getComputedStyle(element).borderRadius};
        z-index: 9999;
        pointer-events: none;
        transition: all ${duration}ms ${this.presets.smooth};
      `;
  
      document.body.appendChild(morphContainer);
      element.style.opacity = '0';
  
      requestAnimationFrame(() => {
        Object.assign(morphContainer.style, targetShape);
      });
  
      setTimeout(() => {
        morphContainer.remove();
        element.style.opacity = '';
      }, duration);
    }
  
    createStaggerAnimation(elements, animationType = 'fadeInUp', staggerDelay = 100) {
      elements.forEach((element, index) => {
        const delay = index * staggerDelay;
        
        setTimeout(() => {
          this.triggerAnimation(element, animationType);
        }, delay);
      });
    }
  
    triggerAnimation(element, type) {
      if (this.isReducedMotion) {
        element.style.opacity = '1';
        return;
      }
  
      const animations = {
        fadeInUp: 'fadeInUp 0.6s ease-out forwards',
        slideInLeft: 'slideInLeft 0.5s ease-out forwards',
        slideInRight: 'slideInRight 0.5s ease-out forwards',
        scaleIn: 'scaleIn 0.4s ease-out forwards',
        rotateIn: 'rotateIn 0.6s ease-out forwards'
      };
  
      element.style.animation = animations[type] || animations.fadeInUp;
      
      // Add keyframes if not already present
      this.ensureKeyframes();
    }
  
    ensureKeyframes() {
      if (document.querySelector('#advancedAnimationsStyle')) return;
  
      const style = document.createElement('style');
      style.id = 'advancedAnimationsStyle';
      style.textContent = `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
  
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
  
        @keyframes slideInRight {
          from {
            opacity: 0;  
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
  
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
  
        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-180deg) scale(0.8);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    }
  
    // Public API methods
    animateIn(element, type = 'fadeInUp', delay = 0) {
      setTimeout(() => {
        this.triggerAnimation(element, type);
      }, delay);
    }
  
    animateOut(element, callback) {
      if (this.isReducedMotion) {
        element.style.opacity = '0';
        if (callback) callback();
        return;
      }
  
      element.style.animation = 'fadeOut 0.3s ease-in forwards';
      
      setTimeout(() => {
        if (callback) callback();
      }, 300);
  
      // Add fadeOut keyframe
      if (!document.querySelector('#fadeOutStyle')) {
        const style = document.createElement('style');
        style.id = 'fadeOutStyle';
        style.textContent = `
          @keyframes fadeOut {
            to {
              opacity: 0;
              transform: translateY(-20px);
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  
    // Cleanup method
    destroy() {
      // Remove all created styles
      const createdStyles = document.querySelectorAll('[id$="Style"]');
      createdStyles.forEach(style => style.remove());
      
      // Clear animation timers
      this.animations.clear();
      
      // Remove event listeners
      document.removeEventListener('visibilitychange', this.setupVisibilityOptimization);
    }
  }
  
  // Initialize animation controller when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
  });
  
  // Export for use in other modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
  }