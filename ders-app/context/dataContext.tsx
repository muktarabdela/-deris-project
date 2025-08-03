"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { dersService } from '@/lib/services/ders';
import { ustadhService } from '@/lib/services/ustadh';
import { categoryService } from '@/lib/services/category';
import { DersModel } from '@/model/Ders';
import { UstadhModel } from '@/model/Ustadh';
import { CategoryModel } from '@/model/Category';
import { UserModel } from '@/model/user';
import { userService } from '@/lib/services/user';
import { AudioPartModel } from '@/model/AudioPart';
import { audioPartService } from '@/lib/services/audio-part';
import { QuizModel } from '@/model/Quiz';
import { quizService } from '@/lib/services/quiz';
import { QuizQuestionModel } from '@/model/QuizQuestion';
import { quizQuestionService } from '@/lib/services/quiz-questions';

type DataContextType = {
    derses: DersModel[];
    ustadhs: UstadhModel[];
    categories: CategoryModel[];
    users: UserModel[];
    audioParts: AudioPartModel[];
    quizzes: QuizModel[];
    quizQuestions: QuizQuestionModel[];
    loading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [derses, setDerses] = useState<DersModel[]>([]);
    const [ustadhs, setUstadhs] = useState<UstadhModel[]>([]);
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [audioParts, setAudioParts] = useState<AudioPartModel[]>([]);
    const [quizzes, setQuizzes] = useState<QuizModel[]>([]);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestionModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all data in parallel
            const [dersesData, ustadhsData, categoriesData, usersData, audioPartsData, quizzesData, quizQuestionsData] = await Promise.all([
                dersService.getAll(),
                ustadhService.getAll(),
                categoryService.getAll(),
                userService.getAll(),
                audioPartService.getAll(),
                quizService.getAll(),
                quizQuestionService.getAll(),
            ]);

            setDerses(dersesData);
            setUstadhs(ustadhsData);
            setCategories(categoriesData);
            setUsers(usersData);
            setAudioParts(audioPartsData);
            setQuizzes(quizzesData);
            setQuizQuestions(quizQuestionsData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    return (
        <DataContext.Provider
            value={{
                derses,
                ustadhs,
                categories,
                users,
                audioParts,
                quizzes,
                quizQuestions,
                loading,
                error,
                refreshData: fetchAllData,
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

// Export a hook that can be used to directly access the context
export default DataContext;