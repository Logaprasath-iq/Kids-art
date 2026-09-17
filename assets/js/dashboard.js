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

  // --- 4. STUDENTS DIRECTORY CRUD FUNCTIONALITY ---
  let activeStudentRow = null;
  const editStudentModal = document.getElementById('editStudentModal');
  const editStudentForm = document.getElementById('editStudentForm');
  const enrollStudentModal = document.getElementById('enrollStudentModal');
  const enrollStudentForm = document.getElementById('enrollStudentForm');
  const btnOpenEnrollStudent = document.getElementById('btn-open-enroll-student');

  // Open Enroll Student Modal
  if (btnOpenEnrollStudent && enrollStudentModal) {
    btnOpenEnrollStudent.addEventListener('click', () => {
      enrollStudentModal.style.display = 'flex';
      const nameInput = document.getElementById('enroll-student-name');
      if (nameInput) nameInput.focus();
    });
  }

  // Create Student
  if (enrollStudentForm) {
    enrollStudentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('enroll-student-name')?.value.trim();
      const parent = document.getElementById('enroll-parent-name')?.value.trim();
      const age = document.getElementById('enroll-student-age')?.value.trim();
      const status = document.getElementById('enroll-student-status')?.value || 'active';
      const track = document.getElementById('enroll-student-track')?.value.trim();

      if (!name || !parent || !track) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please fill in all required student details.', 'error');
        }
        return;
      }

      const today = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateStr = `${months[today.getMonth()]} ${String(today.getDate()).padStart(2, '0')}, ${today.getFullYear()}`;
      const statusCapitalized = status.charAt(0).toUpperCase() + status.slice(1);

      const tbody = document.querySelector('.table-custom tbody');
      if (tbody) {
        const tr = document.createElement('tr');
        tr.className = 'filterable-table-row';
        tr.setAttribute('data-status', status);
        tr.innerHTML = `
          <td><strong class="student-name">${name}</strong></td>
          <td class="parent-name">${parent}</td>
          <td class="student-age">${age}</td>
          <td class="class-track">${track}</td>
          <td><span class="badge-status ${status}">${statusCapitalized}</span></td>
          <td>${dateStr}</td>
          <td>
            <div style="display: flex; gap: 0.4rem; align-items: center;">
              <button type="button" class="btn-toy btn-sm btn-white edit-student-btn" title="Edit Student"><i data-lucide="edit-3" style="width: 14px;"></i> Edit</button>
              <button type="button" class="btn-toy btn-sm btn-white delete-student-btn" title="Delete Student" style="color: #FF5C5C;"><i data-lucide="trash-2" style="width: 14px;"></i></button>
            </div>
          </td>
        `;
        tbody.insertBefore(tr, tbody.firstChild);
        if (window.lucide) window.lucide.createIcons();
      }

      enrollStudentForm.reset();
      if (enrollStudentModal) enrollStudentModal.style.display = 'none';
      if (typeof window.showToast === 'function') {
        window.showToast(`🎉 Student ${name} enrolled successfully!`, 'success');
      }
    });
  }

  // Edit Student Button Click
  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-student-btn');
    if (editBtn) {
      e.preventDefault();
      activeStudentRow = editBtn.closest('.filterable-table-row') || editBtn.closest('tr');
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

  // Edit Student Submit
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
      if (typeof window.showToast === 'function') {
        window.showToast(`🎉 Student record for ${newName} updated successfully!`, 'success');
      }
    });
  }

  // Delete Student
  document.addEventListener('click', (e) => {
    const deleteStudentBtn = e.target.closest('.delete-student-btn');
    if (deleteStudentBtn) {
      e.preventDefault();
      const row = deleteStudentBtn.closest('.filterable-table-row') || deleteStudentBtn.closest('tr');
      if (!row) return;
      const studentName = row.querySelector('.student-name')?.textContent.trim() || 'this student';

      if (confirm(`Are you sure you want to remove ${studentName} from the student directory?`)) {
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'scale(0.95)';
        setTimeout(() => {
          row.remove();
        }, 280);
        if (typeof window.showToast === 'function') {
          window.showToast(`🗑️ Student record for ${studentName} removed.`, 'info');
        }
      }
    }
  });

  // --- 5. ORDERS & INVOICES CRUD & DOWNLOAD ---
  const receiptModal = document.getElementById('receiptModal');
  const createOrderModal = document.getElementById('createOrderModal');
  const createOrderForm = document.getElementById('createOrderForm');
  const btnOpenCreateOrder = document.getElementById('btn-open-create-order');
  const editOrderModal = document.getElementById('editOrderModal');
  const editOrderForm = document.getElementById('editOrderForm');
  let activeOrderRow = null;

  // A. Generate and Download Invoice File
  const downloadInvoiceFile = (invData) => {
    const isPaid = (invData.status.toLowerCase() === 'paid');
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tax Invoice ${invData.inv} - Little Canvas Studio</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #FBF9FE;
      color: #242044;
      padding: 40px 20px;
    }
    .invoice-container {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      border: 3px solid #242044;
      border-radius: 24px;
      box-shadow: 0 10px 0 #242044;
      padding: 36px;
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px dashed #E0DCED;
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #FF5C8A;
      margin-bottom: 6px;
    }
    .studio-meta {
      font-size: 13px;
      color: #716C88;
      line-height: 1.5;
    }
    .inv-status {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 13px;
      margin-bottom: 8px;
      background: ${isPaid ? '#E2F9EE' : '#FFF5D6'};
      color: ${isPaid ? '#10B981' : '#F59E0B'};
      border: 2px solid ${isPaid ? '#10B981' : '#F59E0B'};
    }
    .meta-date {
      font-size: 13px;
      color: #716C88;
    }
    .billed-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 28px;
      font-size: 14px;
    }
    .section-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 800;
      color: #716C88;
      margin-bottom: 4px;
    }
    .billed-name {
      font-size: 17px;
      font-weight: 700;
      color: #242044;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }
    .items-table th {
      text-align: left;
      padding: 12px;
      background: #F4F1FB;
      border-bottom: 2px solid #242044;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #716C88;
    }
    .items-table td {
      padding: 14px 12px;
      border-bottom: 1px solid #ECE8F6;
      font-size: 14px;
    }
    .total-row {
      font-size: 18px;
      font-weight: 800;
      color: #FF5C8A;
      border-top: 2px solid #242044;
    }
    .invoice-footer {
      text-align: center;
      font-size: 12px;
      color: #716C88;
      line-height: 1.6;
      border-top: 1px solid #ECE8F6;
      padding-top: 20px;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .invoice-container { box-shadow: none; border: 1px solid #ccc; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="invoice-header">
      <div>
        <div class="brand-title">🎨 Little Canvas Studio</div>
        <div class="studio-meta">
          142 Art Haven Way, Studio 4B<br>
          Creativity City, CA 90210<br>
          VAT / Tax ID: #LC-948271
        </div>
      </div>
      <div style="text-align: right;">
        <div class="inv-status">${invData.status}</div>
        <div class="meta-date">Invoice: <strong style="color: #242044;">${invData.inv}</strong></div>
        <div class="meta-date">Date: <strong style="color: #242044;">${invData.date}</strong></div>
      </div>
    </div>

    <div class="billed-section">
      <div>
        <div class="section-label">Billed To</div>
        <div class="billed-name">${invData.parent}</div>
        <div style="color: #716C88; font-size: 13px;">Family Membership Account</div>
      </div>
      <div style="text-align: right;">
        <div class="section-label">Payment Method</div>
        <div style="font-weight: 700; color: #242044;">${invData.method}</div>
        <div style="color: #10B981; font-weight: 700; font-size: 13px;">${isPaid ? 'Payment Confirmed' : 'Payment Awaiting Settlement'}</div>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Item / Course Program</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="font-weight: 600;">${invData.item}</td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right; font-weight: 700;">${invData.amount}</td>
        </tr>
        <tr style="color: #716C88;">
          <td>Subtotal</td>
          <td style="text-align: center;">-</td>
          <td style="text-align: right;">${invData.amount}</td>
        </tr>
        <tr style="color: #716C88;">
          <td>Studio Tax (0%)</td>
          <td style="text-align: center;">-</td>
          <td style="text-align: right;">$0.00</td>
        </tr>
        <tr class="total-row">
          <td>Total Paid</td>
          <td style="text-align: center;">-</td>
          <td style="text-align: right;">${invData.amount}</td>
        </tr>
      </tbody>
    </table>

    <div class="invoice-footer">
      🎨 Thank you for nurturing your child's creativity at Little Canvas Studio!<br>
      Questions about this invoice? Email billing@littlecanvas.example.com
    </div>
  </div>
</body>
</html>`;

    try {
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanInv = invData.inv.replace(/[^a-zA-Z0-9_-]/g, '');
      a.download = `Invoice-${cleanInv || 'Receipt'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (typeof window.showToast === 'function') {
        window.showToast(`📥 Invoice ${invData.inv} downloaded!`, 'success');
      }
    } catch (err) {
      console.error('Invoice download error:', err);
    }
  };

  // B. Open Create Invoice Modal
  if (btnOpenCreateOrder && createOrderModal) {
    btnOpenCreateOrder.addEventListener('click', () => {
      createOrderModal.style.display = 'flex';
      const parentInput = document.getElementById('create-order-parent');
      if (parentInput) parentInput.focus();
    });
  }

  // C. Handle Create Invoice Submit
  if (createOrderForm) {
    createOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const parent = document.getElementById('create-order-parent')?.value.trim();
      const program = document.getElementById('create-order-program')?.value.trim();
      const rawAmount = document.getElementById('create-order-amount')?.value;
      const amountVal = parseFloat(rawAmount || '0').toFixed(2);
      const method = document.getElementById('create-order-method')?.value || 'Visa •••• 4242';
      const status = document.getElementById('create-order-status')?.value || 'Paid';

      if (!parent || !program) {
        if (typeof window.showToast === 'function') {
          window.showToast('Please fill in required fields.', 'error');
        }
        return;
      }

      const randomNum = Math.floor(882 + Math.random() * 100);
      const invNum = `#INV-2026-${randomNum}`;
      const today = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateStr = `${months[today.getMonth()]} ${String(today.getDate()).padStart(2, '0')}, ${today.getFullYear()}`;
      const isPaid = (status.toLowerCase() === 'paid');
      const statusBadgeClass = isPaid ? 'badge-status active order-status' : 'badge-status trial order-status';

      const tbody = document.querySelector('.table-custom tbody');
      if (tbody) {
        const tr = document.createElement('tr');
        tr.className = 'order-table-row';
        tr.innerHTML = `
          <td class="order-inv"><strong>${invNum}</strong></td>
          <td class="order-parent">${parent}</td>
          <td class="order-item">${program}</td>
          <td class="order-amount"><strong>$${amountVal}</strong></td>
          <td class="order-method">${method}</td>
          <td><span class="${statusBadgeClass}">${status}</span></td>
          <td class="order-date">${dateStr}</td>
          <td>
            <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
              <button type="button" class="btn-toy btn-sm btn-white view-receipt-btn" title="View Receipt" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; gap: 0.3rem;"><i data-lucide="receipt" style="width: 13px;"></i> View</button>
              <button type="button" class="btn-toy btn-sm btn-blue download-invoice-btn" title="Download Invoice" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; gap: 0.3rem;"><i data-lucide="download" style="width: 13px;"></i> DL</button>
              <button type="button" class="btn-toy btn-sm btn-white edit-order-btn" title="Edit Invoice" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; gap: 0.3rem;"><i data-lucide="edit-3" style="width: 13px;"></i> Edit</button>
              <button type="button" class="btn-toy btn-sm btn-white delete-order-btn" title="Delete Invoice" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; gap: 0.3rem; color: #FF5C5C;"><i data-lucide="trash-2" style="width: 13px;"></i></button>
            </div>
          </td>
        `;
        tbody.insertBefore(tr, tbody.firstChild);
        if (window.lucide) window.lucide.createIcons();
      }

      createOrderForm.reset();
      if (createOrderModal) createOrderModal.style.display = 'none';
      if (typeof window.showToast === 'function') {
        window.showToast(`🎉 Invoice ${invNum} for ${parent} created successfully!`, 'success');
      }
    });
  }

  // D. View Receipt Modal Click
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

  // E. Download Invoice Button Click on Table Rows
  document.addEventListener('click', (e) => {
    const dlBtn = e.target.closest('.download-invoice-btn');
    if (dlBtn) {
      e.preventDefault();
      const row = dlBtn.closest('.order-table-row') || dlBtn.closest('tr');
      if (row) {
        const inv = row.querySelector('.order-inv')?.textContent.trim() || '#INV-2026';
        const parent = row.querySelector('.order-parent')?.textContent.trim() || 'Parent';
        const item = row.querySelector('.order-item')?.textContent.trim() || 'Creative Kids';
        const amount = row.querySelector('.order-amount')?.textContent.trim() || '$49.00';
        const method = row.querySelector('.order-method')?.textContent.trim() || 'Credit Card';
        const date = row.querySelector('.order-date')?.textContent.trim() || 'Today';
        const status = row.querySelector('.order-status')?.textContent.trim() || 'Paid';

        downloadInvoiceFile({ inv, parent, item, amount, method, date, status });
      }
    }
  });

  // F. Download Invoice from Receipt Modal Footer
  const receiptModalDlBtn = document.getElementById('receipt-modal-download-btn');
  if (receiptModalDlBtn) {
    receiptModalDlBtn.addEventListener('click', () => {
      const inv = document.getElementById('receipt-modal-inv')?.textContent.trim() || '#INV-2026';
      const parent = document.getElementById('receipt-modal-parent')?.textContent.trim() || 'Parent';
      const item = document.getElementById('receipt-modal-item-name')?.textContent.trim() || 'Creative Kids';
      const amount = document.getElementById('receipt-modal-total')?.textContent.trim() || '$49.00';
      const method = document.getElementById('receipt-modal-method')?.textContent.trim() || 'Credit Card';
      const date = document.getElementById('receipt-modal-date')?.textContent.trim() || 'Today';
      const status = document.getElementById('receipt-modal-status')?.textContent.trim() || 'Paid';

      downloadInvoiceFile({ inv, parent, item, amount, method, date, status });
    });
  }

  // G. Edit Order Button Click
  document.addEventListener('click', (e) => {
    const editOrderBtn = e.target.closest('.edit-order-btn');
    if (editOrderBtn) {
      e.preventDefault();
      activeOrderRow = editOrderBtn.closest('.order-table-row') || editOrderBtn.closest('tr');
      if (activeOrderRow && editOrderModal) {
        const inv = activeOrderRow.querySelector('.order-inv')?.textContent.trim() || '';
        const parent = activeOrderRow.querySelector('.order-parent')?.textContent.trim() || '';
        const item = activeOrderRow.querySelector('.order-item')?.textContent.trim() || '';
        const rawAmount = activeOrderRow.querySelector('.order-amount')?.textContent.trim().replace(/[^0-9.]/g, '') || '';
        const method = activeOrderRow.querySelector('.order-method')?.textContent.trim() || 'Visa •••• 4242';
        const status = activeOrderRow.querySelector('.order-status')?.textContent.trim() || 'Paid';

        const invInput = document.getElementById('edit-order-inv');
        const parentInput = document.getElementById('edit-order-parent');
        const programInput = document.getElementById('edit-order-program');
        const amountInput = document.getElementById('edit-order-amount');
        const methodInput = document.getElementById('edit-order-method');
        const statusInput = document.getElementById('edit-order-status');

        if (invInput) invInput.value = inv;
        if (parentInput) parentInput.value = parent;
        if (programInput) programInput.value = item;
        if (amountInput) amountInput.value = parseFloat(rawAmount || '0').toFixed(2);
        if (methodInput) methodInput.value = method;
        if (statusInput) statusInput.value = status;

        editOrderModal.style.display = 'flex';
      }
    }
  });

  // H. Edit Order Submit
  if (editOrderForm) {
    editOrderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!activeOrderRow) return;

      const inv = document.getElementById('edit-order-inv')?.value || '';
      const parent = document.getElementById('edit-order-parent')?.value.trim();
      const program = document.getElementById('edit-order-program')?.value.trim();
      const amountVal = parseFloat(document.getElementById('edit-order-amount')?.value || '0').toFixed(2);
      const method = document.getElementById('edit-order-method')?.value || 'Visa •••• 4242';
      const status = document.getElementById('edit-order-status')?.value || 'Paid';

      const parentEl = activeOrderRow.querySelector('.order-parent');
      const itemEl = activeOrderRow.querySelector('.order-item');
      const amountEl = activeOrderRow.querySelector('.order-amount');
      const methodEl = activeOrderRow.querySelector('.order-method');
      const statusEl = activeOrderRow.querySelector('.order-status');

      if (parentEl && parent) parentEl.textContent = parent;
      if (itemEl && program) itemEl.textContent = program;
      if (amountEl) amountEl.innerHTML = `<strong>$${amountVal}</strong>`;
      if (methodEl && method) methodEl.textContent = method;

      const isPaid = (status.toLowerCase() === 'paid');
      if (statusEl) {
        statusEl.className = isPaid ? 'badge-status active order-status' : 'badge-status trial order-status';
        statusEl.textContent = status;
      }

      if (editOrderModal) editOrderModal.style.display = 'none';
      if (typeof window.showToast === 'function') {
        window.showToast(`🎉 Invoice ${inv} updated successfully!`, 'success');
      }
    });
  }

  // I. Delete Order
  document.addEventListener('click', (e) => {
    const deleteOrderBtn = e.target.closest('.delete-order-btn');
    if (deleteOrderBtn) {
      e.preventDefault();
      const row = deleteOrderBtn.closest('.order-table-row') || deleteOrderBtn.closest('tr');
      if (!row) return;
      const inv = row.querySelector('.order-inv')?.textContent.trim() || 'this invoice';

      if (confirm(`Are you sure you want to delete invoice ${inv}? This action cannot be undone.`)) {
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'scale(0.95)';
        setTimeout(() => {
          row.remove();
        }, 280);
        if (typeof window.showToast === 'function') {
          window.showToast(`🗑️ Invoice ${inv} deleted.`, 'info');
        }
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
