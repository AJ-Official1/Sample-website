const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
const cursorGlow = document.getElementById("cursorGlow");
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }

  draw() {
    ctx.fillStyle = "rgba(0, 245, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const amount = Math.floor((canvas.width * canvas.height) / 12000);

  for (let i = 0; i < amount; i++) {
    particles.push(new Particle());
  }
}

function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.strokeStyle = `rgba(0, 245, 255, ${1 - distance / 120})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  connectParticles();
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

window.addEventListener("mousemove", (event) => {
  cursorGlow.style.left = event.clientX + "px";
  cursorGlow.style.top = event.clientY + "px";
});

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
  });
});

const counters = document.querySelectorAll("[data-target]");
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.target);
    let current = 0;
    const increment = Math.ceil(target / 80);

    function updateCounter() {
      current += increment;

      if (current < target) {
        counter.textContent = current;
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    }

    updateCounter();
  });
}

const revealElements = document.querySelectorAll(
  ".stats, .features, .showcase, .contact"
);

revealElements.forEach((element) => {
  element.classList.add("reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");

        if (entry.target.classList.contains("stats")) {
          startCounters();
        }
      }
    });
  },
  {
    threshold: 0.2,
  }
);

revealElements.forEach((element) => {
  observer.observe(element);
});

const tiltCards = document.querySelectorAll(".tilt");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * -18;
    const rotateY = (x / rect.width - 0.5) * 18;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    formMsg.textContent = "Please fill all fields first.";
    return;
  }

  formMsg.textContent = "Message launched successfully 🚀";
  form.reset();
});
