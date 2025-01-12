// Note: isetComData is already defined in data.js, so we don't need to define it here

function updateSpecialities() {
    const anneeSelect = document.getElementById('anneeSelect');
    const specialiteSelect = document.getElementById('specialiteSelect');
    const annee = anneeSelect.value;
    
    console.log('Selected year:', annee); // Debug log
    console.log('Available data:', isetComData); // Debug log
    
    // Clear previous options
    specialiteSelect.innerHTML = '<option value="">--Sélectionnez--</option>';
    
    if (isetComData[annee]) {
        const specialities = Object.keys(isetComData[annee]);
        console.log('Available specialities:', specialities); // Debug log
        
        specialities.forEach(specialite => {
            specialiteSelect.innerHTML += `
                <option value="${specialite}">${specialite}</option>
            `;
        });
    }
}

function updateSemesters() {
    const anneeSelect = document.getElementById('anneeSelect');
    const specialiteSelect = document.getElementById('specialiteSelect');
    const semestreSelect = document.getElementById('semestreSelect');
    
    const annee = anneeSelect.value;
    const specialite = specialiteSelect.value;
    
    console.log('Selected year:', annee); // Debug log
    console.log('Selected speciality:', specialite); // Debug log
    
    // Clear previous options
    semestreSelect.innerHTML = '<option value="">--Sélectionnez--</option>';
    
    if (isetComData[annee] && isetComData[annee][specialite]) {
        const semestres = Object.keys(isetComData[annee][specialite]);
        console.log('Available semesters:', semestres); // Debug log
        
        semestres.forEach(semestre => {
            semestreSelect.innerHTML += `
                <option value="${semestre}">${semestre}</option>
            `;
        });
    }
}

function updateModules() {
    const annee = document.getElementById('anneeSelect').value;
    const specialite = document.getElementById('specialiteSelect').value;
    const semestre = document.getElementById('semestreSelect').value;
    
    if (!annee || !specialite || !semestre) return;

    const modules = isetComData[annee][specialite][semestre];
    const modulesDiv = document.getElementById('modulesContainer');
    modulesDiv.innerHTML = '';

    modules.forEach(module => {
        const moduleId = module.matiere.replace(/\s+/g, "");
        
        let evaluationInputs = '';
        
        // Check if module has evaluations property, if not infer from module name
        const hasTP = module.evaluations ? 
            module.evaluations.includes('TP') : 
            module.module.includes('TP');
        const hasTD = module.evaluations ? 
            module.evaluations.includes('TD') : 
            module.module.includes('TD');
        const hasExam = module.evaluations ? 
            module.evaluations.includes('Examen') : 
            true; // Default to true if not specified

        if (hasTD) {
            evaluationInputs += `
                <div>
                    <label class="block text-sm font-medium mb-1">Note TD</label>
                    <input type="number" min="0" max="20" step="0.01" id="${moduleId}_TD" 
                           class="custom-input w-full" placeholder="Note /20">
                </div>
            `;
        }

        if (hasTP) {
            evaluationInputs += `
                <div>
                    <label class="block text-sm font-medium mb-1">Note TP</label>
                    <input type="number" min="0" max="20" step="0.01" id="${moduleId}_TP" 
                           class="custom-input w-full" placeholder="Note /20">
                </div>
            `;
        }

        if (hasExam) {
            evaluationInputs += `
                <div>
                    <label class="block text-sm font-medium mb-1">Note Examen</label>
                    <input type="number" min="0" max="20" step="0.01" id="${moduleId}_EX" 
                           class="custom-input w-full" placeholder="Note /20">
                </div>
            `;
        }

        const html = `
            <div class="mb-6 p-4 border rounded glass-card">
                <h3 class="font-bold mb-2">${module.matiere}</h3>
                <p class="text-sm text-gray-600 mb-3">
                    Module: ${module.module} | Coefficient: ${module.coefficient} | Crédits: ${module.credits}
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${evaluationInputs}
                </div>
            </div>
        `;

        modulesDiv.innerHTML += html;
    });
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    const anneeSelect = document.getElementById('anneeSelect');
    const specialiteSelect = document.getElementById('specialiteSelect');
    const semestreSelect = document.getElementById('semestreSelect');

    anneeSelect.addEventListener('change', updateSpecialities);
    specialiteSelect.addEventListener('change', updateSemesters);
    semestreSelect.addEventListener('change', updateModules);
    
    // Initialize the form
    updateSpecialities();
});

