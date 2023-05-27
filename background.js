chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") }, function (tab) {
      chrome.tabs.executeScript(tab.id, {file: 'contentScript.js'});
    });
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.command){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: message.command});
      });
    }
  });