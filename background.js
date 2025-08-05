chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.startsWith('http')) {
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: () => document.documentElement.outerHTML,
      });

      if (!results || !results[0]) return;

      const htmlContent = results[0].result;

      const response = await fetch('https://devxworld-riskscanner.onrender.com/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlContent }),
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();

      // Update badge text with score
      chrome.action.setBadgeText({ text: data.score.toString(), tabId: tabId });

      // Set badge background color based on risk
      let color = '#16a34a'; // green safe
      if (data.verdict === 'Caution') color = '#d97706'; // orange
      else if (data.verdict === 'High Risk') color = '#b91c1c'; // red

      chrome.action.setBadgeBackgroundColor({ color: color, tabId: tabId });

      // Show notification if high risk
      if (data.verdict === 'High Risk') {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Warning: High Risk Site',
          message: `The site ${tab.url} is flagged as high risk!`,
          priority: 2,
        });
      }

    } catch (error) {
      console.error('Error in background scan:', error);
      chrome.action.setBadgeText({ text: '', tabId: tabId }); // Clear badge on error
    }
  }
});
