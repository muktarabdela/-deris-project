"use client";

import { useData } from '@/context/dataContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BookmarkPlus, BookmarkCheck, Filter, X, Search, Play, Pause } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getTelegramUser } from '@/lib/utils/telegram';
import { bookmarkService } from '@/lib/services/bookmark';
import { userService } from '@/lib/services/user';
import { StartLearningModal } from '@/components/start-learing';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loading } from '@/components/loading';


export default function AllDersPage() {
    const router = useRouter();
    const { derses, shortDerses, categories, loading, error, refreshData, bookMarks, users } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filteredDerses, setFilteredDerses] = useState(derses);
    const [filteredShortDerses, setFilteredShortDerses] = useState(shortDerses);
    const [activeTab, setActiveTab] = useState('all');
    const tgUser = getTelegramUser();
    const user = users?.find((u) => Number(u.telegram_user_id) === tgUser?.id);
    const bookMarkedDerses = bookMarks?.filter((b) => b.user_id === user?.id);



    useEffect(() => {
        if (activeTab === 'all') {
            let result = [...derses];

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                result = result.filter(ders =>
                    ders.title.toLowerCase().includes(term) ||
                    ders.description?.toLowerCase().includes(term)
                );
            }

            if (selectedCategories.length > 0) {
                result = result.filter(ders =>
                    selectedCategories.includes(ders.category_id)
                );
            }

            setFilteredDerses(result);
        } else if (activeTab === 'short-ders') {
            let result = [...shortDerses];

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                result = result.filter(shortDers =>
                    shortDers.title.toLowerCase().includes(term) ||
                    shortDers.description?.toLowerCase().includes(term)
                );
            }

            if (selectedCategories.length > 0) {
                result = result.filter(ders =>
                    selectedCategories.includes(ders.category_id)
                );
            }

            setFilteredShortDerses(result);
        }
    }, [searchTerm, selectedCategories, derses, shortDerses, activeTab]);

    const toggleCategory = (categoryId: string) => {
        if (activeTab === 'all') {
            setSelectedCategories(prev =>
                prev.includes(categoryId)
                    ? prev.filter(id => id !== categoryId)
                    : [...prev, categoryId]
            );
        } else if (activeTab === 'short-ders') {
            setSelectedCategories(prev =>
                prev.includes(categoryId)
                    ? prev.filter(id => id !== categoryId)
                    : [...prev, categoryId]
            );
        }
    };
    useEffect(() => {
        console.log('shortDerses from context:', shortDerses);
    }, [shortDerses]);
    const toggleBookmark = async (dersId: string) => {
        if (!user?.id) return;

        try {
            const isBookmarked = bookMarkedDerses?.some(b => b.ders_id === dersId);

            if (isBookmarked) {
                await bookmarkService.delete(dersId);
            } else {
                await bookmarkService.create({
                    user_id: user.id,
                    ders_id: dersId,
                });
            }
            refreshData();
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategories([]);
    };

    if (loading) {
        return <Loading />
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">ሁሉም ደርሶች በቀላሉ ይፈልጉ</h1>
                    <p className="text-muted-foreground">Browse and filter through all available derses</p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="mb-8">
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="mb-4 flex items-center gap-2"
                >
                    {showFilters ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>

                {showFilters && (
                    <div className="bg-card border rounded-lg p-4 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search derses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-medium">Categories</h3>
                                {selectedCategories.length > 0 && (
                                    <button
                                        onClick={() => setSelectedCategories([])}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => toggleCategory(category.id)}
                                        className="rounded-full"
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {(selectedCategories.length > 0 || searchTerm) && (
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="text-primary"
                            >
                                Clear All Filters
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <Tabs defaultValue="all" className="mb-8">
                <TabsList className="mb-8">
                    <TabsTrigger
                        onClick={() => setActiveTab('all')}
                        value="all"
                        className="data-[state=active]:bg-primary rounded-md px-4 py-2 transition-all"
                    >
                        ሁሉም
                    </TabsTrigger>
                    <TabsTrigger
                        onClick={() => setActiveTab('short-ders')}
                        value="short-ders"
                        className="data-[state=active]:bg-primary rounded-md px-4 py-2 transition-all"
                    >
                        አጫጭር ደርሶች
                    </TabsTrigger>
                </TabsList>

                {/* Derses Grid */}
                <TabsContent value="all">
                    <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            {filteredDerses.length} {filteredDerses.length === 1 ? 'ders' : 'derses'} found
                        </p>

                        {filteredDerses.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No derses found matching your filters.</p>
                                <Button variant="outline" onClick={clearFilters} className="mt-4">
                                    Clear filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2   gap-6">
                                {filteredDerses.map((ders) => {
                                    const isBookmarked = bookMarkedDerses?.some(b => b.ders_id === ders.id);
                                    const category = categories.find(c => c.id === ders.category_id);

                                    return (
                                        <motion.div
                                            key={ders.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="relative group"
                                        >
                                            <button
                                                onClick={() => toggleBookmark(ders.id)}
                                                className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                                                aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                                            >
                                                {isBookmarked ? (
                                                    <BookmarkCheck className="w-5 h-5 text-primary fill-primary" />
                                                ) : (
                                                    <BookmarkPlus className="w-5 h-5 text-gray-400 hover:text-primary/50" />
                                                )}
                                            </button>
                                            <div className="flex flex-col justify-between bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors h-full">
                                                <div className="w-full" onClick={() => router.push(`/ders/${ders.id}`)}>
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
                                                                <BookmarkPlus className="h-12 w-12 text-primary/50" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {category && (
                                                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full inline-block mb-2">
                                                            {category.name}
                                                        </span>
                                                    )}
                                                    <h3 className="font-bold text-foreground line-clamp-1 mb-1">{ders.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                                                        {ders.description?.slice(0, 40) + (ders.description?.length > 40 ? '...' : '')}
                                                    </p>
                                                </div>

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
                                                        <Button variant="default" className="w-full">
                                                            <Play className="w-4 h-4 mr-2" />
                                                            መማር ይጀምሩ
                                                        </Button>
                                                    </StartLearningModal>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="short-ders">
                    <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-4">
                            {filteredShortDerses.length} {filteredShortDerses.length === 1 ? 'ders' : 'derses'} found
                        </p>

                        {filteredShortDerses.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No derses found matching your filters.</p>
                                <Button variant="outline" onClick={clearFilters} className="mt-4">
                                    Clear filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2   gap-6">
                                {filteredShortDerses.map((ders) => {
                                    const isBookmarked = bookMarkedDerses?.some(b => b.ders_id === ders.id);
                                    const category = categories.find(c => c.id === ders.category_id);

                                    return (
                                        <motion.div
                                            key={ders.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="relative group"
                                        >
                                            <button
                                                onClick={() => toggleBookmark(ders.id)}
                                                className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                                                aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                                            >
                                                {isBookmarked ? (
                                                    <BookmarkCheck className="w-4 h-4 text-primary fill-primary" />
                                                ) : (
                                                    <BookmarkPlus className="w-4 h-4 text-gray-400 hover:text-primary/50" />
                                                )}
                                            </button>
                                            <div className="flex flex-col justify-between bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors h-full">
                                                <div className="w-full">
                                                    {category && (
                                                        <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full inline-block mb-2">
                                                            {category.name}
                                                        </span>
                                                    )}
                                                    <h3 className="font-bold text-foreground line-clamp-1 mb-1">{ders.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                                                        {ders.description?.slice(0, 40) + (ders.description?.length > 40 ? '...' : '')}
                                                    </p>
                                                </div>

                                                <div className="mt-4">
                                                    <Button variant="default" className="w-full">
                                                        <Play className="w-4 h-4 mr-2" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>

        </div>
    );
}