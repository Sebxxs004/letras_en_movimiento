<div class="card">
  <h2>Resultado del diagnóstico</h2>
  <p>Tu nota: <strong><?= $score ?></strong> / 5</p>
  <p>Nivel de déficit: <strong><?= strtoupper($level) ?></strong> (alto=mayor apoyo, bajo=menor)</p>
  <div class="alert info"><?= htmlspecialchars($message) ?></div>
  <a class="btn" href="<?= BASE_URL ?>/games/index">Ir a juegos</a>
</div>
