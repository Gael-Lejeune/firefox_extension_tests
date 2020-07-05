/*
Given the name of a beast, get the URL to the corresponding image.
*/
function beastNameToURL(beastName) {
    switch (beastName) {
        case "1":
        return browser.extension.getURL("choices/1.png");
        case "2":
        return browser.extension.getURL("choices/2.png");
        case "3":
        return browser.extension.getURL("choices/3.png");
    }
}

/*
Listen for clicks in the popup.

If the click is on one of the beasts:
Inject the "choose.js" content script in the active tab.

Then get the active tab and send "choose.js" a message
containing the URL to the chosen beast's image.

If it's on a button wich contains class "clear":
Reload the page.
Close the popup. This is needed, as the content script malfunctions after page reloads.
*/

// execute the script now so it can listen to the messages sent by the code below
browser.tabs.executeScript(null, { file: "/content_scripts/choose.js" });


document.addEventListener("click", (e) => {
    if (e.target.classList.contains("choice")) {
        var chosenBeast = e.target.textContent;
        var chosenBeastURL = beastNameToURL(chosenBeast);

        // console.log(chosenBeast);

        var gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {beastURL: chosenBeastURL});
        });
    }
    else if (e.target.classList.contains("clear")) {
        browser.tabs.reload();
        window.close();
    }
});
