class BombSpawner {
  scene: Phaser.Scene;
  key = "bombkey";
  group: Phaser.Physics.Arcade.Group;
  constructor(scene: Phaser.Scene, key = "bombkey") {
    this.scene = scene;
    this.key = key;
    this.group = this.scene.physics.add.group();
  }

  spawn(playerX = 0) {
    const x =
      playerX < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 800);
    const bomb = this.group.create(
      x,
      16,
      this.key
    ) as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    return bomb;
  }
}

export default BombSpawner;
