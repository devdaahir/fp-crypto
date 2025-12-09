// ===== MARKET DATA =====
const cryptoData = [
    {
        id: 1,
        name: "Bitcoin",
        symbol: "BTC",
        icon: "btc",
        price: 42815.32,
        change24h: 2.34,
        marketCap: 837.2,
        volume24h: 32.1,
        chartData: [42500, 42650, 42480, 42620, 42750, 42815, 42900],
        category: "layer1"
    },
    {
        id: 2,
        name: "Ethereum",
        symbol: "ETH",
        icon: "eth",
        price: 2850.67,
        change24h: 1.78,
        marketCap: 342.5,
        volume24h: 18.7,
        chartData: [2820, 2835, 2810, 2830, 2845, 2850, 2860],
        category: "layer1"
    },
    {
        id: 3,
        name: "Binance Coin",
        symbol: "BNB",
        icon: "bnb",
        price: 352.89,
        change24h: -0.45,
        marketCap: 54.3,
        volume24h: 2.1,
        chartData: [354, 353, 352, 351, 352.5, 353, 352.89],
        category: "exchange"
    },
    {
        id: 4,
        name: "Solana",
        symbol: "SOL",
        icon: "sol",
        price: 102.45,
        change24h: 5.67,
        marketCap: 43.2,
        volume24h: 5.8,
        chartData: [97, 98.5, 99, 100.5, 101, 102, 102.45],
        category: "layer1"
    },
    {
        id: 5,
        name: "Cardano",
        symbol: "ADA",
        icon: "ada",
        price: 0.58,
        change24h: 0.89,
        marketCap: 20.5,
        volume24h: 1.2,
        chartData: [0.57, 0.575, 0.572, 0.578, 0.579, 0.58, 0.582],
        category: "layer1"
    },
    {
        id: 6,
        name: "Polkadot",
        symbol: "DOT",
        icon: "dot",
        price: 7.32,
        change24h: -1.23,
        marketCap: 9.8,
        volume24h: 0.8,
        chartData: [7.4, 7.35, 7.3, 7.28, 7.31, 7.32, 7.33],
        category: "layer0"
    },
    {
        id: 7,
        name: "Dogecoin",
        symbol: "DOGE",
        icon: "doge",
        price: 0.082,
        change24h: 3.21,
        marketCap: 11.7,
        volume24h: 1.5,
        chartData: [0.079, 0.08, 0.081, 0.0815, 0.082, 0.0825, 0.083],
        category: "meme"
    },
    {
        id: 8,
        name: "XRP",
        symbol: "XRP",
        icon: "xrp",
        price: 0.62,
        change24h: 1.45,
        marketCap: 33.4,
        volume24h: 2.3,
        chartData: [0.61, 0.615, 0.617, 0.619, 0.62, 0.621, 0.622],
        category: "payments"
    },
    {
        id: 9,
        name: "Avalanche",
        symbol: "AVAX",
        icon: "avax",
        price: 36.75,
        change24h: 2.89,
        marketCap: 13.2,
        volume24h: 1.8,
        chartData: [35.5, 35.8, 36, 36.3, 36.5, 36.7, 36.75],
        category: "layer1"
    },
    {
        id: 10,
        name: "Polygon",
        symbol: "MATIC",
        icon: "matic",
        price: 0.85,
        change24h: 1.12,
        marketCap: 8.3,
        volume24h: 0.9,
        chartData: [0.84, 0.842, 0.845, 0.847, 0.849, 0.851, 0.85],
        category: "layer2"
    },
    {
        id: 11,
        name: "Chainlink",
        symbol: "LINK",
        icon: "link",
        price: 14.32,
        change24h: 0.67,
        marketCap: 8.1,
        volume24h: 0.7,
        chartData: [14.2, 14.25, 14.28, 14.3, 14.31, 14.32, 14.33],
        category: "oracles"
    },
    {
        id: 12,
        name: "Litecoin",
        symbol: "LTC",
        icon: "ltc",
        price: 72.45,
        change24h: -0.34,
        marketCap: 5.4,
        volume24h: 0.6,
        chartData: [72.6, 72.5, 72.4, 72.45, 72.4, 72.42, 72.45],
        category: "payments"
    }
];

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    initializeMarketPage();
});

