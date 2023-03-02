var storage = chrome.storage.local;
storage.get(["the_web_that_was_just_removed"], (r) => {
    let url = r.the_web_that_was_just_removed;
    let up = document.getElementById("page-name");
    up.innerHTML = url;
})