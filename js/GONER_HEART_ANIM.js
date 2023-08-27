

/**@type {HTMLCanvasElement} */
var heart_normal;
/**@type {HTMLCanvasElement} */
var heart_big;

var heart_appear_noise = new Audio();
heart_appear_noise.src = "./audio/AUDIO_APPEARANCE.ogg";

// This MUST be called before the animation starts!
function AddHearts(scale) {
    var image = new Image();
    image.onload = function() {
        heart_normal = upscale(image, scale);
        heart_big = upscale(image, scale*2);
        //document.body.appendChild(heart_normal);
        //document.body.appendChild(heart_big);
    }
    image.src = "./img/IMAGE_SOUL_BLUR.png";
}

/**@type {HTMLCanvasElement} */
var heart_canvas = document.createElement("CANVAS");
heart_canvas.className = "APPEARANCE";
var frame = 0;
var lastTime = 0;
var speed = 0;
var floatFrame = 0;
var heart_floating = false;
const HEART_ANIM_DURATION = 1100;
const PAUSE_NUM = 100;
const HEART_FLOAT_MULT = 0.01;
function StartHeartAnim(backward = false) {
    heart_canvas.width = heart_normal.width;
    heart_canvas.height = window.innerHeight;
    document.body.appendChild(heart_canvas);
    heart_appear_noise.play();
    frame = backward ? HEART_ANIM_DURATION : 0;
    speed = backward ? -1 : 1;
    heart_floating = false;
    window.requestAnimationFrame((time) => {
        lastTime = time;
        HeartAnimUpdate(time);
    });
}

/*
function WidthFunction(frame) {
    var halfDuration = HEART_ANIM_DURATION/2;
    var heartAppear
    var width = 
}
*/

function createHeartGradient(ctx, x, y, length) {
    const gradangle = 0;
    var HEART_BEAM_GRADIENT = ctx.createLinearGradient(x, y, x + Math.cos(gradangle) * length, y + Math.sin(gradangle) * length);
    HEART_BEAM_GRADIENT.addColorStop(0, "#660000");
    HEART_BEAM_GRADIENT.addColorStop(0.2, "red");
    HEART_BEAM_GRADIENT.addColorStop(0.8, "red");
    HEART_BEAM_GRADIENT.addColorStop(1, "#660000");
    return HEART_BEAM_GRADIENT;
}

function HeartAnimUpdate(time) {
    heart_canvas.height = window.innerHeight;
    var deltaTime = time - lastTime;
    frame += (deltaTime * speed);
    frame = Math.min(Math.max(frame, 0), HEART_ANIM_DURATION);
    if (heart_floating) {
        floatFrame += deltaTime;
    }

    var ctx = heart_canvas.getContext("2d");
    ctx.clearRect(0, 0, heart_canvas.width, heart_canvas.height);
    var halfHeight = heart_canvas.height/2;
    var halfDuration = HEART_ANIM_DURATION/2;

    var barWidth = (frame/(halfDuration-PAUSE_NUM)) * heart_canvas.width;
    var floatNum = Math.sin(floatFrame * Math.PI / 2000) * HEART_FLOAT_MULT * heart_canvas.height;
    if (frame > (halfDuration-PAUSE_NUM) && frame < (halfDuration+PAUSE_NUM)) {
        barWidth = heart_canvas.width;
    } else if (frame > halfDuration) {
        barWidth = (1 - ((frame-(halfDuration+PAUSE_NUM))/(halfDuration-PAUSE_NUM))) * heart_canvas.width;
        // Heart is only drawn in the second half!
        ctx.drawImage(heart_normal, 0, Math.ceil(halfHeight - (heart_normal.height/2)) + floatNum);
    }

    // I can't seem to get the gradient to look good.
    // Toby must have used something I am not thinking of.
    // Disabling for now
    ctx.fillStyle = "red";
    
    if (frame > halfDuration) {
        //ctx.fillStyle = createHeartGradient(ctx, (heart_canvas.width - barWidth)/2, 0, barWidth);
        ctx.fillRect((heart_canvas.width - barWidth)/2, halfHeight + floatNum, barWidth, halfHeight - floatNum);

        //ctx.fillStyle = createHeartGradient(ctx, (heart_canvas.width - barWidth)/4, 0, barWidth/2);
        ctx.fillRect((heart_canvas.width - barWidth)/4, 0, barWidth/2 * 1.01 , halfHeight + 2 + floatNum);
        //ctx.fillStyle = createHeartGradient(ctx, (heart_canvas.width - barWidth)/4 + (heart_canvas.width/2), 0, barWidth/2);
        ctx.fillRect((heart_canvas.width - barWidth)/4 + (heart_canvas.width/2), 0, barWidth/2 * 1.01, halfHeight + 2 + floatNum);
    } else {
        //ctx.fillStyle = createHeartGradient(ctx, (heart_canvas.width - barWidth)/2, 0, barWidth);
        ctx.fillRect((heart_canvas.width - barWidth)/2, 0, barWidth, heart_canvas.height);
    }
    

    lastTime = time;
    if (frame == HEART_ANIM_DURATION && speed > 0 && !heart_floating) {
        heart_floating = true;
    }
    if (frame > 0 || speed > 0) {
        requestAnimationFrame(HeartAnimUpdate);
    } else {
        heart_canvas.remove();
    }
}

function HeartFloatUpdate() {

}