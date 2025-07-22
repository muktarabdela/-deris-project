"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to onboarding after 2.5 seconds
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md w-full"
      >
        {/* App Logo/Name */}
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

        {/* Loading Animation */}
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
          <p className="text-muted-foreground text-sm">Preparing your learning space...</p>
        </div>

        {/* Subtle footer */}
        <motion.p
          className="text-xs text-muted-foreground/50 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Your Islamic learning journey begins here
        </motion.p>
      </motion.div>
    </div>
  );
}
