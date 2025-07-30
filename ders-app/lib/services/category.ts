import { supabase } from '@/lib/supabase';
import { CategoryModel } from '@/model/Category';
export type CreateCategoryInput = Omit<CategoryModel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;

const TABLE_NAME = 'categories';

export const categoryService = {
    // Create a new category
    async create(category: CreateCategoryInput): Promise<CategoryModel> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(category)
            .select()
            .single();

        if (error) {
            console.error('Error creating category:', error);
            throw new Error(error.message);
        }

        return data;
    },

    // Get all categories
    async getAll(): Promise<CategoryModel[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching categories:', error);
            throw new Error(error.message);
        }

        return data || [];
    },

    // Get a single category by ID
    async getById(id: string): Promise<CategoryModel | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found
                return null;
            }
            console.error('Error fetching category:', error);
            throw new Error(error.message);
        }

        return data;
    },

    // Update a category
    async update(id: string, updates: UpdateCategoryInput): Promise<CategoryModel> {
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
            console.error('Error updating category:', error);
            throw new Error(error.message);
        }

        return data;
    },

    // Delete a category
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting category:', error);
            throw new Error(error.message);
        }
    },

    // Search categories by name
    async search(query: string): Promise<CategoryModel[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .ilike('name', `%${query}%`)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error searching categories:', error);
            throw new Error(error.message);
        }

        return data || [];
    },
};