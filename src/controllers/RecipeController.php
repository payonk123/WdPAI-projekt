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
}
?>