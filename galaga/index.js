// import enemy from './enemy';
import Ship from './Ship.js';
import Group from './Group.js';
import Background from './Background.js';

const app = new PIXI.Application({ 
        width: 224,         // default: 800
        height: 288,        // default: 600
        antialias: false,    // default: false
        transparent: false, // default: false
        resolution: 1,       // default: 1
        backgroundColor: 0x000,
    }
);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

document.body.appendChild(app.view);

const assets = {
    beeTextures : [
        [
            PIXI.Texture.fromImage("enemies/bee1_1.png"),
            PIXI.Texture.fromImage("enemies/bee1_2.png"),
        ],
        [
            PIXI.Texture.fromImage("enemies/bee2_1.png"),
            PIXI.Texture.fromImage("enemies/bee2_2.png"),
        ],
        [
            PIXI.Texture.fromImage("enemies/bee3_1.png"),
            PIXI.Texture.fromImage("enemies/bee3_2.png"),
        ],
    ],
    explosionTextures : [
        PIXI.Texture.fromImage("explosion/1.png"),
        PIXI.Texture.fromImage("explosion/2.png"),
        PIXI.Texture.fromImage("explosion/3.png"),
        PIXI.Texture.fromImage("explosion/4.png"),
        PIXI.Texture.fromImage("explosion/5.png"),
    ],

};

const bg = new Background(app);

const ship = new Ship(app);
ship.addToStage();

const group = new Group(app, ship, assets);

// const enemy = new Enemy(app, assets, 0, ship);
// const enemies = [
//     new Enemy(app, assets, 0, 80, 80, ship),
//     new Enemy(app, assets, 1, 120, 80, ship),
//     new Enemy(app, assets, 2, 160, 80, ship),
// ];

app.ticker.add(function(dt){

    bg.update(dt);

    ship.update(dt);
    
    ship.bullets[0].update();
    ship.bullets[1].update();

    group.update(dt);

    // enemy.x -= (enemy.x>enemyTargetX?1:-1) * ENEMY_X_SPEED * dt;
    // enemy.y += (enemy.y>enemyTargetY?-1:1) * ENEMY_Y_SPEED * dt;
    // if (enemy.y>app.screen.height){
    //     enemy.y = -100;
    // }

    // enemy movment
    // if (Date.now() > lastEnemyStep + nextEnemyStepInterval){
    //     lastEnemyStep = Date.now();
    //     if(!enemyAtFormation){
    //         enemyTargetX = ship.x; // or formation position
    //         enemyTargetY = app.screen.height; // ///
    //     }else{
    //         enemyTargetX = enemyFormationX; // or formation position
    //         enemyTargetY = enemyFormationY; // ///
    //     }
    // }

});

let holdingFire = false;

window.addEventListener('keydown', function (e) {
    if (e.keyCode === 37) {
        ship.startMovingLeft();
    }
    if (e.keyCode === 39) { 
        ship.startMovingRight();
    }
    if (e.keyCode === 17 && !holdingFire) { 
        ship.fire();
        holdingFire = true;
    }
    if (e.keyCode === 32) {
        // const e = group.enemies.filter(e => e.type===0&&e.dead===false )[0];
        // if(e) {
        //     e.circulate();
        // }
    }
});

window.addEventListener('keyup', function (e) {
    if (e.keyCode === 37) {
        ship.stopMovingLeft();
    }
    if (e.keyCode === 39) { 
        ship.stopMovingRight();
    }
    if (e.keyCode === 17) { 
        holdingFire = false;
    }
});