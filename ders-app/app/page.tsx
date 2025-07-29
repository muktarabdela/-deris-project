// app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
// Adjust your import paths as needed
import { loadTelegramWebApp, getTelegramUser, expandTelegramWebApp } from '@/lib/utils/telegram';
import { upsertTelegramUser } from '@/lib/services/users/userService';

export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        const initializeApp = async () => {
            try {
                await loadTelegramWebApp();

                expandTelegramWebApp();

                const tgUser = getTelegramUser();

                if (!tgUser || typeof tgUser.id !== 'number') {
                    setError("እባኮትን መተግበሪያውን ከቴሌግራም ውስጥ በድጋሚ ይክፈቱ።");
                    setIsLoading(false);
                    return; // Stop execution
                }

                const userDataToStore = {
                    id: tgUser.id,
                    first_name: tgUser.first_name || "",
                    username: tgUser.username || "",
                    photo_url: tgUser.photo_url || "",
                };

                await upsertTelegramUser(userDataToStore);

                setIsLoading(false);

                timer = setTimeout(() => {
                    router.push('/dashboard');
                }, 1000);

            } catch (err: any) {
                setError(err.message || "እባኮትን መተግበሪያውን ከቴሌግራም ውስጥ በድጋሚ ይክፈቱ።");
                setIsLoading(false);
            }
        };

        initializeApp();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [router]);

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
                <div className="text-center space-y-4 max-w-md w-full p-4 bg-destructive/10 rounded-lg">
                    <h2 className="text-xl font-semibold text-destructive">Error</h2>
                    <p className="text-destructive-foreground">{error}</p>
                    <p className="text-sm text-muted-foreground">እባኮትን መተግበሪያውን ከቴሌግራም ውስጥ በድጋሚ ይክፈቱ።</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-6 max-w-md w-full"
                >
                    <div className="space-y-2">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                ease: "easeInOut",
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                            className="w-24 h-24 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
                        >
                            <span className="text-4xl font-bold text-primary">د</span>
                        </motion.div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Ders
                        </h1>
                    </div>

                    <div className="space-y-4">
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut"
                                }}
                            />
                        </div>
                        <p className="text-muted-foreground text-sm">Authenticating and preparing your space...</p>
                    </div>

                    <motion.p
                        className="text-xs text-muted-foreground/50 mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        ከቴሌግራም ጋር በመገናኘት ላይ...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6 max-w-md w-full"
            >
                <div className="space-y-2">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        className="w-24 h-24 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4"
                    >
                        <span className="text-4xl font-bold text-primary">د</span>
                    </motion.div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Ders
                    </h1>
                </div>

                <div className="space-y-4">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                    <p className="text-muted-foreground text-sm">እንኳን ደህና መጡ፣ በቀጥታ እየተላከ ነው...</p>
                </div>

                <motion.p
                    className="text-xs text-muted-foreground/50 mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    የእስልማናዊ ትምህርትዎ ጉዞ ከዚህ ይጀምራል
                </motion.p>
            </motion.div>
        </div>
    );
}