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