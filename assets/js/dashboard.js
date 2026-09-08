/**
 * LITTLE CANVAS — ADMIN DASHBOARD JAVASCRIPT
 * Modern SaaS UI, Chart.js Integrations, Sidebar Toggles, Table Search & Filters
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. SIDEBAR TOGGLE (DESKTOP & MOBILE) ---
  const adminSidebar = document.querySelector('.admin-sidebar');
  const sidebarToggleBtn = document.getElementById('admin-sidebar-toggle');

  if (sidebarToggleBtn && adminSidebar) {
    sidebarToggleBtn.addEventListener('click', () => {
      adminSidebar.classList.toggle('mobile-open');
    });

    document.addEventListener('click', (e) => {
      if (!adminSidebar.contains(e.target) && !sidebarToggleBtn.contains(e.target) && window.innerWidth <= 991) {
        adminSidebar.classList.remove('mobile-open');
      }
    });
  }

  // --- 2. CHART.JS CHARTS ---
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(36, 32, 68, 0.06)';
  const textColor = isDark ? '#A5A0C2' : '#716C88';

  // A. Revenue Area Chart (Dashboard)
  const revenueChartCanvas = document.getElementById('revenueChart');
  if (revenueChartCanvas && window.Chart) {
    new Chart(revenueChartCanvas, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Revenue ($)',
          data: [14200, 16800, 19400, 22100, 24800, 28500, 31200, 34000, 38900, 42000, 46500, 52000],
          borderColor: '#FF5C8A',
          backgroundColor: 'rgba(255, 92, 138, 0.12)',
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointBackgroundColor: '#FF5C8A',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, callback: (v) => '$' + v.toLocaleString() } }
        }
      }
    });
  }

  // B. Student Growth Bar Chart
  const studentGrowthCanvas = document.getElementById('studentGrowthChart');
  if (studentGrowthCanvas && window.Chart) {
    new Chart(studentGrowthCanvas, {
      type: 'bar',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
          label: 'New Enrollments',
          data: [42, 58, 75, 92, 110, 135],
          backgroundColor: '#6C63FF',
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor } }
        }
      }
    });
  }

  // C. Class Enrollment Doughnut
  const categoryChartCanvas = document.getElementById('categoryDoughnutChart');
  if (categoryChartCanvas && window.Chart) {
    new Chart(categoryChartCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Painting', 'Drawing', 'Crafts', 'Digital Art', 'Clay'],
        datasets: [{
          data: [35, 25, 18, 14, 8],
          backgroundColor: ['#FF5C8A', '#FFD93D', '#48D597', '#6C63FF', '#FF8A3D'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: textColor, boxWidth: 12 } }
        },
        cutout: '70%'
      }
    });
  }

  // --- 3. TABLE FILTERING & SEARCH ---
  const tableSearchInput = document.getElementById('table-search-input');
  const statusFilterSelect = document.getElementById('status-filter-select');
  const tableRows = document.querySelectorAll('.filterable-table-row');

  const filterTable = () => {
    const query = (tableSearchInput?.value || '').toLowerCase().trim();
    const status = (statusFilterSelect?.value || 'all').toLowerCase();

    tableRows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const rowStatus = (row.getAttribute('data-status') || '').toLowerCase();

      const matchesSearch = !query || text.includes(query);
      const matchesStatus = (status === 'all' || rowStatus === status);

      row.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
    });
  };

  if (tableSearchInput) tableSearchInput.addEventListener('input', filterTable);
  if (statusFilterSelect) statusFilterSelect.addEventListener('change', filterTable);

  // --- 4. MESSAGE INBOX PREVIEW INTERACTION ---
  const messageItems = document.querySelectorAll('.inbox-message-row');
  const messageViewBody = document.getElementById('inbox-detail-view');

  if (messageItems.length > 0 && messageViewBody) {
    messageItems.forEach(item => {
      item.addEventListener('click', () => {
        messageItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        item.classList.remove('unread');

        const sender = item.getAttribute('data-sender');
        const subject = item.getAttribute('data-subject');
        const time = item.getAttribute('data-time');
        const body = item.getAttribute('data-body');

        messageViewBody.innerHTML = `
          <div style="border-bottom: 2px solid rgba(36,32,68,0.08); padding-bottom: 1.25rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
              <h3 style="font-size: 1.4rem;">${subject}</h3>
              <span style="font-size: 0.85rem; color: var(--muted);">${time}</span>
            </div>
            <div style="font-size: 0.95rem; color: var(--muted); font-weight: 600;">From: <strong style="color: var(--text-main);">${sender}</strong></div>
          </div>
          <div style="font-size: 1.05rem; line-height: 1.7; color: var(--text-main); margin-bottom: 2rem;">
            ${body}
          </div>
          <div style="display: flex; gap: 1rem;">
            <button class="btn-toy btn-pink btn-sm" onclick="window.showToast('Reply composer opened', 'info')"><i data-lucide="reply"></i> Reply</button>
            <button class="btn-toy btn-white btn-sm" onclick="window.showToast('Message archived', 'info')"><i data-lucide="archive"></i> Archive</button>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      });
    });
  }
});
