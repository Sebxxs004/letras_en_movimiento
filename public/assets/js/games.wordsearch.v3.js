
(function(){
  function ready(fn){ if(document.readyState!='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    var host = document.getElementById('wordsearch');
    if (!host) return;

    var order = ['facil','medio','avanzado'];
    var levelIdx = 0; var startTime = Date.now();
    var progress = 0, score = 0; var startTime = Date.now();

    // Vocabularios más amplios
    var vocab = {
      facil:    ['CASA','SOL','FLOR','RIO','GATO','MESA','LAGO','LUNA','ARCO','PAN','NUBE','COLA'],
      medio:    ['BARCO','LIBRO','NUBE','PLATO','LUNA','RATON','CAMPO','COSTA','FARO','BOTELLA','CARRO','ARBUSTO'],
      avanzado: ['ELEFANTE','MARIPOSA','JIRAFA','PROFESOR','COCHE','CIENTIFICO','ASTRONAUTA','TELESCOPIO','GIRASOL']
    };

    var isDown=false, start=null, cells=[], found={}, legendEl=null, areaEl=null, currentWords=[];

    function render(){
      host.innerHTML = ''
        + '<div class="card"><strong>Nivel actual:</strong> <span id="lvlW"></span></div>'
        + '<div class="progress"><div id="pg4"></div></div>'
        + '<ul id="legend" class="mt-2"></ul>'
        + '<div id="area4"></div>'
        + '<div id="ws-msg" class="mt-2"></div>';
      legendEl = document.getElementById('legend');
      areaEl = document.getElementById('area4');
      updateUI();
      buildNewPuzzle();
    }

    function updateUI(){
      var lvlText = order[levelIdx][0].toUpperCase() + order[levelIdx].slice(1);
      document.getElementById('lvlW').textContent = lvlText;
      var bar = document.getElementById('pg4'); if (bar) bar.style.width = progress + '%';
    }

    function maybeAdvance(){
      if (progress >= 100){
        if (typeof saveProgress==='function') saveProgress('wordsearch', order[levelIdx], progress, score);
        if (levelIdx < order.length-1){
          banner('¡Nivel completado! Pasas a <b>' + order[levelIdx+1] + '</b> 🎉');
          levelIdx++; progress=0; score=0; updateUI(); buildNewPuzzle();
        } else {
          banner('¡Excelente! Completaste el nivel avanzado 💫');
        }
      }
    }

    function banner(html){
      var msg = document.getElementById('ws-msg');
      msg.innerHTML = '<div class="card" style="background:#fff0f6">'+html+'</div>';
      setTimeout(function(){ msg.innerHTML=''; }, 2500);
    }

    function pickWords(){
      var pool = vocab[ order[levelIdx] ].slice();
      // Cantidad por nivel
      var n = (levelIdx===0 ? 4 : levelIdx===1 ? 5 : 6);
      // mezclar
      for (var i=pool.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=pool[i]; pool[i]=pool[j]; pool[j]=t; }
      return pool.slice(0,n);
    }

    function buildNewPuzzle(){
      // seleccionar palabras y generar grilla
      currentWords = pickWords();
      // leyenda
      legendEl.innerHTML='';
      currentWords.forEach(function(w){ var li=document.createElement('li'); li.textContent=w; li.dataset.word=w; legendEl.appendChild(li); });

      var size = Math.max(10, Math.min(14, longest(currentWords)+3));
      var res = generateGrid(size, currentWords);
      drawGrid(res.grid);
      found = {}; // reset
    }

    function longest(arr){ var m=0; arr.forEach(function(w){ if(w.length>m) m=w.length; }); return m; }

    var DIRS = [
      {di:0,dj:1},   // →
      {di:0,dj:-1},  // ←
      {di:1,dj:0},   // ↓
      {di:-1,dj:0},  // ↑
      {di:1,dj:1},   // ↘
      {di:1,dj:-1},  // ↙
      {di:-1,dj:1},  // ↗
      {di:-1,dj:-1}  // ↖
    ];

    function generateGrid(size, words){
      // crea una matriz size x size con ''
      var grid = new Array(size); for (var i=0;i<size;i++){ grid[i]=new Array(size); for (var j=0;j<size;j++) grid[i][j]=''; }

      function canPlace(w, i, j, di, dj){
        for (var k=0;k<w.length;k++){
          var r=i+di*k, c=j+dj*k;
          if (r<0||c<0||r>=size||c>=size) return false;
          var ch = grid[r][c];
          if (ch!=='' && ch!==w[k]) return false;
        }
        return true;
      }
      function place(w){
        // intenta ubicar la palabra en direcciones aleatorias y posiciones aleatorias
        var tries = 400;
        while(tries--){
          var dir = DIRS[Math.floor(Math.random()*DIRS.length)];
          var i = Math.floor(Math.random()*size), j = Math.floor(Math.random()*size);
          // ajustar para que quepa (opcional, canPlace ya lo revisa)
          if (canPlace(w,i,j,dir.di,dir.dj)){
            for (var k=0;k<w.length;k++){ grid[i+dir.di*k][j+dir.dj*k] = w[k]; }
            return true;
          }
        }
        return false;
      }

      // Colocar todas; si falla, aumentar tamaño y reintentar
      for (var idx=0; idx<words.length; idx++){
        var w = words[idx];
        if (!place(w)){
          return generateGrid(size+1, words); // recursivo, aumenta el tamaño
        }
      }

      // Relleno con letras aleatorias sólo en celdas vacías
      var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (var r=0;r<size;r++){
        for (var c=0;c<size;c++){
          if (grid[r][c]===''){
            grid[r][c] = alphabet[Math.floor(Math.random()*alphabet.length)];
          }
        }
      }
      return {grid:grid};
    }

    function drawGrid(grid){
      areaEl.innerHTML='';
      var tbl = document.createElement('table'); tbl.className='wordgrid';
      cells = [];
      for (var i=0;i<grid.length;i++){
        var tr=document.createElement('tr'); cells[i]=[];
        for (var j=0;j<grid[i].length;j++){
          (function(i,j){
            var td=document.createElement('td');
td.classList && td.classList.add('ws-cell');
            td.textContent=grid[i][j];
            td.dataset.i=i; td.dataset.j=j; td.className='ws-cell';
            td.onmousedown=function(e){ e.preventDefault(); clearTemp(); isDown=true; start={i:i,j:j}; td.classList.add('ws-sel'); };
            td.onmouseenter=function(){ if (isDown) hoverTo(i,j); };
            td.onmouseup=function(){ endDrag(i,j); };
            tr.appendChild(td);
            cells[i][j]=td;
          })(i,j);
        }
        tbl.appendChild(tr);
      }
      tbl.onmouseleave=function(){ if(isDown){ clearTemp(); isDown=false; } };
      document.addEventListener('mouseup', function(){ if(isDown){ clearTemp(); isDown=false; } });
      areaEl.appendChild(tbl);

      var msg = document.getElementById('ws-msg');
      msg.innerHTML = '<div class="card" style="background:#eef">Busca: <b>'+ currentWords.join(', ') +'</b></div>';
    }

    function hoverTo(i,j){
      clearTemp();
      var path = linePath(start.i, start.j, i, j);
      path.forEach(function(p){ cells[p.i][p.j].classList.add('ws-sel'); });
    }

    function endDrag(i,j){
      if (!isDown) return;
      isDown=false;
      var path = linePath(start.i, start.j, i, j);
      var word = path.map(function(p){ return cells[p.i][p.j].textContent; }).join('');
      var rev  = word.split('').reverse().join('');
      var match = currentWords.find(function(w){ return w===word || w===rev; });
      if (match && !found[match]){
        path.forEach(function(p){ cells[p.i][p.j].classList.add('ws-found'); });
        found[match]=true;
        var li = document.querySelector('li[data-word=\"'+match+'\"]');
        if (li){ li.style.textDecoration='line-through'; li.style.opacity='0.6'; }
        score += 10; progress = Math.min(100, progress + Math.round(100/currentWords.length)); updateUI();
        if (typeof saveProgress==='function') saveProgress('wordsearch', order[levelIdx], progress, score);

        // ¿completó todas las palabras de la sopa actual?
        var allFound = currentWords.every(function(w){ return !!found[w]; });
        if (allFound){
          if (typeof showFinishModal==='function'){ showFinishModal({ ok:true, title:'¡Sopa completada!', found: currentWords.length, total: currentWords.length, timeSec:(Date.now()-startTime)/1000 }); }
          banner('¡Excelente! ¡Encontraste todas las palabras! 🌟');
          // Cargar otra sopa diferente
          setTimeout(buildNewPuzzle, 900);
        }
        maybeAdvance();
if (typeof maybeShowFinishOnComplete==='function'){ maybeShowFinishOnComplete(progress, { timeSec:(Date.now()-startTime)/1000 }); }
 if (typeof maybeShowGradeOnComplete==='function'){ maybeShowGradeOnComplete(progress, score); }
      } else {
        clearTemp();
      }
    }

    function clearTemp(){
      var tds = document.querySelectorAll('.ws-cell.ws-sel');
      tds.forEach(function(td){ td.classList.remove('ws-sel'); });
    }

    function linePath(i1,j1,i2,j2){
      var di = Math.sign(i2-i1), dj = Math.sign(j2-j1);
      var straight = (di===0 && dj!==0) || (dj===0 && di!==0) || (Math.abs(di)===1 && Math.abs(dj)===1);
      if (!straight) return [{i:i1,j:j1}];
      var path=[{i:i1,j:j1}], i=i1, j=j1;
      while(i!==i2 || j!==j2){
        i+=di; j+=dj;
        if (i<0||j<0||i>=cells.length||j>=cells[0].length) break;
        path.push({i:i,j:j});
        if (path.length>256) break;
      }
      return path;
    }

    render();
  });
})();
