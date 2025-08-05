"use client";

import { Button } from '@/components/ui/button';
import { User, Settings, LogOut, Flame, Bell, Moon, Sun, Languages, ChevronRight, Crown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getTelegramUser } from '@/lib/utils/telegram';
import { userService } from '@/lib/services/user';
import { useData } from '@/context/dataContext';
import { Loading } from '@/components/loading';


export default function ProfilePage() {
    const { users, refreshData, loading, derses } = useData();
    const tgUser = getTelegramUser();

    const user = users?.find((user) => Number(user.telegram_user_id) === tgUser?.id);

    const router = useRouter();

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!tgUser) {
            router.push('/dashboard');
        }
    }, [tgUser, router]);

    if (loading || !user) {
        return (
            <Loading />
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <p>Not authenticated</p>
            </div>
        );
    }

    const actvieDers = derses?.find((ders) => ders.id === user.current_ders_id);

    const updatePreference = async (key: string, value: any) => {
        if (!user) return;

        const updatedUser = {
            ...user,
            [key]: value
        };

        try {
            const response = await fetch('/api/profiles/' + user.id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                refreshData();
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-card rounded-xl shadow-sm p-6 space-y-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        {user.profile_picture_url ? (
                            <img
                                src={user.profile_picture_url}
                                alt={user.first_name || 'User'}
                                className="h-20 w-20 rounded-full object-cover border-4 border-accent"
                            />
                        ) : (
                            <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center">
                                <User className="h-10 w-10 text-accent-foreground" />
                            </div>
                        )}
                    </div>

                    <div className="text-center space-y-1">
                        <h2 className="text-xl font-semibold">{user.first_name || 'User'}</h2>
                        {user.username && (
                            <p className="text-muted-foreground text-sm">@{user.username}</p>
                        )}

                        {/* Streak Counter */}
                        <div className="flex items-center justify-center gap-2 text-primary">
                            <Crown className="h-4 w-4" />
                            <span className="text-sm font-medium">{user.points} Points</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* current active ders */}
            <div className="bg-card rounded-xl shadow-sm p-6 space-y-4">
                <h3 className="font-medium flex items-center gap-2 flex-col">
                    <div className="flex items-center gap-2">
                        Current Active Ders
                    </div>
                    <span className="text-sm text-muted-foreground flex items-center gap-2">{actvieDers?.title}</span>
                </h3>

                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">if you wnat to change your active ders, please go to the dashboard</p>
                    <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard')}>
                        change ders
                    </Button>
                </div>
            </div>


            {/* Account Information */}
            <div className="bg-card rounded-xl shadow-sm p-6 space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Account Settings
                </h3>

                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                            <Moon className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="dark-mode" className="text-sm">Dark Mode</Label>
                        </div>
                        <Switch
                            id="dark-mode"
                            checked={user.preferences?.dark_mode || false}
                            onCheckedChange={(checked) => updatePreference('dark_mode', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="notifications" className="text-sm">Notifications</Label>
                        </div>
                        <Switch
                            id="notifications"
                            checked={user.preferences?.notifications !== false}
                            onCheckedChange={(checked) => updatePreference('notifications', checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                            <Languages className="h-4 w-4 text-muted-foreground" />
                            <Label htmlFor="language" className="text-sm">Language</Label>
                        </div>
                        <select
                            id="language"
                            value={user.preferences?.language || 'en'}
                            onChange={(e) => updatePreference('language', e.target.value)}
                            className="bg-background border rounded px-2 py-1 text-sm"
                        >
                            <option className='bg-background border rounded px-2 py-1 text-sm' value="en">English</option>
                            <option value="tr">Türkçe</option>
                            <option value="ar">العربية</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* back to dashboard Button */}
            <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="w-full flex items-center gap-2"
            >
                <ChevronRight className="h-4 w-4" />
                Back to Dashboard
            </Button>
        </div>
    );
}
