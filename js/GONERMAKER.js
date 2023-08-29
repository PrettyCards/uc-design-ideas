

/**@type {HTMLCanvasElement} */
var goner_canvas = document.createElement("CANVAS");
goner_canvas.className = "GONERMAKER";

var goner_placer = document.createElement("DIV");
goner_placer.className = "GONERMAKER_PLACER";
goner_placer.appendChild(goner_canvas);
document.body.append(goner_placer);


var heads = [], torsos = [], legs = [];
const HEAD_COUNT = 8, TORSO_COUNT = 6, LEG_COUNT = 5;

function preloadAndScale(src, scale) {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.onload = () => {
            resolve(upscale(image, scale));
        }
        image.onerror = reject;
        image.src = src;
    });
}

function preloadAndScaleCategory(count, srcType, destArray, scale) {
    for (var i=0; i < count; i++) {
        const INDEX = i;
        preloadAndScale(`./img/IMAGE_GONER${srcType}/IMAGE_GONER${srcType}_${i}.png`, scale).catch((e) => {
            // Uuuuuuh . . . Just don't add it, IG?
        }).then((image) => {
            destArray[INDEX] = image;
        })
    }
}

var gonerScale = 0;
// Has to be called externally when the big scale is resolved
function preloadAndScaleAll(scale) {
    preloadAndScaleCategory(HEAD_COUNT, "HEAD", heads, scale);
    preloadAndScaleCategory(TORSO_COUNT, "BODY", torsos, scale);
    preloadAndScaleCategory(LEG_COUNT, "LEGS", legs, scale);

    gonerScale = scale;
    goner_canvas.width = scale * 160;
    goner_canvas.height = scale * 120;
}

var headId = 0;
var torsoId = 0;
var legId = 0;
var choiceNumber = 0; // 0 - inactive state, 1 - HEAD, 2 - TORSO, 3 - LEGS, 4 - Assembled

function GetGlowScale(frame = 0) {
    return Math.abs(Math.sin(frame*Math.PI / 2000))*0.3 + 1;
}

function RenderAfterEffect(delay = 0, frame = 0, /**@type {CanvasRenderingContext2D} */ ctx, x = 0, y = 0, /**@type {HTMLCanvasElement} */ image) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(GetGlowScale(frame+delay), GetGlowScale(frame+delay));
    ctx.globalAlpha = 0.3;
    ctx.drawImage(image, -image.width/2, -image.height/2);
    ctx.restore();
}

function RenderAfterEffects(frame = 0, /**@type {CanvasRenderingContext2D} */ ctx, x = 0, y = 0, /**@type {HTMLCanvasElement} */ image) {
    RenderAfterEffect(0, frame, ctx, x, y, image);
    RenderAfterEffect(0, frame*1.3, ctx, x, y, image);
    //RenderAfterEffect(0, frame*2.15, ctx, x, y, image);
}

function RenderBodyPart(/**@type {CanvasRenderingContext2D} */ ctx, x = 0, y = 0, /**@type {HTMLCanvasElement} */ image) {
    ctx.drawImage(image, x-image.width/2, y-image.height/2);
}

function GONERMAKER_START() {
    GONERMAKER_FADE(false, true);
    //document.body.appendChild(goner_canvas);
    if (gonerFirstFrame <= 0) {
        window.requestAnimationFrame((time) => {
            gonerFirstFrame = time;
            UpdateGONERMAKER(time);
        })
    }
    if (!gonermakerControlContainer) {
        createTouchGonermakerControls(gonerScale * 50);
    }
}

function GONERMAKER_FADE(out = false, force = false) {
    if (!force && choiceNumber >= 4) {
        return;
    }
    if (out) {
        goner_canvas.classList.add("FADE");
    } else {
        goner_canvas.classList.remove("FADE");
    }
    //var fun = out ? goner_canvas.classList.add : goner_canvas.classList.remove;
    //fun("FADE");
}

function GONERMAKER_TOGGLE_RIGHT() {
    goner_placer.classList.toggle("GONERMAKER_PLACER_RIGHT");
}

function ModifiedRemainder(nr, max) {
    nr = nr % max;
    while (nr < 0) {
        nr += max;
    } 
    return nr;
}

function RenderMenu(ctx, list, currentlySelected, x, y) {
    for (var i=-3; i <= 3;i++) {
        var nr = currentlySelected + i;
        var movingI = (i - (menuMoveFrame*menuMoveDirection)/MENU_MOVE_TIME);
        if (nr >= 0 && nr < list.length) {
            ctx.globalAlpha = 1 - (0.3 * Math.abs(movingI));
            RenderBodyPart(ctx, x + movingI * gonerScale * 32, y, list[nr]);
            ctx.globalAlpha = 1;
        }
    }
}

