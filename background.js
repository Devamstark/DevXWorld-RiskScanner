// Listen for message from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    // Use chrome.scripting.executeScript to get page HTML content
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => document.documentElement.innerHTML,
        },
        (injectionResults) => {
          if (injectionResults && injectionResults[0]) {
            sendResponse({ content: injectionResults[0].result });
          } else {
            sendResponse({ content: null });
          }
        }
      );
    });

    // Return true to indicate async response
    return true;
  }
});
