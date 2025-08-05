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

    if (!res.ok) throw new Error("API failed");

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
    document.getElementById("status").textContent = "Error analyzing page.";
    document.getElementById("score").textContent = "-- / 100";
    document.getElementById("verdict").textContent = "--";
  }
});
