import { supabase } from "@/lib/supabase";
import { UserDersProgressModel } from "@/model/UserDersProgress";

export type CreateUserDersProgressInput = Omit<UserDersProgressModel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserDersProgressInput = Partial<CreateUserDersProgressInput>;

const TABLE_NAME = 'user_ders_progress';

export const userDersProgressService = {
    // Create a new user ders progress
    async create(userDersProgress: CreateUserDersProgressInput): Promise<UserDersProgressModel> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(userDersProgress)
            .select()
            .single();

        if (error) {
            console.error('Error creating user ders progress:', error);
            throw new Error(error.message);
        }

        return data;
    },
    // Get all user ders progress
    async getAll(): Promise<UserDersProgressModel[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching user ders progress:', error);
            throw new Error(error.message);
        }

        return data || [];
    },
    // Get a single user ders progress by ID
    async getById(id: string): Promise<UserDersProgressModel | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching user ders progress:', error);
            throw new Error(error.message);
        }

        return data;
    },
    // Update a user ders progress
    async update(id: string, userDersProgress: UpdateUserDersProgressInput): Promise<UserDersProgressModel> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(userDersProgress)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating user ders progress:', error);
            throw new Error(error.message);
        }

        return data;
    },
    // Delete a user ders progress
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting user ders progress:', error);
            throw new Error(error.message);
        }
    },
    // Search user ders progress by name
    async search(query: string): Promise<UserDersProgressModel[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .ilike('name', `%${query}%`)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error searching user ders progress:', error);
            throw new Error(error.message);
        }

        return data || [];
    },
}