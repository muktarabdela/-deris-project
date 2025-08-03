"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, X } from 'lucide-react';

type AudioPlayerProps = {
    src: string;
    duration: number;
    onEnded?: () => void;
};

export default function AudioPlayer({ src, duration, onEnded }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // Format time in seconds to MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle play/pause
    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current?.pause();
        } else {
            audioRef.current?.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Handle seeking
    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current || !progressBarRef.current) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * duration;

        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    // Update current time
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const handleEnd = () => {
            setIsPlaying(false);
            onEnded?.();
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('ended', handleEnd);
        audio.addEventListener('loadeddata', () => setIsLoading(false));

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('ended', handleEnd);
            audio.removeEventListener('loadeddata', () => setIsLoading(false));
        };
    }, [onEnded]);

    const progressPercentage = (currentTime / duration) * 100;

    return (
        <div className="space-y-4">
            {/* Hidden audio element */}
            <audio ref={audioRef} src={src} preload="metadata" />

            {/* Progress bar */}
            <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden cursor-pointer"
            >
                <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>

                <button
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="w-5 h-5" />
                    ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                    )}
                </button>

                <div className="w-12">
                    {/* Spacer for alignment */}
                </div>
            </div>
        </div>
    );
}
