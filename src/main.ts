import * as Phaser from "phaser";
import Main from "./scenes/main";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [Main],
};

new Phaser.Game(config);
