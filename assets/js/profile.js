document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Charger les données du profil
    loadProfileData();

    // Gestionnaire pour le changement de photo
    const photoButton = document.querySelector('[data-translate="change_photo"]');
    if (photoButton) {
        photoButton.addEventListener('click', handlePhotoChange);
    }

    // Gestionnaire pour les boutons de modification
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', handleEdit);
    });
});

async function loadProfileData() {
    try {
        const response = await fetch('http://localhost:5000/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement du profil');
        }

        const data = await response.json();
        updateProfileUI(data);
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement du profil', 'error');
    }
}

function updateProfileUI(data) {
    // Informations principales
    document.getElementById('studentName').textContent = data.fullName;
    document.getElementById('studentId').textContent = data.studentId;
    document.getElementById('studentEmail').textContent = data.email;
    document.getElementById('studentLevel').textContent = data.level;

    // Informations personnelles
    document.getElementById('birthDate').textContent = data.birthDate;
    document.getElementById('address').textContent = data.address;
    document.getElementById('phone').textContent = data.phone;

    // Informations académiques
    document.getElementById('department').textContent = data.department;
    document.getElementById('speciality').textContent = data.speciality;
    document.getElementById('group').textContent = data.group;
    document.getElementById('academicYear').textContent = data.academicYear;

    // Résultats
    document.getElementById('currentSemester').textContent = data.currentSemester;
    document.getElementById('gpa').textContent = data.gpa;
    document.getElementById('credits').textContent = data.credits;

    // Photo de profil
    if (data.profilePhoto) {
        document.querySelector('.profile-image img').src = data.profilePhoto;
    }
}

function handlePhotoChange() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('photo', file);

                const response = await fetch('http://localhost:5000/api/user/profile/photo', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    document.querySelector('.profile-image img').src = data.photoUrl;
                    showNotification('Photo de profil mise à jour', 'success');
                }
            } catch (error) {
                showNotification('Erreur lors du changement de photo', 'error');
            }
        }
    };
    input.click();
}

function handleEdit(e) {
    const section = e.currentTarget.dataset.section;
    const container = e.currentTarget.closest('.glass-card');
    const fields = container.querySelectorAll('p[id]');

    fields.forEach(field => {
        const currentValue = field.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue;
        input.className = 'custom-input w-full mt-1';
        field.parentNode.replaceChild(input, field);
    });

    // Remplacer le bouton modifier par sauvegarder
    const saveButton = document.createElement('button');
    saveButton.className = 'custom-button mt-4';
    saveButton.innerHTML = '<i class="fas fa-save"></i> Sauvegarder';
    saveButton.onclick = () => saveChanges(section, container);
    
    e.currentTarget.replaceWith(saveButton);
}

async function saveChanges(section, container) {
    const inputs = container.querySelectorAll('input');
    const updates = {};

    inputs.forEach(input => {
        const fieldName = input.parentNode.querySelector('label').textContent;
        updates[fieldName] = input.value;
    });

    try {
        const response = await fetch(`http://localhost:5000/api/user/profile/${section}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updates)
        });

        if (response.ok) {
            loadProfileData(); // Recharger les données
            showNotification('Modifications enregistrées', 'success');
        }
    } catch (error) {
        showNotification('Erreur lors de la sauvegarde', 'error');
    }
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