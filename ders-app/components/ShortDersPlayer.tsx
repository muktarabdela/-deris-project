// /components/ShortDersPlayer.tsx

import { useEffect, useRef } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Play, Pause, Loader } from 'lucide-react';

// Helper to format time
const formatDuration = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

type ShortDersPlayerProps = {
    src: string;
    onEnded: () => void;
    autoPlay?: boolean;
};

export function ShortDersPlayer({ src, onEnded, autoPlay = false }: ShortDersPlayerProps) {
    const {
        audioRef,
        isPlaying,
        isLoading,
        duration,
        currentTime,
        togglePlayPause,
        seek,
    } = useAudioPlayer(src, onEnded);

    // This ref tracks if auto-play has been initiated for the current src
    const autoPlayInitiated = useRef(false);

    // Reset the flag whenever the audio source changes
    useEffect(() => {
        autoPlayInitiated.current = false;
    }, [src]);

    // Effect to handle auto-playing the audio ONLY ONCE when it's ready
    useEffect(() => {
        if (autoPlay && !isPlaying && !isLoading && !autoPlayInitiated.current) {
            togglePlayPause();
            autoPlayInitiated.current = true; // Mark as initiated to prevent re-triggering
        }

    }, [autoPlay, isLoading, src]); // This effect now correctly depends on loading state and src

    return (
        <div className="mt-4 space-y-2">
            {/* The hidden audio element that the hook controls */}
            <audio ref={audioRef} />
            <div className="flex items-center gap-3">
                <button
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    className="p-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isLoading ? (
                        <Loader className="w-5 h-5 animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="w-5 h-5" />
                    ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                    )}
                </button>
                <div className="w-full">
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={currentTime}
                        onChange={(e) => seek(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full appearance-none cursor-pointer accent-primary dark:accent-primary"
                        disabled={isLoading}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{formatDuration(currentTime)}</span>
                        <span>{formatDuration(duration)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}