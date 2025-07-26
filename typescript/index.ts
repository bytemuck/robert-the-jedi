import { run } from "./jdis";

const token = "rwjfat64";

run(
    () => {
        console.log("New game started!");
    },
    (bot, gameState) => {
        console.clear();
        bot.print();

        return bot.move({ x: 1, y: 1 });
    },
    token,
);
