let work = true;
let totalTime = 3600;
let keep_track_of_total_time = 0;
let the_total_page_is_uploaded = false;


setInterval(() => {
  const d = new Date();
  let hour = d.getHours();
  let seconds = d.getSeconds();
  let minutes = d.getMinutes();
  if (hour === 0 && seconds === 0 && minutes === 0) {
    keep_track_of_total_time = 0;
    the_total_page_is_uploaded = false;
    used_websites.forEach((e) => {
      e.start = 0;
      e.timeUp = false;
      e.Timestarted = false;
      e.myInterval = 0;
      e.curtabId = 0;
      e.setTime = false;
    })
  }
},(1000*60));

let present_websites = [
  {url: "www.instagram.com", count: 1500},
  {url: "www.facebook.com", count: 1500}
];

let used_websites = [
  {url: "www.instagram.com", count: 1500, start: 0,timeUp : false,Timestarted : false,setTime : false,myInterval : 0,curtabId : 0},
  {url: "www.facebook.com", count: 1500, start: 0,timeUp : false,Timestarted : false,setTime : false,myInterval : 0,curtabId : 0}
];

chrome.storage.local.set({present_web : present_websites}, () => {
  console.log("done");
})

chrome.storage.local.set({total_time : totalTime},() => {
  console.log("set");
})

function updatestorage() {
  var storage = chrome.storage.local;
  storage.remove("present_web", () => {
    console.log("removed");
  })
  storage.set({present_web : present_websites}, () => {
    console.log("done");
  })
  used_websites = [];
  present_websites.forEach((e) => {
    used_websites.push({url: e.url,count: e.count,start: 0,timeUp : false,Timestarted : false,setTime : false,myInterval : 0,curtabId : 0})
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.status === true) {
    sendResponse({ok : "fine then"})
    work = true;
    chrome.storage.local.set({ key : true},() => {
      console.log("enabled!");
    });
  } else if (request.status === false) {
    sendResponse({ok : "fine then"})
    work = false;
    chrome.storage.local.set({ key : false},() => {
      console.log("enabled!");
    });
  } else if (request.addweb === true) {
    sendResponse({ok: "recieved"});
    present_websites.push(request.nWeb);
    console.log(request.nWeb.url);
    updatestorage();
  } else if (request.update === true) {
    sendResponse({ok : "updated"});
    let updateurl = request.uweb.url;
    present_websites.forEach((e) => {
      if(e.url === updateurl) {
        e.count = request.uweb.count;
        console.log("hey buddy so I am here");
        console.log(e.count);
        updatestorage();
      }
    })
  } else if (request.finalTime === true) {
    sendResponse({ok : "updated"});
    totalTime = request.finalSet;
    chrome.storage.local.set({total_time : totalTime},() => {
      console.log("set");
    })
  }
})

chrome.runtime.onInstalled.addListener(() => {
  console.log("hey yo this is me");
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'https://cdn.pixabay.com/photo/2016/03/08/20/03/flag-1244649_1280.jpg',
    title: 'Hey Buddy ! 😁😁',
    message: 'KEEP WORKING HARD ! 👍🔥',
    priority: 2
  })
})

