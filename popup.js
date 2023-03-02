let ability = document.getElementById("disable");
let head = document.getElementsByTagName("h1")[0];
let settings = document.getElementById("settings");

chrome.storage.local.get(["key"]).then((result) => {
    console.log("Value currently is " + result.key);
    let current = result.key;
    if(current === true) {
        head.innerHTML = "Peace is enabled";
        ability.innerHTML = "disable Peace";
    } else if (current === false) {
        head.innerHTML = "Peace is disabled";
        ability.innerHTML = "enable Peace";
    }
});

ability.addEventListener("click", () => {
    if (head.innerHTML === "Peace is enabled" ) {
        head.innerHTML = "Peace is disabled"
        ability.innerHTML = "enable Peace"
        chrome.runtime.sendMessage({status : false}, (response) => {
            console.log(response.ok);
        })
        check = false;
    } else {
        head.innerHTML = "Peace is enabled";
        ability.innerHTML = "disable Peace";
        chrome.runtime.sendMessage({status : true}, (response) => {
            console.log(response.ok);
        })
        check = true;
    }
})

settings.addEventListener("click", () => {
    chrome.tabs.create({
        url : "settings.html"
    })
})