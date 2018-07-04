// Todo: https://tetris.wiki/TGM_Rotation
// Top score
// Wall kicks, Show next piece, Hold, Grace period, particles, more effects
// Support mobile
// Show loading
// controls can get stuck if they dont get handled? 
// control panel, networking, chat, online users, ai, machine learning, leaderboard, SpecialLineClearSingle, switch game

const log = console.log;

const app = new PIXI.Application({ 
        width: 96,         // 224
        height: 144,        // 288
        antialias: false,    // default: false
        transparent: false, // default: false
        resolution: 5       // default: 1
    }
);

const nextApp = new PIXI.Application({ 
        width: 32,         // 224
        height: 32,        // 288
        antialias: false,    // default: false
        transparent: false, // default: false
        resolution: 5       // default: 1
    }
);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
document.getElementById("game").appendChild(app.view);
document.getElementById("next").appendChild(nextApp.view);

import {tettex, tetromino} from './tetromino.js';

const loader = PIXI.loader;

loader.onProgress.add(() => {
    document.querySelector('#loading_percentage').innerText = Math.round(loader.progress) + "%";
});

loader.load((loader, resources) => {
    document.querySelector('#loader').style.display = "none";
    document.querySelector('#panel').style.display = "block";
    document.querySelector('#game').style.display = "block";
    start(resources);
});

