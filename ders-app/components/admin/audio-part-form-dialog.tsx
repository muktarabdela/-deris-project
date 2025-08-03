// src/components/admin/ustadhs/ustadh-form-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
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

import { AudioPartModel } from "@/model/AudioPart";
import { audioPartService } from "@/lib/services/audio-part";
import { useData } from "@/context/dataContext";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";


interface AudioPartFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    audioPart?: AudioPartModel | null;
    onSuccess: () => void;
}
export function AudioPartFormDialog({
    open,
    onOpenChange,
    audioPart,
    onSuccess,
}: AudioPartFormDialogProps) {
    const { derses } = useData();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const form = useForm<AudioPartModel>({
        defaultValues: {
            title: "",
            is_published: false,
            telegram_message_link: "",
            telegram_file_id: null,
            duration_in_seconds: null,
            order: 0,
            ders_id: undefined,
            quiz_id: null,
        },
    });

    const validateForm = (data: AudioPartModel) => {
        const errors: Record<string, string> = {};

        // Required fields
        if (!data.title || data.title.trim().length < 2) {
            errors.title = "Title must be at least 2 characters";
        }

        if (!data.ders_id) {
            errors.ders_id = "Please select a ders";
        }


        if (!data.duration_in_seconds || isNaN(Number(data.duration_in_seconds)) || Number(data.duration_in_seconds) <= 0) {
            errors.duration_in_seconds = "Please enter a valid duration in seconds";
        }

        if (!data.order || isNaN(Number(data.order)) || Number(data.order) <= 0) {
            errors.order = "Please enter a valid order number";
        }

        // Optional fields with validation
        if (data.telegram_message_link && data.telegram_message_link.trim() !== "") {
            try {
                new URL(data.telegram_message_link);
            } catch {
                errors.telegram_message_link = "Please enter a valid URL or leave empty";
            }
        }

        // Ensure order is a valid number
        if (data.order === null || data.order === undefined || isNaN(Number(data.order)) || Number(data.order) < 0) {
            errors.order = "Please enter a valid order number";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        if (audioPart) {
            form.reset({
                title: audioPart.title,
                is_published: audioPart.is_published,
                telegram_message_link: audioPart.telegram_message_link,
                telegram_file_id: audioPart.telegram_file_id,
                duration_in_seconds: audioPart.duration_in_seconds,
                order: audioPart.order,
                ders_id: audioPart.ders_id,
                quiz_id: audioPart.quiz_id,
            });
        } else {
            form.reset();
        }
    }, [audioPart, form]);

    async function onSubmit(data: AudioPartModel) {
        if (!validateForm(data)) {
            return;
        }
        try {
            setIsSubmitting(true);
            const now = new Date();
            const audioPartData = {
                ...data,
                createdAt: now,
                updatedAt: now
            };
            if (audioPart) {
                await audioPartService.update(audioPart.id, audioPartData);
            } else {
                await audioPartService.create(audioPartData);
            }
            onSuccess();
            toast.success("Audio part saved successfully");
        } catch (error) {
            console.error("Error saving audio part:", error);
            toast.error("Failed to save audio part");
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{audioPart ? 'Edit Audio Part' : 'Add New Audio Part'}</DialogTitle>
                    <DialogDescription>
                        {audioPart ? 'Update the audio part details below.' : 'Fill in the details to create a new audio part.'}
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
                                            <Input placeholder="Enter ders title" {...field} className={formErrors.title ? "border-destructive" : ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="telegram_message_link"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Telegram Message Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter telegram message link" {...field} className={formErrors.telegram_message_link ? "border-destructive" : ""} />
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
                                            <Input
                                                type="text"
                                                placeholder="Enter duration in seconds"
                                                {...field}
                                                value={field.value ?? ''}
                                                className={formErrors.duration_in_seconds ? "border-destructive" : ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="duration_in_seconds"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Duration in Seconds</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter duration in seconds"
                                                {...field}
                                                value={field.value ?? ''}
                                                className={formErrors.duration_in_seconds ? "border-destructive" : ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ders_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ders</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={formErrors.ders_id ? "border-destructive" : ""}>
                                                    <SelectValue placeholder="Select an Ders" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {derses?.map((ders: any) => (
                                                    <SelectItem key={ders.id} value={ders.id}>
                                                        {ders.title}
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
                                name="order"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Display Order</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                {...field}
                                                value={field.value || ''}
                                                className={formErrors.order ? "border-destructive" : ""}
                                            />
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
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {audioPart ? 'Update Audio Part' : 'Create Audio Part'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}