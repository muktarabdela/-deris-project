import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreVertical, BookOpen, User, Check, X } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';

type Ders = {
    id: string;
    title: string;
    description: string;
    ustadhName: string;
    category: string;
    isPublished: boolean;
    audioPartsCount: number;
    createdAt: string;
};

// Mock data - replace with actual data fetching
const dersList: Ders[] = [
    {
        id: '1',
        title: 'Tafseer of Surah Al-Fatiha',
        description: 'Detailed explanation of the opening chapter of the Quran',
        ustadhName: 'Sheikh Abdullah',
        category: 'Tafseer',
        isPublished: true,
        audioPartsCount: 5,
        createdAt: '2023-03-10',
    },
    {
        id: '2',
        title: 'Fiqh of Prayer',
        description: 'Comprehensive guide to Islamic prayer',
        ustadhName: 'Ustadh Muhammad',
        category: 'Fiqh',
        isPublished: false,
        audioPartsCount: 8,
        createdAt: '2023-04-15',
    },
    // Add more mock ders as needed
];

export default function DersPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold">Ders</h1>
                    <p className="text-muted-foreground">Manage Islamic lessons and lectures</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search ders..."
                            className="pl-8 sm:w-[300px]"
                        />
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Ders
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Ustadh</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Parts</TableHead>
                            <TableHead>Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dersList.map((ders) => (
                            <TableRow key={ders.id}>
                                <TableCell className="font-medium">
                                    <div className="space-y-1">
                                        <div className="font-medium">{ders.title}</div>
                                        <div className="text-sm text-muted-foreground line-clamp-1">
                                            {ders.description}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 mr-1 text-muted-foreground" />
                                        {ders.ustadhName}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">{ders.category}</Badge>
                                </TableCell>
                                <TableCell>
                                    {ders.isPublished ? (
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/30">
                                            <Check className="h-3 w-3 mr-1" />
                                            Published
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-muted-foreground">
                                            <X className="h-3 w-3 mr-1" />
                                            Draft
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
                                        {ders.audioPartsCount} parts
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {new Date(ders.createdAt).toLocaleDateString()}
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
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>
                                                {ders.isPublished ? 'Unpublish' : 'Publish'}
                                            </DropdownMenuItem>
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
                    Showing <strong>1-{dersList.length}</strong> of <strong>{dersList.length}</strong> ders
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
