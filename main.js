console.log("hello world")
const text_input = document.querySelector('input[type="text');
console.log(text_input)


/*var timeleft = 5;
var downloadTimer = setInterval(function(){
  if(timeleft <= 0){
    clearInterval(downloadTimer);
  }
  document.getElementById("progressBar").value = 5 - timeleft;
  timeleft -= 1;
}, 1000);*/

function playStartSound() {
    url = "mario.mp3"
    const audio = new Audio(url);
    audio.play();
}

function playFinishSound() {
    url = "mariofinish.mp3"
    const audio = new Audio(url);
    audio.play();
}

var starttime;

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(3)
    return (
        seconds == 60 ?
            (minutes + 1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds 
    );
}

var timing_interval;

function startGame() {
    starttime = performance.now()
    timing_interval = setInterval(function () {
        //console.log(performance.now()-starttime)
        elapsed = millisToMinutesAndSeconds(performance.now() - starttime)
        document.getElementById('timeDiv').innerHTML = "Time elapsed: " + elapsed + " seconds"
    }, 1); 
    text_input.addEventListener('focus', (event) => {
        playFinishSound()
        clearInterval(timing_interval)
        elapsed = millisToMinutesAndSeconds(performance.now() - starttime)
        high_scores.push(elapsed)
        console.log(high_scores)
        display.innerHTML = "Level cleared in " + millisToMinutesAndSeconds(performance.now() - starttime) + " seconds"
        //var endTime = performance.now()
        //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
    });
}

function restart() {
    clearInterval(timing_interval)
    countDown(1)
}

var high_scores = []

function countDown(duration) {
    playStartSound()
    var timer = duration, /*minutes,*/ seconds;
    display.innerHTML = "Game starts in " + duration + " seconds"
    count_down_start = performance.now()
    count_down_interval = setInterval(function () {
        elapsed_in_millis = 3000 - (performance.now() - count_down_start)
        elapsed = millisToMinutesAndSeconds(elapsed_in_millis)
        document.getElementById('timeDiv').innerHTML = "Game starts in: " + elapsed + " seconds"
        if (elapsed_in_millis < 0) {
            clearInterval(count_down_interval)
            startGame()
        }
    }, 1); 
}

display = document.getElementById('timeDiv')


countDown(1)

/*window.onload = function () {
*/
