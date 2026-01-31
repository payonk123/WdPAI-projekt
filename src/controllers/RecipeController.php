<?php

require_once 'AppController.php';
require_once __DIR__.'/../repository/RecipeRepository.php';
require_once __DIR__.'/../repository/IngredientRepository.php';
require_once __DIR__.'/../repository/UnityRepository.php';

class RecipeController extends AppController {
    
    private $recipeRepository;
    private $ingredientRepository;
    private $unityRepository;

    public function __construct() {
        $this->recipeRepository = new RecipeRepository();
        $this->ingredientRepository = new IngredientRepository();
        $this->unityRepository = new UnityRepository();
    }

    public function addRecipe() {
        if($this->isGet()) {
            $ingredients = $this->ingredientRepository->getAllIngredients();
            $units = $this->unityRepository->getAllUnits();
            return $this->render("add_recipe", [
                'ingredients' => $ingredients,
                'units' => $units
            ]);
        }

        // Obsługa POST
        if($this->isPost()) {
            try {
                if (!isset($_SESSION['id_user'])) {
                    return $this->render('add_recipe', ['message' => 'You must be logged in']);
                }

                $name = $_POST["name"] ?? '';
                $instructions = $_POST["instructions"] ?? '';
                $portions = $_POST["portions"] ?? 0;
                $p_time = $_POST["p_time"] ?? 0;

                if (empty($name) || empty($instructions) || $portions <= 0 || $p_time <= 0) {
                    $ingredients = $this->ingredientRepository->getAllIngredients();
                    $units = $this->unityRepository->getAllUnits();
                    return $this->render("add_recipe", [
                        'message' => 'Please fill all fields correctly',
                        'ingredients' => $ingredients,
                        'units' => $units
                    ]);
                }

                // Dodaj przepis
                $recipe_id = $this->recipeRepository->createRecipe(
                    $_SESSION['id_user'],
                    $name,
                    $instructions,
                    (int)$portions,
                    (int)$p_time
                );

                // Dodaj składniki
                if (isset($_POST['ingredients']) && is_array($_POST['ingredients'])) {
                    foreach ($_POST['ingredients'] as $index => $ingredient_data) {
                        $id_in = $ingredient_data['id_in'] ?? null;
                        $id_unity = $ingredient_data['id_unity'] ?? null;
                        $amount = $ingredient_data['amount'] ?? null;

                        if ($id_in && $id_unity && $amount && $amount > 0) {
                            $this->recipeRepository->addRecipeIngredient(
                                $recipe_id,
                                (int)$id_in,
                                (int)$id_unity,
                                (float)$amount
                            );
                        }
                    }
                }

                return $this->redirect("dashboard");

            } catch (Exception $e) {
                $ingredients = $this->ingredientRepository->getAllIngredients();
                $units = $this->unityRepository->getAllUnits();
                return $this->render("add_recipe", [
                    'message' => 'Error: ' . $e->getMessage(),
                    'ingredients' => $ingredients,
                    'units' => $units
                ]);
            }
        }
    }

    public function getUserRecipes() {
        // Allow fetch 
        header('Content-Type: application/json');
        
        if (!isset($_SESSION['id_user'])) {
            http_response_code(401);
            echo json_encode(['error' => 'User not logged in']);
            return;
        }

        try {
            $recipes = $this->recipeRepository->getRecipesByUserId($_SESSION['id_user']);
            echo json_encode($recipes);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function addSegment() {
        $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

        if ($contentType === "application/json") {
            $content = trim(file_get_contents("php://input"));
            $decoded = json_decode($content, true);

            header('Content-type: application/json');

            if (!isset($_SESSION['id_user'])) {
                 http_response_code(401);
                 echo json_encode(['error' => 'User not logged in']);
                 return;
            }

            $id_recipe = $decoded['id_recipe'] ?? null;
            $start_time = $decoded['start_time'] ?? null;
            $end_time = $decoded['end_time'] ?? null;

            if (!$id_recipe || !$start_time || !$end_time) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing parameters']);
                return;
            }

            // Check overlap
            if ($this->recipeRepository->isSegmentOverlapping($_SESSION['id_user'], $start_time, $end_time)) {
                http_response_code(409); // Conflict
                echo json_encode(['error' => 'Time slot overlaps with an existing segment']);
                return;
            }

            try {
                $segmentId = $this->recipeRepository->addSegment($id_recipe, $start_time, $end_time);
                echo json_encode(['success' => true, 'id_segment_r' => $segmentId]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        }
    }

    public function getUserSegments() {
       header('Content-Type: application/json');

       if (!isset($_SESSION['id_user'])) {
           http_response_code(401);
           echo json_encode(['error' => 'User not logged in']);
           return;
       }

       try {
           $segments = $this->recipeRepository->getSegmentsByUserId($_SESSION['id_user']);
           echo json_encode($segments);
       } catch (Exception $e) {
           http_response_code(500);
           echo json_encode(['error' => $e->getMessage()]);
       }
    }

    public function deleteSegment() {
        $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

        if ($contentType === "application/json") {
            $content = trim(file_get_contents("php://input"));
            $decoded = json_decode($content, true);

            header('Content-type: application/json');

            if (!isset($_SESSION['id_user'])) {
                 http_response_code(401);
                 echo json_encode(['error' => 'User not logged in']);
                 return;
            }

            $id_segment = $decoded['id_segment'] ?? null;

            if (!$id_segment) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing ID']);
                return;
            }

            try {
                $this->recipeRepository->deleteSegment($id_segment);
                echo json_encode(['success' => true]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        }
    }

    public function deleteRecipe() {
        $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';

        if ($contentType === "application/json") {
            $content = trim(file_get_contents("php://input"));
            $decoded = json_decode($content, true);

            header('Content-type: application/json');

            if (!isset($_SESSION['id_user'])) {
                 http_response_code(401);
                 echo json_encode(['error' => 'User not logged in']);
                 return;
            }

            $id_recipe = $decoded['id_recipe'] ?? null;

            if (!$id_recipe) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing ID']);
                return;
            }

            try {
                $this->recipeRepository->deleteRecipe($id_recipe);
                echo json_encode(['success' => true]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        }
    }
}
?>