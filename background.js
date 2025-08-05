chrome.runtime.sendMessage({ action: "getPageContent" }, async (response) => {
  if (!response || !response.content) {
    document.getElementById("status").textContent = "Failed to get page content";
    return;
  }

  try {
    const res = await fetch("https://devxworld-riskscanner.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: response.content }),
    });

    const data = await res.json();

    document.getElementById("score").textContent = `${data.score} / 100`;
    document.getElementById("verdict").textContent = data.verdict;
    document.getElementById("status").textContent = "AI Scan Complete ✅";

  } catch (error) {
    document.getElementById("status").textContent = "Error analyzing page.";
    document.getElementById("score").textContent = "-- / 100";
    document.getElementById("verdict").textContent = "--";
  }
});