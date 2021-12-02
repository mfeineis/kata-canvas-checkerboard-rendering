/** @type {HTMLCanvasElement} */
const mainCanvas = document.querySelector(".viewport.main");

/** @type {HTMLCanvasElement} */
const internalCanvas = document.querySelector(".viewport.internal");

/** @type {HTMLInputElement} */
const fpsInput = document.querySelector("#fps");
/** @type {HTMLInputElement} */
const mxInput = document.querySelector("#mx");
/** @type {HTMLInputElement} */
const myInput = document.querySelector("#my");
/** @type {HTMLInputElement} */
const renderInput = document.querySelector("#render");
/** @type {HTMLInputElement} */
const upscaleInput = document.querySelector("#upscale");
/** @type {HTMLInputElement} */
const predictedInput = document.querySelector("#predicted");

/** @type {HTMLButtonElement} */
const startButton = document.querySelector("#start");
/** @type {HTMLButtonElement} */
const stopButton = document.querySelector("#stop");
/** @type {HTMLInputElement} */
const targetfpsInput = document.querySelector("#targetfps");
/** @type {HTMLInputElement} */
const budgetInput = document.querySelector("#budget");

const out = mainCanvas.getContext("2d");
const wOut = mainCanvas.width;
const hOut = mainCanvas.height;

const canvas = internalCanvas.getContext("2d");
canvas.imageSmoothingEnabled = true;
canvas.imageSmoothingQuality = "high";
//canvas.translate(internalCanvas.width / 2, internalCanvas.height / 2);
const w = internalCanvas.width;
const h = internalCanvas.height;

const startT = performance.now();
const maxTime = startT + 10 * 1000;
let running = true;
let renderedFrames = 0;
let targetFps = Number(targetfpsInput.value);
budgetInput.value = 1000 / targetFps;
let fps = 0;

let mx = 0;
let my = 0;

internalCanvas.addEventListener("mousemove", (ev) => {
    //console.log(ev);
    mx = ev.offsetX;
    my = ev.offsetY;
    mxInput.value = mx;
    myInput.value = my;
});
startButton.addEventListener("click", () => {
    running = true;
    startButton.disabled = true;
    stopButton.disabled = false;
    loop();
});
stopButton.addEventListener("click", () => {
    running = false;
    startButton.disabled = false;
    stopButton.disabled = true;
});
targetfpsInput.addEventListener("change", () => {
    targetFps = Number(targetfpsInput.value);
    budgetInput.value = 1000 / targetFps;
});

let x = 0;
let y = 0;
let xs = 0;
let ys = 0;
let i = 0;
let j = 0;
let r = 0;
let g = 0;
let b = 0;
let a = 0;
let xf = 0;
let yf = 0;
let x1 = 0;
let x2 = 0;
let y1 = 0;
let y2 = 0;
let s1 = 0;
let s2 = 0;
let s = 0;
let target = null;
let targetData = null;
let src = null;
let srcData = null;
let evenFrame = false;

target = out.getImageData(0, 0, wOut, hOut); //.data;
targetData = target.data;

