
(function(){
  function ready(fn){ if(document.readyState!='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function(){
    var host = document.getElementById('wordsearch');
    if (!host) return;

    var order = ['facil','medio','avanzado'];
    var levelIdx = 0;
    var progress = 0, score = 0;
    var grids = {
      facil:{grid:['CASAFLOR','PERROAGU','SOLMARLA','LUNAMESA','GATONUBE','RIOPANEZ','ARBOLITO','PLATOUVA'], words:['CASA','FLOR','SOL']},
      medio:{grid:['BARCOCIE','LUNAROSA','CIELORIO','PERROGAT','LIBROAVE','PLATOMAR','CASANUBE','SOLARBOL'], words:['BARCO','LIBRO','NUBE']},
      avanzado:{grid:['CIENTIFI','ASTRONAU','PROFESOR','COCHEMESA','GIRASOLE','ELEFANTE','MARIPOSA','JIRAFALE'], words:['ELEFANTE','MARIPOSA','JIRAFA']}
    };

    var isDown=false, start=null, cells=[], found={};

    function render(){
      host.innerHTML = ''
        + '<div class="card"><strong>Nivel actual:</strong> <span id="lvlW"></span></div>'
        + '<div class="progress"><div id="pg4"></div></div>'
        + '<ul id="legend" class="mt-2"></ul>'
        + '<div id="area4"></div>';
      updateUI();
      draw();
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
          (typeof showFinishModal==='function' ? showFinishModal({ ok:true, title:'¡Felicitaciones!', msg: '¡Genial! Pasas al nivel ' + order[levelIdx+1] + ' 🎉' }) : (typeof showFinishModal==='function' ? showFinishModal({ ok:true, title:'¡Felicitaciones!', msg: '¡Genial! Pasas al nivel ' + order[levelIdx+1] + ' 🎉') }) : alert('¡Genial! Pasas al nivel ' + order[levelIdx+1] + ' 🎉')));
          levelIdx++; progress=0; score=0; updateUI(); draw();
        } else {
          (typeof showFinishModal==='function' ? showFinishModal({ ok:true, title:'¡Felicitaciones!', msg: '¡Excelente! Completaste el nivel avanzado 💫' }) : (typeof showFinishModal==='function' ? showFinishModal({ ok:true, title:'¡Felicitaciones!', msg: '¡Excelente! Completaste el nivel avanzado 💫') }) : alert('¡Excelente! Completaste el nivel avanzado 💫')));
        }
      }
    }

    function draw(){
      var cfg = grids[ order[levelIdx] ];
      var legend = document.getElementById('legend');
      legend.innerHTML='';
      cfg.words.forEach(function(w){
        var li = document.createElement('li'); li.textContent=w; li.dataset.word=w;
        legend.appendChild(li);
      });

      var area = document.getElementById('area4'); area.innerHTML='';

      var tbl = document.createElement('table'); tbl.className='wordgrid';
      cells = []; found = {};
      for (var i=0;i<cfg.grid.length;i++){
        var tr=document.createElement('tr'); cells[i]=[];
        for (var j=0;j<cfg.grid[i].length;j++){
          (function(i,j){
            var td=document.createElement('td');
td.classList && td.classList.add('ws-cell');
            td.textContent=cfg.grid[i][j];
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
      area.appendChild(tbl);

      var msg = document.createElement('p');
      msg.textContent='Arrastra desde la primera a la última letra (horizontal/vertical/diagonal).';
      area.appendChild(msg);
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
      var cfg = grids[ order[levelIdx] ];
      var match = cfg.words.find(function(w){ return w===word || w===rev; });
      if (match && !found[match]){
        path.forEach(function(p){ cells[p.i][p.j].classList.add('ws-found'); });
        found[match]=true;
        var li = document.querySelector('li[data-word=\"'+match+'\"]');
        if (li){ li.style.textDecoration='line-through'; li.style.opacity='0.6'; }
        score += 10; progress = Math.min(100, progress + Math.round(100/cfg.words.length)); updateUI();
        if (typeof saveProgress==='function') saveProgress('wordsearch', order[levelIdx], progress, score);
        maybeAdvance();
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
        path.push({i:i,j:j});
        if (path.length>128) break;
      }
      return path;
    }

    render();
  });
})();
