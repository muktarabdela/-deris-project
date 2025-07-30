"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/context/dataContext';
import { Users, BookOpen, User, BarChart2 } from 'lucide-react';

export default function AdminDashboard() {
    const { users, derses, ustadhs, categories, loading, error, refreshData } = useData();
    const stats = [
        { title: 'Total Users', value: users.length.toString(), icon: Users },
        { title: 'Active Ustadhs', value: ustadhs.length.toString(), icon: User },
        { title: 'Total Ders', value: derses.length.toString(), icon: BookOpen },
        { title: 'Avg. Completion', value: '78%', icon: BarChart2 },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start pb-4 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            New user registered
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            2 hours ago
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <button className="w-full text-left p-3 rounded-md border border-border hover:bg-accent transition-colors">
                                Add New Ustadh
                            </button>
                            <button className="w-full text-left p-3 rounded-md border border-border hover:bg-accent transition-colors">
                                Create New Ders
                            </button>
                            <button className="w-full text-left p-3 rounded-md border border-border hover:bg-accent transition-colors">
                                View All Users
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}