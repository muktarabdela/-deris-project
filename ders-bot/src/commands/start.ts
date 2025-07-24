import { Bot, InlineKeyboard } from "grammy";

export const registerStartCommand = (bot: Bot) => {
	bot.command("start", (ctx) => {
		const webAppUrl = process.env.WEB_APP_URL;
		if (!webAppUrl) {
			return ctx.reply("Sorry, the app is currently unavailable.");
		}

		const keyboard = new InlineKeyboard().webApp(
			"🕋 Start Learning",
			"https://34339fa03e3d.ngrok-free.app"
		);

		ctx.reply(
			"**Welcome to ደርስ (Deris)!**\n\nYour journey to structured Islamic learning begins here. Press the button below to open the app.",
			{
				parse_mode: "Markdown",
				reply_markup: keyboard,
			}
		);
	});
};
