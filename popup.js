let startButton = document.getElementById('start-btn');
let stopButton = document.getElementById('stop-btn');
let resetButton = document.getElementById('reset');
let timerDisplay = document.getElementById('clock');
let tab_count = document.getElementById('num-tabs');
let health = document.getElementById('health');

let timer;
let isRunning = false;
let timeLeft = 1500; // 25 minutes in seconds

var taskArr = [];
var siteArr = [];


function getTabsCount() {
    return new Promise((resolve) => {
      chrome.tabs.query({}, (tabs) => {
        let tabCount = tabs.length > 0 ? tabs.length - 1 : 0;
        resolve(tabCount);
      });
    });
  }

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
    const sitesList = document.getElementById("sitesList");
    var child = sitesList.lastChild;
    while (child) {
        sitesList.removeChild(child);
        child = sitesList.lastChild;
    }

    siteArr.forEach((Element, index) => {
        const newsite = document.createElement("div");
        newsite.setAttribute("class", "site-div");

        const siteText = document.createElement("div");
        siteText.setAttribute("class", Element.isDone ? "site-text site-completed" : "site-text");
        siteText.innerHTML = (index + 1) + ". " + Element.site;

        const siteControls = document.createElement("div");
        siteControls.setAttribute("class", "site-controls");


        const siteDelete = document.createElement("button");
        siteDelete.innerHTML = "Delete";
        siteDelete.setAttribute("id", index + "delete");
        siteDelete.setAttribute("class", "site-btn site-btn-delete");
        // console.log("Hello");
        siteDelete.addEventListener("click", (event) => deletesite(event.target.id));



        siteControls.appendChild(siteDelete);
        // siteControls.appendChild(siteDo);

        newsite.appendChild(siteText);
        newsite.appendChild(siteControls);

        sitesList.appendChild(newsite);
    
    });

    getTabsCount().then(tabCount =>{
        tab_count.textContent='Current Open Tabs: '+(tabCount+1);
        health.style.width= 100-((tabCount+1)*5)+"%";
        health.textContent= 100-((tabCount+1)*5);
    })
    
}

const addsite = (isDone) => {
    const site = document.getElementById("site-input").value;
    if (site === null || site.trim() === "") return;
    siteArr.push({ site, isDone });
    //()
    localStorage.setItem("savedsites", JSON.stringify(siteArr));
    updateView();

    const siteInput = document.getElementById("site-input");
    siteInput.value = "";
}

const deletesite = (id) => {
    const siteIndex = parseInt(id[0]);
    siteArr.splice(siteIndex, 1);
    localStorage.setItem("savedsites", JSON.stringify(siteArr));
    updateView();
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

const checkblocksite = ()=>{
    const savedsites = JSON.parse(localStorage.getItem("savedsites"));
    if (savedsites !== null) siteArr = [...savedsites];

    chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {

        var tab = tabs[0];
        
        url = tab.url;
        id = tab.id
        // console.log("stop 1");
        for (let site in savedsites) {
            console.log(url.match(savedsites[site]["site"]))
          if (url.match(savedsites[site]["site"])) {
            chrome.tabs.update(id, {"url" : chrome.runtime.getURL("blocked.html")},
              function () {});
          }
      }
      });

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
    const savedsites = JSON.parse(localStorage.getItem("savedsites"));
    if (savedsites !== null) siteArr = [...savedsites];
    updateView();
    // console.log("I want JOB");

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

    console.log("Checking task and site")
    document.getElementById("task-submit-btn").addEventListener("click", () => addTask(false));
    document.getElementById("site-submit-btn").addEventListener("click", () => addsite(false));
    
    document.getElementById("task-clear-btn").addEventListener("click", () => {
        localStorage.clear();
        taskArr = [];
        siteArr = [];
        updateView();
    });

    function updateTimerDisplay(timeLeft) {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    console.log("Checking click")

    startButton.addEventListener('click', () => {
        console.log("Checking start")
        chrome.runtime.sendMessage({ command: 'start' });
    });

    stopButton.addEventListener('click', () => {
        console.log("Checking stop")
        chrome.runtime.sendMessage({ command: 'stop' });
    });

    resetButton.addEventListener('click', () => {
        console.log("Checking reset")
        chrome.runtime.sendMessage({ command: 'reset' });
    });

    
});


chrome.tabs.onUpdated.addListener(function(tabId, changedInfo, tab) {
    console.log('tab updated2')
    console.log(tab)
    // alert("")
    console.log("url "+tab.url)
    const savedsites = JSON.parse(localStorage.getItem("savedsites"));
    console.log("Loaded local storege")
    console.log(savedsites)
    if (savedsites !== null) siteArr = [...savedsites];
    // console.log(siteArr)
    if(siteArr.length>0){
        for (site in savedsites) {
            if (tab.url.match(savedsites[site]["site"])) {
                // alert("")
                console.log("url matched")
                // console.log("point 1");

                attemptedURL = tab.url;
                lastBlockedTabId = tabId;
                chrome.tabs.update(tabId, {"url" : chrome.runtime.getURL("blocked.html")},
                function () {});
            }
        }    
    }
    updateView();
  });