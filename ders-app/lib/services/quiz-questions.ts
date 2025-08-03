import { supabase } from "../supabase";
import { QuizQuestionModel } from "@/model/QuizQuestion";

const TABLE_NAME = 'quiz_questions';

export type CreateQuizQuestionInput = Omit<QuizQuestionModel, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateQuizQuestionInput = Partial<CreateQuizQuestionInput>;

export const quizQuestionService = {
    // Create a new quiz question
    async create(questionData: CreateQuizQuestionInput): Promise<QuizQuestionModel> {
        const { data: newQuestion, error } = await supabase
            .from(TABLE_NAME)
            .insert(questionData)
            .select()
            .single();

        if (error) {
            console.error('Error creating quiz question:', error);
            throw new Error(error.message);
        }

        return newQuestion;
    },
    // Get a single quiz question by ID
    async getById(id: string): Promise<QuizQuestionModel | null> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Not found
                return null;
            }
            console.error('Error fetching quiz question:', error);
            throw new Error(error.message);
        }

        return data;
    },
    // Get all quiz questions
    async getAll(): Promise<QuizQuestionModel[]> {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*');

        if (error) {
            console.error('Error fetching quiz questions:', error);
            throw new Error(error.message);
        }

        return data;
    },
    // Update a quiz question
    // Update a quiz question
    async update(id: string, updates: Partial<QuizQuestionModel>): Promise<QuizQuestionModel> {
        const { data: updatedQuizQuestion, error } = await supabase
            .from(TABLE_NAME)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating quiz question:', error);
            throw new Error(error.message);
        }

        return updatedQuizQuestion;
    },
    // Delete a quiz question
    async delete(id: string): Promise<void> {
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting quiz question:', error);
            throw new Error(error.message);
        }
    },
};
