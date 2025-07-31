"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { categoryService } from "@/lib/services/category";
import { CategoryModel } from "@/model/Category";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

interface CategoryFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: CategoryModel | null;
    onSuccess: () => void;
}

export function CategoryFormDialog({
    open,
    onOpenChange,
    category,
    onSuccess,
}: CategoryFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });


    useEffect(() => {
        if (category) {
            form.reset({
                name: category.name,
                description: category.description || "",
                createdAt: category.createdAt || new Date(),
                updatedAt: category.updatedAt || new Date(),
            });
        } else {
            form.reset({
                name: "",
                description: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    }, [category, open, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);
            if (category) {
                await categoryService.update(category.id, values);
            } else {
                await categoryService.create(values);
            }
            onSuccess();
            toast.success("Category saved successfully");
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error("Failed to save category");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{category ? "Edit Category" : "Add New Category"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter category description"
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {category ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
