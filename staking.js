// Staking Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize staking page
    initializeStakingPage();
});

function initializeStakingPage() {
    // Setup tab switching
    setupTabs();
    
    // Setup staking pool cards
    setupStakingPools();
    
    // Setup my staking positions
    setupMyPositions();
    
    // Setup rewards history
    setupRewardsHistory();
    
    // Setup staking calculator
    setupStakingCalculator();
    
    // Setup search functionality
    setupSearch();
    
    // Setup auto-stake button
    setupAutoStake();
    
    // Load user staking data
    loadUserStakingData();
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab button
            tabBtns.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === ${tabId}-pools || 
                    content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
}

function setupStakingPools() {
    // Add click handlers to staking pool buttons
    const stakeButtons = document.querySelectorAll('[data-action="stake"]');
    const detailButtons = document.querySelectorAll('[data-action="details"]');
    
    stakeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const pool = this.dataset.pool;
            openStakeModal(pool);
        });
    });
    
    detailButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const pool = this.dataset.pool;
            openPoolDetails(pool);
        });
    });
}

function openStakeModal(pool) {
    const poolData = getPoolData(pool);
    if (!poolData) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Stake ${poolData.name}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="stake-info">
                    <div class="pool-summary">
                        <div class="crypto-icon ${pool}">${poolData.symbol.charAt(0)}</div>
                        <div class="summary-details">
                            <h4>${poolData.name} (${poolData.symbol})</h4>
                            <div class="apy-display">
                                <span class="apy-label">APY:</span>
                                <span class="apy-value">${poolData.apy}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="user-balance">
                        <span>Available Balance:</span>
                        <span class="balance-value">${getUserBalance(pool)} ${poolData.symbol}</span>
                    </div>
                </div>
                
                <form class="stake-form">
                    <div class="form-group">
                        <label>Amount to Stake</label>
                        <div class="amount-input">
                            <input type="number" id="stakeAmount" 
                                   min="${poolData.minStake}" 
                                   max="${getUserBalance(pool)}"
                                   step="0.0001"
                                   placeholder="Enter amount">
                            <span class="currency">${poolData.symbol}</span>
                        </div>
                        <div class="amount-helper">
                            <button type="button" class="btn-percent" data-percent="25">25%</button>
                            <button type="button" class="btn-percent" data-percent="50">50%</button>
                            <button type="button" class="btn-percent" data-percent="75">75%</button>
                            <button type="button" class="btn-percent" data-percent="100">MAX</button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Lock Period</label>
                        <div class="duration-options">
                            <label class="duration-option">
                                <input type="radio" name="duration" value="7" ${poolData.lockPeriod === 7 ? 'checked' : ''}>
                                <span>7 Days</span>
                            </label>
                            <label class="duration-option">
                                <input type="radio" name="duration" value="15" ${poolData.lockPeriod === 15 ? 'checked' : ''}>
                                <span>15 Days</span>
                            </label>
                            <label class="duration-option">
                                <input type="radio" name="duration" value="30" ${poolData.lockPeriod === 30 ? 'checked' : ''}>
                                <span>30 Days</span>
                            </label>
                            <label class="duration-option">
                                <input type="radio" name="duration" value="90" ${poolData.lockPeriod === 90 ? 'checked' : ''}>
                                <span>90 Days</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="stake-preview">
                        <div class="preview-item">
                            <span>Estimated Daily Rewards:</span>
                            <span class="preview-value" id="dailyRewards">0 ${poolData.symbol}</span>
                        </div>
                        <div class="preview-item">
                            <span>Estimated Monthly Rewards:</span>
                            <span class="preview-value" id="monthlyRewards">0 ${poolData.symbol}</span>
                        </div>
                        <div class="preview-item">
                            <span>Locked Until:</span>
                            <span class="preview-value" id="lockDate">--</span>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-lock"></i> Confirm Stake
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    addModalStyles();
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup stake modal
    setupStakeModal(modal, poolData);
}

