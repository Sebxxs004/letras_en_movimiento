<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../core/DB.php';
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Model.php';
require_once __DIR__ . '/../core/Auth.php';

// Auto-cargar controladores y modelos básicos
spl_autoload_register(function($class){
    $paths = [__DIR__.'/../app/controllers/'.$class.'.php', __DIR__.'/../app/models/'.$class.'.php'];
    foreach ($paths as $p) if (file_exists($p)) require_once $p;
});

// Inicialización DB y creación de admin/niño por defecto si no existen
function ensure_defaults() {
    $email = DEFAULT_ADMIN_EMAIL;
    $res = DB::query('SELECT id FROM users WHERE email = ?', [$email]);
    if ($res->num_rows === 0) {
        DB::query('INSERT INTO users(name,email,password,role,created_at) VALUES (?,?,?,?,NOW())',
            ['Admin', $email, password_hash(DEFAULT_ADMIN_PASSWORD, PASSWORD_BCRYPT), 'admin']);
    }
    $email2 = DEFAULT_CHILD_EMAIL;
    $res2 = DB::query('SELECT id FROM users WHERE email = ?', [$email2]);
    if ($res2->num_rows === 0) {
        DB::query('INSERT INTO users(name,email,password,role,created_at) VALUES (?,?,?,?,NOW())',
            ['Niño Demo', $email2, password_hash(DEFAULT_CHILD_PASSWORD, PASSWORD_BCRYPT), 'child']);
    }
}
ensure_defaults();

$route = $_GET['route'] ?? 'auth/login';
$parts = explode('/', trim($route,'/'));
$controller = ucfirst($parts[0]) . 'Controller';
$action = $parts[1] ?? 'index';

if (!class_exists($controller)) { http_response_code(404); echo "Controlador no encontrado"; exit;}
$ctrl = new $controller();
if (!method_exists($ctrl, $action)) { http_response_code(404); echo "Acción no encontrada"; exit;}
$ctrl->$action();
?>