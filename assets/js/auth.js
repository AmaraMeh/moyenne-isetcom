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
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorMessage = document.getElementById('error-message');

    try {
        const response = await fetch('api/auth/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        });

        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = 'Email ou mot de passe incorrect';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Erreur de connexion';
        errorMessage.style.display = 'block';
    }
}

// Register function
async function register(event) {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const studentId = document.getElementById('studentId').value;
    const errorMessage = document.getElementById('register-error-message');

    try {
        const response = await fetch('api/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `fullName=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&studentId=${encodeURIComponent(studentId)}`
        });

        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = data.error || 'Erreur d\'inscription';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Erreur de connexion';
        errorMessage.style.display = 'block';
    }
} 