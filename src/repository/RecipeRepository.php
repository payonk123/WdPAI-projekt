<?php

require_once 'Database.php';

class RecipeRepository {
    
    private $database;

    public function __construct() {
        $this->database = new Database();
    }

    public function createRecipe($id_user, $name, $instructions, $portions, $p_time) {
        $pdo = $this->database->connect();
        
        $query = "INSERT INTO RECIPES (id_user, name, instructions, portions, p_time) 
                  VALUES (:id_user, :name, :instructions, :portions, :p_time)";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->bindParam(':instructions', $instructions, PDO::PARAM_STR);
        $stmt->bindParam(':portions', $portions, PDO::PARAM_INT);
        $stmt->bindParam(':p_time', $p_time, PDO::PARAM_INT);
        
        $stmt->execute();
        
        return $pdo->lastInsertId();
    }

    public function addRecipeIngredient($id_recipe, $id_in, $id_unity, $amount) {
        $pdo = $this->database->connect();
        
        $query = "INSERT INTO RECIPE_IN (id_recipe, id_in, id_unity, amount) 
                  VALUES (:id_recipe, :id_in, :id_unity, :amount)";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_recipe', $id_recipe, PDO::PARAM_INT);
        $stmt->bindParam(':id_in', $id_in, PDO::PARAM_INT);
        $stmt->bindParam(':id_unity', $id_unity, PDO::PARAM_INT);
        $stmt->bindParam(':amount', $amount, PDO::PARAM_STR);
        
        $stmt->execute();
    }

    public function getRecipesByUserId($id_user) {
        $pdo = $this->database->connect();
        
        $query = "SELECT id_recipe, name, instructions, portions, p_time 
                  FROM RECIPES 
                  WHERE id_user = :id_user 
                  ORDER BY id_recipe DESC";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getRecipeById($id_recipe) {
        $pdo = $this->database->connect();
        
        $query = "SELECT * FROM RECIPES WHERE id_recipe = :id_recipe";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_recipe', $id_recipe, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getRecipeIngredients($id_recipe) {
        $pdo = $this->database->connect();
        
        $query = "SELECT ri.id_ri, ri.amount, i.name as ingredient_name, u.name as unit_name
                  FROM RECIPE_IN ri
                  JOIN INGREDIENTS i ON ri.id_in = i.id_in
                  JOIN UNITY u ON ri.id_unity = u.id_unity
                  WHERE ri.id_recipe = :id_recipe";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_recipe', $id_recipe, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addSegment($id_recipe, $start_time, $end_time) {
        $pdo = $this->database->connect();
        
        $query = "INSERT INTO SEGMENTS_R (id_recipe, start_time, end_time) 
                  VALUES (:id_recipe, :start_time, :end_time)";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_recipe', $id_recipe, PDO::PARAM_INT);
        $stmt->bindParam(':start_time', $start_time, PDO::PARAM_STR);
        $stmt->bindParam(':end_time', $end_time, PDO::PARAM_STR);
        
        $stmt->execute();
        
        return $pdo->lastInsertId();
    }

    public function getSegmentsByUserId($id_user) {
        $pdo = $this->database->connect();
        
        $query = "SELECT sr.id_segment_r, sr.id_recipe, sr.start_time, sr.end_time, r.name as recipe_name, r.p_time
                  FROM SEGMENTS_R sr
                  JOIN RECIPES r ON sr.id_recipe = r.id_recipe
                  WHERE r.id_user = :id_user";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function isSegmentOverlapping($id_user, $start_time, $end_time) {
        $pdo = $this->database->connect();
        
        $query = "SELECT count(*) FROM SEGMENTS_R sr
                  JOIN RECIPES r ON sr.id_recipe = r.id_recipe
                  WHERE r.id_user = :id_user
                  AND (sr.start_time < :end_time AND sr.end_time > :start_time)";
                  
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
        $stmt->bindParam(':start_time', $start_time, PDO::PARAM_STR);
        $stmt->bindParam(':end_time', $end_time, PDO::PARAM_STR);
        $stmt->execute();
        
        return $stmt->fetchColumn() > 0;
    }

    public function deleteSegment($id_segment) {
        $pdo = $this->database->connect();

        // Delete cooking segment from SEGMENTS_R
        $query = "DELETE FROM SEGMENTS_R WHERE id_segment_r = :id_segment";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_segment', $id_segment, PDO::PARAM_INT);
        $stmt->execute();
    }

    public function deleteSegmentP($id_segment) {
        $pdo = $this->database->connect();

        // Delete eating segment from SEGMENTS_P
        $query = "DELETE FROM SEGMENTS_P WHERE id_segment_p = :id_segment";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_segment', $id_segment, PDO::PARAM_INT);
        $stmt->execute();
    }

    public function deleteRecipe($id_recipe) {
        $pdo = $this->database->connect();
        $stmt = $pdo->prepare("DELETE FROM RECIPES WHERE id_recipe = :id_recipe");
        $stmt->bindParam(':id_recipe', $id_recipe, PDO::PARAM_INT);
        $stmt->execute();
    }

    public function getPreparedByUserId($id_user) {
        $pdo = $this->database->connect();
        
        $query = "SELECT p.id_prepared, p.id_segment_r, p.portions_left, r.name as recipe_name
                  FROM PREPARED p
                  JOIN SEGMENTS_R sr ON p.id_segment_r = sr.id_segment_r
                  JOIN RECIPES r ON sr.id_recipe = r.id_recipe
                  WHERE r.id_user = :id_user AND p.portions_left > 0
                  ORDER BY p.id_prepared DESC";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getPreparedByUserIdBeforeTime($id_user, $before_time) {
        $pdo = $this->database->connect();
        
        $query = "SELECT p.id_prepared, p.id_segment_r, p.portions_left, r.name as recipe_name
                  FROM PREPARED p
                  JOIN SEGMENTS_R sr ON p.id_segment_r = sr.id_segment_r
                  JOIN RECIPES r ON sr.id_recipe = r.id_recipe
                  WHERE r.id_user = :id_user AND p.portions_left > 0 AND sr.end_time <= :before_time
                  ORDER BY p.id_prepared DESC";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
        $stmt->bindParam(':before_time', $before_time, PDO::PARAM_STR);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addSegmentP($id_prepared, $start_time, $end_time) {
        $pdo = $this->database->connect();
        
        // Insert the eating segment
        $query = "INSERT INTO SEGMENTS_P (id_prepared, start_time, end_time) 
                  VALUES (:id_prepared, :start_time, :end_time)";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_prepared', $id_prepared, PDO::PARAM_INT);
        $stmt->bindParam(':start_time', $start_time, PDO::PARAM_STR);
        $stmt->bindParam(':end_time', $end_time, PDO::PARAM_STR);
        
        $stmt->execute();
        
        return $pdo->lastInsertId();
    }

    public function getSegmentsPByUserId($id_user) {
        $pdo = $this->database->connect();
        
        $query = "SELECT sp.id_segment_p, sp.id_prepared, sp.start_time, sp.end_time, r.name as recipe_name
                  FROM SEGMENTS_P sp
                  JOIN PREPARED p ON sp.id_prepared = p.id_prepared
                  JOIN SEGMENTS_R sr ON p.id_segment_r = sr.id_segment_r
                  JOIN RECIPES r ON sr.id_recipe = r.id_recipe
                  WHERE r.id_user = :id_user";
        
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>