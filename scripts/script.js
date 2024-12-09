document.addEventListener("DOMContentLoaded", () => {
    const addTaskButton = document.getElementById("addTaskButton");
    const plannedColumn = document.getElementById("planned").querySelector(".tasks");
    const completedColumn = document.getElementById("completed").querySelector(".tasks");
    const taskForm = document.querySelector(".task-form");
    const registerButton = document.getElementById("registerButton");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");

    const registerModal = document.getElementById("registerModal");
    const loginModal = document.getElementById("loginModal");
    const closeRegisterModal = document.getElementById("closeRegisterModal");
    const closeLoginModal = document.getElementById("closeLoginModal");

    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    const registerEmail = document.getElementById("registerEmail");
    const registerPassword = document.getElementById("registerPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");

    const editModal = document.getElementById("editModal");
    const editForm = document.getElementById("editForm");
    const editName = document.getElementById("editName");
    const editDescription = document.getElementById("editDescription");
    const editStartTime = document.getElementById("editStartTime");
    const editEndTime = document.getElementById("editEndTime");
    let currentTask = null;

    let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

    // Функция для форматирования даты и времени
    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    // Загрузка задач
    function loadTasks() {
        if (!currentUser) return;

        const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.email}`)) || [];
        tasks.forEach(task => {
            const taskElement = createTask(task.name, task.description, task.startTime, task.endTime, task.status);
            if (task.status === "completed") {
                completedColumn.appendChild(taskElement);
            } else {
                plannedColumn.appendChild(taskElement);
            }

            // Восстанавливаем состояние "важности" для задачи
            if (task.important) {
                taskElement.classList.add("important");
            }
        });
    }

    // Сохранение задач в localStorage
    function saveTasks() {
        if (!currentUser) return;

        const tasks = [];
        const allTasks = document.querySelectorAll(".task");
        allTasks.forEach(taskElement => {
            const task = {
                name: taskElement.querySelector(".task__text p:first-child").textContent,
                description: taskElement.querySelector(".task__text p:nth-child(2)").textContent,
                startTime: taskElement.querySelector(".task__date").dataset.startTime,
                endTime: taskElement.querySelector(".task__date").dataset.endTime,
                status: taskElement.closest(".column").id === "completed" ? "completed" : "planned",
                important: taskElement.classList.contains("important")
            };
            tasks.push(task);
        });

        localStorage.setItem(`tasks_${currentUser.email}`, JSON.stringify(tasks));
    }

    // Функция для создания задачи
    function createTask(name, description, startTime, endTime, status) {
        const task = document.createElement("div");
        task.className = "task";

        const taskText = document.createElement("div");
        taskText.className = "task__text";

        const taskNameElem = document.createElement("p");
        taskNameElem.textContent = name;

        const taskDescriptionElem = document.createElement("p");
        taskDescriptionElem.textContent = description;

        const taskDateElem = document.createElement("p");
        taskDateElem.className = "task__date";
        taskDateElem.textContent = `${formatDateTime(startTime)} - ${formatDateTime(endTime)}`;

        taskDateElem.dataset.startTime = startTime;
        taskDateElem.dataset.endTime = endTime;

        taskText.append(taskNameElem, taskDescriptionElem, taskDateElem);

        const taskBtns = document.createElement("div");
        taskBtns.className = "task__btns";

        const importantButton = document.createElement("button");
        importantButton.className = "important-button";
        importantButton.innerHTML = "★";

        const moveButton = document.createElement("button");
        moveButton.className = "move-button";
        moveButton.innerHTML = "✔";

        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.innerHTML = "✎";

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.innerHTML = "✕";

        if (status === "completed") {
            taskBtns.append(deleteButton);
        } else {
            taskBtns.append(importantButton, moveButton, editButton, deleteButton);
        }

        task.append(taskText, taskBtns);

        importantButton.addEventListener("click", () => {
            task.classList.toggle("important");
            saveTasks();
        });

        moveButton.addEventListener("click", () => {
            task.classList.remove("important");
            importantButton.style.display = "none";
            moveButton.remove();
            editButton.remove();
            completedColumn.appendChild(task);
            saveTasks();
        });

        // Редактирование задачи
        editButton.addEventListener("click", () => {
            currentTask = task;
            editName.value = name;
            editDescription.value = description;
            editStartTime.value = startTime;
            editEndTime.value = endTime;
            editModal.style.display = "block";
        });

        deleteButton.addEventListener("click", () => {
            task.remove();
            saveTasks();
        });

        return task;
    }

    // Обработчик сохранения изменений в редактировании задачи
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const updatedTask = {
            name: editName.value,
            description: editDescription.value,
            startTime: editStartTime.value,
            endTime: editEndTime.value,
        };

        currentTask.querySelector(".task__text p:first-child").textContent = updatedTask.name;
        currentTask.querySelector(".task__text p:nth-child(2)").textContent = updatedTask.description;
        currentTask.querySelector(".task__date").textContent = `${formatDateTime(updatedTask.startTime)} - ${formatDateTime(updatedTask.endTime)}`;
        currentTask.querySelector(".task__date").dataset.startTime = updatedTask.startTime;
        currentTask.querySelector(".task__date").dataset.endTime = updatedTask.endTime;

        editModal.style.display = "none";

        saveTasks();
    });

    // Обработчики модальных окон
    registerButton.addEventListener("click", () => {
        registerModal.style.display = "block";
    });

    loginButton.addEventListener("click", () => {
        loginModal.style.display = "block";
    });

    closeRegisterModal.addEventListener("click", () => {
        registerModal.style.display = "none";
    });

    closeLoginModal.addEventListener("click", () => {
        loginModal.style.display = "none";
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const users = JSON.parse(localStorage.getItem("users")) || [];
        
        // Проверяем, есть ли уже пользователь с таким email
        const existingUser = users.find(user => user.email === registerEmail.value);
            
        if (existingUser) {
            alert("Пользователь с таким email уже существует");
            return;
        }
        
        if (registerPassword.value === confirmPassword.value) {
            const user = {
                email: registerEmail.value,
                password: registerPassword.value,
            };
        
            // Добавляем нового пользователя в массив
            users.push(user);
        
            // Сохраняем всех пользователей
            localStorage.setItem("users", JSON.stringify(users));
        
            currentUser = user;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        
            registerModal.style.display = "none";
            loginButton.style.display = "none";
            logoutButton.style.display = "inline-block";
            taskForm.style.display = "flex";  // Меняем на "flex"
            loadTasks();
        } else {
            alert("Пароли не совпадают");
        }
    });
    
    // Авторизация
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(user => user.email === loginEmail.value && user.password === loginPassword.value);
        if (user) {
            currentUser = user;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            loginModal.style.display = "none";
            loginButton.style.display = "none";
            logoutButton.style.display = "inline-block";
            taskForm.style.display = "flex";
            loadTasks();
        } else {
            alert("Неверный логин или пароль");
        }
    });

    // Выход
    logoutButton.addEventListener("click", () => {
        currentUser = null;
        localStorage.removeItem("currentUser");
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";
        taskForm.style.display = "none";

        // Очистить текущие задачи
        plannedColumn.innerHTML = '';
        completedColumn.innerHTML = '';
    });

    // Добавление задачи
    addTaskButton.addEventListener("click", () => {
        const taskName = document.getElementById("taskName").value;
        const taskDescription = document.getElementById("taskDescription").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;

        if (taskName && taskDescription && startTime && endTime) {
            const taskElement = createTask(taskName, taskDescription, startTime, endTime, "planned");
            plannedColumn.appendChild(taskElement);

            saveTasks();
        } else {
            alert("Пожалуйста, заполните все поля!");
        }
    });

    // Загружаем задачи после авторизации
    if (currentUser) {
        loadTasks();
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";
        taskForm.style.display = "flex";
    } else {
        loginButton.style.display = "inline-block";
    }
});