const MENU_MOVE_TIME = 200;
var menuMoveFrame = 0;
var menuMoveDirection = 0;
function MenuMove(diff) {
    if (menuMoveFrame > 0) {
        return;
    }
    var data = getMenuDataForState();
    var futureId = data.currentId + diff;
    if (futureId < 0 || futureId >= data.list.length) {
        return;
    }
    menuMoveFrame = 0;
    menuMoveDirection = diff;
}

// I promise, this is the Ugliest code I ever wrote as well
function getMenuDataForState() {
    switch (choiceNumber) {
        case 1: 
            list = heads;
            currentId = headId;
            break;
        case 2:
            list = torsos;
            currentId = torsoId;
            break;
        case 3:
            list = legs;
            currentId = legId;
            break;
    }
    return {list : list, currentId : currentId};
}

function UpdateMenuMove(delta) {
    if (menuMoveDirection == 0) {
        return 0;
    }
    menuMoveFrame = Math.min(menuMoveFrame + delta, MENU_MOVE_TIME);
    if (menuMoveFrame >= MENU_MOVE_TIME) {
        var oldDir = menuMoveDirection;
        menuMoveDirection = 0;
        menuMoveFrame = 0;
        return oldDir;
    }
    return 0;
}

// I know this is a simple demo, but I'm starting to wish I was working with NPM on this.
var gonerFrame = 0;
var gonerFirstFrame = 0;

function UpdateGONERMAKER(time) {
    var newFrame = time - gonerFirstFrame;
    var delta = newFrame - gonerFrame;
    gonerFrame = newFrame;

    var ctx = goner_canvas.getContext("2d");
    ctx.clearRect(0, 0, goner_canvas.width, goner_canvas.height);
    // Head after it got selected!
    var x = goner_canvas.width/2;
    var heady = heart_small.height + (gonerScale*16);
    var torsoy = heady + heads[headId].height - (gonerScale*6);
    var legsy = torsoy + torsos[torsoId].height - (gonerScale*4);

    if (choiceNumber > 0 && choiceNumber < 4) {
        ctx.drawImage(heart_small, goner_canvas.width/2 - heart_small.width/2, 0);
    }

    // Separated because all after effects need to be below all regular body parts!
    if (choiceNumber > 1 || (choiceNumber == 1 && !menuMoveFrame)) {
        RenderAfterEffects(gonerFrame, ctx, x, heady, heads[headId]);
        if (choiceNumber > 2 || (choiceNumber == 2 && !menuMoveFrame)) {
            RenderAfterEffects(gonerFrame, ctx, x, torsoy, torsos[torsoId]);
            if (choiceNumber > 3 || (choiceNumber == 3 && !menuMoveFrame)) {
                RenderAfterEffects(gonerFrame, ctx, x, legsy, legs[legId]);
            }
        }
    }
    
    // Already chosen body parts
    if (choiceNumber > 1) {
        RenderBodyPart(ctx, x, heady, heads[headId]);
        if (choiceNumber > 2) {
            RenderBodyPart(ctx, x, torsoy, torsos[torsoId]);
            if (choiceNumber > 3) {
                RenderBodyPart(ctx, x, legsy, legs[legId]);
            }
        }
    }
    
    // Current Menu
    var list;
    var currentId;
    var currenty;
    switch (choiceNumber) {
        case 1: 
            list = heads;
            currentId = headId;
            currenty = heady;
            break;
        case 2:
            list = torsos;
            currentId = torsoId;
            currenty = torsoy;
            break;
        case 3:
            list = legs;
            currentId = legId;
            currenty = legsy;
            break;
    }
    if (list) {
        RenderMenu(ctx, list, currentId, x, currenty);
        var move = UpdateMenuMove(delta);
        if (move != 0) {
            switch (choiceNumber) {
                case 1: 
                    headId += move;
                    break;
                case 2:
                    torsoId += move;
                    break;
                case 3:
                    legId += move;
                    break;
            }
        }
    }

    window.requestAnimationFrame(UpdateGONERMAKER);
}

var gonermakerControlContainer;
function createTouchGonermakerControls(middleSize) {
    gonermakerControlContainer = document.createElement("DIV");
    gonermakerControlContainer.className = "GONERMAKER_CONTROLS";
    //gonermakerControlContainer.onclick = (e) => {e.stopPropagation();}
    var left = document.createElement("DIV");
    var middle = document.createElement("DIV");
    middle.style.width = middleSize + "px";
    var right = document.createElement("DIV");

    left.onclick = (e) => {MenuMove(-1); e.stopPropagation();}
    right.onclick = (e) => {MenuMove(1); e.stopPropagation();}
    middle.onclick = (e) => {nextPageClick(true); e.stopPropagation();}

    gonermakerControlContainer.appendChild(left);
    gonermakerControlContainer.appendChild(middle);
    gonermakerControlContainer.appendChild(right);
    document.body.appendChild(gonermakerControlContainer);
}

function removeTouchGonermakerControls() {
    gonermakerControlContainer.remove();
    gonermakerControlContainer = null;
}