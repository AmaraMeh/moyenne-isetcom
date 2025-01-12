router.get('/', async (req, res) => {
    try {
        const filieres = await Filiere.find();
        // Transform the data to match the expected format
        const formattedData = {
            "1ere Année Licence": {
                "Licence en Sciences de l'Informatique": {
                    "Semestre 1": [
                        // Your modules here
                    ],
                    "Semestre 2": [
                        // Your modules here
                    ]
                },
                // Other specialities
            },
            // Other years
        };
        
        res.json(formattedData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}); 