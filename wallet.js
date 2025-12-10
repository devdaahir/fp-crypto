// Wallet Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();
    
    // Setup wallet actions
    setupWalletActions();
    
    // Setup asset filters
    setupAssetFilters();
    
    // Setup favorite buttons
    setupFavoriteButtons();
    
    // Setup asset action buttons
    setupAssetActions();
    
    // Setup security settings
    setupSecuritySettings();
    
    // Initialize real-time updates
    startWalletUpdates();
    
    // Initialize balance toggle
    setupBalanceToggle();
});

function loadUserData() {
    const user = JSON.parse(localStorage.getItem('fp_cryptotrade_user') || 
                           sessionStorage.getItem('fp_cryptotrade_user') || '{}');
    
    // Could update user-specific wallet data here
}

function setupWalletActions() {
    // Deposit button
    document.getElementById('depositBtn').addEventListener('click', function() {
        openDepositModal();
    });
    
    // Withdraw button
    document.getElementById('withdrawBtn').addEventListener('click', function() {
        openWithdrawModal();
    });
    
    // Transfer button
    document.getElementById('transferBtn').addEventListener('click', function() {
        openTransferModal();
    });
}

function openDepositModal() {
    const modal = document.createElement('div');
    modal.className = 'modal wallet-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Deposit Funds</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="deposit-methods">
                    <div class="method-tabs">
                        <button class="method-tab active" data-method="crypto">Crypto</button>
                        <button class="method-tab" data-method="fiat">Fiat</button>
                        <button class="method-tab" data-method="card">Card</button>
                    </div>
                    
                    <div class="method-content">
                        <!-- Crypto Deposit -->
                        <div class="method-panel active" id="crypto-deposit">
                            <div class="form-group">
                                <label>Select Asset</label>
                                <select id="cryptoAsset">
                                    <option value="BTC">Bitcoin (BTC)</option>
                                    <option value="ETH">Ethereum (ETH)</option>
                                    <option value="SOL">Solana (SOL)</option>
                                    <option value="USDT">Tether (USDT)</option>
                                </select>
                            </div>
                            
                            <div class="deposit-address">
                                <label>Deposit Address</label>
                                <div class="address-box">
                                    <code id="depositAddress">1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</code>
                                    <button class="btn-copy" title="Copy address">
                                        <i class="fas fa-copy"></i>
                                    </button>
                                </div>
                                <p class="address-note">Send only the selected asset to this address</p>
                            </div>
                            
                            <div class="qr-code">
                                <div class="qr-placeholder">
                                    <i class="fas fa-qrcode"></i>
                                    <span>QR Code</span>
                                </div>
                                <p>Scan QR code for mobile deposit</p>
                            </div>
                        </div>
                        
                        <!-- Fiat Deposit -->
                        <div class="method-panel" id="fiat-deposit">
                            <div class="form-group">
                                <label>Amount (USD)</label>
                                <input type="number" id="fiatAmount" placeholder="Enter amount" min="10" step="0.01">
                            </div>
                            <div class="form-group">
                                <label>Payment Method</label>
                                <select id="paymentMethod">
                                    <option value="bank">Bank Transfer</option>
                                    <option value="wire">Wire Transfer</option>
                                    <option value="ach">ACH Transfer</option>
                                </select>
                            </div>
                            <div class="bank-details">
                                <h4>Bank Details</h4>
                                <div class="details-grid">
                                    <div class="detail-item">
                                        <span>Bank Name:</span>
                                        <span>CryptoBank International</span>
                                    </div>
                                    <div class="detail-item">
                                        <span>Account Number:</span>
                                        <span>1234567890</span>
                                    </div>
                                    <div class="detail-item">
                                        <span>Routing Number:</span>
                                        <span>987654321</span>
                                    </div>
                                    <div class="detail-item">
                                        <span>SWIFT/BIC:</span>
                                        <span>CRYPUS33</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Card Deposit -->
                        <div class="method-panel" id="card-deposit">
                            <div class="form-group">
                                <label>Card Number</label>
                                <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456">
                            </div>
                            <div class="card-details">
                                <div class="form-group">
                                    <label>Expiry Date</label>
                                    <input type="text" id="cardExpiry" placeholder="MM/YY">
                                </div>
                                <div class="form-group">
                                    <label>CVV</label>
                                    <input type="text" id="cardCvv" placeholder="123">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Amount (USD)</label>
                                <input type="number" id="cardAmount" placeholder="Enter amount" min="10" step="0.01">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="deposit-summary">
                    <div class="summary-item">
                        <span>Estimated Processing Time</span>
                        <span id="processingTime">10-30 minutes</span>
                    </div>
                    <div class="summary-item">
                        <span>Minimum Deposit</span>
                        <span id="minDeposit">$10.00</span>
                    </div>
                    <div class="summary-item">
                        <span>Fee</span>
                        <span id="depositFee">0%</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm" id="confirmDeposit">
                    <i class="fas fa-check"></i> Confirm Deposit
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
    
    // Setup modal interactions
    setupDepositModal(modal);
}

function setupDepositModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const methodTabs = modal.querySelectorAll('.method-tab');
    const methodPanels = modal.querySelectorAll('.method-panel');
    const cryptoAssetSelect = modal.querySelector('#cryptoAsset');
    const copyBtn = modal.querySelector('.btn-copy');
    const addressNote = modal.querySelector('.address-note');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Method tabs
    methodTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            
            // Update active tab
            methodTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding panel
            methodPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === method + '-deposit') {
                    panel.classList.add('active');
                }
            });
            
            // Update summary based on method
            updateDepositSummary(method);
        });
    });
    
    // Crypto asset change
    cryptoAssetSelect.addEventListener('change', function() {
        const asset = this.value;
        const address = generateDepositAddress(asset);
        modal.querySelector('#depositAddress').textContent = address;
        
        if (addressNote) {
            addressNote.textContent = `Send only ${asset} to this address`;
        }
    });
    
    // Copy address button
    copyBtn.addEventListener('click', function() {
        const address = modal.querySelector('#depositAddress').textContent;
        navigator.clipboard.writeText(address).then(() => {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });
    
    // Confirm deposit
    confirmBtn.addEventListener('click', function() {
        const activeMethod = modal.querySelector('.method-tab.active').getAttribute('data-method');
        let amount, asset;
        
        switch(activeMethod) {
            case 'crypto':
                asset = cryptoAssetSelect.value;
                amount = 'N/A';
                showAlert(`Deposit ${asset} initiated`, 'info');
                break;
            case 'fiat':
                amount = modal.querySelector('#fiatAmount').value;
                if (!amount || parseFloat(amount) < 10) {
                    showAlert('Minimum deposit is $10', 'error');
                    return;
                }
                showAlert(`Deposit of $${amount} initiated`, 'info');
                break;
            case 'card':
                amount = modal.querySelector('#cardAmount').value;
                if (!amount || parseFloat(amount) < 10) {
                    showAlert('Minimum deposit is $10', 'error');
                    return;
                }
                showAlert(`Card deposit of $${amount} initiated`, 'info');
                break;
        }
        
        closeModal();
        
        // Simulate deposit completion
        simulateDeposit(activeMethod, amount, asset);
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function generateDepositAddress(asset) {
    const prefixes = {
        'BTC': '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        'ETH': '0x742d35Cc6634C0532925a3b844Bc9e',
        'SOL': 'So11111111111111111111111111111111111111112',
        'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    };
    return prefixes[asset] || 'Address not available';
}

function updateDepositSummary(method) {
    const summary = {
        crypto: { time: '10-30 minutes', min: '$10.00', fee: '0%' },
        fiat: { time: '1-3 business days', min: '$50.00', fee: '0.5%' },
        card: { time: 'Instant', min: '$10.00', fee: '3.5%' }
    };
    
    const data = summary[method] || summary.crypto;
    
    document.querySelector('#processingTime').textContent = data.time;
    document.querySelector('#minDeposit').textContent = data.min;
    document.querySelector('#depositFee').textContent = data.fee;
}

function simulateDeposit(method, amount, asset) {
    // Simulate deposit processing
    setTimeout(() => {
        if (method === 'crypto') {
            showAlert(`${asset} deposit received!`, 'success');
            updateWalletBalance(asset, 0.1); // Add 0.1 of the asset
        } else {
            showAlert(`$${amount} deposit completed!`, 'success');
            updateWalletBalance('USD', parseFloat(amount));
        }
        
        // Add transaction to history
        addTransaction(method, amount, asset);
    }, 3000);
}

function updateWalletBalance(asset, amount) {
    // Update balance in the assets table
    const rows = document.querySelectorAll('.assets-table tbody tr');
    rows.forEach(row => {
        const symbol = row.querySelector('.asset-symbol').textContent;
        if (symbol === asset) {
            const balanceSpan = row.querySelector('.balance');
            const currentBalance = parseFloat(balanceSpan.textContent);
            const newBalance = currentBalance + amount;
            balanceSpan.textContent = newBalance.toFixed(8).replace(/\.?0+$/, '');
            
            // Update USD value
            const priceCell = row.cells[3];
            const price = parseFloat(priceCell.textContent.replace(/[^0-9.]/g, ''));
            const usdValue = newBalance * price;
            row.cells[2].textContent = `$${usdValue.toFixed(2)}`;
            row.querySelector('.balance-usd').textContent = `$${usdValue.toFixed(2)}`;
        }
    });
    
    // Update total balance
    updateTotalBalance();
}

function updateTotalBalance() {
    let total = 0;
    document.querySelectorAll('.assets-table tbody tr').forEach(row => {
        const usdValue = parseFloat(row.cells[2].textContent.replace(/[^0-9.]/g, ''));
        total += usdValue;
    });
    
    const totalBalance = document.querySelector('.balance-amount .amount');
    if (totalBalance) {
        totalBalance.textContent = `$${total.toFixed(2)}`;
    }
}

function addTransaction(method, amount, asset) {
    const transactionsList = document.querySelector('.transactions-list');
    if (!transactionsList) return;
    
    const now = new Date();
    const timeAgo = 'Just now';
    
    const transactionItem = document.createElement('div');
    transactionItem.className = 'transaction-item';
    
    let icon, type, amountText;
    
    if (method === 'crypto') {
        icon = 'deposit';
        type = `${asset} Deposit`;
        amountText = `+${amount} ${asset}`;
    } else {
        icon = 'deposit';
        type = 'Deposit';
        amountText = `+$${amount}`;
    }
    
    transactionItem.innerHTML = `
        <div class="transaction-icon ${icon}">
            <i class="fas fa-arrow-down"></i>
        </div>
        <div class="transaction-details">
            <div class="transaction-info">
                <span class="transaction-type">${type}</span>
                <span class="transaction-time">${timeAgo}</span>
            </div>
            <div class="transaction-amount">
                <span class="amount">${amountText}</span>
                <span class="asset">${method === 'crypto' ? 'Crypto' : 'USD'}</span>
            </div>
        </div>
    `;
    
    transactionsList.insertBefore(transactionItem, transactionsList.firstChild);
    
    // Keep only last 10 transactions
    while (transactionsList.children.length > 10) {
        transactionsList.removeChild(transactionsList.lastChild);
    }
}

function setupAssetFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active filter
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter assets
            const filter = this.textContent.toLowerCase();
            filterAssets(filter);
        });
    });
}

