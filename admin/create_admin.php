<?php
require_once '../includes/db.php';

function createInitialAdmin() {
    $email = 'admin@isetcom.tn';
    $password = password_hash('admin123', PASSWORD_DEFAULT);
    
    try {
        $sql = "INSERT INTO users (email, password, role) VALUES (?, ?, 'admin')";
        executeQuery($sql, [$email, $password]);
        
        echo "Administrateur créé avec succès!\n";
        echo "Email: admin@isetcom.tn\n";
        echo "Mot de passe: admin123\n";
        echo "IMPORTANT: Changez ce mot de passe immédiatement après la première connexion!\n";
    } catch (Exception $e) {
        echo "Erreur lors de la création de l'admin: " . $e->getMessage();
    }
}

// Exécuter seulement si lancé directement
if (php_sapi_name() === 'cli') {
    createInitialAdmin();
} 