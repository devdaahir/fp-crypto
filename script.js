// Simulate price updates
function updatePrices() {
    const btcPrice = document.getElementById('btc-price');
    const ethPrice = document.getElementById('eth-price');
    if (btcPrice && ethPrice) {
        btcPrice.textContent = `$${Math.floor(50000 + Math.random() * 1000)}`;
        ethPrice.textContent = `$${Math.floor(3000 + Math.random() * 200)}`;
    }
}
setInterval(updatePrices, 5000);

// Portfolio chart
if (document.getElementById('portfolioChart')) {
    const ctx = document.getElementById('portfolioChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Bitcoin', 'Ethereum', 'Other'],
            datasets: [{
                data: [50, 30, 20],
                backgroundColor: ['#ff6600', '#007bff', '#28a745'],
            }]
        },
        options: { responsive: true }
    });
}

// Button handlers
function scrollToTrade() {
    window.scrollTo({ top: document.getElementById('trade').offsetTop, behavior: 'smooth' });
}

function handleTrade(action, crypto) {
    alert(`${action.toUpperCase()} order for ${crypto} placed! (Demo - No real transaction)`);
}

// Form handling for login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        // Demo: Check against localStorage (set during register)
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.email === email && storedUser.password === password) {
            // Mark session as logged in and store current user
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('currentUser', JSON.stringify(storedUser));
            alert('Login successful! Redirecting...');
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials. Try registering first.');
        }
    });
}

// Form handling for register
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        // Demo: Store in localStorage
        localStorage.setItem('user', JSON.stringify({ name, email, password }));
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    });
}

// Update navigation/auth area based on login state
function updateAuthUI() {
    const authArea = document.getElementById('auth-area');
    if (!authArea) return;
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    // Clear existing contents
    authArea.innerHTML = '';
    if (loggedIn && currentUser && currentUser.email) {
        const emailSpan = document.createElement('span');
        emailSpan.className = 'user-email';
        emailSpan.textContent = currentUser.email;
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'logout-btn';
        logoutBtn.textContent = 'Logout';
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('currentUser');
            // Re-render UI
            updateAuthUI();
            // Optionally reload to reset page state
            window.location.href = 'index.html';
        });
        authArea.appendChild(emailSpan);
        authArea.appendChild(logoutBtn);
    } else {
        const loginBtn = document.createElement('button');
        loginBtn.className = 'login-btn';
        loginBtn.textContent = 'Login';
        loginBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
        authArea.appendChild(loginBtn);
    }
}

// Ensure auth UI is correct on load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', updateAuthUI);
}