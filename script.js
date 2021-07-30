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
        songArea.innerHTML += '<div class="note" id="note' + i + '" draggable="true"></div>';
        var currNote = document.getElementById('note' + String(i));
        var noteWidth = song[i][2] * 20;
        currNote.style.width = String(noteWidth) + 'px';
        var xPos = String(song[i][0] / 20);
        switch(song[i][4]){
            case octave[0]:
                currNote.style.backgroundColor = 'rgb(0, 0, 0)';
                break;
            case octave[1]:
                currNote.style.backgroundColor = 'rgb(11, 26, 15)';
                break;
            case octave[2]:
                currNote.style.backgroundColor = 'rgb(19, 46, 26)';
                break;
            case octave[3]:
                currNote.style.backgroundColor = 'rgb(27, 66, 37)';
                break;
            case octave[4]:
                currNote.style.backgroundColor = 'rgb(38, 94, 52)';
                break;
            case octave[5]:
                currNote.style.backgroundColor = 'rgb(47, 120, 65)';
                break;
            case octave[6]:
                currNote.style.backgroundColor = 'rgb(63, 161, 88)';
                break;
            case octave[7]:
                currNote.style.backgroundColor = 'rgb(76, 199, 108)';
                break;
            case octave[8]:
                currNote.style.backgroundColor = 'rgb(77, 255, 124)';
                break;
        }
        // yPos is the frequency of the note subtracted by C4. Octaves
        // not taken into account here but a good thing to add in the future.
        // TODO: Add something to handle different octaves (maybe different colors?)
        console.log(song[i][4]);
        var yPos = String((song[i][1]) - 261.3);
        console.log(yPos);
        currNote.style.left = xPos + 'px';
        currNote.style.top = yPos + 'px';
    }
}

// savedArrays[document.getElementById('saved-red').selectedIndex]
function alterNote(elem){
    var selectedSong = savedArrays[document.getElementById('saved-red').selectedIndex];
    var selectedNote = parseInt(elem.id);
}