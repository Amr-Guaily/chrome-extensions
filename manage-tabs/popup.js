const tabs = await chrome.tabs.query({
    url: [
        "https://developer.chrome.com/docs/webstore/*",
        "https://developer.chrome.com/docs/extensions/*",
    ]
});

// The Collator used to sort the tabs array by the user's preferred language.
const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.title, b.title));

const template = document.getElementById("li_template");
const elements = new Set();
for (const tab of tabs) {
    console.log(tab);
    const element = template.content.firstElementChild.cloneNode(true);

    const title = tab.title.split("-")[0].trim();
    const pathname = new URL(tab.url).pathname.slice("/docs".length);

    element.querySelector(".title").textContent = title;
    element.querySelector(".pathname").textContent = pathname;
    // Change the focus of the tab
    element.querySelector("a").addEventListener("click", async () => {
        // need to focus window as well as the active tab
        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
    });

    elements.add(element);
}
console.log(elements);
document.querySelector("ul").append(...elements);

const button = document.querySelector("button");
button.addEventListener("click", async () => {
    const tabIds = tabs.map(({ id }) => id);
    if (tabIds.length) {
        const group = await chrome.tabs.group({ tabIds });
        await chrome.tabGroups.update(group, { title: "DOCS" });
    }
});