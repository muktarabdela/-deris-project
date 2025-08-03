"use client";

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Play, Check, Clock, FileText, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/context/dataContext';
import { AudioPartModel } from '@/model/AudioPart';
import { useState } from 'react';
import { AudioPlayerWithQuiz } from '@/components/audio-player';


export default function DersDetailsPage() {
    const { derses, error, refreshData, users, userAudioProgress, userDersProgress, loading, audioParts, categories } = useData();
    const params = useParams();
    const ders = derses?.find((ders) => ders.id === params.id);
    const [selectedAudioPart, setSelectedAudioPart] = useState<AudioPartModel | null>(null);

    const totalPart = audioParts?.filter((audioPart) => audioPart.ders_id === ders?.id).length || 0;

    // Calculate completed parts for the active ders
    const completedParts = userAudioProgress?.filter(
        progress => audioParts?.some(ap =>
            ap.id === progress.audio_part_id &&
            ap.ders_id === ders?.id &&
            progress.is_completed
        )
    ).length || 0;

    // Calculate progress percentage
    const progressPercentage = totalPart > 0 ? Math.round((completedParts / totalPart) * 100) : 0;


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

    const handlePlayAudio = (audioPart: AudioPartModel) => {
        // Only allow playing if a telegram_file_id is present
        if (audioPart.telegram_file_id) {
            // Navigate to the full-screen audio player
            window.location.href = `/ders/${params.id}/audio/${audioPart.id}`;
        }
    };
    const handleClosePlayer = () => {
        setSelectedAudioPart(null);
        // You can optionally refresh data or mark part as completed here
    };
    const handleOpenPdf = () => {
        if (ders.book_pdf_url) {
            window.open(ders.book_pdf_url, '_blank');
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
                        {categories?.find((category) => category.id === ders.category_id)?.name}
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
                        {completedParts} of {totalPart} parts
                    </span>
                </div>
                <div className="w-full bg-primary/20 rounded-full h-3">
                    <div
                        className="bg-primary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </motion.div>

            {/* PDF Preview */}
            {ders.book_pdf_url && (
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


            {/* Audio Parts - Updated Logic */}
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
                    {audioParts?.filter((audioPart) => audioPart.ders_id === ders.id)
                        .sort((a, b) => a.order - b.order)
                        .map((part, index) => (
                            <div
                                key={part.id}
                                onClick={() => handlePlayAudio(part)}
                                className={`p-4 rounded-xl border ${part.is_published
                                    ? 'border-green-500/20 bg-green-500/5'
                                    : 'border-border hover:border-primary/50 cursor-pointer hover:bg-accent/50'
                                    } transition-colors ${!part.telegram_file_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${part.is_published
                                                ? 'bg-green-500/10 text-green-500'
                                                : 'bg-primary/10 text-primary'
                                                }`}
                                        >
                                            {part.is_published ? <Check className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-foreground">
                                                {index + 1}. {part.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="w-3.5 h-3.5" />
                                                {part.duration_in_seconds ? (
                                                    <span>
                                                        {Math.floor(part.duration_in_seconds / 60)}:{(part.duration_in_seconds % 60).toString().padStart(2, '0')}
                                                    </span>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {part.telegram_file_id && !part.is_published && (
                                        <button className="text-primary hover:bg-primary/10 p-2 rounded-full">
                                            <Play className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </motion.div>

            {/* Audio Player Modal */}
            {selectedAudioPart && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                    >
                        <button
                            onClick={handleClosePlayer}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        {/* <AudioPlayerWithQuiz
                            audioPart={{
                                id: selectedAudioPart.id,
                                title: selectedAudioPart.title,
                                audioUrl: `/api/audio/${selectedAudioPart.telegram_file_id}`,
                                duration: selectedAudioPart.duration_in_seconds
                                    ? `${Math.floor(selectedAudioPart.duration_in_seconds / 60)}:${(selectedAudioPart.duration_in_seconds % 60).toString().padStart(2, '0')}`
                                    : '0:00',
                            }}
                            onComplete={handleClosePlayer}
                        /> */}
                    </motion.div>
                </div>
            )}
        </div>
    );
}