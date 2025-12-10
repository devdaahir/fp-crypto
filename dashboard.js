// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();
    
    // Initialize market charts
    initMarketCharts();
    
    // Setup quick actions
    setupQuickActions();
    
    // Setup time filters
    setupTimeFilters();
    
    // Setup mobile sidebar
    setupMobileSidebar();
    
    // Load real-time data
    loadRealTimeData();
    
    // Setup auto-refresh
    setupAutoRefresh();
});

function loadUserData() {
    const user = JSON.parse(localStorage.getItem('fp_cryptotrade_user') || 
                           sessionStorage.getItem('fp_cryptotrade_user') || '{}');
    
    // Update user info
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    
    if (userName && user.email) {
        const name = user.name || user.email.split('@')[0];
        userName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    }
    
    if (userEmail && user.email) {
        userEmail.textContent = user.email;
    }
}

function initMarketCharts() {
    const marketCharts = document.querySelectorAll('.market-chart canvas');
    
    marketCharts.forEach((canvas, index) => {
        const ctx = canvas.getContext('2d');
        const colors = ['#0A84FF', '#627EEA', '#00D4AA', '#FF6B35'];
        
        // Generate mock data for different cryptocurrencies
        const data = [];
        let price = [100, 150, 200, 80][index % 4]; // Different starting prices
        
        for (let i = 0; i < 20; i++) {
            price += (Math.random() - 0.5) * 10;
            data.push(price);
        }
        
        drawMiniChart(ctx, data, colors[index % colors.length]);
    });
}

function drawMiniChart(ctx, data, color) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find min and max for scaling
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    data.forEach((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height * 0.8 - height * 0.1;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Fill area under line
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '00');
    
    ctx.fillStyle = gradient;
    ctx.fill();
}

function setupQuickActions() {
    const actionBtns = document.querySelectorAll('.action-btn');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            
            switch(action) {
                case 'Quick Trade':
                    window.location.href = 'trade.html';
                    break;
                case 'Deposit':
                    showModal('deposit-modal');
                    break;
                case 'Withdraw':
                    showModal('withdraw-modal');
                    break;
                case 'Analytics':
                    window.location.href = 'analytics.html';
                    break;
                case 'History':
                    window.location.href = 'history.html';
                    break;
                case 'Settings':
                    window.location.href = 'settings.html';
                    break;
            }
        });
    });
}

function setupTimeFilters() {
    const timeFilters = document.querySelectorAll('.time-filter');
    
    timeFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            timeFilters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Update data based on time filter
            const period = this.textContent;
            updateMarketData(period);
        });
    });
}

function updateMarketData(period) {
    // This would be an API call in production
    console.log('Updating market data for period:', period);
    
    // Simulate data update
    const statValues = document.querySelectorAll('.stat-value');
    if (statValues[1]) {
        // Update 24h profit
        const profit = Math.random() > 0.5 ? 
            `+$${(Math.random() * 500).toFixed(2)}` :
            `-$${(Math.random() * 200).toFixed(2)}`;
        
        statValues[1].textContent = profit;
        statValues[1].className = profit.startsWith('+') ? 'stat-value positive' : 'stat-value negative';
    }
}

function setupMobileSidebar() {
    if (window.innerWidth <= 992) {
        // Create mobile sidebar toggle
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-sidebar-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.appendChild(toggleBtn);
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        
        const sidebar = document.querySelector('.dashboard-sidebar');
        
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
        
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        // Close sidebar when clicking a link
        const sidebarLinks = sidebar.querySelectorAll('a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function() {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            });
        });
    }
}

