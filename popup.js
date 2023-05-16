chrome.runtime.onMessage.addListener(function(message) {
    document.getElementById('state').textContent = message.isWorking ? 'Work!' : 'Break!';
    document.getElementById('time').textContent = message.minutes + ' minutes left';
});

// requesting the current state on popup open
chrome.runtime.sendMessage({request: 'state'});
