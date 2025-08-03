"use client";

import { Button } from '@/components/ui/button';
import { StartLearningModal } from '@/components/start-learing';
import { useData } from '@/context/dataContext';
import { userService } from '@/lib/services/user';
import { getTelegramUser } from '@/lib/utils/telegram';
import { motion } from 'framer-motion';
import { BookOpen, Award, Clock, Play, ChevronRight, Flame, Check, BookmarkPlus, BookmarkCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/loading';
import { AudioPartModel } from '@/model/AudioPart';
import { bookmarkService } from '@/lib/services/bookmark';
import { useEffect, useState } from 'react';
// import { useToast } from '@/components/ui/use-toast';

export default function DashboardPage() {
    const { derses, error, refreshData, users, categories, loading, audioParts, userAudioProgress, userDersProgress } = useData();

    const [bookmarkedDerses, setBookmarkedDerses] = useState<Set<string>>(new Set());
    // const { toast } = useToast();
    const tgUser = getTelegramUser();

    const router = useRouter();

    const user = users?.find((user) => Number(user.telegram_user_id) === tgUser?.id);

    const activeDers = derses?.find((ders) => ders.id === user?.current_ders_id);
    const totalPart = audioParts?.filter((audioPart) => audioPart.ders_id === activeDers?.id).length || 0;

    // Calculate completed parts for the active ders
    const completedParts = userAudioProgress?.filter(
        progress => audioParts?.some(ap =>
            ap.id === progress.audio_part_id &&
            ap.ders_id === activeDers?.id &&
            progress.is_completed
        )
    ).length || 0;

    // Calculate progress percentage
    const progressPercentage = totalPart > 0 ? Math.round((completedParts / totalPart) * 100) : 0;

    const userLevel = "Beginner";
    const userCategories = ["Tajweed", "Al-Qaida"];
    const completedDersToday = 0;
    const totalDailyGoal = 1;

    // Fetch user's bookmarks on component mount
    useEffect(() => {
        const fetchBookmarks = async () => {
            if (!tgUser?.id) return;

            try {
                const bookmarks = await bookmarkService.getAll();
                const userBookmarks = bookmarks.filter(b => b.user_id === user?.id);
                setBookmarkedDerses(new Set(userBookmarks.map(b => b.ders_id)));
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
            }
        };

        fetchBookmarks();
    }, [tgUser?.id]);

    const toggleBookmark = async (dersId: string) => {
        if (!tgUser?.id) return;

        try {
            const isBookmarked = bookmarkedDerses.has(dersId);

            if (isBookmarked) {
                // Remove bookmark
                await bookmarkService.delete(dersId);
                setBookmarkedDerses(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(dersId);
                    return newSet;
                });
                // toast({
                //     title: "Bookmark removed",
                //     description: "Ders has been removed from your bookmarks.",
                // });
            } else {
                // Add bookmark
                await bookmarkService.create({
                    user_id: user?.id || '',
                    ders_id: dersId,
                    // createdAt: new Date(),
                    // updatedAt: new Date(),
                });
                setBookmarkedDerses(prev => new Set(prev).add(dersId));
                // toast({
                //     title: "Bookmark added",
                //     description: "Ders has been added to your bookmarks.",
                // });
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
            // toast({
            //     title: "Error",
            //     description: "Failed to update bookmark. Please try again.",
            //     variant: "destructive"
            // });
        }
    };

    const handlePlayAudio = (audioPart: AudioPartModel) => {
        // Only allow playing if a telegram_file_id is present
        if (audioPart.telegram_file_id) {
            // Navigate to the full-screen audio player
            window.location.href = `/ders/${activeDers?.id}/audio/${audioPart.id}`;
        }
    };

    if (loading || !user) {
        return (
            <Loading />
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-2xl md:text-2xl font-bold text-foreground">
                    እንኳን ደህና መለስህ, <span className="text-primary">{user?.first_name}</span> 👋
                </h1>

                <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px] p-4 bg-card rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Award className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Points to level up</p>
                                <p className="font-medium">
                                    {user.points}/20 points
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-[200px] p-4 bg-card rounded-xl border border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Award className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Current Level</p>
                                <p className="font-medium">{userLevel}</p>
                                <p className="text-xs text-muted-foreground">
                                    {userCategories.join(' • ')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Continue Learning Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-10"
            >
                {activeDers ? (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-foreground">የተጀመር ደረስ</h2>
                            {/* <Link href="/my-learning" className="text-sm text-primary hover:underline flex items-center">
                        View all <ChevronRight className="w-4 h-4" />
                    </Link> */}
                        </div>

                        <div className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center gap-4" onClick={() => router.push(`/ders/${activeDers?.id}`)}>
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                                    {activeDers?.thumbnail_url ? (
                                        <Image
                                            src={activeDers.thumbnail_url}
                                            alt={activeDers.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                            <BookOpen className="w-8 h-8 text-primary/50" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                            {categories?.find((category) => category.id === activeDers?.category_id)?.name}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-foreground">{activeDers?.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{activeDers?.description?.slice(0, 40) + '...'}</p>

                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>Progress</span>
                                            <span>{completedParts} of {totalPart} ክፍሎች</span>
                                        </div>
                                        <div className="w-full bg-primary/20 rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${progressPercentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap" onClick={() => router.push(`/ders/${activeDers?.id}`)}>
                                መማር ይቀጥሉ
                            </button> */}
                            </div>
                            {/* Audio Parts - Updated Logic */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                            >
                                <h2 className="mt-4 text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                    Audio Parts
                                </h2>

                                <div className="space-y-3">
                                    {audioParts?.filter((audioPart) => audioPart.ders_id === activeDers?.id && audioPart.is_published)
                                        .sort((a, b) => a.order - b.order)
                                        .map((part, index) => (
                                            <div
                                                key={part.id}
                                                onClick={() => handlePlayAudio(part)}
                                                className={`p-4 rounded-xl border ${part.is_published
                                                    ? 'border-green-500/20 bg-green-500/5'
                                                    : 'border-border hover:border-primary/50 cursor-pointer hover:bg-accent/50'
                                                    } transition-colors ${!part.telegram_file_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${part.is_published
                                                                ? 'bg-green-500/10 text-green-500'
                                                                : 'bg-primary/10 text-primary'
                                                                }`}
                                                        >
                                                            {part.is_published ? <Check className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-foreground">
                                                                {index + 1}. {part.title}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Clock className="w-3.5 h-3.5" />
                                                                {part.duration_in_seconds ? (
                                                                    <span>
                                                                        {Math.floor(part.duration_in_seconds / 60)}:{(part.duration_in_seconds % 60).toString().padStart(2, '0')}
                                                                    </span>
                                                                ) : (
                                                                    <span>-</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </motion.div>
                        </div>

                    </>
                ) : (
                    <></>
                )}
            </motion.section>

            {/* Popular Ders Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-10"
            >
                {!activeDers ? (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                ታዋቂ ደርሶች
                            </h2>
                            <Link href="/popular" className="text-sm text-primary hover:underline flex items-center">
                                ሁሉንም ይመልከቱ <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {derses?.map((ders) => (
                                <div
                                    key={ders.id}
                                    className="relative group"
                                >
                                    <button
                                        onClick={() => toggleBookmark(ders.id)}
                                        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                                        aria-label={bookmarkedDerses.has(ders.id) ? "Remove from bookmarks" : "Add to bookmarks"}
                                    >
                                        {bookmarkedDerses.has(ders.id) ? (
                                            <BookmarkCheck className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                        ) : (
                                            <BookmarkPlus className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                                        )}
                                    </button>
                                    <div
                                        className="flex flex-col justify-between bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors w-60 flex-shrink-0"
                                    >
                                        {/* Top section with info */}
                                        <div className="w-full">
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                                                {ders.thumbnail_url ? (
                                                    <Image
                                                        src={ders.thumbnail_url}
                                                        alt={ders.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                        <BookOpen className="w-8 h-8 text-primary/50" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full inline-block mb-2">
                                                {categories.find((cat) => cat.id === ders.category_id)?.name}
                                            </span>
                                            <h3 className="font-bold text-foreground line-clamp-1 mb-1">{ders.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 h-10">{ders.description?.slice(0, 40) + '...'}</p>
                                        </div>

                                        {/* Bottom section with progress bar */}
                                        <div className="mt-4">
                                            <StartLearningModal
                                                dersId={ders.id}
                                                dersTitle={ders.title}
                                                userId={user?.id || ""}
                                                onStartLearning={async (dersId) => {
                                                    if (!user?.id) return false;
                                                    try {
                                                        await userService.startDers(user.id, dersId);
                                                        return true;
                                                    } catch (error) {
                                                        console.error("Error starting ders:", error);
                                                        return false;
                                                    }
                                                }}
                                            >
                                                <Button variant="default">
                                                    <Play className="w-4 h-4 mr-2" />
                                                    መማር  ይጀምሩ
                                                </Button>
                                            </StartLearningModal>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="py-6 px-4 bg-card rounded-xl border border-border">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-foreground"> የደረሶች ደረጃ ለ <span className="text-primary">{activeDers?.title}</span></h2>
                        </div>

                        {users && users.length > 3 && (
                            <div className="flex justify-end mb-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push('/leaderboard')}
                                    className="text-primary hover:bg-primary/10 "
                                >
                                    ሁሉንም ይመልከቱ
                                </Button>
                            </div>
                        )}
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {users?.slice(0, 5).map((user, index) => (
                                <div key={user.id} className="flex items-center p-3 bg-background rounded-lg border border-border hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center w-8 text-sm font-medium text-muted-foreground">
                                        {index + 1}
                                    </div>
                                    <div className="flex items-center flex-1 gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                                            {user.profile_picture_url ? (
                                                <img
                                                    src={user.profile_picture_url}
                                                    alt={user.first_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-foreground">
                                                        {user.first_name?.[0]?.toUpperCase() || 'U'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-foreground truncate">
                                                {user.first_name || 'User'}
                                            </h3>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium text-amber-500">{user.points || 0}</span>
                                            <span className="ml-1 text-sm text-muted-foreground">pts</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.section>

            {/* short Ders Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mb-10"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        አጫጭር ደርሶች
                    </h2>
                    <Link href="/popular" className="text-sm text-primary hover:underline flex items-center">
                        ሁሉንም ይመልከቱ <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {derses?.map((ders) => (
                        <div
                            key={ders.id}
                            className="relative group"
                        >
                            <button
                                onClick={() => toggleBookmark(ders.id)}
                                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                                aria-label={bookmarkedDerses.has(ders.id) ? "Remove from bookmarks" : "Add to bookmarks"}
                            >
                                {bookmarkedDerses.has(ders.id) ? (
                                    <BookmarkCheck className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                ) : (
                                    <BookmarkPlus className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                                )}
                            </button>
                            <div
                                className="flex flex-col justify-between bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors w-60 flex-shrink-0"
                            >
                                {/* Top section with info */}
                                <div className="w-full">
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                                        {ders.thumbnail_url ? (
                                            <Image
                                                src={ders.thumbnail_url}
                                                alt={ders.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                <BookOpen className="w-8 h-8 text-primary/50" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full inline-block mb-2">
                                        {categories.find((cat) => cat.id === ders.category_id)?.name}
                                    </span>
                                    <h3 className="font-bold text-foreground line-clamp-1 mb-1">{ders.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">{ders.description?.slice(0, 40) + '...'}</p>
                                </div>

                                {/* Bottom section with progress bar */}
                                <div className="mt-4">
                                    <StartLearningModal
                                        dersId={ders.id}
                                        dersTitle={ders.title}
                                        userId={user?.id || ""}
                                        onStartLearning={async (dersId) => {
                                            if (!user?.id) return false;
                                            try {
                                                await userService.startDers(user.id, dersId);
                                                return true;
                                            } catch (error) {
                                                console.error("Error starting ders:", error);
                                                return false;
                                            }
                                        }}
                                    >
                                        <Button variant="default">
                                            <Play className="w-4 h-4 mr-2" />
                                            መማር  ይጀምሩ
                                        </Button>
                                    </StartLearningModal>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
