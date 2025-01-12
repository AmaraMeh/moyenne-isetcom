<?php
require_once 'db.php';

// Fonction pour créer un nouveau profil étudiant
function createStudentProfile($userId, $data) {
    $sql = "INSERT INTO student_profiles (user_id, full_name, student_id) VALUES (?, ?, ?)";
    return executeQuery($sql, [$userId, $data['full_name'], $data['student_id']]);
}

// Fonction pour mettre à jour un profil
function updateProfile($profileId, $data) {
    $sql = "UPDATE student_profiles SET 
            full_name = ?,
            level = ?,
            phone = ?,
            address = ?,
            theme_preference = ?
            WHERE id = ?";
            
    return executeQuery($sql, [
        $data['full_name'],
        $data['level'],
        $data['phone'],
        $data['address'],
        $data['theme_preference'],
        $profileId
    ]);
}

// Fonction pour récupérer un profil
function getProfile($profileId) {
    $sql = "SELECT p.*, u.email 
            FROM student_profiles p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = ?";
            
    $stmt = executeQuery($sql, [$profileId]);
    return $stmt->fetch();
}

// Fonction pour récupérer les compétences d'un profil
function getProfileSkills($profileId) {
    $sql = "SELECT * FROM skills WHERE profile_id = ?";
    $stmt = executeQuery($sql, [$profileId]);
    return $stmt->fetchAll();
} 