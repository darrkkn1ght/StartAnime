/**
 * StartAnime - Recommendations Logic
 * Handles personalized anime recommendations based on user mood/preferences
 */

class RecommendationEngine {
    constructor() {
        this.recommendations = null;
        this.currentCategory = null;
        this.isLoading = false;
        this.init();
    }

    async init() {
        try {
            await this.loadRecommendations();
            this.bindEvents();
            this.animateOnLoad();
        } catch (error) {
            console.error('Failed to initialize recommendations:', error);
            this.showError();
        }
    }

    async loadRecommendations() {
        try {
            const response = await fetch('./data/recommendations.json');
            if (!response.ok) throw new Error('Failed to load recommendations');
            this.recommendations = await response.json();
        } catch (error) {
            console.error('Error loading recommendations:', error);
            throw error;
        }
    }

    bindEvents() {
        // Mood selection buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleMoodSelection(e));
        });

        // Anime card interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.anime-card')) {
                this.handleAnimeCardClick(e.target.closest('.anime-card'));
            }
            if (e.target.closest('.add-to-list-btn')) {
                this.handleAddToList(e.target.closest('.add-to-list-btn'));
            }
        });

        // Reset recommendations
        const resetBtn = document.querySelector('.reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetRecommendations());
        }

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
    }

    handleMoodSelection(event) {
        const button = event.currentTarget;
        const mood = button.dataset.mood;
        
        if (this.isLoading) return;
        
        // Update button states
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Show recommendations for selected mood
        this.showRecommendations(mood);
        
        // Smooth scroll to results
        setTimeout(() => {
            const resultsSection = document.querySelector('.recommendations-results');
            if (resultsSection) {
                resultsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    }

    showRecommendations(mood) {
        if (!this.recommendations?.categories?.[mood]) {
            console.error(`No recommendations found for mood: ${mood}`);
            return;
        }

        this.currentCategory = mood;
        const categoryData = this.recommendations.categories[mood];
        const resultsContainer = document.querySelector('.recommendations-results');
        
        if (!resultsContainer) return;

        // Show loading state
        this.isLoading = true;
        resultsContainer.innerHTML = this.createLoadingHTML();
        resultsContainer.classList.remove('hidden');

        // Simulate loading delay for smooth UX
        setTimeout(() => {
            resultsContainer.innerHTML = this.createRecommendationsHTML(categoryData, mood);
            this.animateResults();
            this.isLoading = false;
        }, 800);
    }

    createLoadingHTML() {
        return `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-text">Finding perfect anime for you...</p>
            </div>
        `;
    }

    createRecommendationsHTML(categoryData, mood) {
        const moodEmojis = {
            hyped: '🔥',
            emotional: '💫',
            comedy: '😄',
            short: '⚡'
        };

        return `
            <div class="recommendations-header">
                <h2 class="recommendations-title">
                    ${moodEmojis[mood]} ${categoryData.title}
                </h2>
                <p class="recommendations-subtitle">${categoryData.description}</p>
            </div>
            
            <div class="anime-grid">
                ${categoryData.anime.map((anime, index) => this.createAnimeCardHTML(anime, index)).join('')}
            </div>
            
            <div class="recommendations-footer">
                <button class="btn-secondary reset-btn">
                    Try Different Mood
                </button>
                <p class="recommendation-note">
                    All recommendations are beginner-friendly with English subtitles available
                </p>
            </div>
        `;
    }

    createAnimeCardHTML(anime, index) {
        return `
            <div class="anime-card" data-anime-id="${anime.id}" style="animation-delay: ${index * 0.1}s">
                <div class="anime-image-container">
                    <img src="${anime.image}" alt="${anime.title}" class="anime-image" loading="lazy">
                    <div class="anime-overlay">
                        <div class="anime-rating">
                            <span class="rating-star">⭐</span>
                            <span class="rating-value">${anime.rating}</span>
                        </div>
                        <div class="anime-duration">
                            <span class="duration-icon">⏱️</span>
                            <span class="duration-value">${anime.episodes} eps</span>
                        </div>
                    </div>
                </div>
                
                <div class="anime-content">
                    <h3 class="anime-title">${anime.title}</h3>
                    <p class="anime-genre">${anime.genres.join(' • ')}</p>
                    <p class="anime-description">${anime.description}</p>
                    
                    <div class="anime-tags">
                        ${anime.tags.map(tag => `<span class="anime-tag">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="anime-actions">
                        <button class="btn-primary add-to-list-btn" data-anime-id="${anime.id}">
                            Add to My List
                        </button>
                        <button class="btn-secondary learn-more-btn" data-anime-id="${anime.id}">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    handleAnimeCardClick(card) {
        const animeId = card.dataset.animeId;
        const anime = this.findAnimeById(animeId);
        
        if (anime) {
            this.showAnimeDetails(anime);
        }
    }

    handleAddToList(button) {
        const animeId = button.dataset.animeId;
        const anime = this.findAnimeById(animeId);
        
        if (anime) {
            // Add to user's list (stored in localStorage for now)
            this.addToUserList(anime);
            
            // Update button state
            button.innerHTML = '✓ Added!';
            button.classList.add('added');
            button.disabled = true;
            
            // Show success notification
            this.showNotification(`${anime.title} added to your list!`, 'success');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.innerHTML = 'Add to My List';
                button.classList.remove('added');
                button.disabled = false;
            }, 3000);
        }
    }

    addToUserList(anime) {
        let userList = JSON.parse(localStorage.getItem('startanime_userlist') || '[]');
        
        // Check if anime is already in list
        if (!userList.find(item => item.id === anime.id)) {
            userList.push({
                id: anime.id,
                title: anime.title,
                image: anime.image,
                addedAt: new Date().toISOString()
            });
            localStorage.setItem('startanime_userlist', JSON.stringify(userList));
        }
    }

    findAnimeById(id) {
        if (!this.recommendations) return null;
        
        for (const category of Object.values(this.recommendations.categories)) {
            const anime = category.anime.find(a => a.id === id);
            if (anime) return anime;
        }
        return null;
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.showAllCurrentRecommendations();
            return;
        }

        const filteredResults = this.searchAnime(query);
        this.displaySearchResults(filteredResults, query);
    }

    searchAnime(query) {
        if (!this.recommendations) return [];
        
        const results = [];
        const searchTerm = query.toLowerCase();
        
        for (const [categoryKey, category] of Object.entries(this.recommendations.categories)) {
            category.anime.forEach(anime => {
                if (
                    anime.title.toLowerCase().includes(searchTerm) ||
                    anime.genres.some(genre => genre.toLowerCase().includes(searchTerm)) ||
                    anime.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                    anime.description.toLowerCase().includes(searchTerm)
                ) {
                    results.push({ ...anime, category: categoryKey });
                }
            });
        }
        
        return results;
    }

    displaySearchResults(results, query) {
        const resultsContainer = document.querySelector('.recommendations-results');
        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No anime found for "${query}"</h3>
                    <p>Try searching for genres like "action", "comedy", or specific titles</p>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = `
            <div class="search-results-header">
                <h2>Search Results for "${query}"</h2>
                <p>Found ${results.length} anime matching your search</p>
            </div>
            <div class="anime-grid">
                ${results.map((anime, index) => this.createAnimeCardHTML(anime, index)).join('')}
            </div>
        `;
        
        this.animateResults();
    }

    resetRecommendations() {
        // Clear active states
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Hide results
        const resultsContainer = document.querySelector('.recommendations-results');
        if (resultsContainer) {
            resultsContainer.classList.add('hidden');
        }
        
        // Clear search
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Smooth scroll back to mood selection
        const moodSection = document.querySelector('.mood-selection');
        if (moodSection) {
            moodSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        this.currentCategory = null;
    }

    animateOnLoad() {
        // Animate mood buttons on page load
        const moodButtons = document.querySelectorAll('.mood-btn');
        moodButtons.forEach((btn, index) => {
            setTimeout(() => {
                btn.classList.add('fade-in-up');
            }, index * 100);
        });
    }

    animateResults() {
        const cards = document.querySelectorAll('.anime-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, index * 100);
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    showError() {
        const resultsContainer = document.querySelector('.recommendations-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="error-container">
                    <h3>Oops! Something went wrong</h3>
                    <p>We couldn't load the recommendations. Please try refreshing the page.</p>
                    <button class="btn-primary" onclick="location.reload()">Refresh Page</button>
                </div>
            `;
            resultsContainer.classList.remove('hidden');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RecommendationEngine();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RecommendationEngine;
}