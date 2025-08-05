document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("status").textContent = "Analyzing website...";

  // Get active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Only scan real websites
  if (!tab || !tab.url || !tab.url.startsWith("http")) {
    document.getElementById("status").textContent = "Invalid tab or URL.";
    return;
  }

  try {
    // Execute script to get page HTML
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.documentElement.outerHTML
    });

    const selectedModel = document.getElementById("modelSelect")?.value || "fast";

    const res = await fetch("https://devxworld-riskscanner.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html: result.result,
        model: selectedModel
      }),
    });

    const data = await res.json();

    document.getElementById("score").textContent = `${data.score} / 100`;

    const verdictEl = document.getElementById("verdict");
    verdictEl.textContent = data.verdict;
    verdictEl.classList.remove("safe", "caution", "risk");

    if (data.verdict === "Safe") verdictEl.classList.add("safe");
    else if (data.verdict === "Caution") verdictEl.classList.add("caution");
    else if (data.verdict === "High Risk") verdictEl.classList.add("risk");

    document.getElementById("status").textContent = "AI Scan Complete ✅";

  } catch (error) {
    console.error("Error fetching AI result:", error);
    document.getElementById("status").textContent = "Failed to get page content";
    document.getElementById("score").textContent = "-- / 100";
    document.getElementById("verdict").textContent = "--";
  }
});
