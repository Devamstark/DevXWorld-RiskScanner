chrome.runtime.sendMessage({ action: "getPageContent" }, async (response) => {
  if (!response || !response.content) {
    document.getElementById("status").textContent = "Failed to get page content";
    document.getElementById("score").textContent = "-- / 100";
    document.getElementById("verdict").textContent = "--";
    return;
  }

  const content = response.content;

  try {
    const res = await fetch("https://devxworld-ai-risk-api.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: content }),
    });

    if (!res.ok) throw new Error("API response error");

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
    document.getElementById("status").textContent = "Error analyzing page.";
    document.getElementById("score").textContent = "-- / 100";
    document.getElementById("verdict").textContent = "--";
    console.error(error);
  }
});
