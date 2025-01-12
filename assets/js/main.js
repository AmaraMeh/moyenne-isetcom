'use strict';

let annee, specialite, semestre;

function calculateMatiereAverage(modules, matiereModules) {
    let sommeNotes = 0;
    let sommeCoeff = 0;
    let moduleMarks = [];
    
    modules.forEach((module, index) => {
        const moduleId = matiereModules[index];
        
        // Get input values
        const tdInput = document.getElementById(`${moduleId}_TD`);
        const tpInput = document.getElementById(`${moduleId}_TP`);
        const exInput = document.getElementById(`${moduleId}_EX`);

        // Parse values with default of 0 for TD and TP
        const noteTD = tdInput ? parseFloat(tdInput.value) || 0 : 0;
        const noteTP = tpInput ? parseFloat(tpInput.value) || 0 : 0;
        const noteExamen = parseFloat(exInput.value) || 0;

        let note = 0;

        // Calculate based on module type
        if (module.module.includes("TD") && !module.module.includes("TP")) {
            note = (noteTD * 2 + noteExamen * 3) / 5;
        } else if (module.module.includes("TP") && !module.module.includes("TD")) {
            note = (noteTP * 2 + noteExamen * 3) / 5;
        } else if (module.module.includes("TD") && module.module.includes("TP")) {
            note = ((noteTD + noteTP) + noteExamen * 3) / 5;
        } else {
            note = noteExamen;
        }

        // Store module mark for display
        moduleMarks.push({
            name: module.matiere,
            mark: note.toFixed(2),
            coefficient: module.coefficient
        });

        sommeNotes += note * module.coefficient;
        sommeCoeff += module.coefficient;
    });

    return {
        moyenne: sommeCoeff > 0 ? sommeNotes / sommeCoeff : 0,
        moduleMarks: moduleMarks
    };
}

function groupModulesByMatiere(modules) {
    const matiereGroups = {};
    modules.forEach(module => {
        if (!matiereGroups[module.matiere]) {
            matiereGroups[module.matiere] = { modules: [], totalCredits: 0 };
        }
        matiereGroups[module.matiere].modules.push(module);
        matiereGroups[module.matiere].totalCredits += module.credits;
    });
    return matiereGroups;
}

function updateSpecialities() {
    const currentLang = localStorage.getItem('preferred-language') || 'fr';
    const anneeSelect = document.getElementById('anneeSelect');
    const specialiteSelect = document.getElementById('specialiteSelect');
    
    specialiteSelect.innerHTML = `<option value="" data-translate="select_option">${translations[currentLang]['select_option']}</option>`;
    
    if (anneeSelect.value && isetComData[anneeSelect.value]) {
        const specialities = Object.keys(isetComData[anneeSelect.value]);
        specialities.forEach(s => {
            specialiteSelect.innerHTML += `<option value="${s}">${s}</option>`;
        });
    }
    updateSemesters();
}

function updateSemesters() {
    const currentLang = localStorage.getItem('preferred-language') || 'fr';
    const anneeSelect = document.getElementById('anneeSelect');
    const specialiteSelect = document.getElementById('specialiteSelect');
    const semestreSelect = document.getElementById('semestreSelect');
    
    semestreSelect.innerHTML = `<option value="" data-translate="select_option">${translations[currentLang]['select_option']}</option>`;
    
    if (anneeSelect.value && specialiteSelect.value && 
        isetComData[anneeSelect.value] && 
        isetComData[anneeSelect.value][specialiteSelect.value]) {
        const semestres = Object.keys(isetComData[anneeSelect.value][specialiteSelect.value]);
        semestres.forEach(s => {
            semestreSelect.innerHTML += `<option value="${s}">${s}</option>`;
        });
    }
    updateModules();
}

