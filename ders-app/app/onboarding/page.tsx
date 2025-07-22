"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

type LearningLevel = 'beginner' | 'intermediate' | 'advanced';
type Interest = 'tajweed' | 'nooraniya' | 'tafsir' | 'memorization' | 'dua' | 'manners';
type WeeklyGoal = '1-2' | '3-4' | '5+';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [learningLevel, setLearningLevel] = useState<LearningLevel | null>(null);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [weeklyGoal, setWeeklyGoal] = useState<WeeklyGoal | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleInterest = (interest: Interest) => {
        setInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    const handleSubmit = async () => {
        if (!learningLevel || interests.length === 0 || !weeklyGoal) {
            // Handle validation
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // TODO: Save preferences to backend
        console.log({ learningLevel, interests, weeklyGoal });

        // Redirect to dashboard
        router.push('/dashboard');
    };

    const nextStep = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground">What is your current Quran learning level?</h2>
                        <div className="space-y-3">
                            {[
                                { id: 'beginner', label: 'Beginner', description: 'I\'m new to reading' },
                                { id: 'intermediate', label: 'Intermediate', description: 'I can read, want to improve' },
                                { id: 'advanced', label: 'Advanced', description: 'Focus on memorization or Tajweed' },
                            ].map(({ id, label, description }) => (
                                <button
                                    key={id}
                                    onClick={() => setLearningLevel(id as LearningLevel)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${learningLevel === id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${learningLevel === id ? 'bg-primary border-primary' : 'border-foreground/30'
                                            }`}>
                                            {learningLevel === id && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-foreground">{label}</h3>
                                            <p className="text-sm text-muted-foreground">{description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground">Which topics are you most interested in?</h2>
                        <p className="text-muted-foreground">Select all that apply</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                { id: 'tajweed', label: 'Tajweed' },
                                { id: 'nooraniya', label: 'Al-Qaida Nooraniya' },
                                { id: 'tafsir', label: 'Tafsir' },
                                { id: 'memorization', label: 'Memorization' },
                                { id: 'dua', label: 'Dua & Azkar' },
                                { id: 'manners', label: 'Islamic Manners' },
                            ].map(({ id, label }) => (
                                <button
                                    key={id}
                                    onClick={() => toggleInterest(id as Interest)}
                                    className={`p-4 rounded-xl border-2 transition-all ${interests.includes(id as Interest)
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${interests.includes(id as Interest) ? 'bg-primary border-primary' : 'border-foreground/30'
                                            }`}>
                                            {interests.includes(id as Interest) && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className="font-medium">{label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-foreground">How many days a week do you want to study?</h2>
                        <div className="space-y-3">
                            {[
                                { id: '1-2', label: '1-2 days', description: 'Casual learning' },
                                { id: '3-4', label: '3-4 days', description: 'Regular commitment' },
                                { id: '5+', label: '5+ days', description: 'Intensive learning' },
                            ].map(({ id, label, description }) => (
                                <button
                                    key={id}
                                    onClick={() => setWeeklyGoal(id as WeeklyGoal)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${weeklyGoal === id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${weeklyGoal === id ? 'bg-primary border-primary' : 'border-foreground/30'
                                            }`}>
                                            {weeklyGoal === id && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-foreground">{label}</h3>
                                            <p className="text-sm text-muted-foreground">{description}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 text-right">
                        Step {step} of 3
                    </p>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h1 className="text-3xl font-bold text-foreground mb-2">Salam 👋</h1>
                                <p className="text-lg text-muted-foreground">Let's personalize your learning journey.</p>
                                <p className="text-muted-foreground">Tell us a bit about you.</p>
                            </motion.div>
                        )}

                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="mt-12 flex justify-between">
                    <button
                        onClick={prevStep}
                        className={`px-6 py-3 rounded-lg font-medium ${step === 1
                                ? 'text-muted-foreground cursor-not-allowed'
                                : 'text-foreground hover:bg-accent/50 transition-colors'
                            }`}
                        disabled={step === 1}
                    >
                        Back
                    </button>

                    <button
                        onClick={nextStep}
                        disabled={
                            (step === 1 && !learningLevel) ||
                            (step === 2 && interests.length === 0) ||
                            (step === 3 && !weeklyGoal) ||
                            isSubmitting
                        }
                        className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${isSubmitting
                                ? 'bg-primary/80 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary/90'
                            } text-primary-foreground transition-colors`}
                    >
                        {isSubmitting ? (
                            'Saving...'
                        ) : step === 3 ? (
                            <>
                                Start My Learning
                                <ArrowRight className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
