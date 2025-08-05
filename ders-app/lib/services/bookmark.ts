import { supabase } from "@/lib/supabase";
import { BookmarkModel } from "@/model/Bookmark";

export type CreateBookmarkInput = Omit<BookmarkModel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookmarkInput = Partial<CreateBookmarkInput>;

const TABLE_NAME = 'bookmarks';

export const bookmarkService = {
    // Create a new bookmark
    async create(bookmark: CreateBookmarkInput): Promise<BookmarkModel> {
        console.log(bookmark);
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert(bookmark)
            .select()
            .single();

        if (error) {
            console.error('Error creating bookmark:', error);
            throw new Error(error.message);
        }

        return data;
    },
    // Get all bookmarks
    async getAll(): Promise<BookmarkModel[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching bookmarks:', error);
            throw new Error(error.message);
        }

        return data || [];
    },
    // Get a single bookmark by ID
    async getById(id: string): Promise<BookmarkModel | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching bookmark:', error);
            throw new Error(error.message);
        }

        return data;
    },
    // Update a bookmark
    async update(id: string, bookmark: UpdateBookmarkInput): Promise<BookmarkModel> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(bookmark)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating bookmark:', error);
            throw new Error(error.message);
        }

        return data;
    },
    // Delete a bookmark
    async delete(dersId: string): Promise<void> {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('ders_id', dersId);

        if (error) {
            console.error('Error deleting bookmark:', error);
            throw new Error(error.message);
        }
    },
    // Search bookmarks by name
    async search(query: string): Promise<BookmarkModel[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .ilike('name', `%${query}%`)
            .order('name', { ascending: true });

        if (error) {
            console.error('Error searching bookmarks:', error);
            throw new Error(error.message);
        }

        return data || [];
    },
};