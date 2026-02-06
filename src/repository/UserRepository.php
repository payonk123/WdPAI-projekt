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
                VALUES (:email, :hashedPassword, :firstname, :lastname)
            ');
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':hashedPassword', $hashedPassword, PDO::PARAM_STR);
            $stmt->bindParam(':firstname', $firstname, PDO::PARAM_STR);
            $stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error creating user: " . $e->getMessage());
        }
    }

        public function createlogin(string $ip, int $success): void {
        try {
            $stmt = $this->database->connect()->prepare('
                INSERT INTO logins (ip, success) 
                VALUES (:ip, :success)
            ');
            $stmt->bindParam(':ip', $ip, PDO::PARAM_STR);
            $stmt->bindParam(':success', $success, PDO::PARAM_STR);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new Exception("Error creating login: " . $e->getMessage());
        }
    }

    public function sumlogin(string $ip): int {
        try {
            $stmt = $this->database->connect()->prepare('
                select sum(success) from (select success from logins where ip=:ip order by login_time DESC LIMIT 5);
            ');
            $stmt->bindParam(':ip', $ip, PDO::PARAM_STR);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['sum'] ?? 0;

        } catch (PDOException $e) {
            throw new Exception("Error summing login: " . $e->getMessage());
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