// Add the calculerMoyenne function
function calculerMoyenne() {
    const annee = document.getElementById('anneeSelect').value;
    const specialite = document.getElementById('specialiteSelect').value;
    const semestre = document.getElementById('semestreSelect').value;

    if (!annee || !specialite || !semestre) {
        alert('Veuillez sélectionner tous les champs');
        return;
    }

    const modules = isetComData[annee][specialite][semestre];
    let moduleMarks = [];
    
    // Initialize UE totals
    let UEF = { total: 0, coeff: 0 };
    let UEM = { total: 0, coeff: 0 };
    let UED = { total: 0, coeff: 0 };
    let UET = { total: 0, coeff: 0 };

    modules.forEach(module => {
        const moduleId = module.matiere.replace(/\s+/g, "");
        
        // Get input values
        const tdInput = document.getElementById(`${moduleId}_TD`);
        const tpInput = document.getElementById(`${moduleId}_TP`);
        const exInput = document.getElementById(`${moduleId}_EX`);

        const noteTD = tdInput ? parseFloat(tdInput.value) || 0 : 0;
        const noteTP = tpInput ? parseFloat(tpInput.value) || 0 : 0;
        const noteExamen = exInput ? parseFloat(exInput.value) || 0 : 0;

        let moduleNote = 0;

        // Enhanced calculation logic for all specialties
        if (module.evaluations) {
            if (module.evaluations.includes('TD') && module.evaluations.includes('TP') && module.evaluations.includes('Examen')) {
                // For modules with all three evaluations (like Chimie, Physique)
                moduleNote = ((noteTD + noteTP) * 0.4 / 2) + (noteExamen * 0.6);
            } else if (module.evaluations.includes('TD') && module.evaluations.includes('TP')) {
                // For modules with only TD and TP (like Construction, Sciences des Matériaux)
                moduleNote = (noteTD + noteTP) / 2;
            } else if (module.evaluations.includes('TD') && module.evaluations.includes('Examen')) {
                // For modules with TD and Exam (like Mathématiques)
                moduleNote = (noteTD * 0.4) + (noteExamen * 0.6);
            } else if (module.evaluations.includes('TP')) {
                // For modules with only TP (like Informatique, CAO)
                moduleNote = noteTP;
            } else if (module.evaluations.includes('TD')) {
                // For modules with only TD
                moduleNote = noteTD;
            } else if (module.evaluations.includes('Examen')) {
                // For modules with only Exam
                moduleNote = noteExamen;
            }
        }

        // Add to appropriate UE total with coefficient
        if (module.module.includes('UEF')) {
            UEF.total += moduleNote * module.coefficient;
            UEF.coeff += module.coefficient;
        } else if (module.module.includes('UEM')) {
            UEM.total += moduleNote * module.coefficient;
            UEM.coeff += module.coefficient;
        } else if (module.module.includes('UED')) {
            UED.total += moduleNote * module.coefficient;
            UED.coeff += module.coefficient;
        } else if (module.module.includes('UET')) {
            UET.total += moduleNote * module.coefficient;
            UET.coeff += module.coefficient;
        }

        moduleMarks.push({
            name: module.matiere,
            mark: moduleNote.toFixed(2),
            coefficient: module.coefficient,
            type: module.module.split(' ')[0]
        });
    });

    // Calculate UE averages
    const uefAverage = UEF.coeff > 0 ? UEF.total / UEF.coeff : 0;
    const uemAverage = UEM.coeff > 0 ? UEM.total / UEM.coeff : 0;
    const uedAverage = UED.coeff > 0 ? UED.total / UED.coeff : 0;
    const uetAverage = UET.coeff > 0 ? UET.total / UET.coeff : 0;

    // Calculate overall average
    const totalPoints = UEF.total + UEM.total + UED.total + UET.total;
    const totalCoeff = UEF.coeff + UEM.coeff + UED.coeff + UET.coeff;
    const moyenne = totalPoints / totalCoeff;

    // Display results with updated status logic
    const resultat = document.getElementById('resultat');
    resultat.innerHTML = `
        <div class="bg-white p-4 rounded-lg shadow">
            <h3 class="text-xl font-bold mb-4">Résultats:</h3>
            
            <!-- UE Sections -->
            ${generateUESection('UEF', moduleMarks.filter(m => m.type === 'UEF'), uefAverage)}
            ${generateUESection('UEM', moduleMarks.filter(m => m.type === 'UEM'), uemAverage)}
            ${generateUESection('UED', moduleMarks.filter(m => m.type === 'UED'), uedAverage)}
            ${generateUESection('UET', moduleMarks.filter(m => m.type === 'UET'), uetAverage)}

            <!-- Overall Average -->
            <div class="border-t pt-4 mt-4">
                <div class="flex justify-between items-center">
                    <span class="text-lg font-bold">Moyenne Générale:</span>
                    <span class="text-xl font-bold ${getStatusColor(moyenne)}">
                        ${moyenne.toFixed(2)}/20
                    </span>
                </div>
                <div class="text-center mt-2 font-bold ${getStatusColor(moyenne)}">
                    ${getStatus(moyenne)}
                </div>
            </div>
        </div>
    `;
}

// Helper function to generate UE sections in the results
function generateUESection(ueType, modules, average) {
    if (modules.length === 0) return '';
    
    return `
        <div class="mb-4">
            <h4 class="font-bold mb-2">${ueType}</h4>
            <div class="space-y-2">
                ${modules.map(m => `
                    <div class="flex justify-between items-center p-2 ${parseFloat(m.mark) >= 10 ? 'bg-green-50' : 'bg-red-50'} rounded">
                        <span>${m.name} (Coef: ${m.coefficient})</span>
                        <span class="font-medium ${parseFloat(m.mark) >= 10 ? 'text-green-600' : 'text-red-600'}">
                            ${m.mark}/20
                        </span>
                    </div>
                `).join('')}
                <div class="flex justify-between items-center p-2 font-bold">
                    <span>Moyenne ${ueType}:</span>
                    <span class="${average >= 10 ? 'text-green-600' : 'text-red-600'}">
                        ${average.toFixed(2)}/20
                    </span>
                </div>
            </div>
        </div>
    `;
}

// Add these helper functions
function getStatus(moyenne) {
    if (moyenne >= 10) return 'Admis(e)';
    if (moyenne >= 8) return 'Rattrapage';
    return 'Non admis(e)';
}

function getStatusColor(moyenne) {
    if (moyenne >= 10) return 'text-green-600';
    if (moyenne >= 8) return 'text-orange-500';
    return 'text-red-600';
} 