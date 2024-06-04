import './modules/sw-omnibox.js';
import './modules/sw-tips.js';

// send tip to content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.greeting === 'tip') {
        chrome.storage.local.get('tip').then(sendResponse);
        return true;
    }
}); 