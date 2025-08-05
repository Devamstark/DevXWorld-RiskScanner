chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => document.documentElement.outerHTML,
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

    return true; // async response
  }
});
