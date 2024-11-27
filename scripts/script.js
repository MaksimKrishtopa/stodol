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
            const task = createTask(taskName, taskDescription, startTime, endTime);
            plannedColumn.appendChild(task);

            
            document.getElementById("taskName").value = "";
            document.getElementById("taskDescription").value = "";
            document.getElementById("startTime").value = "";
            document.getElementById("endTime").value = "";

        } else {
            alert("Пожалуйста, заполните все поля!");
        }
    });

    function formatDateTime(dateTime) {
        const date = new Date(dateTime);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    function createTask(name, description, startTime, endTime) {
        const task = document.createElement("div");
        task.className = "task";

        const taskNameElem = document.createElement("strong");
        taskNameElem.textContent = name;

        const taskDescriptionElem = document.createElement("p");
        taskDescriptionElem.textContent = description;

        const taskStartElem = document.createElement("p");
        taskStartElem.textContent = `Начало: ${formatDateTime(startTime)}`;

        const taskEndElem = document.createElement("p");
        taskEndElem.textContent = `До: ${formatDateTime(endTime)}`;

        const moveButton = document.createElement("button");
        moveButton.textContent = "Переместить";

        const editButton = document.createElement("button");
        editButton.textContent = "Редактировать";
        editButton.classList.add("edit-button");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Удалить";
        deleteButton.classList.add("delete-button");

        task.append(taskNameElem, taskDescriptionElem, taskStartElem, taskEndElem, moveButton, editButton, deleteButton);

        moveButton.addEventListener("click", () => {
            completedColumn.appendChild(task);
            moveButton.remove(); 
            editButton.remove();
            deleteButton.remove(); 
        });

        editButton.addEventListener("click", () => {
            currentTask = task;
            editName.value = name;
            editDescription.value = description;
            editStartTime.value = startTime;
            editEndTime.value = endTime;
            editModal.style.display = "block"; 
        });

        deleteButton.addEventListener("click", () => {
            if (confirm("Вы уверены, что хотите удалить задачу?")) {
                task.remove();
            }
        });

        return task;
    }

    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (currentTask) {
            const name = editName.value;
            const description = editDescription.value;
            const startTime = editStartTime.value;
            const endTime = editEndTime.value;

            if (name && description && startTime && endTime) {
                currentTask.querySelector("strong").textContent = name;
                currentTask.querySelector("p:nth-of-type(1)").textContent = description;
                currentTask.querySelector("p:nth-of-type(2)").textContent = `Начало: ${formatDateTime(startTime)}`;
                currentTask.querySelector("p:nth-of-type(3)").textContent = `До: ${formatDateTime(endTime)}`;
                currentTask = null; 
                editModal.style.display = "none"; 
            } else {
                alert("Пожалуйста, заполните все поля!");
            }
        }
    });

    document.getElementById("closeModal").addEventListener("click", () => {
        editModal.style.display = "none";
        currentTask = null;
    });


});