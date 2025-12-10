// Orders Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Setup order tabs
    setupOrderTabs();
    
    // Setup order selection
    setupOrderSelection();
    
    // Setup action buttons
    setupOrderActions();
    
    // Setup quick actions
    setupQuickActions();
    
    // Setup new order button
    setupNewOrderButton();
    
    // Load orders data
    loadOrdersData();
    
    // Initialize real-time updates
    startOrderUpdates();
});

function setupOrderTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
            
            // Load data for selected tab
            loadTabData(tabId);
        });
    });
}

function loadTabData(tabId) {
    // In production, this would fetch data from API
    console.log('Loading data for tab:', tabId);
    
    // Simulate loading
    const emptyState = document.querySelector(`#${tabId}-tab .empty-state`);
    if (emptyState) {
        emptyState.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading ${tabId} orders...</p>
            </div>
        `;
        
        setTimeout(() => {
            // Simulate loaded data
            if (tabId === 'open') {
                emptyState.style.display = 'none';
            } else {
                emptyState.innerHTML = `
                    <i class="fas fa-${getTabIcon(tabId)}"></i>
                    <h3>No ${tabId} Orders</h3>
                    <p>Your ${tabId} orders will appear here</p>
                `;
                emptyState.style.display = 'flex';
            }
        }, 1000);
    }
}

function getTabIcon(tabId) {
    const icons = {
        'open': 'clock',
        'filled': 'check-circle',
        'canceled': 'ban',
        'all': 'list'
    };
    return icons[tabId] || 'list';
}

function setupOrderSelection() {
    // Select all checkbox
    const selectAll = document.getElementById('selectAll');
    const orderCheckboxes = document.querySelectorAll('.order-select');
    
    selectAll.addEventListener('change', function() {
        const isChecked = this.checked;
        orderCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        updateSelectedCount();
    });
    
    // Individual checkboxes
    orderCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCount);
    });
}

function updateSelectedCount() {
    const selectedCount = document.querySelectorAll('.order-select:checked').length;
    const selectedBtn = document.getElementById('cancelSelectedBtn');
    
    if (selectedBtn) {
        selectedBtn.disabled = selectedCount === 0;
        selectedBtn.textContent = `Cancel Selected (${selectedCount})`;
    }
}

function setupOrderActions() {
    // Cancel buttons
    document.querySelectorAll('.btn-action.cancel').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderRow = this.closest('tr');
            const orderId = orderRow.getAttribute('data-order-id') || 'order_' + Date.now();
            const pair = orderRow.cells[2].textContent;
            const side = orderRow.querySelector('.order-side').textContent;
            const price = orderRow.cells[5].textContent;
            
            cancelOrder(orderId, pair, side, price, orderRow);
        });
    });
    
    // Edit buttons
    document.querySelectorAll('.btn-action.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderRow = this.closest('tr');
            const orderId = orderRow.getAttribute('data-order-id') || 'order_' + Date.now();
            editOrder(orderId, orderRow);
        });
    });
}

function cancelOrder(orderId, pair, side, price, row) {
    if (confirm(`Cancel ${side} order for ${pair} at ${price}?`)) {
        // Show loading state
        row.style.opacity = '0.5';
        
        // Simulate API call
        setTimeout(() => {
            // Update status
            const statusCell = row.querySelector('.order-status');
            statusCell.textContent = 'Canceled';
            statusCell.className = 'order-status canceled';
            
            // Remove row after delay
            setTimeout(() => {
                row.style.transition = 'all 0.3s ease';
                row.style.transform = 'translateX(-100%)';
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    updateOpenOrdersCount();
                    updateSummary();
                    showAlert('Order canceled successfully', 'success');
                }, 300);
            }, 1000);
        }, 800);
    }
}

function editOrder(orderId, row) {
    // Get order details from row
    const pair = row.cells[2].textContent;
    const type = row.querySelector('.order-type').textContent;
    const side = row.querySelector('.order-side').textContent;
    const price = row.cells[5].textContent.replace('$', '');
    const amount = row.cells[6].textContent.split(' ')[0];
    
    // Open edit modal
    openEditOrderModal({
        id: orderId,
        pair: pair,
        type: type,
        side: side,
        price: parseFloat(price),
        amount: parseFloat(amount),
        row: row
    });
}

function openEditOrderModal(order) {
    const modal = document.createElement('div');
    modal.className = 'modal order-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Edit Order</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="order-info">
                    <div class="info-item">
                        <span>Pair:</span>
                        <span>${order.pair}</span>
                    </div>
                    <div class="info-item">
                        <span>Type:</span>
                        <span>${order.type}</span>
                    </div>
                    <div class="info-item">
                        <span>Side:</span>
                        <span class="order-side ${order.side.toLowerCase()}">${order.side}</span>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Price (USD)</label>
                    <input type="number" id="editPrice" value="${order.price}" step="0.01">
                </div>
                
                <div class="form-group">
                    <label>Amount</label>
                    <input type="number" id="editAmount" value="${order.amount}" step="0.00000001">
                </div>
                
                <div class="edit-summary">
                    <div class="summary-item">
                        <span>New Total</span>
                        <span id="newTotal">$${(order.price * order.amount).toFixed(2)}</span>
                    </div>
                    <div class="summary-item">
                        <span>Change</span>
                        <span id="priceChange" class="neutral">0.00%</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-save"></i> Update Order
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
    setupEditOrderModal(modal, order);
}

function setupEditOrderModal(modal, order) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const priceInput = modal.querySelector('#editPrice');
    const amountInput = modal.querySelector('#editAmount');
    const newTotalSpan = modal.querySelector('#newTotal');
    const priceChangeSpan = modal.querySelector('#priceChange');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Update summary on input change
    function updateEditSummary() {
        const newPrice = parseFloat(priceInput.value) || 0;
        const newAmount = parseFloat(amountInput.value) || 0;
        const newTotal = newPrice * newAmount;
        
        newTotalSpan.textContent = `$${newTotal.toFixed(2)}`;

        const priceChange = ((newPrice - order.price) / order.price * 100).toFixed(2);
        priceChangeSpan.textContent = `${priceChange >= 0 ? '+' : ''}${priceChange}%`;
        priceChangeSpan.className = priceChange >= 0 ? 'positive' : priceChange < 0 ? 'negative' : 'neutral';
    }
    
    priceInput.addEventListener('input', updateEditSummary);
    amountInput.addEventListener('input', updateEditSummary);
    
    // Confirm edit
    confirmBtn.addEventListener('click', function() {
        const newPrice = parseFloat(priceInput.value);
        const newAmount = parseFloat(amountInput.value);
        
        if (!newPrice || newPrice <= 0) {
            showAlert('Please enter a valid price', 'error');
            return;
        }
        
        if (!newAmount || newAmount <= 0) {
            showAlert('Please enter a valid amount', 'error');
            return;
        }
        
        // Update row in table
        order.row.cells[5].textContent = `$${newPrice.toFixed(2)}`;
        order.row.cells[6].textContent = `${newAmount} ${order.pair.split('/')[0]}`;
        order.row.cells[8].textContent = `$${(newPrice * newAmount).toFixed(2)}`;
        
        showAlert('Order updated successfully', 'success');
        closeModal();
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Initial summary update
    updateEditSummary();
}

function setupQuickActions() {
    // Cancel selected button
    document.getElementById('cancelSelectedBtn').addEventListener('click', function() {
        const selectedOrders = document.querySelectorAll('.order-select:checked');
        if (selectedOrders.length === 0) return;
        
        if (confirm(`Cancel ${selectedOrders.length} selected order(s)?`)) {
            selectedOrders.forEach(checkbox => {
                const row = checkbox.closest('tr');
                const cancelBtn = row.querySelector('.btn-action.cancel');
                if (cancelBtn) {
                    cancelBtn.click();
                }
            });
        }
    });
    
    // Export orders button
    document.getElementById('exportOrdersBtn').addEventListener('click', function() {
        exportOrders();
    });
    
    // Set alerts button
    document.getElementById('setAlertsBtn').addEventListener('click', function() {
        openAlertsModal();
    });
    
    // Cancel all button
    document.getElementById('cancelAllBtn').addEventListener('click', function() {
        const openOrders = document.querySelectorAll('#open-tab .orders-table tbody tr');
        if (openOrders.length === 0) return;
        
        if (confirm(`Cancel all ${openOrders.length} open orders?`)) {
            openOrders.forEach(row => {
                const cancelBtn = row.querySelector('.btn-action.cancel');
                if (cancelBtn) {
                    cancelBtn.click();
                }
            });
        }
    });
}

function exportOrders() {
    // Simulate export process
    showAlert('Preparing order export...', 'info');
    
    setTimeout(() => {
        // Create CSV data
        let csv = 'Date,Pair,Type,Side,Price,Amount,Filled,Total,Status\n';
        
        document.querySelectorAll('.orders-table tbody tr').forEach(row => {
            const cells = row.cells;
            const rowData = [
                cells[1].textContent,
                cells[2].textContent,
                cells[3].querySelector('.order-type').textContent,
                cells[4].querySelector('.order-side').textContent,
                cells[5].textContent.replace('$', ''),
                cells[6].textContent.split(' ')[0],
                cells[7].textContent.split(' ')[0],
                cells[8].textContent.replace('$', ''),
                cells[9].querySelector('.order-status').textContent
            ];
            csv += rowData.join(',') + '\n';
        });
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showAlert('Orders exported successfully', 'success');
    }, 1500);
}

function openAlertsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal alerts-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Set Price Alerts</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="alert-form">
                    <div class="form-group">
                        <label>Asset Pair</label>
                        <select id="alertPair">
                            <option value="BTC/USD">BTC/USD</option>
                            <option value="ETH/USD">ETH/USD</option>
                            <option value="SOL/USD">SOL/USD</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Alert Type</label>
                        <select id="alertType">
                            <option value="price_above">Price Above</option>
                            <option value="price_below">Price Below</option>
                            <option value="percent_change">Percent Change</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Target Price/Percent</label>
                        <input type="number" id="alertValue" placeholder="Enter value">
                    </div>
                    
                    <div class="alert-options">
                        <label class="checkbox">
                            <input type="checkbox" id="alertEmail">
                            <span>Email notification</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" id="alertPush" checked>
                            <span>Push notification</span>
                        </label>
                    </div>
                </div>
                
                <div class="active-alerts">
                    <h4>Active Alerts</h4>
                    <div class="alerts-list">
                        <div class="alert-item">
                            <div class="alert-info">
                                <span class="alert-pair">BTC/USD</span>
                                <span class="alert-condition">Price > $45,000</span>
                            </div>
                            <button class="btn-remove-alert">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="alert-item">
                            <div class="alert-info">
                                <span class="alert-pair">ETH/USD</span>
                                <span class="alert-condition">Price < $2,300</span>
                            </div>
                            <button class="btn-remove-alert">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-bell"></i> Set Alert
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup alerts modal
    setupAlertsModal(modal);
}

function setupAlertsModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const removeButtons = modal.querySelectorAll('.btn-remove-alert');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Remove alert buttons
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const alertItem = this.closest('.alert-item');
            alertItem.style.opacity = '0.5';
            setTimeout(() => {
                alertItem.remove();
                showAlert('Alert removed', 'info');
            }, 300);
        });
    });
    
    // Set new alert
    confirmBtn.addEventListener('click', function() {
        const pair = modal.querySelector('#alertPair').value;
        const type = modal.querySelector('#alertType').value;
        const value = modal.querySelector('#alertValue').value;
        
        if (!value) {
            showAlert('Please enter a value', 'error');
            return;
        }
        
        const condition = type === 'price_above' ? `Price > $${parseFloat(value).toLocaleString()}` :
                 type === 'price_below' ? `Price < $${parseFloat(value).toLocaleString()}` :
                 `Change > ${value}%`;
        
        // Add to active alerts
        const alertsList = modal.querySelector('.alerts-list');
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item';
        alertItem.innerHTML = `
            <div class="alert-info">
                <span class="alert-pair">${pair}</span>
                <span class="alert-condition">${condition}</span>
            </div>
            <button class="btn-remove-alert">
                <i class="fas fa-times"></i>
            </button>
        `;
        alertsList.appendChild(alertItem);
        
        // Setup remove button for new alert
        alertItem.querySelector('.btn-remove-alert').addEventListener('click', function() {
            alertItem.style.opacity = '0.5';
            setTimeout(() => {
                alertItem.remove();
                showAlert('Alert removed', 'info');
            }, 300);
        });
        
        showAlert('Price alert set successfully', 'success');
        
        // Clear form
        modal.querySelector('#alertValue').value = '';
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function setupNewOrderButton() {
    document.getElementById('newOrderBtn').addEventListener('click', function() {
        // Redirect to trade page
        window.location.href = 'trade.html';
    });
}

function loadOrdersData() {
    // Simulate loading orders from API
    setTimeout(() => {
        updateOpenOrdersCount();
        updateSummary();
    }, 1000);
}

function updateOpenOrdersCount() {
    const openOrders = document.querySelectorAll('#open-tab .orders-table tbody tr').length;
    const openTabBtn = document.querySelector('.tab-btn[data-tab="open"]');

    if (openTabBtn) {
        openTabBtn.textContent = `Open Orders (${openOrders})`;
    }
}

function updateSummary() {
    const openOrders = document.querySelectorAll('#open-tab .orders-table tbody tr');
    const totalValue = Array.from(openOrders).reduce((sum, row) => {
        const totalCell = row.cells[8].textContent;
        return sum + parseFloat(totalCell.replace(/[^0-9.]/g, ''));
    }, 0);
    
    const buyOrders = Array.from(openOrders).filter(row => 
        row.querySelector('.order-side').classList.contains('buy')
    ).length;
    
    const sellOrders = Array.from(openOrders).filter(row => 
        row.querySelector('.order-side').classList.contains('sell')
    ).length;
    
    // Update summary card
    document.querySelectorAll('.summary-item .value')[0].textContent = openOrders.length;
    document.querySelectorAll('.summary-item .value')[1].textContent = `$${totalValue.toFixed(2)}`;
    document.querySelectorAll('.summary-item .value')[2].textContent = buyOrders;
    document.querySelectorAll('.summary-item .value')[3].textContent = sellOrders;
}

function startOrderUpdates() {
    // Simulate order status updates
    setInterval(() => {
        simulateOrderUpdates();
    }, 10000);
}

function simulateOrderUpdates() {
    const openOrders = document.querySelectorAll('#open-tab .orders-table tbody tr');
    
    openOrders.forEach((row, index) => {
        if (Math.random() > 0.7) { // 30% chance of update
            const statusCell = row.querySelector('.order-status');
            const filledCell = row.cells[7];
            
            if (statusCell.textContent === 'Open') {
                // Partial fill
                if (Math.random() > 0.5) {
                    const amount = parseFloat(row.cells[6].textContent.split(' ')[0]);
                    const filled = Math.min(amount, amount * (0.1 + Math.random() * 0.4)); // 10-50% fill
                    filledCell.textContent = `${filled.toFixed(3)} ${row.cells[6].textContent.split(' ')[1]}`;
                    
                    if (filled >= amount * 0.99) {
                        // Fully filled
                        statusCell.textContent = 'Filled';
                        statusCell.className = 'order-status filled';
                        
                        // Move to filled tab after delay
                        setTimeout(() => {
                            row.remove();
                            updateOpenOrdersCount();
                            updateSummary();
                        }, 2000);
                    } else {
                        statusCell.textContent = 'Partial';
                        statusCell.className = 'order-status partial';
                    }
                }
            } else if (statusCell.textContent === 'Partial') {
                // Additional fill
                const amount = parseFloat(row.cells[6].textContent.split(' ')[0]);
                const currentFilled = parseFloat(filledCell.textContent.split(' ')[0]);
                    const additionalFill = Math.min(amount - currentFilled, amount * 0.2);

                if (additionalFill > 0) {
                    const newFilled = currentFilled + additionalFill;
                    filledCell.textContent = `${newFilled.toFixed(3)} ${row.cells[6].textContent.split(' ')[1]}`;
                    
                    if (newFilled >= amount * 0.99) {
                        statusCell.textContent = 'Filled';
                        statusCell.className = 'order-status filled';
                        
                        setTimeout(() => {
                            row.remove();
                            updateOpenOrdersCount();
                            updateSummary();
                        }, 2000);
                    }
                }
            }
        }
    });
    
    updateSummary();
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
if (!document.querySelector('#orders-modal-styles')) {
    const styles = document.createElement('style');
    styles.id = 'orders-modal-styles';
    styles.textContent = `
        .order-modal .modal-content,
        .alerts-modal .modal-content {
            max-width: 500px;
        }
        
        .order-info {
            background: var(--light);
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 0.9rem;
        }
        
        .info-item:last-child {
            margin-bottom: 0;
        }
        
        .edit-summary {
            background: var(--light);
            padding: 16px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .alert-form {
            margin-bottom: 30px;
        }
        
        .alert-options {
            display: flex;
            gap: 20px;
            margin-top: 16px;
        }
        
        .active-alerts {
            border-top: 1px solid var(--light-gray);
            padding-top: 20px;
        }
        
        .active-alerts h4 {
            margin-bottom: 16px;
            font-size: 1rem;
            color: var(--dark);
        }
        
        .alerts-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .alert-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: var(--light);
            border-radius: 6px;
        }
        
        .alert-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .alert-pair {
            font-weight: 500;
            color: var(--dark);
        }
        
        .alert-condition {
            font-size: 0.85rem;
            color: var(--gray);
        }
        
        .btn-remove-alert {
            background: none;
            border: none;
            color: var(--gray);
            cursor: pointer;
            padding: 4px;
        }
        
        .btn-remove-alert:hover {
            color: var(--danger);
        }
        
        .loading {
            text-align: center;
            padding: 40px;
        }
        
        .loading i {
            font-size: 2rem;
            color: var(--primary);
            margin-bottom: 16px;
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