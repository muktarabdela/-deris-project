import { useData } from "@/context/dataContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { QuizQuestionModel } from "@/model/QuizQuestion";
import { getTelegramUser } from "@/lib/utils/telegram";
import { userService } from "@/lib/services/user";
import { audioPartService } from "@/lib/services/audio-part";
import { useRouter } from "next/navigation";
import { userAudioPartProgressService } from "@/lib/services/userAudioPartProgress";

export default function Quiz({
    audioPartId,
    open,
    onOpenChange
}: {
    audioPartId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void
}) {
    // const tgUser = getTelegramUser();
    const { quizzes, quizQuestions, users, derses } = useData();
    const user = users?.find((user) => Number(user.telegram_user_id) === Number(87654321));
    const dersId = derses?.find((ders) => ders.id === user?.current_ders_id)?.id;

    const router = useRouter();

    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const quiz = quizzes?.find((quiz) => quiz.audio_part_id === audioPartId);
    const quizQuestionsList = quizQuestions?.filter(
        (quizQuestion) => quizQuestion.quiz_id === quiz?.id
    ) as QuizQuestionModel[];

    const currentQuestion = quizQuestionsList?.[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === (quizQuestionsList?.length || 0) - 1;
    const isFirstQuestion = currentQuestionIndex === 0;

    const handleSelectAnswer = (questionId: string, answer: string) => {
        if (submitted) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < (quizQuestionsList?.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        try {
            const score = calculateScore();
            console.log('score', score);
            if (score >= 70 && user) {
                const currentPoints = user.points || 0;
                const updatePoints = await userService.updatePoints(user.id, currentPoints + 10);
                const updateAudioPart = await userAudioPartProgressService.updateIsCompleted(audioPartId, true);
                console.log('updatePoints', updatePoints);
                console.log('updateAudioPart', updateAudioPart);
                // onOpenChange(false);
                // router.push(`/ders/${dersId}`);
            }
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    const handleCloseResults = () => {
        onOpenChange(false);
        router.push(`/ders/${dersId}`);
    };

    const calculateScore = () => {
        if (!quizQuestionsList) return 0;
        let correct = 0;
        quizQuestionsList.forEach(question => {
            if (selectedAnswers[question.id] === question.correct_answer) {
                correct++;
            }
        });
        return Math.round((correct / quizQuestionsList.length) * 100);
    };

    const score = calculateScore();

    if (submitted) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold mb-2">Quiz Results</DialogTitle>
                    </DialogHeader>
                    <div className="text-center py-6">
                        <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
                        <p className="text-lg mb-6">
                            {score >= 70 ? "Great job! 🎉" : "Keep practicing! 💪"}
                        </p>
                        <div className="space-y-4 text-left max-h-[50vh] overflow-y-auto">
                            {quizQuestionsList?.map((question, index) => (
                                <div key={question.id} className="border-b pb-4 mb-4">
                                    <p className="font-medium">{index + 1}. {question.question}</p>
                                    <p className="text-sm mt-1">
                                        Your answer: {selectedAnswers[question.id]}
                                        {selectedAnswers[question.id] === question.correct_answer
                                            ? " ✅"
                                            : ` ❌ (Correct: ${question.correct_answer})`}
                                    </p>
                                    {question.explanation && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {question.explanation}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Button
                            className="mt-6 w-full"
                            onClick={handleCloseResults}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold mb-2">
                        Question {currentQuestionIndex + 1} of {quizQuestionsList?.length}
                    </DialogTitle>
                </DialogHeader>

                {!currentQuestion ? (
                    <p className="text-center text-gray-500 py-4">No questions available for this quiz.</p>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
                            <div className="space-y-3">
                                {currentQuestion.options.map((option, optionIndex) => {
                                    const isSelected = selectedAnswers[currentQuestion.id] === option;
                                    let optionClass = "w-full text-left p-3 rounded-md border border-gray-200 hover:bg-primary/10";

                                    if (isSelected) {
                                        optionClass += " bg-primary/10 border-primary/30";
                                    }

                                    return (
                                        <button
                                            key={optionIndex}
                                            className={optionClass}
                                            onClick={() => handleSelectAnswer(currentQuestion.id, option)}
                                        >
                                            {String.fromCharCode(65 + optionIndex)}. {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={isFirstQuestion}
                            >
                                Previous
                            </Button>

                            {isLastQuestion ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!selectedAnswers[currentQuestion.id]}
                                >
                                    Submit Quiz
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleNext}
                                    disabled={!selectedAnswers[currentQuestion.id]}
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}