chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only run on fully loaded pages
  if (changeInfo.status !== 'complete' || !tab.url || !tab.url.startsWith('http')) {
    return;
  }

  try {
    // Get full page HTML from the tab
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => document.documentElement.outerHTML
    });

    // Send the HTML and model to your backend API
    const response = await fetch("https://devxworld-riskscanner.onrender.com/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        html: result.result,
        model: "fast" // You can change this to "deep" or make it dynamic
      })
    });

    const data = await response.json();
    const { score, verdict } = data;

    console.log(`[DevXWorld AutoScan] ${tab.url}`);
    console.log(`Risk Score: ${score} / 100`);
    console.log(`Verdict: ${verdict}`);

    // Set badge text with score
    chrome.action.setBadgeText({ tabId, text: score.toString() });

    // Set badge color based on verdict
    let color = "gray";
    if (verdict === "Safe") color = "#10b981";       // green
    else if (verdict === "Caution") color = "#f59e0b"; // yellow
    else if (verdict === "High Risk") color = "#ef4444"; // red

    chrome.action.setBadgeBackgroundColor({ tabId, color });

  } catch (error) {
    console.error("[DevXWorld AutoScan] Error:", error);
  }
});
