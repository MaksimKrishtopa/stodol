document.addEventListener("DOMContentLoaded", () => {
    const addTaskButton = document.getElementById("addTaskButton");
    const plannedColumn = document.getElementById("planned").querySelector(".tasks");
    const completedColumn = document.getElementById("completed").querySelector(".tasks");

    const editModal = document.getElementById("editModal");
    const editForm = document.getElementById("editForm");
    const editName = document.getElementById("editName");
    const editDescription = document.getElementById("editDescription");
    const editStartTime = document.getElementById("editStartTime");
    const editEndTime = document.getElementById("editEndTime");
    let currentTask = null;

    // Загрузка задач из localStorage
    function saveTasks() {
        const tasks = [];
        const allTasks = document.querySelectorAll(".task");
        allTasks.forEach(taskElement => {
            const task = {
                name: taskElement.querySelector(".task__text p:first-child").textContent,
                description: taskElement.querySelector(".task__text p:nth-child(2)").textContent,
                startTime: taskElement.querySelector(".task__date").dataset.startTime,
                endTime: taskElement.querySelector(".task__date").dataset.endTime,
                status: taskElement.closest(".column").id === "completed" ? "completed" : "planned",
                important: taskElement.classList.contains("important") // Сохраняем важность
            };
            tasks.push(task);
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Загрузка задач с важностью
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            const taskElement = createTask(task.name, task.description, task.startTime, task.endTime, task.status);
            if (task.important && task.status === "planned") taskElement.classList.add("important"); // Подсветка только в запланированных
            if (task.status === "completed") {
                completedColumn.appendChild(taskElement);
            } else {
                plannedColumn.appendChild(taskElement);
            }
        });
    }

    // Обработчик добавления задачи
    addTaskButton.addEventListener("click", () => {
        const taskName = document.getElementById("taskName").value;
        const taskDescription = document.getElementById("taskDescription").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;

        if (new Date(startTime) > new Date(endTime)) {
            alert("Ошибка: дата завершения задачи не может быть раньше даты её начала!");
            return;
        }

        if (taskName && taskDescription && startTime && endTime) {
            const task = createTask(taskName, taskDescription, startTime, endTime, "planned");
            plannedColumn.appendChild(task);

            saveTasks(); // Сохранение задач в localStorage

            document.getElementById("taskName").value = "";
            document.getElementById("taskDescription").value = "";
            document.getElementById("startTime").value = "";
            document.getElementById("endTime").value = "";
        } else {
            alert("Пожалуйста, заполните все поля!");
        }
    });

    // Функция для форматирования даты
    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        const months = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day} ${month} ${hours}:${minutes}`;
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
    
        // Добавление атрибутов для хранения данных
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
    
        // В зависимости от статуса задачи добавляем кнопки
        if (status === "completed") {
            taskBtns.append(deleteButton); // Только кнопка удаления для завершённых задач
        } else {
            taskBtns.append(importantButton, moveButton, editButton, deleteButton); // Для запланированных - все кнопки
        }
    
        task.append(taskText, taskBtns);
    
        // Подсветка важной задачи и возможность добавления в избранное только в запланированных
        if (status === "planned") {
            importantButton.addEventListener("click", () => {
                task.classList.toggle("important");
                saveTasks(); // Сохранение задачи с обновленным состоянием
            });
        } else {
            // Убираем кнопку важности для завершённых задач
            importantButton.style.display = "none";
        }
    
        // Перемещение задачи в завершённые
        moveButton.addEventListener("click", () => {
            // Убираем возможность добавления в избранное и перемещения задачи для завершённых
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
    
        // Удаление задачи
        deleteButton.addEventListener("click", () => {
            task.remove();
            saveTasks();
        });
    
        return task;
    }

    // Обработчик редактирования задачи
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (currentTask) {
            const name = editName.value;
            const description = editDescription.value;
            const startTime = editStartTime.value;
            const endTime = editEndTime.value;

            if (new Date(startTime) > new Date(endTime)) {
                alert("Ошибка: дата завершения задачи не может быть раньше даты её начала!");
                return;
            }

            const updatedTask = createTask(name, description, startTime, endTime, "planned");
            currentTask.replaceWith(updatedTask);
            editModal.style.display = "none";
            currentTask = null;

            saveTasks(); // Сохранение задач после редактирования
        }
    });

    // Закрытие модального окна
    document.getElementById("closeModal").addEventListener("click", () => {
        editModal.style.display = "none";
    });

    // Закрытие модального окна при клике вне него
    window.addEventListener("click", (e) => {
        if (e.target === editModal) {
            editModal.style.display = "none";
        }
    });

    // Загрузка задач при загрузке страницы
    loadTasks();
});