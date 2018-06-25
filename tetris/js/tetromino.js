/// <reference path="./pixi.js.d.ts" />

const dirPath = window.location.href.substring(0, window.location.href.lastIndexOf("/"));

const loader = PIXI.loader;

loader.add('GameStart', dirPath + '/snd/SFX_GameStart.ogg');
loader.add('GameOver', dirPath + '/snd/SFX_GameOver.ogg');
loader.add('LevelUp', dirPath + '/snd/SFX_LevelUp.ogg');
loader.add('PieceTouchDown', dirPath + '/snd/SFX_PieceTouchDown.ogg');
loader.add('PieceRotateLR', dirPath + '/snd/SFX_PieceRotateLR.ogg');
loader.add('PieceRotateFail', dirPath + '/snd/SFX_PieceRotateFail.ogg');
loader.add('PieceMoveLR', dirPath + '/snd/SFX_PieceMoveLR.ogg');
loader.add('PieceSoftDrop', dirPath + '/snd/SFX_PieceSoftDrop.ogg');
loader.add('SpecialLineClearDouble', dirPath + '/snd/SFX_SpecialLineClearDouble.ogg');
loader.add('SpecialLineClearSingle', dirPath + '/snd/SFX_SpecialLineClearSingle.ogg');

export const tettex = [];

loader.add('/res/empty.png', dirPath + '/res/empty.png');
loader.add('/res/0.png', dirPath + '/res/0.png');
loader.add('/res/1.png', dirPath + '/res/1.png');
loader.add('/res/2.png', dirPath + '/res/2.png');
loader.add('/res/3.png', dirPath + '/res/3.png');
loader.add('/res/4.png', dirPath + '/res/4.png');
loader.add('/res/5.png', dirPath + '/res/5.png');
loader.add('/res/6.png', dirPath + '/res/6.png');
loader.add('/res/8.png', dirPath + '/res/8.png');
loader.add('/res/brick.png', dirPath + '/res/brick.png');
loader.add('/res/14.png', dirPath + '/res/14.png');
loader.add('/res/15.png', dirPath + '/res/15.png');

loader.load((loader, resources) => {
    tettex[0] = resources['/res/empty.png'].texture;
    tettex[1] = resources['/res/0.png'].texture;
    tettex[2] = resources['/res/1.png'].texture;
    tettex[3] = resources['/res/2.png'].texture;
    tettex[4] = resources['/res/3.png'].texture;
    tettex[5] = resources['/res/4.png'].texture;
    tettex[6] = resources['/res/5.png'].texture;
    tettex[7] = resources['/res/6.png'].texture;
    tettex[8] = resources['/res/8.png'].texture;
    tettex[9] = resources['/res/brick.png'].texture;
    tettex[10] = resources['/res/14.png'].texture;
    tettex[11] = resources['/res/15.png'].texture;
});

export const tetromino = [];

tetromino[1] ="..x.";
tetromino[1]+="..x.";
tetromino[1]+="..x.";
tetromino[1]+="..x.";

tetromino[2] ="..x.";
tetromino[2]+=".xx.";
tetromino[2]+=".x..";
tetromino[2]+="....";

tetromino[3] =".x..";
tetromino[3]+=".xx.";
tetromino[3]+="..x.";
tetromino[3]+="....";

tetromino[4] ="..x.";
tetromino[4]+=".xx.";
tetromino[4]+="..x.";
tetromino[4]+="....";

tetromino[5] ="....";
tetromino[5]+=".xx.";
tetromino[5]+="..x.";
tetromino[5]+="..x.";

tetromino[6] ="....";
tetromino[6]+=".xx.";
tetromino[6]+=".x..";
tetromino[6]+=".x..";

tetromino[7] ="....";
tetromino[7]+=".xx.";
tetromino[7]+=".xx.";
tetromino[7]+="....";

