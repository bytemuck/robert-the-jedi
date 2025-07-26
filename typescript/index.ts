import { run, type Direction, type GameState, type InventoryItem } from "./jdis";
import type { createBot } from "./jdis/bot";

const token = "rwjfat64";

type DirectionNumber = {x:  -1 | 0 | 1, y: -1 | 0 | 1}

function move(bot: ReturnType<typeof createBot>, gameState: GameState, direction: DirectionNumber) {
    return bot.move({ x: gameState.player.position.x + direction.x, y: gameState.player.position.y + direction.y });
}

function getDirection(x: -1 | 0 | 1, y: -1 | 0 | 1) {
    if (x == -1 && y == 0) return "left";
    if (x == 1 && y == 0) return "right";
    if (x == 0 && y == 1) return "down";
    if (x == 0 && y == -1) return "up";

    return "left";
}

run(
    () => {
        console.log("New game started!");
    },
    (bot, gameState) => {
        console.clear();
        bot.print();
        console.log(gameState.ground.data);

        const xy = gameState.player.position;
        const direction: DirectionNumber = ({ x: Math.min(Math.max(64 - xy.x, -1), 1), y: Math.min(Math.max(64 - xy.y, -1), 1) }) as DirectionNumber

        const cell = bot.getGlobalCell({ x: gameState.player.position.x + direction.x, y: gameState.player.position.y + direction.y })
        if (cell === "resistance") {
            console.log("phase time")
            return bot.phase(getDirection(direction.x, direction.y))
        }

        if (cell !== "groundPlane" && cell !== "chest") {
            bot.useItemProjectile(gameState.player.inventory[0] as Extract<InventoryItem, {
                type: "projectile";
            }>, getDirection(direction.x, direction.y));
        }

        return move(bot, gameState, direction);
    },
    token,
);