// Main Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            if (navMenu.style.display === 'flex') {
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '70px';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.background = 'white';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = 'var(--shadow)';
                navMenu.style.gap = '20px';
            }
        });
        
        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                navMenu.style.display = '';
            }
        });
    }
    
    // Trading Preview Animation (Hero Section)
    const tradingPreview = document.querySelector('.trading-preview');
    if (tradingPreview) {
        createTradingPreview(tradingPreview);
    }
    
    // Animate Features on Scroll
    const featureCards = document.querySelectorAll('.feature-card');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // Initialize user session check
    checkUserSession();
});

function createTradingPreview(container) {
    // Create a simple trading chart visualization
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 200;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Generate mock price data
    const data = [];
    let price = 100;
    for (let i = 0; i < 50; i++) {
        price += (Math.random() - 0.5) * 10;
        data.push(price);
    }
    
    // Draw chart
    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        
        // Vertical grid
        for (let i = 0; i < 5; i++) {
            const x = (canvas.width / 5) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal grid
        for (let i = 0; i < 5; i++) {
            const y = (canvas.height / 5) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw price line
        const minPrice = Math.min(...data);
        const maxPrice = Math.max(...data);
        const priceRange = maxPrice - minPrice;
        
        ctx.strokeStyle = '#0A84FF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((price, index) => {
            const x = (canvas.width / (data.length - 1)) * index;
            const y = canvas.height - ((price - minPrice) / priceRange) * canvas.height * 0.8 - canvas.height * 0.1;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw buy/sell markers
        const buyIndex = Math.floor(data.length * 0.3);
        const sellIndex = Math.floor(data.length * 0.7);
        
        // Buy marker
        const buyX = (canvas.width / (data.length - 1)) * buyIndex;
        const buyY = canvas.height - ((data[buyIndex] - minPrice) / priceRange) * canvas.height * 0.8 - canvas.height * 0.1;
        
        ctx.fillStyle = '#00D4AA';
        ctx.beginPath();
        ctx.arc(buyX, buyY, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Sell marker
        const sellX = (canvas.width / (data.length - 1)) * sellIndex;
        const sellY = canvas.height - ((data[sellIndex] - minPrice) / priceRange) * canvas.height * 0.8 - canvas.height * 0.1;
        
        ctx.fillStyle = '#FF6B35';
        ctx.beginPath();
        ctx.arc(sellX, sellY, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Animate by shifting data
        data.shift();
        data.push(data[data.length - 1] + (Math.random() - 0.5) * 10);
    }
    
    // Animate chart
    setInterval(drawChart, 1000);
    drawChart();
}

function checkUserSession() {
    const token = localStorage.getItem('fp_cryptotrade_token') || 
                  sessionStorage.getItem('fp_cryptotrade_token');
    
    if (token) {
        // User is logged in - update UI
        const navAuth = document.querySelector('.nav-auth');
        if (navAuth) {
            const user = JSON.parse(localStorage.getItem('fp_cryptotrade_user') || 
                                   sessionStorage.getItem('fp_cryptotrade_user') || '{}');
            
            navAuth.innerHTML = `
                <div class="user-menu">
                    <a href="dashboard.html" class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                        <span>${user.name || 'Account'}</span>
                    </a>
                    <div class="dropdown-menu">
                        <a href="dashboard.html"><i class="fas fa-chart-line"></i> Dashboard</a>
                        <a href="profile.html"><i class="fas fa-user"></i> Profile</a>
                        <a href="settings.html"><i class="fas fa-cog"></i> Settings</a>
                        <div class="dropdown-divider"></div>
                        <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            `;
            
            // Add logout functionality
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    logoutUser();
                });
            }
        }
    }
}

function logoutUser() {
    // Clear storage
    localStorage.removeItem('fp_cryptotrade_token');
    localStorage.removeItem('fp_cryptotrade_user');
    sessionStorage.removeItem('fp_cryptotrade_token');
    sessionStorage.removeItem('fp_cryptotrade_user');
    
    // Show confirmation
    showAlert('Logged out successfully', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}