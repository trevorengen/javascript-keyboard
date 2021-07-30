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
    var songArea = document.getElementById('red-song')
    // Clearing notes from the area so they don't overlap each other.
    while(songArea.firstChild !== null){
        songArea.removeChild(songArea.firstChild);
    }
    // Loops through the song array and adds a div for each note.
    for(i=0; i<song.length; i++){
        songArea.innerHTML += '<div class="note" id="note' + i + '"></div>';
        var currNote = document.getElementById('note' + String(i));
        var noteWidth = song[i][2] * 20;
        currNote.style.width = String(noteWidth) + 'px';

        var xPos = String(song[i][0] / 20);

        // yPos is the frequency of the note divided by the octave and then
        // subtracted by the LOWEST note currently available. To reverse this later
        // the function will be the given yPos * octave - lowestFreq
        var yPos = String((song[i][1] / song[i][4]) - 261.63);
        console.log(yPos);
        currNote.style.left = xPos + 'px';
        currNote.style.top = yPos + 'px';
    }
}