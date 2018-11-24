let FPS = 60;
let canvas = document.querySelector("canvas");

export let width = 400;
export let height = 200;

const ctx = canvas.getContext("2d");
const S = Math.sin;
const C = Math.cos;
const T = Math.tan;
const PI = Math.PI;

let time = 0;
let frame = 0;

let OnUserUpdate;

function loop() {
    // requestAnimationFrame(loop);
    setTimeout(function() {
        requestAnimationFrame(loop);
    }, 1000 / FPS);
    time = frame / FPS;
    if ((time * FPS | 0) == frame - 1) { time += 0.000001; }
    frame++;

    canvas.height = height; canvas.width = width;
    OnUserUpdate(time);
    ctx.putImageData(screen, 0, 0);
}

export function rnd(){
    return ~~(Math.random()*25000)
}

export function Draw(x, y, r, g, b, a) {
    data32[x + y * screen.width] = (a << 24) | (b << 16) | (g <<  8) | r;            
}

export let screen = ctx.createImageData(width, height);

let data32 = new Uint32Array(screen.data.buffer);

export function Start(_OnUserUpdate){
    OnUserUpdate = _OnUserUpdate;
    if(typeof OnUserUpdate==="function") requestAnimationFrame(loop); else console.error("OnUserUpdate is not set");
}

