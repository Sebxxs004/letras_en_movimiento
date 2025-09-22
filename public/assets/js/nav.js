
document.addEventListener('DOMContentLoaded', function(){
  var nav = document.querySelector('.nav');
  var toggle = document.getElementById('navToggle');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function(e){
    e.stopPropagation();
    nav.classList.toggle('open');
  });
  document.addEventListener('click', function(e){
    if (!nav.contains(e.target)) nav.classList.remove('open');
  });
});
