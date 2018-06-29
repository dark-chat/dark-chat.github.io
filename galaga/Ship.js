import Bullet from './Bullet.js';

export default class Ship {
    constructor(app, SHIPSPEED = 1.7){
        this.SHIPSPEED = SHIPSPEED;
        this.app = app;
        this.sprite = PIXI.Sprite.fromImage('ship.png');
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.app.screen.width / 2;
        this.sprite.y = this.app.screen.height - (16+7);
        this.moveShipLeft = 0;
        this.moveShipRight = 0;
        this.bullets = [new Bullet(app, this, 'bullet1.png'), new Bullet(app, this, 'bullet2.png')];
    }

    fire(){
        const fired = this.bullets[0].fire();
        if (!fired) this.bullets[1].fire();
    }

    addToStage(){
        this.app.stage.addChild(this.sprite);
    }

    update(dt){
        let playerNewX = this.sprite.x;
        playerNewX -= this.moveShipLeft * this.SHIPSPEED * dt;
        playerNewX += this.moveShipRight * this.SHIPSPEED * dt;
        if(playerNewX<this.app.screen.width-15 && playerNewX>0){
            this.sprite.x = playerNewX;
        }
    }

    startMovingLeft(){
        this.moveShipLeft = 1;
    }

    startMovingRight(){
        this.moveShipRight = 1;

        

    }

    stopMovingLeft(){
        this.moveShipLeft = 0;
    }

    stopMovingRight(){
        this.moveShipRight = 0;
    }

}