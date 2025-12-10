// History Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Setup date range buttons
    setupDateRange();
    
    // Setup filters
    setupFilters();
    
    // Setup table interactions
    setupTableInteractions();
    
    // Setup pagination
    setupPagination();
    
    // Setup export button
    setupExportButton();
    
    // Load history data
    loadHistoryData();
});

function setupDateRange() {
    const dateButtons = document.querySelectorAll('.btn-date');
    const customRangeBtn = document.getElementById('customRangeBtn');
    
    dateButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this === customRangeBtn) {
                openCustomDateRange();
                return;
            }
            
            // Update active button
            dateButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Load data for selected range
            const range = this.textContent;
            loadHistoryForRange(range);
        });
    });
}

function openCustomDateRange() {
    const modal = document.createElement('div');
    modal.className = 'modal date-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Custom Date Range</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="date-inputs">
                    <div class="form-group">
                        <label>From Date</label>
                        <input type="date" id="fromDate" value="${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}">
                    </div>
                    <div class="form-group">
                        <label>To Date</label>
                        <input type="date" id="toDate" value="${new Date().toISOString().split('T')[0]}">
                    </div>
                </div>
                <div class="quick-ranges">
                    <button class="quick-range" data-days="7">Last 7 days</button>
                    <button class="quick-range" data-days="30">Last 30 days</button>
                    <button class="quick-range" data-days="90">Last 90 days</button>
                    <button class="quick-range" data-days="365">Last year</button>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-check"></i> Apply Range
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup modal interactions
    setupDateModal(modal);
}

function setupDateModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const fromDate = modal.querySelector('#fromDate');
    const toDate = modal.querySelector('#toDate');
    const quickRanges = modal.querySelectorAll('.quick-range');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Quick range buttons
    quickRanges.forEach(btn => {
        btn.addEventListener('click', function() {
            const days = parseInt(this.getAttribute('data-days'));
            const to = new Date();
            const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
            
            fromDate.value = from.toISOString().split('T')[0];
            toDate.value = to.toISOString().split('T')[0];
        });
    });
    
    // Apply custom range
    confirmBtn.addEventListener('click', function() {
        const from = fromDate.value;
        const to = toDate.value;
        
        if (!from || !to) {
            showAlert('Please select both dates', 'error');
            return;
        }
        
        if (new Date(from) > new Date(to)) {
            showAlert('From date cannot be after to date', 'error');
            return;
        }
        
        // Update active button
        document.querySelectorAll('.btn-date').forEach(btn => {
            if (btn !== document.getElementById('customRangeBtn')) {
                btn.classList.remove('active');
            }
        });
        
        document.getElementById('customRangeBtn').innerHTML = `
            <i class="fas fa-calendar"></i> ${formatDateRange(from, to)}
        `;
        
        closeModal();
        loadHistoryForCustomRange(from, to);
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function formatDateRange(from, to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    const formatOptions = { month: 'short', day: 'numeric' };
    const fromStr = fromDate.toLocaleDateString([], formatOptions);
    const toStr = toDate.toLocaleDateString([], formatOptions);
    
    return `${fromStr} - ${toStr}`;
}

function loadHistoryForRange(range) {
    // Simulate loading
    showLoading();
    
    setTimeout(() => {
        // In production, this would fetch from API
        updateHistoryTable(getMockDataForRange(range));
        hideLoading();
        updateStats();
    }, 1000);
}

function loadHistoryForCustomRange(from, to) {
    showLoading();
    
    setTimeout(() => {
        updateHistoryTable(getMockDataForCustomRange(from, to));
        hideLoading();
        updateStats();
    }, 1000);
}

function getMockDataForRange(range) {
    const daysMap = {
        'Today': 1,
        '7D': 7,
        '30D': 30,
        '90D': 90
    };
    
    const days = daysMap[range] || 30;
    return generateMockHistory(days);
}

function getMockDataForCustomRange(from, to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const days = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24));
    
    return generateMockHistory(days);
}

