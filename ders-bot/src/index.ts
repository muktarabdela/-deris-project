import { bot } from "./core/bot";
import { registerStartCommand } from "./commands/start";
import { registerFileIdCommand } from "./commands/fileId";

async function setupBot() {
    console.log("Setting up bot commands...");

    // Set the commands that will appear in the menu
    await bot.api.setMyCommands([
        { command: "start", description: "🚀 Start the Deris app" },
        { command: "file", description: "🆔 Get a file_id from an audio" },
    ]);

    console.log("Bot commands have been set.");

    // Register command handlers
    registerStartCommand(bot);
    registerFileIdCommand(bot);

    // Error handler
    bot.catch((err) => {
        console.error("Error in bot:", err);
    });
}

async function startBot() {
    console.log("Bot is starting...");
    await bot.start();
    console.log("Bot started successfully!");
}

// Set up and then start the bot
setupBot().then(startBot);