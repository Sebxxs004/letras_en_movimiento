
(function(){
  function ready(fn){ if (document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

  ready(function(){
    var host = document.getElementById('animalstart');
    if (!host) return;

    // Catálogo. Si no existe la imagen, mostramos emoji/título como respaldo
    var CATALOG = [
      {name:'león',     letter:'l', img:'/assets/img/animals/leon.png', emoji:'🦁'},
      {name:'gato',     letter:'g', img:'/assets/img/animals/gato.png', emoji:'🐱'},
      {name:'oso',      letter:'o', img:'/assets/img/animals/oso.png', emoji:'🐻'},
      {name:'elefante', letter:'e', img:'/assets/img/animals/elefante.png', emoji:'🐘'},
      {name:'zorro',    letter:'z', img:'/assets/img/animals/zorro.png', emoji:'🦊'},
      {name:'loro',     letter:'l', img:'/assets/img/animals/loro.png', emoji:'🦜'},
      {name:'tortuga',  letter:'t', img:'/assets/img/animals/tortuga.png', emoji:'🐢'},
      {name:'vaca',     letter:'v', img:'/assets/img/animals/vaca.png', emoji:'🐮'},
      {name:'pato',     letter:'p', img:'/assets/img/animals/pato.png', emoji:'🦆'},
      {name:'koala',    letter:'k', img:'/assets/img/animals/koala.png', emoji:'🐨'}
    ];

    var levels = ['facil','medio','avanzado'];
    var levelIdx = 0; // siempre comienza en fácil
    var progress = 0, score = 0;
    var startTime = Date.now();
    var lastIdx = -1;

    function current(){ return levels[levelIdx]; }

    function render(){
      host.innerHTML =
        '<div class="card"><strong>Nivel actual:</strong> <span id="lvlA"></span></div>' +
        '<div class="progress"><div id="pgA" style="height:8px;border-radius:8px;background:#ff5cab;width:0%"></div></div>' +
        '<div id="areaA" class="area"></div>';
      updateUI();
      newRound();
    }

    function updateUI(){
      var p = document.getElementById('pgA'); if (p) p.style.width = progress + '%';
      var l = document.getElementById('lvlA'); if (l) l.textContent = cap(current());
    }

    function maybeAdvance(){
      if (progress >= 100){
        if (typeof saveProgress==='function') saveProgress('animalstart', current(), progress, score);
        if (levelIdx < levels.length - 1){
          levelIdx += 1; progress = 0; score = 0; startTime = Date.now();
          updateUI();
          var msg = '¡Genial! Pasas al nivel ' + cap(current()) + ' 🎉';
          if (typeof showFinishModal==='function'){
            showFinishModal({ ok:true, title:'¡Felicitaciones!', msg: msg });
          } else { alert(msg); }
        } else {
          if (typeof showFinishModal==='function'){
            showFinishModal({ ok:true, title:'¡Excelente!', msg:'¡Completaste todas las actividades de animales!' });
          } else { alert('¡Completaste todas las actividades de animales!'); }
        }
      }
    }

    function sampleDifferent(){
      if (CATALOG.length <= 1) return 0;
      var idx;
      do { idx = Math.floor(Math.random()*CATALOG.length); } while (idx === lastIdx);
      lastIdx = idx;
      return idx;
    }

    function uniqueLetters(correct, count){
      var letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','ñ','o','p','q','r','s','t','u','v','w','x','y','z'];
      var set = new Set([correct]);
      while (set.size < count){
        var c = letters[Math.floor(Math.random()*letters.length)];
        set.add(c);
      }
      var arr = Array.from(set);
      // mezclar
      for (var i = arr.length-1; i>0; i--){
        var j = Math.floor(Math.random()*(i+1));
        var t = arr[i]; arr[i]=arr[j]; arr[j]=t;
      }
      return arr;
    }

    function newRound(){
      var idx = sampleDifferent();
      var item = CATALOG[idx];
      var area = document.getElementById('areaA');
      area.innerHTML = '';

      var card = document.createElement('div');
      card.className = 'card';
      card.innerHTML =
        '<div class="animal-view" style="margin:12px 0; display:flex; align-items:center; gap:16px;">' +
        '  <div class="imgWrap" style="width:120px;height:120px;border-radius:16px;overflow:hidden;background:#fff;display:flex;align-items:center;justify-content:center;border:2px dashed #ff5cab;">' +
        '    <img id="animalImg" alt="" style="max-width:100%;max-height:100%;display:none;">' +
        '    <span id="animalEmoji" style="font-size:72px;line-height:1;display:none;"></span>' +
        '  </div>' +
        '  <div>' +
        '    <div style="font-weight:700;font-size:18px;">¿Con qué letra empieza?</div>' +
        '  </div>' +
        '</div>' +
        '<div class="options" style="display:flex;gap:10px;flex-wrap:wrap;"></div>';
      area.appendChild(card);

      // Cargar imagen (si falla, mostrar emoji)
      var img = card.querySelector('#animalImg');
      var emoji = card.querySelector('#animalEmoji');
      var shown = false;
      img.onload = function(){ img.style.display='block'; shown=true; };
      img.onerror = function(){ if (!shown){ emoji.style.display='block'; emoji.textContent = item.emoji || '🐾'; } };
      img.src = (typeof BASE_URL!=='undefined'?BASE_URL:'') + (item.img || '');
      // fallback por si no hay src válido
      if (!item.img) { emoji.style.display='block'; emoji.textContent = item.emoji || '🐾'; }

      var optsWrap = card.querySelector('.options');
      var opts = uniqueLetters(item.letter, 3);
      opts.forEach(function(ch){
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'btn vowel';
        b.textContent = ch.toUpperCase();
        b.addEventListener('click', function(){
          if (ch === item.letter){
            score += 5;
            progress = Math.min(100, progress + 20);
            if (typeof saveProgress==='function') saveProgress('animalstart', current(), progress, score);
            updateUI();
            if (typeof maybeShowFinishOnComplete==='function'){
              maybeShowFinishOnComplete(progress, { timeSec:(Date.now()-startTime)/1000, onContinue:function(){ maybeAdvance(); newRound(); } });
            }
            setTimeout(function(){ maybeAdvance(); newRound(); }, 300);
          } else {
            if (typeof showFinishModal==='function'){
              showFinishModal({ ok:false, title:'¡Sigue intentando!', msg:'Observa la imagen y elige la letra inicial.' });
            }
          }
        });
        optsWrap.appendChild(b);
      });
    }

    render();
  });
})();
