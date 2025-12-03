// Actions Page JavaScript - FP-CryptoTrade
document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();
    
    // Initialize action cards
    initActionCards();
    
    // Initialize performance chart
    initPerformanceChart();
    
    // Setup action buttons
    setupActionButtons();
    
    // Setup template buttons
    setupTemplateButtons();
    
    // Setup time filters
    setupActionTimeFilters();
    
    // Setup action table controls
    setupActionTableControls();
    
    // Load active actions data
    loadActiveActions();
    
    // Initialize real-time updates
    if (document.querySelector('.actions-table')) {
        startActionUpdates();
    }
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

function initActionCards() {
    const actionCards = document.querySelectorAll('.action-card .btn-primary');
    
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const actionTitle = this.closest('.action-card').querySelector('h3').textContent;
            openActionCreation(actionTitle);
        });
    });
}

function openActionCreation(actionType) {
    // Create action creation modal
    const modal = document.createElement('div');
    modal.className = 'modal action-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Configure ${actionType}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="strategy-selection">
                    <div class="strategy-option selected">
                        <div class="strategy-icon">
                            <i class="fas fa-bullseye"></i>
                        </div>
                        <h4>Conservative</h4>
                        <p>Low risk, steady returns</p>
                    </div>
                    <div class="strategy-option">
                        <div class="strategy-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h4>Balanced</h4>
                        <p>Moderate risk & returns</p>
                    </div>
                    <div class="strategy-option">
                        <div class="strategy-icon">
                            <i class="fas fa-rocket"></i>
                        </div>
                        <h4>Aggressive</h4>
                        <p>High risk, high returns</p>
                    </div>
                </div>
                
                <div class="parameter-group">
                    <h4>Investment Parameters</h4>
                    <div class="parameter-row">
                        <label class="parameter-label">Investment Amount</label>
                        <div class="parameter-value">
                            <input type="range" id="amountRange" min="100" max="10000" step="100" value="1000">
                            <span class="range-value">$1,000</span>
                        </div>
                    </div>
                    <div class="parameter-row">
                        <label class="parameter-label">Risk Tolerance</label>
                        <div class="parameter-value">
                            <input type="range" id="riskRange" min="1" max="10" step="1" value="5">
                            <span class="range-value">5/10</span>
                        </div>
                    </div>
                    <div class="parameter-row">
                        <label class="parameter-label">Duration</label>
                        <div class="parameter-value">
                            <select id="durationSelect">
                                <option value="7">1 Week</option>
                                <option value="30" selected>1 Month</option>
                                <option value="90">3 Months</option>
                                <option value="180">6 Months</option>
                                <option value="0">Indefinite</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="parameter-group">
                    <h4>Assets to Trade</h4>
                    <div class="asset-selection">
                        <label class="checkbox">
                            <input type="checkbox" name="assets" value="BTC" checked>
                            <span>Bitcoin (BTC)</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="assets" value="ETH" checked>
                            <span>Ethereum (ETH)</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="assets" value="SOL">
                            <span>Solana (SOL)</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="assets" value="ADA">
                            <span>Cardano (ADA)</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="assets" value="DOT">
                            <span>Polkadot (DOT)</span>
                        </label>
                    </div>
                </div>
                
                <div class="summary-card">
                    <h4>Action Summary</h4>
                    <div class="summary-content">
                        <div class="summary-row">
                            <span>Estimated Monthly Return:</span>
                            <span class="summary-value positive">+8.5%</span>
                        </div>
                        <div class="summary-row">
                            <span>Max Drawdown:</span>
                            <span class="summary-value">-15%</span>
                        </div>
                        <div class="summary-row">
                            <span>Success Probability:</span>
                            <span class="summary-value">92%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-play"></i> Start Action
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles if not already present
    if (!document.querySelector('#action-modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'action-modal-styles';
        modalStyles.textContent = `
            .action-modal .modal-content {
                max-width: 700px;
            }
            
            .strategy-selection {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }
            
            .strategy-option {
                padding: 20px;
                border: 2px solid var(--light-gray);
                border-radius: 8px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .strategy-option:hover {
                border-color: var(--primary);
                background: rgba(10, 132, 255, 0.05);
            }
            
            .strategy-option.selected {
                border-color: var(--primary);
                background: rgba(10, 132, 255, 0.1);
            }
            
            .strategy-icon {
                font-size: 2rem;
                color: var(--primary);
                margin-bottom: 12px;
            }
            
            .strategy-option h4 {
                margin-bottom: 8px;
                font-size: 1.1rem;
            }
            
            .strategy-option p {
                color: var(--gray);
                font-size: 0.9rem;
            }
            
            .parameter-group {
                margin-bottom: 24px;
            }
            
            .parameter-group h4 {
                margin-bottom: 16px;
                font-size: 1.1rem;
            }
            
            .parameter-row {
                display: grid;
                grid-template-columns: 1fr 2fr;
                gap: 20px;
                align-items: center;
                margin-bottom: 16px;
            }
            
            .parameter-label {
                font-weight: 500;
                color: var(--dark);
            }
            
            .parameter-value {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .parameter-value input[type="range"] {
                flex: 1;
            }
            
            .range-value {
                min-width: 60px;
                text-align: right;
                font-family: var(--font-mono);
            }
            
            .parameter-value select {
                width: 100%;
                padding: 10px;
                border: 2px solid var(--light-gray);
                border-radius: 6px;
                font-family: var(--font-primary);
            }
            
            .asset-selection {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 12px;
            }
            
            .asset-selection .checkbox {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
            }
            
            .summary-card {
                background: var(--light);
                padding: 20px;
                border-radius: 8px;
                margin-top: 24px;
            }
            
            .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            }
            
            .summary-row:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
            }
            
            .summary-value {
                font-weight: 600;
            }
            
            .summary-value.positive {
                color: var(--success);
            }
        `;
        document.head.appendChild(modalStyles);
    }
    
    // Show modal with animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup modal interactions
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const strategyOptions = modal.querySelectorAll('.strategy-option');
    const amountRange = modal.querySelector('#amountRange');
    const amountValue = modal.querySelector('#amountRange').nextElementSibling;
    const riskRange = modal.querySelector('#riskRange');
    const riskValue = modal.querySelector('#riskRange').nextElementSibling;
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    confirmBtn.addEventListener('click', function() {
        const amount = amountRange.value;
        const risk = riskRange.value;
        const duration = modal.querySelector('#durationSelect').value;
        const selectedAssets = Array.from(modal.querySelectorAll('input[name="assets"]:checked'))
            .map(cb => cb.value);
        
        // Start the action
        startAction(actionType, amount, risk, duration, selectedAssets);
        closeModal();
    });
    
    // Strategy selection
    strategyOptions.forEach(option => {
        option.addEventListener('click', function() {
            strategyOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            updateActionSummary();
        });
    });
    
    // Range updates
    amountRange.addEventListener('input', function() {
        amountValue.textContent = `$${parseInt(this.value).toLocaleString()}`;
        updateActionSummary();
    });
    
    riskRange.addEventListener('input', function() {
        riskValue.textContent = `${this.value}/10`;
        updateActionSummary();
    });
    
    function updateActionSummary() {
        // Update summary based on selected parameters
        const amount = parseInt(amountRange.value);
        const risk = parseInt(riskRange.value);
        const selectedStrategy = modal.querySelector('.strategy-option.selected h4').textContent;
        
        // Calculate estimated returns (simplified)
        let baseReturn = 0.05; // 5% base
        
        if (selectedStrategy === 'Conservative') baseReturn = 0.04;
        if (selectedStrategy === 'Balanced') baseReturn = 0.065;
        if (selectedStrategy === 'Aggressive') baseReturn = 0.09;
        
        // Adjust based on risk
        const riskMultiplier = 1 + ((risk - 5) * 0.02);
        const estimatedReturn = (baseReturn * riskMultiplier * 100).toFixed(1);
        
        // Update summary
        const returnEl = modal.querySelector('.summary-row:nth-child(1) .summary-value');
        if (returnEl) {
            returnEl.textContent = `+${estimatedReturn}%`;
            returnEl.className = `summary-value ${parseFloat(estimatedReturn) > 0 ? 'positive' : ''}`;
        }
    }
    
    // Initial summary update
    updateActionSummary();
    
    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function startAction(actionType, amount, risk, duration, assets) {
    // Show loading state
    showAlert(`Starting ${actionType} with $${amount}...`, 'info');
    
    // Simulate API call
    setTimeout(() => {
        // Create new action entry
        const actionId = 'action_' + Date.now();
        const newAction = {
            id: actionId,
            name: `${actionType} - ${risk}/10 Risk`,
            type: actionType,
            assets: assets.join(', '),
            amount: `$${parseInt(amount).toLocaleString()}`,
            profit: '+$0.00',
            status: 'active',
            started: 'Just now'
        };
        
        // Store in localStorage (simulated)
        const userActions = JSON.parse(localStorage.getItem('fp_user_actions') || '[]');
        userActions.unshift(newAction);
        localStorage.setItem('fp_user_actions', JSON.stringify(userActions));
        
        // Update UI
        addActionToTable(newAction);
        
        showAlert(`${actionType} started successfully!`, 'success');
        
        // Update active actions count
        updateActiveActionsCount();
    }, 1500);
}

function addActionToTable(action) {
    const tableBody = document.querySelector('.actions-table tbody');
    if (!tableBody) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="action-info">
                <div class="action-icon-sm">
                    <i class="fas fa-${getActionIcon(action.type)}"></i>
                </div>
                <div>
                    <strong>${action.name}</strong>
                    <span class="action-date">Started ${action.started}</span>
                </div>
            </div>
        </td>
        <td>${action.type}</td>
        <td>${action.assets}</td>
        <td>${action.amount}</td>
        <td><span class="profit neutral">${action.profit}</span></td>
        <td><span class="status active">Running</span></td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon" title="Pause">
                    <i class="fas fa-pause"></i>
                </button>
                <button class="btn-icon" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" title="Stop">
                    <i class="fas fa-stop"></i>
                </button>
            </div>
        </td>
    `;
    
    // Add at the top
    tableBody.insertBefore(row, tableBody.firstChild);
    
    // Add event listeners to new buttons
    setupRowButtons(row);
}

function getActionIcon(actionType) {
    const icons = {
        'AI Trading Bot': 'robot',
        'Grid Trading': 'chart-line',
        'Yield Farming': 'coins',
        'Stop-Loss Automation': 'shield-alt',
        'Custom Action': 'bolt',
        'DCA Bot': 'chart-bar',
        'Swing Trading': 'exchange-alt',
        'Arbitrage': 'sync-alt',
        'Staking': 'gem'
    };
    return icons[actionType] || 'bolt';
}

function setupRowButtons(row) {
    const buttons = row.querySelectorAll('.btn-icon');
    buttons.forEach(btn => {
        const icon = btn.querySelector('i');
        const action = btn.getAttribute('title').toLowerCase();
        
        btn.addEventListener('click', function() {
            const actionName = row.querySelector('strong').textContent;
            
            switch(action) {
                case 'pause':
                    if (icon.classList.contains('fa-pause')) {
                        icon.classList.remove('fa-pause');
                        icon.classList.add('fa-play');
                        btn.setAttribute('title', 'Resume');
                        row.querySelector('.status').textContent = 'Paused';
                        row.querySelector('.status').className = 'status paused';
                        showAlert(`${actionName} paused`, 'warning');
                    } else {
                        icon.classList.remove('fa-play');
                        icon.classList.add('fa-pause');
                        btn.setAttribute('title', 'Pause');
                        row.querySelector('.status').textContent = 'Running';
                        row.querySelector('.status').className = 'status active';
                        showAlert(`${actionName} resumed`, 'success');
                    }
                    break;
                    
                case 'edit':
                    showAlert(`Editing ${actionName}...`, 'info');
                    // In production, this would open an edit modal
                    break;
                    
                case 'stop':
                    if (confirm(`Are you sure you want to stop ${actionName}?`)) {
                        row.querySelector('.status').textContent = 'Stopped';
                        row.querySelector('.status').className = 'status stopped';
                        showAlert(`${actionName} stopped`, 'info');
                        updateActiveActionsCount();
                    }
                    break;
                    
                case 'disable':
                    if (confirm(`Disable ${actionName}?`)) {
                        row.remove();
                        showAlert(`${actionName} disabled`, 'info');
                        updateActiveActionsCount();
                    }
                    break;
            }
        });
    });
}

function updateActiveActionsCount() {
    const activeCount = document.querySelectorAll('.status.active, .status.monitoring').length;
    const countElement = document.querySelector('.header-stats .stat:nth-child(3) .stat-value');
    if (countElement) {
        countElement.textContent = activeCount;
    }
}

function setupActionButtons() {
    // Create New Action button
    const createBtn = document.querySelector('.active-actions .btn-primary');
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            openActionCreation('Custom Action');
        });
    }
    
    // Setup table action buttons
    const rows = document.querySelectorAll('.actions-table tbody tr');
    rows.forEach(row => {
        setupRowButtons(row);
    });
}

function setupTemplateButtons() {
    const templateButtons = document.querySelectorAll('.template-card .btn');
    
    templateButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const templateName = this.closest('.template-card').querySelector('h3').textContent;
            applyTemplate(templateName);
        });
    });
}

function applyTemplate(templateName) {
    const templates = {
        "Beginner's DCA": {
            type: "DCA Bot",
            amount: "500",
            risk: "3",
            assets: ["BTC", "ETH"]
        },
        "Swing Trading Pro": {
            type: "Swing Trading",
            amount: "2000",
            risk: "7",
            assets: ["BTC", "ETH", "SOL"]
        },
        "Arbitrage Bot": {
            type: "Arbitrage",
            amount: "5000",
            risk: "8",
            assets: ["BTC", "ETH", "USDT"]
        },
        "Staking Portfolio": {
            type: "Staking",
            amount: "1000",
            risk: "2",
            assets: ["ETH", "SOL", "ADA", "DOT"]
        }
    };
    
    const template = templates[templateName];
    if (template) {
        // Open action creation with template values
        openTemplateAction(templateName, template);
    }
}

function openTemplateAction(templateName, template) {
    const modal = document.createElement('div');
    modal.className = 'modal action-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Apply ${templateName} Template</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="template-preview">
                    <h4>Template Configuration:</h4>
                    <ul>
                        <li>Strategy: ${template.type}</li>
                        <li>Recommended Amount: $${template.amount}</li>
                        <li>Risk Level: ${template.risk}/10</li>
                        <li>Assets: ${template.assets.join(', ')}</li>
                    </ul>
                    <p class="template-description">
                        This template is pre-configured for optimal performance based on historical data.
                    </p>
                </div>
                
                <div class="parameter-group">
                    <h4>Customize Settings</h4>
                    <div class="parameter-row">
                        <label class="parameter-label">Investment Amount</label>
                        <div class="parameter-value">
                            <input type="range" id="amountRange" min="100" max="10000" step="100" value="${template.amount}">
                            <span class="range-value">$${template.amount}</span>
                        </div>
                    </div>
                    <div class="parameter-row">
                        <label class="parameter-label">Risk Tolerance</label>
                        <div class="parameter-value">
                            <input type="range" id="riskRange" min="1" max="10" step="1" value="${template.risk}">
                            <span class="range-value">${template.risk}/10</span>
                        </div>
                    </div>
                </div>
                
                <div class="summary-card">
                    <h4>Expected Performance</h4>
                    <div class="summary-content">
                        <div class="summary-row">
                            <span>Estimated Monthly Return:</span>
                            <span class="summary-value positive">+${template.risk * 1.2}%</span>
                        </div>
                        <div class="summary-row">
                            <span>Success Rate:</span>
                            <span class="summary-value">${95 - template.risk * 2}%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-check"></i> Apply Template
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
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const amountRange = modal.querySelector('#amountRange');
    const amountValue = modal.querySelector('#amountRange').nextElementSibling;
    const riskRange = modal.querySelector('#riskRange');
    const riskValue = modal.querySelector('#riskRange').nextElementSibling;
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    confirmBtn.addEventListener('click', function() {
        const amount = amountRange.value;
        const risk = riskRange.value;
        
        // Apply template
        startAction(template.type, amount, risk, '30', template.assets);
        closeModal();
    });
    
    // Update range values
    amountRange.addEventListener('input', function() {
        amountValue.textContent = `$${parseInt(this.value).toLocaleString()}`;
    });
    
    riskRange.addEventListener('input', function() {
        riskValue.textContent = `${this.value}/10`;
        
        // Update expected performance
        const returnEl = modal.querySelector('.summary-row:nth-child(1) .summary-value');
        const successEl = modal.querySelector('.summary-row:nth-child(2) .summary-value');
        
        if (returnEl) {
            const expectedReturn = (this.value * 1.2).toFixed(1);
            returnEl.textContent = `+${expectedReturn}%`;
        }
        
        if (successEl) {
            const successRate = 95 - (this.value * 2);
            successEl.textContent = `${successRate}%`;
        }
    });
    
    // Close modal on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function setupActionTimeFilters() {
    const timeFilters = document.querySelectorAll('.performance-analytics .time-filter');
    
    timeFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active class from all filters
            timeFilters.forEach(f => f.classList.remove('active'));
            
            // Add active class to clicked filter
            this.classList.add('active');
            
            // Update chart based on time period
            const period = this.textContent;
            updatePerformanceChart(period);
        });
    });
}

function initPerformanceChart() {
    const ctx = document.getElementById('performanceChart');
    if (!ctx) return;
    
    // Mock performance data
    const performanceData = {
        '1W': [100, 102, 101, 103, 105, 107, 108],
        '1M': [100, 102, 105, 103, 106, 108, 110, 112, 115, 113, 116, 118, 120, 122, 125, 123, 126, 128, 130, 132, 135, 133, 136, 138, 140, 142, 145, 143, 146, 148],
        '3M': [100, 105, 103, 108, 112, 115, 118, 120, 125, 128, 130, 135, 138, 140, 145, 148, 150, 155, 158, 160, 165, 168, 170, 175, 178, 180, 185, 188, 190],
        '1Y': [100, 98, 102, 105, 103, 108, 112, 115, 118, 120, 125, 128, 135, 138, 140, 145, 148, 150, 155, 158, 165, 168, 170, 175, 178, 185, 188, 190, 195, 198, 200, 205, 208, 210, 215, 218, 220, 225, 228, 235, 238, 240, 245, 248, 250, 255, 258, 260, 265, 268, 270]
    };
    
    // Create chart
    window.performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: performanceData['1W'].map((_, i) => `Day ${i + 1}`),
            datasets: [{
                label: 'Portfolio Value',
                data: performanceData['1W'],
                borderColor: '#0A84FF',
                backgroundColor: 'rgba(10, 132, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Value: $${context.raw}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        borderDash: [2, 2],
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

function updatePerformanceChart(period) {
    if (!window.performanceChart) return;
    
    const performanceData = {
        '1W': [100, 102, 101, 103, 105, 107, 108],
        '1M': [100, 102, 105, 103, 106, 108, 110, 112, 115, 113, 116, 118, 120, 122, 125, 123, 126, 128, 130, 132, 135, 133, 136, 138, 140, 142, 145, 143, 146, 148],
        '3M': [100, 105, 103, 108, 112, 115, 118, 120, 125, 128, 130, 135, 138, 140, 145, 148, 150, 155, 158, 160, 165, 168, 170, 175, 178, 180, 185, 188, 190, 195, 198, 200, 205, 208, 210, 215, 218, 220, 225, 228, 230, 235, 238, 240, 245, 248, 250, 255, 258, 260, 265, 268, 270, 275, 278, 280, 285, 288, 290, 295],
        '1Y': [100, 98, 102, 105, 103, 108, 112, 115, 118, 120, 125, 128, 135, 138, 140, 145, 148, 150, 155, 158, 165, 168, 170, 175, 178, 185, 188, 190, 195, 198, 200, 205, 208, 210, 215, 218, 220, 225, 228, 235, 238, 240, 245, 248, 250, 255, 258, 260, 265, 268, 270, 275, 278, 280, 285, 288, 290, 295, 298, 300, 305, 308, 310, 315, 318, 320, 325, 328, 330, 335, 338, 340, 345, 348, 350]
    };
    
    const labels = {
        '1W': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        '1M': Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
        '3M': Array.from({length: 90}, (_, i) => `Week ${Math.floor(i/7) + 1}`),
        '1Y': Array.from({length: 12}, (_, i) => `Month ${i + 1}`)
    };
    
    window.performanceChart.data.labels = labels[period] || labels['1W'];
    window.performanceChart.data.datasets[0].data = performanceData[period] || performanceData['1W'];
    window.performanceChart.update();
}

function setupActionTableControls() {
    // Search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search actions...';
    searchInput.className = 'action-search';
    searchInput.style.cssText = `
        margin-bottom: 20px;
        padding: 10px 16px;
        border: 2px solid var(--light-gray);
        border-radius: 8px;
        width: 100%;
        font-family: var(--font-primary);
    `;
    
    const actionsSection = document.querySelector('.active-actions');
    if (actionsSection) {
        const header = actionsSection.querySelector('.section-header');
        if (header) {
            header.parentNode.insertBefore(searchInput, header.nextElementSibling);
            
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const rows = document.querySelectorAll('.actions-table tbody tr');
                
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            });
        }
    }
    
    // Sort functionality
    const sortSelect = document.createElement('select');
    sortSelect.innerHTML = `
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="profit-high">Highest Profit</option>
        <option value="profit-low">Lowest Profit</option>
    `;
    sortSelect.className = 'action-sort';
    sortSelect.style.cssText = `
        margin-left: 12px;
        padding: 8px 12px;
        border: 2px solid var(--light-gray);
        border-radius: 6px;
        font-family: var(--font-primary);
    `;
    
    const createBtn = document.querySelector('.active-actions .btn-primary');
    if (createBtn) {
        createBtn.parentNode.insertBefore(sortSelect, createBtn);
        
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            sortActionsTable(sortBy);
        });
    }
}

function sortActionsTable(sortBy) {
    const tableBody = document.querySelector('.actions-table tbody');
    if (!tableBody) return;
    
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        switch(sortBy) {
            case 'newest':
                // Assuming newest are at the top by default
                return 0;
                
            case 'oldest':
                // Reverse order
                const allRows = Array.from(tableBody.querySelectorAll('tr'));
                tableBody.innerHTML = '';
                allRows.reverse().forEach(row => tableBody.appendChild(row));
                return 0;
                
            case 'profit-high':
                const profitA = parseFloat(a.querySelector('.profit').textContent.replace(/[^0-9.-]/g, ''));
                const profitB = parseFloat(b.querySelector('.profit').textContent.replace(/[^0-9.-]/g, ''));
                return profitB - profitA;
                
            case 'profit-low':
                const profitA2 = parseFloat(a.querySelector('.profit').textContent.replace(/[^0-9.-]/g, ''));
                const profitB2 = parseFloat(b.querySelector('.profit').textContent.replace(/[^0-9.-]/g, ''));
                return profitA2 - profitB2;
                
            default:
                return 0;
        }
    });
}

function loadActiveActions() {
    // Simulate loading actions from API
    setTimeout(() => {
        // Update profit values randomly
        const profitCells = document.querySelectorAll('.profit:not(.neutral)');
        profitCells.forEach(cell => {
            const isPositive = Math.random() > 0.3;
            const amount = (Math.random() * 500).toFixed(2);
            cell.textContent = `${isPositive ? '+' : '-'}$${amount}`;
            cell.className = `profit ${isPositive ? 'positive' : 'negative'}`;
        });
        
        // Update status randomly
        const statusCells = document.querySelectorAll('.status');
        statusCells.forEach(cell => {
            if (cell.textContent === 'Running' && Math.random() > 0.8) {
                cell.textContent = 'Paused';
                cell.className = 'status paused';
            }
        });
    }, 2000);
}

// Real-time updates for actions
function startActionUpdates() {
    setInterval(() => {
        updateActionProfits();
        updateActionStatus();
    }, 10000); // Update every 10 seconds
}

function updateActionProfits() {
    const profitCells = document.querySelectorAll('.profit:not(.neutral)');
    profitCells.forEach(cell => {
        const currentProfit = parseFloat(cell.textContent.replace(/[^0-9.-]/g, ''));
                const change = (Math.random() - 0.5) * 20; // Random change up to $10
        const newProfit = currentProfit + change;
        
        cell.textContent = `${newProfit >= 0 ? '+' : '-'}$${Math.abs(newProfit).toFixed(2)}`;
        cell.className = `profit ${newProfit >= 0 ? 'positive' : 'negative'}`;
    });
}

function updateActionStatus() {
    const statusCells = document.querySelectorAll('.status');
    statusCells.forEach(cell => {
        if (cell.textContent === 'Running' && Math.random() > 0.95) {
            // Small chance to change status
            cell.textContent = 'Paused';
            cell.className = 'status paused';
        } else if (cell.textContent === 'Paused' && Math.random() > 0.9) {
            cell.textContent = 'Running';
            cell.className = 'status active';
        }
    });
}

// Alert function for user feedback
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <span class="alert-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </span>
        <span class="alert-message">${message}</span>
        <button class="alert-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(alert);
    
    // Show alert with animation
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.classList.remove('show');
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.addEventListener('click', () => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 300);
    });
}

// Add alert styles if not already present
if (!document.querySelector('#alert-styles')) {
    const alertStyles = document.createElement('style');
    alertStyles.id = 'alert-styles';
    alertStyles.textContent = `
        .alert {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            z-index: 9999;
            box-shadow: var(--shadow-lg);
        }
        
        .alert.show {
            transform: translateX(0);
        }
        
        .alert-success {
            background: #10B981;
            color: white;
        }
        
        .alert-error {
            background: #EF4444;
            color: white;
        }
        
        .alert-info {
            background: #0A84FF;
            color: white;
        }
        
        .alert-warning {
            background: #F59E0B;
            color: white;
        }
        
        .alert-icon {
            font-size: 1.2rem;
        }
        
        .alert-message {
            flex: 1;
            font-weight: 500;
        }
        
        .alert-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }
        
        .alert-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(alertStyles);
}

// Export functions for global access
window.FPActions = {
    openActionCreation,
    startAction,
    applyTemplate,
    updatePerformanceChart,
    showAlert
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('FP-CryptoTrade Actions module loaded');
});