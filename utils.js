// Utility Functions for FP-CryptoTrade

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Format percentage
function formatPercentage(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 2
    }).format(value / 100);
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Generate unique ID
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Validate crypto address
function validateCryptoAddress(address, type = 'bitcoin') {
    const patterns = {
        bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
        ethereum: /^0x[a-fA-F0-9]{40}$/,
        litecoin: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
        ripple: /^r[0-9a-zA-Z]{24,34}$/
    };
    
    return patterns[type] ? patterns[type].test(address) : true;
}

// Calculate ROI
function calculateROI(initial, current) {
    return ((current - initial) / initial) * 100;
}

// Calculate APY
function calculateAPY(principal, annualInterest) {
    return ((1 + annualInterest/principal) ** (365/1) - 1) * 100;
}

// Risk assessment
function assessRisk(volatility, correlation, diversification) {
    const score = (volatility * 0.5) + (correlation * 0.3) + ((1 - diversification) * 0.2);
    
    if (score < 0.3) return { level: 'Low', color: '#10B981' };
    if (score < 0.6) return { level: 'Medium', color: '#F59E0B' };
    return { level: 'High', color: '#EF4444' };
}

// Password validation
function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    return {
        valid: Object.values(requirements).every(v => v),
        requirements: requirements
    };
}

// Two-factor authentication code generator
function generate2FACode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Session management
const SessionManager = {
    setSession: function(userData, remember = false) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('fp_user', JSON.stringify(userData));
        storage.setItem('fp_token', userData.token || '');
    },
    
    getSession: function() {
        const user = localStorage.getItem('fp_user') || sessionStorage.getItem('fp_user');
        const token = localStorage.getItem('fp_token') || sessionStorage.getItem('fp_token');
        
        return {
            user: user ? JSON.parse(user) : null,
            token: token
        };
    },
    
    clearSession: function() {
        localStorage.removeItem('fp_user');
        localStorage.removeItem('fp_token');
        sessionStorage.removeItem('fp_user');
        sessionStorage.removeItem('fp_token');
    },
    
    isAuthenticated: function() {
        const session = this.getSession();
        return !!session.user && !!session.token;
    }
};

// API Error handling
class APIError extends Error {
    constructor(message, status, code) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.code = code;
    }
}

// API Client
class APIClient {
    constructor(baseURL = 'https://api.fpcryptotrade.com') {
        this.baseURL = baseURL;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        // Add auth token if available
        const session = SessionManager.getSession();
        if (session.token) {
            headers['Authorization'] = `Bearer ${session.token}`;
        }
        
        try {
            const response = await fetch(url, {
                ...options,
                headers
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new APIError(
                    data.message || 'API request failed',
                    response.status,
                    data.code
                );
            }
            
            return data;
        } catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            throw new APIError('Network error', 0, 'NETWORK_ERROR');
        }
    }
    
    async get(endpoint, params = {}) {
        const query = new URLSearchParams(params).toString();
        const url = query ? `${endpoint}?${query}` : endpoint;
        return this.request(url, { method: 'GET' });
    }
    
    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

// Export for use in browser
if (typeof window !== 'undefined') {
    window.FPUtils = {
        formatCurrency,
        formatPercentage,
        formatDate,
        debounce,
        throttle,
        generateId,
        validateCryptoAddress,
        calculateROI,
        calculateAPY,
        assessRisk,
        validatePassword,
        generate2FACode,
        SessionManager,
        APIError,
        APIClient
    };
}