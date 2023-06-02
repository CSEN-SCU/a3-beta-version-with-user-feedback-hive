let pikachuDiv;
let pikachuGif;

function setupDiv() {
    pikachuDiv = document.createElement('div');
    pikachuDiv.id = 'pikachuDiv';
    pikachuGif = document.createElement('img');
    pikachuGif.src = chrome.runtime.getURL("");
    pikachuGif.style.width = '200px';
    pikachuGif.style.height = '200px';
    pikachuDiv.style.position = 'fixed';
    pikachuDiv.style.right = '0px';
    pikachuDiv.style.bottom = '0px';
    pikachuDiv.style.zIndex = '9999';
    pikachuDiv.appendChild(pikachuGif);
    document.body.appendChild(pikachuDiv);
}

setupDiv();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'show_gif') {
        pikachuGif.src = chrome.runtime.getURL(message.gif);
        pikachuDiv.style.display = 'block';
    } else if (message.command === 'stop' || message.command === 'reset') {
        pikachuGif.src = chrome.runtime.getURL("");
        pikachuDiv.style.display = 'none';
    }
});
//  t
chrome.runtime.sendMessage({ command: 'getGifStatus' }, (response) => {
    if (response.gif !== "") {
        pikachuGif.src = chrome.runtime.getURL(response.gif);
        pikachuDiv.style.display = 'block';
    }
});
