"use client";

import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/dataContext';
import { AudioPlayerWithPdf } from '@/components/audio-player';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Loading } from '@/components/loading';

export default function FullScreenAudioPlayer() {
    const router = useRouter();
    const params = useParams();
    const { audioParts, loading } = useData();
    const [audioPart, setAudioPart] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (loading) return;

        const part = audioParts?.find(part => part.id === params.audioId);

        if (part) {
            setAudioPart({
                ...part,
                audioUrl: `/api/audio/${part.telegram_file_id}`,
                duration: part.duration_in_seconds
                    ? `${Math.floor(part.duration_in_seconds / 60)}:${(part.duration_in_seconds % 60).toString().padStart(2, '0')}`
                    : '0:00',
            });
        } else if (audioParts?.length > 0) {
            router.push(`/ders/${params.id}`);
        }

        setIsLoading(false);
    }, [params.audioId, audioParts, loading, router, params.id]);

    const handleComplete = () => {

        router.push(`/ders/${params.id}`);
    };

    if (isLoading || loading) {
        return (
            <Loading />
        );
    }

    if (!audioPart) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-foreground">Audio not found</p>
                    <button
                        onClick={() => router.push(`/ders/${params.id}`)}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Back to Ders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container">
                <button
                    onClick={() => router.push(`/ders/${params.id}`)}
                    className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Ders</span>
                </button>

                <div className="max-w-3xl mx-auto">
                    <h1 className="text-2xl font-bold text-foreground mb-8 text-center">
                        {audioPart.title}
                    </h1>

                    <div className="bg-card rounded-xl shadow-lg">
                        <AudioPlayerWithPdf
                            audioPart={audioPart}
                            onComplete={handleComplete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
