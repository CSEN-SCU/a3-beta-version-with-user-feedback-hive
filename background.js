let timer;
let isRunning = false;
let timeLeft = 1500; // 25 minutes in seconds


chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'start') {
        if (!isRunning) {
            isRunning = true;
            startTimer();
            sendMessageToContentScript({ command: 'start' });
        }
    } else if (message.command === 'stop') {
        if (isRunning) {
            isRunning = false;
            clearInterval(timer);
            sendMessageToContentScript({ command: 'stop' });
        }
    } else if (message.command === 'reset') {
        isRunning = false;
        timeLeft = 1500;
        clearInterval(timer);
        sendMessageToContentScript({ command: 'reset' });
        sendMessageToPopup({ command: 'reset' });
    } else if (message.command === 'block') {
        const { site } = message;
        blockWebsite(site);
    } else if (message.command === 'unblock') {
        const { site } = message;
        unblockWebsite(site);
    }
});

chrome.tabs.onActivated.addListener(activeInfo => {
    resetTimer();
    sendMessageToContentScript({ command: 'reset' });
});

function resetTimer() {
    isRunning = false;
    timeLeft = 1500;
    clearInterval(timer);
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        sendMessageToPopup({ timeLeft: timeLeft });
        if (timeLeft <= 0) {
            clearInterval(timer);
        }
    }, 1000);
}

function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}

function sendMessageToPopup(message) {
    chrome.runtime.sendMessage(message);
}

