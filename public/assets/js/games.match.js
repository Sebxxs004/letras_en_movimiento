
(function(){
  function ready(fn){ if (document.readyState!='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    var host = document.getElementById('match');
    if (!host) return;

    var order = ['facil','medio','avanzado'];
    var levelIdx = 0; var startTime = Date.now();
    var progress = 0, score = 0; var startTime = Date.now();

    var pairs = [
      {word:'sol', img:'sol.png'},
      {word:'luna', img:'luna.png'},
      {word:'flor', img:'flor.png'}
    ];

    function render(){
      host.innerHTML = ''
        + '<div class="card"><strong>Nivel actual:</strong> <span id="lvlM"></span></div>'
        + '<div class="progress"><div id="pg6"></div></div>'
        + '<div id="area6" class="grid"></div>';
      updateUI();
      draw();
    }

    function updateUI(){
      var lvlText = order[levelIdx][0].toUpperCase() + order[levelIdx].slice(1);
      document.getElementById('lvlM').textContent = lvlText;
      var bar = document.getElementById('pg6'); if (bar) bar.style.width = progress + '%';
    }

    function maybeAdvance(){
      if (progress >= 100){
        if (typeof saveProgress==='function') saveProgress('match', order[levelIdx], progress, score);
        if (levelIdx < order.length-1){
          (typeof showFinishModal==='function' ? showFinishModal({ ok:true, title:'¡Felicitaciones!', msg: '¡Genial! Pasas al nivel ' + order[levelIdx+1] + ' 🎉' }) : (typeof showFinishModal==='function' ? showFinishModal({ ok:true, title:'¡Felicitaciones!', msg: '¡Genial! Pasas al nivel ' + order[levelIdx+1] + ' 🎉') }) : alert('¡Genial! Pasas al nivel ' + order[levelIdx+1] + ' 🎉')));
          levelIdx++; progress=0; score=0; updateUI(); draw();
        } else {
          (typeof showFinishModal==='function' ? showFinishModal({ ok:true, title:'¡Felicitaciones!', msg: '¡Excelente! Completaste el nivel avanzado 💫' }) : (typeof showFinishModal==='function' ? showFinishModal({ ok:true, title:'¡Felicitaciones!', msg: '¡Excelente! Completaste el nivel avanzado 💫') }) : alert('¡Excelente! Completaste el nivel avanzado 💫')));
        }
      }
    }

    function draw(){
      var area = document.getElementById('area6'); area.innerHTML='';
      var shuffled = pairs.slice().sort(function(){return Math.random()-0.5;});
      shuffled.forEach(function(p){
        var card = document.createElement('div'); card.className='card';
        var root = (function(){ var s=document.querySelector('script[src*=\"games.match.js\"]'); return s ? s.src.split('/assets/js/')[0] : ''; })();
        card.innerHTML = '<img src=\"'+root+'/assets/img/animals/'+p.img+'\" alt=\"'+p.word+'\" style=\"max-width:120px\"><br>'
          + '<input type=\"text\" placeholder=\"Escribe la palabra\">';
        card.querySelector('input').addEventListener('change', function(e){
          if (e.target.value.trim().toLowerCase()===p.word){
            score += 10; progress = Math.min(100, progress + Math.round(100/pairs.length)); updateUI();
            if (typeof saveProgress==='function') saveProgress('match', order[levelIdx], progress, score);
            maybeAdvance();
if (typeof maybeShowFinishOnComplete==='function'){ maybeShowFinishOnComplete(progress, { timeSec:(Date.now()-startTime)/1000 }); }
 if (typeof maybeShowGradeOnComplete==='function'){ maybeShowGradeOnComplete(progress, score); }
          }
        });
        area.appendChild(card);
      });
    }
    render();
  });
})();
