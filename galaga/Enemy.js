export default class Enemy {
    constructor(app, assets, type, x, y, ship, ENEMYSPEED = 0.7){
        this.ENEMYSPEED = ENEMYSPEED;
        this.app = app;
        this.ship = ship;
        this.assets = assets;
        this.type = type;

        this.sprite = new PIXI.Sprite(this.assets.beeTextures[this.type][1]);
        this.sprite.anchor.set(0.5);
        this.sprite.x = x;
        this.sprite.y = y;
        this.app.stage.addChild(this.sprite);
        this.dead=false;

        this.explosionSpeed = 3;
        this.timers = {};
    }

    timer(dt, name, interval, delay=0) {
        this.timers[name] = this.timers[name]!==undefined? this.timers[name]+Math.round(dt) : (delay*-1)+Math.round(dt);
        if(this.timers[name]>interval){
            this.timers[name] = 0;
            return true;
        }
        return false;
    }

    circulate(){
        
    }

    update(dt){
        if(!this.dead){

            if( this.timer(dt, 'bee0', 50, -50) ){
                this.sprite.texture = this.assets.beeTextures[this.type][ 0 ];
            }

            if( this.timer(dt, 'bee1', 50, -25) ){
                this.sprite.texture = this.assets.beeTextures[this.type][ 1 ];
            }

        }else{
            if(this.dead<=this.explosionSpeed*5){
                if(this.dead%this.explosionSpeed==0){
                    this.sprite.texture = this.assets.explosionTextures[Math.floor(this.dead/this.explosionSpeed)-1];
                }
            }else if(this.dead>this.explosionSpeed*6){
                this.sprite.visible = false;
                this.sprite.y = -20;
            }
            this.dead++;
        }
    }

    die(){
        this.dead = this.explosionSpeed;
    }

}