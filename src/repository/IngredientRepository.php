<?php

require_once 'Database.php';

class IngredientRepository {
    
    private $database;

    public function __construct() {
        $this->database = new Database();
    }

    public function getAllIngredients() {
        $pdo = $this->database->connect();
        
        $query = "SELECT id_in, name FROM INGREDIENTS ORDER BY name ASC";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getIngredientById($id_in) {
        $pdo = $this->database->connect();
        
        $query = "SELECT * FROM INGREDIENTS WHERE id_in = :id_in";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_in', $id_in, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>