
var GASTER_TEXT_CONTAINER = document.createElement("DIV");
GASTER_TEXT_CONTAINER.style.display = "none";

document.getElementById("ESTABLISH_CONNECTION").onclick = function() {
    document.getElementById("ESTABLISH_CONNECTION_BUTTON_QUICK").remove();
    this.remove();
    GASTER_TEXT_CONTAINER.style.display = "";
    ADVANCE_SEQUENCE();
}

function nextPageClick(ignoreNoskip = false) {
    if (!ignoreNoskip && !phaseSkipByClick) {
        return;
    }
    if (document.getElementById("ESTABLISH_CONNECTION") || 
        lastTypedText == null || 
        !lastTypedText.IsPageDone() || 
        lastTypedText.container.parentElement.classList.contains("MESSAGE_FADE")) {
        return;
    }
    FadeOutGasterText(ADVANCE_SEQUENCE);
}

var phaseSkipByClick = false;
var lastTypedText;
document.body.addEventListener("click", nextPageClick);

//ButtonInputManager.INSTANCE.acceptListeners.push(nextPageClick);

var audio = new Audio();

window.addEventListener("load", () => {
    canvas.style.display = "none";
});

GASTER_TEXT_CONTAINER.className = "GASTER_TEXT_CONTAINER";
document.body.appendChild(GASTER_TEXT_CONTAINER);

// Only works one line at a time due to
// The fade effect
function SetGasterText(string, clickToClear = true) {
    var test = document.createElement("DIV");
    test.className = "GASTER_TEXT";
    lastTypedText = new TypedText(string, test, true);
    lastTypedText.defaultSpeed = 99;
    lastTypedText.speed = lastTypedText.defaultSpeed;
    lastTypedText.SetWidth();
    test.style.height = "fit-content";
    GASTER_TEXT_CONTAINER.appendChild(test);
}

function PitchUpAnotherHim() {
    audio.playbackRate += 0.02;
    if (audio.playbackRate < 0.96) {
        setTimeout(PitchUpAnotherHim, 100/3);
    }
}

function StartAnotherHim() {
    canvas.style.animationDuration = "3s";
    canvas.style.display = "";

    audio.src = "./audio/AUDIO_ANOTHERHIM.ogg";
    audio.preservesPitch = false;
    audio.playbackRate = 0.08;
    PitchUpAnotherHim();

    audio.loop = true;
    audio.play();
}

var PHASE = 0;
function ADVANCE_SEQUENCE(phaseToSet = -1) {
    if (phaseToSet == -1) {
        PHASE++;
    } else {
        PHASE = phaseToSet;
    }

    if (PHASE == 1) {
        phaseSkipByClick = false;
        audio.src = "./audio/AUDIO_DRONE.ogg";
        audio.loop = true;
        audio.play();
        setTimeout(ADVANCE_SEQUENCE, 1000);
    } else if (PHASE == 2) {
        phaseSkipByClick = true;
        SetGasterText("ARE YOU[w:500]\nTHERE?");
    } else if (PHASE == 3) {
        phaseSkipByClick = true;
        SetGasterText("  ARE WE[w:500]\nCONNECTED?");
    } else if (PHASE == 4) {
        phaseSkipByClick = false;
        StartHeartAnim(false);
        setTimeout(ADVANCE_SEQUENCE, 2000);
    } else if (PHASE == 5) {
        phaseSkipByClick = true;
        SetGasterText("EXCELLENT.");
    } else if (PHASE == 6) {
        phaseSkipByClick = true;
        SetGasterText("  TRULY[w:500]\nEXCELLENT.");
    } else if (PHASE == 7) {
        phaseSkipByClick = true;
        SetGasterText("NOW.");
    } else if (PHASE == 8) {
        phaseSkipByClick = true;
        SetGasterText("WE MAY[w:500]\nBEGIN.");
    } else if (PHASE == 9) {
        phaseSkipByClick = false;
        StartHeartAnim(true);
        audio.pause();
        setTimeout(StartAnotherHim, 1500);
        setTimeout(ADVANCE_SEQUENCE, 5000);
    } else if (PHASE == 10) {
        phaseSkipByClick = true;
        SetGasterText("FIRST.   ");
    } else if (PHASE == 11) {
        phaseSkipByClick = true;
        SetGasterText("YOU MUST CREATE\n[w:200]A VESSEL.");
    } else if (PHASE == 12) {
        phaseSkipByClick = false;
        SetGasterText("SELECT THE HEAD\nTHAT YOU PREFER.");
        GONERMAKER_START();
        choiceNumber = 1;
    } else if (PHASE == 13) {
        phaseSkipByClick = false;
        SetGasterText("SELECT THE TORSO\nTHAT YOU PREFER.");
        choiceNumber = 2;
    } else if (PHASE == 14) {
        phaseSkipByClick = false;
        SetGasterText("SELECT THE LEGS\nTHAT YOU PREFER.");
        choiceNumber = 3;
    } else if (PHASE == 15) {
        phaseSkipByClick = true;
        SetGasterText("THIS[w:500] IS YOUR BODY.");
        choiceNumber = 4;
        removeTouchGonermakerControls();
    } else if (PHASE == 16) {
        phaseSkipByClick = false;
        SetGasterText("DO YOU ACCEPT IT?");
        // INSERT CHOICE HERE
    }
}

function FadeOutGasterText(cb) {
    /**@type {HTMLElement} */
    var ele = lastTypedText.container.parentElement;
    ele.classList.add("MESSAGE_FADE");
    GONERMAKER_FADE(true);
    setTimeout(() => {
        GONERMAKER_FADE(false);
        ele.remove();
        cb();
    }, 1200);
}

var bigRatio;
var smallRatio;
function calcAnimRatios() {
    var widthRatio = window.innerWidth / DR_WIDTH;
    var heightRatio = window.innerHeight / DR_HEIGHT;
    bigRatio = Math.ceil(Math.max(widthRatio, heightRatio));
    smallRatio = Math.ceil(Math.min(widthRatio, heightRatio));

    // Stuff that depends on this . . .
    AddHearts(smallRatio * 2);
    preloadAndScaleAll(smallRatio * 2);
}

window.addEventListener("load", calcAnimRatios);