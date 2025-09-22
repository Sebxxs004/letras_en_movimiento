<div class="card">
  <h2>Panel de Administrador</h2>
  <p>Total de niños: <strong><?= $total ?></strong></p>
  <canvas id="levelsPie"></canvas>
</div>
<script>
const data = {
  labels: ['Déficit alto','Déficit medio','Déficit bajo'],
  datasets: [{
    data: [<?= $levels['alto'] ?? 0 ?>, <?= $levels['medio'] ?? 0 ?>, <?= $levels['bajo'] ?? 0 ?>]
  }]
};
new Chart(document.getElementById('levelsPie'), { type:'pie', data });
</script>
<div class="card">
  <h3>Estrellas por juego</h3>
  <?php if(empty($stars)): ?><p>Sin estrellas aún.</p>
  <?php else: ?>
    <ul>
      <?php foreach($stars as $s): ?>
      <li><?= $s['game_key'] ?>: <?= $s['cnt'] ?> ⭐</li>
      <?php endforeach; ?>
    </ul>
  <?php endif; ?>
</div>
<div class="card">
  <h3>Últimos diagnósticos</h3>
  <?php if(empty($diags)): ?><p>No hay diagnósticos.</p>
  <?php else: ?>
    <table>
      <tr><th>Niño</th><th>Nota</th><th>Nivel</th><th>Fecha</th></tr>
      <?php foreach($diags as $d): ?>
      <tr><td><?= $d['name'] ?></td><td><?= $d['score'] ?></td><td><?= $d['level'] ?></td><td><?= $d['created_at'] ?></td></tr>
      <?php endforeach; ?>
    </table>
  <?php endif; ?>
</div>
