var starttime;
var display = document.getElementById('timeDiv')
var timing_interval;
var high_score_out = false;
var countdown_time = 3
var level_elements;
var level = 9
var completed = false;
var audio;
var high_scores = {}
var very_first = true
var play_all = false
var start_start = performance.now()
var count_down_interval;
var overall_highscore;
var right_answer = " "


if (JSON.parse(localStorage.getItem("should_reload"))) {
    if (JSON.parse(localStorage.getItem("reload_play_all"))) {
        play_all = true
    }
    level = 7
    console.log("in reload")
    localStorage.setItem("reloaded", JSON.stringify(true))
    //localStorage.setItem("reloaded", JSON.stringify(true)) 
}

document.addEventListener('keydown', function (event) {
    if (event.altKey && event.key === 'r') {
        restart()
    }
});



var levelDescriptions = {
    level1: `<p><b>Level 1</b>: Click on all the input fields.</p>`,
    level2: `<p><b>Level 2</b>: Navigate to the bottom of the page, then up again.</p>`,
    level3: `<p><b>Level 3</b>: Move the text from the first to the second input field.</p>`,
    level4: `<p><b>Level 4</b>: Switch tabs, and then switch back.</p>`,
    level5: `<p><b>Level 5</b>: Switch the sentences' places.</p>`,
    level6: `<p><b>Level 6</b>: Copy url to input field (observe that it changes after countdown).</p>`,
    level7: `<p><b>Level 7</b>: Reload the page.</p>`,
    level8: `<p><b>Level 8</b>: What's the first word under "Game Play" on the page TypeRacer on English Wikipedia?</p>`,
    level9: `<p><b>Level 9</b>: Split screen (halve the width of the screen)</p>`
}

function createLevelButtons() {
    for (i = 1; i <= Object.keys(levelDescriptions).length; i++) {
        Element.prototype.appendAfter = function (element) {
            elemrrent.parentNode.insertBefore(this, element.nextSibling);
        }, false;

        play_all_button = document.getElementById("level_buttons")
        play_all_button.innerHTML += `<button class="level_button" onclick="changeLevel(` + i + `); restart();">Level ` + i + `</button>`
    }
}

createLevelButtons()


var levels_completed = []
function levelsCompletedFunc() {
    if (localStorage.getItem('levels_completed')) {
        //console.log("levels")
        levels_completed = JSON.parse(localStorage.getItem('levels_completed'))
        console.log("levels completed: ", levels_completed)
        //console.log(levels_completed)
        //console.log(levels_completed)
        for (i = 0; i < levels_completed.length; i++) {
            if (levels_completed.includes(i + 1)) {
                document.getElementsByClassName("level_button")[i].style.backgroundColor = "#b5f5a2"
            }
        }
    }
}

levelsCompletedFunc()


initLevels()
highscoreFunc()
countDown(countdown_time)


function playStartSound() {
    url = "assets/countdown.wav"
    audio = new Audio(url);
    audio.play();
}

function playAllStartSound() {
    url = "assets/all_start.wav"
    audio = new Audio(url);
    audio.play();
}

function playFinishSound() {
    url = "assets/finish.wav"
    audio = new Audio(url);
    audio.play();
}

function changeLevel(input_level) {
    level = input_level
    play_all = false
}

function changePlayAll() {
    level = 1
    countdown_time = 0
    document.getElementsByClassName("level_button")[level - 1].style.borderWidth = "5px"
    play_all = true
    start_start = performance.now()
    restart()
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
    if (duration != 0) {
        playStartSound()
    } else if (level == 1) {
        playAllStartSound()
    }
    display.innerHTML = "Game starts in " + duration + " seconds"
    count_down_start = performance.now()
    count_down_interval = setInterval(function () {
        elapsed_in_millis = duration * 1000 - (performance.now() - count_down_start)
        elapsed = millisToSeconds(elapsed_in_millis)
        document.getElementById('timeDiv').innerHTML = "Game starts in: " + elapsed + " min:s"
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
        if (!play_all) {
            document.getElementById('timeDiv').innerHTML = "Time elapsed: " + elapsed + " min:s"
        } else {
            elapsed = millisToSeconds(performance.now() - start_start)
            document.getElementById('timeDiv').innerHTML = "Total time elapsed: " + elapsed + " min:s"
        }
    }, 1);
    levelBranch()
}