function start(resources) {

const fieldW = 12;
const fieldH = 18;
let field = [];
const fieldSprites = [];
let state = {
    currentPiece: rndPiece(), // 1 -> 7
    nextPiece: rndPiece(),
    _lastNextPiece: null,
    currentRotation: 0,
    currentX: fieldW / 2 - 2,
    currentY: 0,
    score: 0,
    _lastscore: null,
    level: 1,
    _lastlevel: null,
};
let gameOver = false;
let _lastgameOver = null;
let gameLoopAcc = 0;
let gameSpeedAcc = 0;
let gameSpeed = 30;
let lines = [];
let linesCounter = 0;
let pieceCount = 0;

let nextFieldSprites = [];

for (let x = 0; x<fieldW; x++) for (let y = 0; y<fieldH; y++)
{
    const i = getIndex(x, y);
    field[i] = 0;
    fieldSprites[i] = new PIXI.Sprite(tettex[0]);
    if (x==0 || x==fieldW-1 || y==fieldH-1) {
        field[i] = 9;
        fieldSprites[i].texture = tettex[9];
    }
    fieldSprites[i].x = x * 8;
    fieldSprites[i].y = y * 8;
    app.stage.addChild(fieldSprites[i]);
}

for (let x = 0; x<8; x++) for (let y = 0; y<8; y++)
{
    const i = getIndex(x, y);
    nextFieldSprites[i] = new PIXI.Sprite(tettex[0]);
    nextFieldSprites[i].x = x * 8;
    nextFieldSprites[i].y = y * 8;
    nextApp.stage.addChild(nextFieldSprites[i]);
}

resources['GameStart'].sound.play();

app.ticker.add(function(dt){
    // game timing
    gameLoopAcc+=dt;
    gameSpeedAcc+=dt;
    if(gameLoopAcc>7 && !gameOver) {
        gameLoopAcc=0;

        // input
        if(keys.left) {
            if (doesPieceFit(state.currentPiece, state.currentRotation, state.currentX - 1, state.currentY)){
                state.currentX -= 1;
                resources['PieceMoveLR'].sound.play();
            }
        }
        if(keys.right) {
            if (doesPieceFit(state.currentPiece, state.currentRotation, state.currentX + 1, state.currentY)){
                state.currentX += 1;
                resources['PieceMoveLR'].sound.play();
            }
        }
        if(keys.down) {
            if (doesPieceFit(state.currentPiece, state.currentRotation, state.currentX, state.currentY + 1)){
                state.currentY += 1;
                resources['PieceSoftDrop'].sound.play();
            }
        }
        if(keys.z) {
            if (doesPieceFit(state.currentPiece, state.currentRotation + 1, state.currentX, state.currentY)){
                state.currentRotation += 1;
                keys.z = false;
                resources['PieceRotateLR'].sound.play();
            }else{
                resources['PieceRotateFail'].sound.play();
            }
        }
        if(keys.x) {
            if (doesPieceFit(state.currentPiece, state.currentRotation - 1, state.currentX, state.currentY)){
                state.currentRotation -= 1;
                keys.x = false;
                resources['PieceRotateLR'].sound.play();
            }else{
                resources['PieceRotateFail'].sound.play();
            }
        }
        //game logic
        if(lines.length){
            linesCounter++;
            if(linesCounter==1){
                for(const currentLine of lines) {
                    for (let x = 1; x < fieldW - 1; x++) {
                        const fi = getIndex(x, currentLine);
                        field[fi] = 11;
                    }
                }
            }
            if(linesCounter==2){
                for(const currentLine of lines) {
                    for (let x = 1; x < fieldW - 1; x++) {
                        const fi = getIndex(x, currentLine);
                        field[fi] = 10;
                    }
                }
            }
            if(linesCounter==3){
                linesCounter=0;
                for(const currentLine of lines) {
                    for(let y=currentLine; y>0; y--){
                        const upperLine = y - 1;
                        for (let x = 1; x < fieldW - 1; x++) {
                            const ci = getIndex(x, y);
                            const ui = getIndex(x, upperLine);
                            field[ci] = field[ui];
                        }
                    }
                }
                lines = [];
            }
        }

        if(gameSpeedAcc>gameSpeed){
            gameSpeedAcc = 0;
            if (doesPieceFit(state.currentPiece, state.currentRotation, state.currentX, state.currentY + 1)){
                state.currentY += 1;
            }else{
                // lock the current piece in the field
                for (let px=0;px<4;px++) for (let py=0;py<4;py++) {
                    if(tetromino[state.currentPiece][rotate(px, py, state.currentRotation)]==="x") {
                        const fi = getIndex(state.currentX + px, state.currentY + py);
                        field[fi] = state.currentPiece;
                    }
                }

                resources['PieceTouchDown'].sound.play();

                pieceCount++;
                if(pieceCount % 10 === 0) {
                    if (gameSpeed>10) { 
                        gameSpeed--;
                        state.level++;
                        resources['LevelUp'].sound.play();
                    }
                }

                // check have we got any lines
                for (let py=0;py<4;py++) {
                    const currentLine = state.currentY + py;
                    if (currentLine<fieldH-1){
                        let line = true;
                        
                        for (let x = 1; x < fieldW - 1; x++) {
                            const fi = getIndex(x, currentLine);
                            if (field[fi] === 0) line=false;
                        }

                        if (line) {
                            lines.push(currentLine);
                            for (let x = 1; x < fieldW - 1; x++) {
                                const fi = getIndex(x, currentLine);
                                field[fi] = 10;
                            }
                        }
                    }

                }

                state.score+=25;
                if(lines.length) {
                    state.score+= (1 << lines.length) * 100;
                    if (lines.length===1) resources['SpecialLineClearSingle'].sound.play();
                    else resources['SpecialLineClearDouble'].sound.play();
                }

                // choose next piece 
                state.currentPiece = state.nextPiece;
                state.currentRotation = 0;
                state.nextPiece = rndPiece();
                state.currentX = fieldW / 2 - 2;
                state.currentY = 0;
                state.rotation = 0;

                // if piece doesnt fit 
                gameOver = !doesPieceFit(state.currentPiece, state.currentRotation, state.currentX, state.currentY);
                if(gameOver) resources['GameOver'].sound.play();
            }
        }

        // render

        //render field
        for (let x = 0; x<fieldW; x++) for (let y = 0; y<fieldH; y++) {
            const i = getIndex(x, y);
            setTex(i, tettex[field[i]]);
        }

        // render piece
        for (let px=0;px<4;px++) for (let py=0;py<4;py++) {
            if(tetromino[state.currentPiece][rotate(px, py, state.currentRotation)]==="x") {
                const i = getIndex(state.currentX + px, state.currentY + py);
                setTex(i, tettex[state.currentPiece]);
            }
        }

        // UI stuff
        // update score
        if(state._lastscore!==state.score) {
            state._lastscore = state.score;
            document.getElementById("score").innerText = state.score;
        }

        if(_lastgameOver!==gameOver) {
            _lastgameOver = gameOver;
            if(gameOver) {
                document.getElementById("gameover").style.visibility = 'visible';
            }else{
                document.getElementById("gameover").style.visibility = 'hidden';
            }
        }

        if(state._lastlevel!==state.level) {
            state._lastgameOver = state.level;
            document.getElementById("level").innerText = state.level;
        }
        
        if(state._lastNextPiece!==state.nextPiece) {
            state._lastNextPiece = state.nextPiece;
            for (let px=0;px<4;px++) for (let py=0;py<4;py++) {
                const i = getIndex(px, py);
                if(tetromino[state.nextPiece][rotate(px, py, 0)]==="x") {
                    nextFieldSprites[i].texture = tettex[state.nextPiece];
                }else{
                    nextFieldSprites[i].texture = tettex[0];
                }
            }
        }

    }


});

function setTex(fi, tex) {
    if(fieldSprites[fi].texture!==tex) {
        fieldSprites[fi].texture = tex;
    }
}

function doesPieceFit(tetrominoIndex, rotation, tx, ty) {
    for (let px=0;px<4;px++) for (let py=0;py<4;py++) {
        const pi = rotate(px, py, rotation);
        const fi = getIndex(tx+px, ty+py);
        if (tetromino[tetrominoIndex][pi] === "x" && field[fi] && field[fi] !== 0 ) {
            return false;
        }
    }
    return true;
}

function rotate(x, y, r) {
    switch (mod(r, 4)){
        case 0: return y * 4 + x;
        case 1: return 12 + y - (x * 4);
        case 2: return 15 - (y * 4) - x;
        case 3: return 3 - y + (x * 4);
    }
    return 0;
}

function getIndex(x, y) {
    return y*fieldW + x;
}

function rndPiece() {
    return Math.floor(Math.random() * 7) + 1;
}
function restartGame() {
    field = [];
    gameOver = false;
    _lastgameOver = null;
    gameLoopAcc = 0;
    gameSpeedAcc = 0;
    gameSpeed = 30;
    lines = [];
    linesCounter = 0;
    pieceCount = 0;
    state = {
        currentPiece: rndPiece(), // 1 -> 7
        nextPiece: rndPiece(),
        _lastNextPiece: null,
        currentRotation: 0,
        currentX: fieldW / 2 - 2,
        currentY: 0,
        score: 0,
        _lastscore: null,
        level: 1,
        _lastlevel: null,
    };
    for (let x = 0; x<fieldW; x++) for (let y = 0; y<fieldH; y++)
    {
        const i = getIndex(x, y);
        field[i] = 0;
        if (x==0 || x==fieldW-1 || y==fieldH-1) {
            field[i] = 9;
        }
    }
    resources['GameStart'].sound.play();
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

const keys = {
    right: false,
    left: false,
    down: false,
    z: false,
    x: false,
};

window.addEventListener('keydown', function (e) {
    if (e.keyCode === 37) keys.left=true;
    if (e.keyCode === 39) keys.right=true;
    if (e.keyCode === 40) keys.down=true;
    if (e.keyCode === 90) if(!e.repeat) keys.z=true;
    if (e.keyCode === 88) if(!e.repeat) keys.x=true;
});

window.addEventListener('keyup', function (e) {
    if (e.keyCode === 37) keys.left=false;
    if (e.keyCode === 39) keys.right=false;
    if (e.keyCode === 40) keys.down=false;
    if (e.keyCode === 90) keys.z=false;
    if (e.keyCode === 88) keys.x=false;
    if (e.keyCode === 82) restartGame();
});

}