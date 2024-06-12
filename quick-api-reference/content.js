(async () => {
    // Sends a message to the service worker and receives a tip in response
    const { tip } = await chrome.runtime.sendMessage({ greeting: 'tip' });

    const nav = document.querySelector('.upper-tabs > nav');
    const tipWidget = createDomElement(`
        <button type="button" popovertarget="tip-popover" popovertargetaction="show" style="padding: 0 12px; height: 36px;">
            <span style="display: block; font: var(--devsite-link-font,500 14px/20px var(--devsite-primary-font-family));">Tip</span>
        </button>
    `);

    const popover = createDomElement(`
    <div id='tip-popover' popover style="margin: auto;">${tip}</div>
    `);

    document.body.append(popover);
    nav.append(tipWidget);
})();


/**
 * WHY creating a DOM element from an HTML string using a function like this is might be better than
   using `innerHTML` to insert HTML content directly into the document!?

 ## using `createDomELement` provides a more secure, maintainable, and more efficient way to handle dynamic HTML content..
    It seperates concerns, improves, error handling, and can be safer against XSS attacks..
 */
function createDomElement(html) {
    const dom = new DOMParser().parseFromString(html, 'text/html');
    return dom.body.firstElementChild;
}