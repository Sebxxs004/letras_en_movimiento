<?php $page_class = 'page-login'; ?>
<?php if(isset($error)): ?><div class="alert error"><?= $error ?></div><?php endif; ?>
<div class="card">
  <h2>Iniciar sesión</h2>
  <form method="post" class="bloom-glow">
    <label>Email</label>
    <input type="email" name="email" required placeholder="tu@correo.com">
    <label>Contraseña</label>
    <input type="password" name="password" required>
    <button class="btn">Entrar</button>
    <p class="note">Admin por defecto: <?= DEFAULT_ADMIN_EMAIL ?> / <?= DEFAULT_ADMIN_PASSWORD ?></p>
    <p class="note">Niño demo: <?= DEFAULT_CHILD_EMAIL ?> / <?= DEFAULT_CHILD_PASSWORD ?></p>
  </form>
  <p>¿No tienes cuenta? <a href="<?= BASE_URL ?>/auth/register">Regístrate</a></p>
</div>
