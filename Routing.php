<?php
require_once 'src/controllers/SecurityController.php';
require_once 'src/controllers/DashboardController.php';
require_once 'src/controllers/RecipeController.php';
require_once 'src/controllers/SearchController.php';
require_once 'src/controllers/DetailController.php';

class Routing {

    public static $routes = [
        'login' => [
            'controller' => 'SecurityController',
            'action' => 'login'
        ],
        'register' => [
            'controller' => 'SecurityController',
            'action' => 'register'
        ],
        'dashboard' => [
            'controller' => 'DashboardController',
            'action' => 'index'
        ],
        'calendar'=>[
            'controller'=>'AppController',
            'action' => 'index'
        ],
        'logout' => [
            'controller' => 'SecurityController',
            'action' => 'logout'
        ],
        'add_recipe'=>[
            'controller'=>'RecipeController',
            'action' => 'addRecipe'
        ],
        'search_recipe'=>[
            'controller'=>'SearchController',
            'action' => 'searchRecipe'
        ],        
        'recipe_detail'=>[
            'controller'=>'DetailController',
            'action' => 'showRecipe'
        ],
        'get_recipes'=>[
            'controller'=>'RecipeController',
            'action' => 'getUserRecipes'
        ],
        'add_segment'=>[
            'controller'=>'RecipeController',
            'action' => 'addSegment'
        ],
        'get_segments'=>[
            'controller'=>'RecipeController',
            'action' => 'getUserSegments'
        ],
        'delete_segment'=>[
            'controller'=>'RecipeController',
            'action' => 'deleteSegment'
        ],
        'delete_recipe'=>[
            'controller'=>'RecipeController',
            'action' => 'deleteRecipe'
        ],
        'get_prepared'=>[
            'controller'=>'RecipeController',
            'action' => 'getPrepared'
        ],
        'add_segment_p'=>[
            'controller'=>'RecipeController',
            'action' => 'addSegmentP'
        ],
        'get_segments_p'=>[
            'controller'=>'RecipeController',
            'action' => 'getUserSegmentsP'
        ]
    ];


    public static function run(string $path) {
        if (array_key_exists($path, self::$routes)) {
            $controller = self::$routes[$path]['controller'];
            $action = self::$routes[$path]['action'];

            $controllerObj = new $controller;
            $controllerObj->$action();
        } else {
            http_response_code(404);
            include 'public/views/404.html';
        }
    }
}