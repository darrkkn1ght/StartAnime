/**
 * StartAnime Utilities
 * Common utility functions for the StartAnime website
 */

// Animation utilities
export const AnimationUtils = {
    /**
     * Fade in element with upward motion
     * @param {Element} element - DOM element to animate
     * @param {number} delay - Animation delay in ms
     */
    fadeInUp(element, delay = 0) {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, delay);
    },
  
    /**
     * Stagger animation for multiple elements
     * @param {NodeList} elements - Elements to animate
     * @param {number} staggerDelay - Delay between each element
     */
    staggerFadeIn(elements, staggerDelay = 100) {
      elements.forEach((element, index) => {
        this.fadeInUp(element, index * staggerDelay);
      });
    },
  
    /**
     * Add hover lift effect to element
     * @param {Element} element - DOM element
     */
    addHoverLift(element) {
      element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'translateY(-4px)';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translateY(0)';
      });
    }
  };
  
  // DOM utilities
  export const DOMUtils = {
    /**
     * Wait for DOM to be ready
     * @param {Function} callback - Function to execute when ready
     */
    ready(callback) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback();
      }
    },
  
    /**
     * Create element with classes and attributes
     * @param {string} tag - HTML tag name
     * @param {Object} options - Element options
     * @returns {Element} Created element
     */
    createElement(tag, options = {}) {
      const element = document.createElement(tag);
      
      if (options.classes) {
        element.classList.add(...options.classes);
      }
      
      if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
          element.setAttribute(key, value);
        });
      }
      
      if (options.innerHTML) {
        element.innerHTML = options.innerHTML;
      }
      
      if (options.textContent) {
        element.textContent = options.textContent;
      }
      
      return element;
    },
  
    /**
     * Smooth scroll to element
     * @param {string|Element} target - Selector string or DOM element
     * @param {number} offset - Offset from top in pixels
     */
    smoothScrollTo(target, offset = 0) {
      const element = typeof target === 'string' ? document.querySelector(target) : target;
      if (!element) return;
      
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  // Anime data utilities
  export const AnimeUtils = {
    /**
     * Get anime by ID from data
     * @param {Array} animeList - Array of anime objects
     * @param {number} id - Anime ID
     * @returns {Object|null} Anime object or null
     */
    getAnimeById(animeList, id) {
      return animeList.find(anime => anime.id === id) || null;
    },
  
    /**
     * Filter anime by genre
     * @param {Array} animeList - Array of anime objects
     * @param {string} genre - Genre to filter by
     * @returns {Array} Filtered anime array
     */
    filterByGenre(animeList, genre) {
      return animeList.filter(anime => 
        anime.genres && anime.genres.includes(genre)
      );
    },
  
    /**
     * Get random anime from list
     * @param {Array} animeList - Array of anime objects
     * @param {number} count - Number of random anime to get
     * @returns {Array} Array of random anime
     */
    getRandomAnime(animeList, count = 1) {
      const shuffled = [...animeList].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },
  
    /**
     * Format anime rating for display
     * @param {number} rating - Rating value
     * @returns {string} Formatted rating
     */
    formatRating(rating) {
      if (!rating) return 'N/A';
      return `★ ${rating.toFixed(1)}`;
    },
  
    /**
     * Get difficulty level based on rating and complexity
     * @param {Object} anime - Anime object
     * @returns {string} Difficulty level
     */
    getDifficultyLevel(anime) {
      if (anime.beginner_friendly === true) return 'Beginner';
      if (anime.episodes && anime.episodes <= 13) return 'Easy';
      if (anime.rating && anime.rating >= 8.5) return 'Intermediate';
      return 'Advanced';
    }
  };
  
  // Local storage utilities
  export const StorageUtils = {
    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     */
    save(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.warn('Could not save to localStorage:', error);
      }
    },
  
    /**
     * Load data from localStorage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} Stored data or default value
     */
    load(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.warn('Could not load from localStorage:', error);
        return defaultValue;
      }
    },
  
    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     */
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Could not remove from localStorage:', error);
      }
    }
  };
  
  // Validation utilities
  export const ValidationUtils = {
    /**
     * Check if email is valid
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
  
    /**
     * Check if string is not empty
     * @param {string} str - String to check
     * @returns {boolean} True if not empty
     */
    isNotEmpty(str) {
      return str && str.trim().length > 0;
    },
  
    /**
     * Sanitize HTML string
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    sanitizeHTML(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  };
  
  // Performance utilities
  export const PerformanceUtils = {
    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
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
    },
  
    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in ms
     * @returns {Function} Throttled function
     */
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
    },
  
    /**
     * Lazy load images when they come into view
     * @param {string} selector - Image selector
     */
    lazyLoadImages(selector = 'img[data-src]') {
      const images = document.querySelectorAll(selector);
      
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  };
  
  // Mobile utilities
  export const MobileUtils = {
    /**
     * Check if device is mobile
     * @returns {boolean} True if mobile
     */
    isMobile() {
      return window.innerWidth <= 768;
    },
  
    /**
     * Check if device is tablet
     * @returns {boolean} True if tablet
     */
    isTablet() {
      return window.innerWidth > 768 && window.innerWidth <= 1024;
    },
  
    /**
     * Check if device is desktop
     * @returns {boolean} True if desktop
     */
    isDesktop() {
      return window.innerWidth > 1024;
    },
  
    /**
     * Add touch event handlers for better mobile experience
     * @param {Element} element - Element to add touch events to
     * @param {Object} handlers - Object with touch event handlers
     */
    addTouchEvents(element, handlers) {
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
  };
  
  // Initialize utilities when DOM is ready
  DOMUtils.ready(() => {
    // Auto-apply hover lift to cards
    const cards = document.querySelectorAll('.card, .anime-card, .genre-card');
    cards.forEach(card => AnimationUtils.addHoverLift(card));
    
    // Initialize lazy loading for images
    PerformanceUtils.lazyLoadImages();
    
    // Stagger fade in animation for main content
    const animatedElements = document.querySelectorAll('.fade-in-up');
    if (animatedElements.length > 0) {
      AnimationUtils.staggerFadeIn(animatedElements, 150);
    }
  });
  
  // Export default object with all utilities
  export default {
    AnimationUtils,
    DOMUtils,
    AnimeUtils,
    StorageUtils,
    ValidationUtils,
    PerformanceUtils,
    MobileUtils
  };