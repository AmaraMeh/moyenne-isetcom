document.addEventListener('DOMContentLoaded', function() {
    // Gestion des onglets
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Retirer la classe active de tous les onglets
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Ajouter la classe active à l'onglet sélectionné
            btn.classList.add('active');
            document.querySelector(`#${btn.dataset.tab}Form`).classList.add('active');
        });
    });

    // Gestion des formulaires
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch('https://moyenne-isetcom.onrender.com/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    // Stocker le token
                    localStorage.setItem('token', result.token);
                    // Rediriger vers la page d'accueil
                    window.location.href = 'index.html';
                } else {
                    showError(result.message);
                }
            } catch (error) {
                showError('Erreur de connexion au serveur');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(signupForm);
            const data = {
                fullName: formData.get('fullName'),
                email: formData.get('email'),
                studentId: formData.get('studentId'),
                password: formData.get('password')
            };

            try {
                const response = await fetch('https://moyenne-isetcom.onrender.com/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                    // Basculer vers l'onglet de connexion
                    document.querySelector('[data-tab="login"]').click();
                } else {
                    showError(result.message);
                }
            } catch (error) {
                showError('Erreur de connexion au serveur');
            }
        });
    }
});

// Fonctions utilitaires
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    insertMessage(errorDiv);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    insertMessage(successDiv);
}

function insertMessage(messageDiv) {
    const form = document.querySelector('.tab-content.active');
    const existingMessage = form.querySelector('.error-message, .success-message');
    
    if (existingMessage) {
        existingMessage.remove();
    }
    
    form.insertBefore(messageDiv, form.firstChild);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Fonction d'inscription
async function register(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('https://moyenne-isetcom.onrender.com/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fullName,
                email,
                studentId,
                password
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Stocker le token
            localStorage.setItem('token', data.token);
            // Rediriger vers le dashboard
            window.location.href = '/dashboard.html';
        } else {
            // Afficher l'erreur
            showError(data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur de connexion au serveur');
    }
}

// Fonction de connexion
async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`https://moyenne-isetcom.onrender.com/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Stocker le token
            localStorage.setItem('token', data.token);
            // Rediriger vers le dashboard
            window.location.href = '/dashboard.html';
        } else {
            // Afficher l'erreur
            showError(data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
        showError('Erreur de connexion au serveur');
    }
}

// Fonction pour afficher les erreurs
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

// Ajouter les écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', register);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
}); 