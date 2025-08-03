import { Bot, Context } from "grammy";
// import { isAudioMessage } from "grammy-guard";

// Register the `/file` command
export const registerFileIdCommand = (bot: Bot) => {
    // Step 1: User triggers `/file`
    bot.command("file", async (ctx) => {
        await ctx.reply("📤 Please forward any *Telegram* audio or voice message to get its file ID.", {
            parse_mode: "Markdown",
        });
    });

    // Step 2: Listen for forwarded audio/voice messages
    bot.on("message:audio", async (ctx) => {
        const fileId = ctx.message.audio.file_id;

        console.log("🎧 Audio file_id:", fileId);

        await ctx.reply(
            `✅ *Audio received!*\n\n📁 *file_id:*\n\`${fileId}\``,
            { parse_mode: "Markdown" }
        );
    });

    bot.on("message:voice", async (ctx) => {
        const fileId = ctx.message.voice.file_id;

        console.log("🎤 Voice file_id:", fileId);

        await ctx.reply(
            `✅ *Voice message received!*\n\n📁 *file_id:*\n\`${fileId}\``,
            { parse_mode: "Markdown" }
        );
    });
};
