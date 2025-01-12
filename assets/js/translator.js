let currentLang = localStorage.getItem('selectedLanguage') || 'fr';

function translatePage() {
    // Traduire les éléments avec data-translate
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });

    // Traduire tous les titres et descriptions des cartes de service
    document.querySelectorAll('.service-card').forEach(card => {
        const title = card.querySelector('h2');
        const desc = card.querySelector('p');
        
        if (title) {
            const titleKey = title.textContent.toLowerCase().replace(/\s+/g, '_');
            if (translations[currentLang] && translations[currentLang][titleKey]) {
                title.textContent = translations[currentLang][titleKey];
            }
        }
        
        if (desc) {
            const descKey = desc.textContent.toLowerCase().replace(/\s+/g, '_').replace('...', '');
            if (translations[currentLang] && translations[currentLang][descKey + '_desc']) {
                desc.textContent = translations[currentLang][descKey + '_desc'];
            }
        }
    });
}

function changeLanguage(lang) {
    // Ajouter la classe selecting pour l'animation
    document.querySelectorAll('.language-option').forEach(option => {
        if (option.dataset.lang === lang) {
            option.classList.add('selecting');
            setTimeout(() => option.classList.remove('selecting'), 300);
        }
    });

    // Mettre à jour la classe active
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.toggle('active', option.dataset.lang === lang);
    });

    // Reste du code existant pour le changement de langue
    currentLang = lang;
    localStorage.setItem('selectedLanguage', lang);
    document.documentElement.lang = lang;
    translatePage();
}

// Ajouter la classe active à la langue actuelle au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Get the saved language or default to French
    const savedLang = localStorage.getItem('selectedLanguage') || 'fr';
    
    // Set the initial language
    currentLang = savedLang;
    document.documentElement.lang = savedLang;
    
    // Apply translations
    translatePage();
    
    // Update language selector UI
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.toggle('active', option.dataset.lang === savedLang);
    });
});

// Au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Appliquer la langue sauvegardée
    changeLanguage(currentLang);
    
    // Ajouter les écouteurs d'événements (seulement sur la page d'accueil)
    const langOptions = document.querySelectorAll('.language-option');
    if (langOptions.length > 0) {
        langOptions.forEach(option => {
            option.addEventListener('click', () => {
                changeLanguage(option.dataset.lang);
            });
        });
    }
}); 