import universityAPI from './api/universityAPI.js';

async function displayStudents() {
    try {
        const students = await universityAPI.getAllStudents();
        const tableBody = document.getElementById('studentsTableBody');
        
        students.forEach(student => {
            const row = `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap">${student.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${student.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${student.level}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${student.gpa}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <button onclick="viewStudentDetails('${student.id}')" 
                                class="custom-button">
                            Voir détails
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Erreur:', error);
    }
}

window.viewStudentDetails = async (id) => {
    try {
        const student = await universityAPI.getStudent(id);
        // You can create a modal or redirect to a details page
        alert(`Détails de l'étudiant ${student.name}:\nMoyenne: ${student.gpa}\nDépartement: ${student.department}\nPrésence: ${student.attendance}%`);
    } catch (error) {
        console.error('Erreur:', error);
    }
};

// Initialize the display when the page loads
document.addEventListener('DOMContentLoaded', displayStudents); 