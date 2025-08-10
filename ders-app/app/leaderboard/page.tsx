"use client";

import { useEffect, useState } from 'react';
import { useData } from '@/context/dataContext';
import { getTelegramUser } from '@/lib/utils/telegram';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Loading } from '@/components/loading';

export default function LeaderboardPage() {
    const { users, derses, loading, userAudioProgress } = useData();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDers, setSelectedDers] = useState<string | null>(null);
    const itemsPerPage = 10;

    const tgUser = getTelegramUser();
    const currentUser = users?.find(user => Number(user.telegram_user_id) === tgUser?.id);

    // Get all ders that the current user is learning
    const userDerses = users?.filter(user =>
        user.current_ders_id && user.current_ders_id === currentUser?.current_ders_id
    );

    // Filter users by selected ders or current user's ders
    const filteredUsers = users
        ?.filter(user =>
            selectedDers
                ? user.current_ders_id === selectedDers
                : user.current_ders_id === currentUser?.current_ders_id
        )
        .map(user => ({
            ...user,
            // Calculate points from userAudioProgress for this user
            points: userAudioProgress
                ?.filter(progress => progress.user_id === user.id)
                .reduce((sum, progress) => sum + (progress.points || 0), 0) || 0
        }))
        .sort((a, b) => (b.points || 0) - (a.points || 0));

    // Get unique ders from users who are learning the same ders as current user
    const availableDerses = Array.from(new Set(
        userDerses?.map(user => user.current_ders_id).filter(Boolean)
    )).map(dersId => derses?.find(d => d.id === dersId)).filter(Boolean);

    // Pagination
    const totalPages = Math.ceil((filteredUsers?.length || 0) / itemsPerPage);
    const paginatedUsers = filteredUsers?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDers]);

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    ወደ ዋና ገጽ ተመለስ
                </Link>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-2xl font-bold text-foreground">የደረሶች ደረጃ ሰንጠረዥ</h1>

                    {availableDerses && availableDerses.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {availableDerses?.map(ders => (
                                <Button
                                    key={ders?.id}
                                    variant={selectedDers === ders?.id ? 'default' : 'outline'}
                                    size="sm"

                                    onClick={() => setSelectedDers(ders?.id || '')}
                                    className="text-sm"
                                >
                                    {ders?.title}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                    {paginatedUsers?.length > 0 ? (
                        paginatedUsers.map((user, index) => {
                            const rank = (currentPage - 1) * itemsPerPage + index + 1;

                            return (
                                <div
                                    key={user.id}
                                    className={`flex items-center p-3 bg-background rounded-lg border border-border hover:bg-accent/50 transition-colors ${user.id === currentUser?.id ? 'ring-2 ring-primary/50' : ''
                                        }`}
                                >
                                    <div className="flex items-center w-8 text-sm font-medium text-muted-foreground">
                                        {rank <= 3 ? (
                                            <Trophy className={`w-5 h-5 ${rank === 1 ? 'text-amber-500' :
                                                rank === 2 ? 'text-gray-400' :
                                                    'text-amber-700'
                                                }`} />
                                        ) : (
                                            <span className="text-sm">{rank}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center flex-1 gap-3">
                                        <div>
                                            {rank}
                                        </div>
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                                            {user.profile_picture_url ? (
                                                <Image
                                                    src={user.profile_picture_url}
                                                    alt={user.first_name || 'User'}
                                                    width={40}
                                                    height={40}
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
                                                {user.first_name || 'User'} {user.id === currentUser?.id && '(You)'}
                                            </h3>

                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-medium text-amber-500">{user.points?.toLocaleString() || 0}</span>
                                            <span className="ml-1 text-sm text-muted-foreground">pts</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            No users found for the selected ders.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 px-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                        </Button>
                        <div className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="gap-1"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}