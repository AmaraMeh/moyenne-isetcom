const config = {
    API_URL: process.env.NODE_ENV === 'production'
        ? 'https://votre-api-backend.com'  // URL de votre backend déployé
        : 'http://localhost:5000'
};

export default config; 