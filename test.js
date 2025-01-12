const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/isetcom_db')
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.error('❌ Erreur MongoDB:', err));

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'success',
        message: 'Serveur et MongoDB connectés avec succès!',
        timestamp: new Date()
    });
});

// Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
}); 