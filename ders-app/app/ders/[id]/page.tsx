"use client";

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Play, Check, Clock, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type AudioPart = {
    id: string;
    title: string;
    duration: string;
    isCompleted: boolean;
    audioUrl?: string;
};

type Ders = {
    id: string;
    title: string;
    description: string;
    category: string;
    totalParts: number;
    completedParts: number;
    pdfUrl?: string;
    audioParts: AudioPart[];
    createdAt: string;
    updatedAt: string;
};

// Mock data - in a real app, this would be fetched from an API based on the ID
const getDersData = (id: string): Ders | null => {
    const mockDers: Record<string, Ders> = {
        '1': {
            id: '1',
            title: 'Introduction to Tajweed',
            description: 'Learn the basics of proper Quranic recitation with this comprehensive guide to Tajweed rules. This ders covers the fundamental principles that every student of the Quran should know.',
            category: 'Tajweed',
            totalParts: 6,
            completedParts: 2,
            pdfUrl: '/sample.pdf',
            audioParts: [
                { id: '1-1', title: 'Introduction to Makharij', duration: '5:32', isCompleted: true },
                { id: '1-2', title: 'The Rules of Noon Sakinah', duration: '7:45', isCompleted: true },
                { id: '1-3', title: 'Meem Sakinah Rules', duration: '6:18', isCompleted: false },
                { id: '1-4', title: 'Qalqalah Letters', duration: '4:52', isCompleted: false },
                { id: '1-5', title: 'Madd Letters', duration: '8:15', isCompleted: false },
                { id: '1-6', title: 'Practice Session', duration: '10:00', isCompleted: false },
            ],
            createdAt: '2025-07-15T10:30:00Z',
            updatedAt: '2025-07-20T14:45:00Z',
        },
    };

    return mockDers[id] || null;
};

export default function DersDetailsPage() {
    const params = useParams();
    const ders = getDersData(params.id as string);

    if (!ders) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-foreground">Ders not found</h1>
                <Link href="/dashboard" className="mt-4 text-primary hover:underline">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const progressPercentage = Math.round((ders.completedParts / ders.totalParts) * 100);

    const handlePlayAudio = (audioPart: AudioPart) => {
        // In a real app, this would play the audio
        console.log('Playing:', audioPart.title);
        // After audio finishes, you would mark it as completed
    };

    const handleOpenPdf = () => {
        if (ders.pdfUrl) {
            window.open(ders.pdfUrl, '_blank');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link
                href="/dashboard"
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
            >
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                        {ders.category}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {new Date(ders.updatedAt).toLocaleDateString()}
                    </span>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-3">{ders.title}</h1>
                <p className="text-muted-foreground">{ders.description}</p>
            </motion.header>

            {/* Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-8"
            >
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-foreground">Your Progress</h2>
                    <span className="text-sm text-muted-foreground">
                        {ders.completedParts} of {ders.totalParts} parts
                    </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                    <div
                        className="bg-primary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </motion.div>

            {/* PDF Preview */}
            {ders.pdfUrl && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mb-10"
                >
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        Study Material
                    </h2>
                    <div className="border border-border rounded-xl p-4 bg-card">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                                    <BookOpen className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-foreground">Ders Notes</h3>
                                    <p className="text-sm text-muted-foreground">PDF Document</p>
                                </div>
                            </div>
                            <button
                                onClick={handleOpenPdf}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                <BookOpen className="w-4 h-4" />
                                Open Book
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Audio Parts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
            >
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-primary" />
                    Audio Parts
                </h2>

                <div className="space-y-3">
                    {ders.audioParts.map((part, index) => (
                        <div
                            key={part.id}
                            onClick={() => !part.isCompleted && handlePlayAudio(part)}
                            className={`p-4 rounded-xl border ${part.isCompleted
                                ? 'border-green-500/20 bg-green-500/5'
                                : 'border-border hover:border-primary/50 cursor-pointer hover:bg-accent/50'
                                } transition-colors`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${part.isCompleted
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'bg-primary/10 text-primary'
                                            }`}
                                    >
                                        {part.isCompleted ? (
                                            <Check className="w-5 h-5" />
                                        ) : (
                                            <Play className="w-5 h-5" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-foreground">
                                            {index + 1}. {part.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{part.duration}</span>
                                            {part.isCompleted && (
                                                <span className="text-green-500 text-xs font-medium bg-green-500/10 px-2 py-0.5 rounded-full">
                                                    Completed
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {!part.isCompleted && (
                                    <button className="text-primary hover:bg-primary/10 p-2 rounded-full">
                                        <Play className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
