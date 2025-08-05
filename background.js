chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageContent") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        sendResponse({ content: null });
        return;
      }

      const tabId = tabs[0].id;

      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: () => document.documentElement.outerHTML,
        },
        (results) => {
          if (!results || !results[0]) {
            sendResponse({ content: null });
          } else {
            sendResponse({ content: results[0].result });
          }
        }
      );
    });

    return true; // keeps sendResponse alive for async call
  }
});
