chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
    if (request.status === "ban") {
        console.log("hey man this is me");
        sendResponse({banned: "YES"});
    }
})