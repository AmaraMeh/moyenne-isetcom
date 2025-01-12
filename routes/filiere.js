router.get('/', async (req, res) => {
    try {
        const filieres = await Filiere.find(); // Récupérer toutes les filières
        res.json(filieres);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
}); 