function loadRealTimeData() {
    // Simulate real-time price updates
    setInterval(() => {
        const prices = document.querySelectorAll('.market-price .price');
        
        prices.forEach(priceEl => {
            const currentPrice = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
            const change = (Math.random() - 0.5) * 0.02; // +/- 1%
            const newPrice = currentPrice * (1 + change);
            
            priceEl.textContent = `$${newPrice.toFixed(2)}`;
            
            // Update change indicator
            const changeEl = priceEl.nextElementSibling;
            if (changeEl && changeEl.classList.contains('change')) {
                const changeAmount = newPrice - currentPrice;
                changeEl.textContent = `${changeAmount >= 0 ? '+' : '-'}$${Math.abs(changeAmount).toFixed(2)}`;
                changeEl.style.color = changeAmount >= 0 ? 'var(--success)' : 'var(--danger)';
            }
            
            // Update trend indicator
            const marketCard = priceEl.closest('.market-card');
            const trendEl = marketCard.querySelector('.market-trend');
            if (trendEl) {
                const trendValue = Math.abs(change * 100).toFixed(1);
                trendEl.innerHTML = `<i class="fas fa-arrow-${change >= 0 ? 'up' : 'down'}"></i> ${change >= 0 ? '+' : ''}${trendValue}%`;
                trendEl.className = `market-trend ${change >= 0 ? 'positive' : 'negative'}`;
            }
        });
    }, 5000); // Update every 5 seconds
}

function setupAutoRefresh() {
    // Auto-refresh dashboard every 30 seconds
    setInterval(() => {
        refreshDashboard();
    }, 30000);
}

function refreshDashboard() {
    // Refresh different sections
    updateBalance();
    updateRecentActivity();
    updateMarketCharts();
}

function updateBalance() {
    // Simulate balance update
    const balanceEl = document.getElementById('totalBalance');
    if (balanceEl) {
        const currentBalance = parseFloat(balanceEl.textContent.replace(/[^0-9.]/g, ''));
        const change = (Math.random() - 0.5) * 100; // Random change
        const newBalance = currentBalance + change;
        
        balanceEl.textContent = `$${newBalance.toFixed(2)}`;
        
        // Update 24h profit
        const profitEl = document.querySelector('.stat-value.positive') || 
                         document.querySelector('.stat-value.negative');
        if (profitEl) {
            profitEl.textContent = `${change >= 0 ? '+' : '-'}$${Math.abs(change).toFixed(2)}`;
            profitEl.className = `stat-value ${change >= 0 ? 'positive' : 'negative'}`;
        }
    }
}

