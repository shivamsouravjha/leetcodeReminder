chrome.runtime.onInstalled.addListener(async () => {
    console.log('Extension installed');
    console.log("Popup script is running");
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.handleName) {
        fetchLeetcodeStats(message.handleName).then(stats => {
            console.log(stats)
            sendResponse(stats);
        }).catch(error => {
            console.error('Error fetching stats:', error);
            sendResponse({ error: error.message });
        });
    }
    fetchTodaysQuestion().then(stats => {
        sendResponse(stats);
    }).catch(error => {
        console.error('Error fetching stats:', error);
        sendResponse({ error: error.message });
    });
    return true;
});

async function fetchTodaysQuestion() {
    const query = `query questionOfToday { activeDailyCodingChallengeQuestion { date userStatus link question { acRate difficulty freqBar frontendQuestionId: questionFrontendId isFavor paidOnly: isPaidOnly status title titleSlug hasVideoSolution hasSolution topicTags { name id slug } } } }`;

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
    const query = `query userProblemsSolved { allQuestionsCount { difficulty, count } matchedUser(username:"${handleName}"){ submitStatsGlobal{ acSubmissionNum{ difficulty, count } } } }`;


    const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
    });
    const data = await response.json()
    return data.data
}