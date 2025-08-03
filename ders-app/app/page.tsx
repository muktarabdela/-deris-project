// app/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
// Adjust your import paths as needed
import { loadTelegramWebApp, getTelegramUser, expandTelegramWebApp } from '@/lib/utils/telegram';
import { userService } from '@/lib/services/user';
import { useData } from '@/context/dataContext';


export default function Home() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { users, refreshData } = useData();

    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        const initializeApp = async () => {
            // Prevent re-syncing if already in progress or completed
            if (isSyncing || users?.length > 0) {
                return;
            }
            setIsSyncing(true);

            try {
                await loadTelegramWebApp();
                expandTelegramWebApp();

                const tgUser = getTelegramUser();
                if (!tgUser || typeof tgUser.id !== 'number') {
                    setError("እባኮትን መተግበሪያውን ከቴሌግራም ውስጥ በድጋሚ ይክፈቱ።");
                    setIsLoading(false);
                    return;
                }

                // This logic will now run once to ensure user exists and is updated.
                // The redirection will be handled by the effect re-running when `users` data changes.
                const userExists = users?.some((user) => Number(user.telegram_user_id) === tgUser.id);

                if (!userExists) {
                    await userService.upsertTelegramUser({
                        id: tgUser.id,
                        first_name: tgUser.first_name || "",
                        username: tgUser.username || "",
                        photo_url: tgUser.photo_url || "",
                    });
                } else {
                    await userService.updateUserIfNeeded({
                        id: tgUser.id,
                        first_name: tgUser.first_name || "",
                        username: tgUser.username || "",
                        photo_url: tgUser.photo_url || "",
                    });
                }

                // Refreshing data will cause this useEffect hook to run again with fresh `users`.
                await refreshData();

            } catch (err: any) {
                setError(err.message || "እባኮትን መተግበሪያውን ከቴሌግራም ውስጥ በድጋሚ ይክፈቱ።");
                setIsLoading(false);
            }
        };

        // This function handles the redirection logic based on the current `users` state.
        const handleRedirect = () => {
            const tgUser = getTelegramUser();
            if (!tgUser) return;

            const user = users?.find((u) => Number(u.telegram_user_id) === tgUser.id);
            console.log("user", user);
            // Only redirect if we have a definitive user object.
            if (user) {
                setIsLoading(false);
                timer = setTimeout(() => {
                    if (user.is_onboarding_completed === true) {
                        router.push('/dashboard');
                    } else {
                        router.push('/onboarding');
                    }
                }, 1000);
            }
        };

        if (users && users.length > 0) {
            handleRedirect();
        } else {
            initializeApp();
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
        // By adding `users` as a dependency, the effect re-runs when `refreshData` provides new information.
    }, [router, users, refreshData, isSyncing]);


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
                        <p className="text-muted-foreground text-sm">በመገናኘት ላይ...</p>
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
            </motion.div>
        </div>
    );
}