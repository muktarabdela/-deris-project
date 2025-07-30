import { QuizModel } from "./Quiz";

export interface QuizQuestionModel {
    id: string;
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string | null;
    quiz_id: string;
    quiz: QuizModel;
    createdAt: Date;
    updatedAt: Date;
}