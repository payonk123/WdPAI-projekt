<?php

require_once 'AppController.php';
require_once __DIR__.'/../repository/RecipeRepository.php';

class DetailController extends AppController {
    
    private $recipeRepository;

    public function __construct() {
        $this->recipeRepository = new RecipeRepository();
    }

    public function showRecipe() {
        if (!isset($_SESSION['id_user'])) {
            return $this->redirect('/login');
        }

        $recipe_id = $_GET['id'] ?? null;

        if (!$recipe_id || !is_numeric($recipe_id)) {
            return $this->redirect('/search_recipe');
        }

        $recipe = $this->recipeRepository->getRecipeById($recipe_id);

        if (!$recipe) {
            return $this->redirect('/search_recipe');
        }

        // Sprawdź, czy przepis należy do zalogowanego użytkownika
        if ($recipe['id_user'] != $_SESSION['id_user']) {
            return $this->redirect('/search_recipe');
        }

        $ingredients = $this->recipeRepository->getRecipeIngredients($recipe_id);

        return $this->render('recipe_detail', [
            'recipe' => $recipe,
            'ingredients' => $ingredients
        ]);
    }
}
?>