import Phaser from "phaser";
import Home from "./scenes/Home";
import Game from "./scenes/Game";
import Level from "./scenes/Level";
import Preload from "./scenes/Preload";
import Ui from "./scenes/Ui";
import { SpinePlugin } from "@esotericsoftware/spine-phaser";
import { initializeGameState } from "./core/state";

class Boot extends Phaser.Scene {

	constructor() {
		super("Boot");
	}

	preload() {

		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {
		initializeGameState();
		this.scene.start("Preload");
	}
}

window.addEventListener('load', function () {
	
	const game = new Phaser.Game({
		width: 720,
		height: 1080,
		backgroundColor: "#000000",
		parent: "game-container",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		physics: {
			default: "arcade",
			arcade: {
				// gravity: { y: 0 },
				debug: false,
			}
		},
		plugins: {
			scene: [
				{ key: "SpinePlugin", plugin: SpinePlugin, mapping: "spine" }
			]
		},
		scene: [Boot, Preload, Home, Level, Game, Ui]
	});

	game.scene.start("Boot");
});
