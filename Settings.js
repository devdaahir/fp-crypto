
// Settings Page JavaScript - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    loadUserData();
    
    // Setup sidebar navigation
    setupSidebarNavigation();
    
    // Setup profile form
    setupProfileForm();
    
    // Setup security settings
    setupSecuritySettings();
    
    // Setup notification toggles
    setupNotificationToggles();
    
    // Setup trading preferences
    setupTradingPreferences();
    
    // Setup API keys management
    setupApiKeys();
    
    // Setup logout button
    setupLogoutButton();
});

// 1. Profile Management and Phone Verification - FIXED
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('fp_cryptotrade_user') || 
                           sessionStorage.getItem('fp_cryptotrade_user') || '{}');
    
    if (user.name) {
        const nameParts = user.name.split(' ');
        const profileTitle = document.querySelector('.profile-info h3');
        if (profileTitle) {
            profileTitle.textContent = user.name;
        }
        
        // Find form inputs more safely
        const firstNameInput = document.querySelector('input[type="text"][placeholder*="First" i], input[type="text"]:first-of-type');
        const lastNameInput = document.querySelector('input[type="text"][placeholder*="Last" i], input[type="text"]:nth-of-type(2)');
        
        if (firstNameInput && nameParts.length >= 1) {
            firstNameInput.value = nameParts[0];
        }
        if (lastNameInput && nameParts.length >= 2) {
            lastNameInput.value = nameParts.slice(1).join(' ');
        }
    }
    
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput && user.email) {
        emailInput.value = user.email;
    }
    
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput && user.phone) {
        phoneInput.value = user.phone;
    }
    
    const countrySelect = document.querySelector('select');
    if (countrySelect && user.country) {
        countrySelect.value = user.country;
    }
    
    const avatarPreview = document.querySelector('.avatar-preview');
    if (avatarPreview && user.avatar) {
        avatarPreview.innerHTML = `<img src="${user.avatar}" alt="Profile">`;
    }
}

function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.settings-section');
    
    // If no nav items found, return early
    if (navItems.length === 0) return;
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section') + '-section';
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
        });
    });
}

function setupProfileForm() {
    const form = document.querySelector('.settings-form');
    if (!form) return;
    
    const cancelBtn = form.querySelector('.btn-outline');
    const saveBtn = form.querySelector('.btn-primary');
    const verifyBtn = form.querySelector('.btn-verify');
    const uploadBtn = form.querySelector('.btn-upload');
    
    // Create file input for avatar upload
    const avatarInput = document.createElement('input');
    avatarInput.type = 'file';
    avatarInput.accept = 'image/*';
    avatarInput.style.display = 'none';
    document.body.appendChild(avatarInput);
    
    // Avatar upload
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            avatarInput.click();
        });
    }
    
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showAlert('File size must be less than 5MB', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const avatarPreview = document.querySelector('.avatar-preview');
                if (avatarPreview) {
                    avatarPreview.innerHTML = `<img src="${e.target.result}" alt="Profile">`;
                    
                    // Save to user data
                    const user = JSON.parse(localStorage.getItem('fp_cryptotrade_user') || '{}');
                    user.avatar = e.target.result;
                    localStorage.setItem('fp_cryptotrade_user', JSON.stringify(user));
                    
                    showAlert('Profile picture updated', 'success');
                }
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Phone verification - FIXED null check
    if (verifyBtn) {
        verifyBtn.addEventListener('click', function() {
            showVerificationModal();
        });
    }
    
    // Cancel changes
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (confirm('Discard changes?')) {
                loadUserData(); // Reload original data
                showAlert('Changes discarded', 'info');
            }
        });
    }
    
    // Save changes - FIXED form submission
    if (saveBtn) {
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            saveProfileChanges(form);
        });
    }
    
    // Also handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfileChanges(form);
    });
}

function saveProfileChanges(form) {
    // Get form data safely
    const formInputs = form.querySelectorAll('input, select');
    const formData = {};
    
    formInputs.forEach(input => {
        if (input.type === 'checkbox') {
            formData[input.name || input.id] = input.checked;
        } else {
            formData[input.name || input.id] = input.value;
        }
    });
    
    // Get specific fields with fallbacks
    const firstName = form.querySelector('input[type="text"][placeholder*="First" i]')?.value || 
                     form.querySelector('input[type="text"]:first-of-type')?.value || '';
    const lastName = form.querySelector('input[type="text"][placeholder*="Last" i]')?.value || 
                    form.querySelector('input[type="text"]:nth-of-type(2)')?.value || '';
    const email = form.querySelector('input[type="email"]')?.value || '';
    const phone = form.querySelector('input[type="tel"]')?.value || '';
    const country = form.querySelector('select')?.value || '';
    
    // Validation
    if (!firstName.trim() || !lastName.trim()) {
        showAlert('Please enter your full name', 'error');
        return;
    }
    
    if (!email.trim() || !validateEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }
    
    if (!phone.trim()) {
        showAlert('Please enter your phone number', 'error');
        return;
    }
    
    const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        phone: phone.trim(),
        country: country,
        updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const currentUser = JSON.parse(localStorage.getItem('fp_cryptotrade_user') || '{}');
    const updatedUser = { ...currentUser, ...userData };
    
    localStorage.setItem('fp_cryptotrade_user', JSON.stringify(updatedUser));
    sessionStorage.setItem('fp_cryptotrade_user', JSON.stringify(updatedUser));
    
    showAlert('Profile updated successfully', 'success');
    
    // Update profile info display
    const profileTitle = document.querySelector('.profile-info h3');
    if (profileTitle) {
        profileTitle.textContent = userData.name;
    }
}

