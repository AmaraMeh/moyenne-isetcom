document.addEventListener('DOMContentLoaded', function() {
    // Only handle auth UI if the elements exist
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const token = localStorage.getItem('token');
    
    // Only update UI elements if they exist (on pages that have them)
    if (authButtons && userMenu) {
        if (token) {
            authButtons.classList.add('hidden');
            userMenu.classList.remove('hidden');
        } else {
            authButtons.classList.remove('hidden');
            userMenu.classList.add('hidden');
        }
    }

    // Only handle login/register page functionality if we're on those pages
    if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
        // Tab switching logic for login/register page
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(`${tabId}Tab`)?.classList.add('active');
            });
        });

        // Handle tab links
        document.querySelectorAll('[data-tab]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');
                document.querySelector(`.tab-btn[data-tab="${tabId}"]`)?.click();
            });
        });
    }
});

// Login function
async function login(event) {
    if (!event) return;
    event.preventDefault();
    // ... rest of login logic ...
}

// Register function
async function register(event) {
    if (!event) return;
    event.preventDefault();
    // ... rest of register logic ...
} 