"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Check, X, ArrowRight } from 'lucide-react';

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
    quiz?: QuizQuestion[];
};

type AudioPlayerProps = {
    audioPart: AudioPart;
    onComplete: () => void;
};

export function AudioPlayerWithQuiz({ audioPart, onComplete }: AudioPlayerProps) {
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

    // Mock quiz data - in a real app, this would come from your API
    const quizQuestions: QuizQuestion[] = [
        {
            id: '1',
            question: 'What is the correct pronunciation of the letter ق?',
            options: [
                'Like the English "K" but deeper in the throat',
                'Like the English "G" sound',
                'Like the English "Q" sound',
                'Like the English "C" sound'
            ],
            correctAnswer: 0,
            explanation: 'The letter ق is pronounced from the deepest part of the throat, deeper than the English "K" sound.'
        },
        {
            id: '2',
            question: 'Which of these is a characteristic of Noon Sakinah?',
            options: [
                'It has a shaddah',
                'It has a sukoon',
                'It has a fatha',
                'It is always at the end of a word'
            ],
            correctAnswer: 1,
            explanation: 'Noon Sakinah is a Noon with a sukoon (ْ) on it.'
        }
    ];

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            setShowQuiz(true);
            quizRef.current?.scrollIntoView({ behavior: 'smooth' });
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

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
        if (selectedOption === null) return;

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
    const isCorrect = selectedOption === currentQuestion?.correctAnswer;

    return (
        <div className="space-y-8">
            {/* Audio Player */}
            <div className="bg-card rounded-2xl p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">{audioPart.title}</h2>

                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
                    >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                    </button>

                    <div className="flex-1">
                        <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{audioPart.duration}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                style={{
                                    width: duration ? `${(currentTime / duration) * 100}%` : '0%'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <audio
                    ref={audioRef}
                    src={audioPart.audioUrl || '/sample-audio.mp3'}
                    className="hidden"
                />
            </div>

            {/* Quiz Section */}
            {showQuiz && (
                <div ref={quizRef} className="bg-card rounded-2xl p-6 border border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-6">
                        Quiz ({currentQuestionIndex + 1}/{quizQuestions.length})
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <p className="text-foreground mb-4">{currentQuestion.question}</p>

                            <div className="space-y-3">
                                {currentQuestion.options.map((option, index) => (
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
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${showFeedback
                                                    ? index === currentQuestion.correctAnswer
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : selectedOption === index && !isCorrect
                                                            ? 'bg-red-500 border-red-500 text-white'
                                                            : 'border-border'
                                                    : selectedOption === index
                                                        ? 'border-primary bg-primary text-white'
                                                        : 'border-border'
                                                }`}>
                                                {showFeedback ? (
                                                    index === currentQuestion.correctAnswer ? (
                                                        <Check className="w-3 h-3" />
                                                    ) : selectedOption === index && !isCorrect ? (
                                                        <X className="w-3 h-3" />
                                                    ) : null
                                                ) : null}
                                            </div>
                                            <span>{option}</span>
                                        </div>
                                    </div>
                                ))}
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
