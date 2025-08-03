
export interface QuizQuestionModel {
    id: string;
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string | null;
    quiz_id: string;
    createdAt: Date;
    updatedAt: Date;
}