function generateMockHistory(days) {
    const types = ['trade', 'deposit', 'withdrawal', 'staking'];
    const assets = ['BTC/USD', 'ETH/USD', 'USD', 'SOL'];
    const statuses = ['completed', 'pending', 'failed'];
    
    const data = [];
    const now = new Date();
    
    for (let i = 0; i < 20; i++) {
        const date = new Date(now.getTime() - Math.random() * days * 24 * 60 * 60 * 1000);
        const type = types[Math.floor(Math.random() * types.length)];
        const asset = assets[Math.floor(Math.random() * assets.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        let amount, price, total, fee;
        
        if (type === 'trade') {
            const side = Math.random() > 0.5 ? 'buy' : 'sell';
            amount = (Math.random() * 0.1).toFixed(3) + ' BTC';
            const numericPrice = parseFloat((Math.random() * 10000 + 40000).toFixed(2));
            price = `$${numericPrice.toFixed(2)}`;
            const numericTotal = parseFloat(amount) * numericPrice;
            total = `$${numericTotal.toFixed(2)}`;
            fee = `$${(numericTotal * 0.001).toFixed(2)}`;
        } else if (type === 'deposit' || type === 'withdrawal') {
            const numericAmount = parseFloat((Math.random() * 1000 + 100).toFixed(2));
            amount = `$${numericAmount.toFixed(2)}`;
            price = '-';
            total = amount;
            fee = type === 'withdrawal' ? '$5.00' : '$0.00';
        } else {
            amount = (Math.random() * 0.01).toFixed(3) + ' ETH';
            const numericPrice = parseFloat((Math.random() * 1000 + 2000).toFixed(2));
            price = `$${numericPrice.toFixed(2)}`;
            const numericTotal = parseFloat(amount) * numericPrice;
            total = `$${numericTotal.toFixed(2)}`;
            fee = '$0.00';
        }
        
        data.push({
            date: date.toISOString().split('T')[0],
            time: date.toTimeString().split(' ')[0],
            type: type,
            asset: asset,
            amount: amount,
            price: price,
            total: total,
            fee: fee,
            status: status
        });
    }
    
    // Sort by date (newest first)
    return data.sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time));
}

