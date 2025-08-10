// /hooks/useAudioPlayer.ts

import { useState, useRef, useEffect, useCallback } from 'react';

export const useAudioPlayer = (audioUrl: string, onEnded: () => void) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Start with loading true
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1);

    // Effect to set up event listeners on the audio element
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration || 0);
            setIsLoading(false);
        };
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleWaiting = () => setIsLoading(true);
        const handlePlaying = () => setIsLoading(false);
        const handleEnded = () => {
            setIsPlaying(false);
            onEnded();
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('waiting', handleWaiting);
        audio.addEventListener('playing', handlePlaying);
        audio.addEventListener('ended', handleEnded);

        // Initial check for already loaded metadata
        if (audio.readyState >= 1) {
            handleLoadedMetadata();
        }

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('waiting', handleWaiting);
            audio.removeEventListener('playing', handlePlaying);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [onEnded]);

    // Effect to handle source changes
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.src = audioUrl;
            setIsLoading(true);
            // We don't auto-play here, just load the new source
        }
    }, [audioUrl]);


    const togglePlayPause = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => {
                console.error("Audio play failed:", e);
                setIsPlaying(false); // Reset state on error
            });
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const seek = useCallback((time: number) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    const forward = useCallback((amount: number) => {
        seek(Math.min(duration, currentTime + amount));
    }, [currentTime, duration, seek]);

    const rewind = useCallback((amount: number) => {
        seek(Math.max(0, currentTime - amount));
    }, [currentTime, seek]);

    const changeVolume = useCallback((value: number) => {
        if (audioRef.current) {
            audioRef.current.volume = value;
            setVolume(value);
        }
    }, []);

    return {
        audioRef,
        isPlaying,
        isLoading,
        duration,
        currentTime,
        volume,
        togglePlayPause,
        seek,
        forward,
        rewind,
        changeVolume,
    };
};