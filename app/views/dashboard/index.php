<div class="hero">
  <h1>¡Hola, <?= htmlspecialchars($user['name']) ?>!</h1>
  <p>Bienvenido a <strong><?= APP_NAME ?></strong>. ¡Aprendamos jugando! 🎈</p>
  <?php if($needsDiagnostic): ?>
    <a class="btn big" href="<?= BASE_URL ?>/diagnostic/start">Hacer diagnóstico inicial</a>
  <?php else: ?>
    <a class="btn big" href="<?= BASE_URL ?>/games/index">Continuar con los juegos</a>
  <?php endif; ?>
</div>
<div class="card">
  <h3>Tu progreso</h3>
  <?php if(empty($progress)): ?>
    <p>Aún no tienes progreso. ¡Empieza un juego!</p>
  <?php else: ?>
    <table>
      <tr><th>Juego</th><th>Dificultad</th><th>Progreso</th><th>Puntaje</th></tr>
      <?php foreach($progress as $p): ?>
        <tr>
          <td><?= $p['game_key'] ?></td>
          <td><?= $p['difficulty'] ?></td>
          <td><?= $p['progress'] ?>%</td>
          <td><?= $p['score'] ?>/100</td>
        </tr>
      <?php endforeach; ?>
    </table>
  <?php endif; ?>
</div>