function updateHistoryTable(data) {
    const tbody = document.querySelector('.history-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const row = document.createElement('tr');
        
        let typeClass = item.type;
        if (item.type === 'trade') {
            typeClass += ` ${Math.random() > 0.5 ? 'buy' : 'sell'}`;
        }
        
        let icon = 'fab fa-bitcoin';
        if (item.asset.includes('ETH')) icon = 'fab fa-ethereum';
        if (item.asset === 'USD') icon = 'fas fa-dollar-sign';
        if (item.asset === 'SOL') icon = 'fas fa-gem';
        
        row.innerHTML = `
            <td>
                <span class="date">${item.date}</span>
                <span class="time">${item.time}</span>
            </td>
            <td>
                <span class="tx-type ${typeClass}">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}${item.type === 'trade' ? (typeClass.includes('buy') ? ' Buy' : ' Sell') : ''}</span>
            </td>
            <td>
                <div class="asset-cell">
                    <div class="asset-icon ${item.asset === 'USD' ? 'usd' : ''}">
                        <i class="${icon}"></i>
                    </div>
                    <span>${item.asset}</span>
                </div>
            </td>
            <td>${item.amount}</td>
            <td>${item.price}</td>
            <td>${item.total}</td>
            <td>${item.fee}</td>
            <td><span class="status ${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span></td>
            <td>
                <button class="btn-details">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add click handlers to detail buttons
    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const date = row.querySelector('.date').textContent;
            const time = row.querySelector('.time').textContent;
            const type = row.querySelector('.tx-type').textContent;
            const asset = row.cells[2].querySelector('span').textContent;
            
            openTransactionDetails({
                date: date,
                time: time,
                type: type,
                asset: asset,
                amount: row.cells[3].textContent,
                price: row.cells[4].textContent,
                total: row.cells[5].textContent,
                fee: row.cells[6].textContent,
                status: row.cells[7].querySelector('.status').textContent
            });
        });
    });
}

function openTransactionDetails(tx) {
    const modal = document.createElement('div');
    modal.className = 'modal tx-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Transaction Details</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="tx-info">
                    <div class="info-row">
                        <span>Transaction ID:</span>
                        <span class="tx-id">TX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}</span>
                    </div>
                    <div class="info-row">
                        <span>Date & Time:</span>
                        <span>${tx.date} ${tx.time}</span>
                    </div>
                    <div class="info-row">
                        <span>Type:</span>
                        <span class="tx-type ${tx.type.toLowerCase().replace(' ', '-')}">${tx.type}</span>
                    </div>
                    <div class="info-row">
                        <span>Asset:</span>
                        <span>${tx.asset}</span>
                    </div>
                    <div class="info-row">
                        <span>Amount:</span>
                        <span class="tx-amount">${tx.amount}</span>
                    </div>
                    <div class="info-row">
                        <span>Price:</span>
                        <span>${tx.price}</span>
                    </div>
                    <div class="info-row">
                        <span>Total Value:</span>
                        <span class="tx-total">${tx.total}</span>
                    </div>
                    <div class="info-row">
                        <span>Fee:</span>
                        <span class="tx-fee">${tx.fee}</span>
                    </div>
                    <div class="info-row">
                        <span>Status:</span>
                        <span class="status ${tx.status.toLowerCase()}">${tx.status}</span>
                    </div>
                    ${tx.status.toLowerCase() === 'pending' ? `
                    <div class="tx-actions">
                        <button class="btn btn-outline" id="cancelTxBtn">
                            <i class="fas fa-times"></i> Cancel Transaction
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Close</button>
                <button class="btn btn-primary" id="viewOnChainBtn">
                    <i class="fas fa-external-link-alt"></i> View on Blockchain
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup modal interactions
    setupTxModal(modal, tx);
}

function setupTxModal(modal, tx) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const viewOnChainBtn = modal.querySelector('#viewOnChainBtn');
    const cancelTxBtn = modal.querySelector('#cancelTxBtn');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // View on blockchain
        viewOnChainBtn.addEventListener('click', function() {
        // In production, this would link to blockchain explorer
        showAlert('Opening blockchain explorer...', 'info');
        setTimeout(() => {
            window.open(`https://blockchain.info/tx/${modal.querySelector('.tx-id').textContent}`, '_blank');
        }, 500);
    });
    
    // Cancel transaction (if pending)
    if (cancelTxBtn) {
        cancelTxBtn.addEventListener('click', function() {
            if (confirm('Cancel this pending transaction?')) {
                showAlert('Transaction cancellation requested', 'info');
                closeModal();
                
                // Update status in table
                updateTxStatus(tx, 'cancelled');
            }
        });
    }
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function updateTxStatus(tx, newStatus) {
    // Find and update the transaction in the table
    // This would be more robust in production
    console.log(`Updating transaction status to: ${newStatus}`);
}

function setupFilters() {
    const clearBtn = document.getElementById('clearFiltersBtn');
    const applyBtn = document.getElementById('applyFiltersBtn');
    
    // Clear filters
    clearBtn.addEventListener('click', function() {
        document.querySelectorAll('.filter-options input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
        });
        document.querySelectorAll('.asset-list input[type="checkbox"]').forEach(cb => {
            cb.checked = cb.parentElement.textContent.includes('All Assets');
        });
        
        showAlert('Filters cleared', 'info');
    });
    
    // Apply filters
    applyBtn.addEventListener('click', function() {
        const selectedTypes = Array.from(document.querySelectorAll('.filter-options input[type="checkbox"]:checked'))
            .map(cb => cb.nextElementSibling.textContent.toLowerCase());
        const selectedAssets = Array.from(document.querySelectorAll('.asset-list input[type="checkbox"]:checked'))
            .map(cb => cb.nextElementSibling.textContent);
        const selectedStatuses = Array.from(document.querySelectorAll('.filter-options input[type="checkbox"]:checked'))
            .map(cb => cb.nextElementSibling.textContent.toLowerCase());
        
        applyFiltersToTable(selectedTypes, selectedAssets, selectedStatuses);
        showAlert('Filters applied', 'success');
    });
}

