chrome.runtime.onInstalled.addListener(function () {
});
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (sender.origin == "https://3.basecamp.com" || sender.origin == "http://3.basecamp.com") {
        if (message.type == "basecamp3_unreads") {
            chrome.browserAction.setBadgeText({ text: `${message.count || ""}` });
        }
    }
});