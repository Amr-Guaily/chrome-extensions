// destructure the 'reason' property from the event object

// onInstalled => this event will be fired when the extension is first installed, updated to a new version, or chrome is updated to a new version.
// when a user installs the extension for the fisrt time, this event fires.
chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        chrome.storage.local.set({
            apiSuggestion: ['tabs', 'storage', 'scripting']
        });
    }
});

const URL_CHROME_EXTENSIONS_DOC = 'https://developer.chrome.com/docs/extensions/reference/';
const NUMBER_OF_PREVIOUS_SEARCHES = 4;

// Display the suggestions after user starts typing => When the user enters the omnibox keyword (api), chrome will display a list of suggestions based on the keywords in storage.
// addListener => this method adds a listener to handle the input change event.
// suggest => a callback function used to handle suggestions.
chrome.omnibox.onInputChanged.addListener(async (input, suggest) => {
    await chrome.omnibox.setDefaultSuggestion({
        description: 'Enter a chrome API or choose from past searches'
    });

    const { apiSuggestions } = await chrome.storage.local.get('apiSuggestions');
    const suggestions = apiSuggestions.map(api => {
        return { content: api, description: `Open chrome.${api} API` };
    });

    suggest(suggestions);
});

// After the user selects a suggestion => open the corresponding Chrome API referance page.
chrome.omnibox.OnInputEntered.addListener((input) => {
    chrome.tabs.create({ url: URL_CHROME_EXTENSIONS_DOC + input });

    // save the latest key word
    updateHistory(input);
});

// This way the most recent search can be used later as an omnibox suggestion.
async function updateHistory(input) {
    const { apiSuggestions } = await chrome.storage.local.get('apiSuggestions');
    apiSuggestions.unshift(input);
    apiSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES);

    await chrome.storage.local.set({ apiSuggestions });
}