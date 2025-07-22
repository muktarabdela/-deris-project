import { bot } from './core/bot';
import { registerStartCommand } from './commands/start';

console.log('Bot is starting...');

// Register all commands
registerStartCommand(bot);

// Error handler
bot.catch((err) => {
  console.error('Error in bot:', err);
});

// Start the bot
bot.start();