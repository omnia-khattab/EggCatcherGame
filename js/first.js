var containerDiv = document.getElementById("containerDiv");

var gameStart = document.getElementById("gameStart");
var gameOver = document.getElementById("gameOver");
var gameOverScore = document.getElementById("gameOverScore");
var playAgain = document.getElementById("playAgain");
var play = document.getElementById("play");

var scoreInp = document.getElementById("Score");
var lifeInp = document.getElementById("Life");
var score = Number(scoreInp.innerHTML);
var life = Number(lifeInp.innerHTML);

var egg1 = document.getElementById("egg1");
var egg2 = document.getElementById("egg2");
var egg3 = document.getElementById("egg3");
var eggs = document.getElementsByClassName("egg");

var crackedEgg1 = document.getElementById("crackedEgg1");
var crackedEgg2 = document.getElementById("crackedEgg2");
var crackedEgg3 = document.getElementById("crackedEgg3");

var basket = document.getElementById("basketDiv");
var basketScore = document.getElementById("basketScore");

var startAudio = document.getElementById("startAudio");
var brokenEggAudio = document.getElementById("brokenEggAudio");
var gameOverAudio = document.getElementById("gameOverAudio");
var ScoreAudio=document.getElementById("ScoreAudio");

var containerHeight =Math.floor(containerDiv.getBoundingClientRect().height);
var basketHeight = Math.floor(basket.getBoundingClientRect().height);


var eggHeight = Math.floor(egg1.getBoundingClientRect().height);

var eggInitialPosition =  Math.floor(egg1.getBoundingClientRect().top);

var basketTOP = containerHeight - basketHeight;
var eggTop = 0;
var speed = 2;
var maxSpeed = 15;
var counter = 0;
var eggCurrentPosition = 0;
var brokenEggNum = 0;
var animationID;

//basket MouseMove EventListener
document.body.addEventListener("mousemove", function (eventInfo) {
    basket.style.left = eventInfo.clientX;
});

//Activate Play Button and start the game
play.addEventListener("click", function () {
    gameStart.style.display = "none";
    startAudio.play();

    StartGame();
    animationID = requestAnimationFrame(StartGame);
});

playAgain.addEventListener("click", function () {
    location.reload();
});

function StartGame() {
    for (var i = 0; i < eggs.length; i++) {
        if (checkEggHitsTheFloor(eggs[i]) || checkEggHitsTheBasket(eggs[i])) {
            setEggIntialState(eggs[i]);
        } else {
            dropdownEggs(eggs[i]);
        }
    }
    if (life <= 0) {
        cancelAnimationFrame(animationID);
        gameOver.classList.remove('d-none');
        gameOverScore.innerHTML = score;
        startAudio.pause();
        startAudio.currentTime = 0;
        gameOverAudio.play();
    } else {

        animationID = requestAnimationFrame(StartGame);
    }
}

function addAudio(audioPath) {
    var myAudio = new Audio(audioPath);
    return myAudio.play;
}
//function to drop down the eggs
function dropdownEggs(egg) {
    var eggCurrentPosition = egg.offsetTop;
    egg.style.top = (eggCurrentPosition + speed);
}
//function setEgg Intial state
function setEggIntialState(egg) {
    egg.style.top = eggInitialPosition;
}
//Show the broken eggs
function showBrokenEggs(egg) {
    brokenEggAudio.play();
    brokenEggNum = egg.getAttribute('data-crackedEgg');
    document.getElementById("crackedEgg" + brokenEggNum).classList.remove('d-none');
    hideBrokenEggs(brokenEggNum);
}

function hideBrokenEggs(brokenEggNum) {
    setTimeout(function () {
        document.getElementById("crackedEgg" + brokenEggNum).classList.add('d-none');
    }, 800);

}

// function to check if the egg hits the floor
function checkEggHitsTheFloor(egg) {
    if (collisionDetection(egg, floor)) {
        showBrokenEggs(egg);
        if (life > 0) {
            life--;
        }
        lifeInp.innerHTML = life;
        return true;
    } else {
        return false;
    }

}

function checkEggHitsTheBasket(egg) {
    if (collisionDetection(egg, basket)) {
        eggTop = egg.offsetTop;
        if (eggTop < basketTOP) {
            score++;
            scoreInp.innerHTML = score;
            basketScore.innerHTML = score;
            ScoreAudio.play();
            if (speed % 5 == 0 && speed < maxSpeed) {
                speed++;
            }
            return true;
        }
    }
}

function collisionDetection(div1, div2) {
    var rectX1_left = Math.floor(div1.getBoundingClientRect().left); //left
    var rectY1_top = Math.floor(div1.getBoundingClientRect().top); //top
    var rectHeight1 = Math.floor(div1.getBoundingClientRect().height);
    var rectWidth1 = Math.floor(div1.getBoundingClientRect().width);
    
    var rect1_bottom = rectY1_top + rectHeight1; // bottom
    var rect1_right = rectX1_left + rectWidth1; //right

    var rectX2_left = Math.floor(div2.getBoundingClientRect().left); //left
    var rectY2_top = Math.floor(div2.getBoundingClientRect().top); //top
    var rectHeight2 = Math.floor(div2.getBoundingClientRect().height);
    var rectWidth2 = Math.floor(div2.getBoundingClientRect().width);
    
    var rect2_bottom = rectY2_top + rectHeight2; //bottom
    var rect2_right = rectX2_left + rectWidth2; //right

    if (rect1_right < rectX2_left || rectX1_left > rect2_right ||
        rect1_bottom < rectY2_top || rectY1_top > rect2_bottom) {
        return false;
    } else {
        return true;
    }
}