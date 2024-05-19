const textInput = document.getElementById('main-input');
const entryItem = document.querySelector('.entry-item');
let deleteBtn = document.querySelector('.delete-btn');
const stopStartBtn= document.getElementById('startStop');
const entriesList = document.getElementById('entries-container');
let display = document.getElementById('display');
let hungryText = document.getElementById('hungry');

// stop watch
let seconds = 0, minutes = 0, hours = 0;
let displaySeconds = 0, displayMinutes = 0, displayHours = 0;
let interval = null;
let stopWatchStatus = 'stopped';

function stopWatch() {
    seconds++;

    if (seconds / 60 === 1) {
        seconds = 0;
        minutes++;

        if (minutes / 60 === 1) {
            minutes = 0;
            hours++;
        }
    }

    if (seconds < 10) {
        displaySeconds = '0' + seconds.toString();
    } else {
        displaySeconds = seconds;
    }

    if (minutes < 10) {
        displayMinutes = '0' + minutes.toString();
    } else {
        displayMinutes = minutes;
    }

    if (hours < 10) {
        displayHours = '0' + hours.toString();
    } else {
        displayHours = hours;
    }


    display.innerHTML = displayHours + ':' + displayMinutes + ':' + displaySeconds;
}

function startStop() {
    if (textInput.value === '') {
        return; 
    } else if (stopWatchStatus === 'stopped') {
        interval = window.setInterval(stopWatch, 1000);
        stopStartBtn.innerHTML = 'Stop';
        stopWatchStatus = 'started';
    } else {
        window.clearInterval(interval);
        stopStartBtn.innerHTML = 'Start';
        stopWatchStatus = 'stopped';
        seconds = 0;
        minutes = 0;
        hours = 0;
    }
}

// Adds entry to the list
function addEntry() {
    const text = textInput.value;
    
    if (stopWatchStatus === 'started') {
        return;;
    } 
    if (text === '') {
        alert('Please enter a value');
    } else if (stopWatchStatus === 'stopped') {
        entriesList.innerHTML += `
        <div class="entry-row"> 
            <div class="entry-text"><p>${text}</p></div>
            <div class="action-container">
                <div>${display.innerHTML}</div>
                <button class="delete-btn">Delete</button>
            </div>
        </div>
    `;
    hungryText.innerHTML = '';
    textInput.value = '';
    display.innerHTML = '00:00:00';
    }
}

stopStartBtn.addEventListener('click', addEntry);

// Deletes entry from the list
entriesList.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.parentElement.remove();
    };
});

