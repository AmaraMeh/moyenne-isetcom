module.exports = {
    mongoURI: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    nodeEnv: 'production',
    allowedOrigins: [
        'https://votre-domaine.com',
        'https://www.votre-domaine.com'
    ]
}; 