function showVerificationModal() {
    const phoneInput = document.querySelector('input[type="tel"]');
    const phoneNumber = phoneInput ? phoneInput.value : '(555) 123-4567';
    
    const modal = document.createElement('div');
    modal.className = 'modal verification-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Verify Phone Number</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>We'll send a verification code to your phone number:</p>
                <div class="phone-display">
                    <span>+1 ${phoneNumber}</span>
                </div>
                
                <div class="form-group">
                    <label>Enter Verification Code</label>
                    <div class="verification-input">
                        <input type="text" maxlength="6" placeholder="000000" id="verificationCode">
                        <button class="btn-resend" id="resendBtn" disabled>
                            Resend (60s)
                        </button>
                    </div>
                </div>
                
                <div class="verification-note">
                    <i class="fas fa-info-circle"></i>
                    <p>If you don't receive the code, check your SMS messages or request a new code.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm" id="verifyBtn">
                    <i class="fas fa-check"></i> Verify
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup verification modal
    setupVerificationModal(modal);
}

function setupVerificationModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('#verifyBtn');
    const resendBtn = modal.querySelector('#resendBtn');
    const codeInput = modal.querySelector('#verificationCode');
    
    let countdown = 60;
    let countdownInterval;
    
    function closeModal() {
        modal.classList.remove('show');
        clearInterval(countdownInterval);
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // Start countdown for resend button
    function updateResendButton() {
        if (countdown > 0) {
            resendBtn.textContent = `Resend (${countdown}s)`;
            resendBtn.disabled = true;
            countdown--;
        } else {
            resendBtn.textContent = 'Resend Code';
            resendBtn.disabled = false;
            clearInterval(countdownInterval);
        }
    }
    
    // Send initial code
    sendVerificationCode();
    countdownInterval = setInterval(updateResendButton, 1000);
    updateResendButton();
    
    // Resend code
    if (resendBtn) {
        resendBtn.addEventListener('click', function() {
            if (!this.disabled) {
                sendVerificationCode();
                countdown = 60;
                updateResendButton();
                countdownInterval = setInterval(updateResendButton, 1000);
                showAlert('New verification code sent', 'info');
            }
        });
    }
    
    // Verify code
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const code = codeInput.value;
            
            if (code.length !== 6 || !/^\d+$/.test(code)) {
                showAlert('Please enter a valid 6-digit code', 'error');
                return;
            }
            
            verifyCode(code, modal);
        });
    }
    
    // Auto-focus code input
    if (codeInput) codeInput.focus();
    
    // Auto-submit on 6 digits
    if (codeInput) {
        codeInput.addEventListener('input', function() {
            if (this.value.length === 6) {
                if (confirmBtn) confirmBtn.click();
            }
        });
    }
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function sendVerificationCode() {
    // Generate and save a code for demo
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('fp_verification_code', code);
    console.log('Demo verification code:', code); // For testing
}

function verifyCode(code, modal) {
    showAlert('Verifying code...', 'info');
    
    setTimeout(() => {
        const savedCode = localStorage.getItem('fp_verification_code') || '123456';
        
        if (code === savedCode) {
            showAlert('Phone number verified successfully', 'success');
            
            // Update status in profile
            const phoneStatus = document.querySelector('.phone-status');
            if (phoneStatus) {
                phoneStatus.innerHTML = `
                    <i class="fas fa-check-circle" style="color: var(--success)"></i>
                    <span>Verified</span>
                `;
            }
            
            // Remove verify button
            const verifyBtn = document.querySelector('.btn-verify');
            if (verifyBtn) verifyBtn.remove();
            
            // Save verification status
            const user = JSON.parse(localStorage.getItem('fp_cryptotrade_user') || '{}');
            user.phoneVerified = true;
            user.phoneVerifiedAt = new Date().toISOString();
            localStorage.setItem('fp_cryptotrade_user', JSON.stringify(user));
            
            modal.querySelector('.modal-close')?.click();
        } else {
            showAlert('Invalid verification code. Try: 123456', 'error');
        }
    }, 1500);
}

