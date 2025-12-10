
// Settings Page JavaScript
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

function loadUserData() {
    const user = JSON.parse(localStorage.getItem('fp_cryptotrade_user') || 
                           sessionStorage.getItem('fp_cryptotrade_user') || '{}');
    
    // Update profile info if available
    if (user.name) {
        const nameParts = user.name.split(' ');
        document.querySelector('.profile-info h3').textContent = user.name;
        
        if (nameParts.length >= 2) {
            document.querySelector('input[type="text"]').value = nameParts[0];
            document.querySelectorAll('input[type="text"]')[1].value = nameParts.slice(1).join(' ');
        }
    }
    
    if (user.email) {
        document.querySelector('input[type="email"]').value = user.email;
    }
}

function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.settings-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section') + '-section';
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
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
    const verifyBtn = form.querySelector('.btn-verify');
    const uploadBtn = form.querySelector('.btn-upload');
    const avatarInput = document.createElement('input');
    
    avatarInput.type = 'file';
    avatarInput.accept = 'image/*';
    avatarInput.style.display = 'none';
    document.body.appendChild(avatarInput);
    
    // Avatar upload
    uploadBtn.addEventListener('click', function() {
        avatarInput.click();
    });
    
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const avatarPreview = document.querySelector('.avatar-preview');
                avatarPreview.innerHTML = <img src="${e.target.result}" alt="Profile">;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Phone verification
    verifyBtn.addEventListener('click', function() {
        showVerificationModal();
    });
    
    // Cancel changes
    cancelBtn.addEventListener('click', function() {
        if (confirm('Discard changes?')) {
            form.reset();
            showAlert('Changes discarded', 'info');
        }
    });
    
    // Save changes
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const userData = {
            firstName: this.querySelector('input[type="text"]').value,
            lastName: this.querySelectorAll('input[type="text"]')[1].value,
            email: this.querySelector('input[type="email"]').value,
            phone: this.querySelector('input[type="tel"]').value,
            country: this.querySelector('select').value,
            updatedAt: new Date().toISOString()
        };
        
        // Save to localStorage (in production, this would be an API call)
        const currentUser = JSON.parse(localStorage.getItem('fp_cryptotrade_user') || '{}');
        const updatedUser = { ...currentUser, ...userData, name: ${userData.firstName} ${userData.lastName} };
        
        localStorage.setItem('fp_cryptotrade_user', JSON.stringify(updatedUser));
        
        showAlert('Profile updated successfully', 'success');
        
        // Update profile info display
        document.querySelector('.profile-info h3').textContent = ${userData.firstName} ${userData.lastName};
    });
}

