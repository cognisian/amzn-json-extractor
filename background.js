// Global var
var book = {};

// Install extension
chrome.runtime.onInstalled.addListener(function() {

  // Replace all the rules, with a new rule that only fires when on amazon.com
  // to show the extension's UI
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'www.amazon.com'},
        // pageUrl: { urlContains: 'g' },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

// Receive any messages from content scripts or extension's UI popup script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  switch(message.type) {
    case "log":
      console.log(message.obj);
      break;
    case "query_tab":
      sendResponse({tab: sender.tab});
      break;
    case "query_book":
      sendResponse({book: book});
      break;
    case "create_book":
      book = message.book
      break;
  }
  return true;
});
