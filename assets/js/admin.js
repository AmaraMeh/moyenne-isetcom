document.addEventListener('DOMContentLoaded', function() {
    // Gestion du modal d'édition
    const modal = document.getElementById('editModal');
    const editButtons = document.querySelectorAll('.edit-btn');
    const cancelButton = document.querySelector('.cancel-btn');

    // Ouvrir le modal
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.style.display = 'flex';
            // Charger les données de l'étudiant
            loadStudentData(button.dataset.studentId);
        });
    });

    // Fermer le modal
    cancelButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Gestion des compétences
    const addSkillButton = document.querySelector('.add-skill');
    const skillsContainer = document.querySelector('.skills-editor');

    addSkillButton.addEventListener('click', () => {
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        skillItem.innerHTML = `
            <input type="text" placeholder="Nom de la compétence">
            <input type="range" min="0" max="100">
            <button type="button" class="remove-skill">×</button>
        `;
        skillsContainer.insertBefore(skillItem, addSkillButton);
    });

    // Sauvegarder les modifications
    const editProfileForm = document.getElementById('editProfileForm');
    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editProfileForm);
        try {
            const response = await saveProfileData(formData);
            if (response.ok) {
                modal.style.display = 'none';
                // Rafraîchir l'affichage
                location.reload();
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
        }
    });
});

// Fonctions d'API
async function loadStudentData(studentId) {
    try {
        const response = await fetch(`/api/students/${studentId}`);
        const data = await response.json();
        // Remplir le formulaire avec les données
        populateForm(data);
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
    }
}

async function saveProfileData(formData) {
    return fetch('/api/students/update', {
        method: 'POST',
        body: formData
    });
} 