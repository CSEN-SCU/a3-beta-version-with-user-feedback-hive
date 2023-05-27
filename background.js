chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.command){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['contentScript.js']
        });
        chrome.tabs.sendMessage(tabs[0].id, {command: message.command});
      });
    }
  });
  