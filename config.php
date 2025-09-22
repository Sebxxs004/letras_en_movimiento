<?php
// Configuración básica
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'letras_en_movimiento');

// Admin por defecto (se creará automáticamente si no existe al iniciar)
define('DEFAULT_ADMIN_EMAIL', 'admin@lem.test');
define('DEFAULT_ADMIN_PASSWORD', 'Admin123*'); // cámbialo luego
define('DEFAULT_CHILD_EMAIL', 'nino@lem.test');
define('DEFAULT_CHILD_PASSWORD', 'Nino123*');

// Entorno
define('APP_NAME', 'Letras en Movimiento');
define('BASE_URL', '/letras_en_movimiento/public'); // ajusta según tu htdocs
?>