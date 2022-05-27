class Level2 extends Phaser.Scene {
    constructor() {
        super("level2Scene");
    }

    preload() {
        // Add enemy images/atlases here
        this.load.image('enemy1', './assets/tempEnemy1.png');
        this.load.image('enemy2', './assets/tempEnemy2.png');
        this.load.image('bullet', './assets/Square.png');
        this.load.image('darkness', './assets/darkness.png')

        // Tilemap
        this.load.tilemapTiledJSON('level2_map', './assets/level2.json');
        this.load.spritesheet('level2tiles', './assets/iceTiles.png', {
            frameWidth: 64,
            frameHeight: 64,
            spacing: 1
        });
        // Sanity Check
        // this.load.image('tile2test', './assets/iceTiles.png')
    }

    create() {
        this.doorSFX = this.sound.add('doorEnter');
        const map = this.add.tilemap('level2_map');
        const tileset = map.addTilesetImage('iceTiles', 'level2tiles');
        const groundLayer = map.createLayer('Ground', tileset);
        const entranceLayer = map.createLayer('Entrance', tileset);
        const TopWallsLayer = map.createLayer('TopWalls', tileset);
        let p1Spawn = map.findObject("Objects", obj => obj.name === "playerSpawn");


        // Add enemy groups
        this.EGroups = new EnemyGroups(this, 'enemy1', 'enemy2', 'bullet');
        this.EGroups.addEnemyGroups();

        // get basic enemy object array from tilemap Objects layer
        let BasicEnemyObjects = map.filterObjects("Objects", obj => obj.name === "basicEnemy");
        // get enemy object array from tilemap Objects layer
        let RangedEnemyObjects = map.filterObjects("Objects", obj => obj.name === "rangedEnemy");

        // set up player
        this.p1 = new Player(this, p1Spawn.x, p1Spawn.y, "idleAtlas", 'IdleDown_0001', true);
        this.p1.setupCombat(true);

        // Create lower walls + collisions for both top and bottom walls
        const BottomWallsLayer = map.createLayer('Walls', tileset);
        TopWallsLayer.setCollisionByProperty({ 
            collides: true 
        });
        this.physics.add.collider(this.p1, TopWallsLayer);
        BottomWallsLayer.setCollisionByProperty({ 
            collides: true 
        });
        this.physics.add.collider(this.p1, BottomWallsLayer);

        // Add enemy
        BasicEnemyObjects.map((element) => {
            this.EGroups.addBasicEnemy(element.x, element.y, this.p1, 400, 200);
        })
        RangedEnemyObjects.map((element) => {
            this.EGroups.addRangedEnemy(element.x, element.y, this.p1, 600, 200);
        })
        
        //this.cameras.main.setBounds(0, 0, map.width, map.height);
        this.cameras.main.startFollow(this.p1, true, 0.1, 0.1);

        // Only call scene change exactly once on entrance
        this.inEntrance = false;
        this.physics.add.overlap(this.p1, entranceLayer, ()=> {
            if (!this.inEntrance) {
                this.inEntrance = true
                this.doorSFX.play();
                this.scene.start('door3Scene');
            }
        }, this.checkOverlap, this);
        
        // Set up keyboard controls for player
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Test that the walls actualy have collision
        // const debugGraphics = this.add.graphics().setAlpha(0.75);
        // wallsLayer.renderDebug(debugGraphics, {
        //     tileColor: null,    // color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),    // color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255)                // color of colliding face edges
        // });
    }

    update() {
        if(!this.gameOver) {
            this.p1.update();
            // this.darkness.x = this.playertest.x;
            // this.darkness.y = this.playertest.y;
            // this.darkness2.x = this.playertest.x;
            // this.darkness2.y = this.playertest.y;
            // this.darkness3.x = this.playertest.x;
            // this.darkness3.y = this.playertest.y;
            // this.darkness4.x = this.playertest.x;
            // this.darkness4.y = this.playertest.y;
        }
        if(this.p1.health == 0 && !this.gameOver) {
            this.gameOver = true;
            this.p1.kill();
            this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'YOU DIED\nPress R to return').setScrollFactor(0);
        }
        if(this.EGroups.noneAlive() && !this.gameOver) {
            this.gameOver = true;
            this.p1.kill();
            this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'YOU WIN\nPress R to return').setScrollFactor(0);
        }
        if(this.gameOver){
            if (Phaser.Input.Keyboard.JustDown(keyR)) {
                this.scene.start('titleScene');
            }
        }
    }

    checkOverlap(p1, tile){
        if(tile.index == -1) return false;
        return true;
    }

}