chrome.runtime.onInstalled.addListener(async () => {
    console.log('Extension installed');
    console.log("Popup script is running");
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.handleName) {
        fetchLeetcodeStats(message.handleName).then(stats => {
            sendResponse({ stats, leetcodeStats: true });
        }).catch(error => {
            console.error('Error fetching stats:', error);
            sendResponse({ error: error.message });
        });
    } else if (message.action) {
        fetchTodaysQuestion().then(stats => {
            sendResponse({ stats });
        }).catch(error => {
            console.error('Error fetching stats:', error);
            sendResponse({ error: error.message });
        });
    }
    return true;
});

async function fetchTodaysQuestion() {
    const query = `query questionOfToday { activeDailyCodingChallengeQuestion { link question { title } } }`;

    const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
    });
    const data = await response.json()
    return data.data.activeDailyCodingChallengeQuestion
}

async function fetchLeetcodeStats(handleName) {
    const query = `query userProfileAndProblemsSolved { matchedUser(username: "${handleName}") { profile { userAvatar realName } submitStatsGlobal { acSubmissionNum { difficulty count } } } allQuestionsCount { difficulty count } }`;

    const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
    });
    const data = await response.json()
    return data
}