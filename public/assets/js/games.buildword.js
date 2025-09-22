
(function(){
  function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  function shuffleNotEqual(arr){
    var b = arr.slice(); if (b.length < 2) return b;
    do { b.sort(function(){ return Math.random() - 0.5; }); } while (b.join('') === arr.join(''));
    return b;
  }

  ready(function(){
    var host = document.getElementById('buildword'); if (!host) return;

    // Plantillas de palabras por nivel
    var WORDS = {
      facil: ['casa','luna','mesa','sol','cama','mano','pato','gato','pera','sapo'],
      medio: ['ramo','carta','nubes','tigre','pollo','silla','flor','globo','tren','mar'],
      avanzado: ['escuela','amigo','ventana','montaña','caracol','caballo','juguete','estrella','camiseta','manzana']
    };

    var order = ['facil','medio','avanzado'];
    var levelIdx = 0; // siempre empieza en fácil
    var progress = 0, score = 0;
    var startTime = Date.now();
    var lastWord = null;

    function currentLevel(){ return order[levelIdx]; }
    function currentSet(){ return WORDS[currentLevel()]; }

    // Construir UI
    function render(){
      host.innerHTML =
        '<div class="card">' +
        '  <div class="level">Nivel actual: <strong id="lvl"></strong></div>' +
        '  <div class="bar"><div id="pg" style="height:8px;border-radius:8px;background:#ff5cab;width:0%"></div></div>' +
        '  <div class="area" id="area"></div>' +
        '  <button type="button" class="btn" id="next">Nueva palabra</button>' +
        '</div>';

      document.getElementById('next').onclick = newRound;
      updateUI();
      newRound();
    }

    function updateUI(){
      var lvlText = currentLevel()[0].toUpperCase() + currentLevel().slice(1);
      document.getElementById('lvl').textContent = lvlText;
      var bar = document.getElementById('pg'); if (bar) bar.style.width = progress + '%';
    }

    function maybeAdvance(){
      if (progress >= 100){
        if (typeof saveProgress==='function') saveProgress('buildword', currentLevel(), progress, score);
        if (levelIdx < order.length - 1){
          levelIdx += 1; progress = 0; score = 0; startTime = Date.now();
          updateUI();
          // avisar con modal "pasas de nivel"
          var msg = '¡Genial! Pasas al nivel ' + currentLevel() + ' 🎉';
          if (typeof showFinishModal==='function'){
            showFinishModal({ ok:true, title:'¡Felicitaciones!', msg: msg, onContinue:function(){} });
          } else { alert(msg); }
        } else {
          // nivel avanzado completado
          if (typeof showFinishModal==='function'){
            showFinishModal({ ok:true, title:'¡Excelente!', msg:'¡Completaste todas las palabras!', onContinue:function(){} });
          } else { alert('¡Completaste todas las palabras!'); }
        }
      }
    }

    function newRound(){
      var set = currentSet();
      var word;
      do { word = set[Math.floor(Math.random() * set.length)]; }
      while (word === lastWord && set.length > 1);
      lastWord = word;

      var area = document.getElementById('area');
      area.innerHTML = '';

      // slots vacíos
      var slotsHtml = '';
      for (var i = 0; i < word.length; i++){
        slotsHtml += '<span class="drop-slot" data-letter=""></span>';
      }
      var slotsWrap = document.createElement('div');
      slotsWrap.className = 'slots';
      slotsWrap.innerHTML = slotsHtml;
      area.appendChild(slotsWrap);

      // letras desordenadas y no igual a la palabra
      var letters = word.split('');
      letters = shuffleNotEqual(letters);

      var pool = document.createElement('div');
      pool.className = 'pool';
      letters.forEach(function(ch){
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'drag';
        b.textContent = ch.toUpperCase();
        b.setAttribute('draggable','true');
        b.dataset.letter = ch;

        // drag & drop
        b.addEventListener('dragstart', function(e){ e.dataTransfer.setData('text/plain', ch); });
        // click-to-place (móvil)
        b.addEventListener('click', function(){
          placeLetter(ch, b);
        });

        pool.appendChild(b);
      });
      area.appendChild(pool);

      // configurar slots
      var slots = Array.prototype.slice.call(slotsWrap.querySelectorAll('.drop-slot'));
      slots.forEach(function(s){
        s.addEventListener('dragover', function(e){ e.preventDefault(); });
        s.addEventListener('drop', function(e){
          e.preventDefault();
          var ch = e.dataTransfer.getData('text/plain');
          placeLetter(ch, null, s);
        });
        s.addEventListener('click', function(){
          // limpiar slot
          this.textContent = '';
          this.dataset.letter = '';
          this.classList.remove('filled');
          // reactivar el botón correspondiente si existía
          var btn = pool.querySelector('button.drag[data-letter="'+this.dataset.letter+'"][data-used="1"]');
        });
      });

      function placeLetter(ch, btn, targetSlot){
        // primer slot vacío si no se provee target
        var slot = targetSlot || slots.find(function(x){ return !x.classList.contains('filled'); });
        if (!slot) return;
        slot.textContent = ch.toUpperCase();
        slot.dataset.letter = ch;
        slot.classList.add('filled');
        if (btn){
          btn.disabled = true;
          btn.dataset.used = '1';
          btn.classList.add('used');
        } else {
          // si vino por drag, desactivar el botón que coincide
          var match = Array.prototype.slice.call(pool.querySelectorAll('button.drag')).find(function(b){
            return !b.disabled && b.dataset.letter === ch;
          });
          if (match){
            match.disabled = true; match.dataset.used='1'; match.classList.add('used');
          }
        }
        checkWord();
      }

      function checkWord(){
        var attempt = slots.map(function(s){ return s.dataset.letter || ''; }).join('');
        if (attempt.length === word.length && attempt === word){
          score += 10;
          progress = Math.min(100, progress + 20);
          if (typeof saveProgress==='function') saveProgress('buildword', currentLevel(), progress, score);
          updateUI();
          if (typeof maybeShowFinishOnComplete==='function'){
            maybeShowFinishOnComplete(progress, { timeSec:(Date.now()-startTime)/1000, onContinue:function(){ maybeAdvance(); newRound(); } });
          }
          // preparar siguiente ronda
          setTimeout(function(){
            maybeAdvance();
            newRound();
          }, 400);
        }
      }
    }

    render();
  });
})();
