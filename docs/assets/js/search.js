/**
 * Documentation Search Functionality
 * Provides client-side search across all documentation pages
 */

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchResultsContainer = createSearchResultsContainer();
  
  let searchIndex = [];
  
  /**
   * Create search results container
   */
  function createSearchResultsContainer() {
    const container = document.createElement('div');
    container.id = 'searchResults';
    container.className = 'search-results hidden';
    container.setAttribute('role', 'listbox');
    container.setAttribute('aria-label', 'Search results');
    
    // Insert after search input
    const searchDiv = document.querySelector('.sidebar-search');
    if (searchDiv) {
      searchDiv.appendChild(container);
    }
    
    return container;
  }
  
  /**
   * Load search index
   */
  async function loadSearchIndex() {
    try {
      // Try to detect the base URL from the page location
      const baseUrl = document.querySelector('base')?.href || 
                      (window.location.pathname.includes('/Salesforce-GitHub-Test/') ? '/Salesforce-GitHub-Test' : '');
      const searchIndexUrl = baseUrl ? `${baseUrl}/search-index.json` : './search-index.json';
      
      const response = await fetch(searchIndexUrl);
      if (!response.ok) {
        console.warn('Search index not found');
        return false;
      }
      searchIndex = await response.json();
      return true;
    } catch (error) {
      console.warn('Failed to load search index:', error);
      return false;
    }
  }
  
  /**
   * Simple search implementation using string matching and scoring
   */
  function search(query) {
    if (!searchIndex || searchIndex.length === 0 || !query || query.trim().length < 2) {
      hideSearchResults();
      return [];
    }
    
    const queryLower = query.toLowerCase().trim();
    const queryTerms = queryLower.split(/\s+/);
    
    // Score each document
    const results = searchIndex.map(doc => {
      let score = 0;
      const titleLower = doc.title.toLowerCase();
      const contentLower = doc.content.toLowerCase();
      
      // Check each query term
      queryTerms.forEach(term => {
        // Title matches are worth more
        if (titleLower.includes(term)) {
          score += 10;
          // Exact title match is worth even more
          if (titleLower === term) {
            score += 20;
          }
        }
        
        // Content matches
        if (contentLower.includes(term)) {
          score += 1;
          // Count occurrences
          const matches = contentLower.split(term).length - 1;
          score += matches * 0.5;
        }
      });
      
      return { ...doc, score };
    })
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
    
    return results;
  }
  
  /**
   * Get excerpt with highlighted search term
   */
  function getExcerpt(content, query) {
    const maxLength = 150;
    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    const index = contentLower.indexOf(queryLower);
    
    if (index === -1) {
      // Return first part of content
      return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
    }
    
    // Find a good starting point (beginning of sentence or word)
    let start = Math.max(0, index - 50);
    if (start > 0) {
      const spaceIndex = content.indexOf(' ', start);
      if (spaceIndex !== -1 && spaceIndex < index) {
        start = spaceIndex + 1;
      }
    }
    
    let end = Math.min(content.length, start + maxLength);
    const spaceIndex = content.lastIndexOf(' ', end);
    if (spaceIndex > start) {
      end = spaceIndex;
    }
    
    let excerpt = content.substring(start, end);
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';
    
    return excerpt;
  }
  
  /**
   * Highlight search terms in text
   */
  function highlightTerms(text, query) {
    const terms = query.trim().split(/\s+/);
    let highlighted = text;
    
    terms.forEach(term => {
      if (term.length < 2) return;
      const regex = new RegExp('(' + escapeRegex(term) + ')', 'gi');
      highlighted = highlighted.replace(regex, '<mark>$1</mark>');
    });
    
    return highlighted;
  }
  
  /**
   * Escape special regex characters
   */
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  /**
   * Display search results
   */
  function displaySearchResults(results, query) {
    if (results.length === 0) {
      searchResultsContainer.innerHTML = '<div class="search-no-results">No results found</div>';
      searchResultsContainer.classList.remove('hidden');
      return;
    }
    
    const html = results.map((result, index) => {
      const excerpt = getExcerpt(result.content, query);
      return `
        <a href="${result.url}" class="search-result-item" role="option" data-index="${index}">
          <div class="search-result-title">${highlightTerms(result.title, query)}</div>
          <div class="search-result-excerpt">${highlightTerms(excerpt, query)}</div>
          <div class="search-result-url">${result.url}</div>
        </a>
      `;
    }).join('');
    
    searchResultsContainer.innerHTML = html;
    searchResultsContainer.classList.remove('hidden');
  }
  
  /**
   * Hide search results
   */
  function hideSearchResults() {
    searchResultsContainer.classList.add('hidden');
  }
  
  /**
   * Handle search input
   */
  if (searchInput) {
    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value;
      
      // Clear previous timeout
      clearTimeout(searchTimeout);
      
      // Debounce search
      searchTimeout = setTimeout(() => {
        if (query.trim().length < 2) {
          hideSearchResults();
          return;
        }
        
        const results = search(query);
        displaySearchResults(results, query);
      }, 300);
    });
    
    // Handle Enter key
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = e.target.value.trim();
        
        if (query.length >= 2) {
          const results = search(query);
          if (results.length > 0) {
            // Navigate to first result
            window.location.href = results[0].url;
          }
        }
      } else if (e.key === 'Escape') {
        hideSearchResults();
        searchInput.blur();
      }
    });
    
    // Close results when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchResultsContainer.contains(e.target)) {
        hideSearchResults();
      }
    });
  }
  
  // Initialize search index
  loadSearchIndex();
});
