import { supabase } from "../supabase";
import { AudioPartModel } from "@/model/AudioPart";

export type CreateAudioPartInput = Omit<AudioPartModel, 'id' | 'createdAt' | 'updatedAt'>;


export type UpdateAudioPartInput = Partial<CreateAudioPartInput>;

export const audioPartService = {
    // Create a new audio part
    async create(data: CreateAudioPartInput): Promise<AudioPartModel> {
        const { data: createdAudioPart, error } = await supabase
            .from('audio_parts')
            .insert({
                ...data,
                updatedAt: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating audio part:', error);
            throw new Error(error.message);
        }

        return createdAudioPart;
    },
    // Get all audio parts with pagination
    async getAll(): Promise<AudioPartModel[]> {
        const { data, error } = await supabase
            .from('audio_parts')
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching audio parts:', error);
            throw new Error(error.message);
        }

        return data || [];
    },
    // Update an audio part
    async update(id: string, data: UpdateAudioPartInput): Promise<AudioPartModel> {
        const { data: updatedAudioPart, error } = await supabase
            .from('audio_parts')
            .update({
                ...data,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating audio part:', error);
            throw new Error(error.message);
        }

        return updatedAudioPart;
    },
    // Delete an audio part
    async delete(id: string): Promise<AudioPartModel> {
        const { data: deletedAudioPart, error } = await supabase
            .from('audio_parts')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error deleting audio part:', error);
            throw new Error(error.message);
        }

        if (!deletedAudioPart) {
            throw new Error('Audio part not found or could not be deleted');
        }

        return deletedAudioPart;
    },
    // Toggle publish status
    async togglePublish(id: string): Promise<AudioPartModel> {
        // First, get the current audio part to check its current is_published status
        const { data: currentAudioPart, error: fetchError } = await supabase
            .from('audio_parts')
            .select('is_published')
            .eq('id', id)
            .single();

        if (fetchError || !currentAudioPart) {
            throw new Error('Audio part not found or could not be fetched');
        }

        // Then update with the toggled value
        const { data: updatedAudioPart, error } = await supabase
            .from('audio_parts')
            .update({
                is_published: !currentAudioPart.is_published,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating audio part:', error);
            throw new Error(error.message);
        }

        return updatedAudioPart;
    },

};