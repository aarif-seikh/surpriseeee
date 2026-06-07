/* ─────────────── CURSOR ─────────────── */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => {
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
  }, 60);
});

/* ─────────────── PARTICLES ─────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.6 + 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;
    const hue = Math.random() > 0.6 ? '212, 168, 83' : '200, 54, 94';
    this.color = `rgba(${hue}, ${this.opacity})`;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.life++;
    if (this.life > this.maxLife) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ─────────────── OPEN BUTTON ─────────────── */
document.getElementById('openBtn').addEventListener('click', () => {
  const welcome = document.getElementById('welcome');
  const main = document.getElementById('main-content');

  welcome.style.transition = 'opacity 1s, transform 1s';
  welcome.style.opacity = '0';
  welcome.style.transform = 'scale(0.97)';

  setTimeout(() => {
    welcome.style.display = 'none';
    main.style.display = 'block';
    // Play background music (mp.mpeg)
    music.play().catch(() => {});
    musicBtn.classList.add('playing');
    isPlaying = true;
    musicBtn.innerHTML = '⏸';
    // trigger scroll reveal
    setTimeout(observeReveal, 100);
    // trigger song notification observer
    setTimeout(observeSongSection, 100);
  }, 1000);
});

/* ─────────────── SCROLL REVEAL ─────────────── */
function observeReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ─────────────── GALLERY REVEAL ─────────────── */
function revealImg(card) {
  const img = card.querySelector('img');
  const hint = card.querySelector('.reveal-hint');
  
  if (card.classList.contains('revealed')) {
    // Already revealed — do nothing or toggle back
    return;
  }
  
  card.classList.add('revealed');
  if (img) img.classList.add('revealed');
  if (hint) hint.style.opacity = '0';
  spawnHearts(5);
}

/* ─────────────── MUSIC (background - mp.mpeg) ─────────────── */
const music = document.getElementById('music');
const musicBtn = document.getElementById('musicBtn');
let isPlaying = false;

musicBtn.addEventListener('click', () => {
  if (isPlaying) {
    music.pause();
    musicBtn.innerHTML = '♪';
    musicBtn.classList.remove('playing');
  } else {
    music.play().catch(() => {});
    musicBtn.innerHTML = '⏸';
    musicBtn.classList.add('playing');
  }
  isPlaying = !isPlaying;
});

/* ─────────────── FLOATING HEARTS ─────────────── */
function spawnHearts(n = 1) {
  const icons = ['❤️','🌹','💕','💖','💗'];
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.classList.add('heart-float');
      el.innerHTML = icons[Math.floor(Math.random() * icons.length)];
      el.style.left = Math.random() * 100 + 'vw';
      el.style.fontSize = (16 + Math.random() * 14) + 'px';
      el.style.animationDuration = (3.5 + Math.random() * 2) + 's';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 6000);
    }, i * 200);
  }
}
setInterval(() => spawnHearts(1), 2200);

/* ─────────────── FALLING PETALS ─────────────── */
const petalEmojis = ['🌹','🌸','💮','🌺','🌷'];
function spawnPetal() {
  const el = document.createElement('div');
  el.classList.add('petal');
  el.innerHTML = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (18 + Math.random() * 16) + 'px';
  const dur = 6 + Math.random() * 6;
  el.style.animationDuration = dur + 's';
  el.style.opacity = 0.6 + Math.random() * 0.4;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), dur * 1000);
}
setInterval(spawnPetal, 800);

/* ─────────────── SONG PLAYER (song2_mp4.mpeg - Wanna Be Yours) ─────────────── */
function toggleSong() {
  const audio = document.getElementById('songAudio');
  const icon  = document.getElementById('songIcon');
  const bars  = document.getElementById('eqBars');
  
  if (audio.paused) {
    audio.currentTime = 5; // skip first 5 seconds
    audio.play().catch((err) => {
      console.error('Song play error:', err);
    });
    icon.textContent = '⏸';
    bars.classList.add('active');
  } else {
    audio.pause();
    icon.textContent = '▶';
    bars.classList.remove('active');
  }
}

/* ─────────────── NOTIFICATION HANDLER ─────────────── */
let songNotificationShown = false;

function closeSongNotification() {
  const notif = document.getElementById('songNotification');
  if (notif) {
    notif.style.display = 'none';
  }
}

function stopBgAndPlaySong() {
  // Stop background music
  music.pause();
  isPlaying = false;
  musicBtn.innerHTML = '♪';
  musicBtn.classList.remove('playing');
  
  // Close notification
  closeSongNotification();
  
  // Play Wanna Be Yours
  const audio = document.getElementById('songAudio');
  const icon  = document.getElementById('songIcon');
  const bars  = document.getElementById('eqBars');
  audio.currentTime = 5; // skip first 5 seconds
  audio.play().catch(() => {});
  icon.textContent = '⏸';
  bars.classList.add('active');
}

// Show notification when song section comes into view
function observeSongSection() {
  const songBlock = document.querySelector('.song-block');
  if (!songBlock) return;
  
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !songNotificationShown) {
        const notif = document.getElementById('songNotification');
        if (notif) {
          notif.style.display = 'flex';
          songNotificationShown = true;
          // Auto-close after 7 seconds
          setTimeout(() => {
            closeSongNotification();
          }, 7000);
        }
      }
    });
  }, { threshold: 0.3 });
  
  obs.observe(songBlock);
}

/* ─────────────── INIT ─────────────── */
document.addEventListener('DOMContentLoaded', function() {
  // Make gallery cards clickable — single listener, no conflict
  const cards = document.querySelectorAll('.gallery-card');
  cards.forEach((card) => {
    card.addEventListener('click', function(e) {
      e.stopPropagation();
      revealImg(this);
    });
  });
});