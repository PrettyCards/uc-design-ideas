
// TODO: Add "Where am I?" button to get permission for Audio.

var audio = new Audio();

window.addEventListener("load", () => {
    canvas.style.display = "none";
});


var GASTER_TEXT_CONTAINER = document.createElement("DIV");
GASTER_TEXT_CONTAINER.className = "GASTER_TEXT_CONTAINER";
document.body.appendChild(GASTER_TEXT_CONTAINER);

// Only works one line at a time due to
// The fade effect
function SetGasterText(string, clickToClear = true) {
    var test = document.createElement("DIV");
    test.className = "GASTER_TEXT";
    var typedText = new TypedText(string, test);
    typedText.SetWidth();
    typedText.alwaysMute = true;
    GASTER_TEXT_CONTAINER.appendChild(test);
}

function PitchUpAnotherHim() {
    audio.playbackRate += 0.02;
    if (audio.playbackRate < 0.96) {
        setTimeout(PitchUpAnotherHim, 100/3);
    }
}

function StartAnotherHim() {
    canvas.style.animationDuration = "5s";
    canvas.style.display = "inherit";

    audio.src = "./audio/AUDIO_ANOTHERHIM.ogg";
    audio.preservesPitch = false;
    audio.playbackRate = 0.08;
    PitchUpAnotherHim();

    audio.loop = true;
    audio.play();
}

setTimeout(() => {
    StartAnotherHim();
    SetGasterText("Hi! Nice to\n meet you!");
}, 1000);
