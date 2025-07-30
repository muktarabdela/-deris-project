// lib/services/users/userService.ts (or lib/api.ts)

import { supabase } from "@/lib/supabase";
import { UserModel } from "@/model/user";

const TABLE_NAME = 'users';
export const userService = {

    async upsertTelegramUser({
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
            const { data, error } = await supabase.from(TABLE_NAME).upsert(
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
    },

    // create a function to get user by id
    async getUserByTelegramUserId(telegramUserId: number) {
        try {
            const { data, error } = await supabase
                .from(TABLE_NAME)
                .select("*")
                .eq("telegram_user_id", telegramUserId)
                .single();
            if (error) {
                console.error("Supabase Select Error:", error);
                throw new Error(`User select failed: ${error.message}`);
            }
            return data;
        } catch (err) {
            console.error("Error during user select:", err);
            throw err;
        }
    },
    async getAll(): Promise<UserModel[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('first_name', { ascending: true });

        if (error) {
            console.error('Error fetching users:', error);
            throw new Error(error.message);
        }

        return data || [];
    },
    async delete(id: string) {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .delete()
                .eq('id', id);
            if (error) {
                console.error('Error deleting user:', error);
                throw new Error(error.message);
            }
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },
    async startDers(id: string, derId: string) {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .update({ current_ders_id: derId })
                .eq('id', id);
            if (error) {
                console.error('Error starting ders:', error);
                throw new Error(error.message);
            }
            return true;
        } catch (error) {
            console.error('Error starting ders:', error);
            throw error;
        }
    },
}