function filterAssets(filter) {
    const rows = document.querySelectorAll('.assets-table tbody tr');
    
    rows.forEach(row => {
        const symbol = row.querySelector('.asset-symbol').textContent;
        const isFavorite = row.querySelector('.btn-favorite').classList.contains('active');
        let show = true;
        
        switch(filter) {
            case 'favorites':
                show = isFavorite;
                break;
            case 'cryptocurrency':
                show = symbol !== 'USD';
                break;
            case 'stablecoins':
                show = symbol === 'USD' || symbol === 'USDT';
                break;
            // 'all' shows everything
        }
        
        row.style.display = show ? '' : 'none';
    });
}

function setupFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.btn-favorite');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('fa-star')) {
                icon.classList.remove('fa-star');
                icon.classList.add('fa-star');
                icon.classList.replace('far', 'fas');
                this.classList.add('active');
            } else {
                icon.classList.remove('fa-star');
                icon.classList.add('fa-star');
                icon.classList.replace('fas', 'far');
                this.classList.remove('active');
            }
        });
    });
}

function setupAssetActions() {
    // Deposit buttons
    document.querySelectorAll('.btn-action.deposit').forEach(btn => {
        btn.addEventListener('click', function() {
            const assetRow = this.closest('tr');
            const assetSymbol = assetRow.querySelector('.asset-symbol').textContent;
            openAssetDeposit(assetSymbol);
        });
    });
    
    // Withdraw buttons
    document.querySelectorAll('.btn-action.withdraw').forEach(btn => {
        btn.addEventListener('click', function() {
            const assetRow = this.closest('tr');
            const assetSymbol = assetRow.querySelector('.asset-symbol').textContent;
            const assetBalance = assetRow.querySelector('.balance').textContent;
            openAssetWithdraw(assetSymbol, assetBalance);
        });
    });
    
    // Trade buttons
    document.querySelectorAll('.btn-action.trade').forEach(btn => {
        btn.addEventListener('click', function() {
            const assetRow = this.closest('tr');
            const assetSymbol = assetRow.querySelector('.asset-symbol').textContent;
            // Redirect to trade page with preselected asset
            window.location.href = `trade.html?asset=${encodeURIComponent(assetSymbol)}`;
        });
    });
}

