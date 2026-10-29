function updateClock() {
  const now = new Date();
  document.getElementById('clock').innerText = now.toLocaleTimeString('id-ID');
  document.getElementById('date').innerText = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const hours = now.getHours();
  let greetingText = "Good Evening";
  if (hours < 12) greetingText = "Good Morning";
  else if (hours < 18) greetingText = "Good Afternoon";
  
  const savedName = localStorage.getItem('user_name') || '';
  if (savedName) {
    greetingText += `, ${savedName}!`;
  }
  
  document.getElementById('greeting').innerText = greetingText;
}

function saveName() {
  const nameInput = document.getElementById('name-input');
  localStorage.setItem('user_name', nameInput.value.trim());
  updateClock();
}

function loadName() {
  const savedName = localStorage.getItem('user_name') || '';
  document.getElementById('name-input').value = savedName;
}

setInterval(updateClock, 1000);

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  document.getElementById('theme-btn').innerText = isLight ? '☀️ Light Mode' : '🌙 Dark Mode';
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    document.getElementById('theme-btn').innerText = '☀️ Light Mode';
  }
}

let timer;
let timeLeft = 25 * 60;
let isRunning = false;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer-display').innerText = 
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        alert("Waktu fokus selesai!");
        isRunning = false;
      }
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timer);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = 25 * 60;
  updateTimerDisplay();
}

let tasks = JSON.parse(localStorage.getItem('my_tasks')) || [];

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  tasks.forEach((task, index) => {
    list.innerHTML += `
      <li>
        <span>${task}</span>
        <button onclick="deleteTask(${index})">Hapus</button>
      </li>`;
  });
  localStorage.setItem('my_tasks', JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById('task-input');
  const val = input.value.trim();
  
  if (val === '') return;

  if (tasks.includes(val)) {
    alert("Tugas ini sudah ada di dalam list!");
    return;
  }

  tasks.push(val);
  input.value = '';
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

let links = JSON.parse(localStorage.getItem('my_links')) || [];

function renderLinks() {
  const container = document.getElementById('links-container');
  container.innerHTML = '';
  links.forEach((link) => {
    container.innerHTML += `
      <a href="${link.url}" target="_blank">
        <button type="button">${link.name}</button>
      </a>`;
  });
  localStorage.setItem('my_links', JSON.stringify(links));
}

function addLink() {
  const nameInput = document.getElementById('link-name');
  const urlInput = document.getElementById('link-url');
  
  if (nameInput.value.trim() !== '' && urlInput.value.trim() !== '') {
    links.push({ name: nameInput.value, url: urlInput.value });
    nameInput.value = '';
    urlInput.value = '';
    renderLinks();
  }
}

loadTheme();
loadName();
updateClock();
renderTasks();
renderLinks();