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