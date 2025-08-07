// src/components/admin/ustadh-form-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const form = useForm<UstadhModel>({
        defaultValues: {
            name: "",
            bio: "",
            photo_url: "",
        },
    });

    const validateForm = (data: UstadhModel) => {
        console.log(data);
        const errors: Record<string, string> = {};

        if (!data.name || data.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters";
        }
        if (!data.bio || data.bio.trim() === '') {
            errors.bio = "Bio is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        if (ustadh) {
            form.reset({
                name: ustadh.name,
                bio: ustadh.bio || "",
                photo_url: ustadh.photo_url || "",
            });
        } else {
            form.reset({
                name: "",
                bio: "",
                photo_url: "",
            });
        }
        setFormErrors({});
    }, [ustadh, open, form]);

    async function onSubmit(data: UstadhModel) {
        if (!validateForm(data)) {
            return;
        }

        try {
            setIsSubmitting(true);
            if (ustadh) {
                await ustadhService.update(ustadh.id, data);
            } else {
                await ustadhService.create(data);
            }

            onSuccess();
            toast.success(`Ustadh ${ustadh ? 'updated' : 'created'} successfully`);
            onOpenChange(false);
        } catch (error) {
            console.error('Error saving ustadh:', error);
            toast.error(`Failed to ${ustadh ? 'update' : 'create'} ustadh`);
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
                                        <Input
                                            placeholder="Enter ustadh name"
                                            {...field}
                                            className={formErrors.name ? "border-destructive" : ""}
                                        />
                                    </FormControl>
                                    {formErrors.name && (
                                        <p className="text-sm font-medium text-destructive">
                                            {formErrors.name}
                                        </p>
                                    )}
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
                                            className={`min-h-[100px] ${formErrors.bio ? "border-destructive" : ""}`}
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    {formErrors.bio && (
                                        <p className="text-sm font-medium text-destructive">
                                            {formErrors.bio}
                                        </p>
                                    )}
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
                                            className={formErrors.photo_url ? "border-destructive" : ""}
                                        />
                                    </FormControl>
                                    {formErrors.photo_url && (
                                        <p className="text-sm font-medium text-destructive">
                                            {formErrors.photo_url}
                                        </p>
                                    )}
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