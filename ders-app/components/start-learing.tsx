"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Play } from "lucide-react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { useData } from '@/context/dataContext';

interface StartLearningModalProps {
    dersId: string;
    dersTitle: string;
    userId: string;
    onStartLearning: (dersId: string) => Promise<boolean>;
    children: React.ReactNode;
}

export function StartLearningModal({
    dersId,
    dersTitle,
    userId,
    onStartLearning,
    children
}: StartLearningModalProps) {
    const { refreshData } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleStartLearning = async () => {
        if (!userId) {
            toast.error("Please sign in to start learning");
            return;
        }

        try {
            setIsLoading(true);
            const success = await onStartLearning(dersId);
            if (success) {
                toast.success(`Started learning ${dersTitle}`);
                // router.push(`/ders/${dersId}`);
                refreshData();
            }
        } catch (error) {
            console.error("Error starting ders:", error);
            toast.error("Failed to start learning. Please try again.");
        } finally {
            setIsLoading(false);
            setIsOpen(false);
        }
    };

    return (
        <>
            <div onClick={() => setIsOpen(true)}>
                {children}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Start Learning</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to start learning <span className="font-semibold text-foreground">{dersTitle}</span>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                            Your progress will be saved automatically as you learn.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleStartLearning}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Starting...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Start Learning
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}