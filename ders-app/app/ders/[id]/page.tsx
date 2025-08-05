"use client";

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Play, Check, Clock, FileText, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/context/dataContext';
import { AudioPartModel } from '@/model/AudioPart';
import { useState } from 'react';
import { getActiveCourses } from '@/lib/utils/util';
import { getTelegramUser } from '@/lib/utils/telegram';
import { StartLearningModal } from '@/components/start-learing';
import { userService } from '@/lib/services/user';
import { Button } from '@/components/ui/button';


export default function DersDetailsPage() {
    const { derses, error, refreshData, users, userAudioProgress, userDersProgress, loading, audioParts, categories } = useData();
    const params = useParams();
    const tgUser = getTelegramUser();
    const ders = derses?.find((ders) => ders.id === params.id);

    const [selectedAudioPart, setSelectedAudioPart] = useState<AudioPartModel | null>(null);

    const totalPart = audioParts?.filter((audioPart) => audioPart.ders_id === ders?.id).length || 0;
    const user = users?.find((user) => Number(user.telegram_user_id) === Number(params.userId));

    const completedParts = userAudioProgress?.filter(
        progress => audioParts?.some(ap =>
            ap.id === progress.audio_part_id &&
            ap.ders_id === ders?.id &&
            progress.is_completed
        )
    ).length || 0;

    // Calculate progress percentage
    const progressPercentage = totalPart > 0 ? Math.round((completedParts / totalPart) * 100) : 0;

    const activeCourses = userDersProgress?.find((progress) => progress.ders_id === ders?.id && progress.status === 'IN_PROGRESS');

    const completedAudioPartIds = new Set(
        userAudioProgress
            ?.filter(progress => progress.is_completed)
            .map(progress => progress.audio_part_id)
    );

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
        if (audioPart.telegram_file_id) {
            window.location.href = `/ders/${params.id}/audio/${audioPart.id}`;
        }
    };
    const handleClosePlayer = () => {
        setSelectedAudioPart(null);
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
            {activeCourses && (
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
                    {audioParts
                        ?.filter((audioPart) => audioPart.ders_id === ders.id && audioPart.is_published)
                        .sort((a, b) => a.order - b.order)
                        .map((part, index) => {
                            const isCompleted = completedAudioPartIds.has(part.id);
                            const isPlayable = !!part.telegram_file_id;

                            return (
                                <div
                                    key={part.id}
                                    onClick={() => isPlayable && handlePlayAudio(part)}
                                    className={`
            p-4 rounded-xl border cursor-pointer transition-colors 
            ${isCompleted
                                            ? 'bg-green-100 border-green-300'
                                            : 'hover:bg-accent/50 border-border'} 
            ${!isPlayable ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-600/10 text-green-600' : 'bg-primary/10 text-primary'
                                                }`}>
                                                {isCompleted ? <Check className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-foreground">
                                                    {index + 1}. {part.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {part.duration_in_seconds ? (
                                                        <span>
                                                            {Math.floor(part.duration_in_seconds / 60)}:
                                                            {(part.duration_in_seconds % 60).toString().padStart(2, '0')}
                                                        </span>
                                                    ) : (
                                                        <span>-</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {!isCompleted && isPlayable && (
                                            <button className="text-primary hover:bg-primary/10 p-2 rounded-full">
                                                <Play className="w-4 h-4" />
                                            </button>
                                        )}
                                        {isCompleted && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-green-200 text-green-800 font-semibold">
                                                Completed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
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
                    </motion.div>
                </div>
            )}
            {!activeCourses && (
                <div className="mt-4">
                    <StartLearningModal
                        dersId={ders.id}
                        dersTitle={ders.title}
                        userId={user?.id || ""}
                        onStartLearning={async (dersId) => {
                            if (!user?.id) return false;
                            try {
                                await userService.startDers(user.id, dersId);
                                return true;
                            } catch (error) {
                                console.error("Error starting ders:", error);
                                return false;
                            }
                        }}
                    >
                        <Button variant="default">
                            <Play className="w-4 h-4 mr-2" />
                            መማር  ይጀምሩ
                        </Button>
                    </StartLearningModal>
                </div>
            )}
        </div>
    );
}