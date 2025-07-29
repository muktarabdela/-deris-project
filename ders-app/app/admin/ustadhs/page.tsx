import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreVertical, User, BookOpen } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

type Ustadh = {
    id: string;
    name: string;
    bio: string | null;
    photoUrl: string | null;
    dersCount: number;
    createdAt: string;
};

// Mock data - replace with actual data fetching
const ustadhs: Ustadh[] = [
    {
        id: '1',
        name: 'Sheikh Abdullah',
        bio: 'Expert in Tafseer and Fiqh',
        photoUrl: '/placeholder-user.jpg',
        dersCount: 24,
        createdAt: '2023-01-15',
    },
    {
        id: '2',
        name: 'Ustadh Muhammad',
        bio: 'Specialist in Hadith Studies',
        photoUrl: null,
        dersCount: 15,
        createdAt: '2023-02-20',
    },
    // Add more mock ustadhs as needed
];

export default function UstadhsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold">Ustadhs</h1>
                    <p className="text-muted-foreground">Manage Islamic scholars and teachers</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search ustadhs..."
                            className="pl-8 sm:w-[300px]"
                        />
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Ustadh
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ustadh</TableHead>
                            <TableHead>Bio</TableHead>
                            <TableHead>Ders</TableHead>
                            <TableHead>Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ustadhs.map((ustadh) => (
                            <TableRow key={ustadh.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                                            {ustadh.photoUrl ? (
                                                <Image
                                                    src={ustadh.photoUrl}
                                                    alt={ustadh.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <User className="h-5 w-5 text-muted-foreground m-auto" />
                                            )}
                                        </div>
                                        <span>{ustadh.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                    {ustadh.bio || 'No bio available'}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-sm">
                                        <BookOpen className="mr-1 h-4 w-4 text-muted-foreground" />
                                        {ustadh.dersCount} ders
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {new Date(ustadh.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    Showing <strong>1-{ustadhs.length}</strong> of <strong>{ustadhs.length}</strong> ustadhs
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                        Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
