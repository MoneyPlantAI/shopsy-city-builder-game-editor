// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import { playSound } from "../core/audio";
import { gameState, resetBlockRunState, DroppedBlockSprite } from "../core/state";
import { LEVELS } from "../data/levels";
/* END-USER-IMPORTS */

export default class Game extends Phaser.Scene {

	constructor() {
		super("Game");

		/* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// bgGame1
		const bgGame1 = this.add.image(360, 540, "bg-game1");

		// bgGame2
		const bgGame2 = this.add.image(360, -540, "bg-game2");

		// bgGame3a
		const bgGame3a = this.add.image(360, -1620, "bg-game3");

		// bgGame3b
		const bgGame3b = this.add.image(360, -2700, "bg-game3");

		// blockBottom
		const blockBottom = this.add.image(360, 866, "block-bottom");

		// blockTop
		const blockTop = this.add.sprite(160, 120, "block");

		// claw
		const claw = this.add.sprite(160, 0, "claw1");

		// collideFx
		const collideFx = this.add.sprite(-300, -300, "anim-collide");
		collideFx.visible = false;

		this.bgGame1 = bgGame1;
		this.bgGame2 = bgGame2;
		this.bgGame3a = bgGame3a;
		this.bgGame3b = bgGame3b;
		this.blockBottom = blockBottom;
		this.blockTop = blockTop;
		this.claw = claw;
		this.collideFx = collideFx;

		this.events.emit("scene-awake");
	}

	private bgGame1!: Phaser.GameObjects.Image;
	private bgGame2!: Phaser.GameObjects.Image;
	private bgGame3a!: Phaser.GameObjects.Image;
	private bgGame3b!: Phaser.GameObjects.Image;
	private blockBottom!: Phaser.GameObjects.Image;
	private blockTop!: Phaser.GameObjects.Sprite;
	private claw!: Phaser.GameObjects.Sprite;
	private collideFx!: Phaser.GameObjects.Sprite;

	/* START-USER-CODE */

    private moveTo: "left" | "right" = "left";
    private val = 0;
    private oscillating = 0;

    update(): void {
        if (this.moveTo === "left") {
            if (this.val > -20) {
                this.val -= 1;
            } else {
                this.moveTo = "right";
            }
        } else if (this.val < 20) {
            this.val += 1;
        } else {
            this.moveTo = "left";
        }

        gameState.blocks.forEach((block) => {
            if (!block.dropped) {
                return;
            }
            block.x += this.moveTo === "left" ? -this.oscillating : this.oscillating;
        });
    }

    create(): void {
        this.editorCreate();

        resetBlockRunState();
        this.scene.launch("Ui");

        this.oscillating = 0;
        this.claw.setDepth(1);

        let targetDropY = 726;
        const targetYIncrement = 94;
        const maxToleranceX = 80;
        let currentPoints = 0;
        let lastBlock = false;

        const maxBlock = LEVELS[gameState.currentLevel].blockAmount;
        const requiredPoints = LEVELS[gameState.currentLevel].pointRequired;

        const oscillatingBreakpoints: Array<[number, number]> = [
            [10, 0.2],
            [20, 0.4],
            [30, 0.8],
            [36, 1.2]
        ];

        if (!this.anims.exists("collide")) {
            this.anims.create({
                key: "collide",
                frames: this.anims.generateFrameNumbers("anim-collide"),
                frameRate: 10
            });
        }

        this.tweens.add({
            targets: this.blockTop,
            x: this.blockTop.x + 400,
            duration: 1500,
            ease: "Sine.easeInOut",
            yoyo: true,
            onUpdate: () => {
                this.claw.x = this.blockTop.x;
            },
            repeat: -1
        });

        let spineGood: any;
        let spinePerfect: any;

        const spineFactory = this.add as Phaser.GameObjects.GameObjectFactory & {
            spine: (x: number, y: number, dataKey: string, atlasKey: string) => any;
        };

        const ensureSpine = (type: "good" | "perfect"): any => {
            if (type === "good") {
                if (!spineGood) {
                    spineGood = spineFactory.spine(-400, -400, "good", "good-atlas");
                    spineGood.setDepth(1);
                    spineGood.setVisible(false);
                }
                return spineGood;
            }

            if (!spinePerfect) {
                spinePerfect = spineFactory.spine(-400, -400, "perfect", "perfect-atlas");
                spinePerfect.setDepth(1);
                spinePerfect.setVisible(false);
            }
            return spinePerfect;
        };

        this.input.off("pointerdown");
        this.input.on("pointerdown", () => {
            if (!this.blockTop.visible) {
                return;
            }
            this.blockTop.setVisible(false);
            this.claw.setTexture("claw2");
            dropTheBlock();
        });

        const dropTheBlock = (): void => {
            const key = gameState.blocks.length >= maxBlock - 1 ? "block-top" : "block";
            lastBlock = key === "block-top";

            const block = this.add.sprite(this.blockTop.x, this.blockTop.y, key) as DroppedBlockSprite;

            if (!isColliding()) {
                targetDropY = this.blockTop.y + 1080 + 200;
                this.tweens.add({
                    targets: block,
                    y: targetDropY,
                    duration: 900,
                    ease: "Sine.easeIn",
                    onComplete: () => this.events.emit("gameover")
                });
                return;
            }

            gameState.blocks.push(block);
            this.tweens.add({
                targets: block,
                y: targetDropY,
                duration: 600,
                ease: "Sine.easeIn",
                onComplete: () => {
                    playSound(this, "hit");
                    this.cameras.main.shake(150, 0.004);
                    gameState.totalStackedBlocks++;

                    const distance = getXDistance();
                    if (distance !== null && distance <= maxToleranceX) {
                        showCollideAnimation(block.x, block.y + 60);
                        if (lastBlock) {
                            playSound(this, "positive");
                            this.time.delayedCall(2000, () => buildingFinish());
                        } else {
                            targetDropY -= targetYIncrement;
                            scrollUp();
                        }

                        block.dropped = true;
                        getDropScore();

                        oscillatingBreakpoints.forEach(([count, amount]) => {
                            if (gameState.blocks.length === count) {
                                this.oscillating = amount;
                            }
                        });
                    } else {
                        blockToppling();
                    }

                    this.events.emit("update-block-amount", maxBlock - gameState.blocks.length);
                }
            });
        };

        const isColliding = (): boolean => {
            if (gameState.blocks.length < 2) {
                return true;
            }
            const distance = getXDistance();
            return distance !== null && distance < this.blockTop.displayWidth - 5;
        };

        const scrollUp = (): void => {
            let minusY = targetYIncrement;
            const latest = gameState.blocks[gameState.blocks.length - 1];
            if (latest && latest.y - this.blockTop.y > 500) {
                minusY = 0;
            }

            this.tweens.add({
                targets: this.claw,
                y: this.claw.y - minusY,
                duration: 300,
                ease: "Sine.easeInOut"
            });

            this.tweens.add({
                targets: this.cameras.main,
                scrollY: this.cameras.main.scrollY - minusY,
                duration: 300,
                ease: "Sine.easeInOut",
                onComplete: () => {
                    this.blockTop.y -= minusY;
                    this.blockTop.setVisible(true);
                    if (LEVELS[gameState.currentLevel].blockAmount - gameState.totalStackedBlocks === 1) {
                        this.blockTop.setTexture("block-top");
                    }
                    this.claw.setTexture("claw1");
                }
            });
        };

        const getXDistance = (): number | null => {
            if (gameState.blocks.length === 0) {
                return null;
            }
            if (gameState.blocks.length >= 2) {
                const prev = gameState.blocks[gameState.blocks.length - 2];
                const cur = gameState.blocks[gameState.blocks.length - 1];
                return Phaser.Math.Distance.Between(prev.x, 0, cur.x, 0);
            }
            const cur = gameState.blocks[gameState.blocks.length - 1];
            return Phaser.Math.Distance.Between(360, 0, cur.x, 0);
        };

        const getDropScore = (): void => {
            const distance = getXDistance();
            if (distance === null || distance > maxToleranceX) {
                return;
            }

            const calculatedScore = Math.ceil((1 - distance / maxToleranceX) * 50);
            currentPoints += calculatedScore;
            this.events.emit("update-score", { curPoints: currentPoints, added: calculatedScore });

            if (distance <= 3) {
                showQualityTxt("perfect");
            } else if (distance <= 10) {
                showQualityTxt("good");
            }
        };

        const blockToppling = (): void => {
            playSound(this, "fall");
            const previousX = gameState.blocks.length >= 2
                ? gameState.blocks[gameState.blocks.length - 2].x
                : 360;
            const current = gameState.blocks[gameState.blocks.length - 1];

            this.tweens.add({
                targets: current,
                y: this.cameras.main.scrollY + 1080 + 200,
                duration: 1200,
                ease: "Sine.easeIn",
                onComplete: () => this.events.emit("gameover")
            });

            const rotateLeft = current.x < previousX;
            this.tweens.add({
                targets: current,
                rotation: rotateLeft ? -3 : 3,
                x: current.x + (rotateLeft ? -180 : 180),
                duration: 1200,
                ease: "Sine.easeOut"
            });
        };

        const showCollideAnimation = (x: number, y: number): void => {
            this.collideFx.setVisible(true);
            this.collideFx.setPosition(x, y);
            this.collideFx.play("collide");
        };

        const showQualityTxt = (type: "good" | "perfect"): void => {
            playSound(this, type);
            const spine = ensureSpine(type);
            spine.setVisible(true);
            spine.x = 360;
            spine.y = this.cameras.main.scrollY + 540;
            if (spine.animationState && spine.animationState.setAnimation) {
                spine.animationState.setAnimation(0, "animation", false);
            }
        };

        const buildingFinish = (): void => {
            if (currentPoints >= requiredPoints) {
                this.events.emit("completed");
            } else {
                this.events.emit("gameover");
            }
        };
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
