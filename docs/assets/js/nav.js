/**
 * Navigation and Sidebar Functionality
 * Handles sidebar toggle, collapsible menu items, active page highlighting, and mobile interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const mobileToggle = document.getElementById('mobileToggle');
  const sidebarToggle = document.getElementById('sidebarToggle');
  
  /**
   * Restore sidebar collapsed state from localStorage
   */
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (isCollapsed && sidebar) {
    sidebar.classList.add('collapsed');
    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
      contentWrapper.classList.add('expanded');
    }
  }
  
  /**
   * Mobile sidebar toggle
   */
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      sidebar.classList.toggle('active');
      document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    });
  }
  
  /**
   * Desktop sidebar collapse toggle
   */
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      document.querySelector('.content-wrapper').classList.toggle('expanded');
      
      // Save state to localStorage
      const collapsed = sidebar.classList.contains('collapsed');
      localStorage.setItem('sidebarCollapsed', collapsed);
    });
  }
  
  /**
   * Close sidebar on ESC key (mobile)
   */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  /**
   * Close sidebar when clicking on overlay (mobile)
   */
  document.addEventListener('click', function(e) {
    // Only on mobile viewports
    if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
      const rect = sidebar.getBoundingClientRect();
      // Check if click is outside the sidebar (on the overlay)
      if (e.clientX >= rect.right || e.clientX < rect.left) {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
  
  /**
   * Collapsible menu items
   */
  const navLinksWithChildren = document.querySelectorAll('.nav-link.has-children');
  
  navLinksWithChildren.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      const submenu = document.getElementById(targetId);
      const chevron = this.querySelector('.chevron');
      
      // Ensure elements exist before manipulating
      if (submenu) {
        // Toggle submenu
        submenu.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        const isExpanded = submenu.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
      }
      
      if (chevron) {
        chevron.classList.toggle('rotate');
      }
    });
    
    // Initialize aria-expanded attribute
    link.setAttribute('aria-expanded', 'false');
  });
  
  /**
   * Highlight active page in navigation
   */
  const currentPath = window.location.pathname;
  const allLinks = document.querySelectorAll('.nav-link, .nav-sublink');
  
  allLinks.forEach(function(link) {
    try {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      
      // Use exact match for precise highlighting
      if (currentPath === linkPath) {
        link.classList.add('active');
        
        // Expand parent menu if sublink is active
        if (link.classList.contains('nav-sublink')) {
          const submenu = link.closest('.nav-submenu');
          if (submenu) {
            submenu.classList.add('active');
            const parentLink = submenu.previousElementSibling;
            if (parentLink && parentLink.classList.contains('has-children')) {
              parentLink.querySelector('.chevron')?.classList.add('rotate');
              parentLink.setAttribute('aria-expanded', 'true');
            }
          }
        }
      }
    } catch (e) {
      // Skip invalid URLs
      console.warn('Invalid URL in navigation:', link.href);
    }
  });
  
  /**
   * Ensure sidebar is scrollable and position is maintained
   */
  window.addEventListener('resize', function() {
    // Close mobile sidebar on resize to larger screen
    if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
      sidebar.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  /**
   * Search functionality
   */
  const searchInput = document.getElementById('searchInput');
  
  /**
   * Escape special regex characters in user input
   */
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  /**
   * Highlight matching text safely
   */
  function highlightText(element, searchTerm) {
    const text = element.textContent;
    const escapedTerm = escapeRegex(searchTerm);
    const regex = new RegExp('(' + escapedTerm + ')', 'gi');
    
    // Clear existing content
    element.textContent = '';
    
    // Split text and create text nodes with mark elements
    const parts = text.split(regex);
    parts.forEach(function(part) {
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        const mark = document.createElement('mark');
        mark.textContent = part;
        element.appendChild(mark);
      } else if (part) {
        element.appendChild(document.createTextNode(part));
      }
    });
  }
  
  /**
   * Reset element to plain text
   */
  function resetText(element) {
    const text = element.textContent;
    element.textContent = text;
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase().trim();
      const navItems = document.querySelectorAll('.nav-item');
      
      if (searchTerm === '') {
        // Show all items when search is empty
        navItems.forEach(function(item) {
          item.style.display = '';
          // Reset any highlighted text
          const navLink = item.querySelector('.nav-link span');
          if (navLink) {
            resetText(navLink);
          }
          const sublinks = item.querySelectorAll('.nav-sublink');
          sublinks.forEach(function(sublink) {
            sublink.style.display = '';
            resetText(sublink);
          });
        });
        return;
      }
      
      // Filter and highlight matching items
      navItems.forEach(function(item) {
        const navLink = item.querySelector('.nav-link span');
        const navLinkText = navLink ? navLink.textContent.toLowerCase() : '';
        const sublinks = item.querySelectorAll('.nav-sublink');
        
        let hasMatch = navLinkText.includes(searchTerm);
        let hasSubMatch = false;
        
        // Check sublinks
        sublinks.forEach(function(sublink) {
          const sublinkText = sublink.textContent.toLowerCase();
          if (sublinkText.includes(searchTerm)) {
            hasSubMatch = true;
            sublink.style.display = '';
            // Highlight matching text safely
            highlightText(sublink, searchTerm);
          } else {
            sublink.style.display = 'none';
          }
        });
        
        // Show/hide nav item based on matches
        if (hasMatch || hasSubMatch) {
          item.style.display = '';
          
          // Highlight main nav link if it matches
          if (hasMatch && navLink) {
            highlightText(navLink, searchTerm);
          }
          
          // Auto-expand submenu if subitems match
          if (hasSubMatch) {
            const submenu = item.querySelector('.nav-submenu');
            if (submenu) {
              submenu.classList.add('active');
              const parentLink = item.querySelector('.has-children .chevron');
              if (parentLink) {
                parentLink.classList.add('rotate');
              }
            }
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
});
