// on install, disable extension and set maxTabAmt/cwtl to null
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
        enabled: true,
        maxTabAmt: 100
    }, function() {});
});

// local variables
let maxTabAmt = 100;
let enabled = true;
let currentTabAmt = 0;
updateBadge();

// sync the values from storage with local variables
chrome.storage.sync.get([
    'enabled',
    'maxTabAmt'
    ],
 (result) => {
    maxTabAmt = result.maxTabAmt;
    enabled = result.enabled;
})

// for each new tab created, set new tab amt, 
// remove tab if over limit, update badge
chrome.tabs.onCreated.addListener(
    (tab) => {
        // setTabAmt();
        updateBadge();

        if (currentTabAmt > maxTabAmt-1) {
            chrome.tabs.remove(
                tab.id
            )
            console.log('tab removed bc ' + currentTabAmt + ' > ' + maxTabAmt);
        }
        
    }
)

// if tab removed, update currentTabAmt and badge
chrome.tabs.onRemoved.addListener(
    (tab) => {
        // setTabAmt();
        updateBadge();
    })
  

// updates maxTabAmt / enabled if changed in storage
chrome.storage.sync.onChanged.addListener(
    (changes, areaName) => {
        
        // setTabAmt();
        updateBadge();

        if (changes.maxTabAmt) {
            maxTabAmt = changes.maxTabAmt.newValue;
            console.log('maxTabAmt changed to ' + maxTabAmt);
        }
        else {
            enabled = changes.enabled.newValue;
            console.log('enabled changed to ' + enabled);
        }
    }
);

// function that updates badge text/color according to current tab count
async function updateBadge() {
    let tabCount = await setTabAmt();
    console.log("updateBadge(): " + tabCount);
    chrome.action.setBadgeText({text: tabCount.toString()});
    var textCount = `${currentTabAmt}/${maxTabAmt} tabs are currently open`
    chrome.action.setTitle({title: textCount});
    if (tabCount <= Math.floor(maxTabAmt/1.5)) {
        chrome.action.setBadgeBackgroundColor({color:'#2adf79'});
    }
    else if (tabCount <= Math.floor(maxTabAmt/1.1)) {
        chrome.action.setBadgeBackgroundColor({color:'#ff925c'});
    }
    else {
        chrome.action.setBadgeBackgroundColor({color:'#f4345a'});
    }
}

function setTabAmt() {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query(
                {},
                (tabs) => {
                    currentTabAmt = tabs.length;
                    console.log("setTabAmt(): " + currentTabAmt);
                    resolve(currentTabAmt);
                }
            )
        } catch (e) {
            reject(e);
        }
    })
}