import { run, type CardinalDirection, type Direction, type GameState, type InventoryItem } from "./jdis";
import type { createBot } from "./jdis/bot";

const token = "rwjfat64";

type DirectionNumber = {x:  -1 | 0 | 1, y: -1 | 0 | 1}

function move(bot: ReturnType<typeof createBot>, gameState: GameState, direction: DirectionNumber) {
    const x = clamp(gameState.player.position.x + direction.x, 0, 125)
    const y = clamp(gameState.player.position.y + direction.y, 0, 125)
    //if ()    

    return bot.move({ x: clamp(gameState.player.position.x + direction.x, 0, 125), y: clamp(gameState.player.position.y + direction.y, 0, 125) });
}

function clamp(v: number, min: number, max: number) {
    return Math.min(Math.max(v, min), max)
}

function getDirection(x: -1 | 0 | 1, y: -1 | 0 | 1): CardinalDirection {
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
        const direction: DirectionNumber = ({ x: -(64 - xy.x), y: -(64 - xy.y) }) as DirectionNumber
        const directionClamped: DirectionNumber = ({ x: Math.min(Math.max(direction.x, -1), 1), y: Math.min(Math.max(direction.y, -1), 1) }) as DirectionNumber
        const directionOne = { 
            x: (gameState.player.position.x + directionClamped.x > 0 || gameState.player.position.x + directionClamped.x > 125) && Math.abs(direction.x) > Math.abs(direction.y) ? direction.x : 0, 
            y: (gameState.player.position.y + directionClamped.y > 0 || gameState.player.position.y + directionClamped.y > 125) && Math.abs(direction.y) > Math.abs(direction.x) ? direction.y : 0 
        }
        const directionOneClamped: DirectionNumber = ({ x: Math.min(Math.max(directionOne.x, -1), 1), y: Math.min(Math.max(directionOne.y, -1), 1) }) as DirectionNumber

        const cell = bot.getGlobalCell({ x: clamp(gameState.player.position.x + directionClamped.x, 0, 125), y: clamp(gameState.player.position.y + directionClamped.y, 0, 125) })

        console.log(cell)
        console.log(direction)
        console.log(directionOneClamped)


        if (cell === "resistance") {
            if (gameState.player.position.x === gameState.player.lastPosition.x && gameState.player.position.y === gameState.player.lastPosition.y)
                return bot.phase(getDirection(directionOneClamped.x, directionOneClamped.y))
            else 
                return bot.phase(getDirection(directionOneClamped.y, directionOneClamped.x))
            


            // return bot.useItemProjectile(gameState.player.inventory[0] as Extract<InventoryItem, {
            //     type: "projectile";
            // }>, getDirection(directionClamped.x, directionClamped.y));
        }

        if (cell === "chest") {
            return bot.openChest(directionClamped);
        }


        // if (cell !== "groundPlane" && cell !== "chest") {
        //     return bot.useItemProjectile(gameState.player.inventory[0] as Extract<InventoryItem, {
        //         type: "projectile";
        //     }>, getDirection(directionClamped.x, directionClamped.y));
        // }

        return move(bot, gameState, directionClamped);
    },
    token,
);