function updateModules() {
    const currentLang = localStorage.getItem('preferred-language') || 'fr';
    const anneeSelect = document.getElementById('anneeSelect');
    const specialiteSelect = document.getElementById('specialiteSelect');
    const semestreSelect = document.getElementById('semestreSelect');
    const modulesDiv = document.getElementById('modulesContainer');
    
    modulesDiv.innerHTML = '';
    
    if (!anneeSelect.value || !specialiteSelect.value || !semestreSelect.value) return;

    const modules = isetComData[anneeSelect.value][specialiteSelect.value][semestreSelect.value];
    
    modules.forEach(module => {
        const moduleId = `${anneeSelect.value}_${specialiteSelect.value}_${semestreSelect.value}_${module.matiere.replace(/\s+/g, "")}_${module.module.replace(/\s+/g, "")}`;
        
        const hasTD = module.module.includes("TD");
        const hasTP = module.module.includes("TP");
        const hasExam = true;

        let html = `
            <div class="mb-6 p-4 border rounded glass-card">
                <h3 class="font-bold mb-2">${module.matiere}</h3>
                <p class="text-sm text-gray-600 mb-3">${translations[currentLang]['module_name']}: ${module.module} | Coefficient: ${module.coefficient}</p>
                <div class="grid grid-cols-1 md:grid-cols-${hasTD + hasTP + hasExam} gap-4">
        `;

        if (hasTD) {
            html += `
                <div>
                    <label class="block text-sm font-medium mb-1" data-translate="td_mark">${translations[currentLang]['td_mark']}</label>
                    <input type="number" min="0" max="20" step="0.01" id="${moduleId}_TD" 
                           class="custom-input w-full" placeholder="${translations[currentLang]['td_mark']}">
                </div>
            `;
        }

        if (hasTP) {
            html += `
                <div>
                    <label class="block text-sm font-medium mb-1" data-translate="tp_mark">${translations[currentLang]['tp_mark']}</label>
                    <input type="number" min="0" max="20" step="0.01" id="${moduleId}_TP" 
                           class="custom-input w-full" placeholder="${translations[currentLang]['tp_mark']}">
                </div>
            `;
        }

        html += `
                <div>
                    <label class="block text-sm font-medium mb-1" data-translate="exam_mark">${translations[currentLang]['exam_mark']}</label>
                    <input type="number" min="0" max="20" step="0.01" id="${moduleId}_EX" 
                           class="custom-input w-full" placeholder="${translations[currentLang]['exam_mark']}">
                </div>
            </div>
        </div>
        `;

        modulesDiv.innerHTML += html;
    });
}

function toRoman(num) {
    const lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let roman = '';
    for (let i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}

function calculerMoyenne() {
    const currentLang = localStorage.getItem('preferred-language') || 'fr';
    const annee = document.getElementById('anneeSelect').value;
    const specialite = document.getElementById('specialiteSelect').value;
    const semestre = document.getElementById('semestreSelect').value;

    if (!annee || !specialite || !semestre) {
        alert(translations[currentLang]['result_error']);
        return;
    }

    const modules = isetComData[annee][specialite][semestre];
    const matiereModules = modules.map(module => {
        return `${annee}_${specialite}_${semestre}_${module.matiere.replace(/\s+/g, "")}_${module.module.replace(/\s+/g, "")}`;
    });

    const result = calculateMatiereAverage(modules, matiereModules);
    const resultat = document.getElementById('resultat');
    
    let detailedResults = '<div class="mt-4">';
    detailedResults += `<h3 class="font-bold mb-2">${translations[currentLang]['module_name']}:</h3>`;
    result.moduleMarks.forEach(module => {
        detailedResults += `<div class="mb-1">${module.name} (Coef: ${module.coefficient}): ${module.mark}/20</div>`;
    });
    detailedResults += `<div class="mt-4 font-bold">${translations[currentLang]['result_success']}: ${result.moyenne.toFixed(2)}/20</div>`;
    detailedResults += '</div>';

    resultat.innerHTML = detailedResults;
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialisation du sélecteur de langue
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        const savedLang = localStorage.getItem('preferred-language') || 'fr';
        langSelect.value = savedLang;
        changeLanguage(savedLang);
        
        langSelect.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
            updateSpecialities();
        });
    }

    // Ajout des écouteurs d'événements pour les sélecteurs
    const anneeSelect = document.getElementById('anneeSelect');
    const specialiteSelect = document.getElementById('specialiteSelect');
    const semestreSelect = document.getElementById('semestreSelect');

    if (anneeSelect) {
        anneeSelect.addEventListener('change', updateSpecialities);
    }
    if (specialiteSelect) {
        specialiteSelect.addEventListener('change', updateSemesters);
    }
    if (semestreSelect) {
        semestreSelect.addEventListener('change', updateModules);
    }

    // Language selection functionality
    const languageOptions = document.querySelectorAll('.language-option');
    const currentLang = localStorage.getItem('preferred-language') || 'fr';

    // Set active language
    languageOptions.forEach(option => {
        if (option.dataset.lang === currentLang) {
            option.classList.add('active');
        }

        option.addEventListener('click', () => {
            // Remove active class from all options
            languageOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
            // Change language
            changeLanguage(option.dataset.lang);
            updateSpecialities();
        });
    });

    // Mobile detection and handling
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.language-sidebar');
        const trigger = document.querySelector('.language-sidebar-trigger');
        
        trigger.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
});