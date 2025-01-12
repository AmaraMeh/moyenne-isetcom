document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Initialiser les composants
    initializeFilters();
    loadAbsencesData();
    loadModules();

    // Event listeners
    document.getElementById('justificationForm').addEventListener('submit', handleJustificationSubmit);
    document.getElementById('fileInput').addEventListener('change', handleFileChange);
    document.getElementById('statusFilter').addEventListener('change', filterAbsences);
    document.getElementById('moduleFilter').addEventListener('change', filterAbsences);
});

// Charger les statistiques et la liste des absences
async function loadAbsencesData() {
    try {
        const response = await fetch('http://localhost:5000/api/absences', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        
        // Mettre à jour les statistiques
        updateStatistics(data.statistics);
        // Afficher les absences
        displayAbsences(data.absences);
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement des données', 'error');
    }
}

// Mettre à jour les statistiques
function updateStatistics(stats) {
    document.getElementById('totalAbsences').textContent = stats.total;
    document.getElementById('justifiedAbsences').textContent = stats.justified;
    document.getElementById('unjustifiedAbsences').textContent = stats.unjustified;
    document.getElementById('pendingAbsences').textContent = stats.pending;
}

// Afficher la liste des absences
function displayAbsences(absences) {
    const tbody = document.getElementById('absencesTableBody');
    tbody.innerHTML = absences.map(absence => `
        <tr>
            <td>${formatDate(absence.date)}</td>
            <td>${absence.module}</td>
            <td>${absence.type}</td>
            <td>${absence.duration}h</td>
            <td>
                <span class="status-badge status-${absence.status}">
                    ${getStatusText(absence.status)}
                </span>
            </td>
            <td>
                <button class="action-btn view" onclick="showAbsenceDetails('${absence._id}')">
                    <i class="fas fa-eye"></i>
                </button>
                ${absence.status === 'unjustified' ? `
                    <button class="action-btn justify" onclick="showJustificationForm('${absence._id}')">
                        <i class="fas fa-file-upload"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

// Gérer la soumission du formulaire de justification
async function handleJustificationSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
        const response = await fetch('http://localhost:5000/api/absences/justify', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (response.ok) {
            showNotification('Justification envoyée avec succès', 'success');
            e.target.reset();
            loadAbsencesData();
        } else {
            throw new Error('Erreur lors de l\'envoi de la justification');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de l\'envoi de la justification', 'error');
    }
}

// Afficher les détails d'une absence
async function showAbsenceDetails(absenceId) {
    try {
        const response = await fetch(`http://localhost:5000/api/absences/${absenceId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const absence = await response.json();

        const modal = document.getElementById('absenceDetailsModal');
        const modalBody = modal.querySelector('.modal-body');
        
        modalBody.innerHTML = `
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <h4 class="font-bold mb-2">Date</h4>
                    <p>${formatDate(absence.date)}</p>
                </div>
                <div>
                    <h4 class="font-bold mb-2">Module</h4>
                    <p>${absence.module}</p>
                </div>
                <div>
                    <h4 class="font-bold mb-2">Type</h4>
                    <p>${absence.type}</p>
                </div>
                <div>
                    <h4 class="font-bold mb-2">Durée</h4>
                    <p>${absence.duration}h</p>
                </div>
                ${absence.justification ? `
                    <div class="col-span-2">
                        <h4 class="font-bold mb-2">Justification</h4>
                        <p>${absence.justification.description}</p>
                        ${absence.justification.document ? `
                            <a href="${absence.justification.document}" target="_blank" class="text-blue-500 hover:text-blue-600">
                                <i class="fas fa-file-download mr-2"></i>Voir le document
                            </a>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;

        modal.classList.remove('hidden');
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement des détails', 'error');
    }
}

// Charger la liste des modules
async function loadModules() {
    try {
        const response = await fetch('http://localhost:5000/api/modules', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const modules = await response.json();

        const moduleSelects = document.querySelectorAll('select[name="module"]');
        const moduleFilter = document.getElementById('moduleFilter');

        const moduleOptions = modules.map(module => 
            `<option value="${module._id}">${module.name}</option>`
        ).join('');

        moduleSelects.forEach(select => {
            select.innerHTML += moduleOptions;
        });
        moduleFilter.innerHTML += moduleOptions;
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Filtrer les absences
function filterAbsences() {
    const statusFilter = document.getElementById('statusFilter').value;
    const moduleFilter = document.getElementById('moduleFilter').value;
    
    const rows = document.querySelectorAll('#absencesTableBody tr');
    
    rows.forEach(row => {
        const status = row.querySelector('.status-badge').classList[1].replace('status-', '');
        const module = row.cells[1].textContent;
        
        const statusMatch = !statusFilter || status === statusFilter;
        const moduleMatch = !moduleFilter || module === moduleFilter;
        
        row.style.display = statusMatch && moduleMatch ? '' : 'none';
    });
}

// Fonctions utilitaires
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function getStatusText(status) {
    const statusMap = {
        justified: 'Justifiée',
        unjustified: 'Non justifiée',
        pending: 'En attente'
    };
    return statusMap[status] || status;
}

function handleFileChange(e) {
    const fileName = e.target.files[0]?.name;
    document.getElementById('fileName').textContent = fileName || '';
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