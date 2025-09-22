<?php
class Auth {
    public static function start() {
        if (session_status() === PHP_SESSION_NONE) session_start();
    }
    public static function user() {
        self::start();
        return $_SESSION['user'] ?? null;
    }
    public static function requireRole($role) {
        $u = self::user();
        if (!$u || $u['role'] !== $role) {
            header('Location: ' . BASE_URL . '/auth/login');
            exit;
        }
    }
    public static function requireAny($roles) {
        $u = self::user();
        if (!$u || !in_array($u['role'], $roles)) {
            header('Location: ' . BASE_URL . '/auth/login');
            exit;
        }
    }
    public static function login($userArr) {
        self::start();
        $_SESSION['user'] = $userArr;
    }
    public static function logout() {
        self::start();
        session_destroy();
    }
}
?>