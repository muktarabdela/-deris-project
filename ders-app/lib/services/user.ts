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
                throw new Error(`User upsert failed: ${error.message}`);
            }
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
    async startDers(userId: string, dersId: string): Promise<boolean> {
        try {
            // Step 1: Fetch all audio part IDs for the given ders
            const { data: audioParts, error: audioPartsError } = await supabase
                .from('audio_parts') // Use your actual table name for Audio Parts
                .select('id')
                .eq('ders_id', dersId);

            if (audioPartsError) {
                console.error('Error fetching audio parts:', audioPartsError);
                throw new Error(audioPartsError.message);
            }

            if (!audioParts || audioParts.length === 0) {
                // If there are no audio parts, we still start the ders but log a warning.
                console.warn(`Ders with ID ${dersId} has no associated audio parts.`);
            }

            // Step 2: Create the UserDersProgress record
            const { error: dersProgressError } = await supabase
                .from('user_ders_progress') // Use your actual table name
                .insert([
                    {
                        user_id: userId,
                        ders_id: dersId,
                        status: 'IN_PROGRESS',
                        started_at: new Date().toISOString(),
                    },
                ]);

            if (dersProgressError) {
                console.error('Error creating user ders progress:', dersProgressError);
                throw new Error(dersProgressError.message);
            }

            // Step 3: Create UserAudioPartProgress records for each audio part
            if (audioParts && audioParts.length > 0) {
                const newUserAudioPartProgresses = audioParts.map((part) => ({
                    user_id: userId,
                    audio_part_id: part.id,
                    is_completed: false,
                    quiz_attempts: 0,
                }));

                const { error: audioProgressError } = await supabase
                    .from('user_audio_part_progress') // Use your actual table name
                    .insert(newUserAudioPartProgresses);

                if (audioProgressError) {
                    console.error('Error creating user audio part progresses:', audioProgressError);
                    // Note: In a real-world scenario, you might want to roll back the previous insert here.
                    // Using a database transaction or an RPC function in Supabase is ideal for this.
                    throw new Error(audioProgressError.message);
                }
            }

            // Step 4: Update the user's current_ders_id
            const { error: updateUserError } = await supabase
                .from(TABLE_NAME) // Assuming TABLE_NAME is 'users'
                .update({ current_ders_id: dersId })
                .eq('id', userId);

            if (updateUserError) {
                console.error('Error updating user\'s current ders:', updateUserError);
                throw new Error(updateUserError.message);
            }

            return true;
        } catch (error) {
            console.error('Failed to start ders and initialize progress:', error);
            throw error;
        }
    },
    async updateUserIfNeeded({
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
            // First get the current user data
            const currentUser = await this.getUserByTelegramUserId(id);

            // If no changes detected, return early
            if (currentUser &&
                currentUser.first_name === first_name &&
                currentUser.username === username &&
                currentUser.profile_picture_url === photo_url) {
                return { data: currentUser, updated: false };
            }

            // Only update what's necessary
            const updates: Record<string, any> = {
                updatedAt: new Date()
            };

            if (first_name && currentUser?.first_name !== first_name) {
                updates.first_name = first_name;
            }

            if (username !== undefined && currentUser?.username !== username) {
                updates.username = username;
            }

            if (photo_url !== undefined && currentUser?.profile_picture_url !== photo_url) {
                // Handle photo URL updates - you might want to store multiple photos in an array
                const photoArray = currentUser?.photos || [];
                if (photo_url && !photoArray.includes(photo_url)) {
                    updates.photos = [...new Set([...photoArray, photo_url])];
                }
                updates.profile_picture_url = photo_url;
            }

            const { data, error } = await supabase
                .from(TABLE_NAME)
                .update(updates)
                .eq('telegram_user_id', id.toString())
                .select()
                .single();

            if (error) throw error;

            return { data, updated: true };
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },
}
