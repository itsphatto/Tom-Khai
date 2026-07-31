(function(){
  const EGG_IMG = '<img class="icon-inline" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABdUlEQVR4nO3ZQUrDQBTG8c9SLVoLFgRBEPeCG0HwNOLe83gB997BC+hGcOfCjagblbYqKuoiPiHTDgkyLxHm/9sUEvoy9H0zmaQSAAAAAADIzVzTFxw/XH/NOr483Gx8LJLUaeOi/4n7rx7reJWmEkECvAr/tfMh7yRknwB+gLYH0Lbk8yvV3A95rQXZJ6Db9AU/3iYzj3cX+g2PpJB9ApLNq9jct45PLg5r1elvH0maToTVWVnbSroWkIBUhWIJeDo7kCR15geSpM/3Ua16loQQCUjM7S5gnTdVnbfz9jk635ckDfdOJEmv4/vEIyyQgNQFY/f53/PPN8WFl9ZLx22NiNXz2ieQgOQFKzoVdj6c+7EkeCEBqQrZ09rj3WWtp8HwrhDrvCWKp0En7u8D6u4HwjVgsHNcOp96B2hIgFdhS4Ldx21nZ15+dna93qKk6c7b91Y3dnkr7Kmx/+Nur05La0Nsv+Dd8VD2CQAAAAAAAEBuvgGnKXJwTWjXNQAAAABJRU5ErkJggg==" alt="egg">';
  const RUNNY_IMG = '<img class="icon-inline" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABvElEQVR4nO2ZvUoDQRSFjyFRMAYNCIoiFoKCYKMIlgZ8DrG3t7cVW3ux9w0CPoE2gmAlFhG08Sc/qNGsxXoDO+6wS7wzq+z5mg0zcGfYc+69MxuAEEIIIYQQQggheWPI94Ktx9sgbnysOu99LwBQyGLRv4Tzt25TPAlfjqADXAUeVHkT107IvQP4ArLeQNao55dW7pu4qgW5d0DR94If7+3Y8eJw2fNOQnLvALW8suW+KN6+3E0Vp7xyBOCnIyTOxNSyai2gA7QC2RzwfL4DACiUKgCAXreZKp44wYQOUMZZFxDlhSTlZV6ezYttAEB14xQA8Np6UN5hCB2gHdDW5/vznbtw4dGZyLjUCFs8V+cEOkA9YIJSpvJm7ptOkPODrSv8FjpAK5Dc1p7ur1LdBs2uYKsBgnb/76/rIuh/wlkNGF87BpD+PGDWgMrqCYD0d4hBoQO0A0otMO8GpvK97sv3rzC1RXl5Sv+f3TrjV2GXOLsLiBMa9VoAAKXFw8j8580+AGBk6SAy/na9BwCYnFvnP0M+8PZNcHphM6KoOMNUWsZ9kXsHZEajXgt8qx0HHUAIIYQQQgghJId8AVjYhKAxmgwvAAAAAElFTkSuQmCC" alt="egg">';

  const EGGS = {
    runny:   { label: "Runny Yolk",  icon: RUNNY_IMG, time: 300 },
    soft:    { label: "Soft Boil",   icon: EGG_IMG, time: 360 },
    medium:  { label: "Medium Boil", icon: EGG_IMG, time: 480 },
    hard:    { label: "Hard Boil",   icon: EGG_IMG, time: 600 }
  };
  const TOTAL_BLOCKS = 20;

  const screenSelect = document.getElementById('screen-select');
  const screenConfirm = document.getElementById('screen-confirm');
  const screenCooking = document.getElementById('screen-cooking');
  const screenDone = document.getElementById('screen-done');

  const selectedLabel = document.getElementById('selected-label');
  const cookingTitle = document.getElementById('cooking-title');
  const statusText = document.getElementById('status-text');
  const timerDisplay = document.getElementById('timer-display');
  const progressTrack = document.getElementById('progress-track');
  const pauseBtn = document.getElementById('pause-btn');
  const homeBtn = document.getElementById('home-btn');
  const cookingEggVisual = document.getElementById('cooking-egg-visual');

  let currentEgg = null;
  let totalSeconds = 0;
  let remainingSeconds = 0;
  let endTime = null;       
  let intervalId = null;
  let paused = false;
  let pausedRemaining = 0;

  for(let i=0;i<TOTAL_BLOCKS;i++){
    const b = document.createElement('div');
    b.className = 'progress-block';
    progressTrack.appendChild(b);
  }
  const blocks = Array.from(progressTrack.children);

  function showScreen(el){
    [screenSelect, screenConfirm, screenCooking, screenDone].forEach(s => s.classList.add('hidden'));
    el.classList.remove('hidden');
    homeBtn.classList.toggle('hidden', el === screenSelect);
  }

  function goHome(){
    stopInterval();
    document.querySelectorAll('.egg-btn').forEach(b => b.classList.remove('selected'));
    currentEgg = null;
    showScreen(screenSelect);
  }

  homeBtn.addEventListener('click', goHome);

  function formatTime(sec){
    const m = Math.floor(sec/60).toString().padStart(2,'0');
    const s = Math.floor(sec%60).toString().padStart(2,'0');
    return m + ':' + s;
  }

  // egg selection
  document.querySelectorAll('.egg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.egg-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      btn.classList.remove('pop');
      void btn.offsetWidth; // restart animation
      btn.classList.add('pop');

      currentEgg = btn.dataset.egg;
      const egg = EGGS[currentEgg];
      selectedLabel.innerHTML = egg.icon + ' ' + egg.label;

      setTimeout(() => showScreen(screenConfirm), 200);
    });
  });

  document.getElementById('change-btn').addEventListener('click', () => {
    showScreen(screenSelect);
  });

  document.getElementById('start-btn').addEventListener('click', () => {
    startTimer();
  });

  document.getElementById('cook-another-btn').addEventListener('click', goHome);

  document.getElementById('restart-btn').addEventListener('click', () => {
    startTimer();
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    startTimer();
  });

  pauseBtn.addEventListener('click', () => {
    if(!paused){
      pause();
    } else {
      resume();
    }
  });

  function startTimer(){
    if(!currentEgg) return;
    stopInterval();

    const egg = EGGS[currentEgg];
    totalSeconds = egg.time;
    remainingSeconds = totalSeconds;
    paused = false;
    pauseBtn.textContent = 'Pause';

    cookingTitle.innerHTML = egg.icon + ' ' + egg.label;
    cookingEggVisual.innerHTML = egg.icon.replace('icon-inline', 'cooking-egg-img');
    statusText.textContent = 'Cooking...';
    timerDisplay.textContent = formatTime(remainingSeconds);
    updateProgress();

    endTime = Date.now() + totalSeconds * 1000;
    showScreen(screenCooking);

    intervalId = setInterval(tick, 200);
  }

  function tick(){
    if(paused) return;
    const msLeft = endTime - Date.now();
    remainingSeconds = Math.max(0, Math.ceil(msLeft/1000));
    timerDisplay.textContent = formatTime(remainingSeconds);
    updateProgress();

    if(msLeft <= 0){
      stopInterval();
      finishCooking();
    }
  }

  function pause(){
    if(paused) return;
    paused = true;
    pausedRemaining = endTime - Date.now();
    pauseBtn.textContent = '▶ Resume';
    statusText.textContent = 'Paused';
  }

  function resume(){
    if(!paused) return;
    paused = false;
    endTime = Date.now() + pausedRemaining;
    pauseBtn.textContent = 'Pause';
    statusText.textContent = 'Cooking...';
  }

  function stopInterval(){
    if(intervalId){
      clearInterval(intervalId);
      intervalId = null;
    }
    paused = false;
  }

  function updateProgress(){
    const elapsed = totalSeconds - remainingSeconds;
    const filledCount = Math.round((elapsed/totalSeconds) * TOTAL_BLOCKS);
    blocks.forEach((b, i) => {
      b.classList.toggle('filled', i < filledCount);
    });
  }

  function finishCooking(){
    playBeep();
    showScreen(screenDone);
    launchConfetti();
  }

  function launchConfetti(){
    const colors = ['#F7B267', '#8B5E3C', '#FFE89A', '#B8D8A3'];
    for(let i=0;i<40;i++){
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random()*100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random()*colors.length)];
      const duration = 1.6 + Math.random()*1.4;
      piece.style.animationDuration = duration + 's';
      piece.style.animationDelay = (Math.random()*0.4) + 's';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), (duration+0.5)*1000);
    }
  }

  // 
  function playBeep(){
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [660, 880, 990];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + i*0.18);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i*0.18 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i*0.18 + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i*0.18);
        osc.stop(ctx.currentTime + i*0.18 + 0.26);
      });
    }catch(e){ /* audio not available, ignore */ }
  }

})();