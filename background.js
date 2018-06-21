// Global var
var book = {}

// Receive any messages from content scripts or extension's UI popup script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  switch(message.type) {
    case "log":
      console.log(message.obj);
      break;
    case "query_tab":
      sendResponse({tab: sender.tab});
      break;
    case "update_tab":
      if (message.obj) {
        chrome.browserAction.setIcon({tabId: sender.tab.id, path: "images/icon-go.png"});
      }
      else {
        chrome.browserAction.setIcon({tabId: sender.tab.id, path: "images/icon-no.png"});
      }
      break;
    case "query_book":
      sendResponse({book: book});
      break;
    case "create_book":
      book = message.book;
      break;
    case "update_book":
      book[message.term] = message.obj;
      break;
  };
});
