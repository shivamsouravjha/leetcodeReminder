console.log("Popup script running");

document.addEventListener('DOMContentLoaded', function() {
    const fetchDataButton = document.getElementById('fetchData');
    const editHandleButton = document.getElementById('editHandle');
    const handleInputContainer = document.getElementById('handleInputContainer');
    const dataContainer = document.getElementById('dataContainer');

    const savedHandle = localStorage.getItem('leetcodeHandle');
    if (savedHandle) {
        handleInputContainer.style.display = 'none';
        displayHandleName(savedHandle);
    }

    fetchDataButton.addEventListener('click', function() {
        const handleName = document.getElementById('handleName').value.trim();
        if (handleName) {
            saveHandleName(handleName);
            sendMessageToBackground({ handleName });
        } else {
            alert('Please enter a handle name.');
        }
    });

    editHandleButton.addEventListener('click', function() {
        dataContainer.style.display = 'none';
        handleInputContainer.style.display = 'block';
        document.getElementById('handleName').focus();
    });
});

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
        if (response.stats) {
            displayStats(response.stats);
        }
    });
}

function displayStats(stats) {
    document.getElementById('totalSolved').textContent ="1" + ' Solved';
    document.getElementById('easySolved').textContent ="2";
    // document.getElementById('easyTotal').textContent = stats.easy.total;
    // document.getElementById('easyPercent').textContent = 'Beats ' + stats.easy.percent + '%';
    // document.getElementById('mediumSolved').textContent = stats.medium.solved;
    // document.getElementById('mediumTotal').textContent = stats.medium.total;
    // document.getElementById('mediumPercent').textContent = 'Beats ' + stats.medium.percent + '%';
    // document.getElementById('hardSolved').textContent = stats.hard.solved;
    // document.getElementById('hardTotal').textContent = stats.hard.total;
    // document.getElementById('hardPercent').textContent = 'Beats ' + stats.hard.percent + '%';
}
