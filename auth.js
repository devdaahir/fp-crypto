// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Password toggle functionality
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.querySelector('input[name="remember"]').checked;
            
            // Basic validation
            if (!validateEmail(email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }
            
            if (password.length < 8) {
                showAlert('Password must be at least 8 characters long', 'error');
                return;
            }
            
            // Simulate login process
            simulateLogin(email, password, remember);
        });
    }

    // Registration Password Strength
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }

    // Registration Form Submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Populate countries
        populateCountries();
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateRegistration()) {
                simulateRegistration();
            }
        });
    }

    // Social Login Buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'GitHub';
            showAlert(`Redirecting to ${provider} authentication...`, 'info');
            // In production, this would redirect to OAuth endpoint
        });
    });
});

// Validation Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateRegistration() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const country = document.getElementById('country').value;
    const terms = document.querySelector('input[name="terms"]').checked;
    
    // Validate required fields
    if (!firstName || !lastName) {
        showAlert('Please enter your full name', 'error');
        return false;
    }
    
    if (!validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return false;
    }
    
    if (password.length < 8) {
        showAlert('Password must be at least 8 characters long', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return false;
    }
    
    if (!country) {
        showAlert('Please select your country', 'error');
        return false;
    }
    
    if (!terms) {
        showAlert('You must agree to the Terms of Service', 'error');
        return false;
    }
    
    // Check password strength
    const strength = calculatePasswordStrength(password);
    if (strength < 3) {
        showAlert('Please use a stronger password', 'warning');
        return false;
    }
    
    return true;
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength++; // Has uppercase
    if (/[a-z]/.test(password)) strength++; // Has lowercase
    if (/[0-9]/.test(password)) strength++; // Has numbers
    if (/[^A-Za-z0-9]/.test(password)) strength++; // Has special chars
    
    return strength;
}

function updatePasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    const strength = calculatePasswordStrength(password);
    const width = Math.min((strength / 6) * 100, 100);
    
    // Update bar width and color
    strengthBar.style.width = width + '%';
    
    let color, text;
    if (strength <= 2) {
        color = 'var(--danger)';
        text = 'Weak';
    } else if (strength <= 4) {
        color = 'var(--warning)';
        text = 'Medium';
    } else {
        color = 'var(--success)';
        text = 'Strong';
    }
    
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = `Password strength: ${text}`;
}

function populateCountries() {
    const countrySelect = document.getElementById('country');
    if (!countrySelect) return;
    
    const countries = [
        'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany',
        'France', 'Japan', 'Singapore', 'Netherlands', 'Switzerland',
        'South Korea', 'India', 'Brazil', 'Mexico', 'United Arab Emirates'
    ];
    
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

// Simulated API Calls
function simulateLogin(email, password, remember) {
    showAlert('Signing in...', 'info');
    
    // Simulate API delay
    setTimeout(() => {
        // In production, this would be a real API call
        const mockResponse = {
            success: true,
            user: {
                id: 'user_' + Date.now(),
                email: email,
                name: email.split('@')[0]
            },
            token: 'mock_jwt_token_' + Math.random().toString(36).substr(2)
        };
        
        if (mockResponse.success) {
            showAlert('Login successful! Redirecting to dashboard...', 'success');
            
            // Store mock token
            if (remember) {
                localStorage.setItem('fp_cryptotrade_token', mockResponse.token);
                localStorage.setItem('fp_cryptotrade_user', JSON.stringify(mockResponse.user));
            } else {
                sessionStorage.setItem('fp_cryptotrade_token', mockResponse.token);
                sessionStorage.setItem('fp_cryptotrade_user', JSON.stringify(mockResponse.user));
            }
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showAlert('Invalid email or password', 'error');
        }
    }, 1500);
}

function simulateRegistration() {
    showAlert('Creating your account...', 'info');
    
    setTimeout(() => {
        const firstName = document.getElementById('firstName').value;
        const email = document.getElementById('email').value;
        
        const mockResponse = {
            success: true,
            message: 'Account created successfully!',
            user: {
                id: 'user_' + Date.now(),
                email: email,
                firstName: firstName,
                verified: false
            }
        };
        
        if (mockResponse.success) {
            showAlert('Account created! Please check your email to verify your account.', 'success');
            
            // Store temporary user data
            sessionStorage.setItem('fp_cryptotrade_temp_user', JSON.stringify(mockResponse.user));
            
            // Redirect to verification page
            setTimeout(() => {
                window.location.href = 'verify-email.html?email=' + encodeURIComponent(email);
            }, 2000);
        } else {
            showAlert('Registration failed. Please try again.', 'error');
        }
    }, 2000);
}

// UI Utilities
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

// Alert Styles (dynamically added)
const alertStyles = document.createElement('style');
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