"use client";

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
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export default function BookmarkPage() {
    const { derses, shortDerses, categories, users, bookMarks, refreshData, loading } = useData();
    const tgUser = getTelegramUser();
    const user = users?.find((user) => Number(user.telegram_user_id) === tgUser?.id);
    const userBookmarks = bookMarks?.filter(b => b.user_id === user?.id);
    const [activeTab, setActiveTab] = useState('all');

    const handleRemoveDersBookmark = async (dersId: string) => {
        try {
            await bookmarkService.unbookmarkDers(dersId);
            refreshData();
            toast("Ders has been removed from your bookmarks.");
        } catch (error) {
            console.error('Error removing bookmark:', error);
            toast("Failed to remove bookmark.");
        }
    };

    const handleRemoveShortDersBookmark = async (dersId: string) => {
        try {
            await bookmarkService.unbookmarkShortDers(dersId);
            refreshData();
            toast("Short Ders has been removed from your bookmarks.");
        } catch (error) {
            console.error('Error removing bookmark:', error);
            toast("Failed to remove bookmark.");
        }
    };

    const filteredDerses = derses?.filter(ders => userBookmarks?.some(b => b.ders_id === ders.id)) || [];
    const filteredShortDerses = shortDerses?.filter(ders => userBookmarks?.some(b => b.short_ders_id === ders.id)) || [];

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Bookmarks</h1>

            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-primary rounded-md px-4 py-2 transition-all"
                    >
                        ሁሉም ደርሶች
                    </TabsTrigger>
                    <TabsTrigger
                        value="short-ders"
                        className="data-[state=active]:bg-primary rounded-md px-4 py-2 transition-all"
                    >
                        አጫጭር ደርሶች
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    {filteredDerses.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No bookmarked derses found.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDerses.map((ders) => (
                                <div key={ders.id} className="relative group bg-card rounded-xl border border-border overflow-hidden">
                                    <button
                                        onClick={() => handleRemoveDersBookmark(ders.id)}
                                        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                                        aria-label="Remove from bookmarks"
                                    >
                                        <BookmarkCheck className="w-5 h-5 text-primary fill-primary" />
                                    </button>
                                    <div className="aspect-video relative bg-muted">
                                        {ders.thumbnail_url && (
                                            <Image
                                                src={ders.thumbnail_url}
                                                alt={ders.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-lg mb-2">{ders.title}</h3>
                                        <Button asChild className="w-full mt-2">
                                            <Link href={`/ders/${ders.id}`}>
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                Continue Learning
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="short-ders">
                    {filteredShortDerses.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No bookmarked short derses found.</p>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {filteredShortDerses.map((ders) => (
                                <div key={ders.id} className="relative group">
                                    <button
                                        onClick={() => handleRemoveShortDersBookmark(ders.id)}
                                        className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                                        aria-label="Remove from bookmarks"
                                    >
                                        <BookmarkCheck className="w-4 h-4 text-primary fill-primary" />
                                    </button>

                                    <h4 className="text-sm font-medium mt-2 line-clamp-2">{ders.title}</h4>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}