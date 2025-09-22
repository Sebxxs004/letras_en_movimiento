
(function(){
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  ready(function(){
    var host = document.getElementById('vowels');
    if (!host) return;

    var VOX = ['a','e','i','o','u'];
    var levels = ['facil','medio','avanzado'];
    var levelIdx = 0; // siempre inicia en fácil
    var progress = 0, score = 0;
    var startTime = Date.now();
    var lastTarget = null;

    function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
    function current(){ return levels[levelIdx]; }

    function render(){
      host.innerHTML =
        '<div class="card"><strong>Nivel actual:</strong> <span id="lvlV"></span></div>' +
        '<div class="progress"><div id="pgV" style="height:8px;border-radius:8px;background:#ff5cab;width:0%"></div></div>' +
        '<div id="areaV" class="area"></div>';

      updateUI();
      newRound();
    }

    function updateUI(){
      var bar = document.getElementById('pgV');
      if (bar) bar.style.width = progress + '%';
      var t = document.getElementById('lvlV');
      if (t) t.textContent = cap(current());
    }

    function speakVowel(v){
      try{
        var u = new SpeechSynthesisUtterance(v);
        u.lang = 'es-ES';
        speechSynthesis.speak(u);
      }catch(_){}
    }

    function randomChoices(target){
      // tomar 2 diferentes al target
      var others = VOX.filter(function(x){ return x !== target; });
      // mezclar
      for (var i = others.length-1; i>0; i--){
        var j = Math.floor(Math.random()*(i+1));
        var tmp = others[i]; others[i]=others[j]; others[j]=tmp;
      }
      var opts = [target, others[0], others[1]];
      // mezclar final
      for (var k = opts.length-1; k>0; k--){
        var j2 = Math.floor(Math.random()*(k+1));
        var t2 = opts[k]; opts[k]=opts[j2]; opts[j2]=t2;
      }
      return opts;
    }

    function maybeAdvance(){
      if (progress >= 100){
        if (typeof saveProgress==='function') saveProgress('vowels', current(), progress, score);
        if (levelIdx < levels.length-1){
          levelIdx += 1; progress = 0; score = 0; startTime = Date.now();
          updateUI();
          var msg = '¡Genial! Pasas al nivel ' + cap(current()) + ' 🎉';
          if (typeof showFinishModal==='function'){
            showFinishModal({ ok:true, title:'¡Felicitaciones!', msg: msg });
          } else { alert(msg); }
        } else {
          if (typeof showFinishModal==='function'){
            showFinishModal({ ok:true, title:'¡Excelente!', msg:'¡Completaste todas las actividades de vocales!' });
          } else { alert('¡Completaste todas las actividades de vocales!'); }
        }
      }
    }

    function newRound(){
      // target que no repita el anterior
      var target;
      do { target = VOX[Math.floor(Math.random()*VOX.length)]; } while (lastTarget === target && VOX.length > 1);
      lastTarget = target;

      var area = document.getElementById('areaV');
      area.innerHTML = '';

      var card = document.createElement('div');
      card.className = 'card';
      card.innerHTML =
        '<button type="button" class="btn say">Escuchar</button>' +
        '<div class="options" style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;"></div>';
      area.appendChild(card);

      var say = card.querySelector('.say');
      say.addEventListener('click', function(){ speakVowel(target); });
      // auto-pronunciar al iniciar ronda
      setTimeout(function(){ speakVowel(target); }, 250);

      var optsWrap = card.querySelector('.options');
      var options = randomChoices(target);
      options.forEach(function(v){
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn vowel';
        b.textContent = v.toUpperCase();
        b.addEventListener('click', function(){
          if (v === target){
            score += 5;
            progress = Math.min(100, progress + 20);
            if (typeof saveProgress==='function') saveProgress('vowels', current(), progress, score);
            updateUI();
            if (typeof maybeShowFinishOnComplete==='function'){
              maybeShowFinishOnComplete(progress, { timeSec:(Date.now()-startTime)/1000, onContinue:function(){ maybeAdvance(); newRound(); } });
            }
            // siguiente ronda directa si no se abrió modal
            setTimeout(function(){ maybeAdvance(); newRound(); }, 300);
          } else {
            if (typeof showFinishModal==='function'){
              showFinishModal({ ok:false, title:'¡Sigue intentando!', msg:'Escucha de nuevo y elige la vocal correcta.' });
            }
          }
        });
        optsWrap.appendChild(b);
      });
    }

    render();
  });
})();
