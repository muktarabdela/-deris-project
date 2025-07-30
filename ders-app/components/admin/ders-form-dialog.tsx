'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    thumbnail_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    book_pdf_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    is_published: z.boolean().default(false),
    order: z.coerce.number().int().min(0, 'Order must be a positive number'),
    ustadh_id: z.string().min(1, 'Ustadh is required'),
    category_id: z.string().min(1, 'Category is required'),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});


interface DersFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ders?: DersModel | null;
    onSuccess?: () => void;
}

export default function DersFormDialog({ open, onOpenChange, ders, onSuccess }: DersFormDialogProps) {
    const { derses, ustadhs, categories, error, refreshData } = useData();
    const [loading, setLoading] = useState(false);

    const form = useForm<DersModel>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            description: '',
            thumbnail_url: '',
            book_pdf_url: '',
            is_published: false,
            order: 0,
            ustadh_id: '',
            category_id: '',
            createdAt: new Date(),
            updatedAt: new Date(),
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
                createdAt: ders.createdAt,
                updatedAt: ders.updatedAt,
            });
        } else {
            form.reset({
                title: '',
                description: '',
                thumbnail_url: '',
                book_pdf_url: '',
                is_published: false,
                order: 0,
                ustadh_id: '',
                category_id: '',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    }, [ders, open]);

    const onSubmit = async (values: DersModel) => {
        console.log("values");
        try {
            setLoading(true);

            if (ders) {
                // Update existing ders
                await dersService.update(ders.id, values);
                toast.success('Ders updated successfully');
            } else {
                // Create new ders
                await dersService.create(values);
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
                                            <Input placeholder="Enter ders title" {...field} />
                                        </FormControl>
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
                                                className="min-h-[100px]"
                                                {...field}
                                            />
                                        </FormControl>
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
                                                <SelectTrigger>
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
                                                <SelectTrigger>
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
                                            <Input placeholder="https://example.com/thumbnail.jpg" {...field} />
                                        </FormControl>
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
                                            <Input placeholder="https://example.com/book.pdf" {...field} />
                                        </FormControl>
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
                                            <Input type="number" min={0} {...field} />
                                        </FormControl>
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