function openAssetDeposit(symbol) {
    // Open deposit modal with preselected asset
    openDepositModal();
    
    // Need to wait for modal to load, then select the asset
    setTimeout(() => {
        const cryptoSelect = document.querySelector('#cryptoAsset');
        if (cryptoSelect) {
            cryptoSelect.value = symbol;
            cryptoSelect.dispatchEvent(new Event('change'));
            
            // Switch to crypto tab if not already
            const cryptoTab = document.querySelector('.method-tab[data-method="crypto"]');
            if (cryptoTab && !cryptoTab.classList.contains('active')) {
                cryptoTab.click();
            }
        }
    }, 100);
}

function openAssetWithdraw(symbol, balance) {
    const modal = document.createElement('div');
    modal.className = 'modal wallet-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Withdraw ${symbol}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Amount</label>
                    <div class="amount-input">
                        <input type="number" id="withdrawAmount" value="${balance}" step="0.00000001" min="0.00000001" max="${balance}">
                        <span class="asset-symbol">${symbol}</span>
                    </div>
                    <div class="balance-info">
                        <span>Available: ${balance} ${symbol}</span>
                        <button class="btn-max">MAX</button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Destination Address</label>
                    <input type="text" id="withdrawAddress" placeholder="Enter ${symbol} address">
                    <div class="address-book">
                        <span>Saved addresses:</span>
                        <select id="savedAddresses">
                            <option value="">Select saved address</option>
                            <option value="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa">Main Wallet (${symbol})</option>
                            <option value="0x742d35Cc6634C0532925a3b844Bc9e">Cold Storage (${symbol})</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Network</label>
                    <select id="withdrawNetwork">
                        <option value="mainnet">${symbol} Mainnet</option>
                        <option value="erc20">ERC-20</option>
                        <option value="bep20">BEP-20</option>
                    </select>
                    <p class="network-note">Make sure to select the correct network</p>
                </div>
                
                <div class="withdraw-summary">
                    <div class="summary-item">
                        <span>Amount</span>
                        <span id="summaryAmount">${balance} ${symbol}</span>
                    </div>
                    <div class="summary-item">
                        <span>Network Fee</span>
                        <span id="networkFee">$5.00</span>
                    </div>
                    <div class="summary-item">
                        <span>You Will Receive</span>
                        <span id="receiveAmount">${parseFloat(balance) - 0.0005} ${symbol}</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm" id="confirmWithdraw">
                    <i class="fas fa-check"></i> Confirm Withdrawal
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup withdrawal modal
    setupWithdrawModal(modal, symbol, balance);
}

