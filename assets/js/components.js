/**
 * Component Loading System for StartAnime
 * Handles dynamic loading and injection of HTML components
 */

class ComponentLoader {
    constructor() {
        this.components = new Map();
        this.loadedComponents = new Set();
        this.componentCache = new Map();
    }

    /**
     * Initialize the component loader
     */
    async init() {
        console.log('ComponentLoader: Initializing...');
        await this.preloadComponents();
        this.setupComponentPlaceholders();
    }

    /**
     * Preload commonly used components
     */
    async preloadComponents() {
        const commonComponents = ['header', 'footer', 'anime-card', 'genre-card'];
        
        for (const componentName of commonComponents) {
            try {
                await this.loadComponent(componentName);
            } catch (error) {
                console.warn(`ComponentLoader: Failed to preload ${componentName}:`, error);
            }
        }
    }

    /**
     * Load a component from the components folder
     */
    async loadComponent(componentName) {
        if (this.componentCache.has(componentName)) {
            return this.componentCache.get(componentName);
        }

        try {
            // Try to load template first, then fallback to full HTML
            let response = await fetch(`./components/${componentName}-template.html`);
            if (!response.ok) {
                // Fallback to original component file
                response = await fetch(`./components/${componentName}.html`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            }
            
            const html = await response.text();
            const componentHTML = this.extractComponentContent(html, componentName);
            
            this.componentCache.set(componentName, componentHTML);
            console.log(`ComponentLoader: Loaded component "${componentName}"`);
            
            return componentHTML;
        } catch (error) {
            console.error(`ComponentLoader: Failed to load component "${componentName}":`, error);
            throw error;
        }
    }

    /**
     * Extract the relevant content from a component HTML file
     */
    extractComponentContent(html, componentName) {
        // Check if this is a template file (no HTML structure)
        if (html.includes('<!--') && html.includes('Component Template -->')) {
            // This is a template file, return the content directly
            return html.trim();
        }
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract the main content based on component type
        let content = '';
        
        switch (componentName) {
            case 'header':
                // Extract header navigation content
                const headerNav = doc.querySelector('.header__nav');
                if (headerNav) {
                    content = headerNav.outerHTML;
                } else {
                    // Fallback: extract body content
                    const body = doc.querySelector('body');
                    if (body) {
                        content = body.innerHTML;
                    }
                }
                break;
                
            case 'footer':
                // Extract footer content
                const footer = doc.querySelector('.footer');
                if (footer) {
                    content = footer.outerHTML;
                } else {
                    // Fallback: extract body content
                    const body = doc.querySelector('body');
                    if (body) {
                        content = body.innerHTML;
                    }
                }
                break;
                
            case 'anime-card':
                // Extract anime card template
                const animeCard = doc.querySelector('.anime-card');
                if (animeCard) {
                    content = animeCard.outerHTML;
                }
                break;
                
            case 'genre-card':
                // Extract genre card template
                const genreCard = doc.querySelector('.genre-card');
                if (genreCard) {
                    content = genreCard.outerHTML;
                }
                break;
                
            default:
                // Default: extract body content
                const body = doc.querySelector('body');
                if (body) {
                    content = body.innerHTML;
                }
        }
        
        return content;
    }

    /**
     * Setup component placeholders in the current page
     */
    setupComponentPlaceholders() {
        // Look for component placeholders
        const placeholders = document.querySelectorAll('[data-component]');
        
        placeholders.forEach(async (placeholder) => {
            const componentName = placeholder.getAttribute('data-component');
            const componentData = placeholder.getAttribute('data-component-data');
            
            try {
                const componentHTML = await this.loadComponent(componentName);
                const processedHTML = this.processComponentTemplate(componentHTML, componentData);
                
                placeholder.innerHTML = processedHTML;
                placeholder.classList.add('component-loaded');
                
                // Trigger custom event for component loaded
                const event = new CustomEvent('componentLoaded', {
                    detail: { componentName, element: placeholder }
                });
                document.dispatchEvent(event);
                
            } catch (error) {
                console.error(`ComponentLoader: Failed to load component "${componentName}":`, error);
                placeholder.innerHTML = `<div class="component-error">Failed to load component: ${componentName}</div>`;
            }
        });
    }

    /**
     * Process component template with data
     */
    processComponentTemplate(template, dataString) {
        if (!dataString) return template;
        
        try {
            const data = JSON.parse(dataString);
            let processedTemplate = template;
            
            // Replace placeholders with data
            Object.keys(data).forEach(key => {
                const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                processedTemplate = processedTemplate.replace(placeholder, data[key]);
            });
            
            return processedTemplate;
        } catch (error) {
            console.warn('ComponentLoader: Failed to process component data:', error);
            return template;
        }
    }

    /**
     * Inject a component into a specific element
     */
    async injectComponent(componentName, targetElement, data = null) {
        try {
            const componentHTML = await this.loadComponent(componentName);
            const processedHTML = this.processComponentTemplate(componentHTML, data ? JSON.stringify(data) : null);
            
            targetElement.innerHTML = processedHTML;
            targetElement.classList.add('component-loaded');
            
            // Trigger custom event
            const event = new CustomEvent('componentInjected', {
                detail: { componentName, element: targetElement }
            });
            document.dispatchEvent(event);
            
            return true;
        } catch (error) {
            console.error(`ComponentLoader: Failed to inject component "${componentName}":`, error);
            return false;
        }
    }

    /**
     * Create a component instance with data
     */
    async createComponent(componentName, data = null) {
        try {
            const componentHTML = await this.loadComponent(componentName);
            const processedHTML = this.processComponentTemplate(componentHTML, data ? JSON.stringify(data) : null);
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = processedHTML;
            
            return tempDiv.firstElementChild;
        } catch (error) {
            console.error(`ComponentLoader: Failed to create component "${componentName}":`, error);
            return null;
        }
    }

    /**
     * Replace existing navigation with component-based navigation
     */
    async replaceNavigation() {
        const existingNav = document.querySelector('.navbar');
        if (!existingNav) return;
        
        try {
            const headerComponent = await this.loadComponent('header');
            const headerNav = this.extractNavigationFromHeader(headerComponent);
            
            if (headerNav) {
                existingNav.innerHTML = headerNav;
                existingNav.classList.add('component-loaded');
                
                // Reinitialize navigation functionality
                this.initializeNavigationAfterLoad();
            }
        } catch (error) {
            console.error('ComponentLoader: Failed to replace navigation:', error);
        }
    }

    /**
     * Extract navigation from header component
     */
    extractNavigationFromHeader(headerHTML) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(headerHTML, 'text/html');
        
        // Look for navigation elements
        const nav = doc.querySelector('.header__nav') || 
                   doc.querySelector('.nav-links') || 
                   doc.querySelector('nav');
        
        return nav ? nav.outerHTML : null;
    }

