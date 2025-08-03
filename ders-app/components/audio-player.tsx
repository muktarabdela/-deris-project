"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Check, X, ArrowRight } from 'lucide-react';
import { useData } from '@/context/dataContext'; // Import useData hook

type QuizQuestion = {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
};

type AudioPart = {
    id: string;
    title: string;
    audioUrl: string;
    duration: string;
};

type AudioPlayerProps = {
    audioPart: AudioPart;
    onComplete: () => void;
    fullScreen?: boolean;
};

export function AudioPlayerWithQuiz({ audioPart, onComplete, fullScreen = false }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);

    const audioRef = useRef<HTMLAudioElement>(null);
    const quizRef = useRef<HTMLDivElement>(null);

    // Fetch quiz data from the context based on the audio part's ID
    const { quizzes } = useData();
    const quizForPart = quizzes?.find(q => q.audio_part_id === audioPart.id);
    const quizQuestions = quizForPart?.questions as QuizQuestion[] || [];

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            // If there's a quiz with questions, show it. Otherwise, complete the part.
            if (quizQuestions.length > 0) {
                setShowQuiz(true);
                quizRef.current?.scrollIntoView({ behavior: 'smooth' });
            } else {
                onComplete();
            }
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        // Start playing automatically
        if (!fullScreen) {
            audio.play().then(() => setIsPlaying(true)).catch(console.error);
        }

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioPart.id, onComplete, quizQuestions.length, fullScreen]);

    useEffect(() => {
        if (fullScreen && audioRef.current) {
            audioRef.current.play().catch(error => {
                console.error("Auto-play failed:", error);
            });
        }
    }, [fullScreen]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleOptionSelect = (optionIndex: number) => {
        if (showFeedback) return;
        setSelectedOption(optionIndex);
    };

    const checkAnswer = () => {
        if (selectedOption === null || !quizQuestions.length) return;

        const currentQuestion = quizQuestions[currentQuestionIndex];
        const isCorrect = selectedOption === currentQuestion.correctAnswer;

        setShowFeedback(true);
        if (isCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const goToNextQuestion = () => {
        setShowFeedback(false);
        setSelectedOption(null);

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Quiz completed
            onComplete();
        }
    };

    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

    return (
        <div className={`space-y-8 p-4 md:p-6 ${fullScreen ? 'max-w-4xl mx-auto' : ''}`}>
            {/* Audio Player */}
            <div className={`bg-card rounded-2xl p-6 border border-border ${fullScreen ? 'shadow-lg' : ''}`}>
                <h2 className={`${fullScreen ? 'text-2xl' : 'text-xl'} font-bold text-foreground mb-4`}>
                    {audioPart.title}
                </h2>

                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors flex-shrink-0"
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <div className="flex-1">
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{audioPart.duration}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{
                                    width: duration ? `${(currentTime / duration) * 100}%` : '0%'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <audio
                    ref={audioRef}
                    src={audioPart.audioUrl}
                    className="hidden"
                />
            </div>

            {/* Quiz Section - Conditionally rendered */}
            {showQuiz && currentQuestion && (
                <div ref={quizRef} className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-6">
                        Quiz ({currentQuestionIndex + 1}/{quizQuestions.length})
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <p className="text-foreground mb-4">{currentQuestion.question}</p>

                            {/* Quiz options logic remains the same, but uses dynamic data */}
                            <div className="space-y-3">
                                {currentQuestion.options.map((option, index) => {
                                    const isCorrect = selectedOption === currentQuestion.correctAnswer;
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleOptionSelect(index)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedOption === index
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                                } ${showFeedback && index === currentQuestion.correctAnswer
                                                    ? 'bg-green-500/10 border-green-500'
                                                    : ''
                                                } ${showFeedback && selectedOption === index && !isCorrect
                                                    ? 'bg-red-500/10 border-red-500'
                                                    : ''
                                                }`}
                                        >
                                            {/* ... Option rendering logic ... */}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {showFeedback && currentQuestion.explanation && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                                {currentQuestion.explanation}
                            </div>
                        )}

                        <div className="flex justify-end">
                            {!showFeedback ? (
                                <button
                                    onClick={checkAnswer}
                                    disabled={selectedOption === null}
                                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${selectedOption !== null
                                        ? 'bg-primary text-white hover:bg-primary/90'
                                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                                        }`}
                                >
                                    Check Answer
                                </button>
                            ) : (
                                <button
                                    onClick={goToNextQuestion}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
                                >
                                    {isLastQuestion ? 'Finish' : 'Next Question'}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}