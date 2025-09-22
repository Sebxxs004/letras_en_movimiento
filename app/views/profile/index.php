<div class="card">
  <h2>Mi perfil</h2>
  <p><strong>Nombre:</strong> <?= htmlspecialchars($user['name']) ?></p>
  <p><strong>Email:</strong> <?= htmlspecialchars($user['email']) ?></p>
</div>
<div class="card">
  <h3>Mis estrellas</h3>
  <?php if(empty($stars)): ?><p>Aún no tienes estrellas. ¡Completa juegos al 100%!</p>
  <?php else: ?>
    <ul>
      <?php foreach($stars as $s): ?>
      <li>⭐ <?= $s['game_key'] ?> (<?= $s['difficulty'] ?>): <?= $s['cnt'] ?></li>
      <?php endforeach; ?>
    </ul>
  <?php endif; ?>
</div>
<div class="card">
  <h3>Historial de juegos</h3>
  <?php if(empty($hist)): ?><p>Sin historial.</p>
  <?php else: ?>
  <table>
    <tr><th>Juego</th><th>Dificultad</th><th>Progreso</th><th>Puntaje</th><th>Fecha</th></tr>
    <?php foreach($hist as $h): ?>
      <tr>
        <td><?= $h['game_key'] ?></td>
        <td><?= $h['difficulty'] ?></td>
        <td><?= $h['progress'] ?>%</td>
        <td><?= $h['score'] ?>/100</td>
        <td><?= $h['updated_at'] ?></td>
      </tr>
    <?php endforeach; ?>
  </table>
  <?php endif; ?>
</div>
<div class="card">
  <a class="btn" href="<?= BASE_URL ?>/certificate/generate">Descargar certificado (si completaste todo avanzado)</a>
</div>
