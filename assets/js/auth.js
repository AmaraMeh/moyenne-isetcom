document.addEventListener('DOMContentLoaded', function() {
    // Only handle auth UI if the elements exist
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    // Only update UI elements if they exist (on pages that have them)
    if (authButtons && userMenu) {
        // Remove automatic login check, let user choose to login
        authButtons.classList.remove('hidden');
        userMenu.classList.add('hidden');

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
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = data.message || 'Email ou mot de passe incorrect';
            errorMessage.style.display = 'block';
            // Clear password field for security
            document.getElementById('loginPassword').value = '';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Erreur de connexion au serveur';
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
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                email,
                password,
                studentId
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            errorMessage.textContent = data.message || 'Erreur d\'inscription';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'Erreur de connexion';
        errorMessage.style.display = 'block';
    }
}

// Add this new function to verify token validity
async function verifyToken(token) {
    try {
        const response = await fetch('/api/auth/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Token verification error:', error);
        return false;
    }
}

// Add logout function if not already present
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
} 