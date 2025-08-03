'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { dersService } from '@/lib/services/ders';
import { ustadhService } from '@/lib/services/ustadh';
import { categoryService } from '@/lib/services/category';
import { DersModel } from '@/model/Ders';
import { UstadhModel } from '@/model/Ustadh';
import { CategoryModel } from '@/model/Category';
import { useData } from '@/context/dataContext';




interface DersFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ders?: DersModel | null;
    onSuccess?: () => void;
}

export default function DersFormDialog({ open, onOpenChange, ders, onSuccess }: DersFormDialogProps) {
    const { derses, ustadhs, categories, error, refreshData } = useData();
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const form = useForm<DersModel>({
        defaultValues: {
            title: '',
            description: '',
            thumbnail_url: '',
            book_pdf_url: '',
            is_published: false,
            order: 0,
            ustadh_id: '',
            category_id: '',
        },
    });

    // Reset form when ders changes
    useEffect(() => {
        if (ders) {
            form.reset({
                title: ders.title,
                description: ders.description,
                thumbnail_url: ders.thumbnail_url || '',
                book_pdf_url: ders.book_pdf_url || '',
                is_published: ders.is_published,
                order: ders.order,
                ustadh_id: ders.ustadh_id,
                category_id: ders.category_id,
            });
        } else {
            form.reset(
                {
                    title: '',
                    description: '',
                    thumbnail_url: '',
                    book_pdf_url: '',
                    is_published: false,
                    order: 0,
                    ustadh_id: '',
                    category_id: '',
                }
            );
        }
    }, [ders, open]);

    const validateForm = (data: DersModel) => {
        const errors: Record<string, string> = {};

        // Required field validation
        if (!data.title || data.title.trim().length < 2) {
            errors.title = "Title must be at least 2 characters.";
        }
        if (!data.description || data.description.trim() === '') {
            errors.description = "Description is required.";
        }
        if (!data.ustadh_id) {
            errors.ustadh_id = "Please select an ustadh.";
        }
        if (!data.category_id) {
            errors.category_id = "Please select a category.";
        }

        // Optional URL validation
        const validateUrl = (url: string) => {
            if (url && url.trim() !== "") {
                try {
                    new URL(url);
                } catch {
                    return false;
                }
            }
            return true;
        };

        if (data.thumbnail_url?.trim() === "") {
            errors.thumbnail_url = "Please enter a valid URL or leave it empty.";
        } else if (!validateUrl(data.thumbnail_url?.trim() || '')) {
            errors.thumbnail_url = "Please enter a valid URL or leave it empty.";
        }

        if (data.book_pdf_url?.trim() === "") {
            errors.book_pdf_url = "Please enter a valid URL or leave it empty.";
        } else if (!validateUrl(data.book_pdf_url?.trim() || '')) {
            errors.book_pdf_url = "Please enter a valid URL or leave it empty.";
        }

        if (data.order === 0) {
            errors.order = "Please enter a valid order.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onSubmit = async (data: DersModel) => {
        if (!validateForm(data)) {
            return;
        }
        try {
            setLoading(true);
            const now = new Date();
            const dersData = {
                ...data,
                createdAt: now,
                updatedAt: now
            };
            if (ders) {
                await dersService.update(ders.id, dersData);
                toast.success('Ders updated successfully');
            } else {
                await dersService.create(dersData);
                toast.success('Ders created successfully');
            }

            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error saving ders:', error);
            toast.error(`Failed to ${ders ? 'update' : 'create'} ders`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{ders ? 'Edit Ders' : 'Add New Ders'}</DialogTitle>
                    <DialogDescription>
                        {ders ? 'Update the ders details below.' : 'Fill in the details to create a new ders.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter ders title" {...field} value={field.value || ''} className={formErrors.title ? "border-destructive" : ""} />
                                        </FormControl>
                                        {/* {formErrors.title && (
                                            <p className="text-sm font-medium text-destructive">
                                                {formErrors.title}
                                            </p>
                                        )} */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter ders description"
                                                {...field}
                                                value={field.value || ''}
                                                className={formErrors.description ? "border-destructive" : ""}
                                            />
                                        </FormControl>
                                        {/* {formErrors.description && (
                                            <p className="text-sm font-medium text-destructive">
                                                {formErrors.description}
                                            </p>
                                        )} */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ustadh_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ustadh</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={formErrors.ustadh_id ? "border-destructive" : ""}>
                                                    <SelectValue placeholder="Select an ustadh" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {ustadhs?.map((ustadh: any) => (
                                                    <SelectItem key={ustadh.id} value={ustadh.id}>
                                                        {ustadh.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>

                                        </Select>
                                        {/* {formErrors.ustadh_id && (
                                            <p className="text-sm font-medium text-destructive">
                                                {formErrors.ustadh_id}
                                            </p>
                                        )} */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={formErrors.category_id ? "border-destructive" : ""}>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories?.map((category: any) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {/* {formErrors.category_id && (
                                            <p className="text-sm font-medium text-destructive">
                                                {formErrors.category_id}
                                            </p>
                                        )} */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="thumbnail_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thumbnail URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/thumbnail.jpg" {...field} value={field.value || ''} onChange={field.onChange} className={formErrors.thumbnail_url ? "border-destructive" : ""} />
                                        </FormControl>
                                        {/* {formErrors.thumbnail_url && (
                                            <p className="text-sm font-medium text-destructive">
                                                {formErrors.thumbnail_url}
                                            </p>
                                        )} */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="book_pdf_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Book PDF URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/book.pdf" {...field} value={field.value || ''} onChange={field.onChange} className={formErrors.book_pdf_url ? "border-destructive" : ""} />
                                        </FormControl>
                                        {/* {formErrors.book_pdf_url && (
                                            <p className="text-sm font-medium text-destructive">
                                                {formErrors.book_pdf_url}
                                            </p>
                                        )} */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="order"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Order</FormLabel>
                                        <FormControl>
                                            <Input type="number" min={0} {...field} value={field.value || ''} onChange={field.onChange} className={formErrors.order ? "border-destructive" : ""} />
                                        </FormControl>
                                        {/* {formErrors.order && (
                                            <p className="text-sm font-medium text-destructive">
                                                {formErrors.order}
                                            </p>
                                        )} */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_published"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>Published</FormLabel>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {ders ? 'Update Ders' : 'Create Ders'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}