(function () { 
  'use strict';

  const RUNNY_IMG = '<img class="icon-inline" src="data:image/png;base64,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" alt="runny yolk egg">';
  const SOFT_IMG = '<img class="icon-inline" src="data:image/png;base64,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" alt="soft boil egg">';
  const MEDIUM_IMG = '<img class="icon-inline" src="data:image/png;base64,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" alt="medium boil egg">';
  const HARD_IMG = '<img class="icon-inline" src="data:image/png;base64,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" alt="hard boil egg">';

  const EGGS = {
    runny: { label: 'Runny Yolk', icon: RUNNY_IMG, time: 300 },
    soft: { label: 'Soft Boil', icon: SOFT_IMG, time: 360 },
    medium: { label: 'Medium Boil', icon: MEDIUM_IMG, time: 480 },
    hard: { label: 'Hard Boil', icon: HARD_IMG, time: 600 }
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