import {Draw, Start, rnd} from "./engine.js";

let state
let display
let width
let height
let screen

function cell(x, y){return display[x+y*width];}

function OnUserUpdate(t) {
    screen.data.fill(255)

    display.set(state)

    for(var x=width-1;--x;) for(var y=height-1;--y;) {
        const neighbores =  cell(x-1,y-1) + cell(x,y-1) + cell(x+1,y-1) +
                            cell(x-1,y) + 0             + cell(x+1,y) +
                            cell(x-1,y+1) + cell(x,y+1) + cell(x+1,y+1);

        if( cell(x,y) && (neighbores>3 || neighbores<2) ) state[x+y*width]=0;
        else if ( cell(x,y)===0 && (neighbores==3) ) state[x+y*width]=1;

        if(cell(x,y)) Draw(x, y, 0, 0, 0, 255);
    }

}

const OnStart = (_width, _height, _screen) => {
    width = _width
    height = _height
    screen = _screen
    state = (new Uint8Array(width*height)).fill(0)
    display = (new Uint8Array(width*height)).fill(0)

    for(var x=width;x--;) for(var y=height;y--;) {
        state[x+y*width] = rnd()%2;
    }
}

Start(OnStart, OnUserUpdate)
