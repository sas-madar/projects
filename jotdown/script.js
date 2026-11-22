// Theme toggle: follows the system setting until the visitor picks one.
(function(){
  var root=document.documentElement;
  var btn=document.querySelector('.theme');
  function isDark(){
    var t=root.dataset.theme;
    return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  }
  btn.addEventListener('click',function(){
    var next=isDark()?'light':'dark';
    root.dataset.theme=next;
    try{localStorage.setItem('jd-theme',next)}catch(e){}
  });

  // Non-Windows visitors: point them to the web editor instead of an .exe they can't run.
  var ua=navigator.userAgent||'';
  if(!/Windows/i.test(ua)){
    var hint=document.getElementById('os-hint');
    if(hint)hint.textContent='The desktop app is for Windows. On this device, use the web editor.';
  }
})();
