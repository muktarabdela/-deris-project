"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreVertical, User, BookOpen, Loader2, Edit, Trash2 } from 'lucide-react';
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
import { toast } from 'sonner';
import { ustadhService } from '@/lib/services/ustadh';
import { format } from 'date-fns';
import { UstadhFormDialog } from '@/components/admin/ustadh-form-dialog';
import { UstadhModel } from '@/model/Ustadh';
import { useData } from '@/context/dataContext';

// Extend the Ustadh type to include dersCount for the UI
interface UstadhWithDersCount extends UstadhModel {
    dersCount: number;
}

export default function UstadhsPage() {
    const { ustadhs, error, refreshData } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUstadh, setEditingUstadh] = useState<UstadhModel | null>(null);



    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this ustadh?')) return;

        try {
            setIsDeleting(id);
            await ustadhService.delete(id);
            refreshData();
            toast.success('Ustadh deleted successfully');
        } catch (error) {
            console.error('Error deleting ustadh:', error);
            toast.error('Failed to delete ustadh');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleEdit = (ustadh: UstadhModel) => {
        setEditingUstadh(ustadh);
        setIsDialogOpen(true);
    };

    const handleAddUstadh = () => {
        setEditingUstadh(null);
        setIsDialogOpen(true);
    };

    const handleSuccess = async () => {
        try {
            setIsLoading(true);
            refreshData();
            setIsDialogOpen(false);
            setEditingUstadh(null);
        } catch (error) {
            console.error('Error refreshing ustadhs:', error);
            toast.error('Failed to refresh ustadhs list');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && ustadhs.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const filteredUstadhs = ustadhs?.filter((ustadh) =>
        ustadh.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleAddUstadh}>
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
                        {filteredUstadhs?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {searchQuery ? 'No matching ustadhs found' : 'No ustadhs found'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUstadhs?.map((ustadh) => (
                                <TableRow key={ustadh.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center space-x-3">
                                            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                                                {ustadh.photo_url ? (
                                                    <Image
                                                        src={ustadh.photo_url}
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
                                        {ustadh.createdAt ? format(new Date(ustadh.createdAt), 'MMM d, yyyy') : 'N/A'}
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
                                                <DropdownMenuItem onClick={() => handleEdit(ustadh)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(ustadh.id)}
                                                    disabled={isDeleting === ustadh.id}
                                                >
                                                    {isDeleting === ustadh.id ? (
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                    )}
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

            <div className="flex items-center justify-between px-2">
                <div className="text-sm text-muted-foreground">
                    Showing <strong>1-{ustadhs.length}</strong> of <strong>{ustadhs.length}</strong> ustadhs
                </div>
            </div>
            <UstadhFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                ustadh={editingUstadh}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
