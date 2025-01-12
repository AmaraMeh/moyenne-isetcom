document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Initialiser les composants
    initializeTabs();
    loadStatistics();
    loadCourses();
    
    // Event listeners
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
});

// Initialisation des onglets
function initializeTabs() {
    const activeTab = localStorage.getItem('activeTab') || 'courses';
    switchTab(activeTab);
}

// Changer d'onglet
function switchTab(tabId) {
    // Mettre à jour les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Mettre à jour le contenu
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tabId}-tab`);
    });

    // Sauvegarder l'onglet actif
    localStorage.setItem('activeTab', tabId);

    // Charger le contenu approprié
    switch(tabId) {
        case 'courses':
            loadCourses();
            break;
        case 'surveys':
            loadSurveys();
            break;
        case 'feedback':
            loadFeedbackForm();
            break;
    }
}

// Charger les statistiques
async function loadStatistics() {
    try {
        const response = await fetch('http://localhost:5000/api/surveys/statistics', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const stats = await response.json();
        
        document.getElementById('activeSurveys').textContent = stats.active;
        document.getElementById('completedSurveys').textContent = stats.completed;
        document.getElementById('pendingSurveys').textContent = stats.pending;
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement des statistiques', 'error');
    }
}

// Charger les cours à évaluer
async function loadCourses() {
    try {
        const response = await fetch('http://localhost:5000/api/surveys/courses', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const courses = await response.json();
        
        const coursesList = document.querySelector('.courses-list');
        coursesList.innerHTML = courses.map(course => `
            <div class="course-card">
                <div class="course-header">
                    <h3 class="course-title">${course.name}</h3>
                    <span class="course-status status-${course.status}">
                        ${course.status === 'pending' ? 'À évaluer' : 'Complété'}
                    </span>
                </div>
                <div class="course-info">
                    <p class="text-gray-600">
                        <i class="fas fa-user-tie mr-2"></i>${course.professor}
                    </p>
                    <p class="text-gray-600">
                        <i class="fas fa-calendar-alt mr-2"></i>${formatDate(course.endDate)}
                    </p>
                </div>
                ${course.status === 'pending' ? `
                    <button class="primary-btn mt-4" onclick="showEvaluationForm('${course._id}')">
                        <i class="fas fa-star"></i> Évaluer
                    </button>
                ` : ''}
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement des cours', 'error');
    }
}

// Afficher le formulaire d'évaluation
function showEvaluationForm(courseId) {
    const form = document.querySelector('.evaluation-form');
    form.classList.remove('hidden');
    form.innerHTML = `
        <h3 class="text-xl font-bold mb-6">Évaluation du cours</h3>
        <form onsubmit="submitEvaluation(event, '${courseId}')">
            <div class="form-group">
                <label class="form-label">Qualité du cours</label>
                <div class="rating-group" data-rating="quality">
                    ${generateRatingButtons()}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Clarté des explications</label>
                <div class="rating-group" data-rating="clarity">
                    ${generateRatingButtons()}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Support de cours</label>
                <div class="rating-group" data-rating="materials">
                    ${generateRatingButtons()}
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Commentaires (optionnel)</label>
                <textarea class="comment-input" name="comments"></textarea>
            </div>
            <button type="submit" class="primary-btn">
                <i class="fas fa-paper-plane"></i> Soumettre l'évaluation
            </button>
        </form>
    `;

    // Ajouter les événements pour les boutons de notation
    document.querySelectorAll('.rating-btn').forEach(btn => {
        btn.addEventListener('click', handleRatingClick);
    });
}

// Gérer le clic sur un bouton de notation
function handleRatingClick(e) {
    const btn = e.currentTarget;
    const ratingGroup = btn.closest('.rating-group');
    
    // Retirer la sélection précédente
    ratingGroup.querySelectorAll('.rating-btn').forEach(b => {
        b.classList.remove('selected');
    });
    
    // Sélectionner le nouveau bouton
    btn.classList.add('selected');
}

// Soumettre l'évaluation
async function submitEvaluation(e, courseId) {
    e.preventDefault();

    // Récupérer les notes
    const ratings = {};
    document.querySelectorAll('.rating-group').forEach(group => {
        const selected = group.querySelector('.rating-btn.selected');
        ratings[group.dataset.rating] = selected ? parseInt(selected.dataset.value) : 0;
    });

    // Récupérer les commentaires
    const comments = e.target.querySelector('textarea').value;

    try {
        const response = await fetch(`http://localhost:5000/api/surveys/evaluate/${courseId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                ratings,
                comments
            })
        });

        if (response.ok) {
            showNotification('Évaluation enregistrée avec succès', 'success');
            loadCourses();
            document.querySelector('.evaluation-form').classList.add('hidden');
        } else {
            throw new Error('Erreur lors de l\'envoi de l\'évaluation');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de l\'envoi de l\'évaluation', 'error');
    }
}

// Fonctions utilitaires
function generateRatingButtons() {
    return Array.from({length: 5}, (_, i) => i + 1)
        .map(value => `
            <button type="button" class="rating-btn" data-value="${value}">
                ${value}
            </button>
        `).join('');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
} 