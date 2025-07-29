import { prisma } from '@/lib/prisma';
import { Ders } from '@/src/generated/prisma';
import { supabase } from '../supabase';

export type CreateDersInput = Omit<Ders, 'id' | 'createdAt' | 'updatedAt' | 'ustadh' | 'category'> & {
    ustadh_id: string;
    category_id: string;
};

export type UpdateDersInput = Partial<CreateDersInput>;

export const dersService = {
    // Create a new ders
    async create(data: CreateDersInput): Promise<Ders> {
        const { data: createdDers, error } = await supabase
            .from('derses')
            .insert({
                ...data,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating ders:', error);
            throw new Error(error.message);
        }

        return createdDers;
    },

    // Get a single ders by ID
    async getById(id: string): Promise<Ders | null> {
        const { data, error } = await supabase
            .from('derses')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found
                return null;
            }
            console.error('Error fetching ders:', error);
            throw new Error(error.message);
        }

        return data;
    },

    // Get all derses with pagination
    async getAll(): Promise<Ders[]> {
        const { data, error } = await supabase
            .from('derses')
            .select('*')
            .order('order', { ascending: true });

        if (error) {
            console.error('Error fetching derses:', error);
            throw new Error(error.message);
        }

        return data || [];
    },

    // Update a ders
    async update(id: string, data: UpdateDersInput): Promise<Ders> {
        const { data: updatedDers, error } = await supabase
            .from('derses')
            .update({
                ...data,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating ders:', error);
            throw new Error(error.message);
        }

        return updatedDers;
    },

    // Delete a ders
    async delete(id: string): Promise<Ders> {
        const { data: deletedDers, error } = await supabase
            .from('derses')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error deleting ders:', error);
            throw new Error(error.message);
        }

        if (!deletedDers) {
            throw new Error('Ders not found or could not be deleted');
        }

        return deletedDers;
    },

    // Toggle publish status
    async togglePublish(id: string): Promise<Ders> {
        // First, get the current ders to check its current is_published status
        const { data: currentDers, error: fetchError } = await supabase
            .from('derses')
            .select('is_published')
            .eq('id', id)
            .single();

        if (fetchError || !currentDers) {
            throw new Error('Ders not found or could not be fetched');
        }

        // Then update with the toggled value
        const { data: updatedDers, error } = await supabase
            .from('derses')
            .update({
                is_published: !currentDers.is_published,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating ders:', error);
            throw new Error(error.message);
        }

        return updatedDers;
    },
};