function updateRecentActivity() {
    // Simulate new activity
    const activityTable = document.querySelector('.activity-table tbody');
    if (activityTable) {
        const activities = [
            {type: 'buy', asset: 'BTC/USD', amount: '0.01', price: '$42,500.00', total: '$425.00', status: 'completed'},
            {type: 'sell', asset: 'ETH/USD', amount: '0.5', price: '$2,340.00', total: '$1,170.00', status: 'completed'},
            {type: 'deposit', asset: 'USD', amount: '$1,000.00', price: '-', total: '$1,000.00', status: 'pending'}
        ];
        
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><span class="trade-type ${activity.type}">${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</span></td>
            <td>${activity.asset}</td>
            <td>${activity.amount}</td>
            <td>${activity.price}</td>
            <td>${activity.total}</td>
            <td><span class="status ${activity.status}">${activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}</span></td>
            <td>Just now</td>
        `;
        
        // Add new row at the top
        activityTable.insertBefore(row, activityTable.firstChild);
        
        // Remove oldest row if more than 10
        if (activityTable.children.length > 10) {
            activityTable.removeChild(activityTable.lastChild);
        }
    }
}

function updateMarketCharts() {
    const marketCharts = document.querySelectorAll('.market-chart canvas');
    
    marketCharts.forEach((canvas, index) => {
        const ctx = canvas.getContext('2d');
        const colors = ['#0A84FF', '#627EEA', '#00D4AA', '#FF6B35'];
        
        // Get existing data pattern and extend it
        const data = [];
        let price = [100, 150, 200, 80][index % 4];
        
        for (let i = 0; i < 20; i++) {
            price += (Math.random() - 0.5) * 8;
            data.push(price);
        }
        
        drawMiniChart(ctx, data, colors[index % colors.length]);
    });
}

function showModal(modalId) {
    // Create modal dynamically
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = modalId;
    
    let modalContent = '';
    
    if (modalId === 'deposit-modal') {
        modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Deposit Funds</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="deposit-methods">
                        <div class="method active">
                            <i class="fas fa-university"></i>
                            <span>Bank Transfer</span>
                        </div>
                        <div class="method">
                            <i class="fab fa-cc-stripe"></i>
                            <span>Credit Card</span>
                        </div>
                        <div class="method">
                            <i class="fas fa-coins"></i>
                            <span>Crypto</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Amount (USD)</label>
                        <input type="number" placeholder="Enter amount" min="10" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label>Payment Method Details</label>
                        <div class="payment-details">
                            <p>Bank: CryptoBank International</p>
                            <p>Account: 1234567890</p>
                            <p>Routing: 987654321</p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-cancel">Cancel</button>
                    <button class="btn btn-primary modal-confirm">Deposit</button>
                </div>
            </div>
        `;
    } else if (modalId === 'withdraw-modal') {
        modalContent = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Withdraw Funds</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Amount (USD)</label>
                        <input type="number" placeholder="Enter amount" min="10" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label>Destination Address</label>
                        <input type="text" placeholder="Enter wallet address">
                    </div>
                    
                    <div class="form-group">
                        <label>Network</label>
                        <select>
                            <option>Ethereum (ERC-20)</option>
                            <option>Bitcoin (BTC)</option>
                            <option>Solana (SOL)</option>
                        </select>
                    </div>
                    
                    <div class="fee-info">
                        <p>Network fee: $5.00</p>
                        <p>Processing time: 15-30 minutes</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-cancel">Cancel</button>
                    <button class="btn btn-primary modal-confirm">Withdraw</button>
                </div>
            </div>
        `;
    }
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add modal styles if not already present
    if (!document.querySelector('#modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .modal.show {
                opacity: 1;
            }
            
            .modal-content {
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                transform: translateY(-20px);
                transition: transform 0.3s ease;
            }
            
            .modal.show .modal-content {
                transform: translateY(0);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px;
                border-bottom: 1px solid var(--light-gray);
            }
            
            .modal-header h3 {
                margin: 0;
                font-size: 1.5rem;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: var(--gray);
                line-height: 1;
            }
            
            .modal-body {
                padding: 24px;
            }
            
            .modal-footer {
                padding: 24px;
                border-top: 1px solid var(--light-gray);
                display: flex;
                gap: 12px;
                justify-content: flex-end;
            }
            
            .deposit-methods {
                display: flex;
                gap: 12px;
                margin-bottom: 24px;
            }
            
            .method {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 16px;
                border: 2px solid var(--light-gray);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .method i {
                font-size: 1.5rem;
                color: var(--gray);
            }
            
            .method.active {
                border-color: var(--primary);
                background: rgba(10, 132, 255, 0.05);
            }
            
            .method.active i {
                color: var(--primary);
            }
            
            .payment-details {
                background: var(--light);
                padding: 16px;
                border-radius: 8px;
                font-family: var(--font-mono);
                font-size: 0.9rem;
            }
            
            .fee-info {
                background: var(--light);
                padding: 16px;
                border-radius: 8px;
                font-size: 0.9rem;
                margin-top: 16px;
            }
            
            .fee-info p {
                margin: 4px 0;
            }
        `;
        document.head.appendChild(modalStyles);
    }
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup modal event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const methods = modal.querySelectorAll('.method');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    
    confirmBtn?.addEventListener('click', function() {
        // Handle confirm action
        const amountInput = modal.querySelector('input[type="number"]');
        if (amountInput && parseFloat(amountInput.value) >= 10) {
            showAlert(`${modalId === 'deposit-modal' ? 'Deposit' : 'Withdrawal'} request submitted!`, 'success');
            closeModal();
        } else {
            showAlert('Please enter a valid amount (minimum $10)', 'error');
        }
    });
    
    methods.forEach(method => {
        method.addEventListener('click', function() {
            methods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}