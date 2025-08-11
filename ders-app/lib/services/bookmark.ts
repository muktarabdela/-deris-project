import { supabase } from "@/lib/supabase";
import { BookmarkModel } from "@/model/Bookmark";

export type CreateBookmarkInput = Omit<BookmarkModel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBookmarkInput = Partial<CreateBookmarkInput>;

const TABLE_NAME = 'bookmarks';

export const bookmarkService = {
    // Create a new bookmark
    async bookmarkDers(bookmark: CreateBookmarkInput): Promise<BookmarkModel> {
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
    // unbookmark ders
    async unbookmarkDers(dersId: string): Promise<void> {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('ders_id', dersId);

        if (error) {
            console.error('Error deleting bookmark:', error);
            throw new Error(error.message);
        }
    },
    // bookmark short ders
    async bookmarkShortDers(bookmark: CreateBookmarkInput): Promise<BookmarkModel> {
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
    // unbookmark short ders
    async unbookmarkShortDers(dersId: string): Promise<void> {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('ders_id', dersId);

        if (error) {
            console.error('Error deleting bookmark:', error);
            throw new Error(error.message);
        }
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
};