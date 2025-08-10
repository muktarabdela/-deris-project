import { supabase } from "@/lib/supabase";
import { UserAudioPartProgressModel } from "@/model/UserAudioPartProgress";

export type CreateUserAudioPartProgressInput = Omit<UserAudioPartProgressModel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserAudioPartProgressInput = Partial<CreateUserAudioPartProgressInput>;

const TABLE_NAME = 'user_audio_part_progress';

export const userAudioPartProgressService = {
    // Create a new user audio part progress
    async create(userAudioPartProgress: CreateUserAudioPartProgressInput): Promise<UserAudioPartProgressModel> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(userAudioPartProgress)
            .select()
            .single();

        if (error) {
            console.error('Error creating user audio part progress:', error);
            throw new Error(error.message);
        }

        return data;
    },
    // Get all user audio part progress
    async getAll(): Promise<UserAudioPartProgressModel[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching user audio part progress:', error);
            throw new Error(error.message);
        }

        return data || [];
    },
    // Get a single user audio part progress by ID
    async getById(id: string): Promise<UserAudioPartProgressModel | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching user audio part progress:', error);
            throw new Error(error.message);
        }

        return data;
    },
    // Update a user audio part progress
    async update(id: string, userAudioPartProgress: UpdateUserAudioPartProgressInput): Promise<UserAudioPartProgressModel> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(userAudioPartProgress)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating user audio part progress:', error);
            throw new Error(error.message);
        }

        return data;
    },
    // Delete a user audio part progress
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting user audio part progress:', error);
            throw new Error(error.message);
        }
    },
    // update is_completed
    async updateIsCompleted(id: string, isCompleted: boolean): Promise<UserAudioPartProgressModel> {
        const { data: updatedAudioPart, error } = await supabase
            .from(TABLE_NAME)
            .update({
                is_completed: isCompleted,
                completedAt: new Date().toISOString(),
            })
            .eq('audio_part_id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating audio part:', error);
            throw new Error(error.message);
        }

        return updatedAudioPart;
    },
};