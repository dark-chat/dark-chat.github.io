import {Draw, Start, screen, width, height, rnd} from "./engine.js";

Start(OnUserUpdate)

var state = (new Uint8Array(width*height)).fill(0)
var display = (new Uint8Array(width*height)).fill(0)

for(var x=width;x--;) for(var y=height;y--;) {
    state[x+y*width] = rnd()%2;
}

function cell(x, y){return display[x+y*width];}

function OnUserUpdate(t) {
    screen.data.fill(255);

    display.set(state);

    for(var x=width-1;--x;) for(var y=height-1;--y;) {
        const neighbores =  cell(x-1,y-1) + cell(x,y-1) + cell(x+1,y-1) +
                            cell(x-1,y) + 0             + cell(x+1,y) +
                            cell(x-1,y+1) + cell(x,y+1) + cell(x+1,y+1);

        if( cell(x,y) && (neighbores>3 || neighbores<2) ) state[x+y*width]=0;
        else if ( cell(x,y)===0 && (neighbores==3) ) state[x+y*width]=1;

        if(cell(x,y)) Draw(x, y, 0, 0, 0, 255);
    }

}

