<?php

require_once 'AppController.php';


class SecurityController extends AppController {


    public function login() {

        return $this->render("login");
    }

    // public function register() {
    //     // hiss
    //     //return $this->render("login" -> "Zarejestrowano użytkownika");
    // }
}