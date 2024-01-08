console.log("Popup script running");

document.addEventListener('DOMContentLoaded', function() {
    const fetchDataButton = document.getElementById('fetchData');
    const editHandleButton = document.getElementById('editHandle');
    const handleInputContainer = document.getElementById('handleInputContainer');
    const dataContainer = document.getElementById('dataContainer');
    const savedHandle = localStorage.getItem('leetcodeHandle');
    const nameInput = document.getElementById('handleName');
    fetchQuestionOfTheDay();

    nameInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitHandleName(nameInput);
        }
    });

    if (savedHandle) {
        handleInputContainer.style.display = 'none';
        displayHandleName(savedHandle);
        sendMessageToBackground({ handleName: savedHandle });
    }
    fetchDataButton.addEventListener('click', function() {
        submitHandleName(nameInput);
    });

    editHandleButton.addEventListener('click', function() {
        dataContainer.style.display = 'none';
        handleInputContainer.style.display = 'block';
        nameInput.focus();
    });
});


function submitHandleName(nameInput) {
    const handleName = nameInput.value.trim();
    if (handleName) {
        saveHandleName(handleName);
        sendMessageToBackground({ handleName });
    } else {
        alert('Please enter a handle name.');
    }
}

function saveHandleName(handleName) {
    localStorage.setItem('leetcodeHandle', handleName);
    localStorage.setItem('handleSaveTime', new Date().getTime());
    displayHandleName(handleName);
}

function displayHandleName(handleName) {
    const handleDisplayElement = document.getElementById('handleDisplay');
    handleDisplayElement.textContent = handleName;
    document.getElementById('handleInputContainer').style.display = 'none';
    document.getElementById('dataContainer').style.display = 'block';
}

function sendMessageToBackground(message) {
    chrome.runtime.sendMessage(message, function(response) {
        if (response && response.leetcodeStats) {
            displayStats(response.stats);
        }
    });
}

function displayStats(response) {
    document.getElementById('totalSolved').textContent = response.matchedUser.submitStatsGlobal.acSubmissionNum[0].count;
    document.getElementById('easyTotal').textContent = response.allQuestionsCount[1].count;
    document.getElementById('easySolved').textContent = response.matchedUser.submitStatsGlobal.acSubmissionNum[1].count;
    document.getElementById('mediumTotal').textContent =response.allQuestionsCount[2].count;
    document.getElementById('mediumSolved').textContent = response.matchedUser.submitStatsGlobal.acSubmissionNum[2].count;
    document.getElementById('hardTotal').textContent = response.allQuestionsCount[3].count;
    document.getElementById('hardSolved').textContent = response.matchedUser.submitStatsGlobal.acSubmissionNum[3].count;
}

function fetchQuestionOfTheDay() {
    // Placeholder: Replace with an actual call to fetch the question of the day
    chrome.runtime.sendMessage({ action: 'getQuestionOfTheDay' }, function(response) {
    if (response && response.stats) {
            displayQuestionOfTheDay(response.stats);
        }
    });
}
function displayQuestionOfTheDay(question) {
    const questionElement = document.getElementById('questionOfTheDay');
    questionElement.innerHTML = ''; // Clear any existing content

    const linkElement = document.createElement('a');
    linkElement.href = "https://leetcode.com" + question.link; 
    linkElement.textContent = question.question.title; 
    linkElement.target = '_blank'; // Open in a new tab

    // Append the link element to the question element
    questionElement.appendChild(linkElement);
}