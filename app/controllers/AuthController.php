<?php
class AuthController extends Controller {
    public function login() {
        Auth::start();
        if ($_SERVER['REQUEST_METHOD']==='POST'){
            $email = $_POST['email'] ?? '';
            $pass = $_POST['password'] ?? '';
            $um = new User();
            $u = $um->findByEmail($email);
            if ($u && password_verify($pass, $u['password'])){
                Auth::login(['id'=>$u['id'],'name'=>$u['name'],'email'=>$u['email'],'role'=>$u['role']]);
                if ($u['role']==='admin') header('Location: '.BASE_URL.'/admin/index');
                else header('Location: '.BASE_URL.'/dashboard/index');
                exit;
            } else {
                $error = "Credenciales inválidas";
            }
        }
        $this->view('auth/login',['error'=>$error ?? null]);
    }
    public function register() {
        Auth::start();
        if ($_SERVER['REQUEST_METHOD']==='POST'){
            $name=$_POST['name']; $email=$_POST['email']; $pass=$_POST['password'];
            $um = new User();
            $id = $um->create($name,$email,$pass,'child');
            Auth::login(['id'=>$id,'name'=>$name,'email'=>$email,'role'=>'child']);
            header('Location: '.BASE_URL.'/diagnostic/start'); exit;
        }
        $this->view('auth/register');
    }
    public function logout() {
        Auth::logout();
        header('Location: '.BASE_URL.'/auth/login');
    }
}
?>