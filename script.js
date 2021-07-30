function showValue(elemIdToChange, elemIdWithValue) {
    document.getElementById(elemIdToChange).innerText = document.getElementById(elemIdWithValue).value;
}

function bodyLoad() {
    keyShortcuts();
    loadSettings();
    showValue('duration-val', 'duration');
    showValue('octave-val', 'octave');
}

function updateText(rangeId, pId) {
    document.getElementById(pId).innerText = document.getElementById(rangeId).value;
}

// An array of the names of the ids that are to be saved to localStorage.
var toSave = ['duration', 'octave']

// This saves all of the user settings on the keyboard.
function saveSettings() {
    for (let i=0; i < toSave.length; i++) {
        console.log(toSave[i]);
        localStorage.setItem(toSave[i], document.getElementById(toSave[i]).value);
    }
    localStorage.setItem('waves', document.querySelector('input[name="waves"]:checked').value);
}

// This loads all of the previous user settings from localStorage.
function loadSettings() {
    for (let i=0; i < toSave.length; i++) {
        document.getElementById(toSave[i]).value = parseInt(localStorage.getItem(toSave[i]));
    }
    document.getElementById(localStorage.getItem('waves')).checked = true;
}

// Small popup window for rename event.
function renameSong() {
    let songName = window.prompt('Enter song name', 'My Cool Song');
    let songSelect = document.getElementById('savedSongs');
    songSelect.options[songSelect.selectedIndex].text = songName;
}

// Displays notes in the selected playback area.
function displayNotes(song) {
    console.log(song);
    for(i=0; i<song.length; i++){
        
        document.getElementById('red-song').innerHTML += '<div class="note" id="note' + i + '"></div>';
        let currNote = document.getElementById('note' + i);
        console.log(currNote);
        let noteWidth = toString(song[i][2] /100);
        console.log(noteWidth);
        currNote.style.width = noteWidth;

        let xPos = toString(song[i][0] / 50);
        currNote.style.left = xPos;
    }
}