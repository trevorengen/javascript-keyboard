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

// Array to store notes in for playback and creating the variable
// to store timing for note playback.
var songArray = [];
var startTime = null;

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

    if(currentlyRecording){
        songArray.push(noteToArray(note, duration, curWave, octave[document.getElementById('octave').value]));
    }
}

// Playback function for the songArray.
var time = 0;
var tempSaver = [];
var savedArrays = [];
// Increments the x-axis array. Original fix was a queue but since it was removing the element
// the save file was deleted. Variable 'n' is chosen to save typing.
var n = 0;
function playback(currSong, elemId) {
    document.getElementById(elemId).style.borderColor = 'transparent transparent transparent rgb(52, 235, 232)';
    setTimeout(function()/* TODO: Restructure note() so that this can all be deleted. Just need to add parameters to note
                            for all input settings (duration, wave form, octave, and frequency) and just pass them
                            where they are required instead of reading the inputs inside of the function. */{
        var o = context.createOscillator();
        var g = context.createGain();   
        var curWave = currSong[n][3];
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
        o.frequency.value = parseFloat(currSong[n][1]) * parseFloat(currSong[n][4]);
        o.connect(g);
        g.connect(context.destination);
        o.start(0);
        g.gain.exponentialRampToValueAtTime(.000000001, (context.currentTime + parseFloat(currSong[n][2])));
        time = parseFloat(currSong[n][0]);
        if(n < currSong.length-1){
            n++;
            playback(currSong, elemId);
        } else {
            document.getElementById(elemId).style.borderColor = 'transparent transparent transparent navy';
            n = 0;
        }
    }, parseFloat(currSong[n][0]) - time);
}

// Function to begin recording note inputs.
var currentlyRecording = false;
function startOrEndRecording() {
    if (!currentlyRecording) {
        songArray = [];
        startTime = new Date();
        currentlyRecording = true;
        let redOn = true
        // Recursive function used to keep blinking the recording light so
        // long as it is recording.
        var tempFunc = function(){
            setTimeout(function(){
                if(currentlyRecording){
                    if(redOn){
                        document.getElementById('red-circle').style.backgroundColor = 'rgb(110, 0, 0)';
                        redOn = false;
                        tempFunc();
                    } else {
                        document.getElementById('red-circle').style.backgroundColor = 'red';
                        redOn = true;
                        tempFunc();
                    }
                }
            }, 300);
        }
        tempFunc();
        document.getElementById('red-circle').style.backgroundColor = 'red';
    } else {
        currentlyRecording = false;
        // Only save if there was at least one note played.
        document.getElementById('red-circle').style.backgroundColor = 'rgb(110, 0, 0)';
        if(songArray.length != 0){
            savedArrays.push(songArray);
            let opt = document.createElement('option');
            let opt2 = document.createElement('option');
            opt.value = savedArrays.length;
            opt.innerHTML = savedArrays.length;
            opt2.value = savedArrays.length;
            opt2.innerHTML = savedArrays.length;
            document.getElementById('saved-red').appendChild(opt);
            document.getElementById('savedSongs').appendChild(opt2);
            displayNotes(songArray);
            return songArray;
        }
    }
}

// Saves the note being played into an array for later playback.
function noteToArray(freq, duration, waveForm, octave) {
    noteTime = new Date() - startTime; 
    noteArray = [noteTime, freq, duration, waveForm, octave];
    return noteArray;
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
