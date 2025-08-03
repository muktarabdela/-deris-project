import { bot } from "./core/bot";
import { registerStartCommand } from "./commands/start";
import { registerFileIdCommand } from "./commands/fileId";

console.log("Bot is starting...");

// Register commands
registerStartCommand(bot);
registerFileIdCommand(bot); // ✅ Register the /file command

// Error handler
bot.catch((err) => {
    console.error("Error in bot:", err);
});

// Start the bot
bot.start();