function addModalStyles() {
    if (document.querySelector('.modal-styles')) return;
    
    const style = document.createElement('style');
    style.className = 'modal-styles';
    style.textContent = `
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
            padding: 20px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .modal.show {
            opacity: 1;
        }
        
        .modal-content {
            background: white;
            border-radius: 16px;
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }
        
        .modal.show .modal-content {
            transform: translateY(0);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 1.5rem;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .modal-footer {
            padding: 1.5rem;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .stake-info {
            background: #f8fafc;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .pool-summary {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .summary-details h4 {
            margin: 0 0 0.5rem 0;
        }
        
        .apy-display {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .apy-label {
            color: #666;
        }
        
        .apy-value {
            font-weight: 600;
            color: #10b981;
        }
        
        .user-balance {
            display: flex;
            justify-content: space-between;
            padding-top: 1rem;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .balance-value {
            font-weight: 600;
        }
        
        .stake-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        
        .amount-input {
            display: flex;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .amount-input input {
            flex: 1;
            border: none;
            padding: 0.75rem;
            font-size: 1rem;
        }
        
        .amount-input .currency {
            padding: 0.75rem 1rem;
            background: #f8fafc;
            border-left: 1px solid #ddd;
            font-weight: 600;
        }
        
        .amount-helper {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        
        .btn-percent {
            padding: 0.25rem 0.75rem;
            background: #f8fafc;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
        }
        
        .btn-percent:hover {
            background: #e2e8f0;
        }
        
        .duration-options {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
        }
        
        .duration-option {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 0.75rem;
            text-align: center;
            cursor: pointer;
        }
        
        .duration-option input {
            display: none;
        }
        
        .duration-option input:checked + span {
            color: #0A84FF;
            font-weight: 600;
        }
        
        .stake-preview {
            background: #f8fafc;
            border-radius: 12px;
            padding: 1.5rem;
        }
        
        .preview-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
        }
        
        .preview-item:last-child {
            margin-bottom: 0;
        }
        
        .preview-value {
            font-weight: 600;
        }
    `;
    
    document.head.appendChild(style);
}

function getPoolData(pool) {
    const pools = {
        eth: {
            name: 'Ethereum',
            symbol: 'ETH',
            apy: 5.2,
            minStake: 0.1,
            lockPeriod: 30
        },
        ada: {
            name: 'Cardano',
            symbol: 'ADA',
            apy: 4.8,
            minStake: 10,
            lockPeriod: 15
        },
        dot: {
            name: 'Polkadot',
            symbol: 'DOT',
            apy: 12.5,
            minStake: 1,
            lockPeriod: 28
        },
        sol: {
            name: 'Solana',
            symbol: 'SOL',
            apy: 7.3,
            minStake: 0.5,
            lockPeriod: 7
        },
        bnb: {
            name: 'BNB',
            symbol: 'BNB',
            apy: 3.2,
            minStake: 0.5,
            lockPeriod: 90
        },
        avax: {
            name: 'Avalanche',
            symbol: 'AVAX',
            apy: 9.1,
            minStake: 1,
            lockPeriod: 21
        }
    };
    
    return pools[pool];
}

function getUserBalance(pool) {
    const balances = {
        eth: 5.2,
        ada: 2500,
        dot: 15,
        sol: 85,
        bnb: 3.5,
        avax: 25
    };
    
    return balances[pool] || 0;
}

