
(function(){
  function ready(fn){ if(document.readyState!='loading'){ fn(); } else { document.addEventListener('DOMContentLoaded', fn); } }
  ready(function(){
    try {
      var BASE = (window.BASE_URL) ? window.BASE_URL :
        (function(){ var s=document.querySelector('script[src*="/assets/js/diagnostic.js"]'); return s ? s.src.split('/assets/js/')[0] : ''; })();

      var app = document.getElementById('diag-app');
      if (!app) return;

      app.innerHTML = ''
        + '<form id="diagForm" action="'+ BASE +'/diagnostic/submit" method="post">'
        + '  <section class="card">'
        + '    <h3>1) Arrastra letras para formar la palabra</h3>'
        + '    <div id="lettersGame"></div>'
        + '    <input type="hidden" name="letters_score" id="letters_score" value="0">'
        + '  </section>'
        + '  <section class="card">'
        + '    <h3>2) Escribe la frase que escuches</h3>'
        + '    <div id="dictationGame"></div>'
        + '    <input type="hidden" name="phrases_score" id="phrases_score" value="0">'
        + '  </section>'
        + '  <section class="card">'
        + '    <h3>3) ¿Qué vocal escuchas?</h3>'
        + '    <div id="vowelGame"></div>'
        + '    <input type="hidden" name="vowels_score" id="vowels_score" value="0">'
        + '  </section>'
        + '  <button class="btn">Terminar</button>'
        + '</form>';

      // --- 1) Build word ---
      var words = ['casa','perro','luna','sol','flor','mesa','coche','gato','nube','rio'];
      function shuffledNotEqual(arr){
        var b = arr.slice();
        do { b.sort(function(){return Math.random()-0.5;}); } while(b.join('')===arr.join(''));
        return b;
      }
      function renderBuildWord(target, count){ var lastWord=null;
        var correct = 0;
        for (var i=0;i<count;i++){
          var word; do { word = words[Math.floor(Math.random()*words.length)]; } while(word===lastWord && words.length>1); lastWord = word;
          var div = document.createElement('div');
          div.className = 'card';
          var slots = '';
          for (var j=0;j<word.length;j++){ slots += '<span class="drop-slot" data-letter=""></span>'; }
          var shuf = shuffledNotEqual(word.split(''));
          var letters = shuf.map(function(l){
            return '<span class="drag-letter" draggable="true" data-letter="'+ l +'">'+ l.toUpperCase() +'</span>';
          }).join('');
          div.innerHTML = '<p>Palabra: <strong>'+ '•'.repeat(word.length) +'</strong></p><div>'+ slots +'</div><div>'+ letters +'</div>';
          target.appendChild(div);
          Array.prototype.forEach.call(div.querySelectorAll('.drag-letter'), function(el){
            el.addEventListener('dragstart', function(e){ e.dataTransfer.setData('text/plain', el.getAttribute('data-letter')); });
          });
          Array.prototype.forEach.call(div.querySelectorAll('.drop-slot'), function(slot, idx){
            slot.addEventListener('dragover', function(e){ e.preventDefault(); });
            slot.addEventListener('drop', function(e){
              var l = e.dataTransfer.getData('text/plain');
              slot.textContent = l.toUpperCase();
              slot.setAttribute('data-letter', l);
              var built = Array.prototype.map.call(div.querySelectorAll('.drop-slot'), function(s){ return s.getAttribute('data-letter') || ''; }).join('');
              if (built.length===word.length && built===word){ correct++; updateScore(); }
            });
          });
        }
        function updateScore(){
          // 0..5, cada palabra correcta suma ~3, cap en 5
          document.getElementById('letters_score').value = Math.min(5, correct*3);
        }
      }
      renderBuildWord(document.getElementById('lettersGame'), 2);

      // --- 2) Dictation ---
      var phrases = ['La luna brilla en el cielo','El perro corre en el parque','Me gusta leer cuentos'];
      function shuffleArray(a){ for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t;} return a; }
      function renderDictation(target){
        var score = 0;
        shuffleArray(phrases.slice()).forEach(function(text){
          var div = document.createElement('div');
          div.className='card';
          div.innerHTML = '<button type="button" class="btn say">Escuchar frase</button> <input type="text" class="phraseInput" placeholder="Escribe aquí">';
          target.appendChild(div);
          div.querySelector('.say').onclick = function(e){ e.preventDefault(); try { var u=new SpeechSynthesisUtterance(text); u.lang='es-ES'; speechSynthesis.speak(u);}catch(_){} };
          div.querySelector('.phraseInput').addEventListener('change', function(e){
            if (e.target.value.trim().toLowerCase()===text.toLowerCase()){ score++; update(); }
          });
        });
        function update(){
          document.getElementById('phrases_score').value = Math.min(5, Math.round((score/3)*5));
        }
      }
      renderDictation(document.getElementById('dictationGame'));

      // --- 3) Vowel identification (no repetidas) ---
      function renderVowels(target){
        var desired = 5; // máximo 5 sin repetir
        var level = 'facil'; // diagnóstico fijo
        var rounds = Math.min(5, level==='facil'?3: level==='medio'?5:7);
        var vowels = ['a','e','i','o','u'];
        var seq = vowels.slice().sort(function(){return Math.random()-0.5;}).slice(0, rounds);
        var correct = 0;
        for (var i=0;i<rounds;i++){
          var v = seq[i];
          var div = document.createElement('div'); div.className='card';
          var choices = vowels.slice().sort(function(){return Math.random()-0.5;}).slice(0,3);
          if (choices.indexOf(v)===-1) choices[Math.floor(Math.random()*choices.length)] = v;
          div.innerHTML = '<button type="button" class="btn listen">Escuchar</button> <span class="choices"></span>';
          div.querySelector('.listen').onclick = (function(vowel){
  return function(ev){ ev.preventDefault(); try{ var u=new SpeechSynthesisUtterance(vowel); u.lang='es-ES'; speechSynthesis.speak(u);}catch(_){} };
})(v);
          var ch = div.querySelector('.choices');
          choices.forEach(function(c){
            var b = document.createElement('button'); b.className='btn'; b.type='button'; b.textContent=c.toUpperCase();
            b.onclick = function(letter, btn){
              return function(e){ if(e) e.preventDefault(); if (letter===v){ correct++; updateV(); btn.textContent += ' ✓'; } else { btn.textContent += ' ✗'; } btn.disabled=true; };
            }(c, b);
            ch.appendChild(b);
          });
          target.appendChild(div);
        }
        function updateV(){
          document.getElementById('vowels_score').value = Math.min(5, correct*2);
        }
      }
      renderVowels(document.getElementById('vowelGame'));

    } catch (e) {
      console.error('diagnostic.js error', e);
      var el = document.getElementById('diag-app');
      if (el) el.innerHTML = '<p style="color:#c00">Ocurrió un error cargando el diagnóstico. Revisa la consola.</p>';
    }
  });
})();