async function initLevels() {
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
        how_many_elements = ""
    } else if (level == 3) {
        description = levelDescriptions.level3
        element1 = `<input class="level_element" style="pointer-events: none" value="Move this text">`
        element2 = `<input class="level_element" style="pointer-events: none">`
        length_elements = 2
        how_many_elements = element1 + element2
    } else if (level == 4) {
        description = levelDescriptions.level4
        length_elements = 0
        how_many_elements = ""
    } else if (level == 5) {
        description = levelDescriptions.level5
        element1 = `<input class="level_element" style="pointer-events: none" value="Move this. Switch places.">`
        length_elements = 1
        how_many_elements = element1
    } else if (level == 6) {
        description = levelDescriptions.level6
        element1 = `<input class="level_element" style="pointer-events: none">`
        length_elements = 1
        how_many_elements = element1
        to_add = ""
    } else if (level == 7) {
        description = levelDescriptions.level7
        length_elements = 0
        how_many_elements = ""
    } else if (level == 8) {
        description = levelDescriptions.level8
        element1 = `<input class="level_element" style="pointer-events: none">`
        length_elements = 1
        how_many_elements = element1
        await $.get("https://en.wikipedia.org/w/api.php?origin=*&generator=random&grnnamespace=0&format=json&action=query&prop=extracts&exlimit=max&explaintext", function (data) {
            console.log("in ajax for realz")
            let pages = data.query.pages;
            let firstKey = Object.keys(pages)[0];
            title = pages[firstKey].title
            console.log("title: ", title)
            console.log("original content: ", pages[firstKey].extract)
            content = pages[firstKey].extract
            if (content.includes(".") || content.includes("\n")) {
                content = content.replace("\n", ".").split(".")
            } else {
                content = content.split(",")
            }
            content = content.slice(0, content.indexOf("== Notes =="))
            content = content.slice(0, content.indexOf("== Sources =="))
            console.log(content)
            content = content.filter(e => !e.includes('==')).filter(e => !e == "")
            console.log("sentences: ", content)
            start_index = Math.floor(Math.random() * (content.length - 1))
            first_word = content[start_index + 1].trim().split(" ")[0]
            sentence = content[start_index].trim().replace("[", "").replace("]", "")
            if (sentence.split(" ").length > 10) {
                first_word = sentence.split(" ").slice(10, 11)[0]
                sentence = sentence.split(" ").slice(0, 10).join(" ")
            }
            right_answer = first_word
            console.log("first_word: ", first_word)
            console.log(sentence)
            input = `<input class="level_element" style="pointer-events: none">`
            description = `<p><b>Level 8</b>: What's the first word after the phrase "<i>` + sentence + `</i>" on the page <i>` + title + `</i> on English Wikipedia?</p>`
            document.getElementById('level').innerHTML = description + input
        });
        console.log("after ajax")
    } else if (level == 9) {
        description = levelDescriptions.level9
        length_elements = 0
        how_many_elements = ""
    }
    if (level != 8) {
        document.getElementById('level').innerHTML = description + how_many_elements
    }
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
        level3Logic(checkpoints)
    } else if (level == 4) {
        level4Logic()
    } else if (level == 5) {
        level5Logic()
    } else if (level == 6) {
        level6Logic()
    } else if (level == 7) {
        level7Logic()
    } else if (level == 8) {
        level8Logic()
    } else if (level == 9) {
        level9Logic()
    }
}

