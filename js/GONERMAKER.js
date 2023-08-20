

/**@type {HTMLCanvasElement} */
var goner_canvas = document.createElement("CANVAS");
goner_canvas.className = "GONERMAKER";

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

// Has to be called externally when the big scale is resolved
function preloadAndScaleAll(scale) {
    preloadAndScaleCategory(HEAD_COUNT, "HEAD", heads, scale);
    preloadAndScaleCategory(TORSO_COUNT, "BODY", torsos, scale);
    preloadAndScaleCategory(LEG_COUNT, "LEGS", legs, scale);
}

var headId = 0;
var torsoId = 0;
var legId = 0;
var choiceNumber = 0; // 0 - inactive state, 1 - HEAD, 2 - TORSO, 3 - LEGS, 4 - Assembled

// I know this is a simple demo, but I'm starting to wish I was working with NPM on this.
var gonerFrame = 0;
var gonerLastTime = 0;

function GetGlowScaleWithDelay(delay = 0) {
    return Math.abs(Math.sin(frame*Math.PI / 400))*0.2 + 1;
}

function RenderAfterEffect(delay = 0, frame = 0, /**@type {CanvasRenderingContext2D} */ ctx, x = 0, y = 0, /**@type {HTMLCanvasElement} */ image) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(GetGlowScaleWithDelay(0));
    ctx.globalAlpha = 0.2;
    ctx.drawImage(image, 0, 0);
    ctx.restore();
}

function RenderAfterEffects(frame = 0, /**@type {CanvasRenderingContext2D} */ ctx, x = 0, y = 0, /**@type {HTMLCanvasElement} */ image) {
    RenderAfterEffect(0, frame, ctx, x, y, image);
    RenderAfterEffect(200, frame, ctx, x, y, image);
    RenderAfterEffect(400, frame, ctx, x, y, image);
}

function UpdateGONERMAKER(time) {
    var ctx = goner_canvas.getContext("2d");
    // Head after it got selected!
    if (choiceNumber > 1) {
        RenderAfterEffects(frame, ctx, 30, 30, heads[headId]);
        ctx.drawImage(heads[headId], 30, 30);
    }
}