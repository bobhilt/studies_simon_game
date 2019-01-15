var buttonColors = ["red", "blue", "green", "yellow"],
    gamePattern = [],
    userPattern = [],
    level = 0,
    turnTimeLimit = 5000, //milliseconds
    turnTimer,
    keyMap = {
        "r": "red",
        "b": "blue", 
        "g": "green",
        "y": "yellow"
    };

function initGame(){
    level = 0;
    gamePattern = [];
    userPattern = []
    $( "#level-title" ).text("Press a Key to Start.")
}

function nextTurn() {
    clearTurnTimer();
    level++;
    userPattern = [];
    addRandomButton(gamePattern);
    $("#level-title").text("Level " + level);
    playSequence(gamePattern);
    resetTurnTimer();
}

function userMoveHandler(buttonColor) {
    clearTurnTimer();
    var button = getButton(buttonColor);
    userPattern.push(buttonColor);
    animateButtonPush(button);
    playSound(buttonColor);
    if(checkUserPattern()){
        if (userPattern.length === gamePattern.length) {
            correctMoveAnimation();
            correctMoveAnimation();
            setTimeout(function() {
                nextTurn()
            }, 2000);
        }
        resetTurnTimer();
    } else {
        gameOver();
    }

    function correctMoveAnimation() {
        $( "body" ).addClass( "correct-sequence" );
        setTimeout(function() {
            $( "body" ).removeClass( "correct-sequence" )
        } , 300 );
    }
}

function clearTurnTimer(){
    window.clearTimeout(turnTimer); 
}

function resetTurnTimer(timeMS = turnTimeLimit) {
    turnTimer = window.setTimeout( function() {
        gameOver();
    }, timeMS);
}

function checkUserPattern() {
    for (var i = 0; i < userPattern.length; i++) {
        if (userPattern[i] !== gamePattern[i]) {
            return false;
        }
    }
    return true;
}

function addRandomButton(pattern) {
    var randomNumber = Math.floor( Math.random() * 4 );
    pattern.push( buttonColors[ randomNumber ] );
}

function playSequence(colorSequence) {  
    var i = 0;
    audio = new Audio();
    //keep all sounds sequential, otherwise all play at once.
    audio.addEventListener('ended', playNextSound);
    playNextSound();

    function playNextSound() {
        if (i < colorSequence.length){
            element = colorSequence[i];
            // console.log("playing " + element);
            animateButtonPush(getButton(element));
            audio.src = getColorSound(element);
            audio.play();
            i++;
        } else {
            //cleanup
            audio.removeEventListener('ended',playNextSound)
            
        }
    }
}

function playSound(buttonColor) {
    var sound = new Audio(getColorSound( buttonColor ));
    sound.play();
}

function getColorSound( buttonColor ) {
    return "sounds/" + buttonColor + ".mp3";
}

function animateButtonPush(button) {
    button.addClass("pressed");
    setTimeout(function () {
        button.removeClass("pressed");
      }, 100);
}

function gameOver() {
    var msg = "Game over. Sequence length: " + level + ". Press any key to play."
    clearTurnTimer();
    $( "level-title" ).text( msg );
    playSound("wrong");
    $( "body" ).addClass("game-over");
    setTimeout( function() {
        $( "body" ).removeClass("game-over")
        }, 200);
    setTimeout(function() {
        initGame()}, 3000);
}

function getButton(color) {
    return $ ( "#" + color);
}

//event handlers
$( ".btn" ).click(function() {
    var id = $(this).attr('id');
   userMoveHandler(id); 
});

$("body").keydown(function (e){
    var keyPressed = e.key;
    if (0 === level) {
        // console.log("keypress" + keyPressed);
        nextTurn();
    } else {
        //keyboard option for easier play v. hunt & click.
        //console.log(keyPressed);
        if ( keyMap.hasOwnProperty(keyPressed) ) {
            userMoveHandler(keyMap[keyPressed]);
        }
    }
});
initGame();