if (work === true) {

function onCreated(tab) {
  console.log(`Created new tab: ${tab.id}`)
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function startTime(e) {
  e.myInterval = setInterval(() => {
    e.start++;
    keep_track_of_total_time++;
  },1000)
}

function stopTime(e) {
  clearInterval(e.myInterval);
}

setInterval(() => {
  used_websites.forEach((e) => {

    if (e.start === 0 && e.setTime === true) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'https://cdn.pixabay.com/photo/2016/03/08/20/03/flag-1244649_1280.jpg',
        title: `You have ${(e.count/60)} minutes left on ${e.url}`,
        message: 'KEEP WORKING HARD ! 👍🔥',
        priority: 2
      })
    } else if (e.start === (e.count - 120)) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'https://cdn.pixabay.com/photo/2016/03/08/20/03/flag-1244649_1280.jpg',
        title: `You have 2 minutes left on ${e.url}`,
        message: 'KEEP WORKING HARD ! 👍🔥',
        priority: 2
      })
    } else if (e.start === e.count && e.timeUp === false) {
      e.timeUp = true;
      chrome.tabs.query({url : `https://${e.url}/*`}, (tab) => {
        
        chrome.tabs.remove(tab[0].id, () => {
          console.log("buddy this is gonna work, trust me");
    })
  })
  var storage = chrome.storage.local;
  storage.set({the_web_that_was_just_removed : e.url}, () => {
    console.log("the banned website is set");
  })
  let creating = chrome.tabs.create({
    url: 'index.html' 
  });
  creating.then(onCreated, onError);
  const response = chrome.tabs.sendMessage(0, {status: "ban"});
  console.log(response);
} else if (keep_track_of_total_time >= totalTime && the_total_page_is_uploaded === false) {
  stopTime(e);
  the_total_page_is_uploaded = true;
  chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
    chrome.tabs.remove(tabs[0].id, () => {
      console.log("done");
    })
  })
  let creating = chrome.tabs.create({
    url: 'total.html'
  });
  creating.then(onCreated,onError);
}
})
},1000)

function check (tab) {
    chrome.tabs.remove(tab.id, () => {
      console.log("buddy this is gonna work, trust me");
    })

    let creating = chrome.tabs.create({
      url: 'total.html' 
    });

    creating.then(onCreated, onError);
}

function helpstart (tab,e) {
  if (e.Timestarted === false) {
    e.setTime = true;
    e.Timestarted = true;
    startTime(e);
    console.log("the time has started my friend");
    console.log(e.start);
  }
  e.curtabId = tab.id;
}

function helpend (e) {
  stopTime(e);
  e.Timestarted = false;
  console.log("the time has stopped my friend");
  console.log(e.start);
  e.curtabId = 0;
}

function close(tab,e) {
  chrome.tabs.query({url : `https://${e.url}/*`}, (tab) => {
    
  chrome.tabs.remove(tab[0].id, () => {
    console.log("buddy this is gonna work, trust me");
  })

})
var storage = chrome.storage.local;
storage.set({the_web_that_was_just_removed : e.url}, () => {
  console.log("the banned website is set");
})

let creating = chrome.tabs.create({
  url: 'index.html' 
});

creating.then(onCreated, onError);
    const response = chrome.tabs.sendMessage(tab.id, {status: "ban"});
    console.log(response);
}

chrome.tabs.onActivated.addListener ((tabId,windowId) => {
  chrome.tabs.query({active: true, lastFocusedWindow: true}, (tabs) => {
    let tab = tabs[0];
    console.log(tab.url);
    for(let i = 0; i < used_websites.length;i++) {
      let e = used_websites[i];
      if(tab.url.indexOf(e.url) != -1) {
        if(the_total_page_is_uploaded === true) {
          check(tab);
          break;
        }
        if(e.timeUp === false) {
          helpstart(tab,e);
        } else {
          close(tab,e);
        }
      } else {
        helpend(e);
      }
    }
  })
})

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.status === "complete") {
    for(let i = 0; i < used_websites.length;i++) {
      let e = used_websites[i];
      if(tab.url.indexOf(e.url) != -1) {
        if(the_total_page_is_uploaded === true) {
          check(tab);
          break;
        }
        if(e.timeUp === false) {
        helpstart(tab,e);
        } else {
          close(tab,e);
        }
      } else {
        helpend(e);
      }
    }
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == "complete") {
    for(let i = 0; i < used_websites.length;i++) {
      let e = used_websites[i];
      if (tab.url.indexOf(e.url) != -1) {
        if(the_total_page_is_uploaded === true) {
          check(tab);
          break;
        }
        if(e.timeUp === false) {
        helpstart(tab,e);
        } else {
          close(tab,e);
        }
      } else {
        helpend(e);
      }
    }
  }
});

chrome.tabs.onRemoved.addListener((tabId,removeInfo) => {
  for(let i = 0; i < used_websites.length;i++) {
    let e = used_websites[i];
    if(e.curtabId === tabId) {
      helpend(e);
    }
  }
})




}