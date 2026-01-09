/**
 * Navigation and Sidebar Functionality
 * Handles sidebar toggle, collapsible menu items, active page highlighting, and mobile interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const mobileToggle = document.getElementById('mobileToggle');
  const sidebarToggle = document.getElementById('sidebarToggle');
  
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
});
