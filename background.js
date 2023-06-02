let timer;
let isRunning = false;
let timeLeft = 1500; // 25 minutes in seconds
let currentGif = "";

chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'start') {
        if (!isRunning) {
            isRunning = true;
            startTimer();
            currentGif = "pikachu-catch.gif";
            sendMessageToContentScript({ command: 'show_gif', gif: currentGif });
        }
    } else if (message.command === 'stop') {
        if (isRunning) {
            isRunning = false;
            clearInterval(timer);
            currentGif = "pikachu-nope.gif";
            sendMessageToContentScript({ command: 'stop', gif: currentGif });
        }
    } else if (message.command === 'reset') {
        resetTimer();
        currentGif = "pikachu_wow.gif";
        sendMessageToContentScript({ command: 'reset', gif: currentGif });
        sendMessageToPopup({ command: 'reset' });
    } else if (message.command === 'block') {
        const { site } = message;
        blockWebsite(site);
    } else if (message.command === 'unblock') {
        const { site } = message;
        unblockWebsite(site);
    } else if (message.command === 'getGifStatus') {
        sendResponse({ gif: currentGif });
        return;
    }

    // sending message to all tabs with the currentGif
    chrome.tabs.query({}, function(tabs) {
        for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, { command: 'show_gif', gif: currentGif });
        }
    });

    sendResponse({ result: "success" });
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
