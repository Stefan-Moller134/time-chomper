class Entry {
    static id = 0;
    constructor(title, time) {
        this.id = Entry.id++;
        this.title = title;
        this.time = time;
    }
}

function findEntry(id) {
    return entries.find(entry => entry.id === id);
}

function deleteEntry(id) {
    const entry = findEntry(id);
    const index = entries.indexOf(entry);
    entries.splice(index, 1);
}


const textInput = document.getElementById('main-input');
const entryItem = document.querySelector('.entry-item');
const deleteBtn = document.querySelector('.delete-btn');
const stopStartBtn= document.getElementById('startStop');
const entriesList = document.getElementById('entries-container');
const chompyIsHungry = document.getElementById('chompyIsHungry');
const timeDisplay = document.getElementById('timeDisplay');
const entryTemplate = document.getElementById('entryTemplate');
const entries = [];

// stop watch
let seconds = 0, minutes = 0, hours = 0;
let displaySeconds = 0, displayMinutes = 0, displayHours = 0;
let interval = null;
let stopWatchStatus = 'stopped';

function stopWatch() {
    seconds++;

    if (seconds / 60 >= 1) { 
        seconds = 0;
        minutes++;

        if (minutes / 60 >= 1) {
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


    timeDisplay.innerHTML = displayHours + ':' + displayMinutes + ':' + displaySeconds;
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
   
    if (stopWatchStatus === 'started') return;

    if (stopWatchStatus === 'stopped') {

        const entry = new Entry(textInput.value, timeDisplay.innerHTML);

        if (entry.title === '') return alert('Please enter a byte!');

        const clone = entryTemplate.content.cloneNode(true);
    
        const title = clone.querySelector('.entry-text');
        const time = clone.querySelector('.entry-time');
        const deleteBtn = clone.querySelector('.delete-btn');
        
        title.textContent = entry.title;
        time.textContent = entry.time;
        deleteBtn.value = entry.id;

        entriesList.appendChild(clone);

        textInput.value = '';
        timeDisplay.innerHTML = '00:00:00';
        chompyIsHungry.style.display = 'none';

        entries.push(entry);

        console.log(entries);
    }
}


stopStartBtn.addEventListener('click', addEntry);


// Deletes entry from the list
entriesList.addEventListener('click', function(event) {
    const deleteButton = event.target;
    if (deleteButton.classList.contains('delete-btn')) {
        deleteButton.parentElement.parentElement.remove();
        if (entriesList.children.length === 0) {
            setTimeout(function() { chompyIsHungry.style.display = 'block'; });
        }
        const entityId = parseInt(deleteButton.value);
        deleteEntry(entityId);
        console.log(entries);
    };
});


// Save entries to local storage
window.addEventListener('beforeunload', function() {
    localStorage.setItem('entries', JSON.stringify(entries));
});


// load entries from local storage
window.addEventListener('load', function() {
    const storedEntries = JSON.parse(localStorage.getItem('entries'));
    if (storedEntries) {
        storedEntries.forEach(entry => {
            const clone = entryTemplate.content.cloneNode(true);
    
            const elTitle = clone.querySelector('.entry-text');
            const elTime = clone.querySelector('.entry-time');
            const elDeleteBtn = clone.querySelector('.delete-btn');
            
            elTitle.textContent = entry.title;
            elTime.textContent = entry.time;
            elDeleteBtn.value = entry.id;

            entriesList.appendChild(clone);

            entries.push(entry);

            console.log(entries);
        });

        if (entries.length > 0) chompyIsHungry.style.display = 'none';
    } // if storedEntries
}); // window load


// // clear local storage
// window.addEventListener('storage', function() {
//     localStorage.clear();
// });

// // clear all entries
// const clearAllBtn = document.getElementById('clearAll');
// clearAllBtn.addEventListener('click', function() {
//      entriesList.innerHTML = '';
//     entries.length = 0;
//     localStorage.clear();
//     chompyIsHungry.style.display = 'block';
// });

