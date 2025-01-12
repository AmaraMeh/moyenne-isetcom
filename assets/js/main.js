import universityAPI from './api/universityAPI.js';

// Function to display students in the table
async function displayStudents() {
    try {
        const students = await universityAPI.getAllStudents();
        const tableBody = document.querySelector('#studentsTable tbody');
        
        if (!tableBody) return; // Exit if element doesn't exist
        
        students.forEach(student => {
            const row = `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.level}</td>
                    <td>${student.gpa}</td>
                    <td>
                        <button onclick="viewStudent('${student.id}')" class="btn-view">
                            Voir
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

// Make the function available globally
window.viewStudent = async (id) => {
    try {
        const student = await universityAPI.getStudent(id);
        // Display student details
        console.log(student);
    } catch (error) {
        console.error('Erreur:', error);
    }
};

// Initialize display without any auth checks
document.addEventListener('DOMContentLoaded', displayStudents);