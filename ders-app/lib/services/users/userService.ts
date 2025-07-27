// lib/services/users/userService.ts (or lib/api.ts)

import { supabase } from "@/lib/supabase";

export async function upsertTelegramUser({
	id,
	first_name,
	username,
	photo_url,
}: {
	id: number;
	first_name: string;
	username?: string;
	photo_url?: string;
}) {
	try {
		console.log("Upserting user:", { id, first_name, username, photo_url });
		const telegramUserIdString = id.toString();

        // FIX: Ensure the table name exactly matches your database.
        // Your screenshot shows "User" (singular).
		const { data, error } = await supabase.from("users").upsert(
			{
				telegram_user_id: telegramUserIdString,
				first_name,
				username,
				profile_picture_url: photo_url,
				role: "STUDENT",
				points: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
			},
			{ onConflict: "telegram_user_id" }
		);

		if (error) {
			console.error("Supabase Upsert Error:", error);
            // This is the line causing the "undefined" message if error.message is empty
			throw new Error(`User upsert failed: ${error.message}`);
		}

		console.log("User upsert successful:", data);
		return data;
	} catch (err) {
		console.error("Error during user upsert:", err);
		throw err;
	}
}