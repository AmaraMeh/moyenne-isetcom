import mockStudentAPI from './mockData.js';

const universityAPI = {
    getAllStudents: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockStudentAPI.students);
            }, 500);
        });
    },

    getStudent: (id) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const student = mockStudentAPI.students.find(s => s.id === id);
                if (student) {
                    resolve(student);
                } else {
                    reject(new Error('Étudiant non trouvé'));
                }
            }, 300);
        });
    }
};

export default universityAPI; 