/** @type {(t: number, k: number) => void} */
function upscale(t, k) {
    src = canvas.getImageData(0, 0, w, h);
    srcData = src.data;
    //srcData = new DataView(src.data.buffer);
    
    //out.fillStyle = "white";
    //out.fillRect(0, 0, wOut, hOut);

    // Checkerboarding
    evenFrame = k % 2 === 0;
    for (y = 0; y < hOut; y += 1) {
        for (x = y % 2 == 0 ? evenFrame ? 0 : 1 : evenFrame ? 1 : 0; x < wOut; x += 2) {
        //for (x = 0; x < wOut; x += 1) {
            //// Aliased interpolation
            //xf = x / wOut * w;
            //yf = y / hOut * h;

            //x1 = Math.floor(xf);
            //x2 = Math.floor(xf+1);
            //y1 = Math.floor(yf);
            //y2 = Math.floor(yf+1);

            //s1 = xf - x1;
            //s2 = yf - y1;

            //s = Math.sqrt((1 - s1)*(1 - s1) + (1 - s2)*(1 - s2));
            //i = y1 * w * 4 + x1 * 4;
            //r = srcData[i] * s;
            //g = srcData[i+1] * s;
            //b = srcData[i+2] * s;
            //a = srcData[i+3] * s;

            ////s = 1 - s2;
            //s = Math.sqrt((1 - s1)*(1 - s1) + s2*s2);
            //i = y2 * w * 4 + x1 * 4;
            //r += srcData[i] * s;
            //g += srcData[i+1] * s;
            //b += srcData[i+2] * s;
            //a += srcData[i+3] * s;

            ////s = s1;
            //s = Math.sqrt(s1*s1 + (1 - s2)*(1 - s2));
            //i = y1 * w * 4 + x2 * 4;
            //r += srcData[i] * s;
            //g += srcData[i+1] * s;
            //b += srcData[i+2] * s;
            //a += srcData[i+3] * s;

            ////s = s2;
            //s = Math.sqrt(s1*s1 + s2*s2);
            //i = y2 * w * 4 + x2 * 4;
            //r += srcData[i] * s;
            //g += srcData[i+1] * s;
            //b += srcData[i+2] * s;
            //a += srcData[i+3] * s;

            // No interpolation, just pick a source pixel
            xs = Math.floor(x / wOut * w);
            ys = Math.floor(y / hOut * h);
            i = ys * w * 4 + xs * 4;
            r = srcData[i];
            g = srcData[i+1];
            b = srcData[i+2];
            a = srcData[i+3];

            //r = srcData.getUint8(i);
            //g = srcData.getUint8(i+1);
            //b = srcData.getUint8(i+2);
            //a = srcData.getUint8(i+3);
            //[r, g, b, a] = src.data.subarray(i, i + 4);

            j = y * wOut * 4 + x * 4;
            //const [r, g, b, a] = target.data.subarray(j, j + 4);
            //if (r === 255 && g === 255 && b === 255) {
            //    targetData[j] = 0;
            //    targetData[j+1] = 0;
            //    targetData[j+2] = 0;
            //    targetData[j+3] = 255;
            //} else {
                //target.data[j] = 0;
                //target.data[j+1] = 0;
                //target.data[j+2] = 0;
                //target.data[j+3] = 255;
                targetData[j] = r;
                targetData[j+1] = g;
                targetData[j+2] = b;
                targetData[j+3] = a;
            //}

            //i += 4;
        }
    }
    out.putImageData(target, 0, 0);

    out.fillStyle = "black";
    out.fillText("Not upscaled", wOut / 2, hOut / 2);
}

/** @type {(t: number, k: number) => void} */
function render(t, k) {
    //console.log("render", { w, h });

    canvas.fillStyle = "white";
    canvas.fillRect(0, 0, w, h);

    canvas.translate(w / 2, h / 2);
    canvas.rotate(k % 360 * Math.PI / 180);
    canvas.fillStyle = "blue";
    canvas.fillRect(-h/2, -h/2, h, h);
    canvas.resetTransform();

    const rotationDeg = 6;
    canvas.rotate(rotationDeg * Math.PI / 180);

    const dx = 0; //((k % 50) - 5) * 10;
    const x = mx - h/2;
    const y = my - h/2;
    canvas.fillStyle = "#00ff00aa";
    canvas.fillRect(x, y, h/1.5, h/1.5);

    canvas.resetTransform();
    //canvas.rotate(-rotationDeg * Math.PI / 180);

    canvas.fillStyle = "red";
    canvas.ellipse(w / 2, h / 2, h/3, h/3, 0, 0, 2*Math.PI);
    canvas.fill();

    canvas.fillStyle = "black";
    canvas.fillText("Upscaled", w / 3, h / 3);
}

let lastT = 0;
let lastFullSecond = 0;
let lastRenderedFrames = 0;
let loopT = 0;
let fullSecond = 0;
let fullSecondFlipped = false;
let d = 0;
let targetFrametime = 0;
let elapsed = false;
let renderTime = 0;
let upscaleTime = 0;
let predictedWork = 0;

function loop(t = 0) {
    loopT = performance.now();
    if (!running) {
        return;
    }
    fullSecondFlipped = false;
    fullSecond = Math.floor(t / 1000);
    if (fullSecond > lastFullSecond) {
        fps = renderedFrames - lastRenderedFrames;
        lastFullSecond = fullSecond;
        lastRenderedFrames = renderedFrames;
        fullSecondFlipped = true;
    }
    d = t - lastT;
    targetFrametime = 1000 / targetFps;
    elapsed = (d + predictedWork) >= targetFrametime;
    
    if (!elapsed) {
        requestAnimationFrame(loop);
    } else {
        //console.log("..elapsed", { d, targetFrametime });

        renderTime = performance.now();
        render(t, renderedFrames);
        renderTime = performance.now() - renderTime;

        upscaleTime = performance.now();
        upscale(t, renderedFrames);
        upscaleTime = performance.now() - upscaleTime;

        renderedFrames += 1;
        predictedWork = ((2*targetFps - 1) * predictedWork + (performance.now() - loopT)) / (2*targetFps);

        lastT = t;
        requestAnimationFrame(loop);
    }

    if (fullSecondFlipped || fps < 10) {
        fpsInput.value = fps;
        renderInput.value = renderTime.toFixed(2);
        upscaleInput.value = upscaleTime.toFixed(2);
        predictedInput.value = predictedWork.toFixed(2);
    }
}

loop()