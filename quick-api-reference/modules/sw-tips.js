// fetch all tips, pick one at random and save it to storage
// Alarms are not saved when you close Chrome. So we need to check if the arlarms exists and crate it if it doesn't

const ALARM_NAME = 'tip';

const updateTip = async () => {
    const res = await fetch('https://extension-tips.glitch.me/tips.json');
    const tips = await res.json();
    const randomIdx = Math.floor(Math.random() * tips.length);

    // The function will return a promise to its caller. So where/how this promise resolve!?
    // ## The promise returned by `chrome.storage.local.set` is resolved by the Chrome extension APIs when the data has been successfully stored in local storage.
    return chrome.storage.local.set({ tip: tips[randomIdx] });
};

async function createAlarm() {
    const alarm = await chrome.alarms.get(ALARM_NAME);
    if (typeof alarm === 'undefined') {
        chrome.alarms.create(ALARM_NAME, {
            delayInminutes: 1,
            periodInMinutes: 1400
        });

        /*
            ## WHY not await `updateTip()`!?
            Non-blocking execution (immediate alarm setup): 
                - By not awaiting the function can return immediately.
                - The fetch operation might take a while, and you don't want to delay setting up the alarm.
        */
        updateTip();
    }
}

createAlarm();

// You don't use await when registering `updateTip` because you are not calling it; you are telling the system to call it later when the alarm event occurs.
chrome.alarms.onAlarm.addListener(updateTip);


/**  #### Lifecycle of updateTip ####

1-Event Trigger:
Start the execution of the updateTip function.

2-Asynchronous Operations:
The function performs its asynchronous operations sequentially due to await keywords.
Each await pauses the function until the awaited promise resolves.

3-Completion of Operations:
At this point, all asynchronous tasks within updateTip have finished.

 ** Post-Execution Effects **

1-Function Returns:
When updateTip finishes, it returns control back to the environment that called it (in this case, the Chrome event system).
Since updateTip returns the promise from chrome.storage.local.set, the function technically completes when this promise resolves.
And we know that this promise is resolved by the Chrome extension APIs when the data has been successfully stored in local storage.

2-Next Event:
The system is now ready to handle the next event.

3- State changed:
Any side effects of the function (like the updated local storage) are now in place and can be observed by other parts of the extension.
For instance, if other parts of the extension read the stored tip value, they will get the updated tip.s
 */