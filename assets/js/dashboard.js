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

  // --- 4. STUDENTS DIRECTORY EDIT FUNCTIONALITY ---
  let activeStudentRow = null;
  const editStudentModal = document.getElementById('editStudentModal');
  const editStudentForm = document.getElementById('editStudentForm');

  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-student-btn');
    if (editBtn) {
      e.preventDefault();
      activeStudentRow = editBtn.closest('tr');
      if (activeStudentRow && editStudentModal) {
        const studentName = activeStudentRow.querySelector('.student-name')?.textContent.trim() || '';
        const parentName = activeStudentRow.querySelector('.parent-name')?.textContent.trim() || '';
        const studentAge = activeStudentRow.querySelector('.student-age')?.textContent.trim() || '';
        const classTrack = activeStudentRow.querySelector('.class-track')?.textContent.trim() || '';
        const currentStatus = activeStudentRow.getAttribute('data-status') || 'active';

        const nameInput = document.getElementById('edit-student-name');
        const parentInput = document.getElementById('edit-parent-name');
        const ageInput = document.getElementById('edit-student-age');
        const statusInput = document.getElementById('edit-student-status');
        const trackInput = document.getElementById('edit-student-track');

        if (nameInput) nameInput.value = studentName;
        if (parentInput) parentInput.value = parentName;
        if (ageInput) ageInput.value = studentAge;
        if (statusInput) statusInput.value = currentStatus;
        if (trackInput) trackInput.value = classTrack;

        editStudentModal.style.display = 'flex';
      }
    }
  });

  if (editStudentForm) {
    editStudentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!activeStudentRow) return;

      const newName = document.getElementById('edit-student-name')?.value.trim();
      const newParent = document.getElementById('edit-parent-name')?.value.trim();
      const newAge = document.getElementById('edit-student-age')?.value.trim();
      const newStatus = document.getElementById('edit-student-status')?.value || 'active';
      const newTrack = document.getElementById('edit-student-track')?.value.trim();

      const nameEl = activeStudentRow.querySelector('.student-name');
      const parentEl = activeStudentRow.querySelector('.parent-name');
      const ageEl = activeStudentRow.querySelector('.student-age');
      const trackEl = activeStudentRow.querySelector('.class-track');
      const badgeEl = activeStudentRow.querySelector('.badge-status');

      if (nameEl && newName) nameEl.textContent = newName;
      if (parentEl && newParent) parentEl.textContent = newParent;
      if (ageEl && newAge) ageEl.textContent = newAge;
      if (trackEl && newTrack) trackEl.textContent = newTrack;

      if (badgeEl) {
        badgeEl.className = 'badge-status ' + newStatus;
        badgeEl.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        activeStudentRow.setAttribute('data-status', newStatus);
      }

      if (editStudentModal) editStudentModal.style.display = 'none';
      window.showToast(`🎉 Student record for ${newName} updated successfully!`, 'success');
    });
  }

  // --- 5. ORDERS & INVOICES RECEIPT VIEW MODAL ---
  const receiptModal = document.getElementById('receiptModal');
  document.addEventListener('click', (e) => {
    const viewReceiptBtn = e.target.closest('.view-receipt-btn');
    if (viewReceiptBtn) {
      e.preventDefault();
      const row = viewReceiptBtn.closest('.order-table-row') || viewReceiptBtn.closest('tr');
      if (row && receiptModal) {
        const inv = row.querySelector('.order-inv')?.textContent.trim() || '#INV-2026-881';
        const parent = row.querySelector('.order-parent')?.textContent.trim() || 'Parent';
        const item = row.querySelector('.order-item')?.textContent.trim() || 'Creative Kids';
        const amount = row.querySelector('.order-amount')?.textContent.trim() || '$49.00';
        const method = row.querySelector('.order-method')?.textContent.trim() || 'Credit Card';
        const date = row.querySelector('.order-date')?.textContent.trim() || 'Sep 01, 2026';
        const statusEl = row.querySelector('.order-status');
        const isPaid = (statusEl?.textContent.trim().toLowerCase() === 'paid');

        const invEl = document.getElementById('receipt-modal-inv');
        const parentEl = document.getElementById('receipt-modal-parent');
        const itemEl = document.getElementById('receipt-modal-item-name');
        const priceEl = document.getElementById('receipt-modal-item-price');
        const subtotalEl = document.getElementById('receipt-modal-subtotal');
        const totalEl = document.getElementById('receipt-modal-total');
        const methodEl = document.getElementById('receipt-modal-method');
        const dateEl = document.getElementById('receipt-modal-date');
        const statusBadge = document.getElementById('receipt-modal-status');

        if (invEl) invEl.textContent = inv;
        if (parentEl) parentEl.textContent = parent;
        if (itemEl) itemEl.textContent = item;
        if (priceEl) priceEl.textContent = amount;
        if (subtotalEl) subtotalEl.textContent = amount;
        if (totalEl) totalEl.textContent = amount;
        if (methodEl) methodEl.textContent = method;
        if (dateEl) dateEl.textContent = date;

        if (statusBadge) {
          statusBadge.textContent = isPaid ? 'Paid' : 'Pending';
          statusBadge.className = isPaid ? 'badge-status active' : 'badge-status trial';
        }

        receiptModal.style.display = 'flex';
        if (window.lucide) window.lucide.createIcons();
      }
    }
  });

  // --- 6. PARENTS INQUIRY & MESSAGING (REPLY & ARCHIVE) ---
  const messageItems = document.querySelectorAll('.inbox-message-row');
  const messageViewBody = document.getElementById('inbox-detail-view');

  const renderActiveMessage = (item) => {
    if (!item || !messageViewBody) return;
    messageItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    item.classList.remove('unread');

    const sender = item.getAttribute('data-sender') || 'Parent Inquiry';
    const subject = item.getAttribute('data-subject') || 'Inquiry';
    const time = item.getAttribute('data-time') || 'Today';
    const body = item.getAttribute('data-body') || '';

    messageViewBody.innerHTML = `
      <div style="border-bottom: 2px solid rgba(36,32,68,0.08); padding-bottom: 1.25rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <h3 style="font-size: 1.4rem; margin: 0;">${subject}</h3>
          <span style="font-size: 0.85rem; color: var(--muted);">${time}</span>
        </div>
        <div style="font-size: 0.95rem; color: var(--muted); font-weight: 600;">From: <strong style="color: var(--text-main);">${sender}</strong></div>
      </div>

      <div style="font-size: 1.05rem; line-height: 1.7; color: var(--text-main); margin-bottom: 1.5rem;">
        ${body}
      </div>

      <!-- Thread Replies History Container -->
      <div id="thread-replies-list" style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;"></div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 1rem; margin-bottom: 1rem;" id="message-action-bar">
        <button type="button" class="btn-toy btn-pink btn-sm" id="btn-open-reply"><i data-lucide="reply"></i> Reply</button>
        <button type="button" class="btn-toy btn-white btn-sm" id="btn-archive-msg"><i data-lucide="archive"></i> Archive</button>
      </div>

      <!-- Inline Reply Composer -->
      <div id="inline-reply-box" style="display: none; background: rgba(36,32,68,0.02); border: 2px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem; margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <strong style="font-size: 0.95rem;">Reply to ${sender.split('(')[0].trim()}</strong>
          <span style="font-size: 0.8rem; color: var(--muted);">Direct Email Notification</span>
        </div>
        <textarea id="reply-textarea" class="form-control" rows="3" placeholder="Type your personalized response here..." style="width: 100%; padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 2px solid var(--border); margin-bottom: 0.75rem;"></textarea>
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button type="button" class="btn-toy btn-white btn-sm" id="btn-cancel-reply">Cancel</button>
          <button type="button" class="btn-toy btn-pink btn-sm" id="btn-send-reply"><i data-lucide="send"></i> Send Reply</button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Wire up Reply button
    const replyBtn = messageViewBody.querySelector('#btn-open-reply');
    const replyBox = messageViewBody.querySelector('#inline-reply-box');
    const cancelReplyBtn = messageViewBody.querySelector('#btn-cancel-reply');
    const sendReplyBtn = messageViewBody.querySelector('#btn-send-reply');
    const replyTextarea = messageViewBody.querySelector('#reply-textarea');
    const threadRepliesList = messageViewBody.querySelector('#thread-replies-list');

    if (replyBtn && replyBox) {
      replyBtn.addEventListener('click', () => {
        replyBox.style.display = replyBox.style.display === 'none' ? 'block' : 'none';
        if (replyBox.style.display === 'block' && replyTextarea) {
          replyTextarea.focus();
        }
      });
    }

    if (cancelReplyBtn && replyBox) {
      cancelReplyBtn.addEventListener('click', () => {
        replyBox.style.display = 'none';
        if (replyTextarea) replyTextarea.value = '';
      });
    }

    if (sendReplyBtn && replyTextarea && threadRepliesList) {
      sendReplyBtn.addEventListener('click', () => {
        const text = replyTextarea.value.trim();
        if (!text) {
          window.showToast('Please type a reply before sending.', 'error');
          replyTextarea.focus();
          return;
        }

        // Append sent reply to thread
        const replyItem = document.createElement('div');
        replyItem.style.cssText = 'background: rgba(108, 99, 255, 0.08); border: 2px solid var(--secondary); border-radius: 14px; padding: 1rem 1.25rem;';
        replyItem.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
            <strong style="color: var(--secondary); font-size: 0.9rem;">Little Canvas Studio (You)</strong>
            <span style="font-size: 0.75rem; color: var(--muted);">Just now • Sent</span>
          </div>
          <div style="font-size: 0.95rem; line-height: 1.5; color: var(--text-main);">${text}</div>
        `;
        threadRepliesList.appendChild(replyItem);

        replyTextarea.value = '';
        if (replyBox) replyBox.style.display = 'none';
        window.showToast(`🎉 Reply sent to ${sender.split('(')[0].trim()}!`, 'success');
      });
    }

    // Wire up Archive button
    const archiveBtn = messageViewBody.querySelector('#btn-archive-msg');
    if (archiveBtn) {
      archiveBtn.addEventListener('click', () => {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
          item.style.display = 'none';

          // Find next visible message
          const remaining = Array.from(messageItems).filter(m => m.style.display !== 'none' && m !== item);
          if (remaining.length > 0) {
            renderActiveMessage(remaining[0]);
          } else {
            messageViewBody.innerHTML = `
              <div style="text-align: center; padding: 5rem 1rem; color: var(--muted);">
                <i data-lucide="inbox" style="width: 56px; height: 56px; margin-bottom: 1rem; color: var(--primary);"></i>
                <h3 style="font-size: 1.4rem; color: var(--text-main); margin-bottom: 0.5rem;">Inbox All Clear</h3>
                <p style="font-size: 0.95rem;">All parent inquiries and messages have been handled or archived.</p>
              </div>
            `;
            if (window.lucide) window.lucide.createIcons();
          }
        }, 280);

        window.showToast('📁 Conversation moved to Archive.', 'info');
      });
    }
  };

  if (messageItems.length > 0 && messageViewBody) {
    messageItems.forEach(item => {
      item.addEventListener('click', () => renderActiveMessage(item));
    });

    // Initialize with first active or first message
    const initialActive = document.querySelector('.inbox-message-row.active') || messageItems[0];
    if (initialActive) {
      renderActiveMessage(initialActive);
    }
  }
});
