function saveProgress(game_key, difficulty, progress, score){
  fetch(BASE_URL + '/games/saveProgress', {
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body: new URLSearchParams({game_key,difficulty,progress,score})
  });
}
const BASE_URL = document.currentScript.src.split('/assets/js/')[0];


// --- Grade Modal Helpers ---
(function(){
  const BASE = typeof BASE_URL!=='undefined' ? BASE_URL : (document.currentScript.src.split('/assets/js/')[0]);
  function ensureModal(){
    if (document.getElementById('gradeOverlay')) return;
    const o = document.createElement('div');
    o.className='grade-overlay'; o.id='gradeOverlay';
    o.innerHTML = '<div class="grade-modal" role="dialog" aria-modal="true">'
      + '<img id="gradeImg" alt="Resultado">'
      + '<h3 id="gradeTitle"></h3>'
      + '<p id="gradeMsg"></p>'
      + '<button class="btn close" id="gradeClose">Cerrar</button>'
      + '</div>';
    document.body.appendChild(o);
    o.addEventListener('click', (e)=>{ if(e.target===o) hide(); });
    o.querySelector('#gradeClose').addEventListener('click', hide);
    function hide(){ o.style.display='none'; }
    window.__gradeHide = hide;
  }
  function show(ok, nota, msg){
    ensureModal();
    const o = document.getElementById('gradeOverlay');
    const img = document.getElementById('gradeImg');
    const title = document.getElementById('gradeTitle');
    const text = document.getElementById('gradeMsg');
    img.src = BASE + (ok? '/assets/img/grade-good.png':'/assets/img/grade-bad.png');
    title.textContent = ok ? '¡Bien hecho!' : '¡Sigue intentando!';
    text.innerHTML = (msg || (ok? '¡Excelente trabajo!':'Aún no llegas a la nota meritoria, ¡tú puedes!'))
                     + ' <br>Tu nota: <b>' + nota.toFixed(1) + '/5</b>';
    o.style.display='flex';
  }
  window.showGradeModal = function(nota, meritoriaMin=4){
    const ok = nota >= meritoriaMin;
    show(ok, nota);
  }
  // Floating button on games pages
  document.addEventListener('DOMContentLoaded', function(){
    if (document.body.classList.contains('page-games')){
      const btn = document.createElement('button');
      btn.className='grade-btn'; btn.textContent='Ver calificación';
      btn.addEventListener('click', function(){
        const progressEl = document.getElementById('pg') || document.getElementById('pg2') || document.getElementById('pg3') || document.getElementById('pg4') || document.getElementById('pg5') || document.getElementById('pg6');
        let pct = 0;
        if (progressEl){
          const w = progressEl.style.width || '0%'; pct = parseInt(w) || 0;
        }
        const nota = Math.max(0, Math.min(5, Math.round((pct/100)*5*10)/10));
        window.showGradeModal(nota);
      });
      document.body.appendChild(btn);
    }
  });
  // Helper for games to auto-show when 100%
  window.maybeShowGradeOnComplete = function(progress, score){
    if (progress>=100){
      const nota = Math.max(0, Math.min(5, Math.round((progress/100)*5*10)/10));
      setTimeout(()=> window.showGradeModal(nota), 200);
    }
  }
})();

// === Finish Modal (un solo botón): Continuar / Jugar de nuevo ===
(function(){
  var BASE = (typeof BASE_URL!=='undefined') ? BASE_URL : '';

  function ensureFinish(){
    var o = document.getElementById('finishOverlay');
    if (o) return;
    o = document.createElement('div');
    o.id = 'finishOverlay';
    o.className = 'finish-overlay';
    o.innerHTML =
      '<div class="finish-modal" role="dialog" aria-modal="true">' +
      '  <img id="finishImg" alt="Resultado">' +
      '  <h2 id="finishTitle">¡Excelente!</h2>' +
      '  <p id="finishText"></p>' +
      '  <div class="row"><button class="btn primary" id="finishPrimary">Continuar</button></div>' +
      '</div>';
    document.body.appendChild(o);

    var primaryBtn = document.getElementById('finishPrimary');
    function hide(){ o.style.display='none'; }
    o.addEventListener('click', function(e){ if (e.target===o) hide(); });
    primaryBtn.addEventListener('click', function(){
      var ok = !!(window.__finishState && window.__finishState.ok);
      if (ok){
        if (typeof window.__onContinueFinish === 'function'){ try{ window.__onContinueFinish(); }catch(_){ } }
        hide();
      } else {
        if (typeof window.__onReplayFinish === 'function'){ try{ window.__onReplayFinish(); }catch(_){ } }
        else { location.reload(); }
        hide();
      }
    });
  }

  window.showFinishModal = function(opts){
    ensureFinish();
    var o = document.getElementById('finishOverlay');
    var img = document.getElementById('finishImg');
    var title = document.getElementById('finishTitle');
    var text = document.getElementById('finishText');
    var btn = document.getElementById('finishPrimary');

    var ok = !(opts && opts.ok === false);
    img.src = BASE + (ok ? '/assets/img/result-good.png' : '/assets/img/result-bad.png');
    title.textContent = (opts && opts.title) || (ok ? '¡Felicitaciones!' : '¡Sigue intentando!');

    var parts = [];
    if (opts && typeof opts.found === 'number' && typeof opts.total === 'number') parts.push('¡Encontraste ' + opts.found + ' de ' + opts.total + '!');
    if (opts && typeof opts.timeSec === 'number'){
      var t = Math.max(0, Math.floor(opts.timeSec));
      var mm = String(Math.floor(t/60)).padStart(2,'0'); var ss = String(t%60).padStart(2,'0');
      parts.push('Tiempo ' + mm + ':' + ss);
    }
    if (opts && typeof opts.attempts === 'number') parts.push(String(opts.attempts) + ' intentos');
    if (opts && typeof opts.note === 'number') parts.push('Tu nota: ' + opts.note.toFixed(1) + '/5');
    text.innerHTML = (opts && opts.msg) || (parts.length ? parts.join(' • ') : (ok ? '¡Excelente trabajo!' : 'Tú puedes, inténtalo de nuevo.'));

    btn.textContent = ok ? ((opts && opts.okText) || 'Continuar') : ((opts && opts.failText) || 'Jugar de nuevo');
    window.__onReplayFinish = (opts && opts.onReplay) || null;
    window.__onContinueFinish = (opts && opts.onContinue) || null;
    window.__finishState = { ok: ok };

    o.style.display = 'flex';
  };

  window.maybeShowFinishOnComplete = function(progress, extra){
    if (progress >= 100){
      var note = Math.max(0, Math.min(5, Math.round((progress/100)*5*10)/10));
      var payload = Object.assign({ note: note, ok: note >= 4 }, extra || {});
      setTimeout(function(){ window.showFinishModal(payload); }, 60);
    }
  };
})();

