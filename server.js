const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import des routes
const authRoutes = require('./routes/auth');
const surveysRoutes = require('./routes/surveys');
const supportRoutes = require('./routes/support');

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

// Configuration CORS plus permissive
app.use(cors({
    origin: '*',  // Permet toutes les origines en développement
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false  // Changé à false pour le moment
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

// Route de test pour vérifier CORS
app.get('/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// Log toutes les requêtes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveysRoutes);
app.use('/api/support', supportRoutes);

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
}); 