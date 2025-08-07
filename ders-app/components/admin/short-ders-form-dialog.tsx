'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
import { shortDersService } from '@/lib/services/short-ders';
import { ShortDersModel } from '@/model/short-ders';
import { CategoryModel } from '@/model/Category';
import { useData } from '@/context/dataContext';

interface ShortDersFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shortDers?: ShortDersModel | null;
    onSuccess?: () => void;
}

export default function ShortDersFormDialog({ open, onOpenChange, shortDers, onSuccess }: ShortDersFormDialogProps) {
    const { shortDerses, ustadhs, categories, error, refreshData } = useData();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const form = useForm<ShortDersModel>({
        defaultValues: {
            title: '',
            description: '',
            telegram_file_id: '',
            is_published: false,
            order: 0,
            ustadh_id: '',
            category_id: '',
        },
    });

    // Reset form when shortDers changes
    useEffect(() => {
        if (shortDers) {
            form.reset({
                title: shortDers.title,
                description: shortDers.description,
                telegram_file_id: shortDers.telegram_file_id,
                is_published: shortDers.is_published,
                order: shortDers.order,
                ustadh_id: shortDers.ustadh_id,
                category_id: shortDers.category_id,
            });
        } else {
            form.reset({
                title: '',
                description: '',
                telegram_file_id: '',
                is_published: false,
                order: 0,
                ustadh_id: '',
                category_id: '',
            });
        }
    }, [shortDers, open]);

    const validateForm = (data: ShortDersModel) => {
        const errors: Record<string, string> = {};

        // Required field validation
        if (!data.title || data.title.trim().length < 2) {
            errors.title = "Title must be at least 2 characters.";
        }
        if (!data.description || data.description.trim() === '') {
            errors.description = "Description is required.";
        }
        if (!data.category_id) {
            errors.category_id = "Please select a category.";
        }



        if (data.telegram_file_id?.trim() === "") {
            errors.telegram_file_id = "Please enter a valid URL or leave it empty.";
        }

        if (data.order === 0) {
            errors.order = "Please enter a valid order.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onSubmit = async (data: ShortDersModel) => {
        if (!validateForm(data)) {
            console.log(formErrors);
            return;
        }
        try {
            setLoading(true);
            if (shortDers) {
                await shortDersService.update(shortDers.id, data);
                toast.success('Short Ders updated successfully');
            } else {
                await shortDersService.create(data);
                toast.success('Short Ders created successfully');
            }

            onOpenChange(false);
            onSuccess?.();
        } catch (error) {
            console.error('Error saving short ders:', error);
            toast.error(`Failed to ${shortDers ? 'update' : 'create'} short ders`);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{shortDers ? 'Edit Short Ders' : 'Add Short Ders'}</DialogTitle>
                    <DialogDescription>
                        {shortDers ? 'Edit the short ders details' : 'Add a new short ders'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter short ders title" {...field} value={field.value || ''} className={formErrors.title ? "border-destructive" : ""} />
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
                                                placeholder="Enter short ders description"
                                                {...field}
                                                value={field.value || ''}
                                                className={formErrors.description ? "border-destructive" : ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="telegram_file_id"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Telegram File ID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter telegram file id" {...field} value={field.value || ''} className={formErrors.telegram_file_id ? "border-destructive" : ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="is_published"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Is Published</FormLabel>
                                        <FormControl>
                                            <Switch checked={field.value}
                                                onCheckedChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="order"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Order</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter order" {...field} value={field.value || ''} className={formErrors.order ? "border-destructive" : ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ustadh_id"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Ustadh</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value || ""}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select ustadh" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ustadhs.map((ustadh) => (
                                                        <SelectItem key={ustadh.id} value={ustadh.id}>
                                                            {ustadh.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="category_id"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.id} value={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
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
                                {shortDers ? 'Update Short Ders' : 'Create Short Ders'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
