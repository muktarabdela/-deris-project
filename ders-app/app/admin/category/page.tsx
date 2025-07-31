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
import { format } from 'date-fns';

import { toast } from 'sonner';
import { useData } from '@/context/dataContext';
import { CategoryModel } from '@/model/Category';
import { categoryService } from '@/lib/services/category';
import { CategoryFormDialog } from '@/components/admin/category-form-dialog';

export default function CategoryPage() {
    const { categories, error, refreshData, derses } = useData();
    console.log(categories);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryModel | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            setIsDeleting(id);
            await categoryService.delete(id);
            refreshData();
            toast.success('Category deleted successfully');
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        } finally {
            setIsDeleting(null);
        }
    };
    const handleEdit = (category: CategoryModel) => {
        setEditingCategory(category);
        setIsDialogOpen(true);
    };
    const handleAddCategory = () => {
        setEditingCategory(null);
        setIsDialogOpen(true);
    };
    const handleSuccess = async () => {
        try {
            setIsLoading(true);
            refreshData();
            setIsDialogOpen(false);
            setEditingCategory(null);
        } catch (error) {
            console.error('Error refreshing categories:', error);
            toast.error('Failed to refresh categories list');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && categories?.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const filteredCategories = categories?.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <p className="text-muted-foreground">Manage categories</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search categories..."
                            className="pl-8 sm:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleAddCategory}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Total Derses</TableHead>

                            <TableHead>Added At</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCategories?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    {searchQuery ? 'No matching categories found' : 'No categories found'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCategories?.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="max-w-[200px] truncate">
                                        {category.name}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {category.description}
                                    </TableCell>
                                    <TableCell>{derses?.filter((der) => der.category_id === category.id).length}</TableCell>
                                    <TableCell>
                                        {category.createdAt ? format(new Date(category.createdAt), 'MMM d, yyyy') : 'N/A'}
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
                                                <DropdownMenuItem onClick={() => handleEdit(category)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDelete(category.id)}
                                                    disabled={isDeleting === category.id}
                                                >
                                                    {isDeleting === category.id ? (
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
                    Showing <strong>1-{categories?.length}</strong> of <strong>{categories?.length}</strong> categories
                </div>
            </div>
            <CategoryFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                category={editingCategory}
                onSuccess={handleSuccess}
            />
            {/* <UstadhFormDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        ustadh={editingUstadh}
                        onSuccess={handleSuccess}
                    /> */}
        </div>
    );
}