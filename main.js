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
    //var real_millis =  seconds*60000 -millis
    return (
        seconds == 60 ?
            (minutes + 1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds /*+ ":" + real_millis*/
    );
}

function startGame() {
    //document.getElementById('timeDiv').style.display = "none";
    //document.getElementById('timeDiv').innerHTML = "Time elapsed: ";
    starttime = performance.now()
    timing_inverval = setInterval(function () {
        //console.log(performance.now()-starttime)
        document.getElementById('timeDiv').innerHTML = "Time elapsed: " + millisToMinutesAndSeconds(performance.now() - starttime) + "seconds"
    }, 1); performance.now()
    text_input.addEventListener('focus', (event) => {
        playFinishSound()
        clearInterval(timing_inverval)
        //var endTime = performance.now()
        //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
    });
}

function restart() {

}

function startTimer(duration, display) {
    playStartSound()
    var timer = duration, /*minutes,*/ seconds;
    start_interval = setInterval(function () {
        //minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        //minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? + seconds : seconds;

        //display.textContent = minutes + ":" + seconds;
        display.textContent = seconds;

        if (--timer < 0) {
            timer = duration;
            clearInterval(start_interval)
            startGame()
        }
    }, 1000);
}

function countDown() {
    var someSeconds = 2.8,
    display = document.querySelector('#time')
    startTimer(someSeconds, display);
}

//console.log("timediv: ", timediv)
//console.log("timediv style: ", timediv.style)
//console.log("timediv style: ", timediv.style.visibility)
//timediv.style.display = "none";
//timediv.style.color = "red";



/*window.onload = function () {
*/