function setupWithdrawModal(modal, symbol, balance) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const amountInput = modal.querySelector('#withdrawAmount');
    const maxBtn = modal.querySelector('.btn-max');
    const addressInput = modal.querySelector('#withdrawAddress');
    const savedAddresses = modal.querySelector('#savedAddresses');
    const networkSelect = modal.querySelector('#withdrawNetwork');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Max button
    maxBtn.addEventListener('click', function() {
        amountInput.value = balance;
        updateWithdrawSummary();
    });
    
    // Amount input change
    amountInput.addEventListener('input', function() {
        if (parseFloat(this.value) > parseFloat(balance)) {
            this.value = balance;
        }
        updateWithdrawSummary();
    });
    
    // Saved addresses
    savedAddresses.addEventListener('change', function() {
        if (this.value) {
            addressInput.value = this.value;
        }
    });
    
    // Network change
    networkSelect.addEventListener('change', updateWithdrawSummary);
    
    // Confirm withdrawal
    confirmBtn.addEventListener('click', function() {
        const amount = amountInput.value;
        const address = addressInput.value;
        const network = networkSelect.value;
        
        if (!amount || parseFloat(amount) <= 0) {
            showAlert('Please enter a valid amount', 'error');
            return;
        }
        
        if (!address) {
            showAlert('Please enter a destination address', 'error');
            return;
        }
        
        if (!validateAddress(address, symbol, network)) {
            showAlert('Invalid address for selected network', 'error');
            return;
        }
        
        if (confirm(`Withdraw ${amount} ${symbol} to ${address.substring(0, 16)}...?`)) {
            showAlert('Withdrawal initiated', 'info');
            closeModal();
            simulateWithdrawal(symbol, amount, address);
        }
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Initial summary update
    updateWithdrawSummary();
}

function validateAddress(address, symbol, network) {
    // Basic validation - in production this would be more robust
    if (symbol === 'BTC') {
        return address.startsWith('1') || address.startsWith('3') || address.startsWith('bc1');
    } else if (symbol === 'ETH') {
        return address.startsWith('0x') && address.length === 42;
    }
    return true; // For demo purposes
}

function updateWithdrawSummary() {
    const modal = document.querySelector('.wallet-modal');
    if (!modal) return;
    
    const amount = parseFloat(modal.querySelector('#withdrawAmount').value) || 0;
    const symbol = modal.querySelector('h3').textContent.split(' ')[1];
    const network = modal.querySelector('#withdrawNetwork').value;
    
    // Calculate fees (simplified)
    let fee = 5.00; // USD equivalent
    if (network === 'erc20') fee = 10.00;
    if (network === 'bep20') fee = 1.00;
    
    // For crypto withdrawals, convert fee to crypto
    const price = getAssetPrice(symbol);
    const feeInCrypto = fee / price;
    
    modal.querySelector('#summaryAmount').textContent = `${amount} ${symbol}`;
    modal.querySelector('#networkFee').textContent = `${feeInCrypto.toFixed(8)} ${symbol} (~$${fee.toFixed(2)})`;

    const receiveAmount = amount - feeInCrypto;
    modal.querySelector('#receiveAmount').textContent = `${receiveAmount.toFixed(8)} ${symbol}`;
}

function getAssetPrice(symbol) {
    const prices = {
        'BTC': 42567.89,
        'ETH': 2345.67,
        'SOL': 98.76,
        'USD': 1.00
    };
    return prices[symbol] || 100;
}

function simulateWithdrawal(symbol, amount, address) {
    setTimeout(() => {
        showAlert(`${amount} ${symbol} withdrawn to ${address.substring(0, 16)}...`, 'success');
        
        // Update balance
        updateWalletBalance(symbol, -parseFloat(amount));
        
        // Add transaction
        const transactionsList = document.querySelector('.transactions-list');
        const transactionItem = document.createElement('div');
        transactionItem.className = 'transaction-item';
        transactionItem.innerHTML = `
            <div class="transaction-icon withdraw">
                <i class="fas fa-arrow-up"></i>
            </div>
            <div class="transaction-details">
                <div class="transaction-info">
                    <span class="transaction-type">${symbol} Withdrawal</span>
                    <span class="transaction-time">Just now</span>
                </div>
                <div class="transaction-amount">
                    <span class="amount">-${amount} ${symbol}</span>
                    <span class="asset">To: ${address.substring(0, 8)}...</span>
                </div>
            </div>
        `;
        transactionsList.insertBefore(transactionItem, transactionsList.firstChild);
    }, 2000);
}

function openTransferModal() {
    const modal = document.createElement('div');
    modal.className = 'modal wallet-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Transfer Funds</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>From Account</label>
                    <select id="fromAccount">
                        <option value="spot">Spot Wallet</option>
                        <option value="earn">Earn Wallet</option>
                        <option value="futures">Futures Wallet</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>To Account</label>
                    <select id="toAccount">
                        <option value="earn">Earn Wallet</option>
                        <option value="spot">Spot Wallet</option>
                        <option value="futures">Futures Wallet</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Asset</label>
                    <select id="transferAsset">
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ETH)</option>
                        <option value="USD">US Dollar (USD)</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Amount</label>
                    <input type="number" id="transferAmount" placeholder="Enter amount">
                    <div class="balance-info">
                        <span>Available: <span id="availableBalance">0.125 BTC</span></span>
                        <button class="btn-max">MAX</button>
                    </div>
                </div>
                
                <div class="transfer-summary">
                    <div class="summary-item">
                        <span>Transfer</span>
                        <span id="transferSummary">0 BTC</span>
                    </div>
                    <div class="summary-item">
                        <span>Fee</span>
                        <span>0%</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-exchange-alt"></i> Confirm Transfer
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup transfer modal
    setupTransferModal(modal);
}

