// Author: Trevor Engen
// Date: July 29th, 2021

// Standard octave is 4. These are the values you multiply the note freq
// by in order to change the octave itself.
let octave = {
    '0' : 0.125,
    '1' : 0.1667,
    '2' : 0.25,
    '3' : 0.5,
    '4' : 1,
    '5' : 2,
    '6' : 4,
    '7' : 6,
    '8' : 8
}
// Creating audio context. Only ever create one instance of this
// otherwise the keyboard will stop working after some time.
var context = new AudioContext({latencyHint:'interactive', 
                    sampleRate:44800});

// Used to create a note whenever the user presses one of the keys
// on the page.
function createNote(note) {
    let duration = parseFloat(document.getElementById('duration').value);
    var o = context.createOscillator();
    var g = context.createGain();   
    
    let curWave = document.querySelector('input[name="waves"]:checked').value;
    
    // This if statement checks if the user selected wave is pre-created through the web API or if
    // it needs to be referenced from the waveInfo file and then created before being set.
    if(curWave == 'triangle' || curWave == 'square' || curWave == 'sawtooth' || curWave == 'sine') {
        o.type = curWave;
    } else {
        // This just saves a bunch of typing.
        function waveMaker(selection) {
            const createdWave = context.createPeriodicWave(selection.real, selection.imag, {disableNormalization: true});
            o.setPeriodicWave(createdWave);
        }
        switch(curWave) {
            case 'trombone':
                waveMaker(trombone);
                break;
            case 'bass':
                waveMaker(bass);
                break;
            case 'guitar':
                waveMaker(guitar);
                break;
            case 'fuzzGuitar':
                waveMaker(fuzzGuitar);
                break;
        }
    }
    o.frequency.value = note * octave[document.getElementById('octave').value];
    o.connect(g);
    g.connect(context.destination);
    o.start(0);
    g.gain.exponentialRampToValueAtTime(.000000001, (context.currentTime + duration));
}

// Function to begin recording note inputs.
var currentlyRecording = false;
function startOrEndRecording() {
    if (currentlyRecording == true) {
        var startTime = new Date();
        currentlyRecording = true;
        return startTime;
    } else {
        currentlyRecording = false;
    }
}

function noteToArray(freq, duration, waveForm) {
    noteTime = new Date() - startTime; 
    noteArray = [noteTime, freq, duration, waveForm];
}

// This makes it so that when enabled you are able to use your
// keyboard to play the virtual keyboard.
var shortcuts = function useShortcuts(e) {
    // Switch case to decide what note to create upon user input.
    switch(e.key) {
        case 'q':
            createNote(261.63);
            break;
        // All number cases are related to minor/flat keys.
        case '2':
            createNote(277.18);
            break;
        case 'w':
            createNote(293.66);
            break;
        case '3':
            createNote(311.13);
            break;
        case 'e':
            createNote(329.63);
            break;
        case 'r':
            createNote(349.23);
            break;
        case '5':
            createNote(369.99);
            break;
        case 't':
            createNote(392.00);
            break;
        case '6':
            createNote(415.30);
            break;
        case 'y':
            createNote(440.00);
            break;
        case '7':
            createNote(466.16);
            break;
        case 'u':
            createNote(493.88);
            break;
        case 'i':
            createNote(261.63 * 2);
            break;
        case '9':
            createNote(277.18 * 2);
            break;
        case 'o':
            createNote(293.66 * 2);
            break;
        case '0':
            createNote(311.13 * 2);
            break;
        case 'p':
            createNote(329.63 * 2);
            break;
        
    }
    
}

// These are dictionaries that get referenced by keyShortcuts() to match
// the correct key to the correct letter.
var whiteKeyLetter = {
    0:'Q',
    1:'W',
    2:'E',
    3:'R',
    4:'T',
    5:'Y',
    6:'U',
    7:'I',
    8:'O',
    9:'P'
}
var blackKeyLetter = {
    0:'2',
    1:'3',
    2:'5',
    3:'6',
    4:'7',
    5:'9',
    6:'0'
}

// If the shortcut box is checked allows the user to use their keyboard
// to play. Adds letters to the keys as well to assist the user in playing.
var shortcutsEnabled = false;
function keyShortcuts () {
    if(!shortcutsEnabled) {
        document.addEventListener('keydown', shortcuts, false);
        shortcutsEnabled = true;
        // Making arrays of all the white and black keys.
        let whiteArray = document.getElementsByClassName('white-key');
        let blackArray = document.getElementsByClassName('black-key');
        for(let i = 0; i < whiteArray.length; i++) {
            whiteArray[i].innerHTML = whiteKeyLetter[i];
            // This keeps the loop from breaking when we run out of black keys
            // while also allowing us to only have to use one loop.
            if(i < blackArray.length) {
                blackArray[i].innerHTML = blackKeyLetter[i];
            }
        }
    } else {
        document.removeEventListener('keydown', shortcuts, false);
        shortcutsEnabled = false;
        let whiteArray = document.getElementsByClassName('white-key');
        let blackArray = document.getElementsByClassName('black-key');
        for(let i = 0; i < whiteArray.length; i++) {
            whiteArray[i].innerHTML = '';
            if(i < blackArray.length) {
                blackArray[i].innerHTML = '';
            }
        }
    }
    
}

// An array of the names of the ids that are to be saved to localStorage.
var toSave = ['duration', 'octave']

// This saves all of the user settings on the keyboard.
function saveSettings() {
    for (let i=0; i < toSave.length; i++) {
        localStorage.setItem(toSave[i], document.getElementById(toSave[i]).value);
    }
    localStorage.setItem('waves', document.querySelector('input[name="waves"]:checked').value);
}

// This loads all of the previous user settings from localStorage.
function loadSettings() {
    for (let i=0; i<toSave.length; i++) {
        document.getElementById(toSave[i]).value = localStorage.getItem(toSave[i]);
    }
    document.getElementById(localStorage.getItem('waves')).checked = true;
}