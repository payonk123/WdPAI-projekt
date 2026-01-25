<?php

require_once 'AppController.php';
require_once __DIR__.'/../repository/UserRepository.php';

class SecurityController extends AppController {
    private $userRepository;

    public function __construct() {
        $this->userRepository = new UserRepository();
    }

    // TODO dekarator, który definiuje, jakie metody HTTP są dostępne
    public function login() {

        if($this->isGet()) {
            return $this->render("login");
        } 

        $email = $_POST["email"] ?? '';
        $password = $_POST["password"] ?? '';

        if (empty($email) || empty($password)) {
            return $this->render('login', ['message' => 'Fill all fields please']);
        }

        $user =$this->userRepository->getUserByEmail($email);

        if (!$user) {
            return $this->render('login', ['message' => 'User not found']);
        }

        if (!password_verify($password, $user['password'])) {
            return $this->render('login', ['message' => 'Wrong password or login']);
        }

        // Utwórz sesję
        $_SESSION['id_user'] = $user['id_user'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['firstname'] = $user['firstname'];
        $_SESSION['lastname'] = $user['lastname'];

        return $this->redirect("dashboard");
    }

    public function register() {

        if ($this->isGet()) {
            return $this->render("register");
        }

        $email = $_POST["email"] ?? '';
        $password1 = $_POST["password1"] ?? '';
        $password2 = $_POST["password2"] ?? '';
        $firstname = $_POST["firstname"] ?? '';
        $lastname = $_POST["lastname"] ?? '';

        if (empty($email) || empty($password1) || empty($password2) || empty($firstname) || empty($lastname)) {
            return $this->render('register', ['messages' => 'Fill all fields please']);
        }

        if ($password1 !== $password2) {
            return $this->render('register', ['messages' => 'Passwords should be the same!']);
        }

        // Sprawdzenie czy email już istnieje
        if ($this->userRepository->emailExists($email)) {
            return $this->render('register', ['message' => 'User with this email already exists']);
        }

        // Walidacja hasła
        if (strlen($password1) < 6) {
            return $this->render('register', ['message' => 'Password must be at least 6 characters']);
        }

        try {
            $hashedPassword = password_hash($password1, PASSWORD_BCRYPT);

            $this->userRepository->createUser(
                $email,
                $hashedPassword,
                $firstname,
                $lastname
            );

                return $this->render("login", ["message" => "User " . $email . " registered successfully"]);
            } catch (Exception $e) {
                return $this->render('register', ['message' => 'Error during registration: ' . $e->getMessage()]);
            }
        }

        public function logout() {
            session_destroy();
           return $this->redirect("login");
        }
    }