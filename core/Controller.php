<?php
class Controller {
    protected function view($view, $data = []) {
        extract($data);
        $viewPath = __DIR__ . '/../app/views/' . $view . '.php';
        include __DIR__ . '/../app/views/layouts/header.php';
        include $viewPath;
        include __DIR__ . '/../app/views/layouts/footer.php';
    }
    protected function json($arr) {
        header('Content-Type: application/json');
        echo json_encode($arr);
    }
}
?>