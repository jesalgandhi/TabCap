chrome.browserAction.onClicked.addListener(function() {

  var currentTabs = chrome.tabs.query({currentWindow: true}, 
    function(tabs) {
      var tab = tabs[0];
      chrome.tabs.create({
        url: 'https://www.google.com/search?q=' + tab.title
      });
  });

  



});

