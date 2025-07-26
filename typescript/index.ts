import { run, type CardinalDirection, type Direction, type GameState, type InventoryItem } from "./jdis";
import type { createBot } from "./jdis/bot";

const token = "rwjfat64";
const MAP_SIZE = 50;

type DirectionNumber = {x:  -1 | 0 | 1, y: -1 | 0 | 1}

function move(bot: ReturnType<typeof createBot>, gameState: GameState, direction: DirectionNumber) {
    const x = clamp(gameState.player.position.x + direction.x, 0, MAP_SIZE)
    const y = clamp(gameState.player.position.y + direction.y, 0, MAP_SIZE)  

    return bot.move({ x, y });
}

function clamp(v: number, min: number, max: number) {
    return Math.min(Math.max(v, min), max)
}

function getRunDirection(bot: ReturnType<typeof createBot>, gameState: GameState): DirectionNumber {
    let direction = gameState.ground.data.reduce((previous, _, index) => {
        if (gameState.ground.data[index] === "firewall" || gameState.enemies[index]) {
                const y = index / 7;
                const x = index % 7;

                return { x: previous.x - (x - 4), y: previous.y - (y - 4) }
        } else return previous
    }, { x: 0, y: 0 });

    if (direction.x === 0 && direction.y === 0) {
        const xy = gameState.player.position;
        direction = ({ x: -(64 - xy.x), y: -(64 - xy.y) })
    }

    console.log(direction)

    return { x: clamp(direction.x, -1, 1), y: clamp(direction.y, -1, 1) } as DirectionNumber
}

function getRandomCell(bot: ReturnType<typeof createBot>, gameState: GameState, direction: DirectionNumber) {
    for (let j = -1; j <= + 1; j++) {
        for (let i = -1; i <= +1; i++) {
            const cell = gameState.ground.data[(j + 3) * 7 + i + 3];

            console.log(`found at ${cell} ${i} ${j}`);

            if (cell === "pcb") {
                return { 
                    x: i,
                    y: j,
                }
            }
        }
    }
}

run(
    () => {
        console.log("New game started!");
    },
    (bot, gameState) => {
        // console.clear();
        bot.print();
 
        const direction = getRunDirection(bot, gameState);
        const cell = gameState.ground.data[(direction.y + 3) * 7 + direction.x + 3];
   
        if (cell !== "pcb" && cell !== "groundPlane") {
            return move(bot, gameState, getRandomCell(bot, gameState, direction) as DirectionNumber);
        }
        
        return move(bot, gameState, direction);
    },
    token,
);