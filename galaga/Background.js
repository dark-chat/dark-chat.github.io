export default class Background {
    constructor(app){
        this.textures = [
            PIXI.Texture.fromImage('bg/1.png'),
            PIXI.Texture.fromImage('bg/2.png'),
            PIXI.Texture.fromImage('bg/3.png'),
            PIXI.Texture.fromImage('bg/4.png'),
            PIXI.Texture.fromImage('bg/5.png'),
        ];
        this.tilingSprite = new PIXI.extras.TilingSprite(
            this.textures[0],
            224,
            267,
        );
        this.tilingSprite.y = 10;
        app.stage.addChild(this.tilingSprite);

        this.counter = 0;
    }

    update(dt) {
        this.counter+=0.1;
        if(this.counter>5) this.counter=0;

        this.tilingSprite.texture = this.textures[Math.floor(this.counter)];
        this.tilingSprite.tilePosition.y += 1 * dt;
    }

}