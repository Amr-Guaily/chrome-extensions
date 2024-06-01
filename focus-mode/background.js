// The URLs the extension will react to
const extensions = 'https://developer.chrome.com/docs/extensions';
const webstore = 'https://developer.chrome.com/docs/webstore';

const vailableUrls = [extensions, webstore];

chrome.runtime.onInstalled.addListener(async () => {
  // console.log(chrome.action);
  chrome.action.setBadgeText({
    text: "OFF"
  });
});

// Event listener to the extension's action (usually the toolbar icon)
// tab parameter repersents the tab that was active when the icon was clicked.
chrome.action.onClicked.addListener(async (tab) => {
  const isValidUrl = checkTabUrl(tab.url);
  if (isValidUrl) {
    // Reterive the current text displayed on the extension's badge
    const currentState = await chrome.action.getBadgeText({ tabId: tab.id });

    // Toogle badge text
    const nextState = currentState == "OFF" ? "ON" : "OFF";
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState
    });

    if (nextState === "ON") {
      // Insert the css file when the user turns the extension on
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ["focus-mode.css"]
      });
    } else if (nextState === "OFF") {
      await chrome.scripting.removeCSS({
        target: { tabId: tab.id },
        files: ["focus-mode.css"]
      });
    }
  }
});

// Helelper functions
function checkTabUrl(tabUrl) {
  for (url of vailableUrls) {
    if (tabUrl.startsWith(url)) return true;
  }

  return false;
}