// ===== MARKET PAGE INITIALIZATION =====
function initializeMarketPage() {
    // Load market data
    loadMarketData();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize filter controls
    initializeFilters();
    
    // Initialize view toggle
    initializeViewToggle();
    
    // Initialize sorting
    initializeSorting();
    
    // Initialize trending tabs
    initializeTrendingTabs();
    
    // Initialize mini charts
    initializeMiniCharts();
    
    // Initialize action buttons
    initializeActionButtons();
    
    // Simulate real-time updates
    simulateRealtimeUpdates();
}

// ===== LOAD MARKET DATA =====
function loadMarketData() {
    // Render table view
    renderTableView();
    
    // Render cards view
    renderCardsView();
    
    // Render trending data
    renderTrendingData();
    
    // Update market stats
    updateMarketStats();
}

function renderTableView() {
    const tableBody = document.getElementById('marketTableBody');
    if (!tableBody) return;
    
    let tableHTML = '';
    
    cryptoData.forEach(crypto => {
        const changeClass = crypto.change24h >= 0 ? 'positive' : 'negative';
        const changeSign = crypto.change24h >= 0 ? '+' : '';
        
        tableHTML += `
            <tr class="crypto-row" data-id="${crypto.id}">
                <td>
                    <div class="crypto-cell">
                        <div class="crypto-icon ${crypto.icon}">${crypto.symbol.charAt(0)}</div>
                        <div class="crypto-info">
                            <span class="crypto-name">${crypto.name}</span>
                            <span class="crypto-symbol">${crypto.symbol}</span>
                        </div>
                    </div>
                </td>
                <td class="price-cell">$${formatNumber(crypto.price)}</td>
                <td class="change-cell ${changeClass}">
                    ${changeSign}${crypto.change24h}%
                </td>
                <td class="market-cap-cell">$${formatNumber(crypto.marketCap)}B</td>
                <td class="volume-cell">$${formatNumber(crypto.volume24h)}B</td>
                <td class="chart-cell">
                    <div class="mini-chart" id="chart-${crypto.symbol}"></div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn trade-btn" data-symbol="${crypto.symbol}">
                            <i class="fas fa-exchange-alt"></i> Trade
                        </button>
                        <button class="action-btn watchlist-btn" data-id="${crypto.id}">
                            <i class="far fa-star"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
    
    // Render mini charts for table
    cryptoData.forEach(crypto => {
        renderMiniChart(chart-${crypto.symbol}, crypto.chartData);
    });
}

function renderCardsView() {
    const cardsGrid = document.getElementById('marketCardsGrid');
    if (!cardsGrid) return;
    
    let cardsHTML = '';
    
    cryptoData.forEach(crypto => {
        const changeClass = crypto.change24h >= 0 ? 'positive' : 'negative';
        const changeSign = crypto.change24h >= 0 ? '+' : '';
        
        cardsHTML += `
            <div class="crypto-card" data-id="${crypto.id}">
                <div class="card-header">
                    <div class="card-crypto-info">
                        <div class="crypto-icon ${crypto.icon}">${crypto.symbol.charAt(0)}</div>
                        <div class="crypto-info">
                            <span class="crypto-name">${crypto.name}</span>
                            <span class="crypto-symbol">${crypto.symbol}</span>
                        </div>
                    </div>
                    <div class="card-price">$${formatNumber(crypto.price)}</div>
                </div>
                
                <div class="card-stats">
                    <div class="card-stat">
                        <span class="card-stat-label">24h Change</span>
                        <span class="card-stat-value ${changeClass}">
                            ${changeSign}${crypto.change24h}%
                        </span>
                    </div>
                    <div class="card-stat">
                        <span class="card-stat-label">Market Cap</span>
                        <span class="card-stat-value">$${formatNumber(crypto.marketCap)}B</span>
                    </div>
                    <div class="card-stat">
                        <span class="card-stat-label">24h Volume</span>
                        <span class="card-stat-value">$${formatNumber(crypto.volume24h)}B</span>
                    </div>
                    <div class="card-stat">
                        <span class="card-stat-label">Category</span>
                        <span class="card-stat-value">${crypto.category}</span>
                    </div>
                </div>
                
                <div class="card-chart">
                    <div class="mini-chart" id="card-chart-${crypto.symbol}"></div>
                </div>
                
                <div class="card-actions">
                    <button class="card-action-btn buy" data-symbol="${crypto.symbol}">
                        <i class="fas fa-arrow-up"></i> Buy
                    </button>
                    <button class="card-action-btn sell" data-symbol="${crypto.symbol}">
                        <i class="fas fa-arrow-down"></i> Sell
                    </button>
                    <button class="card-action-btn trade" data-symbol="${crypto.symbol}">
                        <i class="fas fa-exchange-alt"></i> Trade
                    </button>
                </div>
            </div>
        `;
    });
    
    cardsGrid.innerHTML = cardsHTML;
    
    // Render mini charts for cards
    cryptoData.forEach(crypto => {
        renderMiniChart(card-chart-${crypto.symbol}, crypto.chartData);
    });
}

function renderTrendingData() {
    // Top Gainers
    const gainers = [...cryptoData]
        .sort((a, b) => b.change24h - a.change24h)
        .slice(0, 5);
    
    renderTrendingList('trendingGainers', gainers);
    
    // Top Losers
    const losers = [...cryptoData]
        .sort((a, b) => a.change24h - b.change24h)
        .slice(0, 5);
    
    renderTrendingList('trendingLosers', losers);
    
    // Highest Volume
    const volumeLeaders = [...cryptoData]
        .sort((a, b) => b.volume24h - a.volume24h)
        .slice(0, 5);
    
    renderTrendingList('trendingVolume', volumeLeaders);
}

function renderTrendingList(elementId, data) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let listHTML = '';
    
    data.forEach((crypto, index) => {
        const changeClass = crypto.change24h >= 0 ? 'positive' : 'negative';
        const changeSign = crypto.change24h >= 0 ? '+' : '';
        
        listHTML += `
            <div class="trending-item">
                <span class="trending-rank">${index + 1}</span>
                <div class="trending-crypto">
                    <div class="crypto-icon ${crypto.icon}">${crypto.symbol.charAt(0)}</div>
                    <div class="crypto-info">
                        <span class="crypto-name">${crypto.name}</span>
                        <span class="crypto-symbol">${crypto.symbol}</span>
                    </div>
                </div>
                <span class="trending-price">$${formatNumber(crypto.price)}</span>
                <span class="trending-change ${changeClass}">
                    ${changeSign}${crypto.change24h}%
                </span>
            </div>
        `;
    });
    
    element.innerHTML = listHTML;
}

// ===== SEARCH FUNCTIONALITY =====
function initializeSearch() {
    const searchInput = document.getElementById('searchCrypto');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length === 0) {
            // Show all rows/cards
            document.querySelectorAll('.crypto-row, .crypto-card').forEach(el => {
                el.style.display = '';
            });
            return;
        }
        
        // Filter table rows
        document.querySelectorAll('.crypto-row').forEach(row => {
            const name = row.querySelector('.crypto-name').textContent.toLowerCase();
            const symbol = row.querySelector('.crypto-symbol').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || symbol.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Filter cards
        document.querySelectorAll('.crypto-card').forEach(card => {
            const name = card.querySelector('.crypto-name').textContent.toLowerCase();
            const symbol = card.querySelector('.crypto-symbol').textContent.toLowerCase();
            
            if (name.includes(searchTerm) || symbol.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// ===== FILTER FUNCTIONALITY =====
function initializeFilters() {
    const filterSelect = document.getElementById('marketFilter');
    if (!filterSelect) return;
    
    filterSelect.addEventListener('change', function() {
        const filterValue = this.value;
        let filteredData = [...cryptoData];
        
        switch(filterValue) {
            case 'gainers':
                filteredData = filteredData.filter(crypto => crypto.change24h > 0)
                    .sort((a, b) => b.change24h - a.change24h);
                break;
            case 'losers':
                filteredData = filteredData.filter(crypto => crypto.change24h < 0)
                    .sort((a, b) => a.change24h - b.change24h);
                break;
            case 'volume':
                filteredData.sort((a, b) => b.volume24h - a.volume24h);
                break;
            case 'marketCap':
                filteredData.sort((a, b) => b.marketCap - a.marketCap);
                break;
        }
        
        // Update table view
        updateTableView(filteredData);
        
        // Update cards view
        updateCardsView(filteredData);
    });
}

// ===== VIEW TOGGLE =====
function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const tableView = document.querySelector('.market-table-view');
    const cardsView = document.querySelector('.market-cards-view');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update view
            const viewType = this.dataset.view;
            
            if (viewType === 'table') {
                tableView.classList.add('active');
                cardsView.classList.remove('active');
            } else {
                tableView.classList.remove('active');
                cardsView.classList.add('active');
            }
        });
    });
}

// ===== SORTING FUNCTIONALITY =====
function initializeSorting() {
    const sortableHeaders = document.querySelectorAll('.sortable');
    
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const sortBy = this.dataset.sort;
            const isAscending = !this.classList.contains('asc');
            
            // Update sort indicators
            sortableHeaders.forEach(h => {
                h.classList.remove('asc', 'desc');
                const icon = h.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-sort';
                }
            });
            
            this.classList.toggle('asc', isAscending);
            this.classList.toggle('desc', !isAscending);
            
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = isAscending ? 'fas fa-sort-up' : 'fas fa-sort-down';
            }
            
            // Sort data
            const sortedData = [...cryptoData].sort((a, b) => {
                let aVal = a[sortBy];
                let bVal = b[sortBy];
                
                // Handle different data types
                if (sortBy === 'name') {
                    aVal = a.name.toLowerCase();
                    bVal = b.name.toLowerCase();
                } else if (sortBy === 'price') {
                    aVal = a.price;
                    bVal = b.price;
                } else if (sortBy === 'change24h') {
                    aVal = a.change24h;
                    bVal = b.change24h;
                } else if (sortBy === 'marketCap') {
                    aVal = a.marketCap;
                    bVal = b.marketCap;
                } else if (sortBy === 'volume24h') {
                    aVal = a.volume24h;
                    bVal = b.volume24h;
                }
                
                if (isAscending) {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
            
            // Update views
            updateTableView(sortedData);
            updateCardsView(sortedData);
        });
    });
}

// ===== TRENDING TABS =====
function initializeTrendingTabs() {
    const trendingTabs = document.querySelectorAll('.trending-tab');
    const trendingLists = document.querySelectorAll('.trending-list');
    
    trendingTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab
            trendingTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            trendingLists.forEach(list => {
                list.style.display = 'none';
            });
            
            document.getElementById(trending${tabId.charAt(0).toUpperCase() + tabId.slice(1)})
                .style.display = 'block';
        });
    });
}

// ===== MINI CHARTS =====
function initializeMiniCharts() {
    // Initialize featured pair charts
    const featuredPairs = [
        { id: 'btcEthChart', data: [0.066, 0.0665, 0.067, 0.0672, 0.0671, 0.0672, 0.0673] },
        { id: 'ethUsdtChart', data: [2830, 2840, 2845, 2850, 2848, 2850, 2852] },
        { id: 'solUsdcChart', data: [100, 101, 101.5, 102, 101.8, 102, 102.2] }
    ];
    
    featuredPairs.forEach(pair => {
        renderMiniChart(pair.id, pair.data);
    });
}

function renderMiniChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create SVG element
    container.innerHTML = '';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', 0 0 ${width} ${height});
    
    // Calculate chart points
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return ${x},${y};
    }).join(' ');
    
    // Create path
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    path.setAttribute('points', points);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', data[data.length - 1] >= data[0] ? '#10B981' : '#EF4444');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    
    svg.appendChild(path);
    container.appendChild(svg);
}

// ===== ACTION BUTTONS =====
function initializeActionButtons() {
    // Trade buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.trade-btn') || 
            e.target.closest('.pair-trade-btn') || 
            e.target.closest('.card-action-btn.trade')) {
            const symbol = e.target.closest('button').dataset.symbol;
            openTradeModal(symbol);
        }
        
        // Buy buttons
        if (e.target.closest('.card-action-btn.buy')) {
            const symbol = e.target.closest('button').dataset.symbol;
            openBuyModal(symbol);
        }
        
        // Sell buttons
        if (e.target.closest('.card-action-btn.sell')) {
            const symbol = e.target.closest('button').dataset.symbol;
            openSellModal(symbol);
        }
        
        // Watchlist buttons
        if (e.target.closest('.watchlist-btn')) {
            const button = e.target.closest('.watchlist-btn');
            const cryptoId = button.dataset.id;
            toggleWatchlist(cryptoId, button);
        }
    });
}

// ===== MODAL FUNCTIONS =====
function openTradeModal(symbol) {
    const crypto = cryptoData.find(c => c.symbol === symbol);
    if (!crypto) return;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Trade ${crypto.name} (${crypto.symbol})</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="trade-info">
                    <div class="current-price">
                        <span>Current Price:</span>
                        <span class="price-value">$${formatNumber(crypto.price)}</span>
                    </div>
                    <div class="price-change">
                        <span>24h Change:</span>
                        <span class="${crypto.change24h >= 0 ? 'positive' : 'negative'}">
                            ${crypto.change24h >= 0 ? '+' : ''}${crypto.change24h}%
                        </span>
                    </div>
                </div>
                
                <div class="trade-form">
                    <div class="form-group">
                        <label>Order Type</label>
                        <select class="form-input">
                            <option value="market">Market Order</option>
                            <option value="limit">Limit Order</option>
                            <option value="stop">Stop Order</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Amount (${crypto.symbol})</label>
                        <input type="number" class="form-input" placeholder="0.00" step="0.0001">
                    </div>
                    
                    <div class="form-group">
                        <label>Total (USD)</label>
                        <input type="number" class="form-input" placeholder="0.00" step="0.01">
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-primary buy-action">Buy ${crypto.symbol}</button>
                        <button class="btn btn-danger sell-action">Sell ${crypto.symbol}</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: var(--dark-light);
            border-radius: var(--border-radius);
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid rgba(100, 116, 139, 0.2);
        }
        
        .modal-close {
            background: none;
            border: none;
            color: var(--gray);
            font-size: 1.5rem;
            cursor: pointer;
            transition: var(--transition);
        }
        
        .modal-close:hover {
            color: var(--light);
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .trade-info {
            background: var(--card-bg);
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }
        
        .current-price, .price-change {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        
        .price-value {
            font-weight: 700;
            font-size: 1.2rem;
        }
        
        .trade-form .form-group {
            margin-bottom: 1rem;
        }
        
        .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .form-actions .btn {
            flex: 1;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
    
    // Handle buy/sell actions
    modal.querySelector('.buy-action').addEventListener('click', () => {
        alert(Buy order for ${crypto.symbol} placed successfully!);
        modal.remove();
        style.remove();
    });
    
    modal.querySelector('.sell-action').addEventListener('click', () => {
        alert(Sell order for ${crypto.symbol} placed successfully!);
        modal.remove();
        style.remove();
    });
}

function openBuyModal(symbol) {
    // Similar to openTradeModal but pre-filled for buying
    openTradeModal(symbol);
}

function openSellModal(symbol) {
    // Similar to openTradeModal but pre-filled for selling
    openTradeModal(symbol);
}

function toggleWatchlist(cryptoId, button) {
    const icon = button.querySelector('i');
    const isInWatchlist = icon.classList.contains('fas');
    
    if (isInWatchlist) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        showNotification('Removed from watchlist');
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
        showNotification('Added to watchlist');
    }
    
    // Update localStorage
    let watchlist = JSON.parse(localStorage.getItem('fpcrypto_watchlist') || '[]');
    
    if (isInWatchlist) {
        watchlist = watchlist.filter(id => id !== cryptoId);
    } else {
        watchlist.push(cryptoId);
    }
    
    localStorage.setItem('fpcrypto_watchlist', JSON.stringify(watchlist));
}

// ===== UPDATE FUNCTIONS =====
function updateTableView(data) {
    const tableBody = document.getElementById('marketTableBody');
    if (!tableBody) return;
    
    let tableHTML = '';
    
    data.forEach(crypto => {
        const changeClass = crypto.change24h >= 0 ? 'positive' : 'negative';
        const changeSign = crypto.change24h >= 0 ? '+' : '';
        
        tableHTML += `
            <tr class="crypto-row" data-id="${crypto.id}">
                <td>
                    <div class="crypto-cell">
                        <div class="crypto-icon ${crypto.icon}">${crypto.symbol.charAt(0)}</div>
                        <div class="crypto-info">
                            <span class="crypto-name">${crypto.name}</span>
                            <span class="crypto-symbol">${crypto.symbol}</span>
                        </div>
                    </div>
                </td>
                <td class="price-cell">$${formatNumber(crypto.price)}</td>
                <td class="change-cell ${changeClass}">
                    ${changeSign}${crypto.change24h}%
                </td>
                <td class="market-cap-cell">$${formatNumber(crypto.marketCap)}B</td>
                <td class="volume-cell">$${formatNumber(crypto.volume24h)}B</td>
                <td class="chart-cell">
                    <div class="mini-chart" id="chart-${crypto.symbol}"></div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn trade-btn" data-symbol="${crypto.symbol}">
                            <i class="fas fa-exchange-alt"></i> Trade
                        </button>
                        <button class="action-btn watchlist-btn" data-id="${crypto.id}">
                            <i class="far fa-star"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = tableHTML;
    
    // Re-render mini charts
    data.forEach(crypto => {
        renderMiniChart(chart-${crypto.symbol}, crypto.chartData);
    });
}

function updateCardsView(data) {
    const cardsGrid = document.getElementById('marketCardsGrid');
    if (!cardsGrid) return;
    
    let cardsHTML = '';
    
    data.forEach(crypto => {
        const changeClass = crypto.change24h >= 0 ? 'positive' : 'negative';
        const changeSign = crypto.change24h >= 0 ? '+' : '';
        
        cardsHTML += `
            <div class="crypto-card" data-id="${crypto.id}">
                <div class="card-header">
                    <div class="card-crypto-info">
                        <div class="crypto-icon ${crypto.icon}">${crypto.symbol.charAt(0)}</div>
                        <div class="crypto-info">
                            <span class="crypto-name">${crypto.name}</span>
                            <span class="crypto-symbol">${crypto.symbol}</span>
                        </div>
                    </div>
                    <div class="card-price">$${formatNumber(crypto.price)}</div>
                </div>
                
                <div class="card-stats">
                    <div class="card-stat">
                        <span class="card-stat-label">24h Change</span>
                        <span class="card-stat-value ${changeClass}">
                            ${changeSign}${crypto.change24h}%
                        </span>
                    </div>
                    <div class="card-stat">
                        <span class="card-stat-label">Market Cap</span>
                        <span class="card-stat-value">$${formatNumber(crypto.marketCap)}B</span>
                    </div>
                </div>
                
                <div class="card-chart">
                    <div class="mini-chart" id="card-chart-${crypto.symbol}"></div>
                </div>
                
                <div class="card-actions">
                    <button class="card-action-btn trade" data-symbol="${crypto.symbol}">
                        <i class="fas fa-exchange-alt"></i> Trade
                    </button>
                </div>
            </div>
        `;
    });
    
    cardsGrid.innerHTML = cardsHTML;
    
    // Re-render mini charts
    data.forEach(crypto => {
        renderMiniChart(card-chart-${crypto.symbol}, crypto.chartData);
    });
}

function updateMarketStats() {
    // Calculate total market cap
    const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.marketCap, 0);
    document.getElementById('totalMarketCap').textContent = $${formatNumber(totalMarketCap)}T;
    
    // Calculate daily volume
    const dailyVolume = cryptoData.reduce((sum, crypto) => sum + crypto.volume24h, 0);
    document.getElementById('dailyVolume').textContent = $${formatNumber(dailyVolume)}B;
    
    // Calculate BTC dominance (simplified)
    const btc = cryptoData.find(c => c.symbol === 'BTC');
    const btcDominance = btc ? (btc.marketCap / totalMarketCap * 100).toFixed(1) : '52.4';
    document.getElementById('btcDominance').textContent = ${btcDominance}%;
}

// ===== REAL-TIME UPDATES =====
function simulateRealtimeUpdates() {
    // Update prices every 10 seconds
    setInterval(() => {
        cryptoData.forEach(crypto => {
            // Simulate small price changes
            const change = (Math.random() - 0.5) * 0.5; // -0.25% to +0.25%
            crypto.price *= (1 + change / 100);
            crypto.change24h += change;
            
            // Update chart data
            crypto.chartData.shift();
            crypto.chartData.push(crypto.price);
        });
        
        // Update views if they're visible
        if (document.querySelector('.market-table-view.active')) {
            updateTableView(cryptoData);
        }
        
        if (document.querySelector('.market-cards-view.active')) {
            updateCardsView(cryptoData);
        }
        
        updateMarketStats();
        renderTrendingData();
        
    }, 10000); // Update every 10 seconds
}

// ===== HELPER FUNCTIONS =====
function formatNumber(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(2);
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2);
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2);
    } else {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        });
    }
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = notification notification-${type};
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--dark-light);
            border-left: 4px solid ${type === 'success' ? '#10B981' : '#EF4444'};
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: var(--shadow);
            z-index: 10001;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .notification i {
            font-size: 1.2rem;
            color: ${type === 'success' ? '#10B981' : '#EF4444'};
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
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// ===== INITIALIZE WATCHLIST =====
function initializeWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('fpcrypto_watchlist') || '[]');
    
    watchlist.forEach(cryptoId => {
        const button = document.querySelector(.watchlist-btn[data-id="${cryptoId}"]);
        if (button) {
            const icon = button.querySelector('i');
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
    });
}

// Initialize watchlist when page loads
window.addEventListener('load', initializeWatchlist);