// 2. Security Settings - FIXED
function setupSecuritySettings() {
    // Load security settings
    loadSecuritySettings();
    
    // Setup event listeners safely
    const manageBtn = document.querySelector('.btn-manage');
    const changeBtn = document.querySelector('.btn-change');
    const viewBtn = document.querySelector('.btn-view');
    const manageSessionsBtn = document.querySelectorAll('.btn-manage')[1];
    const enableWhitelistBtn = document.querySelector('.btn-enable');
    
    if (manageBtn) manageBtn.addEventListener('click', open2FAManagement);
    if (changeBtn) changeBtn.addEventListener('click', openChangePassword);
    if (viewBtn) viewBtn.addEventListener('click', openLoginHistory);
    if (manageSessionsBtn) manageSessionsBtn.addEventListener('click', openSessionManagement);
    if (enableWhitelistBtn) enableWhitelistBtn.addEventListener('click', enableWithdrawalWhitelist);
}

function loadSecuritySettings() {
    const settings = JSON.parse(localStorage.getItem('fp_security_settings') || '{}');
    
    // 2FA status
    if (settings.twoFactorEnabled !== undefined) {
        update2FAStatus(settings.twoFactorEnabled);
    }
    
    // Withdrawal whitelist
    if (settings.withdrawalWhitelist) {
        updateWhitelistStatus(settings.withdrawalWhitelist.enabled);
    }
}

function update2FAStatus(enabled) {
    const statusElement = document.querySelector('.security-item .status');
    const manageBtn = document.querySelector('.security-item .btn-manage');
    
    if (statusElement) {
        statusElement.textContent = enabled ? 'Enabled' : 'Disabled';
        statusElement.className = `status ${enabled ? 'enabled' : 'disabled'}`;
    }
    
    if (manageBtn) {
        manageBtn.textContent = enabled ? 'Manage' : 'Enable';
        if (!enabled) {
            manageBtn.className = 'btn-enable';
        }
    }
}

function updateWhitelistStatus(enabled) {
    const securityItems = document.querySelectorAll('.security-item');
    if (securityItems.length < 5) return;
    
    const whitelistItem = securityItems[4];
    const statusElement = whitelistItem.querySelector('.status');
    const enableBtn = whitelistItem.querySelector('.btn-enable');
    
    if (statusElement) {
        statusElement.textContent = enabled ? 'Enabled' : 'Disabled';
        statusElement.className = `status ${enabled ? 'enabled' : 'disabled'}`;
    }
    
    if (enableBtn) {
        enableBtn.textContent = enabled ? 'Manage' : 'Enable';
        if (enabled) {
            enableBtn.className = 'btn-manage';
        }
    }
}

function open2FAManagement() {
    const settings = JSON.parse(localStorage.getItem('fp_security_settings') || '{}');
    const twoFactorEnabled = settings.twoFactorEnabled || false;
    
    const modal = document.createElement('div');
    modal.className = 'modal 2fa-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Two-Factor Authentication</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="2fa-status ${twoFactorEnabled ? 'enabled' : 'disabled'}">
                    <i class="fas fa-shield-alt"></i>
                    <span>2FA is ${twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
                <p>Two-factor authentication adds an extra layer of security to your account.</p>
                
                <div class="2fa-options">
                    <h4>Authentication Methods</h4>
                    <div class="method-option ${twoFactorEnabled ? 'active' : ''}">
                        <div class="method-info">
                            <i class="fas fa-mobile-alt"></i>
                            <div>
                                <h5>Authenticator App</h5>
                                <p>Use Google Authenticator or Authy</p>
                            </div>
                        </div>
                        <div class="method-status">
                            ${twoFactorEnabled ? 
                                '<span class="badge active">Active</span>' : 
                                '<button class="btn-enable-method">Enable</button>'}
                        </div>
                    </div>
                </div>
                
                <div class="2fa-actions">
                    ${twoFactorEnabled ? 
                        `<button class="btn btn-danger" id="disable2faBtn">
                            <i class="fas fa-ban"></i> Disable 2FA
                        </button>
                        <button class="btn btn-outline" id="recoveryCodesBtn">
                            <i class="fas fa-key"></i> View Recovery Codes
                        </button>` :
                        `<button class="btn btn-primary" id="enable2faBtn">
                            <i class="fas fa-shield-alt"></i> Enable 2FA
                        </button>`}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    setup2FAModal(modal, twoFactorEnabled);
}

// ... [Rest of the code remains the same, just ensure all DOM queries have null checks]

// Helper Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : type === 'info' ? '#0A84FF' : '#F59E0B'};
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: alertSlideIn 0.3s ease;
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'alertSlideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Add alert animations
if (!document.querySelector('#alert-styles')) {
    const styles = document.createElement('style');
    styles.id = 'alert-styles';
    styles.textContent = `
        @keyframes alertSlideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes alertSlideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(styles);
}

