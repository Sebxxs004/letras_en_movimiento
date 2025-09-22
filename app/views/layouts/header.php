<?php Auth::start(); $user = Auth::user(); $uri = $_SERVER['REQUEST_URI'] ?? ''; if (!isset($page_class)) { if (strpos($uri, '/auth/login')!==false || strpos($uri, '/auth/register')!==false) { $page_class='page-login'; } elseif (strpos($uri, '/games')!==false) { $page_class='page-games'; } else { $page_class=''; } } ?>
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= APP_NAME ?></title>
<link rel="stylesheet" href="<?= BASE_URL ?>/assets/css/main.css">
<link rel="icon" type="image/png" sizes="32x32" href="<?= BASE_URL ?>/assets/img/favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="<?= BASE_URL ?>/assets/img/favicon-192.png">
<link rel="apple-touch-icon" href="<?= BASE_URL ?>/assets/img/favicon-180.png">
<link rel="shortcut icon" href="<?= BASE_URL ?>/assets/img/favicon.ico">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="<?= isset($page_class)?$page_class:'' ?>">
<nav class="nav">
  <div class="brand"><img src="<?= BASE_URL ?>/assets/img/logo.png" alt="Logo <?= APP_NAME ?>" class="brand-logo"> <span class="brand-text"><?= APP_NAME ?></span></div>
  <button class="toggle" id="navToggle" aria-label="Menú">☰</button>
  <div class="links">
    <?php if($user): ?>
      <?php if(isset($user['role']) && $user['role']==='admin'): ?>
        <a href="<?= BASE_URL ?>/auth/logout">Salir</a>
      <?php else: ?>
        <a href="<?= BASE_URL ?>/dashboard/index">Inicio</a>
        <a href="<?= BASE_URL ?>/games/index">Juegos</a>
        <a href="<?= BASE_URL ?>/profile/index">Perfil</a>
        <a href="<?= BASE_URL ?>/auth/logout">Salir</a>
      <?php endif; ?>
    <?php else: ?>
      <a href="<?= BASE_URL ?>/auth/login">Entrar</a>
      <a href="<?= BASE_URL ?>/auth/register">Registro</a>
    <?php endif; ?>
  </div>
</nav>
<main class="container">