function applyFiltersToTable(types, assets, statuses) {
    const rows = document.querySelectorAll('.history-table tbody tr');
    
    rows.forEach(row => {
        const rowType = row.querySelector('.tx-type').textContent.toLowerCase();
        const rowAsset = row.cells[2].querySelector('span').textContent;
        const rowStatus = row.cells[7].querySelector('.status').textContent.toLowerCase();
        
        const typeMatch = types.some(t => rowType.includes(t));
        const assetMatch = assets.includes('All Assets') || assets.some(a => rowAsset.includes(a));
        const statusMatch = statuses.some(s => rowStatus.includes(s));
        
        row.style.display = typeMatch && assetMatch && statusMatch ? '' : 'none';
    });
}

function setupTableInteractions() {
    // Sort by column (basic implementation)
    const headers = document.querySelectorAll('.history-table th');
    headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            sortTable(index);
        });
    });
}

function sortTable(columnIndex) {
    const table = document.querySelector('.history-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent;
        const bValue = b.cells[columnIndex].textContent;
        
        // Try to parse as number first
        const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, ''));
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return aNum - bNum;
        }
        
        // Otherwise compare as strings
        return aValue.localeCompare(bValue);
    });
    
    // Reverse if already sorted
    if (table.dataset.sortColumn === columnIndex.toString()) {
        rows.reverse();
        table.dataset.sortOrder = table.dataset.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        table.dataset.sortColumn = columnIndex;
        table.dataset.sortOrder = 'asc';
    }
    
    // Reorder rows
    rows.forEach(row => tbody.appendChild(row));
}

function setupPagination() {
    const prevBtn = document.querySelector('.btn-pagination.prev');
    const nextBtn = document.querySelector('.btn-pagination.next');
    const pageNumbers = document.querySelectorAll('.page-number');
    
    let currentPage = 1;
    
    // Previous button
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination(currentPage);
            loadPage(currentPage);
        }
    });
    
    // Next button
    nextBtn.addEventListener('click', function() {
        if (currentPage < 10) { // Assuming 10 pages
            currentPage++;
            updatePagination(currentPage);
            loadPage(currentPage);
        }
    });
    
    // Page numbers
    pageNumbers.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent !== '...') {
                currentPage = parseInt(this.textContent);
                updatePagination(currentPage);
                loadPage(currentPage);
            }
        });
    });
}

function updatePagination(page) {
    const prevBtn = document.querySelector('.btn-pagination.prev');
    const nextBtn = document.querySelector('.btn-pagination.next');
    const pageNumbers = document.querySelectorAll('.page-number');
    
    // Update button states
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === 10; // Assuming 10 pages
    
    // Update active page
    pageNumbers.forEach(btn => {
        if (btn.textContent !== '...') {
            btn.classList.remove('active');
            if (parseInt(btn.textContent) === page) {
                btn.classList.add('active');
            }
        }
    });
}

function loadPage(page) {
    showLoading();
    
    setTimeout(() => {
        // In production, this would fetch the specific page from API
        const data = generateMockHistory(30); // Generate fresh data for demo
        updateHistoryTable(data);
        hideLoading();
        updateStats();
        
        showAlert(`Loaded page ${page}`, 'info');
    }, 800);
}

function setupExportButton() {
    document.getElementById('exportHistoryBtn').addEventListener('click', function() {
        exportHistory();
    });
}

