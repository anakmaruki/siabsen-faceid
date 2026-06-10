// ============================================
// AUTHENTICATION MODULE
// ============================================

/**
 * Check if user is logged in
 */
function isUserLoggedIn() {
    const session = localStorage.getItem('user_session');
    return session !== null && session !== undefined;
}

/**
 * Get current logged in user
 */
function getCurrentUser() {
    if (!isUserLoggedIn()) return null;
    
    return {
        username: localStorage.getItem('username'),
        role: localStorage.getItem('role'),
        name: localStorage.getItem('name')
    };
}

/**
 * Redirect jika tidak login
 */
function requireLogin() {
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html';
    }
}

/**
 * Redirect berdasarkan role
 */
function requireRole(allowedRoles) {
    if (!isUserLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    
    const user = getCurrentUser();
    if (!allowedRoles.includes(user.role)) {
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

/**
 * Logout
 */
function logout() {
    localStorage.removeItem('user_session');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('remember_me');
    window.location.href = 'index.html';
}

/**
 * Setup user display
 */
function setupUserDisplay() {
    const user = getCurrentUser();
    if (user) {
        // Update user info di navbar/sidebar
        const userNameElement = document.getElementById('userName');
        const userRoleElement = document.getElementById('userRole');
        
        if (userNameElement) userNameElement.textContent = user.name;
        if (userRoleElement) userRoleElement.textContent = capitalize(user.role);
    }
}

/**
 * Setup logout button
 */
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Apakah Anda yakin ingin logout?')) {
                logout();
            }
        });
    }
}

/**
 * Initialize authentication on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    setupUserDisplay();
    setupLogoutButton();
});
