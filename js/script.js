function getStorage(key, fallback) {
    try {
        const data = localStorage.getItem(key);
        return data === null ? fallback : JSON.parse(data);
    } catch (error) {
        return fallback;
    }
}

function saveStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Gagal menyimpan data:", error);
    }
}

function updateClock() {

    const now = new Date();

    document.getElementById("clock").textContent =
        now.toLocaleTimeString("id-ID", {
            hour12: false
        });

    document.getElementById("date").textContent =
        now.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    const hours = now.getHours();

    let greeting;

    if (hours >= 5 && hours < 12) {
        greeting = "Good Morning";
    } else if (hours >= 12 && hours < 18) {
        greeting = "Good Afternoon";
    } else if (hours >= 18) {
        greeting = "Good Evening";
    } else {
        greeting = "Good Night";
    }

    const name = localStorage.getItem("user_name") || "";

    document.getElementById("greeting").textContent =
        name ? `${greeting}, ${name}!` : greeting;
}

function saveName() {

    const input = document.getElementById("name-input");

    const name = input.value.trim();

    localStorage.setItem("user_name", name);

    updateClock();
}

function loadName() {

    document.getElementById("name-input").value =
        localStorage.getItem("user_name") || "";

}

function updateThemeButton() {

    const isLight =
        document.body.classList.contains("light-mode");

    document.getElementById("theme-btn").textContent =
        isLight ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function toggleTheme() {

    document.body.classList.toggle("light-mode");

    const theme =
        document.body.classList.contains("light-mode")
            ? "light"
            : "dark";

    localStorage.setItem("theme", theme);

    updateThemeButton();
}

function loadTheme() {

    const theme = localStorage.getItem("theme");

    document.body.classList.toggle(
        "light-mode",
        theme === "light"
    );

    updateThemeButton();
}

let timer = null;

let duration = 25 * 60;

let timeLeft = duration;

let isRunning = false;

function updateTimerDisplay() {

    const minutes = Math.floor(timeLeft / 60);

    const seconds = timeLeft % 60;

    document.getElementById("timer-display").textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}

function updateTimerStatus(message) {

    document.getElementById("timer-status").textContent =
        message;

}

function startTimer() {

    if (isRunning) return;

    if (timeLeft <= 0) {
        updateTimerStatus("Atur ulang timer untuk memulai lagi.");
        return;
    }

    isRunning = true;

    updateTimerStatus("Sedang fokus...");

    timer = setInterval(() => {

        if (timeLeft > 0) {

            timeLeft--;

            updateTimerDisplay();

        }

        if (timeLeft <= 0) {

            clearInterval(timer);

            timer = null;

            isRunning = false;

            updateTimerStatus("Sesi fokus selesai!");

            alert("Waktu fokus selesai! Istirahat sebentar ya.");

        }

    }, 1000);

}

function stopTimer() {

    clearInterval(timer);

    timer = null;

    isRunning = false;

    updateTimerStatus("Timer dijeda.");

}

function resetTimer() {

    clearInterval(timer);

    timer = null;

    isRunning = false;

    timeLeft = duration;

    updateTimerDisplay();

    updateTimerStatus("Timer diatur ulang.");

}

function setTimerDuration() {

    if (isRunning) {

        alert("Hentikan timer terlebih dahulu!");

        return;
    }

    const input =
        document.getElementById("timer-minutes");

    const minutes = Number(input.value);

    if (
        !Number.isInteger(minutes) ||
        minutes < 1 ||
        minutes > 180
    ) {

        alert("Masukkan durasi antara 1 sampai 180 menit.");

        return;
    }

    duration = minutes * 60;

    timeLeft = duration;

    updateTimerDisplay();

    updateTimerStatus(`Durasi diatur menjadi ${minutes} menit.`);

}

let tasks = getStorage("my_tasks", []);

tasks = tasks.map(task => {

    if (typeof task === "string") {

        return {
            text: task,
            completed: false
        };

    }

    return task;

});

function renderTasks() {

    const list = document.getElementById("task-list");

    list.replaceChildren();

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(index);
        });

        const span = document.createElement("span");

        span.textContent = task.text;

        const actions = document.createElement("div");

        actions.className = "task-actions";

        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.addEventListener("click", () => {
            editTask(index);
        });

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Hapus";

        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", () => {
            deleteTask(index);
        });

        actions.append(editButton, deleteButton);

        li.append(checkbox, span, actions);

        list.appendChild(li);

    });

    saveStorage("my_tasks", tasks);

}

