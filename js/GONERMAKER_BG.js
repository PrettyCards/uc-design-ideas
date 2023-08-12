
const DR_WIDTH = 640;
const DR_HEIGHT = 480;
const CYCLE_DURATION = 10000; // in miliseconds
const IMAGE_URL = "./img/IMAGE_DEPTH.png";

var canvas;

function motionFunction(time) {
    if (time < 0) {
        return {scale: 0, opacity: 0};
    }
    var firstSect = CYCLE_DURATION*0.1;
    //var thirdSect = CYCLE_DURATION*0.9;

    var scale = 1 + time/CYCLE_DURATION*0.5;
    var opacity = 0;
    if (time <= firstSect) {
        opacity = time/(CYCLE_DURATION)/10;
    } else {
        opacity = 1 - (time-firstSect)/(CYCLE_DURATION-firstSect);
    }
    return {scale: scale, opacity: opacity*0.6};
}

function addCanvas() {
    var widthRatio = window.innerWidth / DR_WIDTH;
    var heightRatio = window.innerHeight / DR_HEIGHT;
    var ratio = Math.ceil(Math.max(widthRatio, heightRatio));
    canvas = document.createElement("CANVAS");
    canvas.className = "GONERMAKER_BG_CANVAS";
    canvas.setAttribute("width", ratio * DR_WIDTH);
    canvas.setAttribute("height", ratio * DR_HEIGHT);
    document.body.prepend(canvas);

    createImage(ratio).then(() => {window.requestAnimationFrame(update)});
}

function update(time) {
    

    window.requestAnimationFrame(update);
}



function upscale(image = new Image(), scale = 0) {
    var canvas = document.createElement("CANVAS");
    canvas.setAttribute("width", image.width);
    canvas.setAttribute("height", image.height);

    document.body.appendChild(canvas);

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

    console.log(imageData, imageDataResized, imageData[0]);
    for (var i=0; i < imageData.data.length; i++) {
        for (var x=0; x < scale; x++) {
            for (var y=0; y < scale; y++) {
                //console.log(imageData[i]);
                imageDataResized.data[i*scale + x + (y * image.width * scale) + (Math.floor(i/image.width) * image.width * scale)] = imageData.data[i];
            }
        }
    }
    ctx2.putImageData(imageDataResized, 0, 0);
    return canvasResized;
}

function createImage(scale = 0) {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.onload = () => {
            console.log("Image loaded!");
            var bigImage = upscale(image, scale);
            document.body.append(bigImage);
        }
        image.onerror = reject;
        image.src = IMAGE_URL;
    });
}

//processBG();
window.addEventListener("load", addCanvas);