let pikachuDiv;
let pikachuGif;

function setupDiv() {
    pikachuDiv = document.createElement('div');
    pikachuDiv.id = 'pikachuDiv';
    pikachuGif = document.createElement('img');
    pikachuGif.src = chrome.runtime.getURL("pikachu-catch.gif");
    pikachuGif.style.width = '200px';
    pikachuGif.style.height = '200px';
    pikachuDiv.style.position = 'fixed';
    pikachuDiv.style.right = '0px';
    pikachuDiv.style.bottom = '0px';
    pikachuDiv.style.zIndex = '9999';
    pikachuDiv.style.display = 'none';
    pikachuDiv.appendChild(pikachuGif);
    document.body.appendChild(pikachuDiv);
}

setupDiv();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'start') {
        pikachuGif.src = chrome.runtime.getURL("pikachu-catch.gif");
        pikachuDiv.style.display = 'block';
    } else if (message.command === 'reset') {
        pikachuGif.src = chrome.runtime.getURL("pikachu-catch.gif");
        pikachuDiv.style.display = 'none';
    } else if (message.command === 'stop') {
        pikachuGif.src = chrome.runtime.getURL("pikachu-nope.gif");
        pikachuDiv.style.display = 'block';
    }
});
