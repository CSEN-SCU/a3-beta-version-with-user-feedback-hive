var taskArr = [];

const updateView = () => {

    const tasksList = document.getElementById("tasksList");

    var child = tasksList.lastChild;
    while(child) {
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

        // taskControls.appendChild(taskEdit);
        taskControls.appendChild(taskDelete);
        taskControls.appendChild(taskDo);

        newTask.appendChild(taskText);
        newTask.appendChild(taskControls);

        tasksList.appendChild(newTask);
    });
}

const addTask = (isDone) => {

    const task = document.getElementById("task-input").value;
    if(task === null || task.trim() === "") return;
    taskArr.push({task, isDone});
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
    if(savedTasks !== null) taskArr = [...savedTasks];
    updateView();
})

document.getElementById("task-submit-btn").addEventListener("click", () => addTask(false));

document.getElementById("task-clear-btn").addEventListener("click", () => {

    localStorage.clear();
    taskArr = [];
    updateView();
})

$(document).ready(function() {
    var countdownElement = $('#clock');
    var countdownDate = new Date();
    countdownDate.setMinutes(countdownDate.getMinutes() + 25);

    var countdown;

    function startCountdown() {
        countdown = countdownElement.countdown(countdownDate, function(event) {
            var format = '%H:%M:%S';
            if(event.offset.totalDays > 0) {
                format = '%-d day%!d ' + format;
            }
            if(event.offset.weeks > 0) {
                format = '%-w week%!w ' + format;
            }
            $(this).html(event.strftime(format));
        }).on('finish.countdown', function(event) {
            $(this).html('This offer has expired!')
                .parent().addClass('disabled');
        });
    }

    function stopCountdown() {
        if (countdown) {
            countdownElement.countdown('stop');
            countdownElement.html('Countdown stopped');
        }
    }

    $('#start-btn').click(function() {
        startCountdown();
    });

    $('#stop-btn').click(function() {
        stopCountdown();
    });
});
