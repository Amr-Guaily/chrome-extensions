// #### Run Scripts on every page ####

/*
    The extension will fisrt check if the page contains the <article> elem,
    then it will count all the words within this element and create paragraph that displays the total reading time.
*/

const article = document.querySelector("article");

if (article) {
    const readingTimeInMinutes = calcReadingTime();

    dispalyReadingTime(readingTimeInMinutes);
}

function calcReadingTime() {
    const text = article.textContent;
    const wordMatchRegExp = /[^\s]+/g;
    const words = text.matchAll(wordMatchRegExp)
    
    // matchAll returns an iterator, convert to an array to get word count
    const wordCount = [...words].length; 

    // 200 => average reading speed for an adult, measured in words per minute (wpm)
    return Math.round(wordCount / 200)
}

function dispalyReadingTime(readingTimeInMinuts) {
    // Support for API reference docs
    const heading = article.querySelector('h1')
    // Support for article docs with date
    const date = article.querySelector('time')?.parentNode

    const badge = document.createElement('p')
    badge.textContent = `⏱️ ${readingTimeInMinuts} min read`

    // Nullish coalescing operator => evaluates the left-hand operand('date') and if it's null/undefined, it returns the right-hand operand('heading).
    const ItemToInsertAfter = (date ?? heading)
    ItemToInsertAfter.insertAdjacentElement("afterend", badge)
}