function level1Logic(i, checkpoints) {
    ////console.log("in level")
    text_input[i].addEventListener('focus', function levelListener(event) {
        if (!completed) {
            checkpoints[i] = true
            text_input[i].style.backgroundColor = "#b5f5a2"
            //console.log(checkpoints)
            const isTrue = (value) => value
            if (checkpoints.every(isTrue)) {
                finishedLevel()
            }
            //var endTime = performance.now()
            ////console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
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
            //console.log("you're at the bottom of the page");
            bottom = true
        }
        if ((window.innerHeight + window.pageYOffset) == window.innerHeight) {
            //console.log("you're at the top of the page")
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

function level3Logic(checkpoints) {
    function checkComplete() {
        if (checkpoints[0] == true && checkpoints[1] == true) {
            if (!completed) {
                checkpoints[1] = true
                text_input[1].style.backgroundColor = "#b5f5a2"
                const isTrue = (value) => value
                if (checkpoints.every(isTrue)) {
                    finishedLevel()
                }
            }
        }
    }
    text_input[0].addEventListener('input', function levelListener(event) {
        if (text_input[0].value == "") {
            checkpoints[0] = true
            text_input[0].style.backgroundColor = "#b5f5a2"
            checkComplete()

        }
    });
    text_input[1].addEventListener('input', function levelListener(event) {
        if (text_input[1].value == "Move this text") {
            checkpoints[1] = true
            text_input[1].style.backgroundColor = "#b5f5a2"
            checkComplete()
        }
    });
}

function level4Logic() {
    inactive = false
    function listener() {
        if (document.visibilityState == "visible") {
            if (inactive) {
                document.removeEventListener("visibilitychange", listener);
                finishedLevel()
            }
        } else {
            inactive = true
        }
    }
    document.addEventListener("visibilitychange", listener)
}

function level5Logic() {
    text_input[0].addEventListener('input', function levelListener(event) {
        checkComplete("Switch places. Move this.")
    });
}

function level6Logic() {
    //console.log("in level 6")
    for (i = 0; i < 10; i++) {
        to_add += Math.floor(Math.random() * 10)
    }
    saved_location = window.location.href
    history.pushState({}, null, window.location.href + to_add);
    function checkComplete() {
        if (text_input[0].value == window.location.href) {
            if (!completed) {
                text_input[0].style.backgroundColor = "#b5f5a2"
                history.pushState({}, null, saved_location);
                finishedLevel()
            }
        }
    }
    text_input[0].addEventListener('input', function levelListener(event) {
        checkComplete(window.location.href)
    });
}


function level7Logic() {
    localStorage.setItem("should_reload", JSON.stringify(true))
    if (play_all) {
        localStorage.setItem("reload_play_all", JSON.stringify(true))
    }
    if (JSON.parse(localStorage.getItem("reloaded"))) {
        localStorage.setItem("should_reload", JSON.stringify(false))
        localStorage.setItem("reload_play_all", JSON.stringify(false))
        localStorage.setItem("reloaded", JSON.stringify(false))
        finishedLevel()
    }
}

function checkComplete(right_answer) {
    if (text_input[0].value.toLowerCase().trim() == right_answer.toLowerCase().trim()) {
        if (!completed) {
            text_input[0].style.backgroundColor = "#b5f5a2"
            finishedLevel()
        }
    }
}


function level8Logic() {
    text_input[0].addEventListener('input', function levelListener(event) {
        checkComplete(right_answer)
    });
}

function finishedLevel() {
    elapsed = millisToSeconds(performance.now() - starttime)
    if (!high_scores[level]) {
        high_scores[level] = []
    }
    high_scores[level].push(elapsed)
    completed = true
    playFinishSound()
    clearInterval(timing_interval)
    console.log("level to push: ", level)
    if (!levels_completed.includes(level)) {
        levels_completed.push(level)
    }
    localStorage.setItem('levels_completed', JSON.stringify(levels_completed));
    display.innerHTML = "Level completed in: " + millisToSeconds(performance.now() - starttime) + " min:s"
    localStorage.setItem('high_scores', JSON.stringify(high_scores));
    highscoreFunc(elapsed)
    levelsCompletedFunc()
    if (play_all) {
        if (level == Object.keys(levelDescriptions).length) {
            for (i = 0; i < Object.keys(levelDescriptions).length; i++) {
                document.getElementsByClassName("level_button")[i].style.borderWidth = "2px"
            }
            finish_time = performance.now() - start_start
            overall_record = "5:00.000"
            if (localStorage.getItem("overall_record")) {
                overall_record = localStorage.getItem("overall_record")
            }
            if (finish_time < secondsToMillis(overall_record)) {
                localStorage.setItem("overall_record", millisToSeconds(performance.now() - start_start))
            }
            display.innerHTML = "All levels completed in: " + millisToSeconds(finish_time) + " min:s. <br> All levels high score:  " + localStorage.getItem("overall_record") + " min:s"
        } else {
            level += 1
            document.getElementsByClassName("level_button")[level - 2].style.borderWidth = "3px"
            document.getElementsByClassName("level_button")[level - 1].style.borderWidth = "5px"
            restart()
        }
    }
}

function level9Logic() {
    saved_width = window.innerWidth
    completed = false
    window.addEventListener('resize', function (event) {
        if (window.innerWidth < saved_width / 2 + 10 && !completed) {
            completed = true
            finishedLevel()
        }
        if (window.innerWidth > saved_width) {
            saved_width = window.innerWidth
        }
    }, true);
}

function restart() {
    clearInterval(count_down_interval)
    clearInterval(timing_interval)

    audio.pause();
    audio.currentTime = 0;

    highscoreFunc()
    initLevels()
    countDown(countdown_time)
}

function highscoreFunc(last_time = "") {
    if (localStorage.getItem('high_scores')) {
        high_scores = JSON.parse(localStorage.getItem('high_scores'))

        Element.prototype.appendAfter = function (element) {
            element.parentNode.insertBefore(this, element.nextSibling);
        }, false;


        var high_score_table = document.createElement('div');
        high_score_table.id = "high_score"
        lowest_time = Infinity

        if (high_scores[level]) {
            for (i = 0; i < high_scores[level].length; i++) {
                if (secondsToMillis(high_scores[level][i]) < lowest_time) {
                    lowest_time = secondsToMillis(high_scores[level][i])
                }
            }
        }

        notify_high = ""
        if (lowest_time == secondsToMillis(last_time)) {
            notify_high = " | New high score 🏆"
        }

        ////console.log(!high_score_out)
        if (lowest_time != Infinity && !high_score_out && !play_all) {
            //console.log("i'm' normal")
            high_score_out = true
            high_score_table.innerHTML = 'Your high score: ' + millisToSeconds(lowest_time) + " min:s"
            high_score_table.appendAfter(display);
            document.getElementById("high_score").style.display = ""
        } else if (lowest_time != Infinity && !play_all) {
            //console.log("i'm' not inf")
            document.getElementById("high_score").style.display = ""
            document.getElementById("high_score").innerHTML = 'Your high score: ' + millisToSeconds(lowest_time) + " min:s" + notify_high
        } else if (document.getElementById("high_score")) {
            //console.log("i'm' not completed")
            document.getElementById("high_score").style.display = "none"
        }
    }
}

/*window.onload = function () {
*/
