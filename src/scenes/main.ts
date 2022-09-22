import * as Phaser from "phaser";
import ScoreLabel from "../ui/Score";
import BombSpawner from "./BombSpawner";
enum Assets {
  SKY = "sky",
  GROUND = "ground",
  STAR = "star",
  BOMB = "bomb",
  DUDE = "dude",
}
const { DUDE, GROUND, SKY, STAR, BOMB } = Assets;
class Main extends Phaser.Scene {
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  scoreLabel: ScoreLabel | undefined;
  bombSpawner: BombSpawner | undefined;
  stars: Phaser.Physics.Arcade.Group | undefined;
  constructor() {
    super("game-scene");
  }
  preload() {
    this.load.image(SKY, "./assets/sky.png");
    this.load.image(GROUND, "./assets/platform.png");
    this.load.image(STAR, "./assets/star.png");
    this.load.image(BOMB, "./assets/bomb.png");

    this.load.spritesheet(DUDE, "./assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }
  create() {
    this.add.image(400, 300, SKY);
    const platforms = this.createPlatforms();
    this.stars = this.createStars();
    this.player = this.createPlater();
    this.scoreLabel = this.createScoreLabel(16, 18, 0);
    this.bombSpawner = new BombSpawner(this, BOMB);
    const bombsGroup = this.bombSpawner.group;
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.stars, platforms);
    this.physics.add.collider(bombsGroup, platforms);
    this.physics.add.collider(bombsGroup, this.player);
    this.physics.add.collider(bombsGroup, this.stars);
    this.physics.add.collider(bombsGroup, bombsGroup);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStars,
      () => {},
      this
    );
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  update() {
    if (this.cursors?.left.isDown) {
      this.player?.setVelocityX(-160);
      this.player?.anims.play("left", true);
    } else if (this.cursors?.right.isDown) {
      this.player?.setVelocityX(160);
      this.player?.anims.play("right", true);
    } else {
      this.player?.setVelocityX(0);
      this.player?.anims.play("turn");
    }

    if (this.cursors?.up.isDown && this.player?.body.touching.down) {
      this.player.setVelocityY(-330);
    }
    if (this.cursors?.down.isDown && !this.player?.body.touching.down) {
      this.player?.setVelocityY(500);
    }
  }
  createPlatforms() {
    const platforms = this.physics.add.staticGroup();
    const ground_layer = platforms.create(
      400,
      568,
      "ground"
    ) as Phaser.Types.Physics.Arcade.SpriteWithStaticBody;
    ground_layer.setScale(2).refreshBody();

    [
      [600, 400],
      [50, 250],
      [750, 220],
    ].forEach(([x, y]) => {
      platforms.create(x, y, "ground");
    });

    return platforms;
  }

  createStars() {
    const stars = this.physics.add.group({
      key: STAR,
      collideWorldBounds: true,
      repeat: 20,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    stars.children.iterate((child) => {
      (child as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody).setBounceY(
        Phaser.Math.FloatBetween(0.4, 0.8)
      );
    });
    return stars;
  }

  createPlater() {
    const player = this.physics.add.sprite(100, 450, DUDE);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(DUDE, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(DUDE, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: DUDE, frame: 4 }],
      frameRate: 20,
    });

    return player;
  }
  collectStars: ArcadePhysicsCallback = (_p, s) => {
    const star = s as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    this.scoreLabel?.add(10);
    star.disableBody(true, true);
    console.log(this.stars?.countActive(true));
    if (this.stars?.countActive(true) === 0) {
      this.stars.children.iterate((c) => {
        const child = c as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
        const { width } = this.sys.canvas;
        child.enableBody(true, Phaser.Math.Between(0, width), 0, true, true);
      });
    }
    this.bombSpawner?.spawn(this.player?.x || 0);
  };
  createScoreLabel(x: number, y: number, score: number) {
    const label = new ScoreLabel(this, x, y, score, {
      fontSize: "32px",
      color: "#000",
    });
    this.add.existing(label);

    return label;
  }
}

export default Main;
