
var GASTER_TEXT_CONTAINER = document.createElement("DIV");
GASTER_TEXT_CONTAINER.style.display = "none";

document.getElementById("ESTABLISH_CONNECTION").onclick = function() {
    this.remove();
    GASTER_TEXT_CONTAINER.style.display = "";
    //StartAnotherHim();
    //SetGasterText("Hi! [style:red]Nice[style:white] to\n meet you!");
    
    ADVANCE_SEQUENCE();
}

var phaseSkipByClick = false;
var lastTypedText;
document.body.addEventListener("click", () => {
    if (!phaseSkipByClick || document.getElementById("ESTABLISH_CONNECTION") || lastTypedText == null || !lastTypedText.IsPageDone()) {
        return;
    }
    FadeOutGasterText(ADVANCE_SEQUENCE);
})

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
    canvas.style.display = "inherit";

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
        SetGasterText("ARE YOU[w:500]\n THERE?");
    } else if (PHASE == 3) {
        phaseSkipByClick = true;
        SetGasterText("  ARE WE[w:500]\nCONNECTED?");
    } else if (PHASE == 4) {
        phaseSkipByClick = false;
        // Insert Heart Appear Animation Here
    }
}

function FadeOutGasterText(cb) {
    /**@type {HTMLElement} */
    var ele = lastTypedText.container.parentElement;
    ele.classList.add("MESSAGE_FADE");
    setTimeout(() => {
        ele.remove();
        cb();
    }, 1000);
}