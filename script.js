/* ── GIF BACKGROUND ── */
const bgEl = document.getElementById('bg');
const bgVideo = document.getElementById('bg-video');
const gifBtns = document.querySelectorAll('.gif-btn');
const bgStorageKey = 'nocry-background';
let bgSwitchToken = 0;

function getPreferredBg() {
  try {
    return localStorage.getItem(bgStorageKey);
  } catch {
    return null;
  }
}

function savePreferredBg(src) {
  try {
    localStorage.setItem(bgStorageKey, src);
  } catch {}
}

/* ── GIF FADE SWITCH ── */
function setBg(src, btn) {
  const token = ++bgSwitchToken;
  const videoSrc = btn?.dataset.video;
  const posterSrc = btn?.dataset.poster || src;

  bgEl.classList.add('fading');
  bgVideo.classList.remove('visible');

  setTimeout(() => {
    if (token !== bgSwitchToken) return;

    bgEl.style.backgroundImage = `url('${posterSrc}')`;

    if (videoSrc) {
      if (!bgVideo.src.endsWith(videoSrc)) {
        bgVideo.src = videoSrc;
        bgVideo.load();
      }

      bgVideo.play().then(() => {
        if (token !== bgSwitchToken) return;
        bgVideo.classList.add('visible');
      }).catch(() => {
        if (token !== bgSwitchToken) return;
        bgEl.style.backgroundImage = `url('${src}')`;
        bgVideo.classList.remove('visible');
      });
    } else {
      bgVideo.pause();
      bgVideo.removeAttribute('src');
      bgVideo.load();
      bgEl.style.backgroundImage = `url('${src}')`;
    }

    bgEl.classList.remove('fading');
  }, 380);

  gifBtns.forEach(b => {
    const isActive = b === btn;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-pressed', String(isActive));
  });
  savePreferredBg(src);
}

gifBtns.forEach(btn => {
  btn.addEventListener('click', () => setBg(btn.dataset.gif, btn));
});

// Set default
const savedBg = getPreferredBg();
const initialGifBtn = [...gifBtns].find(btn => btn.dataset.gif === savedBg) || gifBtns[0];
setBg(initialGifBtn.dataset.gif, initialGifBtn);

/* ── AUDIO ── */
const audio = document.getElementById('bg-audio');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');
const waves = document.getElementById('audio-waves');
const label = document.getElementById('audio-label');
const audioToggle = document.getElementById('audio-toggle');
let playing = false;

audio.volume = 0.10;

function setAudioState(isPlaying, text) {
  playing = isPlaying;
  iconPlay.hidden = isPlaying;
  iconPause.hidden = !isPlaying;
  waves.classList.toggle('paused', !isPlaying);
  label.textContent = text;
  audioToggle.setAttribute('aria-pressed', String(isPlaying));
  audioToggle.setAttribute('aria-label', isPlaying ? 'Pausar música de fundo' : 'Tocar música de fundo');
}

function startAudio() {
  audio.play().then(() => {
    setAudioState(true, 'Yesterday Don\'t Mean Shit');
  }).catch(() => {
    setAudioState(false, 'clique para tocar música');
  });
}

function toggleAudio() {
  if (playing) {
    audio.pause();
    setAudioState(false, 'pausado');
  } else {
    startAudio();
  }
}

audio.addEventListener('play', () => setAudioState(true, 'Yesterday Don\'t Mean Shit'));
audio.addEventListener('pause', () => setAudioState(false, 'pausado'));
audioToggle.addEventListener('click', toggleAudio);

/* ── CUSTOM CURSOR ── */
const cur = document.getElementById('cursor');
const curRing = document.getElementById('cursor-ring');
const card = document.querySelector('.card');
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

if (hasFinePointer) {
  document.body.classList.add('custom-cursor-active');

  let ringFrame = 0;
  let ringX = 0;
  let ringY = 0;

  document.addEventListener('mousemove', e => {
    cur.style.left = e.clientX + 'px';
    cur.style.top = e.clientY + 'px';
    ringX = e.clientX;
    ringY = e.clientY;
    document.body.classList.add('cursor-ready');

    if (!ringFrame) {
      ringFrame = requestAnimationFrame(() => {
        curRing.style.left = ringX + 'px';
        curRing.style.top = ringY + 'px';
        ringFrame = 0;
      });
    }
  });

  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-ready');
  });

  document.addEventListener('mousedown', () => { cur.style.transform = 'translate(-50%,-50%) scale(0.6)'; });
  document.addEventListener('mouseup', () => { cur.style.transform = 'translate(-50%,-50%) scale(1)'; });

  card.addEventListener('pointermove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
}
