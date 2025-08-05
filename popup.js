// Send a message to background.js to get current tab's page content
chrome.runtime.sendMessage({ action: "getPageContent" }, (response) => {
  if (!response || !response.content) {
    document.getElementById("status").textContent = "Failed to get page content";
    return;
  }

  const content = response.content;

  // Simple risk scoring rules
  let score = 0;
  if (!content.includes("https")) score += 20;
  if (content.match(/password/i)) score += 15;
  if (content.match(/login|verify|update|bank|credentials/i)) score += 20;
  if ((content.match(/<script/g) || []).length > 5) score += 10;
  if (content.match(/iframe/i)) score += 15;

  // Update UI
  document.getElementById("score").textContent = score;

  let verdict = "Safe 🟢";
  if (score >= 70) verdict = "High Risk 🔴";
  else if (score >= 40) verdict = "Caution 🟡";

  document.getElementById("verdict").textContent = verdict;
  document.getElementById("status").textContent = "Scan Complete";
});