
const DR_WIDTH = 640;
const DR_HEIGHT = 480;
const CYCLE_DURATION = 10000; // in miliseconds
const SPAWN_FREQUENCY = 2000;
const IMAGE_URL = "./img/IMAGE_DEPTH.png";

var canvas;

function motionFunction(time) {
    if (time < 0 || time > CYCLE_DURATION) {
        return {scale: 0, opacity: 0};
    }
    var firstSect = CYCLE_DURATION*0.2;
    var thirdSect = CYCLE_DURATION*0.8;

    var scale = 1 + time/CYCLE_DURATION*0.5;
    var opacity = 1;
    if (time <= firstSect) {
        opacity = time/(CYCLE_DURATION)/10;
    } else if (time >= thirdSect) {
        opacity = 1 - (time-thirdSect)/(CYCLE_DURATION-thirdSect);
    }
    return {scale: scale, opacity: opacity*0.7};
}

var modifiedImage;

function addCanvas() {
    var widthRatio = window.innerWidth / DR_WIDTH;
    var heightRatio = window.innerHeight / DR_HEIGHT;
    var ratio = Math.ceil(Math.max(widthRatio, heightRatio));
    canvas = document.createElement("CANVAS");
    canvas.className = "GONERMAKER_BG_CANVAS";
    canvas.setAttribute("width", ratio * DR_WIDTH);
    canvas.setAttribute("height", ratio * DR_HEIGHT);
    

    createImage(ratio*2).then((bigImageCanvas) => {
        document.body.prepend(canvas);
        modifiedImage = bigImageCanvas;
        window.requestAnimationFrame(update)
    });
}

function update(time) {
    const WIDTH = Number(canvas.getAttribute("width"));
    const HEIGHT = Number(canvas.getAttribute("height"));
    /** @type {CanvasRenderingContext2D} */
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    const FOR_COUNT = CYCLE_DURATION / SPAWN_FREQUENCY;
    for (var i=-1; i < FOR_COUNT; i++) {
        ctx.save();
        ctx.translate(WIDTH/2, HEIGHT/2);
        var data = motionFunction((time % SPAWN_FREQUENCY) + (i * SPAWN_FREQUENCY));
        ctx.scale(data.scale, data.scale);
        ctx.globalAlpha = data.opacity;
        ctx.drawImage(modifiedImage, -modifiedImage.width/2, -modifiedImage.height/2);
        ctx.restore();
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "";

    window.requestAnimationFrame(update);
}

/*
function getPixel(x, y, pixelData) {
    var startIndex = x + y * pixelData.width;
    return {
        r: pixelData.data[startIndex],
        g: pixelData.data[startIndex+1],
        b: pixelData.data[startIndex+2],
        a: pixelData.data[startIndex+3]
    };
}

function setPixel(pixel, x, y, pixelData) {
    var startIndex = x + y * pixelData.width;
    pixelData.data[startIndex] = pixel.r;
    pixelData.data[startIndex+1] = pixel.g;
    pixelData.data[startIndex+2] = pixel.b;
    pixelData.data[startIndex+3] = pixel.a;
}
*/

// Function taken from https://www.npmjs.com/package/resize-image-data
// For some reason, my version did not work properly ;_;
function nearestNeighbor (src, dst) {
    let pos = 0

    for (let y = 0; y < dst.height; y++) {
        for (let x = 0; x < dst.width; x++) {
        const srcX = Math.floor(x * src.width / dst.width)
        const srcY = Math.floor(y * src.height / dst.height)

        let srcPos = ((srcY * src.width) + srcX) * 4

        dst.data[pos++] = src.data[srcPos++] // R
        dst.data[pos++] = src.data[srcPos++] // G
        dst.data[pos++] = src.data[srcPos++] // B
        dst.data[pos++] = src.data[srcPos++] // A
        }
    }
}

function upscale(image = new Image(), scale = 0) {
    var canvas = document.createElement("CANVAS");
    canvas.setAttribute("width", image.width);
    canvas.setAttribute("height", image.height);

    var canvasResized = document.createElement("CANVAS");
    canvasResized.setAttribute("width", image.width * scale);
    canvasResized.setAttribute("height", image.height * scale);
    
    /** @type {CanvasRenderingContext2D} */
    var ctx = canvas.getContext("2d");
    /** @type {CanvasRenderingContext2D} */
    var ctx2 = canvasResized.getContext("2d");

    ctx.drawImage(image, 0, 0);

    var imageData = ctx.getImageData(0, 0, image.width, image.height);
    var imageDataResized = ctx2.getImageData(0, 0, image.width * scale, image.height * scale);

    /*
    console.log(imageData, imageDataResized, imageData.data[0]);
    for (var i=0; i < imageData.width; i++) {
        for (var j=0; j < imageData.height; j++) {
            var data = getPixel(i, j, imageData);
            console.log(data);
            for (var x=0; x < scale; x++) {
                for (var y=0; y < scale; y++) {
                    //imageDataResized.data[i*scale + x + (y * image.width * scale) + (Math.floor(i/(image.width*4)) * image.width * scale)] = imageData.data[i];
                    setPixel(data, i*scale + x, j*scale + y, imageDataResized);
                }
            }
        }
    }
    */
    nearestNeighbor(imageData, imageDataResized);
    ctx2.putImageData(imageDataResized, 0, 0);
    return canvasResized;
}

function createImage(scale = 0) {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.onload = () => {
            console.log("Image loaded!");
            var bigImage = upscale(image, scale);
            const WIDTH = Number(bigImage.getAttribute("width"));
            const HEIGHT = Number(bigImage.getAttribute("height"));
            var finalCanvas = document.createElement("CANVAS");
            finalCanvas.setAttribute("width", WIDTH*2);
            finalCanvas.setAttribute("height", HEIGHT*2);
            /** @type {CanvasRenderingContext2D} */
            var ctx = finalCanvas.getContext("2d");
            ctx.drawImage(bigImage, WIDTH, HEIGHT);
            ctx.scale(-1, 1);
            ctx.drawImage(bigImage, -WIDTH, HEIGHT);
            ctx.scale(-1, -1);
            ctx.drawImage(bigImage, WIDTH, -HEIGHT);
            ctx.scale(-1, 1);
            ctx.drawImage(bigImage, -WIDTH, -HEIGHT);

            //document.body.appendChild(finalCanvas);
            resolve(finalCanvas);
        }
        image.onerror = reject;
        image.src = IMAGE_URL;
    });
}

//processBG();
window.addEventListener("load", addCanvas);