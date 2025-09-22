
(function(){
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

  ready(function(){
    var host = document.getElementById('dictation');
    if (!host) return;

    var levels = ['facil','medio','avanzado'];
    var levelIdx = 0; // siempre inicia en fácil
    var progress = 0, score = 0;
    var startTime = Date.now();
    var lastIdx = -1;

    var SETS = {
      facil: ['Hola mamá', 'Yo veo el sol', 'Mi gato come', 'Ana toma agua', 'Me gusta leer'],
      medio: ['La niña salta la cuerda', 'El barco navega en el río', 'La flor huele bien', 'Mi hermano juega fútbol', 'La tortuga camina lento'],
      avanzado: ['El astronauta viaja al espacio', 'El científico observa la luna', 'El profesor explica la lección', 'El pianista practica la melodía', 'La investigadora escribe su informe']
    };

    function current(){ return levels[levelIdx]; }
    function phrases(){ return SETS[current()]; }

    function render(){
      host.innerHTML =
        '<div class="card"><strong>Nivel actual:</strong> <span id="lvlD"></span></div>' +
        '<div class="progress"><div id="pg2" style="height:8px;border-radius:8px;background:#ff5cab;width:0%"></div></div>' +
        '<div id="area2" class="area"></div>';

      updateUI();
      newRound();
    }

    function updateUI(){
      var lvlText = cap(current());
      document.getElementById('lvlD').textContent = lvlText;
      var bar = document.getElementById('pg2'); if (bar) bar.style.width = progress + '%';
    }

    function maybeAdvance(){
      if (progress >= 100){
        if (typeof saveProgress==='function') saveProgress('dictation', current(), progress, score);
        if (levelIdx < levels.length - 1){
          levelIdx += 1; progress = 0; score = 0; startTime = Date.now();
          updateUI();
          var msg = '¡Genial! Pasas al nivel ' + cap(current()) + ' 🎉';
          if (typeof showFinishModal==='function'){
            showFinishModal({ ok:true, title:'¡Felicitaciones!', msg: msg });
          } else { alert(msg); }
        }else{
          if (typeof showFinishModal==='function'){
            showFinishModal({ ok:true, title:'¡Excelente!', msg:'¡Completaste todas las frases!', onContinue:function(){} });
          } else { alert('¡Completaste todas las frases!'); }
        }
      }
    }

    function speak(text){
      try {
        var u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        speechSynthesis.speak(u);
      } catch(_) {}
    }

    function nextPhraseIndex(){
      var arr = phrases();
      if (arr.length <= 1) return 0;
      var idx;
      do { idx = Math.floor(Math.random() * arr.length); } while (idx === lastIdx);
      lastIdx = idx;
      return idx;
    }

    function newRound(){
      var idx = nextPhraseIndex();
      var text = phrases()[idx];
      var area = document.getElementById('area2');
      area.innerHTML = '';

      var card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = '<button type="button" class="btn say">Escuchar</button> ' + '<input type="text" class="in" placeholder="Escribe la frase aquí" autocomplete="off">' + ' <button type="button" class="btn primary check">Verificar</button>';
      area.appendChild(card);
      card.querySelector('.say').addEventListener('click', function(){ speak(text); });
      var input = card.querySelector('.in');

      input.addEventListener('keydown', function(e){
        if (e.key === 'Enter') input.blur();
      });

      function normalize(s){
  s = (s || '').toLowerCase();
  // quitar acentos aeiou (no tocar ñ)
  s = s
    .replace(/[áàäâã]/g,'a')
    .replace(/[éèëê]/g,'e')
    .replace(/[íìïî]/g,'i')
    .replace(/[óòöôõ]/g,'o')
    .replace(/[úùüû]/g,'u');
  // dejar solo letras (a-z y ñ) y espacios
  s = s.replace(/[^a-zñ\s]/g,'');
  // colapsar espacios
  s = s.replace(/\s+/g,' ').trim();
  return s;
}
var checkBtn = card.querySelector('.check');
      function doVerify(){
        var ok = normalize(input.value) === normalize(text);
        if (ok){
          score += 10;
          progress = Math.min(100, progress + 25);
          if (typeof saveProgress==='function') saveProgress('dictation', current(), progress, score);
          updateUI();
          if (typeof maybeShowFinishOnComplete==='function'){
            maybeShowFinishOnComplete(progress, { timeSec:(Date.now()-startTime)/1000, onContinue:function(){ maybeAdvance(); newRound(); } });
          }
          if (typeof showFinishModal==='function'){
            showFinishModal({ ok:true, title:'¡Felicitaciones!', msg:'¡Muy bien! Frase correcta.', onContinue:function(){ maybeAdvance(); newRound(); } });
          } else {
            alert('¡Correcto!');
            maybeAdvance(); newRound();
          }
        } else {
          if (typeof showFinishModal==='function'){
            showFinishModal({ ok:false, title:'¡Sigue intentando!', msg:'Revisa mayúsculas, tildes y espacios.' });
          } else {
            alert('Sigue intentando');
          }
        }
      }
      checkBtn.addEventListener('click', doVerify);
      input.addEventListener('keydown', function(e){ if (e.key==='Enter'){ e.preventDefault(); doVerify(); }});
    }

    render();
  });
})();