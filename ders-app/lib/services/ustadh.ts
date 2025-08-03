import { supabase } from '@/lib/supabase';
import { UstadhModel } from '@/model/Ustadh';

export type CreateUstadhInput = Omit<UstadhModel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUstadhInput = Partial<CreateUstadhInput>;

const TABLE_NAME = 'ustadhs';

export const ustadhService = {
    // Create a new ustadh
    async create(ustadh: CreateUstadhInput): Promise<UstadhModel> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(ustadh)
            .select()
            .single();

        if (error) {
            console.error('Error creating ustadh:', error);
            throw new Error(error.message);
        }

        return data;
    },

    // Get all ustadhs
    async getAll(): Promise<UstadhModel[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching ustadhs:', error);
            throw new Error(error.message);
        }

        return data || [];
    },

    // Get a single ustadh by ID
    async getById(id: string): Promise<UstadhModel | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found
                return null;
            }
            console.error('Error fetching ustadh:', error);
            throw new Error(error.message);
        }

        return data;
    },

    // Update an ustadh
    async update(id: string, updates: UpdateUstadhInput): Promise<UstadhModel> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({
                ...updates,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating ustadh:', error);
            throw new Error(error.message);
        }

        return data;
    },

    // Delete an ustadh
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting ustadh:', error);
            throw new Error(error.message);
        }
    },

    // Search ustadhs by name
    async search(query: string): Promise<UstadhModel[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .ilike('name', `%${query}%`)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error searching ustadhs:', error);
            throw new Error(error.message);
        }

        return data || [];
    },
};