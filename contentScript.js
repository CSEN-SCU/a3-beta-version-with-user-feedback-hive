let pikachuDiv = document.createElement('div');
pikachuDiv.id = 'pikachuDiv';
let pikachuGif = document.createElement('img');
pikachuGif.src = chrome.runtime.getURL("pikachu-catch.gif");
pikachuGif.style.width = '200px';
pikachuGif.style.height = '200px';
pikachuDiv.style.position = 'fixed';
pikachuDiv.style.right = '0px';
pikachuDiv.style.bottom = '0px';
pikachuDiv.style.zIndex = '9999';
pikachuDiv.style.display = 'none'; // Initially hide the gif
pikachuDiv.appendChild(pikachuGif);
document.body.appendChild(pikachuDiv);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message.command)
  if (message.command === 'start') {
    // document.getElementById("pikachuDiv").src = chrome.runtime.getURL("pikachu-catch.gif");

    pikachuDiv.style.display = 'block'; // Show the gif when 'start' message is received
  } else if (message.command === 'reset') {
    pikachuDiv.style.display = 'none'; // Hide the gif when 'reset' message is received
  }
  else if (message.command === 'stop') {
    console.log("Stop")
    // document.getElementById("pikachuDiv").src = chrome.runtime.getURL("pikachu-nope.gif");
    pikachuDiv.style.display = 'block'; // Hide the gif when 'reset' message is received 
  }
});