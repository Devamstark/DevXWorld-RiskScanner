{
  "manifest_version": 3,
  "name": "DevXWorld Risk Scanner",
  "version": "1.0",
  "description": "AI-powered extension to assess the risk of websites.",
  "permissions": ["tabs", "scripting", "activeTab"],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icons/icon.png"
  },
  "background": {
    "service_worker": "background.js"
  }
}
// For Manifest v3, use chrome.scripting.executeScript from background to get page content

// Request content from background script and analyze
chrome.runtime.sendMessage({ action: "getPageContent" }, (response) => {
  if (!response || !response.content) {
    document.getElementById("status").textContent = "Failed to get page content";
    return;
  }
  const content = response.content;

  let score = 0;
  if (!content.includes("https")) score += 20;
  if (content.match(/password/i)) score += 15;
  if (content.match(/login|verify|update|bank|credentials/i)) score += 20;
  if ((content.match(/<script/g) || []).length > 5) score += 10;
  if (content.match(/iframe/i)) score += 15;

  document.getElementById("score").textContent = score;

  let verdict = "Safe 🟢";
  if (score >= 70) verdict = "High Risk 🔴";
  else if (score >= 40) verdict = "Caution 🟡";

  document.getElementById("verdict").textContent = verdict;
  document.getElementById("status").textContent = "Scan Complete";
});

