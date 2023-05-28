let startButton = document.getElementById('start-btn');
let stopButton = document.getElementById('stop-btn');
let resetButton = document.getElementById('reset');
let timerDisplay = document.getElementById('clock');

let timer;
let isRunning = false;
let timeLeft = 1500; // 25 minutes in seconds

var taskArr = [];

const updateView = () => {
    const tasksList = document.getElementById("tasksList");
    var child = tasksList.lastChild;
    while (child) {
        tasksList.removeChild(child);
        child = tasksList.lastChild;
    }

    taskArr.forEach((Element, index) => {
        const newTask = document.createElement("div");
        newTask.setAttribute("class", "task-div");

        const taskText = document.createElement("div");
        taskText.setAttribute("class", Element.isDone ? "task-text task-completed" : "task-text");
        taskText.innerHTML = (index + 1) + ". " + Element.task;

        const taskControls = document.createElement("div");
        taskControls.setAttribute("class", "task-controls");

        const taskDelete = document.createElement("button");
        taskDelete.innerHTML = "Delete";
        taskDelete.setAttribute("id", index + "delete");
        taskDelete.setAttribute("class", "task-btn task-btn-delete");
        taskDelete.addEventListener("click", (event) => deleteTask(event.target.id));

        const taskDo = document.createElement("button");
        taskDo.innerHTML = Element.isDone ? "Undo" : "Done";
        taskDo.setAttribute("id", index + "do");
        taskDo.setAttribute("class", "task-btn task-btn-do");
        taskDo.addEventListener("click", (event) => doTask(event.target.id));

        taskControls.appendChild(taskDelete);
        taskControls.appendChild(taskDo);

        newTask.appendChild(taskText);
        newTask.appendChild(taskControls);

        tasksList.appendChild(newTask);
    });
}

const addTask = (isDone) => {
    const task = document.getElementById("task-input").value;
    if (task === null || task.trim() === "") return;
    taskArr.push({ task, isDone });
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();

    const taskInput = document.getElementById("task-input");
    taskInput.value = "";
}

const deleteTask = (id) => {
    const taskIndex = parseInt(id[0]);
    taskArr.splice(taskIndex, 1);
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();
}

const doTask = (id) => {
    const taskIndex = parseInt(id[0]);
    taskArr[taskIndex].isDone = !taskArr[taskIndex].isDone;
    localStorage.setItem("savedTasks", JSON.stringify(taskArr));
    updateView();
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTasks = JSON.parse(localStorage.getItem("savedTasks"));
    if (savedTasks !== null) taskArr = [...savedTasks];
    updateView();

    chrome.runtime.onMessage.addListener((message) => {
        if (message.timeLeft !== undefined) {
            updateTimerDisplay(message.timeLeft);
        } else if (message.command === 'reset') {
            resetTimer();
        }
    });

    function resetTimer() {
        isRunning = false;
        timeLeft = 1500;
        updateTimerDisplay(timeLeft);
    }

    document.getElementById("task-submit-btn").addEventListener("click", () => addTask(false));

    document.getElementById("task-clear-btn").addEventListener("click", () => {
        localStorage.clear();
        taskArr = [];
        updateView();
    });

    function updateTimerDisplay(timeLeft) {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    startButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ command: 'start' });
    });

    stopButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ command: 'stop' });
    });

    resetButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ command: 'reset' });
    });

 
});
