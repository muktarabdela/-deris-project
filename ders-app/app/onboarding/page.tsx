"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Target, Users, Zap } from 'lucide-react';
import { useData } from '@/context/dataContext';
import { getTelegramUser } from '@/lib/utils/telegram';
import { userService } from '@/lib/services/user';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const { users, refreshData } = useData();
    const completeOnboarding = async () => {
        const tgUser = getTelegramUser();
        if (!tgUser) return;

        // Add service logic to mark onboarding as complete
        await userService.markOnboardingComplete(tgUser.id);
        await refreshData();

        router.replace("/dashboard");
    };


    const nextStep = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            completeOnboarding();
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
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex justify-center"
                        >
                            <BookOpen className="w-24 h-24 text-primary" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-foreground">Welcome to Your Learning Journey</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Discover a new way to engage with the Quran. Our app is designed to make learning intuitive, engaging, and personalized for you.
                        </p>
                    </div>
                );

            case 2:
                return (
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex justify-center"
                        >
                            <Zap className="w-24 h-24 text-primary" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-foreground">Interactive Lessons & Quizzes</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Dive into interactive lessons covering everything from Tajweed to Tafsir. Test your knowledge with engaging quizzes and track your progress.
                        </p>
                    </div>
                );

            case 3:
                return (
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex justify-center"
                        >
                            <Target className="w-24 h-24 text-primary" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-foreground">Personalized Goals & Tracking</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Set weekly goals to stay motivated. Our app helps you track your learning habits and celebrate your achievements along the way.
                        </p>
                    </div>
                );

            case 4:
                return (
                    <div className="text-center space-y-4">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex justify-center"
                        >
                            <Users className="w-24 h-24 text-primary" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-foreground">Community & Support</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            You're not alone! Join a community of learners, share your progress, and get support from peers and instructors.
                        </p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center">
            <div className="container mx-auto px-4 py-12 max-w-3xl">
                {/* Progress Indicators */}
                <div className="flex justify-center space-x-2 mb-12">
                    {[1, 2, 3, 4].map((s) => (
                        <motion.div
                            key={s}
                            className={`h-2 rounded-full ${step >= s ? 'bg-primary' : 'bg-muted'}`}
                            initial={{ width: '0rem' }}
                            animate={{ width: '4rem' }}
                            transition={{ duration: 0.5, delay: s * 0.1 }}
                        />
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-8"
                    >
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="mt-16 flex items-center justify-between">
                    <button
                        onClick={prevStep}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${step === 1
                            ? 'text-muted-foreground cursor-not-allowed opacity-50'
                            : 'text-foreground hover:bg-accent'
                            }`}
                        disabled={step === 1}
                    >
                        Back
                    </button>
                    <button
                        onClick={nextStep}
                        className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        {step === 4 ? 'Get Started' : 'Continue'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}