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
        
    ];


    public static function run(string $path) {
        //TODO na podstawie sciezki sprawdzamy jaki HTML zwrocic
        switch ($path) {
            case 'dashboard':
            case 'login':
            case 'register':
            case 'calendar':
            case 'logout':
            case 'add_recipe':
            case 'search_recipe':
            case 'recipe_detail':
                $controller = Routing::$routes[$path]['controller'];
                $action = Routing::$routes[$path]['action'];

                $controllerObj = new $controller;
                $controllerObj->$action();
                break;

            default:
                include 'public/views/404.html';
                break;
        } 
    }
}