"use client";

import { Button } from '@/components/ui/button';
import { StartLearningModal } from '@/components/start-learing';
import { useData } from '@/context/dataContext';
import { userService } from '@/lib/services/user';
import { getTelegramUser } from '@/lib/utils/telegram';
import { motion } from 'framer-motion';
import { BookOpen, Award, Clock, Play, ChevronRight, Flame, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/loading';


export default function DashboardPage() {
    const { derses, error, refreshData, users, categories, loading, audioParts, userAudioProgress, userDersProgress } = useData();

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
                                <p className="text-sm text-muted-foreground">Today's Progress</p>
                                <p className="font-medium">
                                    {completedDersToday}/{totalDailyGoal} የተጠናቀቁ ደረሶች
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
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 bg-muted">
                                    {activeDers.thumbnail_url ? (
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
                                            {categories?.find((category) => category.id === activeDers.category_id)?.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {audioParts?.find((audioPart) => audioPart.ders_id === activeDers.id)?.duration_in_seconds}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-foreground">{activeDers.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{activeDers.description}</p>

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
                                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap" onClick={() => router.push(`/ders/${activeDers.id}`)}>
                                    መማር ይቀጥሉ
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 px-4 bg-card rounded-xl border border-border">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">ምንም የተጀመረ ደርስ የለም</h3>
                        <p className="text-muted-foreground mb-4 max-w-md mx-auto">አዲስ ደርስ ለመጀመር ከታች ያሉትን ደርሶች ይመልከቱ</p>
                        <Link
                            href="/dersler"
                            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            ደርሶችን ይመልከቱ
                        </Link>
                    </div>)}
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
                                        <p className="text-sm text-muted-foreground line-clamp-2 h-10">{ders.description}</p>
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
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8 px-4 bg-card rounded-xl border border-border">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2"> የተጀመረ ደርስ አለ</h3>
                        <p className="text-muted-foreground mb-4 max-w-md mx-auto">ደርስ ለመቀየር ከታች ደርሶች ይመልከቱ</p>
                        <Link
                            href="/dersler"
                            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            ደርሶችን ይመልከቱ
                        </Link>
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
                                <p className="text-sm text-muted-foreground line-clamp-2 h-10">{ders.description}</p>
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
                    ))}
                </div>
            </motion.section>
        </div>
    );
}
