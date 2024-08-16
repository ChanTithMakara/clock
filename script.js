// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch((error) => {
            console.log('ServiceWorker registration failed: ', error);
        });
    });
}

// Install Button
let deferredPrompt;
const installButton = document.getElementById('installButton');

// Show install button
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installButton.style.display = 'block'; // Show the install button
});

// Handle install button click
installButton.addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
            installButton.style.display = 'none'; // Hide the install button after prompt
        });
    }
});

// Handle app installation
window.addEventListener('appinstalled', () => {
    console.log('App installed');
});

// World Clock
function updateWorldClock() {
    const timeZone = document.getElementById('country-select').value;
    const now = new Date();
    const options = { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const timeString = now.toLocaleTimeString('en-US', options);
    document.getElementById('world-clock-display').textContent = timeString;
}

setInterval(updateWorldClock, 1000);
updateWorldClock();

// Alarm
let alarms = [];

function addAlarm() {
    const alarmContainer = document.createElement('div');
    alarmContainer.classList.add('alarm-item');

    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.classList.add('form-control');
    alarmContainer.appendChild(timeInput);

    const toggleSwitch = document.createElement('input');
    toggleSwitch.type = 'checkbox';
    toggleSwitch.classList.add('form-check-input');
    toggleSwitch.onclick = () => toggleAlarm(toggleSwitch, timeInput.value);
    alarmContainer.appendChild(toggleSwitch);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteAlarm(alarmContainer, timeInput.value);
    alarmContainer.appendChild(deleteButton);

    document.getElementById('alarms-list').appendChild(alarmContainer);

    alarms.push({ time: timeInput.value, active: false });
}

function toggleAlarm(toggleSwitch, time) {
    const alarm = alarms.find(a => a.time === time);
    if (alarm) {
        alarm.active = toggleSwitch.checked;
        if (alarm.active) {
            const alarmTime = new Date();
            const [hours, minutes] = time.split(':');
            alarmTime.setHours(hours);
            alarmTime.setMinutes(minutes);
            alarmTime.setSeconds(0);
            
            const timeToAlarm = alarmTime.getTime() - Date.now();
            if (timeToAlarm > 0) {
                alarm.timeout = setTimeout(() => {
                    alert('Alarm ringing!');
                }, timeToAlarm);
            }
        } else {
            clearTimeout(alarm.timeout);
        }
    }
}

function deleteAlarm(alarmContainer, time) {
    const index = alarms.findIndex(a => a.time === time);
    if (index !== -1) {
        clearTimeout(alarms[index].timeout);
        alarms.splice(index, 1);
    }
    document.getElementById('alarms-list').removeChild(alarmContainer);
}

// Stopwatch
let stopwatchInterval = null;
let stopwatchTime = 0;

function updateStopwatchDisplay() {
    const hours = String(Math.floor(stopwatchTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((stopwatchTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(stopwatchTime % 60).padStart(2, '0');
    document.getElementById('stopwatchDisplay').textContent = `${hours}:${minutes}:${seconds}`;
}

function startStopwatch() {
    if (!stopwatchInterval) {
        stopwatchInterval = setInterval(() => {
            stopwatchTime++;
            updateStopwatchDisplay();
        }, 1000);
    }
}

function stopStopwatch() {
    clearInterval(stopwatchInterval);
    stopwatchInterval = null;
}

function resetStopwatch() {
    stopStopwatch();
    stopwatchTime = 0;
    updateStopwatchDisplay();
}

// Timer
let timerInterval = null;
let timerTime = 0;

function updateTimerDisplay() {
    const hours = String(Math.floor(timerTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((timerTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(timerTime % 60).padStart(2, '0');
    document.getElementById('timerDisplay').textContent = `${hours}:${minutes}:${seconds}`;
}

function startTimer() {
    const hours = parseInt(document.getElementById('timerHours').value) || 0;
    const minutes = parseInt(document.getElementById('timerMinutes').value) || 0;
    const seconds = parseInt(document.getElementById('timerSeconds').value) || 0;
    timerTime = (hours * 3600) + (minutes * 60) + seconds;
    updateTimerDisplay();

    if (!timerInterval) {
        timerInterval = setInterval(() => {
            timerTime--;
            updateTimerDisplay();
            if (timerTime <= 0) {
                clearInterval(timerInterval);
                alert('Time’s up!');
            }
        }, 1000);
    }
}

// Scrollable Time Input
function createTimeOptions() {
    const selectElements = ['timerHours', 'timerMinutes', 'timerSeconds'];

    selectElements.forEach(id => {
        const select = document.getElementById(id);
        for (let i = 0; i < 60; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i < 10 ? `0${i}` : i;
            select.appendChild(option);
        }
    });
}

createTimeOptions();
