'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreVertical, BookOpen, User, Check, X, Loader2 } from 'lucide-react';
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
import { toast } from 'sonner';
import { dersService } from '@/lib/services/ders';
import DersFormDialog from '@/components/admin/ders-form-dialog';
import { Category, Ders } from '@/src/generated/prisma';
import { ustadhService } from '@/lib/services/ustadh';
import { Ustadh } from '@/src/generated/prisma';
import { categoryService } from '@/lib/services/category';

type DersWithRelations = Ders & {
    ustadh: { name: string };
    category: { name: string };
    audioPartsCount: number;
};

export default function DersPage() {
    const router = useRouter();
    const [loading, setLoading] = useState({
        derses: true,
        ustadhs: true,
        categories: true
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [derses, setDerses] = useState<DersWithRelations[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDers, setSelectedDers] = useState<Ders | null>(null);
    const [ustadhs, setUstadhs] = useState<Ustadh[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const fetchInitialData = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, derses: true }));

            // Fetch all data in parallel
            const [dersData, ustadhData, categoryData] = await Promise.allSettled([
                dersService.getAll(),
                ustadhService.getAll(),
                categoryService.getAll()
            ]);

            // Handle ders data
            if (dersData.status === 'fulfilled') {
                setDerses(dersData.value as DersWithRelations[]);
                // Update total pages if needed
                // setTotalPages(calculateTotalPages(dersData.value.length));
            } else {
                console.error('Error fetching derses:', dersData.reason);
                toast.error('Failed to load derses');
            }

            // Handle ustadh data
            if (ustadhData.status === 'fulfilled') {
                setUstadhs(ustadhData.value);
            } else {
                console.error('Error fetching ustadhs:', ustadhData.reason);
                toast.error('Failed to load ustadhs');
            }

            // Handle category data
            if (categoryData.status === 'fulfilled') {
                setCategories(categoryData.value);
            } else {
                console.error('Error fetching categories:', categoryData.reason);
                toast.error('Failed to load categories');
            }
        } catch (error) {
            console.error('Error in fetchInitialData:', error);
            toast.error('An error occurred while loading data');
        } finally {
            setLoading(prev => ({
                ...prev,
                derses: false,
                ustadhs: false,
                categories: false
            }));
        }
    }, []);

    // Initial data load
    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    // Fetch derses when page or search term changes
    const fetchDerses = useCallback(async () => {
        try {
            setLoading(prev => ({ ...prev, derses: true }));
            const data = await dersService.getAll();
            setDerses(data as DersWithRelations[]);
            // Update total pages if needed
            // setTotalPages(calculateTotalPages(data.length));
        } catch (error) {
            console.error('Error fetching derses:', error);
            toast.error('Failed to load derses');
        } finally {
            setLoading(prev => ({ ...prev, derses: false }));
        }
    }, [page, searchTerm]);

    // Watch for pagination/search changes
    useEffect(() => {
        fetchDerses();
    }, [fetchDerses]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleTogglePublish = async (id: string) => {
        try {
            await dersService.togglePublish(id);
            toast.success('Ders status updated');
            fetchDerses();
        } catch (error) {
            console.error('Error updating ders status:', error);
            toast.error('Failed to update ders status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this ders?')) return;

        try {
            await dersService.delete(id);
            toast.success('Ders deleted successfully');
            fetchDerses();
        } catch (error) {
            console.error('Error deleting ders:', error);
            toast.error('Failed to delete ders');
        }
    };

    const handleEdit = (ders: Ders) => {
        setSelectedDers(ders);
        setIsDialogOpen(true);
    };

    const handleDialogSuccess = () => {
        setIsDialogOpen(false);
        setSelectedDers(null);
        fetchDerses();
    };

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
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <Button onClick={() => {
                        setSelectedDers(null);
                        setIsDialogOpen(true);
                    }}>
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
                        {loading.derses ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <div className="flex justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : derses?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No derses found
                                </TableCell>
                            </TableRow>
                        ) : (
                            derses?.map((ders) => (
                                <TableRow key={ders.id}>
                                    <TableCell className="font-medium">
                                        <div className="space-y-1">
                                            <div className="font-medium">{ders.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                {ders.description}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{ustadhs.find((ustadh) => ustadh.id === ders.ustadh_id)?.name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{categories.find((category) => category.id === ders.category_id)?.name || 'Uncategorized'}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={ders.is_published ? 'default' : 'secondary'}>
                                            {ders.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{ders.audioPartsCount || 0}</TableCell>
                                    <TableCell>{new Date(ders.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                    <span className="sr-only">Actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(ders)}>
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleTogglePublish(ders.id)}>
                                                    {ders.is_published ? 'Unpublish' : 'Publish'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(ders.id)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            <DersFormDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setIsDialogOpen(false);
                        setSelectedDers(null);
                    }
                }}
                ders={selectedDers}
                onSuccess={handleDialogSuccess}
            />
        </div>
    );
}
