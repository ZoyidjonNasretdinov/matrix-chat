// ================== Matrix background ==================
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = 'アァイカキABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
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

// ================== Chat logic ==================

const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const chatBox = document.getElementById('chat-box');

// Login tekshirish
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  alert("Avval tizimga kiring!");
  window.location.href = "login.html";
}

const currentUserEmail = loggedInUser.email;
const chatPartnerEmail = currentUserEmail === "user1@example.com"
  ? "user2@example.com"
  : "user1@example.com";

// JSON Server API
const API_URL = "http://localhost:3000/messages";

// Xabar yuborish
form.addEventListener('submit', (e) => {
  e.preventDefault(); // refresh bo‘lmasligi uchun
  const msg = input.value.trim();
  if (!msg) return;

  const message = {
    sender: currentUserEmail,
    receiver: chatPartnerEmail,
    text: msg,
    timestamp: new Date().toISOString()
  };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  }).then(() => {
    addMessage(msg, 'self');
    input.value = '';

    // Javob yozamiz
    setTimeout(() => {
      const botReply = {
        sender: chatPartnerEmail,
        receiver: currentUserEmail,
        text: "Men Matrix botman. Xabaringiz qabul qilindi.",
        timestamp: new Date().toISOString(),
        animated: true
      };

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(botReply)
      }).then(loadMessages);
    }, 1000);
  });
});

// Xabarlarni yuklash
function loadMessages() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      chatBox.innerHTML = '';
      const messages = data.filter(m =>
        (m.sender === currentUserEmail && m.receiver === chatPartnerEmail) ||
        (m.sender === chatPartnerEmail && m.receiver === currentUserEmail)
      );

      messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      const lastMsgIndex = messages.length - 1;

      messages.forEach((msg, index) => {
        const isSelf = msg.sender === currentUserEmail;
        const shouldAnimate = !isSelf && msg.animated && index === lastMsgIndex;
        addMessage(msg.text, isSelf ? 'self' : 'other', shouldAnimate);
      });
    });
}

// Xabarni chiqarish
function addMessage(text, type = 'self', animated = false) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${type}`;

  const avatar = document.createElement('img');
  avatar.className = 'avatar';
  avatar.src = type === 'self' ? 'images/you.png' : 'images/bot.png';

  const textDiv = document.createElement('div');
  textDiv.className = 'text';
  if (animated && type === 'other') textDiv.classList.add('typing');

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(textDiv);
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (animated && type === 'other') {
    let i = 0;
    function typeWriter() {
      if (i < text.length) {
        textDiv.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 30);
      } else {
        textDiv.classList.remove('typing');
      }
    }
    typeWriter();
  } else {
    textDiv.textContent = text;
  }
}

// ================== Online status (simulyatsiya) ==================
let isPartnerOnline = true;
let lastSeenTime = '';
const statusText = document.getElementById('status-text');

function setPartnerOnline(status) {
  isPartnerOnline = status;
  if (status) {
    statusText.textContent = '🟢 Online';
  } else {
    const time = new Date();
    lastSeenTime = `🔴 Last seen at ${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`;
    statusText.textContent = lastSeenTime;
  }
}

setTimeout(() => setPartnerOnline(false), 6000);
setTimeout(() => setPartnerOnline(true), 12000);

// Yuklanganda xabarlar chiqsin
loadMessages();

// Sahifa yopilganda offline qilish
window.addEventListener("beforeunload", () => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isOnline: false,
        lastSeen: new Date().toLocaleString()
      })
    });
  }
});

// Foydalanuvchi ro‘yxati
fetch('http://localhost:3000/users')
  .then(res => res.json())
  .then(users => {
    const list = document.getElementById('user-list');
    users.forEach(user => {
      const li = document.createElement('li');
      li.textContent = `${user.email} - ${user.isOnline ? '🟢 Online' : '🔴 Last seen: ' + user.lastSeen}`;
      list.appendChild(li);
    });
  });
