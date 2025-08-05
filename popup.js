chrome.runtime.sendMessage({ action: "getPageContent" }, async (response) => {
  if (!response || !response.content) {
    document.getElementById("status").textContent = "Failed to get page content";
    return;
  }

  const content = response.content;

  const res = await fetch("https://devxworld-ai-risk-api.onrender.com/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ html: content })
  });

  const data = await res.json();
  document.getElementById("score").textContent = `${data.score} / 100`;

  const verdictEl = document.getElementById("verdict");
  verdictEl.textContent = data.verdict;

  // Remove old verdict class
  verdictEl.classList.remove("safe", "caution", "risk");

  // Add new one based on verdict
  if (data.verdict === "Safe") verdictEl.classList.add("safe");
  else if (data.verdict === "Caution") verdictEl.classList.add("caution");
  else if (data.verdict === "High Risk") verdictEl.classList.add("risk");

  document.getElementById("status").textContent = "AI Scan Complete ✅";
});
