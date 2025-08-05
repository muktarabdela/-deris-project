"use client";

import { useEffect, useState } from 'react';
import { useData } from '@/context/dataContext';
import { getTelegramUser } from '@/lib/utils/telegram';
import { BookOpen, BookmarkCheck, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { bookmarkService } from '@/lib/services/bookmark';
import { Loading } from '@/components/loading';
import { StartLearningModal } from '@/components/start-learing';
import { userService } from '@/lib/services/user';
// import { useToast } from '@/components/ui/use-toast';

export default function BookmarkPage() {
    const { derses, categories, users, bookMarks, refreshData } = useData();
    const [isLoading, setIsLoading] = useState(true);
    // const { toast } = useToast();
    const tgUser = getTelegramUser();
    const user = users?.find((user) => Number(user.telegram_user_id) === tgUser?.id);
    const userBookmarks = bookMarks?.filter(b => b.user_id === user?.id);

    const handleRemoveBookmark = async (dersId: string) => {
        try {
            await bookmarkService.delete(dersId);
            refreshData();
            // toast({
            //     title: "Bookmark removed",
            //     description: "Ders has been removed from your bookmarks.",
            // });
        } catch (error) {
            console.error('Error removing bookmark:', error);
            // toast({
            //     title: "Error",
            //     description: "Failed to remove bookmark.",
            //     variant: "destructive"
            // });
        }
    };

    const filteredDerses = derses?.filter(ders => userBookmarks?.some(b => b.ders_id === ders.id)) || [];
    // if (isLoading) {
    //     return (
    //         <Loading />
    //     );
    // }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">My Bookmarks</h1>

            {filteredDerses.length === 0 ? (
                <div className="text-center py-12">
                    <BookOpen className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No bookmarks yet</h3>
                    <p className="text-muted-foreground mb-6">Save your favorite derses to access them quickly here.</p>
                    <Link href="/dashboard">
                        <Button>Browse Derses</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredDerses.map((ders) => (
                        <div
                            key={ders.id}
                            className="relative group h-full"
                        >
                            <div
                                className="flex flex-col h-full bg-card rounded-xl border border-border hover:border-primary/50 transition-colors overflow-hidden"
                            >
                                <div className="relative w-full aspect-video bg-muted">
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
                                <div className="p-4 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                                            {categories.find((cat) => cat.id === ders.category_id)?.name}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveBookmark(ders.id);
                                            }}
                                            className=" p-1 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md hover:shadow-lg z-10"
                                            aria-label="Remove from bookmarks"
                                        >
                                            <BookmarkCheck className="w-5 h-5 text-primary fill-primary" />
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-foreground line-clamp-1 mb-2">{ders.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                        {ders.description?.slice(0, 60) + (ders.description?.length > 60 ? '...' : '')}
                                    </p>
                                    <div className="flex justify-between items-center mt-auto">
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
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
}