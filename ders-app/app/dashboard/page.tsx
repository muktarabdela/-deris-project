"use client";

import { motion } from 'framer-motion';
import { BookOpen, Award, Clock, Play, ChevronRight, Flame } from 'lucide-react';
import Link from 'next/link';
import { JSX } from 'react';

type Ders = {
    id: string;
    title: string;
    description: string;
    progress: number;
    totalParts: number;
    completedParts: number;
    duration: string;
    category: string;
    isPopular: boolean;
};

type Category = {
    id: string;
    name: string;
    icon: JSX.Element;
    count: number;
};

export default function DashboardPage() {
    // Mock user data - in a real app, this would come from a context or API
    const userName = "Muktar";
    const userLevel = "Beginner";
    const userCategories = ["Tajweed", "Al-Qaida"];
    const completedDersToday = 0;
    const totalDailyGoal = 1;

    // Mock ders data
    const currentDers: Ders = {
        id: '1',
        title: 'Introduction to Tajweed',
        description: 'Learn the basics of proper Quranic recitation',
        progress: 33,
        totalParts: 6,
        completedParts: 2,
        duration: '12 min',
        category: 'Tajweed',
        isPopular: true,
    };

    const popularDers: Ders[] = [
        {
            id: '2',
            title: 'Noorani Qaida - Lesson 1',
            description: 'Introduction to Arabic letters',
            progress: 75,
            totalParts: 4,
            completedParts: 3,
            duration: '8 min',
            category: 'Al-Qaida',
            isPopular: true,
        },
        {
            id: '2',
            title: 'Noorani Qaida - Lesson 1',
            description: 'Introduction to Arabic letters',
            progress: 75,
            totalParts: 4,
            completedParts: 3,
            duration: '8 min',
            category: 'Al-Qaida',
            isPopular: true,
        },
        {
            id: '3',
            title: 'Daily Duas - Morning & Evening',
            description: 'Essential daily supplications',
            progress: 25,
            totalParts: 8,
            completedParts: 2,
            duration: '15 min',
            category: 'Dua & Azkar',
            isPopular: true,
        },
    ];

    const categories: Category[] = [
        { id: '1', name: 'Tajweed', icon: <BookOpen className="w-5 h-5" />, count: 12 },
        { id: '2', name: 'Al-Qaida', icon: <Award className="w-5 h-5" />, count: 8 },
        { id: '3', name: 'Tafsir', icon: <BookOpen className="w-5 h-5" />, count: 15 },
        { id: '4', name: 'Memorization', icon: <Award className="w-5 h-5" />, count: 20 },
        { id: '5', name: 'Dua & Azkar', icon: <BookOpen className="w-5 h-5" />, count: 10 },
    ];

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Welcome back, <span className="text-primary">{userName}</span> 👋
                </h1>

                <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px] p-4 bg-card rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Award className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Today's Progress</p>
                                <p className="font-medium">
                                    {completedDersToday}/{totalDailyGoal} Ders completed
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-[200px] p-4 bg-card rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Award className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Current Level</p>
                                <p className="font-medium">{userLevel}</p>
                                <p className="text-xs text-muted-foreground">
                                    {userCategories.join(' • ')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Continue Learning Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-10"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">Continue Learning</h2>
                    <Link href="/my-learning" className="text-sm text-primary hover:underline flex items-center">
                        View all <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Play className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                    {currentDers.category}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {currentDers.duration}
                                </span>
                            </div>
                            <h3 className="font-bold text-foreground">{currentDers.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{currentDers.description}</p>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Progress</span>
                                    <span>{currentDers.completedParts} of {currentDers.totalParts} AudioParts</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${currentDers.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap">
                            Continue
                        </button>
                    </div>
                </div>
            </motion.section>

            {/* Categories Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-10"
            >
                <h2 className="text-xl font-bold text-foreground mb-4">Categories</h2>
                <div className="flex gap-3 pb-2 overflow-x-auto scrollbar-hide">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/category/${category.id}`}
                            className="flex flex-col items-center justify-center p-4 min-w-[120px] border border-border rounded-xl hover:border-primary/50 hover:bg-accent/50 transition-colors"
                        >
                            <div className="p-2 bg-primary/10 rounded-lg mb-2 text-primary">
                                {category.icon}
                            </div>
                            <span className="font-medium text-sm text-center">{category.name}</span>
                            <span className="text-xs text-muted-foreground">{category.count} Ders</span>
                        </Link>
                    ))}
                </div>
            </motion.section>

            {/* Popular Ders Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-10"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        Popular Ders
                    </h2>
                    <Link href="/popular" className="text-sm text-primary hover:underline flex items-center">
                        See all <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {popularDers.map((ders) => (
                    <div
                        key={ders.id}
                        className="flex flex-col justify-between bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors w-60 flex-shrink-0"
                    >
                        {/* Top section with info */}
                        <div>
                            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                <Play className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full inline-block mb-2">
                                {ders.category}
                            </span>
                            <h3 className="font-bold text-white line-clamp-1">{ders.title}</h3>
                            <p className="text-sm text-gray-400 line-clamp-1">{ders.description}</p>
                        </div>
                        
                        {/* Bottom section with progress bar */}
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                                <span>{ders.completedParts}/{ders.totalParts} Parts</span>
                                <span>{Math.round(ders.progress)}%</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1.5">
                                <div
                                    className="bg-gray-200 h-1.5 rounded-full"
                                    style={{ width: `${ders.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            </motion.section>
        </div>
    );
}
