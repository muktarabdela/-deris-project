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
    async markOnboardingComplete(telegramId: number) {
        const { error } = await supabase
            .from(TABLE_NAME)
            .update({ is_onboarding_completed: true, updatedAt: new Date() })
            .eq("telegram_user_id", telegramId.toString());

        if (error) throw error;
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
            // First, get the current user to check existing ders_History
            const { data: userData, error: userError } = await supabase
                .from(TABLE_NAME)
                .select('ders_History')
                .eq('id', userId)
                .single();

            if (userError) {
                console.error('Error fetching user data:', userError);
                throw new Error(userError.message);
            }

            // Initialize ders_History if it doesn't exist
            const currentHistory = userData?.ders_History || [];
            // Add the new dersId if it's not already in the history
            const updatedHistory = currentHistory.includes(dersId)
                ? currentHistory
                : [...currentHistory, dersId];

            const { data: audioParts, error: audioPartsError } = await supabase
                .from('audio_parts')
                .select('id')
                .eq('ders_id', dersId);

            if (audioPartsError) {
                console.error('Error fetching audio parts:', audioPartsError);
                throw new Error(audioPartsError.message);
            }

            if (!audioParts || audioParts.length === 0) {
                console.warn(`Ders with ID ${dersId} has no associated audio parts.`);
            }

            const { error: dersProgressError } = await supabase
                .from('user_ders_progress')
                .insert([
                    {
                        user_id: userId,
                        ders_id: dersId,
                        status: 'IN_PROGRESS',
                        startedAt: new Date().toISOString(),
                        completedAt: null,
                    },
                ]);

            if (dersProgressError) {
                console.error('Error creating user ders progress:', dersProgressError);
                throw new Error(dersProgressError.message);
            }

            if (audioParts && audioParts.length > 0) {
                const newUserAudioPartProgresses = audioParts.map((part) => ({
                    user_id: userId,
                    audio_part_id: part.id,
                    points: 0,
                    is_completed: false,
                    quiz_attempts: 0,
                }));

                const { error: audioProgressError } = await supabase
                    .from('user_audio_part_progress')
                    .insert(newUserAudioPartProgresses);

                if (audioProgressError) {
                    console.error('Error creating user audio part progresses:', audioProgressError);
                    throw new Error(audioProgressError.message);
                }
            }

            // Update both current_ders_id and ders_History
            const { error: updateUserError } = await supabase
                .from(TABLE_NAME)
                .update({
                    current_ders_id: dersId,
                    ders_History: updatedHistory
                })
                .eq('id', userId);

            if (updateUserError) {
                console.error('Error updating user\'s current ders and history:', updateUserError);
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
    async updatePoints(userId: string, points: number) {
        try {
            const { error } = await supabase
                .from(TABLE_NAME)
                .update({ points })
                .eq('id', userId);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating points:', error);
            throw error;
        }
    },
}
