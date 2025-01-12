document.addEventListener('DOMContentLoaded', function() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const userName = document.getElementById('userName');

    // Vérifier si l'utilisateur est connecté
    function checkAuth() {
        const token = localStorage.getItem('token');
        if (token) {
            // Utilisateur connecté
            authButtons.classList.add('hidden');
            userMenu.classList.remove('hidden');
            
            // Charger les informations de l'utilisateur
            fetchUserInfo();
        } else {
            // Utilisateur non connecté
            authButtons.classList.remove('hidden');
            userMenu.classList.add('hidden');
        }
    }

    // Charger les informations de l'utilisateur
    async function fetchUserInfo() {
        try {
            const response = await fetch('http://localhost:5000/api/user/info', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                userName.textContent = data.fullName;
                if (data.profilePhoto) {
                    document.querySelector('.profile-link img').src = data.profilePhoto;
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des informations utilisateur:', error);
        }
    }

    // Gérer la déconnexion
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            checkAuth();
            window.location.href = 'index.html';
        });
    }

    // Vérifier l'authentification au chargement
    checkAuth();
}); 