"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCcw, RefreshCw, Undo, Redo } from 'lucide-react';
import { useData } from '@/context/dataContext';
import { AudioPartModel } from '@/model/AudioPart';
import { Document, Page, pdfjs } from 'react-pdf';

// CSS imports for react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Setting up the PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

type AudioPartModelWithAudioUrl = AudioPartModel & {
    audioUrl: string;
};
type AudioPlayerProps = {
    audioPart: AudioPartModelWithAudioUrl;
    onComplete: () => void;
};


// Renamed component for clarity since quiz functionality is removed
export function AudioPlayerWithPdf({ audioPart, onComplete }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pdfError, setPdfError] = useState<string | null>(null);

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const [duration, setDuration] = useState(audioPart.duration_in_seconds || 0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const { derses } = useData();

    const pdfUrl = derses?.find(d => d.id === audioPart.ders_id)?.book_pdf_url;

    useEffect(() => {
        setDuration(audioPart.duration_in_seconds || 0);

        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => {
            if (isFinite(audio.duration)) {
                setDuration(audio.duration);
            }
        };

        const ended = () => {
            setIsPlaying(false);
            onComplete();
        };

        const handleWaiting = () => setIsLoading(true);
        const handlePlaying = () => setIsLoading(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('durationchange', updateDuration);
        audio.addEventListener('canplay', updateDuration); // Added this
        audio.addEventListener('ended', ended);
        audio.addEventListener('waiting', handleWaiting);
        audio.addEventListener('playing', handlePlaying);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('durationchange', updateDuration);
            audio.removeEventListener('canplay', updateDuration);
            audio.removeEventListener('ended', ended);
            audio.removeEventListener('waiting', handleWaiting);
            audio.removeEventListener('playing', handlePlaying);
        };
    }, [audioPart.id, onComplete]);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            // This is now the only place where audio.play() is called
            audio.play().catch(console.error);
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (amount: number) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + amount));
        }
    };


    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPdfError(null);
    };

    const onDocumentLoadError = (error: Error) => {
        console.error('Failed to load PDF:', error);
        setPdfError('Could not load the PDF file. Please check the URL.');
    };

    return (
        <div className="bg-primary/20 h-screen flex flex-col">
            {/* Header */}
            {/* <header className="flex-shrink-0 flex items-center justify-between p-4 text-white">
                <div className="flex-1 text-center">
                    <h1 className="text-xl font-semibold">{audioPart.title}</h1>
                </div>
            </header> */}

            {/* PDF Viewer */}
            <main className="flex-1 bg-white overflow-y-auto max-h-[calc(100vh-64px)]">
                {pdfUrl ? (
                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                    >
                        {Array.from(new Array(numPages || 0), (_, index) => (
                            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))}
                    </Document>
                ) : (
                    <div className="p-4 text-center text-gray-500">Loading PDF...</div>
                )}
                {pdfError && (
                    <div className="p-4 text-center text-red-500 bg-red-100">{pdfError}</div>
                )}
            </main>

            {/* Audio Player Controls */}
            <footer className="flex-shrink-0 bg-primary/10 p-4 text-white">
                {/* Clickable Progress Bar */}
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={(e) => {
                        const time = parseFloat(e.target.value);
                        if (audioRef.current) {
                            audioRef.current.currentTime = time;
                            setCurrentTime(time);
                        }
                    }}
                    className="w-full accent-white h-1.5 rounded-full cursor-pointer mb-2"
                />


                {/* Time Display */}
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(duration)}</span>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-center space-x-8">
                    <button onClick={() => handleSeek(-10)} className="text-white p-2">
                        <Undo size={24} />
                        <span>10s </span>
                    </button>
                    <button
                        onClick={togglePlayPause}
                        className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center transition-transform hover:scale-105"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : isPlaying ? (
                            <Pause size={32} />
                        ) : (
                            <Play size={32} className="ml-1" />
                        )}
                    </button>
                    <button onClick={() => handleSeek(10)} className="text-white p-2">
                        <Redo size={24} />
                        <span>10s </span>
                    </button>
                </div>

                <audio
                    ref={audioRef}
                    src={audioPart.audioUrl}
                    className="hidden"
                />
            </footer>
        </div>
    );
}