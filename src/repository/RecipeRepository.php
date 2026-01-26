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
}
?>