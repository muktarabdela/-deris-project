'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, MoreVertical, BookOpen, User, Check, X, Loader2, Trash, Edit } from 'lucide-react';
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
import { useData } from '@/context/dataContext';
import { ShortDersModel } from '@/model/short-ders';
import { shortDersService } from '@/lib/services/short-ders';
import ShortDersFormDialog from '@/components/admin/short-ders-form-dialog';


export default function ShortDersPage() {
    const router = useRouter();

    const { shortDerses, ustadhs, categories, loading, error, refreshData } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDers, setSelectedDers] = useState<ShortDersModel | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleTogglePublish = async (id: string) => {
        try {
            await shortDersService.togglePublish(id);
            toast.success('Ders status updated');
            refreshData();
        } catch (error) {
            console.error('Error updating ders status:', error);
            toast.error('Failed to update ders status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this ders?')) return;

        try {
            await shortDersService.delete(id);
            toast.success('Ders deleted successfully');
            refreshData();
        } catch (error) {
            console.error('Error deleting ders:', error);
            toast.error('Failed to delete ders');
        }
    };

    const handleEdit = (ders: ShortDersModel) => {
        setSelectedDers(ders);
        setIsDialogOpen(true);
    };

    const handleDialogSuccess = () => {
        setIsDialogOpen(false);
        setSelectedDers(null);
        refreshData();
    };

    const filteredShortDerses = shortDerses?.filter((shortDers) =>
        shortDers.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold">Short Ders</h1>
                    <p className="text-muted-foreground">Manage short Islamic lessons and lectures</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search short ders..."
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
                        Add Short Ders
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
                            <TableHead>Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                    <div className="flex justify-center">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredShortDerses?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No short derses found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredShortDerses?.map((shortDers) => (
                                <TableRow key={shortDers.id}>
                                    <TableCell className="font-medium">
                                        <div className="space-y-1">
                                            <div className="font-medium">{shortDers.title}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">
                                                {shortDers.description?.slice(0, 40) + '...'}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{ustadhs.find((ustadh) => ustadh.id === shortDers.ustadh_id)?.name || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{categories.find((category) => category.id === shortDers.category_id)?.name || 'Uncategorized'}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={shortDers.is_published ? 'default' : 'secondary'}>
                                            {shortDers.is_published ? 'Published' : 'Draft'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(shortDers.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(shortDers)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleTogglePublish(shortDers.id)}>
                                                    {shortDers.is_published ? (
                                                        <Check className="mr-2 h-4 w-4" />
                                                    ) : (
                                                        <X className="mr-2 h-4 w-4" />
                                                    )}
                                                    {shortDers.is_published ? 'Unpublish' : 'Publish'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(shortDers.id)}>
                                                    <Trash className="mr-2 h-4 w-4" />
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
            <ShortDersFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                shortDers={selectedDers}
                onSuccess={handleDialogSuccess}
            />
        </div>
    );
}