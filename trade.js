// Trade Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize trading chart
    initTradingChart();
    
    // Setup market selector
    setupMarketSelector();
    
    // Setup trade tabs
    setupTradeTabs();
    
    // Setup order form
    setupOrderForm();
    
    // Setup open orders
    setupOpenOrders();
    
    // Setup recent trades
    setupRecentTrades();
    
    // Initialize real-time updates
    startTradeUpdates();
});

function initTradingChart() {
    const ctx = document.getElementById('tradingChart');
    if (!ctx) return;
    
    // Generate mock candlestick data
    const data = generateCandleData(100);
    
    window.tradingChart = new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: 'BTC/USD',
                data: data,
                borderColor: 'rgba(10, 132, 255, 0.8)',
                borderWidth: 1,
                color: {
                    up: '#10B981',
                    down: '#EF4444',
                    unchanged: '#6B7280'
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            return [
                                `Open: $${point.o}`,
                                `High: $${point.h}`,
                                `Low: $${point.l}`,
                                `Close: $${point.c}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94A3B8'
                    }
                },
                y: {
                    position: 'right',
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94A3B8',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

function generateCandleData(count) {
    const data = [];
    let price = 42000;
    
    for (let i = 0; i < count; i++) {
        const open = price;
        const high = open + Math.random() * 200;
        const low = open - Math.random() * 150;
        const close = low + Math.random() * (high - low);
        
        data.push({
            x: new Date(Date.now() - (count - i) * 60000),
            o: open,
            h: high,
            l: low,
            c: close
        });
        
        price = close;
    }
    
    return data;
}

function setupMarketSelector() {
    const marketItems = document.querySelectorAll('.market-item');
    marketItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            marketItems.forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update chart with selected market
            const symbol = this.querySelector('.market-symbol').textContent;
            updateChartForMarket(symbol);
        });
    });
    
    // Market search
    const searchInput = document.querySelector('.market-search input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const markets = document.querySelectorAll('.market-item');
        
        markets.forEach(market => {
            const symbol = market.querySelector('.market-symbol').textContent.toLowerCase();
            const name = market.querySelector('.market-name').textContent.toLowerCase();
            const display = symbol.includes(searchTerm) || name.includes(searchTerm) ? '' : 'none';
            market.style.display = display;
        });
    });
}

function updateChartForMarket(symbol) {
    // Update chart title
    const chartTitle = document.querySelector('.chart-info h2');
    if (chartTitle) {
        chartTitle.textContent = symbol;
    }
    
    // Update price display (simulated)
    const currentPrice = document.querySelector('.current-price');
    const priceChange = document.querySelector('.price-change');
    
    if (currentPrice && priceChange) {
        const price = getMockPrice(symbol);
        const change = (Math.random() - 0.5) * 0.1; // Random change up to 5%
        const changeAmount = price * change;
        
        currentPrice.textContent = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        priceChange.textContent = `${change >= 0 ? '+' : ''}$${changeAmount.toFixed(2)} (${(change * 100).toFixed(2)}%)`;
        priceChange.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
    }
}

function getMockPrice(symbol) {
    const prices = {
        'BTC/USD': 42567.89,
        'ETH/USD': 2345.67,
        'SOL/USD': 98.76,
        'ADA/USD': 0.45
    };
    return prices[symbol] || 100;
}

function setupTradeTabs() {
    const tabs = document.querySelectorAll('.trade-tab');
    const orderTypes = document.querySelectorAll('.order-type');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding order type
            orderTypes.forEach(type => {
                type.classList.remove('active');
                if (type.id === `${tabId}-order`) {
                    type.classList.add('active');
                }
            });
        });
    });
}

function setupOrderForm() {
    // Market amount slider
    const amountSlider = document.querySelector('.amount-slider input');
    const amountInput = document.getElementById('marketAmount');
    
    if (amountSlider && amountInput) {
        amountSlider.addEventListener('input', function() {
            const maxAmount = 1; // Maximum BTC amount
            const amount = (this.value / 100) * maxAmount;
            amountInput.value = amount.toFixed(4);
            updateOrderSummary();
        });
        
        amountInput.addEventListener('input', function() {
            const value = parseFloat(this.value) || 0;
            const percentage = (value / 1) * 100; // Assuming 1 BTC max
            amountSlider.value = Math.min(percentage, 100);
            updateOrderSummary();
        });
    }
    
    // Max button
    const maxBtn = document.querySelector('.btn-max');
    if (maxBtn && amountSlider && amountInput) {
        maxBtn.addEventListener('click', function() {
            amountSlider.value = 100;
            amountInput.value = '1';
            updateOrderSummary();
        });
    }
    
    // Update order summary on any input change
    document.querySelectorAll('#marketAmount, #limitPrice, #limitAmount, #stopPrice, #stopAmount')
        .forEach(input => {
            input.addEventListener('input', updateOrderSummary);
        });
}

function updateOrderSummary() {
    const activeTab = document.querySelector('.trade-tab.active').getAttribute('data-tab');
    const price = parseFloat(document.querySelector('.current-price').textContent.replace(/[^0-9.]/g, ''));
    
    if (activeTab === 'market') {
        const amount = parseFloat(document.getElementById('marketAmount').value) || 0;
        const total = amount * price;
        const fee = total * 0.001; // 0.1% fee
        
        document.querySelectorAll('.summary-row')[0].children[1].textContent = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        document.querySelectorAll('.summary-row')[1].children[1].textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        document.querySelectorAll('.summary-row')[2].children[1].textContent = `$${fee.toFixed(2)}`;
    }
}

function setupOpenOrders() {
    const cancelButtons = document.querySelectorAll('.btn-cancel');
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const orderItem = this.closest('.order-item');
            const orderType = orderItem.querySelector('.order-type').textContent;
            const orderSymbol = orderItem.querySelector('.order-symbol').textContent;
            
            if (confirm(`Cancel ${orderType} order for ${orderSymbol}?`)) {
                orderItem.style.opacity = '0.5';
                setTimeout(() => {
                    orderItem.remove();
                    updateOpenOrdersCount();
                }, 300);
            }
        });
    });
}

function updateOpenOrdersCount() {
    const count = document.querySelectorAll('.order-item').length;
    // Could update a counter display if needed
}

function setupRecentTrades() {
    // Simulate adding new trades
    setInterval(addMockTrade, 3000);
}

function addMockTrade() {
    const tradesList = document.querySelector('.trades-list');
    if (!tradesList) return;
    
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const price = parseFloat(document.querySelector('.current-price').textContent.replace(/[^0-9.]/g, ''));
    const change = (Math.random() - 0.5) * 50;
    const tradePrice = price + change;
    const size = (Math.random() * 0.5).toFixed(2);
    const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
    
    const tradeItem = document.createElement('div');
    tradeItem.className = 'trade-item';
    tradeItem.innerHTML = `
        <span class="trade-time">${time}</span>
        <span class="trade-price">$${tradePrice.toFixed(2)}</span>
        <span class="trade-size">${size}</span>
        <span class="trade-side ${side.toLowerCase()}">${side}</span>
    `;
    
    tradesList.insertBefore(tradeItem, tradesList.firstChild);
    
    // Keep only last 20 trades
    while (tradesList.children.length > 20) {
        tradesList.removeChild(tradesList.lastChild);
    }
}

function startTradeUpdates() {
    // Update order book
    setInterval(updateOrderBook, 2000);
    
    // Update position
    setInterval(updatePosition, 5000);
    
    // Update market prices
    setInterval(updateMarketPrices, 1000);
}

function updateOrderBook() {
    const sellOrders = document.querySelectorAll('.order-row.sell');
    const buyOrders = document.querySelectorAll('.order-row.buy');
    
    // Update sell orders
    sellOrders.forEach(order => {
        const priceElement = order.querySelector('.price');
        const sizeElement = order.querySelector('.size');
        
        let price = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ''));
        let size = parseFloat(sizeElement.textContent);
        
        // Random small changes
        price += (Math.random() - 0.5) * 10;
        size = Math.max(0.01, size + (Math.random() - 0.5) * 0.05);
        
        priceElement.textContent = `$${price.toFixed(2)}`;
        sizeElement.textContent = size.toFixed(2);
        order.querySelector('.total').textContent = `$${(price * size).toFixed(2)}`;
    });
    
    // Update buy orders
    buyOrders.forEach(order => {
        const priceElement = order.querySelector('.price');
        const sizeElement = order.querySelector('.size');
        
        let price = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ''));
        let size = parseFloat(sizeElement.textContent);
        
        // Random small changes
        price += (Math.random() - 0.5) * 10;
        size = Math.max(0.01, size + (Math.random() - 0.5) * 0.05);
        
        priceElement.textContent = `$${price.toFixed(2)}`;
        sizeElement.textContent = size.toFixed(2);
        order.querySelector('.total').textContent = `$${(price * size).toFixed(2)}`;
    });
    
    // Update market price and spread
    const currentPrice = document.querySelector('.current-price');
    const spread = document.querySelector('.spread');
    
    if (currentPrice) {
        const price = parseFloat(currentPrice.textContent.replace(/[^0-9.]/g, ''));
        const newPrice = price + (Math.random() - 0.5) * 20;
        currentPrice.textContent = `$${newPrice.toFixed(2)}`;

        if (spread) {
            const newSpread = Math.random() * 30;
            spread.textContent = `Spread: $${newSpread.toFixed(2)}`;
        }
    }
}

function updatePosition() {
    const positionItems = document.querySelectorAll('.position-item');
    
    if (positionItems.length >= 4) {
        const unrealizedPL = positionItems[3].querySelector('span:last-child');
        if (unrealizedPL) {
            const currentValue = Math.random() * 1000 - 500;
            const isPositive = currentValue >= 0;
            unrealizedPL.textContent = `${isPositive ? '+' : ''}$${Math.abs(currentValue).toFixed(2)}`;
            unrealizedPL.className = `profit ${isPositive ? 'positive' : 'negative'}`;
        }
    }
}

function updateMarketPrices() {
    const marketItems = document.querySelectorAll('.market-item');
    
    marketItems.forEach(item => {
        const priceElement = item.querySelector('.price');
        const changeElement = item.querySelector('.change');
        
        if (priceElement && changeElement) {
            let price = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ''));
            let changePercent = parseFloat(changeElement.textContent);
            
            // Random price movement
            const movement = (Math.random() - 0.5) * 0.02; // +/- 1%
            price *= (1 + movement);
            changePercent += movement * 100;
            
            priceElement.textContent = `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
            changeElement.textContent = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(1)}%`;
            changeElement.className = `change ${changePercent >= 0 ? 'positive' : 'negative'}`;
        }
    });
}

// Trade execution
document.querySelectorAll('.btn-buy, .btn-sell').forEach(button => {
    button.addEventListener('click', function() {
        const isBuy = this.classList.contains('btn-buy');
        const activeTab = document.querySelector('.trade-tab.active').getAttribute('data-tab');
        
        let amount, price;
        
        switch(activeTab) {
            case 'market':
                amount = parseFloat(document.getElementById('marketAmount').value);
                price = parseFloat(document.querySelector('.current-price').textContent.replace(/[^0-9.]/g, ''));
                break;
            case 'limit':
                amount = parseFloat(document.getElementById('limitAmount').value);
                price = parseFloat(document.getElementById('limitPrice').value);
                break;
            case 'stop':
                amount = parseFloat(document.getElementById('stopAmount').value);
                price = parseFloat(document.getElementById('stopPrice').value);
                break;
        }
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        if (activeTab !== 'market' && (!price || price <= 0)) {
            alert('Please enter a valid price');
            return;
        }
        
        const total = amount * (price || parseFloat(document.querySelector('.current-price').textContent.replace(/[^0-9.]/g, '')));
        const side = isBuy ? 'BUY' : 'SELL';
        const orderType = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
        
        // Create new order
        createOrder(side, orderType, amount, price, total);
        
        // Show confirmation
        showTradeAlert(`${side} order placed for ${amount} BTC at $${price ? price.toFixed(2) : 'market'}`, 'success');
    });
});

function createOrder(side, type, amount, price, total) {
    const ordersList = document.querySelector('.orders-list');
    if (!ordersList) return;
    
    const orderId = 'order_' + Date.now();
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.id = orderId;
    orderItem.innerHTML = `
        <div class="order-info">
            <span class="order-type ${side.toLowerCase()}">${side}</span>
            <span class="order-symbol">BTC/USD</span>
            <span class="order-price">${price ? '$' + price.toFixed(2) : 'Market'}</span>
        </div>
        <div class="order-details">
            <span>${amount} BTC</span>
            <span class="order-status pending">Pending</span>
            <button class="btn-cancel">Cancel</button>
        </div>
    `;
    
    ordersList.appendChild(orderItem);
    
    // Add cancel functionality
    const cancelBtn = orderItem.querySelector('.btn-cancel');
    cancelBtn.addEventListener('click', function() {
        if (confirm(`Cancel ${side} order?`)) {
            orderItem.style.opacity = '0.5';
            setTimeout(() => {
                orderItem.remove();
                showTradeAlert('Order cancelled', 'info');
            }, 300);
        }
    });
    
    // Simulate order execution
    setTimeout(() => {
        if (Math.random() > 0.3) { // 70% chance of execution
            const status = orderItem.querySelector('.order-status');
            status.textContent = 'Filled';
            status.className = 'order-status filled';
            showTradeAlert(`${side} order filled for ${amount} BTC`, 'success');
            
            // Update position
            updatePositionAfterTrade(side, amount, price);
            
            // Remove after 5 seconds
            setTimeout(() => {
                orderItem.style.opacity = '0.5';
                setTimeout(() => orderItem.remove(), 300);
            }, 5000);
        }
    }, 2000 + Math.random() * 5000);
}

function updatePositionAfterTrade(side, amount, price) {
    // Update position summary
    const positionSize = document.querySelector('.position-item:nth-child(1) span:last-child');
    const avgEntry = document.querySelector('.position-item:nth-child(2) span:last-child');
    const currentValue = document.querySelector('.position-item:nth-child(3) span:last-child');
    
    if (positionSize && avgEntry && currentValue) {
        let currentSize = parseFloat(positionSize.textContent) || 0;
        let currentAvg = parseFloat(avgEntry.textContent.replace(/[^0-9.]/g, '')) || 0;
        
        if (side === 'BUY') {
            const newSize = currentSize + amount;
            const newAvg = ((currentSize * currentAvg) + (amount * price)) / newSize;
            
            positionSize.textContent = newSize.toFixed(3) + ' BTC';
            avgEntry.textContent = `$${newAvg.toFixed(2)}`;
        } else {
            const newSize = currentSize - amount;
            positionSize.textContent = Math.max(0, newSize).toFixed(3) + ' BTC';
        }
    }
}

function showTradeAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `trade-alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
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
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Add animation keyframes
if (!document.querySelector('#trade-animations')) {
    const style = document.createElement('style');
    style.id = 'trade-animations';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Chart type switching
document.querySelectorAll('.chart-type').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.chart-type').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const chartType = this.querySelector('i').className;
        let newType = 'candlestick';
        
        if (chartType.includes('chart-bar')) newType = 'bar';
        else if (chartType.includes('chart-area')) newType = 'line';
        
        if (window.tradingChart) {
            window.tradingChart.config.type = newType;
            window.tradingChart.update();
        }
    });
});

// Timeframe switching
document.querySelector('.timeframe-select').addEventListener('change', function() {
    const timeframe = this.value;
    // In a real app, this would fetch new data for the selected timeframe
    console.log('Timeframe changed to:', timeframe);
});

// Close position button
document.querySelector('.btn-close')?.addEventListener('click', function() {
    const positionSize = document.querySelector('.position-item:nth-child(1) span:last-child').textContent;
    if (confirm(`Close position of ${positionSize}?`)) {
        showTradeAlert('Position closed', 'success');

        // Reset position
        document.querySelectorAll('.position-item').forEach((item, index) => {
            const valueSpan = item.querySelector('span:last-child');
            if (!valueSpan) return;
            if (index === 0) valueSpan.textContent = '0.000 BTC';
            else if (index === 1) valueSpan.textContent = '$0.00';
            else if (index === 2) valueSpan.textContent = '$0.00';
            else if (index === 3) {
                valueSpan.textContent = '$0.00';
                valueSpan.className = 'profit';
            }
        });
    }
});