function addTask() {

    const input = document.getElementById("task-input");

    const value = input.value.trim();

    if (!value) return;

    const duplicate = tasks.some(task =>
        task.text.toLowerCase() === value.toLowerCase()
    );

    if (duplicate) {

        alert("Tugas tersebut sudah ada!");

        return;
    }

    tasks.push({

        text: value,

        completed: false

    });

    input.value = "";

    renderTasks();

}

function editTask(index) {

    const newText = prompt(
        "Edit tugas:",
        tasks[index].text
    );

    if (newText === null) return;

    const value = newText.trim();

    if (!value) {

        alert("Nama tugas tidak boleh kosong!");

        return;
    }

    const duplicate = tasks.some((task, i) =>
        i !== index &&
        task.text.toLowerCase() === value.toLowerCase()
    );

    if (duplicate) {

        alert("Tugas tersebut sudah ada!");

        return;
    }

    tasks[index].text = value;

    renderTasks();

}

function toggleTask(index) {

    tasks[index].completed = !tasks[index].completed;

    renderTasks();

}

function deleteTask(index) {

    if (!confirm("Hapus tugas ini?")) return;

    tasks.splice(index, 1);

    renderTasks();

}

let links = getStorage("my_links", []);

function renderLinks() {

    const container =
        document.getElementById("links-container");

    container.replaceChildren();

    links.forEach((link, index) => {

        const item = document.createElement("div");

        item.className = "link-item";

        const anchor = document.createElement("a");

        anchor.textContent = link.name;

        anchor.href = link.url;

        anchor.target = "_blank";

        anchor.rel = "noopener noreferrer";

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "✕";

        deleteButton.title = "Hapus Link";

        deleteButton.addEventListener("click", () => {
            deleteLink(index);
        });

        item.append(anchor, deleteButton);

        container.appendChild(item);

    });

    saveStorage("my_links", links);

}

function validateURL(value) {

    try {

        const url = new URL(
            /^https?:\/\//i.test(value)
                ? value
                : "https://" + value
        );

        if (
            url.protocol !== "https:" &&
            url.protocol !== "http:"
        ) {
            return null;
        }

        return url.href;

    } catch (error) {

        return null;

    }

}

function addLink() {

    const nameInput =
        document.getElementById("link-name");

    const urlInput =
        document.getElementById("link-url");

    const name = nameInput.value.trim();

    const url = validateURL(urlInput.value.trim());

    if (!name || !url) {

        alert("Masukkan nama dan URL website yang valid!");

        return;
    }

    links.push({

        name: name,

        url: url

    });

    nameInput.value = "";

    urlInput.value = "";

    renderLinks();

}

function deleteLink(index) {

    links.splice(index, 1);

    renderLinks();

}

document.getElementById("theme-btn")
    .addEventListener("click", toggleTheme);

document.getElementById("name-input")
    .addEventListener("input", saveName);

document.getElementById("start-btn")
    .addEventListener("click", startTimer);

document.getElementById("stop-btn")
    .addEventListener("click", stopTimer);

document.getElementById("reset-btn")
    .addEventListener("click", resetTimer);

document.getElementById("set-timer-btn")
    .addEventListener("click", setTimerDuration);

document.getElementById("add-task-btn")
    .addEventListener("click", addTask);

document.getElementById("add-link-btn")
    .addEventListener("click", addLink);

document.getElementById("task-input")
    .addEventListener("keydown", event => {

        if (event.key === "Enter") {
            addTask();
        }

    });

loadTheme();

loadName();

updateClock();

setInterval(updateClock, 1000);

updateTimerDisplay();

renderTasks();

renderLinks();