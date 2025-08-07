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
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const supabase = createClientComponentClient();
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

        if (data.order === 0) {
            errors.order = "Please enter a valid order.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type and size (max 10MB)
        if (file.type !== 'application/pdf') {
            toast.error('Please upload a valid PDF file');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size should be less than 10MB');
            return;
        }

        setSelectedFile(file);
        setUploading(true);
        setUploadProgress(0);

        // Generate a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
            const { data, error } = await supabase.storage
                .from('pdf-storage')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (error) {
                console.error('Error uploading file:', error);
                if (error.message.includes('The resource already exists')) {
                    throw new Error('A file with this name already exists. Please rename your file and try again.');
                }
                throw error;
            }

            // Get the public URL
            const { data: { publicUrl } } = supabase
                .storage
                .from('pdf-storage')
                .getPublicUrl(filePath);

            // Update the form field with the URL
            form.setValue('book_pdf_url', publicUrl);
            toast.success('PDF uploaded successfully!');
        } catch (error: any) {
            console.error('Error uploading file:', error);
            toast.error(error.message || 'Failed to upload PDF');
            setSelectedFile(null);
            form.setValue('book_pdf_url', '');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const onSubmit = async (data: DersModel) => {
        if (!validateForm(data)) {
            return;
        }
        try {
            setLoading(true);
            if (ders) {
                await dersService.update(ders.id, data);
                toast.success('Ders updated successfully');
            } else {
                await dersService.create(data);
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
                                            <Input placeholder="https://example.com/thumbnail.jpg" {...field} value={field.value || ''} className={formErrors.thumbnail_url ? "border-destructive" : ""} />
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
                                        <FormLabel>Book PDF</FormLabel>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <label className="flex flex-col items-center px-4 py-2 bg-white text-blue-600 rounded-lg tracking-wide border border-blue cursor-pointer hover:bg-blue-50 transition-colors">
                                                    <span className="text-sm font-medium">
                                                        {selectedFile ? 'Change PDF File' : 'Choose PDF File'}
                                                    </span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept=".pdf,application/pdf"
                                                        onChange={handleFileUpload}
                                                        disabled={uploading}
                                                    />
                                                </label>
                                                {selectedFile && (
                                                    <span className="text-sm text-gray-600 truncate max-w-xs">
                                                        {selectedFile.name}
                                                    </span>
                                                )}
                                            </div>

                                            {uploading && (
                                                <div className="w-full space-y-1">
                                                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 text-right">
                                                        {uploadProgress}% Uploading...
                                                    </p>
                                                </div>
                                            )}

                                            {field.value && !uploading && (
                                                <div className="flex items-center space-x-2 text-sm text-green-600">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>PDF ready for submission</span>
                                                    <a
                                                        href={field.value}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline ml-2"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        (Preview)
                                                    </a>
                                                </div>
                                            )}
                                        </div>
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
                                            <Input type="number" min={0} {...field} value={field.value || ''} className={formErrors.order ? "border-destructive" : ""} />
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