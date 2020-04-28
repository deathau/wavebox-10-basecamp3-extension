const main = async function () {
    // make sure we have wavebox permissions
    const permission = await window.wavebox.requestPermission()
    if (permission === 'ALLOWED') {
        // make sure the script is running in an app
        const isApp = await window.wavebox.isApp()
        if (isApp) {
            // inject the page script
            // (which will fetch the unreads and pass them back)
            const scripts = ['basecamp3_page.js']
            scripts.forEach(scriptName => {
                var s = document.createElement('script');
                s.src = chrome.runtime.getURL(scriptName);
                s.onload = function () {
                    this.remove();
                };
                (document.head || document.documentElement).appendChild(s);
            });

            // add a listener for messages from the page script
            window.addEventListener('message', function (event) {
                // make sure this message comes from the basecamp page
                if (event.origin == "https://3.basecamp.com") {
                    // update the unreads badge
                    if (event.data.type == 'basecamp3_unreads') {
                        window.wavebox.setBadgeCount(event.data.count);
                        // send the data to the background page
                        // to update the badge icon
                        chrome.runtime.sendMessage(event.data);
                    }
                    // update the messages (dashboard / wavebox mini)
                    if (event.data.type == 'basecamp3_messages') {
                        window.wavebox.setTrayMessages(event.data.messages);
                    }
                }
            });
        }
    }
}

main()