    /**
     * Initialize navigation functionality after component load
     */
    initializeNavigationAfterLoad() {
        // Re-setup active navigation
        const navLinks = document.querySelectorAll('.nav-link, .header__nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Setup mobile menu
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-links, .header__nav');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('open');
                mobileMenuBtn.classList.toggle('active');
            });
        }
    }

    /**
     * Replace existing footer with component-based footer
     */
    async replaceFooter() {
        const existingFooter = document.querySelector('.footer');
        if (!existingFooter) return;
        
        try {
            const footerComponent = await this.loadComponent('footer');
            const footerContent = this.extractFooterContent(footerComponent);
            
            if (footerContent) {
                existingFooter.innerHTML = footerContent;
                existingFooter.classList.add('component-loaded');
            }
        } catch (error) {
            console.error('ComponentLoader: Failed to replace footer:', error);
        }
    }

    /**
     * Extract footer content from footer component
     */
    extractFooterContent(footerHTML) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(footerHTML, 'text/html');
        
        const footer = doc.querySelector('.footer__content') || 
                      doc.querySelector('.footer-content') || 
                      doc.querySelector('footer');
        
        return footer ? footer.innerHTML : null;
    }

    /**
     * Create anime cards from component template
     */
    async createAnimeCards(animeData) {
        const cards = [];
        
        for (const anime of animeData) {
            const card = await this.createComponent('anime-card', {
                title: anime.title,
                image: anime.image,
                description: anime.description,
                rating: anime.rating,
                genres: anime.genres.join(', '),
                episodes: anime.episodes,
                year: anime.year
            });
            
            if (card) {
                cards.push(card);
            }
        }
        
        return cards;
    }

    /**
     * Create genre cards from component template
     */
    async createGenreCards(genreData) {
        const cards = [];
        
        for (const genre of genreData) {
            const card = await this.createComponent('genre-card', {
                name: genre.name,
                description: genre.description,
                icon: genre.icon,
                examples: genre.examples.join(', ')
            });
            
            if (card) {
                cards.push(card);
            }
        }
        
        return cards;
    }

    /**
     * Clear component cache
     */
    clearCache() {
        this.componentCache.clear();
        console.log('ComponentLoader: Cache cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            cachedComponents: this.componentCache.size,
            loadedComponents: this.loadedComponents.size
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentLoader;
} else {
    window.ComponentLoader = ComponentLoader;
} 