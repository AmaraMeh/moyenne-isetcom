document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('gradeForm');
    const resultDiv = document.getElementById('result');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let totalWeightedGrade = 0;
        let totalCoefficient = 0;
        
        // Récupérer toutes les matières
        const subjects = document.querySelectorAll('.subject-row');
        
        subjects.forEach(subject => {
            const grade = parseFloat(subject.querySelector('.grade-input').value);
            const coefficient = parseFloat(subject.querySelector('.coefficient-input').value);
            
            if (!isNaN(grade) && !isNaN(coefficient)) {
                totalWeightedGrade += grade * coefficient;
                totalCoefficient += coefficient;
            }
        });
        
        const average = totalWeightedGrade / totalCoefficient;
        
        resultDiv.innerHTML = `
            <div class="bg-white p-4 rounded-lg shadow mt-4">
                <h3 class="text-xl font-bold mb-2">Résultat :</h3>
                <p class="text-2xl text-blue-600">${average.toFixed(2)}/20</p>
                <p class="mt-2 ${average >= 10 ? 'text-green-600' : 'text-red-600'}">
                    ${average >= 10 ? 'Admis(e)' : 'Non admis(e)'}
                </p>
            </div>
        `;
    });
    
    // Ajouter une nouvelle matière
    document.getElementById('addSubject').addEventListener('click', function() {
        const newRow = document.createElement('div');
        newRow.className = 'subject-row grid grid-cols-3 gap-4 mb-4';
        newRow.innerHTML = `
            <input type="text" placeholder="Nom de la matière" class="form-input">
            <input type="number" step="0.01" min="0" max="20" class="form-input grade-input" required>
            <input type="number" step="0.1" min="0.1" class="form-input coefficient-input" required>
        `;
        document.getElementById('subjectsList').appendChild(newRow);
    });
}); 