let add_web = document.getElementById("web_press");
let web_name = document.getElementById("web_name");
let total = document.getElementById("set_total");
let current_websites = [];

function createBlockWebsite (web_name,high) {
    var div = document.createElement("div");
    div.innerHTML = web_name;
    div.setAttribute("class","blockweb");
    document.getElementsByClassName("row")[0].appendChild(div);
    var selectList = document.createElement("select");
    selectList.setAttribute("class","limit_input");
    selectList.classList.add(web_name);
    div.appendChild(selectList);
    for (var i = 5; i <= 30;i+=5) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        if (i == high) {
            option.setAttribute("selected",true);
        }
        selectList.appendChild(option);
    }
}

chrome.storage.local.get(["present_web"]).then((result) => {
    current_websites = result.present_web;
    current_websites.forEach((e) => {
        createBlockWebsite(e.url,(e.count/60));
    })
})

chrome.storage.local.get(["total_time"]).then((result) => {
    let set_the_time = document.getElementById("total");
    set_the_time.value = (result.total_time/60);
})

add_web.addEventListener("click", () => {
    let new_web = web_name.value;
    if(new_web.indexOf("www.") != -1 && new_web.indexOf(".com") != -1) {
        if(current_websites.includes(new_web)) {
            alert("this website is already present in the list of blocked websites !")
        } else {
            createBlockWebsite(new_web,25);
            current_websites.push({new_web : 0});
            chrome.runtime.sendMessage({addweb : true, nWeb : {url : new_web,count : 1500}}, (response) => {
                console.log(response.ok);
            })
        }
        web_name.value = "";
    } else {
        alert("please enter a valid url")
    }
})

total.addEventListener("click", () => {
    let time = document.getElementById("total").value;
    if(time > 120 || time < 0) {
        alert("Using social media sites for more than 120 minutes is not recommended. Please select a lower value.")
    } else {
        let abcp = time*60;
        chrome.runtime.sendMessage({finalTime : true, finalSet : abcp}, (r) => {
            console.log(r.ok);
        });
        alert(`a total time limit of ${time} minutes has been set`);
    }
})
setInterval(() => {
    $(document).ready(function() {
        $("select.limit_input").change(function() {
            let selectedItem = $(this).children("option:selected").val();
            let myclass = $(this).attr("class").split(/\s+/);
            let finalurl = myclass[1];
            console.log(finalurl);
            console.log(selectedItem);
            chrome.runtime.sendMessage({update: true, uweb : {url : finalurl,count: (selectedItem*60)}}, (r) => {
                console.log(r.ok);
            })
        })
    })
},1000);