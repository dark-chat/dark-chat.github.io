const log = x => console.log(x)

let FPS = 30
let canvas = document.querySelector("canvas")

const calcRatio = () => window.innerWidth/window.innerHeight
const calcHeight = () => ~~(width/calcRatio())

let OnUserUpdate
let OnStart

let width
let height
let screen
let data32

function restart() {
    width = ~~(window.innerWidth/5)
    height = ~~(window.innerHeight/5)

    // width = ~~Math.max(320, window.innerWidth/3
    // height = calcHeight()
    // height = window.innerHeight

    screen = createScreen()
    data32 = createData32()

    OnStart(width, height, screen)
    requestAnimationFrame(loop)
}

const ctx = canvas.getContext("2d");
const S = Math.sin;
const C = Math.cos;
const T = Math.tan;
const PI = Math.PI;

let time = 0;
let frame = 0;

function loop() {
    // console.log(height)
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

const createScreen = () =>  ctx.createImageData(width, height)
const createData32 = () => new Uint32Array(screen.data.buffer)

export function Start(_OnStart, _OnUserUpdate){
    OnStart = _OnStart
    OnUserUpdate = _OnUserUpdate
    restart()
    if(typeof OnUserUpdate==="function") requestAnimationFrame(loop); else console.error("OnUserUpdate is not set")
    window.addEventListener("resize", restart)
}