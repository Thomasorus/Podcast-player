document.addEventListener("DOMContentLoaded", function (event) {
    var audio = document.querySelector('#player');
    var url = audio.getAttribute('src');
    var filename = url.replace(/^.*[\\\/]/, '');

    var currentTime = document.querySelector('#currentTime');
    var totalTime = document.querySelector('#totalTime');
    var changeSpeed = document.querySelector('#changeSpeed');
    var showSpeed = document.querySelector("#showSpeed");
    var changeVolume = document.querySelectorAll('input.accessi');
    var playButton = document.querySelector("#playButton");
    var playText = document.querySelector("#playText");
    var progressBar = document.querySelector('#seekBar');

    // Resume play from saved progress
    var localProgress = localStorage.getItem(filename);
    if (localProgress) {
        audio.currentTime = localProgress;
    }


    // Maximum and minimum play speed
    var playbackRateMax = 2;
    var playbackRateMin = 0.75;
    // A function to change play speed
    function setPlaySpeed() {
        var currentSpeed = audio.playbackRate;
        if (currentSpeed < playbackRateMax) {
            audio.playbackRate = currentSpeed + 0.25;
        } else {
            audio.playbackRate = playbackRateMin;
        }
        showSpeed.innerHTML = audio.playbackRate;
    }

    // A function to set audio volume
    function setVolume(val) {
        audio.volume = val;
    }

    // A function to play audio and insert the pause icon
    function playAudio() {
        // Check if audio has been started before and is not playing
        if (audio.currentTime >= 0 && audio.paused) {

            // Checking if there's any progress inside localstorage
            if (localStorage.getItem(filename)) {
                //Set the audio current time to the time stored in local storage
                audio.currentTime = localStorage.getItem(filename);
                audio.play();
            }

            // If no progress, just play from the beginnning and add pause icon
            else {
                audio.play();
            }
            playText.setAttribute('class', 'pause-icon');
        }

        // Else audio is playing, pause it and remove pause icon
        else {
            audio.pause();
            playText.setAttribute('class', 'play-icon');
        }
    }

    // A function to change the progress bar value on click
    function seekProgressBar(progress) {
        // Get the progress bar % location and add it to the audio current time
        var percent = progress.offsetX / this.offsetWidth;
        audio.currentTime = percent * audio.duration;
        progressBar.value = percent / 100;
        updateProgress();
    }

    // A function to format a duration in seconds to a string 'hh:mm:ss'
    function formatTime(time) {
        var hours = Math.floor(time / 3600);
        var minutes = Math.floor((time - hours * 3600) / 60);
        var seconds = time - hours * 3600 - minutes * 60;
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        seconds = parseInt(seconds, 10);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
    }

    /*
     * A callback triggered upon audio progress.
     * Actualizes both the progress bar and time display.
     */
    function updateProgress() {
        progressBar.value = audio.currentTime / audio.duration;
        currentTime.innerHTML = formatTime(audio.currentTime);
        totalTime.innerHTML = formatTime(audio.duration);

        // Save progress to local storage
        localStorage.setItem(filename, audio.currentTime);
    }

    // Event listener reacting to audio progressing
    audio.addEventListener('timeupdate', updateProgress, false);

    // Event listeners checking for buttons clicks
    changeSpeed.addEventListener('click', setPlaySpeed, false);
    playButton.addEventListener('click', playAudio, false);
    progressBar.addEventListener('click', seekProgressBar, false);

    // Register a click handler per volume section (0%, 10%, ..., 90%, 100%)
    for (var i = 0; i < changeVolume.length; i++) {
        changeVolume[i].addEventListener("click", function () {
            setVolume(this.value);
        });
    }
});