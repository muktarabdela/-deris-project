"use client";

import { Button } from '@/components/ui/button';
import { getUserByTelegramUserId } from '@/lib/services/userService';
import { getTelegramUser } from '@/lib/utils/telegram';
import { motion } from 'framer-motion';
import { BookOpen, Award, Clock, Play, ChevronRight, Flame, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JSX, useEffect, useState } from 'react';

interface UserProfile {
    id: string;
    first_name: string;
    username: string;
    profile_picture_url: string;
}

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

    const tgUser = getTelegramUser();

    const router = useRouter();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (tgUser) {
            const getUserProfile = async () => {
                try {
                    const response = await getUserByTelegramUserId(tgUser?.id);
                    console.log("response", response);

                    if (response) {
                        setUserProfile({
                            id: response.id,
                            first_name: response.first_name,
                            username: response.username,
                            profile_picture_url: response.profile_picture_url,
                        });
                    } else {
                        router.push('/dashboard');
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            };

            getUserProfile();
        }
    }, [tgUser, router]);

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

    const shortDers: Ders[] = [
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
                <h1 className="text-2xl md:text-2xl font-bold text-foreground">
                    እንኳን ደህና መለስህ, <span className="text-primary">{userProfile?.first_name}</span> 👋
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
                                    {completedDersToday}/{totalDailyGoal} የተጠናቀቁ ደረሶች
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
                    <h2 className="text-xl font-bold text-foreground">የተጀመር ደረስ</h2>
                    {/* <Link href="/my-learning" className="text-sm text-primary hover:underline flex items-center">
                        View all <ChevronRight className="w-4 h-4" />
                    </Link> */}
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
                                    <span>{currentDers.completedParts} of {currentDers.totalParts} ክፍሎች</span>
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
                            መማር ይቀጥሉ
                        </button>
                    </div>
                </div>
            </motion.section>

            {/* Short Ders Section */}
            {/* <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-10"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground mb-4">Short Ders</h2>
                    <Link href="/my-learning" className="text-sm text-primary hover:underline flex items-center">
                        View all <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shortDers.map((ders) => (
                        <Link
                            key={ders.id}
                            href={`/ders/${ders.id}`}
                            className="flex flex-col p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Play className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{ders.category}</p>
                                    <p className="font-medium">{ders.title}</p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">{ders.description}</p>
                            <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs">{ders.duration}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-primary" />
                                    <span className="text-xs">{ders.completedParts} of {ders.totalParts} Parts</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </motion.section> */}

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
                        አጫጭር ትምህርቶች
                    </h2>
                    <Link href="/popular" className="text-sm text-primary hover:underline flex items-center">
                        ሁሉንም ይመልከቱ <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {shortDers.map((ders) => (
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
                                <p className="text-sm text-muted-foreground line-clamp-1">{ders.description}</p>
                            </div>

                            {/* Bottom section with progress bar */}
                            <div className="mt-4">
                                <Link href={`/ders/${ders.id}`} className="text-sm text-primary hover:underline flex items-center">
                                    <Button variant="default">
                                        <Play className="w-4 h-4 mr-2" />
                                        መማር  ይጀምሩ
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
