/* ============================================
   UNSAIDHOURS-LY — Main JavaScript
   Handles: particles, typing animation, nav,
   scroll reveal, chat UI, mood selector,
   comments, floating bubble, music toggle
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initScrollReveal();
  initTypingAnimation();
  initMoodSelector();
  initChatUI();
  initCommentSection();
  initFloatingBubble();
  initMusicToggle();
});


/* ==============================
   1. PARTICLE BACKGROUND
   Soft floating dots on canvas
   ============================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  // Resize canvas to fill viewport
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.1,
    });
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Move
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`;
      ctx.fill();
    });

    // Draw faint connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(123, 47, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}


/* ==============================
   2. NAVBAR
   Mobile hamburger toggle
   ============================== */
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}


/* ==============================
   3. SCROLL-REVEAL ANIMATIONS
   Fade-in elements on scroll
   ============================== */
function initScrollReveal() {
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));
}


/* ==============================
   4. TYPING ANIMATION
   Hero headline on index page
   ============================== */
function initTypingAnimation() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const text = "You don't have to carry it alone.";
  let i = 0;

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 65);
    }
  }

  // Start typing after a brief delay
  setTimeout(type, 600);
}


/* ==============================
   5. MOOD SELECTOR (Connect page)
   Toggle active state on buttons
   ============================== */
function initMoodSelector() {
  const selector = document.getElementById('moodSelector');
  const matchBtn = document.getElementById('matchBtn');
  if (!selector) return;

  let selectedMood = null;

  selector.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all
      selector.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
      // Set active
      btn.classList.add('active');
      selectedMood = btn.dataset.mood;
    });
  });

  // Random Match Button
  if (matchBtn) {
    matchBtn.addEventListener('click', () => {
      if (!selectedMood) {
        // If no mood selected, pick random one
        const btns = selector.querySelectorAll('.mood-btn');
        const randomBtn = btns[Math.floor(Math.random() * btns.length)];
        randomBtn.classList.add('active');
        selectedMood = randomBtn.dataset.mood;
      }

      matchBtn.textContent = '🔍 Searching...';
      matchBtn.disabled = true;

      // Simulate matching
      setTimeout(() => {
        matchBtn.textContent = '💜 Match Found!';
        // Scroll to chat
        const chat = document.getElementById('chatContainer');
        if (chat) {
          chat.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add initial demo messages after scroll
          setTimeout(() => addDemoMessages(), 600);
        }

        // Reset after a bit
        setTimeout(() => {
          matchBtn.textContent = '✨ Find a Random Match';
          matchBtn.disabled = false;
        }, 3000);
      }, 2000);
    });
  }
}


/* ==============================
   6. CHAT UI DEMO (Connect page)
   Front-end only chat demo
   ============================== */
function initChatUI() {
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  if (!chatMessages || !chatInput || !chatSendBtn) return;

  // Demo responses the "anonymous friend" will use
  const responses = [
    "I hear you. You're not alone in this. 💜",
    "That takes courage to share. Thank you for trusting me.",
    "I've felt that way too. It's more common than you think.",
    "You don't have to have it all figured out. Just take it one moment at a time.",
    "I'm glad you're here tonight. That matters more than you know.",
    "Sometimes just saying it out loud makes it feel a little lighter.",
    "You're doing better than you think. I promise.",
    "It's okay to not be okay. I'm right here with you.",
    "Your feelings are valid. Every single one of them.",
    "Hey — I see you. And I'm not going anywhere. 🌙",
  ];

  function addMessage(text, type) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}`;
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // User sends
    addMessage(text, 'sent');
    chatInput.value = '';

    // Bot responds after delay
    setTimeout(() => {
      const response = responses[Math.floor(Math.random() * responses.length)];
      addMessage(response, 'received');
    }, 1000 + Math.random() * 1500);
  }

  chatSendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

// Called when match is found — adds initial demo conversation
function addDemoMessages() {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages || chatMessages.children.length > 0) return;

  const demoConvo = [
    { text: "Hey... I'm glad you showed up tonight.", type: 'received' },
    { text: "You don't have to talk if you're not ready. Just being here is enough. 🌙", type: 'received' },
  ];

  demoConvo.forEach((msg, i) => {
    setTimeout(() => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.type}`;
      bubble.textContent = msg.text;
      chatMessages.appendChild(bubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, i * 1200);
  });
}


