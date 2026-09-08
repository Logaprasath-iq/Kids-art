/**
 * LITTLE CANVAS — FILTERS & SEARCH SYSTEM
 * Handles Classes Category Filtering and Blog Real-Time Search & Category Filters
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. CLASS CATEGORY FILTERING ---
  const classFilterBtns = document.querySelectorAll('.class-filter-btn');
  const classCards = document.querySelectorAll('.filterable-class-card');

  if (classFilterBtns.length > 0 && classCards.length > 0) {
    classFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active button
        classFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        classCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 2. BLOG LIVE SEARCH, CATEGORY FILTER & PAGINATION ---
  const blogSearchInput = document.getElementById('blog-search-input');
  const blogCategoryBtns = document.querySelectorAll('.blog-filter-btn');
  const blogCards = document.querySelectorAll('.filterable-blog-card');
  const blogEmptyState = document.getElementById('blog-empty-state');
  const blogPagination = document.getElementById('blog-pagination');
  const paginationLinks = document.querySelectorAll('.pagination-number');
  const paginationPrev = document.getElementById('blog-pagination-prev');
  const paginationNext = document.getElementById('blog-pagination-next');
  const blogGridSection = document.getElementById('blog-grid-section');

  if (blogCards.length > 0) {
    let currentCategory = 'all';
    let currentSearchTerm = '';
    let currentPage = 1;

    const scrollToGrid = () => {
      if (blogGridSection) {
        const yOffset = -70;
        const y = blogGridSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    };

    const updatePaginationButtons = () => {
      if (paginationLinks.length > 0) {
        paginationLinks.forEach(link => {
          const page = parseInt(link.getAttribute('data-page') || link.textContent.trim(), 10);
          if (page === currentPage) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
      if (paginationPrev) {
        paginationPrev.style.display = (currentPage > 1) ? 'inline-flex' : 'none';
      }
      if (paginationNext) {
        paginationNext.style.display = (currentPage < 2) ? 'inline-flex' : 'none';
      }
    };

    const filterBlogPosts = (shouldScroll = false) => {
      const isFiltering = (currentCategory !== 'all' || currentSearchTerm !== '');
      let visibleCount = 0;

      blogCards.forEach(card => {
        const title = (card.querySelector('.blog-card-title')?.textContent || '').toLowerCase();
        const snippet = (card.querySelector('.blog-card-snippet')?.textContent || '').toLowerCase();
        const category = (card.getAttribute('data-category') || '').toLowerCase();
        const cardPage = parseInt(card.getAttribute('data-page') || '1', 10);

        const matchesCategory = (currentCategory === 'all' || category === currentCategory.toLowerCase());
        const matchesSearch = (!currentSearchTerm || title.includes(currentSearchTerm) || snippet.includes(currentSearchTerm));

        if (matchesCategory && matchesSearch) {
          if (isFiltering) {
            // When actively searching or category filtering, show all matching cards across all pages
            card.style.display = 'flex';
            visibleCount++;
          } else {
            // When browsing all articles, paginate: Page 1 shows cards with data-page="1", Page 2 shows data-page="2"
            if (cardPage === currentPage) {
              card.style.display = 'flex';
              visibleCount++;
            } else {
              card.style.display = 'none';
            }
          }
        } else {
          card.style.display = 'none';
        }
      });

      if (blogEmptyState) {
        blogEmptyState.style.display = (visibleCount === 0) ? 'block' : 'none';
      }

      // Hide pagination controls while actively filtering or searching
      if (blogPagination) {
        blogPagination.style.display = isFiltering ? 'none' : 'flex';
      }

      updatePaginationButtons();

      if (shouldScroll) {
        scrollToGrid();
      }
    };

    if (blogSearchInput) {
      blogSearchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim().toLowerCase();
        filterBlogPosts();
      });
    }

    if (blogCategoryBtns.length > 0) {
      blogCategoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          blogCategoryBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          currentCategory = btn.getAttribute('data-filter') || 'all';
          if (currentCategory === 'all') {
            currentPage = 1;
          }
          filterBlogPosts();
        });
      });
    }

    if (paginationLinks.length > 0) {
      paginationLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetPage = parseInt(link.getAttribute('data-page') || link.textContent.trim(), 10);
          if (targetPage && targetPage !== currentPage) {
            currentPage = targetPage;
            filterBlogPosts(true);
          }
        });
      });
    }

    if (paginationNext) {
      paginationNext.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < 2) {
          currentPage++;
          filterBlogPosts(true);
        }
      });
    }

    if (paginationPrev) {
      paginationPrev.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
          currentPage--;
          filterBlogPosts(true);
        }
      });
    }

    // Initialize initial state
    filterBlogPosts();
  }
});
