// Les données simulées
const mockStudentAPI = {
    students: [
        {
            id: "2023001",
            name: "Ahmed Benali",
            level: "L3",
            department: "Informatique",
            gpa: 15.75,
            courses: [
                { code: "INFO301", name: "Bases de données", grade: 16 },
                { code: "INFO302", name: "Programmation Web", grade: 15.5 },
                { code: "INFO303", name: "Réseaux", grade: 14 }
            ],
            attendance: 92
        },
        {
            id: "2023002",
            name: "Meriem Saidi",
            level: "L3",
            department: "Informatique",
            gpa: 16.20,
            courses: [
                { code: "INFO301", name: "Bases de données", grade: 17 },
                { code: "INFO302", name: "Programmation Web", grade: 16 },
                { code: "INFO303", name: "Réseaux", grade: 15.5 }
            ],
            attendance: 95
        },
        {
            id: "2023003",
            name: "Karim Mansouri",
            level: "L2",
            department: "Informatique",
            gpa: 14.80,
            courses: [
                { code: "INFO201", name: "Algorithmes", grade: 15 },
                { code: "INFO202", name: "Systèmes d'exploitation", grade: 14.5 },
                { code: "INFO203", name: "Structure de données", grade: 15 }
            ],
            attendance: 88
        }
    ]
};

export default mockStudentAPI; 