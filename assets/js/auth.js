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

// Modifiez l'URL de l'API pour pointer vers votre serveur
const API_URL = 'http://localhost:3000'; // ou votre URL de production

// Login function
async function login(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorMessage = document.getElementById('error-message');

    console.log('Tentative de connexion avec:', { email });

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include', // Important pour les cookies
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
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Erreur détaillée:', error);
        errorMessage.textContent = 'Erreur de connexion au serveur. Veuillez vérifier votre connexion internet.';
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
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
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
        errorMessage.textContent = 'Erreur de connexion au serveur. Veuillez réessayer.';
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