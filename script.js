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