<?php

require_once 'AppController.php';
require_once __DIR__.'/../repository/UserRepository.php';

class DashboardController extends AppController {

    public function index() {
        if (!isset($_SESSION['id_user'])) {
            return $this->redirect('/login');
        }
        // TODO prepare dataset, and display in HTML

        $userRepository = new UserRepository();
        $users = $userRepository->getUsers();

        return $this->render("dashboard");
    }
}