function showVerificationModal() {
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
                    <span>+1 (555) 123-4567</span>
                </div>
                
                <div class="form-group">
                    <label>Enter Verification Code</label>
                    <div class="verification-input">
                        <input type="text" maxlength="6" placeholder="000000">
                        <button class="btn-resend" disabled>
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
                <button class="btn btn-primary modal-confirm">
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
    const confirmBtn = modal.querySelector('.modal-confirm');
    const codeInput = modal.querySelector('input[type="text"]');
    const resendBtn = modal.querySelector('.btn-resend');
    
    let countdown = 60;
    let countdownInterval;
    
    function closeModal() {
        modal.classList.remove('show');
        clearInterval(countdownInterval);
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Start countdown for resend button
    function updateResendButton() {
        if (countdown > 0) {
            resendBtn.textContent = Resend (${countdown}s);
            resendBtn.disabled = true;
            countdown--;
        } else {
            resendBtn.textContent = 'Resend Code';
            resendBtn.disabled = false;
            clearInterval(countdownInterval);
        }
    }
    
    countdownInterval = setInterval(updateResendButton, 1000);
    updateResendButton();
    
    // Resend code
    resendBtn.addEventListener('click', function() {
        if (!this.disabled) {
            // Simulate sending code
            showAlert('New verification code sent', 'info');
            
            // Reset countdown
            countdown = 60;
            updateResendButton();
            countdownInterval = setInterval(updateResendButton, 1000);
        }
    });
    
    // Verify code
    confirmBtn.addEventListener('click', function() {
        const code = codeInput.value;
        
        if (code.length !== 6) {
            showAlert('Please enter a valid 6-digit code', 'error');
            return;
        }
        
        // Simulate verification
        showAlert('Verifying code...', 'info');
        
        setTimeout(() => {
            // Mock verification
            if (code === '123456') { // Demo code
                showAlert('Phone number verified successfully', 'success');
                
                // Update status in profile
                const phoneStatus = document.querySelector('.phone-status');
                phoneStatus.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <span>Verified</span>
                `;
                phoneStatus.querySelector('i').style.color = 'var(--success)';
                
                // Remove verify button
                const verifyBtn = document.querySelector('.btn-verify');
                if (verifyBtn) verifyBtn.remove();
                
                closeModal();
            } else {
                showAlert('Invalid verification code', 'error');
            }
        }, 1500);
    });
    
    // Auto-focus code input
    codeInput.focus();
    
    // Auto-submit on 6 digits
    codeInput.addEventListener('input', function() {
        if (this.value.length === 6) {
            confirmBtn.click();
        }
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function setupSecuritySettings() {
    // 2FA Management
    document.querySelector('.btn-manage').addEventListener('click', function() {
        open2FAManagement();
    });
    
    // Change Password
    document.querySelector('.btn-change').addEventListener('click', function() {
        openChangePassword();
    });
    
    // View Login History
    document.querySelector('.btn-view').addEventListener('click', function() {
        openLoginHistory();
    });
    
    // Manage Sessions
    document.querySelectorAll('.btn-manage')[1].addEventListener('click', function() {
        openSessionManagement();
    });
    
    // Enable Withdrawal Whitelist
    document.querySelector('.btn-enable').addEventListener('click', function() {
        enableWithdrawalWhitelist();
    });
}

function open2FAManagement() {
    const modal = document.createElement('div');
    modal.className = 'modal 2fa-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Two-Factor Authentication</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="2fa-status">
                    <div class="status-indicator enabled">
                        <i class="fas fa-shield-alt"></i>
                        <span>2FA is Enabled</span>
                    </div>
                    <p>Two-factor authentication adds an extra layer of security to your account.</p>
                </div>
                
                <div class="2fa-options">
                    <h4>Authentication Methods</h4>
                    <div class="method-option active">
                        <div class="method-info">
                            <i class="fas fa-mobile-alt"></i>
                            <div>
                                <h5>Authenticator App</h5>
                                <p>Use Google Authenticator or Authy</p>
                            </div>
                        </div>
                        <div class="method-status">
                            <span class="badge active">Active</span>
                        </div>
                    </div>
                    
                    <div class="method-option">
                        <div class="method-info">
                            <i class="fas fa-sms"></i>
                            <div>
                                <h5>SMS Authentication</h5>
                                <p>Receive codes via text message</p>
                            </div>
                        </div>
                        <div class="method-status">
                            <button class="btn-enable-method">Enable</button>
                        </div>
                    </div>
                </div>
                
                <div class="2fa-actions">
                    <button class="btn btn-danger" id="disable2faBtn">
                        <i class="fas fa-ban"></i> Disable 2FA
                    </button>
                    <button class="btn btn-outline" id="recoveryCodesBtn">
                        <i class="fas fa-key"></i> View Recovery Codes
                    </button>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup 2FA modal
    setup2FAModal(modal);
}

function setup2FAModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const disableBtn = modal.querySelector('#disable2faBtn');
    const recoveryBtn = modal.querySelector('#recoveryCodesBtn');
    const enableSmsBtn = modal.querySelector('.btn-enable-method');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Disable 2FA
    disableBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to disable 2FA? This reduces your account security.')) {
            showAlert('Disabling 2FA...', 'info');
            
            setTimeout(() => {
                showAlert('2FA has been disabled', 'warning');
                
                // Update status on settings page
                const statusElement = document.querySelector('.security-item .status');
                statusElement.textContent = 'Disabled';
                statusElement.className = 'status disabled';
                
                const manageBtn = document.querySelector('.security-item .btn-manage');
                manageBtn.textContent = 'Enable';
                manageBtn.className = 'btn-enable';
                
                closeModal();
            }, 1500);
        }
    });
    
    // View recovery codes
    recoveryBtn.addEventListener('click', function() {
        openRecoveryCodes();
    });
    
    // Enable SMS authentication
    enableSmsBtn.addEventListener('click', function() {
        const methodOption = this.closest('.method-option');
        methodOption.classList.add('active');
        this.innerHTML = '<span class="badge active">Active</span>';
        this.disabled = true;
        
        showAlert('SMS authentication enabled', 'success');
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function openRecoveryCodes() {
    const modal = document.createElement('div');
    modal.className = 'modal recovery-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Recovery Codes</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="recovery-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Save these codes in a secure place. Each code can only be used once.</p>
                </div>
                
                <div class="recovery-codes">
                    <div class="code">ABC123-XYZ789</div>
                    <div class="code">DEF456-UVW012</div>
                    <div class="code">GHI789-RST345</div>
                    <div class="code">JKL012-OPQ678</div>
                    <div class="code">MNO345-LMN901</div>
                    <div class="code">PQR678-IJK234</div>
                    <div class="code">STU901-EFG567</div>
                    <div class="code">VWX234-BCD890</div>
                </div>
                
                <div class="recovery-actions">
                    <button class="btn btn-outline" id="copyCodesBtn">
                        <i class="fas fa-copy"></i> Copy Codes
                    </button>
                    <button class="btn btn-outline" id="downloadCodesBtn">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn btn-danger" id="regenerateCodesBtn">
                        <i class="fas fa-redo"></i> Regenerate
                    </button>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup recovery codes modal
    setupRecoveryModal(modal);
}

function setupRecoveryModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const copyBtn = modal.querySelector('#copyCodesBtn');
    const downloadBtn = modal.querySelector('#downloadCodesBtn');
    const regenerateBtn = modal.querySelector('#regenerateCodesBtn');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Copy codes
    copyBtn.addEventListener('click', function() {
        const codes = Array.from(modal.querySelectorAll('.code'))
            .map(el => el.textContent)
            .join('\n');
        
        navigator.clipboard.writeText(codes).then(() => {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });
    });
    
    // Download codes
    downloadBtn.addEventListener('click', function() {
        const codes = Array.from(modal.querySelectorAll('.code'))
            .map(el => el.textContent)
            .join('\n');
        
        const blob = new Blob([codes], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '2fa_recovery_codes.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showAlert('Recovery codes downloaded', 'success');
    });
    
    // Regenerate codes
    regenerateBtn.addEventListener('click', function() {
        if (confirm('Regenerate new recovery codes? Old codes will become invalid.')) {
            const codesContainer = modal.querySelector('.recovery-codes');
            codesContainer.innerHTML = '';
            
            // Generate new codes
            for (let i = 0; i < 8; i++) {
                const code = generateRecoveryCode();
                const codeEl = document.createElement('div');
                codeEl.className = 'code';
                codeEl.textContent = code;
                codesContainer.appendChild(codeEl);
            }
            
            showAlert('New recovery codes generated', 'success');
        }
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function generateRecoveryCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    code += '-';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function openChangePassword() {
    const modal = document.createElement('div');
    modal.className = 'modal password-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Change Password</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form class="password-form">
                    <div class="form-group">
                        <label>Current Password</label>
                        <input type="password" id="currentPassword" required>
                    </div>
                    
                    <div class="form-group">
                        <label>New Password</label>
                        <input type="password" id="newPassword" required>
                        <div class="password-strength">
                            <div class="strength-bar"></div>
                            <span class="strength-text">Password strength: weak</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Confirm New Password</label>
                        <input type="password" id="confirmPassword" required>
                    </div>
                    
                    <div class="password-requirements">
                        <h4>Password Requirements:</h4>
                        <ul>
                            <li>Minimum 8 characters</li>
                            <li>At least one uppercase letter</li>
                            <li>At least one lowercase letter</li>
                            <li>At least one number</li>
                            <li>At least one special character</li>
                        </ul>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-key"></i> Change Password
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup password modal
    setupPasswordModal(modal);
}

function setupPasswordModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const newPasswordInput = modal.querySelector('#newPassword');
    const confirmPasswordInput = modal.querySelector('#confirmPassword');
    const strengthBar = modal.querySelector('.strength-bar');
    const strengthText = modal.querySelector('.strength-text');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Password strength checker
    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        
        // Update strength bar
        strengthBar.style.width = ${strength.score * 25}%;
        strengthBar.style.backgroundColor = strength.color;
        strengthText.textContent = Password strength: ${strength.text};
    });
    
    // Change password
    confirmBtn.addEventListener('click', function() {
        const currentPassword = modal.querySelector('#currentPassword').value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validation
        if (!currentPassword) {
            showAlert('Please enter current password', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showAlert('New passwords do not match', 'error');
            return;
        }
        
        const strength = checkPasswordStrength(newPassword);
        if (strength.score < 3) {
            showAlert('Please choose a stronger password', 'error');
            return;
        }
        
        // Simulate password change
        showAlert('Changing password...', 'info');
        
        setTimeout(() => {
            showAlert('Password changed successfully', 'success');
            closeModal();
        }, 1500);
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function checkPasswordStrength(password) {
    let score = 0;
    let hasLower = false;
    let hasUpper = false;
    let hasNumber = false;
    let hasSpecial = false;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    for (let char of password) {
        if (char >= 'a' && char <= 'z') hasLower = true;
        else if (char >= 'A' && char <= 'Z') hasUpper = true;
        else if (char >= '0' && char <= '9') hasNumber = true;
        else hasSpecial = true;
    }
    
    if (hasLower) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    
    score = Math.min(score, 4); // Cap at 4
    
    const strength = {
        score: score,
        text: ['very weak', 'weak', 'fair', 'good', 'strong'][score],
        color: ['#ef4444', '#f59e0b', '#eab308', '#10b981', '#059669'][score]
    };
    
    return strength;
}

function openLoginHistory() {
    const modal = document.createElement('div');
    modal.className = 'modal history-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Login History</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="table-container">
                    <table class="login-history-table">
                        <thead>
                            <tr>
                                <th>Date & Time</th>
                                <th>Location</th>
                                <th>Device</th>
                                <th>IP Address</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Just now</td>
                                <td>New York, US</td>
                                <td>Chrome on Windows</td>
                                <td>192.168.1.1</td>
                                <td><span class="badge success">Successful</span></td>
                            </tr>
                            <tr>
                                <td>2 hours ago</td>
                                <td>San Francisco, US</td>
                                <td>Safari on iOS</td>
                                <td>10.0.0.1</td>
                                <td><span class="badge success">Successful</span></td>
                            </tr>
                            <tr>
                                <td>Yesterday, 14:30</td>
                                <td>London, UK</td>
                                <td>Firefox on Windows</td>
                                <td>172.16.0.1</td>
                                <td><span class="badge warning">Failed</span></td>
                            </tr>
                            <tr>
                                <td>Mar 12, 2024</td>
                                <td>Tokyo, JP</td>
                                <td>Android App</td>
                                <td>203.0.113.1</td>
                                <td><span class="badge success">Successful</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="history-actions">
                    <button class="btn btn-outline" id="exportHistoryBtn">
                        <i class="fas fa-download"></i> Export History
                    </button>
                    <button class="btn btn-danger" id="clearHistoryBtn">
                        <i class="fas fa-trash"></i> Clear History
                    </button>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup history modal
    setupHistoryModal(modal);
}

function setupHistoryModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const exportBtn = modal.querySelector('#exportHistoryBtn');
    const clearBtn = modal.querySelector('#clearHistoryBtn');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Export history
    exportBtn.addEventListener('click', function() {
        showAlert('Exporting login history...', 'info');
        
        setTimeout(() => {
            showAlert('Login history exported successfully', 'success');
        }, 1500);
    });
    
    // Clear history
    clearBtn.addEventListener('click', function() {
        if (confirm('Clear all login history? This action cannot be undone.')) {
            showAlert('Clearing login history...', 'info');
            
            setTimeout(() => {
                showAlert('Login history cleared', 'success');
                closeModal();
            }, 1500);
        }
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function openSessionManagement() {
    const modal = document.createElement('div');
    modal.className = 'modal sessions-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Active Sessions</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="sessions-list">
                    <div class="session-item current">
                        <div class="session-info">
                            <div class="session-icon">
                                <i class="fas fa-desktop"></i>
                            </div>
                            <div class="session-details">
                                <h4>Windows Desktop</h4>
                                <p>Chrome • New York, US</p>
                                <small>Currently active • IP: 192.168.1.1</small>
                            </div>
                        </div>
                        <span class="badge primary">Current</span>
                    </div>
                    
                    <div class="session-item">
                        <div class="session-info">
                            <div class="session-icon">
                                <i class="fas fa-mobile-alt"></i>
                            </div>
                            <div class="session-details">
                                <h4>iPhone 13</h4>
                                <p>Safari • San Francisco, US</p>
                                <small>Active 2 hours ago</small>
                            </div>
                        </div>
                        <button class="btn-logout-session">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                    
                    <div class="session-item">
                        <div class="session-info">
                            <div class="session-icon">
                                <i class="fas fa-tablet-alt"></i>
                            </div>
                            <div class="session-details">
                                <h4>iPad Pro</h4>
                                <p>Chrome • London, UK</p>
                                <small>Active yesterday</small>
                            </div>
                        </div>
                        <button class="btn-logout-session">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
                
                <div class="sessions-actions">
                    <button class="btn btn-danger" id="logoutAllBtn">
                        <i class="fas fa-sign-out-alt"></i> Logout All Other Sessions
                    </button>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup sessions modal
    setupSessionsModal(modal);
}

function setupSessionsModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const logoutButtons = modal.querySelectorAll('.btn-logout-session');
    const logoutAllBtn = modal.querySelector('#logoutAllBtn');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Logout individual session
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const sessionItem = this.closest('.session-item');
            const deviceName = sessionItem.querySelector('h4').textContent;
            
            if (confirm(Logout from ${deviceName}?)) {
                sessionItem.style.opacity = '0.5';
                this.disabled = true;
                showAlert(Logged out from ${deviceName}, 'success');
            }
        });
    });
    
    // Logout all other sessions
    logoutAllBtn.addEventListener('click', function() {
        if (confirm('Logout from all other devices? You will stay logged in on this device.')) {
            const otherSessions = modal.querySelectorAll('.session-item:not(.current)');
            
            otherSessions.forEach(session => {
                session.style.opacity = '0.5';
                const logoutBtn = session.querySelector('.btn-logout-session');
                if (logoutBtn) logoutBtn.disabled = true;
            });
            
            showAlert('Logged out from all other sessions', 'success');
        }
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function enableWithdrawalWhitelist() {
    const modal = document.createElement('div');
    modal.className = 'modal whitelist-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Withdrawal Whitelist</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="whitelist-info">
                    <div class="info-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <p>Withdrawal whitelist adds an extra layer of security by allowing withdrawals only to pre-approved addresses.</p>
                </div>
                
                <div class="form-group">
                    <label>Add Whitelist Address</label>
                    <input type="text" placeholder="Enter crypto address" id="whitelistAddress">
                </div>
                
                <div class="form-group">
                    <label>Confirm Address</label>
                    <input type="text" placeholder="Re-enter address" id="confirmAddress">
                </div>
                
                <div class="form-group">
                    <label>Nickname (Optional)</label>
                    <input type="text" placeholder="e.g., My Ledger Wallet" id="addressNickname">
                </div>
                
                <div class="whitelist-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Once enabled, withdrawals can only be made to addresses on this whitelist. Changes to the whitelist require 24-hour security cooldown.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-check"></i> Enable Whitelist
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup whitelist modal
    setupWhitelistModal(modal);
}

function setupWhitelistModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const addressInput = modal.querySelector('#whitelistAddress');
    const confirmInput = modal.querySelector('#confirmAddress');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Enable whitelist
    confirmBtn.addEventListener('click', function() {
        const address = addressInput.value.trim();
        const confirmAddress = confirmInput.value.trim();
        const nickname = modal.querySelector('#addressNickname').value.trim();
        
        if (!address || !confirmAddress) {
            showAlert('Please enter and confirm the address', 'error');
            return;
        }
        
        if (address !== confirmAddress) {
            showAlert('Addresses do not match', 'error');
            return;
        }
        
        if (!isValidCryptoAddress(address)) {
            showAlert('Please enter a valid crypto address', 'error');
            return;
        }
        
        showAlert('Enabling withdrawal whitelist...', 'info');
        
        setTimeout(() => {
            // Update status on settings page
            const statusElement = document.querySelector('.security-item .status');
            statusElement.textContent = 'Enabled';
            statusElement.className = 'status enabled';
            
            const enableBtn = document.querySelector('.security-item .btn-enable');
            enableBtn.textContent = 'Manage';
            enableBtn.className = 'btn-manage';
            
            showAlert('Withdrawal whitelist enabled successfully', 'success');
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

function isValidCryptoAddress(address) {
    // Basic validation for crypto addresses
    return address.length >= 26 && address.length <= 42;
}

function setupNotificationToggles() {
    const switches = document.querySelectorAll('.switch input[type="checkbox"]');
    
    switches.forEach(switchEl => {
        // Load saved state
        const switchId = switchEl.id;
        const savedState = localStorage.getItem(notification_${switchId});
        
        if (savedState !== null) {
            switchEl.checked = savedState === 'true';
        }
        
        // Save state on change
        switchEl.addEventListener('change', function() {
            localStorage.setItem(notification_${this.id}, this.checked);
            showAlert('Notification settings updated', 'success');
        });
    });
}

function setupTradingPreferences() {
    const leverageSlider = document.querySelector('#leverageSlider');
    const leverageValue = document.querySelector('#leverageValue');
    
    if (leverageSlider && leverageValue) {
        // Load saved leverage
        const savedLeverage = localStorage.getItem('trading_leverage') || '10';
        leverageSlider.value = savedLeverage;
        leverageValue.textContent = ${savedLeverage}x;
        
        // Update on change
        leverageSlider.addEventListener('input', function() {
            leverageValue.textContent = ${this.value}x;
        });
        
        // Save on change end
        leverageSlider.addEventListener('change', function() {
            localStorage.setItem('trading_leverage', this.value);
            showAlert('Trading preferences updated', 'success');
        });
    }
    
    // Setup other trading preference switches
    const tradingSwitches = document.querySelectorAll('.toggle-group input[type="checkbox"]');
    
    tradingSwitches.forEach(switchEl => {
        const switchId = switchEl.id;
        const savedState = localStorage.getItem(trading_${switchId});
        
        if (savedState !== null) {
            switchEl.checked = savedState === 'true';
        }
        
        switchEl.addEventListener('change', function() {
            localStorage.setItem(trading_${this.id}, this.checked);
            showAlert('Trading preferences updated', 'success');
        });
    });
}

function setupApiKeys() {
    // Load API keys
    loadApiKeys();
    
    // Setup create key button
    const createKeyBtn = document.querySelector('.btn-primary');
    if (createKeyBtn) {
        createKeyBtn.addEventListener('click', function() {
            openCreateApiKeyModal();
        });
    }
    
    // Setup key action buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-action.view')) {
            const keyId = e.target.closest('.api-key-item').dataset.keyId;
            viewApiKey(keyId);
        } else if (e.target.closest('.btn-action.edit')) {
            const keyId = e.target.closest('.api-key-item').dataset.keyId;
            editApiKey(keyId);
        } else if (e.target.closest('.btn-action.delete')) {
            const keyId = e.target.closest('.api-key-item').dataset.keyId;
            deleteApiKey(keyId);
        }
    });
}

function loadApiKeys() {
    const apiKeys = JSON.parse(localStorage.getItem('fp_cryptotrade_api_keys') || '[]');
    const apiKeysList = document.querySelector('.api-keys-list');
    
    if (!apiKeysList) return;
    
    if (apiKeys.length === 0) {
        apiKeysList.innerHTML = `
            <div class="no-keys">
                <i class="fas fa-key"></i>
                <h3>No API Keys</h3>
                <p>Create your first API key to start trading programmatically</p>
            </div>
        `;
        return;
    }
    
    let keysHTML = '';
    
    apiKeys.forEach((key, index) => {
        keysHTML += `
            <div class="api-key-item" data-key-id="${key.id}">
                <div class="api-key-info">
                    <h3>${key.name}</h3>
                    <div class="key-details">
                        <span class="key-preview">${key.preview}</span>
                        <span class="key-date">Created ${formatDate(key.createdAt)}</span>
                    </div>
                    <div class="key-permissions">
                        ${key.permissions.map(perm => <span class="permission">${perm}</span>).join('')}
                    </div>
                </div>
                <div class="api-key-actions">
                    <button class="btn-action view" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action edit" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    apiKeysList.innerHTML = keysHTML;
}

function openCreateApiKeyModal() {
    const modal = document.createElement('div');
    modal.className = 'modal apikey-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Create New API Key</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form class="apikey-form">
                    <div class="form-group">
                        <label>Key Name</label>
                        <input type="text" placeholder="e.g., Trading Bot" id="keyName" required>
                        <small>Give your key a descriptive name</small>
                    </div>
                    
                    <div class="form-group">
                        <label>Permissions</label>
                        <div class="permissions-grid">
                            <label class="permission-option">
                                <input type="checkbox" name="permissions" value="read" checked disabled>
                                <span class="permission-label">
                                    <i class="fas fa-eye"></i>
                                    <span>Read</span>
                                </span>
                            </label>
                            
                            <label class="permission-option">
                                <input type="checkbox" name="permissions" value="trade">
                                <span class="permission-label">
                                    <i class="fas fa-exchange-alt"></i>
                                    <span>Trade</span>
                                </span>
                            </label>
                            
                            <label class="permission-option">
                                <input type="checkbox" name="permissions" value="withdraw">
                                <span class="permission-label">
                                    <i class="fas fa-wallet"></i>
                                    <span>Withdraw</span>
                                </span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>IP Restrictions (Optional)</label>
                        <input type="text" placeholder="192.168.1.1, 10.0.0.1" id="ipRestrictions">
                        <small>Comma-separated IP addresses</small>
                    </div>
                    
                    <div class="api-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Keep your API keys secure. Never share them or commit them to version control.</p>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-cancel">Cancel</button>
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-key"></i> Create API Key
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup API key modal
    setupApiKeyModal(modal);
}

function setupApiKeyModal(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const keyNameInput = modal.querySelector('#keyName');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Create API key
    confirmBtn.addEventListener('click', function() {
        const keyName = keyNameInput.value.trim();
        const permissions = Array.from(modal.querySelectorAll('input[name="permissions"]:checked'))
            .map(input => input.value);
        const ipRestrictions = modal.querySelector('#ipRestrictions').value.trim();
        
        if (!keyName) {
            showAlert('Please enter a key name', 'error');
            return;
        }
        
        if (permissions.length === 0) {
            showAlert('Please select at least one permission', 'error');
            return;
        }
        
        showAlert('Creating API key...', 'info');
        
        // Generate API key
        setTimeout(() => {
            const apiKey = generateApiKey();
            const apiSecret = generateApiSecret();
            
            // Save to localStorage
            const apiKeys = JSON.parse(localStorage.getItem('fp_cryptotrade_api_keys') || '[]');
            const newKey = {
                id: Date.now().toString(),
                name: keyName,
                key: apiKey,
                preview: apiKey.substring(0, 8) + '...' + apiKey.substring(apiKey.length - 8),
                permissions: permissions,
                ipRestrictions: ipRestrictions ? ipRestrictions.split(',').map(ip => ip.trim()) : [],
                createdAt: new Date().toISOString(),
                lastUsed: null
            };
            
            apiKeys.push(newKey);
            localStorage.setItem('fp_cryptotrade_api_keys', JSON.stringify(apiKeys));
            
            // Show key creation success modal
            closeModal();
            showApiKeySuccess(apiKey, apiSecret, newKey.id);
        }, 1500);
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'FPCRYPTO_';
    for (let i = 0; i < 32; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

function generateApiSecret() {
    return Array.from(crypto.getRandomValues(new Uint8Array(64)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function showApiKeySuccess(apiKey, apiSecret, keyId) {
    const modal = document.createElement('div');
    modal.className = 'modal apikey-success-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>API Key Created</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <p>Your API key has been created successfully. Copy these credentials now - they won't be shown again.</p>
                </div>
                
                <div class="api-credentials">
                    <div class="credential">
                        <label>API Key</label>
                        <div class="credential-value">
                            <code>${apiKey}</code>
                            <button class="btn-copy" data-value="${apiKey}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="credential">
                        <label>Secret Key</label>
                        <div class="credential-value">
                            <code>${apiSecret}</code>
                            <button class="btn-copy" data-value="${apiSecret}">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="api-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p><strong>Important:</strong> Store these credentials securely. You won't be able to see the secret key again.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary modal-confirm">
                    <i class="fas fa-check"></i> I've Saved My Keys
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup success modal
    setupApiKeySuccessModal(modal, keyId);
}

function setupApiKeySuccessModal(modal, keyId) {
    const closeBtn = modal.querySelector('.modal-close');
    const confirmBtn = modal.querySelector('.modal-confirm');
    const copyButtons = modal.querySelectorAll('.btn-copy');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            
            // Reload API keys list
            loadApiKeys();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    confirmBtn.addEventListener('click', closeModal);
    
    // Copy buttons
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            
            navigator.clipboard.writeText(value).then(() => {
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                
                setTimeout(() => {
                    this.innerHTML = originalIcon;
                }, 2000);
            });
        });
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function viewApiKey(keyId) {
    const apiKeys = JSON.parse(localStorage.getItem('fp_cryptotrade_api_keys') || '[]');
    const key = apiKeys.find(k => k.id === keyId);
    
    if (!key) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal view-apikey-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>API Key Details</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="key-details-grid">
                    <div class="detail">
                        <label>Key Name</label>
                        <span class="value">${key.name}</span>
                    </div>
                    
                    <div class="detail">
                        <label>Created</label>
                        <span class="value">${formatDate(key.createdAt)}</span>
                    </div>
                    
                    <div class="detail">
                        <label>Last Used</label>
                        <span class="value">${key.lastUsed ? formatDate(key.lastUsed) : 'Never'}</span>
                    </div>
                    
                    <div class="detail">
                        <label>Permissions</label>
                        <div class="permissions">
                            ${key.permissions.map(perm => <span class="permission">${perm}</span>).join('')}
                        </div>
                    </div>
                    
                    <div class="detail">
                        <label>IP Restrictions</label>
                        <span class="value">${key.ipRestrictions.length > 0 ? key.ipRestrictions.join(', ') : 'None'}</span>
                    </div>
                    
                    <div class="detail">
                        <label>API Key Preview</label>
                        <div class="key-preview">
                            <code>${key.preview}</code>
                        </div>
                    </div>
                </div>
                
                <div class="api-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>For security reasons, the full API key cannot be displayed. To view the full key, you need to regenerate it.</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-danger" id="regenerateKeyBtn">
                    <i class="fas fa-redo"></i> Regenerate Key
                </button>
                <button class="btn btn-outline modal-cancel">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Setup view modal
    setupViewApiKeyModal(modal, keyId);
}

function setupViewApiKeyModal(modal, keyId) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.modal-cancel');
    const regenerateBtn = modal.querySelector('#regenerateKeyBtn');
    
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Regenerate key
    regenerateBtn.addEventListener('click', function() {
        if (confirm('Regenerate this API key? The old key will become invalid immediately.')) {
            showAlert('Regenerating API key...', 'info');
            closeModal();
            
            setTimeout(() => {
                // Update key in localStorage
                const apiKeys = JSON.parse(localStorage.getItem('fp_cryptotrade_api_keys') || '[]');
                const keyIndex = apiKeys.findIndex(k => k.id === keyId);
                
                if (keyIndex !== -1) {
                    const newKey = generateApiKey();
                    apiKeys[keyIndex].key = newKey;
                    apiKeys[keyIndex].preview = newKey.substring(0, 8) + '...' + newKey.substring(newKey.length - 8);
                    apiKeys[keyIndex].createdAt = new Date().toISOString();
                    
                    localStorage.setItem('fp_cryptotrade_api_keys', JSON.stringify(apiKeys));
                    
                    // Show new key
                    showApiKeySuccess(newKey, generateApiSecret(), keyId);
                }
            }, 1500);
        }
    });
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function editApiKey(keyId) {
    showAlert('Edit functionality coming soon', 'info');
}

function deleteApiKey(keyId) {
    if (confirm('Delete this API key? Any applications using this key will stop working.')) {
        showAlert('Deleting API key...', 'info');
        
        setTimeout(() => {
            const apiKeys = JSON.parse(localStorage.getItem('fp_cryptotrade_api_keys') || '[]');
            const updatedKeys = apiKeys.filter(k => k.id !== keyId);
            
            localStorage.setItem('fp_cryptotrade_api_keys', JSON.stringify(updatedKeys));
            loadApiKeys();
            
            showAlert('API key deleted successfully', 'success');
        }, 1500);
    }
}

function setupLogoutButton() {
    const logoutBtn = document.querySelector('.btn-logout');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to log out?')) {
                // Clear auth tokens
                localStorage.removeItem('fp_cryptotrade_token');
                sessionStorage.removeItem('fp_cryptotrade_token');
                
                // Redirect to login
                window.location.href = 'login.html';
            }
        });
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return ${diffMins} minute${diffMins > 1 ? 's' : ''} ago;
    if (diffHours < 24) return ${diffHours} hour${diffHours > 1 ? 's' : ''} ago;
    if (diffDays < 7) return ${diffDays} day${diffDays > 1 ? 's' : ''} ago;
    
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function showAlert(message, type = 'success') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert
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
    
    // Add styles
    const style = document.createElement('style');
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
        }
        
        .alert-success { border-color: var(--success); }
        .alert-error { border-color: var(--danger); }
        .alert-warning { border-color: var(--warning); }
        .alert-info { border-color: var(--primary); }
        
        .alert-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .alert i {
            font-size: 1.2rem;
        }
        
        .alert-success i { color: var(--success); }
        .alert-error i { color: var(--danger); }
        .alert-warning i { color: var(--warning); }
        .alert-info i { color: var(--primary); }
        
        .alert-close {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            color: var(--gray);
            cursor: pointer;
            font-size: 1.2rem;
            padding: 4px;
            line-height: 1;
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
    
    document.body.appendChild(alert);
    
    // Close button