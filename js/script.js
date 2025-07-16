// ================== MATRIX ANIMATION ==================
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = 'アァイゥエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array.from({ length: columns }, () => 1);

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0F0';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const char = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}
setInterval(drawMatrix, 33);

// ================== TYPING EFFECT - TITLE ==================
const title = "MATRIX CHAT PORTAL";
const titleEl = document.getElementById("mystery-title");
let titleIndex = 0;

function typeTitle() {
  if (titleIndex < title.length) {
    titleEl.innerHTML += title.charAt(titleIndex);
    titleIndex++;
    setTimeout(typeTitle, 100);
  }
}
typeTitle();

// ================== TYPING EFFECT - ABOUT ==================
const aboutText = `
Bu ilova orqali real vaqtda bir nechta foydalanuvchi bir-biri bilan suhbatlashishi mumkin.
Maxfiylik, tezlik va xavfsizlik — bizning ustuvorliklarimizdan biridir.
Harakat qilishga tayyormisiz?`;

const aboutEl = document.querySelector(".about p");
let aboutIndex = 0;

function typeAbout() {
  if (aboutIndex < aboutText.length) {
    aboutEl.innerHTML += aboutText.charAt(aboutIndex);
    aboutIndex++;
    setTimeout(typeAbout, 35);
  }
}
setTimeout(typeAbout, 2500); // Matrix fon va title yozilganidan keyin boshlansin

// ================== LOGIN LOGIC (DB.JSON BILAN) ==================
const loginForm = document.getElementById('loginForm');
const API_URL = "http://localhost:3000/users";

// LOGIN LOGIC (yangilangan)
// login.js
loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const emailInput = document.getElementById('email').value.trim();
  const passwordInput = document.getElementById('password').value.trim();

  fetch("http://localhost:3000/users")
    .then(res => res.json())
    .then(users => {
      const user = users.find(u => u.email === emailInput && u.password === passwordInput);
      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        alert("Kirish muvaffaqiyatli!");
        window.location.href = "chat.html";
      } else {
        alert("Noto‘g‘ri email yoki parol");
      }
    });
});

