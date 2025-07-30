// src/components/admin/ustadhs/ustadh-form-dialog.tsx
"use client";

import { useState, useEffect } from "react";
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
import { ustadhService } from "@/lib/services/ustadh";
import { UstadhModel } from "@/model/Ustadh";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    bio: z.string().optional(),
    photo_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

interface UstadhFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ustadh?: UstadhModel | null;
    onSuccess: () => void;
}

export function UstadhFormDialog({
    open,
    onOpenChange,
    ustadh,
    onSuccess,
}: UstadhFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            bio: "",
            photo_url: "",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    useEffect(() => {
        if (ustadh) {
            form.reset({
                name: ustadh.name,
                bio: ustadh.bio || "",
                photo_url: ustadh.photo_url || "",
                createdAt: ustadh.createdAt || new Date(),
                updatedAt: ustadh.updatedAt || new Date(),
            });
        } else {
            form.reset({
                name: "",
                bio: "",
                photo_url: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    }, [ustadh, open, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSubmitting(true);

            if (ustadh) {
                // Update existing ustadh
                await ustadhService.update(ustadh.id, values);
                toast.success("Ustadh updated successfully");
            } else {
                // Create new ustadh
                await ustadhService.create(values);
                toast.success("Ustadh created successfully");
            }

            onOpenChange(false);
            onSuccess();
        } catch (error) {
            console.error("Error saving ustadh:", error);
            toast.error("Failed to save ustadh");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{ustadh ? "Edit Ustadh" : "Add New Ustadh"}</DialogTitle>
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
                                        <Input placeholder="Enter ustadh name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter ustadh bio"
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
                            name="photo_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Photo URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter photo URL"
                                            {...field}
                                            value={field.value || ""}
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
                                {ustadh ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}