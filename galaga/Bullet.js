export default class Bullet {
    constructor(app, ship, image, BULLETSPEED = 6){
        this.app = app;
        this.BULLETSPEED = BULLETSPEED;
        this.ship = ship;
        this.sprite = PIXI.Sprite.fromImage(image);
        this.sprite.anchor.set(0.5);
        this.sprite.y=-10;
        this.app.stage.addChild(this.sprite);
        this.active=false;
    }

    fire(){
        if (!this.active){
            this.sprite.x = this.ship.sprite.x;
            this.sprite.y = this.ship.sprite.y;
            this.active=true;
            return true;
        }
        return false;
    }

    update(){
        if (this.sprite.y<0-8){
            this.active=false;
        }
        if(this.active){
            this.sprite.y-=this.BULLETSPEED;
        }
    }

    collide(enemy){
        if (this.active){
            if(!enemy.dead && bump.hit(this.sprite, enemy.sprite)){
                this.sprite.y=-10;
                this.active=false;
                return true;
            }
        }
        return false;
    }

}