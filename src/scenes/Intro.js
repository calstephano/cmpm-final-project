class Intro extends Phaser.Scene {
    constructor() {
        super("introScene");
    }

    create() {
        let textConfig = {
            fontFamily: 'FreePixel',
            fontSize: '32px',
            backgroundColor: '#050505',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.skipText = this.add.text(game.config.width/2, game.config.height* 0.94, 'Press X to skip', textConfig).setOrigin(0.5);;
        this.skipText.setDepth(2)
        this.cutscene = [];
        for (let i = 0; i < 3; i++) {
            this.cutscene[i] = this.add.image(0, 0, 'intro' + (i+1)).setOrigin(0); // Using string concatenation to get key names
        }
        this.frame = 0;
        this.cutscene[this.frame].setDepth(1)

        // Progress cutscene
        let timer = this.time.addEvent({
            delay: 3500,
            callback: this.nextFrame,
            callbackScope: this,
            repeat: this.cutscene.length - 1
        });

        // Skip Cutscene button
        let keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        keyX.on('down', () => {
            this.scene.start('door1Scene')
        })
    }

    update() {

    }

    nextFrame() {
        if(this.frame == 0) {
            let dark = this.add.image(0, game.config.height, 'transition').setOrigin(0);
            dark.setDepth(1);
            let timer = this.time.delayedCall(400, () => {
                this.cutscene[this.frame++].setDepth(0);
                this.cutscene[this.frame].setDepth(1);
            }, null, this);
            let transitionTween = this.tweens.add({
                targets: dark,
                ease: 'Expo.easeOut',
                y: { from: game.config.height, to: -game.config.height }, 
                duration: 4000
            })
        } else {
            this.cutscene[this.frame++].setDepth(0);    // Set prev frame behind other frames
            // console.log(this.frame + '/' + (this.cutscene.length))
            if(this.frame >= this.cutscene.length) {
                this.skipText.text = "Press X to continue";
            } else {
                this.cutscene[this.frame].setDepth(1);      // Set new frame on top if there is one
            }
        }
    }
}