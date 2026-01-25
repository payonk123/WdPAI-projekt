<?php

require_once 'Repository.php';

class UserRepository extends Repository
{

    public function getUsers(): ?array
    {
        $stmt = $this->database->connect()->prepare('
            SELECT id_user, email, firstname, lastname FROM users
        ');
        $stmt->execute();

        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

       return $users;
    }

    public function createUser(string $email, string $hashedPassword, string $firstname, string $lastname): void {
        try {
            $stmt = $this->database->connect()->prepare('
                INSERT INTO users (email, password, firstname, lastname) 
                VALUES (?, ?, ?, ?)
            ');

            $stmt->execute([
                $email,
                $hashedPassword,
                $firstname,
                $lastname
            ]);
        } catch (PDOException $e) {
            throw new Exception("Error creating user: " . $e->getMessage());
        }
    }

    public function getUserByEmail(string $email) {
        $stmt = $this->database->connect()->prepare('
            SELECT id_user, email, password, firstname, lastname 
            FROM users 
            WHERE email = :email
        ');
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        $users = $stmt->fetch(PDO::FETCH_ASSOC);

       return $users;
    }
    public function getUserById(int $id_user) {
        $stmt = $this->database->connect()->prepare('
            SELECT id_user, email, firstname, lastname 
            FROM users 
            WHERE id_user = :id_user
        ');
        $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user;
    }

    public function emailExists(string $email): bool {
        $stmt = $this->database->connect()->prepare('
            SELECT COUNT(*) FROM users WHERE email = :email
        ');
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->fetchColumn() > 0;
    }
}
?>