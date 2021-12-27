//const text_input = document.getElementsByClassName('text');

/*
Have random initializations to make it less gameable 
*/


var starttime;
var display = document.getElementById('timeDiv')
var timing_interval;
var high_score_out = false;
var countdown_time = 3
var level_elements;
var level = 3
var completed = false;

const levelDescriptions = {
    level1: `<p>Level 1: Click on all the input fields.</p>`,
    level2: `<p>Level 2: Navigate to the bottom of the page, then up again.</p>`,
    level3: `<p>Level 3: Move the text from the first to the second input field.</p>`
}

initLevels()
highscoreFunc()
countDown(countdown_time)

function playStartSound() {
    url = "countdown.wav"
    const audio = new Audio(url);
    audio.play();
}

function playFinishSound() {
    url = "finish.wav"
    const audio = new Audio(url);
    audio.play();
}

function changeLevel(input_level) {
    level = input_level
    clearInterval(count_down_interval)
    clearInterval(timing_interval)
    initLevels()
    highscoreFunc()
    countDown(countdown_time)
}

function millisToSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(3)
    return (
        seconds == 60 ?
            (minutes + 1) + ":00" :
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    )
}

function secondsToMillis(seconds) {
    // Will probably break if more than an hour? 
    var minute_part = parseInt(seconds.substring(0, 1)) * 60 * 1000
    var second_part = parseInt(seconds.substring(2, 4)) * 1000
    var milli_part = parseInt(seconds.substring(5, 9))
    var total = minute_part + second_part + milli_part
    return total
}

function countDown(duration) {
    playStartSound()
    display.innerHTML = "Game starts in " + duration + " seconds"
    count_down_start = performance.now()
    count_down_interval = setInterval(function () {
        elapsed_in_millis = duration * 1000 - (performance.now() - count_down_start)
        elapsed = millisToSeconds(elapsed_in_millis)
        document.getElementById('timeDiv').innerHTML = "Game starts in: " + elapsed + " seconds"
        if (elapsed_in_millis < 0) {
            clearInterval(count_down_interval)
            startGame()
        }
    }, 1);
}

function startGame() {
    starttime = performance.now()
    timing_interval = setInterval(function () {
        elapsed = millisToSeconds(performance.now() - starttime)
        document.getElementById('timeDiv').innerHTML = "Time elapsed: " + elapsed + " seconds"
    }, 1);
    levelBranch()
}

function initLevels() {
    if (level == 1) {
        description = levelDescriptions.level1
        element = `<input class="level_element" style="pointer-events: none">`
        length_elements = 3
        how_many_elements = ""
        for (i = 0; i < length_elements; i++) {
            how_many_elements += element
        }
    } else if (level == 2) {
        description = levelDescriptions.level2
        element = `<br>`
        length_elements = 0
    } else if (level == 3) {
        description = levelDescriptions.level3
        element1 = `<input class="level_element" style="pointer-events: none" value="inerrkjbbwf">`
        element2 = `<input class="level_element" style="pointer-events: none">`
        length_elements = 2
        how_many_elements = element1 + element2
    }
    document.getElementById('level').innerHTML = description + how_many_elements
}

function levelBranch() {
    text_input = document.getElementsByClassName("level_element")
    for (i = 0; i < text_input.length; i++) {
        text_input[i].style.pointerEvents = "auto"
    }
    checkpoints = new Array(text_input.length).fill(false)
    completed = false;
    if (level == 1) {
        for (i = 0; i < text_input.length; i++) {
            level1Logic(i, checkpoints)
        }
    } else if (level == 2) {
        level2Logic()
    } else if (level == 3) {
        level3Logic()
    }
}

function level1Logic(i, checkpoints) {
    console.log("in level")
    text_input[i].addEventListener('focus', function levelListener(event) {
        if (!completed) {
            checkpoints[i] = true
            text_input[i].style.backgroundColor = "#b5f5a2"
            console.log(checkpoints)
            const isTrue = (value) => value
            if (checkpoints.every(isTrue)) {
                finishedLevel()
            }
            //var endTime = performance.now()
            //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
        }
    });
}

function level2Logic() {
    description = levelDescriptions.level2
    element = `<br>`
    length_elements = 100
    how_many_elements = ""
    for (i = 0; i < length_elements; i++) {
        how_many_elements += element
    }
    document.getElementById('level').innerHTML = description + how_many_elements

    var bottom = false
    var top = false

    // Bottom 
    window.onscroll = function (ev) {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !completed) {
            console.log("you're at the bottom of the page");
            bottom = true
        }
        if ((window.innerHeight + window.pageYOffset) == window.innerHeight) {
            console.log("you're at the top of the page")
            if (bottom) {
                top = true
            }
        }
        if (bottom && top) {
            window.onscroll = null
            finishedLevel()
        }
    };
}

function level3Logic() {
    console.log("in level 3")
    text_input[0].addEventListener('onchange', function levelListener(event) {

    });
    text_input[1].addEventListener('onchange', function levelListener(event) {
        if (!completed) {
            checkpoints[i] = true
            text_input[i].style.backgroundColor = "#b5f5a2"
            console.log(checkpoints)
            const isTrue = (value) => value
            if (checkpoints.every(isTrue)) {
                finishedLevel()
            }
            //var endTime = performance.now()
            //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
        }
    });
}

function finishedLevel() {
    elapsed = millisToSeconds(performance.now() - starttime)
    high_scores.push(elapsed)
    console.log(high_scores)
    completed = true
    playFinishSound()
    clearInterval(timing_interval)
    display.innerHTML = "Level completed in " + millisToSeconds(performance.now() - starttime) + " seconds"
    localStorage.setItem('high_scores', JSON.stringify(high_scores));
    //localStorage.setItem('high_scores', JSON.stringify([]));
    highscoreFunc()
}

function restart() {
    clearInterval(timing_interval)
    initLevels()
    countDown(countdown_time)
}

var high_scores = []
// localStorage.setItem("high_scores", JSON.stringify([]))

function highscoreFunc() {
    if (localStorage.getItem('high_scores')) {
        console.log(localStorage.getItem('high_scores'))
        high_scores = JSON.parse(localStorage.getItem('high_scores'))

        Element.prototype.appendAfter = function (element) {
            element.parentNode.insertBefore(this, element.nextSibling);
        }, false;

        var high_score_table = document.createElement('div');
        high_score_table.id = "high_score"
        lowest_time = Infinity
        for (i = 0; i < high_scores.length; i++) {
            if (secondsToMillis(high_scores[i]) < lowest_time) {
                lowest_time = secondsToMillis(high_scores[i])
            }
        }

        //console.log(!high_score_out)
        if (lowest_time != Infinity && !high_score_out) {
            //console.log("i'm' here")
            high_score_out = true
            high_score_table.innerHTML = 'Your high score: ' + millisToSeconds(lowest_time) + " seconds"
            high_score_table.appendAfter(display);
        } else if (lowest_time != Infinity) {
            document.getElementById("high_score").innerHTML = 'Your high score: ' + millisToSeconds(lowest_time) + " seconds"
        }
    }
}

/*window.onload = function () {
*/
