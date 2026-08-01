(function () {
  'use strict';

  const EGG_IMG = '<img class="icon-inline" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABdUlEQVR4nO3ZQUrDQBTG8c9SLVoLFgRBEPeCG0HwNOLe83gB997BC+hGcOfCjagblbYqKuoiPiHTDgkyLxHm/9sUEvoy9H0zmaQSAAAAAADIzVzTFxw/XH/NOr483Gx8LJLUaeOi/4n7rx7reJWmEkECvAr/tfMh7yRknwB+gLYH0Lbk8yvV3A95rQXZJ6Db9AU/3iYzj3cX+g2PpJB9ApLNq9jct45PLg5r1elvH0maToTVWVnbSroWkIBUhWIJeDo7kCR15geSpM/3Ua16loQQCUjM7S5gnTdVnbfz9jk635ckDfdOJEmv4/vEIyyQgNQFY/f53/PPN8WFl9ZLx22NiNXz2ieQgOQFKzoVdj6c+7EkeCEBqQrZ09rj3WWtp8HwrhDrvCWKp0En7u8D6u4HwjVgsHNcOp96B2hIgFdhS4Ldx21nZ15+dna93qKk6c7b91Y3dnkr7Kmx/+Nur05La0Nsv+Dd8VD2CQAAAAAAAEBuvgGnKXJwTWjXNQAAAABJRU5ErkJggg==" alt="egg">';
  const RUNNY_IMG = '<img class="icon-inline" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABvElEQVR4nO2ZvUoDQRSFjyFRMAYNCIoiFoKCYKMIlgZ8DrG3t7cVW3ux9w0CPoE2gmAlFhG08Sc/qNGsxXoDO+6wS7wzq+z5mg0zcGfYc+69MxuAEEIIIYQQQggheWPI94Ktx9sgbnysOu99LwBQyGLRv4Tzt25TPAlfjqADXAUeVHkT107IvQP4ArLeQNao55dW7pu4qgW5d0DR94If7+3Y8eJw2fNOQnLvALW8suW+KN6+3E0Vp7xyBOCnIyTOxNSyai2gA7QC2RzwfL4DACiUKgCAXreZKp44wYQOUMZZFxDlhSTlZV6ezYttAEB14xQA8Np6UN5hCB2gHdDW5/vznbtw4dGZyLjUCFs8V+cEOkA9YIJSpvJm7ptOkPODrSv8FjpAK5Dc1p7ur1LdBs2uYKsBgnb/76/rIuh/wlkNGF87BpD+PGDWgMrqCYD0d4hBoQO0A0otMO8GpvK97sv3rzC1RXl5Sv+f3TrjV2GXOLsLiBMa9VoAAKXFw8j8580+AGBk6SAy/na9BwCYnFvnP0M+8PZNcHphM6KoOMNUWsZ9kXsHZEajXgt8qx0HHUAIIYQQQgghJId8AVjYhKAxmgwvAAAAAElFTkSuQmCC" alt="egg">';

  const EGGS = {
    runny: { label: 'Runny Yolk', icon: RUNNY_IMG, time: 300 },
    soft: { label: 'Soft Boil', icon: EGG_IMG, time: 360 },
    medium: { label: 'Medium Boil', icon: EGG_IMG, time: 480 },
    hard: { label: 'Hard Boil', icon: EGG_IMG, time: 600 }
  };
  const TOTAL_BLOCKS = 20;
  const INTERACTIVE_SELECTOR = 'button, .egg-btn, [role="button"], a[href], input, select, textarea';

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
  const landingScreen = document.getElementById('landing-screen');

  let currentEgg = null;
  let totalSeconds = 0;
  let remainingSeconds = 0;
  let endTime = null;
  let intervalId = null;
  let paused = false;
  let pausedRemaining = 0;
  let lastTickSecond = null;
  let landingReady = false;

  // Use short MP3 files instead of generated Web Audio tones for stronger
  // iPhone Safari compatibility. Paths are relative to the HTML page.
  const SOUND_FILES = {
    startup: 'startup.wav',
    hover: 'hover.wav',
    click: 'click.mp3',
    tick: 'tick.wav',
    pause: 'pause.wav',
    resume: 'resume.wav',
    home: 'home.wav',
    complete: 'complete.wav'
  };
  const soundVolumes = {
    startup: 0.55, hover: 0.25, click: 0.45, tick: 0.30,
    pause: 0.45, resume: 0.45, home: 0.45, complete: 0.60
  };
  const soundPools = {};
  let startupPlayed = false;

  function createSoundPool(src) {
    return Array.from({ length: 3 }, () => {
      const sound = new Audio(src);
      sound.preload = 'auto';
      sound.playsInline = true;
      return sound;
    });
  }

  function playSound(name) {
    if (!soundPools[name]) soundPools[name] = createSoundPool(SOUND_FILES[name]);
    const pool = soundPools[name];
    const sound = pool.find((item) => item.paused || item.ended) || pool[0];
    sound.pause();
    sound.currentTime = 0;
    sound.volume = soundVolumes[name] || 0.5;
    sound.play().catch(() => {
      // Safari can reject playback before its first genuine tap. The next
      // direct button tap retries it without affecting the egg timer.
    });
  }

  function playStartupSound() { playSound('startup'); }
  function playHoverSound() { playSound('hover'); }
  function playClickSound() { playSound('click'); }
  function playTickSound() { playSound('tick'); }
  function playPauseSound() { playSound('pause'); }
  function playResumeSound() { playSound('resume'); }
  function playHomeSound() { playSound('home'); }
  function playCompletionJingle() { playSound('complete'); }

  function addUiSounds() {
    document.querySelectorAll(INTERACTIVE_SELECTOR).forEach((element) => {
      element.addEventListener('mouseenter', playHoverSound);
      element.addEventListener('click', () => {
        // This first play happens inside a real button tap, as iPhone Safari requires.
        if (!startupPlayed) {
          startupPlayed = true;
          playStartupSound();
        }
        playClickSound();
      });
    });
  }

  function setUpLandingScreen() {
    if (!landingScreen) return;

    setTimeout(() => {
      landingReady = true;
      landingScreen.classList.add('is-ready');
      landingScreen.setAttribute('aria-label', 'Tap or click to enter Tom Khai');
    }, 1650);

    function enterApp() {
      if (!landingReady) return;
      landingScreen.classList.add('is-leaving');
      setTimeout(() => landingScreen.remove(), 500);
    }

    landingScreen.addEventListener('click', enterApp);
    landingScreen.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        enterApp();
      }
    });
  }

  for (let i = 0; i < TOTAL_BLOCKS; i += 1) {
    const block = document.createElement('div');
    block.className = 'progress-block';
    progressTrack.appendChild(block);
  }
  const blocks = Array.from(progressTrack.children);

  function showScreen(screen) {
    [screenSelect, screenConfirm, screenCooking, screenDone].forEach((item) => item.classList.add('hidden'));
    screen.classList.remove('hidden');
    homeBtn.classList.toggle('hidden', screen === screenSelect);
  }

  function goHome() {
    stopInterval();
    document.querySelectorAll('.egg-btn').forEach((button) => button.classList.remove('selected'));
    currentEgg = null;
    playHomeSound();
    showScreen(screenSelect);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  }

  document.querySelectorAll('.egg-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.egg-btn').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      button.classList.remove('pop');
      void button.offsetWidth;
      button.classList.add('pop');
      currentEgg = button.dataset.egg;
      const egg = EGGS[currentEgg];
      selectedLabel.innerHTML = `${egg.icon} ${egg.label}`;
      setTimeout(() => showScreen(screenConfirm), 200);
    });
  });

  homeBtn.addEventListener('click', goHome);
  document.getElementById('change-btn').addEventListener('click', () => showScreen(screenSelect));
  document.getElementById('start-btn').addEventListener('click', startTimer);
  document.getElementById('cook-another-btn').addEventListener('click', goHome);
  document.getElementById('restart-btn').addEventListener('click', startTimer);
  document.getElementById('reset-btn').addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', () => (paused ? resume() : pause()));

  function startTimer() {
    if (!currentEgg) return;
    stopInterval();
    const egg = EGGS[currentEgg];
    totalSeconds = egg.time;
    remainingSeconds = totalSeconds;
    lastTickSecond = remainingSeconds;
    paused = false;
    pauseBtn.textContent = 'Pause';
    cookingTitle.innerHTML = `${egg.label}`;
    cookingEggVisual.innerHTML = egg.icon.replace('icon-inline', 'cooking-egg-img');
    statusText.textContent = 'Cooking...';
    timerDisplay.textContent = formatTime(remainingSeconds);
    updateProgress();
    endTime = Date.now() + totalSeconds * 1000;
    showScreen(screenCooking);
    intervalId = setInterval(tick, 200);
  }

  function tick() {
    if (paused) return;
    const msLeft = endTime - Date.now();
    remainingSeconds = Math.max(0, Math.ceil(msLeft / 1000));
    timerDisplay.textContent = formatTime(remainingSeconds);
    updateProgress();

    if (remainingSeconds !== lastTickSecond) {
      if (remainingSeconds > 0) playTickSound();
      lastTickSecond = remainingSeconds;
    }
    if (msLeft <= 0) {
      stopInterval();
      finishCooking();
    }
  }

  function pause() {
    if (paused) return;
    paused = true;
    pausedRemaining = Math.max(0, endTime - Date.now());
    pauseBtn.textContent = '▶ Resume';
    statusText.textContent = 'Paused';
    playPauseSound();
  }

  function resume() {
    if (!paused) return;
    paused = false;
    endTime = Date.now() + pausedRemaining;
    pauseBtn.textContent = 'Pause';
    statusText.textContent = 'Cooking...';
    playResumeSound();
  }

  function stopInterval() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    paused = false;
  }

  function updateProgress() {
    const elapsed = totalSeconds - remainingSeconds;
    const filledCount = Math.round((elapsed / totalSeconds) * TOTAL_BLOCKS);
    blocks.forEach((block, index) => block.classList.toggle('filled', index < filledCount));
  }

  function finishCooking() {
    playCompletionJingle();
    showScreen(screenDone);
    launchConfetti();
  }

  function launchConfetti() {
    const colors = ['#F7B267', '#8B5E3C', '#FFE89A', '#B8D8A3'];
    for (let i = 0; i < 40; i += 1) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      const duration = 1.6 + Math.random() * 1.4;
      piece.style.animationDuration = `${duration}s`;
      piece.style.animationDelay = `${Math.random() * 0.4}s`;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), (duration + 0.5) * 1000);
    }
  }

  // Start fetching every MP3 on page load. This reduces the first-play delay
  // that can otherwise happen on iPhone Safari.
  function preloadSounds() {
    Object.keys(SOUND_FILES).forEach((name) => {
      if (!soundPools[name]) soundPools[name] = createSoundPool(SOUND_FILES[name]);
      soundPools[name][0].load();
    });
  }

  preloadSounds();
  addUiSounds();
  setUpLandingScreen();
}());