function setupStakeModal(modal, poolData) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const stakeAmountInput = modal.querySelector('#stakeAmount');
    const percentButtons = modal.querySelectorAll('.btn-percent');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Percentage buttons
    percentButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const percent = parseInt(this.dataset.percent);
            const maxAmount = getUserBalance(poolData.symbol.toLowerCase());
            const amount = (maxAmount * percent) / 100;
            stakeAmountInput.value = amount.toFixed(4);
            updateRewardPreview();
        });
    });
    
    // Update reward preview on input
    stakeAmountInput.addEventListener('input', updateRewardPreview);
    
    // Update lock date based on selected duration
    const durationRadios = modal.querySelectorAll('input[name="duration"]');
    durationRadios.forEach(radio => {
        radio.addEventListener('change', updateRewardPreview);
    });
    
    function updateRewardPreview() {
        const amount = parseFloat(stakeAmountInput.value) || 0;
        const apy = poolData.apy;
        const selectedDuration = modal.querySelector('input[name="duration"]:checked').value;
        
        // Calculate daily rewards (APY / 365 days)
        const dailyRate = apy / 365 / 100;
        const dailyRewards = amount * dailyRate;
        
        // Calculate monthly rewards (30 days)
        const monthlyRewards = dailyRewards * 30;
        
        // Calculate lock end date
        const lockDate = new Date();
        lockDate.setDate(lockDate.getDate() + parseInt(selectedDuration));
        
        // Update preview
        modal.querySelector('#dailyRewards').textContent = 
            ${dailyRewards.toFixed(6)} ${poolData.symbol};
        modal.querySelector('#monthlyRewards').textContent = 
            ${monthlyRewards.toFixed(6)} ${poolData.symbol};
        modal.querySelector('#lockDate').textContent = 
            lockDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
    }
    
    // Initial preview update
    updateRewardPreview();
    
    // Confirm stake
    confirmBtn.addEventListener('click', function() {
        const amount = parseFloat(stakeAmountInput.value);
        const minStake = poolData.minStake;
        const maxStake = getUserBalance(poolData.symbol.toLowerCase());
        const selectedDuration = modal.querySelector('input[name="duration"]:checked').value;
        
        if (!amount || amount < minStake) {
            showAlert(Minimum stake amount is ${minStake} ${poolData.symbol}, 'error');
            return;
        }
        
        if (amount > maxStake) {
            showAlert(Insufficient balance. Available: ${maxStake} ${poolData.symbol}, 'error');
            return;
        }
        
        // Process stake
        processStake(poolData, amount, selectedDuration);
        closeModal();
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function processStake(poolData, amount, duration) {
    showAlert(Staking ${amount} ${poolData.symbol}..., 'info');
    
    setTimeout(() => {
        // Save to localStorage
        const stakingPositions = JSON.parse(localStorage.getItem('fp_staking_positions') || '[]');
        const lockEndDate = new Date();
        lockEndDate.setDate(lockEndDate.getDate() + parseInt(duration));
        
        const newPosition = {
            id: Date.now().toString(),
            pool: poolData.symbol.toLowerCase(),
            amount: amount,
            apy: poolData.apy,
            startDate: new Date().toISOString(),
            lockEndDate: lockEndDate.toISOString(),
            rewards: 0
        };
        
        stakingPositions.push(newPosition);
        localStorage.setItem('fp_staking_positions', JSON.stringify(stakingPositions));
        
        showAlert(Successfully staked ${amount} ${poolData.symbol}, 'success');
        
        // Update UI
        if (document.querySelector('#my-staking').classList.contains('active')) {
            loadUserStakingData();
        }
    }, 2000);
}

function openPoolDetails(pool) {
    const poolData = getPoolData(pool);
    if (!poolData) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal details-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${poolData.name} Staking Details</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="pool-overview">
                    <div class="crypto-icon ${pool} large">${poolData.symbol.charAt(0)}</div>
                    <div class="overview-details">
                        <h4>${poolData.name} (${poolData.symbol})</h4>
                        <div class="apy-badge">${poolData.apy}% APY</div>
                    </div>
                </div>
                
                <div class="pool-stats">
                    <div class="stat">
                        <span class="stat-label">Minimum Stake</span>
                        <span class="stat-value">${poolData.minStake} ${poolData.symbol}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Lock Period</span>
                        <span class="stat-value">${poolData.lockPeriod} Days</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Reward Distribution</span>
                        <span class="stat-value">Daily</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Early Unstaking</span>
                        <span class="stat-value">1% Penalty</span>
                    </div>
                </div>
                
                <div class="pool-info">
                    <h4>About ${poolData.name} Staking</h4>
                    <p>Staking ${poolData.symbol} helps secure the ${poolData.name} network while earning passive rewards. Your staked ${poolData.symbol} is locked for the selected period and contributes to network validation.</p>
                    
                    <h4>Key Features:</h4>
                    <ul>
                        <li>Daily reward distribution</li>
                        <li>Compound rewards automatically</li>
                        <li>Secure smart contract</li>
                        <li>No minimum withdrawal</li>
                    </ul>
                    
                    <h4>Risks:</h4>
                    <ul>
                        <li>Market volatility affects USD value</li>
                        <li>Early unstaking penalty applies</li>
                        <li>APY rates may change</li>
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-lock"></i> Stake ${poolData.symbol}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup details modal
    setupDetailsModal(modal, poolData);
}

function setupDetailsModal(modal, poolData) {
    const closeBtn = modal.querySelector('.modal-close');
    const confirmBtn = modal.querySelector('.modal-confirm');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    
    confirmBtn.addEventListener('click', function() {
        closeModal();
        setTimeout(() => {
            openStakeModal(poolData.symbol.toLowerCase());
        }, 300);
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function setupMyPositions() {
    // Add click handlers to position buttons
    const actionButtons = document.querySelectorAll('[data-action]');
    
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const asset = this.dataset.asset;
            
            switch(action) {
                case 'add':
                    openStakeModal(asset);
                    break;
                case 'unstake':
                    openUnstakeModal(asset);
                    break;
                case 'claim':
                    claimRewards(asset);
                    break;
            }
        });
    });
}

function openUnstakeModal(asset) {
    const position = getUserPosition(asset);
    if (!position) {
        showAlert('No staking position found for this asset', 'error');
        return;
    }
    
    // Check if position is locked
    const lockEndDate = new Date(position.lockEndDate);
    const now = new Date();
    
    if (now < lockEndDate) {
        openEarlyUnstakeModal(position);
    } else {
        openRegularUnstakeModal(position);
    }
}

function getUserPosition(asset) {
    const positions = JSON.parse(localStorage.getItem('fp_staking_positions') || '[]');
    return positions.find(pos => pos.pool === asset);
}

function openEarlyUnstakeModal(position) {
    const poolData = getPoolData(position.pool);
    if (!poolData) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal unstake-modal';
    
    const lockEndDate = new Date(position.lockEndDate);
    const daysLeft = Math.ceil((lockEndDate - new Date()) / (1000 * 60 * 60 * 24));
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Early Unstaking</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="warning-banner">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div>
                        <h4>Early Unstaking Penalty</h4>
                        <p>Your ${poolData.symbol} is locked for ${daysLeft} more days. Early unstaking incurs a 1% penalty.</p>
                    </div>
                </div>
                
                <div class="unstake-details">
                    <div class="detail">
                        <span>Staked Amount:</span>
                        <span>${position.amount} ${poolData.symbol}</span>
                    </div>
                    <div class="detail">
                        <span>Penalty (1%):</span>
                        <span class="negative">-${(position.amount * 0.01).toFixed(4)} ${poolData.symbol}</span>
                    </div>
                    <div class="detail">
                        <span>You Will Receive:</span>
                        <span class="positive">${(position.amount * 0.99).toFixed(4)} ${poolData.symbol}</span>
                    </div>
                    <div class="detail">
                        <span>Rewards Forfeited:</span>
                        <span class="negative">-${position.rewards} ${poolData.symbol}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-danger modal-confirm">
                    <i class="fas fa-unlock"></i> Confirm Early Unstake
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup early unstake modal
    setupUnstakeModal(modal, position, true);
}

function openRegularUnstakeModal(position) {
    const poolData = getPoolData(position.pool);
    if (!poolData) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal unstake-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Unstake ${poolData.symbol}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="unstake-details">
                    <div class="detail">
                        <span>Staked Amount:</span>
                        <span>${position.amount} ${poolData.symbol}</span>
                    </div>
                    <div class="detail">
                        <span>Rewards Earned:</span>
                        <span class="positive">+${position.rewards} ${poolData.symbol}</span>
                    </div>
                    <div class="detail total">
                        <span>Total to Receive:</span>
                        <span class="positive">${(position.amount + position.rewards).toFixed(4)} ${poolData.symbol}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-unlock"></i> Unstake & Claim Rewards
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup regular unstake modal
    setupUnstakeModal(modal, position, false);
}

function setupUnstakeModal(modal, position, isEarly) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    confirmBtn.addEventListener('click', function() {
        const poolData = getPoolData(position.pool);
        
        showAlert(Processing unstake..., 'info');
        
        setTimeout(() => {
            // Remove from localStorage
            const positions = JSON.parse(localStorage.getItem('fp_staking_positions') || '[]');
            const updatedPositions = positions.filter(pos => pos.id !== position.id);
            localStorage.setItem('fp_staking_positions', JSON.stringify(updatedPositions));
            
            const message = isEarly 
                ? Early unstake completed with penalty. You received ${(position.amount * 0.99).toFixed(4)} ${poolData.symbol}
                : Unstaked ${position.amount} ${poolData.symbol} and claimed ${position.rewards} ${poolData.symbol} rewards;
            
            showAlert(message, 'success');
            
            // Update UI
            loadUserStakingData();
            closeModal();
        }, 2000);
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function claimRewards(asset) {
    const position = getUserPosition(asset);
    if (!position) {
        showAlert('No staking position found', 'error');
        return;
    }
    
    if (position.rewards <= 0) {
        showAlert('No rewards available to claim', 'warning');
        return;
    }
    
    showAlert(Claiming ${position.rewards} ${asset.toUpperCase()} rewards..., 'info');
    
    setTimeout(() => {
        // Update position (reset rewards)
        const positions = JSON.parse(localStorage.getItem('fp_staking_positions') || '[]');
        const updatedPositions = positions.map(pos => {
            if (pos.id === position.id) {
                return { ...pos, rewards: 0 };
            }
            return pos;
        });
        
        localStorage.setItem('fp_staking_positions', JSON.stringify(updatedPositions));
        
        showAlert(Successfully claimed ${position.rewards} ${asset.toUpperCase()} rewards, 'success');
        loadUserStakingData();
    }, 1500);
}

function setupRewardsHistory() {
    // Setup rewards filter
    const filterSelect = document.querySelector('#rewardsFilter');
    const exportBtn = document.querySelector('#exportRewards');
    
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            filterRewardsHistory(this.value);
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportRewardsHistory);
    }
}

function filterRewardsHistory(filter) {
    const rows = document.querySelectorAll('.rewards-history tbody tr');
    
    rows.forEach(row => {
        const asset = row.querySelector('.crypto-icon').className.includes(filter);
        if (filter === 'all' || asset) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function exportRewardsHistory() {
    showAlert('Exporting rewards history...', 'info');
    
    // Simulate export
    setTimeout(() => {
        showAlert('Rewards history exported successfully', 'success');
    }, 1500);
}

function setupStakingCalculator() {
    const calcAsset = document.querySelector('#calcAsset');
    const calcAmount = document.querySelector('#calcAmount');
    const calcDuration = document.querySelector('#calcDuration');
    const durationValue = document.querySelector('#durationValue');
    const calculateBtn = document.querySelector('#calculateBtn');
    
    // Update duration label
    calcDuration.addEventListener('input', function() {
        durationValue.textContent = ${this.value} Month${this.value > 1 ? 's' : ''};
    });
    
    // Calculate button
    calculateBtn.addEventListener('click', calculateRewards);
    
    // Auto-calculate on input changes
    calcAsset.addEventListener('change', calculateRewards);
    calcAmount.addEventListener('input', calculateRewards);
    calcDuration.addEventListener('input', calculateRewards);
    
    // Initial calculation
    calculateRewards();
}

function calculateRewards() {
    const calcAsset = document.querySelector('#calcAsset');
    const calcAmount = document.querySelector('#calcAmount');
    const calcDuration = document.querySelector('#calcDuration');
    
    const asset = calcAsset.value;
    const amount = parseFloat(calcAmount.value) || 1000;
    const duration = parseInt(calcDuration.value);
    
    // Extract APY from option text
    const selectedOption = calcAsset.options[calcAsset.selectedIndex];
    const apyMatch = selectedOption.text.match(/(\d+(\.\d+)?)%/);
    const apy = apyMatch ? parseFloat(apyMatch[1]) : 5.2;
    
    // Calculate rewards
    const annualRate = apy / 100;
    const durationInYears = duration / 12;
    const totalRewards = amount * annualRate * durationInYears;
    const totalValue = amount + totalRewards;
    const monthlyRewards = totalRewards / duration;
    
    // Update display
    document.querySelector('#initialInvestment').textContent = $${amount.toFixed(2)};
    document.querySelector('#totalRewards').textContent = $${totalRewards.toFixed(2)};
    document.querySelector('#totalValue').textContent = $${totalValue.toFixed(2)};
    document.querySelector('#monthlyRewards').textContent = $${monthlyRewards.toFixed(2)};
    document.querySelector('.result-apy').textContent = ${apy}% APY;
    
    // Update chart visualization
    updateCalculatorChart(amount, totalValue);
}

function updateCalculatorChart(initial, total) {
    const chartBars = document.querySelector('.chart-bars');
    if (!chartBars) return;
    
    const maxValue = Math.max(initial, total);
    const initialHeight = (initial / maxValue) * 100;
    const totalHeight = (total / maxValue) * 100;
    
    chartBars.innerHTML = `
        <div class="chart-bar" style="height: ${initialHeight}%; background: #0A84FF;"></div>
        <div class="chart-bar" style="height: ${totalHeight}%; background: #00D4AA;"></div>
    `;
}

function setupSearch() {
    const searchInput = document.querySelector('#searchPools');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const poolCards = document.querySelectorAll('.staking-pool-card');
        
        poolCards.forEach(card => {
            const poolName = card.querySelector('.pool-name').textContent.toLowerCase();
            const poolSymbol = card.querySelector('.pool-symbol').textContent.toLowerCase();
            
            if (poolName.includes(searchTerm) || poolSymbol.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

function setupAutoStake() {
    const autoStakeBtn = document.querySelector('#autoStakeBtn');
    if (!autoStakeBtn) return;
    
    autoStakeBtn.addEventListener('click', function() {
        showAlert('Auto-Stake feature coming soon!', 'info');
    });
}

function loadUserStakingData() {
    // Load positions from localStorage
    const positions = JSON.parse(localStorage.getItem('fp_staking_positions') || '[]');
    
    // Update my positions table if on that tab
    if (document.querySelector('#my-staking').classList.contains('active')) {
        updateMyPositionsTable(positions);
        updateMyStats(positions);
    }
}

function updateMyPositionsTable(positions) {
    const tableBody = document.querySelector('.positions-table tbody');
    if (!tableBody) return;
    
    // For demo purposes, we'll show static data
    // In a real app, you would generate rows from positions data
}

function updateMyStats(positions) {
    // Calculate total value staked
    let totalValue = 0;
    let totalRewards = 0;
    
    positions.forEach(position => {
        // Simulate value calculation (in real app, use current prices)
        const prices = {
            eth: 3425,
            ada: 0.58,
            dot: 7.32,
            sol: 102.45,
            bnb: 352.89,
            avax: 36.75
        };
        
        const price = prices[position.pool] || 0;
        totalValue += position.amount * price;
        totalRewards += position.rewards * price;
    });
    
    // Update stats if elements exist
    const totalValueElement = document.querySelector('.stat-value');
    if (totalValueElement && positions.length > 0) {
        totalValueElement.textContent = $${totalValue.toFixed(2)};
    }
}

function showAlert(message, type = 'success') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = alert alert-${type};
    alert.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                              type === 'error' ? 'exclamation-circle' : 
                              type === 'warning' ? 'exclamation-triangle' : 
                              'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="alert-close">&times;</button>
    `;
    
    // Add alert styles if not already added
    if (!document.querySelector('.alert-styles')) {
        const style = document.createElement('style');
        style.className = 'alert-styles';
        style.textContent = `
            .alert {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-left: 4px solid;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
                max-width: 400px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .alert-success { border-color: #10B981; }
            .alert-error { border-color: #EF4444; }
            .alert-warning { border-color: #F59E0B; }
            .alert-info { border-color: #0A84FF; }
            
            .alert-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .alert i {
                font-size: 1.2rem;
            }
            
            .alert-success i { color: #10B981; }
            .alert-error i { color: #EF4444; }
            .alert-warning i { color: #F59E0B; }
            .alert-info i { color: #0A84FF; }
            
            .alert-close {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                font-size: 1.2rem;
                margin-left: 1rem;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                to { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(alert);
    
    // Close button
    alert.querySelector('.alert-close').addEventListener('click', () => {
        alert.remove();
    });
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 3000);
}