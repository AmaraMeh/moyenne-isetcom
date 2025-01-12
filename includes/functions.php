<?php
// Vérification des permissions
function checkPermission($profileId) {
    if (!isLoggedIn()) {
        header('Location: /login.php');
        exit;
    }

    if (isAdmin()) {
        return true;
    }

    // Vérifier si l'étudiant accède à son propre profil
    if ($_SESSION['user_id'] === $profileId) {
        return true;
    }

    header('HTTP/1.1 403 Forbidden');
    exit;
}

// Nettoyage des données
function sanitizeInput($data) {
    return htmlspecialchars(strip_tags(trim($data)));
} 