import { supabase } from "../supabase";
import { QuizModel } from "@/model/Quiz";

const TABLE_NAME = 'quizzes';

export type CreateQuizInput = Omit<QuizModel, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateQuizInput = Partial<CreateQuizInput>;

export const quizService = {
    // Create a new quiz
    async create(quiz: CreateQuizInput): Promise<QuizModel> {
        const { data: createdQuiz, error } = await supabase
            .from(TABLE_NAME)
            .insert({
                ...quiz,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating quiz:', error);
            throw new Error(error.message);
        }

        return createdQuiz;

    },
    // Get a single quiz by ID
    async getById(id: string): Promise<QuizModel | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found
                return null;
            }
            console.error('Error fetching quiz:', error);
            throw new Error(error.message);
        }

        return data;
    },
    // Get all quizzes with pagination
    async getAll(): Promise<QuizModel[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('createdAt', { ascending: true });

        if (error) {
            console.error('Error fetching quizzes:', error);
            throw new Error(error.message);
        }

        return data || [];
    },
    // Update a quiz
    async update(id: string, data: UpdateQuizInput): Promise<QuizModel> {
        const { data: updatedQuiz, error } = await supabase
            .from(TABLE_NAME)
            .update({
                ...data,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating quiz:', error);
            throw new Error(error.message);
        }

        return updatedQuiz;
    },
    // Delete a quiz
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting quiz:', error);
            throw new Error(error.message);
        }
    },
}

