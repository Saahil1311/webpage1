// HTML5 Canvas background particle system for floating emojis
const canvas = document.getElementById('emoji-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const emojis = ['😢', '😭', '😔', '💔', '🥺', '😞', '🙁', '😿'];
const particleCount = 45; // balanced for good density without clutter

// Handle resizing
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Emoji Particle Class
class EmojiParticle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.emoji = emojis[Math.floor(Math.random() * emojis.length)];
    this.size = Math.random() * 24 + 16; // sizes between 16px and 40px
    this.x = Math.random() * canvas.width;
    
    // If initial load, distribute across screen vertically, else spawn from bottom
    this.y = initial ? Math.random() * canvas.height : canvas.height + this.size;
    
    // Drifts slowly upward and left/right
    this.speedY = -(Math.random() * 0.6 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.4;
    
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.01;
    
    // Opacity pulse/drift
    this.opacity = Math.random() * 0.4 + 0.1; // low opacities so they stay in background
    this.opacityDirection = Math.random() > 0.5 ? 0.005 : -0.005;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;

    // Loop opacity
    this.opacity += this.opacityDirection;
    if (this.opacity > 0.55 || this.opacity < 0.05) {
      this.opacityDirection = -this.opacityDirection;
    }

    // Reset if it moves off screen top or sides
    if (this.y < -this.size || this.x < -this.size || this.x > canvas.width + this.size) {
      this.reset(false);
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.font = `${this.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.emoji, 0, 0);
    ctx.restore();
  }
}

// Initialise particles
function init() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new EmojiParticle());
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  requestAnimationFrame(animate);
}

// Run particle system
init();
animate();
