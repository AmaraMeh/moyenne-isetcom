const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import des routes
const authRoutes = require('../routes/auth');
const surveysRoutes = require('../routes/surveys');
const supportRoutes = require('../routes/support');

const app = express();

// Middleware de sécurité pour la production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        next();
    });
}

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://votre-domaine.com']
        : 'http://localhost:3000'
}));

app.use(express.json());
app.use(express.static('public'));

// Route de test principale
app.get('/', (req, res) => {
    res.json({ 
        message: "Bienvenue sur l'API ISET'COM !",
        endpoints: {
            auth: '/api/auth/test',
            surveys: '/api/surveys/test',
            support: '/api/support/test'
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveysRoutes);
app.use('/api/support', supportRoutes);

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/isetcom_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
}); 