function exportHistory() {
    showAlert('Preparing export...', 'info');
    
    setTimeout(() => {
        // Create CSV data
        let csv = 'Date,Time,Type,Asset,Amount,Price,Total Value,Fee,Status\n';
        
        document.querySelectorAll('.history-table tbody tr').forEach(row => {
            const cells = row.cells;
            const rowData = [
                cells[0].querySelector('.date').textContent,
                cells[0].querySelector('.time').textContent,
                cells[1].querySelector('.tx-type').textContent,
                cells[2].querySelector('span').textContent,
                cells[3].textContent,
                cells[4].textContent.replace('$', ''),
                cells[5].textContent.replace('$', ''),
                cells[6].textContent.replace('$', ''),
                cells[7].querySelector('.status').textContent
            ];
            csv += rowData.join(',') + '\n';
        });
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transaction_history_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showAlert('History exported successfully', 'success');
    }, 1500);
}

function loadHistoryData() {
    showLoading();
    
    setTimeout(() => {
        const data = generateMockHistory(30);
        updateHistoryTable(data);
        hideLoading();
        updateStats();
    }, 1200);
}

function showLoading() {
    const tableBody = document.querySelector('.history-table tbody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="loading-cell">
                    <div class="loading">
                        <i class="fas fa-spinner fa-spin"></i>
                        <span>Loading history...</span>
                    </div>
                </td>
            </tr>
        `;
    }
}

function hideLoading() {
    // Loading state is removed when table is updated
}

function updateStats() {
    // Calculate statistics from visible rows
    const rows = document.querySelectorAll('.history-table tbody tr');
    
    let totalTrades = 0;
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalPL = 0;
    
    rows.forEach(row => {
        const type = row.querySelector('.tx-type').textContent.toLowerCase();
        const total = parseFloat(row.cells[5].textContent.replace(/[^0-9.-]/g, ''));
        
        if (type.includes('trade')) {
            totalTrades++;
            // Simple P/L calculation for demo
            const isBuy = type.includes('buy');
            totalPL += isBuy ? -total : total;
        } else if (type.includes('deposit')) {
            totalDeposits += total;
        } else if (type.includes('withdrawal')) {
            totalWithdrawals += total;
        }
    });
    
    // Update stat cards
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues.length >= 4) {
        statValues[0].textContent = totalTrades;
        statValues[1].textContent = `$${totalDeposits.toFixed(2)}`;
        statValues[2].textContent = `$${totalWithdrawals.toFixed(2)}`;
        statValues[3].textContent = `${totalPL >= 0 ? '+' : ''}$${Math.abs(totalPL).toFixed(2)}`;
        statValues[3].className = `stat-value ${totalPL >= 0 ? 'positive' : 'negative'}`;
    }
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#0A84FF'};
        color: white;
        border-radius: 6px;
        z-index: 10000;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Add modal styles
if (!document.querySelector('#history-modal-styles')) {
    const styles = document.createElement('style');
    styles.id = 'history-modal-styles';
    styles.textContent = `
        .date-modal .modal-content,
        .tx-modal .modal-content {
            max-width: 500px;
        }
        
        .date-inputs {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
        }
        
        .quick-ranges {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
        }
        
        .quick-range {
            padding: 12px;
            background: var(--light);
            border: 1px solid var(--light-gray);
            border-radius: 6px;
            color: var(--dark);
            font-family: var(--font-primary);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .quick-range:hover {
            background: white;
            border-color: var(--primary);
            color: var(--primary);
        }
        
        .tx-info {
            background: var(--light);
            padding: 24px;
            border-radius: 8px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .info-row:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }
        
        .info-row span:first-child {
            color: var(--gray);
        }
        
        .info-row span:last-child {
            font-weight: 500;
            text-align: right;
        }
        
        .tx-id {
            font-family: var(--font-mono);
            font-size: 0.9rem;
            word-break: break-all;
        }
        
        .tx-actions {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .loading-cell {
            text-align: center;
            padding: 60px 20px !important;
        }
        
        .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            color: var(--gray);
        }
        
        .loading i {
            font-size: 2rem;
            color: var(--primary);
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(styles);
}