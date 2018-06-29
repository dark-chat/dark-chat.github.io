import Enemy from './Enemy.js';

export default class Group {
    constructor(app, ship, assets){
        this.ship = ship;

        const formation = [
            "0003333000",
            "0222222220",
            "0222222220",
            "1111111111",
            "1111111111",
        ];

        const startX = 40;
        const startY = 60;
        // const startX = -80;
        // const startY = 3;

        const hPadding = 3;
        const vPadding = 3;

        let beeWidth = 13;
        let beeHeight = 12;
        const otherBeeHeight = 10;

        let beeX = startX;
        let beeY = startY;

        this.enemies = [];

        this.seats = [];

        for( const line of formation) 
        {
            for(const e of line.split("")) {
                if(Number(e)!==0){
                    this.seats.push( {x: beeX, y: beeY } );
                    this.enemies.push( new Enemy(app, assets, Number(e)-1, this.seats[this.seats.length-1].x, this.seats[this.seats.length-1].y, ship) );
                }
                beeX += beeWidth + hPadding;
            }
            beeX = startX;
            beeY += beeHeight + vPadding;
            beeHeight = otherBeeHeight;
        }
        // console.table(this.seats);
        this.growCounter = 0;
        this.growMul = 1.0033;
        this.grow = true;
    }

    update(dt) {
        this.growCounter++;
        if( this.growCounter === 122 ) {
            this.growCounter = 0;
            this.grow=!this.grow;
        }

        for( let c=0; c<this.seats.length; c++){
            // this.seats[c].x += 1;
            this.enemies[c].sprite.x -= 112;
            this.enemies[c].sprite.y -= 60;

            if( this.grow ){
                this.enemies[c].sprite.x *= this.growMul;
                this.enemies[c].sprite.y *= this.growMul;
            }else{
                this.enemies[c].sprite.x /= this.growMul;
                this.enemies[c].sprite.y /= this.growMul;
            }

            this.enemies[c].sprite.x += 112;
            this.enemies[c].sprite.y += 60;
        }
        this.enemies.forEach( enemy => {
            
            enemy.update(dt);

            const enemyIsHit = this.ship.bullets[0].collide(enemy) || this.ship.bullets[1].collide(enemy);
            if(enemyIsHit){
                enemy.die();
            }

        });


    }

}