<?php

require_once 'Database.php';

class UnityRepository {
    
    private $database;

    public function __construct() {
        $this->database = new Database();
    }

    public function getAllUnits() {
        $pdo = $this->database->connect();
        
        $query = "SELECT id_unity, name FROM UNITY ORDER BY name ASC";
        
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getUnitById($id_unity) {
        $pdo = $this->database->connect();
        
        $query = "SELECT * FROM UNITY WHERE id_unity = :id_unity";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_unity', $id_unity, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>