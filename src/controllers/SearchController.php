<?php

require_once 'AppController.php';
require_once __DIR__.'/../repository/RecipeRepository.php';

class SearchController extends AppController {
    
    private $recipeRepository;

    public function __construct() {
        $this->recipeRepository = new RecipeRepository();
    }

    public function searchRecipe() {
        if (!isset($_SESSION['id_user'])) {
            http_response_code(401);
            return $this->render("login");
        }

        $recipes = $this->recipeRepository->getRecipesByUserId($_SESSION['id_user']);
        
        return $this->render('search_recipe', ['recipes' => $recipes]);
    }
}
?>