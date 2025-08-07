import { supabase } from "../supabase";
import { ShortDersModel } from "@/model/short-ders";

export type CreateShortDersInput = Omit<ShortDersModel, 'id' | 'createdAt' | 'updatedAt' | 'ustadh' | 'category'> & {
    ustadh_id: string;
    category_id: string;
};

export type UpdateShortDersInput = Partial<CreateShortDersInput>;

export const shortDersService = {
    // Create a new short ders
    async create(data: CreateShortDersInput): Promise<ShortDersModel> {
        const { data: createdShortDers, error } = await supabase
            .from('short_derses')
            .insert({
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating short ders:', error);
            throw new Error(error.message);
        }

        return createdShortDers;
    },

    // Get a single short ders by ID
    async getById(id: string): Promise<ShortDersModel | null> {
        const { data, error } = await supabase
            .from('short_derses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found
                return null;
            }
            console.error('Error fetching short ders:', error);
            throw new Error(error.message);
        }

        return data;

    },

    // Get all short derses with pagination
    async getAll(): Promise<ShortDersModel[]> {
        const { data, error } = await supabase
            .from('short_derses')
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching short derses:', error);
            throw new Error(error.message);
        }

        return data || [];
    },

    // Update a short ders
    async update(id: string, data: UpdateShortDersInput): Promise<ShortDersModel> {
        const { data: updatedShortDers, error } = await supabase
            .from('short_derses')
            .update({
                ...data,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating short ders:', error);
            throw new Error(error.message);
        }

        return updatedShortDers;
    },

    // Delete a short ders
    async delete(id: string): Promise<ShortDersModel> {
        const { data: deletedShortDers, error } = await supabase
            .from('short_derses')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error deleting short ders:', error);
            throw new Error(error.message);
        }

        if (!deletedShortDers) {
            throw new Error('Short ders not found or could not be deleted');
        }

        return deletedShortDers;
    },

    // Toggle publish status
    async togglePublish(id: string): Promise<ShortDersModel> {
        // First, get the current short ders to check its current is_published status
        const { data: currentShortDers, error: fetchError } = await supabase
            .from('short_derses')
            .select('is_published')
            .eq('id', id)
            .single();

        if (fetchError || !currentShortDers) {
            throw new Error('Short ders not found or could not be fetched');
        }

        // Then update with the toggled value
        const { data: updatedShortDers, error } = await supabase
            .from('short_derses')
            .update({
                is_published: !currentShortDers.is_published,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating short ders:', error);
            throw new Error(error.message);
        }

        return updatedShortDers;
    },
};