// /components/AudioPlayerWithPdf.tsx

"use client";

import { useState, useMemo } from 'react';
import { Play, Pause, Undo, Redo, Volume2, VolumeX, Loader, Volume1, AlertTriangle } from 'lucide-react';
import { useData } from '@/context/dataContext';
import { AudioPartModel } from '@/model/AudioPart';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import Quiz from './quiz';
import { useEffect } from 'react';
// PDF worker setup
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

type AudioPartModelWithAudioUrl = AudioPartModel & {
    audioUrl: string;
};
type AudioPlayerProps = {
    audioPart: AudioPartModelWithAudioUrl;
    onComplete: () => void;
};

// Helper to format time
const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};



export function AudioPlayerWithPdf({ audioPart, onComplete }: AudioPlayerProps) {
    console.log("  audioPart", audioPart);
    const { userAudioProgress, derses } = useData();

    // State for handling the two-step loading process
    const [audioSrc, setAudioSrc] = useState<string>('');
    const [isUrlLoading, setIsUrlLoading] = useState(true);
    const [urlError, setUrlError] = useState<string | null>(null);

    useEffect(() => {
        // Reset state for new audio part
        setIsUrlLoading(true);
        setAudioSrc('');
        setUrlError(null);

        const fetchAudioUrl = async () => {
            try {
                const response = await fetch(`/api/audio/${audioPart.telegram_file_id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch audio URL');
                }

                setAudioSrc(data.downloadUrl);
            } catch (err: any) {
                console.error("Frontend fetch error:", err);
                setUrlError(err.message || 'Could not load audio file.');
            } finally {
                setIsUrlLoading(false);
            }
        };

        fetchAudioUrl();
    }, [audioPart.telegram_file_id]); // Re-run only when the file_id changes


    const {
        audioRef,
        isPlaying,
        isLoading: isAudioLoading, // Rename for clarity
        duration,
        currentTime,
        volume,
        togglePlayPause,
        seek,
        forward,
        rewind,
        changeVolume,
    } = useAudioPlayer(audioSrc, onComplete);

    const [numPages, setNumPages] = useState<number | null>(null);
    const [quizOpen, setQuizOpen] = useState(false);

    const pdfUrl = useMemo(() => derses?.find(d => d.id === audioPart.ders_id)?.book_pdf_url, [derses, audioPart.ders_id]);
    const isCompleted = useMemo(() => userAudioProgress.find(p => p.audio_part_id === audioPart.id)?.is_completed, [userAudioProgress, audioPart.id]);

    const isLoading = isUrlLoading || (audioSrc && isAudioLoading);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 h-screen flex flex-col">
            {/* PDF Viewer */}
            <main className="flex-1 bg-white dark:bg-gray-800 overflow-y-auto">
                {pdfUrl ? (
                    <Document file={pdfUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                        {Array.from(new Array(numPages || 0), (_, index) => (
                            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))}
                    </Document>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">Loading PDF...</div>
                )}
            </main>

            {/* Audio Player Controls Footer */}
            <footer className=" bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
                <div className="container mx-auto px-4 py-3">
                    <audio ref={audioRef} preload="metadata" className="hidden" />

                    {/* Progress Bar */}
                    {/* <div className="relative mb-2 group">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-200 ease-out"
                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                            />
                        </div>
                        <div
                            className="absolute top-1/2 h-4 w-4 -mt-2 -ml-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
                            <span>{formatDuration(currentTime)}</span>
                            <span>{formatDuration(duration)}</span>
                        </div>
                    </div> */}
                    <div className="mb-2">
                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            step={0.1}
                            value={currentTime}
                            onChange={(e) => seek(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full appearance-none cursor-pointer accent-primary dark:accent-primary"
                        />
                        <div className="flex justify-between text-xs font-mono mt-1">
                            <span>{formatDuration(currentTime)}</span>
                            <span>{formatDuration(duration)}</span>
                        </div>
                    </div>

                    {/* Main Controls */}
                    <div className="flex items-center justify-between">
                        {/* Track Info - Placeholder for future implementation */}
                        <div className="flex items-center space-x-3 w-1/3 min-w-0">
                            <button
                                onClick={() => changeVolume(volume > 0 ? 0 : 0.8)}
                                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                aria-label={volume > 0 ? 'Mute' : 'Unmute'}
                            >
                                {volume === 0 ? (
                                    <VolumeX size={16} />
                                ) : volume < 0.5 ? (
                                    <Volume1 size={16} />
                                ) : (
                                    <Volume2 size={16} />
                                )}
                            </button>
                        </div>

                        {/* Playback Controls */}
                        <div className="flex items-center justify-center space-x-2">
                            <button
                                onClick={() => rewind(10)}
                                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                disabled={isLoading || !!urlError}
                                aria-label="Rewind 10 seconds"
                            >
                                <Undo size={18} />
                                10
                            </button>

                            <button
                                onClick={togglePlayPause}
                                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || !!urlError}
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                {urlError ? (
                                    <AlertTriangle size={24} className="text-destructive" />
                                ) : isLoading ? (
                                    <Loader size={24} className="animate-spin" />
                                ) : isPlaying ? (
                                    <Pause size={24} />
                                ) : (
                                    <Play size={24} className="ml-0.5" />
                                )}
                            </button>

                            <button
                                onClick={() => forward(10)}
                                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                disabled={isLoading || !!urlError}
                                aria-label="Forward 10 seconds"
                            >
                                <Redo size={18} />
                                10
                            </button>
                        </div>

                        {/* Additional Controls */}
                        <div className="flex items-center justify-end space-x-4 w-1/3">
                            {/* Quiz Button */}
                            {!isCompleted && (
                                <button
                                    onClick={() => setQuizOpen(true)}
                                    className="p-2 text-primary hover:bg-muted rounded-md transition-colors flex items-center space-x-1.5 group"
                                    title="Take Quiz"
                                    aria-label="Take Quiz"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="group-hover:scale-110 transition-transform"
                                    >
                                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m-1 8h6m-6 4h3m-3-8h6" />
                                    </svg>
                                    <span className="text-sm font-medium hidden sm:inline">Quiz</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </footer>

            <Quiz audioPartId={audioPart.id} open={quizOpen} onOpenChange={setQuizOpen} />
        </div>
    );
}