/* ==============================
   7. COMMENT SECTION (Community)
   Front-end only comment submit
   ============================== */
function initCommentSection() {
  const commentInput = document.getElementById('commentInput');
  const commentSubmitBtn = document.getElementById('commentSubmitBtn');
  const commentsList = document.getElementById('commentsList');
  if (!commentInput || !commentSubmitBtn || !commentsList) return;

  const names = [
    'Anonymous Star', 'Anonymous Moon', 'Anonymous Whisper',
    'Anonymous Echo', 'Anonymous Dreamer', 'Anonymous Wanderer',
    'Anonymous Hope', 'Anonymous Spark', 'Anonymous Flower',
  ];

  loadComments();

  commentSubmitBtn.addEventListener('click', () => {
    const text = commentInput.value.trim();
    if (!text) return;

    const comment = {
      name: names[Math.floor(Math.random() * names.length)],
      text: text,
      date: new Date().getTime()
    };

    let comments = JSON.parse(localStorage.getItem('communityComments')) || [];
    comments.unshift(comment);
    localStorage.setItem('communityComments', JSON.stringify(comments));

    commentInput.value = '';
    loadComments();
  });

  function loadComments() {
    let comments = JSON.parse(localStorage.getItem('communityComments')) || [];
    const now = new Date().getTime();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    // Remove old comments
    comments = comments.filter(c => now - c.date < sevenDays);
    localStorage.setItem('communityComments', JSON.stringify(comments));

    commentsList.innerHTML = '';

    comments.forEach(c => {
      const commentEl = document.createElement('div');
      commentEl.className = 'comment-item';
      commentEl.innerHTML = `
        <div class="comment-author">${c.name}</div>
        <p>${escapeHTML(c.text)}</p>
      `;
      commentsList.appendChild(commentEl);
    });
  }
}
/* ==============================
   8. FLOATING BUBBLE
   "You are not alone" message
   ============================== */
function initFloatingBubble() {
  const bubble = document.getElementById('floatingBubble');
  if (!bubble) return;

  const messages = [
    "💜 You are not alone",
    "🌙 You matter",
    "💛 It's okay to rest",
    "🌿 Breathe. You're here.",
    "✨ One day at a time",
    "💜 Someone cares about you",
  ];

  let index = 0;

  bubble.addEventListener('click', () => {
    index = (index + 1) % messages.length;
    bubble.style.transform = 'scale(0.9)';
    setTimeout(() => {
      bubble.textContent = messages[index];
      bubble.style.transform = 'scale(1)';
    }, 200);
  });
}


/* ==============================
   9. MUSIC TOGGLE
   Ambient audio play/pause
   Uses Web Audio API to generate
   a soft ambient tone (no file needed)
   ============================== */
function initMusicToggle() {
  const btn = document.getElementById('musicToggle');
  if (!btn) return;

  let audioCtx = null;
  let isPlaying = false;
  let nodes = [];

  function createAmbient() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Create a gentle ambient drone with multiple oscillators
    const frequencies = [130.81, 196.0, 261.63, 329.63]; // C3, G3, C4, E4

    frequencies.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime); // Very quiet

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();

      nodes.push({ osc, gain });
    });

    // Add slow volume modulation for atmosphere
    nodes.forEach((node, i) => {
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.setValueAtTime(0.1 + i * 0.05, audioCtx.currentTime);
      lfoGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(node.gain.gain);
      lfo.start();
      nodes.push({ osc: lfo, gain: lfoGain });
    });
  }

  btn.addEventListener('click', () => {
    if (!isPlaying) {
      if (!audioCtx) {
        createAmbient();
      } else {
        audioCtx.resume();
      }
      isPlaying = true;
      btn.classList.add('playing');
      btn.textContent = '🎶';
      btn.title = 'Pause ambient music';
    } else {
      if (audioCtx) audioCtx.suspend();
      isPlaying = false;
      btn.classList.remove('playing');
      btn.textContent = '🎵';
      btn.title = 'Play ambient music';
    }
  });
}