function setupTransferModal(modal) {
    // Similar setup to other modals
    // Implementation would follow same pattern
}

function setupSecuritySettings() {
    // Enable 2FA button
    document.querySelector('.btn-enable')?.addEventListener('click', function() {
        open2FASetup();
    });
    
    // Configure withdrawal delay button
    document.querySelector('.btn-configure')?.addEventListener('click', function() {
        configureWithdrawalDelay();
    });
}

function open2FASetup() {
    const modal = document.createElement('div');
    modal.className = 'modal security-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Enable 2FA</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="2fa-steps">
                    <div class="step">
                        <h4>1. Download Authenticator App</h4>
                        <p>Google Authenticator or Authy</p>
                    </div>
                    <div class="step">
                        <h4>2. Scan QR Code</h4>
                        <div class="qr-code">
                            <div class="qr-placeholder">
                                <i class="fas fa-qrcode"></i>
                            </div>
                        </div>
                        <p class="secret-key">
                            Secret: <code>JBSWY3DPEHPK3PXP</code>
                            <button class="btn-copy">
                                <i class="fas fa-copy"></i>
                            </button>
                        </p>
                    </div>
                    <div class="step">
                        <h4>3. Enter 6-digit Code</h4>
                        <div class="2fa-input">
                            <input type="text" id="2faCode" placeholder="000000" maxlength="6">
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-check"></i> Verify & Enable
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function configureWithdrawalDelay() {
    const modal = document.createElement('div');
    modal.className = 'modal security-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Withdrawal Security Delay</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Delay Period</label>
                    <select id="withdrawalDelay">
                        <option value="0">No delay</option>
                        <option value="1" selected>1 hour</option>
                        <option value="6">6 hours</option>
                        <option value="24">24 hours</option>
                        <option value="48">48 hours</option>
                    </select>
                </div>
                <p class="security-note">
                    Withdrawal delay adds an extra security layer. 
                    You can cancel withdrawals during the delay period.
                </p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-save"></i> Save Settings
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function setupBalanceToggle() {
    const eyeBtn = document.querySelector('.btn-eye');
    const amountDisplay = document.querySelector('.balance-amount .amount');
    const breakdownItems = document.querySelectorAll('.breakdown-item span:last-child');
    const assetBalances = document.querySelectorAll('.balance');
    const assetUsdValues = document.querySelectorAll('.balance-usd');
    
    let isVisible = true;
    
    eyeBtn.addEventListener('click', function() {
        isVisible = !isVisible;
        const icon = this.querySelector('i');
        
        if (isVisible) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
            amountDisplay.textContent = '$12,450.75';
            
            // Show all balances
            breakdownItems.forEach(item => {
                item.style.filter = 'none';
            });
            
            assetBalances.forEach(balance => {
                balance.style.filter = 'none';
            });
            
            assetUsdValues.forEach(value => {
                value.style.filter = 'none';
            });
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
            amountDisplay.textContent = '$';
            
            // Hide all balances
            breakdownItems.forEach(item => {
                item.style.filter = 'blur(5px)';
            });
            
            assetBalances.forEach(balance => {
                balance.style.filter = 'blur(5px)';
            });
            
            assetUsdValues.forEach(value => {
                value.style.filter = 'blur(5px)';
            });
        }
    });
}

function startWalletUpdates() {
    // Update asset prices periodically
    setInterval(updateAssetPrices, 5000);
    
    // Update 24h changes
    setInterval(update24hChanges, 10000);
}

function updateAssetPrices() {
    document.querySelectorAll('.assets-table tbody tr').forEach(row => {
        const symbol = row.querySelector('.asset-symbol').textContent;
        const priceCell = row.cells[3];
        const balance = parseFloat(row.querySelector('.balance').textContent);
        
        let currentPrice = parseFloat(priceCell.textContent.replace(/[^0-9.]/g, ''));
        const change = (Math.random() - 0.5) * 0.01; // Random +/- 0.5%
        const newPrice = currentPrice * (1 + change);
        
        priceCell.textContent = `$${newPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

        // Update USD value
        const usdValue = balance * newPrice;
        row.cells[2].textContent = `$${usdValue.toFixed(2)}`;
        row.querySelector('.balance-usd').textContent = `$${usdValue.toFixed(2)}`;
    });
    
    // Update total balance
    updateTotalBalance();
}

function update24hChanges() {
    document.querySelectorAll('.assets-table tbody tr').forEach(row => {
        const changeCell = row.cells[4];
        const changeSpan = changeCell.querySelector('.change');
        
        if (changeSpan) {
            let currentChange = parseFloat(changeSpan.textContent.replace(/[^0-9.-]/g, ''));
            const newChange = currentChange + (Math.random() - 0.5) * 0.5;
            
            changeSpan.textContent = `${newChange >= 0 ? '+' : ''}${newChange.toFixed(1)}%`;
            changeSpan.className = `change ${newChange >= 0 ? 'positive' : 'negative'}`;
        }
    });
}

function addModalStyles() {
    if (!document.querySelector('#wallet-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'wallet-modal-styles';
        styles.textContent = `
            .wallet-modal .modal-content {
                max-width: 500px;
            }
            
            .method-tabs {
                display: flex;
                gap: 4px;
                margin-bottom: 24px;
                background: var(--light);
                border-radius: 6px;
                padding: 4px;
            }
            
            .method-tab {
                flex: 1;
                padding: 10px;
                background: none;
                border: none;
                border-radius: 4px;
                color: var(--gray);
                cursor: pointer;
                font-family: var(--font-primary);
                font-weight: 500;
            }
            
            .method-tab.active {
                background: white;
                color: var(--primary);
                box-shadow: var(--shadow-sm);
            }
            
            .method-panel {
                display: none;
            }
            
            .method-panel.active {
                display: block;
            }
            
            .deposit-address {
                margin: 20px 0;
            }
            
            .address-box {
                display: flex;
                align-items: center;
                gap: 12px;
                background: var(--light);
                padding: 12px;
                border-radius: 6px;
                margin: 8px 0;
                font-family: var(--font-mono);
                font-size: 0.9rem;
            }
            
            .btn-copy {
                background: none;
                border: none;
                color: var(--primary);
                cursor: pointer;
                padding: 4px;
            }
            
            .address-note {
                color: var(--gray);
                font-size: 0.85rem;
                margin-top: 4px;
            }
            
            .qr-placeholder {
                width: 150px;
                height: 150px;
                background: var(--light);
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: var(--gray);
                margin: 20px auto;
            }
            
            .qr-placeholder i {
                font-size: 3rem;
                margin-bottom: 12px;
            }
            
            .bank-details {
                background: var(--light);
                padding: 16px;
                border-radius: 8px;
                margin-top: 20px;
            }
            
            .details-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                margin-top: 12px;
            }
            
            .card-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            
            .deposit-summary,
            .withdraw-summary,
            .transfer-summary {
                background: var(--light);
                padding: 16px;
                border-radius: 8px;
                margin-top: 24px;
            }
            
            .summary-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                color: var(--gray);
            }
            
            .summary-item:last-child {
                margin-bottom: 0;
            }
            
            .summary-item span:last-child {
                color: var(--dark);
                font-weight: 500;
            }
            
            .amount-input {
                position: relative;
            }
            
            .amount-input input {
                padding-right: 60px;
            }
            
            .amount-input .asset-symbol {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                color: var(--gray);
                font-weight: 500;
            }
            
            .balance-info {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
                font-size: 0.9rem;
                color: var(--gray);
            }
            
            .address-book {
                margin-top: 12px;
            }
            
            .network-note {
                color: var(--gray);
                font-size: 0.85rem;
                margin-top: 4px;
            }
        `;
        document.head.appendChild(styles);
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