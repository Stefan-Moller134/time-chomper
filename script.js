class Entry {
  static id = 0;
  constructor(date, title, time) {
    this.id = Entry.id++;
    this.date = date
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
const currentDateTime = document.getElementById('currentDateTime');
const entryItem = document.querySelector('.entry-item');
const deleteBtn = document.querySelector('.delete-btn');
const stopStartBtn= document.getElementById('startStop');
const entriesList = document.getElementById('entries-container');
const chompyIsHungry = document.getElementById('chompyIsHungry');
const timeDisplay = document.getElementById('timeDisplay');
const entryTemplate = document.getElementById('entryTemplate');
const totalTime = document.getElementById('totalTime');
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

function showDateTime() {
  var now = new Date();
  var dateTimeString = now.toLocaleString();
  document.getElementById('currentDateTime').textContent = dateTimeString;
}
showDateTime();
setInterval(showDateTime, 1000); // Update the date and time every second

function calculateTotalTime() {
  let totalSeconds = entries.reduce((total, entry) => {
    let [hours, minutes, seconds] = entry.time.split(':').map(Number);
    return total + hours * 3600 + minutes * 60 + seconds;
  }, 0);

  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = Math.floor(totalSeconds % 60);

  // Pad the minutes and seconds with leading zeros, if required
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  // Display the total time in the format HH:MM:SS
  totalTime.textContent = `${hours}:${minutes}:${seconds}`;
}

// Adds entry to the list
function addEntry() {
  if (stopWatchStatus === 'started') return;

  if (stopWatchStatus === 'stopped') {
    const entry = new Entry(currentDateTime.textContent, textInput.value, timeDisplay.innerHTML);

    if (entry.title === '') return alert('Please enter a byte!');

    const clone = entryTemplate.content.cloneNode(true);

    const title = clone.querySelector('.entry-text');
    const dateElement = clone.querySelector('.entry-date');
    const time = clone.querySelector('.entry-time');
    const deleteBtn = clone.querySelector('.delete-btn');

    title.textContent = entry.title;
    dateElement.textContent = entry.date;
    time.textContent = entry.time;
    deleteBtn.value = entry.id;

    entriesList.appendChild(clone);

    textInput.value = '';
    timeDisplay.innerHTML = '00:00:00';
    chompyIsHungry.style.display = 'none';

    entries.push(entry);
    feedChompy();
    calculateTotalTime();

    console.log(entries);
  }
}

const hunger = document.getElementById('hunger-line');
const hungerText = document.getElementById('hunger-text');

function feedChompy() {
  // Calculate total hours from all entries
  let totalHours = entries.reduce((total, entry) => {
    let [hours, minutes, seconds] = entry.time.split(':').map(Number);
    return total + hours + minutes / 60 + seconds / 3600;
  }, 0);

  // Don't increase width after the total exceeds 8 hours
  totalHours = Math.min(totalHours, 8);

  // Calculate width as a percentage of total hours to 8 hours
  let widthHours = ((totalHours / 8) * 100) * 10;

  // Calculate width based on the amount of entries, with a maximum of 100 entries
  let widthEntries = Math.min(entries.length, 100) * 25;

  // Calculate the final width as the average of widthHours and widthEntries
  let width = (widthHours + widthEntries) / 2;

  hunger.style.width = width + '%';

  // Change the color of the hunger line based on the width
  if (width < 50) {
    hunger.style.backgroundColor = 'red';
    hungerText.textContent = 'Starving!';
  } else if (width < 75) {
    hunger.style.backgroundColor = 'orange';
    hungerText.textContent = 'Hungry!';
  } else {
    hunger.style.backgroundColor = 'green';
    hungerText.textContent = 'Happy!';
  }
}

stopStartBtn.addEventListener('click', addEntry);

// Deletes entry from the list
entriesList.addEventListener('click', function(event) {
  const deleteButton = event.target;
  const row = deleteButton.parentElement.parentElement;
  if (deleteButton.classList.contains('delete-btn')) {
    setTimeout(function() {
      deleteButton.parentElement.parentElement.remove();
    }, 500);
    row.style.animation = "slideOut 0.75s backwards";
    if (entriesList.children.length === 0) {
      setTimeout(function() {
        chompyIsHungry.style.display = 'block';
      });
    }
    const entityId = parseInt(deleteButton.value);
    deleteEntry(entityId);
    console.log(entries);
    feedChompy();
    calculateTotalTime();
  }
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
      const elDate = clone.querySelector('.entry-date');
      const elTime = clone.querySelector('.entry-time');
      const elDeleteBtn = clone.querySelector('.delete-btn');

      elTitle.textContent = entry.title;
      elDate.textContent = entry.date;
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
//   localStorage.clear();
// });

// // clear all entries
// const clearAllBtn = document.getElementById('clearAll');
// clearAllBtn.addEventListener('click', function() {
//   entriesList.innerHTML = '';
//   entries.length = 0;
//   localStorage.clear();
//   chompyIsHungry.style.display = 'block';
// });